/**
 * Player — a polished chrome sphere with momentum-based movement,
 * coyote-time jumps, rolling animation, landing squash and a soft
 * contact shadow that grounds it visually.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { SETTINGS } from '../config/settings.js';
import { damp } from '../utils/math.js';

const P = SETTINGS.player;

const _dir = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _down = new THREE.Vector3(0, -1, 0);

export class Player {
  /**
   * @param {object} deps { scene, physics, input, materials }
   * Events (assign externally): onLand(speed), onJump(), onFall()
   */
  constructor({ scene, physics, input, materials }) {
    this.physics = physics;
    this.input = input;

    this.body = {
      position: new THREE.Vector3(0, 3, 0),
      velocity: new THREE.Vector3(),
      radius: P.radius,
      grounded: false,
      groundCollider: null,
      groundNormal: null,
    };

    this.spawn = new THREE.Vector3(0, 3, 0);
    this.cameraYaw = 0;      // fed by CameraRig each frame
    this.frozen = true;      // no control during menus/cinematics
    this.paused = false;     // full physics freeze (pause menu)
    this.onLand = null;
    this.onJump = null;
    this.onFall = null;

    this._wasGrounded = false;
    this._coyote = 0;
    this._jumpBuffer = 0;
    this._fallSpeed = 0;

    // --- visuals -----------------------------------------------------
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(P.radius, 48, 32),
      materials.chrome(),
    );
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    this.shadowBlob = new THREE.Mesh(
      new THREE.PlaneGeometry(P.radius * 4.4, P.radius * 4.4),
      materials.contactShadow(),
    );
    this.shadowBlob.rotation.x = -Math.PI / 2;
    this.shadowBlob.renderOrder = 1;
    scene.add(this.shadowBlob);

    this._raycaster = new THREE.Raycaster();
    this._raycaster.far = 30;

    input.on('jump', () => { this._jumpBuffer = P.jumpBuffer; });
  }

  get position() { return this.body.position; }
  get velocity() { return this.body.velocity; }

  setSpawn(v) { this.spawn.copy(v); }

  respawn() {
    this.body.position.copy(this.spawn);
    this.body.velocity.set(0, 0, 0);
    this.body.grounded = false;
    this.body.groundCollider = null;
    this.mesh.position.copy(this.spawn);
    gsap.fromTo(this.mesh.scale, { x: 0, y: 0, z: 0 }, {
      x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(2.5)', overwrite: 'auto',
    });
  }

  /** @param {THREE.Object3D} solids world group used for the shadow raycast */
  update(dt, solids) {
    const b = this.body;

    // ---------------- steering ---------------------------------------
    if (!this.frozen) {
      const move = this.input.moveVector();
      const sprint = this.input.sprinting;
      const maxSpeed = sprint ? P.sprintSpeed : P.maxSpeed;

      // camera-relative wish direction
      const sin = Math.sin(this.cameraYaw);
      const cos = Math.cos(this.cameraYaw);
      _dir.set(move.x * cos - move.z * sin, 0, -move.z * cos - move.x * sin);

      const control = b.grounded ? 1 : P.airControl;
      b.velocity.addScaledVector(_dir, P.accel * control * dt);

      // clamp horizontal speed
      const vh = Math.hypot(b.velocity.x, b.velocity.z);
      if (vh > maxSpeed) {
        const k = maxSpeed / vh;
        b.velocity.x *= k;
        b.velocity.z *= k;
      }

      // friction / drag
      const drag = b.grounded
        ? (_dir.lengthSq() > 0 ? 0.6 : P.groundFriction)
        : P.airDrag;
      const f = Math.max(0, 1 - drag * dt);
      b.velocity.x *= f;
      b.velocity.z *= f;

      // ---------------- jumping (buffer + coyote) --------------------
      this._coyote = b.grounded ? P.coyoteTime : Math.max(0, this._coyote - dt);
      this._jumpBuffer = Math.max(0, this._jumpBuffer - dt);

      if (this._jumpBuffer > 0 && this._coyote > 0) {
        this._jumpBuffer = 0;
        this._coyote = 0;
        b.velocity.y = P.jumpVelocity;
        // inherit moving-platform velocity so jumps feel physical
        const g = b.groundCollider;
        if (g?.mesh && dt > 0) {
          b.velocity.x += (g.center.x - g.prevCenter.x) / dt;
          b.velocity.z += (g.center.z - g.prevCenter.z) / dt;
        }
        b.grounded = false;
        b.groundCollider = null;
        gsap.fromTo(this.mesh.scale,
          { x: 1.18, y: 0.82, z: 1.18 },
          { x: 1, y: 1, z: 1, duration: 0.35, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
        this.onJump?.();
      }
    } else if (b.grounded) {
      // menus / cinematics: bleed off momentum so the sphere settles
      const f = Math.max(0, 1 - P.groundFriction * dt);
      b.velocity.x *= f;
      b.velocity.z *= f;
    }

    // ---------------- physics ----------------------------------------
    if (!b.grounded) this._fallSpeed = -b.velocity.y;
    const fell = this.physics.step(b, this.paused ? 0 : dt);

    // landing feedback
    if (b.grounded && !this._wasGrounded && this._fallSpeed > SETTINGS.fx.landDustMin) {
      const impact = Math.min(1, this._fallSpeed / 26);
      gsap.fromTo(this.mesh.scale,
        { x: 1 + impact * 0.35, y: 1 - impact * 0.4, z: 1 + impact * 0.35 },
        { x: 1, y: 1, z: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      this.onLand?.(this._fallSpeed);
    }
    this._wasGrounded = b.grounded;

    // ---------------- visuals ----------------------------------------
    this.mesh.position.copy(b.position);

    // rolling: rotate around axis perpendicular to velocity
    const speed = Math.hypot(b.velocity.x, b.velocity.z);
    if (speed > 0.05) {
      _dir.set(b.velocity.x, 0, b.velocity.z).normalize();
      _axis.crossVectors(_up, _dir).normalize();
      // note: rolling direction — sphere rolls forward, so negative axis angle
      _q.setFromAxisAngle(_axis, (-speed * dt) / P.radius);
      this.mesh.quaternion.premultiply(_q);
    }

    this._updateShadow(solids);
    if (fell && !this.frozen) this.onFall?.();
  }

  /** Project the contact-shadow blob onto whatever is below. */
  _updateShadow(solids) {
    this._raycaster.set(this.body.position, _down);
    const hits = solids ? this._raycaster.intersectObject(solids, true) : [];
    if (hits.length) {
      const h = hits[0];
      this.shadowBlob.visible = true;
      this.shadowBlob.position.set(this.body.position.x, h.point.y + 0.02, this.body.position.z);
      const dist = h.distance - P.radius;
      const k = Math.max(0, 1 - dist / 7);
      this.shadowBlob.material.uniforms.uStrength.value = 0.55 * k;
      const s = 1 + dist * 0.12;
      this.shadowBlob.scale.set(s, s, 1);
    } else {
      this.shadowBlob.visible = false;
    }
  }
}
