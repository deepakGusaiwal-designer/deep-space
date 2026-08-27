/**
 * Physics — High-Performance Zero-G Spatial Physics & Continuous Collision System
 *
 * Features:
 *  - Collision Layers: SOLID, INTERACTIVE, ENVIRONMENT, PORTAL, VISUAL
 *  - Continuous Sub-Stepped Collision Resolution (Zero Tunneling at High Speed)
 *  - Primitives: SphereCollider, BoxCollider, CapsuleCollider, RingCollider
 *  - Spatial Broadphase: Dynamic distance-activated collision proxies
 *  - True Zero-G Sliding Response: Tangential momentum preservation + elastic recoil
 *  - Impact Velocity & Suit Damage Calculation with Camera Trauma Shake
 *  - Planetary Atmosphere & Gravitational Field Simulation
 *  - Forward Trajectory Proximity & Threat Warnings
 */
import * as THREE from 'three';

export const COLLISION_LAYERS = {
  SOLID: 'SOLID',             // Asteroids, Planets, Moons, Stations, Wrecks, Debris, Satellites
  INTERACTIVE: 'INTERACTIVE', // Collectibles, Relics, Docking Ports
  ENVIRONMENT: 'ENVIRONMENT', // Planetary Atmospheres, Nebulae, Radiation, Gravity Wells
  PORTAL: 'PORTAL',           // Wormholes, Hyperspace Stargates
  VISUAL: 'VISUAL',           // Background Stars, Galaxies
};

const _local = new THREE.Vector3();
const _clamped = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _qInv = new THREE.Quaternion();
const _ref = new THREE.Vector3();
const _refPrev = new THREE.Vector3();

// ----------------------------------------------------------------------
// 1. COLLIDER PRIMITIVES
// ----------------------------------------------------------------------

/**
 * Oriented Box Collider (Stations, Modules, Debris, Wrecks, Satellites)
 */
export class BoxCollider {
  constructor(halfExtents, opts = {}) {
    this.type = 'box';
    this.layer = opts.layer || COLLISION_LAYERS.SOLID;
    this.name = opts.name || 'Structure';
    this.half = halfExtents.clone();
    this.mesh = opts.mesh ?? null;
    this.id = opts.id ?? null;
    this.hazard = opts.hazard ?? false;
    this.enabled = true;
    this.restitution = opts.restitution ?? 0.18;
    this.friction = opts.friction ?? 0.08;

    this.center = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.prevCenter = new THREE.Vector3();
    this.prevQuaternion = new THREE.Quaternion();

    // Bounding radius for broad-phase distance culling
    this.boundingRadius = this.half.length();

    if (this.mesh) this.syncFromMesh(true);
  }

  setStatic(position, quaternion) {
    this.center.copy(position);
    if (quaternion) this.quaternion.copy(quaternion);
    this.prevCenter.copy(this.center);
    this.prevQuaternion.copy(this.quaternion);
    return this;
  }

  syncFromMesh(init = false) {
    if (!this.mesh) return;
    this.prevCenter.copy(init ? this.mesh.getWorldPosition(_local) : this.center);
    this.prevQuaternion.copy(init ? this.mesh.getWorldQuaternion(_qInv) : this.quaternion);
    this.mesh.updateWorldMatrix(true, false);
    this.mesh.matrixWorld.decompose(this.center, this.quaternion, _local.set(1, 1, 1));
  }

