import { CARD_INFO, TARGETED, furyDepthLimit } from './cards';
import { nextAliveId, openRespondents } from './engine';
import type { CardKind, Command, GameState } from './types';

export type BotPolicy = 'random' | 'greedy';
export type BotRng = () => number; // caller-owned [0,1) stream, keeps sims deterministic

/** Chooses the next command for "the player who must act now". Returns null when the game is over. */
export function botCommand(s: GameState, policy: BotPolicy, rng: BotRng): Command | null {
  if (s.phase === 'game_over') return null;
  if (s.phase === 'reaction') {
    // openRespondents includes the bounced initiator when they may still deflect (D-022)
    const open = openRespondents(s);
    return open.length ? botReactionFor(s, open[0], policy, rng) : null;
  }
  if (s.phase === 'choice') return botChoiceFor(s, choiceDecider(s), policy, rng);
  return botCommandPhase(s, policy, rng);
}

function choiceDecider(s: GameState): number {
  const aw = s.awaiting;
  if (!aw) return s.activePlayer;
  if (aw.type === 'give') return aw.from;
  if (aw.type === 'storm_discard' || aw.type === 'snag_discard') return aw.player;
  return s.activePlayer; // reinsert
}

/** Chooses a command for ONE specific captain. Returns null when it is not their decision to make.
 *  Powers mixed human+bot tables (solo vs AI in the hotseat app); the simulator uses botCommand. */
export function botCommandFor(s: GameState, player: number, policy: BotPolicy, rng: BotRng): Command | null {
  if (s.phase === 'game_over') return null;
  if (s.phase === 'reaction') {
    if (!s.pending) return null;
    // a bounced-back initiator may still deflect, but never Override their own action (D-022)
    return openRespondents(s).includes(player) ? botReactionFor(s, player, policy, rng) : null;
  }
  if (s.phase === 'choice') return choiceDecider(s) === player ? botChoiceFor(s, player, policy, rng) : null;
  return s.activePlayer === player ? botCommandPhase(s, policy, rng) : null;
}

function pick<T>(arr: T[], rng: BotRng): T {
  return arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];
}

function othersWithCards(s: GameState, me: number, min = 1): number[] {
  return s.players.filter((p) => p.alive && p.id !== me && p.hand.length >= min).map((p) => p.id);
}

