# 09 — Playtest Log

Append-only. Never delete entries. One block per session.

## Template

```
### PT-XX — YYYY-MM-DD
- Version: rules vX.X, deck vX, modules: …
- Players: N (names optional), instrument: hotseat app / paper
- Result: winner, turns, length
- Metrics: (paste/export JSON to docs/balance/raw/PT-XX.json)
- Ratings: fun _ tension _ clarity _ agency _ humour _ replay _
- Funniest moment: …
- Observed problems: …
- Flow-up decisions: D-XXX …
```

---

### PT-00 — 2026-10-25 (solo smoke test, designer)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts (defaults)
- Players: 1 (Gábor, all seats), instrument: hotseat app
- Result: not completed — test aborted before meaningful play
- Metrics: none
- Ratings: clarity 1/5 — others untestable
- Funniest moment: n/a
- Observed problems: **critical onboarding gap.** The app drops a brand-new player into Setup/Game with zero context: no premise, no statement of who the players are or what the goal is, no explanation of the rupture/containment core loop, override windows, turn debt, or what any card does and why you'd play it. Direct quote: "I am completely lost, and cannot have a valuable test."
- Follow-up decisions: **D-013** (onboarding layer: Mission Briefing overlay + per-card blurbs + goal reminders in Setup/HUD/handoff gate)

### PT-00 — 2026-10-25, round 2 (solo smoke test, designer; after D-013 fix)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts
- Players: 1 (Gábor, all seats), instrument: hotseat app
- Result: in progress (ongoing testing); three UX requests filed and implemented same day:
  1. **Background music** ("I don't like quiet") → procedural Web-Audio space-ambient loop (drone pad + pentatonic plucks, no assets, nothing to license), auto-starts on first interaction, 🔊/🔇 toggle persisted. Setup + in-game HUD.
  2. **Draw reveal** — the drawing captain must see the drawn card (with its blurb) before the device passes on → new DrawReveal overlay; engine now logs `card` in the draw event (feed still hides it — only the reveal modal shows it).
  3. **Hover info on every card, not just the hand** ("I don't know them all by title") → tooltips added to scan results, requisition give-modal, salvage chooser, and the draw reveal, all from the canonical `CARD_INFO.blurb`.
- Follow-up decisions: none new (D-013 extended in spirit: "blurbs everywhere").
