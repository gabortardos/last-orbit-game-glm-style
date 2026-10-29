# 15 — v0.3 Expansion Sketch: Dangers & Opportunities (PROPOSED — awaiting Gábor's pick)

Born from PT-00 round 3 (2026-10-25): *more dangers, and as absolutely equal other opportunities — but keep integrity, gameplay flow and joy.*

## Guardrails (what "integrity" means here)

1. **One lethal draw-threat only.** ☀️ Solar Rupture stays the only card that eliminates on draw. Multiple kill-card types dilute dread and slow resolution (reference-genre lesson).
2. **Every danger is answerable** — by a choice, a held card, or an Override window. No "lose and watch" effects.
3. **Fits existing ceremony.** Resolves inside the draw step or a normal play. No new phases, no new screens.
4. **Symmetry.** Each danger ships with an opportunity of equal deck-weight — luck must swing both ways.
5. **Sim-gated.** Any candidate runs through 2×3,000 bot games before humans see it: seat fairness, match length and elimination spread must stay within noise of the v0.2 baseline.

## Candidate Pair A — draw-step friction (recommended)

- ☄️ **Micrometeoroid Storm** (danger, ×2): *When you draw this: discard 1 card of your choice, then put the Storm in the discard pile.* Hurts, never kills; empty hand = nothing (fizzle). Depletes the deck → endgame ruptures arrive sooner. Gives lone Components a defensive decision (sacrifice them first).
- 🌟 **Solar Wind** (opportunity, ×2): *When you draw this: immediately draw 1 extra card.* Card advantage; chains — including into a ☀️ (tension spike). Symmetric 2/2 weight with Storm.

Cost: ~zero new UI (draw reveal already exists — both cards show there), one new branch in the draw step. Deck 44 → 48.

## Candidate B — component density (fixes PT-00 confusion)

Components were "never met / couldn't use" in solo play. UI hint added same day ("· find its twin"). Structural option: raise ❄️/🔩 from 2+2 to 3+3 copies (deck 48 → 52 with Pair A) so pairs actually assemble. Sim-verifiable (pair-play rate, steal count).

## Deferred (complexity budget — revisit with P2 factions)

- Attach-style dangers (e.g. Radiation Leak: "while attached, you draw 2") — new state + new UI.
- Board/pile hazards (Debris Field on the discard pile) — spatial scope creep.
- Faction-flavored dangers/opportunities — exactly what the 8-civilization layer is for.

## Proposed path

1. Gábor picks: **(a)** Pair A only · **(b)** Pair A + component density · **(c)** other direction / veto.
2. Implement → 28+ tests extended → sim gate (doc 10 deltas) → solo-vs-AI feel test.
3. If clean → freeze into rules v0.3 for PT-01 with friends.
