import { useEffect, useRef, useState } from 'react';
import { CARD_INFO, canAxialTilt, canCourtFavor, canRespond, canRingWall, eligibleReactorIds, furyDepthLimit, openRespondents } from '@last-orbit/game-core';
import type { CardKind, Command, LogEntry, MatchReport } from '@last-orbit/game-core';
import { deckSize, handSize } from '../online/types';
import type { ClientGame, PendingTimer } from '../online/types';
import { isMuted, startAudio, toggleMuted } from '../audio';
import CardFace from './CardFace';
import Glyph from './Glyph';
import { CAPTAIN_PORTRAIT, ENV_BACKGROUND } from './visualAssets';

/**
 * M3 online hardening — live countdown for the server-armed deadline on the
 * current snapshot. Derives the client/server clock skew from `at`/`now` (same
 * LAN, so it is near-zero; still beats showing a frozen number), then ticks
 * locally at 4 Hz. Hotseat has no timers → timer undefined → null.
 */
export function useRemaining(timer: PendingTimer | null | undefined): number | null {
  const [left, setLeft] = useState<number | null>(null);
  const at = timer?.at; // new identity only when a fresh snapshot arrives → stable effect deps
  const now = timer?.now;
  useEffect(() => {
    if (at === undefined || now === undefined) { setLeft(null); return; }
    const skew = now - Date.now();
    const end = at - skew;
    const tick = () => setLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
    tick();
    const iv = setInterval(tick, 250);
    return () => clearInterval(iv);
  }, [at, now]);
  return left;
}

