/**
 * Online client view types (P4 item 2 — architecture: docs/17, D-036).
 *
 * The server ships per-seat snapshots (`apps/server/src/views.ts` `SeatView`):
 * the GameState field layout 1:1, plus `handSizes` / `deckSize` / `seat` /
 * `version` — every other hand emptied, the deck contents sealed. The hotseat
 * UI components therefore render an online match unchanged; they only need to
 * ask these helpers instead of `p.hand.length` / `game.deck.length`, which over
 * the wire are private information (empty for everyone but us).
 *
 * Kept structurally in sync with apps/server/src/views.ts on purpose — no
 * cross-package import: the engine stays UI/server agnostic.
 */
import type { GameState } from '@last-orbit/game-core';

export interface SeatInfo {
  seat: number;
  kind: 'human' | 'bot' | 'open';
  connected: boolean;
  name: string;
}

/** What the server puts on the wire for one seat (see views.ts). */
export type SeatViewMsg = GameState & {
  handSizes: number[];
  deckSize: number;
  seat: number | null;
  version: number;
};

/** A local GameState OR a server snapshot — lets every UI component serve both modes. */
export type ClientGame = GameState & Partial<Pick<SeatViewMsg, 'handSizes' | 'deckSize' | 'seat' | 'version'>>;

/** Cards in seat `id`'s hand — `handSizes` when online (other hands are sealed). */
export function handSize(g: ClientGame, id: number): number {
  return g.handSizes ? g.handSizes[id] : (g.players[id]?.hand.length ?? 0);
}

/** Draw pile size — `deckSize` when online (deck contents are sealed). */
export function deckSize(g: ClientGame): number {
  return g.deckSize ?? g.deck.length;
}