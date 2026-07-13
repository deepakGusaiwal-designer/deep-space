import{j as f,r as d,u as P,C as he,d as fe,w as me,A as pe,q as de}from"./r3f-DxVe7tNe.js";import{u as R,d as J}from"./main-jLqJkFKT.js";import{s as Z,d as w,a as Y,w as ie,b as ge,h as ve,c as xe,e as D}from"./flightPath-BCN_dqRw.js";import{i as _,g as G,j as U,an as V,f as T,ao as B,d as $,ap as be,aq as Me,ar as ye,v as we,Y as N,ac as Se,B as q,J as E}from"./three-pD7YUweP.js";import"./modulepreload-polyfill-B5Qt9EMX.js";import"./motion-CCJw2fmH.js";import"./gsap-xgxdCp6f.js";const je=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,Ce=`
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
`,Re=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Te=`
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
`,ke=`
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
`,Pe=`
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`,Ie=`
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
`,ze=`
  precision highp float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.16;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.95, 0.88, 0.75, a);
  }
`,Ae=`
  varying vec3 vNormal;
  varying vec3 vObj;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObj = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ee=`
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
`,Q=new _(0,0,-2),_e=new _(0,0,-248);function ce({center:e,size:r=80,warm:i=0,fade:s}){const o=d.useRef(null),n=d.useRef({x:0,y:0}),a=d.useMemo(()=>new G({vertexShader:je,fragmentShader:Ce,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:e.clone()},uCamLocal:{value:new _},uFade:{value:0},uWarm:{value:i}}}),[e,i]);return P((l,t)=>{const c=o.current;if(!c)return;const{progress:u,mouse:h,reducedMotion:m,contactCollapsed:p}=R.getState();c.quaternion.copy(l.camera.quaternion),a.uniforms.uTime.value=l.clock.elapsedTime;const b=m?0:1,x=n.current;x.x=w(x.x,h.x*b,1.6,t),x.y=w(x.y,h.y*b,1.6,t),a.uniforms.uCamLocal.value.copy(l.camera.position).sub(e);const v=a.uniforms.uCamLocal.value.length();a.uniforms.uCamLocal.value.x+=x.x*v*.1,a.uniforms.uCamLocal.value.y+=-x.y*v*.07,a.uniforms.uFade.value=w(a.uniforms.uFade.value,s(u,p),4,t),c.visible=a.uniforms.uFade.value>.01}),f.jsx("mesh",{ref:o,position:e,material:a,renderOrder:5,frustumCulled:!1,children:f.jsx("planeGeometry",{args:[r,r]})})}function Ne(){return f.jsx(ce,{center:Q,warm:1,fade:e=>1-Z(.16,.26,e)})}function Oe(){return f.jsx(ce,{center:_e,size:52,warm:1.2,fade:(e,r)=>Z(.16,.8,e)*(r?.3:1)})}const ae=new _;function Fe(){const e=d.useRef({p:0,fov:52,roll:0,mx:0,my:0});return P((r,i)=>{const{progress:s,mouse:o,reducedMotion:n,enterWarp:a}=R.getState(),l=r.camera,t=e.current,u=1.6-ge(s)*1;t.p=w(t.p,s,u,i);const h=Y(t.p),m=Y(Math.max(0,t.p-.02)),p=Y(Math.min(1,t.p+.02)),b={x:h.x+(p.x-m.x),y:h.y+(p.y-m.y),z:h.z+(p.z-m.z)},x=n?0:1;t.mx=w(t.mx,o.x*x,1.8,i),t.my=w(t.my,o.y*x,1.8,i),l.position.set(h.x+t.mx*.14,h.y+t.my*.09,h.z),ae.set(b.x+t.mx*.4,b.y+t.my*.26,b.z),l.lookAt(ae);const j=Z(.78,1,s)*Math.PI*2,M=ie(s)*Math.sin(r.clock.elapsedTime*.5)*.05;t.roll=w(t.roll,j+M,2.2,i),l.rotation.z+=t.roll,t.fov=w(t.fov,h.fov+a*26,2.2,i),l.rotation.z+=a*.22,Math.abs(l.fov-t.fov)>.01&&(l.fov=t.fov,l.updateProjectionMatrix())}),null}const oe=.6,K=1.1,De=2.598,Le=2.6,Be=1.35,ne=new _,L=new _,W=new U;function We(){const e=d.useRef(null),r=d.useMemo(()=>new G({vertexShader:Re,fragmentShader:Te,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uCross:{value:0},uDepth:{value:0},uAspect:{value:1},uCenter:{value:new U},uRing:{value:0}}}),[]),i=d.useRef(new U),s=d.useRef({radius:0,depth:0,behind:!1});return P((o,n)=>{const a=e.current;if(!a)return;const{progress:l,reducedMotion:t}=R.getState(),c=o.camera,u=r.uniforms.uCenter.value,h=ve(l);L.copy(Q).project(c);const m=L.z<1&&Number.isFinite(L.x)&&Number.isFinite(L.y),p=s.current;if(m){const M=Math.max(.001,c.position.distanceTo(Q)),g=V.degToRad(c.fov*.5),O=De/M/Math.tan(g);p.radius=Math.min(O,Be),p.depth=h,p.behind=!1}else p.behind||(p.behind=!0),p.radius=Math.min(4.5,p.radius+Math.max(0,h-p.depth)*Le),p.depth=h;m&&i.current.set(V.clamp(L.x,-K,K),V.clamp(L.y,-K,K));const b=1-Z(.02,.3,h);W.set(i.current.x*b,i.current.y*b);const x=xe(l)*(t?.35:1),v=r.uniforms.uCross.value<=.004,j=w(r.uniforms.uCross.value,x,6,n);if(r.uniforms.uCross.value=j,a.visible=j>.004,!a.visible){u.copy(W);return}v&&u.copy(W),r.uniforms.uTime.value=o.clock.elapsedTime,r.uniforms.uDepth.value=h,r.uniforms.uRing.value=p.radius,r.uniforms.uAspect.value=o.size.width/o.size.height,u.x=w(u.x,W.x,5,n),u.y=w(u.y,W.y,5,n),ne.set(0,0,-1).applyQuaternion(c.quaternion),a.position.copy(c.position).addScaledVector(ne,oe),a.quaternion.copy(c.quaternion);const S=2*oe*Math.tan(V.degToRad(c.fov*.5));a.scale.set(S*r.uniforms.uAspect.value*1.02,S*1.02,1)}),f.jsx("mesh",{ref:e,material:r,renderOrder:999,frustumCulled:!1,visible:!1,children:f.jsx("planeGeometry",{args:[1,1]})})}function F(e,r,i){const s=Math.sin(e*127.1+r*311.7+i*74.7)*43758.5453;return s-Math.floor(s)}function He(e,r,i){const s=Math.floor(e),o=Math.floor(r),n=e-s,a=r-o,l=n*n*(3-2*n),t=a*a*(3-2*a),c=F(s,o,i),u=F(s+1,o,i),h=F(s,o+1,i),m=F(s+1,o+1,i);return c+(u-c)*l+(h-c)*t+(c-u-h+m)*l*t}function y(e,r,i,s=5){let o=0,n=.5,a=1;for(let l=0;l<s;l++)o+=He(e*a,r*a,i+l*13.7)*n,n*=.5,a*=2.1;return o}function C(e,r,i){return e.clone().lerp(r,Math.min(1,Math.max(0,i)))}function Ge(e,r,i,s=512,o=.22){const n=s,a=s/2,l=document.createElement("canvas");l.width=n,l.height=a;const t=l.getContext("2d"),c=t.createImageData(n,a),u=new T(r.deep),h=new T(r.base),m=new T(r.high),p=new T(r.accent);for(let x=0;x<a;x++){const v=x/a,j=Math.abs(v-.5)*2;for(let S=0;S<n;S++){const M=S/n;let g;if(e==="banded"){const I=y(M*6,v*3,i,5),k=Math.sin(v*Math.PI*14+I*5+Math.sin(M*Math.PI*2)*.4);g=C(h,m,k*.5+.5),g=C(g,u,y(M*3+40,v*6,i+5,4)*.55);const A=y(M*9,v*9,i+9,4);A>.68&&(g=C(g,p,(A-.68)*2.4))}else if(e==="rocky"){const I=y(M*7,v*7,i,6);g=C(u,h,I*1.15);const k=Math.abs(y(M*12,v*12,i+3,5)-.5)*2;g=C(g,m,Math.pow(1-k,6)*.5);const A=y(M*18,v*18,i+8,3);A>.72&&(g=C(g,u,(A-.72)*2.2)),A<.2&&(g=C(g,p,(.2-A)*.9))}else if(e==="ice"){const I=y(M*5+y(M*8,v*8,i+2,4)*1.6,v*5,i,5);g=C(h,m,I),g=C(g,p,Math.pow(y(M*10,v*10,i+6,4),3)*.7),g=C(g,m,Math.pow(j,3.2)*.9),g=C(g,u,Math.pow(y(M*4,v*2,i+11,3),4)*.5)}else{const I=y(M*4,v*4,i,6),k=I>.52;g=k?C(h,m,y(M*10,v*10,i+4,4)):C(u,p,y(M*8,v*8,i+7,4)*.5),k&&I<.56&&(g=C(g,p,.4)),g=C(g,m,Math.pow(j,4)*.8);const A=y(M*6+33,v*6,i+21,5);A>.62&&(g=C(g,new T("#f5f3ee"),(A-.62)*1.6))}const O=y(M*34,v*34,i+31,3);g=C(g,u,(O-.5)*o);const z=(x*n+S)*4;c.data[z]=g.r*255,c.data[z+1]=g.g*255,c.data[z+2]=g.b*255,c.data[z+3]=255}}t.putImageData(c,0,0);const b=new B(l);return b.colorSpace=$,b.anisotropy=8,b}function qe(e,r=256,i=!1){const s=r,o=r/2,n=document.createElement("canvas");n.width=s,n.height=o;const a=n.getContext("2d"),l=a.createImageData(s,o);for(let t=0;t<o;t++)for(let c=0;c<s;c++){const u=y(c/s*9,t/o*9,e,5),h=Math.abs(y(c/s*26,t/o*26,e+17,3)-.5)*2;let m=u*.75+(1-h)*.25;if(i){const b=Math.abs(y(c/s*52,t/o*52,e+29,3)-.5)*2;m=u*.55+(1-h)*.27+(1-b)*.18}const p=(t*s+c)*4;l.data[p]=l.data[p+1]=l.data[p+2]=m*255,l.data[p+3]=255}return a.putImageData(l,0,0),new B(n)}function Ve(e,r){const s=document.createElement("canvas");s.width=256,s.height=1;const o=s.getContext("2d"),n=o.createImageData(256,1),a=new T(e);for(let t=0;t<256;t++){const c=t/256;let u=y(c*14,.5,r,4);u*=Math.sin(c*Math.PI),y(c*30,2.5,r+4,3)>.62&&(u*=.15);const h=t*4;n.data[h]=a.r*255,n.data[h+1]=a.g*255,n.data[h+2]=a.b*255,n.data[h+3]=Math.min(1,u*1.5)*210}o.putImageData(n,0,0);const l=new B(s);return l.colorSpace=$,l}function le(e){const i=document.createElement("canvas");i.width=128,i.height=128;const s=i.getContext("2d"),o=s.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),n=new T(e),a=`${n.r*255|0},${n.g*255|0},${n.b*255|0}`;return o.addColorStop(0,`rgba(${a},0.9)`),o.addColorStop(.25,`rgba(${a},0.35)`),o.addColorStop(.6,`rgba(${a},0.08)`),o.addColorStop(1,`rgba(${a},0)`),s.fillStyle=o,s.fillRect(0,0,128,128),new B(i)}function Ke(e){const i=document.createElement("canvas");i.width=512,i.height=512;const s=i.getContext("2d"),o=s.createImageData(512,512),n=new T("#ffe3ba"),a=new T("#a9c2e8"),l=new T("#3d4a63");for(let c=0;c<512;c++)for(let u=0;u<512;u++){const h=(u/512-.5)*2,m=(c/512-.5)*2,p=h,b=m*2.7,x=Math.sqrt(p*p+b*b),v=Math.atan2(b,p),j=Math.cos(2*v-Math.log(x+.06)*5.6),S=Math.pow(Math.max(0,j),1.7),M=y(u/512*7,c/512*7,e,4);let g=Math.exp(-x*6.5)*1.6+S*Math.exp(-x*2.3)*(.3+M*.55);const O=y(x*8+v*1.6,v*3.2,e+5,3);g*=1-Math.max(0,Math.min(1,(O-.6)*3))*.5*Math.min(1,x*3);let z=C(n,a,Math.min(1,x*2.4));z=C(z,l,Math.max(0,x-.55)*1.4);const I=Math.min(1,g)*Math.max(0,Math.min(1,(1-x)*2.2)),k=(c*512+u)*4;o.data[k]=z.r*255,o.data[k+1]=z.g*255,o.data[k+2]=z.b*255,o.data[k+3]=I*235}s.putImageData(o,0,0);for(let c=0;c<240;c++){const u=F(c,7,e)*Math.PI*2,h=Math.pow(F(c,13,e),.6)*.46,m=(.5+Math.cos(u)*h)*512,p=(.5+Math.sin(u)*h/2.7)*512,b=.25+F(c,29,e)*.6;s.fillStyle=`rgba(235,240,250,${b})`,s.fillRect(m,p,1,1)}const t=new B(i);return t.colorSpace=$,t}function Ue(e,r,i){const o=document.createElement("canvas");o.width=256,o.height=256;const n=o.getContext("2d"),a=n.createImageData(256,256),l=new T(e),t=new T(r);for(let u=0;u<256;u++)for(let h=0;h<256;h++){const m=h/256,p=u/256,b=m-.5,x=p-.5,v=Math.sqrt(b*b+x*x)*2,j=y(m*4+y(m*7,p*7,i+3,4)*1.4,p*4,i,5),S=Math.max(0,j-.32)*Math.max(0,1-v)*1.4,M=C(l,t,v+(j-.5)*.6),g=(u*256+h)*4;a.data[g]=M.r*255,a.data[g+1]=M.g*255,a.data[g+2]=M.b*255,a.data[g+3]=Math.min(1,S)*165}n.putImageData(a,0,0);const c=new B(o);return c.colorSpace=$,c}function Ze(e,r,i=96){const s=new Se(e,r,i),o=s.attributes.position,n=s.attributes.uv,a=new _;for(let l=0;l<o.count;l++)a.fromBufferAttribute(o,l),n.setXY(l,(a.length()-e)/(r-e),.5);return s}const re=[{style:"ice",deep:"#2a3138",base:"#8d99a6",high:"#e8edf2",accent:"#aebfcc"},{style:"banded",deep:"#4a3628",base:"#a08466",high:"#d9c8ae",accent:"#e0a878"},{style:"terra",deep:"#1d2b33",base:"#5d7263",high:"#b8c4b0",accent:"#48626e"},{style:"rocky",deep:"#26221f",base:"#7d7268",high:"#c9beb2",accent:"#93826f"},{style:"banded",deep:"#2c2338",base:"#7a6a96",high:"#cfc2e8",accent:"#a98fd6"}];function $e({index:e}){const r=J[e],i=re[e%re.length],s=d.useRef(null),o=d.useRef(null),n=d.useRef(null),a=d.useRef(null),l=d.useRef(null),t=d.useRef(0),{map:c,bump:u,glowTex:h,ringTex:m}=d.useMemo(()=>({map:Ge(i.style,i,40+e*17,768,.4),bump:qe(40+e*17,512,!0),glowTex:le(r.emissive),ringTex:i.style==="banded"?Ve("#cdbfa8",8+e):null}),[e,i,r.emissive]),p=d.useMemo(()=>m?Ze(r.radius*1.45,r.radius*2.35):null,[m,r.radius]),b=e/J.length*Math.PI*2+.7;P((v,j)=>{const S=v.clock.elapsedTime,{hoveredPlanet:M,galaxySpin:g,reducedMotion:O}=R.getState(),z=s.current,I=o.current;if(!z||!I)return;const k=O?b:S*r.speed+b+g;if(z.position.set(Math.cos(k)*r.orbit,Math.sin(k*.9)*.6,Math.sin(k)*r.orbit),!O){I.rotation.y=S*.1+e;const te=l.current;te&&(te.rotation.y=S*(.35+e*.06))}const A=M===e?1:0;t.current=w(t.current,A,6,j);const ue=1+t.current*.13;I.scale.setScalar(ue);const X=a.current;X&&(X.material.opacity=.16+t.current*.4,X.scale.setScalar(r.radius*(4.6+t.current*1.6)));const ee=n.current?.material;ee&&(ee.emissiveIntensity=.46+t.current*.5)});const x=R(v=>v.setHoveredPlanet);return f.jsxs("group",{ref:s,children:[f.jsxs("group",{ref:o,rotation:[r.tilt,0,r.tilt*.6],children:[f.jsxs("mesh",{ref:n,onPointerOver:v=>{v.stopPropagation(),x(e)},onPointerOut:()=>x(null),children:[f.jsx("sphereGeometry",{args:[r.radius,80,56]}),f.jsx("meshStandardMaterial",{map:c,bumpMap:u,bumpScale:1.5,roughnessMap:u,emissive:"#ffffff",emissiveMap:c,emissiveIntensity:.46,roughness:1,metalness:0})]}),p&&m&&f.jsx("mesh",{geometry:p,rotation:[Math.PI/2.25,0,0],children:f.jsx("meshBasicMaterial",{map:m,transparent:!0,side:we,depthWrite:!1,opacity:.85})}),f.jsx("group",{ref:l,children:r.tools.map((v,j)=>{const S=j/r.tools.length*Math.PI*2,M=r.radius*(1.9+j*.34);return f.jsxs("mesh",{position:[Math.cos(S)*M,Math.sin(S*2.3)*.22,Math.sin(S)*M],children:[f.jsx("sphereGeometry",{args:[.05+r.radius*.04,10,8]}),f.jsx("meshBasicMaterial",{color:r.emissive})]},v)})})]}),f.jsx("sprite",{ref:a,scale:r.radius*4.6,children:f.jsx("spriteMaterial",{map:h,transparent:!0,depthWrite:!1,opacity:.16,blending:N,fog:!1})})]})}function Xe(){const e=d.useRef(null);return P((r,i)=>{const s=e.current;if(!s)return;const{mouse:o,reducedMotion:n,progress:a,birth:l}=R.getState();if(n)return;s.rotation.x=w(s.rotation.x,.34-o.y*.05,1.2,i),s.rotation.z=w(s.rotation.z,-.1+o.x*.04,1.2,i);const t=D(a);s.position.set(0,-1.4*(1-t),-96+-152*t),s.scale.setScalar(Math.max(.02,l*(1-t))),s.rotation.y+=i*t*1.6}),f.jsxs("group",{ref:e,position:[0,-1.4,-96],rotation:[.34,0,-.1],children:[f.jsxs("mesh",{children:[f.jsx("sphereGeometry",{args:[.5,24,16]}),f.jsx("meshBasicMaterial",{color:"#f5f3ee"})]}),f.jsx("pointLight",{color:"#fff4e0",intensity:26,distance:30,decay:2}),J.map((r,i)=>f.jsx($e,{index:i},i))]})}const H=new _(-19,3,-40),Ye=[{name:"Venus",style:"banded",palette:{deep:"#9a7539",base:"#c9a05f",high:"#efe0b8",accent:"#e2c48c"},atmosphere:"#e8d6a4",orbit:5.5,radius:1.15,speed:.055,phase:.6,seed:57,spin:-.02},{name:"Earth",style:"terra",palette:{deep:"#0a3060",base:"#3f6339",high:"#e9eef2",accent:"#2a6b8f"},atmosphere:"#5da6ff",orbit:11,radius:1.25,speed:.034,phase:2.8,seed:23,spin:.09},{name:"Neptune",style:"banded",palette:{deep:"#16307c",base:"#2a52c6",high:"#7fa6ee",accent:"#4a76e0"},atmosphere:"#4a7cff",orbit:19,radius:2.1,speed:.02,phase:4.6,seed:91,spin:.06}],se=13.8,Je=16;function Qe({count:e=850}){const r=d.useRef(null),{geometry:i,material:s,transforms:o}=d.useMemo(()=>{const a=new be(1,0),l=new Me({color:"#8d8478",emissive:"#5c554b",emissiveIntensity:.36,roughness:1,metalness:0,flatShading:!0}),t=Array.from({length:e},()=>({angle:Math.random()*Math.PI*2,radius:se+Math.random()*(Je-se),y:(Math.random()-.5)*.7,scale:.055+Math.pow(Math.random(),2.2)*.19,speed:.02+Math.random()*.012,tumble:Math.random()*Math.PI*2,tumbleSpeed:(Math.random()-.5)*1.4}));return{geometry:a,material:l,transforms:t}},[e]),n=d.useMemo(()=>new ye,[]);return P(a=>{const l=r.current;if(!l)return;const{reducedMotion:t}=R.getState(),c=t?0:a.clock.elapsedTime;for(let u=0;u<o.length;u++){const h=o[u],m=h.angle+c*h.speed;n.position.set(Math.cos(m)*h.radius,h.y,Math.sin(m)*h.radius),n.rotation.set(h.tumble+c*h.tumbleSpeed,h.tumble*2,h.tumble*3),n.scale.setScalar(h.scale),n.updateMatrix(),l.setMatrixAt(u,n.matrix)}l.instanceMatrix.needsUpdate=!0}),f.jsx("instancedMesh",{ref:r,args:[i,s,e],frustumCulled:!1})}function et(){const e=d.useRef(null),r=d.useRef([]),i=d.useMemo(()=>new G({vertexShader:Ae,fragmentShader:Ee,uniforms:{uTime:{value:0}}}),[]);return P((s,o)=>{const n=e.current;if(!n)return;const{mouse:a,reducedMotion:l,progress:t,birth:c}=R.getState(),u=s.clock.elapsedTime;if(i.uniforms.uTime.value=u,Ye.forEach((m,p)=>{const b=r.current[p];if(!b)return;const x=l?m.phase:u*m.speed+m.phase;b.position.set(Math.cos(x)*m.orbit,0,Math.sin(x)*m.orbit),l||(b.children[0].rotation.y=u*m.spin)}),l)return;n.rotation.y=w(n.rotation.y,a.x*.01,1,o);const h=D(t);n.position.set(H.x*(1-h),H.y*(1-h),H.z+(-248-H.z)*h),n.scale.setScalar(Math.max(.02,c*(1-h))),n.rotation.y+=o*h*1.2}),f.jsx("group",{ref:e,position:H,scale:.02,children:f.jsxs("group",{rotation:[.42,0,.1],children:[f.jsx("pointLight",{color:"#ffedd2",intensity:90,distance:70,decay:2}),f.jsx(Qe,{})]})})}const tt=new T("#ffffff"),at=new T("#f2ede4"),ot=new T("#e3e8f2");function nt({count:e=3800}){const r=d.useRef(null),{geometry:i,material:s}=d.useMemo(()=>{const o=new Float32Array(e*3),n=new Float32Array(e),a=new Float32Array(e),l=new Float32Array(e*3),t=new T,c=.35,u=.4;for(let p=0;p<e;p++){const b=Math.random()<u;let x;if(b){const S=(Math.random()+Math.random()+Math.random()-1.5)*.3;x=c+S}else x=Math.random()*Math.PI*2;const v=10+Math.pow(Math.random(),.6)*130;o[p*3]=Math.cos(x)*v,o[p*3+1]=Math.sin(x)*v*.75,o[p*3+2]=60-Math.random()*400,n[p]=b?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,a[p]=Math.random();const j=Math.random();t.copy(j>.94?at:j>.86?ot:tt),l[p*3]=t.r,l[p*3+1]=t.g,l[p*3+2]=t.b}const h=new q;h.setAttribute("position",new E(o,3)),h.setAttribute("aSize",new E(n,1)),h.setAttribute("aPhase",new E(a,1)),h.setAttribute("aColor",new E(l,3));const m=new G({vertexShader:ke,fragmentShader:Pe,transparent:!0,depthWrite:!1,blending:N,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:h,material:m}},[e]);return P((o,n)=>{s.uniforms.uTime.value=o.clock.elapsedTime;const a=r.current;if(!a)return;const{mouse:l,reducedMotion:t,progress:c,birth:u}=R.getState();s.uniforms.uSwallow.value=t?0:D(c),s.uniforms.uBirth.value=t?1:u,!t&&(a.rotation.y=w(a.rotation.y,l.x*.016,1.3,n),a.rotation.x=w(a.rotation.x,-l.y*.011,1.3,n))}),f.jsx("group",{ref:r,children:f.jsx("points",{geometry:i,material:s,frustumCulled:!1})})}function rt({count:e=900}){const{geometry:r,material:i}=d.useMemo(()=>{const s=new Float32Array(e*3),o=new Float32Array(e),n=new Float32Array(e);for(let t=0;t<e;t++){const c=Math.random()*Math.PI*2,u=1.5+Math.pow(Math.random(),.7)*13;s[t*3]=Math.cos(c)*u,s[t*3+1]=Math.sin(c)*u*.7,s[t*3+2]=30-Math.random()*300,o[t]=.5+Math.pow(Math.random(),2)*1.6,n[t]=Math.random()}const a=new q;a.setAttribute("position",new E(s,3)),a.setAttribute("aSize",new E(o,1)),a.setAttribute("aPhase",new E(n,1));const l=new G({vertexShader:Ie,fragmentShader:ze,transparent:!0,depthWrite:!1,blending:N,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMouse:{value:new U},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:a,material:l}},[e]);return P((s,o)=>{i.uniforms.uTime.value=s.clock.elapsedTime;const{mouse:n,reducedMotion:a,progress:l,birth:t}=R.getState();i.uniforms.uSwallow.value=a?0:D(l),i.uniforms.uBirth.value=a?1:t;const c=i.uniforms.uMouse.value,u=a?0:1;c.x=w(c.x,n.x*u,1.8,o),c.y=w(c.y,-n.y*u,1.8,o)}),f.jsx("points",{geometry:r,material:i,frustumCulled:!1})}function st({count:e=320}){const r=d.useRef(null),i=d.useRef(0),s=d.useMemo(()=>{const o=new Float32Array(e*6);for(let a=0;a<e;a++){const l=Math.random()*Math.PI*2,t=3+Math.random()*15,c=Math.cos(l)*t,u=Math.sin(l)*t*.8,h=30-Math.random()*290,m=1.6+Math.random()*4.5;o.set([c,u,h,c,u,h-m],a*6)}const n=new q;return n.setAttribute("position",new E(o,3)),n},[e]);return P((o,n)=>{const a=r.current;if(!a)return;const{velocity:l,reducedMotion:t,enterWarp:c}=R.getState(),u=t?0:Math.min(1,Math.abs(l)*1.4+c);i.current=w(i.current,u,4,n),a.opacity=i.current*.34}),f.jsx("lineSegments",{geometry:s,frustumCulled:!1,children:f.jsx("lineBasicMaterial",{ref:r,color:"#dfe6f2",transparent:!0,opacity:0,blending:N,depthWrite:!1})})}function it({count:e=240}){const r=d.useRef(null),i=d.useMemo(()=>{const s=new Float32Array(e*6);for(let n=0;n<e;n++){const a=Math.random()*Math.PI*2,l=2.5+Math.random()*9,t=Math.cos(a)*l,c=Math.sin(a)*l,u=-128-Math.random()*150,h=5+Math.random()*13;s.set([t,c,u,t,c,u-h],n*6)}const o=new q;return o.setAttribute("position",new E(s,3)),o},[e]);return P((s,o)=>{const n=r.current;if(!n)return;const{progress:a}=R.getState();n.opacity=w(n.opacity,ie(a)*.75,5,o)}),f.jsx("lineSegments",{geometry:i,frustumCulled:!1,children:f.jsx("lineBasicMaterial",{ref:r,color:"#ffffff",transparent:!0,opacity:0,blending:N,depthWrite:!1})})}function ct(){const e=d.useRef(null),r=d.useMemo(()=>[{inner:"#b9a8d8",outer:"#171226",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#8fb8b4",outer:"#0e1a1a",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27},{inner:"#c9a68a",outer:"#1c1410",pos:[-40,-34,-180],scale:85,seed:35},{inner:"#a3aed0",outer:"#12141f",pos:[30,40,-100],scale:75,seed:43}].map(s=>({...s,tex:Ue(s.inner,s.outer,s.seed)})),[]);return P((i,s)=>{const o=e.current;if(!o)return;const{mouse:n,reducedMotion:a,progress:l}=R.getState();if(a)return;o.rotation.y=w(o.rotation.y,n.x*.006,.8,s),o.rotation.x=w(o.rotation.x,-n.y*.004,.8,s);const{birth:t}=R.getState(),c=D(l);o.children.forEach((u,h)=>{u.rotation.z+=s*(.004+c*.12)*(h%2?1:-1);const m=r[h];m&&(u.position.set(m.pos[0]*(1-c),m.pos[1]*(1-c),m.pos[2]+(-248-m.pos[2])*c),u.scale.setScalar(m.scale*(1-c*.92)),u.material.opacity=.34*t*(1-c))})}),f.jsx("group",{ref:e,children:r.map((i,s)=>f.jsx("sprite",{position:i.pos,scale:i.scale,children:f.jsx("spriteMaterial",{map:i.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:N,fog:!1})},s))})}const lt=[{pos:[88,40,-205],scale:[120,68],seed:7,rot0:-.5,spin:.0045,opacity:.55},{pos:[-95,18,-110],scale:[88,50],seed:13,rot0:.7,spin:-.003,opacity:.42},{pos:[96,-14,-160],scale:[76,42],seed:21,rot0:2.1,spin:.0035,opacity:.4}];function ut({spec:e}){const r=d.useRef(null),i=d.useMemo(()=>Ke(e.seed),[e.seed]);return P((s,o)=>{const n=r.current;if(!n)return;const{progress:a,birth:l,reducedMotion:t}=R.getState(),c=n.material;if(t){c.opacity=e.opacity;return}c.rotation+=o*e.spin;const u=D(a);n.position.set(e.pos[0]*(1-u),e.pos[1]*(1-u),e.pos[2]+(-248-e.pos[2])*u);const h=Math.max(.02,1-u*.96);n.scale.set(e.scale[0]*h,e.scale[1]*h,1),c.opacity=e.opacity*l*(1-u)}),f.jsx("sprite",{ref:r,position:e.pos,scale:[e.scale[0],e.scale[1],1],children:f.jsx("spriteMaterial",{map:i,transparent:!0,depthWrite:!1,opacity:0,rotation:e.rot0,blending:N,fog:!1})})}function ht(){return f.jsx(f.Fragment,{children:lt.map((e,r)=>f.jsx(ut,{spec:e},r))})}function ft({count:e=1600}){const r=d.useRef(null),i=d.useRef(null),s=d.useMemo(()=>{const o=new Float32Array(e*3);for(let a=0;a<e;a++){const l=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),c=170+Math.random()*160;o[a*3]=Math.sin(t)*Math.cos(l)*c,o[a*3+1]=Math.sin(t)*Math.sin(l)*c*.7,o[a*3+2]=-140+Math.cos(t)*c}const n=new q;return n.setAttribute("position",new E(o,3)),n},[e]);return P((o,n)=>{const a=r.current,l=i.current;if(!a||!l)return;const{progress:t,birth:c,reducedMotion:u}=R.getState();if(u){l.opacity=.4;return}a.rotation.y+=n*.0016;const h=D(t);l.opacity=.4*c*(1-h),a.scale.setScalar(Math.max(.05,1-h*.94)),a.position.z=-248*h*.7}),f.jsx("group",{ref:r,children:f.jsx("points",{geometry:s,frustumCulled:!1,children:f.jsx("pointsMaterial",{ref:i,size:.55,sizeAttenuation:!0,color:"#7d8595",transparent:!0,opacity:0,depthWrite:!1,blending:N,fog:!1})})})}function mt(){const e=d.useRef([]),r=d.useRef(Array.from({length:3},(s,o)=>({t:-3-o*4,dur:1.4,from:new _,dir:new _}))),i=d.useMemo(()=>le("#f5f3ee"),[]);return P((s,o)=>{const{reducedMotion:n,progress:a}=R.getState(),l=s.camera.position.z;r.current.forEach((t,c)=>{const u=e.current[c];if(!u)return;if(n||a>.86){u.visible=!1;return}if(t.t+=o,t.t>t.dur){t.t=-(2+Math.random()*6),t.dur=1.1+Math.random()*.9;const p=Math.random()>.5?1:-1;t.from.set(p*(18+Math.random()*30),8+Math.random()*18,l-50-Math.random()*60),t.dir.set(-p*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/t.dur)}if(t.t<0){u.visible=!1;return}const h=t.t/t.dur;u.visible=!0,u.position.copy(t.from).addScaledVector(t.dir,t.t);const m=u.children[0].material;m.opacity=Math.sin(h*Math.PI)*.9})}),f.jsx(f.Fragment,{children:r.current.map((s,o)=>f.jsx("group",{ref:n=>{e.current[o]=n},visible:!1,children:f.jsx("sprite",{scale:[7,.35,1],children:f.jsx("spriteMaterial",{map:i,transparent:!0,depthWrite:!1,opacity:0,blending:N,rotation:-.45,fog:!1})})},o))})}function yt(){const e=R(n=>n.reducedMotion),[r,i]=d.useState(!1);d.useEffect(()=>{const n=window.matchMedia("(max-width: 768px)"),a=()=>i(n.matches);return a(),n.addEventListener("change",a),()=>n.removeEventListener("change",a)},[]);const s=r?1600:3800,o=r?[1,1.5]:[1,2];return f.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:f.jsxs(he,{dpr:o,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,.8,15],fov:52,near:.1,far:600},style:{background:"#000000"},children:[f.jsx("color",{attach:"background",args:["#000000"]}),f.jsx("fog",{attach:"fog",args:["#000000",60,240]}),f.jsx("ambientLight",{intensity:.1}),f.jsx("directionalLight",{position:[18,26,10],intensity:.85,color:"#f2ecdf"}),f.jsxs(d.Suspense,{fallback:null,children:[f.jsx(Fe,{}),f.jsx(ft,{count:r?700:1600}),f.jsx(ht,{}),f.jsx(ct,{}),f.jsx(nt,{count:s}),f.jsx(rt,{count:r?320:900}),f.jsx(st,{count:r?140:320}),f.jsx(et,{}),f.jsx(Xe,{}),!r&&f.jsx(mt,{}),f.jsx(Ne,{}),f.jsxs("group",{position:[0,1.2,-122],children:[f.jsxs("mesh",{children:[f.jsx("sphereGeometry",{args:[.9,32,32]}),f.jsx("meshBasicMaterial",{color:"#ffffff"})]}),f.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),f.jsx(it,{}),f.jsx(Oe,{}),f.jsx(We,{})]}),!e&&!r&&f.jsxs(fe,{multisampling:0,children:[f.jsx(me,{intensity:.95,luminanceThreshold:.52,luminanceSmoothing:.87,mipmapBlur:!0}),f.jsx(pe,{opacity:.01}),f.jsx(de,{eskil:!1,offset:.18,darkness:.92})]})]})})}export{yt as default};
