import { DEFLECT_CAP, SCALING, TARGETED, furyDepthLimit, isComponent } from './cards';
import { addLog, canRespond, cloneState, eligibleReactorIds, eliminate, endTurnAndAdvance } from './engine';
import { resolvePending } from './resolve';
import { shuffled } from './rng';
import type { ApplyResult, CardKind, Command, GameState } from './types';

const CARD_PLAYABLE: CardKind[] = ['flyby', 'burn', 'scan', 'slingshot', 'requisition', 'boarding', 'reversal', 'salvage', 'ion_surge', 'tractor'];

/**
 * D-020: auto-passes every eligible captain who cannot actually respond (no Override,
 * not the target with an unused Deflector, no armed Final Transmission). When nobody
 * can respond, the window resolves immediately — the app never waits on a forced
 * "let it happen". Call at every point the window (re)opens: PLAY, OVERRIDE, DEFLECT.
 */
function skipNoResponders(s: GameState): void {
  const pending = s.pending;
  if (!pending) return;
  const eligible = eligibleReactorIds(s);
  const passed = pending.passed.slice();
  for (const id of eligible) {
    if (!passed.includes(id) && !canRespond(s, id)) passed.push(id);
  }
  s.pending = { ...pending, passed };
  if (s.pending.passed.length >= eligible.length) resolvePending(s);
}

