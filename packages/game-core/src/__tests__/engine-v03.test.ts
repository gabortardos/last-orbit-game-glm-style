import { describe, expect, it } from 'vitest';
import { applyCommand, createGame } from '../index';
import type { CardKind, GameState } from '../index';
import { NOMOD, ok, passAll } from './helpers';

function rig(n = 3, seed = 5): GameState {
  return createGame({ playerCount: n, modules: NOMOD, seed });
}

describe('v0.3 deck', () => {
  it('adds the ten new cards (deck math: 57 total at 4 captains)', () => {
    const s = rig(4);
    const total: CardKind[] = [...s.deck, ...s.players.flatMap((p) => p.hand)];
    expect(total).toHaveLength(55); // 46 base (post-sim trim: −1 🔭, −1 🌀) + 3 ☀️ + 6 🛡️
    for (const k of ['ion_surge', 'tractor', 'deflector', 'storm', 'wind'] as const) {
      expect(total.filter((c) => c === k)).toHaveLength(2);
    }
  });
});

describe('☄️ Micrometeoroid Storm (draw-step danger)', () => {
  it('forces a jettison of 1 chosen card, then the storm itself is discarded', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['burn', 'scan'];
    s0.deck = ['storm', 'flyby'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('choice');
    expect(s1.awaiting).toEqual({ type: 'storm_discard', player: a });
    const s2 = ok(applyCommand(s1, { type: 'STORM_DISCARD', player: a, card: 'burn' }));
    expect(s2.players[a].hand).toEqual(['scan']);
    expect(s2.discard).toEqual(expect.arrayContaining(['burn', 'storm']));
    expect(s2.phase).toBe('command');
    expect(s2.activePlayer).not.toBe(a); // turn ended
  });

  it('fizzles against an empty hand', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = [];
    s0.deck = ['storm', 'flyby'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('command');
    expect(s1.awaiting).toBeNull();
    expect(s1.discard).toContain('storm');
    expect(s1.log.some((e) => e.type === 'storm_fizzle')).toBe(true);
  });

  it('can hit as a 🌟 wind bonus draw (the promise is fulfilled by the storm)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['burn'];
    s0.deck = ['wind', 'storm', 'scan'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('choice');
    expect(s1.awaiting).toEqual({ type: 'storm_discard', player: a });
    expect(s1.players[a].hand).toEqual(['burn', 'wind']);
    // jettison the useless wind, turn ends; the scan was never owed
    const s2 = ok(applyCommand(s1, { type: 'STORM_DISCARD', player: a, card: 'wind' }));
    expect(s2.players[a].hand).toEqual(['burn']);
    expect(s2.deck[0]).toBe('scan');
    expect(s2.stats.drawsTotal).toBe(2);
  });
});

describe('🌟 Solar Wind (draw-step boon)', () => {
  it('grants one extra draw immediately', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['burn'];
    s0.deck = ['wind', 'scan'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.players[a].hand).toEqual(['burn', 'wind', 'scan']);
    expect(s1.stats.drawsTotal).toBe(2);
    expect(s1.phase).toBe('command');
    expect(s1.activePlayer).not.toBe(a);
  });

  it('a bonus draw that reveals a contained rupture still reinserts and ends the turn', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['containment', 'burn'];
    s0.deck = ['wind', 'rupture', 'scan'];
    const s1 = ok(applyCommand(s0, { type: 'END_TURN_DRAW', player: a }));
    expect(s1.phase).toBe('choice');
    expect(s1.players[a].hand).toEqual(expect.arrayContaining(['burn', 'wind']));
    expect(s1.players[a].hand).not.toContain('containment');
    const s2 = ok(applyCommand(s1, { type: 'REINSERT', player: a, positionFromTop: 1 }));
    expect(s2.deck[0]).toBe('rupture');
    expect(s2.phase).toBe('command');
    expect(s2.activePlayer).not.toBe(a); // no further draws owed
  });
});

