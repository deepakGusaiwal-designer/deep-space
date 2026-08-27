/**
 * InfiniteSpace — Blank deep space universe canvas.
 * Clean, empty space ready for custom celestial and structural objects.
 */
import * as THREE from 'three';

export class InfiniteSpace {
  constructor({ scene, physics, materials, bursts, audio }) {
    this.scene = scene;
    this.physics = physics;
    this.materials = materials;
    this.bursts = bursts;
    this.audio = audio;

    this.group = new THREE.Group();
    scene.add(this.group);

    this.sectors = new Map();
    this.speedRings = [];
    this.stargates = [];
    this.relics = [];
    this.spaceships = [];
    this.pulsars = [];

    this.relicsFound = 0;
    this.nearestStationDist = Infinity;
    this.nearestStationDir = new THREE.Vector3();
    this.nearestShipDist = Infinity;
  }

  update(dt, player, onBoostCallback, onRelicCallback) {
    // Blank canvas - ready for user objects
  }

  clear() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    this.scene.remove(this.group);
  }
}
