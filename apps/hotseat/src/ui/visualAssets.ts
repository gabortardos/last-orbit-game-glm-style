/**
 * V1 visual asset bindings — the typed bridge between the engine and the approved art.
 * Card faces: the 19 approved V6 exports (import-log #1, D-045).
 * Captains/environments: the 32 V1 runtime assets (import-log #2/#3, QA-G-021 + D-047).
 * Runtime path: `/visual/<assetId>.png|.webp` via the Vite default publicDir (`apps/hotseat/public/`).
 * Provenance: docs/visual-studio/import-log.md — every file SHA-256 verified before import.
 * The `Record<CardKind, …>` shape makes the compiler enforce the 18/18 card-kind coverage
 * (asset-bindings.json cross-check; QA-V-036 faction mapping re-verified 8/8).
 */
import type { CardKind, FactionId } from '@last-orbit/game-core';

/** engine CardKind → V6 export id fragment (asset-bindings.json `card` list, exact). */
const V6_ID: Record<CardKind, string> = {
  rupture: 'RUPTURE',
  storm: 'STORM',
  containment: 'CONTAINMENT',
  override: 'OVERRIDE',
  deflector: 'DEFLECTOR',
  flyby: 'FLYBY',
  burn: 'BURN',
  scan: 'SCAN',
  slingshot: 'SLINGSHOT',
  requisition: 'REQUISITION',
  boarding: 'BOARDING',
  reversal: 'REVERSAL',
  salvage: 'SALVAGE',
  ion_surge: 'ION-SURGE',
  tractor: 'TRACTOR',
  wind: 'WIND',
  coolant: 'COOLANT',
  hull: 'HULL',
};

/** faction id → manifest planet fragment (bindings: flareskip→mercury … deepsight→neptune). */
const PLANET: Record<FactionId, string> = {
  flareskip: 'MERCURY',
  courtier: 'VENUS',
  rustborn: 'MARS',
  stormkin: 'JUPITER',
  kitbash: 'EARTH',
  ringwall: 'SATURN',
  axialtilt: 'URANUS',
  deepsight: 'NEPTUNE',
};

export const CARD_FACE: Record<CardKind, string> = Object.fromEntries(
  (Object.keys(V6_ID) as CardKind[]).map((k) => [k, `/visual/LO-CARD-${V6_ID[k]}-V6.png`]),
) as Record<CardKind, string>;

export const CARD_BACK = '/visual/LO-CARD-BACK-V6.png';

/** 600×800 reviewed portrait (Mercury: 08 rematte track; Earth: byte-exact 05 framing). */
export const CAPTAIN_PORTRAIT: Record<FactionId, string> = Object.fromEntries(
  (Object.keys(PLANET) as FactionId[]).map((f) => [f, `/visual/LO-CAPT-${PLANET[f]}-PORTRAIT-V1.webp`]),
) as Record<FactionId, string>;

/** 512×512 reviewed avatar (glyph+name stays a UI-layer mark at small sizes — QA-G-021). */
export const CAPTAIN_AVATAR: Record<FactionId, string> = Object.fromEntries(
  (Object.keys(PLANET) as FactionId[]).map((f) => [f, `/visual/LO-CAPT-${PLANET[f]}-AVATAR-V1.webp`]),
) as Record<FactionId, string>;

/** 1280×720 reviewed background (Mercury/Earth/Mars: 08 corrected track; rest: locked originals). */
export const ENV_BACKGROUND: Record<FactionId, string> = Object.fromEntries(
  (Object.keys(PLANET) as FactionId[]).map((f) => [f, `/visual/LO-ENV-${PLANET[f]}-BG-V1.webp`]),
) as Record<FactionId, string>;

/** 640×360 reviewed thumb — hero strips, codex tiles, chip backdrops. */
export const ENV_THUMB: Record<FactionId, string> = Object.fromEntries(
  (Object.keys(PLANET) as FactionId[]).map((f) => [f, `/visual/LO-ENV-${PLANET[f]}-THUMB-V1.webp`]),
) as Record<FactionId, string>;
