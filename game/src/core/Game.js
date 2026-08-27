/**
 * Game — Master Open-World Zero-G Deep-Space Game
 * Manages 3D Zero-G Player, Planets, Space Stations, Glowing Platforms,
 * Space Shuttles, Wrecked Starships, Asteroid Belts, Black Holes,
 * Continuous Collision Physics, Radar, Scanner, and Mission Systems.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { Engine } from './Engine.js';
import { Physics } from './Physics.js';
import { SETTINGS } from '../config/settings.js';
import { Materials } from '../materials/Materials.js';
import { World } from '../world/World.js';
import { Environment } from '../world/Environment.js';
import { Player } from '../player/Player.js';
import { CameraRig } from '../camera/CameraRig.js';
import { Lighting } from '../lighting/Lighting.js';
import { Input } from '../controls/Input.js';
import { BurstParticles, AmbientMotes, ThrusterParticles, HyperspaceStreaks } from '../particles/Particles.js';
import { GameAudio } from '../audio/Audio.js';
import { UI } from '../ui/UI.js';
import { LEVELS } from '../levels/levels.js';
import { Universe } from '../world/Universe.js';

// Gameplay Subsystems
import { Progression } from '../gameplay/Progression.js';
import { Scanner } from '../gameplay/Scanner.js';
import { ResourceManager } from '../gameplay/ResourceManager.js';
import { MissionSystem, MISSION_STEPS } from '../gameplay/MissionSystem.js';
import { HazardSystem } from '../gameplay/HazardSystem.js';
import { Drone } from '../gameplay/Drone.js';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export class Game {
  constructor(canvas, uiRoot) {
    this.state = 'start';
    this.levelIndex = 0;
    this.levelTime = 0;
    this.totalTime = 0;
    this._warpCooldown = 0;

    // --- Subsystems ---------------------------------------------------
    this.engine = new Engine(canvas);
    this.materials = new Materials();
    this.physics = new Physics(SETTINGS.physics);
    this.world = new World(this.engine.scene, this.physics, this.materials);
    this.environment = new Environment(this.engine.scene);
    this.input = new Input(canvas);
    this.bursts = new BurstParticles(this.engine.scene);
    this.thrusters = new ThrusterParticles(this.engine.scene);
    this.hyperspace = new HyperspaceStreaks(this.engine.scene);
    this.motes = new AmbientMotes(this.engine.scene, SETTINGS.fx.ambientMotes);
    this.audio = new GameAudio();

    this.player = new Player({
      scene: this.engine.scene,
      physics: this.physics,
      input: this.input,
      materials: this.materials,
      thrusters: this.thrusters,
    });
    this.rig = new CameraRig(this.engine.camera, this.input);
    this.lighting = new Lighting(this.engine);

    // Deep-Space Universe with Solid Celestial Bodies & Structures
    this.universe = new Universe({
      scene: this.engine.scene,
      physics: this.physics,
      materials: this.materials,
      bursts: this.bursts,
      audio: this.audio,
    });

    // Deep Space Gameplay Frameworks
    this.progression = new Progression();
    this.progression.applyUpgrades(this.player.stats);

    this.scanner = new Scanner(this.engine.scene, this.audio);
    this.resources = new ResourceManager(this.engine.scene, this.bursts, this.audio);
    this.missions = new MissionSystem(this.engine.scene, this.bursts, this.audio);
    this.hazards = new HazardSystem(this.engine.scene, this.bursts, this.audio);
    this.drone = new Drone(this.engine.scene, this.bursts, this.audio, new THREE.Vector3(25, 18, -340));

    this.ui = new UI(uiRoot);

    this._spawnInitialResources();
    this._wireEvents();
    this.engine.onTick((dt, elapsed) => this._tick(dt, elapsed));
  }

  _spawnInitialResources() {
    // Empty canvas ready for custom resources
  }

  /** Boot: build backdrop and begin rendering. */
  boot() {
    this._loadLevel(0, { instant: true });
    this.player.frozen = true;
    this.rig.orbit(this.player.position, { dist: 16, h: 8 });
    this.ui.showStart();
    this.engine.start();
  }

  start() {
    if (this.state === 'start') this._begin();
  }

  /* ---------------- Event Wiring ------------------------------------- */
  _wireEvents() {
    this.player.onJump = () => this.audio.jump();
    this.player.onJetpack = (active, intensity) => this.audio.updateJetpack(active, intensity);
    this.player.onLand = (speed) => {
      const intensity = Math.min(1, speed / 22);
      this.audio.land(intensity);
      this.bursts.emit(
        this.player.position.clone().setY(this.player.position.y - SETTINGS.player.radius * 0.8),
        Math.round(6 + intensity * 14),
        { color: new THREE.Color(0xb9c0c6), speed: 2.5 + intensity * 3, up: 1.2, life: 0.8 },
      );
    };
    this.player.onFall = () => {
      this.audio.fall();
      this.ui.toast('Warped to beacon');
      this.player.respawn();
      this.audio.warp();
      this.bursts.emit(this.player.spawn, 20, {
        color: new THREE.Color(0xffd9a0), speed: 3, up: 2.2, spread: 1.4, life: 1.1,
      });
      this.rig.snapTo(this.player.position, this.rig.yaw);
    };

    // World Events
    this.world.onCheckpoint = (pos) => {
      this.player.setSpawn(pos);
      this.player.stats.replenishAll();
      this.progression.addXP(50, (lvl) => this.ui.toast(`🎉 LEVEL UP: LVL ${lvl}!`));
      this.progression.addCredits(150);
      this.audio.checkpoint();
      this.bursts.emit(pos, 24, { color: new THREE.Color(0x00d4ff), speed: 3.5, up: 1.5, life: 1.0 });
      this.ui.toast('✦ Beacon Linked // Supplies Replenished (+CR 150)');
    };
    this.world.onPad = (pos) => {
      this.audio.pad();
      this.bursts.emit(pos, 12, { color: new THREE.Color(this.world.accent), speed: 2, up: 2.4, life: 0.9 });
    };
    this.world.onGateOpen = (pos) => {
      this.audio.gate();
      this.ui.toast('Sector Gate Unlocked');
    };
    this.world.onPortal = () => {
      this.audio.boost();
      this.player.stats.replenishAll();
      this.progression.addCredits(500);
      this.progression.addXP(200, (lvl) => this.ui.toast(`🎉 LEVEL UP: LVL ${lvl}!`));
      this.bursts.emit(this.player.position, 40, { color: new THREE.Color(0x00d4ff), speed: 8.0, up: 2.0, life: 1.4 });
      this.player.body.velocity.add(new THREE.Vector3(0, 6, -20));
      this.player.warpIntensity = 1.0;
      this.ui.toast('⚡ SECTOR PORTAL ACTIVATED // WARP SPEED ENGAGED (+CR 500)');
    };
    this.world.onWormhole = ({ pos, from }) => this._warp(pos, from);

    // Physics Zero-G Impact & Atmospheric Callbacks
    this.physics.onImpact = ({ speed, normal, collider, damage }) => {
      if (damage > 0) {
        this.player.stats.suitIntegrity = Math.max(0, this.player.stats.suitIntegrity - damage);
        this.ui.toast(`⚠ IMPACT: -${Math.round(damage)}% SUIT INTEGRITY (${collider.name || 'Obstacle'})`);
      }
      this.rig.shake(Math.min(1.2, speed * 0.05));
      this.audio.land(Math.min(1, speed / 20));
      this.bursts.emit(this.player.position, Math.round(10 + speed * 1.5), {
        color: new THREE.Color(0xffbb44),
        speed: 4.5,
        up: 1.2,
        life: 0.8,
      });
    };

    this.physics.onAtmosphereEnter = (atmo) => {
      if (Math.random() < 0.02) {
        this.ui.toast(`Atmospheric Entry: ${atmo.name} (Alt: ${Math.round(atmo.altitude)}m)`);
      }
    };

    this.physics.onGravityWell = (name, dist, factor) => {
      if (factor > 0.55 && Math.random() < 0.02) {
        this.ui.toast(`⚠ GRAVITATIONAL DISTURBANCE: ${name.toUpperCase()}`);
      }
    };

    // Gameplay Input Events
    this.input.on('scanner', () => this._handleScanner());
    this.input.on('map', () => this.ui.sectorMap.toggle());
    this.input.on('interact', () => this._handleInteract());
    this.input.on('upgrades', () => this._toggleUpgrades());

    this.input.on('confirm', () => {
      if (this.state === 'start') this._begin();
      else if (this.state === 'gameover') this._handleRespawn();
      else if (this.state === 'complete') this._toMainMenu();
    });
    this.input.on('jump', () => {
      if (this.state === 'gameover') this._handleRespawn();
    });
    this.input.on('pause', () => {
      if (this.ui.isUpgradesOpen) {
        this._closeUpgrades();
      } else if (this.ui.sectorMap.visible) {
        this.ui.sectorMap.hide();
      } else if (this.state === 'play') {
        this._pause();
      } else if (this.state === 'pause') {
        this._unpause();
      }
    });

    // UI callbacks
    this.ui.onUpgradeBuy = (type) => this._handleUpgradePurchase(type);
    this.ui.el.begin?.addEventListener('click', () => this._begin());
    this.ui.el.resume?.addEventListener('click', () => this._unpause());
    this.ui.el.respawnBtn?.addEventListener('click', () => this._handleRespawn());
    this.ui.el.openUpgrades?.addEventListener('click', () => this._openUpgrades());
    this.ui.el.closeUpgrades?.addEventListener('click', () => this._closeUpgrades());
    this.ui.el.closeUpgradesX?.addEventListener('click', () => this._closeUpgrades());
    this.ui.el.restartLevel?.addEventListener('click', () => this._restartLevel());
    this.ui.el.mainMenu?.addEventListener('click', () => this._toMainMenu());
    this.ui.el.settingsAudio?.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      this.ui.el.settingsAudio.textContent = `Audio — ${muted ? 'Off' : 'On'}`;
    });
  }

  _handleRespawn() {
    this.ui.hideGameOver();
    this.player.stats.replenishAll();
    this.player.respawn();
    this._enterPlay();
    this.ui.showHUD();
    this.ui.toast('✦ Life Support Restored // Respawned at Beacon');
  }

  _handleUpgradePurchase(type) {
    const success = this.progression.purchaseUpgrade(type, (newTier, totalCredits) => {
      this.progression.applyUpgrades(this.player.stats);
      this.ui.toast(`✦ Upgraded to Tier ${newTier}!`);
      this.audio.checkpoint();
      this.ui.updateUpgradeTerminal(this.progression);
      this.ui.setProgression(this.progression);
    });

    if (!success) {
      this.ui.toast('⚠ Insufficient Credits');
      this.audio.fall();
    }
  }

  _openUpgrades() {
    this.player.paused = true;
    this.input.unlockPointer();
    this.ui.showUpgrades(this.progression);
  }

  _closeUpgrades() {
    this.ui.hideUpgrades();
    if (this.state === 'play') {
      this.player.paused = false;
      this.input.lockPointer();
      this.ui.showHUD();
    } else if (this.state === 'pause') {
      const meta = `Sector ${String(this.levelIndex + 1).padStart(2, '0')} · ${formatTime(this.levelTime)}`;
      this.ui.showPause(meta);
    }
  }

  _toggleUpgrades() {
    if (this.ui.isUpgradesOpen) {
      this._closeUpgrades();
    } else {
      this._openUpgrades();
    }
  }

  _handleScanner() {
    if (this.state !== 'play') return;
    const targets = this._getAllSurroundingTargets();
    this.scanner.trigger(this.player.position, targets, (results) => {
      if (results.length > 0) {
        this.ui.showScanCard(results[0]);
        setTimeout(() => this.ui.showScanCard(null), 4000);
      }
    });
  }

  _handleInteract() {
    if (this.state !== 'play') return;
    const pPos = this.player.position;

    // 1. Check Discovery Shuttle Docking & Refuel
    const shuttlePos = new THREE.Vector3(12, -4.6, 6);
    if (pPos.distanceTo(shuttlePos) < 18.0) {
      this.player.stats.replenishAll();
      this.progression.addCredits(200);
      this.progression.addXP(100, (lvl) => this.ui.toast(`🎉 LEVEL UP: LVL ${lvl}!`));
      this.audio.checkpoint();
      this.bursts.emit(this.player.position, 30, {
        color: new THREE.Color(0x00e5ff),
        speed: 5.0,
        up: 1.5,
        life: 1.0,
      });
      this.ui.toast('🚀 Discovery Shuttle Docked // Oxygen & Fuel 100% (+CR 200)');
      return;
    }

    // 2. Check Alien Relic collection
    for (const r of this.universe.relics) {
      if (!r.collected && pPos.distanceTo(r.position) < 8.0) {
        r.collected = true;
        r.mesh.visible = false;
        this.progression.relicsFound++;
        this.progression.addXP(250, (lvl) => this.ui.toast(`🎉 LEVEL UP: LVL ${lvl}!`));
        this.progression.addCredits(600);
        this.audio.relic();
        this.bursts.emit(r.position, 40, {
          color: new THREE.Color(0x00f0ff),
          speed: 6.0,
          up: 1.5,
          life: 1.2,
        });
        this.ui.toast(`✦ ALIEN RELIC EXTRACTED! (+CR 600, +250 XP)`);
        return;
      }
    }

    // 3. Check Stargate Hyperspace Catapult
    for (const g of this.universe.stargates) {
      if (pPos.distanceTo(g.position) < 24.0) {
        this.audio.warp();
        this.audio.boost();
        const fwd = g.forward.clone().normalize();
        this.player.body.velocity.copy(fwd).multiplyScalar(SETTINGS.jetpack.speedOfLight);
        this.player.warpIntensity = 1.0;
        this.player.isLightSpeed = true;
        this.bursts.emit(g.position, 50, {
          color: new THREE.Color(0x00e5ff),
          speed: 10.0,
          up: 0,
          life: 1.4,
        });
        this.ui.toast('⚡ HYPERSPACE LIGHT SPEED ENGAGED! ⚡');
        return;
      }
    }

    // 4. Station Scan / Mission interaction
    this.missions.scanStationInteraction(this.player.position, (msg) => {
      this.ui.toast(msg, 3.0);
      this.progression.addXP(150);
    });
  }

  _getAllSurroundingTargets() {
    const targets = [];

    // 1. Celestial Planets & Moons
    for (const p of this.universe.planets) {
      targets.push({
        id: `planet_${p.name.toLowerCase()}`,
        type: 'PLANET',
        name: `Planet ${p.name}`,
        position: p.position,
        radius: p.radius,
      });
    }

    // 2. Space Stations & Glowing Platforms
    for (const st of this.universe.stations) {
      targets.push({
        id: `station_${st.name}`,
        type: 'STATION',
        name: st.name,
        position: st.position,
      });
    }
    for (const plt of this.universe.platforms) {
      targets.push({
        id: `platform_${plt.name}`,
        type: 'STATION',
        name: plt.name,
        position: plt.position,
      });
    }

    // 3. Realistic Spaceships & Space Shuttles
    for (const shp of this.universe.spaceships) {
      targets.push({
        id: `ship_${shp.name}`,
        type: 'SATELLITE',
        name: shp.name,
        position: shp.position,
      });
    }

    // 4. Wrecked Starships
    for (const w of this.universe.wrecks) {
      targets.push({
        id: `wreck_${w.name}`,
        type: 'WRECK',
        name: w.name,
        position: w.position,
      });
    }

    // 5. Satellites
    for (const s of this.universe.satellites) {
      targets.push({
        id: `sat_${s.name}`,
        type: 'SATELLITE',
        name: s.name,
        position: s.position,
      });
    }

    // 6. Stargates
    for (const g of this.universe.stargates) {
      targets.push({
        id: `gate_${g.trigger.name}`,
        type: 'PORTAL',
        name: g.trigger.name,
        position: g.position,
      });
    }

    // 7. Relics
    for (const r of this.universe.relics) {
      if (!r.collected) {
        targets.push({
          id: `relic_${r.trigger.name}`,
          type: 'RELIC',
          name: r.trigger.name,
          position: r.position,
        });
      }
    }

    // 8. Missions & Resources
    targets.push(...this.missions.getTargets());
    targets.push(...this.resources.getTargets());

    return targets;
  }

  /* ---------------- State Transitions -------------------------------- */
  _begin() {
    if (this.state === 'play') return;
    this.audio.init();
    this.audio.click();
    this.ui.hideStart();

    this.rig.endOrbit();
    this._enterPlay();
    this.ui.showHUD();
    this.ui.toast('✦ OPEN SPACE // 3D Zero-G Flight Active');
  }

  _enterPlay() {
    this.state = 'play';
    this.player.frozen = false;
    this.player.paused = false;
    this.input.enabled = true;
    this.input.lockPointer();
    this.rig.snapTo(this.player.position, this.rig.yaw);
  }

  _pause() {
    if (this.state !== 'play') return;
    this.state = 'pause';
    this.player.paused = true;
    this.input.unlockPointer();
    const meta = `Sector ${String(this.levelIndex + 1).padStart(2, '0')} · ${formatTime(this.levelTime)}`;
    this.ui.showPause(meta);
  }

  _unpause() {
    if (this.state !== 'pause') return;
    this.ui.hidePause();
    this.state = 'play';
    this.player.paused = false;
    this.input.lockPointer();
  }

  _togglePause() {
    if (this.state === 'play') this._pause();
    else if (this.state === 'pause') this._unpause();
  }

  _restartLevel() {
    this.ui.hidePause();
    this.player.stats.replenishAll();
    this.player.respawn();
    this._enterPlay();
  }

  _toMainMenu() {
    this.state = 'start';
    this.player.frozen = true;
    this.player.paused = false;
    this.input.unlockPointer();
    this.ui.hidePause();
    this.ui.hideComplete();
    this.ui.showStart();
    this.rig.orbit(this.player.position, { dist: 16, h: 8 });
  }

  _loadLevel(index, opts = {}) {
    this.levelIndex = index;
    const def = LEVELS[index] ?? LEVELS[0];
    this.world.build(def);
    if (this.lighting?.applyTheme) {
      this.lighting.applyTheme(this.world.theme, opts.instant);
    } else if (this.lighting?.transitionTo) {
      this.lighting.transitionTo(this.world.theme, opts.instant ? 0 : 1.6);
    }
    this.player.setSpawn(def.spawn);
    this.player.respawn();
    this.levelTime = 0;
  }

  /* ---------------- Main Tick Loop ----------------------------------- */
  _tick(dt, elapsed) {
    const pPos = this.player.position;
    const v = this.player.velocity;

    if (this.state === 'play') {
      this.levelTime += dt;
      this.totalTime += dt;

      // Check player survival death
      if (this.player.stats.isDead) {
        this.state = 'gameover';
        this.input.unlockPointer();
        this.audio.explosion();
        this.ui.showGameOver(() => this._handleRespawn());
        return;
      }

      // Open World telemetry HUD updates
      this.ui.setSurvivalStats(this.player.stats);
      this.ui.setProgression(this.progression);
      this.ui.setSpeed(v.length() * 3.6);
      this.ui.setWarpState(this.player.isLightSpeed, this.player.warpIntensity);
      this.ui.setCoords(pPos.x, pPos.y, pPos.z, pPos.y);

      // Mission tracker distance calculation
      if (this.missions.currentWaypoint) {
        this.missions.currentDistance = pPos.distanceTo(this.missions.currentWaypoint);
      }
      this.ui.setMission(this.missions);

      // Status Beacon
      if (this.player.isLightSpeed) {
        this.ui.setBeacon('⚡ HYPERSPACE LIGHT SPEED ⚡');
      } else if (this.physics.proximityWarning) {
        this.ui.setBeacon(`⚠ ${this.physics.proximityWarning.name} (${this.physics.proximityWarning.distance}m)`);
      } else {
        this.ui.setBeacon('Deep Space Orbit');
      }

      // Update Proximity Hazard Alert
      this.ui.setProximityAlert(this.physics.proximityWarning);

      // Contextual [E] Key Interaction Prompt
      let interactPrompt = null;
      if (pPos.distanceTo(new THREE.Vector3(12, -4.6, 6)) < 18.0) {
        interactPrompt = 'DOCK & REFUEL SHUTTLE';
      } else {
        for (const r of this.universe.relics) {
          if (!r.collected && pPos.distanceTo(r.position) < 8.0) {
            interactPrompt = 'EXTRACT ALIEN RELIC';
            break;
          }
        }
        if (!interactPrompt) {
          for (const g of this.universe.stargates) {
            if (pPos.distanceTo(g.position) < 24.0) {
              interactPrompt = 'ENGAGE HYPERSPACE WARP';
              break;
            }
          }
        }
      }
      this.ui.setInteractPrompt(interactPrompt);

      // Update Resources
      this.resources.update(dt, this.player, (meta, inv) => {
        this.ui.toast(`+ ${meta.name}`);
        this.progression.addCredits(meta.value);
        this.progression.addXP(25, (lvl) => this.ui.toast(`🎉 LEVEL UP: LVL ${lvl}!`));
      });

      // Update Missions
      this.missions.update(
        dt,
        this.player,
        (msg) => this.ui.toast(msg),
        (compData) => this._completeMission(compData),
      );

      // Trigger Meteor Storm Hazard during Step 5
      if (this.missions.currentStep === MISSION_STEPS.SURVIVE_HAZARD && this.hazards.state === 'idle') {
        this.hazards.triggerMeteorStorm(16, (msg) => this.ui.setHazardAlert(true, msg));
      }

      // Update Hazards
      this.hazards.update(
        dt,
        this.player,
        (msg) => this.ui.setHazardAlert(true, msg),
        () => {
          this.ui.setHazardAlert(false);
          this.missions.currentStep = MISSION_STEPS.DEFEAT_DRONE;
          this.progression.addXP(150);
          this.ui.toast('Meteor Storm Cleared! Warning: Drone Incoming!');
        },
      );

      // Update Hostile Drone
      this.drone.update(dt, this.player, () => {
        this.ui.toast('Rogue Scout Drone Destroyed! ✦');
        this.missions.currentStep = MISSION_STEPS.EXTRACTION;
        this.progression.addXP(250);
        this.resources.spawn('CRYSTAL', this.drone.position.clone());
        this.resources.spawn('SCRAP', this.drone.position.clone().add(new THREE.Vector3(1, 0, 1)));
      });

      // Update Radar & Sector Map with surrounding targets
      const allTargets = this._getAllSurroundingTargets();
      this.ui.updateRadar(pPos, this.player.cameraYaw, allTargets);
      this.ui.updateSectorMap(pPos, this.player.cameraYaw, allTargets);
    }

    // Visuals & Physics update
    this.materials.update(elapsed);
    this.world.update();
    const collisionSolids = this.universe?.group || this.world.solids;
    this.player.update(dt, collisionSolids);
    this.rig.update(dt, this.player, collisionSolids);
    this.lighting.follow(pPos);
    this.bursts.update(elapsed);
    this.thrusters.update(elapsed);
    this.hyperspace.update(elapsed, pPos, v, this.player.warpIntensity);
    this.motes.update(elapsed, pPos);
    this.scanner.update(dt);
    this.universe.update(dt, pPos);
  }
}
