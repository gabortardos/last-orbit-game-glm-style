/** Procedural space-ambient soundtrack — Web Audio only, no assets, nothing to license.
 *  Layers: a breathing detuned pad on a slow 4-chord cycle (Am–F–C–G) · a sub "heartbeat"
 *  pulse · sparse pentatonic plucks through a space echo · quiet stingers tied to game events. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try { return localStorage.getItem('lastorbit-muted') === '1'; } catch { return false; }
}

export function isMuted(): boolean { return muted; }

const MASTER_LEVEL = 0.1; // gentle bed volume (PT-00 round 4: "a bit lower base")

const PENTATONIC = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];

// vi–IV–I–V in C, voiced low so the pad stays a warm bed rather than a melody
const CHORDS: readonly (readonly number[])[] = [
  [55, 110, 164.81, 220, 329.63], // Am
  [43.65, 87.31, 130.81, 174.61, 261.63], // F
  [65.41, 130.81, 196, 261.63, 329.63], // C
  [49, 98, 146.83, 196, 293.66], // G
];

const padOscs: OscillatorNode[] = [];

function start(): void {
  if (ctx || muted) return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.setTargetAtTime(MASTER_LEVEL, ctx.currentTime, 2.5); // slow fade-in

  // drone pad: detuned triangles/sines through a gentle low-pass, each voice slowly breathing
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 640;
  filter.Q.value = 0.6;
  const padOut = ctx.createGain();
  padOut.gain.value = 0.5;
  filter.connect(padOut);
  padOut.connect(master);

  CHORDS[0].forEach((f, i) => {
    const osc = ctx!.createOscillator();
    osc.type = i % 2 ? 'triangle' : 'sine';
    osc.frequency.value = f;
    osc.detune.value = (i - 2) * 4;
    const og = ctx!.createGain();
    og.gain.value = 0.16 / (1 + i * 0.4);
    const lfo = ctx!.createOscillator();
    lfo.frequency.value = 0.03 + i * 0.017;
    const lfoGain = ctx!.createGain();
    lfoGain.gain.value = og.gain.value * 0.55;
    lfo.connect(lfoGain);
    lfoGain.connect(og.gain);
    osc.connect(og);
    og.connect(filter);
    osc.start();
    lfo.start();
    padOscs.push(osc);
  });

  // space echo for the plucks
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.34;
  const fb = ctx.createGain();
  fb.gain.value = 0.38;
  delay.connect(fb);
  fb.connect(delay);
  const wet = ctx.createGain();
  wet.gain.value = 0.5;
  delay.connect(wet);
  wet.connect(master);
  scheduleChordCycle();
  schedulePulse();
  schedulePluck(delay);
}

/** Glide the pad through the chord cycle — this is what turns "drone" into "music". */
function scheduleChordCycle(): void {
  let chord = 0;
  window.setInterval(() => {
    if (!ctx) return;
    chord = (chord + 1) % CHORDS.length;
    CHORDS[chord].forEach((f, v) => padOscs[v]?.frequency.setTargetAtTime(f, ctx!.currentTime, 1.8));
  }, 13000);
}

/** Slow sub heartbeat — one soft pulse every ~5 s keeps time without demanding attention. */
function schedulePulse(): void {
  const beat = (): void => {
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(58, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.15, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.6);
    setTimeout(beat, 4800 + Math.random() * 900);
  };
  beat();
}

function schedulePluck(echo: DelayNode): void {
  if (!ctx) return;
  const wait = 2500 + Math.random() * 4500;
  setTimeout(() => {
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.05, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    osc.connect(g);
    g.connect(master!);
    g.connect(echo);
    osc.start(now);
    osc.stop(now + 2.4);
    schedulePluck(echo);
  }, wait);
}

// ---------------------------------------------------------------- stingers

export type Sfx =
  | 'play' | 'override' | 'cancelled' | 'steal' | 'give' | 'flyby'
  | 'rupture' | 'contained' | 'fury' | 'eliminated' | 'win';

/** Short event sounds driven by the public game log — quiet, never speech-like. */
export function sfx(kind: Sfx): void {
  if (!ctx || !master || muted) return;
  const now = ctx.currentTime;
  const tone = (type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0): void => {
    const t = now + delay;
    const osc = ctx!.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master!);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  };
  switch (kind) {
    case 'play': tone('triangle', 392, 392, 0.22, 0.06); tone('triangle', 523.25, 523.25, 0.3, 0.05, 0.09); break;
    case 'override': tone('square', 880, 660, 0.1, 0.035); tone('square', 880, 660, 0.1, 0.035, 0.15); break; // radio double-blip
    case 'cancelled': tone('sawtooth', 330, 165, 0.4, 0.045); break;
    case 'steal': tone('sine', 720, 170, 0.32, 0.06); break; // swoop down — something left your hand
    case 'give': tone('sine', 330, 440, 0.22, 0.05); break;
    case 'flyby': tone('sine', 200, 820, 0.45, 0.05); break; // swoop up — someone burns past
    case 'rupture': tone('sine', 90, 32, 1.1, 0.14); tone('sawtooth', 400, 60, 0.7, 0.05); break;
    case 'contained': tone('triangle', 660, 660, 0.08, 0.07); tone('triangle', 990, 990, 0.14, 0.05, 0.07); break; // magnetic clank
    case 'fury': tone('sawtooth', 180, 460, 0.7, 0.04); break; // riser
    case 'eliminated': tone('square', 110, 55, 0.9, 0.07); tone('sine', 70, 30, 1.2, 0.1); break;
    case 'win': [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone('triangle', f, f, 0.35, 0.06, i * 0.13)); break;
  }
}

/** Call from any user gesture. Safe to call repeatedly; browsers require a gesture for audio. */
export function startAudio(): void {
  if (!ctx && !muted) start();
  if (ctx?.state === 'suspended') void ctx.resume();
}

/** Returns the new muted state. */
export function toggleMuted(): boolean {
  muted = !muted;
  try { localStorage.setItem('lastorbit-muted', muted ? '1' : '0'); } catch { /* private mode */ }
  if (ctx && master) master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, ctx.currentTime, 0.3);
  if (!ctx && !muted) start();
  return muted;
}

// auto-start on the first interaction anywhere (browsers block autoplay before a gesture)
if (typeof document !== 'undefined') document.addEventListener('pointerdown', startAudio);
