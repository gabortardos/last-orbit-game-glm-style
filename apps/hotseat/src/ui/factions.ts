/**
 * Fleet labels shared by the setup screens (hotseat Setup + online lobby) —
 * D-029/D-033: per-seat faction powers, all opt-in, once per match, spent publicly.
 */
import type { FactionId } from '@last-orbit/game-core';

export const FACTION_LABEL: Record<FactionId, string> = {
  flareskip: '☿ Mercury · Flare Skip',
  courtier: '♀ Venus · Court Favor',
  rustborn: '♂ Mars · Salvage Run',
  stormkin: '♃ Jupiter · Storm Shout',
  kitbash: '🌍 Earth · Kit Bash',
  ringwall: '♄ Saturn · Ringwall',
  axialtilt: '♅ Uranus · Axial Tilt',
  deepsight: '♆ Neptune · Deep Sight',
};

/** V1 fleet metadata for the approved table-setup detail panel (power texts = Setup's canon blurbs). */
export const FACTION_POWER: Record<FactionId, { planet: string; name: string; blurb: string; color: string }> = {
  flareskip: { planet: 'Mercury', name: 'Flare Skip', blurb: 'When attacked, redirect it for free (payload still grows).', color: '#e5c08b' },
  courtier: { planet: 'Venus', name: 'Court Favor', blurb: 'When requisitioned, flip it: they gift you instead.', color: '#e9b7a6' },
  rustborn: { planet: 'Mars', name: 'Salvage Run', blurb: 'Take any discard card for free on your turn (📡-able).', color: '#e07a4f' },
  stormkin: { planet: 'Jupiter', name: 'Storm Shout', blurb: 'When you draw a storm, another captain jettisons instead.', color: '#78d5ce' },
  kitbash: { planet: 'Earth', name: 'Kit Bash', blurb: 'Play one ❄️/🛠️ as a full pair: siphon (📡-able, ↪️-able).', color: '#f2953f' },
  ringwall: { planet: 'Saturn', name: 'Ringwall', blurb: 'A theft of their cards fizzles (⚡/🧲 vandalism still bites).', color: '#9fe3d0' },
  axialtilt: { planet: 'Uranus', name: 'Axial Tilt', blurb: 'An attack aimed at them slides to someone else, un-grown.', color: '#8fe3ff' },
  deepsight: { planet: 'Neptune', name: 'Deep Sight', blurb: 'A free private peek at the top 3 cards of the deck.', color: '#c7ec6e' },
};