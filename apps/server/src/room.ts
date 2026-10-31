/**
 * LastOrbitRoom — authoritative room wrapping @last-orbit/game-core (D-036 spike).
 * Architecture decisions: docs/17-online-architecture.md
 *  - authority: all commands flow through applyCommand on the server; the client
 *    only *requests*. cmd.player must equal the sender's seat — enforced, never trusted.
 *  - state sync: no @colyseus/schema mapping — per-seat JSON snapshots ("state")
 *    keep the engine untouched and privacy server-side.
 *  - bots: seats not held by a human at start fly server-side via botCommandFor
 *    (1 human + N bots = online solo-vs-AI).
 *  - timers: reaction/choice/command deadlines are server-side; on expiry an
 *    autopilot decision (greedy brain) is taken for the stalling human.
 *  - reconnection: allowReconnection(30s); expired seats stay under autopilot.
 */
import { Room, type Client } from 'colyseus';
import {
  applyCommand,
  botCommandFor,
  createGame,
  mulberry32Step,
  openRespondents,
} from '@last-orbit/game-core';
import type { BotPolicy, Command, FactionId, GameState, ModuleFlags } from '@last-orbit/game-core';
import { seatView } from './views';

export interface RoomOptions {
  playerCount: number; // 2..5
  /** seats reserved for humans; the rest fly as bots (default: all seats human) */
  humanSeats?: number;
  modules?: Partial<ModuleFlags>;
  factions?: (FactionId | null)[];
  botPolicy?: BotPolicy; // default 'greedy'
  seed?: number; // omitted → time-based (tests pass explicit seeds)
  reactionMs?: number; // 0 disables timers (tests); default 45_000
  turnMs?: number; // 0 disables; default 120_000
}

interface SeatInfo {
  seat: number;
  kind: 'human' | 'bot' | 'open';
  connected: boolean;
  name: string;
}

const DEFAULT_REACTION_MS = 45_000;
const DEFAULT_TURN_MS = 120_000;
const RECONNECT_SECONDS = 30;

export class LastOrbitRoom extends Room {
  maxClients = 9; // up to 5 seats + spectators (Derelict UX groundwork)
  autoDispose = true;

  private game: GameState | null = null;
  private opts!: Required<Pick<RoomOptions, 'botPolicy' | 'reactionMs' | 'turnMs'>> &
    Omit<RoomOptions, 'botPolicy' | 'reactionMs' | 'turnMs'>;
  private seatOf = new Map<string, number>(); // sessionId → seat; -1 = spectator
  private names = new Map<string, string>(); // sessionId → display name
  private isBot: boolean[] = [];
  private version = 0;
  private botRngState = 1; // dedicated stream for bot brains (deterministic per seed)
  private started = false;

  // __LIFECYCLE__
  onCreate(options: RoomOptions): void {
    const playerCount = Math.min(5, Math.max(2, options.playerCount ?? 3));
    this.opts = {
      ...options,
      playerCount,
      botPolicy: options.botPolicy ?? 'greedy',
      reactionMs: options.reactionMs ?? DEFAULT_REACTION_MS,
      turnMs: options.turnMs ?? DEFAULT_TURN_MS,
    };
    this.isBot = Array(playerCount).fill(false);
    this.botRngState = (options.seed ?? 1) || 1;

    this.onMessage('start', (client, msg: { seed?: number } | undefined) => {
      const seat = this.seatOf.get(client.sessionId) ?? -1;
      if (this.started || seat !== 0) {
        client.send('reject', { error: 'only the host (seat 0) can start, once' });
        return;
      }
      this.startMatch(msg?.seed ?? this.opts.seed ?? (Date.now() >>> 0));
    });

    this.onMessage('command', (client, msg: { cmd: Command }) => {
      const seat = this.seatOf.get(client.sessionId) ?? -1;
      const cmd = msg?.cmd;
      if (!this.started || !this.game || !cmd) {
        client.send('reject', { error: 'no live match' });
        return;
      }
      if (seat < 0) {
        client.send('reject', { error: 'spectators cannot command' });
        return;
      }
      if (cmd.player !== seat) {
        client.send('reject', { error: `seat ${seat} cannot command for seat ${cmd.player}` });
        return;
      }
      const res = applyCommand(this.game, cmd);
      if (!res.ok) {
        client.send('reject', { error: res.error, command: cmd.type });
        return;
      }
      this.commit(res.state);
      this.driveBots();
      this.armTimers();
    });
  }

