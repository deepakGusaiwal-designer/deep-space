/**
 * Handwritten GLSL for the journey.
 * The black hole is a real (simplified) photon-geodesic raymarch:
 * rays bend around the singularity, the accretion disk is sampled on
 * every plane crossing — which is what produces the Interstellar-style
 * arc of light above and below the horizon, plus the photon ring.
 */

export const blackHoleVertex = /* glsl */ `
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const blackHoleFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uCamLocal;   // camera position relative to the hole
  uniform float uFade;       // global visibility (fades as we cross the horizon)
  uniform float uWarm;       // warm color balance, 0..1
  varying vec3  vLocal;

  #define HORIZON   1.0
  #define DISK_IN   2.35
  #define DISK_OUT  7.4
  #define STEPS     110

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Lensed background — a faint procedural starfield sampled with the
  // *bent* ray direction, so stars smear around the hole.
  vec3 bgStars(vec3 rd) {
    vec3 col = vec3(0.0);
    vec3 q = rd * 140.0;
    vec3 id = floor(q);
    vec3 f = fract(q) - 0.5;
    float h = hash21(id.xy + id.z * 7.31);
    float s = smoothstep(0.32, 0.0, length(f)) * step(0.995, h);
    col += vec3(0.9, 0.92, 1.0) * s * (0.5 + 0.5 * hash21(id.yz));
    return col;
  }

  void main() {
    vec3 ro = uCamLocal;
    vec3 rd = normalize(vLocal - uCamLocal);

    vec3 p = ro;
    vec3 v = rd;
    vec3 hVec = cross(p, v);
    float h2 = dot(hVec, hVec);

    vec3 col = vec3(0.0);
    float alpha = 0.0;
    bool captured = false;
    bool escaped = false;

    for (int i = 0; i < STEPS; i++) {
      float r2 = dot(p, p);
      float r = sqrt(r2);

      if (r > 46.0 && dot(p, v) > 0.0) { escaped = true; break; }

      float dt = clamp(r * 0.16, 0.045, 0.65);

      // photon geodesic approximation: a = -3/2 h^2 r / |r|^5
      vec3 acc = -1.5 * h2 * p / (r2 * r2 * r);
      vec3 vNew = normalize(v + acc * dt);
      vec3 pNew = p + v * dt;

      // accretion disk lives on the y = 0 plane
      if (p.y * pNew.y < 0.0) {
        float f = p.y / (p.y - pNew.y);
        vec3 hit = mix(p, pNew, f);
        float rr = length(hit.xz);
        if (rr > DISK_IN && rr < DISK_OUT) {
          float ang = atan(hit.x, hit.z);
          float kepler = 9.0 / pow(rr, 1.5);          // inner matter orbits faster
          float band = vnoise(vec2(rr * 2.6 - uTime * 0.35, (ang + uTime * kepler * 0.28) * 2.6));
          band = 0.45 + 0.55 * band;

          float outerFall = smoothstep(DISK_OUT, DISK_IN + 0.8, rr);
          float innerFade = smoothstep(DISK_IN, DISK_IN + 0.6, rr);

          // relativistic beaming — the approaching side burns brighter
          vec3 tangent = normalize(vec3(hit.z, 0.0, -hit.x));
          float dop = 1.0 + 0.65 * dot(tangent, -v);
          float e = band * outerFall * innerFade * pow(max(dop, 0.0), 3.0);

          float tHeat = clamp(e * 0.9, 0.0, 1.0);
          vec3 monoDisk = mix(vec3(0.72, 0.74, 0.78), vec3(1.0, 1.0, 1.0), tHeat);
          vec3 warmDisk = mix(vec3(1.0, 0.47, 0.14), vec3(1.0, 0.94, 0.76), tHeat);
          vec3 warm = mix(monoDisk, warmDisk, uWarm);
          col += warm * e * (1.0 - alpha) * 1.55;
          alpha += clamp(e, 0.0, 1.0) * (1.0 - alpha) * 0.85;
          if (alpha > 0.985) break;
        }
      }

      p = pNew;
      v = vNew;

      if (dot(p, p) < HORIZON * HORIZON) { captured = true; break; }
    }

    if (captured) {
      // the shadow: pure black, fully opaque, occludes the scene behind
      alpha = 1.0;
    } else if (escaped || alpha < 0.985) {
      float bend = 1.0 - clamp(dot(rd, v), 0.0, 1.0);
      float lensZone = clamp(bend * 5.0, 0.0, 1.0);
      // lensed stars + a whisper of blue nebula hugging the photon ring
      vec3 lensed = bgStars(v) * lensZone;
      vec3 nebula = mix(vec3(0.42, 0.45, 0.52), vec3(0.34, 0.45, 0.75), uWarm) * pow(bend, 2.2) * 0.4;
      col += (lensed + nebula) * (1.0 - alpha);
      alpha = max(alpha, clamp(lensZone * 0.9 + pow(bend, 2.2) * 0.6, 0.0, 1.0) * (1.0 - alpha) + alpha * 0.0);
      alpha = clamp(alpha + lensZone * 0.85, 0.0, 1.0);
    }

    gl_FragColor = vec4(col * uFade, alpha * uFade);
    if (gl_FragColor.a < 0.003) discard;
  }
`;

