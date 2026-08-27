/**
 * Drone — Hostile autonomous scout drone
 * Patrols, detects player, chases, fires plasma projectiles, and explodes on defeat.
 */
import * as THREE from 'three';

export class Drone {
  constructor(scene, bursts, audio, spawnPos) {
    this.scene = scene;
    this.bursts = bursts;
    this.audio = audio;

    this.id = 'scout_drone_01';
    this.name = 'Rogue Scout Drone';
    this.type = 'HOSTILE';
    this.state = 'PATROL'; // PATROL | DETECT | CHASE | ATTACK | DEAD
    this.health = 60;
    this.maxHealth = 60;

    this.patrolCenter = spawnPos.clone();
    this.patrolRadius = 35;
    this.patrolAngle = 0;
    this.speed = 18;
    this.attackCooldown = 0;

    // Laser Projectiles
    this.projectiles = [];
    this._projGeo = new THREE.SphereGeometry(0.35, 8, 8);
    this._projMat = new THREE.MeshBasicMaterial({ color: 0xff2244 });

    this._buildMesh(scene, spawnPos);
  }

  _buildMesh(scene, pos) {
    this.group = new THREE.Group();
    this.group.position.copy(pos);

    // Chassis body
    const bodyGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.6, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      metalness: 0.85,
      roughness: 0.25,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.group.add(body);

    // Glowing red eye scanner
    const eyeGeo = new THREE.SphereGeometry(0.45, 16, 16);
    this.eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: 0xff0022,
      emissiveIntensity: 1.0,
    });
    const eye = new THREE.Mesh(eyeGeo, this.eyeMat);
    eye.position.set(0, 0.1, 1.0);
    this.group.add(eye);

    // Dual thrusters
    const thrustGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.7, 8);
    const thrustMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const t1 = new THREE.Mesh(thrustGeo, thrustMat);
    t1.rotation.x = Math.PI / 2;
    t1.position.set(0.9, 0, -0.9);
    const t2 = t1.clone();
    t2.position.x = -0.9;
    this.group.add(t1);
    this.group.add(t2);

    scene.add(this.group);
    this.position = this.group.position;
  }

  update(dt, player, onDroneDestroyed = null) {
    if (this.state === 'DEAD') return;

    const pPos = player.position;
    const distToPlayer = this.position.distanceTo(pPos);

    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    switch (this.state) {
      case 'PATROL':
        this.patrolAngle += (this.speed / this.patrolRadius) * 0.4 * dt;
        this.position.x = this.patrolCenter.x + Math.cos(this.patrolAngle) * this.patrolRadius;
        this.position.z = this.patrolCenter.z + Math.sin(this.patrolAngle) * this.patrolRadius;
        this.position.y = this.patrolCenter.y + Math.sin(this.patrolAngle * 2) * 4;

        if (distToPlayer < 75) {
          this.state = 'DETECT';
          this.audio?.droneAlert?.();
        }
        break;

      case 'DETECT':
        this.group.lookAt(pPos);
        this.eyeMat.emissiveIntensity = 2.5;
        if (distToPlayer < 55) {
          this.state = 'CHASE';
        } else if (distToPlayer > 100) {
          this.state = 'PATROL';
        }
        break;

      case 'CHASE':
        this.group.lookAt(pPos);
        const chaseDir = pPos.clone().sub(this.position).normalize();
        this.position.addScaledVector(chaseDir, this.speed * dt);

        if (distToPlayer < 35) {
          this.state = 'ATTACK';
        }
        break;

      case 'ATTACK':
        this.group.lookAt(pPos);
        // Maintain combat distance
        if (distToPlayer < 18) {
          const backDir = this.position.clone().sub(pPos).normalize();
          this.position.addScaledVector(backDir, this.speed * 0.8 * dt);
        } else if (distToPlayer > 40) {
          this.state = 'CHASE';
        }

        // Fire plasma bolt
        if (this.attackCooldown <= 0) {
          this.attackCooldown = 1.6;
          this._fireLaser(pPos);
        }
        break;
    }

    // Update laser projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.position.addScaledVector(proj.velocity, dt);

      // Check player collision
      if (pPos.distanceTo(proj.position) < 2.2) {
        player.stats.damage(16, 'laser');
        this.audio?.impact?.();
        this.bursts?.emit(proj.position, 18, {
          color: new THREE.Color(0xff2244),
          speed: 4.0,
          up: 0,
          spread: 2.0,
          life: 0.6,
        });

        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check lifetime
      proj.life -= dt;
      if (proj.life <= 0) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // Check player ramming damage during high-speed boost
    if (distToPlayer < 3.2 && player.isLightSpeed) {
      this.destroy(onDroneDestroyed);
    }
  }

  _fireLaser(targetPos) {
    const mesh = new THREE.Mesh(this._projGeo, this._projMat);
    mesh.position.copy(this.position).add(new THREE.Vector3(0, 0.2, 0.5));
    this.scene.add(mesh);

    const dir = targetPos.clone().sub(mesh.position).normalize();
    const velocity = dir.multiplyScalar(55);

    this.audio?.laser?.();
    this.projectiles.push({
      mesh,
      position: mesh.position,
      velocity,
      life: 3.0,
    });
  }

  damage(amount, onDestroyCallback = null) {
    this.health -= amount;
    this.bursts?.emit(this.position, 12, {
      color: new THREE.Color(0xff4400),
      speed: 3.0,
      up: 0.5,
      spread: 1.5,
      life: 0.6,
    });

    if (this.health <= 0) {
      this.destroy(onDestroyCallback);
    }
  }

  destroy(callback = null) {
    if (this.state === 'DEAD') return;
    this.state = 'DEAD';
    this.group.visible = false;
    this.scene.remove(this.group);

    // Clear projectiles
    this.projectiles.forEach((p) => this.scene.remove(p.mesh));
    this.projectiles = [];

    // Huge explosion
    this.audio?.explosion?.();
    this.bursts?.emit(this.position, 60, {
      color: new THREE.Color(0xff4400),
      speed: 9.0,
      up: 2.0,
      spread: 5.0,
      life: 1.5,
    });

    callback?.(this);
  }
}
