import { useState } from 'react';
import type { FactionId } from '@last-orbit/game-core';
import type { StartOptions } from '../App';
import Briefing from './Briefing';
import Codex from './Codex';
import { SoundButton } from './Overlays';

const AI_NAMES = ['Vega', 'Sirius', 'Altair', 'Rigel', 'Deneb'];
const FACTION_LABEL: Record<FactionId, string> = { flareskip: '☿ Mercury · Flare Skip' };

export default function Setup({ onStart }: { onStart: (o: StartOptions) => void }) {
  const [mode, setMode] = useState<'hotseat' | 'solo'>('hotseat');
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(['Mercury', 'Venus', 'Earth', 'Mars', 'Saturn']);
  const [factions, setFactions] = useState<(FactionId | null)[]>([null, null, null, null, null]);
  const [sunFury, setSunFury] = useState(true);
  const [derelicts, setDerelicts] = useState(true);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000) + 1);
  const [civs, setCivs] = useState(false);
  const [briefing, setBriefing] = useState(() => {
    try { return !localStorage.getItem('lastorbit-briefed'); } catch { return true; }
  });

  const closeBriefing = () => {
    try { localStorage.setItem('lastorbit-briefed', '1'); } catch { /* private mode — fine */ }
    setBriefing(false);
  };

  const begin = () => {
    const humans = mode === 'solo'
      ? [0]
      : Array.from({ length: count }, (_, i) => i);
    const chosenNames = mode === 'solo'
      ? [names[0] || 'You', ...AI_NAMES.slice(0, count - 1)]
      : names.slice(0, count);
    onStart({ playerCount: count, names: chosenNames, sunFury, derelicts, seed, humans, factions: factions.slice(0, count) });
  };

  return (
    <div className="setup">
      <h1>☀️ Last Orbit</h1>
      <p className="tagline">Solar System Showdown — pass-and-play prototype (rules v0.3)</p>

      <div className="row soundrow">
        <SoundButton />
        <span className="hint">ambient soundtrack</span>
      </div>

      <div className="intro">
        <p>You are rival captains in the <b>Grand Solar Rally</b> — one final lap around the inner solar system while the Sun flares.</p>
        <p>🎯 <b>Goal: be the last flagship still flying.</b> Each turn: play cards, then <b>draw</b> — and the deck hides ☀️ Solar Ruptures that disable whoever draws them unprepared.</p>
        <button className="ghost" onClick={() => setBriefing(true)}>📖 How to play — full briefing</button>
        <button className="ghost" onClick={() => setCivs(true)}>🌍 Civilizations — who is racing (and why)</button>
      </div>

      <div className="row">
        <button className={`mini ${mode === 'hotseat' ? 'on' : ''}`} onClick={() => setMode('hotseat')} title="One device, passed between human captains">👥 Pass-and-play</button>
        <button className={`mini ${mode === 'solo' ? 'on' : ''}`} onClick={() => setMode('solo')} title="You play one captain; AI captains take the other seats">🤖 Solo vs AI</button>
      </div>

      <label className="row">
        Captains:
        <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      {mode === 'hotseat' ? (
        Array.from({ length: count }, (_, i) => (
          <input
            key={i}
            className="name"
            value={names[i]}
            placeholder={`Captain ${i + 1}`}
            onChange={(e) => setNames((ns) => ns.map((n, j) => (j === i ? e.target.value : n)))}
          />
        ))
      ) : (
        <>
          <input
            className="name"
            value={names[0]}
            placeholder="Your captain name"
            onChange={(e) => setNames((ns) => ns.map((n, j) => (j === 0 ? e.target.value : n)))}
          />
          <p className="hint">You fly the first seat. The other {count - 1} captain{count > 2 ? 's are' : ' is'} AI ({AI_NAMES.slice(0, count - 1).join(', ')}) — no device passing, watch their moves in the log.</p>
        </>
      )}

      <label className="row">
        <input type="checkbox" checked={sunFury} onChange={(e) => setSunFury(e.target.checked)} />
        <span>🌞 Sun Fury <span className="hint">— every contained ☀️ +1 Fury; from Fury 2, a contained ☀️ must go back within the top 15 cards (then 10, 7, 5) — the Sun ends the race faster</span></span>
      </label>
      <label className="row">
        <input type="checkbox" checked={derelicts} onChange={(e) => setDerelicts(e.target.checked)} />
        <span>🛰️ Derelict Interference <span className="hint">— eliminated captains keep one revenge Override</span></span>
      </label>

      <div className="fleetrow">
        <span className="flabel">Fleets (optional — classic seats play the tested vanilla game):</span>
        {(mode === 'hotseat' ? Array.from({ length: count }, (_, i) => i) : [0]).map((i) => (
          <label key={i} className="fleetpick">
            <select
              value={factions[i] ?? ''}
              onChange={(e) => setFactions((fs) => fs.map((f, j) => (j === i ? ((e.target.value || null) as FactionId | null) : f)))}
            >
              <option value="">{mode === 'hotseat' ? (names[i] || `Captain ${i + 1}`) : 'Your fleet'} — classic</option>
              {Object.entries(FACTION_LABEL).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </label>
        ))}
        <span className="hint">☿ Flare Skip: once per match, when attacked, redirect it for free (payload still grows)</span>
      </div>

      <label className="row">
        Seed:
        <input type="number" value={seed} min={1} onChange={(e) => setSeed(Number(e.target.value) || 1)} />
      </label>

      <button className="primary big" onClick={begin}>
        {mode === 'solo' ? 'Begin — you vs the AI captains' : 'Begin the Rally'}
      </button>
      <p className="hint">
        {mode === 'solo'
          ? 'Your hand stays private; the AI plays its turns automatically —Overrides and all.'
          : 'Pass one device around the table. Turn: play any cards → draw to end. Draw a ☀️ without a 🛡️ → flagship disabled. Last flagship flying wins.'}
      </p>

      {briefing && <Briefing onClose={closeBriefing} sunFury={sunFury} derelicts={derelicts} />}
      {civs && <Codex onClose={() => setCivs(false)} />}
    </div>
  );
}
