/** Civilization Codex — the bible (`docs/14`) living on the game screen, so any player
 *  who wonders "who ARE these people?" can read it without leaving the table (D-030). */

interface Civ {
  glyph: string;
  origin: string;
  name: string;
  direction: string;
  hook: string;
  playable?: boolean;
}

interface SheetPara {
  b?: string; // bold lead-in ("Form:", "Captain:")
  text: string;
  dim?: boolean;
}

interface Sheet {
  id: string;
  title: string;
  paras: SheetPara[];
}

const CIVS: Civ[] = [
  { glyph: '☿', origin: 'Mercury', name: 'The Flareskips', direction: 'Obsidian-and-gold heat-sail speedsters; impatient; permanent cooling problems', hook: 'Fastest orbit — scorched and icy at once', playable: true },
  { glyph: '♀', origin: 'Venus', name: 'The Cloud Courtiers', direction: 'Acid-cloud socialites in ornate masks; floating barges', hook: 'Crushing pressure, sulfuric clouds, "morning star" vanity', playable: true },
  { glyph: '🌍', origin: 'Earth', name: 'The Improvisers', direction: 'Mismatched gear, adapters, tape, dangerous optimism', hook: 'The only ones proud of their junk' },
  { glyph: '♂', origin: 'Mars', name: 'The Rustborn', direction: 'Red-armoured engineers; a drill for every problem', hook: 'Dust storms; obsessed with "the old oceans"', playable: true },
  { glyph: '♃', origin: 'Jupiter', name: 'The Stormkin', direction: 'Gaseous manta giants in pressure suits; loud, theatrical', hook: 'A storm older than nations — the Spot as a monument', playable: true },
  { glyph: '♄', origin: 'Saturn', name: 'The Ring Corsairs', direction: 'Crystalline collectors and pirates with personal orbiting rings', hook: 'Rings as status and hoard; density so low they would float' },
  { glyph: '♅', origin: 'Uranus', name: 'The Sideways Sages', direction: 'Angular ice beings; suspect the rest of the system is tilted', hook: '98° axial tilt; coldest atmosphere, deadpan delivery' },
  { glyph: '♆', origin: 'Neptune', name: 'The Deepwave Oracles', direction: 'Bioluminescent deep-blue prophets; correct but useless warnings', hook: 'Fastest winds; far, dark, mysterious' },
];

