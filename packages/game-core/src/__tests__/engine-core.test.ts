import { describe, expect, it } from 'vitest';
import { applyCommand, createGame, eligibleReactorIds } from '../index';
import type { CardKind, GameState } from '../index';

const NOMOD = { sunFury: false, derelicts: false };

function rig(n = 3, modules = NOMOD, seed = 42): GameState {
  return createGame({ playerCount: n, modules, seed });
}

/** Pass through the open reaction window until it resolves. */
function passAll(s: GameState): GameState {
  let cur = s;
  while (cur.phase === 'reaction') {
    const ids = eligibleReactorIds(cur).filter((id) => !cur.pending?.passed.includes(id));
    if (ids.length === 0) break;
    const r = applyCommand(cur, { type: 'PASS', player: ids[0] });
    if (!r.ok) throw new Error(r.error);
    cur = r.state;
  }
  return cur;
}

function ok<T extends GameState>(r: { ok: boolean; state?: T; error?: string }): T {
  if (!r.ok || !r.state) throw new Error(r.error ?? 'unknown error');
  return r.state;
}

describe('setup', () => {
  it('deals 4+1 cards per captain and builds the right deck', () => {
    const s = rig(4);
    for (const p of s.players) {
      expect(p.hand).toHaveLength(5);
      expect(p.hand.filter((c) => c === 'containment')).toHaveLength(1);
    }
    expect(s.deck).toHaveLength(35); // (46 base - 16 dealt) + 3 ruptures + 2 leftover containments
    expect(s.deck.filter((c) => c === 'rupture')).toHaveLength(3);
    expect(s.deck.filter((c) => c === 'containment')).toHaveLength(2);
    expect(s.phase).toBe('command');
  });

  it('is deterministic for a given seed', () => {
    const a = rig(3, NOMOD, 7);
    const b = rig(3, NOMOD, 7);
    expect(a.deck).toEqual(b.deck);
    expect(a.activePlayer).toBe(b.activePlayer);
  });

  it('rejects bad player counts', () => {
    expect(() => rig(1)).toThrow();
    expect(() => rig(6)).toThrow();
  });
});

describe('rupture resolution', () => {
  it('auto-contains when a Containment Field is held, then waits for reinsertion', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['containment', 'burn'];
    s0.deck = ['rupture', 'scan', 'burn'];
    const before = s0.discard.length;
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('choice');
    expect(s1.awaiting).toEqual({ type: 'reinsert' });
    expect(s1.players[a].hand).toEqual(['burn']);
    expect(s1.discard.length).toBe(before + 1); // containment discarded
    expect(s1.deck[0]).toBe('scan'); // rupture is out of the deck, awaiting placement
  });

  it('eliminates a captain without containment and ends their debt', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['burn', 'scan'];
    s0.deck = ['rupture', 'scan'];
    s0.turnsOwed[a] = 2;
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.players[a].alive).toBe(false);
    expect(s1.players[a].hand).toEqual([]);
    expect(s1.rupturesOutOfGame).toBe(1);
    expect(s1.turnsOwed[a]).toBe(0);
    expect(s1.winner).toBeNull(); // 2 captains still flying
  });

  it('crowns the last flagship immediately (2p)', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    s0.players[a].hand = ['burn'];
    s0.deck = ['rupture'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('game_over');
    expect(s1.winner).not.toBe(a);
    expect(s1.winner).not.toBeNull();
  });

  it('reinserts at a legal position and ends the turn', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['containment'];
    s0.deck = ['rupture', 'scan', 'burn', 'flyby'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    const s2 = ok(applyCommand(s1, { type: 'REINSERT', player: a, positionFromTop: 3 }));
    expect(s2.deck).toEqual(['scan', 'burn', 'rupture', 'flyby']);
    expect(s2.phase).toBe('command');
    expect(s2.activePlayer).not.toBe(a); // turn passed on
  });
});

