import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRun, jump, move, score, step, STEP } from '../src/games/cadete-roa/model.ts';

function course(kind, z = 4) {
  const run = createRun(123);
  run.phase = 'running'; run.nextRow = 100_000; run.pickups = [];
  run.obstacles = kind ? [{ kind, lane:1, z, passed:false }] : [];
  return run;
}
function advance(run, seconds) { for (let i=0; i<Math.round(seconds/STEP); i++) step(run); }

test('all four hazards end an unavoided run; jumping clears a grenade and trench', () => {
  for (const kind of ['grenade','trench','container','tank']) {
    const run = course(kind); advance(run,1);
    assert.equal(run.phase,'over',kind); assert.equal(run.reason,kind);
  }
  for (const kind of ['grenade','trench']) {
    const run = course(kind,4.5); jump(run); advance(run,1.2);
    assert.equal(run.phase,'running',kind); assert.equal(run.player.y,0);
    assert.equal(run.passed,1);
  }
});

test('a jump lands on both platform types and can jump off again', () => {
  for (const [kind,height,z] of [['container',1.2,8.6],['tank',1.7,8]]) {
    const run = course(kind,z); jump(run);
    let landed = false;
    for (let i=0; i<65; i++) {
      step(run);
      if (run.player.grounded && run.player.y === height) { landed = true; break; }
    }
    assert.equal(run.phase,'running',kind); assert.equal(landed,true,kind);
    jump(run); step(run); assert.ok(run.player.velocity>0); assert.ok(run.player.y>height);
  }
});

test('lane controls are bounded, a lane change avoids an obstacle, and air jumps are rejected', () => {
  const run = course('tank'); move(run,-1); move(run,-1);
  assert.equal(run.player.lane,0); advance(run,.8); assert.equal(run.phase,'running');
  move(run,1); move(run,1); move(run,1); assert.equal(run.player.lane,2);
  const airborne = course(null); jump(airborne); advance(airborne,.3);
  const velocity = airborne.player.velocity; jump(airborne); step(airborne);
  assert.ok(airborne.player.velocity<velocity);
});

test('pause freezes the simulation and a token adds 25 score without external state', () => {
  const run = course(null); run.pickups = [{ lane:1,z:.5,collected:false }]; step(run);
  assert.equal(run.tokens,1); assert.equal(score(run),Math.floor(run.distance)+25);
  run.phase = 'paused'; const snapshot = structuredClone(run); advance(run,5);
  assert.deepEqual(run,snapshot);
});

test('long runs remain bounded, difficulty is capped, and every generated row has an open lane', () => {
  const run = createRun(456); run.phase = 'running';
  const seen = new Map();
  for (let i=0; i<22_000; i++) {
    // High-altitude observer tests generation independently from collisions.
    run.player.y = 20; run.player.velocity = 0;
    step(run);
    for (const obstacle of run.obstacles) {
      const row = Math.round((run.distance+obstacle.z)*100);
      if (!seen.has(row)) seen.set(row,new Set());
      seen.get(row).add(obstacle.lane);
    }
    assert.ok(run.obstacles.length<20); assert.ok(run.pickups.length<10);
  }
  assert.equal(run.phase,'running'); assert.equal(run.speed,18); assert.ok(run.distance>5000);
  for (const lanes of seen.values()) assert.ok(lanes.size<=2);
  const a = createRun(987), b = createRun(987); a.phase = b.phase = 'running';
  advance(a,2); advance(b,2); assert.deepEqual(a,b);
});
