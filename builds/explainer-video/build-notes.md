# Build notes — build #3: the Jigg.AI explainer video (HeyGen)

The running journal. Messy is correct.

> **Provenance of these notes.** The video itself was made outside this repo — in
> HeyGen, and in the planning/QA chats (Claude + ChatGPT). This agent did not drive
> HeyGen and cannot see those chats. These beats are assembled from the build-#3 handoff
> and the render QA, not logged live in Claude Code. Where a fact belongs to the human's
> chats (the prompts, the cross-model exchange), it is NOT reconstructed here — it is
> flagged for the human to export (PROCESS §2). Perishable facts still to capture from
> source (the receipt, the render session) are marked TO-CAPTURE, never guessed.

## Define
- **Building:** a ~70–90s explainer video for Jigg.AI, made entirely with an AI presenter
  and AI narration (no camera, no human face/voice), built with HeyGen and embedded on
  this build page. First Video build; first exercise of CONTEXT §4's "no human face,
  always disclosed" model.
- **Why:** Build #3. First Video-category build, first HeyGen review, and the first build
  where being AI-made is literally the artifact's message. The honest process + the video
  test are the deliverable, not a polished film.
- **Success criteria:** watermark-free publishable video; fresh viewers get the premise;
  avatar/voice credible with no uncanny flags; the AI disclosure line renders beside the
  embed; the one `.mdx` entry lights up all four views.
- **Test/checks (decided before generating):** the video test — fresh-viewer clarity,
  avatar believability, voice naturalness, operational cost — plus the selection rubric
  scoring HeyGen vs Synthesia. Authored up front in `test.md` (PROCESS §1).

## Log — the build beats

### Tool selection — a 15-second bake-off, not a coin flip
- Wrote ONE 15-second script, deliberately booby-trapped with what AI presenters fumble:
  the brand name said aloud ("Jigg.AI"), a spoken number ("thirty questions"), a clipped
  one-word beat ("No hype."), and a fast three-item list. Fed the **exact same text** into
  both HeyGen and Synthesia.
- HeyGen read the script as written. Synthesia (with **AI-assist mode on**) rewrote the
  15s of first-person copy into ~46s of third-person corporate narration ("Our AI
  solutions undergo rigorous testing…"), retitled it "Jigg.AI: Practical AI Tools and
  Solutions," and made a build-in-public project sound like a SaaS company.
- **Fairness re-run — this is part of the story, do NOT overstate Synthesia's weakness.**
  The rewrite wasn't Synthesia being broken; it was AI-assist mode, which is *designed* to
  expand a brief into a full presentation. Re-ran with strict/blank-scene script mode and
  it held the script at **20s**, right next to HeyGen. `[my setup]` — a generation-mode
  choice, not a tool limit. The honest finding: the two tools have different instincts
  (HeyGen → creator/startup register; Synthesia → presenter-led training), and HeyGen's
  fit the site's voice with less fighting. That evidence — not an argument — settled it.
- Synthesia's voice read a punctuation "comma" aloud → `[tool limit]` (punctuation
  handling).

### Building the video in HeyGen
- **Free tier can't ship.** Watermark on the whole frame + 60s cap. The explainer is
  longer and a watermarked video isn't publishable as the site's featured build → paid
  upgrade. Expected free-tier behaviour; tag `[tool limit]` but frame it neutrally — "free"
  means evaluate, not publish. (Real price + `pricing_as_of` = TO-CAPTURE from the receipt.)
- **Placeholder logo.** On import HeyGen defaulted to a "logoipsum" placeholder logo.
  Importing the real brand kit fixed it in one step. `[my setup]`, resolved.
- **A template tried to credit a fake person.** HeyGen's "Name Card" template ships with a
  dummy "Jeremy Blank / Lead Engineer" credit and could not be deleted — but it never
  fired, because the script gave it no intro beat to attach to. On a brand with no named
  individual, exactly the default to check for. `[my setup]`, dodged.
- **HeyGen re-paced the script.** Wrote ~87s; it rendered **70s**. Faster, nothing
  important cut — but the tool re-times you, so verify the key line survived. Checked: the
  honest-failure beat survived intact. `[tool limit]`-adjacent (expected re-pacing), noted
  so reproducers verify their own key line.

### Known v2 improvements — logged, NOT re-rendered this build
- **Pillarboxing.** Avatar-only shots put a portrait avatar in a black-barred vertical
  column inside the landscape frame — reads as repurposed-vertical. `[my setup]`
  (avatar-framing choice). The lead v2 fix: pick a frame-filling/landscape avatar (also
  kills this across the whole series).
- **Proof too small to read** on-screen. `[my setup]`, v2 improvement (deliberate
  proof-zooms).
- **Captions are burned into the pixels** (no soft track). v2: export an `.srt`.

## 2026-07-24 — price + YouTube captured; embed wired; page assembled (draft)
- **Price captured (human-provided receipt):** HeyGen **Creator** plan, **US$32.06 incl.
  tax**. Set `pricing_as_of: 2026-07-24` (dates the cost as captured today — NOT claimed as
  the exact receipt/purchase date; swap in the receipt date if a precise one is wanted).
  Subscription, so a clean $/finished-minute depends on monthly output — the concrete
  captured figure is the plan price. `test.md` operational table updated.