function botCommandPhase(s: GameState, policy: BotPolicy, rng: BotRng): Command {
  const me = s.activePlayer;
  const hand = s.players[me].hand;
  const singles = [...new Set(hand.filter((k) => CARD_INFO[k].playableInCommand))];
  const pairKind = (hand.filter((k) => k === 'coolant').length >= 2 ? 'coolant' : null)
    ?? (hand.filter((k) => k === 'hull').length >= 2 ? 'hull' : null);

  if (policy === 'random') {
    const anyOther = othersWithCards(s, me, 0);
    if (rng() < 0.3 && anyOther.length > 0 && (singles.length > 0 || pairKind)) {
      const playPair = pairKind && (singles.length === 0 || rng() < 0.25);
      if (playPair) {
        const targets = othersWithCards(s, me);
        return { type: 'PLAY', player: me, cards: [pairKind, pairKind], target: targets.length ? pick(targets, rng) : pick(anyOther, rng) };
      }
      const k = pick(singles, rng);
      const needsTarget = TARGETED.includes(k);
      let target: number | undefined;
      if (needsTarget) {
        const ts = othersWithCards(s, me);
        target = ts.length ? pick(ts, rng) : pick(anyOther, rng);
      }
      let salvageKind: CardKind | undefined;
      if (k === 'salvage') {
        const opts = [...new Set(s.discard.filter((c) => c !== 'rupture' && c !== 'containment'))];
        salvageKind = opts.length ? pick(opts, rng) : undefined;
        if (!salvageKind) return { type: 'END_TURN_DRAW', player: me };
      }
      return { type: 'PLAY', player: me, cards: [k], target, salvageKind };
    }
    return { type: 'END_TURN_DRAW', player: me };
  }

  // greedy: same-turn scan knowledge only (see docs/12 #8)
  const scanned = lastScanThisTurn(s, me);
  const topKnown = scanned ? (scanned.data?.cards as CardKind[] | undefined)?.[0] : undefined;
  if (!scanned && singles.includes('scan')) return { type: 'PLAY', player: me, cards: ['scan'] };
  if (topKnown === 'rupture') {
    for (const avoid of ['burn', 'flyby', 'reversal', 'slingshot'] as const) {
      if (singles.includes(avoid)) return { type: 'PLAY', player: me, cards: [avoid] };
    }
    return { type: 'END_TURN_DRAW', player: me }; // holds containment, or doomed
  }
  if (hand.length >= 6 && singles.includes('requisition')) {
    const ts = othersWithCards(s, me);
    if (ts.length) {
      const target = ts.reduce((a, b) => (s.players[b].hand.length > s.players[a].hand.length ? b : a));
      return { type: 'PLAY', player: me, cards: ['requisition'], target };
    }
  }
  // mischief: 🧲 against fat hands, ⚡ as spite — aimed at the biggest rival hand
  {
    const rivals = othersWithCards(s, me, 1);
    if (rivals.length > 0) {
      const richest = rivals.reduce((a, b) => (s.players[b].hand.length > s.players[a].hand.length ? b : a));
      if (singles.includes('tractor') && s.players[richest].hand.length > 3) {
        return { type: 'PLAY', player: me, cards: ['tractor'], target: richest };
      }
      if (singles.includes('ion_surge') && (s.players[richest].hand.length >= 2 || rng() < 0.3)) {
        return { type: 'PLAY', player: me, cards: ['ion_surge'], target: richest };
      }
    }
  }
  if (rng() < 0.2 && (singles.includes('boarding') || pairKind) && othersWithCards(s, me, 2).length > 0) {
    if (singles.includes('boarding')) {
      return { type: 'PLAY', player: me, cards: ['boarding'], target: pick(othersWithCards(s, me, 2), rng) };
    }
    return { type: 'PLAY', player: me, cards: [pairKind as CardKind, pairKind as CardKind], target: pick(othersWithCards(s, me, 2), rng) };
  }
  // lone Components with no pair in sight: scrap for a peek (D-016 B)
  if (!pairKind) {
    for (const k of ['coolant', 'hull'] as const) {
      if (hand.includes(k) && rng() < 0.6) return { type: 'PLAY', player: me, cards: [k] };
    }
  }
  return { type: 'END_TURN_DRAW', player: me };
}

function lastScanThisTurn(s: GameState, me: number) {
  for (let i = s.log.length - 1; i >= 0; i--) {
    const e = s.log[i];
    if (e.type === 'scan_seen' && e.turn === s.turnCount) {
      const vis = e.visibility as { only?: number };
      if (vis && typeof vis === 'object' && vis.only === me) return e;
    }
  }
  return undefined;
}

