// Last Orbit — core types. See docs/03-rules-v0.2.md (canonical rules).

export type CardKind =
  | 'rupture' // Solar Rupture (catastrophe; never in hands)
  | 'containment' // Containment Field (survival; auto-played)
  | 'override' // Comms Override (reaction-only)
  | 'deflector' // Deflector (reaction-only; redirect a targeted attack, payload +1)
  | 'flyby' // Forced Flyby
  | 'burn' // Emergency Burn
  | 'scan' // Deep-Space Scan
  | 'slingshot' // Gravity Slingshot
  | 'requisition' // Emergency Requisition
  | 'boarding' // Boarding Party
  | 'reversal' // Course Reversal
  | 'salvage' // Salvage Operation
  | 'ion_surge' // Ion Surge (target jettisons cards at random)
  | 'tractor' // Tractor Snag (target discards down to 3, their choice)
  | 'storm' // Micrometeoroid Storm (draw-step danger)
  | 'wind' // Solar Wind (draw-step boon)
  | 'coolant' // Component: Coolant Cell
  | 'hull'; // Component: Hull Plating

export interface ModuleFlags {
  sunFury: boolean;
  derelicts: boolean;
}

/** Faction layer (D-029 pilot + D-031 batch): per-seat, optional, off by default.
 *  'flareskip' = Mercury — once per match, free ↪️-redirect when attacked (docs/14 §Pilot).
 *  'courtier'  = Venus — once per match, reverse a 🤝 Requisition aimed at you (docs/14 §Courtier).
 *  'rustborn'  = Mars — once per match, free ♻️-salvage during your Command Phase (docs/14 §Rustborn).
 *  'stormkin'  = Jupiter — once per match, pass a drawn ☄️ Storm's jettison to another captain (docs/14 §Stormkin). */
export type FactionId = 'flareskip' | 'courtier' | 'rustborn' | 'stormkin';

export interface GameConfig {
  playerCount: number; // 2..5
  modules: ModuleFlags;
  seed: number;
  playerNames?: string[];
  factions?: (FactionId | null)[]; // per-seat factions; absent/null seat = classic (vanilla)
}

export interface PlayerState {
  id: number;
  name: string;
  alive: boolean;
  hand: CardKind[];
  transmissionUsed: boolean; // Derelict Final Transmission (module)
  eliminatedAtTurn: number | null;
  faction: FactionId | null; // D-029: null = classic captain, no power
  factionPowerUsed: boolean; // spent powers are public (Pillar 4)
}

export type PendingReason =
  | 'flyby' | 'burn' | 'reversal' | 'scan' | 'slingshot'
  | 'boarding' | 'pair' | 'requisition' | 'salvage'
  | 'scrap' | 'ion_surge' | 'tractor';

export interface PendingAction {
  initiator: number;
  reason: PendingReason;
  cards: CardKind[]; // played cards (already discarded)
  overrides: { player: number; viaCard: boolean }[]; // viaCard=false → Final Transmission
  passed: number[]; // players who passed since the last override/deflect
  target?: number;
  salvageKind?: CardKind;
  growth?: number; // Deflector payload growth (0..3) — applies to scaling reasons only
  deflectors?: number[]; // captains who already deflected in this chain (once each)
  giftTo?: number; // D-031 ♀: set by Court Favor — who receives the requisitioned card (default: initiator)
}

export type AwaitingChoice =
  | { type: 'give'; from: number; to: number } // Requisition giver picks a card
  | { type: 'reinsert' } // contained rupture reinsertion (active player)
  | { type: 'storm_discard'; player: number; drawnBy?: number } // drew a ☄️ Storm: choose 1 card to jettison (drawnBy set only while the drawer may still ♃ Storm Shout — D-031)
  | { type: 'snag_discard'; player: number; count: number }; // 🧲 Tractor Snag: choose cards to discard

export type Phase = 'command' | 'reaction' | 'choice' | 'game_over';

export type LogVisibility = 'public' | { only: number } | 'hidden';

export interface LogEntry {
  turn: number; // turnCount when the event happened
  type: string;
  data?: Record<string, unknown>;
  visibility: LogVisibility; // 'hidden' = simulation-only detail (e.g., reinsert position)
}

export interface GameStats {
  overrideWindows: number;
  overridesPlayed: number;
  transmissionsUsed: number;
  cancelledActions: number;
  maxOverrideStack: number;
  flybysPlayed: number;
  maxDebt: number;
  drawsTotal: number;
  reshuffles: number;
  steals: number;
  fizzles: number; // steal/gift into empty hand
  scansPlayed: number;
  salvagesPlayed: number;
  scrapsPlayed: number; // Components scrapped for a peek
  forcedDiscards: number; // cards destroyed by ⚡ Ion Surge
  deflections: number; // ↪️ Deflector uses
  flareSkips: number; // ☿ faction power uses (D-029; cardless, counted separately)
  courtFavors: number; // ♀ faction power uses (D-031)
  rustRuns: number; // ♂ faction power uses (D-031; counted at initiation — a 📡-cancelled run still burns the power)
  stormShouts: number; // ♃ faction power uses (D-031)
  maxGrowth: number; // tallest escalation chain payload growth
}

export interface GameState {
  config: GameConfig;
  rngState: number;
  players: PlayerState[];
  deck: CardKind[]; // index 0 = top
  discard: CardKind[];
  direction: 1 | -1;
  activePlayer: number;
  turnsOwed: number[]; // extra turns owed, consumed at each turn end
  sunFury: number; // 0..5 (module)
  phase: Phase;
  pending: PendingAction | null;
  awaiting: AwaitingChoice | null;
  bonusDraws: number; // pending 🌟 Solar Wind bonus draws (draw chain may pause on choices)
  rupturesOutOfGame: number; // fatal ruptures removed
  log: LogEntry[];
  turnCount: number; // 1-based
  winner: number | null;
  stats: GameStats;
}

export type Command =
  | { type: 'PLAY'; player: number; cards: CardKind[]; target?: number; salvageKind?: CardKind }
  | { type: 'END_TURN_DRAW'; player: number }
  | { type: 'OVERRIDE'; player: number }
  | { type: 'PASS'; player: number }
  | { type: 'DEFLECT'; player: number; target: number } // target-only reaction: redirect + payload +1
  | { type: 'FLARE_SKIP'; player: number; target: number } // ☿ Mercury power (D-029): DEFLECT without paying the card, once per match
  | { type: 'COURT_FAVOR'; player: number } // ♀ Venus power (D-031): reverse a Requisition aimed at you — the initiator gifts you instead, once per match
  | { type: 'RUST_RUN'; player: number; card: CardKind } // ♂ Mars power (D-031): free Salvage during your Command Phase, once per match (📡 can cancel)
  | { type: 'STORM_SHOUT'; player: number; target: number } // ♃ Jupiter power (D-031): you drew a ☄️ — another captain jettisons instead, once per match
  | { type: 'GIVE'; player: number; card: CardKind } // resolve Requisition gift
  | { type: 'STORM_DISCARD'; player: number; card: CardKind } // resolve ☄️ Storm jettison
  | { type: 'SNAG_DISCARD'; player: number; cards: CardKind[] } // resolve 🧲 Tractor Snag discards
  | { type: 'REINSERT'; player: number; positionFromTop: number }; // 1 = top

export type ApplyResult = { ok: true; state: GameState } | { ok: false; error: string };