export const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSwallow;   // 0..1 — the exit hole reels the universe in
  uniform float uBirth;     // 0..1 — the big bang: stars fly out of the first singularity
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTwinkle;

  // the exit black hole (world ≈ object space; the group barely rotates)
  const vec3 HOLE = vec3(0.0, 0.0, -248.0);
  // where it all began — the entrance singularity
  const vec3 ORIGIN = vec3(0.0, 0.0, -2.0);

  void main() {
    vColor = aColor;
    vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);

    vec3 p = position;

    // creation: staggered per-star expansion out of a single point
    float birth = clamp(uBirth * (1.5 + aPhase) - aPhase, 0.0, 1.0);
    birth = birth * birth * (3.0 - 2.0 * birth);
    p = mix(ORIGIN, p, birth);

    float fall = 0.0;
    if (uSwallow > 0.001) {
      // staggered per-star infall — nearer-phase stars let go first
      fall = clamp(uSwallow * (1.5 + aPhase) - aPhase, 0.0, 1.0);
      fall = fall * fall;
      // spiral: the offset direction rotates around the hole axis on the way in
      vec3 dir = p - HOLE;
      float ang = fall * 2.6;
      float ca = cos(ang);
      float sa = sin(ang);
      dir.xy = mat2(ca, -sa, sa, ca) * dir.xy;
      vec3 target = HOLE + normalize(dir) * (2.0 + aPhase * 5.0);
      p = mix(p, target, fall);
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (240.0 / max(1.0, -mv.z))
      * (1.0 - fall * 0.7)
      * (0.15 + 0.85 * birth);
    gl_Position = projectionMatrix * mv;
  }
`;

export const starFragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uSwallow;
  uniform float uBirth;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  const vec3 HOLE = vec3(0.0, 0.0, -248.0);
  const vec3 ORIGIN = vec3(0.0, 0.0, -2.0);

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.22 + aPhase * 6.28) * 0.9 + uMouse.x * 0.8;
    p.y += cos(uTime * 0.17 + aPhase * 6.28) * 0.7 + uMouse.y * 0.5;
    vAlpha = 0.35 + 0.3 * sin(uTime * 0.5 + aPhase * 12.0);

    float birth = clamp(uBirth * (1.5 + aPhase) - aPhase, 0.0, 1.0);
    birth = birth * birth * (3.0 - 2.0 * birth);
    p = mix(ORIGIN, p, birth);

    float fall = 0.0;
    if (uSwallow > 0.001) {
      fall = clamp(uSwallow * (1.5 + aPhase) - aPhase, 0.0, 1.0);
      fall = fall * fall;
      vec3 dir = p - HOLE;
      float ang = fall * 3.2;
      float ca = cos(ang);
      float sa = sin(ang);
      dir.xy = mat2(ca, -sa, sa, ca) * dir.xy;
      p = mix(p, HOLE + normalize(dir) * (1.5 + aPhase * 4.0), fall);
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (160.0 / max(1.0, -mv.z))
      * (1.0 - fall * 0.8)
      * (0.15 + 0.85 * birth);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dustFragment = /* glsl */ `
  precision highp float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.16;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.95, 0.88, 0.75, a);
  }
