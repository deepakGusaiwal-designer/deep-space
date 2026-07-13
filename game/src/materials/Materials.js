/**
 * Procedural material library.
 *
 * Strategy: architectural surfaces (concrete, marble, metal, chrome,
 * frosted glass) are MeshPhysicalMaterials whose shaders are extended
 * with triplanar fbm noise via onBeforeCompile — we get Three's
 * shadow mapping, ACES pipeline and PMREM reflections for free while
 * ALL surface detail is generated in GLSL. No textures exist anywhere.
 *
 * Emissive elements (gates, portals, pads, beacons) use fully custom
 * ShaderMaterials from shaders/emissive.js.
 */
import * as THREE from 'three';
import { NOISE_GLSL } from '../shaders/chunks.js';
import {
  GateShader, PortalShader, PadShader, BeaconShader, ContactShadowShader,
  BlackHoleDiskShader, HaloShader,
} from '../shaders/emissive.js';

/**
 * Inject world-position-based procedural color/roughness into a
 * built-in material's shader program.
 *
 * @param {THREE.Material} mat
 * @param {string} key        unique program cache key
 * @param {string} colorGLSL  runs after color_fragment; may edit `diffuseColor.rgb` using `wp` (world pos)
 * @param {string} roughGLSL  runs after roughnessmap_fragment; may edit `roughnessFactor`
 */
function extendSurface(mat, key, colorGLSL, roughGLSL = '') {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vMonPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vMonPos;\n${NOISE_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n{ vec3 wp = vMonPos; ${colorGLSL} }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n{ vec3 wp = vMonPos; ${roughGLSL} }`);
  };
  mat.customProgramCacheKey = () => key;
  return mat;
}

export class Materials {
  constructor() {
    this.cache = new Map();
    this.animated = []; // shader materials that need uTime updates
  }

  /** Concrete — matte, mottled, finely speckled. */
  concrete() {
    return this._get('concrete', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x9ba1a6, roughness: 0.94, metalness: 0.0, envMapIntensity: 0.35,
      });
      return extendSurface(m, 'mon-concrete', /* glsl */ `
        float patches = mFbm(wp * 0.33);
        float speckle = mNoise(wp * 14.0);
        float pores = smoothstep(0.72, 0.95, mNoise(wp * 7.0));
        diffuseColor.rgb *= 0.88 + patches * 0.22 + speckle * 0.06 - pores * 0.10;
      `, /* glsl */ `
        roughnessFactor = clamp(roughnessFactor - mFbm(wp * 0.5) * 0.12, 0.0, 1.0);
      `);
    });
  }

  /** Marble — pale stone with ridged veining. */
  marble() {
    return this._get('marble', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xe9e7e2, roughness: 0.24, metalness: 0.0, envMapIntensity: 0.7,
        clearcoat: 0.35, clearcoatRoughness: 0.3,
      });
      return extendSurface(m, 'mon-marble', /* glsl */ `
        float vein = mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6);
        float veins = smoothstep(0.16, 0.02, vein);
        float tone = mFbm(wp * 0.8) * 0.06;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.45, 0.5), veins * 0.55);
        diffuseColor.rgb += tone;
      `, /* glsl */ `
        float vv = smoothstep(0.16, 0.02, mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6));
        roughnessFactor = clamp(roughnessFactor + vv * 0.25, 0.0, 1.0);
      `);
    });
  }

  /** Brushed metal — anisotropic-looking streaks along X. */
  metal() {
    return this._get('metal', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xb9bfc4, roughness: 0.38, metalness: 1.0, envMapIntensity: 1.0,
      });
      return extendSurface(m, 'mon-metal', /* glsl */ `
        float brush = mNoise(wp * vec3(0.35, 22.0, 22.0));
        diffuseColor.rgb *= 0.92 + brush * 0.12;
      `, /* glsl */ `
        float streak = mNoise(wp * vec3(0.35, 22.0, 22.0));
        roughnessFactor = clamp(roughnessFactor + (streak - 0.5) * 0.22, 0.05, 1.0);
      `);
    });
  }

  /** Chrome — near-mirror finish for the player sphere and trims. */
  chrome() {
    return this._get('chrome', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.06, metalness: 1.0, envMapIntensity: 1.35,
        clearcoat: 1.0, clearcoatRoughness: 0.04,
      });
      return extendSurface(m, 'mon-chrome', /* glsl */ `
        diffuseColor.rgb *= 0.985 + mNoise(wp * 40.0) * 0.03;
      `);
    });
  }

  /** Frosted glass — translucent architectural panels. */
  glass() {
    return this._get('glass', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xd6e8ee, roughness: 0.55, metalness: 0.0, envMapIntensity: 1.1,
        transparent: true, opacity: 0.34, side: THREE.DoubleSide, depthWrite: false,
      });
      return extendSurface(m, 'mon-glass', /* glsl */ `
        diffuseColor.rgb += (mFbm(wp * 2.0) - 0.5) * 0.05;
      `, /* glsl */ `
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 6.0) - 0.5) * 0.2, 0.2, 1.0);
      `);
    });
  }

  /** Dark basalt-like base material for underpinnings / decor. */
  basalt() {
    return this._get('basalt', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x2a2e33, roughness: 0.85, metalness: 0.1, envMapIntensity: 0.4,
      });
      return extendSurface(m, 'mon-basalt', /* glsl */ `
        diffuseColor.rgb *= 0.85 + mFbm(wp * 0.6) * 0.3;
      `);
    });
  }

  /* ------------------- emissive shader materials ------------------- */

  gate(color = 0x9be8ff) {
    const m = new THREE.ShaderMaterial({
      vertexShader: GateShader.vertex,
      fragmentShader: GateShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        uOpen: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.animated.push(m);
    return m;
  }

  portal(color = 0x9be8ff) {
    const m = new THREE.ShaderMaterial({
      vertexShader: PortalShader.vertex,
      fragmentShader: PortalShader.fragment,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.animated.push(m);
    return m;
  }

  pad(color = 0x9be8ff) {
    const m = new THREE.ShaderMaterial({
      vertexShader: PadShader.vertex,
      fragmentShader: PadShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.animated.push(m);
    return m;
  }

  beacon(color = 0xffd9a0) {
    const m = new THREE.ShaderMaterial({
      vertexShader: BeaconShader.vertex,
      fragmentShader: BeaconShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        uLit: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.animated.push(m);
    return m;
  }

  blackholeDisk(color = 0xffb46b) {
    const m = new THREE.ShaderMaterial({
      vertexShader: BlackHoleDiskShader.vertex,
      fragmentShader: BlackHoleDiskShader.fragment,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.animated.push(m);
    return m;
  }

  halo(color = 0x9fc8ff) {
    return new THREE.ShaderMaterial({
      vertexShader: HaloShader.vertex,
      fragmentShader: HaloShader.fragment,
      uniforms: { uColor: { value: new THREE.Color(color) } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
  }

  contactShadow() {
    return new THREE.ShaderMaterial({
      vertexShader: ContactShadowShader.vertex,
      fragmentShader: ContactShadowShader.fragment,
      uniforms: { uStrength: { value: 0.55 } },
      transparent: true, depthWrite: false,
    });
  }

  /** Advance uTime on every animated shader material. */
  update(elapsed) {
    for (const m of this.animated) m.uniforms.uTime.value = elapsed;
  }

  dispose() {
    for (const m of this.cache.values()) m.dispose();
    for (const m of this.animated) m.dispose();
    this.cache.clear();
    this.animated.length = 0;
  }

  _get(key, make) {
    if (!this.cache.has(key)) this.cache.set(key, make());
    return this.cache.get(key);
  }
}
