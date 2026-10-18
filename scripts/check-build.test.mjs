import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkBuild } from './check-build.mjs';

async function fixture(t, html) {
  const directory = await mkdtemp(join(tmpdir(), 'personal-web-links-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'icons'));
  await mkdir(join(directory, 'juegos', 'demo'), { recursive: true });
  await writeFile(join(directory, 'icons', 'orbit.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  await writeFile(join(directory, 'juegos', 'demo', 'index.html'), '<h1 id="juego">Demo</h1>');
  await writeFile(join(directory, 'index.html'), html);
  return directory;
}

test('acepta subruta de Pages, recursos, fragmentos y enlaces relativos anidados', async t => {
  const directory = await fixture(t, '<h1 id="contenido">Demo</h1><a href="#contenido">Saltar</a><a href="/personalWebSite/juegos/demo/#juego">Juego</a><img src="/personalWebSite/icons/orbit.svg"><a href="https://example.com">Externo</a>');
  await writeFile(join(directory, 'juegos', 'demo', 'index.html'), '<h1 id="juego">Demo</h1><a href="../../">Inicio</a><a href="#juego">Saltar</a>');
  assert.deepEqual(await checkBuild({ directory, site: 'https://example.test', base: '/personalWebSite/' }), []);
});

test('rechaza rutas sin base, destinos ausentes, fragmentos rotos y enlaces vacíos', async t => {
  const directory = await fixture(t, '<a href="/juegos/">Sin base</a><a href="/personalWebSite/ausente/">Ausente</a><a href="#desconocido">Fragmento</a><a href="">Vacío</a>');
  const problems = await checkBuild({ directory, site: 'https://example.test', base: '/personalWebSite/' });
  assert.equal(problems.length, 4);
  assert.ok(problems.some(problem => problem.includes('falta el prefijo')));
  assert.ok(problems.some(problem => problem.includes('el destino no existe')));
  assert.ok(problems.some(problem => problem.includes('no existe el fragmento')));
  assert.ok(problems.some(problem => problem.includes('el destino está vacío')));
});

test('también admite una publicación en la raíz del dominio', async t => {
  const directory = await fixture(t, '<a href="/">Inicio</a><img src="/icons/orbit.svg">');
  assert.deepEqual(await checkBuild({ directory, site: 'https://example.test', base: '/' }), []);
});
