# 02 — Core Game Proposal (v0.2, 2026-10-25)

Includes the session-1 assessment requested by the master prompt, updated for Gábor's creative mandate.

## 1. Concept assessment

**Verdict: strong basis — proceed.** The shrinking-deck risk loop is proven fun (reference: 2–5 players, 15 min, mass-market hit); our additions (Sun-as-villain fiction, Sun Fury escalation, Derelict inclusion, digital enforcement) attack the reference's actual weaknesses (downtime, rules arguments, flat endgame) rather than decorating its strengths. Risk of "clone perception" is real and managed by: original fiction, new signature systems, original art/vocabulary, and mechanics divergences (interest-bearing flybys, fury-limited reinsertion, salvage, reversal).

## 2. Five greatest design opportunities

1. **The Sun as a shared villain.** The reference has no fiction. Ours has an antagonist whose tantrum *is* the difficulty curve — instant theme-mechanics unity.
2. **Escalation architecture (Sun Fury).** Guarantees every match ends at maximum tension instead of dribbling out.
3. **Digital-native rules.** Reaction windows, debt tracking, private scans — the app makes the reference's most-argued rules un-arguable. This is a product moat, not just polish.
4. **Faction layer with real planetary personality** (8 civilizations) — replayability and merch-able characters without touching the core loop.
5. **Spectacle serving clarity.** The reinsert decision ("where do you hide the rupture?") visualized cinematically; the Sun visibly raging as Fury rises; Derelict drones circling. Cool graphics *and* state readability — see `06-visual-audio-direction.md`.

## 3. Five greatest risks (and mitigations)

1. **Clone perception / IP drift** → original everything, divergent mechanics, ledger documents derivations honestly.
2. **Eliminated-player downtime** → Derelict module; sim measures gap; match length cap target.
3. **2-player fragility** → defined 2p behaviors (Reversal = Burn), dedicated sim config, PT-05 gate.
4. **Chain overload** (flyby debt + override stacks) → engine caps debt at 6; reaction window resolves deterministically; watch chain metrics in sim.
5. **Randomness > agency** ("died with no Containment") → survival-card economy identical to the proven reference; Salvage/Scan increase planning; comeback metric tracked in every playtest.

## 4. The improved core loop (v0.2)

**Match setup (N = 2–5):**
1. Remove Ruptures & Containments; shuffle the rest; deal **4 cards each**.
2. Deal **1 Containment Field each** (hand of 5).
3. Insert **N−1 Ruptures** and the leftover Containments; shuffle → the shared deck.
4. Random start captain; play proceeds clockwise (direction matters: Course Reversal exists).

**A turn:**
1. **Command Phase** — play any number of action cards (or none). Every action passes through a **reaction window** (Comms Overrides possible; Derelict Final Transmissions too, if module on).
2. **Draw** — end the turn by drawing. Rupture? Contain (auto-play your Containment, Fury +1, secretly reinsert within the allowed depth) or go dark. Safe card? Into your hand, next captain.

**Turn-ending without drawing:** Emergency Burn (ends one turn), Forced Flyby (ends your turns, next captain owes 2 + your remaining debt), Course Reversal (flip direction, then end one turn).

**Elimination:** drawing a Rupture with no Containment disables your flagship — hand discarded, you're out (→ Derelict if module on). Last flagship flying wins. Deck-empty edge: discard pile reshuffles.

**Modules (each toggleable, tested separately):**
- **Sun Fury** (PT-03): 0–5 public track; +1 per containment; depth limit = anywhere / 15 / 10 / 7 / 5 at Fury ≤1 / 2 / 3 / 4 / 5.
- **Derelict Interference** (PT-04): each eliminated captain holds one **Final Transmission** — a free Comms Override usable in any reaction window, once ever.

## 5. What is deliberately excluded from v0.2

Faction powers, Reactor Charge (deferred — see `05`), three-of-a-kind naming, five-card salvage combo, any real-time timers in hotseat (pass-and-play resolves windows by explicit pass), monetization, visual design commitments beyond the brief.

## 6. Why this will be fun in digital form (product argument)

Pass-and-play prototype (P1) already delivers: automatic legality, hidden info done right, owed-turn HUD, private scan modals, metrics logging no human scorekeeper could produce. Online multiplayer (P4) adds the real table-talk energy: reaction countdowns, Derelict spectators with emotes + one sting.
