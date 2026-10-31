/**
 * Online mode shell (P4 item 2 — architecture: docs/17, D-036).
 *
 *   form → lobby (room code + seat roster; host starts) → live match
 *
 * The match screen is the ordinary GameView rendered from the server's
 * per-seat snapshots (`ClientGame` = GameState layout + handSizes/deckSize):
 * one screen per captain, no local engine, the server is the only authority.
 * Our own draws/choices open the same modals as hotseat; other captains'
 * windows show "answering on their screen". Spectators (seat null) get a
 * roster-only screen — the full Derelict spectator view is the next P4 step.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { matchReport } from '@last-orbit/game-core';
import type { CardKind, Command } from '@last-orbit/game-core';
import GameView from '../ui/GameView';
import { DrawReveal } from '../ui/Overlays';
import { LOG_SFX, sfx } from '../audio';
import { OnlineConn } from './net';
import type { SeatInfo, SeatViewMsg } from './types';

const DEFAULT_ENDPOINT = 'ws://localhost:2567';

type Screen = 'form' | 'lobby' | 'game' | 'spectating' | 'lost';

export default function OnlineApp({ onExit }: { onExit: () => void }) {
  const connRef = useRef<OnlineConn | null>(null);
  const mySeatRef = useRef<number | null>(null);
  const viewRef = useRef<SeatViewMsg | null>(null);
  const screenRef = useRef<Screen>('form');
  const myDrawIdx = useRef(-1); // last own-draw log index we already revealed
  const seenLog = useRef(0); // sound design follows the (already filtered) snapshot log

  const [screen, setScreen] = useState<Screen>('form');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notices, setNotices] = useState<string[]>([]);
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('lastorbit-name') ?? ''; } catch { return ''; }
  });
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [hosting, setHosting] = useState(true);
  const [playerCount, setPlayerCount] = useState(4);
  const [humanSeats, setHumanSeats] = useState(4);
  const [joinCode, setJoinCode] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [view, setView] = useState<SeatViewMsg | null>(null);
  const [reveal, setReveal] = useState<CardKind | null>(null);
  screenRef.current = screen;

  const pushNotice = (s: string) => setNotices((ns) => [...ns.slice(-2), s]);

  // One connection per mount; handlers read refs so they never go stale.
  const ensureConn = useCallback((): OnlineConn => {
    if (connRef.current) return connRef.current;
    const conn = new OnlineConn();
    conn.handlers.welcome = (m) => {
      const seat = m.seat >= 0 ? m.seat : null;
      mySeatRef.current = seat;
      setMySeat(seat);
      if (m.started) setScreen(seat === null ? 'spectating' : 'game');
    };
    conn.handlers.seats = (m) => {
      setSeats(m.seats);
      if (m.started && mySeatRef.current === null && screenRef.current !== 'form') setScreen('spectating');
    };
    conn.handlers.started = () => setScreen(mySeatRef.current === null ? 'spectating' : 'game');
    conn.handlers.state = (v) => {
      viewRef.current = v;
      setView(v);
      setError(null); // a fresh snapshot means our last request went through
      if (v.seat !== null) {
        // mirror the hotseat DrawReveal: show the drawer (us) what we drew before
        // the screen moves on — our own 'draw' entries carry the card server-side
        let idx = -1;
        for (let i = v.log.length - 1; i >= 0; i--) {
          const e = v.log[i];
          if (e.type === 'draw' && e.data?.player === v.seat) { idx = i; break; }
        }
        if (idx > myDrawIdx.current) {
          myDrawIdx.current = idx;
          const card = idx >= 0 ? v.log[idx].data?.card : undefined;
          if (v.awaiting === null && typeof card === 'string') setReveal(card as CardKind);
        }
      }
    };
    conn.handlers.reject = (m) => setError(m.error);
    conn.handlers.autopilot = (m) => {
      const nm = viewRef.current?.players[m.seat]?.name ?? `Seat ${m.seat + 1}`;
      pushNotice(`⏱ ${nm}: server autopilot (${m.command})`);
    };
    conn.handlers.dropped = () => setScreen((s) => (s === 'form' ? s : 'lost'));
    connRef.current = conn;
    return conn;
  }, []);

  // leave on unmount
  useEffect(() => () => { connRef.current?.leave(); }, []);

  // sound design: quiet stingers follow the public event log (as in hotseat)
  useEffect(() => {
    if (!view) { seenLog.current = 0; return; }
    for (const e of view.log.slice(seenLog.current)) {
      const k = LOG_SFX[e.type];
      if (k) sfx(k);
    }
    seenLog.current = view.log.length;
  }, [view]);

  const connect = async () => {
    const finalName = name.trim() || 'Captain';
    try { localStorage.setItem('lastorbit-name', finalName); } catch { /* private mode */ }
    setBusy(true);
    setError(null);
    try {
      const conn = ensureConn();
      await conn.connect({
        endpoint: endpoint.trim() || DEFAULT_ENDPOINT,
        name: finalName,
        ...(hosting ? { playerCount, humanSeats } : { roomCode: joinCode.trim() }),
      });
      setRoomId(conn.roomId);
      setScreen('lobby');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const exitToMenu = () => {
    connRef.current?.leave();
    connRef.current = null;
    mySeatRef.current = null;
    viewRef.current = null;
    myDrawIdx.current = -1;
    seenLog.current = 0;
    screenRef.current = 'form';
    setScreen('form');
    setRoomId(null);
    setSeats([]);
    setMySeat(null);
    setView(null);
    setReveal(null);
    setError(null);
    setNotices([]);
  };

  /** Connection dropped: try the seat-restoring reconnect first (30 s window). */
  const rejoin = async () => {
    const conn = connRef.current;
    setBusy(true);
    setError(null);
    try {
      if (conn && (await conn.reconnect())) {
        setScreen(mySeatRef.current === null ? 'spectating' : 'game');
      } else {
        setError('Reconnect window expired — the server keeps flying your seat on autopilot.');
        exitToMenu();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const dispatch = useCallback((cmd: Command) => connRef.current?.sendCommand(cmd), []);
  const report = useMemo(() => (view && view.phase === 'game_over' ? matchReport(view) : null), [view]);

  // ---- screens ----------------------------------------------------------------

  if (screen === 'form') {
    return (
      <div className="setup">
        <h1>☀️ Last Orbit — 🌐 Online</h1>
        <p className="tagline">Live match on the authoritative server: one screen per captain, room codes, server bots fill empty seats.</p>

        <label className="row">
          Captain name:
          <input className="name" value={name} placeholder="Captain" maxLength={20} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="row">
          Server:
          <input className="name" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} title="The Colyseus server address (npm run dev:server → ws://localhost:2567)" />
        </label>

        <div className="row">
          <button className={`mini ${hosting ? 'on' : ''}`} onClick={() => setHosting(true)} title="Create a table and share its code">🏠 Host a table</button>
          <button className={`mini ${!hosting ? 'on' : ''}`} onClick={() => setHosting(false)} title="Enter a code you got from the host">🎫 Join with a code</button>
        </div>

        {hosting ? (
          <>
            <label className="row">
              Captains:
              <select value={playerCount} onChange={(e) => { const n = Number(e.target.value); setPlayerCount(n); setHumanSeats(n); }}>
                {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="row">
              Human seats:
              <select value={humanSeats} onChange={(e) => setHumanSeats(Number(e.target.value))}>
                {Array.from({ length: playerCount }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <p className="hint">Seats nobody holds at start fly as server-side AI captains — pick 1 for solo-vs-bots online.</p>
          </>
        ) : (
          <label className="row">
            Room code:
            <input className="name" value={joinCode} placeholder="from the host" onChange={(e) => setJoinCode(e.target.value)} />
          </label>
        )}

        <button className="primary big" disabled={busy} onClick={() => void connect()}>
          {busy ? 'Connecting…' : hosting ? 'Open the table' : 'Join the table'}
        </button>
        {error && <div className="error">{error}</div>}
        <button className="ghost" onClick={onExit}>← Back to local modes</button>
        <p className="hint">The server must be running: <b>npm run dev:server</b> (ws://localhost:2567). Local modes (pass-and-play, solo vs AI) stay on this device.</p>
      </div>
    );
  }

  if (screen === 'lobby') {
    const isHost = mySeat === 0;
    return (
      <div className="setup">
        <h1>🌐 Table lobby</h1>
        <div className="row">
          <span className="hint">Room code — share it with your captains:</span>
          <b className="roomcode">{roomId}</b>
          <button className="ghost" onClick={() => void navigator.clipboard?.writeText(roomId ?? '')}>copy</button>
        </div>
        <div className="sect">Seats</div>
        {seats.map((s) => (
          <div key={s.seat} className="seatrow">
            <span className="seatno">Seat {s.seat + 1}</span>
            <span className="pname">{s.kind === 'open' ? '— open —' : s.name}{s.seat === mySeat ? ' (you)' : ''}</span>
            <span className="chip">{s.kind === 'human' ? (s.connected ? '🌐 connected' : 'offline') : s.kind === 'bot' ? '🤖 AI' : 'open'}</span>
          </div>
        ))}
        {isHost ? (
          <>
            <button className="primary big" onClick={() => connRef.current?.startMatch()}>
              Begin the Rally — empty seats become AI
            </button>
            <p className="hint">You are the host (seat 1). Once started, late joiners can only watch.</p>
          </>
        ) : (
          <p className="hint">Waiting for the host to begin…{mySeat === null ? ' Table is full — you would join as a spectator.' : ''}</p>
        )}
        {error && <div className="error">{error}</div>}
        <button className="ghost" onClick={exitToMenu}>Leave the table</button>
      </div>
    );
  }

  if (screen === 'spectating') {
    return (
      <div className="setup">
        <h1>🌐 Spectating</h1>
        <p className="hint">You joined a live match without a seat — the full spectator view (Derelict UX) is the next online step (docs/17).</p>
        <div className="sect">Seats</div>
        {seats.map((s) => (
          <div key={s.seat} className="seatrow">
            <span className="seatno">Seat {s.seat + 1}</span>
            <span className="pname">{s.kind === 'open' ? '— open —' : s.name}</span>
            <span className="chip">{s.kind === 'human' ? (s.connected ? '🌐 connected' : 'offline') : s.kind === 'bot' ? '🤖 AI' : 'open'}</span>
          </div>
        ))}
        <button className="ghost" onClick={exitToMenu}>Leave</button>
      </div>
    );
  }

  if (screen === 'lost') {
    return (
      <div className="setup">
        <h1>📡 Connection lost</h1>
        <p className="hint">The server holds your seat for 30 s, then flies it on autopilot — the match goes on without stalling.</p>
        <button className="primary big" disabled={busy} onClick={() => void rejoin()}>{busy ? 'Reconnecting…' : 'Reconnect to my seat'}</button>
        {error && <div className="error">{error}</div>}
        <button className="ghost" onClick={exitToMenu}>Back to the menu</button>
      </div>
    );
  }

  // screen === 'game'
  if (!view || mySeat === null) {
    return (
      <div className="setup">
        <h1>🌐 Online</h1>
        <p className="hint">Waiting for the first snapshot…</p>
        <button className="ghost" onClick={exitToMenu}>Leave</button>
      </div>
    );
  }

  return (
    <div className="app">
      {reveal && (
        <DrawReveal
          game={view}
          reveal={{ player: mySeat, card: reveal }}
          onDone={() => setReveal(null)}
          nextNote={view.phase === 'command' && view.activePlayer === mySeat
            ? 'You owe another turn — stay at the controls.'
            : `Next up: ${view.players[view.activePlayer]?.name ?? '—'} — watch their move in the log.`}
        />
      )}
      <GameView
        game={view}
        viewer={mySeat}
        humans={[mySeat]}
        dispatch={dispatch}
        error={error}
        report={report}
        onNewGame={exitToMenu}
        remote
      />
      <div className="onlinebar">
        <span className="chip" title="Room code">🌐 {roomId}</span>
        {notices.map((n, i) => <span key={i} className="chip">{n}</span>)}
      </div>
    </div>
  );
}