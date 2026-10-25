// Deterministic RNG (mulberry32). The whole engine must be a pure function of
// (state, command): randomness only ever flows through the seeded state.

export function mulberry32Step(state: number): { state: number; value: number } {
  let s = (state + 0x6d2b79f5) | 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { state: s, value };
}

export function randomInt(bound: number, rngState: number): { state: number; value: number } {
  const { state, value } = mulberry32Step(rngState);
  return { state, value: Math.min(bound - 1, Math.floor(value * bound)) };
}

/** Fisher–Yates shuffle of a copy. Returns new array + updated rng state. */
export function shuffled<T>(items: readonly T[], rngState: number): { state: number; deck: T[] } {
  const arr = items.slice();
  let s = rngState;
  for (let i = arr.length - 1; i > 0; i--) {
    const r = randomInt(i + 1, s);
    s = r.state;
    const j = r.value;
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return { state: s, deck: arr };
}
