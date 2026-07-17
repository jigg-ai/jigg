import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * THE single source of truth for the site. All four views — home, archive
 * (/builds), build detail (/builds/<slug>), and the tools index (/tools) — are
 * derived from this one collection. Adding a build means adding one .mdx file
 * under src/content/builds/; it lights up every view with no page-code changes.
 * The derived queries live in src/lib/builds.ts.
 *
 * This frontmatter mirrors builds/_template/meta.yaml (the canonical, human-facing
 * template) and the two must not drift. Anything richer than these flat facts —
 * the honest-process steps, the test-stat tiles, the reproduce pack, the tool
 * verdict card — is authored in the MDX *body* with the reusable components in
 * src/components/post/ (see src/components/post/README.md).
 */
const builds = defineCollection({
  // The entry id is the filename (website.mdx -> "website"), which is also the
  // /builds/<slug> route param — so `slug` from meta.yaml isn't repeated here.
  loader: glob({ pattern: '**/*.mdx', base: './src/content/builds' }),
  schema: z.object({
    // ---- canonical facts (mirror builds/_template/meta.yaml) ----
    title: z.string(),
    category: z.enum([
      'chatbots', 'video', 'websites', 'automation',
      'writing', 'research', 'design', 'agents',
    ]),
    tool: z.string(),
    tool_version: z.string().optional(),          // e.g. "Botpress v12"
    runs_on_site: z.boolean().default(false),      // -> "Runs on this site" badge
    status: z
      .enum(['draft', 'verified', 'recheck-due', 'archived'])
      .default('draft'),
    summary: z.string(),                           // citation hook / "the short version"
    test_score: z.string().optional(),             // e.g. "25/30"
    affiliate_url: z.string().url().optional(),
    repro_pack: z.boolean().default(false),
    published: z.coerce.date().optional(),
    last_verified: z.coerce.date().optional(),
    pricing_as_of: z.coerce.date().optional(),

    // ---- display + tool-projection helpers (required by the mockups) ----
    featured: z.boolean().default(false),          // pins the home hero
    meta_line: z.string().optional(),              // mono row detail, e.g. "3 evenings · 2 rebuilds"

    // Tool-level fields intentionally live on the build: /tools is a PROJECTION
    // of this collection, not a second source of truth. When several builds share
    // a tool, src/lib/builds.ts uses the most-recent build's values (documented there).
    tool_summary: z.string().optional(),           // e.g. "Chatbot builder · free tier available"
    tool_verdict: z.string().optional(),           // the /tools one-line verdict
    accessibility: z
      .enum(['Beginner-friendly', 'Some setup', 'Advanced'])
      .optional(),
  }),
});

/**
 * Standalone editorial pages (About, and any future ones) authored in Markdown,
 * kept in the content layer so copy lives in one place rather than inside .astro
 * templates. Distinct from `builds`: no build-log fields — just title +
 * description (for <head>) and the Markdown body.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { builds, pages };
