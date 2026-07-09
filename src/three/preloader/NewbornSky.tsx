import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stage, T } from '../../lib/preloaderScript';
import { smoothstep, lerp } from '../../lib/flightPath';
import { atmosphereVertex, atmosphereFragment } from '../shaders/glsl';
import { quadVertex, nebulaFragment, sparkVertex, sparkFragment } from './shaders';

const STAR_TINTS = [
  [1.0, 0.96, 0.9],
  [0.82, 0.88, 1.0],
  [1.0, 0.86, 0.72],
  [0.92, 0.94, 1.0],
];

/**
 * Scene 03 → 05 — the stars, and later the hyperspace streaks they become.
 * One field serves both: `uStretch` elongates the sprites during the dive.
 */
export function Sparks({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // a hollow shell around the flight path, denser toward the axis
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const rad = 22 + Math.pow(Math.random(), 0.6) * 60;
      pos[i * 3] = s * Math.cos(th) * rad;
      pos[i * 3 + 1] = s * Math.sin(th) * rad * 0.75;
      pos[i * 3 + 2] = u * rad - 12;
      size[i] = 0.7 + Math.pow(Math.random(), 2.4) * 2.6;
      phase[i] = Math.random();
      const tint = STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0];
      color[i * 3] = tint[0];
      color[i * 3 + 1] = tint[1];
      color[i * 3 + 2] = tint[2];
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sparkVertex,
        fragmentShader: sparkFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uReveal: { value: 0 },
          uStretch: { value: 0 },
        },
      }),
    [],
  );

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = stage.t;
    material.uniforms.uTime.value = t;
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
    // stars condense out of the cooling debris
    material.uniforms.uReveal.value = smoothstep(T.universe - 0.3, T.universe + 1.6, t);
    // and are drawn into threads once we are falling
    material.uniforms.uStretch.value = smoothstep(T.wormhole, T.flash, t);
    p.visible = material.uniforms.uReveal.value > 0.01;
  });

  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} visible={false} />
  );
}

interface CloudSpec {
  pos: [number, number, number];
  scale: number;
  a: string;
  b: string;
  seed: number;
  alpha: number;
}

const CLOUDS: CloudSpec[] = [
  { pos: [-16, 5, -26], scale: 44, a: '#3a1220', b: '#7c2740', seed: 1.7, alpha: 0.5 },
  { pos: [18, -7, -34], scale: 54, a: '#141a34', b: '#3d5a92', seed: 5.2, alpha: 0.44 },
  { pos: [2, 10, -46], scale: 62, a: '#2a1430', b: '#5a3570', seed: 9.4, alpha: 0.34 },
];

/** Scene 02 → 03 — volumetric haze precipitating out of the fireball. */
export function Nebulae() {
  const group = useRef<THREE.Group>(null);

  const mats = useMemo(
    () =>
      CLOUDS.map(
        (c) =>
          new THREE.ShaderMaterial({
            vertexShader: quadVertex,
            fragmentShader: nebulaFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
              uTime: { value: 0 },
              uAlpha: { value: 0 },
              uSeed: { value: c.seed },
              uColorA: { value: new THREE.Color(c.a) },
              uColorB: { value: new THREE.Color(c.b) },
            },
          }),
      ),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = stage.t;
    // they begin forming inside the explosion, and linger
    const rise = smoothstep(T.bang + 0.35, T.universe + 1.2, t);
    const fall = 1 - smoothstep(T.wormhole, T.flash, t);
    g.visible = rise > 0.01 && fall > 0.01;
    if (!g.visible) return;

    mats.forEach((m, i) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uAlpha.value = CLOUDS[i].alpha * rise * fall;
    });
    // always face the lens; they are flat, and must never look it
    g.children.forEach((c) => c.quaternion.copy(state.camera.quaternion));
  });

  return (
    <group ref={group} visible={false}>
      {CLOUDS.map((c, i) => (
        <mesh key={i} position={c.pos} material={mats[i]} renderOrder={2} frustumCulled={false}>
          <planeGeometry args={[c.scale, c.scale]} />
        </mesh>
      ))}
    </group>
  );
}

/** Scene 03 — a young spiral, turning. */
export function Galaxy({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const ARMS = 3;
    const core = new THREE.Color('#ffe6c2');
    const edge = new THREE.Color('#6f86c9');
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.62) * 11;
      const arm = (i % ARMS) * ((Math.PI * 2) / ARMS);
      // logarithmic sweep, with matter scattered around each arm
      const angle = arm + r * 0.44 + (Math.random() - 0.5) * 0.5;
      const spread = (1 - r / 11) * 0.5 + 0.22;
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * spread * 2.4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * (1.6 - r * 0.09);
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * spread * 2.4;
      size[i] = 0.5 + Math.random() * 1.5;
      phase[i] = Math.random();
      const c = core.clone().lerp(edge, Math.min(1, r / 9));
      color[i * 3] = c.r;
      color[i * 3 + 1] = c.g;
      color[i * 3 + 2] = c.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sparkVertex,
        fragmentShader: sparkFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uReveal: { value: 0 },
          uStretch: { value: 0 },
        },
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !points.current) return;
    const t = stage.t;
    material.uniforms.uTime.value = t;
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
    const reveal = smoothstep(T.universe, T.universe + 1.5, t);
    material.uniforms.uReveal.value = reveal;
    // it is drawn into the hole with everything else
    const swallow = 1 - smoothstep(T.hole + 0.4, T.wormhole, t);
    g.visible = reveal > 0.01 && swallow > 0.01;
    if (!g.visible) return;
    material.uniforms.uStretch.value = 0;
    points.current.rotation.y += delta * 0.11;
    g.scale.setScalar(swallow);
  });

  return (
    <group ref={group} position={[-19, 7, -44]} rotation={[0.5, 0.2, 0.35]} visible={false}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

/**
 * Scene 03 — a world sweeping past the lens.
 *
 * It flies from far ahead to just behind the camera between `from` and `to`,
 * which is what sells the sense that the camera is moving through somewhere
 * rather than watching a backdrop.
 */
export function PassingPlanet() {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);

  const air = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: { uColor: { value: new THREE.Color('#7fa6ff') } },
      }),
    [],
  );

  const from = useMemo(() => new THREE.Vector3(9, -3.4, -40), []);
  const to = useMemo(() => new THREE.Vector3(-5.5, 2.2, 12), []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = stage.t;
    const k = smoothstep(T.universe + 0.25, T.hole - 0.05, t);
    g.visible = k > 0.001 && k < 0.999;
    if (!g.visible) return;
    g.position.set(lerp(from.x, to.x, k), lerp(from.y, to.y, k), lerp(from.z, to.z, k));
    if (body.current) body.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={body}>
        <sphereGeometry args={[2.4, 48, 48]} />
        <meshStandardMaterial color="#2f3644" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh scale={1.12} material={air}>
        <sphereGeometry args={[2.4, 32, 32]} />
      </mesh>
    </group>
  );
}
