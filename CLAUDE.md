# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Jigg.AI is a build-in-public project: real artifacts built with AI tools, documented
honestly (tested, timed, reproducible), published as build logs. The site that
publishes them is itself build #1, and is built with the tools it reviews. **The repo
is the durable source of truth** — chats/sessions are scratchpads. Log decisions and
process into the files described below, not just into conversation.

Read in this order before doing substantive work:
1. [`CONTEXT.md`](CONTEXT.md) — the what/why, canonical source of truth for the product.
2. [`PROCESS.md`](PROCESS.md) — the repeatable build pipeline (below).
3. [`STYLE.md`](STYLE.md) — house voice for anything published.
4. [`site/BRIEF.md`](site/BRIEF.md) — the spec for the site build specifically.

Current state: the Astro site under `site/` **is scaffolded** (build #1) — the `builds`
collection, the four views, the MDX authoring kit, and one real entry
(`site/src/content/builds/website.mdx`) all exist and build clean. Not yet done:
deployed to a live URL, Lighthouse pass, formal a11y audit, and the human verify pass
(PROCESS step 5). See `builds/website/test.md` for exactly which checks have and
haven't been run. When extending the site, follow `site/BRIEF.md` rather than
inventing a different architecture.

## Commands

All site commands run from `site/` (or use `npm --prefix site …` from the repo root):

```bash
npm install            # first time
npm run dev            # dev server at localhost:4321 (drafts visible)
npm run build          # static build to site/dist/ — the real validator
npm run preview        # serve the built output (drafts hidden, production-like)
```

There is no test runner or linter — `npm run build` is the check that matters (it
type-checks .astro, validates every entry against the zod schema, and fails on a bad
frontmatter field). The build-log check set lives in `builds/<slug>/test.md` and is
run by hand, not by a framework.

To verify the core invariant (one new markdown file lights up all four views), add a
temporary `.mdx` under `site/src/content/builds/`, `npm run build`, and grep
`site/dist/` for its title in `index.html`, `builds/index.html`, and `tools/index.html`
— then delete it. That is how it was checked in build #1.

## Repo layout

- `CONTEXT.md`, `PROCESS.md`, `STYLE.md` — the three governing docs (concept, pipeline,
  voice). `CONTEXT.md` is authoritative; if other docs conflict with it, it wins.
- `BACKLOG.md` — deliberately-parked open items (verification debt, unconfirmed facts,
  deferred decisions). Check it before starting work; several items are gated on builds
  #2/#3 existing. Add to it rather than letting a deferral live only in a chat.
- `builds/` — one folder per build, each an isolated unit:
  - `builds/_template/` — copy this to start a new build (`meta.yaml`, `build-notes.md`,
    `test.md`, `post.md`, `repro/README.md`).
  - `builds/website/` — build #1, the site itself (in progress).
  - `builds/<slug>/meta.yaml` — perishable facts (tool version, pricing, dates,
    status) kept separate from narrative so they update in one place; this is also
    the shape of the Astro content-collection schema (see below).
- `site/` — the Astro site (not yet scaffolded). `site/BRIEF.md` is its spec;
  `site/design/mockups/` has reference screenshots (visual reference only — see
  Design constraints below).

## The build pipeline (PROCESS.md)

Every build (including the site itself) follows the same six-step pipeline. When
asked to work on a build, find where it is in this pipeline before proceeding:

0. **New build** — copy `builds/_template/` to `builds/<slug>/`, fill in `meta.yaml`.
1. **Define** — in `build-notes.md`: what's being built, why, success criteria, and
   the test/check set — decided *before* building, not after.
2. **Build** — do the work (Claude Code for site/repo builds; the tool itself for
   other builds). Log to `build-notes.md` as you go, including what broke and dead
   ends — messy/honest is correct, it's the differentiator, don't clean it up in
   retrospect. Commit often with clear messages; commits are the timestamped record.
3. **Test** — run the check set defined in step 1, record results in `test.md`. Tag
   every failure `[tool limit]` (the tool's fault) vs `[my setup]` (our fault).
4. **Draft** — generate `post.md` from the repo (`build-notes.md` + `git log` +
   `test.md` + `meta.yaml`) in house style (`STYLE.md`). **Draft only — never
   auto-publish.**
5. **Verify & publish** — human edit pass required; assemble `repro/` (public
   substantiation + gated full pack); set `published`/`last_verified`/`status` in
   `meta.yaml`.
6. **Retro** — 2-3 lines on what was clunky; update `PROCESS.md` itself. The process
   is dogfooded like everything else — don't treat it as fixed.

## Writing in house style (STYLE.md)

Applies to anything destined for `post.md` / publication:
- Voice: first person as "Jigg.AI-the-builder" — a consistent brand persona, not a
  named individual.
- Honest over polished: show mistakes, retries, dead ends explicitly.
- Lead with a self-contained summary (the citation hook): what it is, worth it or
  not, the one caveat.
- Separate tool limitations from our own setup mistakes — always tag which.
- Concrete proof over adjectives: times, costs, test scores, screenshots — not
  vibes.
- Plain naming ("Build log", "Tools") — no forced "jig" wordplay.
- Affiliate links: always disclosed, placed after the proof, never before.
- Say "an AI tool worth your time," never "popular."
- Brand name (applies to all surfaced text, incl. site copy — `CONTEXT.md` §14):
  always write it as **"Jigg.AI"**, never bare "Jigg." The namespace is crowded, so
  the full wordmark is doing disambiguation work. Do not rename the brand.

## Site architecture (site/BRIEF.md) — for when `site/` is built or extended

The core architectural rule: **one `builds` content collection drives all four
views.** Adding a new build must mean adding one markdown entry — never touching page
code. Keep this invariant when extending the site.

- Stack: Astro, content collections, islands for interactive/sandboxed demos.
  Markdown/MDX content, no CMS yet. TypeScript is fine. Keep dependencies light.
  Deploy target: Vercel or Netlify.
- Collection schema mirrors `builds/_template/meta.yaml`: title, slug, category,
  tool, tool_version, runs_on_site, status (draft|verified|recheck-due|archived),
  summary, test_score, affiliate_url, repro_pack, published, last_verified,
  pricing_as_of.
- Four views, all reading from that one collection:
  - `/` — home: featured build with artifact preview, recent builds, email capture.
  - `/builds` — archive: timeline, category filter chips, dates/version/freshness
    visible.
  - `/builds/[slug]` — build detail: the full report (see `CONTEXT.md` section 3 for
    page anatomy — summary hook, artifact preview, honest process, test results,
    reproduce-this, stamps, tool verdict+CTA).
  - `/tools` — tools index: **no star ratings**; leads with what was actually built,
    a plain verdict, an accessibility read, "Runs on this site" badge where true.
- Nav is just: Builds · Tools · About · Subscribe. Categories are filters/hub pages
  underneath, not nav items — and only get hub pages once they have real content
  (avoid thin pages).
- Deferred, do not build yet: git-based CMS, live third-party island demos (use a
  screenshot stub), full visual/illustration polish, analytics, newsletter backend,
  category hub pages without real content.

### Design constraints
- `site/design/mockups/` (`home*.png`, `build-log*.png`, `all-build-logs.png`,
  `tools-used.png`) are **visual reference only** — do not copy their markup, CSS
  variables, or icon library (built for a different system). Some views are split
  into numbered vertical slices meant to be read stacked in order as one continuous
  page, not as separate layouts.
- Editorial journal feel, not a directory/grid of cards — this is the deliberate
  visual differentiation from competitor tool directories, protect it:
  - Serif display headline + system sans body.
  - Bordered-list rows for indexes (builds, tools), not card grids.
  - No star ratings, anywhere.
  - Restrained neutral palette + exactly two accent tints (brand accent, and a
    distinct "Runs on this site" accent) — keep color scarce so it stays meaningful.
  - Real artifact screenshots/thumbnails, not tool logos.
  - Clean, fast, semantic, accessible, citation-friendly HTML. Mobile-first.

## Content-integrity model

- `meta.yaml` separates perishable facts (version, pricing, verified date) from
  evergreen narrative (`post.md`) so freshness updates happen in one place without
  rewriting prose.
- Freshness states are `draft | verified | recheck-due | archived` — never let a page
  imply an old build still works just because it still exists.
- Re-verification cadence to apply when asked to check/update a build: pricing claims
  ~60-90 days, active production artifacts ~monthly, workflow conclusions after major
  tool releases.

## Commit rules

Commit messages become part of the published build log — they are the milestone trail
for the build story, so write them that way.

- When you finish a working unit of change, commit it with a clear, specific
  conventional-commit message — e.g. `feat: add builds content collection + schema`,
  `fix: archive filter chip active state`, `chore: deploy to Vercel`. One logical
  change per commit; each message should read as one clear step in the build story.
  Never use vague messages like "updates" or "fixes". Commit at meaningful milestones,
  not every file save.
- Commit locally as you go; prompt before pushing — never push without being asked.
- Commits are authored as **Jigg.AI Bot <jigg.ai.biz@gmail.com>** (set repo-locally,
  overriding any global identity); the remote is **github.com/jigg-ai/jigg** (SSH,
  authenticates as the `jigg-ai` account).
- Do NOT add a `Co-Authored-By` or any other AI-attribution trailer to commits.
