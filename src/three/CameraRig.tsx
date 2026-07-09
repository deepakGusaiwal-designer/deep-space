import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../store/useUniverse';
import { samplePath, warpAmount, damp } from '../lib/flightPath';

const lookTarget = new THREE.Vector3();

/**
 * The camera IS the spacecraft. Scroll progress maps to a Catmull-Rom flight
 * path; the cursor adds a slow head-turn (cinematic parallax); the final
 * approach into the wormhole punches the fov wide and adds a gentle barrel
 * roll. Everything is damped, so motion carries inertia.
 */
export default function CameraRig() {
  const smoothed = useRef({ p: 0, fov: 52, roll: 0, mx: 0, my: 0 });

  useFrame((state, delta) => {
    const { progress, mouse, reducedMotion, enterWarp } = useUniverse.getState();
    const cam = state.camera as THREE.PerspectiveCamera;
    const s = smoothed.current;

    s.p = damp(s.p, progress, 2.6, delta);

    const here = samplePath(s.p);
    const behind = samplePath(Math.max(0, s.p - 0.02));
    const forward = samplePath(Math.min(1, s.p + 0.02));
    // central-difference tangent so the look-at never collapses at the ends
    const ahead = {
      x: here.x + (forward.x - behind.x),
      y: here.y + (forward.y - behind.y),
      z: here.z + (forward.z - behind.z),
    };

    // cursor parallax — smoothed separately and applied lightly
    const parallax = reducedMotion ? 0 : 1;
    s.mx = damp(s.mx, mouse.x * parallax, 1.8, delta);
    s.my = damp(s.my, mouse.y * parallax, 1.8, delta);

    cam.position.set(here.x + s.mx * 0.16, here.y + s.my * 0.1, here.z);

    lookTarget.set(ahead.x + s.mx * 0.4, ahead.y + s.my * 0.26, ahead.z);
    cam.lookAt(lookTarget);

    // a gentle roll only as we spiral into the wormhole throat
    const warp = warpAmount(progress);
    const sway = reducedMotion ? 0 : warp * (Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + warp * 1.4);
    s.roll = damp(s.roll, sway, 2.2, delta);
    cam.rotation.z += s.roll + enterWarp * 0.22;

    // fov widens on approach + on the one-shot loader warp
    s.fov = damp(s.fov, here.fov + enterWarp * 26, 2.2, delta);
    if (Math.abs(cam.fov - s.fov) > 0.01) {
      cam.fov = s.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
