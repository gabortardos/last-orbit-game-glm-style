/**
 * D-036 spike tests — LastOrbitRoom driven end-to-end through @colyseus/testing:
 * real WebSocket round-trips against a real (local) Colyseus server.
 *
 *  1. seats + start + per-seat privacy views (hands, deck, seed, rng never leak)
 *  2. authority: spoofed/illegal commands are rejected, state never moves
 *  3. full online match: 1 human + 3 server-flown bots reaches game_over
 *  4. server timers: a stalling human is autopiloted, the match never stalls
 *  5. spectators get a handless view
 *  6. reconnection restores the same seat with a fresh snapshot
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { boot, type ColyseusTestServer } from '@colyseus/testing';
import { Server } from 'colyseus';
import { LastOrbitRoom } from '../room';
import type { SeatView } from '../views';
import type { Command, GameState, LogEntry } from '@last-orbit/game-core';

/** Minimal structural slice of an SDK room — keeps the tests free of SDK imports. */
interface TestClient {
  sessionId: string;
  reconnectionToken: string;
  send(type: string, message: unknown): void;
  onMessage(type: string, callback: (message: never) => void): unknown;
  leave(consented?: boolean): Promise<number>;
}

interface Tracked {
  states: SeatView[];
  rejects: string[];
  autopilots: { seat: number; command: string }[];
}

let server: ColyseusTestServer;

beforeAll(async () => {
  const gameServer = new Server();
  gameServer.define('last_orbit', LastOrbitRoom);
  server = await boot(gameServer);
});

afterAll(async () => {
  await server.shutdown();
});