/** SVG ring that drains as the deadline approaches — red pulse in the last 10 s. */
export function CountdownRing({ total, left, size = 36 }: { total: number; left: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? Math.min(1, Math.max(0, left / total)) : 0;
  const urgent = left <= 10;
  return (
    <span className={`timerring ${urgent ? 'urgent' : ''}`} role="timer" aria-label={`${left} seconds left`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          className="ring-fg"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <b>{left}</b>
    </span>
  );
}

/**
 * The one countdown surface every online screen shares:
 *  - the decision is OURS → the draining ring (reaction window, choice modals, own turn)
 *  - it's someone else's  → a quiet "⏱ name — Ns" line/chip (turn display, others' windows)
 * Renders nothing in hotseat (no server timers there).
 */
export function TimerBadge({ game, viewer, hud }: { game: ClientGame; viewer?: number; hud?: boolean }) {
  const t = game.timer;
  const left = useRemaining(t);
  if (!t || left === null) return null;
  const mine = viewer !== undefined && t.seat === viewer;
  const name = game.players[t.seat]?.name ?? `Seat ${t.seat + 1}`;
  const label = mine
    ? t.kind === 'turn' ? 'your move' : 'your call'
    : t.kind === 'turn' ? `${name}'s turn` : `${name} deciding`;
  if (hud) return <span className={`chip timer ${mine ? 'mine' : ''}`}>⏱ {label} — {left}s</span>;
  return mine
    ? (
      <div className="timerline">
        <CountdownRing total={t.ms} left={left} />
        <span className="hint">{label} — the server flies it for you when the ring runs out</span>
      </div>
    )
    : <p className="hint dim">⏱ {label} — {left}s.</p>;
}

/** 🔊/🔇 ambient soundtrack toggle. */
export function SoundButton({ className = 'ghost' }: { className?: string }) {
  const [muted, setMuted] = useState(isMuted());
  return (
    <button
      className={className}
      title={muted ? 'Ambient music off — click to enable' : 'Ambient music on — click to mute'}
      onClick={() => { startAudio(); setMuted(toggleMuted()); }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

/** Shows the drawer what they drew, before the device passes on. */
export function DrawReveal({ game, reveal, solo, onDone, nextNote }: {
  game: ClientGame;
  reveal: { player: number; card: CardKind };
  solo?: boolean; // solo vs AI: nobody to pass to — the bots take it from here
  onDone: () => void;
  nextNote?: string; // online: who's next, in this screen's words
}) {
  const p = game.players[reveal.player];
  const info = CARD_INFO[reveal.card];
  const stillMe = game.phase === 'command' && game.activePlayer === reveal.player;
  return (
    <div className="overlay">
      <div className="modal gate">
        <h3>🃏 {p.name} drew:</h3>
        <div className="drawcard"><CardFace kind={reveal.card} size="lg" /> <b>{info.name}</b></div>
        <p className="hint">{info.blurb}</p>
        <p className="hint dim">{nextNote ?? (stillMe ? 'You owe another turn — stay at the controls.' : solo ? `Next up: ${game.players[game.activePlayer]?.name ?? '—'} 🤖 — watch their move in the log.` : `Next up: ${game.players[game.activePlayer]?.name ?? '—'} — then pass the device.`)}</p>
        <button className="primary" onClick={onDone}>Got it</button>
      </div>
    </div>
  );
}

/** Privacy gate between captains (pass-and-play). */
export function HandoffGate({ game, player, onDone }: { game: ClientGame; player: number; onDone: () => void }) {
  const p = game.players[player];
  return (
    <div className="overlay gate" onClick={onDone}>
      <div className="modal privacy">
        <h2>Pass the device to</h2>
        {p.faction && <img className="winnerface" src={CAPTAIN_PORTRAIT[p.faction]} alt="" />}
        <div className="bigname">🛰️ {p.name}</div>
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
  scrap: 'Component scrap (peek)', ion_surge: 'Ion Surge', tractor: 'Tractor Snag',
} as Record<string, string>)[r] ?? r;

/** The public event feed, filtered by visibility. */
export function LogFeed({ game, viewer }: { game: ClientGame; viewer?: number }) {
  const v = viewer ?? game.activePlayer;
  const visible = game.log.filter((e) => {
    if (e.visibility === 'public' || e.visibility === 'hidden') return e.visibility === 'public';
    return e.visibility.only === v;
  });
  // PT feedback (2026-10-25): the FULL match history stays reachable — no 40-line cap,
  // and the autoscroll only fires when the reader is already near the bottom, so
  // scrolling back through history is never yanked away by a fresh entry.
  const feed = visible.map(fmtEntry(game)).filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight });
  }, [feed.length]);
  return (
    <aside className="panel logpanel" aria-label="flight log">
      <div className="panelhead"><span>FLIGHT LOG</span><span className="small">{visible.length} EVENTS · FULL HISTORY</span></div>
      <div className="logbody" ref={ref}>
        {feed.map((line, i) => (
          <div key={i} className={`logline ${line.startsWith('☀️') || line.startsWith('💥') || line.startsWith('🏆') ? 'loud' : ''}`}>{line}</div>
        ))}
      </div>
    </aside>
  );
}

function fmtEntry(game: ClientGame) {
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
      case 'fury_up': {
        const f = Number(d.fury);
        const lim = f >= 2 ? furyDepthLimit(f) : null;
        return `🌞 The Sun rages — Fury ${f}/5${lim ? ` (contained ☀️ must go back within the top ${lim} cards)` : ''}`;
      }
      case 'contained': return `🛡️ ${name(d.player)} contains the rupture!`;
      case 'eliminated': return `💥 ${name(d.player)}'s flagship is disabled and towed home.`;
      case 'flyby_debt': return `🚀 ${name(d.player)} owes ${d.amount} turn(s) — Forced Flyby!`;
      case 'turn_skipped': return `${name(d.player)} ends a turn without drawing.`;
      case 'direction': return `↔️ Play direction reversed!`;
      case 'steal': return `🪝 ${name(d.to)} steals a random card from ${name(d.from)}!`;
      case 'steal_card': return `🪝 You got: ${CARD_INFO[d.card as CardKind].name}.`;
      case 'give': return `🤝 ${name(d.from)} gives a card to ${name(d.to)}.`;
      case 'fizzle': return `…their hand is empty. Nothing happens.`;
      case 'scan_seen': return `🔭 You saw the top ${(d.cards as CardKind[]).length} cards.`;
      case 'salvage_take': return `♻️ ${name(d.player)} salvages ${CARD_INFO[d.card as CardKind].name}.`;
      case 'reshuffle': return `🌀 Discard pile reshuffled into the deck.`;
      case 'skip_draw': return `No cards left to draw — turn ends.`;
      case 'storm_hit': return `☄️ MICROMETEOROID STORM rakes ${name(d.player)}'s hull!`;
      case 'storm_fizzle': return `…their hand is empty. The storm howls past, harmless.`;
      case 'storm_discard': return `☄️ ${name(d.player)} jettisons ${CARD_INFO[d.card as CardKind].name} to lighten the load.`;
      case 'wind_bonus': return `🌟 Solar Wind at ${name(d.player)}'s back — an extra card, drawn!`;
      case 'deflect': return `↪️ ${name(d.by)} deflects the ${reasonText(String(d.reason))} → ${name(d.to)}${d.growth ? ` — payload +${d.growth}!` : ''}`;
      case 'surge_hit': return `⚡ Ion Surge hits ${name(d.target)} — ${d.count} card${Number(d.count) > 1 ? 's' : ''} jettisoned!`;
      case 'forced_discard': return `   💨 ${CARD_INFO[d.card as CardKind].emoji} ${CARD_INFO[d.card as CardKind].name} — gone.`;
      case 'snag_hit': return `🧲 Tractor Snag! ${name(d.target)} must discard ${d.discardCount} card${Number(d.discardCount) > 1 ? 's' : ''} (keep ${d.keep}).`;
      case 'snag_discard': return `🧲 ${name(d.player)} lets go of ${cardNames(d.cards as CardKind[])}.`;
      case 'scrap_seen': return `🔧 Scrap peek — the top card is ${cardNames(d.cards as CardKind[])}.`;
      case 'kit_bash': return `🌍 ${name(d.player)} kit-bashes ${CARD_INFO[d.card as CardKind].name} into a full pair — siphon aimed at ${name(d.target)}!`;
      case 'ring_wall': return `♄ ${name(d.by)} raises the Ringwall — the theft fizzles on the rings.`;
      case 'axial_tilt': return `♅ ${name(d.by)} tilts sideways — the attack slides off${d.to !== undefined ? ` to ${name(d.to)}` : ''}, un-grown.`;
      case 'deep_sight': return `♆ You saw the top ${(d.cards as CardKind[]).length} cards.`;
      case 'win': return `🏆 ${name(d.player)} wins the Grand Solar Rally!`;
      default: return '';
    }
  };
}

