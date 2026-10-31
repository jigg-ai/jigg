# MatSignal — preview acceptance test

**Status:** Test plan registered before any claim of completed preview. No checks have been run yet.

| ID | Check | Expected |
|---|---|---|
| MS-T01 | Search known fictional athlete | Matching record with source-identity clue and demo indicator |
| MS-T02 | Search unknown name | No-results explanation; no false real-data search claim |
| MS-T03 | Track/untrack athlete | Watchlist and match queue update; no duplicate group members |
| MS-T04 | Refresh demo page | Browser-local selections persist when storage is available |
| MS-T05 | Clear all selections | Empty watchlist and queue state |
| MS-T06 | Mat order + unknown ETA | Known times sorted; unspecified time explicitly unknown |
| MS-T07 | Keyboard & screen readers | Focus, input labels, button labels and status announcements sensible |
| MS-T08 | Narrow mobile screen | No horizontal overflow, controls usable |
| MS-T09 | Astro build | `npm --prefix site run build` exits successfully |
| MS-T10 | Preview safety | noindex, no real athlete fields, no payment, no crawler, no production URL/merge |

**Results:** NOT RUN. No verification or product availability claim.
