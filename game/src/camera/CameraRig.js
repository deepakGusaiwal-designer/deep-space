/**
 * CameraRig — third-person cinematic camera.
 * Smooth follow, mouse orbit, velocity look-ahead, speed-based zoom,
 * collision (never clips through architecture) and GSAP cinematics
 * for intros / level-complete orbits.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { SETTINGS } from '../config/settings.js';
import { clamp, damp } from '../utils/math.js';

const C = SETTINGS.camera;

const _desired = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _rayDir = new THREE.Vector3();

export class CameraRig {
  constructor(camera, input) {
    this.camera = camera;
    this.input = input;

    this.yaw = 0;
    this.pitch = 0.20;
    this.distance = C.distance;
    this.cinematic = false;          // while true, GSAP owns the camera

    this.focus = new THREE.Vector3(); // smoothed player position
    this._zoom = 0;                   // speed-based zoom, smoothed
    this._raycaster = new THREE.Raycaster();
    this._fovTween = null;
  }

  snapTo(playerPos, yaw = 0) {
    this.yaw = yaw;
    this.pitch = 0.20;
    this.focus.copy(playerPos);
    this._place(playerPos, null, 1);
  }

  shake(amount = 0.6, duration = 0.45) {
    const shakeObj = { val: amount };
    gsap.to(shakeObj, {
      val: 0,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        const sx = (Math.random() - 0.5) * shakeObj.val;
        const sy = (Math.random() - 0.5) * shakeObj.val;
        this.camera.position.x += sx;
        this.camera.position.y += sy;
      },
    });
  }

  /**
   * @param {Player} player
   * @param {THREE.Object3D} solids  meshes the camera must not clip through
   */
  update(dt, player, solids) {
    if (this.cinematic) return;

    // --- orbit from mouse -------------------------------------------
    const m = this.input.consumeMouse();
    this.yaw -= m.x * C.sensitivity;
    this.pitch = clamp(this.pitch + m.y * C.sensitivity, C.minPitch, C.maxPitch);

    // --- smoothed focus + look-ahead ---------------------------------
    const k = damp(C.followLerp, dt);
    this.focus.lerp(player.position, k);

    const speed = Math.hypot(player.velocity.x, player.velocity.z);
    const speedT = clamp(speed / SETTINGS.player.sprintSpeed, 0, 1);
    this._zoom += (speedT * C.zoomBySpeed - this._zoom) * damp(2.5, dt);

    // dynamic FOV on sprint, jetpack flight, or Speed of Light hyperdrive
    const isLightSpeed = player.isLightSpeed || (player.warpIntensity > 0.4);
    const isFlightBoosting = player.jetpackActive && (this.input.sprinting || speedT > 0.7);
    const wantFov = isLightSpeed
      ? (C.warpFov ?? 92)
      : isFlightBoosting
      ? (C.flightFov ?? 76)
      : this.input.sprinting && speedT > 0.6
      ? C.sprintFov
      : C.fov;

    if (Math.abs(this.camera.fov - wantFov) > 0.1 && !this._fovTween?.isActive()) {
      this._fovTween = gsap.to(this.camera, {
        fov: wantFov, duration: isLightSpeed ? 0.4 : 0.7, ease: 'sine.out', overwrite: 'auto',
        onUpdate: () => this.camera.updateProjectionMatrix(),
      });
    }

    _lookTarget.copy(this.focus);
    if (speed > 0.5) {
      _offset.set(player.velocity.x, player.velocity.y * 0.4, player.velocity.z)
        .normalize()
        .multiplyScalar(C.lookAhead * speedT);
      _lookTarget.add(_offset);
    }

    this._place(_lookTarget, solids, damp(12, dt));
    player.cameraYaw = this.yaw;
    player.cameraPitch = this.pitch;
  }

  _place(target, solids, lerpK) {
    const dist = this.distance + this._zoom;
    _offset.set(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    ).multiplyScalar(dist);

    _desired.copy(target).add(_offset);
    _desired.y += (C.height || 3.4);

    // --- camera collision: only pull in if a true obstacle blocks view ---
    if (solids) {
      _rayDir.copy(_desired).sub(target);
      const len = _rayDir.length();
      _rayDir.divideScalar(len);

      const rayStart = target.clone();
      rayStart.y += 1.4; // elevated above ground to avoid platform collision
      this._raycaster.set(rayStart, _rayDir);
      this._raycaster.far = len;
      const hits = this._raycaster.intersectObject(solids, true);
      if (hits.length && hits[0].distance > 3.5 && hits[0].distance < len) {
        const d = Math.max(4.0, hits[0].distance - (C.collisionRadius || 0.4));
        _desired.copy(rayStart).addScaledVector(_rayDir, d);
      }
    }

    this.camera.position.lerp(_desired, lerpK);
    _lookTarget.copy(target);
    _lookTarget.y += 1.2;
    this.camera.lookAt(_lookTarget);
  }

  /* ---------------- GSAP cinematics -------------------------------- */

  /** Sweeping descent used when a level starts. Resolves when done. */
  intro(playerPos, duration = 2.8) {
    this.cinematic = true;
    const cam = this.camera;
    const start = {
      x: playerPos.x + 26, y: playerPos.y + 20, z: playerPos.z + 26,
    };
    cam.position.set(start.x, start.y, start.z);

    return new Promise((resolve) => {
      const proxy = { t: 0 };
      const end = new THREE.Vector3();
      gsap.to(proxy, {
        t: 1, duration, ease: 'power3.inOut',
        onUpdate: () => {
          const t = proxy.t;
          // spiral in toward the default follow position
          const ang = Math.PI * 0.75 * (1 - t);
          const dist = 26 - (26 - C.distance) * t;
          const h = 20 - (20 - C.height * 1.6) * t;
          cam.position.set(
            playerPos.x + Math.sin(ang) * dist,
            playerPos.y + h,
            playerPos.z + Math.cos(ang) * dist,
          );
          end.copy(playerPos);
          end.y += C.height * 0.35;
          cam.lookAt(end);
        },
        onComplete: () => {
          this.yaw = 0;
          this.pitch = 0.42;
          this.focus.copy(playerPos);
          this.cinematic = false;
          resolve();
        },
      });
    });
  }

  /** Slow orbit around the player — menu backdrop / LEVEL COMPLETE. */
  orbit(playerPos, { dist = 11, h = 6 } = {}) {
    this.cinematic = true;
    const cam = this.camera;
    const proxy = { ang: this.yaw, dist: this.distance + this._zoom, h: 4.5 };
    const look = new THREE.Vector3();
    this._orbitTween = gsap.to(proxy, {
      ang: this.yaw + Math.PI * 2, duration: 16, repeat: -1, ease: 'none',
      onUpdate: () => {
        cam.position.set(
          playerPos.x + Math.sin(proxy.ang) * proxy.dist,
          playerPos.y + proxy.h,
          playerPos.z + Math.cos(proxy.ang) * proxy.dist,
        );
        look.copy(playerPos);
        look.y += 1;
        cam.lookAt(look);
      },
    });
    gsap.to(proxy, { dist, h, duration: 3, ease: 'sine.inOut' });
  }

  endOrbit() {
    this._orbitTween?.kill();
    this._orbitTween = null;
    this.cinematic = false;
  }
}
