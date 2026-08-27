/**
 * CelestialPlanets — Clean canvas for user to add celestial objects.
 */
import * as THREE from 'three';

export class CelestialPlanets {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.planets = [];
  }

  update(dt) {
    for (const p of this.planets) {
      if (p.body) p.body.rotation.y += p.rotSpeed * dt;
    }
  }

  clear() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
