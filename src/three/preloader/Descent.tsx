import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stage, T, HOLE_Z } from '../../lib/preloaderScript';
import { smoothstep } from '../../lib/flightPath';
import {
  quadVertex,
  blackHoleVertex,
  makeBlackHoleFragment,
  infallVertex,
  infallFragment,
  tunnelFragment,
  flashFragment,
} from './shaders';

const CENTER = new THREE.Vector3(0, 0, HOLE_Z);
const forward = new THREE.Vector3();

/**
 * Scene 04 — the hole itself, gathering ahead.
 *
 * One billboarded quad; the fragment shader integrates photon geodesics, so
 * the lensed arc, the photon ring and the shadow are computed, not painted.
 * The quad is oversized so the lensing has room to work at the edges.
 */
export function PreloaderHole({ lite }: { lite: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: blackHoleVertex,
        // fewer march steps on weak GPUs: the ring gets slightly softer,
        // the frame rate does not
        fragmentShader: makeBlackHoleFragment(lite ? 60 : 110),
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uCenter: { value: CENTER.clone() },
          uCamPos: { value: new THREE.Vector3() },
          uFade: { value: 0 },
        },
      }),
    [lite],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;

    // it condenses out of the dark early — its act is the long one now, so
    // it can afford a slow arrival — then the throat opens and takes over
    const fade =
      smoothstep(T.hole - 0.9, T.hole + 0.6, t) * (1 - smoothstep(T.wormhole + 0.25, T.flash, t));
    material.uniforms.uFade.value = fade;
    m.visible = fade > 0.01;
    if (!m.visible) return;

    material.uniforms.uTime.value = t;
    material.uniforms.uCamPos.value.copy(state.camera.position);
    m.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={mesh} position={CENTER} material={material} renderOrder={8} frustumCulled={false} visible={false}>
      <planeGeometry args={[80, 80]} />
    </mesh>
  );
}

/** Scene 04 — cosmic dust caught by the hole, spiralling down into the disk. */
export function InfallDust({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const r0 = new Float32Array(count);
    const ang = new Float32Array(count);
    const tilt = new Float32Array(count);
    const rate = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      r0[i] = 8 + Math.pow(Math.random(), 0.7) * 16;
      ang[i] = Math.random() * Math.PI * 2;
      tilt[i] = (Math.random() - 0.5) * 5;
      rate[i] = 0.6 + Math.random() * 1.4;
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aR0', new THREE.BufferAttribute(r0, 1));
    g.setAttribute('aAng', new THREE.BufferAttribute(ang, 1));
    g.setAttribute('aTilt', new THREE.BufferAttribute(tilt, 1));
    g.setAttribute('aRate', new THREE.BufferAttribute(rate, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: infallVertex,
        fragmentShader: infallFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uT: { value: -1 }, uPixelRatio: { value: 1 }, uFade: { value: 0 } },
      }),
    [],
  );

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = stage.t;
    // the vortex starts winding up a touch before the hole is visible, so
    // by the time it fades in the motion already has history
    material.uniforms.uT.value = t - (T.hole - 1.0);
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
    const fade =
      smoothstep(T.hole - 0.3, T.hole + 0.8, t) * (1 - smoothstep(T.wormhole + 0.2, T.flash, t));
    material.uniforms.uFade.value = fade;
    p.visible = fade > 0.01;
  });

  // tilted to lie in the same plane as the shader's accretion disk
  return (
    <points
      ref={points}
      position={CENTER}
      rotation={[-0.32, 0, 0]}
      geometry={geometry}
      material={material}
      renderOrder={7}
      frustumCulled={false}
      visible={false}
    />
  );
}

/**
 * Scene 05 — the throat. An open cylinder we fly down the inside of, its far
 * mouth glowing. It grows out of the hole's own position rather than
 * appearing somewhere new: the horizon becomes the wormhole.
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
          uRush: { value: 0 },
          uAccent: { value: new THREE.Color('#8B0000') },
        },
      }),
    [],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;
    const alpha =
      smoothstep(T.wormhole - 0.2, T.wormhole + 0.35, t) * (1 - smoothstep(T.flash, T.flash + 0.25, t));
    material.uniforms.uAlpha.value = alpha;
    m.visible = alpha > 0.01;
    if (!m.visible) return;
    material.uniforms.uTime.value = t;
    // the mouth widens and the walls rush harder as we commit to it
    const open = smoothstep(T.wormhole, T.flash, t);
    material.uniforms.uRush.value = open;
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
    // a hard strike, then a slow bleed-off as the site takes over behind it
    const up = smoothstep(T.flash - 0.14, T.flash, t);
    const down = 1 - smoothstep(T.flash + 0.05, T.flash + 1.1, t);
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
