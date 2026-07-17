// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static output (default). `site` feeds canonical URLs and the sitemap, so it
// must match where the site is actually served — the live custom domain.
export default defineConfig({
  site: 'https://jigg.ai',
  integrations: [mdx(), sitemap()],
});
