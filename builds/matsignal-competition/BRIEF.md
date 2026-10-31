# MatSignal — BJJ athlete search and competition tracking (PRD-003)

**Status:** private-preview prototype in progress. **Public working name:** MatSignal, founder preferred and now assigned provisionally to PRD-003; distinguish from the **historical, separate** gym trial-conversion experiment at `builds/matsignal/`. **Trademark clearance:** incomplete. An existing martial arts blog calls itself “The Mat Signal”; do not represent the name as exclusive or cleared. **Production release:** not approved.

## The job

A coach, athlete or spectator wants a simple way to find BJJ competitors and follow the **specific people they care about** across competitions hosted on different platforms. The team may share a large affiliation name, so MatSignal's saved groups are **user-curated**, never asserted official gym rosters.

## The user flow — free from end to end

1. Search an athlete by name, optional affiliation/event. **No account, no paywall.**
2. Pick correct athlete records from explicit candidates, not fuzzy auto-merge.
3. Track selected competitors as a group. **Free account required only to persist the group in production**; the first UI prototype instead explicitly stores only **fictional demo selections locally**, with no server and no fake login.
4. See known upcoming event registrations and a chronological queue by mat/order and **source-qualified** approximate match time; view source links for official details. Unknown times must remain unknown.
5. Read known post-event results when a source permits it.

## First implementation slice — founder-preview UI, NOT production data ingestion

- New **isolated** `/matsignal/` app preview route in the existing Astro site.
- Functional search, athlete selection, local-only prototype watchlist, and event-day queue **using fictional sample records prominently marked DEMO**.
- Accessible, mobile-first, keyboard-friendly states and honest empty results.
- No actual athlete information, automated retrieval, source integration, credentials, backend accounts, notification subscription or live ETA.
- Explicit noindex and no navigation link; branch + draft PR for founder review, **no main merge or DNS change**.
- After preview review: a separate source-by-source permission/availability assessment, one small permitted athlete/source adapter, then genuine free account/save service. Do not offer non-working account buttons or suggest the demo is live.

## Architecture direction — subject to validation

Athlete-first, demand-driven indexing: lightweight name/alias + platform-specific identity references; platform adapters that discover event information from appropriately accessible and usable public sources; a shared cache, source attribution and freshness; event-level refresh for matches and controlled operating costs. **An athlete ID is source-specific, not a universal personal ID.** Unknown, stale, ambiguous and unsupported records remain explicit. An absence of developer API alone isn't proof no public pages exist, but public visibility alone is not authorization to copy. Don't bypass access controls or ingest youth live-location information.

## Name / project separation

- **PRD-003:** MatSignal (working name) — free BJJ athlete search and tracking groups, this preview.
- **PRD-002:** Gym Trial Conversion Experiment (descriptive name only) — original separate landing-page hypothesis, builder issue #7 remains on hold. Its historical `builds/matsignal/` files are never migrated or reinterpreted as PRD-003; do not reuse its domain/function code or its builder handoff.

## Review gates

Founder must review actual functioning preview and confirm visual/product scope. Before activating any real-data integration, document source access terms, identity/minor policies, data freshness, failure modes and operational cost. No production merge, marketing release or crawling approved by this first UI slice.
