import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { blackHoleVertex, blackHoleFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { smoothstep, damp } from '../lib/flightPath';

export const HOLE_CENTER = new THREE.Vector3(0, 0, -2);
export const EXIT_HOLE_CENTER = new THREE.Vector3(0, 0, -248);

interface HoleProps {
  center: THREE.Vector3;
  size?: number;
  /** 0 = monochrome white-hot disk, 1 = golden Gargantua */
  warm?: number;
  /** returns target visibility 0..1 for the current scroll progress */
  fade: (progress: number, contactCollapsed: boolean) => number;
}

/**
 * A billboarded quad running a photon-geodesic raymarch.
 * Cheap on geometry, expensive-looking on screen — one draw call.
 */
function Hole({ center, size = 46, warm = 0, fade }: HoleProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const m2 = useRef({ x: 0, y: 0 });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: blackHoleVertex,
        fragmentShader: blackHoleFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uCenter: { value: center.clone() },
          uCamLocal: { value: new THREE.Vector3() },
          uFade: { value: 0 },
          uWarm: { value: warm },
        },
      }),
    [center, warm],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { progress, mouse, reducedMotion, contactCollapsed } = useUniverse.getState();

    // billboard toward the camera
    m.quaternion.copy(state.camera.quaternion);

    material.uniforms.uTime.value = state.clock.elapsedTime;

    // the cursor orbits your viewpoint around the hole — the lensing,
    // photon ring and disk all respond because the raymarch origin moves
    const k = reducedMotion ? 0 : 1;
    const mm = m2.current;
    mm.x = damp(mm.x, mouse.x * k, 1.6, delta);
    mm.y = damp(mm.y, mouse.y * k, 1.6, delta);
    material.uniforms.uCamLocal.value.copy(state.camera.position).sub(center);
    const dist = material.uniforms.uCamLocal.value.length();
    material.uniforms.uCamLocal.value.x += mm.x * dist * 0.1;
    material.uniforms.uCamLocal.value.y += -mm.y * dist * 0.07;

    material.uniforms.uFade.value = damp(
      material.uniforms.uFade.value,
      fade(progress, contactCollapsed),
      4,
      delta,
    );
    m.visible = material.uniforms.uFade.value > 0.01;
  });

  return (
    <mesh ref={mesh} position={center} material={material} renderOrder={5} frustumCulled={false}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}

/** The entrance: a golden Gargantua, fades as the visitor crosses the horizon. */
export default function BlackHole() {
  return (
    <Hole
      center={HOLE_CENTER}
      warm={1}
      fade={(p) => 1 - smoothstep(0.16, 0.26, p)}
    />
  );
}

/**
 * The exit: a second, GOLDEN black hole waiting at the end of the journey.
 * Color returns to the universe just before you leave it. It rises behind
 * the testimonial orbit and hosts the contact form; submitting the form
 * (contactCollapsed) calms it to an ember.
 */
export function ExitBlackHole() {
  return (
    <Hole
      center={EXIT_HOLE_CENTER}
      size={52}
      warm={1}
      fade={(p, collapsed) => smoothstep(0.66, 0.8, p) * (collapsed ? 0.3 : 1)}
    />
  );
}
