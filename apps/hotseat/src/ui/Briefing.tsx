import { CARD_INFO } from '@last-orbit/game-core';
import type { CardKind } from '@last-orbit/game-core';

/** Mission Briefing — everything a new captain needs before their first turn. */
export default function Briefing({ onClose, sunFury = true, derelicts = true }: {
  onClose: () => void;
  sunFury?: boolean;
  derelicts?: boolean;
}) {
  const groups: [string, CardKind[]][] = [
    ['Survival & catastrophe', ['rupture', 'containment']],
    ['Reactions', ['override']],
    ['Action cards', ['flyby', 'burn', 'scan', 'slingshot', 'requisition', 'boarding', 'reversal', 'salvage']],
    ['Components', ['coolant', 'hull']],
  ];
  return (
    <div className="overlay">
      <div className="modal wide briefing">
        <h2>📖 Mission Briefing</h2>
        <div className="briefing-scroll">
          <section className="brief">
            <h3>The premise</h3>
            <p>You are rival captains in the <b>Grand Solar Rally</b> — a celebrity race around the inner solar system. The route makes one final pass close to the Sun, right as solar activity spikes. The Rally organisers, famously indifferent to survival rates, have declared: <i>whoever is still flying at the end, wins.</i></p>
            <p className="dim">You are never killed — a disabled flagship is towed home in disgrace. The fiction is rude, not grim.</p>
          </section>
          <section className="brief">
            <h3>🎯 Your goal</h3>
            <p><b>Be the last operational flagship.</b> There is no scoring — you win by still being in the race when everyone else is not.</p>
          </section>
          <section className="brief">
            <h3>A turn, in 10 seconds</h3>
            <p>1. <b>Command:</b> play any number of action cards (or none). Each can be contested by the others (see Overrides).</p>
            <p>2. <b>Draw:</b> take the top card of the shared deck. This ends your turn. Drawing is also the only way a ☀️ can hit you — the whole game hangs on who draws, and when.</p>
            <p className="dim">The device then passes to the next living captain. If someone owes <b>turn debt</b> 🚀, they take extra turns in a row.</p>
          </section>
          <section className="brief">
            <h3>☀️ The danger: Solar Ruptures</h3>
            <p>The deck hides <b>N−1 Solar Ruptures</b> (one fewer than players) and only <b>6 Containment Fields</b> 🛡️. Draw a rupture:</p>
            <p>• Hold a 🛡️ → it spends itself automatically. You survive, the rupture is <b>secretly reinserted</b> into the deck, and your turn ends.</p>
            <p>• Hold none → <b>flagship disabled</b>. Your hand is revealed and discarded, you are out of the race.</p>
            <p className="dim">So the game is a slow squeeze: containments run out, the deck thins, ruptures concentrate. Deck size, ruptures remaining and every hand size are <b>public</b> — counting cards is legal and encouraged.</p>
          </section>
          <section className="brief">
            <h3>📡 Reaction windows & Overrides</h3>
            <p>Whenever a captain plays an action, <b>everyone else living may respond</b>: pass quietly, or slam a 📡 Comms Override to jam the plan. Each new Override flips the previous one. When all have spoken: <b>odd number of Overrides → the action is cancelled</b>; even → it happens. Chains, bluffs and regrets ensue.</p>
            <p className="dim">Cannot be overridden: drawing, revealing a rupture, containing, ending a turn.</p>
          </section>
          <section className="brief">
            <h3>Modules in this match</h3>
            <p><b>🌞 Sun Fury</b> <span className={`modtag ${sunFury ? 'on' : ''}`}>{sunFury ? 'ENABLED' : 'off'}</span></p>
            <p>Every containment enrages the Sun (+1 Fury, max 5). The angrier it is, the shallower you may bury a contained rupture (Fury 5 → top 5 only). A rising doom clock: late ruptures resurface fast.</p>
            <p><b>🛰️ Derelict Interference</b> <span className={`modtag ${derelicts ? 'on' : ''}`}>{derelicts ? 'ENABLED' : 'off'}</span></p>
            <p>Eliminated captains aren’t done: each holds one <b>Final Transmission</b> — a free Override from the graveyard, usable once. Stay polite to the dead.</p>
          </section>
          <section className="brief">
            <h3>Card reference</h3>
            {groups.map(([label, kinds]) => (
              <div key={label} className="cardref">
                <p className="dim">{label}</p>
                {kinds.map((k) => (
                  <div key={k} className="cardref-row">
                    <b>{CARD_INFO[k].emoji} {CARD_INFO[k].name}</b>
                    <span>{CARD_INFO[k].blurb}</span>
                  </div>
                ))}
              </div>
            ))}
          </section>
        </div>
        <button className="primary big" onClick={onClose}>Understood — to the race!</button>
      </div>
    </div>
  );
}
