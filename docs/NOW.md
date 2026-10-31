# NOW — Current Status (update every work session; most recent on top)

## Session 1, late night — faction layer v3: 🌍♄♅♆ ship — all eight civs playable — 2026-10-25 ✅

**Phase:** Gábor signed off all four outer powers ("yes to all powers for now — I'll test them, once they are in the game") and pointed development at the product. Logged: PT-01/02 move to the online version (D-034 — "I'm mostly alone"), title deferred indefinitely, passive specialities brainstorm opened (D-035 — no code until it fits).

**Shipped (D-033):**
1. **Engine — the four outer powers, all opt-in per-seat, once per match, spent publicly (Pillar 4):**
   - 🌍 **Kit Bash** (`KIT_BASH`): one ❄️/🛠️ played as a completed pair — opens a real `pair` reaction window (one 📡 cancels the steal, victim may ↪️); the Component is paid, the power burns at initiation (baitable, like ♂).
   - ♄ **Ringwall** (`RING_WALL`): a theft aimed at ♄ (🪝/🤝/pair) fizzles — resolved instantly mid-window (nothing left to 📡); attacker's card stays spent; ⚡/🧲 destruction passes (the counterplay). `canRingWall` keeps the window waiting even on an empty hand.
   - ♅ **Axial Tilt** (`AXIAL_TILT`): an attack aimed at ♅ is re-aimed at a captain of ♅'s choosing with **no payload growth** (≠ ☿'s +1); shares the once-per-captain-per-chain limit; 2-player: slides straight back at the attacker; growth already on the chain is preserved; a later ↪️ grows normally.
   - ♆ **Deep Sight** (`DEEP_SIGHT`): instant private top-3 peek during your own Command Phase — no window (nothing to 📡); the bot feeds it into the 🔭 knowledge slot and actually dodges a seen ☀️.
   - Three implementation rulings logged in `docs/14` §v3 (♅ picks the re-aim · ♄ instant mid-window · ♆ own Command Phase).
2. **Bots:** greedy + random policies for all four (🌍 bashes early at the biggest hand; ♄ never pays a thief; ♅ refuses to be hit; ♆ sights free then dodges). `ATTACK_REASONS`/`THEFT_REASONS` shared with the engine via `cards.ts`.
3. **App:** Setup fleet pickers for all eight civs + fleetnote lines · ready/spent chips ×4 · 🌍 part→victim chooser + ♆ Look button in the command phase · ♄/♅ buttons in the reaction overlay + ♅ tilt chooser · feed lines for the new events (essential for ♄ — its resolution is silence) · SFX stingers · ScanModal shared with ♆ · Codex flips 🌍♄♅♆ to playable.
4. **Tests:** `engine-faction-v3.test.ts` — 18 new (powers, guards, windows, 2p edge, bot policies); **93/93 green**. Typecheck ✓ · build ✓ · sim ✓ (16,500 games clean, vanilla untouched).
5. **Docs:** `11` D-032→ADOPTED + D-033/D-034/D-035 + pending list refreshed · `13` PT-01/02 re-gated on the online version (P4 promoted as the human-testing vehicle); P2 faction lane checked through v3 · `14` v0.7 (§v3 IMPLEMENTED + §Passives brainstorm) · this file.

**Next:**
1. **Gábor tests the four powers in-game** (solo vs AI, any fleet) — feedback → tuning or veto per power.
2. **D-035 passives brainstorm with Gábor:** pick a family (card resistances vs body modifiers, or mix), fill the open slots (♄ ♅ ♂), then faction-seated sim + sign-off before any engine work.
3. **PT-F1 pretests** (☿♀♂♃ + now 🌍♄♅♆) via solo-vs-AI per `docs/08`.
4. Rising priority per D-034: the **online version** (P4) as the human-testing vehicle — Colyseus/PartyKit spike when Gábor gives the word.

## Session 1, night — bible v0.6: all eight civs deep-designed + Setup tidy — 2026-10-25 ✅

**Phase:** Gábor's story push ("do all of them" — his four next-step options). Gábor feedback logged: race stories interesting but needing development (→ this session); start-screen graphics rough (accepted as placeholder — tidy only, real art is P3).

