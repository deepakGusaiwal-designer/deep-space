/**
 * HazardSystem — Dynamic environmental space hazards:
 * Meteor Storms, Solar Radiation Flares, and Gravitational Rifts.
 */
import * as THREE from 'three';

export class HazardSystem {
  constructor(scene, bursts, audio) {
    this.scene = scene;
    this.bursts = bursts;
    this.audio = audio;

    this.activeHazard = null;
    this.timer = 0;
    this.state = 'idle'; // idle | warning | active | passed

    this.meteors = [];
    this.meteorGroup = new THREE.Group();
    scene.add(this.meteorGroup);

    this._meteorGeo = new THREE.DodecahedronGeometry(1.6, 1);
    this._meteorMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff4400,
      emissiveIntensity: 0.9,
      roughness: 0.6,
    });
  }

  triggerMeteorStorm(duration = 16, onAlert = null) {
    this.activeHazard = 'METEOR_STORM';
    this.state = 'warning';
    this.timer = 8.0; // 8s warning countdown
    this.duration = duration;

    this.audio?.alarm?.();
    onAlert?.('⚠ METEORIC ACTIVITY DETECTED — IMPACT WINDOW IMMINENT');
  }

  update(dt, player, onStatusUpdate = null, onHazardComplete = null) {
    const pPos = player.position;

    if (this.state === 'warning') {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.state = 'active';
        this.timer = this.duration;
        this.audio?.alarm?.();
        onStatusUpdate?.('⚠ METEOR STORM ACTIVE — TAKE EVASIVE ACTION');
      }
    } else if (this.state === 'active') {
      this.timer -= dt;

      // Spawn incoming meteors randomly around player flight corridor
      if (Math.random() < dt * 4.5 && this.meteors.length < 18) {
        this._spawnMeteor(pPos);
      }

      // Update meteors
      for (let i = this.meteors.length - 1; i >= 0; i--) {
        const m = this.meteors[i];
        m.position.addScaledVector(m.velocity, dt);
        m.mesh.rotation.x += dt * 3.0;
        m.mesh.rotation.y += dt * 2.5;

        // Trail smoke/fire
        if (Math.random() < 0.35) {
          this.bursts?.emit(m.position, 3, {
            color: new THREE.Color(0xff4400),
            speed: 2.0,
            up: 0.5,
            spread: 1.0,
            life: 0.5,
          });
        }

        // Check player collision
        const dist = pPos.distanceTo(m.position);
        if (dist < 3.2) {
          player.stats.damage(32, 'meteor');
          player.body.velocity.addScaledVector(m.velocity, 0.4);
          this.audio?.impact?.();
          this.bursts?.emit(m.position, 35, {
            color: new THREE.Color(0xff5500),
            speed: 8.0,
            up: 2.0,
            spread: 4.0,
            life: 1.2,
          });

          this.meteorGroup.remove(m.mesh);
          this.meteors.splice(i, 1);
          continue;
        }

        // Remove if too far away
        if (pPos.distanceTo(m.position) > 220) {
          this.meteorGroup.remove(m.mesh);
          this.meteors.splice(i, 1);
        }
      }

      if (this.timer <= 0) {
        this.state = 'passed';
        this._clearMeteors();
        onStatusUpdate?.('Meteor Storm Passed. Threat Level Nominal.');
        onHazardComplete?.();
      }
    }
  }

  _spawnMeteor(targetPos) {
    const mesh = new THREE.Mesh(this._meteorGeo, this._meteorMat);
    const spawnAngle = Math.random() * Math.PI * 2;
    const spawnDist = 90 + Math.random() * 40;
    const spawnHeight = (Math.random() - 0.2) * 50;

    mesh.position.set(
      targetPos.x + Math.cos(spawnAngle) * spawnDist,
      targetPos.y + spawnHeight,
      targetPos.z + Math.sin(spawnAngle) * spawnDist,
    );

    // Aim toward player vicinity with slight dispersion
    const aim = targetPos.clone().add(
      new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 16,
      ),
    );

    const speed = 42 + Math.random() * 22;
    const velocity = aim.sub(mesh.position).normalize().multiplyScalar(speed);

    this.meteorGroup.add(mesh);
    this.meteors.push({
      mesh,
      position: mesh.position,
      velocity,
    });
  }

  _clearMeteors() {
    for (const m of this.meteors) {
      this.meteorGroup.remove(m.mesh);
    }
    this.meteors = [];
  }
}
