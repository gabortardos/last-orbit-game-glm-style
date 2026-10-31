import { describe, expect, it } from 'vitest';
import { applyCommand, botCommandFor, createGame, openRespondents } from '../index';
import type { GameState } from '../index';
import { NOMOD, ok, passAll, rngFrom } from './helpers';

/** D-033 — faction layer v3: 🌍 Kit Bash, ♄ Ringwall, ♅ Axial Tilt, ♆ Deep Sight.
 *  All once per match, all opt-in, all spent publicly (Pillar 4). Same shape as v2. */
function rig(n = 3, seed = 5): GameState {
  return createGame({ playerCount: n, modules: NOMOD, seed });
}

describe('🌍 Kit Bash — engine', () => {
  it('one part and tape: a single Component siphons like a full pair', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].faction = 'kitbash';
    s0.players[a].hand = ['coolant', 'burn'];
    s0.players[b].hand = ['scan', 'flyby'];
    s0.players[c].hand = ['override']; // holds the window open so the siphon itself is observable
    const s1 = ok(applyCommand(s0, { type: 'KIT_BASH', player: a, card: 'coolant', target: b }));
    expect(s1.phase).toBe('reaction'); // a real pair window — not an instant steal
    expect(s1.pending?.reason).toBe('pair');
    expect(s1.pending?.target).toBe(b);
    expect(s1.pending?.cards).toEqual(['coolant']); // one part + tape
    expect(s1.players[a].hand).toEqual(['burn']); // the Component is paid
    expect(s1.discard).toContain('coolant');
    expect(s1.players[a].factionPowerUsed).toBe(true); // spent = public
    expect(s1.stats.kitBashes).toBe(1);
    expect(s1.log.some((e) => e.type === 'kit_bash' && e.data?.player === a)).toBe(true);
    const s2 = ok(applyCommand(s1, { type: 'PASS', player: c }));
    expect(s2.phase).toBe('command');
    expect(s2.players[b].hand.length).toBe(1); // siphoned
    expect(s2.players[a].hand.length).toBe(2); // burn + the loot
    expect(s2.stats.steals).toBe(1);
  });

  it('one 📡 cancels the siphon — but the bash (and the part) is still spent, baitable like ♂', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].faction = 'kitbash';
    s0.players[a].hand = ['coolant'];
    s0.players[b].hand = ['scan', 'flyby'];
    s0.players[c].hand = ['override'];
    const s1 = ok(applyCommand(s0, { type: 'KIT_BASH', player: a, card: 'coolant', target: b }));
    const s2 = ok(applyCommand(s1, { type: 'OVERRIDE', player: c }));
    expect(s2.phase).toBe('command'); // cancelled — a's turn continues
    expect(s2.players[b].hand.length).toBe(2); // nothing stolen
    expect(s2.players[a].hand).toEqual([]); // part paid, gone
    expect(s2.players[a].factionPowerUsed).toBe(true); // burned at initiation, not success
    expect(s2.stats.kitBashes).toBe(1);
  });

  it('the victim may ↪️ the siphon onward (pair rules apply, no growth — theft never scales)', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].faction = 'kitbash';
    s0.players[a].hand = ['coolant'];
    s0.players[b].hand = ['deflector', 'scan'];
    s0.players[c].hand = ['override', 'flyby']; // the override holds the reopened window observably open
    const s1 = ok(applyCommand(s0, { type: 'KIT_BASH', player: a, card: 'coolant', target: b }));
    const s2 = ok(applyCommand(s1, { type: 'DEFLECT', player: b, target: c }));
    expect(s2.phase).toBe('reaction');
    expect(s2.pending?.target).toBe(c);
    expect(s2.pending?.growth ?? 0).toBe(0); // theft only moves (D-018)
    const s3 = passAll(s2);
    expect(s3.players[c].hand.length).toBe(1); // the siphon lands on c instead
    expect(s3.players[a].hand.length).toBe(1); // ...and a still collects
  });

  it('guards: components only, in hand, own turn', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].faction = 'kitbash';
    s0.players[a].hand = ['burn'];
    s0.players[b].hand = ['coolant', 'scan'];
    const notComponent = applyCommand(s0, { type: 'KIT_BASH', player: a, card: 'burn', target: b });
    if (!notComponent.ok) expect(notComponent.error).toBe('Kit Bash needs a ❄️/🛠️ Component');
    expect(notComponent.ok).toBe(false);
    const notInHand = applyCommand(s0, { type: 'KIT_BASH', player: a, card: 'coolant', target: b });
    if (!notInHand.ok) expect(notInHand.error).toBe('that Component is not in hand');
    expect(notInHand.ok).toBe(false);
    const notYourTurn = applyCommand(s0, { type: 'KIT_BASH', player: b, card: 'coolant', target: a });
    if (!notYourTurn.ok) expect(notYourTurn.error).toBe('not your turn');
    expect(notYourTurn.ok).toBe(false);
  });
});

