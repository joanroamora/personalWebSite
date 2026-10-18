import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspectPage } from './check-quality.mjs';

const canonical = 'https://example.test/site/';
const html = `<!doctype html><html lang="es"><head><title>Una página</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Una descripción"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:title" content="Una página"><meta property="og:description" content="Una descripción"><meta property="og:type" content="website"></head><body><main><h1 id="titulo">Una página</h1><img src="icon.svg" width="16" height="16" alt=""><template><h1 id="titulo">Contenido inerte</h1></template></main></body></html>`;

test('audita la estructura visible sin confundir las plantillas inertes con contenido duplicado', () => {
  assert.deepEqual(inspectPage(html, { canonical }).problems, []);
});

test('detecta metadatos ausentes, IDs repetidos, idioma y dimensiones de imágenes', () => {
  const broken = html.replace('lang="es"', 'lang="en"').replace('name="description"', 'name="otro"').replace(' width="16" height="16" alt=""', '').replace('</main>', '<p id="titulo">Duplicado</p></main>');
  const { problems } = inspectPage(broken, { canonical: `${canonical}otra/` });
  for (const text of ['idioma', 'descripción', 'canónica', 'og:url', 'ID duplicado', 'sin alt', 'sin dimensiones']) {
    assert.ok(problems.some(problem => problem.includes(text)), text);
  }
});

test('una página de error no anuncia una URL canónica válida', () => {
  assert.ok(inspectPage(html, { canonical, isError: true }).problems.some(problem => problem.includes('canónica')));
  const errorPage = html.replace(`<link rel="canonical" href="${canonical}">`, '');
  assert.deepEqual(inspectPage(errorPage, { canonical, isError: true }).problems, []);
});
