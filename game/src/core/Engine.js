/**
 * Engine — renderer, post-processing chain and the render loop.
 * ACES tone mapping, soft shadows, bloom, adaptive resolution.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SETTINGS } from '../config/settings.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      SETTINGS.camera.fov, innerWidth / innerHeight, 0.1, 600,
    );

    // --- post chain: render → bloom → tonemap/sRGB out -------------
    const { bloom } = SETTINGS.renderer;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(innerWidth, innerHeight),
      bloom.strength, bloom.radius, bloom.threshold,
    );
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    // --- adaptive resolution ---------------------------------------
    this.resScale = 1;
    this._fpsSamples = [];

    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.updaters = new Set();
    this._running = false;

    addEventListener('resize', () => this._applySize());
    this._applySize();
  }

  onTick(fn) { this.updaters.add(fn); return () => this.updaters.delete(fn); }

  start() {
    if (this._running) return;
    this._running = true;
    this.clock.start();
    this.renderer.setAnimationLoop(() => this._frame());
  }

  stop() {
    this._running = false;
    this.renderer.setAnimationLoop(null);
  }

  _frame() {
    const dt = Math.min(this.clock.getDelta(), SETTINGS.physics.maxDelta);
    this.elapsed += dt;

    for (const fn of this.updaters) fn(dt, this.elapsed);

    this.composer.render();
    this._adapt(dt);
  }

  /** Drop internal resolution when the frame budget is blown, restore when healthy. */
  _adapt(dt) {
    const { targetFPS, minScale, maxScale } = SETTINGS.renderer.adaptive;
    this._fpsSamples.push(1 / Math.max(dt, 1e-4));
    if (this._fpsSamples.length < 45) return;

    const avg = this._fpsSamples.reduce((a, b) => a + b, 0) / this._fpsSamples.length;
    this._fpsSamples.length = 0;

    let next = this.resScale;
    if (avg < targetFPS - 6) next = Math.max(minScale, this.resScale - 0.1);
    else if (avg > targetFPS + 4) next = Math.min(maxScale, this.resScale + 0.05);

    if (next !== this.resScale) {
      this.resScale = next;
      this._applySize();
    }
  }

  _applySize() {
    const pr = Math.min(devicePixelRatio, SETTINGS.renderer.maxPixelRatio) * this.resScale;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(innerWidth, innerHeight);
    this.composer.setPixelRatio(pr);
    this.composer.setSize(innerWidth, innerHeight);
  }
}
