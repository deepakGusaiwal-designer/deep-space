/**
 * MissionSystem — Reusable mission framework
 * Implements Mission 01: "LOST SIGNAL"
 */
import * as THREE from 'three';

export const MISSION_STEPS = {
  LOCATE_SIGNAL: 0,
  SCAN_FRAGMENTS: 1,
  LOCATE_STATION: 2,
  SCAN_STATION: 3,
  RECOVER_BLACKBOX: 4,
  SURVIVE_HAZARD: 5,
  DEFEAT_DRONE: 6,
  EXTRACTION: 7,
  COMPLETED: 8,
};

export class MissionSystem {
  constructor(scene, bursts, audio) {
    this.scene = scene;
    this.bursts = bursts;
    this.audio = audio;

    this.missionId = 'M01_LOST_SIGNAL';
    this.title = 'MISSION 01 — LOST SIGNAL';
    this.currentStep = MISSION_STEPS.LOCATE_SIGNAL;
    this.fragmentsCollected = 0;
    this.requiredFragments = 3;
    this.stationScanned = false;
    this.blackBoxRecovered = false;
    this.droneDefeated = false;
    this.hazardSurvived = false;

    // Mission Coordinates & Waypoints
    this.signalZone = new THREE.Vector3(120, 20, -150);
    this.stationPos = new THREE.Vector3(0, 15, -380);
    this.blackBoxPos = new THREE.Vector3(0, 18, -385);
    this.extractionPos = new THREE.Vector3(0, 25, 260);

    this.fragments = [];
    this.fragmentGroup = new THREE.Group();
    scene.add(this.fragmentGroup);

    this._spawnSignalFragments();
    this.currentWaypoint = this.signalZone;
    this.waypointLabel = 'Signal Origin';
  }

  _spawnSignalFragments() {
    const offsets = [
      new THREE.Vector3(110, 18, -140),
      new THREE.Vector3(135, 24, -165),
      new THREE.Vector3(115, 15, -170),
    ];

    const geo = new THREE.TetrahedronGeometry(0.85, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffdd44,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.1,
    });

    offsets.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      this.fragmentGroup.add(mesh);

