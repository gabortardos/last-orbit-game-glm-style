import { Suspense, lazy, useRef, useState, type CSSProperties } from 'react';
import { CARD_INFO } from '@last-orbit/game-core';
import type { CardKind, Command, FactionId, MatchReport } from '@last-orbit/game-core';

/** D-038 rung 1 — the living solar system behind the table (lazy chunk, pure UI). */
const SolarScene = lazy(() => import('./SolarScene'));
import { deckSize, handSize } from '../online/types';
import type { ClientGame } from '../online/types';
import { isMuted, startAudio, toggleMuted } from '../audio';
import { LogFeed, Modals, TimerBadge } from './Overlays';
import ReviewFooter from './ReviewFooter';
import Glyph from './Glyph';
import Briefing from './Briefing';
import Codex from './Codex';
import { CARD_FACE, CARD_BACK, CAPTAIN_AVATAR } from './visualAssets';
import { FACTION_POWER } from './factions';

const asStyle = (vars: Record<string, string>) => vars as CSSProperties;

/** Approved card accent colors by category (V1 assembly deck.html) + the engine kind → category map. */
const ACCENT: Record<string, string> = { catastrophe: '#e9a160', survival: '#71d8d1', action: '#a3c4e6', component: '#c5d5df' };
const CATEGORY_LABEL: Record<string, string> = { catastrophe: 'Catastrophe', survival: 'Survival', action: 'Action', component: 'Component' };
const CATEGORY: Record<CardKind, string> = {
  rupture: 'catastrophe', containment: 'survival', coolant: 'component', hull: 'component',
  storm: 'action', wind: 'action', override: 'action', deflector: 'action', flyby: 'action', burn: 'action', scan: 'action',
  slingshot: 'action', requisition: 'action', boarding: 'action', ion_surge: 'action', tractor: 'action', reversal: 'action', salvage: 'action',
};
/** Cards that need a target captain (the rest play directly or open their own picker). */
const TARGETED: CardKind[] = ['boarding', 'requisition', 'ion_surge', 'tractor'];

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

/** The V1 command deck (QA-V-041 / QA-V-044): top status bar · captains + systems rail ·
 *  hand with select-then-act card detail · flight log column. The living solar system stays
 *  behind it (D-038 rung 1). Engine behavior is unchanged — every button dispatches the same
 *  commands the previous UI did. */
