# Build-log authoring kit

These components are the **reusable pattern** for authoring a build log's body —
not one-off markup for a single post. Every build's `.mdx` under
`src/content/builds/` composes its body from this kit, so a new build is written,
not designed. Frontmatter stays flat (mirrors `builds/_template/meta.yaml`); this
kit absorbs the per-build variability that frontmatter can't.

Import what you need at the top of the `.mdx`, then write the body:

```mdx
---
title: "..."
# ...frontmatter mirroring meta.yaml...
---
import ShortVersion from '../../components/post/ShortVersion.astro';
import ProcessStep from '../../components/post/ProcessStep.astro';
import StatTiles from '../../components/post/StatTiles.astro';
import ReproPack from '../../components/post/ReproPack.astro';
import ToolVerdict from '../../components/post/ToolVerdict.astro';

<ShortVersion>
Self-contained citation hook: what it is, worth it or not, the one caveat.
</ShortVersion>

## The honest process

<ProcessStep result="fail" title="Attempt 1" tag="my-setup">
What I did, what broke.
</ProcessStep>
<ProcessStep result="pass" title="What worked">
The boring, honest fix.
</ProcessStep>

## The test

<StatTiles variant="metric" stats={[
  { value: "25", label: "answered correctly", tone: "ok" },
  { value: "0",  label: "invented pricing",  tone: "ok" },
]} />

<ReproPack items={["Task definition", "Flow diagram", "KB structure", "All prompts"]} />

<StatTiles variant="fact" stats={[
  { value: "~6 hrs", label: "Time to working" },
  { value: "$0",     label: "Monthly cost" },
]} />

<ToolVerdict tool="Botpress" toolSummary="Chatbot builder · free tier available"
  affiliateUrl={frontmatter.affiliate_url}>
Plain verdict, placed after the proof.
</ToolVerdict>
```

## Components

| Component | Purpose | Key props |
|---|---|---|
| `ShortVersion` | Citation-hook callout at the top | *(children)* |
| `ProcessStep` | One fault-tagged step of the honest process | `result` `pass\|fail`, `title`, `tag` `my-setup\|tool-limit`, *(children)* |
| `StatTiles` | Test-score breakdown or fact tiles | `variant` `metric\|fact`, `stats[]` `{value,label,tone?}` |
| `ReproPack` | "Reproduce this" + gated pack form | `items[]`, `title?`, `blurb?` |
| `ToolVerdict` | Verdict + disclosed affiliate CTA | `tool`, `toolSummary?`, `affiliateUrl?`, *(children)* |

## Conventions

- **Tag every failure** `my-setup` vs `tool-limit` — never conflate the two.
- **Affiliate CTA goes last**, always disclosed (`ToolVerdict` handles the
  `rel="sponsored nofollow"` and the disclosure line).
- **Colour is brand + status only.** These components never introduce a new hue;
  `ReproPack` is deliberately brand-tinted, not the mockup's blue.
- The page shell (`/builds/[slug].astro`) renders the title, stamps, badges, and
  artifact preview from frontmatter — the body starts at `ShortVersion`.
