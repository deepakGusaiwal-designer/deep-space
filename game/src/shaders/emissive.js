/**
 * Fully custom ShaderMaterial sources for the game's emissive elements:
 * energy gates, exit portals, trigger pads, checkpoint beacons, the
 * procedural sky dome and the player's contact shadow.
 *
 * All of them share the chunk library — no textures, no images.
 */
import { NOISE_GLSL, FRESNEL_GLSL, GRADIENT_GLSL } from './chunks.js';

/* ------------------------------------------------------------------ */
/* Energy gate — scanning lines + fresnel veil. uOpen dissolves it.    */
/* ------------------------------------------------------------------ */
export const GateShader = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragment: /* glsl */ `
    uniform float uTime;
    uniform float uOpen;      // 0 = solid barrier, 1 = fully dissolved
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${NOISE_GLSL}
    ${FRESNEL_GLSL}
    void main() {
      float scan = 0.5 + 0.5 * sin(vUv.y * 90.0 - uTime * 3.0);
      scan = pow(scan, 3.0);
      float ripple = mNoise(vec3(vUv * 8.0, uTime * 0.4));
      float fres = mFresnel(vNormal, vViewDir, 2.0);
      float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x)
                 * smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
      float body = mix(0.16, 0.05, edge);              // brighter frame edge
      float a = body + scan * 0.25 + fres * 0.35 + ripple * 0.08;

      /* dissolve upward as the gate opens */
      float dissolve = smoothstep(uOpen, uOpen + 0.15, vUv.y + ripple * 0.2);
      a *= (1.0 - uOpen * 0.85) * mix(1.0, dissolve, uOpen);

      gl_FragColor = vec4(uColor * (1.2 + scan), a);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Exit portal disc — swirling energy well.                            */
/* ------------------------------------------------------------------ */
export const PortalShader = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${NOISE_GLSL}
    void main() {
      vec2 c = vUv - 0.5;
      float r = length(c) * 2.0;
      float ang = atan(c.y, c.x);
      /* logarithmic swirl */
      float swirl = mNoise(vec3(ang * 1.5 + r * 5.0 - uTime * 1.2, r * 4.0, uTime * 0.35));
      float rings = 0.5 + 0.5 * sin(r * 22.0 - uTime * 4.0 + swirl * 6.0);
      float core = smoothstep(0.5, 0.0, r);
      float rim = smoothstep(1.0, 0.86, r) * smoothstep(0.6, 0.95, r);
      float a = core * 0.9 + rings * 0.28 * smoothstep(1.0, 0.2, r) + rim * 1.4;
      vec3 col = mix(uColor, vec3(1.0), core * 0.75 + rim * 0.3);
      gl_FragColor = vec4(col * 1.6, a * smoothstep(1.0, 0.97, r));
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Trigger pad — pulsing concentric ring. uActive locks it bright.     */
/* ------------------------------------------------------------------ */
export const PadShader = {
  vertex: PortalShader.vertex,
  fragment: /* glsl */ `
    uniform float uTime;
    uniform float uActive;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      float r = length(c) * 2.0;
      float pulse = 0.5 + 0.5 * sin(uTime * 2.6);
      float ring = smoothstep(0.06, 0.0, abs(r - mix(0.55, 0.72, pulse * (1.0 - uActive))));
      float disc = smoothstep(0.4, 0.0, r) * 0.25;
      float glow = (ring * mix(0.7, 1.6, uActive) + disc * mix(0.6, 2.2, uActive));
      gl_FragColor = vec4(uColor * (1.0 + uActive), glow * smoothstep(1.0, 0.9, r));
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Checkpoint beacon — soft vertical light column.                     */
/* ------------------------------------------------------------------ */
export const BeaconShader = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragment: /* glsl */ `
    uniform float uTime;
    uniform float uLit;       // 1 once the checkpoint is claimed
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${FRESNEL_GLSL}
    ${GRADIENT_GLSL}
    void main() {
      float fade = pow(1.0 - vUv.y, 1.6);                 // dissolve toward the top
      float fres = 1.0 - mFresnel(vNormal, vViewDir, 0.7); // brightest at grazing center
      float flicker = 0.9 + 0.1 * sin(uTime * 3.0 + vUv.y * 10.0);
      float a = fade * fres * flicker * mix(0.18, 0.65, uLit);
      vec3 col = mGradient(uColor, vec3(1.0), vUv.y * 0.4 + uLit * 0.2);
      gl_FragColor = vec4(col * 1.4, a);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Sky dome — deep space: procedural starfield, level-tinted nebula,   */
/* a faint galaxy band and one distant star-sun. Rendered on an        */
/* inverted sphere AND baked into the PMREM environment.               */
/* ------------------------------------------------------------------ */
export const SkyShader = {
  vertex: /* glsl */ `
    varying vec3 vDir;
    void main() {
      vDir = normalize(position);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uTop;       // nebula tint A (bright)
    uniform vec3 uHorizon;   // nebula tint B (deep)
    uniform vec3 uGround;    // void tint below
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    varying vec3 vDir;
    ${NOISE_GLSL}

    /* point stars from hashed direction cells */
    float starLayer(vec3 d, float scale, float thresh) {
      vec3 p = d * scale;
      float h = mHash(floor(p));
      float star = smoothstep(thresh, 1.0, h);
      vec3 f = fract(p) - 0.5;
      return star * smoothstep(0.22, 0.0, length(f));
    }

    void main() {
      vec3 d = normalize(vDir);

      /* pitch-black vault, faint tint upward, void below */
      vec3 col = vec3(0.003, 0.0025, 0.002)
               + uTop * pow(clamp(d.y, 0.0, 1.0), 1.4) * 0.16
               + uGround * max(0.0, -d.y) * 0.1;

      /* warm dust haze hugging the horizon — thin, so the black stays black */
      float hz = exp(-abs(d.y + 0.03) * 4.4);
      col += uHorizon * hz * (0.16 + 0.07 * mFbm(d * 3.0 + vec3(5.0)));

      /* golden sun: hot core, restrained cinematic bloom */
      float sun = clamp(dot(d, normalize(uSunDir)), 0.0, 1.0);
      col += uSunColor * (pow(sun, 700.0) * 3.2 + pow(sun, 10.0) * 0.2 + pow(sun, 2.4) * 0.05);

      /* sparse dim stars, swallowed by the haze near the horizon */
      float s1 = starLayer(d, 110.0, 0.996);
      col += vec3(0.8, 0.82, 0.9) * s1 * 0.5 * smoothstep(0.08, 0.4, d.y);

      /* break up the black so it never posterizes */
      col += (mFbm(d * 3.0) - 0.5) * 0.006;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Black hole accretion disk — swirling hot matter around the void.    */
/* Drawn on a RingGeometry; the hole itself is a pure black sphere.    */
/* ------------------------------------------------------------------ */
export const BlackHoleDiskShader = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${NOISE_GLSL}
    void main() {
      vec2 c = vUv - 0.5;
      float r = length(c) * 2.0;              // 0 center … 1 outer edge
      float ang = atan(c.y, c.x);

      /* differential rotation: inner matter swirls faster */
      float swirl = mFbm(vec3(ang * 2.0 + r * 9.0 - uTime * (2.6 - r * 1.6), r * 7.0, uTime * 0.22));
      float streaks = 0.5 + 0.5 * sin(ang * 3.0 + r * 34.0 - uTime * 4.0 + swirl * 6.0);

      float heat = smoothstep(1.0, 0.34, r);   // hotter toward the hole
      vec3 col = mix(uColor, vec3(1.0, 0.97, 0.9), heat * heat);

      float a = (heat * 1.25 + streaks * 0.35 * heat)
              * smoothstep(0.34, 0.44, r)      // inner cutoff (event horizon)
              * smoothstep(1.0, 0.82, r);      // soft outer edge
      gl_FragColor = vec4(col * (1.0 + heat * 2.2), a);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Lensing halo — fresnel shell approximating light bending around a   */
/* black hole (also reused for wormhole mouths).                       */
/* ------------------------------------------------------------------ */
export const HaloShader = {
  vertex: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${FRESNEL_GLSL}
    void main() {
      float fres = mFresnel(vNormal, vViewDir, 2.6);
      gl_FragColor = vec4(uColor * 1.6, fres * 0.85);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Contact shadow — analytic soft blob under the player. Cheap SSAO-   */
/* style grounding without a depth pass.                               */
/* ------------------------------------------------------------------ */
export const ContactShadowShader = {
  vertex: PortalShader.vertex,
  fragment: /* glsl */ `
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float r = length(vUv - 0.5) * 2.0;
      float a = pow(smoothstep(1.0, 0.0, r), 2.2) * uStrength;
      gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    }
  `,
};
