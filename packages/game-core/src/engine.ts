import { ATTACK_REASONS, BASE_DECK, CONTAINMENT_COUNT, THEFT_REASONS } from './cards';
import { randomInt, shuffled } from './rng';
import type { GameConfig, GameState, LogVisibility, PlayerState } from './types';

export function addLog(s: GameState, type: string, data?: Record<string, unknown>, visibility: LogVisibility = 'public'): void {
  s.log.push({ turn: s.turnCount, type, data, visibility });
}

export function cloneState(s: GameState): GameState {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hand: p.hand.slice() })),
    deck: s.deck.slice(),
    discard: s.discard.slice(),
    turnsOwed: s.turnsOwed.slice(),
    log: s.log.slice(),
    stats: { ...s.stats },
    pending: s.pending
      ? { ...s.pending, overrides: s.pending.overrides.slice(), passed: s.pending.passed.slice(), deflectors: s.pending.deflectors?.slice() }
      : null,
    awaiting: s.awaiting ? { ...s.awaiting } : null,
  };
}

export function createGame(config: GameConfig): GameState {
  const n = config.playerCount;
  if (!Number.isInteger(n) || n < 2 || n > 5) throw new Error(`playerCount must be 2..5, got ${n}`);
  const seed = config.seed >>> 0 || 1;

  const players: PlayerState[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    name: config.playerNames?.[i] ?? `Captain ${i + 1}`,
    alive: true,
    hand: [],
    transmissionUsed: false,
    eliminatedAtTurn: null,
    faction: config.factions?.[i] ?? null, // D-029: faction layer is opt-in; absent = classic vanilla
    factionPowerUsed: false,
  }));

  // 1) shuffle the 46 base cards, deal 4 each; 2) 1 containment each;
  // 3) insert N-1 ruptures + leftover containments; 4) shuffle.
  const first = shuffled(BASE_DECK, seed);
  let rngState = first.state;
  const deck = first.deck;
  for (let round = 0; round < 4; round++) {
    for (const p of players) p.hand.push(deck.shift() as GameState['deck'][number]);
  }
  for (const p of players) p.hand.push('containment');
  deck.push(...Array(n - 1).fill('rupture'), ...Array(CONTAINMENT_COUNT - n).fill('containment'));
  const final = shuffled(deck, rngState);
  rngState = final.state;

  const startPick = randomInt(n, rngState);
  rngState = startPick.state;

  const s: GameState = {
    config: { ...config, modules: { ...config.modules }, ...(config.factions ? { factions: config.factions.slice() } : {}) },
    rngState,
    players,
    deck: final.deck,
    discard: [],
    direction: 1,
    activePlayer: startPick.value,
    turnsOwed: Array(n).fill(0),
    sunFury: 0,
    phase: 'command',
    pending: null,
    awaiting: null,
    bonusDraws: 0,
    rupturesOutOfGame: 0,
    log: [],
    turnCount: 1,
    winner: null,
    stats: {
      overrideWindows: 0, overridesPlayed: 0, transmissionsUsed: 0, cancelledActions: 0,
      maxOverrideStack: 0, flybysPlayed: 0, maxDebt: 0, drawsTotal: 0, reshuffles: 0,
      steals: 0, fizzles: 0, scansPlayed: 0, salvagesPlayed: 0,
      scrapsPlayed: 0, forcedDiscards: 0, deflections: 0, flareSkips: 0,
      courtFavors: 0, rustRuns: 0, stormShouts: 0,
      kitBashes: 0, ringWalls: 0, axialTilts: 0, deepSights: 0, maxGrowth: 0,
    },
  };
  addLog(s, 'game_start', { playerCount: n, modules: s.config.modules, seed, first: s.activePlayer });
  addLog(s, 'turn_start', { player: s.activePlayer, debt: 0 });
  return s;
}

export function aliveIds(s: GameState): number[] {
  return s.players.filter((p) => p.alive).map((p) => p.id);
}

export function nextAliveId(s: GameState, from: number): number {
  const n = s.players.length;
  for (let step = 1; step <= n; step++) {
    const cand = (((from + s.direction * step) % n) + n) % n;
    if (s.players[cand].alive) return cand;
  }
  return from;
}

/** Players who may still respond in the current reaction window. */
export function eligibleReactorIds(s: GameState): number[] {
  if (!s.pending) return [];
  const out: number[] = [];
  for (const p of s.players) {
    if (p.id === s.pending.initiator) continue;
    if (p.alive) out.push(p.id);
    else if (s.config.modules.derelicts && !p.transmissionUsed) out.push(p.id);
  }
  return out;
}

/** D-029 ☿ Flare Skip: true when this captain may fire their once-per-match free ↪️-redirect
 *  right now — they are the current target, alive, faction pilot, power unspent, and they
 *  have not already redirected in this chain (the limit is shared with ↪️, docs/14 §Pilot). */
export function canFlareSkip(s: GameState, id: number): boolean {
  const pending = s.pending;
  if (!pending || pending.target !== id) return false;
  const p = s.players[id];
  return p.alive && p.faction === 'flareskip' && !p.factionPowerUsed
    && !(pending.deflectors ?? []).includes(id);
}

/**
 * D-031 ♀ Venus "Court Favor": true when `id` may reverse the current 🤝 Requisition —
 * they are its target, alive, faction pilot, power unspent, and they have not already
 * redirected/reversed in this chain (shared once-per-captain-per-chain limit with ↪️/☿).
 */
