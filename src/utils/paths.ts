import { navigation, type SectionId } from '../data/navigation';

/** Prefija también los recursos públicos para que funcionen en GitHub Pages. */
export function withBase(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** Resuelve los enlaces editoriales desde el mismo mapa que genera las páginas. */
export function sectionHref(id: SectionId): string {
  const section = navigation.find(item => item.id === id);
  if (!section) throw new Error(`Sección desconocida: ${id}`);
  return withBase(section.path);
}

export function projectHref(id: string): string {
  return `${sectionHref('projects')}${encodeURIComponent(id)}/`;
}

export function gameHref(id: string): string {
  return `${sectionHref('games')}${encodeURIComponent(id)}/`;
}

export function postHref(slug: string): string {
  return `${sectionHref('blog')}${encodeURIComponent(slug)}/`;
}
