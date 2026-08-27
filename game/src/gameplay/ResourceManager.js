/**
 * ResourceManager — Manages 3D collectible resource nodes,
 * tractor-beam magnetic collection, and player resource inventory.
 */
import * as THREE from 'three';

export const RESOURCE_TYPES = {
  ENERGY: { name: 'Energy Cell', color: 0x00e5ff, value: 25, icon: '⚡' },
  SCRAP: { name: 'Hull Scrap', color: 0x90a4ae, value: 15, icon: '🔩' },
  CRYSTAL: { name: 'Plasma Crystal', color: 0xff33bb, value: 35, icon: '💎' },
  XENON: { name: 'Xenon Fuel', color: 0x00ff88, value: 50, icon: '🧪' },
  DATA: { name: 'Encrypted Data Chip', color: 0xffdf70, value: 100, icon: '💾' },
  RELIC: { name: 'Ancient Cosmic Relic', color: 0xffaa00, value: 250, icon: '✦' },
};

export class ResourceManager {
  constructor(scene, bursts, audio) {
    this.scene = scene;
    this.bursts = bursts;
    this.audio = audio;

    this.inventory = {
      scrap: 0,
      crystals: 0,
      xenon: 0,
      data: 0,
      relics: 0,
    };

    this.nodes = [];
    this.group = new THREE.Group();
    scene.add(this.group);

    // Shared geometries & materials
    this._geos = {
      ENERGY: new THREE.OctahedronGeometry(0.7, 0),
      SCRAP: new THREE.BoxGeometry(0.8, 0.8, 0.8),
      CRYSTAL: new THREE.DodecahedronGeometry(0.75, 0),
      XENON: new THREE.CylinderGeometry(0.35, 0.35, 1.1, 8),
      DATA: new THREE.BoxGeometry(0.6, 0.8, 0.2),
      RELIC: new THREE.IcosahedronGeometry(0.9, 0),
    };
  }

  spawn(typeKey, position) {
    const meta = RESOURCE_TYPES[typeKey] ?? RESOURCE_TYPES.ENERGY;
    const geo = this._geos[typeKey] ?? this._geos.ENERGY;

    const mat = new THREE.MeshStandardMaterial({
      color: meta.color,
      emissive: meta.color,
      emissiveIntensity: 0.65,
      metalness: 0.7,
      roughness: 0.2,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    this.group.add(mesh);

    const node = {
      id: `res_${Math.random().toString(36).substr(2, 6)}`,
      type: 'RESOURCE',
      resType: typeKey,
      name: meta.name,
      mesh,
      position: mesh.position,
      baseY: position.y,
      seed: Math.random() * 10,
      collected: false,
    };

    this.nodes.push(node);
    return node;
  }

  spawnCluster(center, count = 5, radius = 18) {
    const keys = ['ENERGY', 'SCRAP', 'CRYSTAL', 'XENON'];
    for (let i = 0; i < count; i++) {
      const type = keys[Math.floor(Math.random() * keys.length)];
      const pos = new THREE.Vector3(
        center.x + (Math.random() - 0.5) * radius,
        center.y + (Math.random() - 0.5) * (radius * 0.6),
        center.z + (Math.random() - 0.5) * radius,
      );
      this.spawn(type, pos);
    }
  }

  update(dt, player, onCollectCallback = null) {
    const time = performance.now() * 0.001;
    const pPos = player.position;

    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      if (n.collected) continue;

      // Idle float & tumble animation
      n.mesh.rotation.x += dt * 1.2;
      n.mesh.rotation.y += dt * 1.6;
      n.mesh.position.y = n.baseY + Math.sin(time * 2.5 + n.seed) * 0.4;

      const dist = pPos.distanceTo(n.position);

      // Magnetic tractor pull within 5.5m
      if (dist < 6.5) {
        const pullDir = pPos.clone().sub(n.position).normalize();
        n.position.addScaledVector(pullDir, 16 * dt);

        // Collect upon proximity
        if (dist < 1.8) {
          n.collected = true;
          n.mesh.visible = false;
          this.group.remove(n.mesh);
          this.nodes.splice(i, 1);

          this._handleCollect(n.resType, player, onCollectCallback);
        }
      }
    }
  }

  _handleCollect(resType, player, callback) {
    const meta = RESOURCE_TYPES[resType];

    switch (resType) {
      case 'ENERGY':
        player.stats.replenishFuel(45);
        player.stats.replenishOxygen(35);
        break;
      case 'SCRAP':
        this.inventory.scrap += 1;
        player.stats.heal(15);
        break;
      case 'CRYSTAL':
        this.inventory.crystals += 1;
        break;
      case 'XENON':
        this.inventory.xenon += 1;
        break;
      case 'DATA':
        this.inventory.data += 1;
        break;
      case 'RELIC':
        this.inventory.relics += 1;
        break;
    }

    this.audio?.resource?.();
    this.bursts?.emit(player.position, 24, {
      color: new THREE.Color(meta.color),
      speed: 4.5,
      up: 1.0,
      spread: 2.0,
      life: 0.9,
    });

    callback?.(meta, this.inventory);
  }

  getTargets() {
    return this.nodes
      .filter((n) => !n.collected)
      .map((n) => ({
        id: n.id,
        type: 'RESOURCE',
        name: n.name,
        position: n.position,
      }));
  }
}
