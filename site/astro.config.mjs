// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static output (default). `site` is a placeholder until the domain is wired at
// deploy time — it feeds canonical URLs and the sitemap.
export default defineConfig({
  site: 'https://jigg.ai',
  integrations: [mdx(), sitemap()],
});
