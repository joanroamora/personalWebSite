// Metres, seconds, kilograms and radians. Rendering never participates in simulation.
export const GRAVITY = 9.81, MASS = 165, INERTIA = 130, WHEEL_RADIUS = .35;
export const AXLE = .86, REST = .46, SPRING = 9200, DAMPING = 1350;
const clamp = (n:number,a:number,b:number) => Math.max(a,Math.min(b,n));
export const angleDifference = (a:number,b:number) => Math.atan2(Math.sin(a-b),Math.cos(a-b));
export interface RiderInput { x:number; y:number }
export interface Feature { start:number; length:number; height:number; kind:'roller'|'table'|'whoops'|'gap' }
export interface Track { length:number; features:Feature[]; checkpoints:number[] }
export interface Surface { height:number; slope:number; solid:boolean }
export interface Wheel { x:number; y:number; contact:boolean; compression:number; load:number; spin:number }
export interface Ride {
  level:number; track:Track; x:number; y:number; vx:number; vy:number; angle:number; omega:number;
  elapsed:number; phase:'riding'|'crashed'|'finished'|'over'; reason:string; lives:number;
  checkpoint:number; furthest:number; score:number; bonuses:number; landings:number;
  airTime:number; lastLanding:number; grounded:boolean; grace:number; lean:number;
  wheels:[Wheel,Wheel]; events:('land'|'crash'|'checkpoint'|'finish')[];
}

/** Deliberately spaced, bounded obstacles. Long approaches teach before the first gap. */
export function createTrack(level=1):Track {
  const difficulty=clamp(level,1,5), features:Feature[]=[];
  let start=32;
  const pattern:Feature['kind'][]=['roller','table','whoops','roller','gap','table','whoops','gap'];
  for(let i=0;i<6+Math.min(difficulty,4);i++) {
    const kind=pattern[i%pattern.length];
    const length=kind==='whoops'?18:kind==='gap'?11:kind==='table'?13:12;
    const height=(kind==='whoops'?.25:kind==='gap'?1.25:kind==='table'?.9:.65)+.08*(difficulty-1);
    features.push({kind,start,length,height});
    start+=length+23; // There is always room to recover, brake or accelerate again.
  }
  const length=start+20;
  return {length,features,checkpoints:[6,...features.filter((_,i)=>i%2===1).map(f=>f.start-12)]};
}

export function terrainAt(track:Track,x:number):Surface {
  const f=track.features.find(f=>x>=f.start&&x<=f.start+f.length);
  if(!f)return {height:0,slope:0,solid:true};
  const t=(x-f.start)/f.length, h=f.height;
  if(f.kind==='gap') {
    // A rounded launch ramp, a 2.2 m opening and a lower, forgiving landing ramp.
    const local=x-f.start, lip=4.4, landing=6.6;
    if(local>lip&&local<landing)return {height:-7,slope:0,solid:false};
    if(local<=lip)return {height:h*(local/lip)**2,slope:2*h*local/(lip*lip),solid:true};
    const u=(local-landing)/(f.length-landing);
    return {height:h*.72*(1-u)**2,slope:-2*h*.72*(1-u)/(f.length-landing),solid:true};
  }
  if(f.kind==='table') {
    const ramp=.34;
    if(t>=ramp&&t<=1-ramp)return {height:h,slope:0,solid:true};
    const u=(t<ramp?t:1-t)/ramp;
    return {height:h*u*u*(3-2*u),slope:(t<ramp?1:-1)*h*6*u*(1-u)/(ramp*f.length),solid:true};
  }
  const waves=f.kind==='whoops'?3:1;
  return {height:h*Math.sin(Math.PI*t*waves)**2,slope:h*Math.PI*waves/f.length*Math.sin(2*Math.PI*t*waves),solid:true};
}

export function localPoint(run:Ride,x:number,y:number):{x:number;y:number} {
  const c=Math.cos(run.angle),s=Math.sin(run.angle);
  return {x:run.x+x*c-y*s,y:run.y+x*s+y*c};
}
export function createRide(level=1):Ride {
  const run:Ride={
    level,track:createTrack(level),x:6,y:.94,vx:0,vy:0,angle:0,omega:0,
    elapsed:0,phase:'riding',reason:'',lives:3,checkpoint:6,furthest:6,score:0,bonuses:0,landings:0,
    airTime:0,lastLanding:0,grounded:false,grace:1,lean:0,
    wheels:[{x:0,y:0,contact:false,compression:0,load:0,spin:0},{x:0,y:0,contact:false,compression:0,load:0,spin:0}],events:[],
  };
  updateWheels(run);return run;
}

function updateWheels(run:Ride):void {
  for(let i=0;i<2;i++) {
    const mount=localPoint(run,i===0?-AXLE:AXLE,-.12),surface=terrainAt(run.track,mount.x);
    const normalY=1/Math.hypot(1,surface.slope);
    const length=(mount.y-surface.height)*normalY-WHEEL_RADIUS;
    const wheel=run.wheels[i];
    wheel.contact=surface.solid&&length<=REST&&Math.cos(run.angle)>.1;
    wheel.compression=wheel.contact?clamp(REST-length,0,.38):0;
    wheel.x=mount.x;
    wheel.y=wheel.contact?surface.height+WHEEL_RADIUS/normalY:mount.y-REST;
  }
}

function crash(run:Ride,reason:string):void {
  if(run.phase!=='riding')return;
  run.lives--;run.phase=run.lives>0?'crashed':'over';run.reason=reason;
  run.vx=0;run.vy=0;run.omega=0;run.bonuses=Math.max(0,run.bonuses-100);
  run.score=Math.max(0,Math.floor((run.furthest-6)*5)+run.bonuses);run.events.push('crash');
}

