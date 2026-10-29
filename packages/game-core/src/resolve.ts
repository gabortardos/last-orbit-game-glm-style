import { DEBT_CAP, SNAG_KEEP, furyDepthLimit } from './cards';
import { addLog, endTurnAndAdvance, nextAliveId } from './engine';
import { randomInt, shuffled } from './rng';
import type { CardKind, GameState, PendingAction } from './types';

/**
 * Resolves a pending action after its reaction window closes.
 * Odd overrides → cancelled; even (incl. 0) → executes the effect.
 */
export function resolvePending(s: GameState): void {
  const pending = s.pending;
  if (!pending) return;
  if (pending.overrides.length % 2 === 1) {
    s.stats.cancelledActions += 1;
    addLog(s, 'pending_cancelled', { reason: pending.reason, initiator: pending.initiator, stack: pending.overrides.length });
    s.pending = null;
    s.phase = 'command'; // initiator's Command Phase continues (E-9)
    return;
  }
  s.pending = null;
  executeEffect(s, pending);
}

function executeEffect(s: GameState, pending: PendingAction): void {
  const initiator = s.players[pending.initiator];
  switch (pending.reason) {
    case 'scan': {
      const seen = s.deck.slice(0, 3);
      s.stats.scansPlayed += 1;
      addLog(s, 'scan_seen', { player: initiator.id, cards: seen }, { only: initiator.id });
      s.phase = 'command';
      break;
    }
    case 'slingshot': {
      s.deck = shuffledInPlace(s);
      addLog(s, 'shuffle', { player: initiator.id });
      s.phase = 'command';
      break;
    }
    case 'boarding':
    case 'pair': {
      const t = s.players[pending.target as number];
      if (!t || !t.alive || t.hand.length === 0) {
        s.stats.fizzles += 1;
        addLog(s, 'fizzle', { reason: pending.reason, target: t?.id, initiator: initiator.id });
      } else {
        const pick = randomInt(t.hand.length, s.rngState);
        s.rngState = pick.state;
        const card = t.hand.splice(pick.value, 1)[0];
        initiator.hand.push(card);
        s.stats.steals += 1;
        // who robbed whom is public (the victim must know); the loot itself is private (PT-00 r4)
        addLog(s, 'steal', { from: t.id, to: initiator.id, via: pending.reason });
        addLog(s, 'steal_card', { to: initiator.id, card }, { only: initiator.id });
      }
      s.phase = 'command';
      break;
    }
    case 'requisition': {
      const t = s.players[pending.target as number];
      if (!t || !t.alive || t.hand.length === 0) {
        s.stats.fizzles += 1;
        addLog(s, 'fizzle', { reason: 'requisition', target: t?.id, initiator: initiator.id });
        s.phase = 'command';
      } else {
        // D-031 ♀ Court Favor flips the flow: the initiator gives the Courtier instead.
        s.awaiting = { type: 'give', from: t.id, to: pending.giftTo ?? initiator.id };
        s.phase = 'choice';
      }
      break;
    }
    case 'salvage': {
      const kind = pending.salvageKind as CardKind;
      const idx = s.discard.indexOf(kind);
      if (idx >= 0) {
        s.discard.splice(idx, 1);
        initiator.hand.push(kind);
        // cards.length === 0 → the ♂ free Salvage Run (power counted at initiation, D-031)
        if (pending.cards.length > 0) s.stats.salvagesPlayed += 1;
        addLog(s, 'salvage_take', { player: initiator.id, card: kind });
      } else {
        s.stats.fizzles += 1;
        addLog(s, 'fizzle', { reason: 'salvage', initiator: initiator.id });
      }
      s.phase = 'command';
      break;
    }
    case 'scrap': {
      // lone Component, scrapped for a peek at the top card (private; the card stays)
      const seen = s.deck.slice(0, 1);
      s.stats.scrapsPlayed += 1;
      addLog(s, 'scrap_seen', { player: initiator.id, cards: seen }, { only: initiator.id });
      s.phase = 'command';
      break;
    }
    case 'ion_surge': {
      // destruction at random — 1 card per growth step; theft never scales (D-018)
      const t = s.players[pending.target as number];
      const want = 1 + (pending.growth ?? 0);
      if (!t || !t.alive || t.hand.length === 0) {
        s.stats.fizzles += 1;
        addLog(s, 'fizzle', { reason: 'ion_surge', target: t?.id, initiator: initiator.id });
      } else {
        const n = Math.min(want, t.hand.length);
        for (let i = 0; i < n; i++) {
          const pick = randomInt(t.hand.length, s.rngState);
          s.rngState = pick.state;
          const card = t.hand.splice(pick.value, 1)[0];
          s.discard.push(card);
          s.stats.forcedDiscards += 1;
          addLog(s, 'forced_discard', { player: t.id, card, via: 'ion_surge' });
        }
        addLog(s, 'surge_hit', { target: t.id, by: initiator.id, count: n });
      }
      s.phase = 'command';
      break;
    }
    case 'tractor': {
      // target discards down to (3 − growth), keeping what they choose
      const t = s.players[pending.target as number];
      const keep = Math.max(0, SNAG_KEEP - (pending.growth ?? 0));
      if (!t || !t.alive || t.hand.length <= keep) {
        s.stats.fizzles += 1;
        addLog(s, 'fizzle', { reason: 'tractor', target: t?.id, initiator: initiator.id });
        s.phase = 'command';
      } else {
        addLog(s, 'snag_hit', { target: t.id, by: initiator.id, discardCount: t.hand.length - keep, keep });
        s.awaiting = { type: 'snag_discard', player: t.id, count: t.hand.length - keep };
        s.phase = 'choice';
      }
      break;
    }
    case 'flyby': {
      // Debt travels with interest: next owes 2 + every turn I still owed beyond this one.
      s.stats.flybysPlayed += 1;
      const owedNow = s.turnsOwed[s.activePlayer];
      const carry = Math.max(0, owedNow - 1);
      s.turnsOwed[s.activePlayer] = 0;
      const next = nextAliveId(s, s.activePlayer);
      const debt = Math.min(DEBT_CAP, 2 + carry);
      s.turnsOwed[next] = Math.min(DEBT_CAP, s.turnsOwed[next] + debt);
      s.stats.maxDebt = Math.max(s.stats.maxDebt, s.turnsOwed[next]);
      addLog(s, 'flyby_debt', { player: next, amount: s.turnsOwed[next], from: s.activePlayer });
      endTurnAndAdvance(s, false); // flyer's own debt already cancelled
      break;
    }
    case 'burn': {
      addLog(s, 'turn_skipped', { player: initiator.id });
      endTurnAndAdvance(s, true); // owed turns beyond this one still come
      break;
    }
    case 'reversal': {
      if (s.players.length > 2) {
        s.direction = s.direction === 1 ? -1 : 1;
        addLog(s, 'direction', { direction: s.direction, by: initiator.id });
      }
      addLog(s, 'turn_skipped', { player: initiator.id });
      endTurnAndAdvance(s, true);
      break;
    }
  }
}

function shuffledInPlace(s: GameState): CardKind[] {
  const r = shuffled(s.deck, s.rngState);
  s.rngState = r.state;
  return r.deck;
}
