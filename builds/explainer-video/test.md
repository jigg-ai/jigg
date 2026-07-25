# Test — build #3: the Jigg.AI explainer video (HeyGen)

Video has no single X/30. This is the check set adapted to video, **decided before the
render was judged** (PROCESS §1) so it isn't graded on a curve. Two parts: the
**selection bake-off** (which tool), then the **video test** (is the output any good).

Failure tags: `[tool limit]` = something the tool structurally does; `[my setup]` = a
choice or gap on our side.

> **Capture status.** Clarity, believability, voice and the bake-off are recorded below
> from the build. The **operational** figures (time, takes, credits, $/min) are
> `TO-CAPTURE` — they come from the render session and the receipt, which aren't in this
> repo yet. They are left blank rather than estimated; an invented cost is exactly the
> failure this project exists to be better at.

## Part 1 — Tool selection: the 15-second bake-off

- **Method:** one 15-second script, written once, deliberately booby-trapped with the
  things AI presenters fumble — the brand name said aloud ("Jigg.AI"), a spoken number
  ("thirty questions"), a clipped one-word beat ("No hype."), and a fast three-item list
  — fed **verbatim** into both HeyGen and Synthesia. Then watched.
- **Rubric (fixed before watching):** did the tool (a) keep the authored script, (b)
  keep first-person voice/register, (c) pronounce "Jigg.AI" and the number cleanly, (d)
  handle the punctuation/pacing traps.

| Check | HeyGen | Synthesia (AI-assist on) | Synthesia (strict/blank-scene) |
|---|---|---|---|
| Kept the authored script | Yes — word-for-word | No — rewrote to ~46s | Yes — held at ~20s |
| Kept first-person register | Yes | No — third-person corporate ("Our AI solutions undergo rigorous testing…") | Yes |
| Didn't invent a title | Yes | No — retitled it "Jigg.AI: Practical AI Tools and Solutions" | Yes |
| Punctuation/pacing | Clean | Read a punctuation "comma" aloud `[tool limit]` | (n/a — re-run focused on script fidelity) |
| Length vs 15s brief | ~15s | ~46s | ~20s |

- **Fairness note (do not overstate):** the AI-assist rewrite is `[my setup]`, not a tool
  limit — AI-assist mode is *designed* to expand a brief into a full presentation. The
  strict-mode re-run held the script, so the honest finding is **different instincts**, not
  "Synthesia can't follow a script": HeyGen reaches for a creator/startup register,
  Synthesia for a presenter-led training one.
- **Selection verdict:** HeyGen. For a build-in-public site its instinct fit the voice with
  less fighting. Decided on the side-by-side evidence, not on argument. Synthesia remains
  the better fit for structured training/L&D — noted, not dismissed.

## Part 2 — The video test (the shipped HeyGen render)

- **Run date:** TO-CAPTURE (the render/QA session date).
- **Config under test:** the paid HeyGen render, ~70s (script planned ~87s; HeyGen
  re-paced). Avatar + AI voice; brand kit imported.

### Results

| # | Check | Outcome | Notes / tag |
|---|-------|---------|-------------|
| 1 | **Fresh-viewer clarity** — showed it to people who'd never seen the site; did they get the premise? | **Pass — 3/3** | The metric I can't self-judge, so it counts most. All three got the premise. |
| 2 | **Avatar believability** | Pass | Credible on the paid render; no uncanny flags. |
| 3 | **Voice naturalness** | Pass | The "No hype." beat and the list pacing landed; "Jigg.AI" pronounced cleanly. |
| 4 | **Key line survived re-pacing** | Pass | HeyGen rendered 70s vs ~87s planned; verified the honest-failure beat survived intact. |
| 5 | **On-screen proof legible** | Partial `[my setup]` | The proof shown on screen is too small to read — v2 fix (deliberate proof-zooms). Not re-rendered this build. |
| 6 | **Avatar framing** | Partial `[my setup]` | Portrait avatar leaves black bars (pillarboxing) on plain talking-head shots — the lead v2 fix (frame-filling/landscape avatar). Not re-rendered. |
| 7 | **Captions** | Partial `[my setup]` | Captions burned into the pixels, no soft track — v2: export an `.srt`. |
| 8 | **Free-tier publishability** | Fail (expected) `[tool limit]` | Free tier watermarks the whole frame + caps at 60s → had to pay to ship. Expected free-tier behaviour; "free" = evaluate, not publish. |

### Operational cost (partly captured — the rest not estimated)

| Metric | Value |
|---|---|
| Time to a usable render | TO-CAPTURE (not logged during the session) |
| Number of takes | TO-CAPTURE (not logged during the session) |
| Credits consumed | TO-CAPTURE (not logged during the session) |
| Real paid price | **US$32.06 incl. tax** — HeyGen **Creator** plan (from the receipt; `pricing_as_of: 2026-07-24`) |
| **Cost per finished minute** | Not a clean single number — Creator is a **monthly subscription**, so $/min depends on how much you produce in the cycle. The concrete, honest figure is the **$32.06 plan price** it took to ship one watermark-free video. Don't imply $32/min from a subscription. |

## Summary
- **Selection:** HeyGen over Synthesia, decided by the 15s bake-off; strict-mode re-run
  keeps the comparison fair.
- **Output:** passes the checks that count — fresh-viewer clarity 3/3, avatar and voice
  credible/natural, key line survived re-pacing.
- **Known limits, all v2 improvements, all `[my setup]`:** small on-screen proof,
  avatar pillarboxing, burned-in captions. Logged as "what I'd change," not re-rendered.
- **`[tool limit]`s, framed fairly:** free tier watermarks + 60s cap (expected); Synthesia
  read a punctuation "comma" aloud.
- **Composite `test_score` (for the stamp):** Fresh-viewer clarity 3/3 · avatar/voice
  natural, no uncanny flags · 15s bake-off decided it vs Synthesia. No fake single number.
- **Still to capture before publish:** the operational figures above, and the run date.
