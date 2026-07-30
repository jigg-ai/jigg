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
- **Capture the prompts and key decisions AS YOU GO.** Build #1 promised "the actual
  prompts and critiques" in its repro pack and shipped without them, because none of it
  was captured into the repo. A prompt you didn't save cannot be honestly reconstructed
  later — writing plausible ones afterwards and calling them the originals is
  manufacturing evidence, and it's undetectable, which is what makes it disqualifying.

  **Two kinds of material, two different owners — don't conflate them:**

  | Material | Who can capture it |
  |---|---|
  | Work inside Claude Code / the repo | **The agent.** Log decisions, errors and dead ends to `build-notes.md` as they happen. |
  | Cross-model exchanges in ChatGPT / Claude.ai | **Only the human.** The agent cannot see those chats and must never infer their contents. |

  So the agent's obligation for external exchanges is not to produce them — it's to
  **ask for them, explicitly, at draft time**, and to record a visible `NOT CAPTURED`
  entry if they aren't supplied. Silently omitting them is how build #1's promise rotted.

- **Starting a cross-model critique? Open the exchange log first.** Copy
  `builds/_template/repro/exchange-log.md` to `builds/<slug>/repro/` and paste each round
  in as it happens. Say "starting an exchange, log it" and the agent should open the file
  and prompt for each round rather than waiting until the end. The template carries the
  provenance labels (`verbatim` / `excerpt` / `redacted` / `summary`) and, importantly, a
  **redaction checklist** — the pack is public, so a raw planning chat can leak revenue
  figures, exit targets, or the identity behind the persona. On chatbot builds that's the
  same material the adversarial tests exist to stop the bot revealing; don't let the
  repro pack become the leak the bot refused to be.
- For repo/site builds, let Claude Code scaffold from the brief (don't hand-build and
  push), and verify Git identity + push auth BEFORE the first commit: repo-local
  `user.email`, a single account-level SSH key (not a read-only deploy key), a clean
  agent. This is the reliable time sink — get it right once.
- Log to `build-notes.md` as you go: what you tried, what broke, exact errors,
  decisions, dead ends. Messy is correct — this raw material is the differentiator.
- Capture screenshots / short recordings of the artifact.
- Commits are your timestamped milestones. One logical change per commit, clear
  messages (they feed the build log). See CLAUDE.md for commit rules.
- **Work on a `build/<slug>` branch, and commit as freely as the work deserves** — branch
  pushes are free, so cost never argues for fewer commits. See **Shipping** below for the
  branch → preview → merge flow and the merge rules that keep this log intact.

## 3. Test
- Run the check set from step 1. Record results in `test.md`.
- Tag each failure: [tool limit] vs [my setup].

## 4. Draft
- From the repo (`build-notes.md` + `git log` + `test.md` + `meta.yaml`),
  generate `post.md` in house style (`STYLE.md`).
- Draft only. Never auto-publish.

## 5. Verify & publish

**This step has a human in it. It is not optional and it is not the agent's to skip.**

- **Assemble the repro pack in `repro/` — generate it, don't defer it.** Whoever drafts
  the post also assembles the pack in the same pass, from artifacts that actually exist.
  Default to **public, in-repo**: a pack behind an email gate contradicts the site's own
  "no database, no lock-in" claim, and a gated pack that doesn't exist is worse — build
  #1 shipped a form collecting addresses for a pack that was never built. If a promised
  artifact wasn't captured, **say so in the pack** rather than reconstructing it.
- **Then STOP and ask the human for the edit pass, explicitly.** Do not set `published`
  or flip `status` to `verified` first, and do not mark a build verified on the agent's
  own say-so. The ask should be concrete, not "does this look OK?" — hand over:
  - a claim-by-claim audit of the draft against `test.md`, `meta.yaml` and `git log`,
    flagging anything overclaimed, contradicted, or unsupported;
  - the specific decisions only a human should make (does this merit `verified`? does
    the copy overpromise? is the voice right?).
- **Only after the human signs off:** set `published`, `last_verified`, `status`.
- **Then merge the branch — the merge is the publish** (see **Shipping** below). Hand the
  human the Deploy Preview URL for the sign-off above, not the live site: the whole point
  is that they review it before it exists in public. Merging last also keeps `published`
  honest, since the deploy lands the same day the date claims.
- **After the deploy: re-sync anything that holds a COPY of the site's content.** Today
  that means the support bot's knowledge base. Publishing corrected copy does not correct
  the bot — it keeps answering from whatever it crawled last.
  > Proven the hard way at build #2's publish. Minutes after deploying the corrected
  > build-#1 page, the live bot was still reciting the retracted repro-pack list —
  > "full-resolution editable diagrams", "complete curated prompt sequence" — artifacts we
  > had just documented as non-existent. The page was honest; the bot was not, and the bot
  > is the surface a visitor actually converses with. **A cache of a retracted claim is a
  > retracted claim, still being made.** Re-crawl, then spot-check one question whose
  > answer changed in the deploy.

> Why this is written so hard: build #1 was published with `status: verified` while two
> of these three sub-steps had never happened. The flag asserted a verification the
> process defines and that nobody performed. A `verified` badge the process didn't earn
> is the one failure mode this project cannot survive, because it's the exact thing the
> whole site claims to be better at.

## 6. Retro — this is how the process evolves
- 2–3 lines: what was clunky, what to change next time.
- Update THIS file (add to the retro log below). The process is dogfooded like
  everything else.

## Shipping — how work reaches production

Applies across every step above, not at one point in the pipeline.

