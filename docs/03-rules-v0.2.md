# 03 — Rules v0.3 (2026-10-25)

Canonical. `packages/game-core` implements exactly this document; conflicts = engine bug or doc bug — fix either in the same commit. v0.3 adds the expansion pack (D-015/016/018): draw-step events, Scrap, destruction attacks, and Deflector escalation. v0.2 text is unchanged where not mentioned.

## 0. Components

- 2–5 captains. Shared deck: **52 fixed cards** (46 actions + 6 Containment Fields) + **N−1 Solar Ruptures** inserted at setup (see `04-card-catalogue.md`). Public zones: deck (count visible), discard pile (face up). Private: hands.
- Public information at all times: deck count, ruptures remaining (N−1 minus fatal ones resolved), discard contents, Fury level, each hand size, direction of play, turn debt.

## 1. Setup

1. Remove all Solar Ruptures and Containment Fields; shuffle the remaining 46 cards.
2. Deal 4 cards to each captain.
3. Deal 1 Containment Field to each captain (hands of 5).
4. Insert N−1 Solar Ruptures and the remaining (6−N) Containment Fields; shuffle everything into the shared deck.
5. Random start captain. Play proceeds clockwise.

## 2. Turn structure

A turn has up to two steps:

1. **Command Phase.** The active captain may play **any number** of action cards (or none). Each action resolves through a Reaction Window (§4) before the next may be played. Certain cards end the turn immediately upon resolving (§5).
2. **Draw.** If the turn has not been ended by a card, the active captain draws the top card of the deck; this **ends the turn**.
   - **Safe card** → into hand.
   - **🌟 Solar Wind** → into hand, then **immediately draw 1 extra card** (resolves normally — it can even be a ☀️ or a ☄️; chains stack).
   - **☄️ Micrometeoroid Storm** → never enters your hand: **jettison 1 card of your choice** from your hand (it and the Storm go to the discard pile). Empty hand → the storm passes harmlessly.
   - **Solar Rupture** → reveal it (§6).

A captain with no playable desires may simply draw. Hand size has no cap; an empty hand is legal.

## 3. Turn order & debt

- After a turn ends: if that captain still **owes extra turns**, they take another turn (consume one owed turn); otherwise play passes to the next living captain in the current direction.
- **Forced Flyby** sets turn debt: the next captain owes **2 turns plus every turn the flyer still owed** (interest). Debt is capped at 6 by rule.
- **Emergency Burn** and **Course Reversal** each end **one** turn without drawing; owed turns beyond the current one still come.
- If a captain is eliminated, their remaining debt is cancelled.

## 4. Reaction Window & Comms Override

1. When an action card (or Component pair) is played, it becomes a **pending action**. A window opens for **every other living captain**, in any order.
2. Each eligible captain may **Pass** or play a **Comms Override** (from hand). A **Derelict** (module: on) may instead spend their single **Final Transmission**. Captains with **no possible response** (no Override in hand; not the current target holding an unused Deflector; no armed Final Transmission) are **skipped automatically** — a forced pass carries no decision, so the window never waits on one (D-020).
3. Each Override/Transmission cancels the previous Override. After every eligible captain has passed with no new Override, the stack resolves: **odd number of Overrides → pending action is cancelled** (cards still discarded); **even → action executes**. The window then closes; play continues.
4. **Cannot be overridden:** drawing a card, revealing a Solar Rupture, playing a Containment Field, ending/starting turns. Everything else can.
5. A cancelled action never happens; its targets are not affected. Cards played into the window (actions and Overrides) are always discarded regardless of outcome.
6. **↪️ Deflector (target-only reaction, v0.3).** While a pending action has a target (any attack), the **current target** may play a Deflector from hand instead of passing:
   - Choose **any other living captain**: the attack is redirected at them.
   - Its payload **grows by 1** — ⚡ Ion Surge discards +1 card; 🧲 Tractor Snag lets the new target keep 1 fewer. Theft (🤝/🪝/Component pairs) redirects but **never grows** (D-018).
   - Each captain may deflect **once per chain**; the window reopens for everyone after each Deflector.
   - The attacker is no exception: if a Deflector bounces the attack back at them, they may spend their own Deflector to send it on again (D-022) — they still may never Override their own action.
   - Override parity counts across the whole chain: **one Override cancels the entire chain** — attacker's and deflectors' cards are all spent. Growing the problem gives the table a bigger reason to kill it.

## 5. Card effects (summary — full text in `04-card-catalogue.md`)

- **Forced Flyby** — end your turns without drawing; next captain owes 2 + your remaining debt (max 6).
- **Emergency Burn** — end one of your turns without drawing.
- **Course Reversal** — flip play direction, then end one of your turns without drawing.
- **Deep-Space Scan** — privately view the top 3 deck cards in order.
- **Gravity Slingshot** — shuffle the deck.
- **Emergency Requisition** — chosen captain gives you 1 card **of their choice**.
- **Boarding Party** — steal 1 **random** card from a chosen captain.
- **Salvage Operation** — take any card **except a Solar Rupture or a Containment Field** from the discard into your hand.
- **⚡ Ion Surge** *(v0.3)* — chosen captain **jettisons 1 random card** from their hand to the discard pile (destroyed, not stolen).
- **🧲 Tractor Snag** *(v0.3)* — chosen captain **discards down to 3 cards** (their choice of what to lose). Pointless against a hand of ≤3.
- **🔧 Scrap (lone Component)** *(v0.3)* — play a single Component as your action: discard it to **privately peek at the top deck card** (the card stays).
- **Component pair** (2 matching Components) — steal 1 random card from a chosen captain.
- Stealing/gifting from an empty hand: nothing happens (card still played).

## 6. Solar Rupture resolution

