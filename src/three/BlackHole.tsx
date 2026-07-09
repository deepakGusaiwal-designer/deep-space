import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { blackHoleVertex, blackHoleFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { damp, WORLDS } from '../lib/flightPath';

const CENTER = WORLDS.blackHole.clone();

/**
 * The Gargantua. A billboarded quad running a photon-geodesic raymarch:
 * rays bend around the singularity and the accretion disk is sampled on
 * every plane crossing, producing the Interstellar arc of light above and
 * below the horizon plus the photon ring. One draw call, sits upper-right
 * of the hero tableau and becomes a lensing flyby mid-journey. The cursor
 * orbits the viewpoint so the lensing responds to the pointer.
 */
export default function BlackHole({ size = 46 }: { size?: number }) {
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
          uCenter: { value: CENTER.clone() },
          uCamLocal: { value: new THREE.Vector3() },
          uFade: { value: 0 },
          uWarm: { value: 0.55 }, // restrained golden disk
        },
      }),
    [],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { mouse, reducedMotion, ready } = useUniverse.getState();

    m.quaternion.copy(state.camera.quaternion); // billboard
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // the cursor swings the raymarch origin around the hole → live lensing
    const k = reducedMotion ? 0 : 1;
    const mm = m2.current;
    mm.x = damp(mm.x, mouse.x * k, 1.6, delta);
    mm.y = damp(mm.y, mouse.y * k, 1.6, delta);
    const local = material.uniforms.uCamLocal.value as THREE.Vector3;
    local.copy(state.camera.position).sub(CENTER);
    const dist = local.length();
    local.x += mm.x * dist * 0.1;
    local.y += -mm.y * dist * 0.07;

    material.uniforms.uFade.value = damp(
      material.uniforms.uFade.value,
      ready ? 1 : 0,
      3,
      delta,
    );
    m.visible = material.uniforms.uFade.value > 0.01;
  });

  return (
    <mesh ref={mesh} position={CENTER} material={material} renderOrder={5} frustumCulled={false}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}
