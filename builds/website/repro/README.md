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
**full model-critique back-and-forth** between Claude and ChatGPT. **Those artifacts do
not exist.** Build #1's session was never recorded — the prompts and critiques were not
captured anywhere in the repo, and there is no transcript to publish.

They are not included here because the only way to produce them now would be to write
plausible-looking prompts after the fact and present them as the real ones. Manufacturing
evidence to satisfy a promise is worse than the broken promise, so the promise was
retracted from the build page instead.

Two further items are absent for the same reason:
- **"Full-resolution editable diagrams"** — no source diagram files were ever created.
  `architecture.md` contains a real diagram authored from the actual code instead.
- **"Complete schema and sample dataset"** — there is no dataset. The content *is* the
  markdown entries; `schema.md` documents the real schema.

**Fixed going forward:** capturing prompts and key decisions *during* the build is now an
explicit pipeline step rather than an afterthought (PROCESS §2), so later builds won't
have this hole.
