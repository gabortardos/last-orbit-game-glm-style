# 07 — Platform & Architecture (v0.2, 2026-10-25)

## Product shape

- **Responsive web app** (mobile + desktop), deployed as a static site (Phase 1–3) and later a small authoritative server (Phase 4).
- **Local-first:** hotseat play works fully offline in the browser (PWA candidate).

## Tech stack (chosen for boring reliability + AI-continuity)

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript (strict) | Single language across core/UI/sim/server |
| Core | `packages/game-core` — pure, deterministic, seeded RNG | One rules implementation everywhere; testable; replayable; simulable |
| App | Vite + React 18 | Standard, fast, any-model-friendly |
| 3D (P3) | Three.js (via React Three Fiber or vanilla — decide at P3 kickoff) | Proven on web, huge ecosystem |
| Tests | Vitest | Fast, works out of the box with TS |
| Sim | tsx script over game-core + bot policies | Same engine as the game = sim always matches rules |

## Architecture rules

1. **Engine purity:** `game-core` has zero dependencies, no DOM, no Math.random, no Date.now. Game = fold of (state, command) with seeded RNG carried in state.
2. **UI is a thin shell:** renders state, dispatches commands, displays events. No rules logic in the app, ever.
3. **Bots implement policies, not rules:** they choose *commands* through the same validation path as humans.
4. **Metrics come from the engine event log** — one source of truth for playtest analytics.

## Monorepo layout

```
packages/game-core   rules engine, bots, metrics, tests
apps/hotseat         pass-and-play prototype (current UI)
sim/                 Monte Carlo balance simulator
docs/                living design records
```

## Phase 4 — online multiplayer (planned, not built)

- **Model:** authoritative server holding canonical state; clients send commands, receive state diffs + private views. The pure engine slots in unchanged.
- **Decided (D-036, 2026-10-25):** Colyseus 0.18 — spike shipped in `apps/server` (`LastOrbitRoom`: authority, per-seat privacy snapshots, server bots, timers/autopilot, reconnection, spectators). PartyKit eliminated (hosted platform shut down 2026-10-23). Architecture of record: `docs/17-online-architecture.md`.
- **Must-haves:** reaction countdowns (~6s window), reconnection & resume, Derelict spectator UX with emotes, turn timers, lobby (room codes), 2–5 players.
- **Anti-cheat baseline:** server never sends private hands; scans are server-side views.
- **Deployment:** static app + small server process; target cheap hosting.

## Phase 5 — Solar System Explorer technique evaluation

Policy (D-009): **"new world, borrowed sparks."** This game's look is deliberately stylized-cinematic, so wholesale reuse is off the table by design. Allowed in P5: *read-only* evaluation of the Explorer's techniques (planet shading approach, orbital math helpers, camera feel) — any adoption is a logged decision, ported as fresh code into this repo, never a shared module.

## Change log

- v0.2: stack fixed (TS/Vite/React/Vitest); engine purity rules; P4 multiplayer plan; Explorer reuse policy.
- 2026-10-25 (D-036): P4 opened — Colyseus chosen + spike shipped (`apps/server`); see `docs/17-online-architecture.md`.