`;

export const sunVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vObj;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObj = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * The Sun — boiling photosphere. 3D fbm granulation crawls across the
 * surface; limb darkening (dimmer toward the edge) is what makes a star
 * read as a glowing ball of plasma instead of a flat yellow sphere.
 */
export const sunFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vObj;

  float hash31(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash31(i);
    float b = hash31(i + vec3(1.0, 0.0, 0.0));
    float c = hash31(i + vec3(0.0, 1.0, 0.0));
    float d = hash31(i + vec3(1.0, 1.0, 0.0));
    float e = hash31(i + vec3(0.0, 0.0, 1.0));
    float g = hash31(i + vec3(1.0, 0.0, 1.0));
    float h = hash31(i + vec3(0.0, 1.0, 1.0));
    float k = hash31(i + vec3(1.0, 1.0, 1.0));
    float x1 = mix(a, b, f.x);
    float x2 = mix(c, d, f.x);
    float x3 = mix(e, g, f.x);
    float x4 = mix(h, k, f.x);
    return mix(mix(x1, x2, f.y), mix(x3, x4, f.y), f.z);
  }

  float fbm3(vec3 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += vnoise3(p) * amp;
      p *= 2.1;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // two scales of convection cells, drifting at different speeds
    float n = fbm3(vObj * 4.0 + vec3(0.0, 0.0, uTime * 0.05));
    n += fbm3(vObj * 12.0 - vec3(uTime * 0.03)) * 0.4;

    vec3 hot  = vec3(1.0, 0.97, 0.86);
    vec3 mid  = vec3(1.0, 0.68, 0.26);
    vec3 deep = vec3(0.82, 0.32, 0.05);
    vec3 col = mix(deep, mid, smoothstep(0.28, 0.72, n));
    col = mix(col, hot, smoothstep(0.68, 1.05, n));

    // limb darkening: photosphere dims toward the edge
    float facing = clamp(abs(vNormal.z), 0.0, 1.0);
    col *= 0.5 + 0.5 * smoothstep(0.0, 0.8, facing);

    gl_FragColor = vec4(col * 1.35, 1.0);
  }
`;

/**
 * The wormhole — a billboarded quad running a swirling energy vortex.
 * Concentric rings rush inward toward a dark throat, a bright photon mouth
 * rings the eye, and the whole thing breathes (uPulse). One draw call.
 */
export const wormholeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const wormholeFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uFade;    // global visibility
  uniform float uPulse;   // gentle breathing, 0..1
  uniform float uAccent;  // red-accent mix at the rim, 0..1
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) { v += vnoise(p) * a; p *= 2.05; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv) * 2.0;
    float ang = atan(uv.y, uv.x);

    // spiral coordinate: matter flows inward while rotating
    float spin = ang * 3.0 + uTime * 0.55 - 1.4 / max(r, 0.06);
    float swirl = fbm(vec2(spin * 0.4, r * 3.5 - uTime * 0.5));

    // concentric rings rushing toward the throat
    float rings = 0.5 + 0.5 * sin(r * 26.0 - uTime * 3.0 + swirl * 4.0);

    float throat = smoothstep(0.0, 0.34, r);       // dark eye in the middle
    float outer = 1.0 - smoothstep(0.7, 1.15, r);   // fade to transparent

    float energy = pow(rings, 2.2) * (0.35 + swirl * 0.9) * throat * outer;
    energy *= 0.7 + 0.6 * uPulse;

    vec3 core = vec3(0.85, 0.90, 1.0);
    vec3 blue = vec3(0.34, 0.45, 0.78);
    vec3 red  = vec3(1.0, 0.23, 0.23);
    vec3 col = mix(core, blue, smoothstep(0.2, 0.7, r));
    col = mix(col, red, smoothstep(0.55, 1.0, r) * uAccent);

    // bright photon mouth ringing the throat
    float mouth = smoothstep(0.42, 0.30, r) * smoothstep(0.20, 0.34, r);
    col += vec3(0.9, 0.94, 1.0) * mouth * 1.4;
    energy += mouth * 0.8 * outer;

    float alpha = clamp(energy, 0.0, 1.0) * uFade;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col * energy * 1.6, alpha);
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

/** Thin fresnel rim — the atmosphere hugging a planet's limb. */
export const atmosphereFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.8);
    gl_FragColor = vec4(uColor, rim * 0.6);
  }
`;
