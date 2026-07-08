import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { starVertex, starFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { warpAmount, damp } from '../lib/flightPath';
import { makeNebulaTexture, makeGlowSprite } from './textures';

const WHITE = new THREE.Color('#ffffff');
const WARMWHITE = new THREE.Color('#f2ede4');
const COOLWHITE = new THREE.Color('#e3e8f2');

/** Thousands of stars along the flight corridor. Cursor bends the field. */
export function Starfield({ count = 3800 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();

    // real starfields aren't uniform noise — a real galaxy reads as a dense
    // band across the sky, with individually-fainter stars packed into it.
    // ~40% of stars cluster into a tilted band wrapping the flight corridor;
    // the rest stay scattered, so the band reads as texture, not a hard edge.
    const BAND_ANGLE = 0.35;
    const BAND_SHARE = 0.4;

    for (let i = 0; i < count; i++) {
      const inBand = Math.random() < BAND_SHARE;
      let angle: number;
      if (inBand) {
        // sum-of-uniforms approximates a tight gaussian spread around the band
        const spread = (Math.random() + Math.random() + Math.random() - 1.5) * 0.3;
        angle = BAND_ANGLE + spread;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      const radius = 10 + Math.pow(Math.random(), 0.6) * 130;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      positions[i * 3 + 2] = 60 - Math.random() * 400;

      // band stars are numerous but individually smaller — a dense haze,
      // not a scatter of bright points
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
    // stars react to the cursor — the whole field leans, gently
    g.rotation.y = damp(g.rotation.y, mouse.x * 0.016, 1.3, delta);
    g.rotation.x = damp(g.rotation.x, -mouse.y * 0.011, 1.3, delta);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

/** Hyperspace streaks — visible only during the final rush. */
export function WarpLines({ count = 240 }: { count?: number }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 9;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = -128 - Math.random() * 150;
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
 * Distant nebulae — a handful of huge, soft fbm clouds far behind the
 * corridor. Silver-gray veils drifting almost
 * imperceptibly. This is what turns "black" into "space".
 */
export function Nebulae() {
  const group = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    const defs = [
      { inner: '#d6d6d6', outer: '#1c1c1e', pos: [-70, 26, -60], scale: 95, seed: 3 },
      { inner: '#aab2bd', outer: '#131417', pos: [80, -20, -140], scale: 120, seed: 11 },
      { inner: '#eaeaea', outer: '#191a1c', pos: [55, 34, -220], scale: 100, seed: 19 },
      { inner: '#9aa1ad', outer: '#101114', pos: [-85, -30, -260], scale: 130, seed: 27 },
    ] as const;
    return defs.map((c) => ({ ...c, tex: makeNebulaTexture(c.inner, c.outer, c.seed) }));
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { mouse, reducedMotion } = useUniverse.getState();
    if (reducedMotion) return;
    // even slower than the stars — deepest parallax layer
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
            opacity={0.34}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/**
 * Shooting stars — every few seconds one streaks across the deep field.
 * Small, rare, and therefore precious.
 */
export function ShootingStars() {
  const refs = useRef<Array<THREE.Group | null>>([]);
  const states = useRef(
    Array.from({ length: 3 }, (_, i) => ({
      t: -3 - i * 4, // staggered start delays
      dur: 1.4,
      from: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    })),
  );

  const tex = useMemo(() => makeGlowSprite('#f5f3ee'), []);

  useFrame((state, delta) => {
    const { reducedMotion, progress } = useUniverse.getState();
    const camZ = state.camera.position.z;
    states.current.forEach((s, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (reducedMotion || progress > 0.86) {
        g.visible = false;
        return;
      }
      s.t += delta;
      if (s.t > s.dur) {
        // respawn ahead of the camera, off to one side
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
      mat.opacity = Math.sin(k * Math.PI) * 0.9; // fade in, fade out
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
