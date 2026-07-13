/**
 * Level definitions — pure data consumed by World.
 *
 * Design language: floating modern architecture. Tuning numbers assume
 * jumpVelocity 13.2 / gravity 34 → max jump height ≈ 2.5 m,
 * walk jump range ≈ 6.5 m, sprint jump range ≈ 10 m.
 */
export const LEVELS = [
  /* ================================================================ */
  /* LEVEL 1 — ATRIUM: movement, jumping, pads, gates, checkpoints    */
  /* ================================================================ */
  {
    name: 'Atrium',
    accent: 0xffc36b,
    palette: { top: 0x14110c, horizon: 0x8a5a24, fog: 0x080605, sunColor: 0xffc07a, sunIntensity: 3.0 },
    spawn: [0, 1.5, 0],
    objects: [
      { type: 'skyline', seed: 11, radius: 80, count: 60 },
      // spawn plaza
      { type: 'platform', pos: [0, -0.5, 0], size: [10, 1, 10], mat: 'concrete', skirtDepth: 8 },
      { type: 'pillar', pos: [4.2, 2, 4.2], size: [0.7, 5, 0.7], mat: 'marble', solid: true },
      { type: 'pillar', pos: [-4.2, 2, 4.2], size: [0.7, 5, 0.7], mat: 'marble', solid: true },
      { type: 'pillar', pos: [0, 4.75, 4.2], size: [9.2, 0.5, 0.7], mat: 'marble' },

      // walkway with a small hop
      { type: 'platform', pos: [0, -0.5, -10], size: [4, 1, 8], mat: 'concrete' },
      { type: 'platform', pos: [0, -0.5, -19.5], size: [4, 1, 5], mat: 'marble' },

      // ramp up to the terrace
      { type: 'ramp', pos: [0, 0.5, -27], size: [4, 1, 7.3], rot: [0.29, 0, 0], mat: 'concrete' },
      { type: 'platform', pos: [0, 1.5, -34], size: [6, 1, 6], mat: 'concrete' },

      // puzzle: pad opens the energy gate
      { type: 'pad', pos: [1.8, 2.08, -34], targets: ['g1'] },
      { type: 'gate', pos: [0, 3.75, -37.2], size: [4, 3.5], id: 'g1' },
      { type: 'platform', pos: [0, 1.5, -41.5], size: [4, 1, 8], mat: 'concrete' },
      { type: 'checkpoint', pos: [0, 2.07, -40] },

      // first moving platform
      { type: 'slider', pos: [3, 1.5, -49], to: [-3, 1.5, -49], size: [3.5, 1, 3.5], duration: 2.6, mat: 'metal' },

      // wormhole terrace → warp to the summit
      { type: 'platform', pos: [0, 1.5, -56.5], size: [8, 1, 8], mat: 'marble', skirtDepth: 9 },
      { type: 'checkpoint', pos: [2.2, 2.07, -55] },
      { type: 'wormhole', a: [0, 3.7, -57.5], b: [14, 9.7, -68.8] },

      // summit with the exit portal
      { type: 'platform', pos: [14, 7.5, -72], size: [8, 1, 8], mat: 'marble', skirtDepth: 14 },
      { type: 'portal', pos: [14, 10.0, -74.5] },

      // scenery
      { type: 'blackhole', pos: [-38, 16, -88], scale: 4, spin: 0.6 },
      { type: 'decor', pos: [8, 4, -20], size: [3, 0.3, 2], mat: 'glass' },
      { type: 'decor', pos: [-7, 5.5, -34], size: [2.5, 0.3, 2.5], mat: 'glass' },
      { type: 'decor', pos: [6.5, 6, -50], size: [3, 0.4, 2], mat: 'glass' },
      { type: 'decor', pos: [-9, 2.5, -13], size: [1.2, 7, 1.2], mat: 'basalt', drift: 0.4 },
      { type: 'decor', pos: [10, 3, -44], size: [1, 5.5, 1], mat: 'basalt', drift: 0.5 },
    ],
  },

  /* ================================================================ */
  /* LEVEL 2 — SUSPENSION: rotators, elevators, moving bridges        */
  /* ================================================================ */
  {
    name: 'Suspension',
    accent: 0xffb055,
    palette: { top: 0x181008, horizon: 0x94501f, fog: 0x0a0604, sunColor: 0xffab55, sunIntensity: 3.0 },
    spawn: [0, 1.5, 0],
    objects: [
      { type: 'skyline', seed: 23, radius: 90, count: 64, center: [35, 0, 0] },
      { type: 'platform', pos: [0, -0.5, 0], size: [8, 1, 8], mat: 'concrete', skirtDepth: 8 },

      // rotating beam — time the hop
      { type: 'rotator', pos: [10, -0.5, 0], size: [7, 1, 2.5], axis: 'y', duration: 5, mat: 'metal' },
      { type: 'platform', pos: [17.5, -0.5, 0], size: [4, 1, 4], mat: 'marble' },
      { type: 'checkpoint', pos: [17.5, 0.07, 0] },

      // free-running elevator up to the high line
      { type: 'elevator', pos: [23.5, -0.5, 0], to: [23.5, 4.5, 0], size: [3.5, 1, 3.5], duration: 3, repeatDelay: 0.8, mat: 'metal' },
      { type: 'platform', pos: [29.5, 4.5, 0], size: [5, 1, 5], mat: 'concrete', skirtDepth: 11 },

      // moving bridge across the void
      { type: 'slider', pos: [36, 4.5, -4], to: [36, 4.5, 4], size: [3, 1, 3], duration: 2.4, mat: 'metal' },
      { type: 'platform', pos: [42, 4.5, 0], size: [4, 1, 4], mat: 'marble', skirtDepth: 11 },
      { type: 'checkpoint', pos: [42, 5.07, 0] },

      // side detour: the pad lives on a ledge off the main line
      { type: 'platform', pos: [42, 4.5, 7], size: [3, 1, 3], mat: 'concrete', skirtDepth: 11 },
      { type: 'pad', pos: [42, 5.08, 7], targets: ['g2'] },
      { type: 'gate', pos: [46.5, 6.75, 0], size: [3.5, 3.5], yaw: Math.PI / 2, id: 'g2' },
      { type: 'platform', pos: [49.5, 4.5, 0], size: [7, 1, 3], mat: 'metal' },

      // precision hops — under the drag of a live black hole
      { type: 'platform', pos: [56, 4.5, 0], size: [2, 1, 2], mat: 'marble' },
      { type: 'platform', pos: [59.5, 4.5, 2.5], size: [2, 1, 2], mat: 'marble' },
      { type: 'platform', pos: [63, 4.5, 0], size: [2, 1, 2], mat: 'marble' },
      { type: 'blackhole', pos: [59.5, 8, -9.5], scale: 1.5, pull: true, radius: 10.5, strength: 26 },

      // exit
      { type: 'platform', pos: [69, 4.5, 0], size: [8, 1, 8], mat: 'marble', skirtDepth: 12 },
      { type: 'portal', pos: [69, 6.9, 0], yaw: Math.PI / 2 },

      // scenery
      { type: 'blackhole', pos: [30, 28, -75], scale: 5, spin: 0.5, color: 0xffa050 },
      { type: 'decor', pos: [12, 4, 8], size: [3.2, 0.3, 2], mat: 'glass' },
      { type: 'decor', pos: [30, 9, -7], size: [2.6, 0.3, 2.6], mat: 'glass' },
      { type: 'decor', pos: [52, 9.5, 6], size: [3, 0.4, 2], mat: 'glass' },
      { type: 'decor', pos: [24, 2, -9], size: [1.2, 8, 1.2], mat: 'basalt', drift: 0.4 },
      { type: 'decor', pos: [60, 6, -8], size: [1, 6, 1], mat: 'basalt', drift: 0.5 },
      { type: 'decor', pos: [8, 7, -10], size: [1.4, 9, 1.4], mat: 'basalt', drift: 0.3 },
    ],
  },

  /* ================================================================ */
  /* LEVEL 3 — METRONOME: timing gauntlet                             */
  /* ================================================================ */
  {
    name: 'Metronome',
    accent: 0xffc36b,
    palette: { top: 0x0f1319, horizon: 0x4a5668, fog: 0x07080b, sunColor: 0xcfd9ec, sunIntensity: 2.6 },
    spawn: [0, 1.5, 0],
    objects: [
      { type: 'skyline', seed: 37, radius: 85, count: 60, center: [0, 0, -40] },
      { type: 'platform', pos: [0, -0.5, 0], size: [8, 1, 8], mat: 'concrete', skirtDepth: 8 },

      // corridor with counter-sliding walls
      { type: 'platform', pos: [0, -0.5, -14], size: [6, 1, 18], mat: 'concrete', skirtDepth: 10 },
      { type: 'slider', pos: [-1.6, 1.5, -10], to: [1.6, 1.5, -10], size: [2.8, 3, 0.8], duration: 1.7, mat: 'metal' },
      { type: 'slider', pos: [1.6, 1.5, -17], to: [-1.6, 1.5, -17], size: [2.8, 3, 0.8], duration: 1.7, delay: 0.85, mat: 'metal' },
      { type: 'checkpoint', pos: [0, 0.07, -21.5] },

      // laser tripwires — jump them
      { type: 'laser', from: [-3.2, 0.6, -6.8], to: [3.2, 0.6, -6.8] },
      { type: 'laser', from: [-3.7, 0.6, -25.2], to: [3.7, 0.6, -25.2] },

      // sweeping bar — jump over it
      { type: 'platform', pos: [0, -0.5, -28], size: [7, 1, 7], mat: 'marble' },
      { type: 'rotator', pos: [0, 0.9, -28], size: [7.5, 0.7, 0.7], axis: 'y', duration: 3.4, mat: 'metal' },

      // sprint gap (~7 m — hold shift)
      { type: 'platform', pos: [0, -0.5, -41.5], size: [6, 1, 6], mat: 'concrete', skirtDepth: 10 },
      { type: 'checkpoint', pos: [0, 0.07, -41.5] },
      { type: 'laser', from: [-3.1, 0.75, -44.2], to: [3.1, 0.75, -44.2] },

      // pendulum bridge
      { type: 'platform', pos: [0, -0.5, -52], size: [3, 1, 14], mat: 'metal', skirt: false },
      { type: 'pendulum', pos: [0, 4.6, -49], length: 4, swing: 0.85, duration: 1.5, mat: 'chrome' },
      { type: 'pendulum', pos: [0, 4.6, -55], length: 4, swing: 0.85, duration: 1.5, delay: 0.75, mat: 'chrome' },

      // rest stop + the lift pad
      { type: 'platform', pos: [0, -0.5, -62], size: [5, 1, 5], mat: 'concrete', skirtDepth: 10 },
      { type: 'checkpoint', pos: [-1.2, 0.07, -62] },
      { type: 'pad', pos: [1.3, 0.08, -62], targets: ['lift'] },
      { type: 'elevator', pos: [0, -0.5, -69.5], to: [0, 7.5, -69.5], size: [3.5, 1, 3.5], duration: 3.5, repeatDelay: 1, triggerId: 'lift', mat: 'metal' },

      // summit
      { type: 'platform', pos: [0, 7.5, -76.5], size: [8, 1, 8], mat: 'marble', skirtDepth: 16 },
      { type: 'portal', pos: [0, 9.9, -77.5] },

      // scenery — a giant sleeping monster on the horizon
      { type: 'blackhole', pos: [-30, 24, -100], scale: 7, spin: 0.4, color: 0x9db4d9 },
      { type: 'decor', pos: [7, 3, -18], size: [3, 0.3, 2], mat: 'glass' },
      { type: 'decor', pos: [-7.5, 5, -34], size: [2.6, 0.3, 2.6], mat: 'glass' },
      { type: 'decor', pos: [6, 8, -60], size: [3, 0.4, 2], mat: 'glass' },
      { type: 'decor', pos: [-8, 4, -50], size: [1.2, 9, 1.2], mat: 'basalt', drift: 0.4 },
      { type: 'decor', pos: [9, 10, -74], size: [1.3, 7, 1.3], mat: 'basalt', drift: 0.5 },
    ],
  },
];
