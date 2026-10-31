import { useState } from 'react';
import { CARD_INFO } from '@last-orbit/game-core';
import type { CardKind, Command, FactionId, MatchReport } from '@last-orbit/game-core';
import { deckSize, handSize } from '../online/types';
import type { ClientGame } from '../online/types';

/** D-031: every civilization's once-per-match power is a public chip at the table (Pillar 4). */
const FACTION_CHIP: Record<FactionId, { label: string; title: string }> = {
  flareskip: {
    label: '☿ Flare Skip',
    title: '☿ Mercury — Flare Skip: once per match, when attacked, redirect the attack as if playing ↪️ — no card paid. Spent powers are public.',
  },
  courtier: {
    label: '♀ Court Favor',
    title: '♀ Venus — Court Favor: once per match, when a 🤝 Requisition targets you, flip it — the initiator gifts YOU 1 card instead (one 📡 still cancels the exchange). Spent powers are public.',
  },
  rustborn: {
    label: '♂ Salvage Run',
    title: '♂ Mars — Salvage Run: once per match, during your Command Phase, take any card from the discard pile for free (one 📡 can cancel it — the run is spent either way). Spent powers are public.',
  },
  stormkin: {
    label: '♃ Storm Shout',
    title: '♃ Jupiter — Storm Shout: once per match, when you draw a ☄️ Storm, jettison nothing — another captain jettisons 1 card instead. Spent powers are public.',
  },
  kitbash: {
    label: '🌍 Kit Bash',
    title: '🌍 Earth — Kit Bash: once per match, during your Command Phase, play a single ❄️/🛠️ Component as a completed pair — siphon 1 random card from a target (one 📡 cancels it; the victim may ↪️; the bash is spent either way). Spent powers are public.',
  },
  ringwall: {
    label: '♄ Ringwall',
    title: '♄ Saturn — Ringwall: once per match, when a theft (🪝 Boarding, 🤝 Requisition or a Component pair) would take a card from you, the theft fizzles — the attacker\'s card is still spent. ⚡/🧲 destruction is not theft: it passes the rings. Spent powers are public.',
  },
  axialtilt: {
    label: '♅ Axial Tilt',
    title: '♅ Uranus — Axial Tilt: once per match, when an attack card or pair targets you, it is re-aimed at another captain with NO payload growth (2-player: it slides back at the attacker). A later ↪️ from the new target grows normally. Spent powers are public.',
  },
  deepsight: {
    label: '♆ Deep Sight',
    title: '♆ Neptune — Deep Sight: once per match, during your own Command Phase, privately view the top 3 cards of the deck — a 🔭 without spending the card. Counterplay: 🌀 Slingshot shuffles the sight into noise. Spent powers are public.',
  },
};
import { LogFeed, Modals, SoundButton } from './Overlays';
import Briefing from './Briefing';
import Codex from './Codex';

interface Props {
  game: ClientGame; // local GameState OR an online per-seat snapshot (same layout)
  viewer: number; // whose eyes we render through (solo vs AI: always the human's seat)
  humans: number[]; // human-controlled seats; the others are AI captains (online: just us)
  remote?: boolean; // online match: the other captains sit at their own screens
  dispatch: (cmd: Command) => void;
  error: string | null;
  report: MatchReport | null;
  onNewGame: () => void;
}

