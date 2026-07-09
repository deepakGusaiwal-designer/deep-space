import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stage, T, HOLE_Z } from '../../lib/preloaderScript';
import { smoothstep } from '../../lib/flightPath';
import { blackHoleVertex, blackHoleFragment } from '../shaders/glsl';
import { quadVertex, tunnelFragment, flashFragment } from './shaders';

const CENTER = new THREE.Vector3(0, 0, HOLE_Z);
const forward = new THREE.Vector3();

/**
 * Scene 04 — the hole itself, gathering ahead.
 *
 * Reuses the site's own photon-geodesic raymarch rather than approximating
 * it again: the same shader the visitor will meet later on the flight path,
 * so the preloader is a promise the rest of the page keeps.
 */
export function PreloaderHole() {
  const mesh = useRef<THREE.Mesh>(null);

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
          uWarm: { value: 1 },
        },
      }),
    [],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;

    // it condenses out of the dark, then the throat opens and takes over
    const fade =
      smoothstep(T.hole - 0.5, T.hole + 0.7, t) * (1 - smoothstep(T.wormhole + 0.35, T.flash, t));
    material.uniforms.uFade.value = fade;
    m.visible = fade > 0.01;
    if (!m.visible) return;

    material.uniforms.uTime.value = t;
    material.uniforms.uCamLocal.value.copy(state.camera.position).sub(CENTER);
    m.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={mesh} position={CENTER} material={material} renderOrder={8} frustumCulled={false} visible={false}>
      <planeGeometry args={[80, 80]} />
    </mesh>
  );
}

/**
 * Scene 05 — the throat. An open cylinder we fly down the inside of, its far
 * mouth glowing. It grows out of the hole's own position rather than
 * appearing somewhere new: the hole becomes the wormhole.
 */
export function Wormhole() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: tunnelFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 0 },
          uAccent: { value: new THREE.Color('#CB152F') },
        },
      }),
    [],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;
    const alpha = smoothstep(T.wormhole - 0.25, T.wormhole + 0.6, t) * (1 - smoothstep(T.flash, T.flash + 0.25, t));
    material.uniforms.uAlpha.value = alpha;
    m.visible = alpha > 0.01;
    if (!m.visible) return;
    material.uniforms.uTime.value = t;
    // the mouth widens as we commit to it
    const open = smoothstep(T.wormhole, T.flash, t);
    m.scale.set(1 + open * 0.5, 1, 1 + open * 0.5);
  });

  // a long tube centred on the hole, running along our flight axis
  return (
    <mesh
      ref={mesh}
      position={[0, 0, HOLE_Z + 16]}
      rotation={[Math.PI / 2, 0, 0]}
      material={material}
      renderOrder={9}
      frustumCulled={false}
      visible={false}
    >
      <cylinderGeometry args={[7, 7, 64, 64, 1, true]} />
    </mesh>
  );
}

/** Scene 05 — the white-out that hands the frame to the site. */
export function Flash() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: flashFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: { uFlash: { value: 0 } },
      }),
    [],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;
    // a hard strike, then a fast bleed-off as the site takes over behind it
    const up = smoothstep(T.flash - 0.16, T.flash, t);
    const down = 1 - smoothstep(T.flash + 0.05, T.end + 0.12, t);
    const f = up * down;
    material.uniforms.uFlash.value = f;
    m.visible = f > 0.002;
    if (!m.visible) return;

    // pinned across the frustum, just past the near plane
    const cam = state.camera as THREE.PerspectiveCamera;
    const d = 0.4;
    forward.set(0, 0, -1).applyQuaternion(cam.quaternion);
    m.position.copy(cam.position).addScaledVector(forward, d);
    m.quaternion.copy(cam.quaternion);
    const h = 2 * d * Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5));
    m.scale.set(h * (state.size.width / state.size.height) * 1.05, h * 1.05, 1);
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={999} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
