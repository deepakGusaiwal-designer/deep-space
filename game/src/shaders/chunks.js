/**
 * Reusable GLSL modules. Every procedural surface in the game is
 * assembled from these chunks — there are no texture files anywhere.
 */

/** Hash + 3D value noise + fbm. Cheap, stable, tileable enough for architecture. */
export const NOISE_GLSL = /* glsl */ `
  float mHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float mNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(mHash(i + vec3(0,0,0)), mHash(i + vec3(1,0,0)), f.x),
          mix(mHash(i + vec3(0,1,0)), mHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(mHash(i + vec3(0,0,1)), mHash(i + vec3(1,0,1)), f.x),
          mix(mHash(i + vec3(0,1,1)), mHash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  float mFbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * mNoise(p);
      p = p * 2.02 + vec3(13.7);
      a *= 0.5;
    }
    return v;
  }

  /* Ridged turbulence — used for marble veins. */
  float mRidge(vec3 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 4; i++) {
      v += a * abs(2.0 * mNoise(p) - 1.0);
      p = p * 2.13 + vec3(7.3);
      a *= 0.52;
    }
    return v;
  }
`;

/** View-dependent rim term. */
export const FRESNEL_GLSL = /* glsl */ `
  float mFresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(clamp(1.0 - dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
  }
`;

/** Soft vertical gradient helper for emissive beams / sky. */
export const GRADIENT_GLSL = /* glsl */ `
  vec3 mGradient(vec3 a, vec3 b, float t) {
    return mix(a, b, smoothstep(0.0, 1.0, t));
  }
`;