describe('♄ Ringwall — engine', () => {
  it("a 🪝 Boarding theft dies on the rings: attacker's card spent, ♄ keeps everything, window closes instantly", () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'ringwall';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = ['scan', 'burn'];
    s0.players[c].hand = ['override']; // would keep the window open — the wall doesn't care
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(s1.phase).toBe('reaction');
    expect(openRespondents(s1)).toContain(b); // the window waits on ♄ even with no 📡/↪️ in hand
    const s2 = ok(applyCommand(s1, { type: 'RING_WALL', player: b }));
    expect(s2.phase).toBe('command'); // resolved mid-window — nothing left to 📡
    expect(s2.pending).toBeNull();
    expect(s2.players[b].hand.length).toBe(2); // the rings hold
    expect(s2.players[a].hand).toEqual([]); // the attacker's card was spent at PLAY
    expect(s2.discard).toContain('boarding');
    expect(s2.players[b].factionPowerUsed).toBe(true); // spent = public
    expect(s2.stats.ringWalls).toBe(1);
    expect(s2.log.some((e) => e.type === 'ring_wall' && e.data?.by === b)).toBe(true);
  });

  it('answers requisitions too — no tribute is ever paid; but ⚡/🧲 vandalism passes the rings', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'ringwall';
    s0.players[a].hand = ['requisition', 'ion_surge'];
    s0.players[b].hand = ['override', 'scan', 'burn']; // b's 📡 holds the ⚡ window open for the guard check
    const req = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    const walled = ok(applyCommand(req, { type: 'RING_WALL', player: b }));
    expect(walled.phase).toBe('command');
    expect(walled.pending).toBeNull();
    expect(walled.awaiting).toBeNull(); // no gift choice ever opens
    expect(walled.players[b].hand.length).toBe(3);
    const surge = ok(applyCommand(walled, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    const notTheft = applyCommand(surge, { type: 'RING_WALL', player: b });
    if (!notTheft.ok) expect(notTheft.error).toBe('the rings answer thefts aimed at you, once per match');
    expect(notTheft.ok).toBe(false); // destruction is not robbery — the counterplay stands
  });

  it('once per match — the second theft goes through', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'ringwall';
    s0.players[a].hand = ['boarding', 'boarding'];
    s0.players[b].hand = ['scan', 'burn'];
    const w1 = ok(applyCommand(ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b })), { type: 'RING_WALL', player: b }));
    expect(w1.stats.ringWalls).toBe(1);
    const secondPlay = ok(applyCommand(w1, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    const spent = applyCommand(secondPlay, { type: 'RING_WALL', player: b });
    expect(spent.ok).toBe(false); // already spent this match
    const done = passAll(secondPlay);
    expect(done.players[b].hand.length).toBe(1); // a normal theft this time
    expect(done.players[a].hand.length).toBe(1);
  });

  it('the window waits on ♄ even when their hand is empty (canRespond wiring)', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'ringwall';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = []; // nothing to steal, everything to protect
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(s1.phase).toBe('reaction');
    expect(openRespondents(s1)).toContain(b);
  });
});

describe('♅ Axial Tilt — engine', () => {
  it('the attack slides off — re-aimed with NO payload growth, then proceeds normally', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'axialtilt';
    s0.players[a].hand = ['ion_surge', 'flyby', 'burn'];
    s0.players[b].hand = ['scan'];
    s0.players[c].hand = ['override', 'flyby']; // c's 📡 holds the reopened window observably open
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(s1.phase).toBe('reaction');
    expect(openRespondents(s1)).toContain(b);
    const s2 = ok(applyCommand(s1, { type: 'AXIAL_TILT', player: b, target: c }));
    expect(s2.phase).toBe('reaction'); // the window reopens on the new target
    expect(s2.pending?.target).toBe(c);
    expect(s2.pending?.growth ?? 0).toBe(0); // a flat refusal — NOT ☿'s +1
    expect(s2.pending?.deflectors).toContain(b); // shares the once-per-captain-per-chain limit
    expect(s2.players[b].factionPowerUsed).toBe(true);
    expect(s2.stats.axialTilts).toBe(1);
    const s3 = passAll(s2);
    expect(s3.players[c].hand.length).toBe(1); // the surge lands on c, un-grown
    expect(s3.players[b].hand).toEqual(['scan']); // ♅ untouched
  });

  it('growth already on the chain is preserved — the tilt adds nothing, and it may slide back at the attacker', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'axialtilt';
    s0.players[a].hand = ['ion_surge', 'deflector', 'flyby', 'burn']; // the deflector lets a hold the reopened window open
    s0.players[b].hand = ['scan'];
    s0.players[c].hand = ['deflector', 'scan', 'flyby'];
    const played = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: c }));
    const bounced = ok(applyCommand(played, { type: 'DEFLECT', player: c, target: b }));
    expect(bounced.pending?.growth).toBe(1); // the ↪️ grew it
    const tilted = ok(applyCommand(bounced, { type: 'AXIAL_TILT', player: b, target: a }));
    expect(tilted.pending?.target).toBe(a); // sideways diplomacy: back at the attacker
    expect(tilted.pending?.growth).toBe(1); // preserved — the tilt itself added nothing
    const done = ok(applyCommand(tilted, { type: 'PASS', player: a })); // the bounced attacker stands down
    expect(done.players[a].hand.length).toBe(1); // 1 + growth 1 = 2 of 3 jettisoned
    expect(done.players[b].hand).toEqual(['scan']);
  });

  it('two-player: the attack slides straight back at the attacker, un-grown', () => {
    const s0 = rig(2, 7);
    const a = s0.activePlayer;
    const b = (a + 1) % 2;
    s0.players[b].faction = 'axialtilt';
    s0.players[a].hand = ['ion_surge', 'burn'];
    s0.players[b].hand = ['scan', 'flyby'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(s1.phase).toBe('reaction');
    const s2 = ok(applyCommand(s1, { type: 'AXIAL_TILT', player: b, target: a }));
    expect(s2.phase).toBe('command'); // a holds no ↪️ — the redirected surge resolves at once
    expect(s2.pending).toBeNull();
    expect(s2.players[a].hand).toEqual([]); // the ⚡ was spent at PLAY, then its own surge hit a
    expect(s2.players[b].hand.length).toBe(2); // untouched — you cannot hit what is sideways
    expect(s2.players[b].factionPowerUsed).toBe(true);
    expect(s2.log.some((e) => e.type === 'axial_tilt' && e.data?.to === a)).toBe(true);
  });

  it('guards: self is never a legal tilt target', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'axialtilt';
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = [];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    const selfAim = applyCommand(s1, { type: 'AXIAL_TILT', player: b, target: b });
    if (!selfAim.ok) expect(selfAim.error).toBe('invalid tilt target');
    expect(selfAim.ok).toBe(false);
  });
});

