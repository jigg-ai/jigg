# Test — the Jigg.AI site (build #1)

For a site build the check set isn't Q&A — it's whether the foundation actually holds.
(Illustrates that the test adapts per build type.)

## Method
- Check set: build/deploy health, schema-driven rendering, performance, accessibility.
- Run date:

## Checks
| # | Check | Outcome | Notes |
|---|-------|---------|-------|
| 1 | Site builds with no errors | | |
| 2 | Deploys to a live URL | | |
| 3 | All four views render from the `builds` collection | | |
| 4 | Adding a new markdown build updates all views, no page-code edits | | |
| 5 | "Runs on this site" badge shows only when runs_on_site: true | | |
| 6 | Freshness state (verified/recheck-due/archived) renders correctly | | |
| 7 | Lighthouse performance is strong (note score) | | |
| 8 | Basic accessibility passes (headings, alt text, contrast) | | |
| 9 | Mobile layout holds | | |

## Summary
- Passed:
- Issues found — tagged [tool limit] vs [my setup]:
