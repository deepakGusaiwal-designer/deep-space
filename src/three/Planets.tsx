import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sunVertex, sunFragment, atmosphereVertex, atmosphereFragment } from './shaders/glsl';
import { disciplines } from '../content/portfolio';
import { useUniverse } from '../store/useUniverse';
import { damp, swallowAmount } from '../lib/flightPath';
import {
  makePlanetTexture,
  makeBumpTexture,
  makeRingTexture,
  makeGlowSprite,
  type PlanetStyle,
} from './textures';

/* ────────────────────────────────────────────────────────────────
 * Real worlds for the journey. Every surface is painted procedurally
 * at boot (textures.ts) — no downloads. Two families:
 *   SkillGalaxy    — the four disciplines orbiting mid-journey,
 *                    hover-linked both ways with the DOM cards.
 *   JourneyPlanets — silent decorative worlds drifting past the
 *                    history corridor, so space feels inhabited.
 * ──────────────────────────────────────────────────────────────── */

/** RingGeometry maps UVs planar — remap u to the radial fraction so the
 *  1-D band texture (Saturn-style gaps) wraps as concentric rings. */
function radialRingGeometry(inner: number, outer: number, segments = 96): THREE.RingGeometry {
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

/** muted, believable palettes — one per discipline, desaturated to sit
 *  inside the monochrome universe without shouting */
const SKILL_LOOKS: Array<{ style: PlanetStyle; deep: string; base: string; high: string; accent: string }> = [
  { style: 'ice',    deep: '#2a3138', base: '#8d99a6', high: '#e8edf2', accent: '#aebfcc' }, // Photographie
  { style: 'banded', deep: '#4a3628', base: '#a08466', high: '#d9c8ae', accent: '#e0a878' }, // Vidéo & Motion
  { style: 'terra',  deep: '#1d2b33', base: '#5d7263', high: '#b8c4b0', accent: '#48626e' }, // UX Design
  { style: 'rocky',  deep: '#26221f', base: '#7d7268', high: '#c9beb2', accent: '#93826f' }, // Development
  { style: 'banded', deep: '#2c2338', base: '#7a6a96', high: '#cfc2e8', accent: '#a98fd6' }, // Animation & 3D
];

interface SkillPlanetProps {
  index: number;
}

function SkillPlanet({ index }: SkillPlanetProps) {
  const disc = disciplines[index];
  const look = SKILL_LOOKS[index % SKILL_LOOKS.length];
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const active = useRef(0);

  const { map, bump, glowTex, ringTex } = useMemo(
    () => ({
      map: makePlanetTexture(look.style, look, 40 + index * 17),
      bump: makeBumpTexture(40 + index * 17),
      glowTex: makeGlowSprite(disc.emissive),
      ringTex: look.style === 'banded' ? makeRingTexture('#cdbfa8', 8 + index) : null,
    }),
    [index, look, disc.emissive],
  );

  const ringGeo = useMemo(
    () => (ringTex ? radialRingGeometry(disc.radius * 1.45, disc.radius * 2.35) : null),
    [ringTex, disc.radius],
  );

  const phase = (index / disciplines.length) * Math.PI * 2 + 0.7;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { hoveredPlanet, galaxySpin, reducedMotion } = useUniverse.getState();
    const orbit = orbitRef.current;
    const planet = planetRef.current;
    if (!orbit || !planet) return;

    const spin = reducedMotion ? phase : t * disc.speed + phase + galaxySpin;
    orbit.position.set(Math.cos(spin) * disc.orbit, Math.sin(spin * 0.9) * 0.6, Math.sin(spin) * disc.orbit);

    if (!reducedMotion) {
      planet.rotation.y = t * 0.1 + index;
      const moons = moonsRef.current;
      if (moons) moons.rotation.y = t * (0.35 + index * 0.06);
    }

    // ease the highlight in/out — driven by card hover OR 3D pointer hover
    const isActive = hoveredPlanet === index ? 1 : 0;
    active.current = damp(active.current, isActive, 6, delta);
    const s = 1 + active.current * 0.13;
    planet.scale.setScalar(s);
    const glow = glowRef.current;
    if (glow) {
      (glow.material as THREE.SpriteMaterial).opacity = 0.16 + active.current * 0.4;
      glow.scale.setScalar(disc.radius * (4.6 + active.current * 1.6));
    }
    const mat = meshRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) mat.emissiveIntensity = 0.46 + active.current * 0.5;
  });

  const setHoveredPlanet = useUniverse((s) => s.setHoveredPlanet);

  return (
    <group ref={orbitRef}>
      <group ref={planetRef} rotation={[disc.tilt, 0, disc.tilt * 0.6]}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPlanet(index);
          }}
          onPointerOut={() => setHoveredPlanet(null)}
        >
          <sphereGeometry args={[disc.radius, 48, 32]} />
          <meshStandardMaterial
            map={map}
            bumpMap={bump}
            bumpScale={0.6}
            emissive="#ffffff"
            emissiveMap={map}
            emissiveIntensity={0.46}
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {ringGeo && ringTex && (
          <mesh geometry={ringGeo} rotation={[Math.PI / 2.25, 0, 0]}>
            <meshBasicMaterial
              map={ringTex}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
              opacity={0.85}
            />
          </mesh>
        )}

        {/* each tool is a satellite */}
        <group ref={moonsRef}>
          {disc.tools.map((tool, mi) => {
            const a = (mi / disc.tools.length) * Math.PI * 2;
            const r = disc.radius * (1.9 + mi * 0.34);
            return (
              <mesh key={tool} position={[Math.cos(a) * r, Math.sin(a * 2.3) * 0.22, Math.sin(a) * r]}>
                <sphereGeometry args={[0.05 + disc.radius * 0.04, 10, 8]} />
                <meshBasicMaterial color={disc.emissive} />
              </mesh>
            );
          })}
        </group>
      </group>

      <sprite ref={glowRef} scale={disc.radius * 4.6}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </sprite>
    </group>
  );
}

