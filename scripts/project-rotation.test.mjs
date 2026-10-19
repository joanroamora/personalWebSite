import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, readdir, stat } from 'node:fs/promises';
import { projects } from '../src/data/projects.ts';
import { shuffledProjects } from '../src/utils/project-rotation.ts';

test('la bolsa aleatoria incluye todo el catálogo sin duplicados ni repetición inmediata', () => {
  const ids = projects.map(project => project.id);
  const original = [...ids];
  for (const random of [() => 0, () => .5, () => .999999]) {
    let current = 'pdf-roar';
    for (let round = 0; round < 10; round++) {
      const queue = shuffledProjects(ids, current, random);
      assert.equal(queue.length, 26);
      assert.equal(new Set(queue).size, 26);
      assert.ok(!queue.includes(current));
      assert.deepEqual([...queue, current].sort(), [...ids].sort());
      current = queue.at(-1);
    }
  }
  assert.deepEqual(ids, original);
  assert.deepEqual(shuffledProjects([], 'absent'), []);
  assert.deepEqual(shuffledProjects(['one', 'one'], 'one'), []);
});

test('cada proyecto aprobado tiene una ilustración propia optimizada y un prompt documentado', async () => {
  const directory = new URL('../src/assets/projects/', import.meta.url);
  const manifest = JSON.parse(await readFile(new URL('../docs/portfolio-artwork.json', import.meta.url), 'utf8'));
  const assets = (await readdir(directory)).filter(name => name.endsWith('.webp')).sort();
  assert.deepEqual(assets, projects.map(project => `${project.id}.webp`).sort());
  assert.equal(manifest.mode, 'built-in image_gen');
  assert.equal(manifest.assets.length, projects.length);
  assert.ok(manifest.basePrompt.includes('Leonardo da Vinci'));
  for (const project of projects) {
    const asset = manifest.assets.find(asset => asset.id === project.id);
    assert.ok(asset?.subject && asset?.description && asset?.sourceFile);
    assert.equal(asset.path, `src/assets/projects/${project.id}.webp`);
    const path = new URL(`${project.id}.webp`, directory);
    const bytes = await readFile(path);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.ok((await stat(path)).size < 800_000, 'Fuente WebP por debajo de 800 KB.');
  }
});