describe('♆ Deep Sight — engine', () => {
  it('a free 🔭: instant, private, and the turn continues', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    s0.players[a].faction = 'deepsight';
    const expected = s0.deck.slice(0, 3);
    const s1 = ok(applyCommand(s0, { type: 'DEEP_SIGHT', player: a }));
    expect(s1.phase).toBe('command'); // no window — knowledge is not an action
    expect(s1.activePlayer).toBe(a);
    expect(s1.players[a].factionPowerUsed).toBe(true);
    expect(s1.stats.deepSights).toBe(1);
    const entry = s1.log[s1.log.length - 1];
    expect(entry.type).toBe('deep_sight');
    expect(entry.visibility).toEqual({ only: a }); // the sight itself is private
    expect(entry.data?.cards).toEqual(expected);
    expect(s1.deck.slice(0, 3)).toEqual(expected); // the deck does not change
  });

  it('guards: own command phase only, once per match', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].faction = 'deepsight';
    const offTurn = applyCommand(s0, { type: 'DEEP_SIGHT', player: b });
    if (!offTurn.ok) expect(offTurn.error).toBe('not your turn');
    expect(offTurn.ok).toBe(false);
    const s1 = ok(applyCommand(s0, { type: 'DEEP_SIGHT', player: a }));
    const twice = applyCommand(s1, { type: 'DEEP_SIGHT', player: a });
    if (!twice.ok) expect(twice.error).toBe('Deep Sight already spent this match');
    expect(twice.ok).toBe(false);
  });
});

describe('outer civs — bot policies (D-033)', () => {
  it('greedy ♄ never pays a thief — the wall rises on any theft aimed at them', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[b].faction = 'ringwall';
    s0.players[a].hand = ['boarding'];
    s0.players[b].hand = ['scan'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    expect(botCommandFor(s1, b, 'greedy', rngFrom(9))).toEqual({ type: 'RING_WALL', player: b });
  });

  it('greedy ♅ refuses to be hit — the attack slides to the biggest rival hand', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'axialtilt';
    s0.players[a].hand = ['ion_surge'];
    s0.players[b].hand = ['scan'];
    s0.players[c].hand = ['flyby', 'flyby', 'burn'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['ion_surge'], target: b }));
    expect(botCommandFor(s1, b, 'greedy', rngFrom(9))).toEqual({ type: 'AXIAL_TILT', player: b, target: c });
  });

  it('greedy 🌍 bashes early — one part + tape at the biggest rival hand', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[a].faction = 'kitbash';
    s0.players[a].hand = ['coolant'];
    s0.players[b].hand = ['scan', 'scan', 'flyby', 'burn'];
    s0.players[c].hand = ['wind'];
    expect(botCommandFor(s0, a, 'greedy', rngFrom(9))).toEqual({ type: 'KIT_BASH', player: a, card: 'coolant', target: b });
  });

  it('greedy ♆ sights for free, then dodges the ☀️ it saw — the knowledge actually drives the bot', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    s0.players[a].faction = 'deepsight';
    s0.players[a].hand = ['burn'];
    s0.deck = ['rupture', ...s0.deck]; // the oracle's bad news, waiting on top
    expect(botCommandFor(s0, a, 'greedy', rngFrom(9))).toEqual({ type: 'DEEP_SIGHT', player: a });
    const s1 = ok(applyCommand(s0, { type: 'DEEP_SIGHT', player: a }));
    expect(botCommandFor(s1, a, 'greedy', rngFrom(9))).toEqual({ type: 'PLAY', player: a, cards: ['burn'] });
  });
});
