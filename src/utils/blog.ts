export interface PostData {
  slug: string;
  date: Date;
  status: 'draft' | 'demo' | 'published';
}

/** Una sola política para portada, índice, rutas y navegación entre entradas. */
export function selectPosts<T extends { data: PostData }>(posts: readonly T[], isDemo: boolean): T[] {
  const slugs = new Set<string>();
  for (const { data } of posts) {
    if (slugs.has(data.slug)) throw new Error(`Slug de blog duplicado: ${data.slug}`);
    slugs.add(data.slug);
  }
  return posts
    .filter(({ data }) => data.status === 'published' || (isDemo && data.status === 'demo'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.slug.localeCompare(b.data.slug, 'es'));
}

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function postDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Estimación orientativa calculada en el build, sin código en el navegador. */
export function readingMinutes(body = ''): number {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>|~]/g, ' ');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}
