# Visual Studio Technical Handoff — the live game, exported

**Audience:** the VISUAL agent and OWNER (Gábor) of the private `gabortardos/last-orbit-visual-studio` repo.
**Author:** the GAME agent (GLM via Cline), answering **QA-V-001** (`docs/CLINE_HANDOFF.md`, visual repo).
**Authority:** this game repo's source code. Every claim below cites a file path — challenge anything by reading it or asking in `Q_AND_A.md` (QA-G-### entries get code-evidence answers).
**Companion machine-readable export:** [`visual-game-export.json`](visual-game-export.json) (same data, typed shapes).
**Retired / lore-vs-engine reconciliation:** §13. **What GAME commits to next:** §12.

## 1. Repo facts

- **Live game repository:** https://github.com/gabortardos/last-orbit-game-glm-style — public, clean, synced (`HEAD = 316cc58 = origin/main` at export; this file lands in the immediately following commit). The old `gabortardos/last-orbit-game` repo is a 2026-10-25 historical snapshot (23 files, no app source) — the visual repo's README still links it; GAME has noted the correction in the mailbox.
- **Quality gates on every change:** `npm test` (110/110 green), `npm run typecheck` (3 projects), `npm run build`, `npm run sim` (16,500-game seeded balance sim). CI runs test+typecheck+build on every push (D-025).
- **Layout:**
  - `packages/game-core/` — the **pure engine** (rules, deck, commands, events, bots). Deterministic: a pure function of (state, command, seed); no `Math.random`, no `Date.now` (PROJECT_CONTEXT hard rule 5). This package is the mechanics authority.
  - `apps/hotseat/` — the React client (Setup → match UI) + the three.js presentation layer (`src/solar/`, `src/ui/`).
  - `apps/server/` — authoritative Colyseus 0.18 online server (D-036): commands are requests, per-seat privacy snapshots, server bots, reconnect.
- **Visual assets in runtime today: none from your repo.** Current presentation is procedural (code-drawn planets/ships) — deliberately. The import protocol for your assets is §10.
- **The game repo is public:** anything committed here is publicly downloadable. Owner sign-off is required per import (D-042). Keep Drive file IDs/URLs in the private repo only — this document references asset IDs, never Drive links.

## 2. Render stack, animation interfaces, budgets (QA-V-002)

**Stack (all code-verified):** React 18.3 · Vite 5.4 · TypeScript 5.6 strict · **three.js 0.187** (plain, **no react-three-fiber** — removed by D-041 because the ported Explorer core is vanilla three.js) · Colyseus 0.18 (server + `@colyseus/sdk` client) · Web Audio (procedural soundtrack, `apps/hotseat/src/audio.ts`).

**The integration seam (the important part):** the engine appends to an **event log** — `LogEntry[] { turn, type, data, visibility }` (`packages/game-core/src/types.ts:88`). The presentation layer *reads that log* and never receives engine objects: `BackScene.ts` consumes plain numbers/colors via a small sync module (`apps/hotseat/src/solar/render/sync.ts`). Consequences for you:
- Animations are **post-hoc**: by the time an event is visible, the authoritative state has already advanced. FX can never mutate an outcome, and "skip" is always safe — your contract's no-rules-interference requirement is architectural, not aspirational.
- The same seam serves hotseat, solo-vs-AI, and online (the server filters the log per seat — `apps/server` `seatView`).

**Current 3D scene (what exists today, D-041):** JPL-accurate 32-body catalog (planets + moons, real orbital elements, `src/solar/data/`), Kepler propagation (`src/solar/sim/`), compressed scale (`src/solar/render/scale.ts`), one starship per captain racing the Mars–Jupiter belt corridor, the Sun wearing Fury (gold→red), and a log-driven action director (rupture = solar eruption, targeted play/give = comet streak, contained = shield pulse, fury_up = halo flash). Lazy-loaded chunk: **572 kB min / 146 kB gzip**; total app CSS 9.77 kB. Reduced motion → static frame (`prefers-reduced-motion`); no WebGL → plain backdrop via error boundary. Viewport-responsive framing incl. portrait/mobile pull-back (Session 8).

