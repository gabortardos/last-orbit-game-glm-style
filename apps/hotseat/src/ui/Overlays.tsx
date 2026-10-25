import { useEffect, useRef, useState } from 'react';
import { CARD_INFO, eligibleReactorIds, furyDepthLimit } from '@last-orbit/game-core';
import type { CardKind, Command, GameState, LogEntry, MatchReport } from '@last-orbit/game-core';

/** Privacy gate between captains (pass-and-play). */
export function HandoffGate({ game, player, onDone }: { game: GameState; player: number; onDone: () => void }) {
  return (
    <div className="overlay gate" onClick={onDone}>
      <div className="modal">
        <h2>Pass the device to</h2>
        <div className="bigname">🛰️ {game.players[player].name}</div>
        <p className="hint">Your turn: play any cards you like, then <b>draw to end the turn</b>.</p>
        <p className="hint">Goal: be the last flagship flying. Everyone else — eyes off the screen.</p>
        <p className="hint dim">Tap to start the turn.</p>
      </div>
    </div>
  );
}

const reasonText = (r: string): string => ({
  flyby: 'Forced Flyby', burn: 'Emergency Burn', reversal: 'Course Reversal', scan: 'Deep-Space Scan',
  slingshot: 'Gravity Slingshot', boarding: 'Boarding Party', pair: 'Component pair steal',
  requisition: 'Emergency Requisition', salvage: 'Salvage Operation',
} as Record<string, string>)[r] ?? r;

/** The public event feed, filtered by visibility. */
export function LogFeed({ game }: { game: GameState }) {
  const viewer = game.activePlayer;
  const visible = game.log.filter((e) => {
    if (e.visibility === 'public' || e.visibility === 'hidden') return e.visibility === 'public';
    return e.visibility.only === viewer;
  });
  const feed = visible.slice(-40).map(fmtEntry(game)).filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [feed.length]);
  return (
    <div className="log" ref={ref}>
      {feed.map((line, i) => (
        <div key={i} className={`logline ${line.startsWith('☀️') || line.startsWith('💥') || line.startsWith('🏆') ? 'loud' : ''}`}>{line}</div>
      ))}
    </div>
  );
}

function fmtEntry(game: GameState) {
  const name = (id: unknown): string => game.players[id as number]?.name ?? '?';
  const cardNames = (ks: CardKind[]): string => ks.map((k) => `${CARD_INFO[k].emoji} ${CARD_INFO[k].name}`).join(' + ');
  return (e: LogEntry): string => {
    const d = e.data ?? {};
    switch (e.type) {
      case 'game_start': return `The Rally begins — ${d.playerCount} captains. ${name(d.first)} takes the first orbit.`;
      case 'turn_start': return `▸ ${name(d.player)}'s turn${d.debt ? ` (owes ${d.debt} extra)` : ''}`;
      case 'play': return `${name(d.player)} plays ${cardNames(d.cards as CardKind[])}${d.target !== undefined ? ` → ${name(d.target)}` : ''}${d.salvage ? ` (${CARD_INFO[d.salvage as CardKind].name})` : ''}`;
      case 'override': return `📡 ${name(d.player)} overrides! (stack ${d.stack})`;
      case 'transmission': return `📡 ${name(d.player)}'s ghost signal crackles…`;
      case 'pending_cancelled': return `Action cancelled by override.`;
      case 'draw': return `${name(d.player)} draws a card (${d.deckLeft} left in deck)`;
      case 'rupture_reveal': return `☀️ SOLAR RUPTURE tears open on ${name(d.player)}'s flagship!`;
      case 'fury_up': return `🌞 The Sun rages — Fury ${d.fury}/5`;
      case 'contained': return `🛡️ ${name(d.player)} contains the rupture!`;
      case 'eliminated': return `💥 ${name(d.player)}'s flagship is disabled and towed home.`;
      case 'flyby_debt': return `🚀 ${name(d.player)} owes ${d.amount} turn(s) — Forced Flyby!`;
      case 'turn_skipped': return `${name(d.player)} ends a turn without drawing.`;
      case 'direction': return `↔️ Play direction reversed!`;
      case 'steal': return `🪝 ${name(d.to)} steals a card from ${name(d.from)}.`;
      case 'give': return `🤝 ${name(d.from)} gives a card to ${name(d.to)}.`;
      case 'fizzle': return `…their hand is empty. Nothing happens.`;
      case 'scan_seen': return `🔭 You saw the top ${(d.cards as CardKind[]).length} cards.`;
      case 'salvage_take': return `♻️ ${name(d.player)} salvages ${CARD_INFO[d.card as CardKind].name}.`;
      case 'reshuffle': return `🌀 Discard pile reshuffled into the deck.`;
      case 'skip_draw': return `No cards left to draw — turn ends.`;
      case 'win': return `🏆 ${name(d.player)} wins the Grand Solar Rally!`;
      default: return '';
    }
  };
}

