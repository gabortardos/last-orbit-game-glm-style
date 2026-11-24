/**
 * Last Orbit's living backdrop — built on Gábor's own Solar System Explorer
 * (github.com/gabortardos/solar-system-glm): the data/sim/render layers under
 * src/solar are ported from that project nearly verbatim, exactly as its README
 * anticipated ("the core can later serve as a background engine for other 3D
 * games"). This class is the game-side composition:
 *
 *   - hands-off cinematic camera sweeping the whole planetary system,
 *   - the catalog Sun wearing Sun Fury (calm gold → furious red),
 *   - one starship per captain racing the asteroid-belt corridor between the
 *     orbits of Mars and Jupiter, play direction honored,
 *   - log-driven action animation: the Sun erupts when a rupture is revealed,
 *     glowing raid streaks fly between ships on targeted plays and gifts, and
 *     a shield pulse rings a captain who contains a rupture.
 *
 * Presentation only: it receives plain numbers and colors, never game objects.
 */

import * as THREE from 'three';
import { CELESTIAL_CATALOG, PLANET_IDS, getCelestial } from './data/catalog';
import { buildSystemVisuals, disposeVisuals, type SystemVisuals } from './render/bodies';
import { heliocentricScenePositions } from './render/sync';
import { bodyRadiusScene, heliocentricRadiusScene } from './render/scale';
import { daysSinceJ2000 } from './sim/orbit';
import { hashString, mulberry32 } from './render/rand';

/** Backdrop simulation speed: sim days per real second (Mercury laps in ~30 s). */
const DAYS_PER_SECOND = 3;
/** Camera auto-orbit rate, rad/s — one full sweep in roughly five minutes. */
const CAMERA_DRIFT = 0.02;
/** Ship lanes sit between Mars's orbit (~138 u) and Jupiter's (~186 u). */
const LANE_BASE_RADIUS = 144;
const LANE_STEP = 9;
/** Seconds one ship needs for a full lap of its lane. */
const SHIP_LAP_SECONDS = 48;

const SUN_CALM = new THREE.Color('#FFF3C4'); // the Explorer's catalog tint
const SUN_FURIOUS = new THREE.Color('#ff4b30');
const LIGHT_CALM = new THREE.Color('#fff2d5');
const LIGHT_FURIOUS = new THREE.Color('#ff6a4a');
const ACTIVE_GOLD = 0xffd35c;
const DERELICT = new THREE.Color('#3a3f52');

export interface SeatVisual {
  readonly id: number;
  readonly color: string;
  readonly alive: boolean;
  readonly active: boolean;
}

export interface BackSceneOptions {
  readonly reducedMotion: boolean;
}

interface Ship {
  readonly group: THREE.Group;
  readonly glow: THREE.Mesh;
  readonly ring: THREE.Mesh;
  readonly lane: THREE.LineLoop;
  readonly color: THREE.Color;
  readonly laneRadius: number;
  readonly laneY: number;
  readonly phase: number;
  angle: number;
}

/** One live action animation; update() returns false when it is finished. */
interface Effect {
  update(dt: number): boolean;
  dispose(): void;
}

