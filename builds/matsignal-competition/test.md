# MatSignal — preview acceptance test

**Status:** Test plan registered before any claim of completed preview. No checks have been run yet.

| ID | Check | Expected |
|---|---|---|
| MS-T01 | Search known fictional athlete | Matching record with source-identity clue and demo indicator |
| MS-T02 | Search unknown name | No-results explanation; no false real-data search claim |
| MS-T03 | Track/untrack athlete | Watchlist and match queue update; no duplicate group members |
| MS-T04 | Refresh demo page | Browser-local selections persist when storage is available |
| MS-T05 | Clear all selections | Empty watchlist and queue state |
| MS-T06 | Mat order + unknown ETA | Known times sorted; unspecified time explicitly unknown |
| MS-T07 | Keyboard & screen readers | Focus, input labels, button labels and status announcements sensible |
| MS-T08 | Narrow mobile screen | No horizontal overflow, controls usable |
| MS-T09 | Astro build | `npm --prefix site run build` exits successfully |
| MS-T10 | Preview safety | noindex, no real athlete fields, no payment, no crawler, no production URL/merge |

**Results:** NOT RUN. No verification or product availability claim.

## Execution evidence — 2026-10-30

- **Build check:** Netlify returned SUCCESS for commit `0475e1e62bf766b6b0ace408fd82915d563058a4`, context `netlify/candid-gingersnap-6c4b87/deploy-preview`, description “Deploy Preview ready!”. [GitHub status receipt](https://github.com/jigg-ai/jigg/commit/0475e1e62bf766b6b0ace408fd82915d563058a4). This supports the Astro/Netlify deploy pipeline check for the prototype, not the full local command or a browser interaction test.
- **Preview:** https://deploy-preview-9--candid-gingersnap-6c4b87.netlify.app/matsignal/ (derived from the Netlify-reported preview root and the app route). An external preview request through the available page viewer could not access the route, so **visual, keyboard, mobile and interaction checks remain NOT VERIFIED**.
- **All other tests:** NOT RUN. Do not publish or call this production-ready.

## Results — 2026-10-30, Claude Code session (heads `46610e2` and `d4018c0`)

Pre-registered table above unchanged. Browser checks ran in the Claude desktop app's built-in browser against https://deploy-preview-9--candid-gingersnap-6c4b87.netlify.app/matsignal/; unit tests are `npm --prefix site test` (Node 26.12.0). Screenshots are in [qa/](qa/).

**Found failing on `a6b6093` (the coordinator's head), before any fix:**
- Dynamic rows unstyled: search results, Track buttons, squad and match queue rendered as browser defaults (Astro scoped CSS). FAIL. [before](qa/a6b6093-before-desktop-search-unstyled.jpg), [queue](qa/a6b6093-before-desktop-queue-unstyled.jpg)
- Keyboard: activating "+ Track" moved focus to `<body>`. FAIL (MS-T07).
- `/matsignal/` listed in `sitemap-0.xml`, which IndexNow submits on production deploys. FAIL (MS-T10).
- Queue comparator returned 1 both ways for two unknown times, so their order was browser-dependent. FAIL (MS-T06, by inspection).

**After the fixes:**

| ID | Result | Evidence |
|---|---|---|
| MS-T01 | PASS | Unit tests (name, team, academy, alias; case and whitespace). Preview lists all four records with platform identity and "synthetic identity" labels. |
| MS-T02 | PASS | Preview: "Real Person" shows "No sample matches", and the status line says "No sample athletes found." Unit test. |
| MS-T03 | PASS | Preview: tracking all four gives a squad count of 4 with no duplicates. Unit tests: stored duplicates collapse, unknown IDs drop. |
| MS-T04 | PASS | Preview: removed Demo Athlete 02, reloaded, squad = 01, 03, 04. |
| MS-T05 | PASS | Preview: Clear all gives count 0, an empty queue, a disabled button, focus on the search box, and "Cleared your group." |
| MS-T06 | PASS | Preview queue: 10:55, 11:40, 13:20, then Dec 05 "Unknown / Not published" ×2. Unit tests: total order, cross-time-zone instants, unknown kept unknown, unconfirmed candidates excluded. |
| MS-T07 | PARTIAL | Keyboard PASS: focus stays on the pressed athlete's button, moves to the neighbouring Remove button, or to the search box after Clear all. One `role="status"` line replaces three `aria-live` regions (text verified in the DOM). **NOT RUN with a real screen reader** (VoiceOver/NVDA). Contrast scan on `a6b6093` found no AA failures; colours are unchanged since. |
| MS-T08 | PASS (emulated) | 375×812: `scrollWidth` = `clientWidth` = 375, nothing overflowing, "Concept preview" badge visible. [top](qa/46610e2-after-mobile-375-top.jpg), [queue](qa/46610e2-after-mobile-375-queue.jpg). Not tested on a physical phone. |
| MS-T09 | PASS | `npm --prefix site run build` (16 pages) at every commit. Netlify "Deploy Preview ready!" for `46610e2` and `d4018c0`. |
| MS-T10 | PASS | `x-robots-tag: noindex` header plus meta robots. Preview `sitemap-0.xml` has 0 `matsignal` entries (`d4018c0`). Only same-origin requests (page, CSS, JS, plus Netlify's preview drawer). No payment, crawler or production URL. Draft PR, not merged. |

30 unit tests pass (model, adapters, cache). Readability (several labels at 9.6–11.7px) is left as found: the founder's priority update asks for corrections only, not a redesign.
