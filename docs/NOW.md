# NOW — Current Status (update every work session; most recent on top)

## Session 1, night continuation — 2026-10-25 ✅

**Phase:** P1 Core validation. PT-00 round 4 (solo vs AI) feedback triaged and fixed in one pass (D-017).

**Built this session:** reaction-window clarity (live ✅/🚫 Override-parity state, attack target named, effect-labeled buttons) · theft visibility (who-robbed-whom public, loot identity private — new `steal_card` line) · solo mode de-gated (no more "pass the device" vs AI anywhere; DrawReveal + Requisition copy solo-aware) · audio v2 (bed 0.16→0.10, Am–F–C–G pad cycle, sub heartbeat, 11 log-driven stingers) · Fury explained (HUD button → briefing, richer Setup hint, log lines state the reinsertion limit) · doc 15 Candidate B corrected: deck already has 4+4 Components — the fix is a lone-Component floor use (**🔧 Scrap**: discard 1 Component to peek at the top deck card), not density.

**All green:** typecheck · 28/28 tests · build.

### Next actions (in order)

1. **Gábor:** refresh http://localhost:5173 → 🤖 Solo vs AI → check the six fixes feel right (especially the reaction window: does the live ✅/🚫 state + "flip" copy make override parity obvious?). Round 5 notes → `docs/09`.
2. **Gábor decision D-015/D-016** (`docs/15` menu, B now = Scrap): **(a)** Storm+Wind · **(b)** +Scrap · **(c)** +Ion Surge & Tractor Snag · **(d)** all · **(e)** veto.
3. Implement chosen cards → extend tests beyond 28 → sim gate vs v0.2 baseline → solo-vs-AI feel test → freeze rules v0.3 → schedule PT-01.

### PT-00 status

Rounds 1–4 closed (onboarding → fixed; music/reveal/tooltips → done; solo instrument limit → solo vs AI built; round 4 clarity/privacy/audio fixes → D-017). Round 5 = next solo pass, then v0.3 candidates.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games) · Derelict kingmaking · 2p viability (13 min, comeback needs 2p proxy) · human pass-turn behaviour (bots turtle 72%) · bot difficulty: greedy only — more policies are cheap if solo feels too easy/hard.

## Session 1, evening continuation — 2026-10-25 ✅

**Phase:** P1 Core validation (pre-PT-01). Solo vs AI is now the primary designer instrument.

**Built since last entry:** ambient soundtrack (procedural Web Audio) · draw reveal overlay (engine logs the drawn card; feed stays blind) · card blurbs on every surface · **Solo vs AI mode** (D-014: `botCommandFor` in game-core, greedy bots, paced ~1 s, privacy preserved — bot scans/reinserts/gives stay hidden) · lone-component "find its twin" hint · expansion sketch `docs/15-expansion-v0.3-sketch.md`.

### Next actions (in order)

1. **Gábor:** refresh http://localhost:5173 → Setup → **🤖 Solo vs AI** (3–5 captains recommended) → play full matches vs the bots. Note: anything that feels unfair, unclear, or boring — that's PT data now.
2. **Gábor decision D-015/D-016** (menu in `docs/15`): (a) Storm+Wind · (b) +Components 3+3 · (c) +Ion Surge & Tractor Snag · (d) all · (e) veto.
3. Implement chosen v0.3 cards → extend tests → sim gate vs baseline (`docs/10`).
4. Schedule **PT-01** (3 humans, in person, hotseat mode — it's ready today; remote friends = P4 online).

### PT-00 status

Rounds 1–3 closed (onboarding gap → fixed; music/draw reveal/tooltips → done; solo instrument limit → solo vs AI built). Round 4 = designer vs bots under v0.2, then v0.3 candidates.

### Open decisions for Gábor (docs/11)

Final title · PT-01 timing · D-015 expansion pick.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games — PT-03 fairness read) · Derelict kingmaking · 2p viability (13 min, comeback metric needs 2p proxy) · human pass-turn behaviour (bots turtle 72%; if humans do too, discuss incentives) · bot difficulty: greedy only — if solo feels too easy/hard, next policies are cheap.

## Session 1 — 2026-10-25 ✅

**Phase:** P0 Foundation → complete (all gates). **Next phase:** P1 Core validation (human playtests).

**Built today:** full design doc set (00–14) · git repo + continuity system (PROJECT_CONTEXT/CLAUDE/AGENTS + this file) · `packages/game-core` deterministic engine (rules v0.2, Sun Fury & Derelict modules, bots, metrics, 28 unit tests — all green) · `apps/hotseat` pass-and-play prototype with privacy gates and metrics export · `sim/` Monte Carlo (16,500 games, ~3 s) · baseline report + findings (`docs/balance/sim-report-v0.2.md`, `docs/10-balance-findings.md`).

**Baseline headline (sim):** matches 10–13 min at all player counts · seats balanced within ~1pp · comebacks 34–41% · Sun Fury shortens & heats endings without dragging · Derelicts cost nothing and get used · Salvage usage unmeasured (bots ignore it) — open for PT-01.

### Next actions (in order)

1. ✅ ~~GitHub remote~~ — pushed to `gabortardos/last-orbit-game-glm-style` (2026-10-25).
2. **Gábor:** refresh http://localhost:5173 (`npm run dev` if stopped) → the **Mission Briefing** now opens automatically; re-run the solo smoke test with the onboarding in place. PT-00 round 2.
3. Schedule **PT-01** (3 humans, vanilla core) per `docs/08-playtest-plan.md`; log in `09`, export metrics JSON to `docs/balance/raw/`.
4. Iterate rules from findings; keep decision log current.
5. Chore: GitHub Actions CI (`npm test` + `npm run typecheck`).

### PT-00 finding (2026-10-25, logged in `docs/09` + D-013)

Solo smoke test aborted: **critical onboarding gap** — new player gets no premise/goal/mechanics context. Fixed same day: Mission Briefing overlay (auto-opens once, reusable via "How to play" + in-game ❓ Help), per-card `blurb` tooltips in `CARD_INFO`, goal reminders on Setup + handoff gate. Re-test pending.

### Open decisions for Gábor (docs/11)

Final title · GitHub URL · PT-01 timing.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games — PT-03 fairness read) · Derelict kingmaking · 2p viability (13 min, comeback metric needs 2p proxy) · human pass-turn behaviour (bots turtle 72%; if humans do too, discuss incentives).

