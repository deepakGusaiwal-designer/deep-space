/**
 * The score for the opening sequence — one clock, shared by the DOM titles
 * and the 3D scene so the two can never drift apart.
 *
 * A single GSAP tween drives `stage.t` from 0 to DURATION in real seconds;
 * every component reads `stage.t` inside its own frame loop. Skipping is just
 * a timeScale change on that one tween.
 */

export const DURATION = 12.0;

/** Scene boundaries, in seconds. */
export const T = {
  /** 01 · the singularity hangs alone in the dark */
  beforeTime: 0.0,
  /** it abruptly draws inward on itself */
  collapse: 1.4,
  /** 02 · and detonates. The camera is kicked at this exact beat. An
   * explosion that is over before the eye has resolved it reads as a
   * single white frame, so the fireball keeps a generous stretch. */
  bang: 1.55,
  /** 03 · expansion slows; stars condense, galaxies turn, a world sweeps past */
  universe: 4.6,
  /** 04 · a black hole gathers ahead — the longest act: the hole is the
   * whole site's premise, so it gets time to be actually looked at */
  hole: 6.8,
  /** 05 · the horizon opens into a throat and we commit */
  wormhole: 10.2,
  /** white-out — it bleeds off into black, and the welcome sits on that */
  flash: 10.8,
  end: 12.0,
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
