# 13 — Development Roadmap (2026-10-25)

Gated: each phase ends with explicit criteria before the next opens. Status legend: ✅ done · 🔄 current · ⬜ not started.

## P0 — Foundation ✅ (session 1, 2026-10-25)

Design docs (brief, ledger, proposal, rules v0.2, catalogue, signature analysis, visual brief, architecture) · repo + continuity system · deterministic engine + tests · hotseat prototype · Monte Carlo simulator + baseline report.

## P1 — Core validation 🔄 (current)

- [x] Solo vs AI mode (2026-10-25, D-014) — designer instrument for pre-friend testing
- [ ] PT-01 (3p vanilla) → iterate — **re-gated on the online version (D-034, 2026-10-25): folds into the P4 friends-and-family beta; solo-vs-AI + bots + sim remain the app-level gates meanwhile**
- [ ] PT-02 (4–5p vanilla) → iterate — same re-gate as PT-01 (D-034)
- [ ] Fix rules bugs found; update docs same-commit
- [x] Chore: GitHub remote + CI (test/typecheck) (2026-10-25, D-025)
- ~~**Gate to P2:** PT-01/02 pass criteria met; v0.2 rules stable~~ → **amended by D-034:** the human gate moved online (P4); the dev gate for core rules is solo-vs-AI + sim stability (met through v0.3, 93 tests green)

## P2 — Modules & factions 🔄 (parallel dev lane per Gábor's directive, 2026-10-25)

- [ ] PT-03 Sun Fury · PT-04 Derelicts · PT-05 full package + 2p → freeze rules (v0.3+) — these are solo-vs-AI/sim-testable; human rounds fold into the online beta (D-034)
- [x] Faction layer design (8 civilizations, pilot first: Mercury) + Reactor Charge re-evaluation menu — framework + Mercury pilot **ADOPTED** (D-028, `docs/14`)
- [x] Faction layer v1 implemented (2026-10-25, D-029): per-seat opt-in ☿ Flare Skip in engine+app+bots; vanilla configs provably unchanged; solo-vs-AI pretest = **PT-F1** (`docs/08`) before faction PTs
- [x] Faction layer v2 implemented (2026-10-25, D-031): ♀ Court Favor, ♂ Salvage Run, ♃ Storm Shout join ☿ — all once-per-match, spent publicly, AI-flown; 4/8 civilizations playable; Codex carries deep sheets for all four (75 tests green, sim clean)
- [x] Civilization bible v1 (2026-10-25, D-032) — **all eight civilizations deep-designed**; the in-app Codex carries a full sheet for every one; 4 powers playable (☿♀♂♃) + 4 designed awaiting Gábor's sign-off (🌍♄♅♆) → engine next
- [x] Faction layer v3 implemented (2026-10-25, D-033): 🌍 Kit Bash · ♄ Ringwall · ♅ Axial Tilt · ♆ Deep Sight — **all eight civilizations playable**; 93 tests green, sim clean
- [ ] Passive specialities brainstorm (D-035, proposed — `docs/14` §Passives): pick a family + per-civ passives → faction-seated sim pass → Gábor sign-off → only then engine work
- **Gate to P3:** frozen rules + at least 1 tested faction; visual brief confirmed.

## P3 — Visual vertical slice ⬜

- [ ] Style frames (6 key moments) · Sun Fury state chart · Mercury design sheet · motion prototype
- [ ] Three.js scene shell; card UI 2D-glass-over-3D; reduced-motion variants
- **Gate to P4:** slice playable hotseat with full visuals; state readability sign-off.

## P4 — Online multiplayer ⬜ (promoted as the human-testing vehicle, D-034)

- [ ] Authoritative server (Colyseus/PartyKit spike → choice, logged as decision)
- [ ] Rooms, reconnection, reaction countdowns, Derelict spectator UX, turn timers
- [ ] Small friends-and-family beta — **now carries PT-01 (3p) + PT-02 (4–5p) human playtests (D-034): Gábor tests with real humans here**
- **Gate to P5:** stable online matches; retention signal.

## P5 — Explorer evaluation, polish, beyond ⬜

- [ ] Read-only Explorer technique evaluation (logged decision)
- [ ] Audio production, accessibility audit, PWA
- [ ] Monetization decision (postponed by charter until here)

## Standing rule

Scope never jumps a gate. Changes to this roadmap are decision-log entries.
