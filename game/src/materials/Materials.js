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

  /** Space Platform Hull — aerospace titanium alloy with panel grid seams and micro-scratches. */
  concrete() {
    return this._get('concrete', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x282e36, roughness: 0.38, metalness: 0.78, envMapIntensity: 1.25,
        clearcoat: 0.3, clearcoatRoughness: 0.35,
      });
      return extendSurface(m, 'mon-concrete', /* glsl */ `
        // Sci-fi modular hull plating grid (2m panels)
        vec2 grid = abs(fract(wp.xz * 0.5) - 0.5);
        float seam = smoothstep(0.04, 0.01, min(grid.x, grid.y));
        
        // Hexagonal sub-tile pattern
        float hex = mNoise(wp * 4.5);
        float speckle = mNoise(wp * 22.0);
        float scratches = smoothstep(0.88, 0.99, mNoise(wp * vec3(1.2, 45.0, 1.2)));

        diffuseColor.rgb *= 0.88 + hex * 0.12 + speckle * 0.06 - seam * 0.45 + scratches * 0.25;
      `, /* glsl */ `
        vec2 grid = abs(fract(wp.xz * 0.5) - 0.5);
        float seam = smoothstep(0.04, 0.01, min(grid.x, grid.y));
        roughnessFactor = clamp(roughnessFactor + seam * 0.4 - mFbm(wp * 1.5) * 0.1, 0.1, 0.9);
      `);
    });
  }

  /** Marble — dark polished carbon composite deck. */
  marble() {
    return this._get('marble', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x1c2128, roughness: 0.25, metalness: 0.85, envMapIntensity: 1.4,
        clearcoat: 0.6, clearcoatRoughness: 0.15,
      });
      return extendSurface(m, 'mon-marble', /* glsl */ `
        vec2 grid = abs(fract(wp.xz * 0.33) - 0.5);
        float seam = smoothstep(0.03, 0.01, min(grid.x, grid.y));
        float carbon = mNoise(wp * vec3(28.0, 2.0, 28.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.35, 0.45, 0.55), carbon * 0.15);
        diffuseColor.rgb *= 1.0 - seam * 0.5;
      `, /* glsl */ `
        roughnessFactor = clamp(roughnessFactor + mNoise(wp * 12.0) * 0.1, 0.1, 0.8);
      `);
    });
  }

  /** Heavy aerospace dark metal with brushed grain and blue sheen. */
  metal() {
    return this._get('metal', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x3a424e, roughness: 0.32, metalness: 0.95, envMapIntensity: 1.35,
      });
      return extendSurface(m, 'mon-metal', /* glsl */ `
        float brush = mNoise(wp * vec3(0.4, 30.0, 30.0));
        float scratches = smoothstep(0.85, 0.98, mNoise(wp * vec3(1.0, 60.0, 60.0)));
        diffuseColor.rgb *= 0.85 + brush * 0.18 + scratches * 0.22;
      `, /* glsl */ `
        float streak = mNoise(wp * vec3(0.4, 30.0, 30.0));
        roughnessFactor = clamp(roughnessFactor + (streak - 0.5) * 0.2, 0.05, 0.9);
      `);
    });
  }

  /** Black chrome — the player sphere: dark mirror with warm reflections. */
  chrome() {
    return this._get('chrome', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x1b1d21, roughness: 0.1, metalness: 1.0, envMapIntensity: 1.5,
        clearcoat: 1.0, clearcoatRoughness: 0.05,
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
        color: 0x22262a, roughness: 0.5, metalness: 0.0, envMapIntensity: 1.2,
        transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false,
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
        color: 0x1a1c1f, roughness: 0.88, metalness: 0.1, envMapIntensity: 0.35,
      });
      return extendSurface(m, 'mon-basalt', /* glsl */ `
        float pits = smoothstep(0.7, 0.98, mNoise(wp * 5.0));
        diffuseColor.rgb *= 0.82 + mFbm(wp * 0.6) * 0.34 + mNoise(wp * 30.0) * 0.07 - pits * 0.18;
      `, /* glsl */ `
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 30.0) - 0.5) * 0.16, 0.0, 1.0);
      `);
    });
  }

  /** Warm gold light strips — recessed platform lighting, tower bands. */
  gold() {
    return this._get('gold', () => new THREE.MeshStandardMaterial({
      color: 0x140b03,
      emissive: new THREE.Color(0xffb763),
      emissiveIntensity: 2.6,
      roughness: 0.4,
      metalness: 0.2,
    }));
  }

  /** Red hazard beams — bloom catches these hard. */
  laserBeam() {
    return this._get('laser', () => new THREE.MeshStandardMaterial({
      color: 0x1a0302,
      emissive: new THREE.Color(0xff2618),
      emissiveIntensity: 3.4,
      roughness: 0.5,
      metalness: 0,
    }));
  }

  /** Space-station facades — a procedural grid of warm lit windows. */
  windows() {
    return this._get('windows', () => {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0x14171c, roughness: 0.55, metalness: 0.4,
        emissive: new THREE.Color(0xffc36b), emissiveIntensity: 1.7,
        envMapIntensity: 0.6,
      });
      m.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vMonPos;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', `#include <common>\nvarying vec3 vMonPos;\n${NOISE_GLSL}`)
          .replace('#include <emissivemap_fragment>', /* glsl */ `#include <emissivemap_fragment>
          {
            vec3 wp = vMonPos;
            vec2 grid = vec2(wp.x + wp.z, wp.y) * vec2(1.45, 1.2);
            vec2 id = floor(grid);
            vec2 f = fract(grid);
            float win = step(0.3, f.x) * step(f.x, 0.72) * step(0.25, f.y) * step(f.y, 0.68);
            float lit = step(0.45, mHash(vec3(id, 7.0)));      // some homes are dark
            float warmth = 0.45 + mHash(vec3(id, 13.0)) * 0.8; // per-window brightness
            totalEmissiveRadiance *= win * lit * warmth;
          }`);
      };
      m.customProgramCacheKey = () => 'mon-windows';
      return m;
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
