# @last-orbit/server — authoritative online server (D-036 spike)

A Colyseus Room (`LastOrbitRoom`) wrapping `@last-orbit/game-core`: per-seat
privacy views, server-flown bots (online solo-vs-AI), reaction/turn deadlines
with autopilot, reconnection. Design + remaining P4 plan:
`docs/17-online-architecture.md`.

- Dev: `npm run dev:server` (ws://localhost:2567, room id `last_orbit`)
- Tests: `npm test` at repo root (`@colyseus/testing` boots the room headlessly)

Note: the root test script pins `--pool=threads` — vitest's default `forks`
pool cannot host the Colyseus ws server inside its IPC child processes.
