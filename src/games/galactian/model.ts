export const W=360,H=480;
export type Flight='takeoff'|'flight'|'landing'|'service'|'docked'|'over';
export interface Base { id:number; x:number; worldY:number; used:boolean }
export interface Enemy { id:number; kind:'fighter'|'scout'|'orc'|'turret'|'crawler'; x:number; y:number; origin:number; hp:number; age:number; fire:number; pattern:number }
export interface Projectile { x:number; y:number; vx:number; vy:number; friendly:boolean }
export interface Blast { x:number; y:number; time:number; hit:boolean }
export interface Spark { x:number; y:number; time:number; size:number }
export interface PilotInput { x:number; y:number; fire:boolean; slow:boolean }
export interface FlightRun {
  phase:Flight; player:{x:number;y:number}; distance:number; speed:number; fuel:number; integrity:number; bombs:number;
  score:number; elapsed:number; emergency:number; invulnerable:number; phaseTime:number; waveTime:number; wave:number; shotTime:number;
  bases:Base[]; base:Base|null; enemies:Enemy[]; shots:Projectile[]; blasts:Blast[]; sparks:Spark[];
  reason:string; seed:number; nextId:number; events:('shot'|'bomb'|'hit'|'kill'|'land'|'service')[];
}
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
function random(run:FlightRun):number {run.seed=(Math.imul(run.seed,1664525)+1013904223)>>>0;return run.seed/4294967296;}
export function createFlight(seed=Math.floor(Math.random()*0xffffffff)):FlightRun {
  const first={id:0,x:180,worldY:150,used:true};
  return {phase:'takeoff',player:{x:180,y:330},distance:0,speed:0,fuel:100,integrity:100,bombs:5,score:0,elapsed:0,emergency:9,invulnerable:3,phaseTime:0,waveTime:4,wave:0,shotTime:0,bases:[first,{id:1,x:100,worldY:1450,used:false},{id:2,x:260,worldY:2750,used:false}],base:first,enemies:[],shots:[],blasts:[],sparks:[],reason:'',seed,nextId:1,events:[]};
}
export function baseY(run:FlightRun,base:Base):number {return H-base.worldY+run.distance;}
export function nearestBase(run:FlightRun):Base {
  const position=run.distance+H-run.player.y;
  return run.bases.filter(base=>!base.used&&baseY(run,base)<H+45).sort((a,b)=>Math.abs(a.worldY-position)-Math.abs(b.worldY-position))[0]??run.bases[run.bases.length-1];
}
export function landingBase(run:FlightRun):Base|undefined {
  return run.bases.find(base=>!base.used&&Math.abs(base.x-run.player.x)<38&&Math.abs(baseY(run,base)-run.player.y)<38);
}
export function canLand(run:FlightRun):boolean {return run.phase==='flight'&&run.speed<19&&!!landingBase(run);}
export function flightAction(run:FlightRun,action:'bomb'|'context'):boolean {
  if(action==='context'){
    if(run.phase==='docked'){run.phase='takeoff';run.phaseTime=0;run.invulnerable=3;run.events.push('land');return true;}
    if(canLand(run)){run.base=landingBase(run)!;run.phase='landing';run.phaseTime=0;run.shots=[];run.events.push('land');return true;}
    return false;
  }
  if(run.phase!=='flight'||run.bombs<=0)return false;
  run.bombs--;run.blasts.push({x:run.player.x,y:run.player.y-105,time:0,hit:false});run.events.push('bomb');return true;
}
function damage(run:FlightRun,amount:number):void {
  if(run.invulnerable>0||run.phase!=='flight')return;
  run.integrity=Math.max(0,run.integrity-amount);run.invulnerable=1.6;run.events.push('hit');
  if(run.integrity<=0){run.phase='over';run.reason='Your ship was lost over enemy territory. Use evasive routes and repair at an allied base.';}
}
function explode(run:FlightRun,enemy:Enemy):void {
  run.score+=enemy.kind==='orc'?45:enemy.kind==='turret'?150:enemy.kind==='crawler'?220:100;
  run.sparks.push({x:enemy.x,y:enemy.y,time:0,size:enemy.kind==='orc'?12:26});run.events.push('kill');
}
function spawnWave(run:FlightRun):void {
  run.wave++;const level=Math.min(7,Math.floor(run.distance/1300));
  const aerial=run.wave%3!==0,kind:Enemy['kind']=aerial?(run.wave%2?'fighter':'scout'):(run.wave%2?'orc':'turret');
  const count=run.wave<3?2:Math.min(4,2+Math.floor(level/2));
  // An entire corridor remains empty; formations never make a wall across the playfield.
  const safe=Math.floor(random(run)*3),lanes=[50,140,230,310].filter(x=>Math.abs(x-(safe*110+65))>42);
  for(let i=0;i<count;i++){
    const x=lanes[i%lanes.length];
    run.enemies.push({id:run.nextId++,kind,x,y:-35-i*42,origin:x,hp:kind==='turret'?3:kind==='orc'?1:2,age:0,fire:run.wave<3?3.5:1.8+random(run),pattern:run.wave%3});
  }
  if(level>0&&run.wave%4===0)run.enemies.push({id:run.nextId++,kind:'crawler',x:50+random(run)*260,y:-80,origin:0,hp:4,age:0,fire:2,pattern:0});
  run.enemies=run.enemies.slice(-22);
}
export function stepFlight(run:FlightRun,dt:number,input:PilotInput):void {
  if(run.phase==='over')return;
  run.elapsed+=dt;run.invulnerable=Math.max(0,run.invulnerable-dt);
  run.sparks=run.sparks.filter(spark=>(spark.time+=dt)<.55);
  if(run.phase!=='flight'){
    run.phaseTime+=dt;
    if(run.phase==='takeoff'){
      if(run.phaseTime>=1.15){run.phase='flight';run.phaseTime=0;run.base=null;}
    }else if(run.phase==='landing'){
      const base=run.base!;run.player.x+=(base.x-run.player.x)*Math.min(1,dt*5);run.player.y+=(baseY(run,base)-run.player.y)*Math.min(1,dt*5);
      if(run.phaseTime>=1.4){run.phase='service';run.phaseTime=0;run.events.push('service');}
    }else if(run.phase==='service'){
      run.fuel=Math.min(100,run.fuel+dt*40);run.integrity=Math.min(100,run.integrity+dt*40);
      if(run.phaseTime>=2.7){run.fuel=100;run.integrity=100;run.bombs=5;run.emergency=9;run.phase='docked';run.base!.used=true;run.score+=300;run.enemies=run.enemies.filter(enemy=>enemy.y<0);run.shots=[];}
    }
    run.speed=0;return;
  }
  run.speed+=( (input.slow?12:44)-run.speed)*Math.min(1,dt*6);
  const scroll=run.speed*dt;run.distance+=scroll;
  const length=Math.max(1,Math.hypot(input.x,input.y));
  run.player.x=clamp(run.player.x+input.x/length*185*dt,18,W-18);
  run.player.y=clamp(run.player.y+input.y/length*185*dt,38,H-30);
  run.fuel=Math.max(0,run.fuel-dt*(input.slow?.95:1.8));
  if(run.fuel===0){run.emergency-=dt;if(run.emergency<=0){run.phase='over';run.reason='Emergency fuel exhausted. Slow down and use Land inside the next allied landing zone.';return;}}
  const next=run.bases[run.bases.length-1];
  if(next.worldY-run.distance<2000)run.bases.push({id:next.id+1,x:next.id%2?260:100,worldY:next.worldY+1300,used:false});
  run.bases=run.bases.filter(base=>baseY(run,base)<H+180).slice(-5);
  run.shotTime-=dt;
  if(input.fire&&run.shotTime<=0){run.shotTime=.16;run.shots.push({x:run.player.x-6,y:run.player.y-15,vx:0,vy:-335,friendly:true},{x:run.player.x+6,y:run.player.y-15,vx:0,vy:-335,friendly:true});run.events.push('shot');}
  run.waveTime-=dt;
  if(run.waveTime<=0){spawnWave(run);run.waveTime=Math.max(1.8,4.7-Math.floor(run.distance/1300)*.4);}
  for(const enemy of run.enemies){
    enemy.age+=dt;enemy.y+=scroll;
    const air=enemy.kind==='fighter'||enemy.kind==='scout';
    if(air){enemy.y+=dt*(enemy.kind==='scout'?38:26);enemy.x=clamp(enemy.origin+Math.sin(enemy.age*(enemy.pattern+1))*(enemy.pattern===0?10:32),18,W-18);}
    else if(enemy.kind==='crawler')enemy.x+=Math.sin(enemy.age*.7)*dt*12;
    enemy.fire-=dt;
    if(enemy.fire<=0&&enemy.y>20&&enemy.y<run.player.y-65&&enemy.kind!=='orc'&&run.shots.length<90){
      const angle=Math.atan2(run.player.y-enemy.y,run.player.x-enemy.x),speed=enemy.kind==='turret'?100:82;
      run.shots.push({x:enemy.x,y:enemy.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,friendly:false});enemy.fire=2.1+random(run)*1.1;
    }
    if(air&&Math.hypot(enemy.x-run.player.x,enemy.y-run.player.y)<23)damage(run,22);
  }
  for(const shot of run.shots){
    shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;
    if(shot.friendly){
      const target=run.enemies.find(enemy=>(enemy.kind==='fighter'||enemy.kind==='scout')&&enemy.hp>0&&Math.abs(enemy.x-shot.x)<15&&Math.abs(enemy.y-shot.y)<18);
      if(target){shot.y=-100;target.hp--;if(target.hp<=0)explode(run,target);}
    }else if(Math.hypot(shot.x-run.player.x,shot.y-run.player.y)<12){shot.y=H+100;damage(run,18);}
  }
  for(const blast of run.blasts){
    blast.time+=dt;blast.y+=scroll;
    if(blast.time>=.5&&!blast.hit){
      blast.hit=true;
      for(const enemy of run.enemies){if(enemy.hp>0&&enemy.kind!=='fighter'&&enemy.kind!=='scout'&&Math.hypot(enemy.x-blast.x,enemy.y-blast.y)<58){enemy.hp=0;explode(run,enemy);}}
    }
  }
  run.enemies=run.enemies.filter(enemy=>enemy.hp>0&&enemy.y<H+70);
  run.shots=run.shots.filter(shot=>shot.y>-40&&shot.y<H+30&&shot.x>-20&&shot.x<W+20).slice(-100);
  run.blasts=run.blasts.filter(blast=>blast.time<.95);run.sparks=run.sparks.slice(-30);
}
