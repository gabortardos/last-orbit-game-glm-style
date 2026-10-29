/** Civilization Codex — the bible (`docs/14`) living on the game screen, so any player
 *  who wonders "who ARE these people?" can read it without leaving the table (D-030). */

interface Civ {
  glyph: string;
  origin: string;
  name: string;
  direction: string;
  hook: string;
  pilot?: boolean;
}

const CIVS: Civ[] = [
  { glyph: '☿', origin: 'Mercury', name: 'The Flareskips', direction: 'Obsidian-and-gold heat-sail speedsters; impatient; permanent cooling problems', hook: 'Fastest orbit — scorched and icy at once', pilot: true },
  { glyph: '♀', origin: 'Venus', name: 'The Cloud Courtiers', direction: 'Acid-cloud socialites in ornate masks; floating barges', hook: 'Crushing pressure, sulfuric clouds, "morning star" vanity' },
  { glyph: '🌍', origin: 'Earth', name: 'The Improvisers', direction: 'Mismatched gear, adapters, tape, dangerous optimism', hook: 'The only ones proud of their junk' },
  { glyph: '♂', origin: 'Mars', name: 'The Rustborn', direction: 'Red-armoured engineers; a drill for every problem', hook: 'Dust storms; obsessed with "the old oceans"' },
  { glyph: '♃', origin: 'Jupiter', name: 'The Stormkin', direction: 'Gaseous manta giants in pressure suits; loud, theatrical', hook: 'A storm older than nations — the Spot as a monument' },
  { glyph: '♄', origin: 'Saturn', name: 'The Ring Corsairs', direction: 'Crystalline collectors and pirates with personal orbiting rings', hook: 'Rings as status and hoard; density so low they would float' },
  { glyph: '♅', origin: 'Uranus', name: 'The Sideways Sages', direction: 'Angular ice beings; suspect the rest of the system is tilted', hook: '98° axial tilt; coldest atmosphere, deadpan delivery' },
  { glyph: '♆', origin: 'Neptune', name: 'The Deepwave Oracles', direction: 'Bioluminescent deep-blue prophets; correct but useless warnings', hook: 'Fastest winds; far, dark, mysterious' },
];

const WELLS = [
  'Speed impatience — two birthdays per solar day (see facts)',
  'Cooling problems — captains brag radiators like truckers brag engines; sunscreen-over-parka wardrobe',
  'The Sun\'s takeback sunrise offends them personally ("WE do not do takebacks")',
  'Shadow-crater ice trade — iced drinks and a working forge from the same crater',
  'The planet runs a size small (still shrinking)',
];

const FACTS = [
  'Year = 88 Earth days, but a solar day = 176 — a Mercurian birthday comes twice per day',
  '−173 °C night to +427 °C day: the system\'s worst wardrobe problem',
  'Near perihelion the Sun briefly reverses in the sky — the double sunrise, the only takeback the Sun ever does',
  'Permanently shadowed polar craters hold water ice right beside furnace heat',
  'The planet shrinks as its outsized core cools — the crust wrinkles (scarps)',
  'That iron core is ~85% of the radius: a metal ball in a rock onesie',
  'Only two spacecraft have ever visited — BepiColombo arrives late 2026, and they are rehearsing hospitality for their third guest ever',
];

export default function Codex({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay top">
      <div className="modal wide briefing">
        <h2>🌍 Civilizations of the Grand Solar Rally</h2>
        <div className="briefing-scroll">
          <p className="hint">
            Eight civilizations race the Sun\'s last lap. Deep lore arrives one civilization at a time —
            the Mercury pilot is playable today (Setup → fleet), the rest are direction sketches for now.
          </p>
          <div className="civgrid">
            {CIVS.map((c) => (
              <div key={c.origin} className={`civcard ${c.pilot ? 'pilot' : ''}`}>
                <h4><span className="civglyph">{c.glyph}</span> {c.name} <span className="dim">· {c.origin}</span></h4>
                <p>{c.direction}</p>
                <p className="dim">Comedy well: {c.hook}</p>
                {c.pilot && <p className="civtag"> playable pilot — see below </p>}
              </div>
            ))}
          </div>

          <section className="brief">
            <h3>☿ The Flareskips — the pilot civilization</h3>
            <p><b>Form:</b> cast-glass sprinters in gold-foil sails — the sails <i>are</i> the engine.</p>
            <p><b>Captain:</b> Cinder Vale, callsign <b>"Twice-Dawn"</b> — congenitally early; treats patience as hoarding. <i>"Early is on time; on time is a different orbit."</i></p>
            <p><b>Flagship · The Sudden Dawn:</b> a black-glass dagger with four gold-foil sails; never still, radiators glowing cherry-red <i>while idling</i> (running hot = standing still). Defeat: the sails snap shut and the ship folds backward like a dropped umbrella.</p>
            <p><b>Faction power · Flare Skip:</b> once per match, when attacked, redirect the attack as if playing ↪️ Deflector — paying no card. The payload still grows; chain and 📡 rules apply. Spent powers are public: bait it out, then they are visibly just fast.</p>
            <p className="dim">Counterplay: bait it early, 📡 the whole chain, or attack the hand economy (🧲/🤝) it cannot dodge.</p>
            <p><b>Comedy wells:</b></p>
            <p className="dim">{WELLS.join(' · ')}</p>
            <p><b>Real facts behind the jokes:</b></p>
            <p className="dim">{FACTS.join(' · ')}</p>
            <p className="dim">Palette: obsidian black + heat-gold + one coolant-cyan accent · cast glass, gold foil, steam · kettle-whistle whoosh, glass ping as it cools · motion verbs: skip, lance, vent, furl, overshoot.</p>
            <p className="dim">Identity: the tempo–dodge civilization — strong against attack chains and baiting; weak against hand-economy pressure. Future rivalries: Jupiter Stormkin (amplify vs deflect), Saturn Ring Corsairs (hoarders vs spendthrifts).</p>
          </section>
        </div>
        <button className="primary" onClick={onClose}>Back to the race</button>
      </div>
    </div>
  );
}
