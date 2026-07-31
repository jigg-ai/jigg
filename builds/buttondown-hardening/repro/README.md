# Repro pack — hardening the subscribe endpoint

**Status: partial.** This folder currently holds the *evidence for the spam-wave
figures* and nothing else. The rest of the pack (the control-order walkthrough, the
acceptance-check commands, the Turnstile setup) is not assembled yet — PROCESS step 5
assembles it in the same pass as the human verify pass. Listed here as absent rather
than promised, per the build-#1 lesson: a deferred pack becomes a permanent promise.

---

## `spam-wave-masked.csv`

Every figure this build states about the bot signups is derived from this file, and
can be recomputed from it. It is a masked derivative of a Buttondown subscriber
export — the raw export is **deliberately not in this repository** (see below).

### Provenance
- **Source:** Buttondown → Subscribers → Export, full account export.
- **Snapshot taken:** 2026-07-30, ~07:15 local (14:15 UTC). The account held 34
  subscriber records in total at that moment; all 34 are here.
- **Raw file:** `jiggAI-subscribers-export-Buttondown.csv`, 34 data rows. Held
  offline by the maintainer, outside version control.
- **One post-snapshot change is folded in:** `a23` transitioned to `regular` at
  2026-07-30T15:22:34Z, after the export was taken. Recorded in `later_type` /
  `later_type_at_utc` so the snapshot stays internally consistent and the change is
  still visible. Taken from the Buttondown API record for that subscriber.

### Why the raw export is not in the repo
These addresses belong to people who were **scraped and signed up without their
consent** — victims, not attackers. Publishing them would inflict exactly the harm
this build exists to stop, and would do it permanently, in a public git history.

A private repo was considered and rejected: the raw file's only job is to let someone
re-derive these numbers, and nobody re-derives from a repo they cannot clone. The
masked derivative substantiates every published claim while being safe to publish,
which is the whole point. The raw file stays offline.

### Columns and the masking rule

| Column | Contents | Masking |
|---|---|---|
| `occurred_at_utc` | signup time, UTC, second precision | unmasked — carries no PII, and the arrival cadence is a finding |
| `source` | `bot_wave` or `ours` | `ours` = an address we created while testing |
| `addr_id` | `a01`…`a33`, `own01` | sequential, assigned in time order. **Not reversible** — no hash of the address, so nothing can be brute-forced back |
| `domain_class` | `freemail:<domain>` or `corporate:.<tld>` | large consumer providers (gmail, aol, yahoo, hotmail, verizon) are named — they identify nobody. **Every other domain is reduced to its TLD**, because a corporate domain names a real organisation as a scraping victim |
| `role_prefix` | e.g. `support`, `accountspayable` | present only for shared/role mailboxes, which are by definition not personal. Blank for everything else |
| `type_at_export` | `blocked` / `unactivated` / `undeliverable` | Buttondown's own status at snapshot time |
| `later_type`, `later_type_at_utc` | post-snapshot transition | see above |
| `ip_id` | `ip01`…`ip16`, `own` | stable per distinct IP, so "16 distinct IPs" is checkable without publishing any of them |
| `ip_net` | the /24 only | the bot infrastructure's subnets, kept because the clustering is a finding. **Our own row's network is `redacted`** — that one is the maintainer's home IP |

### The screenshots

`spam-wave-masked-full.png` is the same 34 rows rendered as a list, masked to the rule
above — kept here because a picture of the wave arriving is evidence the CSV can't be,
and because it is what a reader recognises from their own provider's dashboard.

The version shown on the build page
(`site/public/img/buttondown-hardening/spam-wave-masked.png`) is derived from that same
file — never a reshoot, so the two cannot disagree about any value. Two purely visual
edits, both stated here because an evidence image should say what was done to it:

1. **Cropped** to the header plus the first 12 rows (`own01`, `a33`–`a23`), and the
   checkbox and row-menu columns dropped.
2. **Dead horizontal space between the columns compressed** — the source has 435px of
   empty background between the address and status columns alone. Slices were rejoined
   using the image's own background pixels, so the row striping stays continuous.

**No value was altered, reordered, hidden or recoloured**; only empty space was removed.
The point of the edit is legibility: the build page's text column is 616px, and the
uncropped image scales to 47% there, which is unreadable. This lands at 84%.

**Dates in both images are rendered in local time, while every figure in this folder and
on the page is UTC** — that shifts four rows across a day boundary (`a07`, `a08`, `a20`,
`a33`). The CSV's `occurred_at_utc` is canonical; the images are illustrative.

Dropped entirely: `id`, `secondary_id`, `email`, `ip_address` (final octet), and every
column Buttondown exported empty (`notes`, `referrer_url`, `utm_*`, `tags`, `metadata`,
and the four lifecycle dates).

### What it substantiates
- 33 bot signups between 2026-07-27T12:15:56Z and 2026-07-30T05:07:38Z — **64.9 hours**.
- Per UTC day: 6 / 13 / 13 / 1.
- 26 `blocked` (79%), 4 `unactivated`, 3 `undeliverable`.
- 3 hard bounces out of the **7 that were actually emailed** — the other 26 were
  firewall-blocked and never received anything, so they could not bounce.
- 16 distinct IPs across **7 distinct /24s**; the three busiest carried 11, 8 and 6.
- Median gap between signups: **65 minutes**.
- 15 freemail vs 18 organisational domains.
- 3 of the 4 role-shaped local parts match the shipped `ROLE_PREFIXES` list.

### What it does NOT substantiate
- **The earlier wave.** `build-notes.md` originally described a first wave of roughly a
  dozen signups over four days, preceding this one. **No trace of it is in this export**
  — the oldest record is 2026-07-27. Whether those records were deleted, or the two
  waves are the same event remembered twice, cannot be determined from what exists.
  The claim is retracted rather than restated.
- **`immenseignite.info`.** It is in the function's `BLOCKED_DOMAINS` and in
  Buttondown's own blocked-domains setting, but **it does not appear anywhere in this
  export**. Whatever prompted that entry is not evidenced here.
- **Whether `a23` is a real person.** See `build-notes.md`. One address from the wave
  confirmed the double opt-in. The data cannot distinguish a genuine subscriber from a
  scraping victim who clicked, or from an automated link-scanner.
