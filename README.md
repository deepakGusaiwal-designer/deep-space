# The Portfolio Inside a Black Hole

A full redesign of [deepakgusaiwal.com](https://www.deepakgusaiwal.com/). Every word of the original content is preserved verbatim — only the experience changed.

**The story:** the visitor arrives outside the event horizon, facing a raymarched black hole with a glowing accretion disk and gravitational lensing. Scrolling is flying. The descent passes four space stations (the History), time dilates at the deepest point (the "From DESIGN✩ to Code⭐" interlude), a galaxy of skill-planets orbits an invisible gravity well, three testimonials circle a small star, and the journey ends inside a wormhole where the contact form floats. Submitting collapses it into the singularity.

## Run it

```bash
npm install
npm run dev      # local dev
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Stack

React 19 · Vite 7 · TypeScript · TailwindCSS 4 · GSAP + ScrollTrigger · Lenis · Three.js · React Three Fiber · Drei-compatible · @react-three/postprocessing (Bloom / Noise / Vignette) · Framer Motion (contact state swap only) · Zustand · handwritten GLSL.

## Architecture

```
src/
  content/portfolio.ts     ← ALL site copy, verbatim. Single source of truth.
  lib/flightPath.ts        ← Catmull-Rom camera path + easing/damping utils
  store/useUniverse.ts     ← shared state: scroll progress, mouse, hovers
  scroll/SmoothScroll.tsx  ← Lenis ⇄ GSAP ScrollTrigger sync, anchor flights
  hooks/                   ← reusable GSAP reveal, pointer glow, reduced motion
  three/
    Experience.tsx         ← fixed full-screen Canvas + post-processing
    CameraRig.tsx          ← scroll → flight path, parallax, time dilation
    BlackHole.tsx          ← billboarded quad, photon-geodesic raymarch shader
    Starfield.tsx          ← stars (cursor-reactive), dust, hyperspace lines
    Stations.tsx           ← History stations; lights wake on approach
    SkillGalaxy.tsx        ← draggable planet system, tool satellites
    Wormhole.tsx           ← additive tunnel shader for the finale
    shaders/glsl.ts        ← all GLSL in one reviewed file
  sections/                ← DOM layer (Hero, History, Interlude, WhatIDo,
                             Testimonials, Contact) floating above the universe
  ui/                      ← Cursor (energy particle), Nav, Preloader,
                             Magnetic wrapper, ScrollHint
```

### How the journey works

`SmoothScroll` publishes a global progress value (0→1). `CameraRig` samples `lib/flightPath.ts` — a keyframed Catmull-Rom spline with per-key FOV — so scrolling literally flies the camera between stations, through the galaxy, and into the wormhole. Damping lambda drops during the interlude (`dilationAmount`) so the camera feels heavier: time distortion you can feel in the input.

### The black hole

One quad, one draw call. The fragment shader integrates simplified photon geodesics (`a = -3/2·h²·r/|r|⁵`); the accretion disk is sampled at every `y=0` plane crossing, which is what produces the Interstellar-style arc above and below the shadow, the photon ring, Doppler beaming on the approaching side, and lensed background stars.

## Tuning knobs

- **Flight path / section pacing:** `lib/flightPath.ts` → `PATH` keyframes.
- **Station positions:** `three/Stations.tsx` → `STATION_POSITIONS`.
- **Planet orbits/colors:** `content/portfolio.ts` → `disciplines` (visual fields only — copy stays untouched).
- **Warp/dilation timing:** `warpAmount` / `dilationAmount` in `flightPath.ts`.

## Performance & accessibility

- Three.js bundle is code-split (`manualChunks`) and lazy-loaded — text paints before the universe.
- Mobile: fewer stars/dust, capped DPR, post-processing off. Same story, lighter GPU.
- `prefers-reduced-motion`: parallax, auto-orbits and smooth-scroll inertia switch off; a semantic list fallback replaces the interactive galaxy (also used for touch and screen readers).
- No `localStorage`; the contact form opens the visitor's mail app (`mailto:` to the original address) and stores nothing.

## Content guarantee

Everything the visitor reads — hero sentence, History entries, "From DESIGN✩ to Code⭐", the four "What I do" disciplines and their tools, all three testimonials, Email/LinkedIn — is imported from `src/content/portfolio.ts`, copied verbatim from the live site. The original site has no Projects section, so none was invented; when real case studies exist, add them to `portfolio.ts` and give them the planet treatment via `SkillGalaxy`'s planet component.