/** Explicit recovery cannot add progress or restore attempts. Checkpoints are on flat approaches. */
export function recoverRide(run:Ride):boolean {
  if(run.phase!=='crashed'||run.lives<=0)return false;
  run.x=run.checkpoint;run.y=terrainAt(run.track,run.x).height+.94;
  run.vx=0;run.vy=0;run.angle=0;run.omega=0;run.airTime=0;run.grounded=false;run.grace=1;
  run.phase='riding';run.reason='';updateWheels(run);return true;
}

function substep(run:Ride,dt:number,input:RiderInput):void {
  const throttle=clamp(-input.y,0,1),brake=clamp(input.y,0,1),lean=clamp(input.x,-1,1);
  run.elapsed+=dt;run.grace=Math.max(0,run.grace-dt);run.lean+=(lean-run.lean)*Math.min(1,dt*9);
  updateWheels(run);
  const wasGrounded=run.grounded;
  run.grounded=run.wheels.some(wheel=>wheel.contact);
  let fx=-.42*run.vx*Math.abs(run.vx),fy=-MASS*GRAVITY;
  let torque=-run.omega*(run.grounded?65:14)-run.lean*(run.grounded?300:175);
  let hardImpact=0;
  for(let i=0;i<2;i++) {
    const wheel=run.wheels[i];wheel.load=0;
    if(!wheel.contact)continue;
    const p=localPoint(run,i===0?-AXLE:AXLE,-.12),rx=p.x-run.x,ry=p.y-run.y;
    const ground=terrainAt(run.track,wheel.x),norm=Math.hypot(1,ground.slope);
    const nx=-ground.slope/norm,ny=1/norm,tx=ny,ty=-nx;
    const pvx=run.vx-run.omega*ry,pvy=run.vy+run.omega*rx;
    const normalVelocity=pvx*nx+pvy*ny,tangentVelocity=pvx*tx+pvy*ty;
    hardImpact=Math.max(hardImpact,-normalVelocity);
    const normal=clamp(SPRING*wheel.compression-DAMPING*normalVelocity,0,10000);
    wheel.load=normal;
    const engine=i===0?throttle*1050*Math.max(.08,1-(Math.max(0,tangentVelocity)/17)**2):0;
    const braking=-tangentVelocity*brake*520;
    const rolling=-tangentVelocity*7-(throttle===0?tangentVelocity*6:0);
    // Coulomb grip: neither braking nor the engine can exceed the current tyre load.
    const traction=clamp(engine+braking+rolling,-normal*.92,normal*.92);
    const wx=nx*normal+tx*traction,wy=ny*normal+ty*traction;
    fx+=wx;fy+=wy;
    torque+=rx*wy-ry*wx-(-REST-WHEEL_RADIUS)*traction;
    wheel.spin+=tangentVelocity/WHEEL_RADIUS*dt;
  }
  if(!run.grounded) {
    // Rider weight shifts exchange angular momentum with the bike, with bounded authority.
    torque-=run.omega*32;
    run.airTime+=dt;
    for(const wheel of run.wheels)wheel.spin+=run.vx/WHEEL_RADIUS*dt;
  } else {
    if(!wasGrounded&&run.airTime>.22&&run.x>run.lastLanding+8) {
      if(hardImpact<8&&Math.abs(angleDifference(run.angle,Math.atan(terrainAt(run.track,run.x).slope)))<.5) {
        run.landings++;run.bonuses+=75;run.lastLanding=run.x;run.events.push('land');
      }
    }
    run.airTime=0;
  }
  run.vx+=fx/MASS*dt;run.vy+=fy/MASS*dt;
  run.omega=clamp(run.omega+torque/INERTIA*dt,-4.5,4.5);
  run.x+=run.vx*dt;run.y+=run.vy*dt;run.angle=angleDifference(run.angle+run.omega*dt,0);
  if(run.x<2){run.x=2;run.vx=Math.max(0,run.vx);}
  updateWheels(run);
  if(run.grace===0) {
    if(hardImpact>12)crash(run,'Hard landing. Ease off and match the slope.');
    for(const [x,y,radius] of [[.05,.86,.18],[-.36,.03,.08],[.36,.03,.08]]) {
      const point=localPoint(run,x,y),surface=terrainAt(run.track,point.x);
      if(surface.solid&&point.y-radius<surface.height)crash(run,'Tumbled! Lean to keep the bike aligned.');
    }
    if(run.y<-4)crash(run,'Missed the landing. Build speed on the approach.');
  }
  if(run.phase!=='riding')return;
  run.furthest=Math.max(run.furthest,run.x);
  for(const checkpoint of run.track.checkpoints)if(run.x>=checkpoint&&checkpoint>run.checkpoint&&run.grounded) {
    run.checkpoint=checkpoint;run.events.push('checkpoint');
  }
  run.score=Math.max(0,Math.floor((run.furthest-6)*5)+run.bonuses);
  if(run.x>=run.track.length) {
    run.phase='finished';run.bonuses+=Math.max(0,Math.round(900-run.elapsed*8))+run.lives*100;
    run.score=Math.floor((run.furthest-6)*5)+run.bonuses;run.events.push('finish');
  }
  if(run.events.length>24)run.events.splice(0,run.events.length-24);
}

export function stepRide(run:Ride,dt:number,input:RiderInput):void {
  if(run.phase!=='riding'||!Number.isFinite(dt)||dt<=0)return;
  const elapsed=Math.min(dt,.05),steps=Math.ceil(elapsed*120);
  for(let i=0;i<steps&&run.phase==='riding';i++)substep(run,elapsed/steps,input);
}

export function upcomingFeature(run:Ride):Feature|undefined {
  return run.track.features.find(feature=>feature.start+feature.length>run.x);
}
