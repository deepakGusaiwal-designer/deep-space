import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../store/useUniverse';
import { WORLDS } from '../lib/flightPath';
import { makePlanetTexture, makeBumpTexture } from './textures';

/**
 * The asteroid belt — an instanced field of irregular rocks slashing
 * diagonally across the corridor (lower-left → upper-right), centred on
 * WORLDS.beltZ. Each rock tumbles on its own axis and drifts independently,
 * so the belt feels alive rather than placed. One draw call for the lot.
 */

const AXIS = new THREE.Vector3();
const Q = new THREE.Quaternion();
const M = new THREE.Matrix4();
const POS = new THREE.Vector3();
const SCL = new THREE.Vector3();

interface Rock {
  base: THREE.Vector3;
  drift: THREE.Vector3;
  axis: THREE.Vector3;
  spin: number;
  phase: number;
  scale: number;
  baseQuat: THREE.Quaternion;
}

export default function AsteroidBelt({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const { map, bump } = useMemo(
    () => ({
      map: makePlanetTexture('rocky', { deep: '#241d18', base: '#6d5f52', high: '#b3a596', accent: '#877462' }, 12),
      bump: makeBumpTexture(12),
    }),
    [],
  );

  const rocks = useMemo<Rock[]>(() => {
    const arr: Rock[] = [];
    // the belt runs along a diagonal line through the corridor
    const from = new THREE.Vector3(-26, -13, WORLDS.beltZ + 26);
    const to = new THREE.Vector3(26, 13, WORLDS.beltZ - 26);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const along = from.clone().lerp(to, t);
      // scatter perpendicular to the belt so it reads as a band, not a wire
      const scatter = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 14,
      );
      const base = along.add(scatter);
      const s = 0.12 + Math.pow(Math.random(), 2.3) * 1.1;
      arr.push({
        base,
        drift: new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.6,
        ),
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        spin: (Math.random() - 0.5) * 0.7,
        phase: Math.random() * Math.PI * 2,
        scale: s,
        baseQuat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28),
        ),
      });
    }
    return arr;
  }, [count]);

  // seed the instance matrices once
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    rocks.forEach((r, i) => {
      SCL.set(r.scale, r.scale * (0.7 + Math.random() * 0.5), r.scale);
      M.compose(r.base, r.baseQuat, SCL);
      mesh.setMatrixAt(i, M);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [rocks]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const { reducedMotion } = useUniverse.getState();
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i];
      // independent tumble
      AXIS.copy(r.axis);
      Q.setFromAxisAngle(AXIS, t * r.spin);
      Q.multiply(r.baseQuat);
      // gentle independent drift
      POS.set(
        r.base.x + Math.sin(t * 0.15 + r.phase) * r.drift.x,
        r.base.y + Math.cos(t * 0.13 + r.phase) * r.drift.y,
        r.base.z + Math.sin(t * 0.11 + r.phase * 1.3) * r.drift.z,
      );
      SCL.setScalar(r.scale);
      M.compose(POS, Q, SCL);
      mesh.setMatrixAt(i, M);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        map={map}
        bumpMap={bump}
        bumpScale={0.5}
        roughness={1}
        metalness={0}
        emissive="#1a140f"
        emissiveIntensity={0.35}
        flatShading
      />
    </instancedMesh>
  );
}
