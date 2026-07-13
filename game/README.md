# MONUMENT — A Three.js Technical Showcase

A standalone browser game living on the `/game/` route of the portfolio:
floating architecture adrift in deep space, complete with black holes and
wormholes. Vanilla Three.js + GSAP + custom GLSL only — **no textures, no
models, no images, no physics library. Everything is generated at runtime.**

Play: `npm run dev` → `http://localhost:5173/game/`
(Production build emits `dist/game/index.html` as a second Vite entry.)

## Controls

| Input | Action |
| --- | --- |
| WASD | Move |
| Mouse | Rotate camera (pointer lock) |
| Space | Jump (coyote time + jump buffering) |
| Shift | Sprint |
| R | Restart level |
| Esc | Pause |
| M | Mute |

Dev hook: `/game/?autostart` skips the start screen.

## Architecture

```
game/src/
  main.js               entry — boots the Game state machine
  config/settings.js    every tuning constant in one place
  core/
    Engine.js           renderer, ACES + bloom post chain, adaptive resolution
    Physics.js          custom sphere-vs-OBB solver, triggers, platform carry
    Game.js             state machine: START→INTRO→PLAY⇄PAUSE→COMPLETE→END
  shaders/
    chunks.js           reusable GLSL: value noise, fbm, ridge, fresnel
    emissive.js         gate / portal / pad / beacon / sky / contact shadow
  materials/Materials.js procedural PBR (onBeforeCompile fbm injection) + emissives
  world/
    components.js       platform, ramp, bridge, rotator, slider, elevator,
                        pendulum, gate, pad, checkpoint, portal, decor,
                        blackhole (attractor hazard), wormhole (teleport pair)
    World.js            merges static geometry per material (1 draw call each)
  levels/levels.js      three data-driven levels (Atrium, Suspension, Metronome)
  player/Player.js      momentum movement, rolling, landing squash, contact shadow
  camera/CameraRig.js   smooth follow, look-ahead, collision, GSAP cinematics
  lighting/Lighting.js  tracked sun, fog, shader sky → procedural PMREM env
  particles/Particles.js GPU burst pool + ambient motes (vertex-shader simulated)
  audio/Audio.js        Web Audio synthesis — ambient pad + gameplay cues
  ui/UI.js + ui.css     glassmorphism DOM overlays, GSAP-animated, typography only
```

## Techniques worth noting

- **Procedural PBR**: triplanar-ish world-space fbm injected into
  `MeshPhysicalMaterial` shaders (concrete mottle, marble veins, brushed
  metal streaks) — keeps Three's shadows/env pipeline, zero textures.
- **Procedural space sky**: hashed-cell starfield, level-tinted fbm
  nebulae and a galaxy band in one shader — rendered on the dome AND
  into a PMREM cubemap at boot, so chrome reflects the cosmos without
  any HDRI.
- **Black holes**: black core + fresnel lensing halo + photon ring +
  animated accretion-disk shader. Ones flagged `pull` register a
  physics attractor (linear-falloff acceleration, kill radius at the
  event horizon).
- **Wormholes**: paired trigger mouths; traversal preserves momentum,
  snaps the camera and re-arms only after the player rolls clear.
- **Hand-rolled physics**: sphere vs oriented boxes with two-pass
  resolution, moving-platform carry (position + yaw), platform velocity
  inheritance on jump, coyote time and jump buffering.
- **GSAP as the single motion source**: platforms/doors/pendulums are
  GSAP tweens; the physics reads transforms back each frame, so
  animation and collision can never drift apart.
- **GPU particles**: spawn attributes only — position, fade and gravity
  are computed per-vertex from `(spawnTime, velocity, life)`.
- **Perf**: merged static batches (one draw call per material), capped
  pixel ratio, adaptive resolution scaling, pooled particles.