**What three 0.187 supports for your pipeline (code-verified capability, not yet exercised here):**
- **GLB via GLTFLoader** + `AnimationMixer` clips + **morph targets** (your GLB 003's 104 weight tracks are a standard feature) + named node access (`getObjectByName`) for the four sail pivots.
- **VideoTexture** (`<video>` element as a texture) or DOM-overlay video; H.264 MP4 plays in all target browsers.
- PBR materials (your GLB 002's normal/roughness maps) via MeshStandardMaterial.
- **2.5D layering:** sprites/planes with depthWrite control are standard; a hybrid "textured plane ships + 3D world" is feasible without engine changes.

**Device targets:** modern desktop + mobile browsers (the UI is responsive: log rail reflows <880px; the 3D framing handles portrait). No formal device lab yet — perf numbers for your GLBs will come from the harness (§12).

**Recommended budgets (GAME proposal, for joint review — not yet locked):** 60 fps desktop / 30 fps mobile floor; visual assets lazy-loaded, never blocking first paint; first Mercury-slice import ≤ 25 MB total, ≤ 2 MB per hero GLB, WebP for stills; draw calls per ship model kept low via the batching/instancing review your sprint docs already request.

**No tech change before joint review** — agreed; nothing above changes the engine, and presentation work stays in `apps/hotseat/src/`.

## 3. The game model in one page (verified against `game-core`)

**Match setup (`createGame`, `engine.ts:25`):** 2–5 captains. The **46-card base deck** (16 kinds, §4) is shuffled; each captain is dealt 4 cards + 1 **🛡️ Containment Field**; then **N−1 ☀️ Solar Ruptures** and the leftover **6−N 🛡️** are shuffled into the deck. Deck size at start = **51 − 4N** cards (35 at 4 captains; 55 total cards in the box at 4p). Random seat starts; play proceeds clockwise (direction can flip).

**Turn loop:** `command` phase → play **any number** of cards (or none) → `END_TURN_DRAW` → the **draw chain** runs (the turn's draw + any 🌟 Solar Wind bonus draws; it pauses for a ☄️ Storm jettison or a contained ☀️ reinsertion choice, then resumes) → turn ends, next captain (owed extra turns are consumed first).

**Every card play opens a reaction window (`phase: 'reaction'`):** all other captains may 📡 **Override**; the **current target** of an attack may ↪️ **Deflector**-redirect it (payload +1 if the reason is destruction: ⚡/🧲) or use their faction power (§5). Window closes when every eligible respondent has passed/acted; **odd Override count cancels the action**; even (incl. 0) executes. Captains with no possible response are **auto-passed** (D-020) — no forced "let it happen" clicks; if nobody can respond the action resolves instantly.

**Death loop:** draw ☀️ holding 🛡️ → auto-contain, ☀️ is **secretly reinserted** at a depth you choose (Sun Fury caps the depth as the Sun rages: Fury 1→anywhere, 2→top 15, 3→10, 4→7, 5→5, `cards.ts:75`). Draw ☀️ with no 🛡️ → flagship disabled, you're out (hand revealed and discarded); with Derelicts on, you keep one posthumous 📡 ("Final Transmission"). **Last flagship flying wins.**

**Modules (opt-in, default-on in the app):** Sun Fury (doom track 0–5) · Derelict Interference.
**Faction layer:** opt-in per seat (`config.factions`); `null` = classic vanilla. All powers once per match, spent publicly (§5).

## 4. Complete card catalogue (18 kinds — `packages/game-core/src/cards.ts`)

Copies are per match (deck size independent of player count). `target` = needs a chosen captain. `copies` = count in the 46-card base deck (rupture/containment handled separately, last two rows).

| id | name | emoji | category | copies | play window | target | effect (exact) | visibility |
|---|---|---|---|---|---|---|---|---|
| `override` | Comms Override | 📡 | action | 5 | reaction only | – | Jam another captain's action. After the window closes: ODD total overrides → action cancelled (spent cards stay spent) | played publicly |
| `deflector` | Deflector | ↪️ | action | 2 | reaction only, **current target only** | new victim | Redirect the attack to any other captain. Destruction (⚡/🧲) payload +1 per hop (cap +3); theft redirects without growth. Once per captain per chain; one 📡 kills the whole chain | played publicly |
| `flyby` | Forced Flyby | 🚀 | action | 4 | command | next captain | Your turn ends **without drawing**; next captain owes 2 extra turns + your remaining debt (max 6) | public |
| `burn` | Emergency Burn | 🔥 | action | 4 | command | – | End this turn immediately **without drawing** | public |
| `scan` | Deep-Space Scan | 🔭 | action | 3 | command | – | Privately view the top 3 deck cards, in order | **private to actor** |
| `slingshot` | Gravity Slingshot | 🌀 | action | 2 | command | – | Shuffle the entire deck | public |
| `requisition` | Emergency Requisition | 🤝 | action | 4 | command | yes | Target gives you 1 card — **they choose which** (choice modal) | exchange public; card identity public — the `give` event carries `card` (erratum 2026-11-25: this row wrongly said "private"; see §6 and the Q&A ruling) |
| `boarding` | Boarding Party | 🪝 | action | 2 | command | yes | Steal 1 **random** card from target's hand | who-robbed-whom public, loot private |
| `reversal` | Course Reversal | ↔️ | action | 2 | command | – | Flip play direction, end turn without drawing (2p: = Emergency Burn) | public |
| `salvage` | Salvage Operation | ♻️ | action | 2 | command | discard pick | Take any one card from the discard pile (never ☀️/🛡️) | public |
| `ion_surge` | Ion Surge | ⚡ | action | 2 | command | yes | Target **jettisons** 1 random card (destroyed to discard, not stolen). Payload +1 per ↪️/☿ hop | card destroyed publicly |
| `tractor` | Tractor Snag | 🧲 | action | 2 | command | yes | Target discards down to 3 (−1 per hop) — **they choose** what to lose | count public, cards private |
| `storm` | Micrometeoroid Storm | ☄️ | catastrophe | 2 | never in hand | – | On DRAW: jettison 1 card of your choice; an empty hand shrugs it off | public |
| `wind` | Solar Wind | 🌟 | action | 2 | never played | – | On DRAW: immediately draw 1 extra (chains); in hand it just pads vs 🧲/thieves | public |
| `coolant` | Coolant Cell | ❄️ | component | 4 | command (lone) / pair | – | Lone → **Scrap**: discard to privately peek at the top deck card. 2 matching → **siphon**: steal 1 random card from a target (📡-able, ↪️-able) | scrap private; steal as boarding |
| `hull` | Hull Plating | 🛠️ | component | 4 | command (lone) / pair | – | Same as `coolant` (any matching pair of components works) | as above |
| `rupture` | Solar Rupture | ☀️ | catastrophe | **N−1** | never in hand | – | Revealed the instant drawn. Hold 🛡️ → auto-contain + secret reinsert. Hold none → eliminated | reveal public, reinsert depth hidden |
| `containment` | Containment Field | 🛡️ | survival | **6 total** | never by choice | – | Auto-spends itself when you draw ☀️ (mandatory, D-006). 1 per captain dealt + leftovers in deck | spend public |

**Constants** (`cards.ts:3-36`): `FURY_CAP 5` · `DEBT_CAP 6` · `DEFLECT_CAP 3` · `SNAG_KEEP 3`. Targeted family: `boarding, requisition, ion_surge, tractor` (+ any pair). Theft family (♄ answers): `boarding, pair, requisition`. Attack family (☿/♅ triggers): theft + `ion_surge, tractor`.

**Player-facing copy:** every card carries a one-line blurb in `CARD_INFO` (tooltips/briefing) — the full texts live in `cards.ts:53-72` and the JSON export; reuse them verbatim so app and cinematics never disagree.

## 5. The eight faction powers — exact engine semantics (`commands.ts`, `engine.ts`)

All: **opt-in per seat**, **once per match**, **spent publicly** (`factionPowerUsed` is public state — the table shows ready/spent chips; Pillar 4). Shared limits: a power-redirect joins the chain's `deflectors` list — **once per captain per chain** (except ♄, deliberately); a single 📡 Override **cancels the whole chain** mid-flight; powers that "burn at initiation" stay spent even when cancelled (baitable — that's the counterplay).

| faction | power | command | legal trigger (exact) | effect (exact) | event id |
|---|---|---|---|---|---|
| ☿ Mercury | Flare Skip | `FLARE_SKIP` | You are the **current target** of any targeted pending (`boarding/pair/requisition/ion_surge/tractor`), alive, power unspent, not already in the chain's deflectors | A ↪️-redirect **without paying the card**: pick any other alive captain; payload grows **exactly like ↪️** (+1 if the reason is ⚡/🧲, cap 3); window reopens on the new target; you join the deflectors list | `flare_skip` |
| ♀ Venus | Court Favor | `COURT_FAVOR` | A `requisition` is aimed at you (you are the current target), alive, power unspent, not already redirected this chain | **Reverse the demand**: `target → initiator` (they become the giver) and `giftTo → you` (you receive the card they choose). Window reopens — the initiator may ↪️ the tribute onto a third captain; one 📡 still kills the exchange | `court_favor` |
| ♂ Mars | Salvage Run | `RUST_RUN` | Your own `command` phase, your turn, power unspent, card exists in discard (never ☀️/🛡️) | A **free ♻️** — take any discard card through a **real reaction window** (reason `salvage`, no card paid). One 📡 cancels the grab but the power **burns at initiation** | `rust_run` |
| ♃ Jupiter | Storm Shout | `STORM_SHOUT` | You **drew** a ☄️ (storm_discard choice is yours, `drawnBy` set), power unspent, another alive captain holds ≥1 card | Jettison nothing yourself — a chosen captain jettisons 1 card **instead** (their choice). No chain-shouting: the redirect is final | `storm_shout` |
| 🌍 Earth | Kit Bash | `KIT_BASH` | Your own `command` phase, your turn, you hold a ❄️/🛠️, power unspent, a valid other target | Play **one Component as a completed pair**: the Component **is paid** (discarded), a normal `pair` siphon window opens (1 📡 cancels the steal; the victim may ↪️); the power **burns at initiation** even if cancelled | `kit_bash` |
| ♄ Saturn | Ringwall | `RING_WALL` | A **theft** (`boarding/pair/requisition`) is aimed at you, alive, power unspent — works **even if you already redirected this chain** (a refusal, not a redirect) | The theft **fizzles instantly, mid-window**: `pending = null`, the initiator's spent cards stay spent, nothing is left to 📡. ⚡/🧲 destruction is *not* theft — it passes the rings untouched (that's the counterplay) | `ring_wall` |
| ♅ Uranus | Axial Tilt | `AXIAL_TILT` | An **attack** (`boarding/pair/requisition/ion_surge/tractor`) is aimed at you, alive, power unspent, not already in the chain's deflectors | Re-aim the attack at any other alive captain with **NO payload growth** (any growth already on the chain stays). Window reopens. **2-player: it slides straight back at the attacker**, un-grown. A later ↪️ from the new target grows normally | `axial_tilt` |
| ♆ Neptune | Deep Sight | `DEEP_SIGHT` | Your own `command` phase, your turn, power unspent | A free, **instant, private** top-3 deck peek (🔭 without the card). **No reaction window** — nothing to 📡; the counterplay is a later 🌀 Slingshot shuffling the knowledge into noise | `deep_sight` |

**QA-V-008 notes (driving Flare Skip cinematics from engine events):** the legal trigger is *only* the five targeted reasons above — **not** solar hazards (the Sun/☄️ never target a captain; there is nothing to redirect). A redirect chain reads from the log as: `play{target:A}` → `flare_skip{by:A,to:B}` (or `deflect`/`axial_tilt`) → possibly more hops → then either `pending_cancelled` (a 📡 won) or the reason's resolution event (`steal` / `forced_discard` / `snag_hit` / `give`). Actor = `by`, original target = the `play.target`, final target = the resolution event's `target`/`from`; payload growth = `growth` field (0..3); spent-power status = `players[].factionPowerUsed`. Your Sprint-06 fixture branches map cleanly: REDIRECT = the `flare_skip` → resolution sequence; CANCEL = `play` → `pending_cancelled{stack}`.

**QA-V-009 notes (Court Favor):** trigger = `play{cards:['requisition'],target:you}` → `court_favor{by:you, to:initiator}`; the reversal makes the **initiator the giver** — resolution is `give{from:initiator, to:you, card}` with **card identity public** — the `give` event is `public` and carries `card` through all three enforcement layers (commands.ts:307; views.ts:27–37 passes public entries unmodified — only `draw` is card-stripped for other seats). Erratum 2026-11-25: this note and §5's requisition row wrongly said "private". A sealed tribute pod remains a valid style choice — the face may be shown or kept sealed; both are privacy-safe. Deflection onward is possible (↪️ by the initiator to a third captain — theft-redirect, no growth), and full cancellation by 📡 (`pending_cancelled`). Portrait/art dimensions: **not yet locked** (no card art exists — see §8); WebP is fully supported (decodes in all target browsers; Vite serves it as a static asset).

## 6. Authoritative event catalogue — all 43 log types

The engine's single emission point is `addLog(s, type, data?, visibility?)` (`engine.ts:5`). Every entry: `{ turn, type, data, visibility }`. Visibility: **public** (all seats) · `only:<seat>` (that seat only) · **hidden** (simulation detail, no seat). Source = `game-core/src/{engine,commands,resolve}.ts`. Payloads below are the exact fields. These are the **only** event IDs that exist — never invent one.

**Match / turn flow:**

| type | payload | visibility | meaning | source |
|---|---|---|---|---|
| `game_start` | `playerCount, modules, seed, first` | public | match created; `first` = starting seat | `engine.ts:84` |
| `turn_start` | `player, debt` | public | a captain's turn begins (`debt` = extra turns still owed) | `engine.ts:85,223` |
| `turn_end` | `player` | public | turn ends, advancing | `engine.ts:214` |
| `eliminated` | `player, revealedHand, handSizes, aliveAfter` | public | flagship disabled — hand revealed (end state, not a peek) | `engine.ts:235` |
| `win` | `player, finalHandSizes` | public | last flagship flying | `engine.ts:244` |

**Plays & reactions (the window events):**

| type | payload | visibility | meaning | source |
|---|---|---|---|---|
| `play` | `player, cards, target, salvage` | public | a card play opened a reaction window | `commands.ts:426` |
| `override` | `player, stack, viaCard` | public | 📡 played (`viaCard:false` = Derelict Final Transmission) | `commands.ts:64` |
| `deflect` | `by, to, reason, growth` | public | ↪️ redirect (growth only on ⚡/🧲) | `commands.ts:105` |
| `flare_skip` | `by, to, reason, growth` | public | ☿ power redirect (as ↪️, no card paid) | `commands.ts:137` |
| `court_favor` | `by, to, reason` | public | ♀ reverses the requisition | `commands.ts:163` |
| `rust_run` | `player, card` | public | ♂ free salvage initiated (power burns now) | `commands.ts:189` |
| `storm_shout` | `by, to` | public | ♃ roars a drawn ☄️ at another captain | `commands.ts:207` |
| `kit_bash` | `player, card, target` | public | 🌍 one Component as a pair (power burns now) | `commands.ts:239` |
| `ring_wall` | `by, reason, initiator` | public | ♄ voids the theft mid-window | `commands.ts:254` |
| `axial_tilt` | `by, to, reason, growth` | public | ♅ re-aims, no growth added | `commands.ts:280` |
| `deep_sight` | `player, cards` | **`only: player`** | ♆ private top-3 peek | `commands.ts:296` |

**Resolutions & choices (the committed outcomes):**

| type | payload | visibility | meaning | source |
|---|---|---|---|---|
| `pending_cancelled` | `reason, initiator, stack` | public | odd 📡 stack cancelled the action | `resolve.ts:15` |
| `scan_seen` | `player, cards` | **`only: player`** | 🔭 result (top 3, order) | `resolve.ts:30` |
| `shuffle` | `player` | public | 🌀 shuffled the deck | `resolve.ts:36` |
| `steal` | `from, to, via` | public | theft landed — who robbed whom (`via` = reason) | `resolve.ts:53` |
| `steal_card` | `to, card` | **`only: to`** | the loot's identity (thief-only) | `resolve.ts:54` |
| `fizzle` | `reason, target, initiator` | public | effect hit an empty/short hand — nothing happened | `resolve.ts:45,63,83,102,124` |
| `salvage_take` | `player, card` | public | ♻️ grabbed from discard | `resolve.ts:80` |
| `scrap_seen` | `player, cards` | **`only: player`** | lone-Component peek result | `resolve.ts:92` |
| `forced_discard` | `player, card, via` | public | ⚡ destroyed a card (identity public) | `resolve.ts:111` |
| `surge_hit` | `target, by, count` | public | ⚡ summary (cards destroyed) | `resolve.ts:113` |
| `snag_hit` | `target, by, discardCount, keep` | public | 🧲 summary before the choice | `resolve.ts:127` |
| `snag_discard` | `player, cards` | public | 🧲 victim's chosen losses (identities public) | `commands.ts:342` |
| `give` | `from, to, card` | public | 🤝 exchange (card public — it lands in a hand) | `commands.ts:307` |
| `flyby_debt` | `player, amount, from` | public | 🚀 debt assigned (max 6) | `resolve.ts:143` |
| `turn_skipped` | `player` | public | 🔥/↔️ ended the turn without drawing | `resolve.ts:148,157` |
| `direction` | `direction, by` | public | ↔️ flipped play direction | `resolve.ts:155` |

**Draw chain (the tension engine):**

| type | payload | visibility | meaning | source |
|---|---|---|---|---|
| `draw` | `player, card, deckLeft` | public* | a card entered a hand (*the server strips `card` for other seats — `apps/server` `seatView`; hotseat filters it the same way) | `commands.ts:478,490` |
| `skip_draw` | `player` | public | deck+discard empty — draw skipped | `commands.ts:443` |
| `reshuffle` | – | public | discard shuffled back in | `commands.ts:453` |
| `storm_hit` | `player` | public | ☄️ drawn | `commands.ts:479` |
| `storm_fizzle` | `player` | public | ☄️ hit an empty hand | `commands.ts:482` |
| `storm_discard` | `player, card` | public | ☄️ jettison resolved | `commands.ts:320` |
| `wind_bonus` | `player` | public | 🌟 promised an extra draw | `commands.ts:493` |
| `rupture_reveal` | `player, deckLeft` | public | ☀️ drawn — the big one | `commands.ts:458` |
| `fury_up` | `fury` | public | containment enraged the Sun (+1) | `commands.ts:465` |
| `contained` | `player` | public | 🛡️ auto-spent | `commands.ts:467` |
| `reinsert_position` | `position, limit, deckLength` | **hidden** | the secret reinsertion depth (sim-only; the UI asks the chooser privately) | `commands.ts:356` |

**State queries for cinematics (not log events, but public state):** `players[].{name,alive,faction,factionPowerUsed,eliminatedAtTurn}` · `handSizes` (via helpers) · `deck.length` · `discard` · `sunFury` · `direction` · `turnsOwed` · `phase/pending/awaiting` shape (`types.ts:123-142`). The server's per-seat snapshots already respect all of §7.

## 7. Public vs private — the full information map

**Always private (never cross a seat):** any hand's card identities (except the owner's own) · deck order and the reinserted ☀️ position · `scan_seen` / `steal_card` / `scrap_seen` / `deep_sight` payloads · which card a 🤝 giver chose until it lands (then it's public as `give`) · the chooser's pending storm/snag selections before resolution.
**Public by design:** who is alive/eliminated · hand *sizes* · spent faction powers (`factionPowerUsed`) · who played what reaction card (`override/deflect`) · who robbed whom (`steal` without the card) · destroyed card identities (`forced_discard`, `snag_discard`) · ☀️ draws/containments/Fury · debt, direction, turn order · the full event history (visibility-filtered per seat).
**Hidden entirely:** `reinsert_position` (the engine even hides it from the UI — only "the chooser picks privately" is knowable).
**Elimination reveals the victim's hand once** (`eliminated.revealedHand`) — end-state, not a peek.

The enforcement already exists in two layers: `LogVisibility` per entry (engine) and `seatView` per seat (server) — the adapter (§9) is the third. Never add a private field to a public DTO.

## 8. Screens & UI inventory (QA-V-003)

**Honest status on screenshots:** the GAME agent cannot capture browser screenshots from this environment (no browser automation available; image files are not machine-readable here). The inventory below is code-accurate and complete; GAME proposes a 10-minute capture session with Gábor (dev server → screenshot each screen into the private repo's manifest) as the follow-up, so please don't treat "no PNGs yet" as "no screens."

Current visual language: **glass panels (backdrop-blur, 60–70% translucent) over the live 3D solar system** (D-038/D-041) · emoji + text cards (no art yet — that's your lane) · gold accents for active captain & faction powers · calm-to-red Sun.

| screen | component (path) | contents / states |
|---|---|---|
| Title/Setup | `apps/hotseat/src/ui/Setup.tsx` | title ☀️ Last Orbit + tagline · mode: 👥 Pass-and-play / 🤖 Solo vs AI / 🌐 Online · captains 2–5 · name inputs · modules: Sun Fury, Derelicts (checkboxes) · **per-seat fleet selects** (classic + 8 factions) · seed · Begin · opens Briefing/Codex modals |
| Mission Briefing | `ui/Briefing.tsx` | full rules + card reference modal; auto-opens for new players (localStorage); reachable from anywhere, mid-game (D-023) |
| Civilization Codex | `ui/Codex.tsx` | the 8 civ lore sheets (captains, flagship, power, counterplay, real planet facts) — the lore v0.6 companion, data-driven |
| Match — HUD | `ui/GameView.tsx` | deck size · ruptures left · turn # · direction ↻/↺ · Sun Fury pip bar (click = briefing) · Civs / Help / New game buttons |
| Match — players rail | `ui/GameView.tsx` | per captain: name, active ring, hand size, faction chip (**ready/spent**), debt `+N⏱`, derelict 💤+📡 markers |
| Match — flight log | `ui/Overlays.tsx` `LogFeed` | pinned side rail, full history, visibility-filtered per viewer, autoscroll-near-bottom; z-above overlays (D-021) |
| Match — command | `ui/GameView.tsx` | hand as buttons (emoji+name×count, tooltips = CARD_INFO.blurb) · pair buttons · target/salvage choosers · faction-power choosers (♂/🌍/♆) · End turn — draw |
| Match — modals | `ui/Overlays.tsx` `Modals`/`ReactionOverlay` | reaction window (live 📡 parity, redirect chooser, ☿/♀/♄/♅ buttons) · storm/snag discard pickers · 🤝 giver choice · ☀️ reinsert slider (private) · draw reveal · game-over + match report + metrics JSON export |
| Match — overlays | `ui/Overlays.tsx` | `HandoffGate` (pass-and-play privacy curtain) · `DrawReveal` (drawer-only) · corner controls 🔊📖❓ always reachable |
| Backdrop | `ui/SolarScene.tsx` + `solar/` | the 3D system behind everything (§2); lazy chunk |
| Online lobby→match | `online/OnlineApp.tsx` + `online/net.ts` | room create/join by code · roster + seat pick (empty seats = server bots) · host starts → same GameView in remote mode · reconnect screen (30 s window) |

**Constraints your UI proposals must respect (owner-tested, logged):** the log rail stays visible during any window (D-021) · the reaction window must never hide the decider's hand (PT-00) · briefing reachable at any moment (D-023) · readability outranks spectacle — the P3 readability gate applies to every visual rung (D-038) · reduced-motion + no-WebGL fallbacks are mandatory · mobile <880px reflow. Anything that breaks these is a UX regression, however good it looks.

## 9. Event-contract adapter mapping (QA-V-004) — your DTO → our engine

Your `contracts/event-contract.json` (v0.1-proposal) is a sound shape. GAME will implement the adapter as a **presentation-only module** in `apps/hotseat/src/visual/` — the engine schema stays untouched (your requirement, agreed). Field-by-field proposal:

| your DTO field | GAME mapping |
|---|---|
| `eventId` | `${matchId}:${logIndex}` — the log array is append-only, so the index is a stable unique id |
| `sequence` | `logIndex` (monotonic within a match); `turn` available per entry |
| `matchId` | online: Colyseus room id · hotseat/solo: `seed` + start time |
| `coverageId` | your COVERAGE row, resolved through the table in §13 |
| `engineEventType` | `LogEntry.type` — exactly the 43 ids in §6 (plus the state queries) |
| `actorId` / `targetIds` | `data.player` / `data.by` / `data.from` / `data.to` → formatted `p{seat}`; original vs final target reconstructable from the chain (§ QA-V-008 note) |
| `outcome` | derived by the adapter from the chain tail: `cancelled` (`pending_cancelled`) · `redirected` (`deflect/flare_skip/axial_tilt/court_favor` mid-chain) · `resolved` (the reason's resolution event) · `fizzled` (`fizzle`) |
| `visibility` | passthrough of `LogEntry.visibility` — the adapter **filters per seat before emission** (same rule as the server's `seatView`); private events simply never reach other seats' visual layers |
| `payload` | `data` verbatim (shapes in §6); no invented fields, ever |
| `assetIds` | the **only** place the game repo touches your manifest: a reviewed table in `visual-game-export.json` → `adapterVisualMap` proposed by VISUAL, mapping engine event → requested asset id(s). The game never picks visuals itself |
| `durationMs` / `priority` | adapter defaults (proposal: normal ≤ 1200 ms, minor ≤ 400 ms, `turn_start/draw` minor, `rupture_reveal/eliminated/win` major) — owner-tunable, never rule-blocking |
| `fallback` | always available: the current log-feed line + icon (this is what ships today; FX are additive) |
| `skipAllowed` | **always true** — architecturally guaranteed (§2: animations are post-hoc reads of an append-only log; state has already advanced) |

**Your six contract requirements, verified:** (1) committed-outcome-only — ✓ by construction; speculative *targeting* (the pre-resolution window) is UI state (`pending`), the adapter will emit window-open/-close intents separately, clearly marked non-outcome. (2) dedupe by (matchId, logIndex) + reconnect without replay — GAME will keep a seen-cursor that jumps to `log.length` on fresh snapshots. (3) private filters — §7 rules, enforced pre-emission. (4) no rules mutation / no timer blocking — presentation has no write path to the engine (hard rule 4 + D-041 guard). (5) real chains, no invented outcomes — §6 payloads carry actual targets/growth. (6) reduced-motion = static equivalents — already honored scene-wide (§2).

## 10. Asset import & versioning protocol (QA-V-005) — GAME proposal

1. **Retrieval (owner-authorized, no public links, no tokens in git):** Drive for Desktop on this Mac (owner's choice) → the warehouse at `~/Library/CloudStorage/GoogleDrive-<account>/My Drive/AI/Last Orbit`. GAME fetches by the manifest's `path`/file id, then verifies **SHA-256 against `contracts/asset-manifest.json`** (`shasum -a 256`). Retrieval proof + report = the QA-V-005 closure condition. Nothing is fetched at match time, ever.
2. **Import gate (per asset):** `runtime_approved: true` in your manifest **+** owner sign-off for this import **+** `rights` resolved to a license the owner has approved for *public* distribution (the game repo is public — importing publishes; D-042 flags this as the licensing gate).
3. **Pin & record:** each import pins the manifest commit hash and records `{assetId, manifestCommit, sha256, targetPath, date, approvalRef}` in `docs/visual-studio/import-log.md` (this repo) — byte-identical re-imports are rejected as no-ops; superseded assets stay on disk until an explicit cleanup decision.
4. **Runtime layout:** `apps/hotseat/public/visual/<assetId>.<ext>` (fetched by the visual layer after first paint; build-bundled; never a Drive URL). Optimized copies only (WebP stills, Draco GLB where you ship it); originals stay in Drive.
5. **No Git LFS** (not enabled on this repo): keep total imported bytes modest — the §2 budget proposal (≤ 25 MB first slice) exists for this; if a future asset set exceeds it, LFS becomes an explicit owner decision.
6. **Feedback report:** after each import GAME writes `VISUAL_INTEGRATION_REPORT.md` (your release protocol) into the visual repo: what loaded, animation clips found, draw calls/fps, checksums, screenshots, defects.

## 11. Two presentation modes (owner requirement, this session)

At match start the player picks: **Classic** (the current cards-only glass UI, backdrop static) or **Cinematic** (cards + the live system reacting to every event: your assets + FX + camera). Auto-Classic fallback for no-WebGL / `prefers-reduced-motion` / low-end (detected). One engine, one log — the modes differ only in the presentation layer; this matches D-038/D-039 ("glass UI survives as tactical/fallback mode"). The toggle is UI state, never game state. UI wording and default are owner decisions when the toggle ships.

## 12. What GAME commits to next (order)

1. **Drive retrieval proof** (QA-V-005 closure): once Drive for Desktop is mounted on this Mac — fetch the reference PNG + the three Mercury GLBs, SHA-256 verify against the manifest, report.
2. **GLB renderer harness** (QA-V-007 evidence): dev-only page in `apps/hotseat` (not shipped in the build path) — GLTFLoader, 4 named sail pivots, animation clips, **104-track morph playback** (GLB 003 `umbrella_defeat_TEST`), the 3-texture-map material test (GLB 002), draw calls/fps/axes/scale report. This answers 2.5D-vs-3D with real numbers on the actual stack.
3. **Backdrop re-port** (owner-authorized, D-042): the Explorer's texture pyramid + GLB moon pipeline + a cinematic travel camera (`cinematic-travel.ts`-style) ported into `apps/hotseat/src/solar/` behind the Cinematic toggle.
4. **Event adapter** (`apps/hotseat/src/visual/adapter.ts`) once your contract review lands, with the §9 mapping.
5. **First owner-approved Mercury import** through §10 — the release-protocol loop, ending in `VISUAL_INTEGRATION_REPORT.md`.

## 13. COVERAGE reconciliation — your 51 rows vs the engine (QA-V-001 "retired/planned")

| your id | engine reality |
|---|---|
| CM-001 Deep Scan | `scan` (Deep-Space Scan 🔭) — top 3, order preserved, private |
| CM-002 Course Correction | **no engine card** (historical v0.1; deck-order manipulation does not exist) |
| CM-003 Route Scramble | `slingshot` (Gravity Slingshot 🌀 — full shuffle, not peek) |
| CM-004 Forced Detour | `flyby` (Forced Flyby 🚀 — turn debt, capped 6) |
| CM-005 Supply Requisition | `requisition` (Emergency Requisition 🤝) |
| CM-006 Boarding Probe | `boarding` (Boarding Party 🪝) |
| CM-007 Vector Flip | **no engine card** (closest: `reversal` flips *play direction*, not draw order) |
| CT-001 Emergency Burn | `burn` (Emergency Burn 🔥) |
| CT-002 Signal Jam | `override` (Comms Override 📡 — cancel, both spent) |
| CT-003 Decoy Beacon | `deflector` (↪️ — redirect + payload growth on destruction) |
| ER-001 Emergency Reroute | partial: the contained-☀️ **reinsertion** mechanic (`contained` → `reinsert_position`, secret) — but it is the rupture loop, not a playable card |
| CR-001…CR-008 | **no engine existence** — the only catastrophe/pressure systems are ☀️ Rupture, ☄️ Storm, Sun Fury, 🚀 debt. Lore flavor, no mechanics. Treat as unproduced until the owner asks for engine support |
| FAC-MER/VEN/MAR/EAR/JUP/SAT/URA/NEP | all live — exact semantics in §5, events in §6 |
| NEW-01…NEW-13 | all live: `deflector`, `requisition`, `boarding`, `pair`+`scrap` (components), `storm`, `ion_surge`, `tractor`, `flyby`, `slingshot`, `scan`, `containment` (auto), `override`, `salvage` |
| SYS-01…SYS-11 | presentation surfaces — screens in §8; adapter intents in §9; Spectate exists online (spectator seats), connection/replay handled server-side |

**Vocabulary note (lore v0.6 vs engine):** the engine's canonical names are the ones in §4 (they ship in the app). Lore names ("Course Correction", "Emergency Reroute", crisis menagerie) are creative canon for the studio, not mechanics. Captain/civ **names and looks** belong to your Bible + owner sign-off; the game repo's `docs/14` bible also carries names (e.g. ☿ Captain Cinder Vale) — a single naming authority should be agreed with the owner before any name appears in both repos' runtime surfaces.

— *GAME agent, 2026-11-25. Questions → `Q_AND_A.md` (QA-G-###). Everything above is code-verified against `316cc58`.*
