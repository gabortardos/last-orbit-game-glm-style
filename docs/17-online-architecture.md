# 17 — Online Architecture (P4 opened: D-036 spike, 2026-10-25)

Status: **spike shipped and green** — `apps/server` (`LastOrbitRoom`) wraps `@last-orbit/game-core`
authoritatively; 6 integration tests (`apps/server/src/__tests__/room.test.ts`) drive it through
real WebSocket round-trips; 99/99 total suite green, typecheck + build green. This document is
the architecture of record for the online version and the ordered plan for the rest of P4.

## Requirements (from the game itself)

| Need | Source |
|---|---|
| Authority — one engine, server-side | reaction windows are interruptible; a client must never resolve them |
| Per-seat privacy | hands, deck order, ♆ Deep Sight peeks, `only:`-scoped log entries |
| Reaction windows with countdowns | the 📡 window is the game's heart (~seconds, not turns) |
| Turn timers | 2–5 captains; a stalling seat must not stall the table |
| Reconnection | mobile browsers, flaky Wi-Fi at game nights |
| 2–5 players + spectators | Derelict module: eliminated captains stay as spectators/interferers |
| Bots server-side | solo-vs-AI online (D-034: Gábor tests mostly alone) + seat fill |
| CI-testable | the project's gate ritual (typecheck · vitest · build) must cover the server |

## Candidates → decision (D-036)

- **PartyKit — eliminated.** The hosted PartyKit platform **shut down on 2026-10-23** (shutdown
  notice on their docs homepage, two days before this spike). Self-hosting on one's own
  Cloudflare account remains possible, but the project is post-acquisition legacy: wrong train
  to board for a multi-year product.
- **Plain WebSocket server + Redis — viable but expensive.** Everything above (rooms,
  reconnection, matchmaking, timers) hand-rolled; lots of code for zero product value.
- **Colyseus 0.18 — CHOSEN.** Actively maintained authoritative-server framework (rooms,
  matchmaking, reconnection, timers via room clock), Node-native so the pure-TS engine runs
  untouched, `@colyseus/testing` boots rooms headlessly for CI, self-hostable anywhere a Node
  process runs (VPS/Railway/Fly) or Colyseus Cloud.

## Architecture (as implemented in the spike)

```
2. **Privacy (`src/views.ts`, `seatView`).** Own hand only (others → `[]` + `handSizes`);
   deck → `deckSize` only; `rngState` and `config.seed` zeroed (deterministic engine ⇒ leaking
   either = predicting the deck — replay-attack guard); log filtered by visibility
   (`'public'` | `{only}` | `'hidden'`); spectators (seat `null`) get no hands at all.
3. **Authority.** Commands arrive as *requests*; `cmd.player` must equal the sender's seat;
   the engine validates and applies; failures bounce as `reject` with the engine's error.
4. **Bots.** Any seat not held by a human at start flies server-side (`botCommandFor`, greedy
   default, dedicated mulberry32 stream seeded from the match seed). The room re-drives bots
   after every commit until a human (or nobody) must act. 1 human + N bots = online solo-vs-AI.
5. **Timers / autopilot.** Command phase (`turnMs`, default 120 s), reaction + choice prompts
   (`reactionMs`, default 45 s) get server-side deadlines; expiry takes **one greedy-bot
   decision** for the stalling seat (`autopilot` broadcast) and re-drives. A disconnected human
   is covered by the same timers — the match never stalls. (Docs/07's "~6s window" is a UX
   target for the countdown ring; the server default is deliberately generous until playtests.)
6. **Reconnection.** 0.18 leave flow: `onDrop` offers `allowReconnection` (30 s) and restores
   the same seat + a fresh snapshot; after the window the seat stays in the match under
   autopilot. `onLeave` (effective/consented) releases the seat pre-start.
7. **Spectators.** Joining a full/live room = spectator seat with a handless view — the
   groundwork for the Derelict spectator UX.

## Evidence (the 6 tests)

1. seats + start + privacy views (own hand visible, others sized, deck sized, seed/rng sealed)
2. authority: spoofed + illegal commands rejected, state never moves
3. **full online match: 1 human + 3 server bots → game_over** (~0.4 s), every snapshot audited private
4. timers: a client that sends *nothing* is autopiloted; the match progresses on its own
5. spectator: handless live view; spectator commands refused
6. reconnection: drop + `sdk.reconnect` restores the same seat with a current snapshot

## Not in the spike (deliberately — the remaining P4 steps)

- [x] **Client "Online" mode** in the app (2026-10-25): `@colyseus/sdk` in `apps/hotseat/src/online` —
      🌐 entry on Setup, host/join with room codes, seat-roster lobby (host starts; empty seats →
      server bots), per-seat snapshots feed the existing view components via `ClientGame`
      (`handSize`/`deckSize` helpers; `remote` chips for other captains), own-draw reveal,
      reject/autopilot notices, seat-restoring reconnect. Includes a privacy hardening found
      during wiring: **`seatView` now strips the drawn card from other seats' copies of public
      `draw` log entries** (own draws keep it — the reveal needs it). 5 new client tests,
      draw-privacy assertion added to the continuous audit — **104/104 green**; live SDK smoke
      against a booted server verified join-by-code, sealed hands/deck, draw redaction and
      authority rejection end-to-end.
- [ ] **Online UX hardening:** reaction countdown ring + turn timer display, autopilot notices,
      reconnect overlay, Derelict spectator view + Final Transmission entry.
- [ ] **Deployment:** hosting choice (self-host VPS/Railway/Fly vs Colyseus Cloud), CI deploy,
      basic ops (logs, restart).
- [ ] **Beta:** friends-and-family — carries PT-01 (3p) + PT-02 (4–5p) per D-034.

## Open questions for Gábor (none blocking the next step)

- Hosting preference/budget when we deploy (self-host ~€5/mo vs Colyseus Cloud).
- Reaction/turn timer lengths (server defaults 45 s / 120 s) — tune during the beta.

## Notes

- Root test script pins `--pool=threads`: vitest's default `forks` pool cannot host the
  Colyseus ws server inside its IPC child processes (`apps/server/README.md`).
- `npm run dev:server` boots the room at `ws://localhost:2567` (room id `last_orbit`).

client (app)                      apps/server (Colyseus Room)
  send('command', { cmd })  ───►  seat lookup → cmd.player === seat? (authority)
  send('start', { seed })   ───►  host-only; seats without humans become bots
                                  applyCommand(game, cmd)        ← the ONE engine
  on 'state' (per-seat snapshot) ◄─── seatView(game, seat, version) — every change
  on 'seats' / 'welcome' / 'started' / 'reject' / 'autopilot'
```

1. **State sync = per-seat JSON snapshots, not `@colyseus/schema`.** The engine state is a
   plain deterministic object with per-seat privacy; mapping it into schema classes would fork
   the state model and still need per-seat filtering. A full snapshot is a few KB × ≤5 seats ×
   one per change — trivial for this game. The view keeps the `GameState` field layout 1:1, so
   the client can reuse the hotseat UI components (`handSizes`/`deckSize`/`seat`/`version` added).