      this.fragments.push({
        id: `frag_${idx + 1}`,
        type: 'MISSION',
        name: `Signal Fragment 0${idx + 1}`,
        position: mesh.position,
        mesh,
        baseY: pos.y,
        seed: idx * 2,
        scanned: false,
        collected: false,
      });
    });
  }

  getObjectiveText() {
    switch (this.currentStep) {
      case MISSION_STEPS.LOCATE_SIGNAL:
        return 'Navigate to Signal Coordinates';
      case MISSION_STEPS.SCAN_FRAGMENTS:
        return `Scan Signal Fragments (${this.fragmentsCollected}/${this.requiredFragments})`;
      case MISSION_STEPS.LOCATE_STATION:
        return 'Locate Abandoned Research Station';
      case MISSION_STEPS.SCAN_STATION:
        return 'Scan Station Core [Press E]';
      case MISSION_STEPS.RECOVER_BLACKBOX:
        return 'Retrieve Station Black Box';
      case MISSION_STEPS.SURVIVE_HAZARD:
        return 'Survive Incoming Meteor Storm';
      case MISSION_STEPS.DEFEAT_DRONE:
        return 'Neutralize Rogue Scout Drone';
      case MISSION_STEPS.EXTRACTION:
        return 'Reach Extraction Stargate';
      case MISSION_STEPS.COMPLETED:
        return 'Mission Complete';
      default:
        return 'Explore Deep Space';
    }
  }

  getCurrentMissionData() {
    return {
      title: this.title,
      objective: this.getObjectiveText(),
      distance: this.currentDistance ?? null,
    };
  }

  update(dt, player, onObjectiveUpdate = null, onMissionComplete = null) {
    const pPos = player.position;
    const time = performance.now() * 0.001;

    // Animate signal fragments
    for (const f of this.fragments) {
      if (!f.collected) {
        f.mesh.rotation.y += dt * 2.0;
        f.mesh.rotation.x += dt * 1.5;
        f.mesh.position.y = f.baseY + Math.sin(time * 3 + f.seed) * 0.4;
      }
    }

    switch (this.currentStep) {
      case MISSION_STEPS.LOCATE_SIGNAL:
        this.currentWaypoint = this.signalZone;
        this.waypointLabel = 'Signal Zone';
        if (pPos.distanceTo(this.signalZone) < 35) {
          this.currentStep = MISSION_STEPS.SCAN_FRAGMENTS;
          this.audio?.checkpoint?.();
          onObjectiveUpdate?.('Signal Detected! Use Scanner [Q] to locate data fragments');
        }
        break;

      case MISSION_STEPS.SCAN_FRAGMENTS:
        // Waypoint points to nearest uncollected fragment
        const uncollected = this.fragments.filter((f) => !f.collected);
        if (uncollected.length > 0) {
          this.currentWaypoint = uncollected[0].position;
          this.waypointLabel = uncollected[0].name;
        }

        // Check collection
        for (const f of uncollected) {
          if (pPos.distanceTo(f.position) < 3.2) {
            f.collected = true;
            f.mesh.visible = false;
            this.fragmentsCollected++;
            this.audio?.resource?.();
            this.bursts?.emit(f.position, 28, {
              color: new THREE.Color(0xffdd44),
              speed: 5.0,
              up: 1.0,
              spread: 2.5,
              life: 1.0,
            });

            onObjectiveUpdate?.(`Signal Fragment Recovered (${this.fragmentsCollected}/${this.requiredFragments})`);

            if (this.fragmentsCollected >= this.requiredFragments) {
              this.currentStep = MISSION_STEPS.LOCATE_STATION;
              this.audio?.checkpoint?.();
              onObjectiveUpdate?.('Signal Decrypted! Station coordinates revealed.');
            }
          }
        }
        break;

      case MISSION_STEPS.LOCATE_STATION:
        this.currentWaypoint = this.stationPos;
        this.waypointLabel = 'Abandoned Station';
        if (pPos.distanceTo(this.stationPos) < 45) {
          this.currentStep = MISSION_STEPS.SCAN_STATION;
          this.audio?.checkpoint?.();
          onObjectiveUpdate?.('Approach Station Dock and Scan [E]');
        }
        break;

      case MISSION_STEPS.SCAN_STATION:
        this.currentWaypoint = this.stationPos;
        this.waypointLabel = 'Station Dock';
        break;

      case MISSION_STEPS.RECOVER_BLACKBOX:
        this.currentWaypoint = this.blackBoxPos;
        this.waypointLabel = 'Black Box';
        if (pPos.distanceTo(this.blackBoxPos) < 4.0) {
          this.blackBoxRecovered = true;
          this.currentStep = MISSION_STEPS.SURVIVE_HAZARD;
          this.audio?.checkpoint?.();
          onObjectiveUpdate?.('Black Box Recovered! Warning: Energy Spike Detected');
        }
        break;

      case MISSION_STEPS.SURVIVE_HAZARD:
        // Checked externally by HazardSystem
        break;

      case MISSION_STEPS.DEFEAT_DRONE:
        // Checked externally by EnemyManager / Drone
        break;

      case MISSION_STEPS.EXTRACTION:
        this.currentWaypoint = this.extractionPos;
        this.waypointLabel = 'Extraction Stargate';
        if (pPos.distanceTo(this.extractionPos) < 14) {
          this.currentStep = MISSION_STEPS.COMPLETED;
          this.audio?.warp?.();
          onMissionComplete?.({
            title: 'MISSION 01 — LOST SIGNAL',
            xp: 450,
            credits: 1200,
            relics: 1,
          });
        }
        break;
    }
  }

  scanStationInteraction(playerPos, callback) {
    if (this.currentStep === MISSION_STEPS.SCAN_STATION) {
      if (playerPos.distanceTo(this.stationPos) < 35) {
        this.stationScanned = true;
        this.currentStep = MISSION_STEPS.RECOVER_BLACKBOX;
        this.audio?.checkpoint?.();
        callback?.('Station Decrypted: Power Critical. Recovering Black Box...');
        return true;
      }
    }
    return false;
  }

  getTargets() {
    const targets = [];
    if (this.currentStep === MISSION_STEPS.SCAN_FRAGMENTS) {
      this.fragments
        .filter((f) => !f.collected)
        .forEach((f) => {
          targets.push({
            id: f.id,
            type: 'MISSION',
            name: f.name,
            position: f.position,
          });
        });
    } else if (this.currentWaypoint) {
      targets.push({
        id: 'mission_waypoint',
        type: 'MISSION',
        name: this.waypointLabel,
        position: this.currentWaypoint,
      });
    }
    return targets;
  }
}
