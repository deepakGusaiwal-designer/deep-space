import * as THREE from 'three';

/**
 * The voyage through deep space.
 *
 * Every celestial body lives at a fixed point in world space along a corridor
 * that recedes down −Z. Scroll progress (0 → 1) flies the camera past them in
 * the order the brief demands:
 *
 *   Earth → Mars → Asteroid Belt → Saturn → Nebula → Black Hole → Wormhole
 *
 * In the very first frame (hero) the camera sits back far enough that all of
 * them compose a single tableau — Earth upper-left, Mars centre, Saturn
 * lower-left, the black hole massive upper-right, the wormhole lower-right,
 * the belt slashing diagonally between them.
 */

/** Fixed world-space anchors — imported by every scene component. */
export const WORLDS = {
  earth:     new THREE.Vector3(-8.5, 4.6, -20),
  mars:      new THREE.Vector3(1.6, -0.4, -46),
  beltZ:     -70,                                   // centre of the asteroid belt
  saturn:    new THREE.Vector3(-13, -5.4, -101),
  nebula:    new THREE.Vector3(6, 3, -136),
  blackHole: new THREE.Vector3(14, 7.6, -165),
  wormhole:  new THREE.Vector3(9, -6, -205),
} as const;

export interface PathKey {
  p: number;
  x: number;
  y: number;
  z: number;
  /** field of view — widening = the feeling of acceleration */
  fov: number;
}

/** Catmull-Rom control points; the camera drifts between them with momentum. */
export const PATH: PathKey[] = [
  { p: 0.0,  x: 0,     y: 1.2,  z: 16,   fov: 52 }, // hero — the whole tableau
  { p: 0.07, x: -1,    y: 1.6,  z: 8,    fov: 52 }, // slow drift inward
  { p: 0.15, x: -6,    y: 3.6,  z: -6,   fov: 54 }, // rise toward Earth (upper-left)
  { p: 0.24, x: -2,    y: 1.0,  z: -30,  fov: 55 }, // past Earth, aim for Mars
  { p: 0.33, x: 1.5,   y: 0.1,  z: -50,  fov: 56 }, // reach Mars (centre)
  { p: 0.43, x: 0.5,   y: 0.6,  z: -66,  fov: 58 }, // enter the asteroid belt
  { p: 0.52, x: -6,    y: -2,   z: -86,  fov: 58 }, // thread the belt, bank left
  { p: 0.60, x: -10,   y: -4,   z: -104, fov: 56 }, // Saturn flyby (lower-left)
  { p: 0.68, x: -3,    y: 0,    z: -126, fov: 56 }, // climb into the nebula
  { p: 0.76, x: 5,     y: 3.5,  z: -145, fov: 60 }, // drift through nebula
  { p: 0.85, x: 11,    y: 6,    z: -165, fov: 64 }, // skim the black hole (lensing)
  { p: 0.93, x: 9,     y: -3,   z: -190, fov: 72 }, // bank down toward the wormhole
  { p: 1.0,  x: 9,     y: -6,   z: -206, fov: 88 }, // plunge into the throat
];

function findSegment(p: number): number {
  for (let i = PATH.length - 2; i >= 0; i--) {
    if (p >= PATH[i].p) return i;
  }
  return 0;
}

function catmull(v0: number, v1: number, v2: number, v3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * v1 +
      (-v0 + v2) * t +
      (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
      (-v0 + 3 * v1 - 3 * v2 + v3) * t3)
  );
}

export function samplePath(p: number): { x: number; y: number; z: number; fov: number } {
  const clamped = Math.min(1, Math.max(0, p));
  const i = findSegment(clamped);
  const k0 = PATH[Math.max(0, i - 1)];
  const k1 = PATH[i];
  const k2 = PATH[Math.min(PATH.length - 1, i + 1)];
  const k3 = PATH[Math.min(PATH.length - 1, i + 2)];
  const span = Math.max(1e-6, k2.p - k1.p);
  const t = (clamped - k1.p) / span;
  return {
    x: catmull(k0.x, k1.x, k2.x, k3.x, t),
    y: catmull(k0.y, k1.y, k2.y, k3.y, t),
    z: catmull(k0.z, k1.z, k2.z, k3.z, t),
    fov: catmull(k0.fov, k1.fov, k2.fov, k3.fov, t),
  };
}

/** 0 → 1 how deep into the final rush toward / into the wormhole we are */
export function warpAmount(p: number): number {
  return smoothstep(0.9, 1.0, p);
}

/** How strongly the camera is caught in the black hole's neighbourhood (0..1). */
export function holeProximity(p: number): number {
  return smoothstep(0.78, 0.86, p) * (1 - smoothstep(0.88, 0.95, p));
}

export function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent damping. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
