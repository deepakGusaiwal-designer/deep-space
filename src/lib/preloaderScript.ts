/**
 * The score for the opening sequence — one clock, shared by the DOM titles
 * and the 3D scene so the two can never drift apart.
 *
 * A single GSAP tween drives `stage.t` from 0 to DURATION in real seconds;
 * every component reads `stage.t` inside its own frame loop. Skipping is just
 * a timeScale change on that one tween.
 */

export const DURATION = 8.0;

/** Scene boundaries, in seconds. */
export const T = {
  /** the singularity hangs alone in the dark */
  beforeTime: 0.0,
  /** it draws inward on itself */
  collapse: 1.2,
  /** and detonates */
  bang: 1.45,
  /** expansion slows; stars and galaxies condense */
  universe: 2.8,
  /** a black hole gathers ahead */
  hole: 5.0,
  /** the throat opens */
  wormhole: 6.5,
  /** white-out, and the site is behind it */
  flash: 7.55,
  end: 8.0,
} as const;

/** Where the hole sits, and so where the whole descent is aimed. */
export const HOLE_Z = -34;

/**
 * The clock. Mutated by the timeline, read by the scene. A module-level
 * object rather than store state on purpose: this ticks every frame, and
 * pushing it through React would re-render the tree 60 times a second.
 */
export const stage = { t: 0 };

/** Reset between mounts — the module object outlives StrictMode's double-invoke. */
export function resetStage(): void {
  stage.t = 0;
}
