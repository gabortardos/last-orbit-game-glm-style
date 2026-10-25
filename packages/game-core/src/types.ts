// Last Orbit — core types. See docs/03-rules-v0.2.md (canonical rules).

export type CardKind =
  | 'rupture' // Solar Rupture (catastrophe; never in hands)
  | 'containment' // Containment Field (survival; auto-played)
  | 'override' // Comms Override (reaction-only)
  | 'flyby' // Forced Flyby
  | 'burn' // Emergency Burn
  | 'scan' // Deep-Space Scan
  | 'slingshot' // Gravity Slingshot
  | 'requisition' // Emergency Requisition
  | 'boarding' // Boarding Party
  | 'reversal' // Course Reversal
  | 'salvage' // Salvage Operation
  | 'coolant' // Component: Coolant Cell
  | 'hull'; // Component: Hull Plating

export interface ModuleFlags {
  sunFury: boolean;
  derelicts: boolean;
}

export interface GameConfig {
  playerCount: number; // 2..5
  modules: ModuleFlags;
  seed: number;
  playerNames?: string[];
}

export interface PlayerState {
  id: number;
  name: string;
  alive: boolean;
  hand: CardKind[];
  transmissionUsed: boolean; // Derelict Final Transmission (module)
  eliminatedAtTurn: number | null;
}

export type PendingReason =
  | 'flyby' | 'burn' | 'reversal' | 'scan' | 'slingshot'
  | 'boarding' | 'pair' | 'requisition' | 'salvage';

export interface PendingAction {
  initiator: number;
  reason: PendingReason;
  cards: CardKind[]; // played cards (already discarded)
  overrides: { player: number; viaCard: boolean }[]; // viaCard=false → Final Transmission
  passed: number[]; // players who passed since the last override
  target?: number;
  salvageKind?: CardKind;
}

export type AwaitingChoice =
  | { type: 'give'; from: number; to: number } // Requisition giver picks a card
  | { type: 'reinsert' }; // contained rupture reinsertion (active player)

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
  | { type: 'GIVE'; player: number; card: CardKind } // resolve Requisition gift
  | { type: 'REINSERT'; player: number; positionFromTop: number }; // 1 = top

export type ApplyResult = { ok: true; state: GameState } | { ok: false; error: string };
