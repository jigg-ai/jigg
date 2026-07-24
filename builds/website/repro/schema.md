# The content schema, annotated

The single source of truth: `site/src/content.config.ts`. Every one of the four views
validates against it at build time, so a bad frontmatter field fails the build rather
than rendering a broken page.

It mirrors `builds/_template/meta.yaml` — the human-facing template — and **the two must
not drift**. If you add a field in one, add it in the other.

## Identity

| Field | Type | Notes |
|---|---|---|
| *(filename)* | — | The `.mdx` filename **is** the slug and the `/builds/<slug>` route. Not repeated in frontmatter. |
| `title` | string, required | |
| `category` | enum, required | `chatbots · video · websites · automation · writing · research · design · agents` |
| `summary` | string, required | The citation hook — self-contained: what it is, worth it or not, the one caveat. |

## The three tool roles — do not merge these

This is the most important part of the schema, and the easiest to get wrong.

| Field | Type | Role |
|---|---|---|
| `tool` | string, required | The **primary tool under review**. Exactly one per build. The `/tools` index key **and** the affiliate target. |
| `tool_version` | string, optional | The primary tool's version *for this build*. Omit for un-versioned hosted services. **Never guess it** — it's a published factual claim. |
| `built_with` | string[], optional | The production AIs used to **make** the build. Display-only. |
| `stack` | string[], optional | Supporting tools/services the build **runs on**. Display-only. |

`built_with` and `stack` never create a `/tools` entry and are **never affiliate-linked**.
That visible link/no-link split is what shows a reader which tool is actually under
review without needing a paragraph to explain it. Verified in the rendered stamp on
build #2: the primary tool is the only anchor, carrying `rel="sponsored nofollow noopener"`.

Bake versions into the strings where they're pinnable and meaningful (`"Astro 7.1"`,
`"Claude Opus 4.8"`); name un-versioned hosted services plainly (`"Netlify"`, `"GitHub"`).

## Freshness and trust

| Field | Type | Notes |
|---|---|---|
| `status` | enum, default `draft` | `draft · verified · recheck-due · archived`. `draft` is a real gate — filtered out of production builds. |
| `runs_on_site` | boolean, default false | The "Runs on this site" badge. Only true when the artifact is *actually live in production now*. |
| `published` | date, optional | |
| `last_verified` | date, optional | |
| `pricing_as_of` | date, optional | Dates the primary tool's cost — the only perishable cost fact. |
| `test_score` | string, optional | e.g. `"26/30"`. Leave **empty** rather than claim an unrun test. |
| `affiliate_url` | url, optional | Validated as a real URL by zod. |
| `repro_pack` | boolean, default false | ⚠️ Currently defined but read nowhere in `site/src/` — see BACKLOG. |

## Display and tool projection

| Field | Type | Notes |
|---|---|---|
| `featured` | boolean, default false | Pins the home hero. Promoting a new build demotes the previous one. |
| `meta_line` | string, optional | Short mono detail on index rows, e.g. `"one collection → four views"`. |
| `tool_summary` | string, optional | e.g. `"AI pair-builder in your terminal"`. |
| `tool_verdict` | string, optional | The plain one-line verdict shown on `/tools`. No star ratings, anywhere. |
| `accessibility` | enum, optional | `Beginner-friendly · Some setup · Advanced`. |

The tool-level fields live on the **build** on purpose: `/tools` is a projection of this
collection, not a second source of truth. When several builds share a tool, the
most-recent build's `tool_*` values win (`site/src/lib/builds.ts`).

## Anything richer than these flat facts

Goes in the MDX **body**, composed from `site/src/components/post/` — the honest-process
steps, stat tiles, the reproduce section, the verdict card. Frontmatter stays flat so it
stays diffable and validatable; the body absorbs the per-build variability.
