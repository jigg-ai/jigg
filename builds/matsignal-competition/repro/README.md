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

## The image on the build page

`site/public/img/matsignal/shared-and-owner-phone.jpg` shows MatSignal on a phone (390 px wide),
running locally with a **made-up competition** ("Example Grappling Open") and **made-up athletes**
(Sample Academy), created for the screenshots and deleted afterwards. That is why the shared link in
it points at the local server. What was done to it:

- each screen cropped from the browser's screenshot, and the scrollbar strip on the right edge
  trimmed (12 px);
- the two screens set side by side, 24 px apart, on MatSignal's own background colour;
- nothing else changed: no retouching, no edited text.
