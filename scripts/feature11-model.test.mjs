import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createGrid,batteryFlow,distribute,stepGrid,gridAction,lineCapacity,gasCapacity} from '../src/games/blackout-texas/model.ts';
import {createOps,effectiveCapacity,stepOps,opsAction,candidateRelease,testReport,QUEUE_LIMIT} from '../src/games/deploy-or-die/model.ts';
import {createPacket,route,canClose,stepPacket,requestDirection} from '../src/games/packet-runner/model.ts';
import {createRescue,stepRescue,rescueAligned,dockingAligned,passengers,speed,angleDifference} from '../src/games/orbital-rescue/model.ts';
const advance=(step,run,seconds,input={x:0,y:0},dt=1/60)=>{for(let t=0;t<seconds-1e-7;t+=dt)step(run,dt,input);};

test('Blackout: MW integrate to MWh with the declared grid clock and exclusive battery modes',()=>{
 const g=createGrid(),b=g.battery;b.energy=10;b.mode='Charge';b.power=30;
 assert.equal(batteryFlow(b,100,70,1),70);assert.ok(Math.abs(b.energy-(10+30/60*.92))<1e-10);assert.equal(b.discharge,0);
 b.mode='Discharge';const before=b.energy;assert.equal(batteryFlow(b,0,20,1),20);assert.ok(Math.abs(b.energy-(before-20/60/.92))<1e-10);assert.equal(b.charge,0);
 b.mode='Hold';const held=b.energy;batteryFlow(b,100,200,20);assert.equal(b.energy,held);assert.equal(b.charge,0);assert.equal(b.discharge,0);
 b.mode='Charge';b.energy=b.capacity-.001;batteryFlow(b,1000,0,1);assert.equal(b.energy,b.capacity);
 b.mode='Discharge';b.energy=.001;const supply=batteryFlow(b,0,1000,1);assert.equal(b.energy,0);assert.ok(supply<1);
});
test('Blackout: hospital priority, line capacities and conservation survive a supply shortage',()=>{
 const g=createGrid();g.districts[2].fault=true;distribute(g,70);
 assert.equal(g.districts[3].received,g.districts[3].demand);assert.ok(g.supplied<=70+1e-9);
 for(const d of g.districts)assert.ok(d.received<=lineCapacity(d));
 const gas=g.gas.target;gridAction(g,'auto');assert.equal(g.gas.target,gas);assert.equal(g.districts[2].fault,true);assert.ok(g.districts[2].allocation<=lineCapacity(g.districts[2]));
});
test('Blackout: startup, bounded ramp, overloading, crew intervention and cooldown are real',()=>{
 const g=createGrid();gridAction(g,'start-gas');advance(stepGrid,g,7,{},.25);assert.equal(g.gas.output,0);
 advance(stepGrid,g,2,{},.25);assert.ok(g.gas.output>0&&g.gas.output<=10);
 g.selected=2;g.districts[2].fault=true;g.districts[2].allocation=100;advance(stepGrid,g,9,{},.25);assert.equal(g.districts[2].tripped,true);
 assert.equal(gridAction(g,'repair'),true);assert.equal(gridAction(g,'repair'),false);advance(stepGrid,g,7,{},.25);assert.equal(g.districts[2].tripped,false);assert.ok(g.crew.cooldown>0);
});
test('Blackout: first shift is winnable, battery stays bounded and all event types receive a warning',()=>{
 const g=createGrid();gridAction(g,'start-gas');const notices=new Set();
 for(let i=0;i<720;i++){if(i%8===0)gridAction(g,'auto');gridAction(g,g.generation>g.demand?'Charge':'Discharge');stepGrid(g,.25);if(g.notice.startsWith('IN '))notices.add(g.notice.split(' / ')[1]?.split('.')[0]);assert.ok(g.battery.energy>=0&&g.battery.energy<=g.battery.capacity);assert.ok(g.supplied<=g.generation+g.battery.discharge-g.battery.charge+1e-6);assert.ok(g.gas.output<=gasCapacity(g)+1e-8);}
 assert.equal(g.phase,'won');assert.ok(g.score>0);assert.ok(notices.size>=5);
 const lost=createGrid();for(const d of lost.districts)d.allocation=0;advance(stepGrid,lost,110,{},.25);assert.equal(lost.phase,'lost');
});
test('Deploy: database remains the bottleneck after scaling; boots and optimization have distinct delays',()=>{
 const ops=createOps();ops.database=90;assert.equal(effectiveCapacity(ops),90);assert.equal(opsAction(ops,'scale-up'),true);assert.equal(ops.servers.at(-1).state,'booting');assert.equal(effectiveCapacity(ops),90);
 advance(stepOps,ops,6,{},.25);assert.equal(ops.servers.at(-1).state,'healthy');ops.dbSlow=true;advance(stepOps,ops,.25,{},.25);assert.equal(ops.capacity,111);
 assert.equal(opsAction(ops,'optimize'),true);advance(stepOps,ops,.25,{},.25);assert.ok(ops.capacity>111);assert.equal(opsAction(ops,'optimize'),false);
});
test('Deploy: FIFO backlog is bounded, old requests fail and recent metrics recover',()=>{
 const ops=createOps();ops.servers.forEach(s=>s.state='down');advance(stepOps,ops,8,{},.25);assert.ok(ops.failed>0);assert.ok(ops.queued<=QUEUE_LIMIT);assert.ok(ops.queue.every(c=>c.age<5));
 ops.servers.forEach(s=>s.state='healthy');ops.servers.forEach(s=>s.capacity=400);ops.dbBase=1000;advance(stepOps,ops,25,{},.25);assert.ok(ops.failRate<.01);assert.ok(ops.latency<.2);assert.ok(ops.recent.length<=80);
});
test('Deploy: candidate traits persist, tests are informative, canary precedes promotion and rollback has a delay',()=>{
 const ops=createOps(1,17);ops.elapsed=20;const candidate=structuredClone(candidateRelease(ops));assert.equal(opsAction(ops,'tests'),true);advance(stepOps,ops,3,{},.25);assert.equal(ops.testSignal,testReport(candidate.kind));assert.deepEqual(candidateRelease(ops),candidate);
 assert.equal(opsAction(ops,'promote'),false);assert.equal(opsAction(ops,'canary'),true);advance(stepOps,ops,3,{},.25);assert.equal(ops.rollout,'canary');assert.equal(opsAction(ops,'promote'),false);advance(stepOps,ops,6,{},.25);assert.equal(opsAction(ops,'promote'),true);advance(stepOps,ops,4,{},.25);assert.equal(ops.live,candidate.kind);
 ops.live='errors';assert.equal(opsAction(ops,'rollback'),true);advance(stepOps,ops,2,{},.25);assert.equal(ops.live,'errors');advance(stepOps,ops,1,{},.25);assert.equal(ops.live,'stable');assert.equal(ops.rollbacks,1);
});
test('Deploy: emergency repair is possible at zero budget and the last server cannot be scaled away',()=>{
 const ops=createOps();ops.servers=ops.servers.slice(0,1);ops.selected=ops.servers[0].id;ops.servers[0].state='down';ops.budget=0;
 assert.equal(opsAction(ops,'scale-down'),false);assert.equal(opsAction(ops,'repair'),true);advance(stepOps,ops,9,{},.25);assert.equal(ops.servers[0].state,'healthy');assert.ok(ops.budget>=0);
});
test('Deploy: a deliberate capacity and incident strategy can finish the initial shift',()=>{
 const ops=createOps();opsAction(ops,'scale-up');opsAction(ops,'scale-up');
 for(let i=0;i<780;i++){
  for(const s of ops.servers){ops.selected=s.id;if(s.state==='down')opsAction(ops,'repair');if(s.state==='leaking')opsAction(ops,'restart');}
  if(ops.dbSlow)opsAction(ops,'optimize');
  if(ops.elapsed>=ops.availableAt){if(!ops.tested)opsAction(ops,'tests');if(ops.tested&&ops.rollout==='idle')opsAction(ops,'canary');if(ops.rollout==='canary'&&ops.canaryTime>=6)opsAction(ops,candidateRelease(ops).kind==='errors'?'rollback':'promote');}
  stepOps(ops,.25);
 }
 assert.equal(ops.phase,'won');assert.ok(ops.served>ops.failed);assert.ok(ops.deployments>0);
});
test('Packet: reproducible connected networks and TTL include a viable non-portal route',()=>{
 for(let level=1;level<=5;level++)for(let seed=1;seed<=20;seed++){
  const p=createPacket(level,seed);assert.deepEqual(p.network,createPacket(level,seed).network);
  for(const d of p.network.destinations)assert.ok(route(p.network,p.network.origin,d).length>0);
  const path=route(p.network,p.node,p.destination);assert.ok(p.ttl>(path.length-1)*.56);assert.ok(p.network.edges.length<=99);
 }
});
test('Packet: a missing link blocks motion and released controls stop at the current hop',()=>{
 const p=createPacket();const invalid=['up','right','left','down'].find(d=>{const next=d==='up'?p.node-p.network.cols:d==='right'?p.node+1:d==='left'?p.node-1:p.node+p.network.cols;return !p.network.edges[p.node].includes(next);});
 requestDirection(p,invalid);const before=p.node;advance(stepPacket,p,.7);assert.equal(p.node,before);
 const next=p.network.edges[p.node][0],direction=next===p.node-1?'left':next===p.node+1?'right':next<p.node?'up':'down';requestDirection(p,direction);advance(stepPacket,p,1);assert.equal(p.node,next);const stopped=p.node;advance(stepPacket,p,1);assert.equal(p.node,stopped);
});
test('Packet: closures cannot occupy the player or break any destination route',()=>{
 const p=createPacket(3,43);assert.equal(canClose(p,p.node),false);assert.equal(canClose(p,p.destination),false);
 for(let node=0;node<p.network.edges.length;node++)if(canClose(p,node))for(const d of p.network.destinations)assert.ok(route(p.network,p.node,d,[node]).length>0);
 advance(stepPacket,p,16);assert.ok(p.closure);for(const d of p.network.destinations)assert.ok(route(p.network,p.node,d,p.blocked).length>0);
});
test('Packet: paired portals do not bounce, wrong destinations do not consume packets and damage has invulnerability',()=>{
 const p=createPacket(2);p.patrols=[];const [a,b]=p.network.portals;p.from=p.network.edges[a][0];p.node=p.from;p.to=a;p.progress=p.travel-.001;stepPacket(p,.02,{x:0,y:0});assert.equal(p.node,b);advance(stepPacket,p,2);assert.equal(p.node,b);
 const wrong=p.network.destinations.find(n=>n!==p.destination);p.node=p.from=p.network.edges[wrong][0];p.to=wrong;p.progress=p.travel-.001;stepPacket(p,.02,{x:0,y:0});assert.equal(p.completed,0);assert.equal(p.phase,'delivery');assert.match(p.notice,/Wrong destination/);
 p.node=p.from=p.to=0;p.invulnerable=0;p.patrols=[{route:[0,p.network.edges[0][0]],index:0,progress:0,forward:true},{route:[0,p.network.edges[0][0]],index:0,progress:0,forward:true}];stepPacket(p,.02,{x:0,y:0});assert.equal(p.integrity,75);advance(stepPacket,p,.2);assert.equal(p.integrity,75);
});
test('Packet: correct delivery scores, TTL failures are bounded and level transitions are explicit',()=>{
 const p=createPacket();p.from=p.node=p.network.edges[p.destination][0];p.to=p.destination;p.progress=p.travel-.001;stepPacket(p,.02,{x:0,y:0});assert.equal(p.completed,1);assert.equal(p.phase,'transition');assert.ok(p.score>0);advance(stepPacket,p,2);assert.equal(p.id,2);
 p.patrols=[];for(let i=0;i<3;i++){p.ttl=.001;stepPacket(p,.02,{x:0,y:0});if(i<2)advance(stepPacket,p,2);}assert.equal(p.phase,'over');assert.equal(p.failures,3);
});
test('Orbital: inertia, assisted braking and emergency reserve obey finite resource limits',()=>{
 const r=createRescue();advance(stepRescue,r,1,{x:0,y:-1});assert.equal(r.phase,'flying');const accelerated=speed(r);advance(stepRescue,r,.4);assert.ok(speed(r)>accelerated*.8);
 advance(stepRescue,r,1,{x:0,y:1});assert.ok(speed(r)<accelerated);r.ship.fuel=0;r.ship.reserve=1;advance(stepRescue,r,2,{x:0,y:-1});assert.equal(r.ship.reserve,0);assert.ok(r.ship.fuel>=0);
});
test('Orbital: rescue requires proximity, low relative speed and a sustained hold; cabin capacity is two',()=>{
 const r=createRescue();r.phase='flying';r.launchCooldown=100;const a=r.astronauts[0];r.ship.x=a.x;r.ship.y=a.y;r.ship.vx=20;assert.equal(rescueAligned(r,a),false);r.ship.vx=0;assert.equal(rescueAligned(r,a),true);advance(stepRescue,r,1);assert.equal(a.state,'waiting');advance(stepRescue,r,.5,{x:0,y:1});assert.equal(a.state,'aboard');assert.equal(passengers(r),1);
 const b=r.astronauts[1];r.ship.x=b.x;r.ship.y=b.y;r.ship.vx=r.ship.vy=0;advance(stepRescue,r,1.6,{x:0,y:1});assert.equal(passengers(r),2);
 const extra={...b,id:'EXTRA',state:'waiting'};assert.equal(rescueAligned(r,extra),false);
});
test('Orbital: docking checks speed and orientation, delivers passengers and replenishes resources',()=>{
 const r=createRescue();r.phase='flying';r.launchCooldown=0;r.ship.angle=0;assert.equal(dockingAligned(r),false);r.ship.angle=r.station.angle;r.ship.vx=20;assert.equal(dockingAligned(r),false);r.ship.vx=0;r.ship.fuel=20;r.ship.hull=30;r.astronauts[0].state='aboard';advance(stepRescue,r,4,{x:0,y:1});assert.equal(r.rescued,1);assert.equal(r.phase,'docked');advance(stepRescue,r,5);assert.equal(r.ship.fuel,100);assert.equal(r.ship.hull,100);
});
test('Orbital: body collision cannot cross the planet, damage is capped and worlds remain bounded',()=>{
 const r=createRescue(4);r.phase='flying';r.ship.x=r.planet.x-r.planet.radius-10;r.ship.y=r.planet.y;r.ship.vx=110;r.ship.vy=0;r.launchCooldown=100;
 stepRescue(r,.05,{x:0,y:0});assert.ok(Math.hypot(r.ship.x-r.planet.x,r.ship.y-r.planet.y)>=r.planet.radius+9-1e-6);assert.ok(r.ship.hull>=75);
 r.ship.x=999;r.ship.vx=120;advance(stepRescue,r,.5);assert.ok(r.ship.x<=990&&r.ship.x>=10);assert.ok(Number.isFinite(r.ship.vx));
});
test('Orbital: first mission omits oxygen pressure; later beacons are reachable and losses are explicit',()=>{
 const first=createRescue();assert.ok(first.astronauts.every(a=>a.oxygen===Infinity));assert.equal(first.debris.length,0);
 for(let level=1;level<=8;level++){const r=createRescue(level);for(const a of r.astronauts){assert.ok(a.x>0&&a.x<1000&&a.y>0&&a.y<1000);assert.ok(Math.hypot(a.x-r.planet.x,a.y-r.planet.y)>r.planet.radius+50);}}
 const r=createRescue(2);r.astronauts[0].oxygen=.001;r.astronauts[1].oxygen=.001;stepRescue(r,.02,{x:0,y:0});assert.equal(r.phase,'lost');assert.match(r.notice,/Too few/);
});