/** Center of the discipline system — the camera glides through its plane
 *  between the interlude and the testimonial orbit. */
export function SkillGalaxy() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { mouse, reducedMotion, progress, birth } = useUniverse.getState();
    if (reducedMotion) return;
    // the whole system leans toward the cursor — you can feel its mass
    g.rotation.x = damp(g.rotation.x, 0.34 - mouse.y * 0.05, 1.2, delta);
    g.rotation.z = damp(g.rotation.z, -0.1 + mouse.x * 0.04, 1.2, delta);
    // born in the big bang; claimed by the exit hole in the finale
    const sw = swallowAmount(progress);
    g.position.set(0, -1.4 * (1 - sw), -96 + (-248 - -96) * sw);
    g.scale.setScalar(Math.max(0.02, birth * (1 - sw)));
    g.rotation.y += delta * sw * 1.6; // it spins up as it falls
  });

  return (
    <group ref={group} position={[0, -1.4, -96]} rotation={[0.34, 0, -0.1]}>
      {/* faint core the planets orbit */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshBasicMaterial color="#f5f3ee" />
      </mesh>
      <pointLight color="#fff4e0" intensity={26} distance={30} decay={2} />
      {disciplines.map((_, i) => (
        <SkillPlanet key={i} index={i} />
      ))}
    </group>
  );
}

/* ── the solar system beside the history corridor ─────────────────────
 * Our own worlds, in their real colors and their real order out from
 * the Sun: Venus, Earth, Neptune. The Sun is a live shader — boiling
 * fbm granulation with limb darkening — and each planet wears a thin
 * fresnel atmosphere. No ruler lines; the orbits are told by motion.
 * In the finale the exit hole takes the whole system too. */

const SYSTEM_CENTER = new THREE.Vector3(-19, 3, -40);

