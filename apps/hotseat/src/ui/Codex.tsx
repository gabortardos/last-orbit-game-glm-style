/** Civilization Codex — the bible (`docs/14`) living on the game screen, so any player
 *  who wonders "who ARE these people?" can read it without leaving the table (D-030). */

interface Civ {
  glyph: string;
  origin: string;
  name: string;
  direction: string;
  hook: string;
  playable?: boolean;
  deep?: boolean; // full sheet exists, but the power is not implemented yet
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
  { glyph: '🌍', origin: 'Earth', name: 'The Improvisers', direction: 'Mismatched gear, adapters, tape, dangerous optimism', hook: 'The only ones proud of their junk', deep: true },
  { glyph: '♂', origin: 'Mars', name: 'The Rustborn', direction: 'Red-armoured engineers; a drill for every problem', hook: 'Dust storms; obsessed with "the old oceans"', playable: true },
  { glyph: '♃', origin: 'Jupiter', name: 'The Stormkin', direction: 'Gaseous manta giants in pressure suits; loud, theatrical', hook: 'A storm older than nations — the Spot as a monument', playable: true },
  { glyph: '♄', origin: 'Saturn', name: 'The Ring Corsairs', direction: 'Crystalline collectors and pirates with personal orbiting rings', hook: 'Rings as status and hoard; density so low they would float', deep: true },
  { glyph: '♅', origin: 'Uranus', name: 'The Sideways Sages', direction: 'Angular ice beings; suspect the rest of the system is tilted', hook: '98° axial tilt; coldest atmosphere, deadpan delivery', deep: true },
  { glyph: '♆', origin: 'Neptune', name: 'The Deepwave Oracles', direction: 'Bioluminescent deep-blue prophets; correct but useless warnings', hook: 'Fastest winds; far, dark, mysterious', deep: true },
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
      { dim: true, text: 'Expanded lore (v0.6): They schedule everything "one orbit out" — 88 days — and still arrive a full solar day (176) late: the only fleet late by resonance, and furious about it · The Caloris Basin impact was so violent it shattered terrain on the OPPOSITE side of the planet — Flareskip insurance claims have a field for "far side of the problem" · Hospitality drills for BepiColombo include a seating chart with the two previous guests\' chairs left crossed off. (Facts: a 3:2 spin–orbit resonance is why the day outruns the year; Caloris spans ~1,550 km and its shock focused through the planet to break up the far side.)' },
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
      { dim: true, text: 'Expanded lore (v0.6): The Court is booked as morning star AND evening star — they accept both engagements and are fashionably absent from each · Magellan had to radar-map the entire face through permanent cloud: their portrait exists only as rumor, which they consider the correct medium · Venus is nearly Earth\'s twin in size and mass — cited in Court documents as "the sister that kept the estate."' },
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
      { dim: true, text: 'Expanded lore (v0.6): Martian sunsets are BLUE — their postcards get returned as "misprinted," and they frame the returns · A Martian sol runs 24 h 37 m: the Rustborn are thirty-seven minutes late to everything forever, and call Earth-time "rude" · The soil is laced with toxic perchlorates — they garden anyway, in sealed trays, defiantly labeled "outdoor."' },
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
      { dim: true, text: 'Expanded lore (v0.6): In 1994 comet Shoemaker-Levy 9 struck Jupiter in 21 visible impacts — the Stormkin raise it at every treaty dinner as "the time we took one for the inner system; you\'re welcome" · Jupiter was HEARD on radio (1955) before anyone photographed its storms — loud before visible, which they consider their correct introduction · Their aurorae are larger than Earth, and they use them as neon signage for political slogans.' },
      { dim: true, text: 'Palette: banded bronze + storm-teal + lightning white · striated gradients, billowing silhouettes · sub-bass rumble, distant thunder, rain that applauds · motion verbs: roar, bank, swell, break.' },
      { dim: true, text: 'Identity: the pressure civilization — strong in storm-rich late games; weak against early elimination and anyone who tracks the discard pile. Future rivalries: Mercury Flareskips (amplify vs deflect), Neptune Oracles (loud forecasts vs correct ones).' },
    ],
  },
  {
    id: 'earth',
    title: '🌍 The Improvisers — the spare-parts civilization',
    paras: [
      { b: 'Form:', text: 'patchwork crews of every species that ever shipped a crate; mismatched hull plates labeled in three alphabets, and a roll of tape held like a scepter.' },
      { b: 'Captain:', text: 'Amara "Warranty Void" Okafor — never met a malfunction she didn\'t call "a feature we haven\'t installed yet." "If it works, don\'t explain it."' },
      { b: 'Flagship · The Field Expedient:', text: 'a hull assembled from every fleet\'s discard bins; carries adapters for sockets no longer manufactured; moves with a cheerful, alarming rattle. Defeat: it doesn\'t explode — it politely disassembles into labeled bags of parts ("it\'s a kit now").' },
      { b: 'Faction power · Kit Bash (designed — awaiting sign-off):', text: 'once per match, during your Command Phase, play a single ❄️/🛠️ Component as if it were a completed matching pair — siphon 1 random card from a target captain. Normal pair rules apply (one 📡 cancels; the victim may ↪️). Everyone else needs twins; Earth needs one part and tape.' },
      { dim: true, text: 'Counterplay: 📡 the siphon or ↪️ it onward; strip components early (🧲/🤝 take them first) so there is nothing to bash; bait it — spent powers are public.' },
      { b: 'Comedy wells:', text: 'Duct tape is a load-bearing cultural institution (Apollo 13\'s CO2 scrubber and a lunar-rover fender were tape repairs — they know, they\'re proud) · They named the ocean planet "Dirt" · An adapter for every socket ever manufactured; luggage is half adapters by weight · "We\'ll fix it in flight": motto and safety violation · The Moon is legally a souvenir, and the paperwork is on the plaque.' },
      { b: 'Real facts behind the jokes:', text: 'Apollo 13\'s crew survived partly on a duct-tape-and-flight-plan CO2 scrubber adapter · Apollo 17\'s rover fender was rebuilt with folded maps and tape · Earth is ~71% ocean yet named for dry ground · The Moon recedes 3.8 cm per year — the souvenir is leaving · The only planet with plate tectonics — a self-recycling crust · The ISS: rival nations bolting their parts to each other\'s, with agreed bolts.' },
      { dim: true, text: 'Palette: workwear orange + tape silver + marker black · mismatched matte panels, hazard stripes · ratchet clicks, tape screech, a satisfied "hm" · motion verbs: jury-rig, clamp, splice, bolt-on.' },
      { dim: true, text: 'Identity: the spare-parts civilization — strong when components flow (they need only one); weak to the same hand pressure as everyone else. Rivalries: Mars Rustborn (build it RIGHT vs build it NOW — the junk schism), Saturn Corsairs (collection vs clutter), Venus Courtiers (etiquette vs duct tape).' },
    ],
  },
  {
    id: 'saturn',
    title: '♄ The Ring Corsairs — the hoard civilization',
    paras: [
      { b: 'Form:', text: 'faceted crystalline collectors, each wearing a personal orbiting ring of prizes — net worth you can see from across the system.' },
      { b: 'Captain:', text: 'Vesper Noctis, callsign "Floats" — weighs in at 0.687 g/cm³ and announces it. "We don\'t sink. We luxuriate."' },
      { b: 'Flagship · The Liquid Asset:', text: 'a hull of bonded ring-ice, so low-density it qualifies as both vessel and mirage; the collection orbits the captain, catalogued. Defeat: the ring scatters into a perfect new ring around the wreckage — the estate survives intact.' },
      { b: 'Faction power · Ringwall (designed — awaiting sign-off):', text: 'once per match, when a theft would take a card from your hand (🤝 Requisition, 🪝 Boarding, or a Component-pair siphon), the theft fizzles — the attacker\'s card is still spent, your card stays. You cannot rob the ring.' },
      { dim: true, text: 'Counterplay: bait it (spent is public), then punish with ⚡/🧲 — the rings stop theft, not vandalism — or attack the clock with 🚀 Flyby debt.' },
      { b: 'Comedy wells:', text: 'Status rings: inspectors appraise net worth by band count · The hexagon north pole is HQ; nobody knows why; it is load-bearing · 146+ moons and they keep finding more — "the universe keeps issuing us storage"; every moon a county, every county a claim-jumper story · The whole fortune is ~10 m thick — minimalism, technically · Cassini dove between planet and rings 22 times; the Corsairs called it "the toll lane."' },
      { b: 'Real facts behind the jokes:', text: 'Mean density 0.687 g/cm³ — the planet would float in a big enough ocean · Rings ~280,000 km wide yet roughly 10 m thick — proportionally thinner than paper · The rings may be only 10–100 million years old (younger than many dinosaurs) and began with something shattered · Hexagonal jet stream at the north pole, ~30,000 km across · 146 confirmed moons and counting · Enceladus\'s geysers resupply the E-ring — the moon that restocks the shop · Titan keeps a thicker atmosphere than Earth and lakes of methane.' },
      { dim: true, text: 'Palette: pale gold + ring-platinum + hexagon teal · faceted crystal, prisms · glass chimes, coin-shush, harmonic drone · motion verbs: bank, orbit, shear, glint.' },
      { dim: true, text: 'Identity: the hoard civilization — strong in long, theft-heavy games; weak against destruction (⚡/🧲 pass straight through the rings) and deck-pressure endgames. Rivalries: Mars Rustborn ("you FIX things?" — "you COLLECT things?"), Venus Courtiers (old money vs new hoard), Mercury Flareskips (spendthrifts vs the unspent).' },
    ],
  },
  {
    id: 'uranus',
    title: '♅ The Sideways Sages — the geometry civilization',
    paras: [
      { b: 'Form:', text: 'angular ice beings built like plumb lines and set squares; every other silhouette reads to them as "tilted."' },
      { b: 'Captain:', text: 'Titania Umbra, callsign "True Level" — deadpan, correct, insufferable. "We checked. It\'s you."' },
      { b: 'Flagship · The Level Set:', text: 'a vessel indistinguishable from a shelf, flying 98° off everyone\'s notion of up; the décor is aggressively horizontal. Defeat: it tips 98° and keeps flying; the crowd is honestly unsure whether they lost.' },
      { b: 'Faction power · Axial Tilt (designed — awaiting sign-off):', text: 'once per match, when an attack card or pair targets you, the attacker must choose a different legal target — the play proceeds normally, with no ↪️ payload growth. You cannot hit what is sideways.' },
      { dim: true, text: 'Counterplay: spent is public — bait it, or skip targeting them entirely: 🚀 Flyby debt, 🌀 chaos and a thinning deck all ignore a tilt; a 📡 still kills whatever gets re-aimed.' },
      { b: 'Comedy wells:', text: 'Every other civilization is "tilted"; their compass roses list "up" as a personal choice · Polar days last 42 years — "we are never early or late; our seasons outlast your careers" · All moons are named for Shakespeare — the entire navy is a repertory company, orders issued as stage directions ("Exeunt, pursued by bear") · Voyager 2 visited once, in 1986; they still set a place at the table · Coldest atmosphere in the system though NOT the farthest — "the cold is a lifestyle, not a distance" · Verona Rupes, the tallest cliff known, is a scenic overlook; staff may not call it "the drop."' },
      { b: 'Real facts behind the jokes:', text: 'Axial tilt 97.8° — the planet rolls on its side; each pole gets 42 years of daylight · Coldest planetary atmosphere measured (−224 °C) even though Neptune is farther out · One spacecraft visit ever: Voyager 2, January 1986 · ~28 moons, all named for Shakespeare and Pope characters · Miranda\'s Verona Rupes is a ~20 km cliff · The magnetic field is offset and tilted ~59° from the spin axis — the magnetosphere tumbles chaotically · The rings were discovered in 1977 by watching a star blink out.' },
      { dim: true, text: 'Palette: ice cyan + plumb white + graphite, one vertical-magenta accent · angular facets, level lines · dry click, long pause, wind chime in an empty room · motion verbs: tilt, drift, parallax, shrug.' },
      { dim: true, text: 'Identity: the geometry civilization — strong against targeted aggression; weak to non-targeted pressure (🚀 debt, 🌀 shuffles, deck attrition) and to patience. Rivalries: Mercury Flareskips (dodging vs refusing), Jupiter Stormkin (loud vs deadpan), Neptune Oracles (the eternal farther/colder/windier grudge).' },
    ],
  },
  {
    id: 'neptune',
    title: '♆ The Deepwave Oracles — the foresight civilization',
    paras: [
      { b: 'Form:', text: 'bioluminescent deep-blue prophets who glow brighter the worse the news; their warnings are always correct and never on time.' },
      { b: 'Captain:', text: 'Lumen Trench, callsign "Told You" — answers questions before they are asked, badly timed. "We told you the storm was coming. In forty years. It came."' },
      { b: 'Flagship · The Forecast:', text: 'sails slightly ahead of where it will be, hull lit with warnings in the past tense. Defeat: announced three turns early, correctly; everyone agrees it was insufferable.' },
      { b: 'Faction power · Deep Sight (designed — awaiting sign-off):', text: 'once per match, at any moment, privately view the top 3 cards of the deck — 🔭 Deep-Space Scan without spending a card. They knew. Of course they knew.' },
      { dim: true, text: 'Counterplay: 🌀 Slingshot shuffles the sight into noise (hold one against an oracle); spent is public; and knowledge is not armor — they still need the 🛡️ everyone else does.' },
      { b: 'Comedy wells:', text: 'Forecasts correct but useless ("we told you the storm was coming — in forty years"); they foresaw your victory and sold tickets · Discovered by mathematics before telescopes: being SEEN is vulgar — they knew where they\'d be before anyone did · Triton orbits backwards: "it\'s not a phase, it\'s an inclination" — and it is spiralling in to be shredded into rings in ~3.6 billion years: the only civilization with a scheduled funeral for a moon, marked gently on calendars · The Great Dark Spot appears and vanishes like a side project — "the Spot is on tour" · Winds of 2,100 km/h: "a gentle breeze, locally"; everything is tethered, including the etiquette · One Neptunian year = 165 Earth years: "a Neptunian minute" is a valid excuse for any lateness.' },
      { b: 'Real facts behind the jokes:', text: 'Fastest winds in the solar system — up to ~2,100 km/h, supersonic · Predicted by Le Verrier\'s mathematics and found in 1846 within 1° of the forecast · Triton is a captured Kuiper-belt object in retrograde orbit, with nitrogen geysers, slowly spiralling inward · Neptune radiates ~2.6× the heat it receives from the Sun · One orbit takes 165 Earth years — the first full observed lap completed in 2011 · Visited once: Voyager 2, 1989 · The interior likely rains diamond.' },
      { dim: true, text: 'Palette: abyssal blue + bioluminescent teal + warning-chartreuse accent · translucency, sonar rings, depth gradients · whale-song sweeps, distant sonar ping, pressure creak · motion verbs: swell, echo, refract, loom.' },
      { dim: true, text: 'Identity: the foresight civilization — strong in scan-led games and endgame planning; weak to shufflers (🌀) and to aggression (knowledge buys tempo, not hulls). Rivalries: Jupiter Stormkin (loud forecasts vs correct ones), Uranus Sages (who is farther, colder, windier — an eternal, quiet grudge).' },
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
            all public once spent. The other four are now fully designed — deep sheets below — and they
            join the hangar once Gábor signs off their powers.
          </p>
          <div className="civgrid">
            {CIVS.map((c) => (
              <div key={c.origin} className={`civcard ${c.playable ? 'pilot' : ''}`}>
                <h4><span className="civglyph">{c.glyph}</span> {c.name} <span className="dim">· {c.origin}</span></h4>
                <p>{c.direction}</p>
                <p className="dim">Comedy well: {c.hook}</p>
                {c.playable && <p className="civtag"> playable — deep sheet below </p>}
                {!c.playable && c.deep && <p className="civtag dim"> designed — deep sheet below (not yet playable) </p>}
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
