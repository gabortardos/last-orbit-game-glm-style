# 14 — Civilization Bible (v0.7 — all eight civs deep-designed AND playable; passives brainstorm open, D-028→D-035)

Eight playable civilizations. Direction table below inherits the master-prompt concepts — **critiqued, not final**. Deep design (biology, captain, flagship, comedy premise, play-style, real-planet hooks, colours/materials/motion/sound, anti-one-joke flexibility) begins in P2, one civilization at a time (pilot: Mercury).

| Origin | Civilization | Direction (to critique & deepen) | Real-planet hook (comedy well) |
|---|---|---|---|
| Mercury | The Flareskips | Obsidian-and-gold heat-sail speedsters; impatient; cooling problems | Fastest orbit, scorched and icy at once |
| Venus | The Cloud Courtiers | Acid-cloud socialites in ornate masks; floating barges | Crushing pressure, sulfuric clouds, "morning star" vanity |
| Earth | The Improvisers | Mismatched gear, adapters, tape, dangerous optimism | The only ones proud of their junk |
| Mars | The Rustborn | Red-armoured engineers; drills for every problem | Dust storms; obsessed with "the old oceans" |
| Jupiter | The Stormkin | Gaseous manta giants in pressure suits; loud, theatrical | A storm older than nations (the Spot as a monument) |
| Saturn | The Ring Corsairs | Crystalline collectors/pirates with personal orbiting rings | Rings as status/hoard; density so low they'd float |
| Uranus | The Sideways Sages | Angular ice beings; think the rest of the system is tilted | 98° axial tilt; coldest atmosphere, deadpan delivery |
| Neptune | The Deepwave Oracles | Bioluminescent deep-blue prophets; correct but useless warnings | Fastest winds; far, dark, mysterious |

## Per-civilization checklist (filled for all eight — Codex sheets are canonical; §Pilot/§v2/§v3 hold the design truth)

- [ ] Biological/constructed form & silhouette language
- [ ] Captain: name, silhouette, personality, catchphrase-in-spirit
- [ ] Flagship design & animation quirk
- [ ] Cultural comedy premise (≥3 jokes of space, not 1)
- [ ] Faction power draft (if faction layer adopts powers) + cost
- [ ] Real-fact hook list (≥5 facts mined for gags)
- [ ] Colour/material palette (colour-safe), sound cues, motion verbs
- [ ] Strength/weakness/play-style identity & counter-relationships

## Faction-power framework (v1 draft — D-028 PROPOSED)

Every faction power must pass all six, or it doesn't ship:

1. **One sentence.** Template: *"Once per match, when [trigger], you may [effect]"* — no new resources, no new meters, no new card types.
2. **Base-deck counterplay.** Answerable with v0.3 cards alone (📡 cancels it, ↪️ re-targets it, 🧲/🤝 starve it) — the counter must already be in the shoebox.
3. **Once per match by default.** Recurring/cooldown powers only if the solo-vs-AI pretest proves once-per-match is dull — never before.
4. **v0.3 vocabulary only** (D-026 discipline): powers reference existing cards/actions, so paper, app and sim keep measuring the same game.
5. **Sim-expressible:** implementable in `bots.ts` without human-only information (no hidden-knowledge powers beyond normal hand bluffs).
6. **Gated:** faction *playtests* sequence after the vanilla PTs (asymmetry must not mask core problems). Originally this also blocked implementation; **amended 2026-10-25 per Gábor's directive (D-029):** the *pilot* may ship as an opt-in, off-by-default layer provided vanilla configs are provably unchanged — which they are (all pre-existing tests green, untouched).

**Visibility:** spent powers are public (Pillar 4 — no hidden bookkeeping). A Flareskip who has burned Flare Skip is, visibly, just fast.

## Reactor Charge re-evaluation (prep — final call post-PT-03; D-003 stands)

