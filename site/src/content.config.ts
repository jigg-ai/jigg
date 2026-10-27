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
const timeSpent = z
  .object({
    // nullish: the template's empty `minutes:` is YAML null, not absent.
    minutes: z.number().int().nonnegative().nullish(),
    basis: z.enum(['measured', 'estimated', 'unavailable']),
  })
  .refine((t) => t.basis === 'unavailable' || t.minutes != null, {
    message: 'minutes is required unless basis is "unavailable"',
  });

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
    pricing_as_of: z.coerce.date().optional(),    // dates the primary tool's cost — the only perishable cost fact

    // ---- time and cost (CONTEXT §5) — recorded from build #5 on, never backfilled ----
    // Human time (directing, reviewing) and agent time (how long the AI ran) are
    // different measures, and the AI-acceleration claim lives in the gap between
    // them, so they're kept apart. Each carries its basis; "unavailable" is an
    // honest value, a reconstructed number is not.
    human_time: timeSpent.optional(),
    agent_time: timeSpent.optional(),
    // Listed, not summed: a monthly plan isn't a per-build cost.
    paid_plans: z
      .array(
        z.object({
          tool: z.string(),                          // e.g. "HeyGen"
          plan: z.string(),                          // e.g. "Creator"
          price: z.string(),                         // e.g. "US$32.06 incl. tax"
          period: z.enum(['month', 'year', 'one-off']),
        }),
      )
      .optional(),

    // ---- display + tool-projection helpers (required by the mockups) ----
    featured: z.boolean().default(false),          // pins the home hero
    meta_line: z.string().optional(),              // mono row detail, e.g. "3 evenings · 2 rebuilds"
    // Artifact-preview source for video builds: the YouTube embed ID lives HERE
    // (one place to update if a re-render changes it), read by the VideoEmbed
    // component in the build's MDX body. Optional — only video builds set it.
    video_id: z.string().optional(),               // e.g. "gIMQJcLP6L4"

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

/**
 * The studio's services (CONTEXT §16). One entry per pillar; `order` fixes their
 * sequence on /services and the home page. Every service names its evidence, and
 * evidence that points at a build references it by id, so the link and its title
 * come from the builds collection and can't drift from it. `note` is where the
 * attribution caveat goes (e.g. "internal builds, not client engagements").
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    summary: z.string(),
    scope: z.array(z.string()),
    evidence: z.array(
      z.union([
        z.object({ build: z.string() }),             // a build id, e.g. "website"
        z.object({ text: z.string(), href: z.string().optional() }), // evidence that isn't a build
      ]),
    ),
    note: z.string().optional(),
  }),
});

export const collections = { builds, pages, services };
