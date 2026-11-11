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
- **[Public build journal](https://jigg.ai/builds/)** — the published record of projects, test results where available, limitations and verification status.
- **[MatSignal](https://matsignal.jigg.ai/)** — a separate product experiment. Its public [project records](builds/matsignal/) describe scope and testing; **its application source is not provided in this repository**. Do not interpret the presence of a demo or acceptance-test plan as evidence of customer adoption or completed validation.

Build records distinguish what was planned, attempted, tested and verified. Some checks may remain incomplete or not run; read the individual records rather than assuming every experiment has production-grade validation.

## Run the website locally

The website project is in `site/`. Its npm lockfile and scripts are committed here.

```bash
git clone https://github.com/jigg-ai/jigg.git
cd jigg/site
npm ci
npm run dev
```

To compile the site locally, run `npm run build` from `site/`. This describes the repository's documented development commands; it does not claim a successful build in your environment.

## Who is accountable?

Jigg.AI is led by [Sasha Matison, Founder & Principal Engineer](https://jigg.ai/about/sasha-matison/). His career history is documented there; studio-authored and AI-assisted implementation in this repository should not be misrepresented as individual commits on his personal GitHub account.

**[Engineering services](https://jigg.ai/services/) · [Discuss a project](https://jigg.ai/contact/) · [Build journal](https://jigg.ai/builds/)**

_Publicly readable source is not automatically open-source licensed; check individual files and applicable rights before reuse._
