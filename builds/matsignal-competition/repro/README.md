# MatSignal: what's public, and what isn't

MatSignal's code is in its own private repository, so this build can't be reproduced by cloning
it. What this folder and the build log substantiate is the approach: the structure, the rules and
how it was tested.

## Public, in this repository

- [`../build-notes.md`](../build-notes.md): the build in order, failures tagged `[my setup]` or
  `[tool limit]`, and how the agent time was measured.
- [`../test.md`](../test.md): every check, its result, when it last ran, and what hasn't been
  tested.
- [`../meta.yaml`](../meta.yaml): the build's facts (versions, time, paid plans).

## Not public, on purpose

- **The code, tests and runbook.** MatSignal handles real people's names, and its defences against
  bulk harvesting work better unread.
- **The search guard's thresholds and the sweep test's per-path numbers**, for the same reason.
- **Any real entry.** No real athlete appears in this build log, its images or this folder.

## The images on the build page

`site/public/img/matsignal/competition-day-light.jpg` and `competition-day-dark.jpg` show
MatSignal on a phone (390 px wide) as it was on November 23, in its light and dark themes. It ran
locally, on a database holding only **made-up competitions** ("Demo Winter Open", "Demo Fall Cup")
and **made-up athletes** (Demo Academy), from MatSignal's own demo script for screenshots. What
was done to them:

- each screen captured in headless Chrome at twice the pixel density, once per theme, and cropped
  to the same height;
- the two screens set side by side, each with MatSignal's own page margins, and scaled to 1,200 px
  wide;
- nothing else changed: no retouching, no edited text.

The November 6 image, a shared link and the owner's squad in the dark-only design MatSignal had
then, was replaced on November 23. It's in this repository's history.
