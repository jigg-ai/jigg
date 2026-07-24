# Repro pack — the Botpress support chatbot (build #2)

Everything needed to rebuild this bot and re-run its test. Public, in the repo — the
evidence for a claim is never behind an email gate.

## The substantiation (all already public in this repo)

| What | Where |
|---|---|
| The bot's **system instructions**, verbatim — the grounding and refusal rules that produce the behaviour in the transcript on the build page | [`../bot-config.md`](../bot-config.md) |
| The 6 hand-built KB import files — **the workaround, now retired** (see below) | [`../kb/`](../kb/) |
| The **full 30-question set**, the fixed bucket split, the scoring rubric, and the publish bar — all fixed *before* the bot existed | [`../test.md`](../test.md) |
| **Both scored runs**, question by question, with every failure tagged `[my setup]` / `[tool limit]` | [`../test.md`](../test.md) |
| The **running journal** — every wrong theory, exact errors, and the `curl` output that killed the redirect diagnosis | [`../build-notes.md`](../build-notes.md) |
| The **embed**, and how it's mounted site-wide | [`reproduce.md`](reproduce.md), `site/src/components/BotpressWebchat.astro` |
| Perishable facts — affiliate link, verdict, accessibility read | [`../meta.yaml`](../meta.yaml) |

Start with [`reproduce.md`](reproduce.md) — it's the step-by-step rebuild, including the
two traps that cost the most time.

## ⚠️ `kb/` is historical — no longer the live knowledge base

Those six files were the workaround for a crawler that only reached 2 of 8 pages. The
real cause turned out to be a **missing `robots.txt`** on our side; adding it took the
crawl to all 11 URLs, so the hand-built imports were **removed from Botpress on
2026-07-23**. The live KB is now the crawled site.

They're kept here because both test runs were scored against them — deleting them would
erase the conditions the published 26/30 was measured under. Read them as a record of
what was loaded during the test, **not** as the current knowledge base.

## Provenance

Everything here is **captured, not reconstructed**. The test transcripts are real replies
read out of the live widget's DOM; the instructions and KB files are the actual ones
loaded into Botpress; the failure log was written as it happened.

Where something wasn't captured, it says so rather than being filled in after the fact —
see PROCESS §2 on why that line is absolute.

## Not included, deliberately

- **No Botpress pricing.** It was never captured during the build, so `pricing_as_of` is
  unset and no cost claim appears anywhere. An uncaptured price is not a price you get to
  estimate — this project's founding example of a bad AI answer is an invented one.
- **No account credentials, workspace IDs, or the admin console URL.** The bot's public
  webchat client ID is in the embed (it has to be, it ships to every browser); the private
  dashboard link is not.