export default function GameView({ game, viewer, humans, dispatch, error, report, onNewGame, remote }: Props) {
  const [choosing, setChoosing] = useState<CardKind[] | null>(null); // play awaiting target/salvage
  const [bashKind, setBashKind] = useState<CardKind | null>(null); // D-033 🌍 Kit Bash: which Component, then which victim
  const [selected, setSelected] = useState<CardKind | null>(null); // approved deck: select a card → read it → act
  const [help, setHelp] = useState(false);
  const [civs, setCivs] = useState(false);
  const [muted, setMuted] = useState(isMuted());
  const helpBtn = useRef<HTMLButtonElement>(null); // A15: close returns focus to the opener
  const civsBtn = useRef<HTMLButtonElement>(null);
  const solo = humans.length === 1;
  const me = game.players[viewer];
  const active = game.players[game.activePlayer];
  const myTurn = game.phase === 'command' && game.activePlayer === viewer;
  const rupturesLeft = game.config.playerCount - 1 - game.rupturesOutOfGame;
  const handKinds = [...new Set(me.hand)];
  const aliveOthers = game.players.filter((p) => p.alive && p.id !== me.id);
  const salvageOptions = [...new Set(game.discard.filter((c) => c !== 'rupture' && c !== 'containment'))];
  const topDiscard = game.discard.length > 0 ? game.discard[game.discard.length - 1] : null;
  const sel = selected && me.hand.includes(selected) ? selected : null;
  const selInfo = sel ? CARD_INFO[sel] : null;
  const selN = sel ? me.hand.filter((c) => c === sel).length : 0;

  const play = (cards: CardKind[], target?: number, salvageKind?: CardKind) => {
    dispatch({ type: 'PLAY', player: viewer, cards, target, salvageKind });
    setChoosing(null);
    setSelected(null);
  };
  const timing = (k: CardKind): string => {
    const i = CARD_INFO[k];
    if (!i.playableInCommand) {
      if (k === 'containment') return 'Auto-used when you draw a ☀️';
      if (k === 'wind') return 'Bonus draw already happened';
      if (k === 'deflector') return 'Reaction only — when you are attacked';
      return 'Reaction windows only';
    }
    return i.pairable ? 'Command phase · pairable' : 'Command phase';
  };
  const phaseText = game.phase === 'reaction' ? 'Reaction window'
    : game.phase === 'choice' ? 'Decision pending'
      : game.phase === 'game_over' ? 'Race complete'
        : myTurn ? 'Your command' : `${active.name}'s turn`;
  const pips = Array.from({ length: 5 }, (_, i) => <i key={i} className={i < game.sunFury ? 'on' : ''} />);

  return (
    <div className="table v1">
      {/* D-038 rung 1: the solar system glows behind the deck (pure UI, lazy chunk) */}
      <Suspense fallback={null}>
        <SolarScene game={game} />
      </Suspense>
      <header className="top">
        <div className="brand"><Glyph id="brand" label="Last Orbit" /><span>LAST ORBIT<small>GRAND SOLAR RALLY</small></span></div>
        <div className="hud">
          <span className="hudstat" title="Draw pile — face down. Drawing is how a ☀️ finds you."><Glyph id="deck" label="Draw pile" />Deck <b>{deckSize(game)}</b><img src={CARD_BACK} alt="" /></span>
          <span className="hudstat" title={topDiscard ? `Discard pile — top: ${CARD_INFO[topDiscard].name}` : 'Discard pile — empty'}>
            <Glyph id="discard" label="Discard pile" />Discard <b>{game.discard.length}</b>{topDiscard && <img src={CARD_FACE[topDiscard]} alt="" />}
          </span>
          <span className="hudstat" title="Solar Ruptures still hidden in the deck"><Glyph id="rupture" label="Ruptures left" />Ruptures left <b>{rupturesLeft}</b></span>
          <span className="hudstat">Turn <b>{game.turnCount}</b></span>
          <span className="hudstat">Direction <b>{game.direction === 1 ? '↻' : '↺'}</b></span>
          {game.config.modules.sunFury && (
            <span className="hudstat" title={`Sun Fury ${game.sunFury}/5 — from Fury 2 a contained ☀️ must go back within the top 15 cards (3 → 10, 4 → 7, 5 → 5).`}>
              <Glyph id="sun-fury" label="Sun Fury" /><span className="pips">{pips}</span>
            </span>
          )}
          <TimerBadge game={game} viewer={viewer} hud />
        </div>
        <div className="hud">
          <button ref={civsBtn} className="ghost" onClick={() => setCivs(true)} title="The eight civilizations of the Grand Solar Rally — lore, comedy wells, real planet facts"><Glyph id="civilizations" label="" /><span>Civs</span></button>
          <button ref={helpBtn} className="ghost" onClick={() => setHelp(true)} title="Rules, goal and card reference"><Glyph id="help" label="" /><span>Help</span></button>
          <button className="ghost" onClick={onNewGame} title="Back to the table configuration"><Glyph id="back" label="" /><span>New game</span></button>
          <button className="ghost" onClick={() => { startAudio(); setMuted(toggleMuted()); }} title={muted ? 'Ambient music off — click to enable' : 'Ambient music on — click to mute'}>
            <Glyph id={muted ? 'sound-off' : 'sound-on'} label={muted ? 'Sound off' : 'Sound on'} />
          </button>
          <span className="phase">{phaseText}</span>
        </div>
      </header>

      <div className="layout">
        <aside className="rail">
          <section className="panel">
            <div className="panelhead"><span>CAPTAINS</span><span className="small">{game.config.playerCount} SEATS</span></div>
            <div className="body players">
              {game.players.map((p) => (
                <div key={p.id} className={`player ${p.id === game.activePlayer && game.phase === 'command' ? 'active' : ''} ${p.alive ? '' : 'dead'}`}>
                  <span className="pavatar">
                    {p.faction
                      ? <img src={CAPTAIN_AVATAR[p.faction]} alt="" loading="lazy" />
                      : <Glyph id={humans.includes(p.id) ? 'human' : remote ? 'network' : 'bot'} label={humans.includes(p.id) ? 'Human captain' : remote ? 'Remote captain' : 'AI captain'} />}
                    {p.faction && <Glyph id={p.faction} label={FACTION_POWER[p.faction].planet} />}
                  </span>
                  <div>
                    <strong>{p.name}{!p.alive && ' 💤'}</strong>
                    <small>
                      {p.faction ? `${FACTION_POWER[p.faction].planet} · ` : ''}
                      {p.alive ? `${handSize(game, p.id)} cards` : 'derelict'}
                      {game.turnsOwed[p.id] > 0 && <span className="debt"> +{game.turnsOwed[p.id]}⏱</span>}
                      {!p.alive && game.config.modules.derelicts && !p.transmissionUsed && ' · 📡 armed'}
                    </small>
                    {p.faction && (
                      <span className={p.factionPowerUsed ? 'spent' : 'ready'} title={FACTION_CHIP[p.faction].title}>
                        {FACTION_POWER[p.faction].name} · {p.factionPowerUsed ? 'spent' : 'ready'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panelhead"><span>SYSTEMS</span><span className="small">PUBLIC INFO</span></div>
            <div className="body">
              <div className="statgrid">
                <div className="statbox"><Glyph id="deck" label="" /><b>{deckSize(game)}</b><span>DECK</span></div>
                <div className="statbox"><Glyph id="discard" label="" /><b>{game.discard.length}</b><span>DISCARD</span></div>
                <div className="statbox"><Glyph id="rupture" label="" /><b>{rupturesLeft}</b><span>RUPTURES LEFT</span></div>
                <div className="statbox"><Glyph id={game.direction === 1 ? 'forward' : 'back'} label="" /><b>{game.direction === 1 ? '↻' : '↺'}</b><span>DIRECTION</span></div>
              </div>
              {game.config.modules.sunFury && (
                <div className="furybox">
                  <strong>SUN FURY {game.sunFury}/5</strong>
                  <div className="pips">{pips}</div>
                  <p className="note">Every contained ☀️ enrages the Sun. From Fury 2 a contained ☀️ must go back within the top 15 cards (Fury 3 → 10, 4 → 7, 5 → 5).</p>
                </div>
              )}
            </div>
          </section>
        </aside>

        <main className="main">
          {myTurn && (
            <section className="panel">
              <div className="panelhead"><span>YOUR HAND</span><span className="small">{me.name.toUpperCase()} · {me.hand.length} CARDS</span></div>
              <div className="hand">
                {handKinds.map((k) => {
                  const n = me.hand.filter((c) => c === k).length;
                  return (
                    <button
                      key={k}
                      className="handcard"
                      style={asStyle({ '--accent': ACCENT[CATEGORY[k]] })}
                      aria-pressed={sel === k}
                      onClick={() => { setSelected(k); setChoosing(null); }}
                      title={`${CARD_INFO[k].name} — ${timing(k)}. ${CARD_INFO[k].blurb}`}
                    >
                      <img className="handart" src={CARD_FACE[k]} alt={CARD_INFO[k].name} loading="lazy" draggable={false} />
                      {n > 1 && <span className="qty">×{n}</span>}
                      <div className="handtitle"><Glyph id={k} label="" /><strong>{CARD_INFO[k].name}</strong></div>
                      <small>{timing(k)}</small>
                    </button>
                  );
                })}
              </div>
              <p className="handnote">Select a card to read it, then act. Matching Components in pairs steal; a lone Component scraps for a peek at the deck.</p>

              {sel && selInfo && (
                <div className="seldetail" style={asStyle({ '--accent': ACCENT[CATEGORY[sel]] })}>
                  <img className="selected-art" src={CARD_FACE[sel]} alt={selInfo.name} />
                  <div>
                    <div className="sel-title"><Glyph id={sel} label="" /><div><small>{CATEGORY_LABEL[CATEGORY[sel]]} · {timing(sel)}</small><h3>{selInfo.name}{selN > 1 ? ` ×${selN}` : ''}</h3></div></div>
                    <p className="copy">{selInfo.blurb}</p>
                    <div className="actions">
                      {!selInfo.playableInCommand && <button disabled>{timing(sel)}</button>}
                      {selInfo.playableInCommand && selInfo.pairable && selN === 1 && (
                        <button className="primary" onClick={() => play([sel])}>Scrap one · peek at the deck</button>
                      )}
                      {selInfo.playableInCommand && selInfo.pairable && selN >= 2 && (
                        <>
                          <button className="primary" onClick={() => setChoosing([sel, sel])}>Play matching pair · steal</button>
                          <button onClick={() => play([sel])}>Scrap one · peek</button>
                        </>
                      )}
                      {selInfo.playableInCommand && !selInfo.pairable && sel === 'salvage' && (
                        <button className="primary" disabled={salvageOptions.length === 0} onClick={() => setChoosing(['salvage'])}>Salvage from the discard →</button>
                      )}
                      {selInfo.playableInCommand && !selInfo.pairable && TARGETED.includes(sel) && (
                        <button className="primary" onClick={() => setChoosing([sel])}>Play · choose a target →</button>
                      )}
                      {selInfo.playableInCommand && !selInfo.pairable && sel !== 'salvage' && !TARGETED.includes(sel) && (
                        <button className="primary" onClick={() => play([sel])}>Play {selInfo.name}</button>
                      )}
                    </div>
                    {choosing && choosing.length === 1 && choosing[0] === 'salvage' && (
                      <div className="targetlist">
                        <span className="hint">Salvage from discard:</span>
                        {salvageOptions.length === 0 && <span className="hint"> (nothing salvageable)</span>}
                        {salvageOptions.map((k) => (
                          <button key={k} className="mini" title={CARD_INFO[k].blurb} onClick={() => play(['salvage'], undefined, k)}>{CARD_INFO[k].emoji} {CARD_INFO[k].name}</button>
                        ))}
                        <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
                      </div>
                    )}
                    {choosing && (choosing.length === 2 || TARGETED.includes(choosing[0])) && (
                      <div className="targetlist">
                        <span className="hint">Choose target:</span>
                        {aliveOthers.map((p) => (
                          <button key={p.id} className="mini" onClick={() => play(choosing, p.id)}>{p.name} ({handSize(game, p.id)})</button>
                        ))}
                        <button className="ghost" onClick={() => setChoosing(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* D-031 ♂ Mars: once-per-match free grab from the discard pile, opened as a
                  reaction window so one 📡 can cancel it (the run is spent either way). */}
              {me.faction === 'rustborn' && !me.factionPowerUsed && salvageOptions.length > 0 && (
                <div className="chooser">
                  <span className="hint">♂ Salvage Run — take from discard, free (once per match; a 📡 can cancel it):</span>
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
                  <span className="hint">🌍 Kit Bash — one Component as a full pair (once per match; 📡-able):</span>
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
                  <span className="hint">🌍 Kit Bash — siphon from (once per match; 📡-able):</span>
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
                  <span className="hint">♆ Deep Sight — peek at the top 3 cards, free (once per match):</span>
                  <button
                    className="mini flarebtn"
                    title="Faction power: privately view the top 3 cards of the deck, in order — a Deep-Space Scan without spending the card. Only you see them; the deck does not change."
                    onClick={() => dispatch({ type: 'DEEP_SIGHT', player: viewer })}
                  >
                    🔭 Look
                  </button>
                </div>
              )}

              <div className="actionbar">
                <div>
                  <strong>{me.name} — Command Phase</strong>
                  <p>Play any number of cards, then draw to end the turn. Drawing is the only way a ☀️ finds you.</p>
                </div>
                <button className="primary" onClick={() => dispatch({ type: 'END_TURN_DRAW', player: viewer })}>End turn · draw</button>
              </div>
              {error && <div className="outcome red">{error}</div>}
            </section>
          )}

          {!myTurn && (
            <section className="panel">
              <div className="panelhead"><span>SCENARIO</span><span className="small">THE GRAND SOLAR RALLY</span></div>
              <div className="mapfoot">
                <div>
                  <div className="badge">Turn {game.turnCount} · {game.direction === 1 ? 'clockwise ↻' : 'counter-clockwise ↺'}</div>
                  <h2>{active.name} is plotting a course…</h2>
                  <p>The living solar system behind the table is the race. Play your hand, outwit the other captains — be the last flagship still flying.</p>
                </div>
                <TimerBadge game={game} viewer={viewer} />
              </div>
            </section>
          )}
        </main>

        <aside className="right">
          <LogFeed game={game} viewer={viewer} />
        </aside>
      </div>

      <Modals game={game} dispatch={dispatch} report={report} onNewGame={onNewGame} viewer={viewer} humans={humans} remote={remote} />

      {/* D-023: help + codex stay reachable above every window, even mid-reaction */}
      <div className="cornerctl">
        <button className="ghost" onClick={() => setCivs(true)} title="Civilization codex — open any time, even mid-window"><Glyph id="civilizations" label="Civilizations" /></button>
        <button className="ghost" onClick={() => setHelp(true)} title="Rules & card reference — open any time, even mid-window"><Glyph id="help" label="Help" /></button>
      </div>
      {help && <Briefing onClose={() => { setHelp(false); helpBtn.current?.focus(); }} sunFury={game.config.modules.sunFury} derelicts={game.config.modules.derelicts} />}
      {civs && <Codex onClose={() => { setCivs(false); civsBtn.current?.focus(); }} />}
      <ReviewFooter />
    </div>
  );
}
