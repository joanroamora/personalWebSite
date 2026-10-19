import { readFileSync } from 'node:fs';
import { parsePublicProfile } from './src/utils/profile.ts';

// Los comandos del proyecto y los workflows se ejecutan desde su raíz.
// No usar import.meta.url aquí: Astro reubica este módulo al prerenderizar.
const profile = parsePublicProfile(readFileSync('docs/PERFIL_PUBLICO.md', 'utf8'));

// La URL depende del nombre del repositorio remoto, no del directorio local.
export const siteConfig = Object.freeze({
  site: 'https://joanroamora.github.io',
  base: '/personalWebSite/',
  repository: 'https://github.com/joanroamora/personalWebSite',
  title: profile.name,
  description: `${profile.summary} Código, juegos y textos de ${profile.name}.`,
  language: 'es',
  isDemo: true,
});
