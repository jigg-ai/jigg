# Reproduce this build from an empty folder

Exact commands and pinned versions, taken from the running project — not from memory.
Everything here is verifiable against `site/package.json` and `site/astro.config.mjs`.

## Versions this was actually built on

| Thing | Version |
|---|---|
| Astro | `^7.1.0` |
| `@astrojs/mdx` | `^7.0.3` |
| `@astrojs/sitemap` | `^3.7.3` |
| `@fontsource-variable/fraunces` | `^5.2.9` |
| Node (pinned for the deploy) | `22` |

The primary tool's own version (Claude Code) is **deliberately not claimed** — it was a
Claude Desktop install with the CLI not on `PATH`, so it couldn't be verified from the
machine, and a guessed version is a published falsehood. See BACKLOG.

## 1. Scaffold

```bash
npm create astro@latest site -- --template minimal --typescript strict --no-install --no-git
cd site
npm install
npm install @astrojs/mdx @astrojs/sitemap @fontsource-variable/fraunces
```

## 2. Configure Astro

`site/astro.config.mjs` — `site` must match where it's actually served, because it feeds
canonical URLs and the sitemap:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-domain.example',
  integrations: [mdx(), sitemap()],
  // Code blocks render in the site's own palette rather than a syntax theme.
  markdown: { syntaxHighlight: false },
});
```

## 3. Define the collection

Create `site/src/content.config.ts` — this is the single source of truth every view
validates against. The field-by-field annotation is in [`schema.md`](schema.md). The two
things that matter structurally:

- the loader globs `**/*.mdx` from `./src/content/builds`, so **the filename is the slug**
- three distinct tool roles (`tool`, `built_with`, `stack`) that must not be merged —
  only `tool` creates a `/tools` entry and takes the affiliate link

## 4. Derive the queries in one place

`site/src/lib/builds.ts` holds every query the pages use (featured, recent, by category,
grouped by tool). Pages call these; they never re-implement filtering. This is what keeps
the four views from drifting apart, and it's where the draft filter lives.

## 5. Build the four views

```
site/src/pages/
├─ index.astro            → home: featured build + recent
├─ builds/index.astro     → archive: timeline + category chips
├─ builds/[slug].astro    → one page per entry (dynamic route)
└─ tools/index.astro      → tools index, projected from the same collection
```

## 6. Verify the invariant before you trust it

```bash
npm run dev      # localhost:4321, drafts visible
npm run build    # the real validator: type-checks .astro, validates every entry
                 # against the zod schema, fails on a bad frontmatter field
npm run preview  # production-like: drafts hidden
```

There is no test runner and no linter in this project. `npm run build` **is** the check
that matters. Add a temporary `.mdx` under `src/content/builds/`, build, and grep
`dist/` for its title in `index.html`, `builds/index.html` and `tools/index.html` — then
delete it. That is exactly how the core invariant was checked in build #1.

## What took the time (so it doesn't take yours)

Not the code. The scaffold and all four page templates came together in one session. The
time sink was Git and GitHub authentication — see [`deploy.md`](deploy.md) for the full
chain of four mistakes and the boring fix. Every one of them was local config, not a tool
limitation.
