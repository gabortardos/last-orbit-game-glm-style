import { describe, expect, it } from 'vitest';
import { applyCommand, botCommandFor, createGame, openRespondents } from '../index';
import type { GameState } from '../index';
import { NOMOD, ok, passAll, rngFrom } from './helpers';

/** D-029 — faction layer pilot: ☿ Mercury "Flare Skip" (docs/14 §Pilot).
 *  Once per match, when attacked, redirect as if playing ↪️ — no card paid.
 *  Chain rules are ↪️'s: growth on destruction, once per captain per chain (shared
 *  with ↪️), one 📡 kills the chain. Vanilla configs are untouched by all of this. */
function rig(n = 3, seed = 5): GameState {
  return createGame({ playerCount: n, modules: NOMOD, seed });
}

describe('☿ faction layer — config', () => {
  it('maps per-seat factions from config; absent config = classic for everyone', () => {
    const s = createGame({ playerCount: 3, modules: NOMOD, seed: 5, factions: ['flareskip', null, 'flareskip'] });
    expect(s.players[0].faction).toBe('flareskip');
    expect(s.players[1].faction).toBeNull();
    expect(s.players[2].faction).toBe('flareskip');
    expect(s.players.map((p) => p.factionPowerUsed)).toEqual([false, false, false]);
    const vanilla = rig();
    expect(vanilla.players.every((p) => p.faction === null)).toBe(true);
  });
});

describe('☿ Flare Skip — engine', () => {
  it('redirects an attack for free: no card paid, payload grows, power burns publicly', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = ['scan']; // no ↪️, no 📡 — the power is all they have
    s0.players[c].hand = ['hull', 'hull'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(s1.phase).toBe('reaction');
    // the window WAITS on a flare-capable target even with no 📡/↪️ in hand (D-020 + D-029)
    expect(openRespondents(s1)).toContain(b);
    const s2 = ok(applyCommand(s1, { type: 'FLARE_SKIP', player: b, target: c }));
    expect(s2.players[b].hand).toEqual(['scan']); // nothing paid
    expect(s2.players[b].factionPowerUsed).toBe(true); // spent = public
    expect(s2.stats.flareSkips).toBe(1);
    expect(s2.log.some((e) => e.type === 'flare_skip' && e.data?.by === b)).toBe(true);
    // c couldn't respond → the chain resolved: 1 card + growth 1 = 2 destroyed
    expect(s2.phase).toBe('command');
    expect(s2.players[c].hand).toHaveLength(0);
    expect(s2.stats.forcedDiscards).toBe(2);
  });
});
describe('☿ Flare Skip — growth & redirect semantics', () => {
  it('theft only moves: a Flare-Skipped requisition does not grow, and lands on the new target', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['requisition'];
    s0.players[b].hand = [];
    s0.players[c].hand = ['burn'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    const s2 = ok(applyCommand(s1, { type: 'FLARE_SKIP', player: b, target: c }));
    expect(s2.pending?.growth ?? 0).toBe(0); // D-018: theft never scales
    expect(s2.phase).toBe('choice');
    expect(s2.awaiting).toEqual({ type: 'give', from: c, to: a });
  });
});

describe('☿ Flare Skip — limits', () => {
  it('is once per match — the second attempt in a NEW chain is refused', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['ion_surge', 'boarding'];
    s0.players[b].hand = ['scan', 'override']; // override keeps the 2nd window open for the assert
    s0.players[c].hand = ['hull', 'hull'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    const s2 = ok(applyCommand(s1, { type: 'FLARE_SKIP', player: b, target: c }));
    // b's override keeps the first window open — close it before the second chain
    const s2r = passAll(s2);
    // second chain, same match
    const s3 = ok(applyCommand(s2r, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(s3.phase).toBe('reaction');
    const r = applyCommand(s3, { type: 'FLARE_SKIP', player: b, target: c });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('Flare Skip already spent this match');
  });

  it('shares the once-per-captain-per-chain limit with ↪️', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = ['deflector', 'override']; // override keeps the bounced window open
    s0.players[c].hand = ['deflector'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    const s2 = ok(applyCommand(s1, { type: 'FLARE_SKIP', player: b, target: c }));
    // c bounces it back at b — b is the target again but already redirected this chain
    const s3 = ok(applyCommand(s2, { type: 'DEFLECT', player: c, target: b }));
    expect(s3.pending?.target).toBe(b);
    const rCard = applyCommand(s3, { type: 'DEFLECT', player: b, target: a });
    expect(rCard.ok).toBe(false);
    if (!rCard.ok) expect(rCard.error).toBe('already deflected in this chain');
    const rFlare = applyCommand(s3, { type: 'FLARE_SKIP', player: b, target: a });
    expect(rFlare.ok).toBe(false); // ...and the power is spent anyway
  });
});


describe('☿ Flare Skip — D-022 mirror & guards', () => {
  it('a bounced-back attacker may Flare Skip their own attack onward (D-022 mirror)', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].faction = 'flareskip';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = ['deflector'];
    s0.players[c].hand = ['override']; // keeps the final window open so pending survives to assert
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    const s2 = ok(applyCommand(s1, { type: 'DEFLECT', player: b, target: a }));
    expect(s2.pending?.target).toBe(a);
    const s3 = ok(applyCommand(s2, { type: 'FLARE_SKIP', player: a, target: b }));
    expect(s3.pending?.target).toBe(b);
    expect(s3.pending?.deflectors).toEqual([b, a]);
  });

  it('guards: only the target, only faction pilots, vanilla untouched', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = [];
    s0.players[c].hand = ['scan'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    const notTarget = applyCommand(s1, { type: 'FLARE_SKIP', player: c, target: b });
    expect(notTarget.ok).toBe(false);
    if (!notTarget.ok) expect(notTarget.error).toBe('only the current target may deflect');
    const vanilla = rig(3, 9);
    const x = vanilla.activePlayer;
    const y = (x + 1) % 3;
    const z = (x + 2) % 3;
    vanilla.players[x].hand = ['boarding'];
    vanilla.players[y].hand = ['scan'];
    vanilla.players[z].hand = ['override']; // keeps the window open: classic seats see no power anyway
    const v1 = ok(applyCommand(vanilla, { type: 'PLAY', player: x, cards: ['boarding'], target: y }));
    expect(v1.phase).toBe('reaction');
    const r = applyCommand(v1, { type: 'FLARE_SKIP', player: y, target: z });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('no faction power available');
    expect(v1.stats.flareSkips).toBe(0);
  });
});

describe('☿ Flare Skip — bots', () => {
  it('greedy: attacked flare bot fires the free redirect at the biggest rival hand', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = ['scan']; // no ↪️ to fall back on — power first anyway
    s0.players[c].hand = ['hull', 'hull', 'coolant'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(botCommandFor(s1, b, 'greedy', rngFrom(1))).toEqual({ type: 'FLARE_SKIP', player: b, target: c });
    // power spent → nothing left to do but stand down
    const spent = { ...s1, players: s1.players.map((p) => (p.id === b ? { ...p, factionPowerUsed: true } : p)) };
    expect(botCommandFor(spent, b, 'greedy', rngFrom(1))?.type).toBe('PASS');
  });

  it('random: sometimes grabs the free redirect, sometimes lets it ride', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'flareskip';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = [];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(botCommandFor(s1, b, 'random', () => 0.5)?.type).toBe('FLARE_SKIP');
    expect(botCommandFor(s1, b, 'random', () => 0.99)?.type).toBe('PASS');
  });
});


