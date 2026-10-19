import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { formatPostDate, postDateISO, selectPosts, postNeighbors, readingMinutes } from '../src/utils/blog.ts';

const post = (slug, status, date) => ({ data: { slug, status, date: new Date(`${date}T00:00:00Z`) } });

test('el mismo conjunto visible alimenta las rutas, el índice y la última entrada', () => {
  const posts = [
    post('publicada', 'published', '2026-10-01'),
    post('muestra', 'demo', '2026-10-02'),
    post('borrador', 'draft', '2026-10-03'),
  ];
  assert.deepEqual(selectPosts(posts, true).map(p => p.data.slug), ['publicada', 'muestra']);
  assert.deepEqual(selectPosts(posts, false).map(p => p.data.slug), ['publicada']);
  assert.deepEqual(selectPosts(posts.slice(1), false), []);
  assert.deepEqual(posts.map(p => p.data.slug), ['publicada', 'muestra', 'borrador']);
});

test('los enlaces permanentes duplicados fallan y el orden entre fechas iguales es estable', () => {
  assert.throws(() => selectPosts([
    post('repetido', 'demo', '2026-10-01'),
    post('repetido', 'draft', '2026-10-02'),
  ], true), /Slug de blog duplicado: repetido/);
  const sameDate = ['zeta', 'alfa'].map(slug => post(slug, 'published', '2026-10-01'));
  assert.deepEqual(selectPosts(sameDate, false).map(p => p.data.slug), ['alfa', 'zeta']);
});

test('las fechas editoriales conservan el día al formatearlas fuera de UTC', () => {
  const date = new Date('2026-10-01T00:00:00Z');
  assert.equal(postDateISO(date), '2026-10-01');
  assert.equal(formatPostDate(date), '1 de octubre de 2026');
});

test('anterior y siguiente no mezclan ensayos publicados con pruebas de formato',()=>{
 const entries=selectPosts([post('publicada-a','published','2026-10-18'),post('demo','demo','2026-10-17'),post('publicada-b','published','2026-10-16')],true);
 assert.equal(postNeighbors(entries,entries[0]).older.data.slug,'publicada-b');assert.equal(postNeighbors(entries,entries[1]).newer.data.slug,'publicada-a');
 assert.deepEqual(postNeighbors(entries,entries[2]),{newer:undefined,older:undefined});assert.deepEqual(postNeighbors(entries,post('ausente','published','2026-10-18')),{});
});

test('la estimación de lectura omite código y no convierte URLs en palabras extra',()=>{
 assert.equal(readingMinutes(''),1);assert.equal(readingMinutes('```js\n'+Array(900).fill('código').join(' ')+'\n```'),1);
 assert.equal(readingMinutes(Array(401).fill('[palabra](https://example.test/ruta)').join(' ')),3);
});

test('los dos ensayos tienen portada original, metadatos reales, apartados y fuentes',()=>{
 for(const [file,image] of [['anatomia-tragamonedas','tragamonedas-de-bolsillo'],['el-espejo-programado','el-espejo-programado']]){
  const raw=readFileSync(new URL(`../src/content/blog/${file}.md`,import.meta.url),'utf8');assert.match(raw,/^status: published$/m);assert.match(raw,/^date: '2026-10-18'$/m);assert.match(raw,/^  alt: '.+'$/m);assert.match(raw,/^  caption: '.+'$/m);
  assert.ok((raw.match(/^## /gm)??[]).length>=7);assert.ok((raw.match(/\]\(https:\/\//g)??[]).length>=5);assert.ok(readingMinutes(raw)>=5);assert.match(raw,/Fuentes y alcance/);
  const bytes=readFileSync(new URL(`../src/assets/blog/${image}.png`,import.meta.url));assert.equal(bytes.toString('ascii',1,4),'PNG');assert.equal(bytes.readUInt32BE(16),1536);assert.equal(bytes.readUInt32BE(20),1024);
 }
});