const SHEETS: Sheet[] = [
  {
    id: 'mercury',
    title: '☿ The Flareskips — the tempo civilization',
    paras: [
      { b: 'Form:', text: 'cast-glass sprinters in gold-foil sails — the sails are the engine.' },
      { b: 'Captain:', text: 'Cinder Vale, callsign "Twice-Dawn" — congenitally early; treats patience as hoarding. "Early is on time; on time is a different orbit."' },
      { b: 'Flagship · The Sudden Dawn:', text: 'a black-glass dagger with four gold-foil sails; never still, radiators glowing cherry-red while idling (running hot = standing still). Defeat: the sails snap shut and the ship folds backward like a dropped umbrella.' },
      { b: 'Faction power · Flare Skip:', text: 'once per match, when attacked, redirect the attack as if playing ↪️ Deflector — paying no card. The payload still grows; chain and 📡 rules apply. Spent powers are public: bait it out, then they are visibly just fast.' },
      { dim: true, text: 'Counterplay: bait it early, 📡 the whole chain, or attack the hand economy (🧲/🤝) it cannot dodge.' },
      { b: 'Comedy wells:', text: 'Speed impatience — two birthdays per solar day · Cooling problems — captains brag radiators like truckers brag engines; sunscreen-over-parka wardrobe · The Sun\'s takeback sunrise offends them personally ("WE do not do takebacks") · Shadow-crater ice trade — iced drinks and a working forge from the same crater · The planet runs a size small (still shrinking).' },
      { b: 'Real facts behind the jokes:', text: 'Year = 88 Earth days, but a solar day = 176 — a Mercurian birthday comes twice per day · −173 °C night to +427 °C day: the system\'s worst wardrobe problem · Near perihelion the Sun briefly reverses in the sky — the double sunrise, the only takeback the Sun ever does · Permanently shadowed polar craters hold water ice right beside furnace heat · The planet shrinks as its outsized core cools — the crust wrinkles (scarps) · That iron core is ~85% of the radius: a metal ball in a rock onesie · Only two spacecraft have ever visited — BepiColombo arrives late 2026, and they are rehearsing hospitality for their third guest ever.' },
      { dim: true, text: 'Palette: obsidian black + heat-gold + one coolant-cyan accent · cast glass, gold foil, steam · kettle-whistle whoosh, glass ping as it cools · motion verbs: skip, lance, vent, furl, overshoot.' },
      { dim: true, text: 'Identity: the tempo–dodge civilization — strong against attack chains and baiting; weak against hand-economy pressure. Future rivalries: Jupiter Stormkin (amplify vs deflect), Saturn Ring Corsairs (hoarders vs spendthrifts).' },
    ],
  },
  {
    id: 'venus',
    title: '♀ The Cloud Courtiers — the politics civilization',
    paras: [
      { b: 'Form:', text: 'gilded barges slung beneath acid-cloud balloons; every Courtier wears a cloud-glass mask, auctioned at debut and never removed in company.' },
      { b: 'Captain:', text: 'Marguerite the veiled-Desdemona, callsign "Morning Star" — hosts a salon at apogee; considers paying tribute a wardrobe malfunction. "One does not pay. One invites payment."' },
      { b: 'Flagship · The Gilded Sigh:', text: 'a wedding cake of a barge, pressure-hull of nested ceramic bells; defeats are announced as "early departures" and never discussed again.' },
      { b: 'Faction power · Court Favor:', text: 'once per match, when a 🤝 Requisition demands tribute from you, reverse it — the initiator gifts YOU 1 card instead. No card paid. One 📡 still voids the whole exchange, and the initiator may ↪️ the tribute onto a third captain. Spent powers are public.' },
      { dim: true, text: 'Counterplay: 📡 the reversal (their power burns either way — it is spent when used); don\'t requisition a loaded Court — board them (⚔) or surge them (⚡): nothing to flip there.' },
      { b: 'Comedy wells:', text: 'Sulfuric clouds brew "Venusian acid tea" (imported water, obviously) · Surface pressure is 92 bar — "we keep it up here, darling" · The planet spins retrograde: the Sun rises in the west, which the Court cites as proof the Sun orbits THEM · "Morning Star" is a hereditary title and legally load-bearing · A Venus day outlasts its year: debutante seasons last four months and have never once ended on time.' },
      { b: 'Real facts behind the jokes:', text: 'Hottest planet in the system — hotter than Mercury, thanks to a runaway greenhouse · Surface pressure ~92× Earth\'s (crush depth) · Rotates backwards; one rotation = 243 Earth days, longer than its 225-day year · Clouds of sulfuric acid over volcanic plains · The brightest planet in Earth\'s night sky · Landed craft have survived barely two hours down there.' },
      { dim: true, text: 'Palette: champagne gold + rose-copper + acid-cream · baroque scrollwork, fan silhouettes · masquerade chimes, whispered asides · motion verbs: veil, host, decline, eclipse.' },
      { dim: true, text: 'Identity: the politics civilization — strong against tribute theft (🤝); weak against outright destruction (⚡/🧲) and baiting the one Favor into a 📡. Future rivalries: Earth Improvisers (etiquette vs duct tape), Saturn Corsairs (old money vs new hoard).' },
    ],
  },
  {
    id: 'mars',
    title: '♂ The Rustborn — the scavenger civilization',
    paras: [
      { b: 'Form:', text: 'red-armoured fabricators; ships grown from recycled drill heads — nothing aboard is new and everything aboard is proud of it.' },
      { b: 'Captain:', text: 'Bram Oxide, callsign "Second-Hand" — has never met a wreck he didn\'t call "pre-owned". "Waste is a design flaw."' },
      { b: 'Flagship · The Patient Harvest:', text: 'a lattice hull of welded derelict ribs; when disabled she is towed home, mourned for one shift, and reused entirely — including the mourning.' },
      { b: 'Faction power · Salvage Run:', text: 'once per match, during your Command Phase, take any card from the discard pile for free — routed through the standard reaction window, so one 📡 cancels the grab (and the run still burns: baitable, like ☿). Spent powers are public.' },
      { dim: true, text: 'Counterplay: hold your 📡 for the run; mind what you scrap — against a Rustborn your discard pile is a shop window; strip the pile yourself with ♻️ first.' },
      { b: 'Comedy wells:', text: '"The old oceans" nostalgia — fountains in the mess running recycled coolant, legally classified as "heritage water" · Global dust storms: the whole deck shuts for Cleaning Day, twice enforced at spanner-point · The planet used to run wet — every dry creekbed gets a plaque · Everything is "gently orbital": the system\'s least honest second-hand market · Phobos is falling and they have already measured it for parts.' },
      { b: 'Real facts behind the jokes:', text: 'Olympus Mons is the tallest volcano known — nearly three Everests · Valles Marineris would stretch across the entire USA · Ancient riverbeds and lake floors: Mars ran wet for ages · Planet-wide dust storms can hide the whole surface for weeks · Rovers up there have outlasted careers down here · Two tiny moons; Phobos is slowly spiralling in.' },
      { dim: true, text: 'Palette: rust red + bone white + hydraulic oil · welded seams, stencilled numbers · clanks, pressure hiss, tape-gun screech · motion verbs: weld, strip, jury-rig, harvest.' },
      { dim: true, text: 'Identity: the scavenger civilization — strong in long games and discard-heavy tables; weak against a withheld 📡 and tidy opponents. Future rivalries: Earth Improvisers (two schools of junk), Saturn Corsairs (they hoard, we REUSE).' },
    ],
  },
  {
    id: 'jupiter',
    title: '♃ The Stormkin — the pressure civilization',
    paras: [
      { b: 'Form:', text: 'gaseous manta giants in ceremonial pressure suits; they speak in weather, and every utterance is either a forecast or an argument with one.' },
      { b: 'Captain:', text: 'Tharsalla Nine-Band, callsign "The Front" — speaks exclusively in tomorrow\'s weather, which on Jupiter is always "worse". "WE APOLOGIZE FOR THE INCONVENIENCE."' },
      { b: 'Flagship · The Loud Tomorrow:', text: 'a ribbed pressure balloon tugged along by harnesses of captive storm cells; when disabled, the suit sighs out a week of thunder and everyone agrees it was beautiful.' },
      { b: 'Faction power · Storm Shout:', text: 'once per match, when you draw a ☄️ Micrometeoroid Storm, jettison nothing — roar it at another captain instead, and they jettison 1 card. Spent powers are public; the roar cannot be deflected, only survived.' },
      { dim: true, text: 'Counterplay: it is public once spent — count storms and keep a 🛡 handy late-game; you cannot dodge the roar, but you can time your empty hands so it costs them their one shout for nothing.' },
      { b: 'Comedy wells:', text: 'The Great Red Spot is a national monument with a gift shop (winds: 500 km/h — "a light breeze by the Eye") · 95 moons means 95 counties, each convinced IT is the capital · The storm belts are commuter lanes and the commute is annihilating · "It\'s not weather, it\'s heritage" · They consider quiet people suspicious and quiet ships unfinished.' },
      { b: 'Real facts behind the jokes:', text: 'Two and a half times the mass of every other planet combined · The Great Red Spot: a storm wider than Earth, raging for at least centuries · Fastest spin in the system — a day under 10 hours · 95 known moons; Ganymede is bigger than Mercury · Faint rings nobody mentions · A magnetosphere that would span the Sun\'s visible disc.' },
      { dim: true, text: 'Palette: banded bronze + storm-teal + lightning white · striated gradients, billowing silhouettes · sub-bass rumble, distant thunder, rain that applauds · motion verbs: roar, bank, swell, break.' },
      { dim: true, text: 'Identity: the pressure civilization — strong in storm-rich late games; weak against early elimination and anyone who tracks the discard pile. Future rivalries: Mercury Flareskips (amplify vs deflect), Neptune Oracles (loud forecasts vs correct ones).' },
    ],
  },
];