  onJoin(client: Client, options?: { name?: string }): void {
    this.names.set(client.sessionId, options?.name ?? `Captain ${client.sessionId.slice(0, 4)}`);
    if (!this.started) {
      const taken = new Set([...this.seatOf.values()].filter((s) => s >= 0));
      let seat = -1;
      const humans = this.opts.humanSeats ?? this.opts.playerCount;
      for (let i = 0; i < Math.min(humans, this.opts.playerCount); i++) {
        if (!taken.has(i)) {
          seat = i;
          break;
        }
      }
      this.seatOf.set(client.sessionId, seat); // -1 → spectator (seats full)
    } else {
      this.seatOf.set(client.sessionId, -1); // spectators can watch a live match
    }
    client.send('welcome', { seat: this.seatOf.get(client.sessionId), started: this.started });
    this.broadcastSeats();
    if (this.started) this.pushViewTo(client); // late spectator catches up immediately
  }

  /**
   * 0.18 leave flow: onDrop = non-consented drop (reconnection may be offered),
   * onLeave = effective leave. A dropped seat gets 30s to return; after that it
   * stays in the match under autopilot (timers cover absent humans).
   */
  async onDrop(client: Client): Promise<void> {
    const seat = this.seatOf.get(client.sessionId) ?? -1;
    this.seatOf.delete(client.sessionId);
    if (seat < 0) return; // spectator

    this.broadcastSeats();
    try {
      const back = await this.allowReconnection(client, RECONNECT_SECONDS);
      this.seatOf.set(back.sessionId, seat);
      if (this.game) back.send('state', seatView(this.game, seat, this.version));
      this.broadcastSeats();
    } catch {
      // reconnection window expired: the seat stays in the match under autopilot
    }
  }

  onLeave(client: Client): void {
    const seat = this.seatOf.get(client.sessionId) ?? -1;
    this.seatOf.delete(client.sessionId);
    this.names.delete(client.sessionId);
    this.broadcastSeats(); // a consented leave opens the seat (pre-start) or logs off mid-match
    void seat;
  }

  onDispose(): void {
    this.clock.clear();
  }

  // __FLOW__
  // --- match flow -------------------------------------------------------------

  private startMatch(seed: number): void {
    const playerCount = this.opts.playerCount;
    const factions = Array.from({ length: playerCount }, (_, i) => this.opts.factions?.[i] ?? null);
    // seats not held by a human at start fly as bots (online solo-vs-AI)
    const taken = new Set([...this.seatOf.values()].filter((s) => s >= 0));
    this.isBot = Array.from({ length: playerCount }, (_, i) => !taken.has(i));
    const playerNames = Array.from(
      { length: playerCount },
      (_, i) => this.seatNameFor(i) ?? `Bot ${i + 1}`,
    );
    this.game = createGame({
      playerCount,
      modules: {
        sunFury: this.opts.modules?.sunFury ?? false,
        derelicts: this.opts.modules?.derelicts ?? false,
      },
      seed,
      factions,
      playerNames,
    });
    this.started = true;
    this.broadcast('started', {}); // the seed stays server-side (replay-attack guard)
    this.commit(this.game);
    this.driveBots();
    this.armTimers();
  }

  /** Applies pending bot decisions until a human (or nobody) must act. */
  private driveBots(): void {
    for (let guard = 0; guard < 1000; guard++) {
      if (!this.game || this.game.phase === 'game_over') return;
      const seat = this.botDeciderNow();
      if (seat === null) return;
      const cmd = botCommandFor(this.game, seat, this.opts.botPolicy, this.botRng);
      if (!cmd) return; // not actually their decision — wait
      const res = applyCommand(this.game, cmd);
      if (!res.ok) throw new Error(`server bot produced an illegal command: ${res.error}`);
      this.commit(res.state);
    }
    throw new Error('bot drive guard tripped — engine/bot contract broken');
  }

