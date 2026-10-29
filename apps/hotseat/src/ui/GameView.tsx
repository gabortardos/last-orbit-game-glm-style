import { useState } from 'react';
import { CARD_INFO } from '@last-orbit/game-core';
import type { CardKind, Command, GameState, MatchReport } from '@last-orbit/game-core';
import { LogFeed, Modals, SoundButton } from './Overlays';
import Briefing from './Briefing';

interface Props {
  game: GameState;
  viewer: number; // whose eyes we render through (solo vs AI: always the human's seat)
  humans: number[]; // human-controlled seats; the others are AI captains
  dispatch: (cmd: Command) => void;
  error: string | null;
  report: MatchReport | null;
  onNewGame: () => void;
}

export default function GameView({ game, viewer, humans, dispatch, error, report, onNewGame }: Props) {
  const [choosing, setChoosing] = useState<CardKind[] | null>(null); // play awaiting target/salvage
  const [help, setHelp] = useState(false);
  const solo = humans.length === 1;
  const me = game.players[viewer];
  const myTurn = game.phase === 'command' && game.activePlayer === viewer;
  const rupturesLeft = game.config.playerCount - 1 - game.rupturesOutOfGame;
  const handKinds = [...new Set(me.hand)];
  const pairs: CardKind[] = handKinds.filter((k) => me.hand.filter((c) => c === k).length >= 2 && CARD_INFO[k].pairable);

  const play = (cards: CardKind[], target?: number, salvageKind?: CardKind) => {
    dispatch({ type: 'PLAY', player: viewer, cards, target, salvageKind });
    setChoosing(null);
  };

  const onCardClick = (kind: CardKind) => {
    if (kind === 'boarding' || kind === 'requisition' || kind === 'salvage' || kind === 'ion_surge' || kind === 'tractor') {
      setChoosing([kind]);
      return;
    }
    play([kind]); // lone Components land here → Scrap (peek at the top card)
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
          <button
            className="fury"
            onClick={() => setHelp(true)}
            title={`Sun Fury ${game.sunFury}/5 — every contained ☀️ enrages the Sun (+1). From Fury 2, a contained ☀️ must be reinserted within the top 15 cards (Fury 3 → 10, 4 → 7, 5 → 5) — burying it deep gets harder as the Sun gets angrier. Click for the briefing.`}
          >
            Fury {Array.from({ length: 5 }, (_, i) => <span key={i} className={i < game.sunFury ? 'pip on' : 'pip'}>●</span>)}
          </button>
        )}
        <button className="ghost" onClick={() => setHelp(true)} title="Rules, goal and card reference">❓ Help</button>
        <button className="ghost" onClick={onNewGame}>New game</button>
      </header>

      <div className="players">
        {game.players.map((p) => (
          <div key={p.id} className={`player ${p.id === game.activePlayer && game.phase === 'command' ? 'active' : ''} ${p.alive ? '' : 'dead'}`}>
            <div className="pname">
              {p.name}
              {solo && <span className="chip" title={humans.includes(p.id) ? 'you' : 'AI captain'}>{humans.includes(p.id) ? ' 👤 you' : ' 🤖'}</span>}
              {!p.alive && ' 💤'}
              {game.turnsOwed[p.id] > 0 && <span className="debt"> +{game.turnsOwed[p.id]}⏱</span>}
              {!p.alive && game.config.modules.derelicts && !p.transmissionUsed && <span title="Final Transmission armed"> 📡</span>}
            </div>
            <div className="pinfo">{p.alive ? `${p.hand.length} cards` : 'derelict'}</div>
          </div>
        ))}
      </div>

      <LogFeed game={game} viewer={viewer} />

      {game.phase === 'command' && !myTurn && (
        <section className="command thinking">🤖 {game.players[game.activePlayer].name} is plotting a course…</section>
      )}

      {myTurn && (
        <section className="command">
          <div className="handlabel">{me.name}&apos;s hand — play any number, then draw:</div>
          <div className="hand">
            {handKinds.map((k) => {
              const n = me.hand.filter((c) => c === k).length;
              const playable = CARD_INFO[k].playableInCommand;
              const note = !playable
                ? (k === 'containment'
                    ? ' — auto-used when you draw a ☀️'
                    : k === 'wind'
                      ? ' — its bonus draw already happened; it just pads your hand now'
                      : k === 'deflector'
                        ? ' — reaction only, when YOU are attacked: pass it on, +1'
                        : ' — reaction windows only')
                : (CARD_INFO[k].pairable ? ' — click to SCRAP for a peek; use the pair button to steal' : '');
              return (
                <button
                  key={k}
                  className={`card ${playable ? '' : 'unplayable'}`}
                  disabled={!playable}
                  onClick={() => onCardClick(k)}
                  title={CARD_INFO[k].blurb + note}
                >
                  <span className="emoji">{CARD_INFO[k].emoji}</span>
                  <span>{CARD_INFO[k].name}{n > 1 ? ` ×${n}` : ''}{CARD_INFO[k].pairable && n === 1 && <span className="lone"> · scrap me, or find my twin</span>}</span>
                </button>
              );
            })}
            {pairs.map((k) => (
              <button key={`pair-${k}`} className="card pair" onClick={() => setChoosing([k, k])} title="Play two matching Components as one action: steal 1 random card from a target captain (can be overridden).">
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
                <button key={k} className="mini" title={CARD_INFO[k].blurb} onClick={() => play(['salvage'], undefined, k)}>{CARD_INFO[k].emoji} {CARD_INFO[k].name}</button>
              ))}
              <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
            </div>
          )}
          {choosing && (choosing.length === 2 || ['boarding', 'requisition', 'ion_surge', 'tractor'].includes(choosing[0])) && (
            <div className="chooser">
              <span>Choose target:</span>
              {aliveOthers.map((p) => (
                <button key={p.id} className="mini" onClick={() => play(choosing, p.id)}>{p.name} ({p.hand.length})</button>
              ))}
              <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
            </div>
          )}

          <button className="primary big" onClick={() => dispatch({ type: 'END_TURN_DRAW', player: viewer })}>
            End turn — draw a card
          </button>
          {error && <div className="error">{error}</div>}
        </section>
      )}

      <Modals game={game} dispatch={dispatch} report={report} onNewGame={onNewGame} viewer={viewer} humans={humans} />

      {/* D-023: sound + help float above every window — the briefing is reachable at any moment,
          even mid-reaction, so card meanings are never more than one tap away */}
      <div className="cornerctl">
        <SoundButton />
        <button className="ghost" onClick={() => setHelp(true)} title="Rules & card reference — open any time, even mid-window">❓</button>
      </div>
      {help && <Briefing onClose={() => setHelp(false)} sunFury={game.config.modules.sunFury} derelicts={game.config.modules.derelicts} />}
    </div>
  );
}
