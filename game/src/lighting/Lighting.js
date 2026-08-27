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

    // --- sun: stellar key light ---------------------------------------
    this.sun = new THREE.DirectionalLight(0xffffff, 2.8);
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

    // --- fill: clean deep space stellar fill, pure black void below -----
    this.hemi = new THREE.HemisphereLight(0x222a36, 0x010204, 0.65);
    scene.add(this.hemi);

    // --- sky dome: pure black deep space vacuum with silver stars -----
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SkyShader.vertex,
      fragmentShader: SkyShader.fragment,
      uniforms: {
        uTop: { value: new THREE.Color(0x000000) },     // pure black
        uHorizon: { value: new THREE.Color(0x020306) }, // faint cold silver depth
        uGround: { value: new THREE.Color(0x000000) },  // pure black
        uSunDir: { value: this.sun.position.clone().normalize() },
        uSunColor: { value: new THREE.Color(0xffffff) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    this.skyDome = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), this.skyMat);
    this.skyDome.frustumCulled = false;
    scene.add(this.skyDome);

    // --- fog: deep space vacuum (pitch black) --------------------------
    scene.fog = new THREE.FogExp2(0x000002, 0.0004);

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
      if (duration === 0) {
        colorObj.copy(c);
      } else {
        gsap.to(colorObj, { r: c.r, g: c.g, b: c.b, duration, ease: 'sine.inOut', overwrite: 'auto' });
      }
    }
    if (duration === 0) {
      this.sun.intensity = sunIntensity;
    } else {
      gsap.to(this.sun, { intensity: sunIntensity, duration, ease: 'sine.inOut', overwrite: 'auto' });
    }
  }

  applyTheme(theme, instant = false) {
    if (!theme) return;
    this.transitionTo(theme, instant ? 0 : 1.6);
  }

  /** Keep the shadow frustum and sky dome centred on the player. */
  follow(target) {
    this.sun.position.set(target.x + 18, target.y + 30, target.z + 12);
    this.sun.target.position.copy(target);
    this.skyDome.position.copy(target);
  }
}
