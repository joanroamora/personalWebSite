export const VIEW=360,FIELD_HEIGHT=480,SLOTS=16,SLOT_STEP=88,WORLD=1580;
export const slotX=(index:number)=>100+index*SLOT_STEP;
export const COLORS=[{name:'blue',paint:'#72b5cf',symbol:'◆'},{name:'amber',paint:'#e8b46e',symbol:'▲'},{name:'green',paint:'#8ac7a0',symbol:'●'},{name:'violet',paint:'#b6a4d4',symbol:'■'}] as const;
export interface Cargo { id:string; color:number; x:number; y:number; home:number; slot:number|null; delivered:boolean }
export interface Order { cargo:string; slot:number }
export interface CraneRun {
  phase:'working'|'departing'|'over'; x:number; y:number; vx:number; swing:number; swingVelocity:number; held:string|null;
  cargo:Cargo[]; slots:(string|null)[]; order:Order|null; quota:number; operation:number; completed:number; timer:number; elapsed:number; score:number; mistakes:number; streak:number; bestStreak:number; orderStarted:number; seed:number;
  camera:number; cameraTarget:number; manualCamera:boolean; notice:string; noticeTime:number; settling:{id:string;slot:number;time:number;fromX:number;fromY:number}|null;
  departure:number; success:boolean; events:('grab'|'drop'|'success'|'error'|'dispatch')[];
}
export const bound=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function createCrane(operation=1,seed=Math.floor(Math.random()*0xffffffff)):CraneRun {
  const cargo=Array.from({length:Math.min(12,4+operation*2)},(_,index)=>({id:`C-${12+index}`,color:index%4,x:slotX(index),y:195,home:slotX(index),slot:null,delivered:false}));
  const run:CraneRun={phase:'working',x:100,y:105,vx:0,swing:0,swingVelocity:0,held:null,cargo,slots:Array(SLOTS).fill(null),order:null,quota:Math.min(8,2+operation),operation,completed:0,timer:180+Math.min(5,operation-1)*20,elapsed:0,score:0,mistakes:0,streak:0,bestStreak:0,orderStarted:0,seed,camera:0,cameraTarget:0,manualCamera:false,notice:'1 / Lower the hook to the highlighted container roof, then Pick Up.',noticeTime:7,settling:null,departure:0,success:false,events:[]};
  run.order={cargo:cargo[0].id,slot:1};return run;
}
export const currentOrder=(run:CraneRun)=>run.order;
/** Generate only from actual movable cargo and genuinely empty wagon positions. */
export function generateOrder(run:CraneRun):Order|null {
  const available=run.cargo.filter(cargo=>!cargo.delivered);
  const reach=Math.min(SLOTS,5+run.operation*3);
  const free=run.slots.map((cargo,index)=>cargo===null&&index<reach?index:-1).filter(index=>index>=0);
  if(!available.length||!free.length)return null;
  const random=()=>{run.seed=(Math.imul(run.seed,1664525)+1013904223)>>>0;return run.seed/4294967296;};
  const cargo=available[Math.floor(random()*available.length)];
  return {cargo:cargo.id,slot:free[Math.floor(random()*free.length)]};
}
export const carriedCargo=(run:CraneRun)=>run.cargo.find(cargo=>cargo.id===run.held);
export function gripTarget(run:CraneRun):Cargo|undefined {
  return run.cargo.find(cargo=>!cargo.delivered&&Math.abs(cargo.x-run.x)<Math.max(17,24-run.operation)&&Math.abs(cargo.y-15-run.y)<19);
}
export function targetSlot(run:CraneRun,cargo=carriedCargo(run)) :number {
  if(!cargo)return -1;
  const index=Math.round((cargo.x-100)/SLOT_STEP);
  return index>=0&&index<SLOTS&&Math.abs(cargo.x-slotX(index))<Math.max(18,31-run.operation*2)&&Math.abs(cargo.y-364)<23 ? index:-1;
}
export function craneAction(run:CraneRun,action:'grip'|'view-left'|'view-right'):boolean {
  if(run.phase!=='working'||run.settling)return false;
  if(action!=='grip'){
    run.manualCamera=true;run.cameraTarget=bound(run.cameraTarget+(action==='view-left'?-280:280),0,WORLD-VIEW);return true;
  }
  if(!run.held){
    const cargo=gripTarget(run);
    if(!cargo){run.notice='Align the hook with a container roof, then Pick Up.';run.noticeTime=2;return false;}
    if(cargo.slot!==null)run.slots[cargo.slot]=null;
    cargo.slot=null;run.held=cargo.id;run.swing=0;run.swingVelocity=0;run.events.push('grab');run.notice=`2 / ${cargo.id} secured. Raise the hook, then travel to the highlighted slot.`;run.noticeTime=5;return true;
  }
  const cargo=carriedCargo(run)!;const slot=targetSlot(run,cargo);
  if(slot>=0){
    if(run.slots[slot]){run.notice='Slot occupied. Pick an empty slot or move the other container first.';run.noticeTime=3;return false;}
    if(Math.abs(run.vx)>65){run.notice='Ease off horizontal movement to steady the load.';run.noticeTime=2;return false;}
    run.settling={id:cargo.id,slot,time:0,fromX:cargo.x,fromY:cargo.y};run.held=null;run.events.push('drop');return true;
  }
  // Ground release returns the load to its own free staging pad, never destroys an order.
  if(cargo.y<230&&Math.abs(cargo.x-cargo.home)<30){cargo.x=cargo.home;cargo.y=195;run.held=null;run.events.push('drop');run.notice='Container returned to its staging pad.';run.noticeTime=2;return true;}
  // A free drop is recoverable: return the container to its own staging pad.
  cargo.x=cargo.home;cargo.y=195;run.held=null;run.mistakes++;run.streak=0;run.timer=Math.max(0,run.timer-6);run.score=Math.max(0,run.score-50);run.events.push('error');
  run.notice='Dropped load: −6 seconds. Container recovered to its labelled staging pad.';run.noticeTime=5;return true;
}
function settle(run:CraneRun,dt:number):void {
  const placement=run.settling!;const cargo=run.cargo.find(cargo=>cargo.id===placement.id)!;
  placement.time+=dt;const p=bound(placement.time/.35,0,1),ease=1-(1-p)**3;
  cargo.x=placement.fromX+(slotX(placement.slot)-placement.fromX)*ease;cargo.y=placement.fromY+(364-placement.fromY)*ease;
  if(p<1)return;
  cargo.slot=placement.slot;run.slots[placement.slot]=cargo.id;run.settling=null;
  const order=currentOrder(run)!;
  if(order.cargo===cargo.id&&order.slot===placement.slot){
    cargo.delivered=true;run.completed++;run.streak++;run.bestStreak=Math.max(run.bestStreak,run.streak);
    run.score+=500+Math.max(0,150-Math.floor((run.elapsed-run.orderStarted)*3))+Math.min(5,run.streak)*40;run.timer=Math.min(300,run.timer+12);run.events.push('success');run.notice=`Correct load. Streak ×${run.streak}. +12 seconds. Next order received.`;run.noticeTime=4;
    run.orderStarted=run.elapsed;
    if(run.completed===run.quota){run.phase='departing';run.order=null;run.departure=0;run.success=true;run.events.push('dispatch');run.notice='All orders complete. Train cleared for departure!';}
    else run.order=generateOrder(run);
  }else{
    run.mistakes++;run.streak=0;run.timer=Math.max(0,run.timer-8);run.score=Math.max(0,run.score-75);run.events.push('error');run.notice='Wrong placement: −8 seconds. Pick up that container again to correct it.';run.noticeTime=5;
  }
}
export function stepCrane(run:CraneRun,dt:number,input:{x:number;y:number}):void {
  if(run.phase==='over')return;
  run.elapsed+=dt;run.noticeTime=Math.max(0,run.noticeTime-dt);
  if(run.phase==='departing'){run.departure+=dt;if(run.departure>=3){if(run.success)run.score+=Math.floor(run.timer)*5;run.phase='over';}return;}
  run.timer=Math.max(0,run.timer-dt);
  if(run.timer<=0){run.phase='departing';run.success=false;run.departure=0;run.events.push('dispatch');run.notice='Departure deadline reached. Train leaving the yard.';return;}
  if(run.settling){settle(run,dt);return;}
  const target=input.x*165,previous=run.vx;
  run.vx+=(target-run.vx)*Math.min(1,dt*8);
  const nextX=bound(run.x+run.vx*dt,32,WORLD-32);
  const nextY=bound(run.y+input.y*95*dt,91,349);
  const carrying=carriedCargo(run);
  // Travelling at roof level is blocked gently; there is no unexplained loss of cargo.
  // The staging lane and wagons are at different depths. Only horizontal travel
  // through staging cargo is blocked; lowering into the parallel rail lane stays possible.
  const blocked=carrying&&Math.abs(input.x)>.05&&run.cargo.some(cargo=>cargo.id!==carrying.id&&Math.abs(cargo.x-nextX)<52&&Math.abs(cargo.y-(nextY+15))<29);
  if(blocked){run.vx=0;run.y=nextY;run.notice='Raise the load above the other containers to travel.';run.noticeTime=1.2;}
  else{run.x=nextX;run.y=nextY;}
  const acceleration=(run.vx-previous)/dt;
  run.swingVelocity+=(-run.swing*14-run.swingVelocity*4-acceleration*.0014)*dt;run.swing=bound(run.swing+run.swingVelocity*dt,-.45,.45);
  if(carrying){carrying.x=run.x+Math.sin(run.swing)*20;carrying.y=run.y+15;}
  if(Math.abs(input.x)>.05){run.manualCamera=false;run.cameraTarget=bound(run.x-VIEW/2,0,WORLD-VIEW);}
  run.camera+=(run.cameraTarget-run.camera)*Math.min(1,dt*7);
}
