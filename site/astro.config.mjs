// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static output (default). `site` feeds canonical URLs and the sitemap, so it
// must match where the site is actually served — the live custom domain.
export default defineConfig({
  site: 'https://jigg.ai',
  integrations: [mdx(), sitemap()],
  // Code blocks render in the site's own neutral palette instead of a syntax
  // theme: the palette rule is one brand warmth + green for status, nothing else.
  markdown: { syntaxHighlight: false },
});
