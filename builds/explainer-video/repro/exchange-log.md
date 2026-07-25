# Exchange log — build #3: the Jigg.AI explainer video (HeyGen)

Cross-model exchanges captured **as they happened**. One model red-teaming another's work
is a real technique this project claims as a differentiator, so the evidence for it has to
be real too.

> **Capture, never reconstruct.** If a round wasn't saved at the time, it does not go in
> here written from memory afterwards. A plausible-looking transcript composed later is a
> fabrication regardless of how well it matches what happened — and it is a worse failure
> than an admitted gap, because it is undetectable. Log the gap instead.

> **Status of THIS file.** The rounds below are recorded as `summary` — the human's own
> account of the two-AI exchange, from the build handoff. The **verbatim** prompts,
> outputs and critiques live in the Claude and ChatGPT chats and are **awaiting export by
> the human**; this agent cannot see those chats and has not written any model's words for
> them (PROCESS §2). Replace each `NOT CAPTURED` block with real `verbatim`/`excerpt` text
> pulled from the chats, redacted per the checklist below, before this pack is called
> complete.

## Provenance — label every block

Each block below must carry one of these. No block goes in unlabelled.

| Label | Meaning |
|---|---|
| `verbatim` | Exact text, copied at the time or exported from the chat. Nothing changed. |
| `excerpt` | Real text, trimmed. Cuts marked with `[…]`. Nothing added, nothing reworded. |
| `redacted` | Real text with specific removals — say what class of thing was removed. |
| `summary` | A description of what happened, written by a human or agent. **Not quotable as the model's words.** |

## ⚠️ Redact before this becomes public

The repro pack is public, which makes this file a **leak surface for exactly the internal
material the project keeps private.** Planning chats routinely contain things the site
deliberately does not publish. Check for and remove:

- Revenue figures, targets, and any exit/valuation aspiration (CONTEXT §12–13 — internal)
- Anything identifying the human behind the persona (CONTEXT: no named individual)
- API keys, tokens, account IDs, private dashboard URLs (incl. the HeyGen dashboard)
- Unrelated projects or third-party material that wandered into the same chat
- Half-formed strategy that reads as a commitment once published

If a round can't be redacted without becoming misleading, leave it out and say so —
`summary` with a note beats a redaction so heavy it changes the meaning.

---

## Round 1 — Which tool: HeyGen or Synthesia?

**Date:** <YYYY-MM-DD — TO CAPTURE>  ·  **Models:** Claude Opus 4.8 ↔ ChatGPT 5.6

### What happened · `summary`
ChatGPT argued **for Synthesia** — better for a documented, reproducible, expandable video
*system*, closer to the "real business tool" thesis. Claude pushed back that Synthesia's
"business" is enterprise training, not this site's reader, and that the prompt that gets
published lives upstream in the chat anyway. Neither won by argument. The **15-second
bake-off** (same script into both tools) settled it with evidence — see
[`../test.md`](../test.md) Part 1 and the bake-off clips.

### Verbatim prompts / outputs / critique · NOT CAPTURED
The actual prompt to each model and their replies are in the Claude/ChatGPT chats. Not
pasted here yet; export and redact them, then relabel `verbatim`/`excerpt`.

### What was folded back in, and what was rejected
- **Kept:** the decision to settle the tool choice by evidence (the bake-off) rather than by
  the stronger argument.
- **Rejected (correctly):** picking Synthesia on the "video system" thesis — the strict-mode
  re-run showed the difference was *register/instinct*, not capability, and HeyGen's fit the
  site's voice with less fighting.

---

## Round 2 — Critiquing the render

**Date:** <YYYY-MM-DD — TO CAPTURE>  ·  **Models:** ChatGPT 5.6 (critique) → Claude Opus 4.8 (triage)

### What happened · `summary`
Given the finished render, ChatGPT critiqued it hard and flagged three things: the on-screen
proof was **too small to read**, the avatar was **boxed in black bars** (pillarboxing), and
one line ("an AI answer engine can't fake") **overclaimed** — an engine *can* fake a claim;
what it can't fake is the visible evidence. Claude triaged these into must-fix vs
nice-to-have, and caught the one thing ChatGPT got wrong: its proposed fix for the
AI-presenter disclosure would have broken the brand's first-person voice — the right fix was
to *disclose* AND keep the voice.

### Verbatim critique / triage · NOT CAPTURED
ChatGPT's actual critique text and Claude's triage are in the chats. Export and redact, then
relabel. Do not reconstruct.

### What was folded back in, and what was rejected
- **Folded in:** the overclaim was cut; proof-zooms and a frame-filling avatar were logged as
  v2 fixes (`test.md` #5–#6); the disclosure line was kept as a *disclosure beside the embed*
  rather than a voice change.
- **Rejected:** ChatGPT's disclosure fix that would have dropped the first-person voice —
  Claude was right to overrule it. (This is the useful bit: neither AI was trusted by default;
  the judgment stayed with the human.)

---

<!-- Add rounds as they're exported. If a round happened but wasn't captured, keep it as a
     `NOT CAPTURED` block like the above rather than writing the models' words from memory. -->
