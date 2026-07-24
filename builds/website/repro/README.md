# Repro pack — the Jigg.AI site (build #1)

Everything needed to rebuild this site's architecture from an empty folder. It's all
plain files in a public repo — there is no gated download and nothing to hand over an
email address for. That's deliberate: the About page claims "no database, no lock-in,"
and a pack you have to pay for with an email would contradict it.

## What's in here

| File | What it gives you |
|---|---|
| [`architecture.md`](architecture.md) | The one-collection → four-views design, and why adding a build is adding one file |
| [`schema.md`](schema.md) | The content-collection schema, annotated field by field |
| [`reproduce.md`](reproduce.md) | Step-by-step rebuild from an empty folder — exact commands and versions |
| [`deploy.md`](deploy.md) | Netlify config, custom domain + HTTPS, and the Git/SSH auth chain that ate the time |

Plus, already public elsewhere in this repo:

- [`../build-notes.md`](../build-notes.md) — the running journal, including every dead end
- [`../test.md`](../test.md) — the check set decided before building, and the honest results
- [`../meta.yaml`](../meta.yaml) — the perishable facts (versions, dates, freshness)
- `site/` at the repo root — the actual running source, not a copy of it

## What is deliberately NOT in here, and why

The build page previously advertised a **"complete curated prompt sequence"** and the
**full model-critique back-and-forth** between Claude and ChatGPT. Neither is here,
because neither was ever captured **into this repo** during build #1.

Precisely: what's verified is that no prompt or critique artifact exists anywhere in the
repository. The original ChatGPT and Claude chat histories may well still exist outside
it — so treat this as a **capture failure, not a lost artifact**. It is recoverable by
exporting those chats, redacting them, and adding them here with their provenance
labelled (see `builds/_template/repro/exchange-log.md` for the shape).

What will not happen is reconstruction. Writing a plausible-looking exchange from memory
and presenting it as the original is fabrication no matter how closely it resembles what
happened, and it is a worse failure than the missing file it would paper over.

Two further items are absent for the same reason:
- **"Full-resolution editable diagrams"** — no source diagram files were ever created.
  `architecture.md` contains a real diagram authored from the actual code instead.
- **"Complete schema and sample dataset"** — there is no dataset. The content *is* the
  markdown entries; `schema.md` documents the real schema.

**Fixed going forward:** capturing prompts and key decisions *during* the build is now an
explicit pipeline step rather than an afterthought (PROCESS §2), so later builds won't
have this hole.
