import { describe, expect, it } from 'vitest';
import { applyCommand, botCommandFor, createGame, openRespondents } from '../index';
import type { GameState } from '../index';
import { NOMOD, ok, rngFrom } from './helpers';

/** D-031 — faction layer v2: ♀ Court Favor, ♂ Salvage Run, ♃ Storm Shout.
 *  All once per match, all opt-in, all spent publicly (Pillar 4). ☿ Flare Skip
 *  keeps its own file (engine-faction.test.ts); these follow the same shape. */
function rig(n = 3, seed = 5): GameState {
  return createGame({ playerCount: n, modules: NOMOD, seed });
}

describe('♀ Court Favor — engine', () => {
  it('flips the tribute: initiator gifts the Courtier instead, no card paid, power burns publicly', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'courtier';
    s0.players[a].hand = ['requisition', 'scan']; // 'scan' is the tribute they will owe
    s0.players[b].hand = []; // the power needs no card — the window still waits (canRespond wiring)
    s0.players[c].hand = ['override']; // holds the window open so the flip itself is observable
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    expect(s1.phase).toBe('reaction');
    expect(openRespondents(s1)).toContain(b);
    const s2 = ok(applyCommand(s1, { type: 'COURT_FAVOR', player: b }));
    expect(s2.phase).toBe('reaction'); // the window reopens on the flipped demand (📡 lives)
    expect(s2.pending?.target).toBe(a); // the demand flipped back at the initiator
    expect(s2.pending?.giftTo).toBe(b);
    expect(s2.players[b].factionPowerUsed).toBe(true); // spent = public
    expect(s2.stats.courtFavors).toBe(1);
    expect(s2.log.some((e) => e.type === 'court_favor' && e.data?.by === b)).toBe(true);
    const s3 = ok(applyCommand(s2, { type: 'PASS', player: c })); // last respondent stands down
    expect(s3.phase).toBe('choice');
    expect(s3.awaiting).toEqual({ type: 'give', from: a, to: b });
    const s4 = ok(applyCommand(s3, { type: 'GIVE', player: a, card: 'scan' }));
    expect(s4.players[b].hand).toEqual(['scan']);
    expect(s4.players[a].hand).toEqual([]); // the 🤝 was played, the scan gifted — the tribute cost is real
    expect(s4.phase).toBe('command'); // a's turn continues
  });

  it('one 📡 voids the flipped exchange — but the Favor is already spent (baitable, like ☿)', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'courtier';
    s0.players[a].hand = ['requisition'];
    s0.players[b].hand = [];
    s0.players[c].hand = ['override']; // third party kills the whole chain
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    const s2 = ok(applyCommand(s1, { type: 'COURT_FAVOR', player: b }));
    const s3 = ok(applyCommand(s2, { type: 'OVERRIDE', player: c }));
    expect(s3.phase).toBe('command');
    expect(s3.awaiting).toBeNull(); // no gift ever happens
    expect(s3.players[b].factionPowerUsed).toBe(true); // burned at use, not at success
    expect(s3.stats.courtFavors).toBe(1);
    expect(s3.players[a].hand).toEqual([]);
  });

  it('guards: requisitions only, target only, once per match, faction only', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'courtier';
    s0.players[a].hand = ['boarding', 'requisition', 'requisition', 'scan']; // scan = the tribute owed
    s0.players[b].hand = [];
    s0.players[c].hand = ['override']; // keeps windows open for the assertions
    const board = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['boarding'], target: b }));
    const wrongReason = applyCommand(board, { type: 'COURT_FAVOR', player: b });
    if (!wrongReason.ok) expect(wrongReason.error).toBe('Court Favor only answers a Requisition');
    expect(wrongReason.ok).toBe(false);
    const boardDone = ok(applyCommand(board, { type: 'PASS', player: c })); // close the ⚔ window
    const req = ok(applyCommand(boardDone, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    const notTarget = applyCommand(req, { type: 'COURT_FAVOR', player: c });
    if (!notTarget.ok) expect(notTarget.error).toBe('only the requisitioned captain may reverse it');
    expect(notTarget.ok).toBe(false);
    const flipped = ok(applyCommand(req, { type: 'COURT_FAVOR', player: b }));
    const stoodDown = ok(applyCommand(flipped, { type: 'PASS', player: c }));
    const given = ok(applyCommand(stoodDown, { type: 'GIVE', player: a, card: 'scan' }));
    expect(given.phase).toBe('command'); // first Favor resolved; a plays the second 🤝
    const again = ok(applyCommand(given, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    expect(again.phase).toBe('reaction'); // c's 📡 holds the window open
    const spent = applyCommand(again, { type: 'COURT_FAVOR', player: b });
    if (!spent.ok) expect(spent.error).toBe('Court Favor already spent this match');
    expect(spent.ok).toBe(false);
    const vanilla = rig(3, 9); // no faction, no power
    const x = vanilla.activePlayer;
    const y = (x + 1) % 3;
    const z = (x + 2) % 3;
    vanilla.players[x].hand = ['requisition', 'scan'];
    vanilla.players[y].hand = [];
    vanilla.players[z].hand = ['override']; // holds the window open so the faction check is reached
    const v1 = ok(applyCommand(vanilla, { type: 'PLAY', player: x, cards: ['requisition'], target: y }));
    const r = applyCommand(v1, { type: 'COURT_FAVOR', player: y });
    if (!r.ok) expect(r.error).toBe('no faction power available');
    expect(r.ok).toBe(false);
  });
});
describe('♂ Salvage Run — engine', () => {
  it('grabs any discard card for free through a real reaction window, then the turn continues', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].faction = 'rustborn';
    s0.players[a].hand = ['hull']; // hand untouched by the run
    s0.players[b].hand = ['override']; // holds the window open so the run itself is observable
    s0.discard = ['boarding', 'coolant'];
    const s1 = ok(applyCommand(s0, { type: 'RUST_RUN', player: a, card: 'boarding' }));
    expect(s1.phase).toBe('reaction'); // one 📡 could still cancel it
    expect(s1.pending?.reason).toBe('salvage');
    expect(s1.pending?.salvageKind).toBe('boarding');
    expect(s1.players[a].factionPowerUsed).toBe(true); // spent at initiation, not success
    expect(s1.stats.rustRuns).toBe(1);
    expect(s1.log.some((e) => e.type === 'rust_run' && e.data?.player === a)).toBe(true);
    const s2 = ok(applyCommand(s1, { type: 'PASS', player: b })); // the 📡 declines
    expect(s2.phase).toBe('command'); // a's turn continues either way
    expect(s2.players[a].hand).toEqual(['hull', 'boarding']);
    expect(s2.discard).toEqual(['coolant']);
    expect(s2.stats.salvagesPlayed).toBe(0); // the card ♻️ counts separately from the power
    expect(s2.log.some((e) => e.type === 'salvage_take')).toBe(true);
  });

  it('one 📡 cancels the grab — the card stays in the pile, but the run still burns', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].faction = 'rustborn';
    s0.players[b].hand = ['override'];
    s0.discard = ['boarding'];
    const s1 = ok(applyCommand(s0, { type: 'RUST_RUN', player: a, card: 'boarding' }));
    const s2 = ok(applyCommand(s1, { type: 'OVERRIDE', player: b }));
    expect(s2.phase).toBe('command');
    expect(s2.discard).toEqual(['boarding', 'override']); // card never left; the spent 📡 joins it
    expect(s2.players[a].hand).not.toContain('boarding');
    expect(s2.players[a].factionPowerUsed).toBe(true); // baitable, like ☿
    expect(s2.stats.rustRuns).toBe(1);
    expect(s2.log.some((e) => e.type === 'salvage_take')).toBe(false);
  });

  it('guards: own turn only, pile contents only, no ruptures/containments, once per match', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    s0.players[a].faction = 'rustborn';
    s0.players[b].faction = 'rustborn'; // but it is not their turn
    s0.discard = ['containment', 'hull'];
    const notYours = applyCommand(s0, { type: 'RUST_RUN', player: b, card: 'hull' });
    if (!notYours.ok) expect(notYours.error).toBe('not your turn');
    expect(notYours.ok).toBe(false);
    const banned = applyCommand(s0, { type: 'RUST_RUN', player: a, card: 'containment' });
    if (!banned.ok) expect(banned.error).toBe('cannot salvage ruptures or containments');
    expect(banned.ok).toBe(false);
    const absent = applyCommand(s0, { type: 'RUST_RUN', player: a, card: 'scan' });
    if (!absent.ok) expect(absent.error).toBe('that card is not in the discard pile');
    expect(absent.ok).toBe(false);
    const used = { ...s0, players: s0.players.map((p) => (p.id === a ? { ...p, factionPowerUsed: true } : p)) };
    const spent = applyCommand(used, { type: 'RUST_RUN', player: a, card: 'hull' });
    if (!spent.ok) expect(spent.error).toBe('Salvage Run already spent this match');
    expect(spent.ok).toBe(false);
    const vanilla = rig(3, 9); // classic seats see no power
    const v = vanilla.activePlayer;
    vanilla.discard = ['hull'];
    const r = applyCommand(vanilla, { type: 'RUST_RUN', player: v, card: 'hull' });
    if (!r.ok) expect(r.error).toBe('no faction power available');
    expect(r.ok).toBe(false);
  });
});
describe('♃ Storm Shout — engine', () => {
  it('the drawer roars: another captain jettisons instead, and cannot roar it further', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'stormkin';
    s0.players[b].hand = ['hull', 'hull']; // the drawer keeps every card
    s0.players[c].hand = ['coolant', 'coolant'];
    s0.phase = 'choice';
    s0.awaiting = { type: 'storm_discard', player: b, drawnBy: b };
    const s1 = ok(applyCommand(s0, { type: 'STORM_SHOUT', player: b, target: c }));
    expect(s1.awaiting).toEqual({ type: 'storm_discard', player: c }); // no drawnBy → no chain-shouting
    expect(s1.players[b].factionPowerUsed).toBe(true); // spent = public
    expect(s1.players[b].hand).toEqual(['hull', 'hull']); // jettisoned nothing
    expect(s1.stats.stormShouts).toBe(1);
    expect(s1.log.some((e) => e.type === 'storm_shout' && e.data?.by === b && e.data?.to === c)).toBe(true);
    // even a Stormkin victim cannot roar it onward — only the drawer may shout
    s1.players[c].faction = 'stormkin';
    const chain = applyCommand(s1, { type: 'STORM_SHOUT', player: c, target: b });
    if (!chain.ok) expect(chain.error).toBe("only the storm's drawer may shout");
    expect(chain.ok).toBe(false);
    const s2 = ok(applyCommand(s1, { type: 'STORM_DISCARD', player: c, card: 'coolant' }));
    expect(s2.players[c].hand).toEqual(['coolant']);
    expect(s2.discard).toContain('storm'); // the storm itself is finally discarded
  });

  it('guards: drawer only, faction only, carded targets only, once per match', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].hand = ['hull'];
    s0.players[c].hand = []; // nobody to roar at here
    s0.phase = 'choice';
    s0.awaiting = { type: 'storm_discard', player: b, drawnBy: b };
    const notFaction = applyCommand(s0, { type: 'STORM_SHOUT', player: b, target: a });
    if (!notFaction.ok) expect(notFaction.error).toBe('no faction power available');
    expect(notFaction.ok).toBe(false);
    s0.players[b].faction = 'stormkin';
    const empty = applyCommand(s0, { type: 'STORM_SHOUT', player: b, target: c });
    if (!empty.ok) expect(empty.error).toBe('pick another captain holding at least 1 card');
    expect(empty.ok).toBe(false);
    const notDrawer = applyCommand(s0, { type: 'STORM_SHOUT', player: c, target: a });
    if (!notDrawer.ok) expect(notDrawer.error).toBe("only the storm's drawer may shout");
    expect(notDrawer.ok).toBe(false);
    s0.players[b].factionPowerUsed = true;
    const spent = applyCommand(s0, { type: 'STORM_SHOUT', player: b, target: a });
    if (!spent.ok) expect(spent.error).toBe('Storm Shout already spent this match');
    expect(spent.ok).toBe(false);
  });
});

