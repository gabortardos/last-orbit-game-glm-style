# 11 — Decision Log

Append-only. Statuses: PROPOSED · ADOPTED · APPROVED (Gábor) · REVERSED (with new entry).

| ID | Date | Decision | Status | Rationale / evidence |
|---|---|---|---|---|
| D-001 | 2026-10-25 | v0.2 deck includes a Component bluff layer (8 cards, 2 types; pair = steal random) | **APPROVED** | Gábor chose "core + small bluff layer" over lean core and full combo ladder |
| D-002 | 2026-10-25 | Emergency Requisition: **giver** chooses the card | ADOPTED | Less swingy than taker-chooses; kinder comedy; watch in PT-01 |
| D-003 | 2026-10-25 | **Sun Fury** is the lead signature mechanic; Reactor Charge deferred to faction-layer consideration | ADOPTED | Analysis in `05-signature-mechanic-analysis.md`; final gate PT-03 |
| D-004 | 2026-10-25 | **Derelict Interference** module (one Final Transmission per eliminated captain) | ADOPTED | Attacks the reference's worst flaw (downtime); gate PT-04 |
| D-005 | 2026-10-25 | Forced Flyby debt is **additive with interest** (2 + remaining), capped 6 — deliberate divergence from the reference's flat 2-turn pass | ADOPTED | One-sentence rule, escalating chains, engine tracks it; watch chain metrics |
| D-006 | 2026-10-25 | Containment Field is **mandatory** when held | ADOPTED | Removes a non-choice; E-5 |
| D-007 | 2026-10-25 | Salvage cannot retrieve Ruptures or Containments | ADOPTED | Protects survival-card economy |
| D-008 | 2026-10-25 | In 2-player, Course Reversal = Emergency Burn | ADOPTED | Direction is meaningless with 2 |
| D-009 | 2026-10-25 | Platform: fresh TS web monorepo; Explorer policy = **"new world, borrowed sparks"** (read-only evaluation in Phase 5 only) | **APPROVED** | Gábor session-1 mandate (app/website, multiplayer, cool graphics); separation charter |
| D-010 | 2026-10-25 | Repo name `last-orbit`; continuity system (PROJECT_CONTEXT/NOW/decision log; conventional commits) | **APPROVED** | Gábor: "any model must be able to continue development" |
| D-011 | 2026-10-25 | Three-of-a-kind and five-card combos excluded from v0.2 | ADOPTED | Complexity budget; revisit in P2 with factions |
| D-012 | 2026-10-25 | Session-1 scope = D ("docs + repo + hotseat prototype + Monte Carlo report") | **APPROVED** | Gábor chose maximum scope |
| D-013 | 2026-10-25 | Hotseat app ships an onboarding layer: auto-opening Mission Briefing (premise, goal, turn flow, rupture loop, override parity, modules, card reference), per-card effect tooltips via `CARD_INFO.blurb`, goal reminders on Setup + handoff gate + in-game ❓ Help | ADOPTED | PT-00 blocker: without context a new player "cannot have a valuable test" — first real playtest finding |
| D-014 | 2026-10-25 | Hotseat app gets **Solo vs AI mode**: one human seat, remaining seats played by greedy bots (`botCommandFor`, ~1 s pacing, private info stays private); pass-and-play mode unchanged | ADOPTED | PT-00 round 3: solo hotseat yields no real data when the designer controls all seats |
| D-015 | 2026-10-25 | v0.3 expansion direction: ☄️ Micrometeoroid Storm + 🌟 Solar Wind draw-step pair (equal weight), optional component density 3+3 — sketch in `docs/15-expansion-v0.3-sketch.md` | **PROPOSED** | Gábor: "other dangers and absolutely equal other opportunities… maintain integrity and gameplay flow and joy"; sim-gated before humans |

## Pending decisions (need Gábor)

- Final game title (working title provisional).
- PT-01 timing & tester recruitment (3 humans).
- D-015 pick: (a) Pair A only · (b) Pair A + components 3+3 · (c) veto/other.

## Resolved

- ~~GitHub repo URL~~ → `https://github.com/gabortardos/last-orbit-game-glm-style` (pushed 2026-10-25).
