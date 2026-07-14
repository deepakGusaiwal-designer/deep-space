import{r as m,u as b,j as i,C as E,d as L,w as $,q as X,y as Y,B as Z}from"./r3f-KYBvflXZ.js";import{s as w,T as o,H as T}from"./main-D-A1_xnl.js";import{s as f,l as x}from"./flightPath-BCN_dqRw.js";import{g as y,Y as A,B as C,J as d,aZ as D,i as S,aN as O,f as P,u as K,j as J}from"./three-Vwri2QGb.js";import"./modulepreload-polyfill-B5Qt9EMX.js";import"./motion-DDLYhsy2.js";import"./gsap-xgxdCp6f.js";const q=`
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
`,j=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Q=`
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
`,ee=`
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
  // size having taken twice as long to get there. Tuned low so the eruption
  // is watched growing out of the point, not discovered already open.
  const float K = 0.11;

  void main() {
    float t = max(uT, 0.0);
    float r = aSpeed * (1.0 - exp(-K * t)) / K;
    vec3 p = aDir * r;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float speed = aSpeed * exp(-K * t);
    vHeat = clamp(speed / 1.6, 0.0, 1.0);

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
`,ae=`
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
`,te=`
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
`,oe=`
  precision highp float;

  uniform float uTime;
  uniform float uAlpha;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uSeed;
  varying vec2 vUv;

  ${q}

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
`,N=`
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
`,G=`
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
`,re=`
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,ne=`
  precision highp float;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.2);
    gl_FragColor = vec4(uColor, rim * 0.55);
  }