export class BackScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly reduced: boolean;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly visuals: SystemVisuals;
  private readonly sun: THREE.Mesh | undefined;
  private readonly sunHalo: THREE.Mesh;
  private readonly sunHaloMaterial: THREE.MeshBasicMaterial;
  private readonly sunLight: THREE.PointLight;
  private readonly ships = new Map<number, Ship>();
  private readonly effects: Effect[] = [];

  private seats: readonly SeatVisual[] = [];
  private seatSignature = '';
  private direction = 1;
  private heat = 0;
  private flareGlow = 0; // lighting spike left behind by solar flares
  private haloFlash = 0; // short halo spike when fury steps up

  private readonly bootDays: number;
  private readonly framedRadius: number;
  private baseDistance: number;
  private elapsed = 0;
  private theta = 0.6;
  private raf = 0;
  private running = false;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement, options: BackSceneOptions) {
    this.canvas = canvas;
    this.reduced = options.reducedMotion;
    this.bootDays = daysSinceJ2000(new Date());
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 1.75));
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 6_000);

    // The Explorer's lighting recipe, kept: near-zero fill keeps night sides
    // black and terminators sharp; one zero-decay light reaches the Kuiper belt.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    this.sunLight = new THREE.PointLight(0xfff2d5, 2.2, 0, 0);
    this.scene.add(this.sunLight);
    this.scene.add(BackScene.buildStarfield(2_600));

    this.visuals = buildSystemVisuals(CELESTIAL_CATALOG, 'compressed');
    this.scene.add(this.visuals.group);
    this.sun = this.visuals.meshes.get('sun');

    // Sun Fury wear: an additive halo shell around the catalog Sun.
    const sunRadius = bodyRadiusScene(getCelestial('sun')?.radiusKm ?? 696_340, 'compressed');
    this.sunHaloMaterial = new THREE.MeshBasicMaterial({
      color: SUN_CALM.clone(),
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(sunRadius * 1.4, 32, 24),
      this.sunHaloMaterial,
    );
    this.scene.add(this.sunHalo);

    // Cinematic framing: every planetary orbit in shot, gently above the plane.
    const maxAphelionAu = Math.max(
      ...PLANET_IDS.map((id) => {
        const orbit = getCelestial(id)?.orbit;
        return orbit === undefined ? 0 : orbit.semiMajorAxisAu * (1 + orbit.eccentricity);
      }),
    );
    this.framedRadius = heliocentricRadiusScene(maxAphelionAu, 'compressed');
    // Responsive framing (D-041 follow-up): wide screens sit close enough that
    // the belt corridor and its starships read clearly; portrait keeps a
    // phone-safe pull-back. resize() re-derives it whenever the viewport moves.
    this.baseDistance = this.frameFor(this.camera.aspect);
    this.applyCameraPose();
  }

  /** Sun Fury 0..5; module off means the Sun stays calm gold. */
  setFury(fury: number, moduleOn: boolean): void {
    this.heat = moduleOn ? Math.min(Math.max(fury, 0), 5) / 5 : 0;
    const core = SUN_CALM.clone().lerp(SUN_FURIOUS, this.heat);
    const light = LIGHT_CALM.clone().lerp(LIGHT_FURIOUS, this.heat);
    const sunMaterial = this.sun?.material as THREE.MeshBasicMaterial | undefined;
    sunMaterial?.color.copy(core);
    this.sunHaloMaterial.color.copy(core);
    this.sunLight.color.copy(light);
  }

  setSeats(seats: readonly SeatVisual[], direction: 1 | -1): void {
    this.direction = direction;
    // `active` styling is applied per frame, so it is not part of the signature.
    const signature = seats.map((s) => `${s.id}:${s.color}:${s.alive ? 1 : 0}`).join('|');
    if (signature !== this.seatSignature) {
      this.seatSignature = signature;
      this.rebuildShips(seats);
    }
    this.seats = seats;
  }

  private rebuildShips(seats: readonly SeatVisual[]): void {
    for (const ship of this.ships.values()) this.disposeShip(ship);
    this.ships.clear();
    seats.forEach((seat, index) => {
      this.ships.set(seat.id, this.buildShip(seat, index, seats.length));
    });
  }

  private buildShip(seat: SeatVisual, index: number, count: number): Ship {
    const laneRadius = LANE_BASE_RADIUS + index * LANE_STEP;
    const laneY = (index % 2 === 0 ? 1 : -1) * (1 + index * 0.5);
    const color = new THREE.Color(seat.color);
    const hullColor = seat.alive ? color : color.clone().lerp(DERELICT, 0.85);

    const hullMaterial = new THREE.MeshStandardMaterial({
      color: hullColor,
      roughness: 0.55,
      metalness: 0.3,
      emissive: seat.alive ? color.clone() : new THREE.Color('#000000'),
      emissiveIntensity: seat.alive ? 0.3 : 0,
    });
    const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 2.0, 6, 14), hullMaterial);
    hull.rotation.z = -Math.PI / 2; // lie along +X, the model's forward
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.95, 12), hullMaterial);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 1.75;

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 14, 12),
      new THREE.MeshBasicMaterial({
        color: seat.alive ? color.clone() : new THREE.Color('#000000'),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.position.x = -1.45;

    // Active captain: a gold ring flat in the orbital plane, orbit-line style.
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.07, 8, 48),
      new THREE.MeshBasicMaterial({ color: ACTIVE_GOLD, transparent: true, opacity: 0.8 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.visible = false;

    const group = new THREE.Group();
    group.add(hull, nose, glow, ring);
    this.scene.add(group);

    // Lane line — the Explorer's orbit-line recipe, faction-tinted.
    const points: THREE.Vector3[] = [];
    for (let k = 0; k < 128; k++) {
      const a = (k / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * laneRadius, laneY, Math.sin(a) * laneRadius));
    }
    const lane = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity: seat.alive ? 0.3 : 0.1,
      }),
    );
    lane.frustumCulled = false;
    this.scene.add(lane);

    return {
      group,
      glow,
      ring,
      lane,
      color,
      laneRadius,
      laneY,
      phase: index * 1.7,
      angle: (index / Math.max(count, 1)) * Math.PI * 2 + 0.65,
    };
  }

  private disposeShip(ship: Ship): void {
    this.scene.remove(ship.group, ship.lane);
    ship.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      (mesh.material as THREE.Material | undefined)?.dispose();
    });
    ship.lane.geometry.dispose();
    (ship.lane.material as THREE.Material).dispose();
  }

  /** The Sun erupts: shock ring, particle burst, and a lighting spike. */
  solarFlare(): void {
    if (this.reduced) return;
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8a4a,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(7, 8.1, 96), ringMaterial);
    ring.rotation.x = -Math.PI / 2;

    const rng = mulberry32(Math.floor(Math.random() * 0xffffffff));
    const count = 150;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rng() * 2 - 1;
      const a = rng() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const dx = s * Math.cos(a);
      const dy = u * 0.35;
      const dz = s * Math.sin(a);
      const speed = 24 + rng() * 16;
      positions[i * 3] = dx * 8.0;
      positions[i * 3 + 1] = dy * 8.0;
      positions[i * 3 + 2] = dz * 8.0;
      velocities[i * 3] = dx * speed;
      velocities[i * 3 + 1] = dy * speed;
      velocities[i * 3 + 2] = dz * speed;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const burstMaterial = new THREE.PointsMaterial({
      color: 0xffb36b,
      size: 2.2,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const burst = new THREE.Points(geometry, burstMaterial);
    this.scene.add(ring, burst);
    this.flareGlow = 8;

    let life = 0;
    this.effects.push({
      update: (dt) => {
        life += dt;
        const k = life / 1.8;
        ring.scale.setScalar(1 + k * 22);
        ringMaterial.opacity = Math.max(0, 0.9 * (1 - k));
        for (let i = 0; i < count; i++) {
          positions[i * 3] += velocities[i * 3] * dt;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
        }
        (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
        burstMaterial.opacity = Math.max(0, 0.9 * (1 - k));
        return life < 1.8;
      },
      dispose: () => {
        this.scene.remove(ring, burst);
        ring.geometry.dispose();
        ringMaterial.dispose();
        geometry.dispose();
        burstMaterial.dispose();
      },
    });
  }

  /** A glowing comet arcs from one captain's ship to another's. */
  streak(fromSeat: number, toSeat: number): void {
    if (this.reduced) return;
    const from = this.ships.get(fromSeat);
    const to = this.ships.get(toSeat);
    if (from === undefined || to === undefined) return;
    const start = from.group.position.clone();
    const end = to.group.position.clone();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 22; // the raid arcs high over the orbital plane
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const color = from.color;

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    const lineMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.geometry.setDrawRange(0, 0);
    line.frustumCulled = false;
    const cometMaterial = new THREE.MeshBasicMaterial({
      color: color.clone(),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const comet = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), cometMaterial);
    this.scene.add(line, comet);

    const ease = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    let traveled = 0;
    let fading = 0;
    let flashed = false;
    this.effects.push({
      update: (dt) => {
        if (traveled < 1) {
          traveled = Math.min(1, traveled + dt / 0.95);
          const p = ease(traveled);
          comet.position.copy(curve.getPoint(p));
          lineGeometry.setDrawRange(0, Math.floor(p * 64));
          return true;
        }
        if (!flashed) {
          flashed = true;
          comet.visible = false;
          this.arrivalFlash(end, color);
        }
        fading += dt;
        const k = fading / 0.4;
        lineMaterial.opacity = Math.max(0, 0.75 * (1 - k));
        return k < 1;
      },
      dispose: () => {
        this.scene.remove(line, comet);
        lineGeometry.dispose();
        lineMaterial.dispose();
        comet.geometry.dispose();
        cometMaterial.dispose();
      },
    });
  }

  private arrivalFlash(at: THREE.Vector3, color: THREE.Color): void {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flash = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.85, 48), material);
    flash.rotation.x = -Math.PI / 2;
    flash.position.copy(at);
    this.scene.add(flash);
    let life = 0;
    this.effects.push({
      update: (dt) => {
        life += dt;
        const k = life / 0.5;
        flash.scale.setScalar(1 + k * 4);
        material.opacity = Math.max(0, 0.85 * (1 - k));
        return k < 1;
      },
      dispose: () => {
        this.scene.remove(flash);
        flash.geometry.dispose();
        material.dispose();
      },
    });
  }

  /** A captain contained a rupture: a shield ring pulses around their ship. */
  shieldPulse(seat: number): void {
    if (this.reduced) return;
    const ship = this.ships.get(seat);
    if (ship === undefined) return;
    const material = new THREE.MeshBasicMaterial({
      color: ship.color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pulse = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.45, 48), material);
    pulse.rotation.x = -Math.PI / 2;
    pulse.position.copy(ship.group.position);
    this.scene.add(pulse);
    let life = 0;
    this.effects.push({
      update: (dt) => {
        life += dt;
        const k = life / 0.65;
        pulse.scale.setScalar(1 + k * 2.5);
        material.opacity = Math.max(0, 0.85 * (1 - k));
        return k < 1;
      },
      dispose: () => {
        this.scene.remove(pulse);
        pulse.geometry.dispose();
        material.dispose();
      },
    });
  }

  /** A short halo spike: a fury step rising. */
  sunFlash(): void {
    if (this.reduced) return;
    this.haloFlash = 0.45;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  resize(): void {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.baseDistance = this.frameFor(this.camera.aspect); // framing follows the viewport
    this.applyCameraPose();
  }

  dispose(): void {
    this.stop();
    for (const effect of this.effects.splice(0)) effect.dispose();
    this.rebuildShips([]);
    disposeVisuals(this.visuals);
    this.sunHalo.geometry.dispose();
    this.sunHaloMaterial.dispose();
    this.renderer.dispose();
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    if (!this.reduced) this.elapsed += dt;

    // Planets, moons and comets ride their real Kepler orbits.
    const positions = heliocentricScenePositions(
      this.bootDays + this.elapsed * DAYS_PER_SECOND,
      'compressed',
    );
    for (const [id, mesh] of this.visuals.meshes) {
      const p = positions.get(id);
      if (p !== undefined) mesh.position.set(p.x, p.y, p.z);
    }

    this.updateSun(dt);
    this.updateShips(dt);
    this.updateEffects(dt);
    if (!this.reduced) this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private updateSun(dt: number): void {
    const t = this.elapsed;
    const pulse = this.reduced ? 0 : 1;
    this.flareGlow = Math.max(0, this.flareGlow - dt * 4.5);
    this.haloFlash = Math.max(0, this.haloFlash - dt * 0.9);
    if (this.sun !== undefined && !this.reduced) this.sun.rotation.y += 0.05 * dt;
    const wobble = (0.012 + 0.03 * this.heat) * Math.sin(t * (1 + this.heat * 1.6));
    this.sun?.scale.setScalar(1 + wobble * pulse);
    this.sunHalo.scale.setScalar(1 + 0.07 * Math.sin(t * (0.9 + this.heat)) * pulse);
    this.sunHaloMaterial.opacity =
      0.1 + 0.12 * this.heat + (0.04 + 0.03 * this.heat) * Math.sin(t * 1.1) * pulse + this.haloFlash;
    this.sunLight.intensity = 2.2 + 0.7 * this.heat + this.flareGlow;
  }

  private updateShips(dt: number): void {
    const omega = (Math.PI * 2) / SHIP_LAP_SECONDS;
    for (const seat of this.seats) {
      const ship = this.ships.get(seat.id);
      if (ship === undefined) continue;
      if (!this.reduced && seat.alive) ship.angle += this.direction * omega * dt;
      const a = ship.angle;
      const bob = !this.reduced && seat.alive ? Math.sin(this.elapsed * 0.9 + ship.phase) * 0.25 : 0;
      ship.group.position.set(
        Math.cos(a) * ship.laneRadius,
        ship.laneY + bob,
        -Math.sin(a) * ship.laneRadius,
      );
      // Model forward is +X; face the direction of travel (planets are prograde).
      const vx = this.direction * -Math.sin(a);
      const vz = this.direction * -Math.cos(a);
      ship.group.rotation.y = Math.atan2(-vz, vx);
      if (!this.reduced && !seat.alive) ship.group.rotation.z += 0.35 * dt; // derelict tumble

      const active = seat.active && seat.alive;
      ship.ring.visible = active;
      if (active) {
        (ship.ring.material as THREE.MeshBasicMaterial).opacity =
          0.55 + 0.3 * Math.sin(this.elapsed * 3.5);
      }
      ship.glow.visible = seat.alive;
      if (seat.alive) {
        const glowMaterial = ship.glow.material as THREE.MeshBasicMaterial;
        ship.glow.scale.setScalar(active ? 1.2 + 0.25 * Math.sin(this.elapsed * 6) : 1);
        glowMaterial.opacity = active ? 0.95 : 0.7;
      }
    }
  }

  private updateEffects(dt: number): void {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i]!;
      if (!effect.update(dt)) {
        effect.dispose();
        this.effects.splice(i, 1);
      }
    }
  }

  private updateCamera(dt: number): void {
    this.theta += CAMERA_DRIFT * dt;
    this.applyCameraPose();
  }

  /**
   * Whole-system framing that honors the viewport: a tilted orbital disc needs
   * less vertical reach than a face-on ring (the 0.68 factor), landscape screens
   * are bound by the horizontal fit, and portrait keeps a phone-safe pull-back
   * (aspect floored at 0.55 so the term never explodes). 280 u is the closest
   * any viewport may sit — the belt corridor never leaves the frame.
   */
  private frameFor(aspect: number): number {
    const halfFov = (this.camera.fov * Math.PI) / 360;
    const vertical = (this.framedRadius * 0.68) / Math.tan(halfFov);
    const horizontal = this.framedRadius / (Math.tan(halfFov) * Math.max(aspect, 0.55));
    return Math.max(vertical, horizontal, 280);
  }

  private applyCameraPose(): void {
    const phi = 1.02 + (this.reduced ? 0 : 0.07 * Math.sin(this.elapsed * 0.05));
    const distance = this.baseDistance * (1 + (this.reduced ? 0 : 0.03 * Math.sin(this.elapsed * 0.037)));
    this.camera.position.set(
      distance * Math.sin(phi) * Math.cos(this.theta),
      distance * Math.cos(phi),
      distance * Math.sin(phi) * Math.sin(this.theta),
    );
    this.camera.lookAt(0, 0, 0);
  }

  private static buildStarfield(count: number): THREE.Points {
    const rng = mulberry32(hashString('last-orbit-starfield'));
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rng() * 2 - 1;
      const angle = rng() * Math.PI * 2;
      const r = 2_600;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = r * s * Math.cos(angle);
      positions[i * 3 + 1] = r * u;
      positions[i * 3 + 2] = r * s * Math.sin(angle);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xcdd7ff,
        size: 1.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
      }),
    );
  }
}
