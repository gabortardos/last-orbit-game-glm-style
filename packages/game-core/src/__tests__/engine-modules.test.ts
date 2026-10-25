import { describe, expect, it } from 'vitest';
import {
  applyCommand, botCommand, createGame, eligibleReactorIds, furyDepthLimit, matchReport,
} from '../index';
import type { BotPolicy, GameState } from '../index';
import { NOMOD, ok, passAll, rngFrom } from './helpers';

describe('targeted actions', () => {
  it('requisition: giver chooses the card, then the initiator continues', () => {
    const s0 = createGame({ playerCount: 3, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['requisition'];
    s0.players[b].hand = ['burn', 'containment'];
    let s = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b })));
    expect(s.phase).toBe('choice');
    s = ok(applyCommand(s, { type: 'GIVE', player: b, card: 'burn' }));
    expect(s.players[a].hand).toContain('burn');
    expect(s.players[b].hand).toEqual(['containment']);
    expect(s.phase).toBe('command');
    expect(s.activePlayer).toBe(a);
  });

  it('requisition fizzles on an empty hand', () => {
    const s0 = createGame({ playerCount: 3, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['requisition'];
    s0.players[b].hand = [];
    const s = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b })));
    expect(s.stats.fizzles).toBe(1);
    expect(s.phase).toBe('command');
  });

  it('salvage retrieves non-restricted discards only', () => {
    const s0 = createGame({ playerCount: 3, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    s0.players[a].hand = ['salvage'];
    s0.discard = ['burn', 'containment'];
    const bad = applyCommand(s0, { type: 'PLAY', player: a, cards: ['salvage'], salvageKind: 'containment' });
    expect(bad.ok).toBe(false);
    const s = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['salvage'], salvageKind: 'burn' })));
    expect(s.players[a].hand).toContain('burn');
    expect(s.discard).not.toContain('burn');
    expect(s.stats.salvagesPlayed).toBe(1);
  });

  it('component pairs steal a random card; mismatches are rejected', () => {
    const s0 = createGame({ playerCount: 3, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['coolant', 'coolant', 'hull'];
    s0.players[b].hand = ['scan', 'burn', 'flyby'];
    expect(applyCommand(s0, { type: 'PLAY', player: a, cards: ['coolant', 'hull'], target: b }).ok).toBe(false);
    const s = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['coolant', 'coolant'], target: b })));
    expect(s.players[b].hand).toHaveLength(2);
    expect(s.players[a].hand).toHaveLength(2); // one coolant left + stolen card
    expect(s.stats.steals).toBe(1);
  });
});

describe('edge rules', () => {
  it('empty deck reshuffles the discard (E-1)', () => {
    const s0 = createGame({ playerCount: 2, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    s0.deck = [];
    s0.discard = ['burn', 'scan', 'flyby'];
    const s = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s.stats.reshuffles).toBe(1);
    expect(s.stats.drawsTotal).toBe(1);
    expect(s.deck).toHaveLength(2);
  });

  it('double-empty skips the draw (E-1)', () => {
    const s0 = createGame({ playerCount: 2, modules: NOMOD, seed: 5 });
    const a = s0.activePlayer;
    s0.deck = [];
    s0.discard = [];
    const s = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s.log.some((e) => e.type === 'skip_draw')).toBe(true);
    expect(s.activePlayer).toBe(1 - a);
  });
});

describe('Sun Fury module', () => {
  it('fury is capped at 5', () => {
    expect(furyDepthLimit(1)).toBe(Number.POSITIVE_INFINITY);
    expect(furyDepthLimit(2)).toBe(15);
    expect(furyDepthLimit(3)).toBe(10);
    expect(furyDepthLimit(4)).toBe(7);
    expect(furyDepthLimit(5)).toBe(5);
    const s0 = createGame({ playerCount: 3, modules: { sunFury: true, derelicts: false }, seed: 5 });
    const a = s0.activePlayer;
    s0.sunFury = 5;
    s0.players[a].hand = ['containment'];
    s0.deck = ['rupture', 'scan'];
    const s = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s.sunFury).toBe(5);
    expect(s.awaiting).toEqual({ type: 'reinsert' });
  });

  it('fury limits reinsertion depth', () => {
    const s0 = createGame({ playerCount: 3, modules: { sunFury: true, derelicts: false }, seed: 5 });
    const a = s0.activePlayer;
    s0.sunFury = 2; // containment will raise it to 3 → depth limit 10
    s0.players[a].hand = ['containment'];
    s0.deck = ['rupture', ...Array(15).fill('burn')];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.sunFury).toBe(3);
    expect(applyCommand(s1, { type: 'REINSERT', player: a, positionFromTop: 11 }).ok).toBe(false);
    expect(ok(applyCommand(s1, { type: 'REINSERT', player: a, positionFromTop: 10 })).deck[9]).toBe('rupture');
  });
});

describe('Derelict Interference module', () => {
  it('a derelict spends their single Final Transmission as an Override (E-8)', () => {
    const s0 = createGame({ playerCount: 3, modules: { sunFury: false, derelicts: true }, seed: 5 });
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    // eliminate b with a fatal rupture
    s0.players[b].hand = [];
    s0.deck = ['rupture'];
    s0.activePlayer = b;
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: b }));
    expect(s1.players[b].alive).toBe(false);
    // a plays scan; dead b transmits
    s1.activePlayer = a; // rig: the test wants a to act next
    s1.players[a].hand = ['scan'];
    const s2 = ok(applyCommand(s1, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(eligibleReactorIds(s2).includes(b)).toBe(true);
    const s3 = ok(applyCommand(s2, { type: 'OVERRIDE', player: b }));
    expect(s3.players[b].transmissionUsed).toBe(true);
    expect(applyCommand(s3, { type: 'OVERRIDE', player: b }).ok).toBe(false); // once ever
    const s4 = passAll(s3);
    expect(s4.log.some((e) => e.type === 'pending_cancelled')).toBe(true);
  });

  it('derelicts cannot transmit when the module is off', () => {
    const s0 = createGame({ playerCount: 3, modules: { sunFury: false, derelicts: false }, seed: 5 });
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].alive = false;
    s0.players[a].hand = ['scan'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(applyCommand(s1, { type: 'OVERRIDE', player: b }).ok).toBe(false);
  });
});

describe('bots & full games', () => {
  function runGame(policy: BotPolicy, seed: number, playerCount = 4): GameState {
    let s = createGame({ playerCount, modules: { sunFury: true, derelicts: true }, seed });
    const rng = rngFrom(seed * 7919 + 13);
    let guard = 0;
    while (s.phase !== 'game_over' && guard++ < 2000) {
      const cmd = botCommand(s, policy, rng);
      if (!cmd) break;
      s = ok(applyCommand(s, cmd));
    }
    expect(s.phase).toBe('game_over');
    return s;
  }

  it('random bots finish a 4p match deterministically', () => {
    const a = runGame('random', 123);
    expect(a.winner).not.toBeNull();
    const report = matchReport(a);
    expect(report.turns).toBeGreaterThan(4);
    expect(report.rupturesFatal).toBe(3);
    const b = runGame('random', 123);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
  });

  it('greedy bots finish matches at every player count', () => {
    for (const n of [2, 3, 4, 5]) {
      const s = runGame('greedy', 999 + n, n);
      expect(s.winner).not.toBeNull();
      expect(matchReport(s).rupturesFatal).toBe(n - 1);
    }
  });
});

