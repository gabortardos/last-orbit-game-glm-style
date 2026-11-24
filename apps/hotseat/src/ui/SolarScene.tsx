/**
 * The living solar system behind the table (D-038, Gábor-directed direction):
 * his Solar System Explorer (github.com/gabortardos/solar-system-glm) ported
 * in as the backdrop engine, with starships and card-action animation on top.
 * Pure presentation — reads ClientGame public state only, engine untouched.
 * Honors prefers-reduced-motion (static scene) and falls back to the plain
 * backdrop if WebGL is unavailable.
 */
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import type { FactionId } from '@last-orbit/game-core';
import type { ClientGame } from '../online/types';
import { BackScene, type SeatVisual } from '../solar/BackScene';

/** Race tints for hulls, engine glows and lane lines. */
const RACE_COLOR: Record<FactionId | 'vanilla', string> = {
  flareskip: '#b8aa9e', // Mercury
  courtier: '#f2d9a4', // Venus
  kitbash: '#5f9ee8', // Earth
  rustborn: '#d97a4f', // Mars
  stormkin: '#dcb27e', // Jupiter
  ringwall: '#ead9a8', // Saturn
  axialtilt: '#9fe0e0', // Uranus
  deepsight: '#6d8ff2', // Neptune
  vanilla: '#98a2c8', // classic captain
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = (): void => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** If WebGL is unavailable the game simply keeps its plain backdrop. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SolarScene({ game }: { game: ClientGame }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<BackScene | null>(null);
  const logSeen = useRef(-1);

  // Own the backdrop's lifecycle: build once per canvas, resize with the page.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    let back: BackScene;
    try {
      back = new BackScene(canvas, { reducedMotion: reduced });
    } catch {
      return; // no WebGL here → the plain backdrop stays
    }
    backRef.current = back;
    logSeen.current = -1;
    const host = canvas.parentElement ?? canvas;
    const observer = new ResizeObserver(() => back.resize());
    observer.observe(host);
    back.resize();
    back.start();
    return () => {
      observer.disconnect();
      back.dispose();
      backRef.current = null;
    };
  }, [reduced]);

  // Game state → scene: fury, captains' ships, and the action director.
  useEffect(() => {
    const back = backRef.current;
    if (back === null) return;
    back.setFury(game.sunFury ?? 0, game.config.modules.sunFury);
    const active = game.phase === 'command' ? game.activePlayer : null;
    const seats: SeatVisual[] = game.players.map((p) => ({
      id: p.id,
      color: RACE_COLOR[p.faction ?? 'vanilla'],
      alive: p.alive,
      active: active === p.id,
    }));
    back.setSeats(seats, game.direction === -1 ? -1 : 1);

    // Action director: fresh flight-log entries become scene events.
    const log = game.log ?? [];
    if (logSeen.current === -1) {
      logSeen.current = log.length; // never replay history on (re)mount
      return;
    }
    const num = (value: unknown): number | null => (typeof value === 'number' ? value : null);
    for (let i = logSeen.current; i < log.length; i++) {
      const entry = log[i];
      if (entry === undefined) continue;
      const data = (entry.data ?? {}) as Record<string, unknown>;
      if (entry.type === 'rupture_reveal') {
        back.solarFlare(); // the Sun erupts
      } else if (entry.type === 'fury_up') {
        back.sunFlash();
      } else if (entry.type === 'contained') {
        const seat = num(data.player);
        if (seat !== null) back.shieldPulse(seat);
      } else if (entry.type === 'play') {
        const seat = num(data.player);
        const target = num(data.target);
        if (seat !== null && target !== null && target !== seat) back.streak(seat, target);
      } else if (entry.type === 'give') {
        const from = num(data.from);
        const to = num(data.to);
        if (from !== null && to !== null) back.streak(from, to);
      }
    }
    logSeen.current = log.length;
  }, [game]);

  return (
    <div className="solar" aria-hidden="true">
      <SceneBoundary>
        <canvas ref={canvasRef} />
      </SceneBoundary>
    </div>
  );
}
