import type { CardKind } from './types';

export const FURY_CAP = 5;
export const DEBT_CAP = 6;

/** The 38 cards dealt from / shuffled before inserting ruptures + containments. */
export const BASE_DECK: readonly CardKind[] = [
  ...Array(5).fill('override'),
  ...Array(4).fill('flyby'),
  ...Array(4).fill('burn'),
  ...Array(4).fill('scan'),
  ...Array(3).fill('slingshot'),
  ...Array(4).fill('requisition'),
  ...Array(2).fill('boarding'),
  ...Array(2).fill('reversal'),
  ...Array(2).fill('salvage'),
  ...Array(4).fill('coolant'),
  ...Array(4).fill('hull'),
];

export const CONTAINMENT_COUNT = 6;

export interface CardInfo {
  name: string;
  emoji: string;
  category: 'catastrophe' | 'survival' | 'action' | 'component';
  playableInCommand: boolean; // as a normal action in the Command Phase
  pairable: boolean; // usable as a 2-match Component pair
}

export const CARD_INFO: Record<CardKind, CardInfo> = {
  rupture: { name: 'Solar Rupture', emoji: '☀️', category: 'catastrophe', playableInCommand: false, pairable: false },
  containment: { name: 'Containment Field', emoji: '🛡️', category: 'survival', playableInCommand: false, pairable: false },
  override: { name: 'Comms Override', emoji: '📡', category: 'action', playableInCommand: false, pairable: false },
  flyby: { name: 'Forced Flyby', emoji: '🚀', category: 'action', playableInCommand: true, pairable: false },
  burn: { name: 'Emergency Burn', emoji: '🔥', category: 'action', playableInCommand: true, pairable: false },
  scan: { name: 'Deep-Space Scan', emoji: '🔭', category: 'action', playableInCommand: true, pairable: false },
  slingshot: { name: 'Gravity Slingshot', emoji: '🌀', category: 'action', playableInCommand: true, pairable: false },
  requisition: { name: 'Emergency Requisition', emoji: '🤝', category: 'action', playableInCommand: true, pairable: false },
  boarding: { name: 'Boarding Party', emoji: '🪝', category: 'action', playableInCommand: true, pairable: false },
  reversal: { name: 'Course Reversal', emoji: '↔️', category: 'action', playableInCommand: true, pairable: false },
  salvage: { name: 'Salvage Operation', emoji: '♻️', category: 'action', playableInCommand: true, pairable: false },
  coolant: { name: 'Coolant Cell', emoji: '❄️', category: 'component', playableInCommand: false, pairable: true },
  hull: { name: 'Hull Plating', emoji: '🛠️', category: 'component', playableInCommand: false, pairable: true },
};

/** Sun Fury reinsertion depth limit (module). Fury ≤1 → anywhere. */
export function furyDepthLimit(fury: number): number {
  if (fury <= 1) return Number.POSITIVE_INFINITY;
  const table: Record<number, number> = { 2: 15, 3: 10, 4: 7, 5: 5 };
  return table[Math.min(FURY_CAP, fury)] ?? 5;
}

export function isComponent(kind: CardKind): boolean {
  return kind === 'coolant' || kind === 'hull';
}
