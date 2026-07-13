/**
 * World component builders. Each builder consumes one entry of a level
 * definition and contributes:
 *   - geometry  → merged static batches (one draw call per material) or
 *                 individual dynamic meshes
 *   - colliders → hand-rolled physics boxes
 *   - tweens    → GSAP-driven motion (physics reads transforms back)
 *   - actions   → id-addressable behaviours for trigger pads
 *
 * Every level therefore feels handcrafted while remaining pure data.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { BoxCollider, Trigger } from '../core/Physics.js';

const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();
const _mat4 = new THREE.Matrix4();
const _v = new THREE.Vector3();

const vec3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

/** Rounded box transformed into world space, pushed into a static batch. */
function pushStaticBox(ctx, matName, pos, size, rot = [0, 0, 0], bevel = 0.06) {
  const geo = new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(bevel, Math.min(...size) * 0.24));
  _euler.set(rot[0], rot[1], rot[2]);
  _quat.setFromEuler(_euler);
  _mat4.compose(vec3(pos), _quat, _v.set(1, 1, 1));
  geo.applyMatrix4(_mat4);
  (ctx.batches[matName] ??= []).push(geo);
}

function addStaticCollider(ctx, pos, size, rot = [0, 0, 0]) {
  _euler.set(rot[0], rot[1], rot[2]);
  const c = new BoxCollider(new THREE.Vector3(size[0] / 2, size[1] / 2, size[2] / 2));
  c.setStatic(vec3(pos), _quat.setFromEuler(_euler));
  ctx.physics.addCollider(c);
  return c;
}

/** Individually-drawn dynamic mesh with a live collider. */
function makeDynamicBox(ctx, matName, pos, size, opts = {}) {
  const geo = new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(0.06, Math.min(...size) * 0.24));
  const mesh = new THREE.Mesh(geo, ctx.materials[matName]());
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  ctx.solids.add(mesh);
  const collider = new BoxCollider(
    new THREE.Vector3(size[0] / 2, size[1] / 2, size[2] / 2),
    { mesh: opts.colliderMesh ?? mesh, id: opts.id ?? null },
  );
  ctx.physics.addCollider(collider);
  return { mesh, collider };
}

/* ================== component builders ============================= */

