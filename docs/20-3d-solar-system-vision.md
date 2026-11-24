# 20 — The Living Solar System (visual north star)

**Status:** **APPROVED as direction** — decision **D-038** (Gábor, 2026-10-25: "I want to progress with that"). **Rung 1 (the living table) is now open** as the P3 visual lane, running parallel to the P4 friends-and-family beta — UI-only work, engine untouched. Rungs 2–3 stay post-P5 (same rule as D-037: the game is proven first, then the world). Release sequencing: `docs/21` (D-039). **Tech resolved 2026-11-24 (D-041): plain three.js on Gábor's own Solar System Explorer engine — react-three-fiber dropped; the Explorer core is ported into `apps/hotseat/src/solar`.** **Rung-1 polish 2026-11-24 (session 8): panels rebalanced — nothing solid sits over the orbital plane; framing is viewport-responsive (~302 u on landscape, floor 280 u, phone-safe portrait) and the starships scale to read (~3×, symbolic like chess pieces), so the belt corridor and the card-action effects are actually visible behind the glass.**
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
- **Rung 1 — the living table (this is P3, plus one step).** A three.js scene (the Explorer engine, D-041) *behind* the current 2D-glass cards: the Sun breathes with Fury level; seats are starships racing the belt corridor; the log animates in the system (a steal = a comet streak between two ships; an Override = a jam wave from a third ship; a rupture = a solar eruption; a deflection = the streak bouncing). Reduced-motion variants mandatory.
- **Rung 2 — homeworlds.** The Codex becomes a 3D vignette per civ (Mars' rust markets, Venus' cloud courts, Saturn's ring choirs…), art-directed style frames first; per-faction card backs / hero art.
- **Rung 3 — world mode.** Play *inside* the system: viewpoint rides your flagship; actions are physical (a boarding party launches, flies, grapples); reactions are comm lasers between ships. The flat card UI survives as an overlay "tactical mode".

## Guards (what keeps this from killing the game)

1. **Readability outranks spectacle** — the P3 gate "state readability sign-off" applies to every rung; a scene that hides whose turn it is fails, however pretty.
2. **The engine never depends on the renderer** — 3D is a view, not a mechanic; the sim and rules tests must not know it exists.
3. **Mobile/low-end tiers** — quality presets, fallback to the glass UI; a phone must still play.
4. **Scope sequencing** — rung 1 runs in the P3 lane in parallel with the beta (it renders any rules, so it never gates the "good game" verdict); rungs 2–3 wait for the P5 gate ("once it is a good game"). If the beta demands a mechanics iteration, rung 1 waits with it.

## Tech notes (resolved 2026-11-24 — D-041)

- **Plain three.js on Gábor's own Solar System Explorer** (github.com/gabortardos/solar-system-glm): its data/sim/render core is ported near-verbatim into `apps/hotseat/src/solar/` — Kepler orbits, planet+moon catalog, the compressed-scale system — exactly the "background engine for other 3D games" use its README anticipated. react-three-fiber was removed: the Explorer is vanilla three.js, and one fewer dependency is one fewer seam.
- Animation director lives in `SolarScene.tsx` (log entry → scene event: `rupture_reveal` flare, targeted `play`/`give` streak, `contained` shield pulse, `fury_up` flash) on top of `BackScene`'s effect kit; the original pure-function-of-`(logEntry, prevState, state)` form stays a candidate if the replay tool ever needs a headless director.
