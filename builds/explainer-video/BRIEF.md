# BRIEF — build #3: the Jigg.AI explainer video (HeyGen)

Read `CONTEXT.md` (what/why), `PROCESS.md` (the pipeline), and `STYLE.md` (voice)
first, plus CONTEXT §3 (build-log anatomy) and §5 (tool roles). This brief covers
build #3 only.

## Goal
A ~70–90 second explainer video that says what Jigg.AI is, made entirely with an AI
presenter and AI narration — no camera, no human face, no human voice — built with
**HeyGen** and embedded on this build's detail page (the real dogfood behind
`runs_on_site: true`). "Done" = a publishable, watermark-free video that a fresh viewer
understands, with the AI disclosure rendered beside it. This is the first **Video**
build and the first exercise of the concept's "no human face — AI avatar/narration,
always disclosed" model (CONTEXT §4).

## Tools — the three roles (CONTEXT §5)
- **Primary tool:** HeyGen. The one tool this build reviews — it gets the verdict, the
  accessibility read, the affiliate link, and the tools-index entry. Un-versioned hosted
  service, so no pinned `tool_version` (the avatar engine — Avatar IV / Video Agent — can
  be named in prose, but it isn't a stamp version).
- **Built with:** Claude Opus 4.8 (planning, script, frame-level QA) and ChatGPT 5.6
  (adversarial reviewer — argued the Synthesia case, critiqued the render). Display-only:
  never indexed, never affiliate-linked.
- **Stack:** YouTube — the video host/embed, the one supporting tool this build required.
  **Synthesia is NOT stack** — it was evaluated in a bake-off and rejected, so it belongs
  in the selection narrative, not the stack line. The site's permanent infra
  (Astro/Netlify/Cloudflare/GitHub) is not inherited onto this build.

## In scope
- The video artifact itself (the finished ~70s explainer), embedded on the build page
  with the AI disclosure line rendered verbatim beside it (required by CONTEXT §4).
- The **tool-selection bake-off**: the same 15-second script fed into HeyGen and
  Synthesia, decided on evidence, not a coin flip — including the fairness re-run.
- The **video test** (below) — the check set adapted to video, decided before generating.
- What gets published: `post.md` drafted in house voice, and a **video-shaped repro
  pack** (public substantiation on-page + a gated full pack). The pack carries this
  build's prompt-provenance goal.

## The test — decide it NOW, before generating (PROCESS §1)
Video has no single X/30. The check set, fixed before the render was judged:
- **Fresh-viewer clarity** — show it to people who've never seen the site; do they get
  the premise? (The metric I can't self-judge — it counts most.)
- **Avatar believability** — credible, no uncanny flags on the paid render.
- **Voice naturalness** — the clipped beat and list pacing land; "Jigg.AI" pronounced
  cleanly.
- **Operational cost** — time to a usable render, number of takes, credits consumed, and
  the real dollar cost per finished minute.
Plus the selection rubric that scored HeyGen vs Synthesia in the 15s bake-off. Full detail
and results in `test.md`; tag each failure `[tool limit]` vs `[my setup]`.

## Deferred — do NOT build now
- A full **HeyGen vs Synthesia comparison build** (same 90s script into both, reader
  judges) — parked until this solo baseline exists.
- **v2 re-render fixes** — a frame-filling/landscape avatar (kills pillarboxing across
  the series), deliberate proof-zooms, and a soft caption track (export an `.srt`).
  These become a "what I'd change" retro on THIS page, not a re-render now.
- Any editing suite, motion graphics, or multi-scene production beyond what HeyGen does.

## Success criteria
- A watermark-free, publishable video that reads as a coherent explainer of Jigg.AI.
- Fresh viewers understand the premise unprompted.
- Avatar/voice are credible with no uncanny flags on the shipped render.
- The AI disclosure line renders beside the embed (non-negotiable — CONTEXT §4).
- The build lights up all four views by adding one `.mdx` entry — the invariant holds.

## Publish gates (do NOT publish these sections until they clear — Part A §5)
1. **HeyGen affiliate link + terms — UNVERIFIED.** Sign up for HeyGen's Rewardful
   program; pull the real commission terms and cookie window from the official dashboard;
   use that link. Never state commission numbers from memory or aggregators.
2. **Real paid price — from the receipt.** The actual dollar figure paid is a test metric
   (cost per finished minute); set `pricing_as_of`. No third-party price.
3. **YouTube link** is link-gated until channel verification clears. When it does: add the
   real links to the description, pinned comment, and end-screen, and confirm the embed.
4. Confirm the disclosure line renders beside the embed.
Plus the standing gate: the **human verify/edit pass** (PROCESS §5) before `status`,
`published`, `last_verified` are set. The agent does not flip those.

## Notes
- Log to `build-notes.md` as you go — what broke, exact errors, dead ends. Messy is
  correct; it's the differentiator.
- The cross-model exchange and the full prompt set live in the human's Claude/ChatGPT
  chats — the agent cannot see them and must not reconstruct them (PROCESS §2). They are
  captured by the human into `repro/` or recorded as `NOT CAPTURED`.
- Open items that outlive the build go to `BACKLOG.md`, not into a chat.
