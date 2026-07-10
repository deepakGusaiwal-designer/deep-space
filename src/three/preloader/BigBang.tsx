import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stage, T } from '../../lib/preloaderScript';
import { smoothstep } from '../../lib/flightPath';
import {
  quadVertex,
  singularityFragment,
  particleVertex,
  particleFragment,
  shockwaveFragment,
} from './shaders';

/** Scene 01 — the point of light, alone in the dark. */
export function Singularity() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: singularityFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPulse: { value: 0 }, uAlpha: { value: 0 } },
      }),
    [],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = stage.t;

    // it exists only until it detonates
    const alpha = smoothstep(0.04, 0.5, t) * (1 - smoothstep(T.bang - 0.02, T.bang + 0.05, t));
    material.uniforms.uAlpha.value = alpha;
    material.uniforms.uTime.value = t;
    // the trembling builds through Scene 01 and peaks as it goes
    material.uniforms.uPulse.value = smoothstep(0.55, T.bang, t);

    m.visible = alpha > 0.004;
    if (!m.visible) return;

    m.quaternion.copy(state.camera.quaternion);
    // the abrupt inward draw in the last tenth of a second
    const collapse = smoothstep(T.collapse, T.bang, t);
    const jitter = smoothstep(0.8, T.bang, t);
    m.scale.setScalar(THREE.MathUtils.lerp(2.4, 0.9, collapse * collapse));
    m.position.set(
      (Math.random() - 0.5) * 0.05 * jitter,
      (Math.random() - 0.5) * 0.05 * jitter,
      0,
    );
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={20} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/** Scene 02 — a hundred thousand motes of matter, thrown outward. */
export function BigBangField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const dir = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // even distribution over the sphere, so the shell has no poles
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      dir[i * 3] = s * Math.cos(th);
      dir[i * 3 + 1] = s * Math.sin(th);
      dir[i * 3 + 2] = u;
      // most matter is slow; a few shards are violent. Capped so the shell
      // stays ahead of the camera and the fireball is a thing we watch,
      // not a dust storm we are inside of. Kept low (with the drag K in the
      // vertex shader) so the eruption is seen leaving the single point —
      // the first beat of the blast is the point itself swelling open.
      speed[i] = 0.18 + Math.pow(Math.random(), 0.6) * 1.32;
      phase[i] = Math.random();
    }
    // position is unused (the vertex shader builds it) but three wants one
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uT: { value: -1 }, uPixelRatio: { value: 1 }, uFade: { value: 1 } },
      }),
    [],
  );

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = stage.t;
    material.uniforms.uT.value = t - T.bang;
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
    // the debris dims as stars take over the storytelling — it has to be
    // gone before the hole gathers, not still boiling over it
    material.uniforms.uFade.value = 1 - smoothstep(T.universe + 0.4, T.hole - 0.4, t);
    p.visible = t > T.bang - 0.05 && material.uniforms.uFade.value > 0.01;
  });

  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} visible={false} />
  );
}

interface WaveSpec {
  /** when it leaves the singularity, seconds after the bang */
  at: number;
  /** how fast it opens, in NDC-ish units per second */
  rate: number;
  width: number;
  peak: number;
}

const WAVES: WaveSpec[] = [
  { at: 0.0, rate: 0.36, width: 0.05, peak: 1.0 },
  { at: 0.3, rate: 0.25, width: 0.09, peak: 0.6 },
  { at: 0.8, rate: 0.16, width: 0.15, peak: 0.32 },
];

/** Scene 02 — shells of compressed light rippling out across space. */
export function Shockwaves() {
  const group = useRef<THREE.Group>(null);

  const items = useMemo(
    () =>
      WAVES.map(
        (w) =>
          [
            w,
            new THREE.ShaderMaterial({
              vertexShader: quadVertex,
              fragmentShader: shockwaveFragment,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              uniforms: {
                uRadius: { value: 0 },
                uWidth: { value: w.width },
                uAlpha: { value: 0 },
              },
            }),
          ] as const,
      ),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const since = stage.t - T.bang;
    g.visible = since > -0.05 && since < 6.0;
    if (!g.visible) return;
    g.quaternion.copy(state.camera.quaternion);

    items.forEach(([w, mat], i) => {
      const life = since - w.at;
      const child = g.children[i];
      if (life <= 0) {
        child.visible = false;
        return;
      }
      child.visible = true;
      // opens, then coasts; fades on a curve so it never just vanishes
      const r = (1 - Math.exp(-w.rate * life)) * 1.35;
      mat.uniforms.uRadius.value = r;
      mat.uniforms.uAlpha.value = w.peak * Math.exp(-life * 0.5);
    });
  });

  return (
    <group ref={group} renderOrder={18} visible={false}>
      {items.map(([, mat], i) => (
        <mesh key={i} material={mat} frustumCulled={false}>
          <planeGeometry args={[46, 46]} />
        </mesh>
      ))}
    </group>
  );
}