  /** The bot seat that must act right now, or null when a human (or nobody) must. */
  private botDeciderNow(): number | null {
    const g = this.game;
    if (!g || g.phase === 'game_over') return null;
    for (const d of this.decidersNow()) if (this.isBot[d]) return d;
    return null;
  }

  /** Every seat the current phase waits on (human AND bot deciders). */
  private decidersNow(): number[] {
    const g = this.game;
    if (!g || g.phase === 'game_over') return [];
    if (g.phase === 'reaction' && g.pending) return openRespondents(g);
    if (g.phase === 'choice' && g.awaiting) {
      const aw = g.awaiting;
      return [aw.type === 'give' ? aw.from : aw.type === 'reinsert' ? g.activePlayer : aw.player];
    }
    if (g.phase === 'command') return [g.activePlayer];
    return [];
  }

  /** Server deadlines: a stalling human is autopiloted so the match never stalls. */
  private armTimers(): void {
    this.clock.clear();
    if (!this.started || !this.game || this.game.phase === 'game_over') return;
    if (this.opts.reactionMs <= 0 && this.opts.turnMs <= 0) return; // timers off (tests)
    const g = this.game;
    if (g.phase === 'command' && this.opts.turnMs > 0) {
      if (!this.isBot[g.activePlayer]) {
        const seat = g.activePlayer;
        this.clock.setTimeout(() => this.autopilot(seat), this.opts.turnMs);
      }
    } else if (this.opts.reactionMs > 0) {
      for (const seat of this.decidersNow().filter((d) => !this.isBot[d])) {
        this.clock.setTimeout(() => this.autopilot(seat), this.opts.reactionMs);
      }
    }
  }

  /** Takes one decision on behalf of a stalled/absent human, then re-drives the match. */
  private autopilot(seat: number): void {
    if (!this.game || this.game.phase === 'game_over') return;
    const cmd = botCommandFor(this.game, seat, this.opts.botPolicy, this.botRng);
    if (!cmd) return; // no longer their decision — nothing to do
    const res = applyCommand(this.game, cmd);
    if (!res.ok) return; // never fatal: the next human input re-arms
    this.broadcast('autopilot', { seat, command: cmd.type });
    this.commit(res.state);
    this.driveBots();
    this.armTimers();
  }

  // --- plumbing ----------------------------------------------------------------

  private commit(state: GameState): void {
    this.game = state;
    this.version += 1;
    for (const c of this.clients) this.pushViewTo(c);
  }

  private pushViewTo(client: Client): void {
    if (!this.game) return;
    const seat = this.seatOf.get(client.sessionId) ?? -1;
    client.send('state', seatView(this.game, seat === -1 ? null : seat, this.version));
  }

  private seatNameFor(seat: number): string | null {
    for (const [sessionId, s] of this.seatOf) {
      if (s === seat) return this.names.get(sessionId) ?? null;
    }
    return null;
  }

  private roster(): SeatInfo[] {
    return Array.from({ length: this.opts.playerCount }, (_, i) => {
      const name = this.seatNameFor(i);
      if (this.started && this.isBot[i]) {
        return { seat: i, kind: 'bot' as const, connected: true, name: this.game?.players[i]?.name ?? `Bot ${i + 1}` };
      }
      if (name !== null) return { seat: i, kind: 'human' as const, connected: true, name };
      return { seat: i, kind: this.started ? ('human' as const) : ('open' as const), connected: false, name: '' };
    });
  }

  private broadcastSeats(): void {
    this.broadcast('seats', { seats: this.roster(), started: this.started });
  }

  private readonly botRng = (): number => {
    const r = mulberry32Step(this.botRngState);
    this.botRngState = r.state;
    return r.value;
  };

}
