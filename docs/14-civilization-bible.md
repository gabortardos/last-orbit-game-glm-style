# 14 — Civilization Bible (v0.4 — Mercury pilot implemented as opt-in layer, D-028/D-029/D-030)

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

## Per-civilization checklist (fill in P2; pilot filled — §Pilot)

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

## Casting rules (from brief)

No plain humans in coloured suits (Earth excepted); no grey/green alien clichés; not every faction an animal with accessories; each civ flexible enough to carry expansions.

## The Sun & small bodies

The Sun = chaotic environmental antagonist (never playable). Moons, Pluto, comets, asteroids: expansion fuel — neutral characters, hazards, locations, non-player factions (P2+ ideas welcome; nothing committed).

## Change log

- v0.4 (2026-10-25): D-028 **ADOPTED** (Gábor sign-off). Flare Skip implemented in engine+app as an opt-in per-seat layer (D-029; framework rule 6 amended for the pilot); solo-vs-AI pretest defined as PT-F1 (`docs/08`). The bible is now readable on the game screen as the in-app **Codex** (D-030).
- v0.3 (2026-10-25): P2 design lane opened (D-027). Added faction-power framework + Reactor Charge re-evaluation menu; Mercury pilot (The Flareskips) deep-drafted against the full checklist. All PROPOSED (D-028) pending Gábor's sign-off; implementation gated on PT-01/02.
- v0.2: stub created — 8-civ direction table, per-civ checklist, casting rules.
