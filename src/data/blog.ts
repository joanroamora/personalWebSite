import { getCollection } from 'astro:content';
import { siteConfig } from '../../site.config.mjs';
import { selectPosts } from '../utils/blog';

export async function getBlogPosts() {
  return selectPosts(await getCollection('blog'), siteConfig.isDemo);
}