export function canCourtFavor(s: GameState, id: number): boolean {
  const pending = s.pending;
  if (!pending || pending.reason !== 'requisition' || pending.target !== id) return false;
  const p = s.players[id];
  return p.alive && p.faction === 'courtier' && !p.factionPowerUsed
    && !(pending.deflectors ?? []).includes(id);
}

/**
 * D-033 ♄ Saturn "Ringwall": true when `id` may void the current theft — a steal-family
 * reason (🪝 Boarding / Component pair / 🤝 Requisition) aimed at them, alive, faction
 * pilot, power unspent. Deliberately NOT chained to the deflectors list — a wall is a
 * refusal, not a redirect, so it works even if ♄ already redirected earlier in the chain.
 */
export function canRingWall(s: GameState, id: number): boolean {
  const pending = s.pending;
  if (!pending || !(THEFT_REASONS as readonly string[]).includes(pending.reason) || pending.target !== id) return false;
  const p = s.players[id];
  return p.alive && p.faction === 'ringwall' && !p.factionPowerUsed;
}

/**
 * D-033 ♅ Uranus "Axial Tilt": true when `id` may tilt the current attack away — an
 * attack-family reason aimed at them, alive, faction pilot, power unspent, and they have
 * not already redirected in this chain (shared once-per-captain-per-chain limit, like ☿).
 */
export function canAxialTilt(s: GameState, id: number): boolean {
  const pending = s.pending;
  if (!pending || !(ATTACK_REASONS as readonly string[]).includes(pending.reason) || pending.target !== id) return false;
  const p = s.players[id];
  return p.alive && p.faction === 'axialtilt' && !p.factionPowerUsed
    && !(pending.deflectors ?? []).includes(id);
}

/**
 * True when the captain can actually DO something in the current reaction window:
 * hold a Comms Override, be the current target with an unused Deflector (§4.6) or an
 * unspent ☿ Flare Skip (D-029), or be a Derelict with an armed Final Transmission.
 * Everyone else is auto-passed — a forced pass carries no decision, so the window
 * never waits on it (D-020).
 */
export function canRespond(s: GameState, id: number): boolean {
  const pending = s.pending;
  if (!pending) return false;
  const p = s.players[id];
  // The initiator never Overrides their own action — but when a Deflector bounces
  // the attack back at them they ARE the current target and may deflect it on (D-022)
  // with a ↪️ card or their unspent Flare Skip.
  if (id === pending.initiator) {
    return pending.target === id && p.alive
      && !(pending.deflectors ?? []).includes(id)
      && (p.hand.includes('deflector') || canFlareSkip(s, id));
  }
  if (!p.alive) return s.config.modules.derelicts && !p.transmissionUsed;
  if (p.hand.includes('override')) return true;
  return (pending.target === id && p.hand.includes('deflector') && !(pending.deflectors ?? []).includes(id))
    || canFlareSkip(s, id)
    || canCourtFavor(s, id)
    || canRingWall(s, id)
    || canAxialTilt(s, id);
}

/** D-022: everyone the open reaction window must wait on a decision from — every
 *  eligible reactor who hasn't passed, plus the initiator when a Deflector bounced
 *  the attack back at them and they still hold an unused Deflector of their own. */
export function respondentIds(s: GameState): number[] {
  if (!s.pending) return [];
  const ids = eligibleReactorIds(s);
  if (canRespond(s, s.pending.initiator)) ids.push(s.pending.initiator);
  return ids;
}

/** The subset of `respondentIds` the window is still waiting on right now. */
export function openRespondents(s: GameState): number[] {
  if (!s.pending) return [];
  return respondentIds(s).filter((id) => !s.pending!.passed.includes(id));
}

/** Ends the current turn and starts the next (consuming owed turns when asked). */
export function endTurnAndAdvance(s: GameState, consumeDebt: boolean): void {
  if (s.winner !== null) {
    s.phase = 'game_over';
    return;
  }
  addLog(s, 'turn_end', { player: s.activePlayer });
  let next = s.activePlayer;
  if (consumeDebt && s.turnsOwed[next] > 0) {
    s.turnsOwed[next] -= 1;
  } else {
    next = nextAliveId(s, next);
  }
  s.turnCount += 1;
  s.activePlayer = next;
  addLog(s, 'turn_start', { player: next, debt: s.turnsOwed[next] });
  s.phase = 'command';
}

/** Fatal rupture resolution: disable the flagship, reveal hand, maybe end the match. */
export function eliminate(s: GameState, id: number): void {
  const p = s.players[id];
  p.alive = false;
  p.eliminatedAtTurn = s.turnCount;
  const handSizes: Record<number, number> = {};
  for (const q of s.players) handSizes[q.id] = q.hand.length;
  const aliveAfter = s.players.filter((q) => q.alive).map((q) => q.id);
  addLog(s, 'eliminated', { player: id, revealedHand: p.hand.slice(), handSizes, aliveAfter });
  s.discard.push(...p.hand);
  p.hand = [];
  s.rupturesOutOfGame += 1;
  s.turnsOwed[id] = 0;
  const alive = aliveIds(s);
  if (alive.length === 1) {
    s.winner = alive[0];
    s.phase = 'game_over';
    addLog(s, 'win', { player: s.winner, finalHandSizes: s.players.map((q) => q.hand.length) });
  }
}