/** Validates and applies a command to a cloned state. Pure: input state is never mutated. */
export function applyCommand(state: GameState, cmd: Command): ApplyResult {
  const s = cloneState(state);
  if (s.phase === 'game_over') return err('game is over');

  switch (cmd.type) {
    case 'PLAY':
      return cmdPlay(s, cmd);
    case 'END_TURN_DRAW': {
      if (s.phase !== 'command') return err('not in command phase');
      if (cmd.player !== s.activePlayer) return err('not your turn');
      s.bonusDraws = 1; // the turn's own draw; 🌟 Solar Wind may promise more mid-chain
      stepDrawChain(s);
      return ok(s);
    }
    case 'OVERRIDE': {
      if (s.phase !== 'reaction' || !s.pending) return err('no reaction window open');
      const pending = s.pending;
      if (cmd.player === pending.initiator) return err('initiator cannot override their own action');
      const p = s.players[cmd.player];
      let viaCard = true;
      if (p.alive) {
        const i = p.hand.indexOf('override');
        if (i < 0) return err('no Comms Override in hand');
        p.hand.splice(i, 1);
        s.discard.push('override');
      } else {
        if (!s.config.modules.derelicts) return err('derelicts module is off');
        if (p.transmissionUsed) return err('Final Transmission already spent');
        p.transmissionUsed = true;
        s.stats.transmissionsUsed += 1;
        viaCard = false;
      }
      const overrides = [...pending.overrides, { player: cmd.player, viaCard }];
      s.pending = { ...pending, overrides, passed: [] };
      s.stats.overridesPlayed += 1;
      s.stats.maxOverrideStack = Math.max(s.stats.maxOverrideStack, overrides.length);
      addLog(s, 'override', { player: cmd.player, stack: overrides.length, viaCard });
      skipNoResponders(s); // the window reopens — re-skip captains with nothing to add
      return ok(s);
    }
    case 'PASS': {
      if (s.phase !== 'reaction' || !s.pending) return err('no reaction window open');
      const pending = s.pending;
      if (!eligibleReactorIds(s).includes(cmd.player)) return err('not eligible to respond');
      if (pending.passed.includes(cmd.player)) return err('already passed');
      s.pending = { ...pending, passed: [...pending.passed, cmd.player] };
      if (s.pending.passed.length >= eligibleReactorIds(s).length) resolvePending(s);
      return ok(s);
    }
    case 'DEFLECT': {
      if (s.phase !== 'reaction' || !s.pending) return err('no reaction window open');
      const pending = s.pending;
      if (pending.target === undefined) return err('only attacks with a target can be deflected');
      if (cmd.player !== pending.target) return err('only the current target may deflect');
      const p = s.players[cmd.player];
      if (!p.alive) return err('derelicts cannot deflect');
      if ((pending.deflectors ?? []).includes(cmd.player)) return err('already deflected in this chain');
      const di = p.hand.indexOf('deflector');
      if (di < 0) return err('no Deflector in hand');
      const t = s.players[cmd.target];
      if (!t || !t.alive || cmd.target === cmd.player) return err('invalid deflection target');
      p.hand.splice(di, 1);
      s.discard.push('deflector');
      // destruction scales with each hop; theft only redirects (D-018)
      const growth = (SCALING as readonly string[]).includes(pending.reason)
        ? Math.min(DEFLECT_CAP, (pending.growth ?? 0) + 1)
        : pending.growth ?? 0;
      s.pending = {
        ...pending,
        target: cmd.target,
        growth,
        deflectors: [...(pending.deflectors ?? []), cmd.player],
        passed: [], // the window reopens for everyone on the new target
      };
      s.stats.deflections += 1;
      s.stats.maxGrowth = Math.max(s.stats.maxGrowth, growth);
      addLog(s, 'deflect', { by: cmd.player, to: cmd.target, reason: pending.reason, growth });
      skipNoResponders(s); // the window reopens on the new target — re-skip the powerless
      return ok(s);
    }
    case 'GIVE': {
      if (s.phase !== 'choice' || s.awaiting?.type !== 'give') return err('no gift to resolve');
      if (cmd.player !== s.awaiting.from) return err('not the giver');
      const from = s.players[cmd.player];
      const i = from.hand.indexOf(cmd.card);
      if (i < 0) return err('card not in hand');
      from.hand.splice(i, 1);
      s.players[s.awaiting.to].hand.push(cmd.card);
      addLog(s, 'give', { from: from.id, to: s.awaiting.to, card: cmd.card }); // the exchange is public; the card shows only in each hand
      s.awaiting = null;
      s.phase = 'command';
      return ok(s);
    }
    case 'STORM_DISCARD': {
      if (s.phase !== 'choice' || s.awaiting?.type !== 'storm_discard') return err('no storm to resolve');
      if (cmd.player !== s.awaiting.player) return err('not your storm');
      const p = s.players[cmd.player];
      const i = p.hand.indexOf(cmd.card);
      if (i < 0) return err('card not in hand');
      p.hand.splice(i, 1);
      s.discard.push(cmd.card, 'storm'); // jettisoned card, then the storm itself
      addLog(s, 'storm_discard', { player: p.id, card: cmd.card });
      s.awaiting = null;
      s.phase = 'command'; // transitional; the chain/turn-end resets it
      if (s.bonusDraws > 0) stepDrawChain(s); // 🌟 wind promised more draws
      else endTurnAndAdvance(s, true);
      return ok(s);
    }
    case 'SNAG_DISCARD': {
      if (s.phase !== 'choice' || s.awaiting?.type !== 'snag_discard') return err('no tractor snag to resolve');
      const aw = s.awaiting;
      if (cmd.player !== aw.player) return err('not your snag');
      const p = s.players[cmd.player];
      const count = Math.min(aw.count, p.hand.length);
      if (cmd.cards.length !== count) return err(`choose exactly ${count} card(s) to discard`);
      const hand = [...p.hand];
      for (const c of cmd.cards) {
        const i = hand.indexOf(c);
        if (i < 0) return err(`card ${c} not in hand`);
        hand.splice(i, 1);
      }
      p.hand = hand;
      s.discard.push(...cmd.cards);
      addLog(s, 'snag_discard', { player: p.id, cards: cmd.cards.slice() });
      s.awaiting = null;
      s.phase = 'command'; // the initiator's Command Phase continues
      return ok(s);
    }
    case 'REINSERT': {
      if (s.phase !== 'choice' || s.awaiting?.type !== 'reinsert') return err('no reinsertion pending');
      if (cmd.player !== s.activePlayer) return err('not your reinsertion');
      const limit = s.config.modules.sunFury ? furyDepthLimit(s.sunFury) : Number.POSITIVE_INFINITY;
      const maxPos = s.deck.length === 0 ? 1 : Math.min(limit, s.deck.length);
      if (!Number.isInteger(cmd.positionFromTop) || cmd.positionFromTop < 1 || cmd.positionFromTop > maxPos) {
        return err(`position must be 1..${maxPos} (Fury ${s.sunFury})`);
      }
      s.deck.splice(cmd.positionFromTop - 1, 0, 'rupture');
      addLog(s, 'reinsert_position', { position: cmd.positionFromTop, limit: limit === Infinity ? 'any' : limit, deckLength: s.deck.length }, 'hidden');
      s.awaiting = null;
      s.phase = 'command'; // transitional; the chain/turn-end resets it
      if (s.bonusDraws > 0) stepDrawChain(s); // 🌟 wind promised more draws
      else endTurnAndAdvance(s, true);
      return ok(s);
    }
    default:
      return err('unknown command');
  }
}

function ok(s: GameState): ApplyResult {
  return { ok: true, state: s };
}

function err(msg: string): ApplyResult {
  return { ok: false, error: msg };
}

