import { useState } from 'react';
import { CARD_INFO } from '@last-orbit/game-core';
import type { CardKind, Command, GameState, MatchReport } from '@last-orbit/game-core';
import { LogFeed, Modals } from './Overlays';

interface Props {
  game: GameState;
  dispatch: (cmd: Command) => void;
  error: string | null;
  report: MatchReport | null;
  onNewGame: () => void;
}

export default function GameView({ game, dispatch, error, report, onNewGame }: Props) {
  const [choosing, setChoosing] = useState<CardKind[] | null>(null); // play awaiting target/salvage
  const me = game.players[game.activePlayer];
  const rupturesLeft = game.config.playerCount - 1 - game.rupturesOutOfGame;
  const handKinds = [...new Set(me.hand)];
  const pairs: CardKind[] = handKinds.filter((k) => me.hand.filter((c) => c === k).length >= 2 && CARD_INFO[k].pairable);

  const play = (cards: CardKind[], target?: number, salvageKind?: CardKind) => {
    dispatch({ type: 'PLAY', player: game.activePlayer, cards, target, salvageKind });
    setChoosing(null);
  };

  const onCardClick = (kind: CardKind) => {
    if (kind === 'boarding' || kind === 'requisition' || kind === 'salvage' || CARD_INFO[kind].pairable) {
      setChoosing([kind]);
      return;
    }
    play([kind]);
  };

  const aliveOthers = game.players.filter((p) => p.alive && p.id !== me.id);
  const salvageOptions = [...new Set(game.discard.filter((c) => c !== 'rupture' && c !== 'containment'))];

  return (
    <div className="table">
      <header className="hud">
        <span className="brand">☀️ Last Orbit</span>
        <span>Deck <b>{game.deck.length}</b></span>
        <span>Ruptures left <b>{rupturesLeft}</b></span>
        <span>Turn <b>{game.turnCount}</b></span>
        <span>Direction <b>{game.direction === 1 ? '↻' : '↺'}</b></span>
        {game.config.modules.sunFury && (
          <span className="fury" title="Sun Fury: limits reinsertion depth">
            Fury {Array.from({ length: 5 }, (_, i) => <span key={i} className={i < game.sunFury ? 'pip on' : 'pip'}>●</span>)}
          </span>
        )}
        <button className="ghost" onClick={onNewGame}>New game</button>
      </header>

      <div className="players">
        {game.players.map((p) => (
          <div key={p.id} className={`player ${p.id === game.activePlayer && game.phase === 'command' ? 'active' : ''} ${p.alive ? '' : 'dead'}`}>
            <div className="pname">
              {p.name}
              {!p.alive && ' 💤'}
              {game.turnsOwed[p.id] > 0 && <span className="debt"> +{game.turnsOwed[p.id]}⏱</span>}
              {!p.alive && game.config.modules.derelicts && !p.transmissionUsed && <span title="Final Transmission armed"> 📡</span>}
            </div>
            <div className="pinfo">{p.alive ? `${p.hand.length} cards` : 'derelict'}</div>
          </div>
        ))}
      </div>

      <LogFeed game={game} />

      {game.phase === 'command' && (
        <section className="command">
          <div className="handlabel">{me.name}&apos;s hand — play any number, then draw:</div>
          <div className="hand">
            {handKinds.map((k) => {
              const n = me.hand.filter((c) => c === k).length;
              const playable = CARD_INFO[k].playableInCommand;
              return (
                <button
                  key={k}
                  className={`card ${playable ? '' : 'unplayable'}`}
                  disabled={!playable}
                  onClick={() => onCardClick(k)}
                  title={playable ? '' : k === 'containment' ? 'Auto-used when you draw a Rupture' : 'Used during reaction windows / as pairs'}
                >
                  <span className="emoji">{CARD_INFO[k].emoji}</span>
                  <span>{CARD_INFO[k].name}{n > 1 ? ` ×${n}` : ''}</span>
                </button>
              );
            })}
            {pairs.map((k) => (
              <button key={`pair-${k}`} className="card pair" onClick={() => setChoosing([k, k])}>
                <span className="emoji">{CARD_INFO[k].emoji}{CARD_INFO[k].emoji}</span>
                <span>Play matching pair — steal</span>
              </button>
            ))}
          </div>

          {choosing && choosing.length === 1 && choosing[0] === 'salvage' && (
            <div className="chooser">
              <span>Salvage from discard:</span>
              {salvageOptions.length === 0 && <span className="hint"> (nothing salvageable)</span>}
              {salvageOptions.map((k) => (
                <button key={k} className="mini" onClick={() => play(['salvage'], undefined, k)}>{CARD_INFO[k].emoji} {CARD_INFO[k].name}</button>
              ))}
              <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
            </div>
          )}
          {choosing && (choosing.length === 2 || choosing[0] === 'boarding' || choosing[0] === 'requisition') && (
            <div className="chooser">
              <span>Choose target:</span>
              {aliveOthers.map((p) => (
                <button key={p.id} className="mini" onClick={() => play(choosing, p.id)}>{p.name} ({p.hand.length})</button>
              ))}
              <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
            </div>
          )}

          <button className="primary big" onClick={() => dispatch({ type: 'END_TURN_DRAW', player: game.activePlayer })}>
            End turn — draw a card
          </button>
          {error && <div className="error">{error}</div>}
        </section>
      )}

      <Modals game={game} dispatch={dispatch} report={report} onNewGame={onNewGame} />
    </div>
  );
}
