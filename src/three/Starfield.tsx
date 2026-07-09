import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { starVertex, starFragment, dustVertex, dustFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { warpAmount, damp, WORLDS } from '../lib/flightPath';
import { makeNebulaTexture, makeGlowSprite, makeGalaxyTexture } from './textures';

const WHITE = new THREE.Color('#ffffff');
const WARMWHITE = new THREE.Color('#f2ede4');
const COOLWHITE = new THREE.Color('#e3e8f2');

/** Thousands of stars along the flight corridor. The cursor bends the field. */
export function Starfield({ count = 3800 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();

    // real starfields read as a dense band across the sky with fainter stars
    // packed into it. ~40% cluster into a tilted band wrapping the corridor.
    const BAND_ANGLE = 0.35;
    const BAND_SHARE = 0.4;

    for (let i = 0; i < count; i++) {
      const inBand = Math.random() < BAND_SHARE;
      let angle: number;
      if (inBand) {
        const spread = (Math.random() + Math.random() + Math.random() - 1.5) * 0.3;
        angle = BAND_ANGLE + spread;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      const radius = 12 + Math.pow(Math.random(), 0.6) * 150;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      positions[i * 3 + 2] = 40 - Math.random() * 420;

      sizes[i] = inBand
        ? 0.4 + Math.pow(Math.random(), 3) * 1.3
        : 0.6 + Math.pow(Math.random(), 2.2) * 2.6;
      phases[i] = Math.random();

      const roll = Math.random();
      c.copy(roll > 0.94 ? WARMWHITE : roll > 0.86 ? COOLWHITE : WHITE);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSwallow: { value: 0 }, // no infall — the universe simply is
        uBirth: { value: 1 },   // fully formed
      },
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    const { mouse, reducedMotion } = useUniverse.getState();
    if (reducedMotion) return;
    g.rotation.y = damp(g.rotation.y, mouse.x * 0.016, 1.3, delta);
    g.rotation.x = damp(g.rotation.x, -mouse.y * 0.011, 1.3, delta);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

/** Cosmic dust — fine motes drifting through the corridor, leaning to the cursor. */
export function Stardust({ count = 900 }: { count?: number }) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.pow(Math.random(), 0.7) * 14;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      positions[i * 3 + 2] = 30 - Math.random() * 320;
      sizes[i] = 0.5 + Math.pow(Math.random(), 2) * 1.6;
      phases[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector2() },
        uSwallow: { value: 0 },
        uBirth: { value: 1 },
      },
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const { mouse, reducedMotion } = useUniverse.getState();
    const m = material.uniforms.uMouse.value as THREE.Vector2;
    const k = reducedMotion ? 0 : 1;
    m.x = damp(m.x, mouse.x * k, 1.8, delta);
    m.y = damp(m.y, -mouse.y * k, 1.8, delta);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/** Star trails — faint streaks that ignite with scroll velocity. */
export function StarTrails({ count = 320 }: { count?: number }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const smoothed = useRef(0);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 16;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.8;
      const z = 30 - Math.random() * 300;
      const len = 1.6 + Math.random() * 4.5;
      positions.set([x, y, z, x, y, z - len], i * 6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const { velocity, reducedMotion, enterWarp } = useUniverse.getState();
    const target = reducedMotion ? 0 : Math.min(1, Math.abs(velocity) * 1.4 + enterWarp);
    smoothed.current = damp(smoothed.current, target, 4, delta);
    m.opacity = smoothed.current * 0.34;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={matRef}
        color="#dfe6f2"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/** Hyperspace streaks — visible only in the final rush into the wormhole. */
export function WarpLines({ count = 240 }: { count?: number }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 9;
      const x = Math.cos(angle) * radius + WORLDS.wormhole.x;
      const y = Math.sin(angle) * radius + WORLDS.wormhole.y;
      const z = -150 - Math.random() * 90;
      const len = 5 + Math.random() * 13;
      positions.set([x, y, z, x, y, z - len], i * 6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const { progress } = useUniverse.getState();
    m.opacity = damp(m.opacity, warpAmount(progress) * 0.75, 5, delta);
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/**
 * Distant nebulae — huge soft fbm clouds far behind the corridor, plus one
 * prominent cloud sitting at the nebula waypoint the camera drifts through.
 * This is what turns "black" into "space".
 */
export function Nebulae() {
  const group = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    const defs = [
      { inner: '#b9a8d8', outer: '#171226', pos: [-70, 26, -60], scale: 95, seed: 3 },
      { inner: '#aab2bd', outer: '#131417', pos: [80, -20, -150], scale: 120, seed: 11 },
      { inner: '#8fb8b4', outer: '#0e1a1a', pos: [55, 34, -230], scale: 100, seed: 19 },
      { inner: '#9aa1ad', outer: '#101114', pos: [-85, -30, -270], scale: 130, seed: 27 },
      // the waypoint cloud — the camera drifts through this one
      { inner: '#c98a9a', outer: '#1c1014', pos: [WORLDS.nebula.x, WORLDS.nebula.y, WORLDS.nebula.z], scale: 60, seed: 35 },
      { inner: '#a3aed0', outer: '#12141f', pos: [-28, 10, -128], scale: 70, seed: 43 },
    ] as const;
    return defs.map((c) => ({ ...c, tex: makeNebulaTexture(c.inner, c.outer, c.seed) }));
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { mouse, reducedMotion } = useUniverse.getState();
    if (reducedMotion) return;
    g.rotation.y = damp(g.rotation.y, mouse.x * 0.006, 0.8, delta);
    g.rotation.x = damp(g.rotation.x, -mouse.y * 0.004, 0.8, delta);
    g.children.forEach((child, i) => {
      child.rotation.z += delta * 0.004 * (i % 2 ? 1 : -1);
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <sprite key={i} position={c.pos as unknown as THREE.Vector3} scale={c.scale}>
          <spriteMaterial
            map={c.tex}
            transparent
            depthWrite={false}
            opacity={0.36}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

const ANDROMEDA_POS = new THREE.Vector3(88, 40, -215);

/** Andromeda — our neighbour galaxy, hanging tilted in the far field. */
export function Andromeda() {
  const ref = useRef<THREE.Sprite>(null);
  const tex = useMemo(() => makeGalaxyTexture(7), []);

  useFrame((_, delta) => {
    const s = ref.current;
    if (!s) return;
    const { reducedMotion } = useUniverse.getState();
    const mat = s.material as THREE.SpriteMaterial;
    if (reducedMotion) {
      mat.opacity = 0.55;
      return;
    }
    mat.rotation += delta * 0.0045;
    mat.opacity = 0.55;
  });

  return (
    <sprite ref={ref} position={ANDROMEDA_POS} scale={[120, 68, 1]}>
      <spriteMaterial
        map={tex}
        transparent
        depthWrite={false}
        opacity={0.55}
        rotation={-0.5}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </sprite>
  );
}

/** The deep field — a huge shell of barely-visible micro-stars for depth. */
export function DeepStars({ count = 1600 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 180 + Math.random() * 170;
      positions[i * 3] = Math.sin(v) * Math.cos(u) * r;
      positions[i * 3 + 1] = Math.sin(v) * Math.sin(u) * r * 0.7;
      positions[i * 3 + 2] = -150 + Math.cos(v) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { reducedMotion } = useUniverse.getState();
    if (reducedMotion) return;
    g.rotation.y += delta * 0.0016;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          size={0.55}
          sizeAttenuation
          color="#7d8595"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </points>
    </group>
  );
}

/** Shooting stars — every few seconds one streaks across the deep field. */
export function ShootingStars() {
  const refs = useRef<Array<THREE.Group | null>>([]);
  const states = useRef(
    Array.from({ length: 3 }, (_, i) => ({
      t: -3 - i * 4,
      dur: 1.4,
      from: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    })),
  );

  const tex = useMemo(() => makeGlowSprite('#f5f3ee'), []);

  useFrame((state, delta) => {
    const { reducedMotion } = useUniverse.getState();
    const camZ = state.camera.position.z;
    states.current.forEach((s, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (reducedMotion) {
        g.visible = false;
        return;
      }
      s.t += delta;
      if (s.t > s.dur) {
        s.t = -(2 + Math.random() * 6);
        s.dur = 1.1 + Math.random() * 0.9;
        const side = Math.random() > 0.5 ? 1 : -1;
        s.from.set(side * (18 + Math.random() * 30), 8 + Math.random() * 18, camZ - 50 - Math.random() * 60);
        s.dir.set(-side * (26 + Math.random() * 18), -(14 + Math.random() * 10), -6).multiplyScalar(1 / s.dur);
      }
      if (s.t < 0) {
        g.visible = false;
        return;
      }
      const k = s.t / s.dur;
      g.visible = true;
      g.position.copy(s.from).addScaledVector(s.dir, s.t);
      const mat = (g.children[0] as THREE.Sprite).material as THREE.SpriteMaterial;
      mat.opacity = Math.sin(k * Math.PI) * 0.9;
    });
  });

  return (
    <>
      {states.current.map((_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} visible={false}>
          <sprite scale={[7, 0.35, 1]}>
            <spriteMaterial
              map={tex}
              transparent
              depthWrite={false}
              opacity={0}
              blending={THREE.AdditiveBlending}
              rotation={-0.45}
              fog={false}
            />
          </sprite>
        </group>
      ))}
    </>
  );
}
