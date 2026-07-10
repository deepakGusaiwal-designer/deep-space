/**
 * The camera's flight path through the black hole.
 *
 * Keyed on global scroll progress (0 → 1). Catmull-Rom interpolated so the
 * flight has momentum — it drifts at the event horizon, decelerates through
 * the time-distortion interlude, then accelerates into the golden exit hole.
 */

export interface PathKey {
  p: number;
  x: number;
  y: number;
  z: number;
  /** field of view — widening fov = warp feeling */
  fov: number;
}

export const PATH: PathKey[] = [
  { p: 0.0,  x: 0,    y: 0.4,  z: 15,   fov: 52 }, // outside the event horizon
  { p: 0.1,  x: 0,    y: 0.3,  z: 11,   fov: 52 }, // hero hold — slow drift in
  { p: 0.18, x: 2.4,  y: 0.4,  z: 2,    fov: 55 }, // slip past the disk
  { p: 0.26, x: 4.2,  y: 0.2,  z: -16,  fov: 56 }, // station I  (Linkites)
  { p: 0.34, x: -4.0, y: -0.3, z: -30,  fov: 56 }, // station II (Videoverse)
  { p: 0.42, x: 3.6,  y: 0.4,  z: -44,  fov: 56 }, // station III (Exactink)
  { p: 0.5,  x: -3.2, y: -0.2, z: -58,  fov: 56 }, // station IV (CCW)
  { p: 0.56, x: 0,    y: 0,    z: -66,  fov: 50 }, // ── time dilation: near-stop
  { p: 0.62, x: 0,    y: 0,    z: -70,  fov: 48 }, // "From DESIGN to Code"
  { p: 0.72, x: 0,    y: 0.2,  z: -84,  fov: 40 }, // gliding through the skill field
  { p: 0.85, x: 0,    y: 0,    z: -116, fov: 70 }, // testimonial orbit
  { p: 0.92, x: 0,    y: 0,    z: -152, fov: 74 }, // final acceleration toward the exit hole
  { p: 1,  x: 0,    y: 0,   z: -236, fov: 88 }, // through the singularity
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

/** 0 → 1 how deep into the final rush we are */
export function warpAmount(p: number): number {
  return smoothstep(0.86, 0.98, p);
}

/**
 * 0 → 1 the final act: the exit black hole wins. Stars, dust, nebulae and
 * worlds all spiral into it as the visitor crosses the second horizon.
 */
export function swallowAmount(p: number): number {
  return smoothstep(0.84, 0.985, p);
}

/** 0 → 1 how strongly time dilates in the middle of the journey */
export function dilationAmount(p: number): number {
  return smoothstep(0.5, 0.56, p) * (1 - smoothstep(0.62, 0.7, p));
}

/**
 * 0 → 1 → 0 the crossing of the first event horizon.
 *
 * Deliberately held back until p ≈ 0.17, where BlackHole's entrance fade
 * (0.16 → 0.26) has begun to let go: the veil takes the hole's light over
 * from it rather than glowing on top of a hole you can still plainly see.
 * Peaks at p ≈ 0.235, just past HOLE_CENTER.
 */
export function horizonAmount(p: number): number {
  return smoothstep(0.17, 0.235, p) * (1 - smoothstep(0.245, 0.31, p));
}

/**
 * 0 → 1 monotonic depth through that same crossing. The envelope above
 * comes back down; this does not — the photon ring has to expand past the
 * viewer exactly once and never rewind.
 */
export function horizonDepth(p: number): number {
  return smoothstep(0.17, 0.35, p);
}

export function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent damping */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
