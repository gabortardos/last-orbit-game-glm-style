# 04 — Card Catalogue v0.3 (2026-10-25)

52 fixed cards + N−1 Solar Ruptures (46 actions after the v0.3 sim-gate trim, D-019). Text below is the **canonical card text** (one sentence per rule, per Pillar 3).

## Catastrophe

| Count | Card | Text | Design note |
|---|---|---|---|
| N−1 | ☀️ **Solar Rupture** | *When you draw this, reveal it immediately. If you cannot play a Containment Field, your flagship is disabled: discard your hand; you are out of the Rally.* | The Sun's tantrum. Count always public. |

## Survival

| Count | Card | Text | Design note |
|---|---|---|---|
| 6 | 🛡️ **Containment Field** | *When you draw a Solar Rupture, play this instead of being disabled. Seal the rupture, then secretly reinsert it into the deck (within the allowed depth if Sun Fury is on). This cannot be overridden.* | 1 per captain at start; leftovers in deck (ledger #13). Mandatory play (E-5). |

## Actions

| Count | Card | Text | Note |
|---|---|---|---|
| 5 | 📡 **Comms Override** | *Play immediately when another captain plays a card or pair: cancel it. An Override can cancel an Override. Cannot cancel a Solar Rupture or a Containment Field.* | The table-shout, digitized. |
| 2 | ↪️ **Deflector** *(v0.3)* | *Play this when you are the target of an attack: send it at any other captain instead — and it grows (⚡ discards +1 card, 🧲 keeps 1 fewer; theft only moves). Once per captain per chain; one Override kills the whole chain.* | Uno-style escalation (D-018): pass the problem forward, bigger. |
| 4 | 🚀 **Forced Flyby** | *End your turn(s) without drawing. The next captain owes 2 turns, plus every turn you still owed. Misery travels with interest.* | Debt cap 6. |
| 4 | 🔥 **Emergency Burn** | *Immediately end one of your turns without drawing.* | Vs a 2-turn debt, burns one turn only. |
| 3 | 🔭 **Deep-Space Scan** | *Privately look at the top 3 cards of the deck, in order.* | Digital = perfectly private. Trimmed 4→3 (D-019). |
| 2 | 🌀 **Gravity Slingshot** | *Shuffle the deck thoroughly.* | Panic button. Trimmed 3→2 (D-019). |
| 4 | 🤝 **Emergency Requisition** | *Choose a captain: they must give you 1 card of their choice from their hand.* | Giver chooses (D-002) — kinder, funnier. |
| 2 | 🪝 **Boarding Party** | *Choose a captain: steal 1 random card from their hand.* | The explicit, punchable version of theft. |
| 2 | ⚡ **Ion Surge** *(v0.3)* | *Choose a captain: they jettison 1 RANDOM card from their hand — destroyed, not stolen.* | Destruction axis (D-016); scales with Deflectors. |
| 2 | 🧲 **Tractor Snag** *(v0.3)* | *Choose a captain: they discard down to 3 cards — their choice of what to lose.* | Anti-hoarding (D-016); keep-count drops with Deflectors. |
| 2 | ↔️ **Course Reversal** | *Reverse the direction of play, then end your turn without drawing. (With 2 captains: this only ends your turn.)* | New; no reference counterpart. |
| 2 | ♻️ **Salvage Operation** | *Take any card except a Solar Rupture or a Containment Field from the discard pile into your hand.* | Simplified combo #10. |

## Draw-step events (v0.3)

| Count | Card | Text | Note |
|---|---|---|---|
| 2 | ☄️ **Micrometeoroid Storm** | *When you DRAW this: jettison 1 card of your choice (the Storm is discarded too). Never enters your hand; an empty hand shrugs it off.* | Equal-weight danger (D-015 A). |
| 2 | 🌟 **Solar Wind** | *When you DRAW this: immediately draw 1 extra card. In hand it does nothing — but pads against 🧲 and thieves.* | Equal-weight opportunity (D-015 A); chains (E-13). |

## Components (bluff layer — D-001)

| Count | Card | Text |
|---|---|---|
| 4 | ❄️ **Coolant Cell** | *Alone: SCRAP it as your action — discard it to peek at the top deck card. Play 2 matching Components together: choose a captain and steal 1 random card from their hand.* |
| 4 | 🛠️ **Hull Plating** | *Alone: SCRAP it as your action — discard it to peek at the top deck card. Play 2 matching Components together: choose a captain and steal 1 random card from their hand.* |

## Counts sanity (4 captains)

Dealt: 16 cards + 4 Containments. Deck: 46 − 16 dealt + 2 leftover Containments + 3 Ruptures = **35 cards**, 55 in play total. Rupture density 3/55 ≈ 5.5% (v0.2: 6.4%) — match length holds at 13.0 min median (sim v0.3, post-trim).

## Excluded from v0.2 (deliberate)

Three-of-a-kind naming · five-card salvage combo · faction powers · Reactor Charge · real-time reaction timers (hotseat) · any "look at another hand" effects.

## Open card-level questions

1. Is ×2 Salvage too strong (contested-discard metagame)? Sim + PT-01.
2. Are ×4 Scans too info-rich? Sim hoarding metric.
3. Do Components need a third type at 4–5 players (texture)? PT-02.
4. Boarding vs Component-pair overlap: does Boarding earn its slot? Sim usage rates.
