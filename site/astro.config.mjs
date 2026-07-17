// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static output (default). `site` feeds canonical URLs and the sitemap, so it
// must match where the site is actually served. Update to https://jigg.ai (or
// whatever custom domain is chosen) once that domain is connected in Netlify.
export default defineConfig({
  site: 'https://candid-gingersnap-6c4b87.netlify.app',
  integrations: [mdx(), sitemap()],
});
