/**
 * Handwritten GLSL for the opening sequence.
 *
 * Everything is billboarded quads or GPU points — no geometry heavier than a
 * plane or an open cylinder, so the whole cinematic is a handful of draw
 * calls. Every trajectory is a closed-form function of time: nothing is
 * simulated on the CPU and nothing is uploaded per frame.
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
 * and anamorphic spikes that sharpen as it destabilises toward the collapse.
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

    float core = exp(-r * r * 160.0);
    float halo = exp(-r * r * 9.0);
    // the cross-flare only appears as it loses stability
    float sx = pow(max(0.0, 1.0 - abs(uv.y) * 26.0), 3.0) * exp(-abs(uv.x) * 2.6);
    float sy = pow(max(0.0, 1.0 - abs(uv.x) * 26.0), 3.0) * exp(-abs(uv.y) * 2.6);
    float spikes = (sx + sy) * uPulse;

    // slow breath while it is stable, racing as the end comes
    float breathe = 1.0 + (0.08 + 0.18 * uPulse) * sin(uTime * (2.2 + uPulse * 4.5));
    float e = (core * 1.8 + halo * (0.14 + 0.3 * uPulse) + spikes * 0.55) * breathe;

    vec3 col = mix(vec3(1.0, 0.86, 0.72), vec3(1.0), clamp(core * 1.4, 0.0, 1.0));
    float a = clamp(e, 0.0, 1.0) * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * e, a);
  }
`;

/* ── Scene 02 · the big bang ─────────────────────────────────────────── */

/**
 * GPU particle field. Every mote's whole trajectory is a closed-form
 * function of time — one uniform moves a hundred thousand points.
 *
 * Expansion decelerates under drag: r(t) = v·(1 − e^(−kt)) / k. Motes still
 * moving fast burn white-hot and are drawn larger and softer, which reads as
 * motion blur without a velocity pass.
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

  // drag. Terminal radius is aSpeed/K, so this tracks the launch speeds in
  // BigBangField: halve one, halve the other, and the shell ends up the same
  // size having taken twice as long to get there.
  const float K = 0.18;

  void main() {
    float t = max(uT, 0.0);
    float r = aSpeed * (1.0 - exp(-K * t)) / K;
    vec3 p = aDir * r;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float speed = aSpeed * exp(-K * t);
    vHeat = clamp(speed / 2.9, 0.0, 1.0);

    // a hard edge at t=0 would pop; the ignition is a beat of its own
    float born = smoothstep(0.0, 0.45, uT);
    float twinkle = 0.7 + 0.3 * sin(uT * 2.4 + aPhase * 6.2831);
    // a hundred thousand additive sprites saturate the frame instantly, so
    // each one contributes very little on its own
    vAlpha = born * uFade * twinkle * 0.5;

    // faster motes are drawn bigger and softer — cheap motion smear.
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
    // cooling: white-hot, through amber, down to the deep cosmic red
    vec3 ember = vec3(0.545, 0.0, 0.0);   // #8B0000
    vec3 amber = vec3(1.0, 0.60, 0.22);
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
    vec3 col = mix(vec3(1.0, 0.45, 0.30), vec3(1.0, 0.95, 0.88), smoothstep(0.0, 1.0, band));
    float a = band * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * band, a);
  }
`;

/* ── Scenes 02–03 · nebulae ──────────────────────────────────────────── */

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

/* ── Scene 03 · newborn stars (and, later, the hyperspace streaks) ───── */

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
    // squeeze the sprite as we accelerate — a radial smear
    c.x *= 1.0 + uStretch * 3.2;
    float a = smoothstep(0.5, 0.04, length(c)) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/* ── Scene 03 · the passing world's atmosphere ───────────────────────── */

export const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

/** A rim of scattered light, drawn on the sphere's back faces. */
export const atmoFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.2);
    gl_FragColor = vec4(uColor, rim * 0.55);
  }
