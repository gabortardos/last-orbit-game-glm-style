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
  blurb: string; // one-line player-facing effect text (UI tooltips & briefing)
}

export const CARD_INFO: Record<CardKind, CardInfo> = {
  rupture: { name: 'Solar Rupture', emoji: '☀️', category: 'catastrophe', playableInCommand: false, pairable: false, blurb: 'Catastrophe — revealed the instant you draw it. Hold a 🛡️ Containment Field → it is auto-spent to contain. Hold none → your flagship is disabled: you are out. Ruptures never enter hands.' },
  containment: { name: 'Containment Field', emoji: '🛡️', category: 'survival', playableInCommand: false, pairable: false, blurb: 'Your life insurance — never played by choice. It spends itself automatically when you draw a ☀️ Solar Rupture. There are only 6 in the game.' },
  override: { name: 'Comms Override', emoji: '📡', category: 'action', playableInCommand: false, pairable: false, blurb: 'Reaction only — play it when another captain acts to jam their comms. Each Override flips the outcome; after everyone has spoken, an ODD number of Overrides cancels the action.' },
  flyby: { name: 'Forced Flyby', emoji: '🚀', category: 'action', playableInCommand: true, pairable: false, blurb: 'Skim the next captain’s station: your turn ends with no draw, and they owe 2 extra turns PLUS your remaining debt (max 6 total). More draws = more rupture chances — for them.' },
  burn: { name: 'Emergency Burn', emoji: '🔥', category: 'action', playableInCommand: true, pairable: false, blurb: 'End this turn immediately WITHOUT drawing. The classic way to dodge a ☀️ you know is waiting at the top of the deck.' },
  scan: { name: 'Deep-Space Scan', emoji: '🔭', category: 'action', playableInCommand: true, pairable: false, blurb: 'Privately view the top 3 cards of the deck, in order. Information is survival — plan your draw, or someone else’s.' },
  slingshot: { name: 'Gravity Slingshot', emoji: '🌀', category: 'action', playableInCommand: true, pairable: false, blurb: 'Shuffle the entire deck. Wrecks everyone’s scan knowledge and secretly-reinserted Ruptures alike. Chaos tool.' },
  requisition: { name: 'Emergency Requisition', emoji: '🤝', category: 'action', playableInCommand: true, pairable: false, blurb: 'Demand supplies: the target captain gives you 1 card — but THEY choose which. Generosity is not guaranteed.' },
  boarding: { name: 'Boarding Party', emoji: '🪝', category: 'action', playableInCommand: true, pairable: false, blurb: 'Grapple and loot: steal 1 RANDOM card from a target captain’s hand. Might be their last 🛡️. They will remember.' },
  reversal: { name: 'Course Reversal', emoji: '↔️', category: 'action', playableInCommand: true, pairable: false, blurb: 'Flip the direction of play, then end this turn without drawing. (With 2 captains it just works as an Emergency Burn.)' },
  salvage: { name: 'Salvage Operation', emoji: '♻️', category: 'action', playableInCommand: true, pairable: false, blurb: 'Rummage the discard pile: take any one card into your hand — except ☀️ Ruptures and 🛡️ Containment Fields.' },
  coolant: { name: 'Coolant Cell', emoji: '❄️', category: 'component', playableInCommand: false, pairable: true, blurb: 'Component — dead weight on its own. Play TWO matching to siphon: steal 1 random card from a target captain.' },
  hull: { name: 'Hull Plating', emoji: '🛠️', category: 'component', playableInCommand: false, pairable: true, blurb: 'Component — dead weight on its own. Play TWO matching to siphon: steal 1 random card from a target captain.' },
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
