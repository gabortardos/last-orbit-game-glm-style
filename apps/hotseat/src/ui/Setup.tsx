import { useState } from 'react';
import type { StartOptions } from '../App';
import Briefing from './Briefing';
import { SoundButton } from './Overlays';

export default function Setup({ onStart }: { onStart: (o: StartOptions) => void }) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(['Mercury', 'Venus', 'Earth', 'Mars', 'Saturn']);
  const [sunFury, setSunFury] = useState(true);
  const [derelicts, setDerelicts] = useState(true);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000) + 1);
  const [briefing, setBriefing] = useState(() => {
    try { return !localStorage.getItem('lastorbit-briefed'); } catch { return true; }
  });

  const closeBriefing = () => {
    try { localStorage.setItem('lastorbit-briefed', '1'); } catch { /* private mode — fine */ }
    setBriefing(false);
  };

  return (
    <div className="setup">
      <h1>☀️ Last Orbit</h1>
      <p className="tagline">Solar System Showdown — pass-and-play prototype (rules v0.2)</p>

      <div className="row soundrow">
        <SoundButton />
        <span className="hint">ambient soundtrack</span>
      </div>

      <div className="intro">
        <p>You are rival captains in the <b>Grand Solar Rally</b> — one final lap around the inner solar system while the Sun flares.</p>
        <p>🎯 <b>Goal: be the last flagship still flying.</b> Each turn: play cards, then <b>draw</b> — and the deck hides ☀️ Solar Ruptures that disable whoever draws them unprepared.</p>
        <button className="ghost" onClick={() => setBriefing(true)}>📖 How to play — full briefing</button>
      </div>

      <label className="row">
        Captains:
        <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      {Array.from({ length: count }, (_, i) => (
        <input
          key={i}
          className="name"
          value={names[i]}
          placeholder={`Captain ${i + 1}`}
          onChange={(e) => setNames((ns) => ns.map((n, j) => (j === i ? e.target.value : n)))}
        />
      ))}

      <label className="row">
        <input type="checkbox" checked={sunFury} onChange={(e) => setSunFury(e.target.checked)} />
        <span>🌞 Sun Fury <span className="hint">— every containment enrages the Sun; late ruptures get harder to bury</span></span>
      </label>
      <label className="row">
        <input type="checkbox" checked={derelicts} onChange={(e) => setDerelicts(e.target.checked)} />
        <span>🛰️ Derelict Interference <span className="hint">— eliminated captains keep one revenge Override</span></span>
      </label>

      <label className="row">
        Seed:
        <input type="number" value={seed} min={1} onChange={(e) => setSeed(Number(e.target.value) || 1)} />
      </label>

      <button className="primary big" onClick={() => onStart({ playerCount: count, names: names.slice(0, count), sunFury, derelicts, seed })}>
        Begin the Rally
      </button>
      <p className="hint">Pass one device around the table. Turn: play any cards → draw to end. Draw a ☀️ without a 🛡️ → flagship disabled. Last flagship flying wins.</p>

      {briefing && <Briefing onClose={closeBriefing} sunFury={sunFury} derelicts={derelicts} />}
    </div>
  );
}
