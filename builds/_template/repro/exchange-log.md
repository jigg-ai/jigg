# Exchange log — <build name>

Cross-model exchanges captured **as they happened**. One model red-teaming another's work
is a real technique this project claims as a differentiator, so the evidence for it has to
be real too.

> **Capture, never reconstruct.** If a round wasn't saved at the time, it does not go in
> here written from memory afterwards. A plausible-looking transcript composed later is a
> fabrication regardless of how well it matches what happened — and it is a worse failure
> than an admitted gap, because it is undetectable. Log the gap instead.

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
material the project keeps private** — and, on chatbot builds, the same material the
adversarial test questions exist to stop the bot revealing. Planning chats routinely
contain things the site deliberately does not publish. Check for and remove:

- Revenue figures, targets, and any exit/valuation aspiration (CONTEXT §12–13 — internal)
- Anything identifying the human behind the persona (CONTEXT: no named individual)
- API keys, tokens, account IDs, private dashboard URLs
- Unrelated projects or third-party material that wandered into the same chat
- Half-formed strategy that reads as a commitment once published

If a round can't be redacted without becoming misleading, leave it out and say so —
`summary` with a note beats a redaction so heavy it changes the meaning.

---

## Round 1 — <what was being decided>

**Date:** <YYYY-MM-DD>  ·  **Models:** <e.g. Claude Opus 4.8 → ChatGPT 5.6>

### Prompt to <model A> · `verbatim`
```text

```

### <model A> output · `excerpt`
```text

```

### <model B> critique · `verbatim`
```text

```

### What was folded back in, and what was rejected
<!-- The decision, and WHY. This is the part readers actually learn from: which critique
     was right, which was ignored, and what changed in the artifact because of it. -->
-

---

<!-- Repeat per round. If a round happened but wasn't captured, record it as: -->
## Round N — <topic> · NOT CAPTURED
Happened on <date>, between <models>, about <topic>. Not logged at the time; no transcript
exists in this repo. Recorded here so the gap is visible rather than silently absent.
