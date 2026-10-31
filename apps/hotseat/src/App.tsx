import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyCommand, botCommandFor, createGame, matchReport, openRespondents,
} from '@last-orbit/game-core';
import type { BotPolicy, CardKind, Command, FactionId, GameState } from '@last-orbit/game-core';
import Setup from './ui/Setup';
import GameView from './ui/GameView';
import { DrawReveal, HandoffGate } from './ui/Overlays';
import { sfx } from './audio';
import type { Sfx } from './audio';

export interface StartOptions {
  playerCount: number;
  names: string[];
  sunFury: boolean;
  derelicts: boolean;
  seed: number;
  humans: number[]; // seats controlled by humans; the rest are AI captains
  factions?: (FactionId | null)[]; // per-seat fleets (D-029); undefined/null seat = classic vanilla
}

const BOT_POLICY: BotPolicy = 'greedy';
const BOT_THINK_MS = 1100; // command-phase pacing so bot turns are watchable
const BOT_REACT_MS = 850;

/** Public log events that get a quiet stinger (audio.ts). */
const LOG_SFX: Record<string, Sfx> = {
  play: 'play', override: 'override', transmission: 'override', pending_cancelled: 'cancelled',
  steal: 'steal', steal_card: 'steal', give: 'give', flyby_debt: 'flyby',
  rupture_reveal: 'rupture', contained: 'contained', fury_up: 'fury',
  eliminated: 'eliminated', win: 'win',
  storm_hit: 'storm', storm_discard: 'storm', wind_bonus: 'wind',
  deflect: 'deflect', flare_skip: 'deflect', surge_hit: 'surge', forced_discard: 'surge', snag_hit: 'snag', snag_discard: 'snag',
  court_favor: 'steal', rust_run: 'play', storm_shout: 'storm', // D-031 faction stingers
  kit_bash: 'steal', ring_wall: 'deflect', axial_tilt: 'deflect', deep_sight: 'play', // D-033 faction stingers
};

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [humans, setHumans] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gateFor, setGateFor] = useState<number | null>(null); // privacy handoff between human captains
  const [reveal, setReveal] = useState<{ player: number; card: CardKind } | null>(null); // draw reveal for the drawer's eyes
  const humansRef = useRef<number[]>([]);
  const dispatchRef = useRef<(c: Command) => void>(() => {});
  const botRng = useRef<() => number>(() => Math.random()); // UI bots needn't be deterministic

  const start = useCallback((opts: StartOptions) => {
    const g = createGame({
      playerCount: opts.playerCount,
      playerNames: opts.names,
      modules: { sunFury: opts.sunFury, derelicts: opts.derelicts },
      seed: opts.seed,
      factions: opts.factions,
    });
    humansRef.current = opts.humans;
    setHumans(opts.humans);
    setGame(g);
    setGateFor(opts.humans.length > 1 && opts.humans.includes(g.activePlayer) ? g.activePlayer : null); // solo: no device passing
    setReveal(null);
    setError(null);
  }, []);

  const dispatch = useCallback(
    (cmd: Command) => {
      setGame((cur) => {
        if (!cur) return cur;
        const res = applyCommand(cur, cmd);
        if (!res.ok) {
          setError(res.error);
          return cur;
        }
        setError(null);
        const hs = humansRef.current;
        if (res.state.phase === 'command' && res.state.activePlayer !== cur.activePlayer) {
          // handoff gate is a pass-and-play privacy tool only — never in solo vs AI
          setGateFor(hs.length > 1 && hs.includes(res.state.activePlayer) ? res.state.activePlayer : null);
        }
        if (cmd.type === 'END_TURN_DRAW' && hs.includes(cmd.player) && res.state.awaiting === null) {
          // show the drawer what they drew before the device moves on (humans only;
          // when a choice is pending — ☄️ storm, contained ☀️ — its own modal tells the story)
          const lastDraw = [...res.state.log].reverse().find((e) => e.type === 'draw');
          const card = lastDraw?.data?.card;
          if (lastDraw?.data?.player === cmd.player && typeof card === 'string') {
            setReveal({ player: cmd.player, card: card as CardKind });
          }
        }
        return res.state;
      });
    },
    [],
  );
  dispatchRef.current = dispatch;

  // AI captain driver: whenever a bot has a decision to make, make it after a short, watchable delay.
  useEffect(() => {
    if (!game || game.phase === 'game_over') return;
    const hs = humansRef.current;
    let actor: number | null = null;
    if (game.phase === 'command') {
      actor = hs.includes(game.activePlayer) ? null : game.activePlayer;
    } else if (game.phase === 'reaction') {
      // openRespondents includes the bounced initiator when they may still deflect (D-022)
      actor = openRespondents(game).find((id) => !hs.includes(id)) ?? null;
    } else if (game.phase === 'choice') {
      const aw = game.awaiting;
      // who must answer the pending choice: give → giver; storm/snag → the victim; reinsert → active player
      const decider = aw?.type === 'give'
        ? aw.from
        : aw?.type === 'storm_discard' || aw?.type === 'snag_discard'
          ? aw.player
          : game.activePlayer;
      actor = hs.includes(decider) ? null : decider;
    }
    if (actor === null) return;
    const cmd = botCommandFor(game, actor, BOT_POLICY, botRng.current);
    if (!cmd) return;
    const t = setTimeout(() => dispatchRef.current(cmd), game.phase === 'reaction' ? BOT_REACT_MS : BOT_THINK_MS);
    return () => clearTimeout(t);
  }, [game]);

  const report = useMemo(() => (game && game.phase === 'game_over' ? matchReport(game) : null), [game]);

  // sound design: quiet stingers follow the public event log
  const seenLog = useRef(0);
  useEffect(() => {
    if (!game) { seenLog.current = 0; return; }
    for (const e of game.log.slice(seenLog.current)) {
      const k = LOG_SFX[e.type];
      if (k) sfx(k);
    }
    seenLog.current = game.log.length;
  }, [game]);

  if (!game) return <Setup onStart={start} />;

  // whose eyes the UI shows the table through (solo: always the human's seat)
  const viewer = humans.includes(game.activePlayer) ? game.activePlayer : humans[0] ?? 0;

  return (
    <div className="app">
      {game.phase === 'command' && gateFor !== null && (
        <HandoffGate game={game} player={gateFor} onDone={() => setGateFor(null)} />
      )}
      {reveal && (
        <DrawReveal game={game} reveal={reveal} solo={humans.length === 1} onDone={() => setReveal(null)} />
      )}
      <GameView game={game} viewer={viewer} humans={humans} dispatch={dispatch} error={error} report={report} onNewGame={() => { setGame(null); setGateFor(null); setReveal(null); }} />
    </div>
  );
}
