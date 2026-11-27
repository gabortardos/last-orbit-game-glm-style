/**
 * Per-seat projections of the authoritative GameState (D-036 spike).
 *
 * The server never ships hidden information: every client receives a view
 * composed for ITS seat. Redactions (spike-grade — see docs/17 §Privacy):
 *  - hands: only the viewer's own hand survives; sizes go to `handSizes`
 *  - deck:  contents never leave the server — `deck: []` + `deckSize`
 *  - rngState: zeroed (leaking the RNG stream = predicting the deck)
 *  - config.seed: zeroed (deterministic engine → seed enables replay attacks)
 *  - log: filtered by visibility ('public' always; { only: seat } to its seat;
 *    'hidden' simulation detail to nobody)
 *  Spectators (seat === null) get no hands at all.
 *
 * The view keeps the GameState field layout 1:1 so the client can reuse the
 * hotseat UI components on top of it (plus the extra fields below).
 */
import type { GameState, LogEntry } from '@last-orbit/game-core';

/**
 * The pending decision's server-armed countdown (M3 online hardening).
 * `at`/`now` are server epoch ms — the client derives the skew once per snapshot
 * and ticks locally; `ms` is the full armed duration so a UI ring can start full.
 */
export interface PendingTimer {
  seat: number; // who the match currently waits on
  kind: 'turn' | 'reaction' | 'choice';
  at: number; // deadline, epoch ms
  now: number; // server clock at snapshot time
  ms: number; // armed duration (turnMs / reactionMs)
}

export type SeatView = GameState & {
  handSizes: number[]; // hand length per seat (hands themselves are private)
  deckSize: number; // draw pile size (contents private)
  seat: number | null; // the viewer's seat; null = spectator
  version: number; // monotonic snapshot counter for client-side ordering
  timer: PendingTimer | null; // the decision this viewer is counting down to, if any
};

/** Deadlines the room has currently armed (one per human decider). */
export type ArmedDeadlines = Map<number, { kind: PendingTimer['kind']; at: number; ms: number }>;

export function seatView(
  state: GameState,
  seat: number | null,
  version: number,
  deadlines?: ArmedDeadlines,
): SeatView {
  const log: LogEntry[] = state.log
    .filter((e) => e.visibility === 'public' || (typeof e.visibility === 'object' && e.visibility.only === seat))
    .map((e) =>
      // 'draw' events are public, but WHICH card left the deck is the drawer's business:
      // hands are sealed, so the card must be too (P4 client hardening). Own draws keep
      // `card` (the client's draw-reveal uses it); every other seat — and spectators —
      // get the entry stripped to `deckLeft` for the feed.
      e.type === 'draw' && e.data?.player !== seat
        ? { ...e, data: { ...e.data, card: undefined } }
        : e,
    );
  // M3: the viewer's own countdown if they owe the decision; else the earliest
  // armed deadline (whose turn / who is being waited on). Spectators get the earliest.
  let timer: PendingTimer | null = null;
  if (deadlines && deadlines.size > 0) {
    const own = seat !== null ? deadlines.get(seat) : undefined;
    const earliest = [...deadlines.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    const pick = own ?? (earliest ? earliest[1] : undefined);
    const pickSeat = own ? seat : earliest ? earliest[0] : null;
    if (pick && pickSeat !== null) {
      timer = { seat: pickSeat, kind: pick.kind, at: pick.at, now: Date.now(), ms: pick.ms };
    }
  }
  return {
    ...state,
    players: state.players.map((p) => ({
      ...p,
      hand: seat === p.id ? p.hand.slice() : [],
    })),
    handSizes: state.players.map((p) => p.hand.length),
    deck: [],
    deckSize: state.deck.length,
    log,
    rngState: 0,
    config: { ...state.config, seed: 0 },
    seat,
    version,
    timer,
  };
}
