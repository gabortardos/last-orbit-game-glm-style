# 12 — Known Issues & Technical Debt

## Design-level

1. **Hotseat reinsert privacy:** the reinsert position is chosen on a shared screen (honour system in pass-and-play). Online (P4) solves it. *Accepted for prototype.*
2. **No reaction timers in hotseat:** windows close when all eligible players pass (explicit). Online adds ~6s countdown.
3. **Salvage power level unverified** (catalogue Q1) — sim + PT-01.
4. **Sun Fury depth-5 fairness** unverified — PT-03.
5. **Derelict kingmaking potential** — PT-04.
6. **Component texture at 4–5p** (only 2 types) — PT-02.

## Technical

7. `game-core` reinsertion position hidden from log for other players but present (god-mode) in the event log — sim uses it; UI must filter. Documented in engine.
8. Bots' knowledge model is same-turn only (greedy plays Scan then decides; no cross-turn memory) — adequate for v0.2 sim; improve in P2 if needed.
9. Citation gap: official EK rules page was rate-limited (HTTP 429) during session 1; re-verify at next doc pass (see `reference/exploding-kittens-notes.md`).
10. App metrics export is a manual JSON download; no persistence yet.
11. ~~No CI yet~~ **Resolved 2026-10-25 (D-025):** GitHub Actions runs `typecheck` + `test` + `build` on every push to main and on PRs (Node 22). Sim stays local/run-on-demand.
