import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baseY, canLand, createFlight, flightAction, stepFlight } from '../src/games/galactian/model.ts';
import { WORLD, VIEW, createCrane, craneAction, currentOrder, generateOrder, slotX, stepCrane, targetSlot } from '../src/games/rail-crane/model.ts';

const fly={x:0,y:0,fire:false,slow:false};
const wait={x:0,y:0};
const seconds=(fn,run,n,input)=>{for(let i=0;i<Math.ceil(n*60);i++)fn(run,1/60,input);};
function flight(){const run=createFlight(21);run.phase='flight';run.base=null;run.waveTime=1e6;return run;}
function alignedFlight(){const run=flight();run.distance=1200;run.player={x:100,y:baseY(run,run.bases[1])};run.speed=12;return run;}
function pick(run,cargo){run.x=cargo.x;run.y=cargo.y-15;run.vx=0;assert.equal(craneAction(run,'grip'),true);}
function place(run,index){const cargo=run.cargo.find(cargo=>cargo.id===run.held);run.x=slotX(index);run.y=349;run.vx=0;cargo.x=run.x;cargo.y=364;assert.equal(craneAction(run,'grip'),true);seconds(stepCrane,run,.4,wait);}

test('Galactian requires alignment, low speed and an unused allied base to land',()=>{
  const run=alignedFlight();assert.equal(canLand(run),true);
  run.speed=44;assert.equal(canLand(run),false);assert.equal(flightAction(run,'context'),false);
  run.speed=12;run.player.x+=80;assert.equal(canLand(run),false);
  run.player.x=100;run.bases[1].used=true;assert.equal(canLand(run),false);
});
test('landing freezes the world, repairs and resupplies, then requires an explicit takeoff',()=>{
  const run=alignedFlight();run.fuel=3;run.integrity=14;run.bombs=0;
  assert.equal(flightAction(run,'context'),true);const distance=run.distance;
  seconds(stepFlight,run,5,fly);
  assert.equal(run.distance,distance);assert.equal(run.phase,'docked');assert.equal(run.fuel,100);assert.equal(run.integrity,100);assert.equal(run.bombs,5);
  assert.equal(flightAction(run,'bomb'),false);assert.equal(run.score,300);
  seconds(stepFlight,run,2,fly);assert.equal(run.phase,'docked');assert.equal(run.score,300);
  assert.equal(flightAction(run,'context'),true);seconds(stepFlight,run,1.2,fly);assert.equal(run.phase,'flight');assert.ok(run.invulnerable>0);
});
test('fuel lasts until the next base; empty fuel permits emergency landing before failure',()=>{
  const run=flight();seconds(stepFlight,run,30,fly);
  assert.ok(run.fuel>40);assert.ok(baseY(run,run.bases.find(base=>base.id===1))>200);
  const emergency=alignedFlight();emergency.fuel=0;seconds(stepFlight,emergency,1,{...fly,slow:true});
  assert.equal(emergency.phase,'flight');assert.ok(emergency.emergency<9);
  emergency.player.y=baseY(emergency,emergency.bases.find(base=>base.id===1));assert.equal(flightAction(emergency,'context'),true);seconds(stepFlight,emergency,5,fly);assert.equal(emergency.phase,'docked');
  const empty=flight();empty.fuel=0;seconds(stepFlight,empty,10,fly);assert.equal(empty.phase,'over');assert.match(empty.reason,/fuel/);
});
test('guns are unlimited and hit aircraft only; limited bombs hit ground targets once',()=>{
  const run=flight();run.player={x:180,y:330};run.enemies=[{id:1,kind:'orc',x:180,y:210,origin:180,hp:1,age:0,fire:99,pattern:0},{id:2,kind:'fighter',x:180,y:210,origin:180,hp:1,age:0,fire:99,pattern:0}];
  seconds(stepFlight,run,.5,{...fly,fire:true});assert.equal(run.bombs,5);assert.equal(run.enemies.some(enemy=>enemy.id===1),true);assert.equal(run.enemies.some(enemy=>enemy.id===2),false);
  run.enemies[0].x=run.player.x;run.enemies[0].y=run.player.y-105;
  assert.equal(flightAction(run,'bomb'),true);assert.equal(flightAction(run,'bomb'),true);
  const score=run.score;seconds(stepFlight,run,.7,fly);assert.equal(run.score-score,45);assert.equal(run.bombs,3);
  run.bombs=0;assert.equal(flightAction(run,'bomb'),false);
});
test('post-hit invulnerability prevents stacked collision damage and simulation remains bounded',()=>{
  const run=flight();run.invulnerable=0;run.shots=Array.from({length:5},()=>({x:180,y:330,vx:0,vy:0,friendly:false}));stepFlight(run,1/60,fly);assert.equal(run.integrity,82);
  run.waveTime=0;run.invulnerable=1e6;
  for(let i=0;i<20000;i++){run.fuel=100;stepFlight(run,1/60,{...fly,fire:true});assert.ok(run.enemies.length<=22);assert.ok(run.shots.length<=100);assert.ok(run.bases.length<=5);assert.ok(run.sparks.length<=30);}
});
test('Rail Crane generates feasible orders from available cargo and empty slots across operations',()=>{
  for(let operation=1;operation<=8;operation++)for(let seed=1;seed<25;seed++){
    const run=createCrane(operation,seed);run.cargo[1].delivered=true;run.slots[1]=run.cargo[1].id;run.cargo[1].slot=1;
    const order=generateOrder(run);assert.ok(order);assert.equal(run.slots[order.slot],null);assert.equal(run.cargo.find(cargo=>cargo.id===order.cargo).delivered,false);assert.ok(order.slot>=0&&order.slot<16);
  }
  const run=createCrane();run.slots.fill('occupied');assert.equal(generateOrder(run),null);
  run.slots.fill(null);run.cargo.forEach(cargo=>cargo.delivered=true);assert.equal(generateOrder(run),null);
});
test('the hook must be aligned and at roof height; camera sections remain separate from crane movement',()=>{
  const run=createCrane();assert.equal(craneAction(run,'grip'),false);
  run.y=180;run.x=145;assert.equal(craneAction(run,'grip'),false);
  run.x=100;assert.equal(craneAction(run,'grip'),true);assert.equal(run.held,'C-12');
  const x=run.x;craneAction(run,'view-right');seconds(stepCrane,run,1,wait);assert.ok(run.camera>200);assert.equal(run.x,x);
  seconds(stepCrane,run,2,{x:1,y:-1});assert.ok(run.x>100);assert.ok(run.cameraTarget>=0&&run.cameraTarget<=WORLD-VIEW);
});
test('correct placement awards speed, streak and time and never generates an occupied destination',()=>{
  const run=createCrane(1,12),order=currentOrder(run);pick(run,run.cargo.find(cargo=>cargo.id===order.cargo));const before=run.timer;
  place(run,order.slot);assert.equal(run.completed,1);assert.equal(run.streak,1);assert.ok(run.score>500);assert.ok(run.timer>before+10);assert.equal(run.slots[order.slot],order.cargo);
  const next=currentOrder(run);assert.notEqual(next.cargo,order.cargo);assert.equal(run.slots[next.slot],null);
});
test('wrong-slot and wrong-cargo placements cost time, remain recoverable and cannot overwrite a wagon',()=>{
  const run=createCrane(),order={...currentOrder(run)};pick(run,run.cargo[0]);place(run,0);
  assert.equal(run.mistakes,1);assert.deepEqual(currentOrder(run),order);assert.equal(run.slots[0],'C-12');
  pick(run,run.cargo[1]);const carried=run.cargo[1];run.x=100;run.y=349;carried.x=100;carried.y=364;
  assert.equal(targetSlot(run),0);assert.equal(craneAction(run,'grip'),false);assert.equal(run.slots[0],'C-12');
  carried.x=carried.home;carried.y=195;run.x=carried.x;run.y=180;craneAction(run,'grip');
  pick(run,run.cargo[0]);assert.equal(run.slots[0],null);place(run,order.slot);assert.equal(run.completed,1);
  const current=currentOrder(run);const wrong=run.cargo.find(cargo=>!cargo.delivered&&cargo.id!==current.cargo);pick(run,wrong);place(run,current.slot);assert.equal(run.mistakes,2);assert.equal(run.completed,1);
});
test('a dropped container returns safely to staging with a penalty and does not invalidate the order',()=>{
  const run=createCrane();pick(run,run.cargo[0]);run.cargo[0].x=280;run.cargo[0].y=270;
  assert.equal(craneAction(run,'grip'),true);assert.equal(run.held,null);assert.equal(run.cargo[0].x,run.cargo[0].home);assert.equal(run.cargo[0].y,195);assert.equal(run.mistakes,1);assert.equal(run.timer,174);
});
test('a carried load can descend into a wagon behind an occupied staging position',()=>{
  const run=createCrane();pick(run,run.cargo[0]);seconds(stepCrane,run,1,{x:0,y:-1});seconds(stepCrane,run,.5,{x:1,y:0});seconds(stepCrane,run,.5,wait);seconds(stepCrane,run,2.75,{x:0,y:1});
  assert.ok(run.y>340);assert.equal(targetSlot(run),1);assert.equal(craneAction(run,'grip'),true);seconds(stepCrane,run,.5,wait);assert.equal(run.completed,1);
});
test('every generated operation can finish, the train departs, and later operations grow gradually',()=>{
  for(let level=1;level<=7;level++){
    const run=createCrane(level,151);
    while(run.phase==='working'){const order=currentOrder(run);assert.ok(order);pick(run,run.cargo.find(cargo=>cargo.id===order.cargo));place(run,order.slot);}
    assert.equal(run.phase,'departing');assert.equal(run.success,true);seconds(stepCrane,run,3.1,wait);assert.equal(run.phase,'over');assert.equal(run.completed,run.quota);assert.ok(run.score>run.quota*500);
  }
  assert.equal(createCrane(1).quota,3);assert.equal(createCrane(6).quota,8);assert.ok(createCrane(1).cargo.length<createCrane(4).cargo.length);
});
test('the train also departs on timeout, and time never becomes negative',()=>{
  const run=createCrane();run.timer=.01;stepCrane(run,1/60,wait);assert.equal(run.phase,'departing');assert.equal(run.success,false);assert.equal(run.timer,0);
  seconds(stepCrane,run,3.1,wait);assert.equal(run.phase,'over');assert.equal(run.departure>=3,true);
});
