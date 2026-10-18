const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export const WORLD=1000, RESCUE_RADIUS=23, RESCUE_SPEED=9, DOCK_RADIUS=34, DOCK_SPEED=11;
export const angleDifference=(a:number,b:number)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export interface Astronaut {id:string;x:number;y:number;vx:number;vy:number;homeX:number;homeY:number;oxygen:number;state:'waiting'|'aboard'|'rescued'|'lost';progress:number}
export interface Debris {x:number;y:number;vx:number;vy:number;angle:number;radius:number;speed:number;size:number}
export interface Rescue {
  level:number;elapsed:number;duration:number;phase:'docked'|'flying'|'docking'|'won'|'lost';
  ship:{x:number;y:number;vx:number;vy:number;angle:number;omega:number;fuel:number;reserve:number;hull:number;invulnerable:number};
  station:{x:number;y:number;angle:number};planet:{x:number;y:number;radius:number;mu:number};
  astronauts:Astronaut[];debris:Debris[];selected:number;capacity:number;goal:number;rescued:number;score:number;
  dockProgress:number;phaseTime:number;launchCooldown:number;camera:{x:number;y:number};notice:string;noticeTime:number;events:('rescue'|'dock'|'hit'|'launch'|'lost')[];
}
export const passengers=(run:Rescue)=>run.astronauts.filter(a=>a.state==='aboard').length;
export const speed=(run:Rescue)=>Math.hypot(run.ship.vx,run.ship.vy);
export function createRescue(level=1):Rescue {
  level=clamp(Math.floor(level),1,8);
  const positions=level===1?[[300,365],[435,445]]:[[300,290],[460,330],[165,570],[415,750],[720,220]];
  const count=level===1?2:Math.min(5,level+2),goal=level===1?2:Math.min(4,level+1);
  const run:Rescue={level,elapsed:0,duration:level===1?Infinity:300,phase:'docked',
    ship:{x:300,y:500,vx:0,vy:0,angle:-Math.PI/2,omega:0,fuel:100,reserve:20,hull:100,invulnerable:0},station:{x:300,y:500,angle:-Math.PI/2},planet:{x:650,y:550,radius:70,mu:12000+Math.min(5,level-1)*4500},
    astronauts:positions.slice(0,count).map(([x,y],i)=>({id:`A${i+1}`,x,y,vx:0,vy:0,homeX:x,homeY:y,oxygen:level===1?Infinity:220+Math.hypot(x-300,y-500)*.16,state:'waiting',progress:0})),
    debris:[],selected:0,capacity:2,goal,rescued:0,score:0,dockProgress:0,phaseTime:0,launchCooldown:0,camera:{x:300,y:500},notice:'TRAINING / Launch with Thrust. Coast, then Brake near beacon A1.',noticeTime:9,events:[]};
  for(let i=0;i<Math.min(8,(level-1)*2);i++){const angle=i*2.4,radius=130+i*12,orbitSpeed=.055+(i%3)*.015;run.debris.push({x:650+Math.cos(angle)*radius,y:550+Math.sin(angle)*radius,vx:0,vy:0,angle,radius,speed:orbitSpeed,size:7+i%3});}
  return run;
}
export function selectedAstronaut(run:Rescue):Astronaut|undefined {return run.astronauts[run.selected];}
export function rescueAction(run:Rescue,action:string):void {
  if(action==='next-beacon') {
    for(let i=1;i<=run.astronauts.length;i++){const index=(run.selected+i)%run.astronauts.length;if(run.astronauts[index].state==='waiting'){run.selected=index;break;}}
  }
  if(action==='context'&&run.phase==='docked'&&run.ship.fuel>=99.9&&run.ship.hull>=99.9)launch(run);
}
function launch(run:Rescue):void {
  run.phase='flying';run.ship.x=run.station.x;run.ship.y=run.station.y-40;run.ship.vx=0;run.ship.vy=-1;
  run.ship.angle=run.station.angle;run.ship.omega=0;run.launchCooldown=3;run.dockProgress=0;run.events.push('launch');run.notice='Approach a beacon below 9 m/s. Hold position to rescue automatically.';run.noticeTime=6;
}
export function dockingAligned(run:Rescue):boolean {
  return Math.hypot(run.ship.x-run.station.x,run.ship.y-run.station.y)<=DOCK_RADIUS&&speed(run)<=DOCK_SPEED&&Math.abs(angleDifference(run.ship.angle,run.station.angle))<.8;
}
export function rescueAligned(run:Rescue,a:Astronaut):boolean {
  return a.state==='waiting'&&passengers(run)<run.capacity&&Math.hypot(run.ship.x-a.x,run.ship.y-a.y)<=RESCUE_RADIUS&&Math.hypot(run.ship.vx-a.vx,run.ship.vy-a.vy)<=RESCUE_SPEED;
}
function damage(run:Rescue,impact:number):void {
  if(run.ship.invulnerable>0)return;
  run.ship.hull=clamp(run.ship.hull-clamp(3+impact*.35,3,25),0,100);run.ship.invulnerable=1.2;run.events.push('hit');run.notice='Impact! Brake earlier and use the navigation guides.';run.noticeTime=3;
}
function consume(run:Rescue,amount:number):number {
  const ship=run.ship,available=ship.fuel+ship.reserve,used=Math.min(available,amount),fromFuel=Math.min(ship.fuel,used);
  ship.fuel-=fromFuel;ship.reserve=Math.max(0,ship.reserve-(used-fromFuel));return amount>0?used/amount:0;
}
function substep(run:Rescue,dt:number,input:{x:number;y:number}):void {
  run.elapsed+=dt;run.noticeTime=Math.max(0,run.noticeTime-dt);run.launchCooldown=Math.max(0,run.launchCooldown-dt);run.ship.invulnerable=Math.max(0,run.ship.invulnerable-dt);
  for(const a of run.astronauts)if(a.state==='waiting') {
    const oldX=a.x,oldY=a.y;
    if(run.level>1){a.x=a.homeX+Math.sin(run.elapsed*.04)*5;a.y=a.homeY+(Math.cos(run.elapsed*.035)-1)*4;}
    a.vx=(a.x-oldX)/dt;a.vy=(a.y-oldY)/dt;
    a.oxygen=Math.max(0,a.oxygen-dt);
    if(a.oxygen===0){a.state='lost';a.progress=0;run.notice=`BEACON ${a.id} LOST / Oxygen depleted. Other beacons remain marked.`;run.noticeTime=7;run.events.push('lost');}
  }
  for(const d of run.debris){const oldX=d.x,oldY=d.y;d.angle+=d.speed*dt;d.x=run.planet.x+Math.cos(d.angle)*d.radius;d.y=run.planet.y+Math.sin(d.angle)*d.radius;d.vx=(d.x-oldX)/dt;d.vy=(d.y-oldY)/dt;}
  const ship=run.ship;
  if(run.phase==='docked') {
    ship.x=run.station.x;ship.y=run.station.y;ship.vx=ship.vy=ship.omega=0;ship.angle=run.station.angle;
    ship.fuel=Math.min(100,ship.fuel+dt*25);ship.reserve=Math.min(20,ship.reserve+dt*8);ship.hull=Math.min(100,ship.hull+dt*25);
    if(input.y<-.1&&ship.fuel>=99.9&&ship.hull>=99.9)launch(run);
  } else if(run.phase==='docking') {
    run.phaseTime+=dt;ship.vx=ship.vy=0;ship.x+=(run.station.x-ship.x)*dt*4;ship.y+=(run.station.y-ship.y)*dt*4;
    ship.angle+=angleDifference(run.station.angle,ship.angle)*dt*4;
    if(run.phaseTime>=2){
      const delivered=passengers(run);for(const a of run.astronauts)if(a.state==='aboard')a.state='rescued';run.rescued+=delivered;
      run.score+=delivered*700+Math.round(ship.hull+ship.fuel);run.events.push('dock');run.phase='docked';run.dockProgress=0;
      run.notice='Docked. Passengers delivered. Fuel, hull and emergency reserve are replenishing.';run.noticeTime=6;
      if(run.rescued>=run.goal){run.phase='won';run.score+=Math.max(0,Math.floor(900-run.elapsed*3));}
    }
  } else if(run.phase==='flying') {
    const turn=clamp(input.x,-1,1),thrust=clamp(-input.y,0,1),brake=clamp(input.y,0,1),emergency=ship.fuel<=0;
    ship.omega=clamp((ship.omega+turn*3.4*dt)*Math.exp(-dt*(Math.abs(turn)>.1?1.5:4)),-1.8,1.8);ship.angle=angleDifference(ship.angle+ship.omega*dt,0);
    const dx=run.planet.x-ship.x,dy=run.planet.y-ship.y,distance=Math.max(1,Math.hypot(dx,dy)),gravity=Math.min(4,run.planet.mu/(distance*distance));
    ship.vx+=dx/distance*gravity*dt;ship.vy+=dy/distance*gravity*dt;
    if(thrust>0){const fraction=consume(run,thrust*dt*(emergency?1.4:2.2));ship.vx+=Math.cos(ship.angle)*(emergency?13:22)*thrust*fraction*dt;ship.vy+=Math.sin(ship.angle)*(emergency?13:22)*thrust*fraction*dt;}
    if(brake>0){const fraction=consume(run,brake*dt*(emergency?1.1:1.8)),velocity=speed(run),reduction=Math.min(velocity,(emergency?20:30)*brake*fraction*dt);if(velocity>0){ship.vx*=1-reduction/velocity;ship.vy*=1-reduction/velocity;}}
    const velocity=speed(run);if(velocity>120){ship.vx*=120/velocity;ship.vy*=120/velocity;}
    ship.x+=ship.vx*dt;ship.y+=ship.vy*dt;
    const bx=ship.x-run.planet.x,by=ship.y-run.planet.y,bodyDistance=Math.max(.001,Math.hypot(bx,by)),radius=run.planet.radius+9;
    if(bodyDistance<radius){const nx=bx/bodyDistance||1,ny=by/bodyDistance,normal=ship.vx*nx+ship.vy*ny;ship.x=run.planet.x+nx*radius;ship.y=run.planet.y+ny*radius;if(normal<0){damage(run,-normal);ship.vx-=1.45*normal*nx;ship.vy-=1.45*normal*ny;}}
    for(const d of run.debris){const dx=ship.x-d.x,dy=ship.y-d.y,distance=Math.max(.001,Math.hypot(dx,dy));if(distance<d.size+9){const nx=dx/distance,ny=dy/distance,relative=(ship.vx-d.vx)*nx+(ship.vy-d.vy)*ny;ship.x=d.x+nx*(d.size+10);ship.y=d.y+ny*(d.size+10);if(relative<0){damage(run,-relative);ship.vx-=relative*1.3*nx;ship.vy-=relative*1.3*ny;}}}
    if(ship.x<10||ship.x>WORLD-10){ship.x=clamp(ship.x,10,WORLD-10);ship.vx*=-.35;run.notice='Mission boundary. Turn back toward the station.';run.noticeTime=3;}
    if(ship.y<10||ship.y>WORLD-10){ship.y=clamp(ship.y,10,WORLD-10);ship.vy*=-.35;run.notice='Mission boundary. Turn back toward the beacons.';run.noticeTime=3;}
    for(const a of run.astronauts) {
      if(rescueAligned(run,a)){a.progress+=dt;if(a.progress>=1.4){a.state='aboard';a.progress=0;run.events.push('rescue');run.notice=`${a.id} aboard. ${passengers(run)===run.capacity?'Cabin full. Return to Station.':'Another passenger seat remains.'}`;run.noticeTime=5;}}
      else a.progress=Math.max(0,a.progress-dt*2);
    }
    const stationDistance=Math.hypot(ship.x-run.station.x,ship.y-run.station.y);
    if(run.launchCooldown===0&&dockingAligned(run)){run.dockProgress+=dt;if(run.dockProgress>=1.2){run.phase='docking';run.phaseTime=0;ship.omega=0;run.notice='Docking assist engaged. Hold while the station captures your ship.';run.noticeTime=4;}}
    else run.dockProgress=Math.max(0,run.dockProgress-dt*2);
    if(run.launchCooldown===0&&stationDistance<22&&speed(run)>18){const nx=(ship.x-run.station.x)/(stationDistance||1),ny=(ship.y-run.station.y)/(stationDistance||1),normal=ship.vx*nx+ship.vy*ny;if(normal<0){damage(run,-normal);ship.x=run.station.x+nx*26;ship.y=run.station.y+ny*26;ship.vx-=normal*1.4*nx;ship.vy-=normal*1.4*ny;run.launchCooldown=1;}}
  }
  run.camera.x+=(clamp(ship.x,180,WORLD-180)-run.camera.x)*Math.min(1,dt*5);run.camera.y+=(clamp(ship.y,240,WORLD-240)-run.camera.y)*Math.min(1,dt*5);
  const possible=run.rescued+run.astronauts.filter(a=>a.state==='waiting'||a.state==='aboard').length;
  if(ship.hull<=0){run.phase='lost';run.notice='Rescue ship lost. Brake earlier and approach the station slowly.';}
  else if(possible<run.goal){run.phase='lost';run.notice='Too few surviving astronauts remain to complete the objective.';}
  else if(run.elapsed>=run.duration&&run.phase!=='won'){run.phase='lost';run.notice='Mission window closed. Deliver passengers sooner on the next flight.';}
  if(run.events.length>20)run.events.splice(0,run.events.length-20);
}
export function stepRescue(run:Rescue,dt:number,input:{x:number;y:number}):void {
  if(['won','lost'].includes(run.phase)||!Number.isFinite(dt)||dt<=0)return;
  const elapsed=Math.min(dt,.05),steps=Math.ceil(elapsed*120);
  for(let i=0;i<steps&&!['won','lost'].includes(run.phase);i++)substep(run,elapsed/steps,input);
}
