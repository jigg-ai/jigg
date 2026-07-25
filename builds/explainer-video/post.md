---
# kept in sync with meta.yaml
title: What I learned making my first AI explainer video with HeyGen
category: video
tool: HeyGen
status: draft
---

<!-- DRAFT — house style: STYLE.md. Human edit pass required before publish (PROCESS §5).
     This post.md is the drafted source. At publish it is assembled into
     site/src/content/builds/explainer-video.mdx using the kit in
     site/src/components/post/ (ShortVersion, ProcessStep, StatTiles, ReproPack,
     ToolVerdict), in the CONTEXT §3 order:
       summary → stamp → artifact embed (+ disclosure) → honest process → the test →
       show-don't-tell (bake-off + AI-interchange) → reproduce → tool verdict + CTA.
     PUBLISH GATES still open — do NOT ship these until they clear (Part A §5):
       · the YouTube embed (channel verification pending)
       · the real paid price + pricing_as_of (from the receipt)
       · the HeyGen Rewardful affiliate link + real terms (official dashboard)
       · confirm the disclosure line renders beside the embed -->

## The short version

I made a 70-second video explaining what Jigg.AI is — and I did it with an AI presenter I
never filmed, using HeyGen. No camera, no face, no voice of my own. If you want a short
marketing or explainer video and you're starting from nothing, HeyGen is an AI tool worth
your time: it kept my script word-for-word, looked credible on the first paid render, and
took an afternoon. The one honest caveat: the free tier watermarks everything and caps you
at 60 seconds, so a publishable video means paying — and the avatar I picked left black
bars on the plain talking-head shots, which I'd fix next time. If you're making structured
training videos instead of short explainers, the tool I *didn't* pick (Synthesia) is the
better fit — more on that below.

## The artifact

<!-- PUBLISH: embed the YouTube video here (or self-host). The disclosure line below is
     REQUIRED beside the embed by the concept (CONTEXT §4) — not optional. -->

> **Presenter and voice are AI-generated; scripted and directed by Jigg.AI.**

Being AI-made isn't a disclaimer here — it's the whole point.

## How I picked the tool (and why I didn't just guess)