describe('faction v2 — bots', () => {
  it('greedy rustborn: the junk pile is a birthright — free salvage before anything else', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    s0.players[a].faction = 'rustborn';
    s0.players[a].hand = ['hull']; // no scan → the run comes first
    s0.discard = ['coolant', 'boarding']; // RUST_WANTED prefers boarding over coolant
    expect(botCommandFor(s0, a, 'greedy', rngFrom(1))).toEqual({ type: 'RUST_RUN', player: a, card: 'boarding' });
  });

  it('greedy courtier: a Courtier never pays tribute — the requisition flips', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'courtier';
    s0.players[a].hand = ['requisition', 'scan']; // holds a card worth flipping for
    s0.players[b].hand = [];
    s0.players[c].hand = ['override'];
    const s1 = ok(applyCommand(s0, { type: 'PLAY', player: a, cards: ['requisition'], target: b }));
    expect(botCommandFor(s1, b, 'greedy', rngFrom(1))).toEqual({ type: 'COURT_FAVOR', player: b });
  });

  it('greedy stormkin: roar the storm at the biggest rival hand', () => {
    const s0 = rig(3, 5);
    const a = s0.activePlayer;
    const b = (a + 1) % 3;
    const c = (a + 2) % 3;
    s0.players[b].faction = 'stormkin';
    s0.players[a].hand = [];
    s0.players[b].hand = ['hull'];
    s0.players[c].hand = ['scan', 'scan']; // the fattest target
    s0.phase = 'choice';
    s0.awaiting = { type: 'storm_discard', player: b, drawnBy: b };
    expect(botCommandFor(s0, b, 'greedy', rngFrom(1))).toEqual({ type: 'STORM_SHOUT', player: b, target: c });
  });
});


