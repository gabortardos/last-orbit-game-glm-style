import { CARD_INFO, furyDepthLimit } from './cards';
import { eligibleReactorIds, nextAliveId } from './engine';
import type { CardKind, Command, GameState } from './types';

export type BotPolicy = 'random' | 'greedy';
export type BotRng = () => number; // caller-owned [0,1) stream, keeps sims deterministic

/** Chooses the next command for "the player who must act now". Returns null when the game is over. */
export function botCommand(s: GameState, policy: BotPolicy, rng: BotRng): Command | null {
  if (s.phase === 'game_over') return null;
  if (s.phase === 'reaction') return botReaction(s, policy, rng);
  if (s.phase === 'choice') return botChoice(s, policy, rng);
  return botCommandPhase(s, policy, rng);
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
      const needsTarget = k === 'boarding' || k === 'requisition';
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
  if (rng() < 0.2 && (singles.includes('boarding') || pairKind) && othersWithCards(s, me, 2).length > 0) {
    if (singles.includes('boarding')) {
      return { type: 'PLAY', player: me, cards: ['boarding'], target: pick(othersWithCards(s, me, 2), rng) };
    }
    return { type: 'PLAY', player: me, cards: [pairKind as CardKind, pairKind as CardKind], target: pick(othersWithCards(s, me, 2), rng) };
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

function botReaction(s: GameState, policy: BotPolicy, rng: BotRng): Command {
  const eligible = eligibleReactorIds(s).filter((id) => !s.pending?.passed.includes(id));
  const me = eligible[0]; // decide for the first undecided eligible captain (deterministic)
  const p = s.players[me];
  const pend = s.pending!;
  const hasOverride = p.hand.includes('override');

  if (policy === 'random') {
    if (!p.alive) return { type: rng() < 0.3 ? 'OVERRIDE' : 'PASS', player: me }; // Final Transmission
    return { type: hasOverride && rng() < 0.3 ? 'OVERRIDE' : 'PASS', player: me };
  }

  // greedy: protect yourself from flyby debt and theft; occasional spite
  const debtVictim = pend.reason === 'flyby' && nextAliveId(s, s.activePlayer) === me;
  const victim = (pend.reason === 'boarding' || pend.reason === 'pair' || pend.reason === 'requisition') && pend.target === me;
  if (p.alive && hasOverride && (debtVictim || victim || rng() < 0.15)) return { type: 'OVERRIDE', player: me };
  if (!p.alive && rng() < 0.25) return { type: 'OVERRIDE', player: me }; // Final Transmission
  return { type: 'PASS', player: me };
}

const GIVE_ORDER: CardKind[] = ['coolant', 'hull', 'salvage', 'boarding', 'slingshot', 'requisition', 'scan', 'reversal', 'burn', 'flyby', 'override', 'containment'];

function botChoice(s: GameState, policy: BotPolicy, rng: BotRng): Command {
  if (s.awaiting?.type === 'give') {
    const from = s.players[s.awaiting.from];
    if (policy === 'random') return { type: 'GIVE', player: from.id, card: pick(from.hand, rng) };
    const kind = GIVE_ORDER.find((k) => from.hand.includes(k)) ?? from.hand[0];
    return { type: 'GIVE', player: from.id, card: kind };
  }
  // reinsertion: greedy buries the rupture as deep as legally allowed
  const limit = s.config.modules.sunFury ? furyDepthLimit(s.sunFury) : Number.POSITIVE_INFINITY;
  const maxPos = s.deck.length === 0 ? 1 : Math.min(limit, s.deck.length);
  if (policy === 'random') return { type: 'REINSERT', player: s.activePlayer, positionFromTop: 1 + Math.floor(rng() * maxPos) };
  return { type: 'REINSERT', player: s.activePlayer, positionFromTop: maxPos };
}

