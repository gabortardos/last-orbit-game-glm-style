# 01 — Mechanics Ledger (v0.2, 2026-10-25)

Format per row: **reference mechanic** → why fun/necessary → weaknesses → retain? → our implementation (v0.2) → open balance questions. Reference behavior summarized from `reference/exploding-kittens-notes.md`.

| # | Reference mechanic | Why fun / necessary | Weaknesses | Verdict | Our implementation (v0.2) | Open questions |
|---|---|---|---|---|---|---|
| 1 | Play any number, then draw to end turn | Creates a bluff-rich "stop before the cliff" rhythm; draw = self-inflicted risk | Can encourage timid "play nothing, pray" turns | **Retain** | Identical structure: Command Phase → Draw ends turn | Is pass-turn frequency too high? (sim tracks it) |
| 2 | Fatal cards = players − 1 | Guarantees exactly one survivor; math scales itself | None material | **Retain** | N−1 Solar Ruptures | — |
| 3 | Survival card + secret reinsertion | The signature delicious decision: where do you doom someone? Kingmaking, revenge loops | Skill gap (newbies reinsert shallow); info imbalance | **Retain (core)** | Containment Field; reinsert anywhere by default; **Sun Fury module shrinks allowed depth as the Sun enrages** | Does fury depth 5 feel fair? (PT-03) |
| 4 | Real-time cancellation, cancellable itself | Table-shout drama; social reading | Most-argued rule in the reference; loud players dominate | **Retain, digitized** | Comms Override in an explicit **reaction window** (all eligible players pass/respond; app enforces resolution) | Window length online (6s?) — Phase 4 |
| 5 | Turn-debt attack (2 turns), passes along | Pressure + chain comedy | Debt arithmetic confusion; victim frustration in casual groups | **Retain, clarified + spicier** | Forced Flyby: "next captain owes 2 turns **plus every turn I still owed**" — debt travels with interest, one sentence, app tracks it | Can debt chains exceed fun? Cap at 6 in engine for v0.2 (observed) |
| 6 | Skip ends one turn w/o drawing | Cheap, clean avoidance | Dead card late | **Retain** | Emergency Burn (one per owed turn) | Count 4 vs 3? (sim usage) |
| 7 | Forced gift (giver chooses) | Social friction, negotiation face | Swingy early, weak late | **Retain** | Emergency Requisition, giver chooses (D-002) | — |
| 8 | Blank pairs steal random (bluff layer) | Hands get texture; bluffing about nothing | New players hoard blanks forever | **Retain (D-001)** | 8 Component cards (Coolant Cell ×4, Hull Plating ×4); matching pair = steal 1 random card | Are 2 component types enough texture? (PT-02) |
| 9 | Three-of-a-kind names a card | Rewards hoarding | Rarely resolves; teaches badly | **Defer** | Excluded from v0.2; revisit with faction layer | Revisit in P2 |
| 10 | Five-different retrieves any discard | Big combo payoff | Almost never happens | **Adapt (simplified)** | Salvage Operation: single card retrieves any non-rupture, non-containment discard | Too strong at ×2? (sim + PT-01) |
| 11 | Peek top 3 | Enables planning + gloating | Strongest info card; hoarded | **Retain** | Deep-Space Scan (private, ×4) | — |
| 12 | Shuffle the pile | Panic button vs known doom | Low agency (pure lottery) | **Retain (×3)** | Gravity Slingshot | Fewer copies OK since Salvage can retrieve |
| 13 | Setup scaling + survival-card economy | Fairness; the "extra defuses in deck" lottery is beloved | Random start imbalance | **Retain** | 6 Containment Fields: 1/player at start, rest shuffled in | — |
| 14 | Elimination + last-standing victory; deck counting public | Stakes; deck count = shared tension clock | **Downtime** (worst social flaw); 2p edge cases | **Retain + fix** | Derelict Interference module (one Final Transmission) keeps eliminated players in the story; explicit reshuffle-if-empty edge rule; deck & rupture counts always public | Does Derelict power feel like kingmaking? (PT-04) |

## Ledger-derived deck (v0.2, exact counts)

Rupture ×(N−1) · Containment ×6 · Override ×5 · Flyby ×4 · Burn ×4 · Scan ×4 · Slingshot ×3 · Requisition ×4 · Boarding ×2 · Reversal ×2 · Salvage ×2 · Components ×8 → **44 fixed cards + N−1 ruptures** (full text in `04-card-catalogue.md`).

## New mechanics with no reference counterpart

- **Sun Fury** (signature candidate): +1 public Fury per containment; reinsertion depth limit shrinks (any → 15 → 10 → 7 → 5). Guarantees escalating finale. Analysis: `05-signature-mechanic-analysis.md`.
- **Derelict Interference:** eliminated captains keep one meddling Override (Final Transmission).
- **Course Reversal:** direction flip + ends turn (not in reference base game).
- **Forced Flyby interest:** debt accumulates (+remaining), unlike the reference's flat pass.
