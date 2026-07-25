# Repro pack — build #3: the Jigg.AI explainer video (HeyGen)

Everything needed to judge the tool selection and rebuild the video. Public, in the repo
— the evidence for a claim is never behind an email gate. This pack also carries this
build's **prompt-provenance goal**: showing the prompts behind the video.

> **Honest state of this pack.** Some items already live in the repo. Several are
> **human-owned media/chat exports** — the video clips, the raw renders, the brand kit,
> and above all the prompts and the cross-model exchange, which live in HeyGen and in the
> Claude/ChatGPT chats. This agent cannot produce those and must not reconstruct them
> (PROCESS §2). They are marked **TO ADD** below and are what stands between this pack and
> "complete." Do not describe the pack as complete, or flip `repro_pack`, until they're in.

## The prompt-provenance note (read this first)

HeyGen has **no native way to export prompt history** — that limitation is itself part of
the content. The prompts behind this build (research → script → scene-plan → revision) live
**upstream in the Claude and ChatGPT chats**, not in the tool. So this provenance is
assembled by hand from the chat logs by the human, exported and redacted — **never written
from memory afterwards.** A plausible-looking prompt composed later is a fabrication and a
worse failure than an admitted gap (PROCESS §2, and build #1's lesson).

## Public (lives on the build page)

Enough for a reader to verify the selection call and the test without downloading anything.

| Item | Status | Where |
|---|---|---|
| The **scored selection rubric** (HeyGen vs Synthesia, incl. the strict-mode fairness re-run) | ✅ in repo | [`../test.md`](../test.md) Part 1 |
| The **video test rubric + results** (fresh-viewer clarity, believability, voice, operational) | ✅ in repo | [`../test.md`](../test.md) Part 2 |
| The **running journal** — every beat, fault-tagged `[tool limit]` / `[my setup]` | ✅ in repo | [`../build-notes.md`](../build-notes.md) |
| Perishable facts — verdict, accessibility read (affiliate link + price still pending) | ✅ in repo | [`../meta.yaml`](../meta.yaml) |
| The **final ~70s script**, as written | ⏳ TO ADD | human export → `repro/script-final.md` |
| The **15-second bake-off clips**, HeyGen vs Synthesia, side by side (the visual proof of the selection call) | ⏳ TO ADD | human media → `repro/bakeoff/` |
| A **representative prompt excerpt** (script-generation prompt) | ⏳ TO ADD | human export → `repro/prompts/` |

## Gated / downloadable (the full pack — assemble before offering a download)

A one-line description, then the full contents — assembled from artifacts that actually
exist, not promised.

| Item | Status | Notes |
|---|---|---|
| The **full prompt set** — research, script-generation, scene-plan, revision prompts | ⏳ TO ADD | from the Claude/ChatGPT chats; HeyGen can't export them (see note above). Redact per the exchange-log checklist. |
| The **condensed AI-interchange log** (Claude ↔ ChatGPT) | ⏳ TO ADD (partial) | structure + summary in [`exchange-log.md`](exchange-log.md); verbatim rounds awaiting the human's export. |
| Both **raw renders** — HeyGen + strict-mode Synthesia | ⏳ TO ADD | human media → `repro/renders/` |
| The **brand kit** used in HeyGen | ⏳ TO ADD | human media → `repro/brand-kit/` |
| `meta.yaml` + full test notes | ✅ in repo | [`../meta.yaml`](../meta.yaml), [`../test.md`](../test.md) |

## Provenance

Everything in-repo is **captured, not reconstructed** — the rubrics and results are the
real ones; the journal was assembled from the build handoff and render QA (see the
provenance note at the top of `build-notes.md`). Where a prompt or an exchange wasn't
captured yet, it says **TO ADD / awaiting export** rather than being filled in after the
fact. That line is absolute (PROCESS §2).

## Not included, deliberately

- **No HeyGen account credentials, workspace IDs, or private dashboard URLs.**
- **No affiliate commission numbers or paid price stated from memory** — both are pending
  the real dashboard link and the receipt (Part A §5). Blank beats a guessed figure.
- **No prompt written from memory.** If a prompt wasn't saved, it's logged as a gap, not
  reconstructed.
