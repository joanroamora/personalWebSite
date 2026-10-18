/** Prefija también los recursos públicos para que funcionen en GitHub Pages. */
export function withBase(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}