`,se=`
  varying vec3 vWorld;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function ie(t){return`
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

  ${q}

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

    for (int i = 0; i < ${t}; i++) {
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
`}const le=`
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
`,ue=`
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
`,ce=`
  precision highp float;

  uniform float uTime;
  uniform float uAlpha;
  uniform float uRush;   // 0..1 how hard we are falling
  uniform vec3  uAccent;
  varying vec2 vUv;

  ${q}

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
`,he=`
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
`;function fe(){const t=m.useRef(null),r=m.useMemo(()=>new y({vertexShader:j,fragmentShader:Q,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPulse:{value:0},uAlpha:{value:0}}}),[]);return b(u=>{const a=t.current;if(!a)return;const e=w.t,n=f(.04,.5,e)*(1-f(o.bang-.02,o.bang+.05,e));if(r.uniforms.uAlpha.value=n,r.uniforms.uTime.value=e,r.uniforms.uPulse.value=f(.55,o.bang,e),a.visible=n>.004,!a.visible)return;a.quaternion.copy(u.camera.quaternion);const s=f(o.collapse,o.bang,e),c=f(.8,o.bang,e);a.scale.setScalar(O.lerp(2.4,.9,s*s)),a.position.set((Math.random()-.5)*.05*c,(Math.random()-.5)*.05*c,0)}),i.jsx("mesh",{ref:t,material:r,renderOrder:20,frustumCulled:!1,visible:!1,children:i.jsx("planeGeometry",{args:[1,1]})})}function me({count:t}){const r=m.useRef(null),u=m.useMemo(()=>{const e=new C,n=new Float32Array(t*3),s=new Float32Array(t),c=new Float32Array(t);for(let h=0;h<t;h++){const l=Math.random()*2-1,v=Math.random()*Math.PI*2,p=Math.sqrt(1-l*l);n[h*3]=p*Math.cos(v),n[h*3+1]=p*Math.sin(v),n[h*3+2]=l,s[h]=.18+Math.pow(Math.random(),.6)*1.32,c[h]=Math.random()}return e.setAttribute("position",new d(new Float32Array(t*3),3)),e.setAttribute("aDir",new d(n,3)),e.setAttribute("aSpeed",new d(s,1)),e.setAttribute("aPhase",new d(c,1)),e.boundingSphere=new D(new S,1e4),e},[t]),a=m.useMemo(()=>new y({vertexShader:ee,fragmentShader:ae,transparent:!0,depthWrite:!1,blending:A,uniforms:{uT:{value:-1},uPixelRatio:{value:1},uFade:{value:1}}}),[]);return b(e=>{const n=r.current;if(!n)return;const s=w.t;a.uniforms.uT.value=s-o.bang,a.uniforms.uPixelRatio.value=e.viewport.dpr,a.uniforms.uFade.value=1-f(o.universe+.4,o.hole-.4,s),n.visible=s>o.bang-.05&&a.uniforms.uFade.value>.01}),i.jsx("points",{ref:r,geometry:u,material:a,frustumCulled:!1,visible:!1})}const ve=[{at:0,rate:.36,width:.05,peak:1},{at:.3,rate:.25,width:.09,peak:.6},{at:.8,rate:.16,width:.15,peak:.32}];function de(){const t=m.useRef(null),r=m.useMemo(()=>ve.map(u=>[u,new y({vertexShader:j,fragmentShader:te,transparent:!0,depthWrite:!1,blending:A,uniforms:{uRadius:{value:0},uWidth:{value:u.width},uAlpha:{value:0}}})]),[]);return b(u=>{const a=t.current;if(!a)return;const e=w.t-o.bang;a.visible=e>-.05&&e<6,a.visible&&(a.quaternion.copy(u.camera.quaternion),r.forEach(([n,s],c)=>{const h=e-n.at,l=a.children[c];if(h<=0){l.visible=!1;return}l.visible=!0;const v=(1-Math.exp(-n.rate*h))*1.35;s.uniforms.uRadius.value=v,s.uniforms.uAlpha.value=n.peak*Math.exp(-h*.5)}))}),i.jsx("group",{ref:t,renderOrder:18,visible:!1,children:r.map(([,u],a)=>i.jsx("mesh",{material:u,frustumCulled:!1,children:i.jsx("planeGeometry",{args:[46,46]})},a))})}const U=[[1,.96,.9],[.82,.88,1],[1,.86,.72],[.92,.94,1]];function pe({count:t}){const r=m.useRef(null),u=m.useMemo(()=>{const e=new C,n=new Float32Array(t*3),s=new Float32Array(t),c=new Float32Array(t),h=new Float32Array(t*3);for(let l=0;l<t;l++){const v=Math.random()*2-1,p=Math.random()*Math.PI*2,M=Math.sqrt(1-v*v),R=22+Math.pow(Math.random(),.6)*60;n[l*3]=M*Math.cos(p)*R,n[l*3+1]=M*Math.sin(p)*R*.75,n[l*3+2]=v*R-12,s[l]=.7+Math.pow(Math.random(),2.4)*2.6,c[l]=Math.random();const g=U[Math.random()*U.length|0];h[l*3]=g[0],h[l*3+1]=g[1],h[l*3+2]=g[2]}return e.setAttribute("position",new d(n,3)),e.setAttribute("aSize",new d(s,1)),e.setAttribute("aPhase",new d(c,1)),e.setAttribute("aColor",new d(h,3)),e},[t]),a=m.useMemo(()=>new y({vertexShader:N,fragmentShader:G,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPixelRatio:{value:1},uReveal:{value:0},uStretch:{value:0}}}),[]);return b(e=>{const n=r.current;if(!n)return;const s=w.t;a.uniforms.uTime.value=s,a.uniforms.uPixelRatio.value=e.viewport.dpr,a.uniforms.uReveal.value=f(o.universe-.3,o.universe+1.5,s),a.uniforms.uStretch.value=f(o.wormhole,o.flash,s),n.visible=a.uniforms.uReveal.value>.01}),i.jsx("points",{ref:r,geometry:u,material:a,frustumCulled:!1,visible:!1})}const V=[{pos:[-16,5,-26],scale:44,a:"#2e0a12",b:"#8B0000",seed:1.7,alpha:.5},{pos:[18,-7,-34],scale:54,a:"#121830",b:"#3d5a92",seed:5.2,alpha:.44},{pos:[2,10,-46],scale:62,a:"#241028",b:"#5a3570",seed:9.4,alpha:.34},{pos:[-28,-10,-52],scale:58,a:"#301016",b:"#a03040",seed:3.3,alpha:.3},{pos:[30,9,-64],scale:66,a:"#0e1c2a",b:"#2e6f8a",seed:7.1,alpha:.28},{pos:[-6,-15,-40],scale:48,a:"#1c0f2e",b:"#7a4ea0",seed:11.8,alpha:.3}];function ge({lite:t}){const r=t?V.slice(0,3):V,u=m.useRef(null),a=m.useMemo(()=>r.map(e=>new y({vertexShader:j,fragmentShader:oe,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uAlpha:{value:0},uSeed:{value:e.seed},uColorA:{value:new P(e.a)},uColorB:{value:new P(e.b)}}})),[r]);return b(e=>{const n=u.current;if(!n)return;const s=w.t,c=f(o.bang+.35,o.universe+1.2,s),h=1-f(o.wormhole,o.flash,s);n.visible=c>.01&&h>.01,n.visible&&(a.forEach((l,v)=>{l.uniforms.uTime.value=s,l.uniforms.uAlpha.value=r[v].alpha*c*h}),n.children.forEach(l=>l.quaternion.copy(e.camera.quaternion)))}),i.jsx("group",{ref:u,visible:!1,children:r.map((e,n)=>i.jsx("mesh",{position:e.pos,material:a[n],renderOrder:2,frustumCulled:!1,children:i.jsx("planeGeometry",{args:[e.scale,e.scale]})},n))})}const be=[{pos:[-19,7,-44],rot:[.5,.2,.35],scale:1,spin:.11,arms:3,count:7e3,core:"#ffe6c2",edge:"#6f86c9",delay:0},{pos:[24,-6,-58],rot:[-.7,.4,-.2],scale:.62,spin:-.16,arms:2,count:3200,core:"#ffd9d0",edge:"#b06a8a",delay:.5},{pos:[7,15,-70],rot:[1.1,-.3,.5],scale:.8,spin:.08,arms:4,count:3200,core:"#fff2da",edge:"#5a7ec9",delay:.9}];function we({spec:t,lite:r}){const u=m.useRef(null),a=m.useRef(null),e=r?Math.floor(t.count*.4):t.count,n=m.useMemo(()=>{const c=new C,h=new Float32Array(e*3),l=new Float32Array(e),v=new Float32Array(e),p=new Float32Array(e*3),M=new P(t.core),R=new P(t.edge);for(let g=0;g<e;g++){const F=Math.pow(Math.random(),.62)*11,B=g%t.arms*(Math.PI*2/t.arms)+F*.44+(Math.random()-.5)*.5,k=(1-F/11)*.5+.22;h[g*3]=Math.cos(B)*F+(Math.random()-.5)*k*2.4,h[g*3+1]=(Math.random()-.5)*k*(1.6-F*.09),h[g*3+2]=Math.sin(B)*F+(Math.random()-.5)*k*2.4,l[g]=.5+Math.random()*1.5,v[g]=Math.random();const z=M.clone().lerp(R,Math.min(1,F/9));p[g*3]=z.r,p[g*3+1]=z.g,p[g*3+2]=z.b}return c.setAttribute("position",new d(h,3)),c.setAttribute("aSize",new d(l,1)),c.setAttribute("aPhase",new d(v,1)),c.setAttribute("aColor",new d(p,3)),c},[e,t]),s=m.useMemo(()=>new y({vertexShader:N,fragmentShader:G,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPixelRatio:{value:1},uReveal:{value:0},uStretch:{value:0}}}),[]);return b((c,h)=>{const l=u.current;if(!l||!a.current)return;const v=w.t;s.uniforms.uTime.value=v,s.uniforms.uPixelRatio.value=c.viewport.dpr;const p=f(o.universe+t.delay,o.universe+t.delay+1.5,v);s.uniforms.uReveal.value=p;const M=1-f(o.hole+.4,o.wormhole,v);l.visible=p>.01&&M>.01,l.visible&&(s.uniforms.uStretch.value=0,a.current.rotation.y+=h*t.spin,l.scale.setScalar(t.scale*M))}),i.jsx("group",{ref:u,position:t.pos,rotation:t.rot,visible:!1,children:i.jsx("points",{ref:a,geometry:n,material:s,frustumCulled:!1})})}function xe({lite:t}){return i.jsx(i.Fragment,{children:be.map((r,u)=>i.jsx(we,{spec:r,lite:t},u))})}function ye(){const t=m.useRef(null),r=m.useRef(null),u=m.useMemo(()=>new y({vertexShader:re,fragmentShader:ne,transparent:!0,depthWrite:!1,blending:A,side:K,uniforms:{uColor:{value:new P("#7fa6ff")}}}),[]),a=m.useMemo(()=>new S(9,-3.4,-40),[]),e=m.useMemo(()=>new S(-5.5,2.2,12),[]);return b((n,s)=>{const c=t.current;if(!c)return;const h=w.t,l=f(o.universe+.25,o.hole-.05,h);c.visible=l>.001&&l<.999,c.visible&&(c.position.set(x(a.x,e.x,l),x(a.y,e.y,l),x(a.z,e.z,l)),r.current&&(r.current.rotation.y+=s*.16))}),i.jsxs("group",{ref:t,visible:!1,children:[i.jsxs("mesh",{ref:r,children:[i.jsx("sphereGeometry",{args:[2.4,48,48]}),i.jsx("meshStandardMaterial",{color:"#2f3644",roughness:.85,metalness:.05})]}),i.jsx("mesh",{scale:1.12,material:u,children:i.jsx("sphereGeometry",{args:[2.4,32,32]})})]})}const I=new S(0,0,T),W=new S;function Me({lite:t}){const r=m.useRef(null),u=m.useMemo(()=>new y({vertexShader:se,fragmentShader:ie(t?60:110),transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:I.clone()},uCamPos:{value:new S},uFade:{value:0}}}),[t]);return b(a=>{const e=r.current;if(!e)return;const n=w.t,s=f(o.hole-.9,o.hole+.6,n)*(1-f(o.wormhole+.25,o.flash,n));u.uniforms.uFade.value=s,e.visible=s>.01,e.visible&&(u.uniforms.uTime.value=n,u.uniforms.uCamPos.value.copy(a.camera.position),e.quaternion.copy(a.camera.quaternion))}),i.jsx("mesh",{ref:r,position:I,material:u,renderOrder:8,frustumCulled:!1,visible:!1,children:i.jsx("planeGeometry",{args:[80,80]})})}function Ae({count:t}){const r=m.useRef(null),u=m.useMemo(()=>{const e=new C,n=new Float32Array(t),s=new Float32Array(t),c=new Float32Array(t),h=new Float32Array(t);for(let l=0;l<t;l++)n[l]=8+Math.pow(Math.random(),.7)*16,s[l]=Math.random()*Math.PI*2,c[l]=(Math.random()-.5)*5,h[l]=.6+Math.random()*1.4;return e.setAttribute("position",new d(new Float32Array(t*3),3)),e.setAttribute("aR0",new d(n,1)),e.setAttribute("aAng",new d(s,1)),e.setAttribute("aTilt",new d(c,1)),e.setAttribute("aRate",new d(h,1)),e.boundingSphere=new D(new S,1e4),e},[t]),a=m.useMemo(()=>new y({vertexShader:le,fragmentShader:ue,transparent:!0,depthWrite:!1,blending:A,uniforms:{uT:{value:-1},uPixelRatio:{value:1},uFade:{value:0}}}),[]);return b(e=>{const n=r.current;if(!n)return;const s=w.t;a.uniforms.uT.value=s-(o.hole-1),a.uniforms.uPixelRatio.value=e.viewport.dpr;const c=f(o.hole-.3,o.hole+.8,s)*(1-f(o.wormhole+.2,o.flash,s));a.uniforms.uFade.value=c,n.visible=c>.01}),i.jsx("points",{ref:r,position:I,rotation:[-.32,0,0],geometry:u,material:a,renderOrder:7,frustumCulled:!1,visible:!1})}function Se(){const t=m.useRef(null),r=m.useMemo(()=>new y({vertexShader:j,fragmentShader:ce,transparent:!0,depthWrite:!1,side:K,blending:A,uniforms:{uTime:{value:0},uAlpha:{value:0},uRush:{value:0},uAccent:{value:new P("#8B0000")}}}),[]);return b(()=>{const u=t.current;if(!u)return;const a=w.t,e=f(o.wormhole-.2,o.wormhole+.35,a)*(1-f(o.flash,o.flash+.25,a));if(r.uniforms.uAlpha.value=e,u.visible=e>.01,!u.visible)return;r.uniforms.uTime.value=a;const n=f(o.wormhole,o.flash,a);r.uniforms.uRush.value=n,u.scale.set(1+n*.5,1,1+n*.5)}),i.jsx("mesh",{ref:t,position:[0,0,T+16],rotation:[Math.PI/2,0,0],material:r,renderOrder:9,frustumCulled:!1,visible:!1,children:i.jsx("cylinderGeometry",{args:[7,7,64,64,1,!0]})})}function Fe(){const t=m.useRef(null),r=m.useMemo(()=>new y({vertexShader:j,fragmentShader:he,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uFlash:{value:0}}}),[]);return b(u=>{const a=t.current;if(!a)return;const e=w.t,n=f(o.flash-.14,o.flash,e),s=1-f(o.flash+.05,o.flash+1.1,e),c=n*s;if(r.uniforms.uFlash.value=c,a.visible=c>.002,!a.visible)return;const h=u.camera,l=.4;W.set(0,0,-1).applyQuaternion(h.quaternion),a.position.copy(h.position).addScaledVector(W,l),a.quaternion.copy(h.quaternion);const v=2*l*Math.tan(O.degToRad(h.fov*.5));a.scale.set(v*(u.size.width/u.size.height)*1.05,v*1.05,1)}),i.jsx("mesh",{ref:t,material:r,renderOrder:999,frustumCulled:!1,visible:!1,children:i.jsx("planeGeometry",{args:[1,1]})})}const H=new S;function _(t,r){return Math.sin(t*37.1+r)*.55+Math.sin(t*61.7+r*2.3)*.3+Math.sin(t*13.3+r*5.1)*.15}function Pe({quiet:t}){return b(r=>{const u=r.camera,a=w.t;let e=6;e=x(e,5.35,f(o.collapse-.2,o.bang,a)),e=x(e,14.5,f(o.bang,o.universe-.3,a)),e=x(e,.5,f(o.universe,o.hole,a)),e=x(e,-15,f(o.hole,o.wormhole,a));const n=f(o.wormhole,o.flash,a);e=x(e,T+2.5,n*n*n);let s=45;s=x(s,52,f(o.universe,o.hole,a)),s=x(s,60,f(o.hole,o.wormhole,a)),s=x(s,96,n*n);const c=t?0:Math.exp(-Math.max(0,a-o.bang)*1.3)*f(o.bang-.02,o.bang+.1,a),h=t?0:n*.25,l=_(a,1.7)*(.3*c+.06*h),v=_(a,4.9)*(.24*c+.05*h),p=t?0:Math.sin(a*.31)*.5*f(o.universe,o.hole,a),M=t?0:Math.cos(a*.24)*.34*f(o.universe,o.hole,a);u.position.set(l+p,v+M,e),H.set(p*.3,M*.3,a<o.universe?0:T),u.lookAt(H),u.rotation.z+=t?0:n*n*1.5+_(a,9.1)*.02*c,Math.abs(u.fov-s)>.01&&(u.fov=s,u.updateProjectionMatrix())}),null}function Re(){const t=m.useMemo(()=>new J,[]);return b(()=>{const r=f(o.wormhole,o.flash,w.t);t.set(r*.0024,r*.0017)}),i.jsx(Y,{blendFunction:Z.NORMAL,offset:t,radialModulation:!1,modulationOffset:0})}function Be({quiet:t,lite:r}){return i.jsxs(E,{dpr:r?[1,1.5]:[1,2],gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,0,6],fov:45,near:.1,far:400},style:{background:"#000000"},children:[i.jsx("color",{attach:"background",args:["#000000"]}),i.jsx("ambientLight",{intensity:.12}),i.jsx("directionalLight",{position:[14,10,6],intensity:1.4,color:"#fff4e6"}),i.jsx(Pe,{quiet:t}),i.jsx(fe,{}),i.jsx(me,{count:r?3e4:12e4}),i.jsx(de,{}),i.jsx(ge,{lite:r}),i.jsx(pe,{count:r?3e3:9e3}),i.jsx(xe,{lite:r}),i.jsx(ye,{}),i.jsx(Ae,{count:r?900:2600}),i.jsx(Me,{lite:r}),i.jsx(Se,{}),i.jsx(Fe,{}),!r&&i.jsxs(L,{multisampling:0,children:[i.jsx($,{intensity:1.15,luminanceThreshold:.4,luminanceSmoothing:.85,mipmapBlur:!0}),i.jsx(Re,{}),i.jsx(X,{eskil:!1,offset:.2,darkness:.85})]})]})}export{Be as default};
