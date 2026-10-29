import { describe, expect, it } from 'vitest';
import { applyCommand, createGame, openRespondents } from '../index';
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
    expect(s.pending?.passed).toEqual([b, d]); // b's Deflector is spent and d never had one — both auto-passed (D-020); only c can still act
    s = ok(applyCommand(s, { type: 'DEFLECT', player: c, target: d }));
    // both deflectors spent, nobody holds an Override → the window self-resolves (D-020)
    expect(s.pending).toBeNull();
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
    // theft never scales (D-018) and — nobody left able to respond — the window self-resolves (D-020)
    expect(s.pending).toBeNull();
    expect(s.stats.maxGrowth).toBe(0);
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
    s0.players[a].hand = ['ion_surge', 'scan', 'burn', 'flyby', 'slingshot', 'coolant'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = ['deflector'];
    s0.players[d].hand = ['deflector'];
    s0.players[e].hand = ['deflector', 'reversal', 'salvage'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: c }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: c, target: d }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: d, target: e }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: e, target: a })); // growth 4 → capped at 3
    // every deflector is spent and nobody holds an Override → the window self-resolves (D-020)
    expect(s.phase).toBe('command');
    expect(s.pending).toBeNull();
    expect(s.stats.maxGrowth).toBe(3);
    s = passAll(s);
    expect(s.players[a].hand).toHaveLength(1); // 6 cards − ⚡ played − (1 + 3 capped) jettisoned
    expect(s.stats.maxGrowth).toBe(3);
  });

  it('in 2p the attacker may deflect the bounce right back (D-022)', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    const b = 1 - a;
    s0.players[a].hand = ['ion_surge', 'deflector', 'scan', 'burn', 'coolant', 'hull'];
    s0.players[b].hand = ['deflector', 'burn', 'coolant'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: a })); // bounce — growth 1
    // the window now waits on the bounced initiator: they are the target and hold an unused ↪️
    expect(s.pending).not.toBeNull();
    expect(s.pending?.target).toBe(a);
    expect(openRespondents(s)).toEqual([a]);
    s = ok(applyCommand(s, { type: 'DEFLECT', player: a, target: b })); // pass the problem right back — growth 2
    // both deflectors are spent → nobody can respond → the chain self-resolves on b
    expect(s.pending).toBeNull();
    expect(s.stats.deflections).toBe(2);
    expect(s.stats.maxGrowth).toBe(2);
    expect(s.players[b].hand).toHaveLength(0); // 3 − ↪️ spent − (1 + growth 2) jettisoned
    expect(s.players[a].hand).toHaveLength(4); // ⚡ played + ↪️ spent, otherwise untouched
  });

  it('a bounced initiator holding no Deflector is skipped instantly — even with a 📡 in hand', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    const b = 1 - a;
    s0.players[a].hand = ['ion_surge', 'override', 'scan', 'burn'];
    s0.players[b].hand = ['deflector', 'coolant'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: a }));
    // an Override never lets you cancel your own action (§4.1) → nothing to decide → resolved
    expect(s.pending).toBeNull();
    expect(s.log.some((e) => e.type === 'override')).toBe(false);
    expect(s.players[a].hand).toHaveLength(1); // ⚡ played − (1 + growth 1) jettisoned
  });

  it('a bounced initiator may simply take the hit — the window waits for their choice (3p)', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].hand = ['ion_surge', 'deflector', 'scan', 'burn', 'coolant'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = ['burn', 'flyby'];
    let s = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(s.pending?.passed).toEqual([c]); // c is powerless (D-020); b still holds a live ↪️
    s = ok(applyCommand(s, { type: 'DEFLECT', player: b, target: a })); // bounce at the attacker
    expect(s.pending).not.toBeNull(); // the attacker holds a ↪️ — their call now
    expect(openRespondents(s)).toEqual([a]);
    expect(applyCommand(s, { type: 'OVERRIDE', player: a }).ok).toBe(false); // never their own action
    s = ok(applyCommand(s, { type: 'PASS', player: a })); // "let it happen" must be accepted
    expect(s.pending).toBeNull();
    expect(s.players[a].hand).toHaveLength(2); // ⚡ played, ↪️ kept, (1 + growth 1) jettisoned
    expect(s.phase).toBe('command');
  });
});

