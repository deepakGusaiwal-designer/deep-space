import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { wormholeVertex, wormholeFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { damp, WORLDS } from '../lib/flightPath';

const CENTER = WORLDS.wormhole.clone();

/**
 * The wormhole — a billboarded quad running a swirling-vortex shader. It sits
 * lower-right of the hero tableau, pulses gently, and brightens when the
 * pointer is over it. At the end of the journey the camera plunges straight
 * into its throat (position is fixed; the flight path drives the camera in).
 */
export default function Wormhole({ size = 30 }: { size?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const hover = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: wormholeVertex,
        fragmentShader: wormholeFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFade: { value: 0 },
          uPulse: { value: 0.5 },
          uAccent: { value: 0.35 },
        },
      }),
    [],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { reducedMotion, ready, enterWarp } = useUniverse.getState();
    const t = state.clock.elapsedTime;

    m.quaternion.copy(state.camera.quaternion); // billboard
    material.uniforms.uTime.value = t;

    // gentle breathing, lifted while hovered or during the loader's warp
    hover.current = damp(hover.current, useUniverse.getState().hoveredWorld === 'wormhole' ? 1 : 0, 6, delta);
    const breathe = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.8);
    material.uniforms.uPulse.value = breathe * (0.7 + hover.current * 0.6) + enterWarp * 0.6;
    material.uniforms.uAccent.value = 0.3 + hover.current * 0.4;

    material.uniforms.uFade.value = damp(material.uniforms.uFade.value, ready ? 1 : 0, 3, delta);
    m.visible = material.uniforms.uFade.value > 0.01;
  });

  const setHoveredWorld = useUniverse((s) => s.setHoveredWorld);

  return (
    <mesh
      ref={mesh}
      position={CENTER}
      material={material}
      renderOrder={4}
      frustumCulled={false}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredWorld('wormhole');
      }}
      onPointerOut={() => setHoveredWorld(null)}
    >
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}
