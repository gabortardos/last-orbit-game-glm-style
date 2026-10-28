import { useCallback, useMemo, useState } from 'react';
import {
  applyCommand, createGame, matchReport,
} from '@last-orbit/game-core';
import type { CardKind, Command, GameState } from '@last-orbit/game-core';
import Setup from './ui/Setup';
import GameView from './ui/GameView';
import { DrawReveal, HandoffGate } from './ui/Overlays';

export interface StartOptions {
  playerCount: number;
  names: string[];
  sunFury: boolean;
  derelicts: boolean;
  seed: number;
}

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gateFor, setGateFor] = useState<number | null>(null); // privacy handoff between captains
  const [reveal, setReveal] = useState<{ player: number; card: CardKind } | null>(null); // draw reveal for the drawer's eyes

  const start = useCallback((opts: StartOptions) => {
    const g = createGame({
      playerCount: opts.playerCount,
      playerNames: opts.names,
      modules: { sunFury: opts.sunFury, derelicts: opts.derelicts },
      seed: opts.seed,
    });
    setGame(g);
    setGateFor(g.activePlayer);
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
        if (res.state.phase === 'command' && res.state.activePlayer !== cur.activePlayer) {
          setGateFor(res.state.activePlayer); // device passes to the new active captain
        }
        if (cmd.type === 'END_TURN_DRAW') {
          // show the drawer what they drew before the device moves on
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

  const report = useMemo(() => (game && game.phase === 'game_over' ? matchReport(game) : null), [game]);

  if (!game) return <Setup onStart={start} />;

  return (
    <div className="app">
      {game.phase === 'command' && gateFor !== null && (
        <HandoffGate game={game} player={gateFor} onDone={() => setGateFor(null)} />
      )}
      {reveal && (
        <DrawReveal game={game} reveal={reveal} onDone={() => setReveal(null)} />
      )}
      <GameView game={game} dispatch={dispatch} error={error} report={report} onNewGame={() => { setGame(null); setGateFor(null); setReveal(null); }} />
    </div>
  );
}
