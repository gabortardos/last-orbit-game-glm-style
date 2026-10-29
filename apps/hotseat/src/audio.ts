/** Procedural space-ambient soundtrack — Web Audio only, no assets, nothing to license.
 *  Layers: a breathing detuned pad on a slow 4-chord cycle (Am–F–C–G) · a sub "heartbeat"
 *  pulse · sparse pentatonic plucks through a space echo · quiet stingers tied to game events.
 *  v3 (D-024, "still a bit empty"): + doubled-root bass swells per chord · a slow chord-tone
 *  lead through the echo · a high shimmer voice gliding with the cycle · solar-wind noise bed. */

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

// v3 harmony voices that move with the cycle — the bed gains lows, a singing mid and air (D-024)
const SHIMMER = [659.25, 523.25, 659.25, 587.33]; // sustained high 5th: E5 · C5 · E5 · D5
const BASS = [110, 87.31, 130.81, 98]; // doubled chord roots: A2 · F2 · C3 · G2
const LEAD: readonly (readonly number[])[] = [
  [440, 523.25, 659.25], // Am — A4 C5 E5
  [440, 523.25, 349.23], // F  — A4 C5 F4
  [392, 523.25, 659.25], // C  — G4 C5 E5
  [493.88, 587.33, 783.99], // G — B4 D5 G5
];

const padOscs: OscillatorNode[] = [];
let shimmerOsc: OscillatorNode | null = null;
let echoIn: DelayNode | null = null;

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
  echoIn = delay;

  // v3: high shimmer voice — a sustained 5th with gentle vibrato, gliding with the cycle (D-024)
  shimmerOsc = ctx.createOscillator();
  shimmerOsc.type = 'sine';
  shimmerOsc.frequency.value = SHIMMER[0];
  const vib = ctx.createOscillator();
  vib.frequency.value = 4.2;
  const vibG = ctx.createGain();
  vibG.gain.value = 7; // cents of shimmer
  vib.connect(vibG);
  vibG.connect(shimmerOsc.detune);
  const sg = ctx.createGain();
  sg.gain.value = 0.026;
  shimmerOsc.connect(sg);
  sg.connect(master);
  shimmerOsc.start();
  vib.start();

  // v3: solar wind — looped noise breathing through a slowly sweeping bandpass (D-024)
  const nlen = 2 * ctx.sampleRate;
  const nbuf = ctx.createBuffer(1, nlen, ctx.sampleRate);
  const nd = nbuf.getChannelData(0);
  for (let i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = nbuf;
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 720;
  bp.Q.value = 1.4;
  const sweep = ctx.createOscillator();
  sweep.frequency.value = 0.05;
  const sweepG = ctx.createGain();
  sweepG.gain.value = 330;
  sweep.connect(sweepG);
  sweepG.connect(bp.frequency);
  const ng = ctx.createGain();
  ng.gain.value = 0.011;
  const breathe = ctx.createOscillator();
  breathe.frequency.value = 0.023;
  const breatheG = ctx.createGain();
  breatheG.gain.value = 0.006;
  breathe.connect(breatheG);
  breatheG.connect(ng.gain);
  noise.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  noise.start();
  sweep.start();
  breathe.start();

  // v3: the cycle now also re-voices the bass and sings a little (D-024)
  bassSwell(BASS[0]);
  scheduleLead(LEAD[0]);
}

/** Glide the pad through the chord cycle — this is what turns "drone" into "music".
 *  v3: the shimmer follows, the bass re-voices and a slow lead sings a few notes per chord (D-024). */
function scheduleChordCycle(): void {
  let chord = 0;
  window.setInterval(() => {
    if (!ctx) return;
    chord = (chord + 1) % CHORDS.length;
    CHORDS[chord].forEach((f, v) => padOscs[v]?.frequency.setTargetAtTime(f, ctx!.currentTime, 1.8));
    shimmerOsc?.frequency.setTargetAtTime(SHIMMER[chord], ctx.currentTime, 1.8);
    bassSwell(BASS[chord]);
    scheduleLead(LEAD[chord]);
  }, 13000);
}

/** One chord-long bloom on the doubled root — harmonic rhythm without a drum (D-024). */
function bassSwell(freq: number): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.setTargetAtTime(0.05, now + 0.3, 2.2);
  g.gain.setTargetAtTime(0.0001, now + 10.6, 1.5);
  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + 13);
}

/** A slow bowed chord tone through the space echo — the singing mid the bed was missing (D-024). */
function leadNote(freq: number, at: number): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.setTargetAtTime(0.02, t + 0.2, 0.9);
  g.gain.setTargetAtTime(0.0001, t + 2.8, 1.2);
  osc.connect(g);
  g.connect(master);
  if (echoIn) g.connect(echoIn);
  osc.start(t);
  osc.stop(t + 6);
}

/** 2–3 lead notes scattered across the 13-second chord. */
function scheduleLead(notes: readonly number[]): void {
  let t = 1.6 + Math.random() * 2.2;
  const count = 2 + (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < count; i++) {
    leadNote(notes[Math.floor(Math.random() * notes.length)], t);
    t += 3.4 + Math.random() * 2.4;
  }
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
    const tone = (f: number, vol: number, delay = 0): void => {
      const t = now + delay;
      const osc = ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      osc.connect(g);
      g.connect(master!);
      g.connect(echo);
      osc.start(t);
      osc.stop(t + 2.4);
    };
    const base = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    tone(base, 0.05 + Math.random() * 0.05);
    if (Math.random() < 0.3) tone(base * 1.5, 0.03, 0.18); // v3: an occasional open fifth (D-024)
    schedulePluck(echo);
  }, wait);
}

// ---------------------------------------------------------------- stingers

export type Sfx =
  | 'play' | 'override' | 'cancelled' | 'steal' | 'give' | 'flyby'
  | 'rupture' | 'contained' | 'fury' | 'eliminated' | 'win'
  | 'storm' | 'wind' | 'surge' | 'snag' | 'deflect';

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
    case 'storm': tone('sawtooth', 320, 110, 0.22, 0.055); tone('square', 170, 70, 0.26, 0.04, 0.06); break; // grit blast
    case 'wind': tone('sine', 392, 392, 0.12, 0.05); tone('sine', 494, 494, 0.12, 0.05, 0.08); tone('sine', 587, 587, 0.18, 0.055, 0.16); break; // rising arpeggio
    case 'surge': tone('square', 990, 130, 0.24, 0.05); break; // zap
    case 'snag': tone('triangle', 150, 85, 0.16, 0.06); tone('square', 420, 290, 0.12, 0.03, 0.1); break; // clamp + rattle
    case 'deflect': tone('sine', 310, 680, 0.2, 0.06); break; // bounce away, rising
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