Two tools own this space: HeyGen and Synthesia. Instead of arguing about which was better,
I ran a test. I wrote one 15-second script — deliberately booby-trapped with the things AI
presenters fumble: my brand name said aloud ("Jigg.AI"), a spoken number ("thirty
questions"), a clipped one-word beat ("No hype."), and a fast three-item list — and fed the
*exact same text* into both tools. Then I watched.

HeyGen read my script as written. Synthesia rewrote it — it turned my 15 seconds of
first-person copy into 46 seconds of third-person corporate narration ("Our AI solutions
undergo rigorous testing…"), retitled the whole thing "Jigg.AI: Practical AI Tools and
Solutions," and made a build-in-public project sound like a SaaS company that doesn't exist.

Here's the part I want to be fair about, because it's easy to get wrong: **that wasn't
Synthesia being broken.** It was me leaving its AI-assist mode on, which is *designed* to
expand a brief into a full presentation. I re-ran it with strict-script mode on, and it held
my words at 20 seconds — right next to HeyGen's. So the honest finding isn't "Synthesia
can't follow a script." It's that the two tools have different instincts: HeyGen reaches for
a creator/startup register, Synthesia for a presenter-led, training-video one. For a
build-in-public site, HeyGen's instinct fit my voice with less fighting. That's the real
reason I picked it — not a fake knockout.

<!-- SHOW, DON'T TELL: render the two 15-second bake-off clips side by side here. -->

## The honest process — what broke

- **The free tier can't ship.** HeyGen's free plan watermarks the whole frame and caps you
  at 60 seconds. My explainer was longer, and a watermarked video isn't publishable as the
  site's featured build. So I paid. `[tool limit]` — expected, but worth knowing before you
  start: "free" means "evaluate," not "publish."
- **The tool invented my brand's design once.** On import it defaulted to a placeholder logo
  ("logoipsum"). Pulling my real brand kit fixed it in one step. `[my setup]`
- **A template tried to credit a fake person.** HeyGen's "Name Card" template ships with a
  dummy "Lead Engineer" credit, and I couldn't delete it. It never appeared — my script gave
  it no intro to hook onto — but on a brand with no named individual, that's the kind of
  default you check for. `[my setup]`, dodged.
- **It re-paced my script.** I wrote ~87 seconds; it rendered 70. Faster, and nothing
  important got cut — but the tool re-times you, so verify your key line survived. (Mine did.)
- **The avatar I picked left black bars.** On the plain talking-head shots, a portrait avatar
  sits in a vertical column inside the landscape frame. It reads as repurposed-vertical, and
  it's the thing I'd fix first next time — by choosing a frame-filling avatar. `[my setup]`

## The test — how I'll grade every video build

The 30-question format I use for bots doesn't fit video. So here's the video test, decided
before I generated (not graded on a curve after):

- **Fresh-viewer clarity** — I showed it to people who'd never seen the site and asked what
  it's about. All of them got the premise. This is the metric I can't self-judge, so it's the
  one that counts most.
- **Avatar believability** — credible, no uncanny flags on the paid render.
- **Voice naturalness** — the "No hype." beat and the list pacing landed; "Jigg.AI" was
  pronounced cleanly.
- **Operational (the honest cost of it):** time to a usable render, number of takes, credits
  consumed, and — because it's a review — the real dollar cost per finished minute.
  <!-- PUBLISH: fill the real operational figures from test.md once captured. -->

## Two AIs, arguing — how this build actually got made

This is the part I'd normally hide, so I'm showing it. This build wasn't made by one AI. It
was made by me pointing two of them at each other.

**Claude** did the planning and wrote the script. **ChatGPT** I used as the opposition — I
had it argue the *other* side and tear up my drafts. They genuinely disagreed, and the
disagreement made the build better:

- **On the tool.** ChatGPT argued for Synthesia — better for a documented, reproducible,
  expandable video *system*, closer to the "real business tool" thesis. Claude pushed back
  that Synthesia's "business" is enterprise training, not my reader, and that the prompt I'd
  publish lives upstream anyway. Neither won by argument. The **15-second bake-off** settled
  it with evidence.
- **On the output.** Once I had a render, ChatGPT critiqued it hard — flagged that the proof
  on screen was too small to read, that the avatar was boxed in black bars, and that one line
  ("an AI answer engine can't fake") overclaimed, since an engine *can* fake a claim; what it
  can't fake is the visible evidence. Claude triaged those into must-fix vs nice-to-have and
  caught the one thing ChatGPT got wrong — its fix for the AI-presenter disclosure would have
  broken the brand's first-person voice; the right fix was to *disclose* and keep the voice.

The takeaway, and the reason this section exists: the useful move wasn't trusting either AI.
It was making them disagree in front of me and keeping the judgment for myself. That's the
whole method of this site, applied to its own making.

<!-- PUBLISH: the condensed two-AI interchange log goes in the downloadable pack. It must be
     EXPORTED by the human from the real Claude/ChatGPT chats and redacted — it is NOT
     reconstructed (PROCESS §2). See repro/exchange-log.md; currently awaiting export. -->

## Reproduce this

On this page: the full script, the two 15-second bake-off clips, the selection rubric and the
video test rubric, and a sample script-generation prompt.

In the downloadable pack: every prompt behind this build — research, script, scene-plan, and
revision prompts — plus both raw renders, the brand kit, the full test notes, and the
condensed log of the two AIs disagreeing. One honest note on the prompts: HeyGen has no native
way to export prompt history, so this provenance is assembled by hand from the chats. That's a
limitation worth knowing if prompt-provenance matters to you.

<!-- PUBLISH: several pack items (the clips, both raw renders, the brand kit, the exported
     prompts + exchange log) are human-owned media/chat exports and are NOT in the repo yet.
     Do not describe the pack as complete until they're assembled. See repro/README.md. -->

## The tool

**HeyGen — an AI tool worth your time, if you're making short explainer or marketing video.**
It kept my script exact, looked credible on the first paid render, and turned a written script
into a finished video in an afternoon with no camera and no face. Where it's *not* the pick:
structured training and L&D content, where Synthesia's presenter-led, scene-based approach
fits better. And go in knowing the free tier is for evaluating, not publishing — you'll pay to
ship anything real.

<!-- PUBLISH — affiliate CTA, AFTER the proof, disclosed, ONLY once the real Rewardful link
     exists (Part A §5 TODO 1). Do not paste a guessed link or state commission numbers. -->

> Make a video like this with HeyGen → **[affiliate link — PENDING]**. Some links here are
> affiliate links; I only feature tools I actually built with, and it never changes the verdict.
