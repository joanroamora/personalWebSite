import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatPostDate, postDateISO, selectPosts } from '../src/utils/blog.ts';

const post = (slug, status, date) => ({ data: { slug, status, date: new Date(`${date}T00:00:00Z`) } });

test('el mismo conjunto visible alimenta las rutas, el índice y la última entrada', () => {
  const posts = [
    post('publicada', 'published', '2026-10-01'),
    post('muestra', 'demo', '2026-10-02'),
    post('borrador', 'draft', '2026-10-03'),
  ];
  assert.deepEqual(selectPosts(posts, true).map(p => p.data.slug), ['muestra', 'publicada']);
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