describe('🔧 Scrap (lone Component floor use)', () => {
  it('discards the Component and peeks at the top card privately', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['coolant'];
    s0.deck = ['scan', 'burn'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['coolant'] })));
    expect(s1.stats.scrapsPlayed).toBe(1);
    expect(s1.discard).toContain('coolant');
    expect(s1.deck[0]).toBe('scan'); // peeked, not taken
    const peek = s1.log.find((e) => e.type === 'scrap_seen');
    expect(peek).toBeTruthy();
    expect(peek?.visibility).toEqual({ only: a });
    expect(peek?.data?.cards).toEqual(['scan']);
    expect(s1.phase).toBe('command');
    expect(s1.activePlayer).toBe(a); // initiator continues
  });

  it('is contestable like any action — one Override cancels the peek', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['hull'];
    s0.players[b].hand = ['override'];
    s0.deck = ['scan'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['hull'] }));
    s = ok(applyCommand(s, { type: 'OVERRIDE', player: b }));
    s = passAll(s);
    expect(s.stats.cancelledActions).toBe(1);
    expect(s.log.some((e) => e.type === 'scrap_seen')).toBe(false);
    expect(s.discard).toEqual(expect.arrayContaining(['hull', 'override']));
  });

  it('still rejects non-action singles', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['deflector', 'containment'];
    expect(applyCommand(s0, { type: 'PLAY', player: a, cards: ['deflector'] }).ok).toBe(false);
    expect(applyCommand(s0, { type: 'PLAY', player: a, cards: ['containment'] }).ok).toBe(false);
  });
});

describe('⚡ Ion Surge', () => {
  it('makes the target jettison 1 random card (destroyed, not stolen)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = ['scan', 'burn', 'flyby'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b })));
    expect(s1.players[b].hand).toHaveLength(2);
    expect(s1.players[a].hand).toHaveLength(0); // nothing gained
    expect(s1.stats.forcedDiscards).toBe(1);
    expect(s1.discard).toContain('ion_surge');
    const destroyed = (['scan', 'burn', 'flyby'] as CardKind[]).filter((c) => s1.discard.includes(c));
    expect(destroyed).toHaveLength(1);
  });

  it('fizzles on an empty hand', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = [];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b })));
    expect(s1.stats.fizzles).toBe(1);
    expect(s1.phase).toBe('command');
  });
});

describe('🧲 Tractor Snag', () => {
  it('forces the target down to 3 cards of their choosing, then the initiator continues', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['tractor'];
    s0.players[b].hand = ['scan', 'burn', 'flyby', 'slingshot', 'reversal'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['tractor'], target: b })));
    expect(s1.phase).toBe('choice');
    expect(s1.awaiting).toEqual({ type: 'snag_discard', player: b, count: 2 });
    expect(applyCommand(s1, { type: 'SNAG_DISCARD', player: b, cards: ['scan'] }).ok).toBe(false); // wrong count
    const s2 = ok(applyCommand(s1, { type: 'SNAG_DISCARD', player: b, cards: ['scan', 'burn'] }));
    expect(s2.players[b].hand).toEqual(['flyby', 'slingshot', 'reversal']);
    expect(s2.discard).toEqual(expect.arrayContaining(['tractor', 'scan', 'burn']));
    expect(s2.phase).toBe('command');
    expect(s2.activePlayer).toBe(a);
  });

  it('is pointless against a hand of 3 or fewer (fizzle)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].hand = ['tractor'];
    s0.players[b].hand = ['scan', 'burn', 'flyby'];
    const s1 = passAll(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['tractor'], target: b })));
    expect(s1.stats.fizzles).toBe(1);
    expect(s1.players[b].hand).toHaveLength(3);
  });
});

