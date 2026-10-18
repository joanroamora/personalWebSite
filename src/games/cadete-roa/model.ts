/** Fixed-step simulation. Coordinates are metres; +Z is down the track. */
export const LANES = [-2.15, 0, 2.15] as const;
export const STEP = 1 / 60;
export type ObstacleKind = 'grenade' | 'trench' | 'container' | 'tank';
export interface Obstacle { kind: ObstacleKind; lane: number; z: number; passed: boolean }
export interface Token { lane: number; z: number; collected: boolean }
export interface Runner {
  lane: number; x: number; y: number; velocity: number; grounded: boolean;
  coyote: number; jumpBuffer: number;
}
export interface Run {
  phase: 'ready' | 'running' | 'paused' | 'over';
  distance: number; elapsed: number; speed: number; tokens: number; passed: number;
  player: Runner; obstacles: Obstacle[]; pickups: Token[];
  nextRow: number; rows: number; seed: number; reason: ObstacleKind | null;
}
export const shapes: Record<ObstacleKind, { width: number; depth: number; height: number }> = {
  grenade: { width: .8, depth: .8, height: .68 },
  trench: { width: 1.95, depth: 4.2, height: 0 },
  container: { width: 1.8, depth: 3.6, height: 1.2 },
  tank: { width: 1.85, depth: 4.3, height: 1.7 },
};

export function createRun(seed = Math.floor(Math.random() * 0xffffffff)): Run {
  return {
    phase: 'ready', distance: 0, elapsed: 0, speed: 10, tokens: 0, passed: 0,
    player: { lane: 1, x: 0, y: 0, velocity: 0, grounded: true, coyote: .1, jumpBuffer: 0 },
    obstacles: [{ kind: 'grenade', lane: 1, z: 42, passed: false }],
    pickups: [{ lane: 0, z: 32, collected: false }],
    nextRow: 64, rows: 1, seed: seed || 1, reason: null,
  };
}

function random(run: Run): number {
  run.seed ^= run.seed << 13; run.seed ^= run.seed >>> 17; run.seed ^= run.seed << 5;
  return (run.seed >>> 0) / 0x100000000;
}

function spawnRow(run: Run): void {
  const safe = Math.floor(random(run) * 3);
  const kinds: ObstacleKind[] = ['trench', 'container', 'tank', 'grenade'];
  // Every row reserves one unobstructed lane. No overlapping, impossible walls.
  const occupied = [0, 1, 2].filter(lane => lane !== safe);
  for (const lane of occupied) {
    if (lane === occupied[1] && random(run) < .32) continue;
    const kind = kinds[(run.rows + lane) % kinds.length];
    run.obstacles.push({ kind, lane, z: run.nextRow - run.distance, passed: false });
  }
  run.pickups.push({ lane: safe, z: run.nextRow - run.distance + 3, collected: false });
  run.rows++;
  run.nextRow += 22 + random(run) * 6;
}

export function move(run: Run, direction: number): void {
  if (run.phase === 'running') run.player.lane = Math.max(0, Math.min(2, run.player.lane + direction));
}

export function jump(run: Run): void {
  if (run.phase === 'running') run.player.jumpBuffer = .15;
}

export function score(run: Run): number { return Math.floor(run.distance) + run.tokens * 25; }

export function step(run: Run, dt = STEP): void {
  if (run.phase !== 'running') return;
  const p = run.player;
  run.elapsed += dt;
  run.speed = Math.min(18, 10 + run.distance / 240);
  const advance = run.speed * dt;
  run.distance += advance;
  while (run.nextRow - run.distance < 95) spawnRow(run);
  for (const obstacle of run.obstacles) obstacle.z -= advance;
  for (const token of run.pickups) token.z -= advance;
  run.obstacles = run.obstacles.filter(o => o.z > -12);
  run.pickups = run.pickups.filter(t => t.z > -8 && !t.collected);
  p.x += (LANES[p.lane] - p.x) * Math.min(1, dt * 17);
  p.coyote = p.grounded ? .1 : Math.max(0, p.coyote - dt);
  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  if (p.jumpBuffer > 0 && p.coyote > 0) {
    p.velocity = 12; p.grounded = false; p.coyote = 0; p.jumpBuffer = 0;
  }
  const previousY = p.y;
  p.velocity -= 24 * dt;
  p.y += p.velocity * dt;
  let floor = 0;
  let gap = false;
  for (const obstacle of run.obstacles) {
    const shape = shapes[obstacle.kind];
    const inLane = Math.abs(p.x - LANES[obstacle.lane]) < shape.width / 2 + .22;
    const inDepth = Math.abs(obstacle.z) < shape.depth / 2 + .18;
    if (!obstacle.passed && obstacle.z < -shape.depth / 2 - .5) { obstacle.passed = true; run.passed++; }
    if (!inLane || !inDepth) continue;
    if (obstacle.kind === 'trench') { gap = true; continue; }
    if (obstacle.kind === 'grenade') {
      if (p.y < shape.height) { run.phase = 'over'; run.reason = 'grenade'; }
    } else if (previousY >= shape.height - .16) {
      floor = Math.max(floor, shape.height);
    } else if (p.y < shape.height - .08) {
      run.phase = 'over'; run.reason = obstacle.kind;
    }
  }
  if (gap && floor === 0) floor = -8;
  p.grounded = p.y <= floor && p.velocity <= 0;
  if (p.grounded) { p.y = floor; p.velocity = 0; }
  if (p.y < -.65) { run.phase = 'over'; run.reason = 'trench'; }
  for (const token of run.pickups) {
    if (!token.collected && Math.abs(token.z) < .8 && Math.abs(p.x - LANES[token.lane]) < .8 && p.y < 2.6) {
      token.collected = true; run.tokens++;
    }
  }
}
