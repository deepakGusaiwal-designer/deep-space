import { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { stage, T, HOLE_Z } from '../../lib/preloaderScript';
import { smoothstep, lerp } from '../../lib/flightPath';
import { BigBangField, Shockwaves, Singularity } from './BigBang';
import { Galaxies, Nebulae, PassingPlanet, Sparks } from './NewbornSky';
import { Flash, InfallDust, PreloaderHole, Wormhole } from './Descent';

const lookAt = new THREE.Vector3();

/** Deterministic wobble — three incommensurate sines beat like a real handshake. */
function shake(t: number, seed: number): number {
  return (
    Math.sin(t * 37.1 + seed) * 0.55 +
    Math.sin(t * 61.7 + seed * 2.3) * 0.3 +
    Math.sin(t * 13.3 + seed * 5.1) * 0.15
  );
}

/**
 * The camera is the narrator. It hangs still before time, leans in as the
 * singularity collapses, is thrown back by the detonation, drifts forward
 * through the newborn sky, then commits to the hole and dives.
 */
function CineCamera({ quiet }: { quiet: boolean }) {
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const t = stage.t;

    // ── dolly ──
    let z = 6;
    z = lerp(z, 5.35, smoothstep(T.collapse - 0.2, T.bang, t)); // leans in as it collapses
    // blown back far enough that the expanding shell stays ahead of us — the
    // fireball has to be a thing we watch, not a thing we are inside of
    z = lerp(z, 14.5, smoothstep(T.bang, T.universe - 0.3, t));
    z = lerp(z, 0.5, smoothstep(T.universe, T.hole, t)); // drifts on through the cosmos
    z = lerp(z, -15, smoothstep(T.hole, T.wormhole, t)); // commits to the hole
    // the dive accelerates — power-of-three easing, not linear
    const dive = smoothstep(T.wormhole, T.flash, t);
    z = lerp(z, HOLE_Z + 2.5, dive * dive * dive);

    // ── field of view ──
    let fov = 45;
    fov = lerp(fov, 52, smoothstep(T.universe, T.hole, t));
    fov = lerp(fov, 60, smoothstep(T.hole, T.wormhole, t));
    fov = lerp(fov, 96, dive * dive);

    // ── the detonation kicks the rig, at T.bang exactly ──
    // a long, settling shudder rather than a single slam: the shell it is
    // reacting to takes seconds to open, and a short jolt over a slow bloom
    // reads as two unrelated events
    const kick = quiet ? 0 : Math.exp(-Math.max(0, t - T.bang) * 1.3) * smoothstep(T.bang - 0.02, T.bang + 0.1, t);
    // and the throat rattles the rig gently on the way down
    const rumble = quiet ? 0 : dive * 0.25;
    const sx = shake(t, 1.7) * (0.3 * kick + 0.06 * rumble);
    const sy = shake(t, 4.9) * (0.24 * kick + 0.05 * rumble);

    // a slow drift so the newborn universe never feels like a still frame
    const driftX = quiet ? 0 : Math.sin(t * 0.31) * 0.5 * smoothstep(T.universe, T.hole, t);
    const driftY = quiet ? 0 : Math.cos(t * 0.24) * 0.34 * smoothstep(T.universe, T.hole, t);

    cam.position.set(sx + driftX, sy + driftY, z);

    // always aimed down the axis the story runs along
    lookAt.set(driftX * 0.3, driftY * 0.3, t < T.universe ? 0 : HOLE_Z);
    cam.lookAt(lookAt);

    // a barrel roll through the throat
    cam.rotation.z += quiet ? 0 : dive * dive * 1.5 + shake(t, 9.1) * 0.02 * kick;

    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/**
 * Chromatic smear that ramps only during the dive — the closest thing to a
 * per-object motion blur the postprocessing stack offers, and together with
 * the star streaks it reads as one.
 */
function DiveAberration() {
  const offset = useMemo(() => new THREE.Vector2(), []);
  useFrame(() => {
    const k = smoothstep(T.wormhole, T.flash, stage.t);
    offset.set(k * 0.0024, k * 0.0017);
  });
  return <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={offset} radialModulation={false} modulationOffset={0} />;
}

export default function PreloaderScene({
  quiet,
  lite,
}: {
  /** reduced motion: no shake, no roll */
  quiet: boolean;
  /** mobile / weak GPU: fewer motes, shorter raymarch, no post stack */
  lite: boolean;
}) {
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 400 }}
      style={{ background: '#000000' }}
    >
      <color attach="background" args={['#000000']} />
      {/* one key light so the passing world shows a terminator */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[14, 10, 6]} intensity={1.4} color="#fff4e6" />

      <CineCamera quiet={quiet} />

      <Singularity />
      <BigBangField count={lite ? 30000 : 120000} />
      <Shockwaves />
      <Nebulae lite={lite} />
      <Sparks count={lite ? 3000 : 9000} />
      <Galaxies lite={lite} />
      <PassingPlanet />
      <InfallDust count={lite ? 900 : 2600} />
      <PreloaderHole lite={lite} />
      <Wormhole />
      <Flash />

      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.15} luminanceThreshold={0.4} luminanceSmoothing={0.85} mipmapBlur />
          <DiveAberration />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
