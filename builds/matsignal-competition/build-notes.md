# MatSignal — build notes

## 2026-10-30 — Kickoff: founder-selected product direction

- **Working name:** MatSignal for PRD-003 BJJ athlete search + custom group tracking. Name clearance is unfinished (similar martial arts publication “The Mat Signal” exists). PRD-002 gym trial-funnel concept is a different project and remains held.
- **User problem:** Tracking multiple teammates across separate competition-registration/bracket systems is inconvenient, particularly during events. Founder experienced this personally; broader demand not yet proven.
- **Authorization:** Begin build-out. First reversible slice is a nonpublished, isolated interactive preview and synthetic fixtures; no collecting real athlete records, credential creation, domain spend, scraping, live sync, or site launch.
- **Demo acceptance checks:** search and disambiguate sample athletes; add/remove watchlist with keyboard; list upcoming events and chronological match-day sample; support empty states; hard-label all demo content; preserve watchlist locally; label unimplemented features. Check that Astro build succeeds before considering PR ready (NOT YET RUN).
- **Process note:** This scaffolding was committed via the Jigg.AI GitHub connector by the coordinator, not represented as an executed Claude Code session. Repo-local `npm run build` and a genuine browser preview are still pending.
- **Costs/time:** unmeasured; no cost claim.

## Next engineering work

1. Validate site build and actual Netlify deploy preview; correct any failures.
2. Founder review of UX, then explicit data-source and persistence implementation milestones.
3. Implement a verified, permitted source adapter with source links/freshness. Add real free account-backed group storage separately.
