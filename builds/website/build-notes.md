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

## Artifacts
<!-- screenshots of each view; the deploy URL; a short screen recording if useful -->
- Repo: https://github.com/jigg-ai/jigg (scaffold checked in, 1 commit on `main`)

## Dead ends
<!-- keep these — they're the honest part of the story -->
- HTTPS + password auth — dead on arrival, GitHub no longer supports it for git ops.
- Deploy key as the SSH route — works, but adds a per-repo "allow write access"
  toggle and a "one key, one repo" scoping that fights against reusing a key across
  the account. Switched to a plain account-level SSH key instead.
- Deleting and recreating the repo to fix the wrong-author commit — didn't fix it by
  itself. The actual fix was the local `git config`, not the repo. Worth remembering
  next time: reset the config, not the repo.