const SYSTEM_WORLDS = [
  {
    name: 'Venus',
    // unbroken cream-yellow sulfuric cloud deck
    style: 'banded' as PlanetStyle,
    palette: { deep: '#9a7539', base: '#c9a05f', high: '#efe0b8', accent: '#e2c48c' },
    atmosphere: '#e8d6a4',
    orbit: 5.5,
    radius: 1.15,
    speed: 0.055,
    phase: 0.6,
    seed: 57,
    spin: -0.02, // Venus turns backwards, slowly
  },
  {
    name: 'Earth',
    // blue oceans, green-brown continents, white cloud streaks + caps
    style: 'terra' as PlanetStyle,
    palette: { deep: '#0a3060', base: '#3f6339', high: '#e9eef2', accent: '#2a6b8f' },
    atmosphere: '#5da6ff',
    orbit: 9.5,
    radius: 1.25,
    speed: 0.034,
    phase: 2.8,
    seed: 23,
    spin: 0.09,
  },
  {
    name: 'Neptune',
    // deep azure with faint storm bands
    style: 'banded' as PlanetStyle,
    palette: { deep: '#16307c', base: '#2a52c6', high: '#7fa6ee', accent: '#4a76e0' },
    atmosphere: '#4a7cff',
    orbit: 14.5,
    radius: 2.1,
    speed: 0.02,
    phase: 4.6,
    seed: 91,
    spin: 0.06,
  },
] as const;

export function SolarSystem() {
  const group = useRef<THREE.Group>(null);
  const planetRefs = useRef<Array<THREE.Group | null>>([]);

  const worlds = useMemo(
    () =>
      SYSTEM_WORLDS.map((w) => ({
        ...w,
        map: makePlanetTexture(w.style, w.palette, w.seed),
        bump: makeBumpTexture(w.seed),
        atmoMat: new THREE.ShaderMaterial({
          vertexShader: atmosphereVertex,
          fragmentShader: atmosphereFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: { uColor: { value: new THREE.Color(w.atmosphere) } },
        }),
      })),
    [],
  );

  const sunMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sunVertex,
        fragmentShader: sunFragment,
        uniforms: { uTime: { value: 0 } },
      }),
    [],
  );
  const sunGlow = useMemo(() => makeGlowSprite('#ffd9a0'), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { mouse, reducedMotion, progress, birth } = useUniverse.getState();
    const t = state.clock.elapsedTime;
    sunMat.uniforms.uTime.value = t;

    SYSTEM_WORLDS.forEach((w, i) => {
      const p = planetRefs.current[i];
      if (!p) return;
      const a = reducedMotion ? w.phase : t * w.speed + w.phase;
      p.position.set(Math.cos(a) * w.orbit, 0, Math.sin(a) * w.orbit);
      if (!reducedMotion) p.children[0].rotation.y = t * w.spin;
    });

    if (reducedMotion) return;
    // slow parallax lean toward the cursor
    g.rotation.y = damp(g.rotation.y, mouse.x * 0.01, 1, delta);

    // born with the universe; taken by the exit hole with everything else
    const sw = swallowAmount(progress);
    g.position.set(
      SYSTEM_CENTER.x * (1 - sw),
      SYSTEM_CENTER.y * (1 - sw),
      SYSTEM_CENTER.z + (-248 - SYSTEM_CENTER.z) * sw,
    );
    g.scale.setScalar(Math.max(0.02, birth * (1 - sw)));
    g.rotation.y += delta * sw * 1.2;
  });

  return (
    <group ref={group} position={SYSTEM_CENTER} scale={0.02}>
      {/* one shared ecliptic plane, gently inclined toward the corridor */}
      <group rotation={[0.42, 0, 0.1]}>
        {/* the Sun — live boiling photosphere */}
        <mesh material={sunMat}>
          <sphereGeometry args={[1.6, 48, 32]} />
        </mesh>
        <sprite scale={11}>
          <spriteMaterial
            map={sunGlow}
            transparent
            depthWrite={false}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </sprite>
        <pointLight color="#ffedd2" intensity={90} distance={70} decay={2} />

        {worlds.map((w, i) => (
          <group key={w.name} ref={(el) => { planetRefs.current[i] = el; }}>
            <group rotation={[0.15 * (i % 2 ? -1 : 1), 0, i === 1 ? 0.41 : 0.1]}>
              <mesh>
                <sphereGeometry args={[w.radius, 48, 32]} />
                <meshStandardMaterial
                  map={w.map}
                  bumpMap={w.bump}
                  bumpScale={w.style === 'terra' ? 0.5 : 0.25}
                  emissive="#ffffff"
                  emissiveMap={w.map}
                  emissiveIntensity={0.4}
                  roughness={0.95}
                  metalness={0}
                />
              </mesh>
              {/* fresnel atmosphere hugging the limb */}
              <mesh material={w.atmoMat} scale={1.05}>
                <sphereGeometry args={[w.radius, 48, 32]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
