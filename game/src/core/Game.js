/**
 * Game — the state machine that owns every subsystem and the flow:
 * START → INTRO → PLAY ⇄ PAUSE → COMPLETE → (next level) → END
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
import { BurstParticles, AmbientMotes } from '../particles/Particles.js';
import { GameAudio } from '../audio/Audio.js';
import { UI } from '../ui/UI.js';
import { LEVELS } from '../levels/levels.js';

export class Game {
  constructor(canvas, uiRoot) {
    this.state = 'start';
    this.levelIndex = 0;
    this.levelTime = 0;
    this.totalTime = 0;
    this.energy = 100; // sprint fuel — drains while sprinting, regenerates

    // --- subsystems ---------------------------------------------------
    this.engine = new Engine(canvas);
    this.materials = new Materials();
    this.physics = new Physics(SETTINGS.physics);
    this.world = new World(this.engine.scene, this.physics, this.materials);
    this.environment = new Environment(this.engine.scene);
    this.input = new Input(canvas);
    this.player = new Player({
      scene: this.engine.scene,
      physics: this.physics,
      input: this.input,
      materials: this.materials,
    });
    this.rig = new CameraRig(this.engine.camera, this.input);
    this.lighting = new Lighting(this.engine);
    this.bursts = new BurstParticles(this.engine.scene);
    this.motes = new AmbientMotes(this.engine.scene, SETTINGS.fx.ambientMotes);
    this.audio = new GameAudio();
    this.ui = new UI(uiRoot);

    this._wireEvents();
    this.engine.onTick((dt, elapsed) => this._tick(dt, elapsed));
  }

  /** Boot: build level 1 as the start-screen backdrop and begin rendering. */
  boot() {
    this._loadLevel(0, { instant: true });
    this.player.frozen = true;
    // wide idle orbit as the menu backdrop
    this.rig.orbit(this.player.position, { dist: 16, h: 8 });
    this.ui.showStart();
    this.engine.start();
  }

  /** Public entry — same as pressing ENTER on the start screen. */
  start() {
    if (this.state === 'start') this._begin();
  }

  /* ------------------------------------------------------------------ */

  _wireEvents() {
    // gameplay feedback
    this.player.onJump = () => this.audio.jump();
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
      // the void takes you — the checkpoint wormhole spits you back out
      this.audio.fall();
      this.ui.toast('Warped to checkpoint');
      this.energy = Math.max(0, this.energy - 8);
      this.player.respawn();
      this.audio.warp();
      this.bursts.emit(this.player.spawn, 20, {
        color: new THREE.Color(0xffd9a0), speed: 3, up: 2.2, spread: 1.4, life: 1.1,
      });
      this.rig.snapTo(this.player.position, this.rig.yaw);
    };

    // world events
    this.world.onCheckpoint = (pos) => {
      this.player.setSpawn(pos);
      this.audio.checkpoint();
      this.ui.toast('Checkpoint');
      this.bursts.emit(pos, 16, { color: new THREE.Color(0xffd9a0), speed: 2.2, up: 3, life: 1.1 });
    };
    this.world.onPad = (pos) => {
      this.audio.pad();
      this.bursts.emit(pos, 12, { color: new THREE.Color(this.world.accent), speed: 2, up: 2.4, life: 0.9 });
    };
    this.world.onGateOpen = (pos) => {
      this.audio.gate();
      this.ui.toast('Gate unlocked');
      this.bursts.emit(pos, 24, { color: new THREE.Color(this.world.accent), speed: 3.4, up: 1.6, spread: 2, life: 1.2 });
    };
    this.world.onPortal = () => this._completeLevel();
    this.world.onWormhole = ({ pos, from }) => this._warp(pos, from);

    // input events
    this.input.on('confirm', () => {
      if (this.state === 'start') this._begin();
      else if (this.state === 'complete') this._continue();
      else if (this.state === 'end') this._replay();
    });
    this.input.on('pause', () => {
      if (this.state === 'pause') this._resume();
    });
    this.input.on('unlock', () => {
      if (this.state === 'play') this._pause();
    });
    this.input.on('restart', () => {
      if (this.state === 'play') this._restartLevel();
    });
    this.input.on('mute', () => {
      const muted = this.audio.toggleMute();
      if (muted !== undefined) {
        this.ui.setAudioLabel(muted);
        this.ui.toast(muted ? 'Audio muted' : 'Audio on');
      }
    });

    // UI buttons
    this.ui.onClick('begin', () => this.state === 'start' && this._begin());
    this.ui.onClick('resume', () => this._resume());
    this.ui.onClick('restartLevel', () => { this.ui.hidePause(); this._restartLevel(); });
    this.ui.onClick('continue', () => this.state === 'complete' && this._continue());
    this.ui.onClick('again', () => this.state === 'end' && this._replay());
    this.ui.onClick('mainMenu', () => this.state === 'pause' && this._toMainMenu());
    this.ui.onClick('settingsAudio', () => {
      const muted = this.audio.toggleMute();
      if (muted !== undefined) this.ui.setAudioLabel(muted);
    });
    this.ui.onClick('fullscreen', () => {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.();
    });

    // clicking the canvas re-locks the pointer during play
    this.engine.canvas.addEventListener('click', () => {
      if (this.state === 'play') this.input.lockPointer();
    });
  }

  /* ---------------- state transitions -------------------------------- */

  async _begin() {
    this.state = 'intro';
    this.audio.init();
    this.audio.click();
    this.ui.hideStart();
    this.ui.letterbox(true);

    this.rig.endOrbit();
    await this.rig.intro(this.player.position);

    this.ui.letterbox(false);
    this._enterPlay();
    this.ui.showHUD(this.levelIndex, LEVELS.length, LEVELS[this.levelIndex].name);
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
    this.state = 'pause';
    this.player.frozen = true;
    this.player.paused = true;
    this.input.enabled = false;
    this.input.unlockPointer();
    for (const t of this.world.tweens) t.pause();
    this.ui.showPause(`Level ${this.levelIndex + 1} — ${LEVELS[this.levelIndex].name}`);
  }

  _resume() {
    if (this.state !== 'pause') return;
    this.audio.click();
    this.ui.hidePause();
    for (const t of this.world.tweens) t.resume();
    this._enterPlay();
  }

  async _restartLevel() {
    this.audio.click();
    this.state = 'transition';
    this.input.enabled = false;
    await this.ui.veilTransition(() => {
      this.energy = 100;
      this._loadLevel(this.levelIndex, { instant: true });
    });
    this._enterPlay();
  }

  /** Wormhole traversal: teleport, keep momentum, snap the camera. */
  _warp(pos, from) {
    if (this.state !== 'play' || this._warpBlocked) return;
    this._warpBlocked = true; // released once clear of every mouth

    this.audio.warp();
    const c = new THREE.Color(0xffce8a);
    this.bursts.emit(from, 22, { color: c, speed: 3.5, up: 2, spread: 1.6, life: 1.1 });

    this.player.body.position.copy(pos);
    this.player.mesh.position.copy(pos);
    this.rig.snapTo(pos, this.rig.yaw);
    this.lighting.follow(pos);

    this.bursts.emit(pos, 22, { color: c, speed: 3.5, up: 2, spread: 1.6, life: 1.1 });
    gsap.fromTo(this.player.mesh.scale, { x: 0.3, y: 0.3, z: 0.3 },
      { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' });
  }

  _completeLevel() {
    if (this.state !== 'play') return;
    this.state = 'complete';
    this.totalTime += this.levelTime;
    this.player.frozen = true;
    this.input.enabled = false;
    this.input.unlockPointer();
    this.audio.portal();
    this.ui.hideHUD();
    this.ui.letterbox(true);
    this.rig.orbit(this.player.position);

    if (this.world.portalPos) {
      this.bursts.emit(this.world.portalPos, 40, {
        color: new THREE.Color(this.world.accent), speed: 4, up: 2.5, spread: 2, life: 1.6,
      });
    }

    const last = this.levelIndex >= LEVELS.length - 1;
    if (last) {
      this.state = 'end';
      this.ui.showEnd(this.totalTime);
    } else {
      this.ui.showComplete(LEVELS[this.levelIndex].name, this.levelTime, this.energy);
    }
  }

  /** Leave the run and return to the title screen. */
  async _toMainMenu() {
    this.audio.click();
    this.state = 'transition';
    this.input.enabled = false;
    this.ui.hidePause();
    this.ui.hideHUD();

    await this.ui.veilTransition(() => {
      this.totalTime = 0;
      this.energy = 100;
      this._loadLevel(0, { instant: true });
    });

    this.state = 'start';
    this.player.frozen = true;
    this.player.paused = false;
    this.rig.endOrbit();
    this.rig.orbit(this.player.position, { dist: 16, h: 8 });
    this.ui.showStart();
  }

  async _continue() {
    this.audio.click();
    this.state = 'transition';
    this.ui.hideComplete();
    this.rig.endOrbit();

    await this.ui.veilTransition(() => {
      this._loadLevel(this.levelIndex + 1, { instant: true });
    });

    this.ui.letterbox(true);
    await this.rig.intro(this.player.position);
    this.ui.letterbox(false);
    this._enterPlay();
    this.ui.showHUD(this.levelIndex, LEVELS.length, LEVELS[this.levelIndex].name);
  }

  async _replay() {
    this.audio.click();
    this.state = 'transition';
    this.ui.hideEnd();
    this.rig.endOrbit();
    this.totalTime = 0;
    this.energy = 100;

    await this.ui.veilTransition(() => {
      this._loadLevel(0, { instant: true });
    });

    this.ui.letterbox(true);
    await this.rig.intro(this.player.position);
    this.ui.letterbox(false);
    this._enterPlay();
    this.ui.showHUD(this.levelIndex, LEVELS.length, LEVELS[this.levelIndex].name);
  }

  _loadLevel(index, { instant = false } = {}) {
    this.levelIndex = index;
    this.levelTime = 0;
    const level = LEVELS[index];
    const { spawn } = this.world.load(level);
    this.player.setSpawn(spawn);
    this.player.respawn();
    this.lighting.transitionTo(level.palette, instant ? 0.01 : 1.6);
    this.lighting.follow(this.player.position);
  }

  /* ---------------- per-frame ---------------------------------------- */

  _tick(dt, elapsed) {
    const playing = this.state === 'play';
    if (playing) {
      this.levelTime += dt;
      this.ui.setTimer(this.levelTime);

      // --- energy: sprint drains it, easing off restores it ------------
      const v = this.player.velocity;
      const speed = Math.hypot(v.x, v.z);
      const sprinting = this.input.sprinting && speed > 2 && this.player.sprintAllowed;
      this.energy = Math.min(100, Math.max(0, this.energy + (sprinting ? -7 : 3.2) * dt));
      this.player.sprintAllowed = this.energy > 1;
      this.ui.setEnergy(this.energy);
      this.ui.setSpeed(speed * 3.6);
    }

    // re-arm wormholes only after the player rolls clear of every mouth
    if (this._warpBlocked) {
      this._warpBlocked = this.world.wormholeMouths.some(
        (m) => m.distanceToSquared(this.player.position) < 2.2 * 2.2,
      );
    }

    this.materials.update(elapsed);
    this.world.update();
    this.player.update(dt, this.world.solids);
    this.rig.update(dt, this.player, this.world.solids);
    this.lighting.follow(this.player.position);
    this.bursts.update(elapsed);
    this.motes.update(elapsed, this.player.position);

    // faint ambient shimmer at the portal
    if (this.world.portalPos && Math.random() < dt * 3) {
      this.bursts.emit(this.world.portalPos, 1, {
        color: new THREE.Color(this.world.accent), speed: 0.8, up: 0.8, spread: 1.6, life: 1.4, size: 1,
      });
    }
  }
}
