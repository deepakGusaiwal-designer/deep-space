import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../store/useUniverse';
import { samplePath, dilationAmount, warpAmount, damp, smoothstep } from '../lib/flightPath';

const lookTarget = new THREE.Vector3();

/**
 * The camera IS the visitor. Scroll progress maps to a Catmull-Rom
 * flight path; the cursor adds a subtle head-turn; the mid-journey
 * "time dilation" softens all damping so motion feels heavier.
 */
export default function CameraRig() {
  const smoothed = useRef({ p: 0, fov: 52, roll: 0, mx: 0, my: 0 });

  useFrame((state, delta) => {
    const { progress, mouse, reducedMotion, enterWarp } = useUniverse.getState();
    const cam = state.camera as THREE.PerspectiveCamera;
    const s = smoothed.current;

    // time dilation: near the middle, the camera responds slower — heavier
    const dilation = dilationAmount(progress);
    const lambda = 2.6 - dilation * 1.8;
    s.p = damp(s.p, progress, lambda, delta);

    const here = samplePath(s.p);
    const behind = samplePath(Math.max(0, s.p - 0.02));
    const forward = samplePath(Math.min(1, s.p + 0.02));
    // central-difference tangent, not a raw forward sample: at either end of
    // the path "forward" clamps to the same point as "here" (or "behind"
    // does, at the start), which would make the look-at direction collapse
    // to zero and send the camera's orientation erratic once scroll settles
    // at the bottom of the page
    const ahead = {
      x: here.x + (forward.x - behind.x),
      y: here.y + (forward.y - behind.y),
      z: here.z + (forward.z - behind.z),
    };

    // the cursor is smoothed separately and applied very lightly —
    // a slow head-turn, never a shake
    const parallax = reducedMotion ? 0 : 1;
    s.mx = damp(s.mx, mouse.x * parallax, 1.8, delta);
    s.my = damp(s.my, mouse.y * parallax, 1.8, delta);

    cam.position.set(here.x + s.mx * 0.14, here.y + s.my * 0.09, here.z);

    lookTarget.set(ahead.x + s.mx * 0.4, ahead.y + s.my * 0.26, ahead.z);
    cam.lookAt(lookTarget);

    // one full, slow barrel roll through the tunnel: 360° spread across
    // the testimonial orbit and the exit (p 0.78 → 1), eased at both ends
    const rollT = smoothstep(0.78, 1.0, progress);
    const barrel = rollT * Math.PI * 2;
    // plus a faint living sway while inside
    const warp = warpAmount(progress);
    const sway = warp * Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    s.roll = damp(s.roll, barrel + sway, 2.2, delta);
    cam.rotation.z += s.roll;

    // the wormhole opening punches the fov wide + a touch of roll — the
    // one-shot surge behind the "Enter the void" transition
    s.fov = damp(s.fov, here.fov + enterWarp * 26, 2.2, delta);
    cam.rotation.z += enterWarp * 0.22;
    if (Math.abs(cam.fov - s.fov) > 0.01) {
      cam.fov = s.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
