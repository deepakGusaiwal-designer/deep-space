import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { horizonVertex, horizonFragment } from './shaders/glsl';
import { useUniverse } from '../store/useUniverse';
import { HOLE_CENTER } from './BlackHole';
import { horizonAmount, horizonDepth, damp, smoothstep } from '../lib/flightPath';

/** how far in front of the camera the veil floats — just past the near plane */
const DIST = 0.6;
/** the projected center can race off to infinity at grazing angles — leash it */
const MAX_OFFSET = 1.1;
/**
 * Apparent radius of the hole's shadow, in world units — where its photon
 * ring sits, and so where our ring must be born to look like the same object.
 *
 * The raymarch integrates acc = -1.5·h²·r̂/r⁴, i.e. u'' + u = 3Mu² with M=0.5,
 * which puts the horizon at r=1 (matching its HORIZON) and the critical
 * impact parameter at b = 3√3·M ≈ 2.598.
 */
const PHOTON_R = 2.598;
/** once past the hole, the ring keeps opening at this rate per unit of depth */
const OPEN_RATE = 2.6;
/**
 * The true apparent radius diverges as we close on the hole (it is 1/dist),
 * so left alone the ring is already past the corners of the screen before the
 * veil has even faded up. Hold it near the frame edge instead, and let the
 * steady opening above carry it off screen once we are actually through.
 */
const MAX_RING = 1.35;

const forward = new THREE.Vector3();
const projected = new THREE.Vector3();
const targetCenter = new THREE.Vector2();

/**
 * The moment of crossing.
 *
 * BlackHole renders the hole as seen from outside. This renders what the
 * *inside of your eye* does as you pass through its horizon: the photon ring
 * sweeps outward past you, light tears into radial streaks, vision crushes
 * to a shrinking aperture, and the whole frame slides from blueshift to red.
 *
 * A single screen-space quad pinned to the camera. It only exists for the
 * scroll window either side of the horizon — the rest of the journey it is
 * invisible and skipped entirely.
 */
export default function EventHorizon() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: horizonVertex,
        fragmentShader: horizonFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uCross: { value: 0 },
          uDepth: { value: 0 },
          uAspect: { value: 1 },
          uCenter: { value: new THREE.Vector2() },
          uRing: { value: 0 },
        },
      }),
    [],
  );

  // the last on-screen position of the hole while it was still in front of
  // us. Once we are past it, projection is meaningless — we hold this.
  const lastCenter = useRef(new THREE.Vector2());
  // and the ring's radius at the moment we passed it, with the depth we were
  // at — after that the ring opens on its own rather than by projection
  const passed = useRef({ radius: 0, depth: 0, behind: false });

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { progress, reducedMotion } = useUniverse.getState();
    const cam = state.camera as THREE.PerspectiveCamera;
    const c = material.uniforms.uCenter.value as THREE.Vector2;

    // ── where is the hole on screen? ──
    // The flight path slips past the hole off-center, so a viewport-centered
    // ring would visibly detach from the thing it belongs to. While the hole
    // is still ahead of us, track its projection.
    //
    // Then, as we sink in, slide the anchor back to the middle of the frame:
    // by the time we are crossing, the hole is no longer an object out there
    // in front of us, it is all around us — and its light closes in along our
    // direction of travel. This also keeps the ring on screen; the raw
    // projection races off past the viewport the instant the camera passes
    // the hole's z, which left the ring centered somewhere off to the side.
    //
    // Computed before the visibility gate so the center is already correct on
    // the first frame the veil appears, instead of sliding in from center.
    const depth = horizonDepth(progress);
    projected.copy(HOLE_CENTER).project(cam);
    const inFront = projected.z < 1 && Number.isFinite(projected.x) && Number.isFinite(projected.y);

    // ── the ring's radius ──
    // While the hole is ahead, the ring simply *is* its photon ring: project
    // the photon radius through the same perspective the hole is drawn with,
    // so the two coincide on screen. The instant we pass it, that projection
    // inverts, so we hand off to a steady opening driven by depth.
    const p = passed.current;
    if (inFront) {
      const dist = Math.max(0.001, cam.position.distanceTo(HOLE_CENTER));
      const halfFov = THREE.MathUtils.degToRad(cam.fov * 0.5);
      // NDC-height units: 1.0 is half the viewport height
      const apparent = PHOTON_R / dist / Math.tan(halfFov);
      p.radius = Math.min(apparent, MAX_RING);
      p.depth = depth;
      p.behind = false;
    } else {
      if (!p.behind) p.behind = true;
      p.radius = Math.min(4.5, p.radius + Math.max(0, depth - p.depth) * OPEN_RATE);
      p.depth = depth;
    }

    if (inFront) {
      lastCenter.current.set(
        THREE.MathUtils.clamp(projected.x, -MAX_OFFSET, MAX_OFFSET),
        THREE.MathUtils.clamp(projected.y, -MAX_OFFSET, MAX_OFFSET),
      );
    }
    // Pinned to the hole while it is still the thing you are looking at, then
    // pulled to the middle of the frame *early* — by the time the ring is
    // bright it must be a ring around you, not an arc swinging in from a
    // center parked off-screen beside you.
    const anchor = 1 - smoothstep(0.02, 0.3, depth);
    targetCenter.set(lastCenter.current.x * anchor, lastCenter.current.y * anchor);

    // reduced motion keeps the crossing legible but calm: no tidal streaks
    // worth speaking of, and the aperture never fully closes
    const target = horizonAmount(progress) * (reducedMotion ? 0.35 : 1);
    const wasHidden = material.uniforms.uCross.value <= 0.004;
    const cross = damp(material.uniforms.uCross.value, target, 6, delta);
    material.uniforms.uCross.value = cross;

    m.visible = cross > 0.004;
    if (!m.visible) {
      // stay pinned to the hole while dormant, so we never slide in
      c.copy(targetCenter);
      return;
    }
    if (wasHidden) c.copy(targetCenter);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uDepth.value = depth;
    material.uniforms.uRing.value = p.radius;
    material.uniforms.uAspect.value = state.size.width / state.size.height;

    // damped only once live — smooths the handover from hole to frame center
    c.x = damp(c.x, targetCenter.x, 5, delta);
    c.y = damp(c.y, targetCenter.y, 5, delta);

    // pin the quad to the camera and scale it to exactly fill the frustum
    forward.set(0, 0, -1).applyQuaternion(cam.quaternion);
    m.position.copy(cam.position).addScaledVector(forward, DIST);
    m.quaternion.copy(cam.quaternion);

    const h = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5));
    // 2% overscan so no seam shows at the edges when the fov punches wide
    m.scale.set(h * material.uniforms.uAspect.value * 1.02, h * 1.02, 1);
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={999} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
