/**
 * Typed wrapper around @colyseus/sdk (P4 item 2) — the client's ONLY network surface.
 *
 * Protocol (apps/server/src/room.ts — the ONE authority):
 *   → 'command'  { cmd }    request a move (cmd.player must equal our seat)
 *   → 'start'    { seed? }  host-only, once
 *   ← 'welcome'  { seat, started }   our seat (-1/null = spectator) on join
 *   ← 'seats'    { seats, started }  roster on every seat change
 *   ← 'state'    SeatViewMsg         full private snapshot on every change
 *   ← 'started'  {}                  the match just began
 *   ← 'reject'   { error, command? } our request was refused — show it
 *   ← 'autopilot'{ seat, command }   the server flew a stalled/absent human
 *   + SDK onLeave(code): anything ≠ 1000 means we dropped without consenting.
 */
import { Client } from '@colyseus/sdk';
import type { Room } from '@colyseus/sdk';
import type { Command } from '@last-orbit/game-core';
import type { SeatInfo, SeatViewMsg } from './types';

export interface ConnectOptions {
  endpoint: string; // e.g. ws://localhost:2567 (matchmake REST gets CORS headers from Colyseus)
  name: string;
  playerCount?: number; // host only: table size 2..5
  humanSeats?: number; // host only: unfilled seats fly as server bots
  roomCode?: string; // set → join a friend's room instead of hosting
}

export interface OnlineHandlers {
  welcome?: (msg: { seat: number; started: boolean }) => void;
  seats?: (msg: { seats: SeatInfo[]; started: boolean }) => void;
  state?: (view: SeatViewMsg) => void;
  started?: () => void;
  reject?: (msg: { error: string; command?: string }) => void;
  autopilot?: (msg: { seat: number; command: string }) => void;
  dropped?: () => void; // connection lost without our consent
}

/** The Room surface net.ts needs — the SDK Room satisfies it (and so do test stubs). */
export interface RoomLike {
  roomId: string;
  reconnectionToken?: string;
  send(type: string, message?: unknown): unknown;
  onMessage(type: string, cb: (msg: any) => void): unknown; // eslint-free explicit any: protocol payloads
  onLeave(cb: (code: number) => void): unknown;
  leave(consented?: boolean): unknown;
}

export class OnlineConn {
  private room: RoomLike | null = null;
  private reconnectionToken: string | null = null;
  private endpoint = '';
  readonly handlers: OnlineHandlers = {};

  get roomId(): string | null {
    return this.room?.roomId ?? null;
  }

  /** Hosts (joinOrCreate 'last_orbit') or joins a friend's room by code. */
  async connect(opts: ConnectOptions): Promise<void> {
    this.endpoint = opts.endpoint;
    const client = new Client(opts.endpoint);
    const hello = { name: opts.name };
    const room: Room = opts.roomCode
      ? await client.joinById(opts.roomCode, hello)
      : await client.joinOrCreate('last_orbit', {
          ...hello,
          playerCount: opts.playerCount,
          humanSeats: opts.humanSeats,
        });
    this.attach(room);
  }

  /** Seat-restoring reconnect inside the server's 30 s window (same seat, fresh snapshot). */
  async reconnect(): Promise<boolean> {
    if (!this.reconnectionToken || !this.endpoint) return false;
    const room: Room = await new Client(this.endpoint).reconnect(this.reconnectionToken);
    this.attach(room);
    return true;
  }

  /** Wires the protocol onto a room (split out so tests can attach a stub). */
  attach(room: RoomLike): void {
    this.detach();
    this.room = room;
    if (room.reconnectionToken) this.reconnectionToken = room.reconnectionToken;
    const live = () => this.room === room; // ignore events from a room we already left
    room.onMessage('welcome', (m) => live() && this.handlers.welcome?.(m));
    room.onMessage('seats', (m) => live() && this.handlers.seats?.(m));
    room.onMessage('state', (m) => live() && this.handlers.state?.(m));
    room.onMessage('started', () => live() && this.handlers.started?.());
    room.onMessage('reject', (m) => live() && this.handlers.reject?.(m));
    room.onMessage('autopilot', (m) => live() && this.handlers.autopilot?.(m));
    room.onLeave((code: number) => {
      if (live() && code !== 1000) this.handlers.dropped?.(); // 1000 = we asked to leave
    });
  }

  detach(): void {
    this.room = null;
  }

  sendCommand(cmd: Command): void {
    this.room?.send('command', { cmd });
  }

  startMatch(seed?: number): void {
    this.room?.send('start', { seed });
  }

  leave(): void {
    const r = this.room;
    this.detach();
    this.reconnectionToken = null;
    r?.leave(true); // consented — the server frees the seat at once
  }
}