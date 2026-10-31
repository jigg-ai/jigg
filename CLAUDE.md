# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Jigg.AI is an AI-accelerated software engineering studio with a public build journal.
The studio is the business (client engineering work); the journal is the evidence: real
artifacts built with AI tools, documented honestly (tested, timed, reproducible),
published as build logs. The site is itself build #1, and is built with the tools it
reviews. **The repo is the durable source of truth** — chats/sessions are scratchpads.
Log decisions and process into the files described below, not just into conversation.

Read in this order before doing substantive work:
1. [`CONTEXT.md`](CONTEXT.md) — the what/why, canonical source of truth for the product.
2. [`PROCESS.md`](PROCESS.md) — the repeatable build pipeline (below).
3. [`STYLE.md`](STYLE.md) — house voice for anything published.
4. [`site/BRIEF.md`](site/BRIEF.md) — the spec for the site build specifically.

Current state: the site is live at https://jigg.ai (Netlify) with four published
builds (#1 the site, #2 Botpress, #3 HeyGen explainer, #4 signup hardening). The studio
repositioning (CONTEXT.md, October 2026) is in progress on one branch, `feat/studio`, to
ship as one PR and one merge. See each `builds/<slug>/test.md` for which checks have and
haven't been run. When extending the site, follow `site/BRIEF.md` and CONTEXT §6 rather
than inventing a different architecture.

## Commands

All site commands run from `site/` (or use `npm --prefix site …` from the repo root):

```bash
npm install            # first time
npm run dev            # dev server at localhost:4321 (drafts visible)
npm run build          # static build to site/dist/ — the real validator
npm run preview        # serve the built output (drafts hidden, production-like)
npm test               # unit tests for pure logic (src/lib/**/*.test.ts)
```

There is no linter, and `npm run build` is still the check that matters (it
type-checks .astro, validates every entry against the zod schema, and fails on a bad
frontmatter field). `npm test` runs Node's built-in test runner over TypeScript
directly (Node 22.18+, no dependency); so far it covers only the MatSignal code in
`src/lib/matsignal/`. The build-log check set lives in `builds/<slug>/test.md` and is
run by hand, not by a framework.

To verify the core invariant (one new markdown file lights up every journal view), add a
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
  - `builds/website/` — build #1, the site itself. Later site revisions (like the
    studio pages) are logged in its `build-notes.md` rather than as new builds.
  - `builds/<slug>/meta.yaml` — perishable facts (tool version, pricing, dates,
    status) kept separate from narrative so they update in one place; this is also
    the shape of the Astro content-collection schema (see below).
- `site/` — the Astro site. `site/BRIEF.md` is its original spec;
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
- Two voices. Build logs: first person as "Jigg.AI-the-builder", a brand persona.
  Studio pages (home, Services, About, Contact): "Jigg.AI" as the subject, never a "we"
  that implies a team; the current engineering lead is named only on About
  (CONTEXT §4). No selling inside build logs.
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

The core architectural rule: **one `builds` content collection drives every journal
view.** Adding a new build must mean adding one markdown entry — never touching page
code. Keep this invariant when extending the site. Studio content (services, later
client case studies) gets its own collections; see CONTEXT §6 for the full view list
and §7 for the nav (Services · Builds · About · Contact).

- Stack: Astro, content collections, islands for interactive/sandboxed demos.
  Markdown/MDX content, no CMS yet. TypeScript is fine. Keep dependencies light.
  Deployed on Netlify.
- Collection schema mirrors `builds/_template/meta.yaml`: title, slug, category,
  tool, tool_version, runs_on_site, status (draft|verified|recheck-due|archived),
  summary, test_score, affiliate_url, repro_pack, published, last_verified,
  pricing_as_of.
- Journal views, all reading from that one collection:
  - `/` — the home page shows selected builds as evidence (it becomes the studio
    homepage in the repositioning; CONTEXT §6).
  - `/builds` — archive: timeline, category filter chips, dates/version/freshness
    visible.
  - `/builds/[slug]` — build detail: the full report (see `CONTEXT.md` section 3 for
    page anatomy — summary hook, artifact preview, honest process, test results,
    reproduce-this, stamps, tool verdict+CTA).
  - `/tools` — tools index: **no star ratings**; leads with what was actually built,
    a plain verdict, an accessibility read, "Runs on this site" badge where true.
- Categories are filters/hub pages under Builds, not nav items — and only get hub pages
  once they have real content (avoid thin pages). Tools and Subscribe are secondary
  destinations, linked from Builds and the footer.
- Deferred, do not build yet: git-based CMS, live third-party island demos (use a
  screenshot stub), full visual/illustration polish, analytics beyond the Contact counts
  in CONTEXT §8, category hub pages without real content, and a Work section before
  there is a client case study with written permission.

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
- **Pushing: SSH only, with the jigg key pinned.** The clone's repo-local config sets
  `core.sshCommand = ssh -i ~/.ssh/id_ed25519_jigg2 -o IdentitiesOnly=yes`, so a plain
  `git push` / `git fetch origin` authenticates as `jigg-ai` and can never offer another
  key. On the current machine this works from an agent's shell too (verified 2026-10-26:
  `ssh -T git@github.com` with that key answers "Hi jigg-ai!"). The key's comment reads
  `jigg-ai-deploy`, but it is the account-level key; `id_ed25519_jigg` is an older,
  wrong one. **Never "fix" an SSH problem by stripping the key's passphrase** — that
  leaves an unencrypted private key on disk.
- **HTTPS is deliberately disabled for this repo** (repo-local `credential.helper` set to
  empty), so it can never borrow the stored credentials of a different GitHub account.
  Other projects on this machine push as that other account, and nothing done here may
  change that: don't switch the active `gh` account, and never run `gh auth setup-git`
  (or answer "Yes" to "Authenticate Git" during `gh auth login`) — it makes `gh` git's
  credential source machine-wide. The HTTPS-via-`gh` fallback documented here in July
  applied to the old laptop and is retired.
- **PRs and merges use `gh` with the jigg-ai token, per command:**
  `GH_TOKEN=$(gh auth token --user jigg-ai) gh pr create …` (same for `gh pr merge`).
  Merge with a merge commit; squash and rebase are disabled on the repo.
- Do NOT add a `Co-Authored-By` or any other AI-attribution trailer to commits.