1. **Reveal immediately** upon drawing. This cannot be overridden or avoided.
2. If you hold ≥1 Containment Field, you **must** contain (automatic; no captain ever benefits from dying):
   - Discard 1 Containment Field.
   - **Sun Fury +1** (module on; cap 5).
   - **Secretly reinsert** the Rupture into the deck at any position within the allowed depth: **Fury ≤1 → anywhere; 2 → top 15; 3 → top 10; 4 → top 7; 5 → top 5.** (Module off → anywhere.) Position 1 = top card.
   - Your turn ends.
3. If you hold none: **flagship disabled.** Reveal your hand, discard it; the Rupture leaves the game. You are eliminated (→ Derelict if module on). Your turn ends.
4. If only one captain remains, they win immediately.

## 7. Modules

- **Sun Fury** — as §6.2. Public 0–5 track; +1 per containment; defines reinsertion depth.
- **Derelict Interference** — eliminated captains become Derelicts: they hold one **Final Transmission** (free Override usable in any Reaction Window, once per game). Derelicts cannot win, draw, hold cards, or be targeted.
- **Faction layer (P2 pilot, optional — D-029):** per-seat, off by default (a seat with no faction is a classic captain). ☿ Mercury **Flare Skip**: once per match, when you are the target of an attack, redirect it as if playing ↪️ — paying no card. The payload still grows, §4.6 chain rules and Override parity apply, and the spent power is public.

## 8. Edge cases & rulings

- **E-1 Empty deck at draw:** shuffle the discard pile into a new deck. If the discard is also empty, skip the draw; the turn simply ends.
- **E-2 Reinsert into empty deck:** position 1 (top). The Rupture is the whole deck.
- **E-3 Positions are legal from 1 (top) to min(depth limit, deck length).**
- **E-4 Two captains (N=2):** one Rupture; Flyby debt works normally; **Course Reversal acts as an Emergency Burn** (direction is meaningless).
- **E-5 Containment is mandatory** when held.
- **E-6 Scan with fewer than 3 cards:** view what remains, in order.
- **E-7 Fatal Ruptures leave the game** (never discarded, never salvageable). Played Containments are discarded but **not** salvageable.
- **E-8 A Derelict's Final Transmission** counts toward Override parity like a normal Override.
- **E-9 If a pending Flyby is cancelled**, no debt is created; the initiator's Command Phase continues (their turn did not end).
- **E-10 If a steal/gift target's hand is empty**, the action fizzles (card still played, still discarded).
- **E-11 If a captain is eliminated with debt owed**, that debt is cancelled.
- **E-12 Deck count and rupture count are public and exact.** The app always displays them.
- **E-13 🌟 Solar Wind (v0.3):** the extra draw happens immediately and is consumed by whatever comes next — even a ☀️ (contain normally, then the turn ends) or a ☄️ (jettison, then the turn ends). No draw is ever left owed across turns.
- **E-14 ☄️ Storm against an empty hand** fizzles (Storm discarded, nothing else). The jettison choice cannot be declined — a hit always costs a card if you hold any.
- **E-15 ↪️ Deflector (v0.3):** living targets only (Derelicts cannot deflect); payload growth caps at **+3** per chain; with 2 captains the only legal redirect is back at the attacker — and the attacker may send it right back (a bounce war, D-022) until someone runs out of Deflectors or the cap bites.
- **E-16 🧲 Tractor Snag (v0.3):** fizzles against a hand at or below the keep-count; the victim discards exactly (hand − keep) cards of their choice. Growth lowers the keep-count (3 → 2 → 1 → 0).
- **E-17 ⚡ Ion Surge (v0.3):** fizzles on an empty hand; destruction stops early if the hand empties mid-surge. Jettisoned cards are destroyed publicly (identities visible in the discard).
- **E-18 ☿ Flare Skip (faction pilot, v0.3+):** follows every ↪️ Deflector rule (E-15) except no card is paid and it is once per match per captain; it shares the once-per-captain-per-chain limit with ↪️; a bounced-back attacker may use it (D-022 mirrored); Override parity is unaffected — one 📡 still cancels the whole chain.

## 9. Victory

Last operational flagship wins. (Fiction: disabled, embarrassed, towed home — never extermination.)

## 10. Timing summary

Play card(s) → window → resolve → (turn ended?) → no: play more / draw → yes: next captain (debt first). Draws happen only via §2.2 and never otherwise.

## Change log

- v0.3 faction pilot (2026-10-25): optional per-seat faction layer (D-029) — ☿ Mercury Flare Skip (§7, E-18); classic seats and vanilla configs unchanged (D-030: the civilization bible is readable in-app as the Codex).
- v0.3, round-5 refinements 2 (2026-10-25): a Deflector bounced back at the attacker may be deflected on again by them (D-022 — the code had over-restricted §4.6) · app: the briefing is reachable at any moment via the always-on ❓ (D-023) · audio v3, four new bed layers (D-024).
- v0.3, round-5 refinements (2026-10-25): reaction windows auto-skip captains with no possible response — no forced "let it happen" clicks (D-020) · app: flight log pinned as a side rail, never covered by other windows (D-021).
- v0.3: expansion pack (pick g) — ☄️ Storm + 🌟 Solar Wind draw-step events · 🔧 Scrap floor use for lone Components · ⚡ Ion Surge + 🧲 Tractor Snag destruction attacks · ↪️ Deflector escalation (§4.6, E-13…E-17) · sim-gate trim −1 Scan, −1 Slingshot (D-019) → 46 action cards.
- v0.2: reaction-window formalization; flyby interest rule + cap 6; mandatory containment (E-5); salvage restrictions; reversal-in-2p ruling; reshuffle edge; Sun Fury & Derelict modules.
- v0.1: first draft (master prompt hypothesis).