export const builders = {
  /* ---- static architecture ---------------------------------------- */

  platform(ctx, def) {
    const mat = def.mat ?? 'concrete';
    pushStaticBox(ctx, mat, def.pos, def.size, def.rot);
    addStaticCollider(ctx, def.pos, def.size, def.rot);
    if (def.skirt !== false) {
      // tapered basalt underpinning — pure decoration, sells the "monument" look
      const [w, , d] = def.size;
      const h = def.skirtDepth ?? 5;
      pushStaticBox(ctx, 'basalt',
        [def.pos[0], def.pos[1] - def.size[1] / 2 - h / 2 + 0.05, def.pos[2]],
        [w * 0.55, h, d * 0.55], [0, 0, 0], 0.04);
    }
  },

  ramp(ctx, def) {
    builders.platform(ctx, { ...def, skirt: def.skirt ?? false });
  },

  /** Straight bridge computed from two endpoints. */
  bridge(ctx, def) {
    const a = vec3(def.from);
    const b = vec3(def.to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const len = a.distanceTo(b);
    const yaw = Math.atan2(b.x - a.x, b.z - a.z);
    builders.platform(ctx, {
      pos: [mid.x, mid.y, mid.z],
      size: [def.width ?? 2.4, def.thickness ?? 0.7, len],
      rot: [0, yaw, 0],
      mat: def.mat ?? 'metal',
      skirt: false,
    });
  },

  /* ---- dynamic architecture (GSAP-driven) -------------------------- */

  /** Continuously rotating platform / bar. */
  rotator(ctx, def) {
    const { mesh } = makeDynamicBox(ctx, def.mat ?? 'metal', def.pos, def.size);
    const axis = def.axis ?? 'y';
    const target = {};
    target[axis] = `+=${Math.PI * 2 * (def.reverse ? -1 : 1)}`;
    ctx.tweens.push(gsap.to(mesh.rotation, {
      ...target, duration: def.duration ?? 4, ease: 'none', repeat: -1,
    }));
  },

  /** Platform sliding between pos and `to` (yoyo). */
  slider(ctx, def) {
    const { mesh } = makeDynamicBox(ctx, def.mat ?? 'metal', def.pos, def.size);
    ctx.tweens.push(gsap.to(mesh.position, {
      x: def.to[0], y: def.to[1], z: def.to[2],
      duration: def.duration ?? 3,
      ease: def.ease ?? 'sine.inOut',
      repeat: -1, yoyo: true,
      delay: def.delay ?? 0,
      repeatDelay: def.repeatDelay ?? 0,
    }));
  },

  /**
   * Elevator — vertical slider. With `triggerId` it idles until a pad
   * activates it, then cycles forever (no soft-locks).
   */
  elevator(ctx, def) {
    const { mesh } = makeDynamicBox(ctx, def.mat ?? 'metal', def.pos, def.size);
    const tween = gsap.to(mesh.position, {
      x: def.to[0], y: def.to[1], z: def.to[2],
      duration: def.duration ?? 3.2,
      ease: 'sine.inOut',
      repeat: -1, yoyo: true,
      repeatDelay: def.repeatDelay ?? 0.8,
      paused: Boolean(def.triggerId),
    });
    ctx.tweens.push(tween);
    if (def.triggerId) ctx.actions.set(def.triggerId, () => tween.play());
  },

  /** Pendulum hammer — arm swinging from a pivot (parent rotates). */
  pendulum(ctx, def) {
    const pivot = new THREE.Group();
    pivot.position.set(def.pos[0], def.pos[1], def.pos[2]);
    ctx.solids.add(pivot);

    const armLen = def.length ?? 4;
    const geo = new RoundedBoxGeometry(def.thickness ?? 0.6, armLen, def.thickness ?? 0.6, 2, 0.05);
    const mesh = new THREE.Mesh(geo, ctx.materials[def.mat ?? 'metal']());
    mesh.position.y = -armLen / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    pivot.add(mesh);

    ctx.physics.addCollider(new BoxCollider(
      new THREE.Vector3((def.thickness ?? 0.6) / 2, armLen / 2, (def.thickness ?? 0.6) / 2),
      { mesh },
    ));

    pivot.rotation.z = -(def.swing ?? 0.85);
    ctx.tweens.push(gsap.to(pivot.rotation, {
      z: def.swing ?? 0.85,
      duration: def.duration ?? 1.6,
      ease: 'sine.inOut',
      repeat: -1, yoyo: true,
      delay: def.delay ?? 0,
    }));
  },

  /* ---- interactive elements ---------------------------------------- */

  /** Energy gate: metal frame + shader veil. Opened via pad action. */
  gate(ctx, def) {
    const [w, h] = def.size;
    const yaw = def.yaw ?? 0;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const post = [0.45, h + 0.6, 0.45];
    const offX = (w / 2 + 0.2) * cos;
    const offZ = -(w / 2 + 0.2) * sin;

    // frame: two posts + lintel (static, solid)
    for (const s of [1, -1]) {
      const p = [def.pos[0] + offX * s, def.pos[1], def.pos[2] + offZ * s];
      pushStaticBox(ctx, 'metal', p, post, [0, yaw, 0]);
      addStaticCollider(ctx, p, post, [0, yaw, 0]);
    }
    const lintel = [def.pos[0], def.pos[1] + h / 2 + 0.35, def.pos[2]];
    pushStaticBox(ctx, 'metal', lintel, [w + 1.3, 0.5, 0.45], [0, yaw, 0]);
    addStaticCollider(ctx, lintel, [w + 1.3, 0.5, 0.45], [0, yaw, 0]);

    // energy veil (blocks until opened)
    const veilMat = ctx.materials.gate(ctx.accent);
    const veil = new THREE.Mesh(new THREE.PlaneGeometry(w, h), veilMat);
    veil.position.set(def.pos[0], def.pos[1], def.pos[2]);
    veil.rotation.y = yaw;
    ctx.group.add(veil);

    const collider = addStaticCollider(ctx, def.pos, [w, h, 0.3], [0, yaw, 0]);

    ctx.actions.set(def.id, () => {
      collider.enabled = false;
      gsap.to(veilMat.uniforms.uOpen, { value: 1, duration: 1.1, ease: 'power2.inOut' });
      ctx.world.onGateOpen?.(vec3(def.pos));
    });
  },

  /** Trigger pad — steps on it → runs every `targets` action. */
  pad(ctx, def) {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 1.05, 0.16, 28),
      ctx.materials.metal(),
    );
    base.position.set(def.pos[0], def.pos[1], def.pos[2]);
    base.receiveShadow = true;
    ctx.group.add(base);

    const glowMat = ctx.materials.pad(ctx.accent);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(def.pos[0], def.pos[1] + 0.1, def.pos[2]);
    ctx.group.add(glow);

    ctx.physics.addTrigger(new Trigger(vec3(def.pos), 1.3, () => {
      gsap.to(glowMat.uniforms.uActive, { value: 1, duration: 0.5 });
      for (const id of def.targets ?? []) ctx.actions.get(id)?.();
      ctx.world.onPad?.(vec3(def.pos));
    }));
  },

  /**
   * Checkpoint — a wormhole anchor: a flat swirling vortex hovering
   * over a marble ring. Claiming it binds your teleport-return point;
   * dying warps you back through it.
   */
  checkpoint(ctx, def) {
    const p = vec3(def.pos);
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.2, 0.14, 32),
      ctx.materials.marble(),
    );
    base.position.copy(p);
    base.receiveShadow = true;
    ctx.group.add(base);

    const anchor = new THREE.Group();
    anchor.position.set(p.x, p.y + 1.5, p.z);
    ctx.group.add(anchor);

    // horizontal mini-vortex (dim amber until claimed)
    const diskMat = ctx.materials.blackholeDisk(0x8a6a45);
    const disk = new THREE.Mesh(new THREE.RingGeometry(0.15, 1.0, 48, 1), diskMat);
    disk.rotation.x = -Math.PI / 2;
    anchor.add(disk);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.06, 0.045, 12, 48),
      ctx.materials.chrome(),
    );
    ring.rotation.x = Math.PI / 2;
    anchor.add(ring);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 28, 16),
      ctx.materials.halo(0xffd9a0),
    );
    halo.scale.y = 0.28;
    anchor.add(halo);

    ctx.tweens.push(gsap.to(anchor.rotation, { y: Math.PI * 2, duration: 11, ease: 'none', repeat: -1 }));
    ctx.tweens.push(gsap.to(anchor.position, {
      y: p.y + 1.75, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true,
    }));

    ctx.physics.addTrigger(new Trigger(p, 1.5, () => {
      // claimed: the vortex ignites in the level accent
      const c = new THREE.Color(ctx.accent);
      gsap.to(diskMat.uniforms.uColor.value, { r: c.r, g: c.g, b: c.b, duration: 0.7 });
      gsap.fromTo(anchor.scale, { x: 1.5, y: 1.5, z: 1.5 }, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'expo.out' });
      ctx.world.onCheckpoint?.(new THREE.Vector3(p.x, p.y + 1.2, p.z));
    }));
  },

  /** Exit portal — a tamed black hole: fall in to clear the stage. */
  portal(ctx, def) {
    const p = vec3(def.pos);
    const g = new THREE.Group();
    g.position.copy(p);
    g.rotation.y = def.yaw ?? 0;
    ctx.group.add(g);

    // event horizon backing — a pure black heart
    const core = new THREE.Mesh(
      new THREE.CircleGeometry(0.68, 40),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }),
    );
    g.add(core);

    // swirling accretion vortex in the level accent
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 1.9, 64, 1),
      ctx.materials.blackholeDisk(ctx.accent),
    );
    disk.position.z = 0.01;
    g.add(disk);

    // photon ring — bloom bait
    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.05, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0xfff3dc }),
    );
    g.add(photon);

    // counter-rotating gyroscope ring
    const gyro = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.05, 10, 64),
      ctx.materials.metal(),
    );
    g.add(gyro);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 32, 20),
      ctx.materials.halo(ctx.accent),
    );
    halo.scale.z = 0.3;
    g.add(halo);

    ctx.tweens.push(gsap.to(gyro.rotation, { x: Math.PI * 2, duration: 7, ease: 'none', repeat: -1 }));
    ctx.tweens.push(gsap.to(photon.rotation, { z: -Math.PI * 2, duration: 12, ease: 'none', repeat: -1 }));

    ctx.physics.addTrigger(new Trigger(p, 1.5, () => ctx.world.onPortal?.(p)));
    ctx.portalPos = p;
  },

  /* ---- cosmic bodies ------------------------------------------------- */

  /**
   * Black hole — pure-black core, fresnel lensing halo, photon ring and
   * a swirling accretion disk. With `pull: true` it becomes a hazard:
   * a physics attractor that drags the sphere in and consumes it.
   */
  blackhole(ctx, def) {
    const p = vec3(def.pos);
    const s = def.scale ?? 1;
    const g = new THREE.Group();
    g.position.copy(p);
    ctx.group.add(g);

    // event horizon
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.1 * s, 40, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    g.add(core);

    // gravitational-lensing hint
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.32 * s, 40, 24),
      ctx.materials.halo(def.haloColor ?? 0x9fc8ff),
    );
    g.add(halo);

    // photon ring — bright enough for bloom to catch it
    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(1.42 * s, 0.045 * s, 12, 72),
      new THREE.MeshBasicMaterial({ color: 0xfff3dc }),
    );

    // accretion disk (swirl animated in the shader)
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(1.35 * s, 3.4 * s, 72, 1),
      ctx.materials.blackholeDisk(def.color ?? 0xffb46b),
    );

    const tilt = def.tilt ?? 1.25;
    for (const m of [photon, disk]) {
      m.rotation.x = tilt;
      g.add(m);
    }

    // slow precession — the whole system leans over time
    ctx.tweens.push(gsap.to(g.rotation, {
      y: Math.PI * 2, duration: 90 / (def.spin ?? 1), ease: 'none', repeat: -1,
    }));

    if (def.pull) {
      ctx.physics.addAttractor({
        position: p,
        radius: def.radius ?? 10 * s,
        strength: def.strength ?? 24,
        killRadius: 1.35 * s,
      });
    }
  },

  /**
   * Wormhole — a pair of linked mouths. Rolling into one teleports the
   * player to the other (handled by Game via world.onWormhole).
   */
  wormhole(ctx, def) {
    const color = def.color ?? 0x8bffd9;
    const a = vec3(def.a);
    const b = vec3(def.b);

    const buildMouth = (pos, yaw = 0) => {
      const g = new THREE.Group();
      g.position.copy(pos);
      g.rotation.y = yaw;
      ctx.group.add(g);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.55, 0.14, 16, 56),
        ctx.materials.chrome(),
      );
      ring.castShadow = true;
      g.add(ring);

      // gyroscope ring — counter-rotating for an unstable, exotic feel
      const gyro = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.05, 10, 56),
        ctx.materials.metal(),
      );
      g.add(gyro);

      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(1.45, 44),
        ctx.materials.portal(color),
      );
      g.add(disc);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(1.7, 32, 20),
        ctx.materials.halo(color),
      );
      halo.scale.z = 0.35;
      g.add(halo);

      ctx.tweens.push(gsap.to(ring.rotation, { z: Math.PI * 2, duration: 9, ease: 'none', repeat: -1 }));
      ctx.tweens.push(gsap.to(gyro.rotation, { x: Math.PI * 2, duration: 5.5, ease: 'none', repeat: -1 }));
      return g;
    };

    buildMouth(a, def.yawA ?? 0);
    buildMouth(b, def.yawB ?? def.yawA ?? 0);
    ctx.world.wormholeMouths.push(a.clone(), b.clone());

    ctx.physics.addTrigger(new Trigger(a, 1.35,
      () => ctx.world.onWormhole?.({ pos: b.clone(), from: a.clone() }), { once: false }));
    if (def.bidirectional !== false) {
      ctx.physics.addTrigger(new Trigger(b, 1.35,
        () => ctx.world.onWormhole?.({ pos: a.clone(), from: b.clone() }), { once: false }));
    }
  },

  /* ---- decoration --------------------------------------------------- */

  /** Floating slab / monolith. No collider; gently bobbing via GSAP. */
  decor(ctx, def) {
    const geo = new RoundedBoxGeometry(def.size[0], def.size[1], def.size[2], 2, 0.08);
    const mesh = new THREE.Mesh(geo, ctx.materials[def.mat ?? 'glass']());
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
    if (def.rot) mesh.rotation.set(def.rot[0], def.rot[1], def.rot[2]);
    mesh.castShadow = def.mat !== 'glass';
    ctx.group.add(mesh);

    const drift = def.drift ?? 0.6;
    ctx.tweens.push(gsap.to(mesh.position, {
      y: def.pos[1] + drift,
      duration: 3 + Math.random() * 3,
      ease: 'sine.inOut', repeat: -1, yoyo: true,
      delay: Math.random() * 2,
    }));
    ctx.tweens.push(gsap.to(mesh.rotation, {
      y: `+=${(Math.random() - 0.5) * 1.4}`,
      duration: 6 + Math.random() * 5,
      ease: 'sine.inOut', repeat: -1, yoyo: true,
    }));
  },

  /** Solid decorative column (merged, collidable if `solid`). */
  pillar(ctx, def) {
    pushStaticBox(ctx, def.mat ?? 'concrete', def.pos, def.size, def.rot ?? [0, 0, 0]);
    if (def.solid) addStaticCollider(ctx, def.pos, def.size, def.rot ?? [0, 0, 0]);
  },
};
