/**
 * Small math helpers shared across modules.
 */
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Frame-rate independent exponential smoothing.
 * Returns the interpolation factor for `lerp(current, target, k)`.
 */
export const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

/** Shortest-arc angle interpolation (radians). */
export function dampAngle(current, target, rate, dt) {
  let delta = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * damp(rate, dt);
}

/** Deterministic pseudo-random from an integer seed (levels stay identical every run). */
export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}