- **YouTube captured:** video live at `https://youtu.be/gIMQJcLP6L4` (embed ID
  `gIMQJcLP6L4`; the `?si=…` share-tracking token stripped — not part of a canonical ref).
  Stored as `video_id` in frontmatter/meta.yaml so a re-render's new ID is a one-place change.
- **Built a reusable `VideoEmbed.astro`** (`site/src/components/post/`) per the handoff spec:
  responsive 16:9 wrapper (`aspect-ratio` + absolute-positioned iframe), `youtube-nocookie`
  host, `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`, allow-list +
  `allowfullscreen`. The verbatim AI-disclosure is baked in as the default `<figcaption>` so
  no video build can ship without it (CONTEXT §4). Config-driven, not per-build markup —
  same principle as build #2's webchat embed.
- **Added `video_id` to the schema** (`content.config.ts`, optional) and mirrored it into
  `builds/_template/meta.yaml` (the two must not drift).
- **Assembled the site entry** `site/src/content/builds/explainer-video.mdx` from the drafted
  `post.md`, using the kit (ShortVersion, VideoEmbed, ProcessStep, StatTiles, ToolVerdict).
  `status: draft` → PROD build excludes it; renders in dev. `affiliate_url` **omitted** from
  frontmatter (still pending → schema `.url()` would reject `""`, and ToolVerdict then omits
  the CTA — the correct pending state; the CTA appears automatically when the link is added).
- **Removed `post.md`** — the `.mdx` is now the canonical post, matching build #1/#2, so
  there aren't two drifting copies of the same prose (the anti-pattern BACKLOG flags).
- **Verified in dev (localhost:4321):** page renders, **zero console errors**. Stamp shows
  HeyGen unlinked (no affiliate) + no CTA. Embed src = `…/embed/gIMQJcLP6L4`, title/lazy/
  referrerpolicy/allowfullscreen all correct; frame computed `16 / 9`, 616×347 desktop and
  335×188 at 375px mobile (ratio 1.778, no horizontal overflow). Disclosure caption renders
  verbatim beneath the embed.
- **Still open before publish:** affiliate link (applied, pending) + the human verify pass
  (PROCESS §5). The YouTube iframe only *plays* if the video stays public — the artifact
  preview depends on YouTube (accepted upkeep tier, CONTEXT §3).

## 2026-07-24 — PUBLISHED (PROCESS §5)
- **Human verify pass signed off** by the human. Per PROCESS §5, flags set on the human's
  say-so (not the agent's): `status: draft → verified`, `published`/`last_verified: 2026-07-24`
  in both meta.yaml and the `.mdx`.
- **Published WITHOUT the affiliate link, deliberately.** The human's call: HeyGen affiliate
  approval time is unknown, so it does not block publish. `affiliate_url` stays blank → the CTA
  is off; it's a standing BACKLOG follow-up that turns the CTA on when added. (Build #1 also
  shipped with no affiliate CTA, so the pattern's fine.)
- **Featured → home hero.** Set `featured: true` per the human's "this is the home/featured
  artifact." Build #1 auto-demoted by ordering (CONTEXT §6); no edit to #1 needed.
- **Verified the four-view invariant on the PROD build:** 10 pages now (was 9); the one `.mdx`
  lights up home (hero), `/builds` (under *july 2026*, a **Video** filter chip appeared),
  `/tools` (HeyGen), and `/builds/explainer-video`. The "undated" archive group the human
  spotted was this build's *draft* showing in dev with no publish date — resolved by publishing.
- **POST-DEPLOY (human, after push):** re-crawl the Botpress bot's KB so it knows the new build,
  and spot-check in a fresh conversation (PROCESS §5). Not done here — nothing is pushed yet.

## TO-CAPTURE (perishable / human-owned — do NOT guess)
- ~~Real paid HeyGen price~~ → **CAPTURED 2026-07-24**: Creator, US$32.06 incl. tax. Exact
  receipt/purchase *date* still optional (used capture date for `pricing_as_of`).
- Operational test figures: time to a usable render, number of takes, credits consumed
  (from the render session) → `test.md`. Still open — not logged during the session.
- HeyGen Rewardful affiliate link + real terms/cookie window (official dashboard) →
  `affiliate_url`. **Still open — applied to the program, awaiting approval.**
- ~~YouTube link~~ → **CAPTURED 2026-07-24**: `gIMQJcLP6L4`, embedded. Still to do when
  convenient: add the site link to the video's description/pinned comment/end-screen.
- The script-generation and revision **prompts**, and the **Claude↔ChatGPT exchange** —
  they live in the human's chats. Export into `repro/` (exchange-log.md); do NOT
  reconstruct (PROCESS §2). Recorded as awaiting-export there, not silently omitted.

## Artifacts
<!-- to be added by the human: the final render, the two 15s bake-off clips, both raw
     renders (HeyGen + strict-mode Synthesia), the brand kit, on-screen QA screenshots -->
- (pending — media files not in repo yet; see repro/README.md)

## Dead ends
- Synthesia AI-assist mode for a short first-person script — it expands the brief into a
  long third-person presentation. Not a dead end for its intended use (training/L&D
  presentations); a dead end for *this* use. The strict-mode re-run is the correct
  comparison and is what's reported.
