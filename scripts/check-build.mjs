import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { siteConfig } from '../site.config.mjs';

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function inspectDocument(html) {
  const ids = new Set();
  const links = [];
  function visit(node) {
    for (const attribute of node.attrs ?? []) {
      if (attribute.name === 'id') ids.add(attribute.value);
      if (['href', 'src', 'poster', 'action'].includes(attribute.name)) {
        links.push(attribute.value);
      }
      if (attribute.name === 'srcset' && !attribute.value.startsWith('data:')) {
        links.push(...attribute.value.split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
      }
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return { ids, links };
}

/** Verifica HTML generado, recursos locales y fragmentos sin consultar sitios externos. */
export async function checkBuild({ directory, site, base }) {
  const root = resolve(directory);
  const origin = new URL(site).origin;
  const prefix = `/${base.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\//, '/');
  const documents = new Map();
  const problems = [];
  const files = await htmlFiles(root);
  if (!files.length) return ['No se encontraron páginas HTML en el build.'];

  async function document(path) {
    if (!documents.has(path)) documents.set(path, inspectDocument(await readFile(path, 'utf8')));
    return documents.get(path);
  }

  for (const file of files) {
    const localPath = relative(root, file).split(sep).join('/');
    const pageUrl = new URL(`${prefix}${localPath.replace(/index\.html$/, '')}`, origin);
    for (const reference of (await document(file)).links) {
      const report = message => problems.push(`${localPath}: ${reference || '(enlace vacío)'} — ${message}`);
      if (!reference.trim()) { report('el destino está vacío'); continue; }
      try {
        const url = new URL(reference, pageUrl);
        if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) continue;
        if (!url.pathname.startsWith(prefix)) { report(`falta el prefijo ${prefix}`); continue; }

        const target = resolve(root, decodeURIComponent(url.pathname.slice(prefix.length)));
        const fromRoot = relative(root, target);
        if (fromRoot.startsWith(`..${sep}`) || fromRoot === '..' || isAbsolute(fromRoot)) {
          report('el destino sale del directorio generado'); continue;
        }
        let resolvedTarget = target;
        if ((await stat(target)).isDirectory()) resolvedTarget = resolve(target, 'index.html');
        if (!(await stat(resolvedTarget)).isFile()) { report('el destino no es un archivo'); continue; }
        if (url.hash && resolvedTarget.endsWith('.html')) {
          const fragment = decodeURIComponent(url.hash.slice(1));
          // Los fragmentos de texto del navegador no corresponden a un id HTML.
          if (!fragment.startsWith(':~:text=') && !(await document(resolvedTarget)).ids.has(fragment)) {
            report(`no existe el fragmento #${fragment}`);
          }
        }
      } catch (error) {
        report(error.code === 'ENOENT' ? 'el destino no existe' : error.message);
      }
    }
  }
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const problems = await checkBuild({ directory: resolve(root, 'dist'), site: siteConfig.site, base: siteConfig.base });
    if (problems.length) {
      console.error(problems.join('\n'));
      process.exitCode = 1;
    } else {
      console.log('Build verificado: rutas, recursos y fragmentos locales correctos.');
    }
  } catch (error) {
    console.error(`No se pudo verificar dist/: ${error.message}`);
    process.exitCode = 1;
  }
}
