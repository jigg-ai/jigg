// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ---------------------------------------------------------------------------
// sitemap `lastmod`
// ---------------------------------------------------------------------------
// Google deprecated the sitemap ping endpoint in 2023 and named `lastmod` as its
// replacement freshness signal, so without this the site gives crawlers no hint
// at all. @astrojs/sitemap omits `lastmod` unless a `serialize` supplies it.
//
// THE RULE THAT MATTERS: a `lastmod` is a claim that the page changed. Stamp the
// build time onto every URL and every deploy claims every page changed — Google
// detects that pattern and starts discounting the field, which is strictly worse
// than never having added it. So a URL gets a date only where a real one exists:
//
//   /builds/<slug>/   max(published, last_verified) from that build's frontmatter.
//   /, /builds/, /tools/
//                     the newest live build's date. These three are GENERATED from
//                     the builds collection (hero, archive, tool projection), so a
//                     new build genuinely rewrites them — this is a real date, not
//                     a proxy for one.
//   everything else   NO lastmod. /about, /privacy, /affiliate-disclosure and
//                     /subscribe are hand-edited Markdown with no date anywhere in
//                     the repo, and file mtime is the build's checkout time, i.e.
//                     exactly the lie described above. `lastmod` is optional in the
//                     protocol; omitting it is the honest answer.
//
// Frontmatter is read off disk rather than through the content collection because
// astro.config.mjs is plain Node and cannot import `astro:content`. Only the four
// date/status fields are needed, so a scan of the frontmatter block beats a YAML
// dependency (CLAUDE.md: keep dependencies light).
const BUILDS_DIR = fileURLToPath(new URL('./src/content/builds', import.meta.url));

/** Reads one scalar out of a frontmatter block, tolerating optional quotes. */
function field(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:[ \\t]*"?([^"\\n#]+?)"?[ \\t]*$`, 'm'));
  return m ? m[1].trim() : undefined;
}

/** Map of `/builds/<slug>/` -> { lastmod, draft }, for every build file on disk. */
function readBuildDates() {
  const out = new Map();
  for (const file of readdirSync(BUILDS_DIR)) {
    if (!file.endsWith('.mdx')) continue;
    // Frontmatter only — a body line starting "published:" must not be picked up.
    const frontmatter = readFileSync(join(BUILDS_DIR, file), 'utf8').split(/^---\s*$/m)[1] ?? '';
    const times = ['published', 'last_verified']
      .map((k) => field(frontmatter, k))
      .filter(Boolean)
      .map((s) => new Date(s).getTime())
      .filter((t) => !Number.isNaN(t));
    // An undated build gets no lastmod rather than a guessed one.
    if (times.length === 0) continue;
    out.set(`/builds/${file.replace(/\.mdx$/, '')}/`, {
      lastmod: new Date(Math.max(...times)),
      draft: (field(frontmatter, 'status') ?? 'draft') === 'draft',
    });
  }
  return out;
}

const BUILD_DATES = readBuildDates();

// Drafts are excluded: they don't appear on the live home/archive/tools pages, so
// they can't be what last changed them.
const liveTimes = [...BUILD_DATES.values()].filter((b) => !b.draft).map((b) => b.lastmod.getTime());
const NEWEST_LIVE_BUILD = liveTimes.length ? new Date(Math.max(...liveTimes)) : undefined;

/** Routes whose content is derived from the builds collection. */
const DERIVED_ROUTES = new Set(['/', '/builds/', '/tools/']);

// Static output (default). `site` feeds canonical URLs and the sitemap, so it
// must match where the site is actually served — the live custom domain.
export default defineConfig({
  site: 'https://jigg.ai',
  // /subscribed is a transactional confirmation landing (Buttondown's
  // "After confirming" redirect) — noindex'd and kept out of the sitemap.
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/subscribed'),
      serialize(item) {
        // Normalise to the trailing-slash form the keys above use, so this does
        // not silently stop matching if the trailingSlash config ever changes.
        const path = new URL(item.url).pathname.replace(/\/?$/, '/');
        const build = BUILD_DATES.get(path);
        if (build) return { ...item, lastmod: build.lastmod.toISOString() };
        if (DERIVED_ROUTES.has(path) && NEWEST_LIVE_BUILD) {
          return { ...item, lastmod: NEWEST_LIVE_BUILD.toISOString() };
        }
        return item; // no defensible date -> no lastmod
      },
    }),
  ],
  // Code blocks render in the site's own neutral palette instead of a syntax
  // theme: the palette rule is one brand warmth + green for status, nothing else.
  markdown: { syntaxHighlight: false },
});
