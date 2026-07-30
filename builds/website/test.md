# Test — the Jigg.AI site (build #1)

For a site build the check set isn't Q&A — it's whether the foundation actually holds.
(Illustrates that the test adapts per build type.)

## Method
- Check set: build/deploy health, schema-driven rendering, performance, accessibility.
  Decided before building; unchanged since.
- Run date: 2026-07-17 (scaffold + first deploy). **Check 7 measured 2026-07-29**, off the
  PR #1 Deploy Preview — free to run there, which is what finally unblocked it after the
  July credit overage (see `PROCESS.md` → Shipping).
- Stack under test: Astro 7.1, `@astrojs/mdx`, `@astrojs/sitemap`, one self-hosted
  variable serif. Verified against a local `astro build` + dev server at :4321.
- Check 4 was run with a throwaway second entry (different category, different tool,
  `runs_on_site: false`, `status: recheck-due`, June date), then deleted. That one
  fixture also exercised checks 5 and 6.

## Checks
| # | Check | Outcome | Notes |
|---|-------|---------|-------|
| 1 | Site builds with no errors | **Pass** | 6 routes + sitemap in ~2s, clean on first run. |
| 2 | Deploys to a live URL | **Pass** | Live at https://jigg.ai (custom domain on Netlify, HTTPS via Let's Encrypt covering apex + www). Home, archive, build detail (dynamic route), tools, and About all render; self-hosted font + CSS shipped; no console errors. |
| 3 | All four views render from the `builds` collection | **Pass** | Home, /builds, /builds/website, /tools all verified in-browser. |
| 4 | Adding a new markdown build updates all views, no page-code edits | **Pass** | Temp entry → appeared on home, archive, and /tools, and generated its own detail route. Zero page-code changes. The core invariant, measured rather than assumed. |
| 5 | "Runs on this site" badge shows only when runs_on_site: true | **Pass** | With 2 builds (one true, one false), badge count on /builds was exactly 1. |
| 6 | Freshness state (verified/recheck-due/archived) renders correctly | **Pass (partial)** | `verified` (green) and `recheck-due` (amber) both confirmed. `archived` not yet exercised — no archived build exists. |
| 7 | Lighthouse performance is strong (note score) | **Pass** | Measured 2026-07-29 off the Deploy Preview for `d0d6928` (PR #1), 4 paths audited: **Performance 97, Accessibility 97, Best Practices 92, SEO 100** (PWA n/a). These are the **aggregate** figures Netlify reports for the run, not per-path — so they are a baseline, **not yet a threshold basis**: the plugin applies thresholds to each path individually, and a single path below the aggregate would break deploys. Per-path breakdown still to be pulled from the deploy log. Best Practices (92) is the outlier worth investigating. |
| 8 | Basic accessibility passes (headings, alt text, contrast) | **Partial** | Built for it — semantic landmarks, skip link, heading order, `aria-current`/`aria-pressed`, decorative SVGs `aria-hidden`, visible focus rings. Lighthouse now returns **a11y 97** (2026-07-29) — recorded, but **deliberately still not a pass.** Lighthouse a11y is an automated subset; it cannot see keyboard traps, focus order in practice, or whether alt text is *meaningful*, and contrast ratios remain unmeasured. A pass here needs axe + manual keyboard/contrast checks. A high automated number is the easiest way to talk yourself out of the audit that would actually find something. |
| 9 | Mobile layout holds | **Pass** | 375×812: header wraps, serif scales via clamp, email capture stacks full-width, no horizontal overflow. |

## Summary
- Passed: 8 of 9 (1, 2, 3, 4, 5, 7, 9 fully; 6 partially — `archived` state unexercised).
- Not run: **none.** Check 7 closed 2026-07-29. 8 (accessibility) is built-for and now has
  an automated score, but is still not formally audited — that stays Partial on purpose.
- Issues found — tagged [tool limit] vs [my setup]: **none of either.** Nothing broke
  in the build itself. The friction in this build was all upstream config (the Git/
  GitHub auth chain in build-notes.md), and every item there was [my setup]. No Astro
  or Claude Code limitation was hit.
- Honest caveat on this test: it was run by the same agent that wrote the code, at
  scaffold stage, before the human verify pass (PROCESS step 5). Checks 2, 7, and 8
  are the ones that would most likely change the picture.
