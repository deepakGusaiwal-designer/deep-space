/**
 * Lighting rig: a shadow-casting sun that tracks the player, soft sky
 * fill, exponential height fog, a shader sky dome — and a procedural
 * PMREM environment generated from that same sky (no HDRI files).
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { SETTINGS } from '../config/settings.js';
import { SkyShader } from '../shaders/emissive.js';

export class Lighting {
  constructor(engine) {
    this.engine = engine;
    const scene = engine.scene;

    // --- sun ---------------------------------------------------------
    this.sun = new THREE.DirectionalLight(0xfff2e0, 3.2);
    this.sun.position.set(18, 30, 12);
    this.sun.castShadow = true;
    const size = SETTINGS.renderer.shadowMapSize;
    this.sun.shadow.mapSize.set(size, size);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 120;
    const s = 34;
    this.sun.shadow.camera.left = -s;
    this.sun.shadow.camera.right = s;
    this.sun.shadow.camera.top = s;
    this.sun.shadow.camera.bottom = -s;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.03;
    scene.add(this.sun, this.sun.target);

    // --- fill: cool starlight from above, void below -------------------
    this.hemi = new THREE.HemisphereLight(0x8fa3c8, 0x0d1018, 0.6);
    scene.add(this.hemi);

    // --- sky dome ----------------------------------------------------
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SkyShader.vertex,
      fragmentShader: SkyShader.fragment,
      uniforms: {
        uTop: { value: new THREE.Color(0x4fc3ff) },     // nebula tint A
        uHorizon: { value: new THREE.Color(0x1a3a66) }, // nebula tint B
        uGround: { value: new THREE.Color(0x02030a) },  // void below
        uSunDir: { value: this.sun.position.clone().normalize() },
        uSunColor: { value: new THREE.Color(0xdfefff) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    this.skyDome = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), this.skyMat);
    this.skyDome.frustumCulled = false;
    scene.add(this.skyDome);

    // --- fog: thin near-black haze for depth cueing in the void --------
    scene.fog = new THREE.FogExp2(0x04060c, 0.0075);

    this._buildEnvironment();
  }

  /**
   * Render the sky shader into a cubemap and PMREM it — a fully
   * procedural environment map that gives chrome/metal something
   * real to reflect.
   */
  _buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.engine.renderer);
    const envScene = new THREE.Scene();
    const envSky = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), this.skyMat);
    envScene.add(envSky);

    const env = pmrem.fromScene(envScene, 0.04);
    this.engine.scene.environment = env.texture;
    pmrem.dispose();
    envSky.geometry.dispose();
  }

  /** GSAP-tween the palette between levels for a scene-change feel. */
  transitionTo({ top, horizon, fog, sunColor, sunIntensity = 3.2 }, duration = 1.6) {
    const u = this.skyMat.uniforms;
    const targets = [
      [u.uTop.value, top],
      [u.uHorizon.value, horizon],
      [this.engine.scene.fog.color, fog],
    ];
    if (sunColor) targets.push([u.uSunColor.value, sunColor]);
    for (const [colorObj, hex] of targets) {
      const c = new THREE.Color(hex);
      gsap.to(colorObj, { r: c.r, g: c.g, b: c.b, duration, ease: 'sine.inOut', overwrite: 'auto' });
    }
    gsap.to(this.sun, { intensity: sunIntensity, duration, ease: 'sine.inOut', overwrite: 'auto' });
  }

  /** Keep the shadow frustum and sky dome centred on the player. */
  follow(target) {
    this.sun.position.set(target.x + 18, target.y + 30, target.z + 12);
    this.sun.target.position.copy(target);
    this.skyDome.position.copy(target);
  }
}
