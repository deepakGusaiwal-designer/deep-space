/**
 * World — assembles a level definition into merged static geometry,
 * dynamic GSAP-driven obstacles, physics colliders and triggers.
 *
 * Optimization notes:
 *  - all static architecture of one material merges into ONE mesh
 *    (one draw call each for concrete / marble / metal / basalt)
 *  - dynamic obstacles are individual meshes so GSAP can move them
 *  - everything is disposed and tweens killed on clear()
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { builders } from './components.js';

export class World {
  constructor(scene, physics, materials) {
    this.scene = scene;
    this.physics = physics;
    this.materials = materials;

    this.group = new THREE.Group();   // non-collidable visuals (gates, decor, fx)
    this.solids = new THREE.Group();  // collidable meshes (camera / shadow raycasts)
    scene.add(this.group, this.solids);

    this.tweens = [];
    this.actions = new Map();
    this.portalPos = null;
    this.wormholeMouths = []; // used by Game to gate warp re-triggering
    this.accent = 0x9be8ff;

    // gameplay events (assigned by Game)
    this.onCheckpoint = null;
    this.onPortal = null;
    this.onPad = null;
    this.onGateOpen = null;
    this.onWormhole = null;
  }

  load(level) {
    this.clear();
    this.accent = level.accent ?? 0x9be8ff;

    const ctx = {
      world: this,
      physics: this.physics,
      materials: this._materialProxy(),
      group: this.group,
      solids: this.solids,
      batches: {},          // matName -> BufferGeometry[]
      tweens: this.tweens,
      actions: this.actions,
      accent: this.accent,
      portalPos: null,
    };

    for (const def of level.objects) {
      const build = builders[def.type];
      if (!build) { console.warn(`[World] unknown component "${def.type}"`); continue; }
      build(ctx, def);
    }
    this.portalPos = ctx.portalPos;

    // merge every static batch into a single mesh per material
    for (const [matName, geos] of Object.entries(ctx.batches)) {
      const merged = mergeGeometries(geos, false);
      for (const g of geos) g.dispose();
      const mesh = new THREE.Mesh(merged, this.materials[matName]());
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.solids.add(mesh);
    }

    return { spawn: new THREE.Vector3(...level.spawn) };
  }

  /** Per-frame: pull GSAP-animated transforms back into the physics world. */
  update() {
    this.physics.syncDynamics();
  }

  clear() {
    for (const t of this.tweens) t.kill();
    this.tweens.length = 0;
    this.actions.clear();
    this.physics.clear();
    this.portalPos = null;
    this.wormholeMouths.length = 0;

    for (const g of [this.group, this.solids]) {
      for (const child of [...g.children]) {
        child.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          // shader materials are per-instance; PBR materials are cached & shared
          if (o.material?.uniforms) {
            o.material.dispose();
            const i = this.materials.animated.indexOf(o.material);
            if (i >= 0) this.materials.animated.splice(i, 1);
          }
        });
        g.remove(child);
      }
    }
  }

  /** Expose the material library as callable lookups for builders. */
  _materialProxy() {
    const m = this.materials;
    return {
      concrete: () => m.concrete(),
      marble: () => m.marble(),
      metal: () => m.metal(),
      chrome: () => m.chrome(),
      glass: () => m.glass(),
      basalt: () => m.basalt(),
      gate: (c) => m.gate(c),
      pad: (c) => m.pad(c),
      beacon: (c) => m.beacon(c),
      portal: (c) => m.portal(c),
      halo: (c) => m.halo(c),
      blackholeDisk: (c) => m.blackholeDisk(c),
      gold: () => m.gold(),
      laserBeam: () => m.laserBeam(),
    };
  }
}
