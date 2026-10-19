import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
    // El archivo identifica la ficha; el slug editorial conserva su enlace permanente.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1).optional(),
    series: z.string().trim().min(1).optional(),
    takeaway: z.string().trim().min(1).optional(),
    cover: z.object({ src: image(), alt: z.string().trim().min(1), caption: z.string().trim().min(1) }).optional(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Usa minúsculas, números y guiones en el slug.'),
    date: z.iso.date().transform(value => new Date(`${value}T00:00:00Z`)),
    summary: z.string().trim().min(1),
    status: z.enum(['draft', 'demo', 'published']),
    tags: z.array(z.string().trim().min(1)).default([]),
  }),
});

export const collections = { blog };