function botReactionFor(s: GameState, me: number, policy: BotPolicy, rng: BotRng): Command {
  const p = s.players[me];
  const pend = s.pending!;
  const hasOverride = p.hand.includes('override');
  // D-022: a bounced-back initiator may only deflect — never Override their own action
  const canOnlyDeflect = me === pend.initiator;

  if (policy === 'random') {
    if (!p.alive) return { type: !canOnlyDeflect && rng() < 0.3 ? 'OVERRIDE' : 'PASS', player: me }; // Final Transmission
    if (!canOnlyDeflect && p.alive && pend.target === me && p.hand.includes('deflector') && rng() < 0.3) {
      const others = s.players.filter((q) => q.alive && q.id !== me);
      if (others.length > 0) return { type: 'DEFLECT', player: me, target: pick(others, rng).id };
    }
    return { type: !canOnlyDeflect && hasOverride && rng() < 0.3 ? 'OVERRIDE' : 'PASS', player: me };
  }

  // greedy: attacked and holding a Deflector → pass the problem to the biggest rival hand
  const attackReasons = ['boarding', 'pair', 'requisition', 'ion_surge', 'tractor'];
  if (
    p.alive && pend.target === me && attackReasons.includes(pend.reason)
    && p.hand.includes('deflector') && !(pend.deflectors ?? []).includes(me)
  ) {
    const others = s.players.filter((q) => q.alive && q.id !== me);
    if (others.length > 0) {
      const to = others.reduce((x, y) => (y.hand.length >= x.hand.length ? y : x));
      return { type: 'DEFLECT', player: me, target: to.id };
    }
  }

  // greedy: protect yourself from flyby debt and theft; occasional spite
  const noOwnAction = !canOnlyDeflect;
  const debtVictim = noOwnAction && pend.reason === 'flyby' && nextAliveId(s, s.activePlayer) === me;
  const victim = noOwnAction && attackReasons.includes(pend.reason) && pend.target === me;
  if (noOwnAction && p.alive && hasOverride && (debtVictim || victim || rng() < 0.15)) return { type: 'OVERRIDE', player: me };
  if (noOwnAction && !p.alive && rng() < 0.25) return { type: 'OVERRIDE', player: me }; // Final Transmission
  return { type: 'PASS', player: me };
}

const GIVE_ORDER: CardKind[] = ['coolant', 'hull', 'salvage', 'boarding', 'slingshot', 'requisition', 'scan', 'reversal', 'burn', 'flyby', 'override', 'containment'];

function botChoiceFor(s: GameState, player: number, policy: BotPolicy, rng: BotRng): Command {
  if (s.awaiting?.type === 'give') {
    const from = s.players[s.awaiting.from];
    if (policy === 'random') return { type: 'GIVE', player: from.id, card: pick(from.hand, rng) };
    const kind = GIVE_ORDER.find((k) => from.hand.includes(k)) ?? from.hand[0];
    return { type: 'GIVE', player: from.id, card: kind };
  }
  if (s.awaiting?.type === 'storm_discard') {
    // jettison the least valuable card (same order as gifts)
    const from = s.players[s.awaiting.player];
    if (policy === 'random') return { type: 'STORM_DISCARD', player: from.id, card: pick(from.hand, rng) };
    const kind = GIVE_ORDER.find((k) => from.hand.includes(k)) ?? from.hand[0];
    return { type: 'STORM_DISCARD', player: from.id, card: kind };
  }
  if (s.awaiting?.type === 'snag_discard') {
    const from = s.players[s.awaiting.player];
    const count = Math.min(s.awaiting.count, from.hand.length);
    if (policy === 'random') {
      const hand = [...from.hand];
      const cards: CardKind[] = [];
      for (let i = 0; i < count; i++) cards.push(hand.splice(Math.floor(rng() * hand.length), 1)[0]);
      return { type: 'SNAG_DISCARD', player: from.id, cards };
    }
    const hand = [...from.hand];
    const cards: CardKind[] = [];
    for (let i = 0; i < count; i++) {
      const kind = GIVE_ORDER.find((k) => hand.includes(k)) ?? hand[0];
      hand.splice(hand.indexOf(kind), 1);
      cards.push(kind);
    }
    return { type: 'SNAG_DISCARD', player: from.id, cards };
  }
  // reinsertion: greedy buries the rupture as deep as legally allowed
  const limit = s.config.modules.sunFury ? furyDepthLimit(s.sunFury) : Number.POSITIVE_INFINITY;
  const maxPos = s.deck.length === 0 ? 1 : Math.min(limit, s.deck.length);
  if (policy === 'random') return { type: 'REINSERT', player: player, positionFromTop: 1 + Math.floor(rng() * maxPos) };
  return { type: 'REINSERT', player: player, positionFromTop: maxPos };
}

