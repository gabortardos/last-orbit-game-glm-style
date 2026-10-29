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
| D-015 | 2026-10-25 | v0.3 expansion direction: ☄️ Micrometeoroid Storm + 🌟 Solar Wind draw-step pair (equal weight), optional lone-Component floor use — sketch in `docs/15-expansion-v0.3-sketch.md` *(revised round 4: "density 3+3" was a miscount — the deck already has 4+4; Candidate B is now "Scrap")* | **ADOPTED** (pick g) | Gábor: "other dangers and absolutely equal other opportunities… maintain integrity and gameplay flow and joy"; sim-gated before humans |
| D-016 | 2026-10-25 | v0.3 mischief axis: ⚡ Ion Surge (target discards 1 random card) + 🧲 Tractor Snag (target discards down to 3, their choice) — nasty-but-never-fatal, Overrideable | **ADOPTED** (pick g) | Gábor's design note: "players love being tricky and — in a positive way — nasty with each other"; fills the destruction/harassment gap (v0.2 attacks are all theft) |
| D-017 | 2026-10-25 | Clarity pass on interaction surfaces: reaction window shows live Override parity + the attack target, buttons state their effect; theft events public (card identity private); handoff gate = pass-and-play only; audio v2 (lower bed, Am–F–C–G cycle, sub pulse, log-driven stingers); Fury HUD opens the briefing | ADOPTED | PT-00 round 4: override parity, attack targets and Fury were undecipherable in solo vs AI; "why pass the device vs AI?" |
| D-018 | 2026-10-25 | v0.3 escalation axis (Candidate D): ↪️ Deflector reaction cards — the target may redirect an attack to any other captain and +1 payload (Uno-style stacking; once per captain per chain, payload cap +3, one Override cancels the whole chain) | **ADOPTED** (pick g) | Gábor's round-4 addendum: "player triggers an attack, next player can counteract by doubling down and passing the problem forward"; **requires Candidate C** (only destruction scales, never theft) |
| D-019 | 2026-10-25 | v0.3 sim-gate trim: −1 🔭 Deep-Space Scan (4→3) and −1 🌀 Gravity Slingshot (3→2) — 46 action cards total (55 at 4 captains) | **ADOPTED** | Full menu pushed 2p to 15.3 min / 3p to 14.7 (doc 15 warning rule: >~15 min → substitute, don't add); post-trim: 14.7 / 14.0 / 13.0 / 11.7 min at 2/3/4/5p — all inside the band |

## Pending decisions (need Gábor)

- Final game title (working title provisional).
- PT-01 timing & tester recruitment (3 humans).
- ~~v0.3 menu~~ — **resolved 2026-10-25: Gábor picked (g) A+B+C+D — all candidates**; implemented + sim-gated (D-019 trim), awaiting solo-vs-AI round 5 + PT-01.

## Resolved

- ~~GitHub repo URL~~ → `https://github.com/gabortardos/last-orbit-game-glm-style` (pushed 2026-10-25).
