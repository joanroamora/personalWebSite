const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export const OPS_STEP=.25, REQUEST_TIMEOUT=5, QUEUE_LIMIT=450;
export type ReleaseKind='stable'|'heavy'|'errors'|'performance';
export interface Release {id:string;kind:ReleaseKind}
export interface Server {id:number;state:'healthy'|'booting'|'down'|'leaking'|'repairing'|'restarting';remaining:number;capacity:number}
export interface Ops {
  level:number;seed:number;elapsed:number;duration:number;accumulator:number;phase:'playing'|'won'|'lost';
  selected:number;servers:Server[];nextServer:number;budget:number;errorBudget:number;emergency:number;
  traffic:number;capacity:number;database:number;dbBase:number;dbBoost:number;dbCooldown:number;dbSlow:boolean;
  queue:{amount:number;age:number}[];queued:number;latency:number;failRate:number;
  recent:{time:number;arrived:number;served:number;failed:number;latency:number}[];
  served:number;failed:number;arrived:number;score:number;deployments:number;rollbacks:number;
  releases:Release[];candidate:number;availableAt:number;tested:boolean;testRemaining:number;testSignal:string;
  rollout:'idle'|'starting-canary'|'canary'|'promoting'|'production'|'rollback';rolloutTime:number;canaryTime:number;
  live:ReleaseKind;stable:ReleaseKind;promotionPending:boolean;notice:string;incidents:{kind:string;at:number;duration:number;started:boolean;resolved:boolean}[];
}
export function createOps(level=1,seed=917):Ops {
  level=clamp(Math.floor(level),1,8);let rng=seed>>>0;
  const kinds:ReleaseKind[]=['stable','heavy','errors','performance'];
  const releases=Array.from({length:12},(_,i)=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return {id:`v1.${i+1}`,kind:i===0?'performance':i===2?'errors':kinds[rng%4]};});
  return {level,seed,elapsed:0,duration:195,accumulator:0,phase:'playing',selected:1,
    servers:[{id:1,state:'healthy',remaining:0,capacity:70},{id:2,state:'healthy',remaining:0,capacity:70}],nextServer:3,
    budget:120,errorBudget:100,emergency:0,traffic:90,capacity:140,database:185,dbBase:185,dbBoost:0,dbCooldown:0,dbSlow:false,
    queue:[],queued:0,latency:.1,failRate:0,recent:[],served:0,failed:0,arrived:0,score:0,deployments:0,rollbacks:0,
    releases,candidate:0,availableAt:18,tested:false,testRemaining:0,testSignal:'Tests have not run. Nobody has read the release notes yet.',
    rollout:'idle',rolloutTime:0,canaryTime:0,live:'stable',stable:'stable',promotionPending:false,
    notice:'1 / Two servers are online. Watch Traffic versus Capacity before scaling.',
    incidents:[{kind:'Traffic Spike',at:50,duration:18,started:false,resolved:false},{kind:'Memory Leak',at:level>1?58:87,duration:137,started:false,resolved:false},{kind:'Server Down',at:level>2?139:116,duration:79,started:false,resolved:false},{kind:'Database Slowdown',at:146,duration:19,started:false,resolved:false},{kind:'Buggy Release',at:166,duration:6,started:false,resolved:false}],
  };
}
export const releaseCapacity=(kind:ReleaseKind)=>kind==='heavy'?.68:kind==='performance'?1.2:1;
export const releaseErrors=(kind:ReleaseKind)=>kind==='errors'?.18:0;
export const candidateRelease=(ops:Ops)=>ops.releases[Math.min(ops.candidate,ops.releases.length-1)];
export function effectiveCapacity(ops:Ops):number {
  const share=ops.rollout==='canary'?.1:0,kind=candidateRelease(ops).kind;
  const factor=(1-share)*releaseCapacity(ops.live)+share*releaseCapacity(kind);
  const application=ops.servers.reduce((sum,s)=>sum+(s.state==='healthy'?s.capacity:s.state==='leaking'?s.capacity*.48:0),0)*factor;
  return Math.min(application,ops.database);
}
export function testReport(kind:ReleaseKind):string {
  return {stable:'PASS / No regression detected. Expected error rate below 1%.',heavy:'CAUTION / CPU rises 47%. Capacity falls to 68%. Plan extra headroom.',errors:'FAIL / Error-path tests reproduce an 18% request failure. Canary or rollback recommended.',performance:'PASS / Throughput improves 20%. No error regression detected.'}[kind];
}
function charge(ops:Ops,cost:number):boolean{if(ops.budget<cost)return false;ops.budget-=cost;return true;}
export function opsAction(ops:Ops,action:string):boolean {
  if(ops.phase!=='playing')return false;
  if(action.startsWith('server-')){const id=Number(action.slice(7));if(ops.servers.some(s=>s.id===id)){ops.selected=id;return true;}return false;}
  if(action==='database'){ops.selected=-1;return true;}
  if(action==='scale-up'&&ops.servers.length<5&&charge(ops,28)){ops.servers.push({id:ops.nextServer++,state:'booting',remaining:6,capacity:70});ops.notice='Server requested. Coffee is brewing; boot takes 6 seconds.';return true;}
  if(action==='scale-down'&&ops.servers.length>1){const selected=ops.servers.findIndex(s=>s.id===ops.selected);const index=selected>=0?selected:ops.servers.length-1;ops.servers.splice(index,1);ops.selected=ops.servers[0].id;ops.notice='Capacity removed. The invoice gets smaller, not the traffic.';return true;}
  const server=ops.servers.find(s=>s.id===ops.selected);
  if(action==='repair'&&server?.state==='down'){
    const emergency=ops.budget<18;if(!emergency&&!charge(ops,18))return false;
    server.state='repairing';server.remaining=emergency?9:6;ops.notice=emergency?'Emergency repair grant applied. Hardware returns in 9 seconds.':'Hardware repair underway. Six seconds to healthy.';return true;
  }
  if(action==='restart'&&server&&['healthy','leaking'].includes(server.state)&&charge(ops,6)){server.state='restarting';server.remaining=3;ops.notice='Restarting: memory clears, but capacity is offline for 3 seconds.';return true;}
  if(action==='optimize'&&ops.dbCooldown===0&&charge(ops,18)){ops.dbBoost=20;ops.dbCooldown=35;ops.notice='Database query plan optimized for 20 seconds. Cooldown: 35 seconds.';return true;}
  if(action==='tests'&&ops.elapsed>=ops.availableAt&&ops.testRemaining===0&&!ops.tested&&charge(ops,8)){ops.testRemaining=3;ops.testSignal='Tests running… 3 seconds. The intern brought assertions.';return true;}
  if(action==='canary'&&ops.elapsed>=ops.availableAt&&ops.rollout==='idle'&&charge(ops,10)){ops.rollout='starting-canary';ops.rolloutTime=3;ops.canaryTime=0;ops.notice='Canary starting. Only 10% of traffic will see the candidate.';return true;}
  if(action==='promote'&&ops.rollout==='canary'&&ops.canaryTime>=6&&charge(ops,12)){ops.rollout='promoting';ops.rolloutTime=4;ops.notice='Promotion in progress. All servers change version in 4 seconds.';return true;}
  if(action==='rollback'&&['starting-canary','canary','promoting','production'].includes(ops.rollout)){
    ops.budget=Math.max(0,ops.budget-4);ops.rollout='rollback';ops.rolloutTime=3;ops.promotionPending=false;
    ops.notice='Rollback started. Last stable version returns in 3 seconds.';return true;
  }
  return false;
}
function nextCandidate(ops:Ops):void{ops.candidate=Math.min(ops.candidate+1,ops.releases.length-1);ops.availableAt=ops.elapsed+12;ops.rollout='idle';ops.tested=false;ops.testRemaining=0;ops.testSignal='Next release arrives shortly. Test before promoting.';}
function tick(ops:Ops):void {
  const dt=OPS_STEP;ops.elapsed=Math.min(ops.duration,ops.elapsed+dt);
  for(const incident of ops.incidents) {
    if(!incident.started&&ops.elapsed>=incident.at){incident.started=true;
      const selected=ops.servers.find(s=>s.state==='healthy');
      if(incident.kind==='Memory Leak'&&selected){selected.state='leaking';ops.notice=`WARNING / App ${selected.id}: rising memory, lower throughput. Restart clears the leak.`;}
      if(incident.kind==='Server Down'&&selected){selected.state='down';ops.notice=`CRITICAL / App ${selected.id}: hardware unavailable. Select it and Repair.`;}
      if(incident.kind==='Database Slowdown'){ops.dbSlow=true;ops.notice='WARNING / Database: capacity reduced. More app servers cannot fix this. Optimize Database.';}
      if(incident.kind==='Traffic Spike')ops.notice='WARNING / Load balancer: incoming requests spiking for 18 seconds. Scale capacity or expect a queue.';
      if(incident.kind==='Buggy Release')ops.notice='RELEASE ADVISORY / v1.3 contains a reproducible error path. Check tests and canary before promotion.';
    }
    if(incident.started&&!incident.resolved&&ops.elapsed>=incident.at+incident.duration){incident.resolved=true;if(incident.kind==='Database Slowdown')ops.dbSlow=false;}
  }
  for(const server of ops.servers)if(server.remaining>0){server.remaining=Math.max(0,server.remaining-dt);if(server.remaining===0)server.state='healthy';}
  ops.dbBoost=Math.max(0,ops.dbBoost-dt);ops.dbCooldown=Math.max(0,ops.dbCooldown-dt);
  ops.database=ops.dbBase*(ops.dbSlow?.6:1)*(ops.dbBoost>0?1.8:1);
  if(ops.testRemaining>0){ops.testRemaining=Math.max(0,ops.testRemaining-dt);if(ops.testRemaining===0){ops.tested=true;ops.testSignal=testReport(candidateRelease(ops).kind);}}
  if(ops.rolloutTime>0){ops.rolloutTime=Math.max(0,ops.rolloutTime-dt);if(ops.rolloutTime===0){
    if(ops.rollout==='starting-canary'){ops.rollout='canary';ops.notice='Canary live. Observe candidate errors and capacity for at least 6 seconds.';}
    else if(ops.rollout==='promoting'){ops.live=candidateRelease(ops).kind;ops.rollout='production';ops.promotionPending=true;ops.canaryTime=0;ops.notice='Candidate is in production. Health observation continues.';}
    else if(ops.rollout==='rollback'){ops.live=ops.stable;ops.rollbacks++;ops.notice='Rollback complete. A safe retreat is still a production skill.';nextCandidate(ops);}
  }}
  if(ops.rollout==='canary'||ops.rollout==='production')ops.canaryTime+=dt;
  const spike=ops.incidents.some(e=>e.kind==='Traffic Spike'&&e.started&&!e.resolved)?48:0;
  ops.traffic=(90+ops.elapsed/ops.duration*66+7*Math.sin(ops.elapsed*.07)+spike)*(1+.045*(ops.level-1));
  ops.capacity=effectiveCapacity(ops);
  const arrived=ops.traffic*dt;let failed=0,processed=0;
  for(const cohort of ops.queue)cohort.age+=dt;
  while(ops.queue[0]?.age>=REQUEST_TIMEOUT)failed+=ops.queue.shift()!.amount;
  let queued=ops.queue.reduce((sum,b)=>sum+b.amount,0);
  const accepted=Math.min(arrived,Math.max(0,QUEUE_LIMIT-queued));failed+=arrived-accepted;
  if(accepted>0)ops.queue.push({amount:accepted,age:0});
  let capacity=ops.capacity*dt;
  while(capacity>0&&ops.queue.length){const cohort=ops.queue[0],handled=Math.min(capacity,cohort.amount);processed+=handled;capacity-=handled;cohort.amount-=handled;if(cohort.amount<1e-7)ops.queue.shift();}
  const share=ops.rollout==='canary'?.1:0,errorRate=(1-share)*releaseErrors(ops.live)+share*releaseErrors(candidateRelease(ops).kind);
  const applicationErrors=processed*errorRate;processed-=applicationErrors;failed+=applicationErrors;
  ops.queued=ops.queue.reduce((sum,b)=>sum+b.amount,0);
  const latency=Math.min(REQUEST_TIMEOUT,.09+ops.queued/Math.max(1,ops.capacity));
  ops.recent.push({time:ops.elapsed,arrived,served:processed,failed,latency});
  while(ops.recent.length&&ops.recent[0].time<=ops.elapsed-20)ops.recent.shift();
  const recentArrivals=ops.recent.reduce((sum,s)=>sum+s.arrived,0),recentFailed=ops.recent.reduce((sum,s)=>sum+s.failed,0);
  ops.failRate=clamp(recentFailed/Math.max(1,recentArrivals),0,1);ops.latency=ops.recent.reduce((sum,s)=>sum+s.latency,0)/ops.recent.length;
  ops.errorBudget=clamp(ops.errorBudget+dt*(ops.failRate<.01&&ops.latency<.8?.12:-ops.failRate*10-Math.max(0,ops.latency-1.2)*.8),0,100);
  ops.emergency=ops.errorBudget===0?ops.emergency+dt:0;
  ops.arrived+=arrived;ops.served+=processed;ops.failed+=failed;
  ops.budget=clamp(ops.budget+processed*.0045-ops.servers.length*.11*dt+(ops.budget<15?.4*dt:0),0,500);
  if(ops.promotionPending&&ops.canaryTime>=8&&ops.live!=='errors'&&ops.failRate<.03&&ops.latency<1.2){ops.deployments++;ops.stable=ops.live;ops.promotionPending=false;ops.notice='Healthy deployment confirmed. Ship it. Then hydrate.';nextCandidate(ops);}
  ops.score=Math.floor(ops.served*.06+ops.deployments*500+ops.rollbacks*80+ops.errorBudget*3+ops.budget);
  if(ops.emergency>=7){ops.phase='lost';ops.notice='Error budget exhausted through the emergency window.';}
  else if(ops.elapsed>=ops.duration){ops.phase=ops.errorBudget>0?'won':'lost';ops.notice=ops.phase==='won'?'Shift complete. The website stayed on speaking terms with the internet.':'The shift ended with no error budget remaining.';}
  else if(ops.errorBudget<20)ops.notice=`CRITICAL / Error budget ${Math.ceil(ops.errorBudget)}%. Roll back errors, repair capacity and drain the queue.`;
  else if(ops.elapsed>18&&ops.elapsed<28)ops.notice='2 / A release has arrived. Run Tests, then a 10% canary. Promote only after observing it.';
}
export function stepOps(ops:Ops,dt:number):void {
  if(ops.phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
  ops.accumulator+=Math.min(dt,.5);
  while(ops.accumulator>=OPS_STEP&&ops.phase==='playing'){ops.accumulator-=OPS_STEP;tick(ops);}
}