function flyMission(level=1){
 const r=createRescue(level);
 for(let i=0;i<120*180&&!['won','lost'].includes(r.phase);i++){
  const home=passengers(r)>=r.capacity||r.rescued+passengers(r)>=r.goal||!r.astronauts.some(a=>a.state==='waiting');
  const target=home?r.station:r.astronauts.find(a=>a.state==='waiting');
  const dx=target.x-r.ship.x,dy=target.y-r.ship.y,distance=Math.hypot(dx,dy),desiredSpeed=Math.min(28,Math.max(0,(distance-9)*.7));
  const ax=dx/(distance||1)*desiredSpeed-r.ship.vx,ay=dy/(distance||1)*desiredSpeed-r.ship.vy;
  const angle=home&&distance<28?r.station.angle:Math.atan2(ay,ax);
  let y=0;if(r.phase==='docked')y=-1;
  else if(distance<20||speed(r)>desiredSpeed+2)y=speed(r)>.25?1:0;
  else if(Math.abs(angleDifference(angle,r.ship.angle))<.22)y=-Math.min(1,Math.hypot(ax,ay)/22);
  const x=Math.max(-1,Math.min(1,angleDifference(angle,r.ship.angle)*2.8-r.ship.omega*1.4));
  stepRescue(r,1/120,{x,y});
 }
 return r;
}
test('Orbital: a complete initial mission is possible using flight inputs only, without teleporting or refills',()=>{
 const r=flyMission();assert.equal(r.phase,'won');assert.equal(r.rescued,2);assert.ok(r.ship.fuel>40);assert.equal(r.ship.reserve,20);
});

