# PROCESS — how every Jigg.AI build is made

One repeatable pipeline. Start bare; improve it in step 6 after each build.

## 0. New build
Copy `builds/_template/` to `builds/<slug>/`. Give the build its own `BRIEF.md`
(what you're building, scope, and what's deferred). Fill in `meta.yaml` as you go —
set the primary `tool`, `built_with` (production AIs), and `stack` per their roles
(see CONTEXT.md §5).

## 1. Define (before building)
In `build-notes.md`, write:
- What I'm building, and why
- Success criteria — what "working" actually means
- The test/checks — decided NOW, not after (so you don't grade on a curve). Adapt the
  check to the build type (30 representative questions for a bot; foundation checks for
  a site build).

## 2. Build
- Do the work: Claude Code for site/repo builds; the tool itself otherwise.
- For repo/site builds, let Claude Code scaffold from the brief (don't hand-build and
  push), and verify Git identity + push auth BEFORE the first commit: repo-local
  `user.email`, a single account-level SSH key (not a read-only deploy key), a clean
  agent. This is the reliable time sink — get it right once.
- Log to `build-notes.md` as you go: what you tried, what broke, exact errors,
  decisions, dead ends. Messy is correct — this raw material is the differentiator.
- Capture screenshots / short recordings of the artifact.
- Commits are your timestamped milestones. One logical change per commit, clear
  messages (they feed the build log). See CLAUDE.md for commit rules.

## 3. Test
- Run the check set from step 1. Record results in `test.md`.
- Tag each failure: [tool limit] vs [my setup].

## 4. Draft
- From the repo (`build-notes.md` + `git log` + `test.md` + `meta.yaml`),
  generate `post.md` in house style (`STYLE.md`).
- Draft only. Never auto-publish.

## 5. Verify & publish
- Human edit pass for honesty and voice.
- Assemble the repro pack in `repro/` (public substantiation + gated full files).
- Set `published`, `last_verified`, `status` in `meta.yaml`.

## 6. Retro — this is how the process evolves
- 2–3 lines: what was clunky, what to change next time.
- Update THIS file (add to the retro log below). The process is dogfooded like
  everything else.

## Retro log

### Build #1 — the site (Jul 2026)
- The `_template/` was written chatbot-shaped and leaked chatbot language into a
  website build. Genericize templates; the check set and repro pack must adapt per
  build type, not assume a bot.
- Scaffold via Claude Code from the brief, not by hand — generating a scaffold in chat
  and manually pushing it added a needless step.
- The real time sink was Git/GitHub auth, not building (HTTPS-with-password is dead;
  a read-only deploy key silently blocks pushes; a stale global identity + two keys in
  the agent caused wrong-account auth). Now folded into step 2 as a standing check.
- Decide in a planning chat, implement in Claude Code. Settle the concept (mock it if
  visual) before Claude Code writes code, so it implements once against a clear target.
- Open items that outlived this build are tracked in `BACKLOG.md`, not here — one
  backlog in one place, so deferrals don't drift across files. This retro stays
  retrospective: what was clunky, and what changed in the process because of it.
