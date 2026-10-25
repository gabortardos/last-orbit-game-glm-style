import { useState } from 'react';
import type { StartOptions } from '../App';

export default function Setup({ onStart }: { onStart: (o: StartOptions) => void }) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(['Mercury', 'Venus', 'Earth', 'Mars', 'Saturn']);
  const [sunFury, setSunFury] = useState(true);
  const [derelicts, setDerelicts] = useState(true);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000) + 1);

  return (
    <div className="setup">
      <h1>☀️ Last Orbit</h1>
      <p className="tagline">Solar System Showdown — pass-and-play prototype (rules v0.2)</p>

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
        Sun Fury module (furious reinsertion limits)
      </label>
      <label className="row">
        <input type="checkbox" checked={derelicts} onChange={(e) => setDerelicts(e.target.checked)} />
        Derelict Interference module (eliminated captains keep one Override)
      </label>

      <label className="row">
        Seed:
        <input type="number" value={seed} min={1} onChange={(e) => setSeed(Number(e.target.value) || 1)} />
      </label>

      <button className="primary big" onClick={() => onStart({ playerCount: count, names: names.slice(0, count), sunFury, derelicts, seed })}>
        Begin the Rally
      </button>
      <p className="hint">Turn: play any cards → draw to end. Drawing a ☀️ Solar Rupture without a 🛡️ disables your flagship. Last flagship flying wins.</p>
    </div>
  );
}
