# Test record: open-weight models on Fireworks (build #6)

What was checked, against what evidence, and what hasn't been checked. No aggregate score is
claimed: each check guards one promise, and a total would hide which.

**When:** the checks were set on 2026-11-23, when this build was defined, and run that day. The
review round they check (MatSignal's growth proposal, November 20–21) happened before they were
written down. Running them against its records after the fact is noted wherever it matters.

**Evidence:**
- the worker's run records, in a private repository (per run: calls, tools used, pages opened,
  charges, stop reason);
- the worker's code and decision record;
- the review issue in MatSignal's private repository;
- Fireworks' public pricing, model and data-handling pages, read 2026-11-23.

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Both models answer on Fireworks' US-only routes | **Pass** | Hand tests 2026-11-20 (Kimi, 7 calls) and 2026-11-21 (DeepSeek, 3 calls). Every call reports the routed model it served. |
| 2 | Prices in the worker match Fireworks' public prices | **Pass** | Input, cached input and output, base and US route, for both models, identical to the pricing and model pages on 2026-11-23. |
| 3 | What the worker charges matches list price | **Fail, fixed** | Kimi's first pass was metered at $1.430516; re-priced from its recorded usage at list price, $0.665214. Calls had been charged at the higher of two readings. Fixed the same evening. Every later run is charged at list price. **[my setup]** |
| 4 | No run spends past its cap | **Pass** | Every run's charge fits its cap and the founder's GO. Caps stopped runs early (check 3 and build-notes), but never let one overspend. |
| 5 | First passes are written blind | **Pass, by design** | On first passes the worker hides every `reviews/` path and offers no issue reader. Both first-pass files say they were written before the model saw the issue. |
| 6 | No excluded site is opened | **Pass** | DeepSeek's two passes opened 5 pages: Google's developer documentation, Bing's IndexNow page, and a competitor's site. None on smoothcomp.com or matsignal.jigg.ai. Kimi had no web access. |
| 7 | No source cited that wasn't opened | **Pass** | The citation check refused unopened sources in the DS-WEB-001 research test (DeepSeek had cited pages it never opened). No refusal appears in the review passes' records. |
| 8 | Reviews delivered and posted unedited, with their source | **Pass** | Four comments on the review issue (2026-11-21 and 22 UTC), each with its commit and a note that only relative links were changed. |
| 9 | At least one finding no other reviewer made | **Pass** | Both models independently found that the proposal's automatic deindexing would reverse a founder decision from 2026-11-17. None of the comments by Grok, Claude or Gemini raises it. Others are listed in the post. |
| 10 | Factual accuracy of what they asserted about the code | **Pass, spot-checked** | DeepSeek's file-and-line citations were spot-checked at the commit it read, and were accurate. Errors found are in the post: two self-corrections by DeepSeek, one misattributed finding number, and Kimi blaming the wrong cause for a stop. |
| 11 | A finding acted on | **Open** | The founder decisions on the proposal are still open. Carried forward to the harness build. |

## Not checked

- **The charges against Fireworks' own bill.** The worker's records are the only source so far.
- **Blocking through redirects, live.** No page in these runs redirected to an excluded site, so
  that part of check 6 rests on the worker's design, not on an observed refusal.
- **Strict JSON schema enforcement.** Fireworks echoed a schema request back as plain JSON mode
  in the hand test. **[tool limit]**
- **Whether the US route is guaranteed.** It's a product feature; the terms of service set no
  data region.