describe('reaction window auto-skip (D-020)', () => {
  it('resolves immediately when nobody can respond — no forced passes', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    s0.players[a].hand = ['flyby'];
    for (const p of s0.players) if (p.id !== a) p.hand = ['burn']; // nothing to respond with
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['flyby'] }));
    expect(s1.phase).toBe('command');
    expect(s1.pending).toBeNull();
    expect(s1.activePlayer).not.toBe(a); // flyby resolved and ended the turn
    expect(s1.log.some((e) => e.type === 'flyby_debt')).toBe(true);
  });

  it('only asks captains who can respond; the powerless are auto-passed', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const others = s0.players.filter((p) => p.id !== a).map((p) => p.id);
    s0.players[a].hand = ['scan'];
    s0.players[others[0]].hand = ['burn']; // no response possible
    s0.players[others[1]].hand = ['override'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(s1.phase).toBe('reaction');
    expect(s1.pending?.passed).toContain(others[0]);
    expect(s1.pending?.passed).not.toContain(others[1]);
    expect(applyCommand(s1, { type: 'PASS', player: others[0] }).ok).toBe(false); // already auto-passed
  });

  it('keeps a target holding a Deflector; after they deflect, the chain can self-resolve', () => {
    const s0 = rig(3);
    const a = s0.activePlayer;
    const [t1, t2] = s0.players.filter((p) => p.id !== a).map((p) => p.id);
    s0.players[a].hand = ['boarding'];
    s0.players[t1].hand = ['deflector'];
    s0.players[t2].hand = ['burn'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: t1 }));
    expect(s1.phase).toBe('reaction');
    expect(s1.pending?.passed).toContain(t2); // bystander skipped
    expect(s1.pending?.passed).not.toContain(t1); // target still holds a live Deflector
    const s2 = ok(applyCommand(s1, { type: 'DEFLECT', player: t1, target: t2 }));
    expect(s2.phase).toBe('command'); // new target powerless, deflector spent → resolves instantly
    expect(s2.pending).toBeNull();
    expect(s2.log.some((e) => e.type === 'deflect')).toBe(true);
    expect(s2.log.some((e) => e.type === 'steal')).toBe(true); // boarding executed on the new target
  });

  it('a chosen PASS from an Override holder is still legal and closes the window', () => {
    const s0 = rig(2);
    const a = s0.activePlayer;
    const b = s0.players.find((p) => p.id !== a)!.id;
    s0.players[a].hand = ['scan'];
    s0.players[b].hand = ['override'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(s1.phase).toBe('reaction'); // b CAN respond, so the window waits
    const s2 = ok(applyCommand(s1, { type: 'PASS', player: b })); // deliberate pass, card kept
    expect(s2.phase).toBe('command');
    expect(s2.players[b].hand).toContain('override');
    expect(s2.log.some((e) => e.type === 'scan_seen')).toBe(true);
  });

  it('Derelicts with an armed Final Transmission are still asked; only the powerless are skipped', () => {
    const s0 = createGame({ playerCount: 3, modules: { sunFury: false, derelicts: true }, seed: 5 });
    const a = s0.activePlayer;
    const [dead, alive] = s0.players.filter((p) => p.id !== a).map((p) => p.id);
    s0.players[a].hand = ['scan'];
    s0.players[dead].alive = false; // derelict, transmission armed
    s0.players[dead].hand = [];
    s0.players[alive].hand = ['burn']; // powerless bystander
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['scan'] }));
    expect(s1.phase).toBe('reaction');
    expect(s1.pending?.passed).toContain(alive);
    expect(s1.pending?.passed).not.toContain(dead);
    const s2 = ok(applyCommand(s1, { type: 'OVERRIDE', player: dead })); // Final Transmission
    // transmission now spent + bystander powerless → the window self-resolves: action cancelled (D-020)
    expect(s2.pending).toBeNull();
    expect(s2.phase).toBe('command');
    expect(s2.players[dead].transmissionUsed).toBe(true);
    expect(s2.log.some((e) => e.type === 'pending_cancelled')).toBe(true);
    expect(s2.log.some((e) => e.type === 'scan_seen')).toBe(false);
  });
});
