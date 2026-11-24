import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FactionId } from '@last-orbit/game-core';
import type { ClientGame } from '../online/types';

/**
 * D-038 rung 1, first visible slice — the living solar system behind the table.
 * Pure presentation: reads public state only (seats, Sun Fury, active captain, play
 * direction) and never touches the engine. Seats become planets on lit orbits;
 * the Sun's color, glow and pulse track Sun Fury; the active captain's world
 * wears a gold halo. Honors prefers-reduced-motion (static, demand rendering).
 */

const PLANET_COLOR: Record<FactionId | 'vanilla', string> = {
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

const CALM = new THREE.Color('#ffd9a0');
const FURIOUS = new THREE.Color('#ff3b2f');

/** Sun Fury 0..5 → calm gold → furious red. Module off → calm. */
function furyColor(fury: number, moduleOn: boolean): THREE.Color {
  if (!moduleOn) return CALM.clone();
  const c = new THREE.Color();
  c.lerpColors(CALM, FURIOUS, Math.min(fury, 5) / 5);
  return c;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function Sun({ fury, moduleOn, reduced }: { fury: number; moduleOn: boolean; reduced: boolean }) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const color = furyColor(fury, moduleOn);
  const heat = moduleOn ? Math.min(fury, 5) / 5 : 0;
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    core.current?.scale.setScalar(1 + 0.03 * Math.sin(t * (1.1 + heat * 1.4)));
    halo.current?.scale.setScalar(1 + 0.09 * Math.sin(t * (0.8 + heat)));
    if (core.current) core.current.rotation.y = t * 0.06;
  });
  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[1.7, 48, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[2.8, 32, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15 + heat * 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color={color} intensity={1.5 + heat * 1.2} decay={0} distance={120} />
    </group>
  );
}

function OrbitRing({ radius, active }: { radius: number; active: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial
        color={active ? '#ffb84d' : '#59639b'}
        transparent
        opacity={active ? 0.55 : 0.22}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface SeatInfo {
  id: number;
  faction: FactionId | null;
  alive: boolean;
}

function Planet({
  seat,
  a0,
  radius,
  speed,
  direction,
  active,
  reduced,
}: {
  seat: SeatInfo;
  a0: number;
  radius: number;
  speed: number;
  direction: number;
  active: boolean;
  reduced: boolean;
}) {
  const pivot = useRef<THREE.Group>(null);
  const angle = useRef(a0);
  useFrame((_, dt) => {
    if (reduced) return;
    angle.current += direction * speed * dt;
    const a = angle.current;
    pivot.current?.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  const color = new THREE.Color(PLANET_COLOR[seat.faction ?? 'vanilla']);
  if (!seat.alive) color.lerp(new THREE.Color('#151826'), 0.85); // a derelict world goes dark
  return (
    <group ref={pivot} position={[Math.cos(a0) * radius, 0, Math.sin(a0) * radius]}>
      <mesh scale={seat.alive ? 1 : 0.7}>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.75}
          metalness={0.05}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.5 : 0}
        />
      </mesh>
      {seat.faction === 'ringwall' && (
        <mesh rotation={[Math.PI / 2.2, 0, 0.25]}>
          <ringGeometry args={[0.78, 1.18, 48]} />
          <meshBasicMaterial color="#ead9a8" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      {active && seat.alive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.88, 0.05, 12, 48]} />
          <meshBasicMaterial color="#ffb84d" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

function Stars({ reduced, count = 900 }: { reduced: boolean; count?: number }) {
  const mat = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 60 + Math.random() * 50;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph);
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (reduced || !mat.current) return;
    mat.current.opacity = 0.6 + 0.25 * Math.sin(state.clock.elapsedTime * 0.7);
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={mat} color="#cdd7ff" size={0.4} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  );
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
  const moduleOn = game.config.modules.sunFury;
  const fury = moduleOn ? Math.min(game.sunFury ?? 0, 5) : 0;
  const active = game.phase === 'command' ? game.activePlayer : null;
  const n = Math.max(game.players.length, 1);
  return (
    <div className="solar" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 17, 34], fov: 42 }}
          dpr={[1, 1.75]}
          frameloop={reduced ? 'demand' : 'always'}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.55} />
          <Stars reduced={reduced} />
          <Sun fury={fury} moduleOn={moduleOn} reduced={reduced} />
          {game.players.map((p, i) => {
            const radius = 4.6 + i * 2.35;
            return (
              <group key={p.id}>
                <OrbitRing radius={radius} active={active === p.id} />
                <Planet
                  seat={p}
                  a0={(i / n) * Math.PI * 2}
                  radius={radius}
                  speed={0.1 + i * 0.02}
                  direction={game.direction}
                  active={active === p.id}
                  reduced={reduced}
                />
              </group>
            );
          })}
        </Canvas>
      </SceneBoundary>
    </div>
  );
}

