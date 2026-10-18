import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parsePublicProfile } from '../src/utils/profile.ts';

const source = readFileSync(new URL('../docs/PERFIL_PUBLICO.md', import.meta.url), 'utf8');

test('el perfil conserva biografía, experiencias, formación y canales del Markdown', () => {
  const profile = parsePublicProfile(source);
  assert.ok(source.includes(profile.name));
  for (const paragraph of [...profile.biography, ...profile.practice, ...profile.experience.flatMap(entry => entry.paragraphs)]) assert.ok(source.includes(paragraph));
  for (const entry of [...profile.education, ...profile.certifications]) {
    assert.ok(source.includes(entry.title));
    assert.ok(source.includes(entry.description));
  }
  for (const channel of profile.contact.channels) assert.ok(source.includes(channel.href));
  assert.deepEqual(parsePublicProfile(source.replace(/\r?\n/g, '\r\n')), profile);
});

test('una edición del documento actualiza los datos sin otra copia de identidad o correo', () => {
  const originalEmail = parsePublicProfile(source).contact.channels.find(channel => channel.title === 'Correo').href.slice('mailto:'.length);
  const edited = source.replace(/^- \*\*Nombre visible:\*\* .+$/m, '- **Nombre visible:** Nombre editado.').replaceAll(originalEmail, 'publico@example.com');
  const profile = parsePublicProfile(edited);
  assert.equal(profile.name, 'Nombre editado');
  assert.equal(profile.contact.channels[0].href, 'mailto:publico@example.com');
});

test('un apartado ausente o un destino de contacto no permitido impiden generar información incompleta', () => {
  assert.throws(() => parsePublicProfile(source.replace('## Sobre mí', '## Otra sección')), /falta el apartado «Sobre mí»/);
  assert.throws(() => parsePublicProfile(source.replace(/^(- \*\*LinkedIn:\*\* \[[^\]]+\]\()[^)]+(\))$/m, '$1javascript:alert(1)$2')), /enlace público inválido/);
});
