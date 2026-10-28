/** Procedural space-ambient soundtrack — Web Audio only, no assets, nothing to license.
 *  A warm detuned drone pad breathes under sparse pentatonic plucks with a space echo. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try { return localStorage.getItem('lastorbit-muted') === '1'; } catch { return false; }
}

export function isMuted(): boolean { return muted; }

const PENTATONIC = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];

function start(): void {
  if (ctx || muted) return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.setTargetAtTime(0.16, ctx.currentTime, 2.5); // slow fade-in

  // drone pad: detuned triangles/sines through a gentle low-pass, each voice slowly breathing
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 640;
  filter.Q.value = 0.6;
  const padOut = ctx.createGain();
  padOut.gain.value = 0.5;
  filter.connect(padOut);
  padOut.connect(master);

  [55, 110, 164.81, 220, 329.63].forEach((f, i) => {
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
  schedulePluck(delay);
}

function schedulePluck(echo: DelayNode): void {
  if (!ctx) return;
  const wait = 3500 + Math.random() * 6000;
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

/** Call from any user gesture. Safe to call repeatedly; browsers require a gesture for audio. */
export function startAudio(): void {
  if (!ctx && !muted) start();
  if (ctx?.state === 'suspended') void ctx.resume();
}

/** Returns the new muted state. */
export function toggleMuted(): boolean {
  muted = !muted;
  try { localStorage.setItem('lastorbit-muted', muted ? '1' : '0'); } catch { /* private mode */ }
  if (ctx && master) master.gain.setTargetAtTime(muted ? 0 : 0.16, ctx.currentTime, 0.3);
  if (!ctx && !muted) start();
  return muted;
}

// auto-start on the first interaction anywhere (browsers block autoplay before a gesture)
if (typeof document !== 'undefined') document.addEventListener('pointerdown', startAudio);
