# 16 — Playtest Kit: print & run (v0.3, 2026-10-25)

Zero-prep kit for PT-01/PT-02. **Instrument (D-026):** the **v0.3 core deck, modules OFF** (no 🌞 Sun Fury, no 🛰️ Derelicts) — exactly what the hotseat app serves with both toggles off, and exactly what the sim's "vanilla" rows measure. Two ways to run it:

- **App (preferred, accurate metrics):** one laptop/tablet, `npm run dev` → http://localhost:5173, pass-and-play with privacy gates. Export at game over.
- **Paper (backup / table feel):** print §3, cut 54 cards + 2 aid cards. Divergence accepted: on paper, 📡 Overrides are **real-time shouts** (the facilitator calls the window closed) instead of the app's explicit window — note any arguments this causes, that's data (EK lesson #1).

## 1 · Facilitator run sheet

**Before (2 min):** 3 captains (PT-01) around one screen or the cut deck; appoint a facilitator (may also play); phone timer visible for downtime notes only.

**Teach-in script — read aloud, ~4 min (goal: nobody needs the rules doc):**
1. *Premise (verbatim):* "You are rival captains in the **Grand Solar Rally** — a celebrity race around the inner solar system. The route makes one final pass close to the Sun, right as solar activity spikes. The Rally organisers, famously indifferent to survival rates, have declared: *whoever is still flying at the end, wins.* You are never killed — a disabled flagship is towed home in disgrace. The fiction is rude, not grim."
2. *The loop:* "On your turn: play any number of action cards — or none — then **end your turn by drawing one card**. That draw is the whole game: the deck hides **2 Solar Ruptures** (for 3 of us) and 3 leftover Containment Fields."
3. *The catastrophe:* "Draw a ☀️: reveal it instantly. Hold a 🛡️ → it spends itself, you survive and **secretly reinsert** the ☀️ into the deck — make them find it again. Hold none → you're out; your hand is discarded."
4. *The shout:* "Before anything resolves, anyone may slam 📡 **Comms Override** to cancel it. Each 📡 flips the outcome back — odd number of 📡s = cancelled. An Override can cancel an Override. Nothing cancels a ☀️ reveal or a 🛡️."
5. *The bounce:* "If you're the target of an attack and hold ↪️ **Deflector**, send it at anyone else — bigger: ⚡/🧲 hit +1 per hop. Once per captain per chain; one 📡 kills the whole chain."
6. *Everything else is rudeness, one line each:* 🚀 next captain owes 2 turns + your debt · 🔥 skip your own draw · 🔭 peek top 3 · 🌀 shuffle everything · 🤝 they give, they choose the card · 🪝 steal 1 random · ⚡ destroy 1 random · 🧲 discard down to 3 · ↔️ reverse direction, skip your draw · ♻️ take any discard · ❄️🛠️ two-of-a-kind steal, a lone one scraps for a peek.
7. *Close:* "Deck counting is legal and encouraged. Last flagship flying wins. Questions as they happen — play!"

**During (tick as they occur, verbatim quotes are gold):**
- [ ] First rules question: ______ at min ___
- [ ] Confusion moments (what was said): ______
- [ ] First elimination: turn ___ · who ___ · table reaction ___
- [ ] Eliminated-player downtime: complaints? doing what? ______
- [ ] 📡 / ↪️ moments: laughter / arguments / silence? ______
- [ ] Did anyone count the deck aloud? Did knowledge change an action? ______

**After (5 min):**
1. Ask verbatim, 1–5 each: **Fun · Tension · Clarity · Agency · Humour · Would-replay.** Plus free-text: **"funniest moment?"**
2. App runs: game-over modal → **⬇︎ Export metrics JSON** → save as `PT-01-<A/B/C>-<yyyymmdd>.json` → archive under `docs/balance/raw/` (create folder on first export, docs/08).
3. Same day: append the session to `docs/09` (template there). Decisions → `docs/11`.
4. Verdict (PT-01): **pass** fun ≥4 & clarity ≥4 & replay ≥4 for ≥2 of 3 · **revise** any metric 3–3.5 · **reject** fun <3 → core-loop redesign.

## 2 · Paper-mode rulings (only where paper differs)

| Moment | Paper ruling |
|---|---|
| 📡 window | Real-time shout before resolution; facilitator counts aloud and closes the window ("comms closed"). Odd = cancelled. |
| ↪️ Deflector | The *current target* plays it face-up, names the new target, moves the payload token (+1 ⚡ discards / −1 🧲 keeps per hop; theft never grows; cap +3). |
| 🔭 Scan / lone-❄️ peek | Reader lifts the top cards privately; honour system (same as hotseat privacy gates). |
| 🛡️ reinsert | Survivor reinserts under the table; deck height must not change. |
| Empty deck | Reshuffle the discard (ruptures/🛡️s stay wherever they are); if both empty, skip the draw (E-1). |
| Modules | OFF — reinsert anywhere; eliminated captains simply watch (that downtime is the thing PT-01 measures). |

## 3 · Cut sheet — 54 cards (3 captains) + 2 aid cards

Print, cut along the boxes, sleeve over any spare cards for feel. Card text is the canonical catalogue wording (`docs/04`).

**☀️ Solar Rupture ×2**
> ☀️ **SOLAR RUPTURE** — *When you draw this, reveal it immediately. If you cannot play a Containment Field, your flagship is disabled: discard your hand; you are out of the Rally.*

**🛡️ Containment Field ×6**
> 🛡️ **CONTAINMENT FIELD** — *When you draw a Solar Rupture, play this instead of being disabled. Seal the rupture, then secretly reinsert it into the deck. This cannot be overridden.*

**📡 Comms Override ×5**
> 📡 **COMMS OVERRIDE** — *Play immediately when another captain plays a card or pair: cancel it. An Override can cancel an Override. Cannot cancel a Solar Rupture or a Containment Field.*

**↪️ Deflector ×2**
> ↪️ **DEFLECTOR** — *Play when you are the target of an attack: send it at any other captain instead — and it grows (⚡ discards +1 card, 🧲 keeps 1 fewer; theft only moves). Once per captain per chain; one Override kills the whole chain.*

**🚀 Forced Flyby ×4**
> 🚀 **FORCED FLYBY** — *End your turn(s) without drawing. The next captain owes 2 turns, plus every turn you still owed.*

**🔥 Emergency Burn ×4**
> 🔥 **EMERGENCY BURN** — *Immediately end one of your turns without drawing.*

**🔭 Deep-Space Scan ×3**
> 🔭 **DEEP-SPACE SCAN** — *Privately look at the top 3 cards of the deck, in order.*

**🌀 Gravity Slingshot ×2**
> 🌀 **GRAVITY SLINGSHOT** — *Shuffle the deck thoroughly.*

**🤝 Emergency Requisition ×4**
> 🤝 **EMERGENCY REQUISITION** — *Choose a captain: they must give you 1 card of their choice from their hand.*

**🪝 Boarding Party ×2**
> 🪝 **BOARDING PARTY** — *Choose a captain: steal 1 random card from their hand.*

**⚡ Ion Surge ×2**
> ⚡ **ION SURGE** — *Choose a captain: they jettison 1 RANDOM card from their hand — destroyed, not stolen.*

**🧲 Tractor Snag ×2**
> 🧲 **TRACTOR SNAG** — *Choose a captain: they discard down to 3 cards — their choice of what to lose.*

**↔️ Course Reversal ×2**
> ↔️ **COURSE REVERSAL** — *Reverse the direction of play, then end your turn without drawing.*

**♻️ Salvage Operation ×2**
> ♻️ **SALVAGE OPERATION** — *Take any card except a Solar Rupture or a Containment Field from the discard pile into your hand.*

**☄️ Micrometeoroid Storm ×2**
> ☄️ **MICROMETEOROID STORM** — *When you DRAW this: jettison 1 card of your choice (the Storm is discarded too). Never enters your hand.*

**🌟 Solar Wind ×2**
> 🌟 **SOLAR WIND** — *When you DRAW this: immediately draw 1 extra card. In hand it does nothing — but pads against 🧲 and thieves.*

**❄️ Coolant Cell ×4 / 🛠️ Hull Plating ×4**
> ❄️ **COOLANT CELL** / 🛠️ **HULL PLATING** — *Alone: SCRAP it as your action — discard it to peek at the top deck card. Play 2 matching together: choose a captain and steal 1 random card from their hand.*

**Aid card A (table centre) — THE LOOP**
> **Your turn:** play any number of action cards (or none) → **end by drawing 1 card**. ☀️ drawn = reveal: 🛡️ auto-seals (reinsert secretly) · none = you're out. Deck count is public — counting is legal.

**Aid card B — REACTIONS**
> 📡 **anyone, before resolution** — each 📡 flips the outcome; odd = cancelled; 📡 cancels 📡; nothing cancels ☀️/🛡️. ↪️ **target only** — send the attack elsewhere, ⚡/🧲 grow +1 per hop; once each per chain.

**Paper setup (3 captains):** shuffle the 46 base cards → deal **4 each** → everyone takes **1 🛡️** (3 of the 6) → shuffle the remaining 34 with the last 3 🛡️ + 2 ☀️ → that's the deck. **54 cards total; deck starts at 39.** (N captains: N−1 ☀️s, always 6 🛡️s.)

*Kit matches `BASE_DECK` v0.3 (46) + `CONTAINMENT_COUNT` (6) + N−1 ruptures exactly — `packages/game-core/src/cards.ts` is the source of truth.*