export default function GameView({ game, viewer, humans, dispatch, error, report, onNewGame, remote }: Props) {
  const [choosing, setChoosing] = useState<CardKind[] | null>(null); // play awaiting target/salvage
  const [bashKind, setBashKind] = useState<CardKind | null>(null); // D-033 🌍 Kit Bash: which Component, then which victim
  const [help, setHelp] = useState(false);
  const [civs, setCivs] = useState(false);
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
        <span>Deck <b>{deckSize(game)}</b></span>
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
        <button className="ghost" onClick={() => setCivs(true)} title="The eight civilizations of the Grand Solar Rally — lore, comedy wells, real planet facts">📖 Civs</button>
        <button className="ghost" onClick={() => setHelp(true)} title="Rules, goal and card reference">❓ Help</button>
        <button className="ghost" onClick={onNewGame}>New game</button>
      </header>

      <div className="players">
        {game.players.map((p) => (
          <div key={p.id} className={`player ${p.id === game.activePlayer && game.phase === 'command' ? 'active' : ''} ${p.alive ? '' : 'dead'}`}>
            <div className="pname">
              {p.name}
              {(solo || remote) && (
                <span className="chip" title={humans.includes(p.id) ? 'you' : remote ? 'a captain on another screen' : 'AI captain'}>
                  {humans.includes(p.id) ? ' 👤 you' : remote ? ' 🌐' : ' 🤖'}
                </span>
              )}
              {p.faction && (
                <span
                  className={`chip flare ${p.factionPowerUsed ? 'spent' : 'ready'}`}
                  title={FACTION_CHIP[p.faction].title}
                >
                  {FACTION_CHIP[p.faction].label} {p.factionPowerUsed ? '· spent' : '· ready'}
                </span>
              )}
              {!p.alive && ' 💤'}
              {game.turnsOwed[p.id] > 0 && <span className="debt"> +{game.turnsOwed[p.id]}⏱</span>}
              {!p.alive && game.config.modules.derelicts && !p.transmissionUsed && <span title="Final Transmission armed"> 📡</span>}
            </div>
            <div className="pinfo">{p.alive ? `${handSize(game, p.id)} cards` : 'derelict'}</div>
          </div>
        ))}
      </div>

      <LogFeed game={game} viewer={viewer} />

      {game.phase === 'command' && !myTurn && (
        <section className="command thinking">{remote ? '🌐' : '🤖'} {game.players[game.activePlayer].name} is plotting a course…</section>
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
                <button key={p.id} className="mini" onClick={() => play(choosing, p.id)}>{p.name} ({handSize(game, p.id)})</button>
              ))}
              <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
            </div>
          )}

          {/* D-031 ♂ Mars: once-per-match free grab from the discard pile, opened as a
              reaction window so one 📡 can cancel it (the run is spent either way). */}
          {me.faction === 'rustborn' && !me.factionPowerUsed && salvageOptions.length > 0 && (
            <div className="chooser">
              <span>♂ Salvage Run — take from discard, free (once per match; a 📡 can cancel it):</span>
              {salvageOptions.map((k) => (
                <button
                  key={`rust-${k}`}
                  className="mini flarebtn"
                  title={`${CARD_INFO[k].blurb}\n(Faction power: take this card into your hand for free — opens a reaction window first.)`}
                  onClick={() => dispatch({ type: 'RUST_RUN', player: viewer, card: k })}
                >
                  {CARD_INFO[k].emoji} {CARD_INFO[k].name}
                </button>
              ))}
            </div>
          )}

          {/* D-033 🌍 Earth: one Component counts as a full pair — the siphon opens a normal
              reaction window (📡-able, ↪️-able), and the bash burns even if cancelled. */}
          {me.faction === 'kitbash' && !me.factionPowerUsed && !bashKind && (
            <div className="chooser">
              <span>🌍 Kit Bash — one Component as a full pair (once per match; 📡-able):</span>
              {(['coolant', 'hull'] as const).filter((k) => me.hand.includes(k)).map((k) => (
                <button
                  key={`bash-${k}`}
                  className="mini flarebtn"
                  title={`${CARD_INFO[k].blurb}\n(Faction power: play this single Component as a completed matching pair — siphon 1 random card from a chosen captain. One 📡 cancels the siphon; the victim may ↪️ it onward; the power is spent either way.)`}
                  onClick={() => setBashKind(k)}
                >
                  {CARD_INFO[k].emoji} {CARD_INFO[k].name}
                </button>
              ))}
            </div>
          )}
          {bashKind && (
            <div className="chooser">
              <span>🌍 Kit Bash — siphon from (once per match; 📡-able):</span>
              {aliveOthers.map((p) => (
                <button
                  key={`bash-at-${p.id}`}
                  className="mini flarebtn"
                  title={`Steal 1 random card from ${p.name}'s hand as a completed pair (one 📡 cancels; they may ↪️ it onward).`}
                  onClick={() => { dispatch({ type: 'KIT_BASH', player: viewer, card: bashKind, target: p.id }); setBashKind(null); }}
                >
                  {p.name} ({handSize(game, p.id)})
                </button>
              ))}
              <button className="ghost" onClick={() => setBashKind(null)}>Cancel</button>
            </div>
          )}

          {/* D-033 ♆ Neptune: a free private top-3 peek during your own Command Phase.
              No reaction window — the peek itself is instant and private. */}
          {me.faction === 'deepsight' && !me.factionPowerUsed && (
            <div className="chooser">
              <span>♆ Deep Sight — peek at the top 3 cards, free (once per match):</span>
              <button
                className="mini flarebtn"
                title="Faction power: privately view the top 3 cards of the deck, in order — a Deep-Space Scan without spending the card. Only you see them; the deck does not change."
                onClick={() => dispatch({ type: 'DEEP_SIGHT', player: viewer })}
              >
                🔭 Look
              </button>
            </div>
          )}

          <button className="primary big" onClick={() => dispatch({ type: 'END_TURN_DRAW', player: viewer })}>
            End turn — draw a card
          </button>
          {error && <div className="error">{error}</div>}
        </section>
      )}

      <Modals game={game} dispatch={dispatch} report={report} onNewGame={onNewGame} viewer={viewer} humans={humans} remote={remote} />

      {/* D-023: sound + help float above every window — the briefing is reachable at any moment,
          even mid-reaction, so card meanings are never more than one tap away */}
      <div className="cornerctl">
        <SoundButton />
        <button className="ghost" onClick={() => setCivs(true)} title="Civilization codex — open any time, even mid-window">📖</button>
        <button className="ghost" onClick={() => setHelp(true)} title="Rules & card reference — open any time, even mid-window">❓</button>
      </div>
      {help && <Briefing onClose={() => setHelp(false)} sunFury={game.config.modules.sunFury} derelicts={game.config.modules.derelicts} />}
      {civs && <Codex onClose={() => setCivs(false)} />}
    </div>
  );
}