test('Orbital: every later mission can be completed within oxygen, fuel and time using flight and assisted docking',()=>{
 for(let level=2;level<=8;level++){const r=flyMission(level);assert.equal(r.phase,'won',`mission ${level}`);assert.equal(r.rescued,r.goal);assert.ok(r.elapsed<r.duration);assert.ok(r.ship.fuel>0);}
});

test('Orbital: fixed substeps give the same flight at 30 and 120 Hz and clamp inactive-tab jumps',()=>{
 const a=createRescue(),b=createRescue();advance(stepRescue,a,5,{x:.3,y:-1},1/30);advance(stepRescue,b,5,{x:.3,y:-1},1/120);
 for(const key of ['x','y','vx','vy','angle','fuel'])assert.ok(Math.abs(a.ship[key]-b.ship[key])<1e-6,key);
 const before=a.elapsed;stepRescue(a,30,{x:0,y:0});assert.ok(a.elapsed-before<=.05+1e-7);
});

test('Later grid days combine warned incidents and remain recoverable with the available resources',()=>{
 for(let level=2;level<=8;level++){
  const g=createGrid(level);gridAction(g,'start-gas');
  assert.ok(g.events[1].at<g.events[0].at+g.events[0].duration);
  for(let i=0;i<720;i++){if(i%4===0)gridAction(g,'auto');gridAction(g,g.generation>g.demand?'Charge':'Discharge');g.selected=-1;gridAction(g,'repair');stepGrid(g,.25);}
  assert.equal(g.phase,'won',`day ${level}`);
 }
});

test('Later operations combine incidents but allow a capacity, repair and database strategy to survive',()=>{
 for(let level=2;level<=8;level++){
  const ops=createOps(level);opsAction(ops,'scale-up');opsAction(ops,'scale-up');
  assert.ok(ops.incidents[1].at<ops.incidents[0].at+ops.incidents[0].duration);
  for(let i=0;i<780;i++){
   for(const s of ops.servers){ops.selected=s.id;if(s.state==='down')opsAction(ops,'repair');if(s.state==='leaking')opsAction(ops,'restart');}
   if(ops.dbSlow)opsAction(ops,'optimize');stepOps(ops,.25);
  }
  assert.equal(ops.phase,'won',`shift ${level}`);
 }
});