| Option | Shape | Complexity | Read |
|---|---|---|---|
| **A. Drop RC** | per-civ once-per-match powers only (framework above) | lowest | identity survives; complexity budget stays with Sun Fury |
| **B. RC as shared currency** | sacrifice any action card → 1 Charge; each civ's power costs 2–3 Charge | highest (resource × 8 powers — doc 05's complexity-2 problem) | hidden sacrifice = bluff surface, but a new meter × new rules |
| **C. Hybrid** | most civs once-per-match; RC exists only where recurring use is wanted (fuel = sacrificed cards) | medium | A as default; pay complexity only for civs that need it |

**Current lean: A for the pilot** (Mercury ships once-per-match). Revisit B/C only if faction playtests report "powers feel same-y/flat."

## Faction v2 — Court Favor · Salvage Run · Storm Shout (IMPLEMENTED, D-031)

The same opt-in per-seat layer as ☿ (Setup → fleet picker; classic = default; vanilla configs provably unchanged). Full deep sheets live in the **in-app Codex** (D-030/D-031, data-driven `Sheet[]` in `Codex.tsx` — a new civilization is one append); this section records the *engine* truth each sheet must match:

- **♀ The Cloud Courtiers (Venus) — "Court Favor":** once per match, when a 🤝 Requisition targets you, reverse it — the initiator gifts **you** 1 card instead (no card paid). The window reopens on the flipped demand: one 📡 voids the whole exchange (the Favor is spent either way — baitable, like ☿), and the initiator may ↪️ the tribute onto a third captain (D-018 theft-redirect style). Counterplay: don't requisition a loaded Court — board (⚔) or surge (⚡) them; there's nothing to flip.
- **♂ The Rustborn (Mars) — "Salvage Run":** once per match, during your own Command Phase, take any card from the discard pile for free — routed through the standard reaction window, so one 📡 cancels the grab *and the run still burns* (spent at initiation, not success). No ruptures/containments (they aren't cargo). Counterplay: hold your 📡 for the run; against a Rustborn your discard pile is a shop window — strip it yourself with ♻️ first. Bots prioritize via `RUST_WANTED`.
- **♃ The Stormkin (Jupiter) — "Storm Shout":** once per match, when you **draw** a ☄️ Micrometeoroid Storm, jettison nothing — roar it at another captain holding ≥1 card and they jettison 1 instead. Only the drawer may shout (`drawnBy` marker) — a shouted-at victim cannot roar it onward; no chain-shouting, no deflecting the roar. Counterplay: it's public once spent — count storms, keep hands lean late-game so the shout roars at nothing.

All three follow the framework above: opt-in, once-per-match, v0.3 vocabulary only (🤝/♻-window/☄️/📡 — no new cards), sim-expressible (greedy + random bot policies shipped), spent powers public. Stats: `courtFavors`, `rustRuns`, `stormShouts` (plus `flareSkips`).

## Faction layer v3 — the four outer powers (D-032 ADOPTED — Gábor signed off all four → **implemented as D-033: all eight civilizations playable**)

The last four civilizations are deep-designed (full lore sheets in the in-app Codex — captains, flagships, comedy wells, real-fact hooks, palettes, rivalries). This section records the **power rules** each sheet must match. All four pass the six framework rules: one sentence, base-deck counterplay, once per match, v0.3 vocabulary only, sim-expressible, spent publicly. Sign-off (2026-10-25): *"yes to all powers for now. I'll test them, once they are in the game."* Three implementation rulings shipped with D-033: ① **♅ picks the re-aim target** (same chooser UX as ↪️/☿ — the attacker may be a bot or offline mid-window); in 2-player the attack slides straight back at the attacker. ② **♄ resolves instantly, mid-window** — cancelling an already-dead theft is meaningless, so nothing is left to 📡. ③ **♆ is usable during your own Command Phase** (hotseat privacy — v1 ruling on "any moment").

- **🌍 The Improvisers (Earth) — "Kit Bash":** *once per match, during your Command Phase, play a single ❄️/🛠️ Component as if it were a completed matching pair — siphon 1 random card from a target captain.* Normal pair rules apply (one 📡 cancels; the victim may ↪️) and the bash burns at initiation like ♂ — baitable. Counterplay: 📡 the siphon, ↪️ it onward, or strip components early (🧲/🤝 take them first — the bots already do). Identity: everyone else needs twins; Earth needs one part and a roll of tape.
- **♄ The Ring Corsairs (Saturn) — "Ringwall":** *once per match, when a theft would take a card from your hand (🤝 Requisition, 🪝 Boarding, or a Component-pair siphon), the theft fizzles — the attacker's card is still spent, your card stays.* Resolves instantly, mid-window (ruling ②). Counterplay: bait it (spent is public), then punish with ⚡/🧲 — the rings stop theft, not vandalism — or attack the clock (🚀 Flyby debt). Identity: the fortress-hoarder; the counter is destruction, not robbery.
- **♅ The Sideways Sages (Uranus) — "Axial Tilt":** *once per match, when an attack card or pair targets you, it is re-aimed at a different captain of ♅'s choosing (ruling ①) — the play proceeds normally with no ↪️ payload growth.* In 2-player it slides straight back at the attacker. Counterplay: public spend = bait it; non-targeted pressure (🚀 debt, 🌀 chaos, deck attrition) ignores a tilt entirely; a 📡 still kills whatever gets re-aimed. Identity: not ☿'s aggressive redirect (his choice, his victim, payload grows) — a flat refusal. You cannot hit what is sideways.
- **♆ The Deepwave Oracles (Neptune) — "Deep Sight":** *once per match, during your own Command Phase (ruling ③), privately view the top 3 cards of the deck — 🔭 Deep-Space Scan without spending a card.* No reaction window — knowledge is not an action, there is nothing to 📡; the bot policy feeds the sight into the same knowledge slot as 🔭 and actually dodges a seen ☀️. Counterplay: 🌀 Slingshot shuffles the sight into noise (hold one against an oracle); spent is public; and knowledge is not armor — they still need the 🛡️ everyone else does. Identity: the information civilization.

**Power-axis spread (no overlaps):** redirect-attack (☿) · flip-theft (♀) · discard-access (♂) · storm-transfer (♃) · pair-improv (🌍) · theft-wall (♄) · re-aim (♅) · free-peek (♆). The two "no" powers (♄ theft, ♅ attack) are split by axis (economy vs aggression) and by who picks the next victim (nobody vs the attacker).

**Rivalry map (writing aid):** ☿–♃ elemental opposites · ♀–♄ tribute vs hoard (old money vs new hoard) · ♂–🌍 build-it-RIGHT vs build-it-NOW (the junk schism) · ♅–♆ the eternal farther/colder/windier grudge · ♂–♄ reuse vs collection.

## Pilot — The Flareskips (Mercury) · deep design draft (D-028 PROPOSED)

*First civilization designed; proves the pipeline. The art sheet itself stays a P3 deliverable (`06`); this is the design layer.*

- **Form & silhouette:** cast-glass sprinters — slender obsidian bodies seamed with gold repair-lines (they thermal-crack, patch with gold, and call the cracks *service history*). Always leaning 5° forward, like the start line is behind them. Gold visor-slits, no visible mouths — the posture does the comedy. Not a suited human, not a grey alien, not an animal with accessories (casting rules ✓).
- **Captain:** **Cinder Vale**, callsign **"Twice-Dawn."** Congenitally early — arrives before the invitation, finishes your sentences (usually wrong), treats patience as hoarding. Catchphrase-in-spirit: *"Early is on time; on time is a different orbit."*
- **Flagship · *The Sudden Dawn*:** a black-glass dagger with four gold-foil sails (real spacecraft foil) — furled to accelerate, spread wide to brake; no visible engine, the sails *are* the engine. **Quirk:** never still — surges half a length, reins itself in, sighs steam when made to wait; radiators glow cherry-red *while idling* (running hot = standing still). Defeat animation: sails snap shut and the ship folds backward like a dropped umbrella.
- **Comedy wells (5, all space-real):** ① speed impatience — two birthdays per solar day (see facts); ② cooling problems — captains brag radiators like truckers brag engines; sunscreen-over-parka wardrobe; ③ the Sun's takeback sunrise offends them *personally* ("WE do not do takebacks"); ④ shadow-crater ice trade — iced drinks and a working forge from the same crater; ⑤ the planet runs a size small (still shrinking).
- **Faction power — "Flare Skip" (IMPLEMENTED, D-029; pretest = PT-F1):** *Once per match, when you are the target of an attack card or pair, redirect it as if you had played ↪️ — no card paid (payload still grows +1; once-per-captain-per-chain and one-📡-kills-the-chain apply as normal).* Counterplay: bait it early (spent = public), 📡 the whole chain, or attack the economy (🧲/🤝) it can't dodge. **Fallback** if the solo-vs-AI pretest says too strong: **"Slingshot Start"** — once per match, at your turn's start, draw 2 then discard 1.
- **Real-fact hooks (7):** ① year = 88 Earth days but a solar day = 176 — a Mercurian birthday comes twice per day; ② −173 °C night to +427 °C day, the system's worst wardrobe problem; ③ near perihelion the Sun briefly *reverses* in the sky — the double sunrise, the only takeback the Sun ever does; ④ permanently shadowed polar craters hold water ice right beside furnace heat; ⑤ the planet is shrinking as its outsized core cools — the crust wrinkles (scarps); ⑥ that iron core is ~85% of the radius: a metal ball in a rock onesie; ⑦ only two spacecraft have ever visited — BepiColombo arrives late 2026, and they're rehearsing hospitality for their third guest ever.
- **Palette / materials / sound / motion:** obsidian black + heat-gold + one coolant-cyan accent (triad is colour-safe; never colour-only — the sail glyph is the shape code). Materials: cast glass, gold foil, steam. Sound: kettle-whistle whoosh; glass *ping* as it cools. Motion verbs: *skip, lance, vent, furl, overshoot.*
- **Identity & counters:** the tempo–dodge civilization — strong against attack chains (deflect culture) and baiting; weak against hand-economy pressure (🧲 discard-down, 🤝 requisition — small fast hands overheat fast). Future rivalries: Jupiter Stormkin (amplify vs deflect — elemental opposites), Saturn Ring Corsairs (hoarders vs spendthrifts). After Flare Skip burns, they're visibly just fast — the counter is patience.

## Passive specialities — brainstorm (D-035 PROPOSED — no code yet)

**Gábor's concept (2026-10-25):** beyond the once-per-match **active** power, each civilization could carry a small **always-on passive speciality** — a constant thematic modifier, not an extra card. "For example, one of the races has a special ability because they are closer to technology, so when they are hit by technology they are not as affected. Of course affected, just a bit less than the others. Or another one, since they live close to the sun, can handle sunbursts better." Rules: brainstorm first, paste in only what fits the gameplay.

**Proposed framework amendments (passives would be held to these):**

1. **One passive per civ, max** — the active stays the headline; the passive is flavor you can *feel*, not a second power system.
2. **Pure discounts on existing effects** — no new mechanics, only ±1 / percentage tweaks on effects that already exist (sim-expressible, zero new vocabulary).
3. **Small by construction** — worth ≤ roughly half a card over a whole match. Actives can be baited once; passives never turn off, so they must be weaker than any active.
4. **Thematically obvious** — guessable from the planet alone (Mercury = heat, Saturn = hoard, Neptune = knowing…).
5. **Vanilla untouched** — passives ride the opt-in `factions` layer; classic seats identical (all pre-existing tests stay green, the D-029/D-031/D-033 proof pattern).

**Two candidate families (pick one, or a deliberate mix — open):**

- **A. Card resistances** (Gábor's examples): each civ shrugs a little at one named card family — ☿ shrugs at ☀️/Fury, ♀ at 🤝 (talks her way out), ♂ at ⚡ (grounds it), ♃ at ☄️ (eats storms), ♅ at 🧲 (ice doesn't snag)… Risk: quietly nerfs those cards whenever that civ is seated — the sim must watch per-matchup card values. Typical shapes: ⚡ discards 1 fewer (min 1) / 🧲 keep +1 / 🤝 they see your hand first (info, not immunity).
- **B. Body modifiers** (constant small boons): 🌍 scrap-peek shows 2 cards (jury rigging) · ♆ 🔭 shows 4 · ♃ keeps 4 vs 🧲 · ☿'s contained ☀️ adds no Fury (the Sun barely surprises them)… Risk: harder to *feel* at the table, easier to balance.

**Open slots (need ideas that don't overlap the actives):** ♄ (theft-protection is already Ringwall — maybe salvage/economy?) · ♅ (re-aiming is already Tilt — maybe ❄️/cold-adjacent?) · ♂ (rust economy — something discard-pile flavored that isn't Salvage Run).

**Gate before any of this becomes real:** a faction-seated sim config in `run-sim` (the seats exist — they're opt-in) comparing win-rate spread vs vanilla per player count, plus Gábor's sign-off per civ. Nothing enters the engine from this section until then.

## Casting rules (from brief)

No plain humans in coloured suits (Earth excepted); no grey/green alien clichés; not every faction an animal with accessories; each civ flexible enough to carry expansions.

## The Sun & small bodies

The Sun = chaotic environmental antagonist (never playable). Moons, Pluto, comets, asteroids: expansion fuel — neutral characters, hazards, locations, non-player factions (P2+ ideas welcome; nothing committed).

## Change log

- v0.7 (2026-10-25): faction layer **v3** (D-032 signed off → **D-033**) — 🌍 Kit Bash, ♄ Ringwall, ♅ Axial Tilt, ♆ Deep Sight implemented in engine+app+bots with three implementation rulings (§v3); **all eight civilizations playable**. 18 new tests (`engine-faction-v3.test.ts`, 93 total green); sim clean. §Passive specialities brainstorm opened (D-035 — proposed, no code). PT-01/02 human playtests re-gated on the online version (D-034).
- v0.6 (2026-10-25): **all eight civilizations deep-designed** (D-032) — the four outer civs get full Codex sheets + power designs (🌍 Kit Bash, ♄ Ringwall, ♅ Axial Tilt, ♆ Deep Sight — PROPOSED, awaiting sign-off); the four playable sheets deepened (+wells, +facts, expanded-lore paras). Setup gets a functional tidy (not the P3 art pass).
- v0.5 (2026-10-25): faction layer **v2** (D-031) — ♀ Court Favor, ♂ Salvage Run, ♃ Storm Shout implemented in engine+app+bots alongside ☿; four of eight civilizations playable. Deep sheets for all four playable civs live in the in-app Codex (data-driven `Sheet[]`). 11 new tests (`engine-faction-v2.test.ts`, 75 total green).
- v0.4 (2026-10-25): D-028 **ADOPTED** (Gábor sign-off). Flare Skip implemented in engine+app as an opt-in per-seat layer (D-029; framework rule 6 amended for the pilot); solo-vs-AI pretest defined as PT-F1 (`docs/08`). The bible is now readable on the game screen as the in-app **Codex** (D-030).
- v0.3 (2026-10-25): P2 design lane opened (D-027). Added faction-power framework + Reactor Charge re-evaluation menu; Mercury pilot (The Flareskips) deep-drafted against the full checklist. All PROPOSED (D-028) pending Gábor's sign-off; implementation gated on PT-01/02.
- v0.2: stub created — 8-civ direction table, per-civ checklist, casting rules.
