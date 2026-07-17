# Build notes — the Jigg.AI site (build #1)

The running journal for building the site itself with Claude Code + Astro.
Write as you go. Messy is correct — this is the first published build log.

## Define
- Building: the Jigg.AI Astro site — data model (builds content collection) + the four
  page templates (home, archive, build detail, tools index), plus one real entry
  (this build). See site/BRIEF.md.
- Why: it's the foundation everything publishes on, and building it with AI from
  scratch is the most on-brand possible first proof of "anyone can build real things
  with AI."
- Success criteria:
  - Site builds and deploys (live URL).
  - All four views render from the single `builds` collection.
  - Adding a new markdown build entry updates home + archive + tools index with no
    page-code changes.
  - HTML is clean, fast, semantic, accessible (citation-friendly).
- Checks (decided before building): see test.md.

## Log
<!-- what I tried, what Claude Code got wrong first, exact errors, decisions, retries -->
- **Scaffold generation** — Had Claude generate the initial repo scaffold: CONTEXT.md,
  PROCESS.md, STYLE.md, README.md, .gitignore, `builds/_template/`, this build's own
  `builds/website/` folder pre-seeded, and `site/BRIEF.md`. Delivered as
  `jigg-ai-scaffold.zip`, downloaded and unzipped locally.
- **Repo checkin — the part that took way longer than it should have** — Unzipped the
  scaffold, initialized git, and pushed to `github.com/jigg-ai/jigg`. Zero of this was
  about building anything; all of it was GitHub/git config friction. Logging it
  honestly since "the messy part" is the actual content model here:
  - [my setup] Zip's top-level folder was named `jigg-ai/`, not `jigg/` — renamed
    before `git init` so the repo wouldn't nest wrong.
  - [my setup] First push attempt used HTTPS with a plain account password — GitHub
    retired that auth path; needed a PAT or SSH instead.
  - [my setup] Switched to SSH, registered the key as a repo-level **deploy key**.
    Deploy keys default to read-only, so pushes kept getting denied even once the SSH
    handshake itself succeeded.
  - [my setup] First commit landed under the wrong git identity — `~/.gitconfig`'s
    global `user.email` was a leftover from another project; hadn't set a repo-local
    override, so the wrong author ended up baked into the commit.
  - [my setup] Deleted and recreated the repo to reset cleanly; the next deploy-key
    add attempt failed with "Key already in use" — the same key was already
    registered elsewhere. Generated a fresh keypair (`id_ed25519_jigg2`) to get a
    clean registration.
  - [my setup] Even with the new key authenticating fine, push was *still* denied —
    turned out GitHub was authenticating through a stale deploy-key entry (still
    read-only) rather than the account-level key.
  - [my setup] `ssh-add -l` showed both the old and new key loaded in the agent at
    once, so which one actually got offered to GitHub was ambiguous. Cleared the
    agent (`ssh-add -D`) and reloaded only the correct key.
  - Root cause, once untangled: no single bug — a chain of small identity/config
    mismatches (repo naming, auth method, key scope, git user, agent state) that each
    needed isolating and fixing one at a time. Nothing here was a Claude Code or
    GitHub limitation; every item traces back to local config on my end.
