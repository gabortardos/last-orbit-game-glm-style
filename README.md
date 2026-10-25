# Last Orbit: Solar System Showdown

A fast, funny, tense social card game for **2–5 captains**. Every civilization's flagship races the final orbit around a Sun that is actively losing its temper. Sabotage rivals, scan the route, contain solar ruptures, redirect doom — and be the last flagship still flying.

**Status:** Phase 0/1 — design foundation complete, playable hotseat text prototype + Monte Carlo balance simulator available. Not yet a visual game; that is Phase 3.

> **Separation notice:** This project is thematically inspired by Gábor's *Solar System Explorer* but is operationally independent. The Explorer is never modified, reused, or coupled to this repo. Any future reuse is a separately-approved decision (Phase 5).

## Quick start

```bash
npm install        # installs all workspaces
npm run dev        # playable pass-and-play prototype (opens Vite dev server)
npm test           # unit tests for the rules engine
npm run sim        # Monte Carlo balance simulation -> docs/balance/sim-report-v0.2.md
npm run build      # production build of the hotseat app
```

## Repository map

| Path | What it is |
|---|---|
| `PROJECT_CONTEXT.md` | **Read this first.** Mission, current state, how to continue development. |
| `docs/` | Living design records: brief, rules, card catalogue, ledger, playtest plan & log, decision log, roadmap, balance findings, civilization bible, visual direction. |
| `packages/game-core` | Deterministic, headless TypeScript rules engine (pure state machine + seeded RNG). Powers the UI, the simulator, and any future server. |
| `apps/hotseat` | Pass-and-play web prototype of rules v0.2 with automatic match metrics. |
| `sim/` | Monte Carlo balance simulator using bot policies over `game-core`. |

## The game in one paragraph

Captains take turns: play any number of action cards (or none), then **end your turn by drawing** from the shared deck. The deck contains **N−1 Solar Ruptures**. Draw one without a **Containment Field** and your flagship is disabled. Contain one and you must secretly **reinsert it into the deck** — with the optional **Sun Fury** module, the madder the Sun gets, the shallower you're allowed to bury it. Last flagship flying wins.

Full rules: [`docs/03-rules-v0.2.md`](docs/03-rules-v0.2.md)

## Documentation index

See [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) for the complete reading order and current status (`docs/NOW.md`).

## License

TBD — private project of Gábor. All rights reserved until decided otherwise.
