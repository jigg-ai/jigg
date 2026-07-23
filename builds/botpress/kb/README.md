# KB import files — manual workaround

These six files mirror the public pages of jigg.ai that **Botpress's Website sync
refused to index**. They exist only to be imported into the bot's Knowledge Base as
Documents, because the crawler would not take them (see `BACKLOG.md` → "Tooling issues").

## ⚠️ This is a workaround, and it carries a cost

The live site is the source of truth. These are a **frozen copy**, and a frozen copy
drifts. A knowledge base confidently answering from stale content is precisely the
failure this project exists to avoid — so:

- **Re-export and re-import any file whose page changes.** This is a standing obligation,
  not a nice-to-have.
- **Prefer the crawler.** If Botpress's Website sync ever accepts these URLs, delete this
  directory and go back to a synced source. A crawl re-checks itself; these files don't.
- **Never import `bot-config.md`** — that's the bot's *instructions*, not knowledge
  (see the warning at the top of that file).

## The files

| File | Mirrors | Source |
|---|---|---|
| `about.md` | `https://jigg.ai/about/` | `site/src/content/pages/about.md` |
| `privacy.md` | `https://jigg.ai/privacy/` | `site/src/content/pages/privacy.md` |
| `affiliate-disclosure.md` | `https://jigg.ai/affiliate-disclosure/` | `site/src/content/pages/affiliate-disclosure.md` |
| `tools.md` | `https://jigg.ai/tools/` | rendered page (generated from the builds collection) |
| `builds.md` | `https://jigg.ai/builds/` | rendered page (generated from the builds collection) |
| `subscribe.md` | `https://jigg.ai/subscribe/` | rendered page |

`tools.md`, `builds.md` and `subscribe.md` have **no markdown source in the repo** —
those routes are `.astro` pages generated from the `builds` collection, so their content
was transcribed from the live rendered pages. They go stale the moment a build is added.

## Timing note

`privacy.md` includes the support-chat-widget disclosure, which ships with the widget
deploy. Import it **at or after** that deploy so the bot never describes a widget that
isn't live yet.

## Already indexed by the crawler (do NOT duplicate here)

`https://jigg.ai` and `https://jigg.ai/builds/website` were successfully crawled and are
live KB sources. Importing copies of them would double-index the same content.
