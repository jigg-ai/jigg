# BRIEF — <build name>

Read `CONTEXT.md` (what/why), `PROCESS.md` (the pipeline), and `STYLE.md` (voice)
first. This brief covers THIS build only.

Keep the shape build-agnostic — fill it with whatever this build actually is. Don't
inherit another build's assumptions (a bot's flow, a site's routes); that's how
template language leaks into the wrong build.

## Goal
One paragraph: what's being built and what "done" looks like. The artifact should be a
real thing someone could use, not a demo.

## Tools — the three roles (CONTEXT.md §5)
- **Primary tool:** the ONE tool this build reviews. Gets the verdict, the
  accessibility read, the affiliate link, and the tools-index entry.
- **Built with:** the production AIs used to make it. Display-only — never indexed,
  never affiliate-linked.
- **Stack:** supporting tools this build actually required. Display-only. List only
  what THIS build needed; don't inherit the site's permanent infrastructure.

Version where it's pinnable and meaningful (models, frameworks); omit versions for
un-versioned hosted services.

## In scope
- The artifact itself
- The check set — decided BEFORE building (PROCESS step 1), adapted to this build type
- What gets published: the post, and which repro-pack tier (public / gated)

## Deferred — do NOT build now
- List what's explicitly out, so it can't creep in mid-build.

## Success criteria
- What must be true for this to count as working, in terms you can actually test.

## Notes
- Log to `build-notes.md` as you go — what broke, exact errors, dead ends. Messy is
  correct; it's the differentiator.
- Open items that outlive the build go to `BACKLOG.md`, not into a chat.
