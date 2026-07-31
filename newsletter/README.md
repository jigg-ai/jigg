# Newsletter issues

One file per issue actually sent, named `YYYY-MM-DD-<slug>.md`, holding the body
**as sent** plus a short header of the facts that don't live in the body.

## Why these are in the repo

The repo is the durable source of truth (CLAUDE.md). Buttondown holds the sent copy,
but it's a copy we don't control and can't diff — and an issue is a published claim
like any build page. If a build page is later corrected, we need to know what the
newsletter told people first.

## Conventions

- **Write in Markdown mode in Buttondown, not fancy mode.** Fancy is the WYSIWYG
  default; the mode conversion becomes permanent once you edit in the new mode, so
  drafting in fancy loses the markdown source these files exist to preserve. Markdown
  mode also keeps markup minimal, which is the main deliverability lever available on a
  domain with almost no sending history. All HTML is valid Markdown in Buttondown, so
  nothing is foreclosed if an issue later needs it.
- **Dates are local**, matching the `published` convention on builds.
- **Record the body verbatim.** If it was edited in the composer before sending, the
  file must match what went out, not what was drafted. A record that quietly differs
  from the send is worse than no record.
- **Don't record subscriber counts you haven't verified** at send time. Buttondown is
  the only source for that, and a stale number in a file reads as a measurement.

## Email formatting that survives real clients

Single column, left-aligned. One descriptive link rather than a button — buttons get
stripped or render badly. No images on a low-reputation domain unless the issue needs
one. Avoid tables; Outlook renders them inconsistently even though Buttondown supports
them. Bold two or three facts, not ten. Note that Buttondown auto-embeds a bare URL
alone on its own line for YouTube/Twitter/Spotify and similar — harmless for a
`jigg.ai` link, but worth knowing before pasting someone else's URL.