function cmdPlay(s: GameState, cmd: Extract<Command, { type: 'PLAY' }>): ApplyResult {
  if (s.phase !== 'command') return err('not in command phase');
  if (cmd.player !== s.activePlayer) return err('not your turn');
  const p = s.players[cmd.player];
  const cards = cmd.cards;
  if (cards.length < 1 || cards.length > 2) return err('play 1 action card or 2 matching Components');

  let reason: string;
  if (cards.length === 1) {
    const k = cards[0];
    if (isComponent(k)) reason = 'scrap'; // lone Component: floor use is a peek (D-016 B)
    else if (!CARD_PLAYABLE.includes(k)) return err(`${k} cannot be played as an action`);
    else reason = k;
  } else {
    const [a, b] = cards;
    if (!(isComponent(a) && a === b)) return err('a pair must be 2 matching Components');
    reason = 'pair';
  }

  const needsTarget = cards.length === 2 || TARGETED.includes(cards[0]);
  if (needsTarget) {
    if (cmd.target === undefined) return err('this play needs a target');
    const t = s.players[cmd.target];
    if (!t || !t.alive || cmd.target === cmd.player) return err('invalid target');
  }
  if (cards[0] === 'salvage') {
    if (!cmd.salvageKind) return err('salvage needs a chosen discard card');
    if (cmd.salvageKind === 'rupture' || cmd.salvageKind === 'containment') return err('cannot salvage ruptures or containments');
    if (!s.discard.includes(cmd.salvageKind)) return err('that card is not in the discard pile');
  }

  // remove the played cards from hand (occurrence-checked)
  for (const c of cards) {
    const i = p.hand.indexOf(c);
    if (i < 0) return err(`card ${c} not in hand`);
    p.hand.splice(i, 1);
  }
  s.discard.push(...cards);

  s.pending = {
    initiator: p.id,
    reason: reason as NonNullable<GameState['pending']>['reason'],
    cards: cards.slice(),
    overrides: [],
    passed: [],
    target: cmd.target,
    salvageKind: cmd.salvageKind,
  };
  s.stats.overrideWindows += 1;
  s.phase = 'reaction';
  addLog(s, 'play', { player: p.id, cards: cards.slice(), target: cmd.target, salvage: cmd.salvageKind });
  skipNoResponders(s); // nobody able to respond? resolve without a single forced pass
  return ok(s);
}

/**
 * Performs pending draws (the turn's own draw + any 🌟 Solar Wind bonuses) until the
 * turn can end. The chain pauses on a ☄️ Storm jettison or a contained ☀️ reinsertion
 * and resumes when STORM_DISCARD / REINSERT resolve (bonusDraws survives the pause).
 */
function stepDrawChain(s: GameState): void {
  while (s.bonusDraws > 0 && s.awaiting === null && s.winner === null) {
    s.bonusDraws -= 1;
    const p = s.players[s.activePlayer];
    // E-1: empty deck → reshuffle discard; if both empty → skip the draw.
    if (s.deck.length === 0) {
      if (s.discard.length === 0) {
        addLog(s, 'skip_draw', { player: p.id });
        s.bonusDraws = 0;
        endTurnAndAdvance(s, true);
        return;
      }
      const r = shuffled(s.discard, s.rngState);
      s.rngState = r.state;
      s.deck = r.deck;
      s.discard = [];
      s.stats.reshuffles += 1;
      addLog(s, 'reshuffle', {});
    }
    const card = s.deck.shift() as CardKind;
    s.stats.drawsTotal += 1;
    if (card === 'rupture') {
      addLog(s, 'rupture_reveal', { player: p.id, deckLeft: s.deck.length });
      const ci = p.hand.indexOf('containment');
      if (ci >= 0) {
        p.hand.splice(ci, 1);
        s.discard.push('containment');
        if (s.config.modules.sunFury) {
          s.sunFury = Math.min(5, s.sunFury + 1);
          addLog(s, 'fury_up', { fury: s.sunFury });
        }
        addLog(s, 'contained', { player: p.id });
        s.awaiting = { type: 'reinsert' };
        s.phase = 'choice'; // turn ends (or the wind chain resumes) after REINSERT (§6.2)
        return; // bonusDraws may still be > 0 — REINSERT resumes the chain
      }
      s.bonusDraws = 0; // fatal: the chain dies with the flagship
      eliminate(s, p.id); // rupture leaves the game (E-7)
      endTurnAndAdvance(s, true);
      return;
    }
    if (card === 'storm') {
      addLog(s, 'draw', { player: p.id, card, deckLeft: s.deck.length });
      addLog(s, 'storm_hit', { player: p.id });
      if (p.hand.length === 0) {
        s.discard.push('storm');
        addLog(s, 'storm_fizzle', { player: p.id });
        continue; // an empty hand shrugs it off; pending wind draws continue
      }
      s.awaiting = { type: 'storm_discard', player: p.id };
      s.phase = 'choice'; // STORM_DISCARD resumes/ends the chain
      return;
    }
    p.hand.push(card);
    addLog(s, 'draw', { player: p.id, card, deckLeft: s.deck.length });
    if (card === 'wind') {
      s.bonusDraws += 1; // the promised extra draw
      addLog(s, 'wind_bonus', { player: p.id });
    }
  }
  endTurnAndAdvance(s, true);
}