**Shipped (D-032):**
1. **All eight civilizations deep-designed** — the last four get full Codex sheets (captains: 🌍 Amara "Warranty Void" Okafor · ♄ Vesper Noctis "Floats" · ♅ Titania Umbra "True Level" · ♆ Lumen Trench "Told You"; flagships, ≥6 real-fact hooks each, comedy wells, palettes, rivalries). The four playable sheets deepened with expanded-lore paras (☿ double-birthday scheduling + Caloris far-side claims · ♀ morning/evening-star double-booking + Magellan radar portrait · ♂ blue sunsets + the 37-minute sol · ♃ Shoemaker-Levy 9 "you're welcome" + heard-before-seen 1955).
2. **Four new power designs (PROPOSED — awaiting Gábor's sign-off, the D-028→D-029 pattern):** 🌍 **Kit Bash** (play a single ❄️/🛠️ as a completed pair-siphon) · ♄ **Ringwall** (a theft of their cards fizzles once/match; ⚡/🧲 pass through) · ♅ **Axial Tilt** (when targeted, the attacker must re-aim elsewhere, no payload growth) · ♆ **Deep Sight** (free 🔭 top-3 peek, any time). Framework-compliant (one sentence · base-deck counterplay · once/match · v0.3 vocabulary · sim-expressible); power-axis spread verified non-overlapping; rivalry map added. Codex marks them "designed — not yet playable".
3. **Setup tidy (functional, explicitly not the P3 art pass):** section headers ("The table", "Optional modules"), the faction-power wall of text is now a readable stacked list, checkbox hints align properly, panel widened 480→560px, redundant seat-list ternary removed.
4. **Docs:** `11` D-032 (+ new pending-decision entry: sign-off unlocks engine+app+bots) · `13` bible v1 checked off · `14` v0.6 (§v3 power designs + rivalry map) · this file. (D-031 row was accidentally overwritten mid-session and restored — verified intact.)

**All green:** typecheck · **75/75 tests** · build · sim (16,500 games clean).

**Next:** Gábor: ① **sign off / veto the four power designs** (🌍 Kit Bash · ♄ Ringwall · ♅ Axial Tilt · ♆ Deep Sight) — a yes → engine+app+bots+tests next session ② PT-F1 pretest per faction (☿ ♀ ♂ ♃) ③ round-5 notes + PT-01 (title + PT-01 timing + Reactor Charge confirmation still open, `docs/11` pending list). Then: faction PTs after the vanilla PTs.

## Session 1, late evening — faction layer v2: ♀ ♂ ♃ join ☿ — 2026-10-25 ✅

**Phase:** Gábor's parallel faction lane continues (D-031, ADOPTED); vanilla gates (PT-01/02) untouched and still pending.

**Shipped (D-031):**
1. **Engine (opt-in, vanilla provably unchanged — all 64 pre-existing tests green, untouched):** `COURT_FAVOR` (♀ flips a 🤝 aimed at her: `target→initiator`, `giftTo→courtier`, window reopens — one 📡 voids the exchange, the Favor burns either way) · `RUST_RUN` (♂ takes any discard card for free during his Command Phase through a real reaction window — a 📡 cancels the grab but the run is spent at initiation; no ruptures/containments) · `STORM_SHOUT` (♃ roars a drawn ☄️ at another captain — only the drawer may shout via `drawnBy`, so no chain-shouting). New stats `courtFavors`/`rustRuns`/`stormShouts`; `canCourtFavor()` wired into window logic.
2. **Bots:** greedy + random policies for all three (♀ never pays tribute; ♂ prioritizes the pile via `RUST_WANTED` before anything else; ♃ roars at the biggest rival hand). Sim clean: 16,500 games.
3. **App:** Setup fleet pickers for **all seats incl. AI** (classic = default) · per-seat power chips for all four civs (ready/spent, gold) · ♀ "flip the tribute" button in the reaction overlay · ♂ discard picker in the command phase · ♃ target picker inside the storm modal · SFX stingers (`court_favor`/`rust_run`/`storm_shout`).
4. **Codex rewritten data-driven** (`Sheet[]`/`SheetPara[]`): deep sheets for all four playable civs (form, captain, flagship, power, counterplay, comedy wells, real facts, palette, identity/rivalries) — a new civilization is now one append. Fixed a stray-`]` syntax error from the rewrite.
5. **Docs:** `08` PT-F1 widened to all four powers (receiving-end watch items) · `11` D-031 · `13` P2 v2 line + bible status · `14` v0.5 (engine-truth section for the three powers) · this file.

**All green:** typecheck · **75/75 tests** (11 new in `engine-faction-v2.test.ts`) · sim.

**Next:** Gábor: ① **PT-F1 pretest, once per faction** (☿ ♀ ♂ ♃) — solo vs AI, mix AI factions into the other seats to feel the powers from the receiving end ② round-5 notes + PT-01 whenever ready. Then: deep-draft the next civ (🌍 ♄ ♅ ♆) or faction PTs after the vanilla PTs.

## Session 1, evening — faction pilot ships: ☿ Flare Skip in engine+app + in-game Codex — 2026-10-25 ✅

**Phase:** Gábor's directive — dev proceeds without waiting on his test ("don't lock anything… proceed with the next step"); PT-01/02 remain the validation gates, running in parallel instead of blocking.

**Shipped (D-028 → ADOPTED; D-029/D-030 logged):**
1. **Engine (opt-in, vanilla provably unchanged):** per-seat `config.factions` (absent/null = classic — all 55 pre-existing tests untouched & green) · `FLARE_SKIP` command mirrors ↪️ DEFLECT minus the card (once per match; shares the once-per-chain limit; growth on destruction only; spent state public) · `canFlareSkip()` wired into window logic (waits on flare-capable targets, D-022 bounce covered) · bots use it (greedy: free redirect before spending a ↪️; random 60%) · `flareSkips` stat + report field. **9 new tests → 64/64.**
2. **App:** Setup fleet picker (default classic) · public "☿ Flare Skip ready/spent" chips at every seat · reaction-window "free redirect +1" button with target chooser · **Civilization Codex** (`docs/14` on the game screen: 8 civ cards + Mercury deep sheet) reachable from Setup, HUD, and the always-on corner controls (D-023 pattern). Stale "rules v0.2" tagline fixed → v0.3.
3. **Docs:** `03` §7 faction bullet + E-18 + changelog · `08` PT-F1 pretest section · `11` D-028 ADOPTED + D-029/D-030 · `13` P2 = parallel lane · `14` rule-6 amendment + v0.4 changelog.

**All green:** typecheck · **64/64 tests** · build.

**Next:** Gábor: ① **PT-F1 pretest** — solo vs AI as ☿ Mercury (Setup → fleet), 2–3 matches; note whether the power fires, feels strong-but-baitable or dull (fallback "Slingshot Start" waits) ② round-5 notes + PT-01 whenever ready — the vanilla path is untouched and waiting. Then: next civ deep-draft in `docs/14`; faction PTs after the vanilla PTs.

## Session 1, afternoon — P2 design lane opened: faction framework + Mercury pilot — 2026-10-25 ✅

**Phase:** P1 gates still pending (round-5 notes → freeze v0.3 → PT-01/02); **P2 design lane now open in parallel (D-027, docs-only)** per Gábor's directive.

**Shipped (docs only — engine/app/kit untouched, gates intact):**
1. **Faction-power framework v1** (`docs/14`, D-028 PROPOSED): six ship rules — one-sentence template, base-deck counterplay, once-per-match default, v0.3 vocabulary only (D-026 discipline), sim-expressible in `bots.ts`, gated on PT-01/02. Spent powers are public.
2. **Reactor Charge re-evaluation menu** (`docs/14` §RC; final call stays post-PT-03 per D-003): A drop / B shared currency / C hybrid — lean **A** for the pilot.
3. **Mercury pilot deep design** (`docs/14` §Pilot): The Flareskips — cast-glass sprinters, Captain Cinder Vale "Twice-Dawn", flagship *The Sudden Dawn*, 5 comedy wells, 7 real-fact hooks (88-day year vs 176-day day; −173→+427 °C; the Sun's takeback sunrise; polar ice; shrinking planet; 85% iron core; BepiColombo's imminent arrival), palette/sound/motion, identity & counters. Power draft: **"Flare Skip"** (once/match free ↪️-redirect; fallback "Slingshot Start").
4. Cross-refs updated (`05` verdict, `13` roadmap + stale "freeze v0.2" fix, `15` §D hook).

**Next:** Gábor reviews D-028 (Mercury sheet + framework) alongside his round-5 solo notes; when PT-01/02 pass → solo-vs-AI faction pretest → faction PT.

## Session 1, morning — PT-01 zero-prep kit + D-026 instrument fix — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in; round-5 notes pending — every remaining P1 item is now a human gate).

**Shipped:**
1. **`docs/16-playtest-kit.md` — print & run PT-01/02:** facilitator run sheet (4-min teach-in script using the app's premise copy verbatim, during-match observation checklist, post-match question set + export/archive steps + pass/revise/reject), paper-mode rulings where paper differs (real-time 📡 shouts, ↪️ payload token, private peeks), and a **54-card cut sheet + 2 table aid cards** verified card-for-card against `BASE_DECK` v0.3 (46) + 6 🛡️ + N−1 ☀️.
2. **D-026:** PT-01/02 "vanilla" = v0.3 core deck with modules off (docs/08 said "v0.2" — that deck no longer exists in the app; paper/app/sim now provably measure the same game). docs/08 instrument + deck lines updated.
3. Housekeeping: stale v0.2-era deck-count comments fixed in `cards.ts`/`engine.ts` (46, comment-only); known-issue #9 re-tried (EK official page still 429 — stays open).

**All green:** typecheck · **55/55 tests** · build (comment-only code change).

**Next:** ① Gábor's round-5 solo notes (bounce-backs, anytime-❓, music v3) → **freeze v0.3** · ② run **PT-01** with the kit (`docs/16`) — app or paper, 3 humans, ~30 min total per session incl. questions · then PT-02 (4–5p) → P1 gate.

## Session 1, dawn — P1 chore: CI live + PT-01 export completeness — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in; round-5 notes pending).

**Plan progress (no design changes):**
1. **CI (D-025):** GitHub Actions — `npm ci` → typecheck → tests → build on every push to main and on PRs (Node 22). Closes the last non-human P1 chore; known-issue #11 resolved. Sim stays local per balance gate.
2. **PT-01 export completeness:** the game-over JSON now ships the full end-state inventory — `finalHands` (per captain), `deckRemaining`, `discard`, `exportedAt` — so docs/08's "dead cards" metric is computable offline from a single export (previously only played counts + the winner's hand size).

**All green:** typecheck · **55/55 tests** · build (CI mirrors exactly these).

**Next (both human gates):** ① Gábor's round-5 solo-vs-AI notes (bounce-backs, anytime-❓, music v3 — refresh http://localhost:5173) → **freeze v0.3** · ② schedule **PT-01** (3 humans hotseat; archive metric exports to `docs/balance/raw/`, created on first export per docs/08). Everything else on the P1 checklist is done.

## Session 1, small hours+ — round-5 refinements pass 2 (designer request) — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in, awaiting Gábor's round-5 solo feel test).

**Three designer asks, all shipped:**
1. **Help anywhere (D-023):** a 🔊+❓ cluster floats above every overlay, so the Mission Briefing (full card reference included) opens at any moment — mid-reaction included. The briefing sits above all other modals.
2. **Audio v3 (D-024):** "still a bit empty" → + per-chord bass swells, a slow chord-tone lead through the space echo, a high shimmer 5th, a solar-wind noise bed, pluck fifths. Master level unchanged.
3. **Deflector bounce-back (D-022):** a bounced attacker holding an unused ↪️ is now asked (deflect it on or take the hit) — engine (`canRespond`, new `respondentIds`/`openRespondents`), PASS/resolution, both bot policies, the reaction overlay and the solo driver all aligned; still never Override-your-own-action. This was the real cause of "why can't they deflect the deflection": bots bounce at the biggest hand (usually the human) and the old code silently skipped the attacker.

**All green:** typecheck · **55/55 tests** (52 → 55: bounce-war, initiator-skip, initiator-pass suites) · build · sim (16,500 games; 2p tallest escalation 1→2, everything else within noise — report updated, lengths/seats hold).

**Next:** unchanged — Gábor's round-5 solo-vs-AI notes → freeze v0.3 → **PT-01** (3 humans hotseat, metrics JSON export per docs/08 — the export button is already in the game-over modal). New round-5 watch questions: does the anytime-❓ actually get used? Is the bed fuller without turning busy? Do bounce-backs feel fun rather than gotcha?

## Session 1, small hours — round-5 UX refinements (designer request) — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in, awaiting Gábor's round-5 solo feel test).

**Designer asked for two refinements before round 5 — both shipped:**
1. **No forced "let it happen" clicks (D-020, engine-level):** reaction windows auto-skip captains with no possible response (no 📡 in hand, not the 🎯 target with an unused ↪️, no armed Final Transmission). Nobody able to respond → the action resolves instantly, no overlay. Skipped captains show as "💤 standing down". New `canRespond` export; auto-pass runs whenever a window opens or reopens (PLAY / OVERRIDE / DEFLECT).
2. **Flight log never covered (D-021, UI):** the log is a pinned side rail (z-above overlays, modals centre in the remaining space, reflows inline below 880px) — history stays visible during reaction/override/draw/help/game-over windows.

**All green:** typecheck · **52/52 tests** (47 → 52: new D-020 suite; 3 deflect tests updated for self-resolving windows) · build · sim (report byte-identical — auto-pass is outcome-neutral for bots).

**Next:** unchanged — Gábor's round-5 solo-vs-AI notes (localhost:5173, refresh), then freeze v0.3 → PT-01. New round-5 watch question: does the standing-down line + always-visible log make bot turns easy enough to follow?

## Session 1, late night — v0.3 expansion built — 2026-10-25 ✅

**Phase:** P1 Core validation. **Rules are now v0.3** (expansion pack in). Gábor answered the two open design questions and picked menu **(g) — all candidates** (D-015/016/018 ADOPTED).

**Built this session:**
- **Engine v0.3:** ☄️ Micrometeoroid Storm + 🌟 Solar Wind draw-step events (wind chains pause on storms/contained ruptures, E-13) · 🔧 Scrap (lone Component → private top-card peek, overrideable) · ⚡ Ion Surge (random jettison; scales with Deflectors) · 🧲 Tractor Snag (discard down to 3, victim chooses) · ↪️ **Deflector** — Gábor's Uno-style escalation: target redirects any attack +1 payload (destruction only), once per captain per chain, cap +3, one Override kills the whole chain. New commands `DEFLECT`/`STORM_DISCARD`/`SNAG_DISCARD`; `bonusDraws` draw-chain state; 5 new stats.
- **Bots:** greedy deflects when targeted (biggest rival hand), surges/snags fat hands, scraps lone Components; both policies resolve storm & snag choices.
- **UI:** Deflector button + redirect chooser in the reaction window (target-only, 🎯 markers, payload indicator), Storm & Snag discard modals, Scrap private peek, new-card briefing groups + copy, 5 new stingers (storm/wind/surge/snag/deflect), bot choice-decider fix (snag/storm victims now drive correctly).
- **Sim gate:** 16,500 games × 2 runs. Full menu tripped the doc-15 length warning (2p 15.3 min) → applied the prescribed trim (D-019: −1 🔭 Scan, −1 🌀 Slingshot → 46 action cards, 55 total at 4p). Post-trim: **14.7 / 14.0 / 13.0 / 11.7 min** at 2/3/4/5p — PASS. Deflections ~1/game, tallest chain 2, surges land ~1.2/game, scraps ~4/game, pass-turn 72→68%, comebacks up to 37–43%, seats uniform.

**All green:** typecheck · **47/47 tests** (28 → 47) · build · sim.

### Next actions (in order)

1. **Gábor: solo vs AI round 5** at http://localhost:5173 (refresh; `npm run dev` if stopped). Feel-test the new cards — especially: does the ↪️ Deflector button + payload counter read clearly? Is ⚡/🧲 nastiness fun rather than mean? Notes → `docs/09`.
2. If round 5 is clean → **freeze v0.3 → schedule PT-01** (3 humans, hotseat; export metrics JSON per `docs/08`).
3. Watch-list additions from sim: destruction sometimes burns 🛡️ from hands (contained-count −10% — intended squeeze, confirm with humans); 2p at 14.7 min still weakest.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 · Derelict kingmaking · **2p viability (14.7 min — worst case)** · human pass-turn behaviour (bots 68%, was 72%) · ⚡ destroying containments (late-game squeeze) · bot difficulty: greedy only.

### Where the faction layer lives (Gábor asked, round-4 addendum)

Player specialties/strengths/weaknesses = **P2 "Modules & factions"** in `docs/13-roadmap.md`. Material ready: `docs/14-civilization-bible.md` (8 civs direction table; per-civ checklist incl. captain personality + strength/weakness/play-style identity + faction power draft), `docs/02` opportunity #4, D-011 combo revisit. Gate order per standing rule: PT-01/02 vanilla core first (asymmetry must not mask core problems), then pilot faction **Mercury**; solo-vs-AI can pre-test faction balance cheaply once drafted. Escalation (↪️ Deflector) is a natural faction lever later — noted in `docs/15` D.

## Session 1, night continuation — 2026-10-25 ✅

**Phase:** P1 Core validation. PT-00 round 4 (solo vs AI) feedback triaged and fixed in one pass (D-017).

**Built this session:** reaction-window clarity (live ✅/🚫 Override-parity state, attack target named, effect-labeled buttons) · theft visibility (who-robbed-whom public, loot identity private — new `steal_card` line) · solo mode de-gated (no more "pass the device" vs AI anywhere; DrawReveal + Requisition copy solo-aware) · audio v2 (bed 0.16→0.10, Am–F–C–G pad cycle, sub heartbeat, 11 log-driven stingers) · Fury explained (HUD button → briefing, richer Setup hint, log lines state the reinsertion limit) · doc 15 Candidate B corrected: deck already has 4+4 Components — the fix is a lone-Component floor use (**🔧 Scrap**: discard 1 Component to peek at the top deck card), not density.

**All green:** typecheck · 28/28 tests · build.

### Next actions (in order)

1. **Gábor:** refresh http://localhost:5173 → 🤖 Solo vs AI → check the six fixes feel right (especially the reaction window: does the live ✅/🚫 state + "flip" copy make override parity obvious?). Round 5 notes → `docs/09`.
2. **Gábor decision D-015/D-016/D-018** (`docs/15` menu): **(a)** Storm+Wind · **(b)** +Scrap · **(c)** +Ion Surge & Tractor Snag · **(d)** a+b+c · **(f)** a+c+**Deflectors** (Uno-style redirect+escalate — Gábor's proposal, drafted as Candidate D) · **(g)** all · **(e)** veto. **D requires C.**
3. Implement chosen cards → extend tests beyond 28 → sim gate vs v0.2 baseline → solo-vs-AI feel test → freeze rules v0.3 → schedule PT-01.

### PT-00 status

Rounds 1–4 closed (onboarding → fixed; music/reveal/tooltips → done; solo instrument limit → solo vs AI built; round 4 clarity/privacy/audio fixes → D-017). Round 5 = next solo pass, then v0.3 candidates.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games) · Derelict kingmaking · 2p viability (13 min, comeback needs 2p proxy) · human pass-turn behaviour (bots turtle 72%) · bot difficulty: greedy only — more policies are cheap if solo feels too easy/hard.

### Where the faction layer lives (Gábor asked, round-4 addendum)

Player specialties/strengths/weaknesses = **P2 "Modules & factions"** in `docs/13-roadmap.md`. Material ready: `docs/14-civilization-bible.md` (8 civs direction table; per-civ checklist incl. captain personality + strength/weakness/play-style identity + faction power draft), `docs/02` opportunity #4, D-011 combo revisit. Gate order per standing rule: PT-01/02 vanilla core first (asymmetry must not mask core problems), then pilot faction **Mercury**; solo-vs-AI can pre-test faction balance cheaply once drafted. Escalation (Candidate D) is a natural faction lever later — noted in `docs/15` D.

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

