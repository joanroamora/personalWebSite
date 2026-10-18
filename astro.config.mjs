import { defineConfig } from 'astro/config';
import { siteConfig } from './site.config.mjs';

export default defineConfig({
  site: siteConfig.site,
  base: siteConfig.base,
  output: 'static',
  trailingSlash: 'always',
});