`;

/* ── Scene 04 · the black hole ───────────────────────────────────────── */

export const blackHoleVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * An Interstellar-style hole on one billboarded quad.
 *
 * Each fragment fires a photon backwards from the camera and integrates the
 * first-order Schwarzschild null geodesic: v̇ = −3/2·h²·r/|r|⁵, with h the
 * conserved angular momentum. Everything the film's look is famous for then
 * falls out for free rather than being painted on — the disk's far side
 * lensed into an arc over the pole, the thin photon ring hugging the shadow,
 * and the shadow itself, which is simply the set of rays that never escape.
 *
 * Working units: 1 = the Schwarzschild radius. The disk lives in the local
 * y=0 plane; crossings are detected by a sign change between steps, so the
 * disk stays razor thin at any march resolution. Doppler beaming brightens
 * the approaching limb and drops the receding one toward the deep red.
 */
export function makeBlackHoleFragment(steps: number): string {
  return /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uFade;
  uniform vec3  uCamPos;   // world space
  uniform vec3  uCenter;   // world space

  varying vec3 vWorld;

  // world units per Schwarzschild radius
  const float RS = 2.0;
  const float DISK_IN = 2.3;
  const float DISK_OUT = 7.0;

  ${NOISE}

  void main() {
    // hole-local frame, in units of the horizon radius
    vec3 ro = (uCamPos - uCenter) / RS;
    vec3 rd = normalize(vWorld - uCamPos);

    // a fixed inclination so the disk reads three-quarter, like the film
    float ci = cos(0.32), si = sin(0.32);
    ro.yz = mat2(ci, -si, si, ci) * ro.yz;
    rd.yz = mat2(ci, -si, si, ci) * rd.yz;

    vec3 pos = ro;
    vec3 vel = rd;
    vec3 hv = cross(pos, vel);
    float h2 = dot(hv, hv);

    vec3 col = vec3(0.0);
    float trans = 1.0;    // how much of what lies behind still shows
    float minR = 1e4;     // closest approach — decides the shadow, softly
    vec3 prev = pos;

    for (int i = 0; i < ${steps}; i++) {
      float r = length(pos);
      minR = min(minR, r);
      if (r < 0.96) break;                          // fell through the horizon
      if (r > 42.0 && dot(pos, vel) > 0.0) break;   // escaped and receding

      // long strides far out, fine ones where the bending is violent
      float dt = clamp(r * 0.14, 0.035, 0.75);
      vel += -1.5 * h2 * pos / pow(r, 5.0) * dt;
      prev = pos;
      pos += vel * dt;

      // did this stride cross the disk plane?
      if (pos.y * prev.y < 0.0) {
        // land exactly on the plane — reading the radius off the discrete
        // step instead quantises it into visible concentric bands
        vec3 hit = mix(prev, pos, prev.y / (prev.y - pos.y));
        float rr = length(hit.xz);
        if (rr > DISK_IN - 0.3 && rr < DISK_OUT + 0.7) {
          float ring = clamp(1.0 - (rr - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);
          // soft rims — a binary in/out test leaves the disk edges pixel-hard
          float edge = smoothstep(DISK_IN - 0.3, DISK_IN + 0.35, rr)
                     * (1.0 - smoothstep(DISK_OUT - 0.9, DISK_OUT + 0.7, rr));

          // hot matter sheared into trailing lanes by differential rotation.
          // The noise is sampled in rotated disk coordinates, not by angle:
          // an atan() seam would cut a hard radial line through the disk.
          float w = uTime * 2.2 / (rr * sqrt(rr));
          float cw = cos(w), sw = sin(w);
          vec2 q = mat2(cw, -sw, sw, cw) * hit.xz;
          float lanes = fbm(q * 1.5 + vec2(0.0, log(rr) * 3.0));

          float glow = pow(ring, 2.0) * (0.5 + 0.9 * lanes) + pow(ring, 8.0) * 0.8;

          // relativistic beaming: the limb sweeping toward the lens burns hotter
          vec3 tang = normalize(vec3(-hit.z, 0.0, hit.x));
          float dopp = clamp(1.0 + 1.7 * dot(tang, -rd) / sqrt(rr), 0.25, 2.8);

          vec3 ember = vec3(0.545, 0.0, 0.0);    // #8B0000
          vec3 amber = vec3(1.0, 0.58, 0.20);
          vec3 hot   = vec3(1.0, 0.96, 0.90);
          vec3 dcol = mix(ember, amber, ring);
          dcol = mix(dcol, hot, pow(ring, 3.0) * clamp(dopp, 0.0, 1.0));

          // capped — isolated super-hot texels shimmer once bloom gets them
          float lum = min(glow * dopp, 2.6) * edge;
          float a = clamp(lum * 0.9, 0.0, 1.0);
          col += dcol * lum * trans;
          trans *= 1.0 - a * 0.85;
          if (trans < 0.03) break;
        }
      }
    }

    // escaped rays that hit nothing stay transparent — the stars behind
    // show through. The shadow comes from the closest approach, feathered
    // over a few percent of the horizon radius: a binary captured-or-not
    // test switches on pixel by pixel and reads as a jagged rim.
    float shadow = smoothstep(1.08, 0.99, minR);
    float alpha = (1.0 - trans) + shadow * trans;
    if (alpha * uFade < 0.004) discard;
    gl_FragColor = vec4(col * uFade, clamp(alpha, 0.0, 1.0) * uFade);
  }
`;
}

