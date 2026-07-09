/**
 * Handwritten GLSL for the opening sequence.
 *
 * Everything here is billboarded quads or GPU points — no geometry heavier
 * than a plane, so the whole cinematic runs on a handful of draw calls.
 */

/* ── shared noise ────────────────────────────────────────────────────── */

const NOISE = /* glsl */ `
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

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += vnoise(p) * amp;
      p *= 2.03;
      amp *= 0.5;
    }
    return v;
  }
`;

/** A plain pass-through for full-quad billboards. */
export const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ── Scene 01 · the singularity ──────────────────────────────────────── */

/**
 * A point of light with no size of its own: a hard core, a breathing halo,
 * and anamorphic spikes that sharpen as it destabilises.
 */
export const singularityFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPulse;   // 0..1 how violently it trembles
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    float r = length(uv);

    float core = exp(-r * r * 150.0);
    float halo = exp(-r * r * 9.0);
    // the cross-flare only appears as it loses stability
    float sx = pow(max(0.0, 1.0 - abs(uv.y) * 26.0), 3.0) * exp(-abs(uv.x) * 2.6);
    float sy = pow(max(0.0, 1.0 - abs(uv.x) * 26.0), 3.0) * exp(-abs(uv.y) * 2.6);
    float spikes = (sx + sy) * uPulse;

    float breathe = 1.0 + 0.22 * sin(uTime * 5.4) * uPulse;
    float e = (core * 1.7 + halo * (0.16 + 0.3 * uPulse) + spikes * 0.55) * breathe;

    vec3 col = mix(vec3(1.0, 0.84, 0.68), vec3(1.0), clamp(core * 1.4, 0.0, 1.0));
    float a = clamp(e, 0.0, 1.0) * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * e, a);
  }
`;

/* ── Scene 02 · the big bang ─────────────────────────────────────────── */

/**
 * GPU particle field. Every mote's whole trajectory is a closed-form
 * function of time, so nothing is simulated on the CPU and nothing is
 * uploaded per frame — one uniform moves a hundred thousand points.
 *
 * Expansion decelerates: r(t) = v·(1 − e^(−kt)) / k. Motes still moving
 * fast burn white-hot and are drawn larger, which reads as motion blur
 * without a velocity pass.
 */
export const particleVertex = /* glsl */ `
  uniform float uT;           // seconds since the bang; negative = not yet
  uniform float uPixelRatio;
  uniform float uFade;        // global dim as the era ends

  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aPhase;

  varying float vHeat;
  varying float vAlpha;

  const float K = 0.55;       // drag

  void main() {
    float t = max(uT, 0.0);
    float r = aSpeed * (1.0 - exp(-K * t)) / K;
    vec3 p = aDir * r;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float speed = aSpeed * exp(-K * t);
    vHeat = clamp(speed / 11.0, 0.0, 1.0);

    // a hard edge at t=0 would pop; give the shell 120ms to ignite
    float born = smoothstep(0.0, 0.12, uT);
    float twinkle = 0.7 + 0.3 * sin(uT * 2.4 + aPhase * 6.2831);
    // a hundred thousand additive sprites saturate the frame instantly, so
    // each one contributes very little on its own
    vAlpha = born * uFade * twinkle * 0.5;

    // faster motes are drawn bigger and softer — cheap motion smear.
    // The camera sits only a few units out, so the distance term has to be
    // small: at 300.0 a single mote covered a third of the screen.
    // uniform sizes read as noise; scatter them so the debris has grain
    float grain = 0.55 + aPhase * 1.0;
    gl_PointSize = (0.55 + 2.1 * vHeat) * grain * uPixelRatio * (52.0 / max(1.0, -mv.z));
    gl_PointSize = min(gl_PointSize, 26.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const particleFragment = /* glsl */ `
  precision highp float;

  varying float vHeat;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float fall = smoothstep(0.5, 0.0, d);
    // cooling: white-hot, through amber, down to a deep ember red
    vec3 ember = vec3(0.80, 0.12, 0.18);
    vec3 amber = vec3(1.0, 0.62, 0.24);
    vec3 hot   = vec3(1.0, 0.97, 0.92);
    vec3 col = mix(ember, amber, smoothstep(0.0, 0.45, vHeat));
    col = mix(col, hot, smoothstep(0.45, 1.0, vHeat));

    float a = fall * vAlpha * (0.35 + 0.65 * vHeat);
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, a);
  }
`;

/** An expanding shell of compressed light. */
export const shockwaveFragment = /* glsl */ `
  precision highp float;

  uniform float uRadius;
  uniform float uWidth;
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    float r = length(uv);
    float d = (r - uRadius) / uWidth;
    float band = exp(-d * d);
    // the leading edge is hotter than the trailing wake
    vec3 col = mix(vec3(1.0, 0.55, 0.30), vec3(1.0, 0.95, 0.88), smoothstep(0.0, 1.0, band));
    float a = band * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * band, a);
  }
`;

/* ── Scene 03 · nebulae ──────────────────────────────────────────────── */

/**
 * Volumetric-looking cloud on a single quad: layered fbm, softened to
 * nothing at the edges so the plane's silhouette never shows.
 */
export const nebulaFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlpha;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uSeed;
  varying vec2 vUv;

  ${NOISE}

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);
    // circular falloff — the quad must never reveal its corners
    float mask = smoothstep(0.5, 0.06, r);
    if (mask <= 0.001) discard;

    vec2 q = uv * 3.0 + uSeed;
    float n = fbm(q + vec2(uTime * 0.014, uTime * -0.009));
    float m = fbm(q * 2.1 - vec2(uTime * 0.02, 0.0));
    float dens = pow(clamp(n * 0.75 + m * 0.35, 0.0, 1.0), 2.1);

    vec3 col = mix(uColorA, uColorB, clamp(m * 1.3, 0.0, 1.0));
    float a = dens * mask * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * dens, a);
  }
