import type { CardKind, GameState, LogEntry } from './types';

export interface MatchReport {
  winner: number | null;
  turns: number;
  turnsPerPlayer: number[];
  firstElimTurn: number | null;
  elimTurns: number[];
  downtimePerEliminated: number[]; // turns between elimination and match end
  rupturesContained: number;
  rupturesFatal: number;
  finalFury: number;
  maxDebt: number;
  flybysPlayed: number;
  overrideWindows: number;
  overridesPlayed: number;
  transmissionsUsed: number;
  cancelledActions: number;
  maxOverrideStack: number;
  drawsTotal: number;
  reshuffles: number;
  steals: number;
  fizzles: number;
  scans: number;
  salvages: number;
  scraps: number; // Components scrapped for a peek
  forcedDiscards: number; // cards destroyed by ⚡ Ion Surge
  deflections: number; // ↪️ Deflector uses
  flareSkips: number; // ☿ faction power uses (D-029)
  maxGrowth: number; // tallest escalation chain payload growth
  passTurnRate: number; // fraction of turns with zero card plays
  playedCounts: Partial<Record<CardKind, number>>;
  comeback: boolean; // winner held the strictly smallest hand at some elimination
  winnerHandSize: number;
}

export function matchReport(s: GameState): MatchReport {
  const log: LogEntry[] = s.log;
  const turnsPerPlayer = Array(s.players.length).fill(0);
  const playedCounts: Partial<Record<CardKind, number>> = {};
  const turnsWithPlays = new Set<number>();
  let firstElimTurn: number | null = null;
  const elimTurns: number[] = [];
  let comeback = false;

  for (const e of log) {
    switch (e.type) {
      case 'turn_start':
        turnsPerPlayer[e.data?.player as number] += 1;
        break;
      case 'play': {
        const turn = e.turn;
        turnsWithPlays.add(turn);
        for (const c of e.data?.cards as CardKind[]) playedCounts[c] = (playedCounts[c] ?? 0) + 1;
        break;
      }
      case 'override':
        if (e.data?.viaCard) playedCounts.override = (playedCounts.override ?? 0) + 1;
        break;
      case 'deflect':
        playedCounts.deflector = (playedCounts.deflector ?? 0) + 1;
        break;
      case 'eliminated': {
        if (firstElimTurn === null) firstElimTurn = e.turn;
        elimTurns.push(e.turn);
        const sizes = e.data?.handSizes as Record<number, number>;
        const aliveAfter = (e.data?.aliveAfter as number[]) ?? [];
        const rivals = aliveAfter.filter((id) => id !== s.winner);
        if (
          s.winner !== null &&
          aliveAfter.includes(s.winner) &&
          rivals.length > 0 &&
          sizes[s.winner] < Math.min(...rivals.map((id) => sizes[id]))
        ) {
          comeback = true; // winner held the strictly smallest hand at some elimination
        }
        break;
      }
    }
  }

  return {
    winner: s.winner,
    turns: s.turnCount,
    turnsPerPlayer,
    firstElimTurn,
    elimTurns,
    downtimePerEliminated: s.players
      .filter((p) => !p.alive && p.eliminatedAtTurn !== null)
      .map((p) => s.turnCount - (p.eliminatedAtTurn as number)),
    rupturesContained: log.filter((e) => e.type === 'contained').length,
    rupturesFatal: s.rupturesOutOfGame,
    finalFury: s.sunFury,
    maxDebt: s.stats.maxDebt,
    flybysPlayed: s.stats.flybysPlayed,
    overrideWindows: s.stats.overrideWindows,
    overridesPlayed: s.stats.overridesPlayed,
    transmissionsUsed: s.stats.transmissionsUsed,
    cancelledActions: s.stats.cancelledActions,
    maxOverrideStack: s.stats.maxOverrideStack,
    drawsTotal: s.stats.drawsTotal,
    reshuffles: s.stats.reshuffles,
    steals: s.stats.steals,
    fizzles: s.stats.fizzles,
    scans: s.stats.scansPlayed,
    salvages: s.stats.salvagesPlayed,
    scraps: s.stats.scrapsPlayed,
    forcedDiscards: s.stats.forcedDiscards,
    deflections: s.stats.deflections,
    flareSkips: s.stats.flareSkips,
    maxGrowth: s.stats.maxGrowth,
    passTurnRate: s.turnCount > 0 ? 1 - turnsWithPlays.size / s.turnCount : 0,
    playedCounts,
    comeback,
    winnerHandSize: s.winner !== null ? s.players[s.winner].hand.length : 0,
  };
}