/* ── Scene 04 · dust spiralling in ───────────────────────────────────── */

/**
 * Infalling motes on closed-form spirals: radius decays exponentially, and
 * the sweep rate rises Keplerian-fashion as they close in, so the inner
 * edge of the vortex visibly outruns the rim.
 */
export const infallVertex = /* glsl */ `
  uniform float uT;          // seconds since the hole began gathering
  uniform float uPixelRatio;
  uniform float uFade;

  attribute float aR0;       // starting radius
  attribute float aAng;      // starting azimuth
  attribute float aTilt;     // height above the disk plane
  attribute float aRate;     // how quickly this mote surrenders

  varying float vHeat;
  varying float vAlpha;

  void main() {
    float t = max(uT, 0.0);
    float r = max(aR0 * exp(-t * aRate * 0.16), 3.2);
    float ang = aAng + t * (9.0 / (r * sqrt(r)));
    // the cloud flattens into the disk as it falls
    float y = aTilt * (r / aR0);
    vec3 p = vec3(cos(ang) * r, y, sin(ang) * r);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vHeat = clamp(1.0 - (r - 3.2) / 14.0, 0.0, 1.0);
    vAlpha = uFade * (0.2 + 0.8 * vHeat);
    gl_PointSize = (0.9 + vHeat * 2.2) * uPixelRatio * (46.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

export const infallFragment = /* glsl */ `
  precision highp float;
  varying float vHeat;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float fall = smoothstep(0.5, 0.0, d);
    vec3 ember = vec3(0.545, 0.0, 0.0);
    vec3 amber = vec3(1.0, 0.62, 0.28);
    vec3 col = mix(ember, amber, vHeat);
    float a = fall * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * (0.4 + 0.6 * vHeat), a);
  }
`;

/* ── Scene 05 · the wormhole throat ──────────────────────────────────── */

/**
 * Seen from inside a cylinder. Light runs along the walls toward the mouth;
 * the far end glows, and the whole bore twists slowly around the flight
 * axis. uv.y is length down the tunnel, uv.x is the angle.
 */
export const tunnelFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlpha;
  uniform float uRush;   // 0..1 how hard we are falling
  uniform vec3  uAccent;
  varying vec2 vUv;

  ${NOISE}

  void main() {
    float along = vUv.y;
    // the bore corkscrews, harder the faster we fall
    float ang = vUv.x + along * (0.22 + uRush * 0.5) + uTime * 0.03;

    // streaks rushing past, several speeds layered
    float speed = 1.9 + uRush * 3.4;
    float s = fbm(vec2(ang * 26.0, along * 3.0 - uTime * speed));
    s += fbm(vec2(ang * 54.0, along * 5.0 - uTime * speed * 1.7)) * 0.5;
    float streak = pow(clamp((s - 0.55) * 2.2, 0.0, 1.0), 2.0);

    // the throat brightens toward the mouth we are flying into
    float depth = smoothstep(0.0, 0.85, along);
    vec3 cool = vec3(0.62, 0.74, 1.0);
    vec3 col = mix(cool, vec3(1.0), depth * 0.8);
    col = mix(col, uAccent, streak * 0.3 * (1.0 - depth));

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
