/**
 * MONUMENT — global tuning constants.
 * One place for every gameplay / rendering magic number.
 */
export const SETTINGS = {
  renderer: {
    maxPixelRatio: 1.25,       // capped for smooth 60 FPS on integrated GPUs
    shadowMapSize: 1024,       // lightweight soft shadows
    bloom: { strength: 0.45, radius: 0.7, threshold: 0.85 },
    adaptive: {                // dynamic-resolution guard rails
      targetFPS: 56,
      minScale: 0.6,
      maxScale: 1.0,
    },
  },

  physics: {
    gravity: 0,                // Pure Zero-G space physics for open-world exploration
    killPlaneY: -99999,        // Boundless open space in all directions
    maxDelta: 1 / 30,          // clamp dt on tab-switch spikes
  },

  player: {
    radius: 0.55,
    accel: 52,
    airControl: 1.0,           // full omni-directional control in zero-g
    maxSpeed: 16.0,            // agile EVA flight speed
    sprintSpeed: 28.0,
    groundFriction: 6.5,
    airDrag: 0.15,
    jumpVelocity: 14.8,
    coyoteTime: 0.15,
    jumpBuffer: 0.15,
    restitution: 0.2,
    bounceMin: 12,
  },

  jetpack: {
    upThrust: 45,              // vertical lift acceleration
    forwardThrust: 48,         // 3D directional acceleration
    maxFlightSpeed: 28,        // fluid flight speed (100 km/h)
    maxBoostSpeed: 65,         // turbo boost speed (235 km/h)
    speedOfLight: 185,         // hyperdrive warp speed (665 km/h)
    flightDrag: 1.1,           // smooth zero-g momentum drift
    gravityCancel: 1.0,        // full zero-g compensation
    drainRate: 0,              // continuous full fuel
    rechargeRate: 80,          // instant recovery
    normalColor: 0xff6600,     // warm orange flame for normal jetpack
    boostColor: 0x00e5ff,      // electric cyan hyper-plasma flame
    warpColor: 0xffffff,       // brilliant white photon core
  },

  openWorld: {
    sectorSize: 150,           // 3D cube sector size (meters)
    activeRadius: 2,           // active sectors in each direction
    spaceshipsPerSector: 2,    // moving spaceships cruising the gaps
    relicDistance: 60,
  },

  camera: {
    fov: 55,
    sprintFov: 70,
    flightFov: 78,
    warpFov: 104,              // dramatic hyperdrive FOV stretch during speed of light
    distance: 12.0,            // comfortably further back from astronaut
    height: 3.4,               // elevated third-person perspective
    minPitch: -0.85,           // expanded pitch range for looking high up in flight
    maxPitch: 1.35,            // expanded pitch range for looking down from orbit
    followLerp: 9,             // positional smoothing rate
    lookAhead: 1.8,            // meters of velocity-based lead
    zoomBySpeed: 3.2,          // extra distance at full flight boost
    collisionRadius: 0.4,
    sensitivity: 0.0035,
  },

  fx: {
    landDustMin: 4,            // fall speed that triggers dust
    ambientMotes: 300,
  },
};
