import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { atmosphereVertex, atmosphereFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { damp, WORLDS } from '../lib/flightPath';
import {
  makePlanetTexture,
  makeBumpTexture,
  makeRingTexture,
  makeGlowSprite,
  type PlanetStyle,
} from './textures';

/* ────────────────────────────────────────────────────────────────
 * The real worlds of the journey. Every surface is painted procedurally
 * at boot (textures.ts) — no downloads, no network. Each world sits at a
 * fixed anchor from flightPath.WORLDS so the camera flies past them in
 * order: Earth → Mars → (belt) → Saturn.
 * ──────────────────────────────────────────────────────────────── */

/** RingGeometry maps UVs planar — remap u to the radial fraction so a 1-D
 *  band texture (Saturn-style gaps) wraps as concentric rings. */
function radialRingGeometry(inner: number, outer: number, segments = 128): THREE.RingGeometry {
  const geo = new THREE.RingGeometry(inner, outer, segments);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  return geo;
}

interface WorldDef {
  id: string;
  position: THREE.Vector3;
  radius: number;
  style: PlanetStyle;
  palette: { deep: string; base: string; high: string; accent: string };
  atmosphere: string;
  glow: string;
  tilt: number;
  spin: number;
  seed: number;
  ring?: { tint: string; inner: number; outer: number };
}

const WORLD_DEFS: WorldDef[] = [
  {
    id: 'earth',
    position: WORLDS.earth,
    radius: 3.4,
    style: 'terra',
    palette: { deep: '#0a2f5e', base: '#3f6b3a', high: '#eef3f6', accent: '#2a6b8f' },
    atmosphere: '#5da6ff',
    glow: '#7fb4ff',
    tilt: 0.41,
    spin: 0.05,
    seed: 23,
  },
  {
    id: 'mars',
    position: WORLDS.mars,
    radius: 2.4,
    style: 'rocky',
    palette: { deep: '#5a1f10', base: '#b05a32', high: '#e8b489', accent: '#7d3b1e' },
    atmosphere: '#e07a44',
    glow: '#ff8a55',
    tilt: 0.44,
    spin: 0.06,
    seed: 67,
  },
  {
    id: 'saturn',
    position: WORLDS.saturn,
    radius: 3.0,
    style: 'banded',
    palette: { deep: '#8a6b34', base: '#c6a566', high: '#efe1bc', accent: '#e0c48c' },
    atmosphere: '#e8d6a4',
    glow: '#f0dca6',
    tilt: 0.47,
    spin: 0.09,
    seed: 91,
    ring: { tint: '#d8c8a4', inner: 1.45, outer: 2.5 },
  },
];

function JourneyWorld({ def }: { def: WorldDef }) {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const active = useRef(0);
  const setHoveredWorld = useUniverse((s) => s.setHoveredWorld);

  const { map, bump, atmoMat, glowTex, ringTex, ringGeo } = useMemo(() => {
    const ringTex = def.ring ? makeRingTexture(def.ring.tint, def.seed) : null;
    return {
      map: makePlanetTexture(def.style, def.palette, def.seed),
      bump: makeBumpTexture(def.seed),
      glowTex: makeGlowSprite(def.glow),
      ringTex,
      ringGeo: def.ring
        ? radialRingGeometry(def.radius * def.ring.inner, def.radius * def.ring.outer)
        : null,
      atmoMat: new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(def.atmosphere) } },
      }),
    };
  }, [def]);

  useFrame((state, delta) => {
    const planet = planetRef.current;
    if (!planet) return;
    const { hoveredWorld, mouse, reducedMotion } = useUniverse.getState();
    const t = state.clock.elapsedTime;

    // slow axial rotation + a gentle lean toward the cursor
    if (!reducedMotion) {
      planet.rotation.y = t * def.spin + mouse.x * 0.25;
      planet.rotation.x = damp(planet.rotation.x, def.tilt - mouse.y * 0.14, 2, delta);
    }

    // hover: ease a highlight + halo in and out
    const target = hoveredWorld === def.id ? 1 : 0;
    active.current = damp(active.current, target, 6, delta);

    const mesh = meshRef.current;
    if (mesh) {
      const s = 1 + active.current * 0.06;
      mesh.scale.setScalar(s);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.32 + active.current * 0.5;
    }
    const glow = glowRef.current;
    if (glow) {
      (glow.material as THREE.SpriteMaterial).opacity = 0.14 + active.current * 0.45;
      glow.scale.setScalar(def.radius * (3.4 + active.current * 1.4));
    }
  });

  return (
    <group position={def.position}>
      <sprite ref={glowRef} scale={def.radius * 3.4}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </sprite>

      <group ref={planetRef} rotation={[def.tilt, 0, def.tilt * 0.3]}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredWorld(def.id);
          }}
          onPointerOut={() => setHoveredWorld(null)}
        >
          <sphereGeometry args={[def.radius, 64, 48]} />
          <meshStandardMaterial
            map={map}
            bumpMap={bump}
            bumpScale={def.style === 'rocky' ? 0.7 : 0.4}
            emissive="#ffffff"
            emissiveMap={map}
            emissiveIntensity={0.32}
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* fresnel atmosphere hugging the limb */}
        <mesh material={atmoMat} scale={1.04}>
          <sphereGeometry args={[def.radius, 48, 32]} />
        </mesh>

        {ringGeo && ringTex && (
          <mesh geometry={ringGeo} rotation={[Math.PI / 2.15, 0, 0]}>
            <meshBasicMaterial
              map={ringTex}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
              opacity={0.9}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

export default function JourneyWorlds() {
  return (
    <group>
      {WORLD_DEFS.map((def) => (
        <JourneyWorld key={def.id} def={def} />
      ))}
    </group>
  );
}
