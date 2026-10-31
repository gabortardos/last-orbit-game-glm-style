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