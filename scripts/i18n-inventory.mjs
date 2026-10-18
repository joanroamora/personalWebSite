import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'parse5';

const texts = new Set();
function walk(node) {
  if (['script', 'style', 'svg'].includes(node.tagName)) return;
  if (node.nodeName === '#text') {
    const text = node.value.trim().replace(/\s+/g, ' ');
    if (/[a-zA-ZÀ-ÿ]/.test(text)) texts.add(text);
  }
  for (const child of node.childNodes ?? []) walk(child);
  if (node.content) walk(node.content);
}
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory() && !['en', 'zh', 'hi', 'ar', 'fr'].includes(entry.name)) await scan(path);
    else if (entry.name.endsWith('.html')) walk(parse(await readFile(path, 'utf8')));
  }
}
await scan('dist');
const limit = Number(process.argv[2] ?? 140);
console.log([...texts].filter(text => text.length <= limit).sort().join('\n'));
console.log(`Total: ${texts.size} segmentos; ${[...texts].reduce((sum, text) => sum + text.length, 0)} caracteres.`);