export function ReactionOverlay({ game, dispatch, humans, remote, viewer }: {
  game: ClientGame;
  dispatch: (c: Command) => void;
  humans?: number[]; // solo vs AI: bots decide on their own; only the human's row is interactive
  remote?: boolean; // online: the other rows are captains on their own screens, not bots
  viewer?: number; // the seat this screen belongs to — their hand must stay readable while deciding (PT feedback 2026-10-25)
}) {
  const [redirect, setRedirect] = useState<'card' | 'flare' | 'tilt' | null>(null); // ↪️ Deflector, ☿ Flare Skip or ♅ Axial Tilt chooser
  if (game.phase !== 'reaction' || !game.pending) return null;
  const pending = game.pending;
  const undecided = openRespondents(game); // includes a bounced-back initiator holding a live ↪️ (D-022)
  const standingDown = eligibleReactorIds(game).filter((id) => pending.passed.includes(id) && !canRespond(game, id));
  const solo = humans !== undefined && humans.length === 1;
  if (solo && !undecided.some((id) => humans.includes(id))) return null; // bots resolve themselves in the log
  const stack = pending.overrides.length;
  const cancelled = stack % 2 === 1; // odd stack = action is cancelled
  const target = pending.target !== undefined ? game.players[pending.target] : null;
  return (
    <div className="overlay react">
      <div className="modal reaction">
        <div className="reactcopy"><Glyph id="attack" label="" /><div>
        <h3>
          {game.players[pending.initiator].name} plays {reasonText(pending.reason)}
          {target && <> — target: <b>{target.name}</b>{pending.growth ? <b className="red">{` — payload +${pending.growth}!`}</b> : null}</>}
        </h3>
        </div></div>
        <TimerBadge game={game} viewer={viewer} />
        <p className={`outcome stackline ${cancelled ? 'red' : 'green'}`}>
          {stack === 0
            ? '✅ No Overrides yet — as it stands, the action WILL happen.'
            : cancelled
              ? `🚫 ${stack} Override${stack > 1 ? 's' : ''} — as it stands, the action is CANCELLED.`
              : `✅ ${stack} Overrides — they flip each other out: the action WILL happen.`}
        </p>
        <p className="hint">
          Every Override <b>flips</b> the outcome (even = happens, odd = cancelled). After each Override everyone
          else may respond again — that&apos;s why you&apos;re still asked: your Override could flip it back.
        </p>
        {pending.deflectors?.length ? (
          <p className="hint">
            ↪️ Deflected {pending.deflectors.length}× — each hop grows the payload (destruction +1; theft only
            moves). Even the attacker may deflect when it bounces back at them. One Override still kills the{' '}
            <b>whole chain</b>, cards and all.
          </p>
        ) : null}
        {standingDown.length > 0 && (
          <p className="hint dim">
            💤 Standing down — no response possible (no 📡, no ↪️ for them): {standingDown.map((id) => game.players[id].name).join(', ')}.
          </p>
        )}
        {/* PT feedback (2026-10-25): the decider must be able to read their own cards while
            deciding. The scrim fades out above the table (see .overlay.react) so the real
            hand panel stays visible — and the hand is mirrored here as chips, so screens
            where the floating window still overlaps the table stay informed too. */}
        {viewer !== undefined && undecided.includes(viewer) && game.players[viewer].hand.length > 0 && (
          <div className="reacthand" aria-label="your hand">
            <span className="handlabel">🃏 Your hand:</span>
            {game.players[viewer].hand.map((c, i) => (
              <span key={i} className="hcard" title={CARD_INFO[c].blurb}><CardFace kind={c} size="xs" /> {CARD_INFO[c].name}</span>
            ))}
          </div>
        )}
        {undecided.map((id) => {
          const p = game.players[id];
          const isTarget = pending.target === id;
          const inChain = (pending.deflectors ?? []).includes(id); // ↪️ and ☿ share the once-per-chain limit
          const canDeflectCard = isTarget && p.alive && p.hand.includes('deflector') && !inChain;
          const canFlare = isTarget && p.alive && p.faction === 'flareskip' && !p.factionPowerUsed && !inChain;
          const canFavor = isTarget && p.alive && canCourtFavor(game, id); // D-031 ♀: flips a 🤝 back at the initiator
          const canWall = isTarget && p.alive && canRingWall(game, id); // D-033 ♄: thefts die on the rings
          const canTilt = isTarget && p.alive && canAxialTilt(game, id); // D-033 ♅: attacks slide off, un-grown
          if (solo && !humans.includes(id)) {
            return (
              <div key={id} className="reactrow">
                <span className="pname">{p.faction && <img className="avatar" src={CAPTAIN_PORTRAIT[p.faction]} alt="" />}{p.name} {remote ? '🌐' : '🤖'}{isTarget ? ' 🎯' : ''}</span>
                <span className="botchip">{remote ? 'answering on their screen…' : 'deciding…'}</span>
              </div>
            );
          }
          if (redirect && isTarget) {
            const mode = redirect; // 'card' = ↪️ Deflector · 'flare' = ☿ power · 'tilt' = ♅ power
            const glyph = mode === 'flare' ? '☿' : mode === 'tilt' ? '♅' : '↪️';
            const lead = mode === 'flare'
              ? 'Flare Skip — send it at (free, once per match):'
              : mode === 'tilt'
                ? 'Axial Tilt — it slides to (no growth, once per match):'
                : 'Send it at:';
            return (
              <div key={id} className="reactrow">
                <span className="pname">{p.name} {glyph}</span>
                <span className="hint">{lead}</span>
                {game.players.filter((q) => q.alive && q.id !== id).map((q) => (
                  <button
                    key={q.id}
                    className="mini"
                    title={`The attack hits ${q.name} instead${mode === 'tilt' ? ' — with NO payload growth (a flat refusal)' : (pending.reason === 'ion_surge' || pending.reason === 'tractor') ? ' and grows by 1' : ''}.`}
                    onClick={() => {
                      setRedirect(null);
                      dispatch(mode === 'flare'
                        ? { type: 'FLARE_SKIP', player: id, target: q.id }
                        : mode === 'tilt'
                          ? { type: 'AXIAL_TILT', player: id, target: q.id }
                          : { type: 'DEFLECT', player: id, target: q.id });
                    }}
                  >
                    {q.name} ({handSize(game, q.id)})
                  </button>
                ))}
                <button className="ghost" onClick={() => setRedirect(null)}>Cancel</button>
              </div>
            );
          }
          const hasCard = p.hand.includes('override');
          const isInitiator = id === pending.initiator; // deflect-only when the attack bounces back at them (D-022)
          return (
            <div key={id} className="reactrow">
              <span className="pname">{p.faction && <img className="avatar" src={CAPTAIN_PORTRAIT[p.faction]} alt="" />}{p.name}{p.alive ? '' : ' (derelict)'}{isTarget ? ' 🎯' : ''}{isInitiator ? ' ⚔️' : ''}</span>
              {canDeflectCard && (
                <button
                  className="mini"
                  title="Send this attack at any other captain instead — its payload grows by 1 (⚡ discards +1 card; 🧲 keeps 1 fewer). Once per captain per chain; a single Override still cancels everything."
                  onClick={() => setRedirect('card')}
                >
                  ↪️ Deflect — pass it on +1
                </button>
              )}
              {canFlare && (
                <button
                  className="mini flarebtn"
                  title="☿ Mercury faction power (once per match): redirect this attack as if playing ↪️ — paying no card (the payload still grows; chain and 📡 rules apply). After this, you are visibly just fast."
                  onClick={() => setRedirect('flare')}
                >
                  ☿ Flare Skip — free redirect +1
                </button>
              )}
              {canFavor && (
                <button
                  className="mini flarebtn"
                  title="♀ Venus faction power (once per match): reverse this Requisition — the initiator gifts YOU 1 card instead (no card paid). One 📡 still cancels the whole exchange, and the Favor is spent either way; the initiator may ↪️ the tribute onward."
                  onClick={() => dispatch({ type: 'COURT_FAVOR', player: id })}
                >
                  ♀ Court Favor — flip the tribute
                </button>
              )}
              {canWall && (
                <button
                  className="mini flarebtn"
                  title="♄ Saturn faction power (once per match): this theft fizzles — the attacker's card is already spent, yours stays. Destruction (⚡/🧲) is not theft: it passes the rings, and that is the counterplay."
                  onClick={() => dispatch({ type: 'RING_WALL', player: id })}
                >
                  ♄ Ringwall — the rings eat it
                </button>
              )}
              {canTilt && (
                <button
                  className="mini flarebtn"
                  title="♅ Uranus faction power (once per match): the attack slides off — re-aimed at another captain with NO payload growth. Not ☿'s aggressive redirect: a flat refusal. (Two captains: it slides straight back at the attacker.)"
                  onClick={() => setRedirect('tilt')}
                >
                  ♅ Axial Tilt — refuse it
                </button>
              )}
              {!isInitiator && (
                <button
                  className="mini"
                  disabled={p.alive && !hasCard}
                  title={p.alive && !hasCard ? 'No Comms Override in hand' : p.alive ? 'Play Comms Override' : 'Spend Final Transmission'}
                  onClick={() => dispatch({ type: 'OVERRIDE', player: id })}
                >
                  <Glyph id="override" className="xs" label="" />
                  {p.alive
                    ? (cancelled ? '📡 Override — restore it' : '📡 Override — CANCEL it')
                    : '📡 Final Transmission'}
                </button>
              )}
              <button className="ghost" onClick={() => dispatch({ type: 'PASS', player: id })}>
                <Glyph id={cancelled ? 'cancelled' : 'confirmed'} className="xs" label="" />
                {cancelled ? 'Keep it cancelled' : 'Let it happen'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScanModal({ game, dispatch, viewer }: { game: ClientGame; dispatch: (c: Command) => void; viewer?: number }) {
  const me = viewer ?? game.activePlayer;
  const [revealed, setRevealed] = useState(false);
  const entry = [...game.log].reverse().find(
    // 🔭 Deep-Space Scan and ♆ Deep Sight (D-033) share the private-peek modal
    (e) => (e.type === 'scan_seen' || e.type === 'deep_sight') && e.turn === game.turnCount && typeof e.visibility === 'object' && (e.visibility as { only: number }).only === me,
  );
  if (!entry || revealed) return null;
  const cards = (entry.data?.cards ?? []) as CardKind[];
  return (
    <div className="overlay">
      <div className="modal">
        <h3>{entry.type === 'deep_sight' ? '♆ Deep Sight' : '🔭 Deep-Space Scan'}</h3>
        <p className="hint">Only {game.players[me].name} should look.</p>
        <div className="scanrow">
          {cards.map((c, i) => (
            <span key={i} className="scancard" title={CARD_INFO[c].blurb}><CardFace kind={c} size="sm" /> {CARD_INFO[c].name}</span>
          ))}
        </div>
        <p className="hint">Top card first. The deck order does not change.</p>
        <button className="primary" onClick={() => setRevealed(true)}>Got it — hide</button>
      </div>
    </div>
  );
}

function ReinsertModal({ game, dispatch, viewer }: { game: ClientGame; dispatch: (c: Command) => void; viewer?: number }) {
  const me = viewer ?? game.activePlayer;
  if (game.activePlayer !== me) return null; // AI reinsertions stay private to the bot
  const limit = game.config.modules.sunFury ? furyDepthLimit(game.sunFury) : Number.POSITIVE_INFINITY;
  const maxPos = deckSize(game) === 0 ? 1 : Math.min(limit, deckSize(game));
  const [pos, setPos] = useState(maxPos);
  return (
    <div className="overlay">
      <div className="modal">
        <h3>☀️ Seal &amp; reinsert the Rupture</h3>
        <TimerBadge game={game} viewer={me} />
        <p className="hint">
          Position 1 = top of the deck ({deckSize(game) + 1} cards total).
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

function GiveModal({ game, dispatch, humans }: { game: ClientGame; dispatch: (c: Command) => void; humans?: number[] }) {
  if (game.phase !== 'choice' || game.awaiting?.type !== 'give') return null;
  const giver = game.players[game.awaiting.from];
  if (humans && humans.length === 1 && !humans.includes(giver.id)) return null; // AI gives on its own
  const taker = game.players[game.awaiting.to];
  const soloGiver = humans !== undefined && humans.length === 1 && humans.includes(giver.id);
  return (
    <div className="overlay">
      <div className="modal">
        {soloGiver ? (
          <>
            <h3>🤝 {taker.name} requisitions your supplies</h3>
            <TimerBadge game={game} viewer={giver.id} />
            <p className="hint">Choose 1 card to hand over — your choice, but it&apos;s going to {taker.name}.</p>
          </>
        ) : (
          <>
            <h3>🤝 Emergency Requisition</h3>
            <p className="hint">Pass the device to <b>{giver.name}</b> — they choose 1 card to give to {taker.name}.</p>
          </>
        )}
        <div className="hand">
          {[...new Set(giver.hand)].map((k) => (
            <button key={k} className="card" title={CARD_INFO[k].blurb} onClick={() => dispatch({ type: 'GIVE', player: giver.id, card: k })}>
              <CardFace kind={k} />
              <span>{CARD_INFO[k].name}{giver.hand.filter((c) => c === k).length > 1 ? ` ×${giver.hand.filter((c) => c === k).length}` : ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** ☄️ Storm jettison: the drawer (human) picks 1 card to lose. */
function StormModal({ game, dispatch, humans }: { game: ClientGame; dispatch: (c: Command) => void; humans?: number[] }) {
  if (game.phase !== 'choice' || game.awaiting?.type !== 'storm_discard') return null;
  const victim = game.players[game.awaiting.player];
  if (humans && humans.length === 1 && !humans.includes(victim.id)) return null; // AI storms resolve in the log
  const soloVictim = humans !== undefined && humans.length === 1 && humans.includes(victim.id);
  // D-031 ♃: only the captain who actually DREW the storm may roar it away (drawnBy);
  // a shouted-at victim has no drawnBy → no chain-shouting.
  const shoutTargets = game.players.filter((q) => q.alive && q.id !== victim.id && handSize(game, q.id) > 0);
  const canShout = game.awaiting.drawnBy === victim.id
    && victim.faction === 'stormkin' && !victim.factionPowerUsed
    && shoutTargets.length > 0;
  return (
    <div className="overlay">
      <div className="modal">
        {soloVictim ? (
          <>
            <h3>☄️ Micrometeoroid Storm!</h3>
            <TimerBadge game={game} viewer={victim.id} />
            <p className="hint">Jettison <b>1 card of your choice</b> — the storm itself is discarded afterwards.</p>
          </>
        ) : (
          <>
            <h3>☄️ Micrometeoroid Storm</h3>
            <p className="hint">Pass the device to <b>{victim.name}</b> — they jettison 1 card of their choice.</p>
          </>
        )}
        {canShout && (
          <div className="shoutrow">
            <span className="hint">
              <b>♃ Storm Shout</b> (once per match) — jettison nothing and roar it at:
            </span>
            {shoutTargets.map((q) => (
              <button
                key={q.id}
                className="mini flarebtn"
                title={`They jettison 1 card of their choice instead of you. Cannot be deflected; the shout is public once spent.`}
                onClick={() => dispatch({ type: 'STORM_SHOUT', player: victim.id, target: q.id })}
              >
                {q.name} ({handSize(game, q.id)})
              </button>
            ))}
          </div>
        )}
        <div className="hand">
          {[...new Set(victim.hand)].map((k) => (
            <button
              key={k}
              className="card"
              title={`${CARD_INFO[k].blurb}\n(Click to jettison this card.)`}
              onClick={() => dispatch({ type: 'STORM_DISCARD', player: victim.id, card: k })}
            >
              <CardFace kind={k} />
              <span>{CARD_INFO[k].name}{victim.hand.filter((c) => c === k).length > 1 ? ` ×${victim.hand.filter((c) => c === k).length}` : ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 🧲 Tractor Snag: the victim (human) picks exactly `count` cards to discard. */
function SnagModal({ game, dispatch, humans }: { game: ClientGame; dispatch: (c: Command) => void; humans?: number[] }) {
  const [picked, setPicked] = useState<CardKind[]>([]);
  if (game.phase !== 'choice' || game.awaiting?.type !== 'snag_discard') return null;
  const victim = game.players[game.awaiting.player];
  const count = Math.min(game.awaiting.count, handSize(game, victim.id));
  if (humans && humans.length === 1 && !humans.includes(victim.id)) return null; // AI snags resolve in the log
  const soloVictim = humans !== undefined && humans.length === 1 && humans.includes(victim.id);
  const available = (k: CardKind): number => victim.hand.filter((c) => c === k).length;
  const chosen = (k: CardKind): number => picked.filter((c) => c === k).length;
  const toggle = (k: CardKind): void => {
    if (chosen(k) > 0) setPicked(picked.filter((c) => c !== k));
    else setPicked([...picked, ...Array(Math.min(count - picked.length, available(k))).fill(k) as CardKind[]]);
  };
  return (
    <div className="overlay">
      <div className="modal">
        {soloVictim ? (
          <>
            <h3>🧲 Tractor Snag!</h3>
            <TimerBadge game={game} viewer={victim.id} />
            <p className="hint">
              Choose <b>{count} card{count > 1 ? 's' : ''} to discard</b> — you keep the rest
              {game.pending?.growth ? <> (a ↪️ Deflector tightened the beam: keep {3 - (game.pending.growth ?? 0)})</> : null}.
            </p>
          </>
        ) : (
          <>
            <h3>🧲 Tractor Snag</h3>
            <p className="hint">Pass the device to <b>{victim.name}</b> — they discard {count} card{count > 1 ? 's' : ''} of their choice.</p>
          </>
        )}
        <div className="hand">
          {[...new Set(victim.hand)].map((k) => (
            <button
              key={k}
              className={`card ${chosen(k) > 0 ? 'pair' : ''}`}
              title={`${CARD_INFO[k].blurb}\n(Click to select/deselect.)`}
              onClick={() => toggle(k)}
            >
              <CardFace kind={k} className={chosen(k) > 0 ? 'picked' : ''} />
              <span>{CARD_INFO[k].name}{chosen(k) > 0 ? ` · picked ${chosen(k)}/${available(k)}` : (available(k) > 1 ? ` ×${available(k)}` : '')}</span>
            </button>
          ))}
        </div>
        <p className="hint dim">Picked {picked.length} of {count}.</p>
        <button className="primary" disabled={picked.length !== count} onClick={() => dispatch({ type: 'SNAG_DISCARD', player: victim.id, cards: picked })}>
          Jettison {count} card{count > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

/** 🔧 Scrap peek: private reveal of the top deck card for the human who scrapped. */
function ScrapModal({ game, viewer }: { game: ClientGame; viewer?: number }) {
  const me = viewer ?? game.activePlayer;
  const [revealed, setRevealed] = useState(false);
  const entry = [...game.log].reverse().find(
    (e) => e.type === 'scrap_seen' && e.turn === game.turnCount && typeof e.visibility === 'object' && (e.visibility as { only: number }).only === me,
  );
  if (!entry || revealed) return null;
  const cards = (entry.data?.cards ?? []) as CardKind[];
  return (
    <div className="overlay">
      <div className="modal">
        <h3>🔧 Scrap peek</h3>
        <p className="hint">Only {game.players[me].name} should look. The Component is spent; the top card stays in the deck.</p>
        <div className="scanrow">
          {cards.length === 0 && <span className="scancard">(the deck is empty — tough scrap)</span>}
          {cards.map((c, i) => (
            <span key={i} className="scancard" title={CARD_INFO[c].blurb}><CardFace kind={c} size="sm" /> {CARD_INFO[c].name}</span>
          ))}
        </div>
        <button className="primary" onClick={() => setRevealed(true)}>Got it — hide</button>
      </div>
    </div>
  );
}

function GameOverModal({ game, report, onNewGame }: { game: ClientGame; report: MatchReport | null; onNewGame: () => void }) {
  if (game.phase !== 'game_over' || game.winner === null || !report) return null;
  const winner = game.players[game.winner];
  const download = () => {
    const blob = new Blob([JSON.stringify({
      config: game.config,
      report,
      finalHands: game.players.map((p) => ({ name: p.name, cards: [...p.hand] })),
      deckRemaining: game.deck.length,
      discard: [...game.discard],
      log: game.log,
      exportedAt: new Date().toISOString(),
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `last-orbit-match-${game.config.seed}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="overlay">
      <div
        className="modal wide winner"
        style={winner.faction ? { backgroundImage: `linear-gradient(180deg, rgba(13,17,31,0.80), rgba(13,17,31,0.94)), url(${ENV_BACKGROUND[winner.faction]})` } : undefined}
      >
        {winner.faction && <img className="winnerface" src={CAPTAIN_PORTRAIT[winner.faction]} alt="" />}
        <h2>🏆 {winner.name} wins the Grand Solar Rally!</h2>
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
export function Modals({ game, dispatch, report, onNewGame, viewer, humans, remote }: {
  game: ClientGame;
  dispatch: (c: Command) => void;
  report: MatchReport | null;
  onNewGame: () => void;
  viewer?: number;
  humans?: number[];
  remote?: boolean;
}) {
  return (
    <>
      <ReactionOverlay game={game} dispatch={dispatch} humans={humans} remote={remote} viewer={viewer} />
      {game.phase === 'command' && <ScanModal game={game} dispatch={dispatch} viewer={viewer} />}
      {game.phase === 'command' && <ScrapModal game={game} viewer={viewer} />}
      {game.phase === 'choice' && game.awaiting?.type === 'reinsert' && <ReinsertModal game={game} dispatch={dispatch} viewer={viewer} />}
      {game.phase === 'choice' && game.awaiting?.type === 'storm_discard' && <StormModal game={game} dispatch={dispatch} humans={humans} />}
      {game.phase === 'choice' && game.awaiting?.type === 'snag_discard' && <SnagModal game={game} dispatch={dispatch} humans={humans} />}
      <GiveModal game={game} dispatch={dispatch} humans={humans} />
      <GameOverModal game={game} report={report} onNewGame={onNewGame} />
    </>
  );
}