export default function Codex({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay top">
      <div className="modal wide briefing">
        <h2>🌍 Civilizations of the Grand Solar Rally</h2>
        <div className="briefing-scroll">
          <p className="hint">
            Eight civilizations race the Sun&apos;s last lap. Four are playable today (Setup → fleet):
            ☿ Flare Skip, ♀ Court Favor, ♂ Salvage Run, ♃ Storm Shout — all opt-in, all once per match,
            all public once spent. Deep sheets below; the rest are direction sketches for now.
          </p>
          <div className="civgrid">
            {CIVS.map((c) => (
              <div key={c.origin} className={`civcard ${c.playable ? 'pilot' : ''}`}>
                <h4><span className="civglyph">{c.glyph}</span> {c.name} <span className="dim">· {c.origin}</span></h4>
                <p>{c.direction}</p>
                <p className="dim">Comedy well: {c.hook}</p>
                {c.playable && <p className="civtag"> playable — deep sheet below </p>}
              </div>
            ))}
          </div>

          {SHEETS.map((sh) => (
            <section key={sh.id} className="brief">
              <h3>{sh.title}</h3>
              {sh.paras.map((p, i) => (
                <p key={i} className={p.dim ? 'dim' : ''}>{p.b && <b>{p.b} </b>}{p.text}</p>
              ))}
            </section>
          ))}
        </div>
        <button className="primary" onClick={onClose}>Back to the race</button>
      </div>
    </div>
  );
}
