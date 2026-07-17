# PROCESS — how every Jigg.AI build is made

One repeatable pipeline. Start bare; improve it in step 6 after each build.

## 0. New build
Copy `builds/_template/` to `builds/<slug>/`. Fill in `meta.yaml` as you go.

## 1. Define (before building)
In `build-notes.md`, write:
- What I'm building, and why
- Success criteria — what "working" actually means
- The test/checks — decided NOW, not after (so you don't grade on a curve)

## 2. Build
- Do the work: Claude Code for site/repo builds; the tool itself otherwise.
- Log to `build-notes.md` as you go: what you tried, what broke, exact errors,
  decisions, dead ends. Messy is correct — this raw material is the differentiator.
- Capture screenshots / short recordings of the artifact.
- Commits are your timestamped milestones. Commit often, with clear messages.

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
- Update THIS file. The process is dogfooded like everything else.
