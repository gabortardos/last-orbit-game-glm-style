# 15 — v0.3 Expansion Sketch: Dangers & Opportunities (PROPOSED — awaiting Gábor's pick)

Born from PT-00 round 3 (2026-10-25): *more dangers, and as absolutely equal other opportunities — but keep integrity, gameplay flow and joy.*

## Guardrails (what "integrity" means here)

1. **One lethal draw-threat only.** ☀️ Solar Rupture stays the only card that eliminates on draw. Multiple kill-card types dilute dread and slow resolution (reference-genre lesson).
2. **Every danger is answerable** — by a choice, a held card, or an Override window. No "lose and watch" effects.
3. **Fits existing ceremony.** Resolves inside the draw step or a normal play. No new phases, no new screens.
4. **Symmetry.** Each danger ships with an opportunity of equal deck-weight — luck must swing both ways. *(Applies to the **luck axis**: draw-step dangers. For the **agency axis** — cards played *at* someone — the counterweights are Override parity, the victim's own counterplay, and hand-slot opportunity cost: every attack card held is not a 🛡️.)*
5. **Sim-gated.** Any candidate runs through 2×3,000 bot games before humans see it: seat fairness, match length and elimination spread must stay within noise of the v0.2 baseline.
6. **Nasty-but-never-fatal, and fun to sit through.** Mischief hurts, it never eliminates; the victim should always understand what happened and get a revenge path (Override today, Final Transmission later).

## Candidate Pair A — draw-step friction (recommended)

- ☄️ **Micrometeoroid Storm** (danger, ×2): *When you draw this: discard 1 card of your choice, then put the Storm in the discard pile.* Hurts, never kills; empty hand = nothing (fizzle). Depletes the deck → endgame ruptures arrive sooner. Gives lone Components a defensive decision (sacrifice them first).
- 🌟 **Solar Wind** (opportunity, ×2): *When you draw this: immediately draw 1 extra card.* Card advantage; chains — including into a ☀️ (tension spike). Symmetric 2/2 weight with Storm.

Cost: ~zero new UI (draw reveal already exists — both cards show there), one new branch in the draw step. Deck 44 → 48.

## Candidate B — component floor use (fixes PT-00 confusion; **revised round 4**)

Fact check (round 4): the deck already carries **4 ❄️ + 4 🔩** (8 of ~47 cards ≈ 17%) — the original "raise 2+2 → 3+3" idea was a miscount, and density was never the problem. Bots assemble pairs fine (~1.1 pair-plays/game in sims). Why a human fired zero in solo: a **lone Component is dead weight that bot Requisitions strip first** (their GIVE_ORDER hands Components over before anything else), and a pair needs both twins in one hand across several turns of theft pressure.

Fix direction — give a **lone Component a floor use** so it's never a pure dead card:

- 🔧 **Scrap** (leading option): *Play a single Component as your action: discard it to view the top card of the deck (privately).* Cheap, thematic (strip the part for parts), feeds the scan/burn/dodge loop, and makes every drawn Component a real choice: info now vs. pair-steal later.
- Alternative (pairs naturally with Candidate C): *When an effect forces you to discard at random (⚡ Ion Surge), you may discard a Component instead.* Turns Components into partial insurance — more decision, more to remember.

Sim-verifiable: lone-Component scrap rate, pair-play rate, burn-after-scrap rate.

## Candidate C — mischief: nasty-but-never-fatal (Gábor's note, PT-00 round 3)

> "Players love when they can be tricky and — in a positive way — be nasty with each other."

v0.2 nastiness is all theft (Boarding, Requisition, pairs) or turn-skipping (Flyby). The gap: **destruction and harassment** — pain that doesn't profit the attacker, it just hurts the victim. Different economy, meaner feeling, and it makes holding a big hand risky.

- ⚡ **Ion Surge** (×2): *Play: target captain discards 1 random card from their hand.* Pure spite — the card is destroyed, nothing comes to you. Non-fatal, Overrideable, one log line, empty hand fizzles. Random = maximum " positively nasty" spice.
- 🧲 **Tractor Snag** (×2): *Play: target captain discards down to 3 cards (their choice).* The anti-hoarding tool — the watch-list already flags Scan/Containment hoarding as a risk; this is the in-fiction answer. Their choice → answerable, less feel-bad than Ion Surge, fun to watch ("what do they give up?").
- No luck-axis counterpart needed: these are agency-axis (see guardrail 4) — Override parity is the counterweight, and both feed the revenge fantasy (Derelicts module turns every victim into a later ghost signal).

**Deck math warning (corrected round 4):** at 4 captains the deck is ~47 cards (38 base + 6 🛡️ + 3 ☀️). The full menu (A +4 cards, C +4 cards; B adds 0 if Scrap reuses existing Components) takes it 47 → 55 and dilutes rupture density 6.4% → 5.5%. Rule: if the sim gate shows projected match length creeping past ~15 min, **substitute** rather than add (candidate trims: −1 Gravity Slingshot, −1 Deep-Space Scan — both high-copy action cards).

**Deferred mischief (revisit with factions):** 📡 Signal Jamming (peek at a hand + lock one card type for a turn — needs per-player restriction state) · 🎯 Targeting Toll (pay 1 card to act next turn) · taker-chooses theft (rejected at D-002 as too swingy).

## Deferred (complexity budget — revisit with P2 factions)

- Attach-style dangers (e.g. Radiation Leak: "while attached, you draw 2") — new state + new UI.
- Board/pile hazards (Debris Field on the discard pile) — spatial scope creep.
- Faction-flavored dangers/opportunities — exactly what the 8-civilization layer is for.

## Proposed path

1. Gábor picks a menu item: **(a)** A only · **(b)** A+B · **(c)** A+C · **(d)** A+B+C · **(e)** veto / other direction.
   Staging recommendation if undecided: ship **(b)** first (sim-gated), then C as a second wave after solo-vs-AI feel tests — one new axis at a time keeps cause-and-effect readable in playtests.
2. Implement → 28+ tests extended → sim gate (doc 10 deltas) → solo-vs-AI feel test.
3. If clean → freeze into rules v0.3 for PT-01 with friends.