- **Resolution** — Repo-local git identity set via `git config --local`, single SSH
  key loaded in the agent, key registered at the account level (not as a deploy key,
  so there's no separate read/write toggle to fight). Clean first commit: 1 commit,
  correct author, full scaffold present at `github.com/jigg-ai/jigg`.

- **Plan-first pass** — Read the four docs + all eight mockup slices before writing any
  code, and got four architecture decisions ruled on up front rather than discovering
  them mid-build: nav follows the brief (not the mockups), rich post content lives in
  MDX-body components (not extended frontmatter), the tools index is a *projection* of
  the builds collection (not a second collection), and one self-hosted variable serif.
  Cheap step, and it's why the build itself had almost no rework.
- **The stack was newer than the model's training** — `npm view` showed Astro at
  **7.1.0**; Claude Code's knowledge cuts off at Astro 5. Rather than trust memory, it
  verified the content-collections API against the actually-installed package
  (`glob({pattern, base})` and `defineCollection` confirmed in
  `node_modules/astro/dist/content/loaders/glob.d.ts`) and let `astro build` validate
  the rest. Worth noting as a repeatable move: when the tool is ahead of the model,
  check the installed source, don't guess. No API drift found — the v5 Content Layer
  API still holds in v7.
- **Build passed first try** — 6 routes + sitemap in ~2s, no errors. Logging this
  because "it just worked" is as honest as a failure, and the pattern is clear: the
  friction in this build was never the code, it was the config around it (see the
  auth saga above).
- **Deviations from the mockups, made on purpose** (mockups are reference, not source):
  - [my setup] Mockup nav shows category names (Chatbots/Video/…); the brief and
    CONTEXT §5/§7 say `Builds · Tools · About · Subscribe` with categories as filters.
    Followed the brief — the mockup predates that decision.
  - [my setup] Mockup's "Reproduce this exactly" callout is **light blue** — a fourth
    hue carrying no status meaning. Under the colour ruling (brand + muted status set
    only) it's rendered in the brand peach tint instead.
  - [my setup] Mockup's home subhead reads "pairs a **popular** AI tool" — STYLE.md
    explicitly forbids "popular" ("an AI tool worth your time"). Rewrote the copy.
    A good catch for why the mockups can't be treated as source for text.
  - **Home artifact preview omitted, deliberately.** The mockup features a live
    Botpress chatbot demo — but that's build #2 and it doesn't exist yet. Putting a
    fake chatbot on the flagship page of a site whose entire thesis is "here's the
    tested proof" would undercut the product. The `DemoStub` component is built and
    ready for the moment build #2 lands; the home hero is text-forward until then.
- **Honest gaps at scaffold time** — `test_score` left empty and the deploy/Lighthouse
  checks are recorded as *pending* rather than claimed (see test.md). The one entry is
  marked `status: verified` so the site isn't empty and can deploy, but the human
  edit/verify pass (PROCESS step 5) has NOT happened yet — the post copy is a first
  honest draft, not a published-quality edit.

- **Deploy** — Connected the `jigg-ai/jigg` repo to Netlify (git-based continuous
  deploy from `main`). The subdirectory layout (`site/`) was the only thing to get
  right: `netlify.toml` with `base = "site"`, `command = "npm run build"`, and
  `publish = "dist"` — publish is relative to `base`, so `dist` not `site/dist`
  (verified against Netlify's docs first; `site/dist` would double-nest and fail the
  deploy). Node pinned to 22. First build succeeded with no errors; verified the home
  page, all four views, the dynamic build-detail route, the self-hosted font, and CSS
  all render live with no console errors. Custom domain (jigg.ai) not connected yet, so
  `astro.config.mjs` `site` points at the Netlify URL for now (correct canonical/sitemap).

## Artifacts
<!-- screenshots of each view; the deploy URL; a short screen recording if useful -->
- Repo: https://github.com/jigg-ai/jigg — build #1 scaffold pushed to `main`.
- Live site: https://candid-gingersnap-6c4b87.netlify.app (Netlify, static, auto-deploys on push to `main`)
- Astro site scaffolded at `site/` — Astro 7.1, `@astrojs/mdx`, `@astrojs/sitemap`,
  `@fontsource-variable/fraunces` (self-hosted, no Google Fonts network call). 4 deps.
- All four views verified rendering from the single collection at `localhost:4321`
  (home, /builds, /builds/website, /tools), mobile (375px) checked, no console errors.

## Dead ends
<!-- keep these — they're the honest part of the story -->
- HTTPS + password auth — dead on arrival, GitHub no longer supports it for git ops.
- Deploy key as the SSH route — works, but adds a per-repo "allow write access"
  toggle and a "one key, one repo" scoping that fights against reusing a key across
  the account. Switched to a plain account-level SSH key instead.
- Deleting and recreating the repo to fix the wrong-author commit — didn't fix it by
  itself. The actual fix was the local `git config`, not the repo. Worth remembering
  next time: reset the config, not the repo.
- Built the `DemoStub` artifact-preview component before anything actually needed it.
  It's correct and build #2 (the Botpress bot) will use it immediately — but it ships
  unused in build #1, which is building ahead of the requirement. Small, but it's the
  honest kind of thing this log exists to record.
- Drafted the build detail with a `## Reproduce this` heading directly above a callout
  titled "Reproduce this exactly" — read as a stutter. Dropped the heading and let the
  callout title carry the section, which is what the mockup did all along.