describe('↪️ Deflector (escalation)', () => {
  it('redirects a ⚡ surge and grows its payload each hop', () => {
    const s0 = rig(4);
    const a = s0.activePlayer;
    const [b, c, d] = [0, 1, 2, 3].filter((i) => i !== a);
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = ['deflector'];
    s0.players[d].hand = ['scan', 'burn', 'flyby', 'slingshot'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: c }));
    expect(s.pending?.target).toBe(c);
    expect(s.pending?.growth).toBe(1);
    expect(s.pending?.deflectors).toEqual([b]);
    expect(s.pending?.passed).toEqual([]); // window reopened
    s = ok(applyCommand(s, { type: 'DEFLECT', player: c, target: d }));
    expect(s.pending?.growth).toBe(2);
    s = passAll(s);
    expect(s.players[d].hand).toHaveLength(1); // 1 + growth 2 = 3 jettisoned
    expect(s.stats.deflections).toBe(2);
    expect(s.stats.maxGrowth).toBe(2);
  });

  it('enforces who/when/how: target-only, card in hand, once per chain, targeted attacks only', () => {
    const s0 = rig(4);
    const a = s0.activePlayer;
    const [b, c, d] = [0, 1, 2, 3].filter((i) => i !== a);
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = [];
    s0.players[d].hand = ['scan', 'burn'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(applyCommand(s1, { type: 'DEFLECT', player: c, target: d }).ok).toBe(false); // not the target
    const s2 = ok(applyCommand(s1, { type: 'DEFLECT', player: b, target: c }));
    expect(applyCommand(s2, { type: 'DEFLECT', player: b, target: d }).ok).toBe(false); // once per chain
    expect(applyCommand(s2, { type: 'DEFLECT', player: c, target: d }).ok).toBe(false); // no card in hand
    // untargeted actions cannot be deflected
    const s3 = rig(3);
    const e = s3.activePlayer;
    const f = (e + 1) % 3;
    s3.players[e].hand = ['scan'];
    s3.players[f].hand = ['deflector'];
    const s4 = ok(applyCommand(s3, { type: 'PLAY', player: e, cards: ['scan'] }));
    expect(applyCommand(s4, { type: 'DEFLECT', player: f, target: e }).ok).toBe(false);
  });

  it('one Override cancels the entire chain — deflectors lose their cards too', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].hand = ['ion_surge', 'scan'];
    s0.players[b].hand = ['deflector', 'burn', 'flyby'];
    s0.players[c].hand = ['override', 'coolant'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: c }));
    s = ok(applyCommand(s, { type: 'OVERRIDE', player: c }));
    s = passAll(s);
    expect(s.stats.cancelledActions).toBe(1);
    expect(s.players[b].hand).toEqual(['burn', 'flyby']); // deflector spent, nothing else lost
    expect(s.players[c].hand).toEqual(['coolant']);
    expect(s.log.some((e) => e.type === 'forced_discard')).toBe(false);
    expect(s.discard).toEqual(expect.arrayContaining(['ion_surge', 'deflector', 'override']));
    expect(s.phase).toBe('command');
    expect(s.activePlayer).toBe(a); // initiator's Command Phase resumes (E-9)
  });

  it('redirects theft without growing it', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].hand = ['boarding', 'scan'];
    s0.players[b].hand = ['deflector', 'burn'];
    s0.players[c].hand = ['flyby', 'coolant', 'hull'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: c }));
    expect(s.pending?.growth).toBe(0); // theft never scales (D-018)
    s = passAll(s);
    expect(s.players[c].hand).toHaveLength(2); // robbed instead of b
    expect(s.players[a].hand).toHaveLength(2); // scan + the loot
    expect(s.players[b].hand).toEqual(['burn']);
    expect(s.stats.steals).toBe(1);
  });

  it('in 2p it bounces straight back to the attacker, grown', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    const b = 1 - a;
    s0.players[a].hand = ['ion_surge', 'scan', 'burn', 'flyby'];
    s0.players[b].hand = ['deflector', 'coolant', 'hull', 'slingshot'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: a }));
    s = passAll(s);
    expect(s.stats.deflections).toBe(1);
    expect(s.players[a].hand).toHaveLength(1); // played surge, then jettisoned 2 (1 + growth)
    expect(s.players[b].hand).toHaveLength(3); // deflector spent
  });

  it('caps payload growth at +3 across a whole chain', () => {
    const s0 = rig(5);
    const a = s0.activePlayer;
    const [b, c, d, e] = [0, 1, 2, 3, 4].filter((i) => i !== a);
    s0.players[a].hand = ['ion_surge', 'scan', 'burn', 'flyby', 'slingshot'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = ['deflector'];
    s0.players[d].hand = ['deflector'];
    s0.players[e].hand = ['deflector', 'reversal', 'salvage'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: c }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: c, target: d }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: d, target: e }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: e, target: a })); // growth 4 → capped at 3
    expect(s.pending?.growth).toBe(3);
    s = passAll(s);
    expect(s.players[a].hand).toEqual([]); // jettisoned 1 + 3
    expect(s.stats.maxGrowth).toBe(3);
  });
});
