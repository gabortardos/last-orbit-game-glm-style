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

export type SeatView = GameState & {
  handSizes: number[]; // hand length per seat (hands themselves are private)
  deckSize: number; // draw pile size (contents private)
  seat: number | null; // the viewer's seat; null = spectator
  version: number; // monotonic snapshot counter for client-side ordering
};

export function seatView(state: GameState, seat: number | null, version: number): SeatView {
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
  };
}
