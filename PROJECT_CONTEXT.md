# PROJECT CONTEXT — read me first

This file is the single entry point for **any person or AI model** continuing development of *Last Orbit: Solar System Showdown*. Keep it current. The living "what now" state lives in [`docs/NOW.md`](docs/NOW.md) — read that second.

## Mission

Build an original, funny, tense social risk card game (2–5 players, 10–20 min matches) inspired by the *feel* of Exploding Kittens' shrinking-deck tension, but with its own fiction, mechanics, factions, and identity — and ship it as a digital web game with cool stylized graphics, animations, and eventually online multiplayer.

Gábor is the owner and creative decision-maker. Aides (AI or human) present options with recommendations; Gábor decides.

## Hard rules (never violate)

1. **Never touch the Solar System Explorer.** Do not modify, document, deploy, or couple it to this repo. Reuse of its *ideas/techniques* may be evaluated in Phase 5, by reading only, and only with an explicit decision-log entry.
2. **No Exploding Kittens IP.** Mechanics may be referenced; branding, art, characters, card text, names, and comedy voice must be original.
3. **Don't silently replace decisions.** Record changes in `docs/11-decision-log.md` with what/why/evidence.
4. **The rules live in `packages/game-core`.** UI, sim, and future server must all consume the engine — never re-implement rules elsewhere.
5. **Determinism:** the engine is a pure function of (state, command, seed). No `Math.random`, no `Date.now` inside `game-core`.

## What the game is (one page)

- 2–5 captains, each flying a planetary civilization's flagship in the **Grand Solar Rally**.
- Turn: **play any number of cards (or none) → draw to end your turn.**
- Deck contains **N−1 Solar Ruptures** (fatal draws). Draw one with no **Containment Field** → flagship disabled, you're out (you become a **Derelict** if that module is on).
- Contain a rupture → it is **secretly reinserted** into the deck by you.
- Optional module **Sun Fury**: each containment enrages the Sun (+1 Fury, max 5); higher Fury *shrinks the allowed reinsertion depth* (anywhere → top 15 → 10 → 7 → 5), guaranteeing an escalating finale.
- Optional module **Derelict Interference**: eliminated players get one **Final Transmission** (a posthumous Comms Override) to stay engaged and meddle.
- Last operational flagship wins.

Full detail: `docs/03-rules-v0.2.md`, `docs/04-card-catalogue.md`.

## Phases & gates (see docs/13-roadmap.md)

- **P0 — Foundation (DONE, session 1):** design docs, repo, engine, hotseat prototype, simulator.
- **P1 — Core validation (CURRENT):** human playtests PT-01/PT-02 (vanilla core), iterate rules.
- **P2 — Modules & factions:** Sun Fury (PT-03), Derelicts (PT-04), faction layer design & tests.
- **P3 — Visual vertical slice:** stylized 3D/web presentation of the same engine.
- **P4 — Online multiplayer:** authoritative server, rooms, reconnection, spectator/Derelict UX.
- **P5 — Explorer technique evaluation & polish.**

## How to continue development (for any model)

1. Read `docs/NOW.md` (current status + next actions), then `docs/13-roadmap.md`, then `docs/11-decision-log.md`.
2. Commands: `npm install`, `npm run dev` (hotseat app), `npm test` (engine tests), `npm run sim` (balance sim), `npm run build`, `npm run typecheck`.
3. Conventions: TypeScript strict; engine is pure & seeded; UI is a thin shell over engine commands; conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `balance:`); every design change lands in the relevant `docs/` record the same commit.
4. After any work session, update `docs/NOW.md` (and playtest log / balance findings / decision log as applicable).

## Key vocabulary

Solar Rupture (catastrophe) · Containment Field (survivor) · Sun Fury (doom track) · Derelict (eliminated captain) · Final Transmission (derelict's one override) · Forced Flyby (turn-debt attack) · Emergency Burn (skip) · Command Phase / Draw (turn structure) · The Rally (the match fiction).

## Repo facts

- Created: 2026-10-25, session 1 (design foundation + prototype + sim).
- Owner: Gábor. Working title *Last Orbit: Solar System Showdown* (provisional).
- GitHub remote: to be added by Gábor (`git remote add origin <url> && git push -u origin main`).
- Git identity is repo-local (`gabor@lastorbit.local`) until Gábor sets a global one.