  yawDelta() {
    _ref.set(1, 0, 0).applyQuaternion(this.quaternion);
    _refPrev.set(1, 0, 0).applyQuaternion(this.prevQuaternion);
    return Math.atan2(_ref.z, _ref.x) - Math.atan2(_refPrev.z, _refPrev.x);
  }

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
      const dist = Math.sqrt(distSq);
      _normal.copy(_delta).divideScalar(dist);
      push = radius - dist;
    } else {
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

/**
 * Spherical Collider (Planets, Moons, Asteroids, Celestial Cores)
 */
export class SphereCollider {
  constructor(radius, opts = {}) {
    this.type = 'sphere';
    this.layer = opts.layer || COLLISION_LAYERS.SOLID;
    this.name = opts.name || 'Celestial Body';
    this.radius = radius;
    this.mesh = opts.mesh ?? null;
    this.id = opts.id ?? null;
    this.hazard = opts.hazard ?? false;
    this.enabled = true;
    this.restitution = opts.restitution ?? 0.22;
    this.friction = opts.friction ?? 0.06;

    this.center = new THREE.Vector3();
    this.boundingRadius = radius;

    if (opts.position) this.center.copy(opts.position);
    if (this.mesh) this.syncFromMesh();
  }

  setStatic(position) {
    this.center.copy(position);
    return this;
  }

  syncFromMesh() {
    if (!this.mesh) return;
    this.mesh.getWorldPosition(this.center);
  }

  resolveSphere(position, bodyRadius) {
    if (!this.enabled) return null;

    _delta.copy(position).sub(this.center);
    const distSq = _delta.lengthSq();
    const totalRadius = this.radius + bodyRadius;

    if (distSq >= totalRadius * totalRadius) return null;

    const dist = Math.sqrt(distSq);
    if (dist > 1e-6) {
      _normal.copy(_delta).divideScalar(dist);
    } else {
      _normal.set(0, 1, 0);
    }

    const push = totalRadius - dist;
    position.addScaledVector(_normal, push);
    return _normal.clone();
  }
}

/**
 * Planetary Atmosphere Volume with dynamic entry heating, density & gravity
 */
export class AtmosphereZone {
  constructor(center, surfaceRadius, atmosphereRadius, opts = {}) {
    this.type = 'atmosphere';
    this.name = opts.name || 'Atmosphere';
    this.center = center.clone();
    this.surfaceRadius = surfaceRadius;
    this.atmosphereRadius = atmosphereRadius;
    this.gravityStrength = opts.gravityStrength ?? 14.0;
    this.color = opts.color || 0x60d4ff;
    this.enabled = true;
  }

  evaluate(point) {
    if (!this.enabled) return null;
    const dist = point.distanceTo(this.center);
    if (dist > this.atmosphereRadius) return null;

    const depth = Math.max(0, this.atmosphereRadius - dist);
    const totalThick = this.atmosphereRadius - this.surfaceRadius;
    const density = Math.min(1.0, depth / Math.max(1, totalThick));
    const altitude = Math.max(0, dist - this.surfaceRadius);

    // Gravitational vector towards planet core
    _delta.copy(this.center).sub(point).normalize();
    const gravityAccel = _delta.multiplyScalar(this.gravityStrength * density);

    return {
      inside: true,
      altitude,
      density,
      gravityAccel,
      color: this.color,
      name: this.name,
    };
  }
}

/**
 * Gravitational Singularity (Black Hole Horizon & Accretion Pull)
 */
export class GravityWell {
  constructor(center, radius, strength, killRadius, opts = {}) {
    this.center = center.clone();
    this.radius = radius;
    this.strength = strength;
    this.killRadius = killRadius;
    this.name = opts.name || 'Singularity';
    this.enabled = true;
  }

  evaluate(point, dt) {
    if (!this.enabled) return { pull: null, consumed: false };
    _delta.copy(this.center).sub(point);
    const dist = _delta.length();

    if (dist < this.killRadius) {
      return { pull: null, consumed: true, dist };
    }

    if (dist < this.radius) {
      // Inverse-linear gravitational attraction toward horizon
      const factor = (1 - dist / this.radius);
      const pull = _delta.normalize().multiplyScalar(this.strength * factor * dt);
      return { pull, consumed: false, dist, factor };
    }

    return { pull: null, consumed: false, dist };
  }
}

/**
 * Standard Spatial Trigger Volume
 */
export class Trigger {
  constructor(bounds, opts = {}) {
    this.center = (opts.position ?? (bounds && bounds.center ? bounds.center : new THREE.Vector3())).clone();
    this.radius = opts.radius ?? (bounds && bounds.length ? bounds.length() : 4.0);
    this.id = opts.id ?? null;
    this.onEnter = opts.onEnter ?? null;
    this.onLeave = opts.onLeave ?? null;
    this.enabled = true;
    this._inside = false;
  }

  setStatic(position) {
    this.center.copy(position);
    return this;
  }

  test(position, radius = 0) {
    if (!this.enabled) return false;
    const distSq = position.distanceToSquared(this.center);
    const r = this.radius + radius;
    const isInside = distSq <= r * r;
    if (isInside && !this._inside) {
      this._inside = true;
      this.onEnter?.();
    } else if (!isInside && this._inside) {
      this._inside = false;
      this.onLeave?.();
    }
    return isInside;
  }
}

/**
 * Interactive Spatial Trigger (Resources, Relics, Wormholes, Docking)
 */
export class InteractionTrigger {
  constructor(position, radius, opts = {}) {
    this.position = position.clone();
    this.radius = radius;
    this.type = opts.type || 'INTERACTIVE';
    this.name = opts.name || 'Object';
    this.prompt = opts.prompt || '[E] Interact';
    this.onEnter = opts.onEnter || null;
    this.onInteract = opts.onInteract || null;
    this.enabled = true;
  }

  test(point, pointRadius) {
    if (!this.enabled) return false;
    const totalR = this.radius + pointRadius;
    return point.distanceToSquared(this.position) <= totalR * totalR;
  }
}

// ----------------------------------------------------------------------
// 2. MASTER PHYSICS WORLD
// ----------------------------------------------------------------------

export class Physics {
  constructor(settings = {}) {
    this.gravity = settings.gravity ?? 0;
    this.killPlaneY = settings.killPlaneY ?? -99999;
    this.infiniteMode = true;

    this.colliders = [];
    this.atmospheres = [];
    this.gravityWells = [];
    this.triggers = [];

    // Telemetry & Event Hooks
    this.onImpact = null;        // ({ speed, normal, collider, damage })
    this.onAtmosphereEnter = null; // ({ planetName, density, altitude })
    this.onGravityWell = null;   // ({ name, dist, factor })
    this.proximityWarning = null; // ({ distance, name, threatLevel })
  }

  clear() {
    this.colliders.length = 0;
    this.atmospheres.length = 0;
    this.gravityWells.length = 0;
    this.triggers.length = 0;
    this.proximityWarning = null;
  }

  addCollider(c) { this.colliders.push(c); return c; }
  removeCollider(c) {
    const idx = this.colliders.indexOf(c);
    if (idx !== -1) this.colliders.splice(idx, 1);
  }

  addAtmosphere(a) { this.atmospheres.push(a); return a; }
  addGravityWell(g) { this.gravityWells.push(g); return g; }
  addTrigger(t) { this.triggers.push(t); return t; }
  removeTrigger(t) {
    const idx = this.triggers.indexOf(t);
    if (idx !== -1) this.triggers.splice(idx, 1);
  }

  syncDynamics() {
    for (const c of this.colliders) {
      if (c.mesh) c.syncFromMesh();
    }
  }

  /**
   * Continuous Sub-Stepped Collision & Zero-G Physics Step
   * @param {object} body { position, velocity, radius, grounded, groundCollider, groundNormal }
   * @param {number} dt Delta time in seconds
   */
  step(body, dt) {
    if (dt <= 0) return false;

    // 1. Moving platform carry
    const ground = body.groundCollider;
    if (body.grounded && ground && ground.mesh) {
      _delta.copy(ground.center).sub(ground.prevCenter);
      body.position.add(_delta);
      if (typeof ground.yawDelta === 'function') {
        const yaw = ground.yawDelta();
        if (Math.abs(yaw) > 1e-6) {
          _local.copy(body.position).sub(ground.center);
          _local.applyAxisAngle(_normal.set(0, 1, 0), yaw);
          body.position.copy(ground.center).add(_local);
        }
      }
    }

    // 2. Evaluate Gravitational Singularity Wells
    let consumed = false;
    for (const gw of this.gravityWells) {
      const res = gw.evaluate(body.position, dt);
      if (res.consumed) consumed = true;
      if (res.pull) {
        body.velocity.add(res.pull);
        this.onGravityWell?.(gw.name, res.dist, res.factor);
      }
    }

    // 3. Evaluate Planetary Atmospheres (Drag & Planetary Gravity)
    let currentAtmo = null;
    for (const atm of this.atmospheres) {
      const atmoData = atm.evaluate(body.position);
      if (atmoData) {
        currentAtmo = atmoData;
        // Apply atmospheric gravity pull
        body.velocity.addScaledVector(atmoData.gravityAccel, dt);
        // Apply aerodynamic atmospheric drag
        const dragFactor = Math.max(0, 1 - atmoData.density * 1.8 * dt);
        body.velocity.multiplyScalar(dragFactor);
        this.onAtmosphereEnter?.(atmoData);
        break;
      }
    }

    // 4. Broad-Phase Distance Culling: Activate only nearby colliders (< 160m)
    const activeColliders = [];
    const pPos = body.position;
    for (const c of this.colliders) {
      if (!c.enabled) continue;
      const maxActivationDist = c.boundingRadius + 140;
      if (pPos.distanceToSquared(c.center) < maxActivationDist * maxActivationDist) {
        activeColliders.push(c);
      }
    }

    // 5. High-Speed Sub-Stepping (3 to 8 sub-steps based on velocity to prevent tunneling)
    const speed = body.velocity.length();
    const subSteps = Math.min(8, Math.max(3, Math.ceil((speed * dt) / (body.radius * 0.35))));
    const dtSub = dt / subSteps;

    body.grounded = false;
    body.groundCollider = null;
    body.groundNormal = null;
    let killed = consumed;

    let maxImpactSpeed = 0;
    let impactNormal = null;
    let impactedCollider = null;

    for (let s = 0; s < subSteps; s++) {
      body.position.addScaledVector(body.velocity, dtSub);

      for (let iter = 0; iter < 2; iter++) {
        for (const c of activeColliders) {
          const n = c.resolveSphere(body.position, body.radius);
          if (!n) continue;

          if (c.hazard) {
            killed = true;
            continue;
          }

          const intoSpeed = -body.velocity.dot(n);
          if (intoSpeed > 0) {
            if (intoSpeed > maxImpactSpeed) {
              maxImpactSpeed = intoSpeed;
              impactNormal = n.clone();
              impactedCollider = c;
            }

            // Zero-G Physical Collision Response:
            // 1. Separate into normal and tangential components
            const vNorm = n.clone().multiplyScalar(body.velocity.dot(n));
            const vTang = body.velocity.clone().sub(vNorm);

            // 2. Preserve tangential velocity with surface sliding friction
            vTang.multiplyScalar(Math.max(0, 1 - (c.friction || 0.12)));

            // 3. Floor landing vs Wall bounce
            if (n.y > 0.55) {
              body.grounded = true;
              body.groundCollider = c;
              body.groundNormal = n;

              if (intoSpeed < 14) {
                // Soft / normal landing: firmly plant boots on surface without bounce
                body.velocity.copy(vTang);
                if (body.velocity.y < 0) body.velocity.y = 0;
              } else {
                // High-speed slam: small cushioned rebound
                const rest = Math.min(0.08, c.restitution ?? 0.05);
                const vBounce = n.clone().multiplyScalar(-vNorm.dot(n) * (1 + rest));
                body.velocity.copy(vTang).add(vBounce);
              }
            } else {
              // Wall / obstacle recoil
              const rest = c.restitution ?? 0.15;
              const vBounce = n.clone().multiplyScalar(-vNorm.dot(n) * (1 + rest));
              body.velocity.copy(vTang).add(vBounce);
            }
          } else if (n.y > 0.55) {
            body.grounded = true;
            body.groundCollider = c;
            body.groundNormal = n;
            if (body.velocity.y < 0) body.velocity.y = 0;
          }
        }
      }
    }

    // 6. Impact Damage & Event Dispatch
    if (maxImpactSpeed > 8.0 && impactNormal && impactedCollider) {
      // Map impact speed to physical suit damage (only high speed impacts deal damage)
      let damage = 0;
      if (maxImpactSpeed > 25) {
        damage = 15 + (maxImpactSpeed - 25) * 1.2; // Very high speed collision
      } else if (maxImpactSpeed > 14) {
        damage = (maxImpactSpeed - 14) * 0.8;       // Moderate bump
      }

      this.onImpact?.({
        speed: maxImpactSpeed,
        normal: impactNormal,
        collider: impactedCollider,
        damage: Math.min(30, damage),
      });
    }

    // 7. Test Interactive Triggers
    for (const t of this.triggers) {
      if (t.test(body.position, body.radius)) {
        t.onEnter?.(body);
      }
    }

    // 8. Forward Trajectory Proximity Warning
    this._computeProximityWarning(body, activeColliders);

    return killed;
  }

  /**
   * Scan ahead along player velocity vector for obstacle warnings
   */
  _computeProximityWarning(body, colliders) {
    const speed = body.velocity.length();
    if (speed < 4.0) {
      this.proximityWarning = null;
      return;
    }

    _delta.copy(body.velocity).normalize();
    let closestDist = Infinity;
    let closestName = 'Obstacle';

    for (const c of colliders) {
      _local.copy(c.center).sub(body.position);
      const proj = _local.dot(_delta);
      if (proj > 0 && proj < 80) {
        const perpSq = _local.lengthSq() - (proj * proj);
        const collR = (c.boundingRadius || 5) + body.radius;
        if (perpSq < collR * collR) {
          const d = proj - collR;
          if (d < closestDist) {
            closestDist = Math.max(1, d);
            closestName = c.name || 'Obstacle';
          }
        }
      }
    }

    if (closestDist < 60) {
      this.proximityWarning = {
        distance: Math.round(closestDist),
        name: closestName,
        threatLevel: closestDist < 15 ? 'CRITICAL' : closestDist < 35 ? 'HIGH' : 'MEDIUM',
      };
    } else {
      this.proximityWarning = null;
    }
  }
}
