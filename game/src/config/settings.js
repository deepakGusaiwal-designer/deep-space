/**
 * MONUMENT — global tuning constants.
 * One place for every gameplay / rendering magic number.
 */
export const SETTINGS = {
  renderer: {
    maxPixelRatio: 2,          // capped for 4K stability
    shadowMapSize: 2048,
    bloom: { strength: 0.55, radius: 0.75, threshold: 0.82 },
    adaptive: {                // dynamic-resolution guard rails
      targetFPS: 58,
      minScale: 0.65,
      maxScale: 1.0,
    },
  },

  physics: {
    gravity: 34,
    killPlaneY: -24,
    maxDelta: 1 / 30,          // clamp dt on tab-switch spikes
  },

  player: {
    radius: 0.55,
    accel: 46,
    airControl: 0.35,
    maxSpeed: 8.5,
    sprintSpeed: 13.5,
    groundFriction: 7.5,
    airDrag: 0.35,
    jumpVelocity: 13.2,
    coyoteTime: 0.12,          // grace window after leaving a ledge
    jumpBuffer: 0.12,          // grace window for early jump presses
  },

  camera: {
    fov: 55,
    sprintFov: 63,
    distance: 8.2,
    height: 3.1,
    minPitch: -0.18,
    maxPitch: 1.15,
    followLerp: 9,             // positional smoothing rate
    lookAhead: 1.6,            // meters of velocity-based lead
    zoomBySpeed: 1.8,          // extra distance at full sprint
    collisionRadius: 0.35,
    sensitivity: 0.0024,
  },

  fx: {
    landDustMin: 4,            // fall speed that triggers dust
    ambientMotes: 260,
  },
};
