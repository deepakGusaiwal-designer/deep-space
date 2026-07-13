# GRAVITY — A Three.js Game Experience

Pure code. Pure physics. Pure experience.

A standalone browser game living on the `/game/` route of the portfolio:
dark monolithic architecture in a golden haze, a black-chrome sphere,
black holes, wormholes and red laser grids. Vanilla Three.js + GSAP +
custom GLSL only — **no textures, no models, no images, no physics
library. Everything is generated at runtime.**

Play: `npm run dev` → `http://localhost:5173/game/`
(Production build emits `dist/game/index.html` as a second Vite entry.)

## Controls

| Input | Action |
| --- | --- |
| WASD | Move |
| Mouse | Rotate camera (pointer lock) |
| Space | Jump (coyote time + jump buffering) |
| Shift | Sprint (drains ENERGY; it regenerates when you ease off) |
| R | Restart level |
| Esc | Pause |
| M | Mute |

HUD: ENERGY + TIME top-left, LEVEL top-right, km/h gauge bottom-right.
Dev hook: `/game/?autostart` skips the start screen.

## Architecture

```
game/src/
  main.js               entry — boots the Game state machine
  config/settings.js    every tuning constant in one place
  core/
    Engine.js           renderer, ACES + bloom post chain, adaptive resolution
    Physics.js          sphere-vs-OBB solver, triggers, attractors, hazards
    Game.js             state machine: START→INTRO→PLAY⇄PAUSE→COMPLETE→END
  shaders/
    chunks.js           reusable GLSL: value noise, fbm, ridge, fresnel
    emissive.js         gate / portal / pad / sky / black-hole disk / halo
  materials/Materials.js dark procedural PBR + gold strips + laser + emissives
  world/
    components.js       platform (with gold rim lights), ramp, bridge, rotator,
                        slider, elevator, pendulum, gate, pad, checkpoint,
                        portal, decor, skyline (procedural city), laser hazard,
                        blackhole (attractor), wormhole (teleport pair)
    World.js            merges static geometry per material (1 draw call each)
  levels/levels.js      three data-driven levels (Atrium, Suspension, Metronome)
  player/Player.js      momentum movement, rolling, landing squash, contact shadow
  camera/CameraRig.js   smooth follow, look-ahead, collision, GSAP cinematics
  lighting/Lighting.js  warm golden-hour sun, smoky fog, shader sky → PMREM env
  particles/Particles.js GPU burst pool + ambient motes (vertex-shader simulated)
  audio/Audio.js        Web Audio synthesis — ambient pad + gameplay cues
  ui/UI.js + ui.css     dark/gold overlays, GSAP-animated, typography only
```

## Techniques worth noting

- **Procedural PBR**: world-space fbm injected into `MeshPhysicalMaterial`
  shaders (dark concrete mottle, graphite veins, brushed metal) — keeps
  Three's shadows/env pipeline, zero textures.
- **Procedural sky + environment**: golden-hour haze over pitch black,
  sparse stars — rendered on the dome AND into a PMREM cubemap, so the
  black-chrome sphere carries warm reflections without any HDRI.
- **Procedural city**: a seeded ring of dark monolith towers with lit
  floor bands surrounds every level; merged to two draw calls.
- **Energy system**: sprint drains the HUD energy bar, easing off
  regenerates it; falls cost energy; the level-complete card reports it.
- **Black holes**: black core + lensing halo + photon ring + animated
  accretion disk; `pull` ones are physics attractors with a kill radius.
- **Wormholes**: paired trigger mouths; traversal preserves momentum,
  snaps the camera and re-arms only after the player rolls clear.
- **Laser hazards**: emissive beams with oriented hazard colliders —
  touch one and the checkpoint wormhole pulls you back.
- **Hand-rolled physics**: sphere vs oriented boxes, moving-platform
  carry, platform velocity inheritance, coyote time, jump buffering.
- **GSAP as the single motion source**: platforms/pendulums/gates/UI/
  camera cinematics are GSAP tweens; physics reads transforms back.
- **Perf**: merged static batches, GPU particles, capped pixel ratio,
  adaptive resolution scaling.
