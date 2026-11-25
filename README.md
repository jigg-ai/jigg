# Jigg.AI

**Experienced engineering judgment. AI-accelerated execution.**

[Jigg.AI](https://jigg.ai/) is a software engineering studio with a [public build journal](https://jigg.ai/builds/). This repository contains the source for the Jigg.AI website and its supporting engineering records.

AI tools help implement, test and document the work. An experienced engineering lead sets direction, reviews results and takes responsibility for decisions and delivery. The public journal describes the studio's own projects; client work is private by default.

## What is in this repository?

| Path | What you can inspect |
| --- | --- |
| [`site/`](site/) | Astro website: page templates, components, content, and build configuration |
| [`builds/`](builds/) | Per-build briefs, notes, tests and supporting records; the scope and completeness vary by build |
| [`PROCESS.md`](PROCESS.md) | How projects are scoped, built, tested, documented and reviewed |
| [`CONTEXT.md`](CONTEXT.md) | Current studio positioning and the reasons behind the approach |
| [`STYLE.md`](STYLE.md) | Editorial rules for honest public build reports |

The website uses Astro and Markdown/MDX content. The [build index](site/src/pages/builds/index.astro) renders published entries from the site's build data rather than maintaining a separate hand-written page for each listing.

## See the work

- **[The Jigg.AI website](https://jigg.ai/)** — the running artifact; [website build notes](builds/website/build-notes.md) and [site brief](site/BRIEF.md) show its initial objectives and implementation record.
- **[MatSignal](https://matsignal.jigg.ai/)** — product development, infrastructure and iterative delivery: a live MVP for jiu-jitsu teams, taken from a real problem to a product in four working days. Its [build records](builds/matsignal-competition/) cover scope and testing; the application source is private. It has early use, and demand isn't proven yet.
- **[Signup hardening](https://jigg.ai/builds/buttondown-hardening/)** — security engineering for a public signup endpoint after bots found it: layered controls that fail closed when a check can't run. 12 of 13 planned acceptance checks passed, 1 was skipped on purpose, none failed. [Build records](builds/buttondown-hardening/).
- **[Open-weight models in the review process](https://jigg.ai/builds/fireworks-open-models/)** — multi-model review with enforced reviewer isolation, a per-run cost cap, and a human adjudicating every finding. It's an independent critique channel, not a second accountable engineer, and its first round reviewed a growth proposal, not production code. [Build records](builds/fireworks-open-models/).
- **[Public build journal](https://jigg.ai/builds/)** — every build, with test results where they exist, limitations and verification status.

Each build record separates what was planned, tried, tested and verified, including any check that wasn't run.

## Run the website locally

You need Node.js 22, the version Netlify builds with (`NODE_VERSION` in [`netlify.toml`](netlify.toml)), and npm. The website project is in `site/`, with its lockfile committed.

```bash
git clone https://github.com/jigg-ai/jigg.git
cd jigg/site
npm ci
npm run dev
```

`npm run dev` serves the site at `http://localhost:4321`. The contact form and the newsletter signup are Netlify serverless functions ([`site/netlify/functions/`](site/netlify/functions/)), so they run only on Netlify, in Deploy Previews and production. `npm run build` compiles the static site into `site/dist/`.

## Who is accountable?

Jigg.AI is led by [Sasha Matison](https://jigg.ai/about/sasha-matison/), Founder & Principal Engineer, who is responsible for engineering direction and delivery.

**[Engineering services](https://jigg.ai/services/) · [Discuss a project](https://jigg.ai/contact/) · [Build journal](https://jigg.ai/builds/)**

_The source is public to read, but it has no open-source license._
