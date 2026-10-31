# 20 — The Living Solar System (visual north star)

**Status:** PROPOSED — decision **D-038**. This is Gábor's ambition captured so it shapes P3+ planning; nothing here is committed work yet. Rungs 2–3 are sequenced post-P5 (same rule as D-037: the game is proven first, then the world).
**Date:** 2026-10-25 · **Owner:** Gábor (creative vision) · Captured from the online-testing feedback session.

## The idea, in Gábor's words (2026-10-25)

> We can have a simple card game, yes. And we can have the card game engine, sitting on a live, animated 3D solar system. […] My ideas were much more sophisticated and grander about the graphics. As it is, I like it for testing the game dynamics, but I wanted to *see the world* (something like in a solar-system explorer) and the races there in their home environment. Then somehow animate the action, the cards, the reactions.

**Translation:** the current glass UI is the *test rig* — keep it, it is honest and fast. The destination is a game that *takes place* in the solar system it is named after.

## Why the architecture already wants this

- The engine (`packages/game-core`) is pure and UI-agnostic: state + commands in, **typed event log out**. Every play, Override, deflection hop, draw, storm and rupture is already a log entry — exactly the feed an animation director needs. No engine changes required to drive a 3D scene.
- The authoritative server (D-036) syncs per-seat snapshots; a 3D client is just another renderer of the same snapshots.
- Deterministic seeds mean a whole match can be replayed — cinematics, intro/outro, "how I died" replays are free.
- The eight civilizations already have home planets by construction (Mercury…Neptune): **seats are planets, the table is the solar system**, the Sun's mood is the Sun Fury meter.

## The ladder (each rung shippable; every rung runs the same engine)

- **Rung 0 — today's glass UI.** The tactical/test view. Stays forever (also the low-end/reduced-motion fallback).
- **Rung 1 — the living table (this is P3, plus one step).** A three.js/react-three-fiber scene *behind* the current 2D-glass cards: the Sun breathes with Fury level; seats are orbiting planets; the log animates as light between orbits (a steal = a cable/tractor beam between two orbits; an Override = a jam wave from a third planet; a rupture = a solar flare; a deflection = the beam bouncing). Reduced-motion variants mandatory.
- **Rung 2 — homeworlds.** The Codex becomes a 3D vignette per civ (Mars' rust markets, Venus' cloud courts, Saturn's ring choirs…), art-directed style frames first; per-faction card backs / hero art.
- **Rung 3 — world mode.** Play *inside* the system: viewpoint rides your flagship; actions are physical (a boarding party launches, flies, grapples); reactions are comm lasers between ships. The flat card UI survives as an overlay "tactical mode".

## Guards (what keeps this from killing the game)

1. **Readability outranks spectacle** — the P3 gate "state readability sign-off" applies to every rung; a scene that hides whose turn it is fails, however pretty.
2. **The engine never depends on the renderer** — 3D is a view, not a mechanic; the sim and rules tests must not know it exists.
3. **Mobile/low-end tiers** — quality presets, fallback to the glass UI; a phone must still play.
4. **Scope sequencing** — rung 1 folds into P3 after the rules freeze; rungs 2–3 wait for the P5 gate ("once it is a good game").

## Tech notes (candidate, decided at P3 kickoff)

- three.js + react-three-fiber (mature, composable with the existing React UI, no lock-in of gameplay code).
- Animation director = pure function of `(logEntry, prevState, state)` → tweened scene events; testable headless, reusable by the replay tool.