`;

/* ── Scene 03 · newborn stars ────────────────────────────────────────── */

export const sparkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;   // 0..1 how much of the field has condensed
  uniform float uStretch;  // 0..1 hyperspace elongation

  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    // staggered ignition so the sky fills in rather than switching on
    float born = clamp(uReveal * (1.6 + aPhase) - aPhase, 0.0, 1.0);
    born = born * born * (3.0 - 2.0 * born);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.65 + 0.35 * sin(uTime * (0.7 + aPhase * 1.9) + aPhase * 38.0);
    vAlpha = born * tw;

    // during the dive, near stars swell into streaks
    float sz = aSize * (1.0 + uStretch * 5.0);
    gl_PointSize = sz * uPixelRatio * (260.0 / max(1.0, -mv.z)) * (0.2 + 0.8 * born);
    gl_Position = projectionMatrix * mv;
  }
`;

export const sparkFragment = /* glsl */ `
  precision highp float;
  uniform float uStretch;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    // squeeze the sprite horizontally as we accelerate — a radial smear
    c.x *= 1.0 + uStretch * 3.2;
    float a = smoothstep(0.5, 0.04, length(c)) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/* ── Scene 05 · the wormhole throat ──────────────────────────────────── */

/**
 * Seen from inside a cylinder. Light runs along the walls toward the mouth;
 * the far end glows. uv.y is length down the tunnel, uv.x is the angle.
 */
export const tunnelFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlpha;
  uniform vec3  uAccent;
  varying vec2 vUv;

  ${NOISE}

  void main() {
    float along = vUv.y;
    float ang = vUv.x;

    // streaks rushing past, several speeds layered
    float s = fbm(vec2(ang * 26.0, along * 3.0 - uTime * 1.9));
    s += fbm(vec2(ang * 54.0, along * 5.0 - uTime * 3.1)) * 0.5;
    float streak = pow(clamp((s - 0.55) * 2.2, 0.0, 1.0), 2.0);

    // the throat brightens toward the mouth we are flying into
    float depth = smoothstep(0.0, 0.85, along);
    vec3 cool = vec3(0.62, 0.74, 1.0);
    vec3 col = mix(cool, vec3(1.0), depth * 0.8);
    col = mix(col, uAccent, streak * 0.25 * (1.0 - depth));

    float a = (streak * 0.85 + depth * 0.32) * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * (streak + depth * 0.7), a);
  }
`;

/** The white-out. A quad pinned across the frame. */
export const flashFragment = /* glsl */ `
  precision highp float;
  uniform float uFlash;
  varying vec2 vUv;

  void main() {
    if (uFlash < 0.002) discard;
    // hottest at the vanishing point, spilling outward
    float r = length((vUv - 0.5) * 2.0);
    float core = mix(1.0, exp(-r * r * 0.9), 1.0 - uFlash);
    gl_FragColor = vec4(vec3(1.0), clamp(uFlash * core, 0.0, 1.0));
  }
`;
