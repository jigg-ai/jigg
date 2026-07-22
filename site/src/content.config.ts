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
    // Three distinct roles — do not merge them:
    //  1. `tool`        the PRIMARY tool under review. The /tools index key AND the
    //                   affiliate target. Exactly one per build.
    //  2. `built_with`  the production AIs used to MAKE the build.
    //  3. `stack`       supporting tools/services the build runs on.
    // `built_with` and `stack` are display-only: they never create a /tools entry and
    // are never affiliate-linked. That visible link/no-link split is what shows a
    // reader which tool is actually under review, without having to explain it.
    // Bake versions into the strings where they're pinnable and meaningful
    // ("Astro 7.1", "Claude Opus 4.8"); name un-versioned hosted services plainly
    // ("Netlify", "GitHub", "Cloudflare").
    tool: z.string(),
    tool_version: z.string().optional(),          // the primary tool's version for THIS build
    built_with: z.array(z.string()).optional(),   // e.g. ["Claude Opus 4.8", "ChatGPT 5.6"]
    stack: z.array(z.string()).optional(),        // e.g. ["Astro 7.1", "GitHub", "Netlify"]
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
    pricing_as_of: z.coerce.date().optional(),    // dates the tool_plan cost specifically — the only perishable cost fact

    // ---- stack & cost (detail-page metadata, kept separate so a free framework
    //      is NEVER conflated with a paid tool; all optional) ----
    tool_plan: z.string().optional(),             // the primary AI tool's plan, e.g. "Max 20x" — pricing_as_of dates this
    framework: z.string().optional(),             // e.g. "Astro 7.1 — free and open source"
    hosting: z.string().optional(),               // e.g. "Netlify free tier"
    incremental_cost: z.string().optional(),      // net new out-of-pocket cost, e.g. "$0 / month"

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
