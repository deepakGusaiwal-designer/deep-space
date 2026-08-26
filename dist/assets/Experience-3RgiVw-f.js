import{j as f,a as p}from"./motion-eTx_lmuY.js";import{u as P,C as he,d as fe,w as me,q as de}from"./r3f-Bq8T1a_s.js";import{u as R}from"./main-DzS3N9HQ.js";import{s as Z,d as w,a as Q,w as ie,b as pe,h as ge,c as ve,e as L}from"./flightPath-BCN_dqRw.js";import{i as _,g as G,j as U,aN as V,f as T,b1 as B,d as $,b2 as xe,a8 as be,au as Me,v as ye,Y as N,ag as we,B as q,J as E}from"./three-Vwri2QGb.js";import{d as Y}from"./global-DEfW4wKL.js";import"./modulepreload-polyfill-B5Qt9EMX.js";import"./gsap-xgxdCp6f.js";const Se=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,je=`
  precision highp float;

  uniform float uTime;
  uniform vec3  uCamLocal;   // camera position relative to the hole
  uniform float uFade;       // global visibility (fades as we cross the horizon)
  uniform float uWarm;       // warm color balance, 0..1
  varying vec3  vLocal;

  #define HORIZON   1.0
  #define DISK_IN   2.35
  #define DISK_OUT  7.4
  #define STEPS     48

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
      if (alpha >= 0.98) break;

      float r2 = dot(p, p);
      float r = sqrt(r2);

      if (r > 46.0 && dot(p, v) > 0.0) { escaped = true; break; }

      float dt = clamp(r * 0.22, 0.065, 0.85);

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
`,Ce=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Re=`
  precision highp float;

  uniform float uTime;
  uniform float uCross;   // 0..1..0 — presence of the crossing
  uniform float uDepth;   // 0..1     — monotonic progress through it
  uniform float uAspect;
  uniform vec2  uCenter;  // the hole's own position on screen, in NDC
  uniform float uRing;    // the ring's radius, in NDC-height units
  varying vec2 vUv;

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

  // a soft ring of light at radius rr
  float ring(float r, float rr, float w) {
    float d = (r - rr) / w;
    return exp(-d * d);
  }

  void main() {
    // everything is measured from the hole, not from the middle of the
    // viewport — the flight path slips past it off-center
    vec2 uv = (vUv - 0.5) * 2.0 - uCenter;
    uv.x *= uAspect;
    float r = length(uv);
    float ang = atan(uv.y, uv.x);

    // ── the photon ring sweeping outward past the viewer ──
    // the radius is handed to us: it starts on the hole's real photon ring
    // and expands from there, so the effect grows out of the hole you can
    // actually see rather than out of an arbitrary point.
    // One band for all three channels — an earlier per-channel radius split
    // pulled the ring apart into visible R/G/B bands that read as a rainbow.
    float rr = uRing;
    // a soft gaussian band with a faint wide halo breathing around it, so
    // the sweep reads as light, not as a hard drawn circle
    float w = 0.05 + rr * 0.04;
    float band = ring(r, rr, w);
    float halo = ring(r, rr, w * 3.2) * 0.28;
    vec3 ringCol = vec3(band + halo);
    // it has to fade *in* as the hole behind it fades out, or it reads as a
    // glow pasted over a hole you can still see. Kept under 1 so Bloom lifts
    // it rather than clipping the frame to white.
    ringCol *= smoothstep(0.0, 0.16, uDepth) * (1.0 - smoothstep(0.58, 0.95, uDepth)) * 0.85;

    // ── tidal streaks: light stretched along the radius ──
    // high angular frequency on purpose: at low frequency these are fat
    // wedges that read as grey smears, not as light drawn out into threads.
    // Strictly clamped to 0..1 — they sit behind the darkness and must never
    // be bright enough to wash the crush out.
    float n = vnoise(vec2(ang * 30.0, r * 1.5 - uTime * 0.8));
    n += vnoise(vec2(ang * 62.0, r * 2.6 - uTime * 1.3)) * 0.4;
    // a high threshold and a steep curve keep these sparse — a few threads,
    // not a starburst filter over the whole frame
    float streak = pow(clamp((n - 0.72) * 2.8, 0.0, 1.0), 3.0);
    // only out in the periphery, only while crossing, and gone before we
    // surface — they must not still be raking the frame on the way out
    streak *= smoothstep(0.25, 1.3, r) * uCross * 0.16;
    streak *= 1.0 - smoothstep(0.30, 0.62, uDepth);
    vec3 streakCol = vec3(0.74, 0.76, 0.84) * streak;

    // ── the color of falling in ──
    // it inherits the hole's own light — hot amber-white — and redshifts as
    // the last of it climbs away from us. No blue phase: a cool halo fights
    // the golden disk it is supposed to be emerging from.
    vec3 shift = mix(
      vec3(1.0, 0.88, 0.66),
      vec3(1.0, 0.33, 0.15),
      smoothstep(0.28, 0.95, uDepth)
    );
    vec3 col = ringCol * shift + streakCol;

    // ── the horizon closing over the rim of vision ──
    // the clear aperture shrinks toward the center as we sink in: black at
    // the rim, still open at the center, closing as uCross rises
    float aperture = mix(2.4, 0.16, uCross);
    float crush = smoothstep(aperture * 0.35, aperture, r) * uCross;

    // opaque wherever the horizon has closed OR the ring is burning; the
    // color there is black in the crush and bright on the ring, so the ring
    // rides over the darkness without being dimmed by it
    float lum = max(max(col.r, col.g), col.b);
    float alpha = clamp(lum + crush, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha * smoothstep(0.0, 0.06, uCross));
    if (gl_FragColor.a < 0.004) discard;
  }
`,Te=`
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
`,ke=`
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`,Pe=`
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
`,Ie=`
  precision highp float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.16;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.95, 0.88, 0.75, a);
  }
`,ze=`
  varying vec3 vNormal;
  varying vec3 vObj;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObj = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ae=`
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
`,J=new _(0,0,-2),Ee=new _(0,0,-248);function ce({center:a,size:r=80,warm:i=0,fade:s}){const o=p.useRef(null),n=p.useRef({x:0,y:0}),e=p.useMemo(()=>new G({vertexShader:Se,fragmentShader:je,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:a.clone()},uCamLocal:{value:new _},uFade:{value:0},uWarm:{value:i}}}),[a,i]);return P((u,t)=>{const l=o.current;if(!l)return;const{progress:c,mouse:h,reducedMotion:m,contactCollapsed:d}=R.getState();l.quaternion.copy(u.camera.quaternion),e.uniforms.uTime.value=u.clock.elapsedTime;const b=m?0:1,x=n.current;x.x=w(x.x,h.x*b,1.6,t),x.y=w(x.y,h.y*b,1.6,t),e.uniforms.uCamLocal.value.copy(u.camera.position).sub(a);const v=e.uniforms.uCamLocal.value.length();e.uniforms.uCamLocal.value.x+=x.x*v*.1,e.uniforms.uCamLocal.value.y+=-x.y*v*.07,e.uniforms.uFade.value=w(e.uniforms.uFade.value,s(c,d),4,t),l.visible=e.uniforms.uFade.value>.01}),f.jsx("mesh",{ref:o,position:a,material:e,renderOrder:5,frustumCulled:!1,children:f.jsx("planeGeometry",{args:[r,r]})})}function _e(){return f.jsx(ce,{center:J,warm:1,fade:a=>1-Z(.16,.26,a)})}function Ne(){return f.jsx(ce,{center:Ee,size:52,warm:1.2,fade:(a,r)=>Z(.16,.8,a)*(r?.3:1)})}const ae=new _;function Oe(){const a=p.useRef({p:0,fov:52,roll:0,mx:0,my:0});return P((r,i)=>{const{progress:s,mouse:o,reducedMotion:n,enterWarp:e}=R.getState(),u=r.camera,t=a.current,c=1.6-pe(s)*1;t.p=w(t.p,s,c,i);const h=Q(t.p),m=Q(Math.max(0,t.p-.02)),d=Q(Math.min(1,t.p+.02)),b={x:h.x+(d.x-m.x),y:h.y+(d.y-m.y),z:h.z+(d.z-m.z)},x=n?0:1;t.mx=w(t.mx,o.x*x,1.8,i),t.my=w(t.my,o.y*x,1.8,i),u.position.set(h.x+t.mx*.14,h.y+t.my*.09,h.z),ae.set(b.x+t.mx*.4,b.y+t.my*.26,b.z),u.lookAt(ae);const j=Z(.78,1,s)*Math.PI*2,M=ie(s)*Math.sin(r.clock.elapsedTime*.5)*.05;t.roll=w(t.roll,j+M,2.2,i),u.rotation.z+=t.roll,t.fov=w(t.fov,h.fov+e*26,2.2,i),u.rotation.z+=e*.22,Math.abs(u.fov-t.fov)>.01&&(u.fov=t.fov,u.updateProjectionMatrix())}),null}const oe=.6,K=1.1,Fe=2.598,Le=2.6,De=1.35,ne=new _,D=new _,W=new U;function Be(){const a=p.useRef(null),r=p.useMemo(()=>new G({vertexShader:Ce,fragmentShader:Re,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uCross:{value:0},uDepth:{value:0},uAspect:{value:1},uCenter:{value:new U},uRing:{value:0}}}),[]),i=p.useRef(new U),s=p.useRef({radius:0,depth:0,behind:!1});return P((o,n)=>{const e=a.current;if(!e)return;const{progress:u,reducedMotion:t}=R.getState(),l=o.camera,c=r.uniforms.uCenter.value,h=ge(u);D.copy(J).project(l);const m=D.z<1&&Number.isFinite(D.x)&&Number.isFinite(D.y),d=s.current;if(m){const M=Math.max(.001,l.position.distanceTo(J)),g=V.degToRad(l.fov*.5),O=Fe/M/Math.tan(g);d.radius=Math.min(O,De),d.depth=h,d.behind=!1}else d.behind||(d.behind=!0),d.radius=Math.min(4.5,d.radius+Math.max(0,h-d.depth)*Le),d.depth=h;m&&i.current.set(V.clamp(D.x,-K,K),V.clamp(D.y,-K,K));const b=1-Z(.02,.3,h);W.set(i.current.x*b,i.current.y*b);const x=ve(u)*(t?.35:1),v=r.uniforms.uCross.value<=.004,j=w(r.uniforms.uCross.value,x,6,n);if(r.uniforms.uCross.value=j,e.visible=j>.004,!e.visible){c.copy(W);return}v&&c.copy(W),r.uniforms.uTime.value=o.clock.elapsedTime,r.uniforms.uDepth.value=h,r.uniforms.uRing.value=d.radius,r.uniforms.uAspect.value=o.size.width/o.size.height,c.x=w(c.x,W.x,5,n),c.y=w(c.y,W.y,5,n),ne.set(0,0,-1).applyQuaternion(l.quaternion),e.position.copy(l.position).addScaledVector(ne,oe),e.quaternion.copy(l.quaternion);const S=2*oe*Math.tan(V.degToRad(l.fov*.5));e.scale.set(S*r.uniforms.uAspect.value*1.02,S*1.02,1)}),f.jsx("mesh",{ref:a,material:r,renderOrder:999,frustumCulled:!1,visible:!1,children:f.jsx("planeGeometry",{args:[1,1]})})}function F(a,r,i){const s=Math.sin(a*127.1+r*311.7+i*74.7)*43758.5453;return s-Math.floor(s)}function We(a,r,i){const s=Math.floor(a),o=Math.floor(r),n=a-s,e=r-o,u=n*n*(3-2*n),t=e*e*(3-2*e),l=F(s,o,i),c=F(s+1,o,i),h=F(s,o+1,i),m=F(s+1,o+1,i);return l+(c-l)*u+(h-l)*t+(l-c-h+m)*u*t}function y(a,r,i,s=5){let o=0,n=.5,e=1;for(let u=0;u<s;u++)o+=We(a*e,r*e,i+u*13.7)*n,n*=.5,e*=2.1;return o}function C(a,r,i){return a.clone().lerp(r,Math.min(1,Math.max(0,i)))}function He(a,r,i,s=512,o=.22){const n=s,e=s/2,u=document.createElement("canvas");u.width=n,u.height=e;const t=u.getContext("2d"),l=t.createImageData(n,e),c=new T(r.deep),h=new T(r.base),m=new T(r.high),d=new T(r.accent);for(let x=0;x<e;x++){const v=x/e,j=Math.abs(v-.5)*2;for(let S=0;S<n;S++){const M=S/n;let g;if(a==="banded"){const I=y(M*6,v*3,i,5),k=Math.sin(v*Math.PI*14+I*5+Math.sin(M*Math.PI*2)*.4);g=C(h,m,k*.5+.5),g=C(g,c,y(M*3+40,v*6,i+5,4)*.55);const A=y(M*9,v*9,i+9,4);A>.68&&(g=C(g,d,(A-.68)*2.4))}else if(a==="rocky"){const I=y(M*7,v*7,i,6);g=C(c,h,I*1.15);const k=Math.abs(y(M*12,v*12,i+3,5)-.5)*2;g=C(g,m,Math.pow(1-k,6)*.5);const A=y(M*18,v*18,i+8,3);A>.72&&(g=C(g,c,(A-.72)*2.2)),A<.2&&(g=C(g,d,(.2-A)*.9))}else if(a==="ice"){const I=y(M*5+y(M*8,v*8,i+2,4)*1.6,v*5,i,5);g=C(h,m,I),g=C(g,d,Math.pow(y(M*10,v*10,i+6,4),3)*.7),g=C(g,m,Math.pow(j,3.2)*.9),g=C(g,c,Math.pow(y(M*4,v*2,i+11,3),4)*.5)}else{const I=y(M*4,v*4,i,6),k=I>.52;g=k?C(h,m,y(M*10,v*10,i+4,4)):C(c,d,y(M*8,v*8,i+7,4)*.5),k&&I<.56&&(g=C(g,d,.4)),g=C(g,m,Math.pow(j,4)*.8);const A=y(M*6+33,v*6,i+21,5);A>.62&&(g=C(g,new T("#f5f3ee"),(A-.62)*1.6))}const O=y(M*34,v*34,i+31,3);g=C(g,c,(O-.5)*o);const z=(x*n+S)*4;l.data[z]=g.r*255,l.data[z+1]=g.g*255,l.data[z+2]=g.b*255,l.data[z+3]=255}}t.putImageData(l,0,0);const b=new B(u);return b.colorSpace=$,b.anisotropy=8,b}function Ge(a,r=256,i=!1){const s=r,o=r/2,n=document.createElement("canvas");n.width=s,n.height=o;const e=n.getContext("2d"),u=e.createImageData(s,o);for(let t=0;t<o;t++)for(let l=0;l<s;l++){const c=y(l/s*9,t/o*9,a,5),h=Math.abs(y(l/s*26,t/o*26,a+17,3)-.5)*2;let m=c*.75+(1-h)*.25;if(i){const b=Math.abs(y(l/s*52,t/o*52,a+29,3)-.5)*2;m=c*.55+(1-h)*.27+(1-b)*.18}const d=(t*s+l)*4;u.data[d]=u.data[d+1]=u.data[d+2]=m*255,u.data[d+3]=255}return e.putImageData(u,0,0),new B(n)}function qe(a,r){const s=document.createElement("canvas");s.width=256,s.height=1;const o=s.getContext("2d"),n=o.createImageData(256,1),e=new T(a);for(let t=0;t<256;t++){const l=t/256;let c=y(l*14,.5,r,4);c*=Math.sin(l*Math.PI),y(l*30,2.5,r+4,3)>.62&&(c*=.15);const h=t*4;n.data[h]=e.r*255,n.data[h+1]=e.g*255,n.data[h+2]=e.b*255,n.data[h+3]=Math.min(1,c*1.5)*210}o.putImageData(n,0,0);const u=new B(s);return u.colorSpace=$,u}function le(a){const i=document.createElement("canvas");i.width=128,i.height=128;const s=i.getContext("2d"),o=s.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),n=new T(a),e=`${n.r*255|0},${n.g*255|0},${n.b*255|0}`;return o.addColorStop(0,`rgba(${e},0.9)`),o.addColorStop(.25,`rgba(${e},0.35)`),o.addColorStop(.6,`rgba(${e},0.08)`),o.addColorStop(1,`rgba(${e},0)`),s.fillStyle=o,s.fillRect(0,0,128,128),new B(i)}function Ve(a){const i=document.createElement("canvas");i.width=512,i.height=512;const s=i.getContext("2d"),o=s.createImageData(512,512),n=new T("#ffe3ba"),e=new T("#a9c2e8"),u=new T("#3d4a63");for(let l=0;l<512;l++)for(let c=0;c<512;c++){const h=(c/512-.5)*2,m=(l/512-.5)*2,d=h,b=m*2.7,x=Math.sqrt(d*d+b*b),v=Math.atan2(b,d),j=Math.cos(2*v-Math.log(x+.06)*5.6),S=Math.pow(Math.max(0,j),1.7),M=y(c/512*7,l/512*7,a,4);let g=Math.exp(-x*6.5)*1.6+S*Math.exp(-x*2.3)*(.3+M*.55);const O=y(x*8+v*1.6,v*3.2,a+5,3);g*=1-Math.max(0,Math.min(1,(O-.6)*3))*.5*Math.min(1,x*3);let z=C(n,e,Math.min(1,x*2.4));z=C(z,u,Math.max(0,x-.55)*1.4);const I=Math.min(1,g)*Math.max(0,Math.min(1,(1-x)*2.2)),k=(l*512+c)*4;o.data[k]=z.r*255,o.data[k+1]=z.g*255,o.data[k+2]=z.b*255,o.data[k+3]=I*235}s.putImageData(o,0,0);for(let l=0;l<240;l++){const c=F(l,7,a)*Math.PI*2,h=Math.pow(F(l,13,a),.6)*.46,m=(.5+Math.cos(c)*h)*512,d=(.5+Math.sin(c)*h/2.7)*512,b=.25+F(l,29,a)*.6;s.fillStyle=`rgba(235,240,250,${b})`,s.fillRect(m,d,1,1)}const t=new B(i);return t.colorSpace=$,t}function Ke(a,r,i){const o=document.createElement("canvas");o.width=256,o.height=256;const n=o.getContext("2d"),e=n.createImageData(256,256),u=new T(a),t=new T(r);for(let c=0;c<256;c++)for(let h=0;h<256;h++){const m=h/256,d=c/256,b=m-.5,x=d-.5,v=Math.sqrt(b*b+x*x)*2,j=y(m*4+y(m*7,d*7,i+3,4)*1.4,d*4,i,5),S=Math.max(0,j-.32)*Math.max(0,1-v)*1.4,M=C(u,t,v+(j-.5)*.6),g=(c*256+h)*4;e.data[g]=M.r*255,e.data[g+1]=M.g*255,e.data[g+2]=M.b*255,e.data[g+3]=Math.min(1,S)*165}n.putImageData(e,0,0);const l=new B(o);return l.colorSpace=$,l}function Ue(a,r,i=96){const s=new we(a,r,i),o=s.attributes.position,n=s.attributes.uv,e=new _;for(let u=0;u<o.count;u++)e.fromBufferAttribute(o,u),n.setXY(u,(e.length()-a)/(r-a),.5);return s}const re=[{style:"ice",deep:"#2a3138",base:"#8d99a6",high:"#e8edf2",accent:"#aebfcc"},{style:"banded",deep:"#4a3628",base:"#a08466",high:"#d9c8ae",accent:"#e0a878"},{style:"terra",deep:"#1d2b33",base:"#5d7263",high:"#b8c4b0",accent:"#48626e"},{style:"rocky",deep:"#26221f",base:"#7d7268",high:"#c9beb2",accent:"#93826f"},{style:"banded",deep:"#2c2338",base:"#7a6a96",high:"#cfc2e8",accent:"#a98fd6"}];function Ze({index:a}){const r=Y[a],i=re[a%re.length],s=p.useRef(null),o=p.useRef(null),n=p.useRef(null),e=p.useRef(null),u=p.useRef(null),t=p.useRef(0),{map:l,bump:c,glowTex:h,ringTex:m}=p.useMemo(()=>({map:He(i.style,i,40+a*17,768,.4),bump:Ge(40+a*17,512,!0),glowTex:le(r.emissive),ringTex:i.style==="banded"?qe("#cdbfa8",8+a):null}),[a,i,r.emissive]),d=p.useMemo(()=>m?Ue(r.radius*1.45,r.radius*2.35):null,[m,r.radius]),b=a/Y.length*Math.PI*2+.7;P((v,j)=>{const S=v.clock.elapsedTime,{hoveredPlanet:M,galaxySpin:g,reducedMotion:O}=R.getState(),z=s.current,I=o.current;if(!z||!I)return;const k=O?b:S*r.speed+b+g;if(z.position.set(Math.cos(k)*r.orbit,Math.sin(k*.9)*.6,Math.sin(k)*r.orbit),!O){I.rotation.y=S*.1+a;const te=u.current;te&&(te.rotation.y=S*(.35+a*.06))}const A=M===a?1:0;t.current=w(t.current,A,6,j);const ue=1+t.current*.13;I.scale.setScalar(ue);const X=e.current;X&&(X.material.opacity=.16+t.current*.4,X.scale.setScalar(r.radius*(4.6+t.current*1.6)));const ee=n.current?.material;ee&&(ee.emissiveIntensity=.46+t.current*.5)});const x=R(v=>v.setHoveredPlanet);return f.jsxs("group",{ref:s,children:[f.jsxs("group",{ref:o,rotation:[r.tilt,0,r.tilt*.6],children:[f.jsxs("mesh",{ref:n,onPointerOver:v=>{v.stopPropagation(),x(a)},onPointerOut:()=>x(null),children:[f.jsx("sphereGeometry",{args:[r.radius,80,56]}),f.jsx("meshStandardMaterial",{map:l,bumpMap:c,bumpScale:1.5,roughnessMap:c,emissive:"#ffffff",emissiveMap:l,emissiveIntensity:.46,roughness:1,metalness:0})]}),d&&m&&f.jsx("mesh",{geometry:d,rotation:[Math.PI/2.25,0,0],children:f.jsx("meshBasicMaterial",{map:m,transparent:!0,side:ye,depthWrite:!1,opacity:.85})}),f.jsx("group",{ref:u,children:r.tools.map((v,j)=>{const S=j/r.tools.length*Math.PI*2,M=r.radius*(1.9+j*.34);return f.jsxs("mesh",{position:[Math.cos(S)*M,Math.sin(S*2.3)*.22,Math.sin(S)*M],children:[f.jsx("sphereGeometry",{args:[.05+r.radius*.04,10,8]}),f.jsx("meshBasicMaterial",{color:r.emissive})]},v)})})]}),f.jsx("sprite",{ref:e,scale:r.radius*4.6,children:f.jsx("spriteMaterial",{map:h,transparent:!0,depthWrite:!1,opacity:.16,blending:N,fog:!1})})]})}function $e(){const a=p.useRef(null);return P((r,i)=>{const s=a.current;if(!s)return;const{mouse:o,reducedMotion:n,progress:e,birth:u}=R.getState();if(n)return;s.rotation.x=w(s.rotation.x,.34-o.y*.05,1.2,i),s.rotation.z=w(s.rotation.z,-.1+o.x*.04,1.2,i);const t=L(e);s.position.set(0,-1.4*(1-t),-96+-152*t),s.scale.setScalar(Math.max(.02,u*(1-t))),s.rotation.y+=i*t*1.6}),f.jsxs("group",{ref:a,position:[0,-1.4,-96],rotation:[.34,0,-.1],children:[f.jsxs("mesh",{children:[f.jsx("sphereGeometry",{args:[.5,24,16]}),f.jsx("meshBasicMaterial",{color:"#f5f3ee"})]}),f.jsx("pointLight",{color:"#fff4e0",intensity:26,distance:30,decay:2}),Y.map((r,i)=>f.jsx(Ze,{index:i},i))]})}const H=new _(-19,3,-40),Xe=[{name:"Venus",style:"banded",palette:{deep:"#9a7539",base:"#c9a05f",high:"#efe0b8",accent:"#e2c48c"},atmosphere:"#e8d6a4",orbit:5.5,radius:1.15,speed:.055,phase:.6,seed:57,spin:-.02},{name:"Earth",style:"terra",palette:{deep:"#0a3060",base:"#3f6339",high:"#e9eef2",accent:"#2a6b8f"},atmosphere:"#5da6ff",orbit:11,radius:1.25,speed:.034,phase:2.8,seed:23,spin:.09},{name:"Neptune",style:"banded",palette:{deep:"#16307c",base:"#2a52c6",high:"#7fa6ee",accent:"#4a76e0"},atmosphere:"#4a7cff",orbit:19,radius:2.1,speed:.02,phase:4.6,seed:91,spin:.06}],se=13.8,Qe=16;function Ye({count:a=850}){const r=p.useRef(null),{geometry:i,material:s,transforms:o}=p.useMemo(()=>{const e=new xe(1,0),u=new be({color:"#8d8478",emissive:"#5c554b",emissiveIntensity:.36,roughness:1,metalness:0,flatShading:!0}),t=Array.from({length:a},()=>({angle:Math.random()*Math.PI*2,radius:se+Math.random()*(Qe-se),y:(Math.random()-.5)*.7,scale:.055+Math.pow(Math.random(),2.2)*.19,speed:.02+Math.random()*.012,tumble:Math.random()*Math.PI*2,tumbleSpeed:(Math.random()-.5)*1.4}));return{geometry:e,material:u,transforms:t}},[a]),n=p.useMemo(()=>new Me,[]);return P(e=>{const u=r.current;if(!u)return;const{reducedMotion:t}=R.getState(),l=t?0:e.clock.elapsedTime;for(let c=0;c<o.length;c++){const h=o[c],m=h.angle+l*h.speed;n.position.set(Math.cos(m)*h.radius,h.y,Math.sin(m)*h.radius),n.rotation.set(h.tumble+l*h.tumbleSpeed,h.tumble*2,h.tumble*3),n.scale.setScalar(h.scale),n.updateMatrix(),u.setMatrixAt(c,n.matrix)}u.instanceMatrix.needsUpdate=!0}),f.jsx("instancedMesh",{ref:r,args:[i,s,a],frustumCulled:!1})}function Je(){const a=p.useRef(null),r=p.useRef([]),i=p.useMemo(()=>new G({vertexShader:ze,fragmentShader:Ae,uniforms:{uTime:{value:0}}}),[]);return P((s,o)=>{const n=a.current;if(!n)return;const{mouse:e,reducedMotion:u,progress:t,birth:l}=R.getState(),c=s.clock.elapsedTime;if(i.uniforms.uTime.value=c,Xe.forEach((m,d)=>{const b=r.current[d];if(!b)return;const x=u?m.phase:c*m.speed+m.phase;b.position.set(Math.cos(x)*m.orbit,0,Math.sin(x)*m.orbit),u||(b.children[0].rotation.y=c*m.spin)}),u)return;n.rotation.y=w(n.rotation.y,e.x*.01,1,o);const h=L(t);n.position.set(H.x*(1-h),H.y*(1-h),H.z+(-248-H.z)*h),n.scale.setScalar(Math.max(.02,l*(1-h))),n.rotation.y+=o*h*1.2}),f.jsx("group",{ref:a,position:H,scale:.02,children:f.jsxs("group",{rotation:[.42,0,.1],children:[f.jsx("pointLight",{color:"#ffedd2",intensity:90,distance:70,decay:2}),f.jsx(Ye,{})]})})}const et=new T("#ffffff"),tt=new T("#f2ede4"),at=new T("#e3e8f2");function ot({count:a=3800}){const r=p.useRef(null),{geometry:i,material:s}=p.useMemo(()=>{const o=new Float32Array(a*3),n=new Float32Array(a),e=new Float32Array(a),u=new Float32Array(a*3),t=new T,l=.35,c=.4;for(let d=0;d<a;d++){const b=Math.random()<c;let x;if(b){const S=(Math.random()+Math.random()+Math.random()-1.5)*.3;x=l+S}else x=Math.random()*Math.PI*2;const v=10+Math.pow(Math.random(),.6)*130;o[d*3]=Math.cos(x)*v,o[d*3+1]=Math.sin(x)*v*.75,o[d*3+2]=60-Math.random()*400,n[d]=b?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,e[d]=Math.random();const j=Math.random();t.copy(j>.94?tt:j>.86?at:et),u[d*3]=t.r,u[d*3+1]=t.g,u[d*3+2]=t.b}const h=new q;h.setAttribute("position",new E(o,3)),h.setAttribute("aSize",new E(n,1)),h.setAttribute("aPhase",new E(e,1)),h.setAttribute("aColor",new E(u,3));const m=new G({vertexShader:Te,fragmentShader:ke,transparent:!0,depthWrite:!1,blending:N,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:h,material:m}},[a]);return P((o,n)=>{s.uniforms.uTime.value=o.clock.elapsedTime;const e=r.current;if(!e)return;const{mouse:u,reducedMotion:t,progress:l,birth:c}=R.getState();s.uniforms.uSwallow.value=t?0:L(l),s.uniforms.uBirth.value=t?1:c,!t&&(e.rotation.y=w(e.rotation.y,u.x*.016,1.3,n),e.rotation.x=w(e.rotation.x,-u.y*.011,1.3,n))}),f.jsx("group",{ref:r,children:f.jsx("points",{geometry:i,material:s,frustumCulled:!1})})}function nt({count:a=900}){const{geometry:r,material:i}=p.useMemo(()=>{const s=new Float32Array(a*3),o=new Float32Array(a),n=new Float32Array(a);for(let t=0;t<a;t++){const l=Math.random()*Math.PI*2,c=1.5+Math.pow(Math.random(),.7)*13;s[t*3]=Math.cos(l)*c,s[t*3+1]=Math.sin(l)*c*.7,s[t*3+2]=30-Math.random()*300,o[t]=.5+Math.pow(Math.random(),2)*1.6,n[t]=Math.random()}const e=new q;e.setAttribute("position",new E(s,3)),e.setAttribute("aSize",new E(o,1)),e.setAttribute("aPhase",new E(n,1));const u=new G({vertexShader:Pe,fragmentShader:Ie,transparent:!0,depthWrite:!1,blending:N,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMouse:{value:new U},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:e,material:u}},[a]);return P((s,o)=>{i.uniforms.uTime.value=s.clock.elapsedTime;const{mouse:n,reducedMotion:e,progress:u,birth:t}=R.getState();i.uniforms.uSwallow.value=e?0:L(u),i.uniforms.uBirth.value=e?1:t;const l=i.uniforms.uMouse.value,c=e?0:1;l.x=w(l.x,n.x*c,1.8,o),l.y=w(l.y,-n.y*c,1.8,o)}),f.jsx("points",{geometry:r,material:i,frustumCulled:!1})}function rt({count:a=320}){const r=p.useRef(null),i=p.useRef(0),s=p.useMemo(()=>{const o=new Float32Array(a*6);for(let e=0;e<a;e++){const u=Math.random()*Math.PI*2,t=3+Math.random()*15,l=Math.cos(u)*t,c=Math.sin(u)*t*.8,h=30-Math.random()*290,m=1.6+Math.random()*4.5;o.set([l,c,h,l,c,h-m],e*6)}const n=new q;return n.setAttribute("position",new E(o,3)),n},[a]);return P((o,n)=>{const e=r.current;if(!e)return;const{velocity:u,reducedMotion:t,enterWarp:l}=R.getState(),c=t?0:Math.min(1,Math.abs(u)*1.4+l);i.current=w(i.current,c,4,n),e.opacity=i.current*.34}),f.jsx("lineSegments",{geometry:s,frustumCulled:!1,children:f.jsx("lineBasicMaterial",{ref:r,color:"#dfe6f2",transparent:!0,opacity:0,blending:N,depthWrite:!1})})}function st({count:a=240}){const r=p.useRef(null),i=p.useMemo(()=>{const s=new Float32Array(a*6);for(let n=0;n<a;n++){const e=Math.random()*Math.PI*2,u=2.5+Math.random()*9,t=Math.cos(e)*u,l=Math.sin(e)*u,c=-128-Math.random()*150,h=5+Math.random()*13;s.set([t,l,c,t,l,c-h],n*6)}const o=new q;return o.setAttribute("position",new E(s,3)),o},[a]);return P((s,o)=>{const n=r.current;if(!n)return;const{progress:e}=R.getState();n.opacity=w(n.opacity,ie(e)*.75,5,o)}),f.jsx("lineSegments",{geometry:i,frustumCulled:!1,children:f.jsx("lineBasicMaterial",{ref:r,color:"#ffffff",transparent:!0,opacity:0,blending:N,depthWrite:!1})})}function it(){const a=p.useRef(null),r=p.useMemo(()=>[{inner:"#b9a8d8",outer:"#171226",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#8fb8b4",outer:"#0e1a1a",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27},{inner:"#c9a68a",outer:"#1c1410",pos:[-40,-34,-180],scale:85,seed:35},{inner:"#a3aed0",outer:"#12141f",pos:[30,40,-100],scale:75,seed:43}].map(s=>({...s,tex:Ke(s.inner,s.outer,s.seed)})),[]);return P((i,s)=>{const o=a.current;if(!o)return;const{mouse:n,reducedMotion:e,progress:u}=R.getState();if(e)return;o.rotation.y=w(o.rotation.y,n.x*.006,.8,s),o.rotation.x=w(o.rotation.x,-n.y*.004,.8,s);const{birth:t}=R.getState(),l=L(u);o.children.forEach((c,h)=>{c.rotation.z+=s*(.004+l*.12)*(h%2?1:-1);const m=r[h];m&&(c.position.set(m.pos[0]*(1-l),m.pos[1]*(1-l),m.pos[2]+(-248-m.pos[2])*l),c.scale.setScalar(m.scale*(1-l*.92)),c.material.opacity=.34*t*(1-l))})}),f.jsx("group",{ref:a,children:r.map((i,s)=>f.jsx("sprite",{position:i.pos,scale:i.scale,children:f.jsx("spriteMaterial",{map:i.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:N,fog:!1})},s))})}const ct=[{pos:[88,40,-205],scale:[120,68],seed:7,rot0:-.5,spin:.0045,opacity:.55},{pos:[-95,18,-110],scale:[88,50],seed:13,rot0:.7,spin:-.003,opacity:.42},{pos:[96,-14,-160],scale:[76,42],seed:21,rot0:2.1,spin:.0035,opacity:.4}];function lt({spec:a}){const r=p.useRef(null),i=p.useMemo(()=>Ve(a.seed),[a.seed]);return P((s,o)=>{const n=r.current;if(!n)return;const{progress:e,birth:u,reducedMotion:t}=R.getState(),l=n.material;if(t){l.opacity=a.opacity;return}l.rotation+=o*a.spin;const c=L(e);n.position.set(a.pos[0]*(1-c),a.pos[1]*(1-c),a.pos[2]+(-248-a.pos[2])*c);const h=Math.max(.02,1-c*.96);n.scale.set(a.scale[0]*h,a.scale[1]*h,1),l.opacity=a.opacity*u*(1-c)}),f.jsx("sprite",{ref:r,position:a.pos,scale:[a.scale[0],a.scale[1],1],children:f.jsx("spriteMaterial",{map:i,transparent:!0,depthWrite:!1,opacity:0,rotation:a.rot0,blending:N,fog:!1})})}function ut(){return f.jsx(f.Fragment,{children:ct.map((a,r)=>f.jsx(lt,{spec:a},r))})}function ht({count:a=1600}){const r=p.useRef(null),i=p.useRef(null),s=p.useMemo(()=>{const o=new Float32Array(a*3);for(let e=0;e<a;e++){const u=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),l=170+Math.random()*160;o[e*3]=Math.sin(t)*Math.cos(u)*l,o[e*3+1]=Math.sin(t)*Math.sin(u)*l*.7,o[e*3+2]=-140+Math.cos(t)*l}const n=new q;return n.setAttribute("position",new E(o,3)),n},[a]);return P((o,n)=>{const e=r.current,u=i.current;if(!e||!u)return;const{progress:t,birth:l,reducedMotion:c}=R.getState();if(c){u.opacity=.4;return}e.rotation.y+=n*.0016;const h=L(t);u.opacity=.4*l*(1-h),e.scale.setScalar(Math.max(.05,1-h*.94)),e.position.z=-248*h*.7}),f.jsx("group",{ref:r,children:f.jsx("points",{geometry:s,frustumCulled:!1,children:f.jsx("pointsMaterial",{ref:i,size:.55,sizeAttenuation:!0,color:"#7d8595",transparent:!0,opacity:0,depthWrite:!1,blending:N,fog:!1})})})}function ft(){const a=p.useRef([]),r=p.useRef(Array.from({length:3},(s,o)=>({t:-3-o*4,dur:1.4,from:new _,dir:new _}))),i=p.useMemo(()=>le("#f5f3ee"),[]);return P((s,o)=>{const{reducedMotion:n,progress:e}=R.getState(),u=s.camera.position.z;r.current.forEach((t,l)=>{const c=a.current[l];if(!c)return;if(n||e>.86){c.visible=!1;return}if(t.t+=o,t.t>t.dur){t.t=-(2+Math.random()*6),t.dur=1.1+Math.random()*.9;const d=Math.random()>.5?1:-1;t.from.set(d*(18+Math.random()*30),8+Math.random()*18,u-50-Math.random()*60),t.dir.set(-d*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/t.dur)}if(t.t<0){c.visible=!1;return}const h=t.t/t.dur;c.visible=!0,c.position.copy(t.from).addScaledVector(t.dir,t.t);const m=c.children[0].material;m.opacity=Math.sin(h*Math.PI)*.9})}),f.jsx(f.Fragment,{children:r.current.map((s,o)=>f.jsx("group",{ref:n=>{a.current[o]=n},visible:!1,children:f.jsx("sprite",{scale:[7,.35,1],children:f.jsx("spriteMaterial",{map:i,transparent:!0,depthWrite:!1,opacity:0,blending:N,rotation:-.45,fog:!1})})},o))})}function yt(){const a=R(c=>c.reducedMotion),[r,i]=p.useState(!1);p.useEffect(()=>{const c=window.matchMedia("(max-width: 768px)"),h=()=>i(c.matches);return h(),c.addEventListener("change",h),()=>c.removeEventListener("change",h)},[]);const s=R(c=>c.graphicsQuality),o=s==="auto"?r?"medium":"high":s,n=o==="low",e=o==="medium",u=n?r?350:600:e?r?500:1200:r?800:2e3,t=n?[1,1]:e?[1,1.1]:r?[1,1.2]:[1,1.25],l=!a&&!r&&!n;return f.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:f.jsxs(he,{dpr:t,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1,stencil:!1,depth:!0},camera:{position:[0,.8,15],fov:52,near:.1,far:500},style:{background:"#000000"},children:[f.jsx("color",{attach:"background",args:["#000000"]}),f.jsx("fog",{attach:"fog",args:["#000000",60,240]}),f.jsx("ambientLight",{intensity:.1}),f.jsx("directionalLight",{position:[18,26,10],intensity:.85,color:"#f2ecdf"}),f.jsxs(p.Suspense,{fallback:null,children:[f.jsx(Oe,{}),f.jsx(ht,{count:n?150:e?350:r?400:800}),f.jsx(ut,{}),f.jsx(it,{}),f.jsx(ot,{count:u}),f.jsx(nt,{count:n?80:e?200:r?180:400}),f.jsx(rt,{count:n?30:e||r?80:160}),f.jsx(Je,{}),f.jsx($e,{}),!r&&!n&&f.jsx(ft,{}),f.jsx(_e,{}),f.jsxs("group",{position:[0,1.2,-122],children:[f.jsxs("mesh",{children:[f.jsx("sphereGeometry",{args:[.9,24,24]}),f.jsx("meshBasicMaterial",{color:"#ffffff"})]}),f.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),f.jsx(st,{}),f.jsx(Ne,{}),f.jsx(Be,{})]}),l&&f.jsxs(fe,{multisampling:0,children:[f.jsx(me,{intensity:e?.45:.65,luminanceThreshold:e?.62:.58,luminanceSmoothing:.8}),f.jsx(de,{eskil:!1,offset:.2,darkness:.85})]})]})})}export{yt as default};