export function ReactionOverlay({ game, dispatch }: { game: GameState; dispatch: (c: Command) => void }) {
  if (game.phase !== 'reaction' || !game.pending) return null;
  const pending = game.pending;
  const undecided = eligibleReactorIds(game).filter((id) => !pending.passed.includes(id));
  return (
    <div className="overlay">
      <div className="modal">
        <h3>{game.players[pending.initiator].name} plays {reasonText(pending.reason)}</h3>
        <p className="hint">Overrides cancel the previous Override — odd stack cancels the action.</p>
        {undecided.map((id) => {
          const p = game.players[id];
          const hasCard = p.hand.includes('override');
          return (
            <div key={id} className="reactrow">
              <span className="pname">{p.name}{p.alive ? '' : ' (derelict)'}</span>
              <button
                className="mini"
                disabled={p.alive && !hasCard}
                title={p.alive && !hasCard ? 'No Comms Override in hand' : p.alive ? 'Play Comms Override' : 'Spend Final Transmission'}
                onClick={() => dispatch({ type: 'OVERRIDE', player: id })}
              >
                {p.alive ? '📡 Override' : '📡 Final Transmission'}
              </button>
              <button className="ghost" onClick={() => dispatch({ type: 'PASS', player: id })}>Pass</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScanModal({ game, dispatch }: { game: GameState; dispatch: (c: Command) => void }) {
  const me = game.activePlayer;
  const [revealed, setRevealed] = useState(false);
  const entry = [...game.log].reverse().find(
    (e) => e.type === 'scan_seen' && e.turn === game.turnCount && typeof e.visibility === 'object' && (e.visibility as { only: number }).only === me,
  );
  if (!entry || revealed) return null;
  const cards = (entry.data?.cards ?? []) as CardKind[];
  return (
    <div className="overlay">
      <div className="modal">
        <h3>🔭 Deep-Space Scan</h3>
        <p className="hint">Only {game.players[me].name} should look.</p>
        <div className="scanrow">
          {cards.map((c, i) => (
            <span key={i} className="scancard">{CARD_INFO[c].emoji} {CARD_INFO[c].name}</span>
          ))}
        </div>
        <p className="hint">Top card first. The deck order does not change.</p>
        <button className="primary" onClick={() => setRevealed(true)}>Got it — hide</button>
      </div>
    </div>
  );
}

function ReinsertModal({ game, dispatch }: { game: GameState; dispatch: (c: Command) => void }) {
  const me = game.activePlayer;
  const limit = game.config.modules.sunFury ? furyDepthLimit(game.sunFury) : Number.POSITIVE_INFINITY;
  const maxPos = game.deck.length === 0 ? 1 : Math.min(limit, game.deck.length);
  const [pos, setPos] = useState(maxPos);
  return (
    <div className="overlay">
      <div className="modal">
        <h3>☀️ Seal &amp; reinsert the Rupture</h3>
        <p className="hint">
          Position 1 = top of the deck ({game.deck.length + 1} cards total).
          {game.config.modules.sunFury && ` Sun Fury ${game.sunFury}: deepest legal position is ${maxPos}.`}
          {' '}Others shouldn&apos;t watch this choice.
        </p>
        <div className="sliderrow">
          <input
            type="range" min={1} max={maxPos} value={Math.min(pos, maxPos)}
            onChange={(e) => setPos(Number(e.target.value))}
          />
          <b>Position {Math.min(pos, maxPos)}</b>
        </div>
        <button className="primary" onClick={() => dispatch({ type: 'REINSERT', player: me, positionFromTop: Math.min(pos, maxPos) })}>
          Reinsert &amp; end turn
        </button>
      </div>
    </div>
  );
}

function GiveModal({ game, dispatch }: { game: GameState; dispatch: (c: Command) => void }) {
  if (game.phase !== 'choice' || game.awaiting?.type !== 'give') return null;
  const giver = game.players[game.awaiting.from];
  return (
    <div className="overlay">
      <div className="modal">
        <h3>🤝 Emergency Requisition</h3>
        <p className="hint">Pass the device to <b>{giver.name}</b> — they choose 1 card to give to {game.players[game.awaiting.to].name}.</p>
        <div className="hand">
          {[...new Set(giver.hand)].map((k) => (
            <button key={k} className="card" onClick={() => dispatch({ type: 'GIVE', player: giver.id, card: k })}>
              <span className="emoji">{CARD_INFO[k].emoji}</span>
              <span>{CARD_INFO[k].name}{giver.hand.filter((c) => c === k).length > 1 ? ` ×${giver.hand.filter((c) => c === k).length}` : ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameOverModal({ game, report, onNewGame }: { game: GameState; report: MatchReport | null; onNewGame: () => void }) {
  if (game.phase !== 'game_over' || game.winner === null || !report) return null;
  const download = () => {
    const blob = new Blob([JSON.stringify({ config: game.config, report, log: game.log }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `last-orbit-match-${game.config.seed}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="overlay">
      <div className="modal wide">
        <h2>🏆 {game.players[game.winner].name} wins the Grand Solar Rally!</h2>
        <table className="stats">
          <tbody>
            <tr><td>Turns</td><td>{report.turns}</td><td>First elimination</td><td>turn {report.firstElimTurn ?? '—'}</td></tr>
            <tr><td>Ruptures contained / fatal</td><td>{report.rupturesContained} / {report.rupturesFatal}</td><td>Final Sun Fury</td><td>{report.finalFury}</td></tr>
            <tr><td>Overrides played (cancelled)</td><td>{report.overridesPlayed} ({report.cancelledActions})</td><td>Tallest stack</td><td>{report.maxOverrideStack}</td></tr>
            <tr><td>Flybys (max debt)</td><td>{report.flybysPlayed} ({report.maxDebt})</td><td>Comeback win</td><td>{report.comeback ? 'yes' : 'no'}</td></tr>
            <tr><td>Turns per captain</td><td>{report.turnsPerPlayer.join(' / ')}</td><td>Winner&apos;s final hand</td><td>{report.winnerHandSize} cards</td></tr>
          </tbody>
        </table>
        <div className="rowbtns">
          <button className="primary" onClick={onNewGame}>New game</button>
          <button className="ghost" onClick={download}>⬇︎ Export metrics JSON</button>
        </div>
      </div>
    </div>
  );
}

/** Everything that covers the table at special moments. */
export function Modals({ game, dispatch, report, onNewGame }: {
  game: GameState;
  dispatch: (c: Command) => void;
  report: MatchReport | null;
  onNewGame: () => void;
}) {
  return (
    <>
      <ReactionOverlay game={game} dispatch={dispatch} />
      {game.phase === 'command' && <ScanModal game={game} dispatch={dispatch} />}
      {game.phase === 'choice' && game.awaiting?.type === 'reinsert' && <ReinsertModal game={game} dispatch={dispatch} />}
      <GiveModal game={game} dispatch={dispatch} />
      <GameOverModal game={game} report={report} onNewGame={onNewGame} />
    </>
  );
}