**Why there's a rule at all.** Netlify meters **production deploys only**, at 15 credits
each against a 300-credit monthly allowance — about 20 deploys a month. Build #1 ran with
auto-deploy on every push to `main` and spent **315 of 317.4 credits on deploys**; nine
thousand web requests cost 2.3. The allowance ran out before the cycle did, and nothing
could ship until it reset. Traffic here is effectively free. *Shipping* is what costs.

The cause wasn't doing too much work — it was that committing and pushing normally
triggered a metered deploy every time. **Deploy Previews and branch deploys are 0
credits**, so all iteration belongs there.

| Work | Path | Cost |
|---|---|---|
| Docs only — nothing under `site/` or `netlify.toml` | commit straight to `main` | **0** (build `ignore`) |
| A build | `build/<slug>` → PR → preview → merge | 15 |
| Site fix / enhancement | `fix/<slug>` → PR → preview → merge | 15, batchable |
| Urgent production fix | `fix/<slug>` → PR → merge | 15, never batched |

### For a build
1. Branch `build/<slug>` off `main`. Commit as freely as the work deserves — pushes to a
   branch are free, so nothing here should ever discourage committing.
2. Iterate locally: **`netlify dev` if functions are in scope**, `npm run preview`
   otherwise. `npm run preview` does NOT serve `site/netlify/functions/`, nor apply
   `netlify.toml` redirects and headers — build #1's most expensive debugging episode was
   function work, exactly what it can't exercise.
3. Push the branch, open a PR against `main`. Netlify builds a Deploy Preview and rebuilds
   it on every subsequent commit, at the same URL. **Fixes go on top as new commits — the
   PR is the workspace, not a one-shot submission.** Never close and reopen.
4. Verify on the preview: the real production build on real infrastructure. This is also
   where the step-5 human pass happens, before anything is live.
5. **Merge. The merge IS the publish** — one production deploy, nothing to click.
   Auto-publish on `main` stays ON; there is no separate deploy step.

If a branch sits open for days, rebase onto `main` before the final verification, or
you're approving a state that won't exist after the merge.

### The discipline, and the two ways to wreck the log
- **Merge when the build is done, not nearly done.** On-branch iteration is free;
  post-merge fixes are 15 credits each. "Merged, then spotted a typo, merged again" is
  the only expensive habit left.
- **Merge commits only — never squash.** Squashing collapses a branch to one commit and
  one timestamp, deleting the `diag → fix → chore: remove diagnostic` sequences that are
  this project's differentiating raw material and the input to step 4. Squash- and
  rebase-merge are disabled on the GitHub repo for this reason.
- **Never amend or force-push to tidy a branch.** Same loss, self-inflicted. Push fix
  commits on top and let the mess stand.

`main` becomes non-linear as a result; `git log --first-parent main` reads as one
milestone per build, and `git log <merge>^..<merge>` gives that build's internals.
Acceptable while one build is in flight at a time — revisit if that changes.

### Don't piggyback unrelated work on a build branch
A Buttondown fix riding on `build/<slug>` couples two things that can block each other,
and pollutes the commit range step 4 reads as that build's story. The exception is a
change the build genuinely depends on — then it isn't a separate fix, it's part of the
build. Independent, non-urgent site fixes can be batched onto one `chore/*` sweep: unlike
builds, they carry no `published` date and no step-5 gate, so holding them corrupts
nothing.

### Testing the newsletter proxy on a preview
A preview reaches Buttondown from a Netlify datacenter IP, same as production — so the
condition behind build #1's firewall saga reproduces faithfully, and this is the class of
bug previews are best at. Two rules: use a disposable tagged address
(`jigg.ai.biz+test-YYYYMMDD@gmail.com`) and delete it afterwards, and never test with the
owner's own address — `BACKLOG.md` records it getting firewall-blocked, so it's a
misleading subject. Double opt-in means a test sub stays unactivated until confirmed;
decide whether you're testing the proxy or the whole flow.

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
- Docs that assert repo state must be edited IN the repo, against the real tree — not
  from an uploaded copy in a chat. Editing CONTEXT/PROCESS that way produced three
  errors in a single pass: a per-build `BRIEF.md` was mandated that `_template/` didn't
  contain, build #2 was described as "in progress" when no folder existed, and a second
  backlog appeared inside this retro duplicating `BACKLOG.md`. None were careless
  writing — the chat simply couldn't see the tree, so it described the intended repo
  rather than the actual one. Plan in chat; make the edit where the state is verifiable,
  and check assertions against the filesystem before they land.
- Open items that outlived this build are tracked in `BACKLOG.md`, not here — one
  backlog in one place, so deferrals don't drift across files. This retro stays
  retrospective: what was clunky, and what changed in the process because of it.

### Build #1 — audit of the published post (Jul 2026, during build #2)
Build #1 was audited claim-by-claim against `test.md`, `meta.yaml`, `repro/` and
`git log` before build #2 was allowed to publish. What it found, and what changed:
- **`status: verified` was set while step 5 had never been done.** The human edit pass
  and the repro pack were both skipped; only the metadata was filled in. Step 5 is now
  written as a hard gate with the human ask made explicit, because an agent that can
  quietly mark its own work verified makes the freshness system decorative.
- **The page promised a repro pack that didn't exist, behind an email form.** Fixed by
  building the pack for real and making it public in-repo. Packs are now assembled in the
  same pass as the draft, not deferred — deferred packs become permanent promises.
- **The page undercounted its own unrun checks** ("the one check" when `test.md` recorded
  three). The lesson generalises: prose that summarises `test.md` drifts from it, so state
  counts, not adjectives, and check them against the file.
- **Two promised artifacts could not be produced honestly** because the build session was
  never recorded. Hence the new capture-as-you-go requirement in step 2. The gap is
  disclosed on the page rather than reconstructed — an admitted hole beats a plausible
  fabrication, and this project cannot afford to be caught doing the second.