function track(client: TestClient): Tracked {
  const t: Tracked = { states: [], rejects: [], autopilots: [] };
  client.onMessage('state', ((v: SeatView) => t.states.push(v)) as never);
  client.onMessage('reject', ((m: { error: string }) => t.rejects.push(m.error)) as never);
  client.onMessage('autopilot', ((m: { seat: number; command: string }) => t.autopilots.push(m)) as never);
  return t;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function until(cond: () => boolean, ms = 3000, what = 'condition'): Promise<void> {
  const t0 = Date.now();
  while (!cond()) {
    if (Date.now() - t0 > ms) throw new Error(`timeout waiting for: ${what}`);
    await sleep(10);
  }
}

async function makeRoom(extra: Record<string, unknown> = {}): Promise<LastOrbitRoom> {
  return server.createRoom<LastOrbitRoom>('last_orbit', {
    playerCount: 2,
    humanSeats: 2,
    seed: 4242,
    reactionMs: 0, // timers off by default — the timer test turns them on
    turnMs: 0,
    ...extra,
  });
}

const internals = (room: LastOrbitRoom): GameState =>
  (room as unknown as { game: GameState }).game;

/** Continuous privacy audit: no snapshot may ever carry hidden information. */
function assertViewIsPrivate(v: SeatView): void {
  expect(v.deck).toEqual([]);
  expect(v.rngState).toBe(0);
  expect(v.config.seed).toBe(0);
  for (const p of v.players) {
    if (v.seat === null || p.id !== v.seat) expect(p.hand).toEqual([]);
  }
  for (const e of v.log) {
    if (typeof e.visibility === 'object') expect(e.visibility.only).toBe(v.seat);
    if (e.type === 'draw' && e.data?.player !== v.seat) {
      expect(e.data?.card).toBeUndefined(); // what OTHERS drew never rides the wire
    }
  }
}

// __TESTS__
describe('LastOrbitRoom (D-036 spike)', () => {
  it('assigns seats, starts, and ships per-seat privacy views', async () => {
    const room = await makeRoom({ seed: 100 });
    const c0 = (await server.connectTo(room, { name: 'Amara' })) as unknown as TestClient;
    const c1 = (await server.connectTo(room, { name: 'Vesper' })) as unknown as TestClient;
    const t0 = track(c0);
    const t1 = track(c1);

    c0.send('start', { seed: 100 });
    await until(() => t0.states.length >= 1 && t1.states.length >= 1, 3000, 'initial snapshots');
    await sleep(50); // catch any unexpected follow-ups (there should be none)

    const g = internals(room);
    const v0 = t0.states[t0.states.length - 1];
    const v1 = t1.states[t1.states.length - 1];

    expect(v0.seat).toBe(0);
    expect(v1.seat).toBe(1);
    expect(v0.version).toBe(v1.version);
    expect(v0.phase).toBe('command');
    expect(v0.players).toHaveLength(2);

    // own hand visible, opponent's hidden but sized; deck sized; seed & rng sealed
    expect(v0.players[0].hand.length).toBe(5); // 4 dealt + 1 containment
    expect(v0.players[1].hand).toEqual([]);
    expect(v0.handSizes[1]).toBe(g.players[1].hand.length);
    expect(v0.deckSize).toBe(g.deck.length);
    expect(v0.deckSize).toBeGreaterThan(0);
    assertViewIsPrivate(v0);
    assertViewIsPrivate(v1);

    // both seats stayed human (no bots in a 2-human room)
    expect(v0.players[0].name).toBe('Amara');
    expect(v1.players[1].name).toBe('Vesper');

    // draw privacy (P4 client hardening): seat 0 draws — the drawer keeps the card,
    // the other seat's copy of the same event is stripped to deckLeft only
    c0.send('command', { cmd: { type: 'END_TURN_DRAW', player: 0 } });
    await until(() => t0.states[t0.states.length - 1].version > v0.version, 3000, 'seat 0 draws');
    const lastDraw = (t: Tracked): LogEntry =>
      [...t.states[t.states.length - 1].log].reverse().find((e) => e.type === 'draw') as LogEntry;
    expect(lastDraw(t0).data?.player).toBe(0);
    expect(typeof lastDraw(t0).data?.card).toBe('string'); // own draw carries the card
    expect(lastDraw(t1).data?.player).toBe(0);
    expect(lastDraw(t1).data?.card).toBeUndefined(); // theirs does not
  });

  it('enforces authority: spoofed and illegal commands are rejected, state never moves', async () => {
    const room = await makeRoom({ seed: 101 });
    const c0 = (await server.connectTo(room)) as unknown as TestClient;
    await server.connectTo(room);
    const t0 = track(c0);
    c0.send('start', { seed: 101 });
    await until(() => t0.states.length >= 1, 3000, 'match start');
    const version = t0.states[t0.states.length - 1].version;

    c0.send('command', { cmd: { type: 'END_TURN_DRAW', player: 1 } }); // spoofed seat
    c0.send('command', { cmd: { type: 'OVERRIDE', player: 0 } }); // no window open
    await until(() => t0.rejects.length >= 2, 3000, 'two rejects');
    await sleep(50);

    expect(t0.rejects[0]).toContain('cannot command for seat 1');
    expect(t0.rejects.length).toBeGreaterThanOrEqual(2);
    expect(t0.states[t0.states.length - 1].version).toBe(version); // untouched
  });
// __TESTS2__
  it('plays a full online match: 1 human + 3 server-flown bots reach game_over', async () => {
    const room = await makeRoom({ playerCount: 4, humanSeats: 1, seed: 777, botPolicy: 'greedy' });
    const c0 = (await server.connectTo(room, { name: 'Solo' })) as unknown as TestClient;
    const t0 = track(c0);
    c0.send('start', { seed: 777 });
    await until(() => t0.states.length >= 1, 3000, 'match start');

    // the human's whole strategy: end turn, pass windows, satisfy choices minimally
    let actedVersion = -1;
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      const v = t0.states[t0.states.length - 1];
      if (v.phase === 'game_over') break;
      if (v.version === actedVersion) {
        await sleep(10);
        continue;
      }
      actedVersion = v.version;
      const seat = v.seat as number;
      const hand = v.players[seat].hand;
      const cmd: Command | null =
        v.phase === 'command' && v.activePlayer === seat
          ? { type: 'END_TURN_DRAW', player: seat }
          : v.phase === 'reaction'
            ? { type: 'PASS', player: seat } // only surfaces when a human must respond
            : v.phase === 'choice' && v.awaiting
              ? v.awaiting.type === 'give'
                ? { type: 'GIVE', player: v.awaiting.from, card: hand[0] }
                : v.awaiting.type === 'reinsert'
                  ? { type: 'REINSERT', player: v.activePlayer, positionFromTop: 1 }
                  : v.awaiting.type === 'storm_discard'
                    ? { type: 'STORM_DISCARD', player: v.awaiting.player, card: hand[0] }
                    : { type: 'SNAG_DISCARD', player: v.awaiting.player, cards: hand.slice(3) }
              : null;
      if (cmd) c0.send('command', { cmd });
      await sleep(15);
    }

    const final = t0.states[t0.states.length - 1];
    expect(final.phase).toBe('game_over');
    expect(final.winner).not.toBeNull();
    for (const v of t0.states) assertViewIsPrivate(v); // every snapshot, whole match
    expect(internals(room).winner).toBe(final.winner);
  }, 45_000);

  it('autopilots a stalling human when server timers fire (match never stalls)', async () => {
    const room = await makeRoom({ playerCount: 2, humanSeats: 1, seed: 9001, reactionMs: 60, turnMs: 80 });
    const c0 = (await server.connectTo(room)) as unknown as TestClient;
    const t0 = track(c0);
    c0.send('start', { seed: 9001 });
    await until(() => t0.states.length >= 1, 3000, 'match start');
    const vStart = t0.states[0].version;

    // the client sends NOTHING — the server must carry the match on its own
    await until(
      () => t0.autopilots.length >= 1 && t0.states[t0.states.length - 1].version >= vStart + 2,
      4000,
      'autopilot progress',
    );
    expect(t0.autopilots[0].seat).toBe(0);
    for (const v of t0.states) assertViewIsPrivate(v);
  });

  it('gives spectators a handless view of a live match (Derelict UX groundwork)', async () => {
    const room = await makeRoom({ seed: 103 });
    const c0 = (await server.connectTo(room)) as unknown as TestClient; // seat 0
    await server.connectTo(room); // seat 1
    const t0 = track(c0);
    const spec = (await server.connectTo(room)) as unknown as TestClient; // seats full → spectator
    const tSpec = track(spec);

    c0.send('start', { seed: 103 });
    await until(() => t0.states.length >= 1 && tSpec.states.length >= 1, 3000, 'snapshots');

    const v = tSpec.states[tSpec.states.length - 1];
    expect(v.seat).toBeNull();
    expect(v.players.every((p) => p.hand.length === 0)).toBe(true);
    expect(v.handSizes.every((n) => n > 0)).toBe(true);
    expect(v.deckSize).toBeGreaterThan(0);
    assertViewIsPrivate(v);

    spec.send('command', { cmd: { type: 'END_TURN_DRAW', player: 0 } }); // spectators cannot command
    await until(() => tSpec.rejects.length >= 1, 3000, 'spectator reject');
    expect(tSpec.rejects[0]).toContain('spectators');
  });

  it('restores the same seat with a fresh snapshot after reconnection', async () => {
    const room = await makeRoom({ seed: 104 });
    const c0 = (await server.connectTo(room)) as unknown as TestClient;
    const c1 = (await server.connectTo(room, { name: 'Vesper' })) as unknown as TestClient;
    const t0 = track(c0);
    const t1 = track(c1);
    c0.send('start', { seed: 104 });
    await until(() => t0.states.length >= 1 && t1.states.length >= 1, 3000, 'match start');
    const vBefore = t1.states[t1.states.length - 1];
    expect(vBefore.seat).toBe(1);

    const token = c1.reconnectionToken;
    await c1.leave(false); // accidental drop — NOT consented
    await sleep(150);

    const c1b = (await server.sdk.reconnect(token)) as unknown as TestClient;
    const t1b = track(c1b);
    await until(() => t1b.states.length >= 1, 3000, 'post-reconnect snapshot');

    const vAfter = t1b.states[t1b.states.length - 1];
    expect(vAfter.seat).toBe(1); // same seat restored
    expect(vAfter.version).toBeGreaterThanOrEqual(vBefore.version);
    assertViewIsPrivate(vAfter);
  });
// __TESTS2__
});

