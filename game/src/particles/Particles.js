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
    gl_FragColor = vec4(vec3(0.92, 0.8, 0.6), smoothstep(1.0, 0.1, d) * vA * 0.12);
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

/* ------------------------------------------------------------------ */
/* Thruster Plasma Particles — Long realistic supersonic exhaust trail */
/* ------------------------------------------------------------------ */
const THRUST_VERT = /* glsl */ `
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
    vFade = pow(1.0 - t, 1.3) * step(0.0, age) * step(age, aLife);
    
    // Core starts bright hot white, transitioning to vivid plasma color then soft tail
    vColor = mix(vec3(1.0, 1.0, 0.95), aColor, clamp(t * 2.5, 0.0, 1.0));

    // Particle slows down and expands along the supersonic trail
    vec3 pos = position + aVelocity * age * (1.0 - t * 0.35);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (0.85 + t * 3.0) * (140.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;

const THRUST_FRAG = /* glsl */ `
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = pow(smoothstep(1.0, 0.0, d), 1.5) * vFade;
    gl_FragColor = vec4(vColor, a * 0.95);
  }
`;

export class ThrusterParticles {
  constructor(scene, capacity = 1600) {
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
      vertexShader: THRUST_VERT,
      fragmentShader: THRUST_FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  emit(pos, velocity, color, count = 3, size = 2.0, life = 0.8) {
    const geo = this.points.geometry;
    const pAttr = geo.attributes.position;
    const vAttr = geo.attributes.aVelocity;
    const cAttr = geo.attributes.aColor;
    const sAttr = geo.attributes.aSpawnTime;
    const lAttr = geo.attributes.aLife;
    const zAttr = geo.attributes.aSize;
    const now = this.material.uniforms.uTime.value;

    for (let n = 0; n < count; n++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.capacity;

      const spread = 0.06;
      const rx = (Math.random() - 0.5) * spread;
      const ry = (Math.random() - 0.5) * spread;
      const rz = (Math.random() - 0.5) * spread;

      pAttr.setXYZ(i, pos.x + rx, pos.y + ry, pos.z + rz);
      vAttr.setXYZ(
        i,
        velocity.x + (Math.random() - 0.5) * 1.2,
        velocity.y + (Math.random() - 0.5) * 1.2,
        velocity.z + (Math.random() - 0.5) * 1.2,
      );
      cAttr.setXYZ(i, color.r, color.g, color.b);
      sAttr.setX(i, now);
      lAttr.setX(i, life * (0.85 + Math.random() * 0.3));
      zAttr.setX(i, size * (0.85 + Math.random() * 0.3));
    }

    pAttr.needsUpdate = true;
    vAttr.needsUpdate = true;
    cAttr.needsUpdate = true;
    sAttr.needsUpdate = true;
    lAttr.needsUpdate = true;
    zAttr.needsUpdate = true;
  }

  update(elapsed) { this.material.uniforms.uTime.value = elapsed; }
}

/* ------------------------------------------------------------------ */
/* Hyperspace Speed of Light Slipstream — Subtle & Centered on player  */
/* ------------------------------------------------------------------ */
const WARP_VERT = /* glsl */ `
  attribute vec3 aLocalOffset;
  attribute float aLength;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uWarp;
  uniform vec3 uCenter;
  uniform vec3 uVelocity;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float velMag = length(uVelocity);
    vec3 travelDir = velMag > 0.1 ? normalize(uVelocity) : vec3(0.0, 0.0, -1.0);
    
    // Construct local coordinate frame oriented with travel direction
    vec3 up = abs(travelDir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 right = normalize(cross(travelDir, up));
    vec3 localUp = cross(right, travelDir);

    // Subtle slipstream lines orbiting the astronaut symmetrically
    vec3 radialPos = right * aLocalOffset.x + localUp * aLocalOffset.y;
    
    // Animate along travel axis
    float travelZ = fract(aLocalOffset.z - uTime * (0.6 + aSpeed * uWarp * 2.5));
    vec3 alongZ = travelDir * (travelZ - 0.5) * 32.0;

    // Stretch line segments subtly with warp
    float stretch = 0.5 + uWarp * (aLength * 4.5 + velMag * 0.2);
    vec3 worldPos = uCenter + radialPos + alongZ + travelDir * (position.z * stretch);

    vec4 mv = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Soft glowing opacity centered around astronaut with hyper-photon trails
    vAlpha = smoothstep(18.0, 1.2, length(radialPos)) * (uWarp * 0.85);
    vColor = mix(vec3(0.0, 0.9, 1.0), vec3(1.0, 1.0, 1.0), position.z * 0.5 + 0.5);
  }
`;

const WARP_FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

export class HyperspaceStreaks {
  constructor(scene, count = 160) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 2 * 3); // 2 vertices per line
    const localOffsets = new Float32Array(count * 2 * 3);
    const lengths = new Float32Array(count * 2);
    const speeds = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      // Hollow cylindrical slipstream directly surrounding the astronaut
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 5.5;
      const lx = Math.cos(angle) * radius;
      const ly = Math.sin(angle) * radius;
      const lz = Math.random();

      const len = 0.6 + Math.random() * 1.4;
      const spd = 0.8 + Math.random() * 1.2;

      const idx = i * 2;
      // Head
      positions[idx * 3] = 0;
      positions[idx * 3 + 1] = 0;
      positions[idx * 3 + 2] = 0.5;
      localOffsets[idx * 3] = lx;
      localOffsets[idx * 3 + 1] = ly;
      localOffsets[idx * 3 + 2] = lz;
      lengths[idx] = len;
      speeds[idx] = spd;

      // Tail
      positions[(idx + 1) * 3] = 0;
      positions[(idx + 1) * 3 + 1] = 0;
      positions[(idx + 1) * 3 + 2] = -0.5;
      localOffsets[(idx + 1) * 3] = lx;
      localOffsets[(idx + 1) * 3 + 1] = ly;
      localOffsets[(idx + 1) * 3 + 2] = lz;
      lengths[idx + 1] = len;
      speeds[idx + 1] = spd;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aLocalOffset', new THREE.BufferAttribute(localOffsets, 3));
    geo.setAttribute('aLength', new THREE.BufferAttribute(lengths, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: WARP_VERT,
      fragmentShader: WARP_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uWarp: { value: 0 },
        uCenter: { value: new THREE.Vector3() },
        uVelocity: { value: new THREE.Vector3() },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.lines = new THREE.LineSegments(geo, this.material);
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    scene.add(this.lines);
  }

  update(elapsed, center, velocity, warpIntensity) {
    const isWarping = warpIntensity > 0.02;
    this.lines.visible = isWarping;
    if (!isWarping) return;

    this.material.uniforms.uTime.value = elapsed;
    this.material.uniforms.uCenter.value.copy(center);
    this.material.uniforms.uVelocity.value.copy(velocity);
    this.material.uniforms.uWarp.value = warpIntensity;
  }
}
