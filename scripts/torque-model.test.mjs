import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AXLE, REST, createRide, createTrack, terrainAt, localPoint, stepRide, recoverRide } from '../src/games/torque-trail/model.ts';

function advance(run,seconds,input={x:0,y:0},dt=1/60){for(let t=0;t<seconds-1e-8;t+=dt)stepRide(run,dt,input);}
function flat(){const run=createRide();run.track.features=[];run.track.length=2000;return run;}

test('the spring-damper suspension settles with two contacts and no spontaneous propulsion',()=>{
  const run=flat();advance(run,6);
  assert.equal(run.phase,'riding');assert.ok(Math.abs(run.vx)<.01);assert.ok(Math.abs(run.vy)<.01);
  assert.ok(run.y>.7&&run.y<1);assert.ok(run.wheels.every(w=>w.contact&&w.compression>0&&w.compression<REST));
  assert.ok(Math.abs(run.angle)<.01);
});
test('rear-wheel drive accelerates, coasting dissipates energy and braking stops sooner without reversing',()=>{
  const drive=flat();advance(drive,5,{x:0,y:-1});assert.ok(drive.vx>9&&drive.vx<18);
  const coast=structuredClone(drive),brake=structuredClone(drive);advance(coast,3);advance(brake,3,{x:0,y:1});
  assert.ok(brake.x<coast.x);assert.ok(Math.abs(brake.vx)<.6);assert.ok(coast.vx<drive.vx&&coast.vx>brake.vx);
  const air=flat();air.y=30;air.vx=5;advance(air,.3,{x:0,y:-1});assert.ok(air.vx<=5);assert.equal(air.grounded,false);
});
test('rider balance changes angular momentum in the air without changing horizontal thrust',()=>{
  const back=flat(),forward=flat();back.y=forward.y=20;
  advance(back,.5,{x:-1,y:0});advance(forward,.5,{x:1,y:0});
  assert.ok(back.angle>.05);assert.ok(forward.angle<-.05);assert.equal(back.vx,forward.vx);
  assert.ok(back.y<20&&forward.y<20);
});
test('track geometry has bounded gaps, flat checkpoint approaches and no overlapping obstacles',()=>{
  for(let level=1;level<=12;level++){
    const track=createTrack(level);assert.ok(track.features.length<=10);
    for(let i=1;i<track.features.length;i++)assert.ok(track.features[i].start-track.features[i-1].start-track.features[i-1].length>=23);
    for(const checkpoint of track.checkpoints){const s=terrainAt(track,checkpoint);assert.equal(s.solid,true);assert.equal(s.height,0);assert.equal(s.slope,0);}
    for(const feature of track.features){
      assert.equal(terrainAt(track,feature.start).height,0);assert.ok(Math.abs(terrainAt(track,feature.start+feature.length).height)<1e-8);
      let gap=0;for(let x=feature.start;x<feature.start+feature.length;x+=.05){const s=terrainAt(track,x);if(!s.solid)gap+=.05;assert.ok(Number.isFinite(s.height)&&Number.isFinite(s.slope));}assert.ok(gap<=2.3);
    }
  }
});
test('a novice can finish the first authored trail and earn clean-landing points',()=>{
  const run=createRide();advance(run,50,{x:0,y:-1});assert.equal(run.phase,'finished');assert.equal(run.lives,3);assert.ok(run.landings>0);assert.ok(run.score>0);
  const score=run.score;advance(run,10,{x:1,y:-1});assert.equal(run.score,score);
});
test('missed landings consume attempts and recovery preserves checkpoint progress without farming score',()=>{
  const run=createRide();run.checkpoint=50;run.furthest=90;
  for(let i=0;i<3;i++){
    run.y=-6;run.grace=0;stepRide(run,1/60,{x:0,y:0});assert.equal(run.lives,2-i);
    if(i<2){const score=run.score;assert.equal(run.phase,'crashed');assert.equal(recoverRide(run),true);assert.equal(run.x,50);assert.equal(run.score,score);assert.equal(recoverRide(run),false);}
  }
  assert.equal(run.phase,'over');assert.equal(recoverRide(run),false);
});
test('the rigid-body model is frame-rate independent and remains finite on successive trails',()=>{
  const slow=flat(),fast=flat();advance(slow,8,{x:0,y:-1},1/30);advance(fast,8,{x:0,y:-1},1/120);
  for(const key of ['x','y','vx','vy','angle','omega'])assert.ok(Math.abs(slow[key]-fast[key])<1e-6,key);
  for(let level=1;level<=5;level++){
    const run=createRide(level);for(let i=0;i<60*75;i++){
      if(run.phase==='crashed')recoverRide(run);stepRide(run,1/60,{x:Math.sin(i/83)*.35,y:i%1000>900?1:-1});
      for(const key of ['x','y','vx','vy','angle','omega'])assert.ok(Number.isFinite(run[key]),key);
      assert.ok(run.events.length<=24);assert.equal(run.wheels.length,2);
    }
    const axle=localPoint(run,AXLE,-.12);assert.ok(Number.isFinite(axle.x));
  }
});
