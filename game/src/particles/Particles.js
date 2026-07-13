/**
 * GPU particles. The CPU only writes attributes when a particle is
 * (re)spawned — position, physics and fading all happen in the vertex
 * shader from (spawnTime, velocity, life). A ring-buffer cursor gives
 * free object pooling.
 */
import * as THREE from 'three';

const BURST_VERT = /* glsl */ `
  attribute vec3 aVelocity;
  attribute float aSpawnTime;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vFade;
  varying vec3 vColor;
  void main() {
    float age = uTime - aSpawnTime;
    float t = clamp(age / max(aLife, 0.001), 0.0, 1.0);
    vFade = (1.0 - t) * step(0.0, age) * step(age, aLife);
    vColor = aColor;

    vec3 pos = position + aVelocity * age + vec3(0.0, -4.5, 0.0) * age * age * 0.5;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (1.0 - t * 0.6) * (140.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;

const BURST_FRAG = /* glsl */ `
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vFade;
    gl_FragColor = vec4(vColor, a * 0.85);
  }
`;

export class BurstParticles {
  constructor(scene, capacity = 600) {
    this.capacity = capacity;
    this.cursor = 0;

    const geo = new THREE.BufferGeometry();
    const zero3 = new Float32Array(capacity * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(zero3.slice(), 3));
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(zero3.slice(), 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(zero3.slice(), 3));
    geo.setAttribute('aSpawnTime', new THREE.BufferAttribute(new Float32Array(capacity).fill(-1e3), 1));
    geo.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(capacity).fill(1), 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(capacity).fill(1), 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: BURST_VERT,
      fragmentShader: BURST_FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  /**
   * Emit `count` particles at `origin`.
   * opts: { color, speed, up, spread, life, size }
   */
  emit(origin, count, opts = {}) {
    const {
      color = new THREE.Color(0xcfd6da),
      speed = 3.5, up = 2.2, spread = 1, life = 0.9, size = 1.4,
    } = opts;

    const geo = this.points.geometry;
    const pos = geo.attributes.position;
    const vel = geo.attributes.aVelocity;
    const col = geo.attributes.aColor;
    const spawn = geo.attributes.aSpawnTime;
    const lifeA = geo.attributes.aLife;
    const sizeA = geo.attributes.aSize;
    const now = this.material.uniforms.uTime.value;

    for (let n = 0; n < count; n++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.capacity;

      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * spread;
      pos.setXYZ(i, origin.x + Math.cos(ang) * r * 0.4, origin.y, origin.z + Math.sin(ang) * r * 0.4);
      vel.setXYZ(
        i,
        Math.cos(ang) * speed * (0.35 + Math.random() * 0.65),
        up * (0.5 + Math.random() * 0.8),
        Math.sin(ang) * speed * (0.35 + Math.random() * 0.65),
      );
      col.setXYZ(i, color.r, color.g, color.b);
      spawn.setX(i, now);
      lifeA.setX(i, life * (0.6 + Math.random() * 0.7));
      sizeA.setX(i, size * (0.6 + Math.random() * 0.8));
    }

    pos.needsUpdate = true;
    vel.needsUpdate = true;
    col.needsUpdate = true;
    spawn.needsUpdate = true;
    lifeA.needsUpdate = true;
    sizeA.needsUpdate = true;
  }

  update(elapsed) { this.material.uniforms.uTime.value = elapsed; }
}

/* ------------------------------------------------------------------ */
/* Ambient motes — weightless dust drifting around the player, fully   */
/* animated in the vertex shader, wrapped in a moving box.             */
/* ------------------------------------------------------------------ */
const MOTES_VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uCenter;
  uniform float uRange;
  varying float vA;
  void main() {
    // slow pseudo-random drift
    vec3 p = position;
    p.x += sin(uTime * 0.11 + aSeed * 17.0) * 2.2;
    p.y += sin(uTime * 0.07 + aSeed * 31.0) * 1.6;
    p.z += cos(uTime * 0.09 + aSeed * 23.0) * 2.2;

    // wrap into a cube around the player so motes are always nearby
    vec3 rel = mod(p - uCenter + uRange * 0.5, uRange) - uRange * 0.5;
    vec3 wp = uCenter + rel;

    float edge = 1.0 - smoothstep(uRange * 0.30, uRange * 0.5, length(rel));
    vA = edge * (0.25 + 0.75 * fract(aSeed * 91.7));

    vec4 mv = modelViewMatrix * vec4(wp, 1.0);
    gl_PointSize = (1.4 + fract(aSeed * 57.3) * 2.4) * (90.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;

const MOTES_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    gl_FragColor = vec4(vec3(0.75, 0.83, 0.9), smoothstep(1.0, 0.1, d) * vA * 0.16);
  }
`;

export class AmbientMotes {
  constructor(scene, count = 260, range = 34) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * range;
      pos[i * 3 + 1] = (Math.random() - 0.5) * range;
      pos[i * 3 + 2] = (Math.random() - 0.5) * range;
      seed[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: MOTES_VERT,
      fragmentShader: MOTES_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uCenter: { value: new THREE.Vector3() },
        uRange: { value: range },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  update(elapsed, center) {
    this.material.uniforms.uTime.value = elapsed;
    this.material.uniforms.uCenter.value.copy(center);
  }
}
