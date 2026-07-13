/**
 * Hand-rolled physics for a sphere-in-architecture game.
 * No physics library: just sphere-vs-oriented-box resolution,
 * trigger volumes and moving-platform carry.
 */
import * as THREE from 'three';

const _local = new THREE.Vector3();
const _clamped = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _qInv = new THREE.Quaternion();
const _ref = new THREE.Vector3();
const _refPrev = new THREE.Vector3();

/**
 * An oriented box. Static boxes are set once; dynamic boxes re-read
 * their mesh's world transform every frame and remember the previous
 * frame so the player can be carried by moving platforms.
 */
export class BoxCollider {
  /**
   * @param {THREE.Vector3} halfExtents
   * @param {object} opts { mesh (dynamic source), id, isGate }
   */
  constructor(halfExtents, opts = {}) {
    this.half = halfExtents.clone();
    this.mesh = opts.mesh ?? null;   // present → dynamic collider
    this.id = opts.id ?? null;
    this.enabled = true;

    this.center = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.prevCenter = new THREE.Vector3();
    this.prevQuaternion = new THREE.Quaternion();

    if (this.mesh) this.syncFromMesh(true);
  }

  setStatic(position, quaternion) {
    this.center.copy(position);
    if (quaternion) this.quaternion.copy(quaternion);
    this.prevCenter.copy(this.center);
    this.prevQuaternion.copy(this.quaternion);
    return this;
  }

  /** Pull transform from the driven mesh (GSAP animates the mesh). */
  syncFromMesh(init = false) {
    this.prevCenter.copy(init ? this.mesh.getWorldPosition(_local) : this.center);
    this.prevQuaternion.copy(init ? this.mesh.getWorldQuaternion(_qInv) : this.quaternion);
    this.mesh.updateWorldMatrix(true, false);
    this.mesh.matrixWorld.decompose(this.center, this.quaternion, _local.set(1, 1, 1));
  }

  /** Yaw delta since last frame (for carrying the player on rotators). */
  yawDelta() {
    _ref.set(1, 0, 0).applyQuaternion(this.quaternion);
    _refPrev.set(1, 0, 0).applyQuaternion(this.prevQuaternion);
    return Math.atan2(_ref.z, _ref.x) - Math.atan2(_refPrev.z, _refPrev.x);
  }

  /**
   * Resolve a sphere against this box.
   * @returns {THREE.Vector3|null} world-space contact normal, or null
   * Mutates `position` to push the sphere out.
   */
  resolveSphere(position, radius) {
    if (!this.enabled) return null;

    _qInv.copy(this.quaternion).invert();
    _local.copy(position).sub(this.center).applyQuaternion(_qInv);
    _clamped.set(
      Math.max(-this.half.x, Math.min(this.half.x, _local.x)),
      Math.max(-this.half.y, Math.min(this.half.y, _local.y)),
      Math.max(-this.half.z, Math.min(this.half.z, _local.z)),
    );
    _delta.copy(_local).sub(_clamped);
    const distSq = _delta.lengthSq();

    if (distSq > radius * radius) return null;

    let push;
    if (distSq > 1e-10) {
      // Sphere center outside the box: push along the closest-point axis.
      const dist = Math.sqrt(distSq);
      _normal.copy(_delta).divideScalar(dist);
      push = radius - dist;
    } else {
      // Center inside the box: exit through the face of least penetration.
      const px = this.half.x - Math.abs(_local.x);
      const py = this.half.y - Math.abs(_local.y);
      const pz = this.half.z - Math.abs(_local.z);
      if (px < py && px < pz) _normal.set(Math.sign(_local.x) || 1, 0, 0), push = px + radius;
      else if (py < pz) _normal.set(0, Math.sign(_local.y) || 1, 0), push = py + radius;
      else _normal.set(0, 0, Math.sign(_local.z) || 1), push = pz + radius;
    }

    _normal.applyQuaternion(this.quaternion);
    position.addScaledVector(_normal, push);
    return _normal.clone();
  }
}

/** Sphere trigger volume with an activation callback. */
export class Trigger {
  constructor(position, radius, onEnter, { once = true } = {}) {
    this.position = position.clone();
    this.radius = radius;
    this.onEnter = onEnter;
    this.once = once;
    this.fired = false;
    this.enabled = true;
  }

  test(point, pointRadius) {
    if (!this.enabled || (this.once && this.fired)) return;
    const r = this.radius + pointRadius;
    if (point.distanceToSquared(this.position) < r * r) {
      this.fired = true;
      this.onEnter();
    }
  }
}

/**
 * The physics world: owns colliders + triggers, steps the player body.
 */
export class Physics {
  constructor(settings) {
    this.gravity = settings.gravity;
    this.killPlaneY = settings.killPlaneY;
    this.colliders = [];
    this.triggers = [];
    this.attractors = []; // { position, radius, strength, killRadius }
  }

  clear() {
    this.colliders.length = 0;
    this.triggers.length = 0;
    this.attractors.length = 0;
  }

  addCollider(c) { this.colliders.push(c); return c; }
  addTrigger(t) { this.triggers.push(t); return t; }
  addAttractor(a) { this.attractors.push(a); return a; }

  getCollider(id) { return this.colliders.find((c) => c.id === id) ?? null; }

  /** Re-read dynamic transforms (call once per frame, before stepping bodies). */
  syncDynamics() {
    for (const c of this.colliders) if (c.mesh) c.syncFromMesh();
  }

  /**
   * Integrate + collide one sphere body.
   * body: { position, velocity, radius, grounded, groundCollider, groundNormal }
   */
  step(body, dt) {
    // Carry: if standing on a dynamic platform, inherit its motion first.
    const ground = body.groundCollider;
    if (body.grounded && ground && ground.mesh) {
      _delta.copy(ground.center).sub(ground.prevCenter);
      body.position.add(_delta);
      const yaw = ground.yawDelta();
      if (Math.abs(yaw) > 1e-6) {
        _local.copy(body.position).sub(ground.center);
        _local.applyAxisAngle(_normal.set(0, 1, 0), yaw);
        body.position.copy(ground.center).add(_local);
      }
    }

    body.velocity.y -= this.gravity * dt;

    // black-hole pull: linear falloff toward the singularity
    for (const a of this.attractors) {
      _delta.copy(a.position).sub(body.position);
      const dist = _delta.length();
      if (dist < a.killRadius) return true; // consumed by the singularity
      if (dist < a.radius) {
        const f = a.strength * (1 - dist / a.radius);
        body.velocity.addScaledVector(_delta.normalize(), f * dt);
      }
    }

    body.position.addScaledVector(body.velocity, dt);

    body.grounded = false;
    body.groundCollider = null;
    body.groundNormal = null;

    // Two resolution iterations handle corners/wedges cleanly.
    for (let iter = 0; iter < 2; iter++) {
      for (const c of this.colliders) {
        const n = c.resolveSphere(body.position, body.radius);
        if (!n) continue;
        const into = body.velocity.dot(n);
        if (into < 0) body.velocity.addScaledVector(n, -into);
        if (n.y > 0.55) {
          body.grounded = true;
          body.groundCollider = c;
          body.groundNormal = n;
        }
      }
    }

    for (const t of this.triggers) t.test(body.position, body.radius);

    return body.position.y < this.killPlaneY; // true → fell out of the world
  }
}
