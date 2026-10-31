# MatSignal — data-safety rules (implemented in the model)

**Date:** 2026-10-30. **Scope:** how MatSignal handles three cases that could mislead users or expose people:
- an identity it can't confirm;
- a source it couldn't check;
- a participant whose age isn't established.

These are code rules in `site/src/lib/matsignal/model.ts`, unit-tested in `model.test.ts`, and they apply to the fictional demo today. They also set the bar for any real source, which still needs founder approval (HANDOFF §4, Gate B; `sources.ts` refuses every real source).

## 1. Ambiguous identities: shown, never merged, never counted

- **Kept separate.** A platform's athlete record is an `IdentityRef` (platform + that platform's own ID). It is never treated as a universal person ID.
- **Confirmed or candidate.** Each identity on an athlete is `confirmed` or `candidate`. A same-name record nobody has confirmed is a candidate: search shows it as "(unconfirmed)", and it contributes **nothing** to that athlete's queue (`trackedIdentities`).
- **No merging by name.** New search results enter the index once and are refreshed in place (`upsertDiscovered`). Two platforms' records for one name become two athletes until something reliable links them.
- **Tests:** "an unconfirmed same-name candidate stays out of the queue until confirmed"; "discovered identities are reused, never duplicated, never merged by name".

## 2. Sources that couldn't be checked: "unknown", never "none"

- **Each check is recorded.** A check of one identity on its platform is a `SourceCheck`: `ok`, `private`, `not-found`, `blocked` or `unavailable`, with a time. Only the latest check counts.
- **Gaps are reported.** `coverageGaps` lists every tracked identity whose latest check wasn't `ok`, or that was never checked. `gapLabel` gives one sentence per gap, always ending "…so entries there are unknown". For example: "Example Platform B couldn't be checked for Demo Athlete 01 (last tried 2026-10-30), so entries there are unknown."
- **Unknown stays unknown.** An unpublished match time stays "Unknown / Not published" and sorts last. It is never estimated by MatSignal.
- **Tests:** "a source that could not be checked is reported as unknown, never as 'no entries'"; "private, missing and never-checked identities each say why their entries are unknown".

## 3. Age not established: adult divisions only, failing closed

- **The rule.** `classifyDivision` calls a division adult only when its label says so ("Adult", "Master 2", "18+").
  - **Youth:** youth wording, or an age range or "N+" under 18. Youth wins when a label mixes both.
  - **Unknown:** everything else, hidden like youth.
  - Numbers alone never make a division adult, because weight classes ("58-64") look like age ranges.
- **The queue.** `buildQueue` drops anything not confirmed adult. `hiddenByAge` counts it, so the page says "1 entry is hidden: MatSignal shows only divisions confirmed as adult" instead of implying there's no entry. The demo shows this for Demo Athlete 02's "Open Division" entry.
- **Tests:** "age rule: only labels that say adult are adult…" (adult, youth and unknown cases, including weight-class and mixed labels) and "entries whose division is not confirmed adult stay out of the queue, and are counted".

## Known limits (open, not solved here)

- **Labels can be wrong.** The rule trusts the labels a platform publishes. Organizers who label youth divisions without age words, or adult divisions without adult words, are handled by hiding (safe) or not at all (unsafe). Each real source needs its own label review before use.
- **The index itself.** The age rule filters registrations. A platform's athlete search returns names without ages, so keeping minors out of the athlete *index* needs a per-source age signal that hasn't been established.
- **Parents.** Adults-only means a parent can't use MatSignal to follow their own child. That's a product decision for the founder, not a technical default.
- **Stale data.** Showing last-known entries from a source that is now unreachable, with their age, is designed (`SourceCheck.checkedAt`, `Registration.observedAt`) but not shown in the demo UI.
