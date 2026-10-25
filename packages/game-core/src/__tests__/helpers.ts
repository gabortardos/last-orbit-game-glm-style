import { applyCommand, eligibleReactorIds, mulberry32Step } from '../index';
import type { GameState } from '../index';

export const NOMOD = { sunFury: false, derelicts: false };

export function ok<T extends GameState>(r: { ok: boolean; state?: T; error?: string }): T {
  if (!r.ok || !r.state) throw new Error(r.error ?? 'unknown error');
  return r.state;
}

/** Pass through the open reaction window until it resolves. */
export function passAll(s: GameState): GameState {
  let cur = s;
  while (cur.phase === 'reaction') {
    const ids = eligibleReactorIds(cur).filter((id) => !cur.pending?.passed.includes(id));
    if (ids.length === 0) break;
    cur = ok(applyCommand(cur, { type: 'PASS', player: ids[0] }));
  }
  return cur;
}

export function rngFrom(seed: number): () => number {
  let st = seed >>> 0 || 1;
  return () => {
    const r = mulberry32Step(st);
    st = r.state;
    return r.value;
  };
}
