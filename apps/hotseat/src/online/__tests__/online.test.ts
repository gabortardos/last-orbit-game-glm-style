/**
 * Online client unit tests (P4 item 2): the net wrapper's protocol contract
 * (message routing, command wrapping, drop detection) and the view helpers
 * that keep the hotseat UI honest about hidden information.
 */
import { describe, it, expect, vi } from 'vitest';
import { createGame } from '@last-orbit/game-core';
import { OnlineConn, type RoomLike } from '../net';
import { deckSize, handSize } from '../types';

/** A StubRoom records sends and lets tests fire server messages / leave codes. */
interface StubRoom extends RoomLike {
  sent: [string, unknown][];
  emit(type: string, msg: unknown): void;
  drop(code: number): void;
}

function stubRoom(code = 'R0', reconnectionToken?: string): StubRoom {
  const sent: [string, unknown][] = [];
  const msgs = new Map<string, (m: unknown) => void>();
  const leaves: ((code: number) => void)[] = [];
  return {
    roomId: code,
    reconnectionToken,
    send: (type, message) => { sent.push([type, message]); },
    onMessage: (type, cb) => { msgs.set(type, cb); },
    onLeave: (cb) => { leaves.push(cb); },
    leave: () => { /* recorded via leave() on the conn */ },
    emit: (type, msg) => { msgs.get(type)?.(msg); },
    drop: (code) => { for (const cb of leaves) cb(code); },
    sent,
  };
}

describe('OnlineConn (protocol wiring)', () => {
  it('wraps commands and start requests in the wire format', () => {
    const conn = new OnlineConn();
    const room = stubRoom();
    conn.attach(room);
    conn.sendCommand({ type: 'END_TURN_DRAW', player: 2 });
    conn.startMatch(1234);
    expect(room.sent).toEqual([
      ['command', { cmd: { type: 'END_TURN_DRAW', player: 2 } }],
      ['start', { seed: 1234 }],
    ]);
  });

  it('routes welcome/seats/state/reject/autopilot to their handlers', () => {
    const conn = new OnlineConn();
    const room = stubRoom();
    const welcome = vi.fn();
    const seats = vi.fn();
    const state = vi.fn();
    const reject = vi.fn();
    const autopilot = vi.fn();
    Object.assign(conn.handlers, { welcome, seats, state, reject, autopilot });
    conn.attach(room);

    room.emit('welcome', { seat: 1, started: false });
    room.emit('seats', { seats: [], started: true });
    room.emit('state', { version: 3 });
    room.emit('reject', { error: 'no live match' });
    room.emit('autopilot', { seat: 0, command: 'PASS' });

    expect(welcome).toHaveBeenCalledWith({ seat: 1, started: false });
    expect(seats).toHaveBeenCalledWith({ seats: [], started: true });
    expect(state).toHaveBeenCalledWith({ version: 3 });
    expect(reject).toHaveBeenCalledWith({ error: 'no live match' });
    expect(autopilot).toHaveBeenCalledWith({ seat: 0, command: 'PASS' });
  });

  it('reports non-consented drops and stops routing after leave()', () => {
    const conn = new OnlineConn();
    const room = stubRoom();
    const dropped = vi.fn();
    const state = vi.fn();
    Object.assign(conn.handlers, { dropped, state });
    conn.attach(room);

    room.drop(1006); // abnormal closure → we were cut off
    expect(dropped).toHaveBeenCalledTimes(1);

    conn.leave();
    room.emit('state', { version: 9 }); // stale events from the dead room
    room.drop(1001);
    expect(state).not.toHaveBeenCalled();
    expect(dropped).toHaveBeenCalledTimes(1);
  });
});

describe('view helpers (hidden information)', () => {
  const g = createGame({ playerCount: 2, modules: { sunFury: false, derelicts: false }, seed: 7 });

  it('falls back to real hands/deck for a local GameState', () => {
    expect(handSize(g, 0)).toBe(g.players[0].hand.length);
    expect(deckSize(g)).toBe(g.deck.length);
  });

  it('reads handSizes/deckSize for an online snapshot (other hands are [])', () => {
    const online = {
      ...g,
      players: g.players.map((p, i) => (i === 1 ? { ...p, hand: [] } : p)),
      handSizes: g.players.map((p) => p.hand.length),
      deck: [],
      deckSize: g.deck.length,
      seat: 0,
      version: 1,
    };
    expect(online.players[1].hand).toEqual([]); // sealed on the wire
    expect(handSize(online, 1)).toBe(g.players[1].hand.length); // …but sized
    expect(deckSize(online)).toBe(g.deck.length);
  });
});