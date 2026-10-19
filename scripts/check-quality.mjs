import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { parse } from 'parse5';
import { siteConfig } from '../site.config.mjs';
import { localeInfo, routeContext } from '../src/i18n/locales.ts';

const budgets = { html: 32 * 1024, javascript: 8 * 1024, gameJavascript: 24 * 1024, css: 12 * 1024 };
const content = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(content).join('');
const attributes = node => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));

export function inspectPage(html, { canonical, isError = false, isDemo = true, language = 'es' }) {
  const nodes = [];
  const walk = node => { if (node.tagName) nodes.push(node); for (const child of node.childNodes ?? []) walk(child); };
  walk(parse(html)); // El contenido inerte de <template> se comprueba al abrir sus diálogos en navegador.
  const tags = name => nodes.filter(node => node.tagName === name);
  const metas = tags('meta').map(attributes);
  const links = tags('link').map(attributes);
  const problems = [];
  const title = tags('title').map(content).join('').trim();
  if (tags('title').length !== 1 || !title) problems.push('Debe tener un título de página único y no vacío.');
  if (attributes(tags('html')[0] ?? {}).lang !== language) problems.push('El idioma del documento no coincide con el sitio.');
  if (language === 'ar' && attributes(tags('html')[0] ?? {}).dir !== 'rtl') problems.push('La versión árabe debe indicar dirección rtl.');
  if (tags('main').length !== 1) problems.push('Debe tener un único contenido principal.');
  if (tags('h1').length !== 1 || !content(tags('h1')[0] ?? {}).trim()) problems.push('Debe tener un único h1 no vacío.');
  if (!metas.some(meta => meta.name === 'viewport' && meta.content?.includes('width=device-width'))) problems.push('Falta el viewport adaptable.');
  if (metas.filter(meta => meta.name === 'description' && meta.content?.trim()).length !== 1) problems.push('Falta una descripción única y no vacía.');
  const canonicals = links.filter(link => link.rel === 'canonical');
  if (isError ? canonicals.length !== 0 : canonicals.length !== 1 || canonicals[0].href !== canonical) problems.push('La URL canónica no corresponde a la ruta.');
  if ((isDemo || isError) && !metas.some(meta => meta.name === 'robots' && /\bnoindex\b/.test(meta.content))) problems.push('Una página demo o de error debe indicar noindex.');
  if (!isError && !metas.some(meta => meta.property === 'og:url' && meta.content === canonical)) problems.push('og:url no coincide con la URL canónica.');
  for (const property of ['og:title', 'og:description', 'og:type']) {
    if (!metas.some(meta => meta.property === property && meta.content?.trim())) problems.push(`Falta ${property}.`);
  }
  const ids = new Set();
  for (const node of nodes) {
    const attrs = attributes(node);
    if (attrs.id) {
      if (ids.has(attrs.id)) problems.push(`ID duplicado: ${attrs.id}.`);
      ids.add(attrs.id);
    }
    if (node.tagName === 'img') {
      if (!Object.hasOwn(attrs, 'alt')) problems.push(`Imagen sin alt: ${attrs.src}.`);
      if (!(Number(attrs.width) > 0 && Number(attrs.height) > 0)) problems.push(`Imagen sin dimensiones explícitas: ${attrs.src}.`);
    }
  }
  return {
    title, problems,
    scripts: tags('script').filter(node => !['application/ld+json', 'application/json'].includes(attributes(node).type)).map(node => ({ ...attributes(node), body: content(node) })),
    stylesheets: links.filter(link => link.rel === 'stylesheet').map(link => link.href),
    inlineCSS: tags('style').map(content).join('\n'),
  };
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

export async function checkQuality({ directory, config = siteConfig }) {
  const root = resolve(directory);
  const origin = new URL(config.site).origin;
  const base = `/${config.base.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\//, '/');
  const problems = [], pages = [], titles = new Map(), cache = new Map();
  const asset = async url => {
    if (url.origin !== origin || !url.pathname.startsWith(base)) throw new Error(`Recurso externo o fuera de la base: ${url.href}`);
    const path = resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    const fromRoot = relative(root, path);
    if (isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) throw new Error('El recurso sale del build.');
    if (!cache.has(path)) cache.set(path, readFile(path, 'utf8'));
    return cache.get(path);
  };
  for (const file of await htmlFiles(root)) {
    const path = relative(root, file).split(sep).join('/');
    const url = new URL(`${base}${path.replace(/index\.html$/, '')}`, origin);
    const html = await readFile(file, 'utf8');
    const context = routeContext(url.pathname,base);
    const language = context.locale === 'es' ? config.language : localeInfo(context.locale).tag;
    const page = inspectPage(html, { canonical: url.href, isError: path === '404.html', isDemo: config.isDemo, language });
    for (const problem of page.problems) problems.push(`${path}: ${problem}`);
    const titleKey = `${language}:${page.title}`;
    if (titles.has(titleKey)) problems.push(`${path}: título repetido con ${titles.get(titleKey)}.`);
    titles.set(titleKey, path);
    const modules = new Map();
    const visitModule = async moduleUrl => {
      if (modules.has(moduleUrl.href)) return;
      const code = await asset(moduleUrl);
      modules.set(moduleUrl.href, code);
      await visitImports(code, moduleUrl);
    };
    const visitImports = async (code, sourceUrl) => {
      for (const match of code.matchAll(/\b(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g)) {
        const imported = new URL(match[1], sourceUrl);
        if (/\.m?js$/.test(imported.pathname)) await visitModule(imported);
      }
    };
    try {
      for (const script of page.scripts) {
        if (script.src) await visitModule(new URL(script.src, url));
        else await visitImports(script.body, url);
      }
      const css = await Promise.all(page.stylesheets.map(href => asset(new URL(href, url))));
      const isGame = /^juegos\/(cadete-roa|galactian|rail-crane|torque-trail|blackout-texas|deploy-or-die|packet-runner|orbital-rescue)\/$/.test(context.path);
      const metrics = {
        html: gzipSync(html).length,
        javascript: [...modules.values(), ...page.scripts.filter(script => !script.src).map(script => script.body)].reduce((total, code) => total + gzipSync(code).length, 0),
        css: [...css, page.inlineCSS].filter(Boolean).reduce((total, code) => total + gzipSync(code).length, 0),
      };
      for (const [name, value] of Object.entries(metrics)) {
        const limit = name === 'javascript' && isGame ? budgets.gameJavascript : budgets[name];
        if (value > limit) problems.push(`${path}: ${name} supera el presupuesto gzip (${value} > ${limit} bytes).`);
      }
      pages.push({ path, ...metrics, modules: [...modules.keys()], scriptRoots: page.scripts.filter(script => script.src).map(script => new URL(script.src, url).href) });
    } catch (error) { problems.push(`${path}: ${error.message}`); }
  }
  if (!pages.length) problems.push('No se encontraron páginas HTML para auditar.');
  const home = pages.find(page => page.path === 'index.html');
  for (const id of ['cadete-roa','galactian','rail-crane','torque-trail','blackout-texas','deploy-or-die','packet-runner','orbital-rescue']) {
    const game = pages.find(page => page.path === `juegos/${id}/index.html`);
    if (!home || !game) continue;
    const gameRoots = game.scriptRoots.filter(url => !home.modules.includes(url));
    if (!gameRoots.length) problems.push(`${id} debe conservar su módulo de carga independiente.`);
    for (const page of pages.filter(page => routeContext(`${base}${page.path}`,base).path !== `juegos/${id}/index.html`)) {
      if (gameRoots.some(url => page.modules.includes(url))) problems.push(`${page.path}: carga el motor de ${id} fuera de su ruta.`);
    }
  }
  return { problems, pages, budgets };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkQuality({ directory: fileURLToPath(new URL('../dist/', import.meta.url)) });
    if (result.problems.length) { console.error(result.problems.join('\n')); process.exitCode = 1; }
    else {
      console.log(`Calidad estática: ${result.pages.length} páginas con metadatos, estructura e imágenes correctos; motor de juego aislado.`);
    }
    console.table(result.pages.map(({ path, html, javascript, css }) => ({ ruta: path.replace('/index.html', '/'), 'HTML gzip (B)': html, 'JS gzip (B)': javascript, 'CSS gzip (B)': css })));
  } catch (error) { console.error(`No se pudo auditar dist/: ${error.message}`); process.exitCode = 1; }
}
