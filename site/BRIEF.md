# BRIEF — build #1: the Jigg.AI site

Read CONTEXT.md, PROCESS.md, and STYLE.md first. This brief covers the site build.

## Goal
Stand up the foundation: an Astro site whose architecture makes "a new build = one
markdown entry that lights up every view." Get the DATA MODEL and PAGE TEMPLATES
right; keep visual polish and content minimal. This build is also the first published
build log ("Building Jigg.AI with Claude Code"), so log the process as you go.

## Stack
- Astro, content collections, islands for interactive demos.
- Markdown/MDX content (NO CMS yet). TypeScript fine. Keep dependencies light.
- Deploy target: Vercel or Netlify.

## Content architecture (the important part)
- One `builds` content collection. Each build = one entry. Schema mirrors
  builds/_template/meta.yaml: title, slug, category, tool, tool_version,
  runs_on_site, status (draft|verified|recheck-due|archived), summary, test_score,
  affiliate_url, repro_pack, published, last_verified, pricing_as_of.
- All four views read from this one collection. Adding a build must NOT require
  touching page code.

## Routes / views
- `/`            home: featured build (with artifact preview), recent builds list,
                 email capture with concrete benefit.
- `/builds`      archive: timeline, category filter chips, dates + tool version +
                 freshness state visible.
- `/builds/[slug]` detail: the full report (see CONTEXT.md section 3).
- `/tools`       tools index: no star ratings; verdict + real-build count +
                 accessibility read + "Runs on this site" where true.
- Nav: Builds · Tools · About · Subscribe.

## Design direction
Editorial, not a directory grid. The site should read like a build-in-public JOURNAL,
not a tool directory with star ratings. That contrast is the visual differentiation —
it is doing real work, so protect it.

Reference mockups live in `site/design/mockups/`. Some views were too tall to capture
in one screenshot, so they are split into numbered vertical slices — read the slices
STACKED IN ORDER as a single continuous page, not as separate layouts:
- Home page:        `home.png`, `home2.png`, `home3.png`  (one page, top to bottom)
- Build log detail: `build-log.png`, `build-log2.png`, `build-log3.png`  (one page, top to bottom)
- Archive:          `all-build-logs.png`
- Tools index:      `tools-used.png`

These are a VISUAL REFERENCE, NOT SOURCE: do not copy their markup, CSS variables, or
icon library — they were built for a different system. Implement cleanly in Astro with
its own stylesheet. Read the frontend-design skill before styling.

Intent behind the mockups (the "why" the images can't show):
- Serif display headline + system sans body. The serif is what makes it feel
  editorial rather than generic SaaS — keep it.
- Bordered-list rows for the indexes (builds, tools), NOT a grid of cards. Reads like
  a journal index; deliberately unlike the competitor directory grid.
- No star ratings anywhere. Tools lead with what was actually built, a plain verdict,
  and an accessibility read — never scores.
- Restrained neutral palette + exactly two accent tints: a warm brand accent, and a
  distinct "Runs on this site" accent. The "Runs on this site" badge is the ONE
  meaningful color pop — keep color scarce so it stays meaningful.
- Artifact thumbnails, not tool logos. The thumbnails in the mockups are PLACEHOLDERS
  for real artifact screenshots — do not reproduce them as a design element.
- Clean, fast, semantic, accessible, citation-friendly HTML. Mobile-first.

## In scope for build #1
- Astro project scaffold in this folder.
- The `builds` collection + schema, and the four page templates rendering from it.
- ONE real entry: this build itself.
- Email capture (stub form is fine; wire a provider later).
- Deploy once and confirm it's live.

## Deferred — do NOT build now
- Git-based CMS, live third-party island demos (stub with a screenshot for now),
  full visual/illustration polish, analytics, newsletter backend, category hub pages
  beyond what has real content.

## While building
- Log to builds/website/build-notes.md as you go; commit often with clear messages.
- The messy parts (what broke, what you retried) are the content — keep them.
