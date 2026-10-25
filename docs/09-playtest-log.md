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
