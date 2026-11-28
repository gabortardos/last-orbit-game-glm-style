import { useState, type CSSProperties } from 'react';
import type { FactionId } from '@last-orbit/game-core';
import type { StartOptions } from '../App';
import Briefing from './Briefing';
import Codex, { CIVS } from './Codex';
import { FACTION_LABEL, FACTION_POWER } from './factions';
import { isMuted, startAudio, toggleMuted } from '../audio';
import Glyph from './Glyph';
import ReviewFooter from './ReviewFooter';
import { CAPTAIN_PORTRAIT } from './visualAssets';

const AI_NAMES = ['Vega', 'Sirius', 'Altair', 'Rigel', 'Deneb'];
const MENU_BG = '/visual/LO-UI-MENU-BG-002.webp';
const asStyle = (vars: Record<string, string>) => vars as CSSProperties;

/**
 * V1 table flow — the approved two-step menu (QA-G-012 / QA-V-041 / QA-V-044):
 * the hero (wordmark on the menu background, three modes) → table configuration
 * (seats, fleet selection with captain detail, modules, galaxy seed).
 */
export default function Setup({ onStart, onOnline }: { onStart: (o: StartOptions) => void; onOnline: () => void }) {
  const [step, setStep] = useState<'menu' | 'table'>('menu');
  const [mode, setMode] = useState<'hotseat' | 'solo'>('hotseat');
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(['Mercury', 'Venus', 'Earth', 'Mars', 'Saturn']);
  const [factions, setFactions] = useState<(FactionId | null)[]>([null, null, null, null, null]);
  const [editing, setEditing] = useState(0);
  const [sunFury, setSunFury] = useState(true);
  const [derelicts, setDerelicts] = useState(true);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000) + 1);
  const [civs, setCivs] = useState(false);
  const [briefing, setBriefing] = useState(() => {
    try { return !localStorage.getItem('lastorbit-briefed'); } catch { return true; }
  });
  const [muted, setMuted] = useState(isMuted());

  const begin = () => {
    const humans = mode === 'solo' ? [0] : Array.from({ length: count }, (_, i) => i);
    const chosenNames = mode === 'solo'
      ? [names[0] || 'You', ...AI_NAMES.slice(0, count - 1)]
      : names.slice(0, count).map((n, i) => n || `Captain ${i + 1}`);
    try { localStorage.setItem('lastorbit-briefed', '1'); } catch { /* private mode — fine */ }
    onStart({ playerCount: count, names: chosenNames, sunFury, derelicts, seed, humans, factions: factions.slice(0, count) });
  };

  const toggleSound = () => { startAudio(); setMuted(toggleMuted()); };
  const seatName = (i: number) => (mode === 'solo' ? (i === 0 ? names[0] || 'You' : AI_NAMES[i - 1]) : names[i] || `Captain ${i + 1}`);
  const seatIsHuman = (i: number) => (mode === 'solo' ? i === 0 : true);
  const closeBriefing = () => {
    try { localStorage.setItem('lastorbit-briefed', '1'); } catch { /* private mode — fine */ }
    setBriefing(false);
  };

  const soundBtn = (
    <button className="ghost" onClick={toggleSound} title={muted ? 'Ambient music off — click to enable' : 'Ambient music on — click to mute'}>
      <Glyph id={muted ? 'sound-off' : 'sound-on'} label={muted ? 'Sound off' : 'Sound on'} />
    </button>
  );
  const util = (
    <div className="utility">
      {soundBtn}
      <button className="ghost" onClick={() => setBriefing(true)} title="Rules, goal and card reference"><Glyph id="help" label="" /><span>Briefing</span></button>
      <button className="ghost" onClick={() => setCivs(true)} title="The eight civilizations of the Grand Solar Rally"><Glyph id="civilizations" label="" /><span>Civilizations</span></button>
      {step === 'table' && (
        <button className="ghost" onClick={() => setStep('menu')} title="Back to the title screen"><Glyph id="back" label="" /><span>Menu</span></button>
      )}
    </div>
  );

  if (step === 'menu') {
    return (
      <div className="screen hero v1" style={asStyle({ '--bgimg': `url(${MENU_BG})` })}>
        <header className="topbar">
          <div className="brand"><Glyph id="brand" label="Last Orbit" /><span>LAST ORBIT</span></div>
          {util}
        </header>
        <main className="hero-main">
          <div className="hero-copy">
            <div className="micro">The Grand Solar Rally</div>
            <h1>LAST<br />ORBIT</h1>
            <p className="subtitle">One final lap around the Sun</p>
            <p className="intro">Eight civilizations. One volatile star. Play your hand, outwit the other captains, and be the last flagship still flying.</p>
            <div className="modes">
              <button className="mode primary" onClick={() => { setMode('solo'); setEditing(0); setStep('table'); }}>
                <Glyph id="bot" label="" /><span><strong>Solo vs AI</strong><small>You fly one flagship; AI captains take the other seats</small></span><span className="arrow">→</span>
              </button>
              <button className="mode" onClick={() => { setMode('hotseat'); setEditing(0); setStep('table'); }}>
                <Glyph id="group" label="" /><span><strong>Pass-and-play</strong><small>One device, passed between human captains</small></span><span className="arrow">→</span>
              </button>
              <button className="mode" onClick={onOnline}>
                <Glyph id="network" label="" /><span><strong>Online</strong><small>Live match over the network — one screen per captain (needs the server)</small></span><span className="arrow">→</span>
              </button>
            </div>
          </div>
        </main>
        <footer className="bottomline"><span>PREMIUM CLASSIC / RELEASE 1</span><span>V1 REVIEW EDITION · PRIVATE REVIEW BUILD</span></footer>
        {briefing && <Briefing onClose={closeBriefing} sunFury={sunFury} derelicts={derelicts} />}
        {civs && <Codex onClose={() => setCivs(false)} />}
        <ReviewFooter />
      </div>
    );
  }

  const f = factions[editing] ?? null;
  const meta = f ? FACTION_POWER[f] : null;
  const civ = f ? CIVS.find((c) => c.origin === meta?.planet) : undefined;
  const factionStyle = (id: FactionId | null) => asStyle({ '--faction': id ? FACTION_POWER[id].color : '#e5c08b' });

  return (
    <div className="setup v1">
      <header className="topbar">
        <div className="brand"><Glyph id="brand" label="Last Orbit" /><span>LAST ORBIT</span></div>
        {util}
      </header>
      <main className="setup-main">
        <div className="setup-title">
          <div>
            <div className="micro">{mode === 'solo' ? '01 · Solo vs AI' : '01 · Pass-and-play'}</div>
            <h2>Table configuration</h2>
            <p>Name the captains, pick fleets, set the modules — then begin the Rally.</p>
          </div>
        </div>
        <div className="setup-grid">
          <section className="panel">
            <div className="panelhead"><strong>THE TABLE</strong><span className="small">ACTIVE SEAT</span></div>
            <div className="panelbody">
              <label className="control">Captains
                <select value={count} onChange={(e) => { const n = Number(e.target.value); setCount(n); setEditing((i) => Math.min(i, n - 1)); }}>
                  {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <div className="seats">
                {Array.from({ length: count }, (_, i) => (
                  <button key={i} className={`seat ${editing === i ? 'on' : ''}`} onClick={() => setEditing(i)} title={`Edit seat ${i + 1}`}>
                    {factions[i]
                      ? <img src={CAPTAIN_PORTRAIT[factions[i] as FactionId]} alt="" loading="lazy" />
                      : <Glyph id={seatIsHuman(i) ? 'human' : 'bot'} label="" />}
                    <span>
                      <strong>{seatName(i)}</strong>
                      <small>{factions[i] ? `${FACTION_POWER[factions[i] as FactionId].planet} · ${FACTION_POWER[factions[i] as FactionId].name}` : 'Classic seat'} · {seatIsHuman(i) ? 'human' : 'AI captain'}</small>
                    </span>
                  </button>
                ))}
              </div>
              {seatIsHuman(editing) && (
                <label className="control">{mode === 'solo' ? 'Your captain name' : `Captain ${editing + 1} name`}
                  <input value={names[editing] ?? ''} placeholder={`Captain ${editing + 1}`} onChange={(e) => setNames((ns) => ns.map((n, j) => (j === editing ? e.target.value : n)))} />
                </label>
              )}
              <div className="micro" style={{ margin: '8px 0 2px' }}>Optional modules</div>
              <label className="check">
                <input type="checkbox" checked={sunFury} onChange={(e) => setSunFury(e.target.checked)} />
                <span>Sun Fury<small>Every contained ☀️ enrages the Sun (+1 Fury) — contained ruptures must go back near the top. The Sun ends the race faster.</small></span>
              </label>
              <label className="check">
                <input type="checkbox" checked={derelicts} onChange={(e) => setDerelicts(e.target.checked)} />
                <span>Derelict Interference<small>Eliminated captains keep one revenge Override — a Final Transmission.</small></span>
              </label>
              <div className="micro" style={{ margin: '10px 0 2px' }}>Galaxy seed</div>
              <div className="seedrow">
                <input type="number" value={seed} min={1} onChange={(e) => setSeed(Number(e.target.value) || 1)} />
                <button className="mini" onClick={() => setSeed(Math.floor(Math.random() * 100000) + 1)} title="Spin a fresh galaxy">🎲 new galaxy</button>
              </div>
              <p className="hint">Same number, same luck, every time — share a seed to race the exact same race again.</p>
            </div>
          </section>
          <section className="panel">
            <div className="panelhead"><strong>FACTION SELECTION</strong><span className="small">{seatName(editing).toUpperCase()} · SEAT {editing + 1}</span></div>
            <div className="fleet-grid">
              <button className={`fleet ${f === null ? 'on' : ''}`} onClick={() => setFactions((fs) => fs.map((x, j) => (j === editing ? null : x)))}>
                <Glyph id="human" label="" /><strong>Classic</strong><small>Tested vanilla seat</small>
              </button>
              {(Object.keys(FACTION_LABEL) as FactionId[]).map((id) => (
                <button key={id} className={`fleet ${f === id ? 'on' : ''}`} style={factionStyle(id)} onClick={() => setFactions((fs) => fs.map((x, j) => (j === editing ? id : x)))}>
                  <Glyph id={id} label="" /><strong>{FACTION_POWER[id].planet}</strong><small>{FACTION_POWER[id].name}</small>
                </button>
              ))}
            </div>
            <div className="detail" style={factionStyle(f)}>
              <div className="portrait">
                {f ? <img className="full" src={CAPTAIN_PORTRAIT[f]} alt={meta?.planet ?? ''} /> : <Glyph id="brand" className="symbol" label="" />}
              </div>
              <div className="detail-copy">
                <div className="micro">{f ? `Fleet · ${meta?.planet}` : 'Classic seat'}</div>
                <h3>{f ? civ?.name ?? meta?.planet : 'Classic captain'}</h3>
                <p>{f ? civ?.direction : 'No faction power — the tested vanilla game. Everyone flies the same rules; the race decides it.'}</p>
                <div className="power">
                  <strong>{f ? meta?.name : 'No power'}</strong>
                  <small>{f ? 'ONCE PER MATCH · SPENT PUBLICLY' : 'CLASSIC · ALL RULES SHARED'}</small>
                  <p>{f ? `${meta?.blurb}${civ ? ` Comedy well: ${civ.hook}` : ''}` : ''}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="footer-action">
          <p>{mode === 'solo'
            ? `You fly the first seat; ${count - 1} AI captain${count > 2 ? 's take' : ' takes'} the rest — watch their moves in the flight log.`
            : 'One device, passed between captains — private hands stay hidden behind the handoff gate.'}</p>
          <button className="cta" onClick={begin}>Begin the Rally →</button>
        </div>
      </main>
      {briefing && <Briefing onClose={closeBriefing} sunFury={sunFury} derelicts={derelicts} />}
      {civs && <Codex onClose={() => setCivs(false)} />}
      <ReviewFooter />
    </div>
  );
}