describe('reaction window & overrides', () => {
  it('a single Override cancels the action; the initiator keeps playing (E-9)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const others = s0.players.filter((p) => p.id !== a).map((p) => p.id);
    s0.players[a].hand = ['scan'];
    s0.players[others[0]].hand.push('override');
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(s1.phase).toBe('reaction');
    const s2 = ok(applyCommand(s1, { type: 'OVERRIDE', player: others[0] }));
    expect(s2.pending?.overrides).toHaveLength(1);
    const s3 = passAll(s2);
    expect(s3.log.some((e) => e.type === 'pending_cancelled')).toBe(true);
    expect(s3.log.some((e) => e.type === 'scan_seen')).toBe(false);
    expect(s3.phase).toBe('command');
    expect(s3.activePlayer).toBe(a); // turn did not end
  });

  it('two Overrides let the action through (parity)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const [b, c] = s0.players.filter((p) => p.id !== a).map((p) => p.id);
    s0.players[a].hand = ['scan'];
    s0.players[b].hand = ['override'];
    s0.players[c].hand = ['override'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    s = ok(applyCommand(s, { type: 'OVERRIDE', player: b }));
    s = ok(applyCommand(s, { type: 'OVERRIDE', player: c }));
    s = passAll(s);
    const scan = s.log.find((e) => e.type === 'scan_seen');
    expect(scan).toBeTruthy();
    expect((scan?.data?.cards as CardKind[]).length).toBe(3);
    expect(s.players[b].hand).not.toContain('override');
    expect(s.discard.filter((x) => x === 'override')).toHaveLength(2);
  });

  it('blocks illegal responses', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['scan'];
    s0.players[b].hand = ['burn']; // pinned: the dealt hand must not matter (v0.3 deck)
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(applyCommand(s1, { type: 'OVERRIDE', player: a })?.ok).toBe(false); // initiator
    expect(applyCommand(s1, { type: 'OVERRIDE', player: b })?.ok).toBe(false); // no override in hand
    expect(applyCommand(s1, { type: 'END_TURN_DRAW', player: a })?.ok).toBe(false); // wrong phase
  });
});

describe('turn debt (Forced Flyby) & turn-enders', () => {
  it('flyby gives the next captain 2 turns', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const next = (a + 1) % 3;
    s0.players[a].hand = ['flyby'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['flyby'] })));
    expect(s1.turnsOwed[next]).toBe(2);
    expect(s1.activePlayer).toBe(next);
  });

  it('flyby chains pass debt with interest (2 -> 3)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].hand = ['flyby'];
    s0.players[b].hand = ['flyby'];
    let s = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['flyby'] })));
    expect(s.turnsOwed[b]).toBe(2);
    s = passAll(ok(applyCommand(s, { type: 'PLAY', player: b, cards: ['flyby'] })));
    expect(s.turnsOwed[c]).toBe(3); // 2 + (2-1) interest
    expect(s.turnsOwed[b]).toBe(0);
  });

  it('debt is capped at 6', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const next = (a + 1) % 3;
    s0.turnsOwed[a] = 6;
    s0.players[a].hand = ['flyby'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['flyby'] })));
    expect(s1.turnsOwed[next]).toBe(6); // min(6, 2+5)
  });

  it('burn consumes one owed turn at a time', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.turnsOwed[a] = 2;
    s0.players[a].hand = ['burn'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['burn'] })));
    expect(s1.activePlayer).toBe(a); // another owed turn remains
    expect(s1.turnsOwed[a]).toBe(1);
    expect(s1.stats.drawsTotal).toBe(0);
  });

  it('reversal flips direction (3+ captains) and ends the turn', () => {
    const s0 = rig(4);
    const a = s0.activePlayer;
    s0.players[a].hand = ['reversal'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['reversal'] })));
    expect(s1.direction).toBe(-1);
    expect(s1.activePlayer).toBe((((a - 1) % 4) + 4) % 4);
  });

  it('reversal in 2p is just a burn', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    s0.players[a].hand = ['reversal'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['reversal'] })));
    expect(s1.direction).toBe(1);
    expect(s1.activePlayer).toBe(1 - a);
  });
});

