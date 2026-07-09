import{V as b,r as g,S as N,u as C,j as m,A,C as _,b as T,d as G,Q as X,E as ot,M as nt,D as rt,R as st,B as D,e as F,f as it,g as ct,h as lt,w as ut,i as mt,q as ht}from"./three-DNlAIA_P.js";import{u as k}from"./index-C8e4S_q-.js";import"./motion-D-i76zx9.js";const ft=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,pt=`
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
`,dt=`
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
`,vt=`
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`,gt=`
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
`,xt=`
  precision highp float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.16;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.95, 0.88, 0.75, a);
  }
`,Mt=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,wt=`
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
`,yt=`
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,bt=`
  precision highp float;

  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.8);
    gl_FragColor = vec4(uColor, rim * 0.6);
  }
`,W={earth:new b(-8.5,4.6,-20),mars:new b(1.6,-.4,-46),beltZ:-70,saturn:new b(-13,-5.4,-101),nebula:new b(6,3,-136),blackHole:new b(14,7.6,-165),wormhole:new b(9,-6,-205)},E=[{p:0,x:0,y:1.2,z:16,fov:52},{p:.07,x:-1,y:1.6,z:8,fov:52},{p:.15,x:-6,y:3.6,z:-6,fov:54},{p:.24,x:-2,y:1,z:-30,fov:55},{p:.33,x:1.5,y:.1,z:-50,fov:56},{p:.43,x:.5,y:.6,z:-66,fov:58},{p:.52,x:-6,y:-2,z:-86,fov:58},{p:.6,x:-10,y:-4,z:-104,fov:56},{p:.68,x:-3,y:0,z:-126,fov:56},{p:.76,x:5,y:3.5,z:-145,fov:60},{p:.85,x:11,y:6,z:-165,fov:64},{p:.93,x:9,y:-3,z:-190,fov:72},{p:1,x:9,y:-6,z:-206,fov:88}];function St(t){for(let c=E.length-2;c>=0;c--)if(t>=E[c].p)return c;return 0}function L(t,c,r,o,a){const e=a*a,n=e*a;return .5*(2*c+(-t+r)*a+(2*t-5*c+4*r-o)*e+(-t+3*c-3*r+o)*n)}function Z(t){const c=Math.min(1,Math.max(0,t)),r=St(c),o=E[Math.max(0,r-1)],a=E[r],e=E[Math.min(E.length-1,r+1)],n=E[Math.min(E.length-1,r+2)],s=Math.max(1e-6,e.p-a.p),i=(c-a.p)/s;return{x:L(o.x,a.x,e.x,n.x,i),y:L(o.y,a.y,e.y,n.y,i),z:L(o.z,a.z,e.z,n.z,i),fov:L(o.fov,a.fov,e.fov,n.fov,i)}}function Y(t){return jt(.9,1,t)}function jt(t,c,r){const o=Math.min(1,Math.max(0,(r-t)/(c-t)));return o*o*(3-2*o)}function Pt(t,c,r){return t+(c-t)*r}function S(t,c,r,o){return Pt(t,c,1-Math.exp(-r*o))}const U=W.blackHole.clone();function zt({size:t=46}){const c=g.useRef(null),r=g.useRef({x:0,y:0}),o=g.useMemo(()=>new N({vertexShader:ft,fragmentShader:pt,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:U.clone()},uCamLocal:{value:new b},uFade:{value:0},uWarm:{value:.55}}}),[]);return C((a,e)=>{const n=c.current;if(!n)return;const{mouse:s,reducedMotion:i,ready:l}=k.getState();n.quaternion.copy(a.camera.quaternion),o.uniforms.uTime.value=a.clock.elapsedTime;const u=i?0:1,h=r.current;h.x=S(h.x,s.x*u,1.6,e),h.y=S(h.y,s.y*u,1.6,e);const f=o.uniforms.uCamLocal.value;f.copy(a.camera.position).sub(U);const d=f.length();f.x+=h.x*d*.1,f.y+=-h.y*d*.07,o.uniforms.uFade.value=S(o.uniforms.uFade.value,l?1:0,3,e),n.visible=o.uniforms.uFade.value>.01}),m.jsx("mesh",{ref:c,position:U,material:o,renderOrder:5,frustumCulled:!1,children:m.jsx("planeGeometry",{args:[t,t]})})}const Tt=W.wormhole.clone();function kt({size:t=30}){const c=g.useRef(null),r=g.useRef(0),o=g.useMemo(()=>new N({vertexShader:Mt,fragmentShader:wt,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uFade:{value:0},uPulse:{value:.5},uAccent:{value:.35}}}),[]);C((e,n)=>{const s=c.current;if(!s)return;const{reducedMotion:i,ready:l,enterWarp:u}=k.getState(),h=e.clock.elapsedTime;s.quaternion.copy(e.camera.quaternion),o.uniforms.uTime.value=h,r.current=S(r.current,k.getState().hoveredWorld==="wormhole"?1:0,6,n);const f=i?.5:.5+.5*Math.sin(h*.8);o.uniforms.uPulse.value=f*(.7+r.current*.6)+u*.6,o.uniforms.uAccent.value=.3+r.current*.4,o.uniforms.uFade.value=S(o.uniforms.uFade.value,l?1:0,3,n),s.visible=o.uniforms.uFade.value>.01});const a=k(e=>e.setHoveredWorld);return m.jsx("mesh",{ref:c,position:Tt,material:o,renderOrder:4,frustumCulled:!1,onPointerOver:e=>{e.stopPropagation(),a("wormhole")},onPointerOut:()=>a(null),children:m.jsx("planeGeometry",{args:[t,t]})})}function H(t,c,r){const o=Math.sin(t*127.1+c*311.7+r*74.7)*43758.5453;return o-Math.floor(o)}function Ct(t,c,r){const o=Math.floor(t),a=Math.floor(c),e=t-o,n=c-a,s=e*e*(3-2*e),i=n*n*(3-2*n),l=H(o,a,r),u=H(o+1,a,r),h=H(o,a+1,r),f=H(o+1,a+1,r);return l+(u-l)*s+(h-l)*i+(l-u-h+f)*s*i}function w(t,c,r,o=5){let a=0,e=.5,n=1;for(let s=0;s<o;s++)a+=Ct(t*n,c*n,r+s*13.7)*e,e*=.5,n*=2.1;return a}function j(t,c,r){return t.clone().lerp(c,Math.min(1,Math.max(0,r)))}function tt(t,c,r){const e=document.createElement("canvas");e.width=512,e.height=256;const n=e.getContext("2d"),s=n.createImageData(512,256),i=new T(c.deep),l=new T(c.base),u=new T(c.high),h=new T(c.accent);for(let d=0;d<256;d++){const v=d/256,M=Math.abs(v-.5)*2;for(let z=0;z<512;z++){const x=z/512;let p;if(t==="banded"){const y=w(x*6,v*3,r,5),I=Math.sin(v*Math.PI*14+y*5+Math.sin(x*Math.PI*2)*.4);p=j(l,u,I*.5+.5),p=j(p,i,w(x*3+40,v*6,r+5,4)*.55);const P=w(x*9,v*9,r+9,4);P>.68&&(p=j(p,h,(P-.68)*2.4))}else if(t==="rocky"){const y=w(x*7,v*7,r,6);p=j(i,l,y*1.15);const I=Math.abs(w(x*12,v*12,r+3,5)-.5)*2;p=j(p,u,Math.pow(1-I,6)*.5);const P=w(x*18,v*18,r+8,3);P>.72&&(p=j(p,i,(P-.72)*2.2)),P<.2&&(p=j(p,h,(.2-P)*.9))}else if(t==="ice"){const y=w(x*5+w(x*8,v*8,r+2,4)*1.6,v*5,r,5);p=j(l,u,y),p=j(p,h,Math.pow(w(x*10,v*10,r+6,4),3)*.7),p=j(p,u,Math.pow(M,3.2)*.9),p=j(p,i,Math.pow(w(x*4,v*2,r+11,3),4)*.5)}else{const y=w(x*4,v*4,r,6),I=y>.52;p=I?j(l,u,w(x*10,v*10,r+4,4)):j(i,h,w(x*8,v*8,r+7,4)*.5),I&&y<.56&&(p=j(p,h,.4)),p=j(p,u,Math.pow(M,4)*.8);const P=w(x*6+33,v*6,r+21,5);P>.62&&(p=j(p,new T("#f5f3ee"),(P-.62)*1.6))}const R=(d*512+z)*4;s.data[R]=p.r*255,s.data[R+1]=p.g*255,s.data[R+2]=p.b*255,s.data[R+3]=255}}n.putImageData(s,0,0);const f=new _(e);return f.colorSpace=G,f.anisotropy=4,f}function et(t){const o=document.createElement("canvas");o.width=256,o.height=128;const a=o.getContext("2d"),e=a.createImageData(256,128);for(let n=0;n<128;n++)for(let s=0;s<256;s++){const i=w(s/256*9,n/128*9,t,5)*255,l=(n*256+s)*4;e.data[l]=e.data[l+1]=e.data[l+2]=i,e.data[l+3]=255}return a.putImageData(e,0,0),new _(o)}function Rt(t,c){const o=document.createElement("canvas");o.width=256,o.height=1;const a=o.getContext("2d"),e=a.createImageData(256,1),n=new T(t);for(let i=0;i<256;i++){const l=i/256;let u=w(l*14,.5,c,4);u*=Math.sin(l*Math.PI),w(l*30,2.5,c+4,3)>.62&&(u*=.15);const h=i*4;e.data[h]=n.r*255,e.data[h+1]=n.g*255,e.data[h+2]=n.b*255,e.data[h+3]=Math.min(1,u*1.5)*210}a.putImageData(e,0,0);const s=new _(o);return s.colorSpace=G,s}function at(t){const r=document.createElement("canvas");r.width=128,r.height=128;const o=r.getContext("2d"),a=o.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),e=new T(t),n=`${e.r*255|0},${e.g*255|0},${e.b*255|0}`;return a.addColorStop(0,`rgba(${n},0.9)`),a.addColorStop(.25,`rgba(${n},0.35)`),a.addColorStop(.6,`rgba(${n},0.08)`),a.addColorStop(1,`rgba(${n},0)`),o.fillStyle=a,o.fillRect(0,0,128,128),new _(r)}function It(t){const r=document.createElement("canvas");r.width=512,r.height=512;const o=r.getContext("2d"),a=o.createImageData(512,512),e=new T("#ffe3ba"),n=new T("#a9c2e8"),s=new T("#3d4a63");for(let l=0;l<512;l++)for(let u=0;u<512;u++){const h=(u/512-.5)*2,f=(l/512-.5)*2,d=h,v=f*2.7,M=Math.sqrt(d*d+v*v),z=Math.atan2(v,d),x=Math.cos(2*z-Math.log(M+.06)*5.6),p=Math.pow(Math.max(0,x),1.7),R=w(u/512*7,l/512*7,t,4);let y=Math.exp(-M*6.5)*1.6+p*Math.exp(-M*2.3)*(.3+R*.55);const I=w(M*8+z*1.6,z*3.2,t+5,3);y*=1-Math.max(0,Math.min(1,(I-.6)*3))*.5*Math.min(1,M*3);let P=j(e,n,Math.min(1,M*2.4));P=j(P,s,Math.max(0,M-.55)*1.4);const q=Math.min(1,y)*Math.max(0,Math.min(1,(1-M)*2.2)),O=(l*512+u)*4;a.data[O]=P.r*255,a.data[O+1]=P.g*255,a.data[O+2]=P.b*255,a.data[O+3]=q*235}o.putImageData(a,0,0);for(let l=0;l<240;l++){const u=H(l,7,t)*Math.PI*2,h=Math.pow(H(l,13,t),.6)*.46,f=(.5+Math.cos(u)*h)*512,d=(.5+Math.sin(u)*h/2.7)*512,v=.25+H(l,29,t)*.6;o.fillStyle=`rgba(235,240,250,${v})`,o.fillRect(f,d,1,1)}const i=new _(r);return i.colorSpace=G,i}function Wt(t,c,r){const a=document.createElement("canvas");a.width=256,a.height=256;const e=a.getContext("2d"),n=e.createImageData(256,256),s=new T(t),i=new T(c);for(let u=0;u<256;u++)for(let h=0;h<256;h++){const f=h/256,d=u/256,v=f-.5,M=d-.5,z=Math.sqrt(v*v+M*M)*2,x=w(f*4+w(f*7,d*7,r+3,4)*1.4,d*4,r,5),p=Math.max(0,x-.32)*Math.max(0,1-z)*1.4,R=j(s,i,z+(x-.5)*.6),y=(u*256+h)*4;n.data[y]=R.r*255,n.data[y+1]=R.g*255,n.data[y+2]=R.b*255,n.data[y+3]=Math.min(1,p)*165}e.putImageData(n,0,0);const l=new _(a);return l.colorSpace=G,l}const K=new b,$=new X,B=new nt,Q=new b,V=new b;function At({count:t=150}){const c=g.useRef(null),{map:r,bump:o}=g.useMemo(()=>({map:tt("rocky",{deep:"#241d18",base:"#6d5f52",high:"#b3a596",accent:"#877462"},12),bump:et(12)}),[]),a=g.useMemo(()=>{const e=[],n=new b(-26,-13,W.beltZ+26),s=new b(26,13,W.beltZ-26);for(let i=0;i<t;i++){const l=i/t,u=n.clone().lerp(s,l),h=new b((Math.random()-.5)*12,(Math.random()-.5)*7,(Math.random()-.5)*14),f=u.add(h),d=.12+Math.pow(Math.random(),2.3)*1.1;e.push({base:f,drift:new b((Math.random()-.5)*.6,(Math.random()-.5)*.4,(Math.random()-.5)*.6),axis:new b(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),spin:(Math.random()-.5)*.7,phase:Math.random()*Math.PI*2,scale:d,baseQuat:new X().setFromEuler(new ot(Math.random()*6.28,Math.random()*6.28,Math.random()*6.28))})}return e},[t]);return g.useLayoutEffect(()=>{const e=c.current;e&&(a.forEach((n,s)=>{V.set(n.scale,n.scale*(.7+Math.random()*.5),n.scale),B.compose(n.base,n.baseQuat,V),e.setMatrixAt(s,B)}),e.instanceMatrix.needsUpdate=!0)},[a]),C(e=>{const n=c.current;if(!n)return;const{reducedMotion:s}=k.getState();if(s)return;const i=e.clock.elapsedTime;for(let l=0;l<a.length;l++){const u=a[l];K.copy(u.axis),$.setFromAxisAngle(K,i*u.spin),$.multiply(u.baseQuat),Q.set(u.base.x+Math.sin(i*.15+u.phase)*u.drift.x,u.base.y+Math.cos(i*.13+u.phase)*u.drift.y,u.base.z+Math.sin(i*.11+u.phase*1.3)*u.drift.z),V.setScalar(u.scale),B.compose(Q,$,V),n.setMatrixAt(l,B)}n.instanceMatrix.needsUpdate=!0}),m.jsxs("instancedMesh",{ref:c,args:[void 0,void 0,t],frustumCulled:!1,children:[m.jsx("icosahedronGeometry",{args:[1,0]}),m.jsx("meshStandardMaterial",{map:r,bumpMap:o,bumpScale:.5,roughness:1,metalness:0,emissive:"#1a140f",emissiveIntensity:.35,flatShading:!0})]})}const J=new b;function Ft(){const t=g.useRef({p:0,fov:52,roll:0,mx:0,my:0});return C((c,r)=>{const{progress:o,mouse:a,reducedMotion:e,enterWarp:n}=k.getState(),s=c.camera,i=t.current;i.p=S(i.p,o,2.6,r);const l=Z(i.p),u=Z(Math.max(0,i.p-.02)),h=Z(Math.min(1,i.p+.02)),f={x:l.x+(h.x-u.x),y:l.y+(h.y-u.y),z:l.z+(h.z-u.z)},d=e?0:1;i.mx=S(i.mx,a.x*d,1.8,r),i.my=S(i.my,a.y*d,1.8,r),s.position.set(l.x+i.mx*.16,l.y+i.my*.1,l.z),J.set(f.x+i.mx*.4,f.y+i.my*.26,f.z),s.lookAt(J);const v=Y(o),M=e?0:v*(Math.sin(c.clock.elapsedTime*.5)*.05+v*1.4);i.roll=S(i.roll,M,2.2,r),s.rotation.z+=i.roll+n*.22,i.fov=S(i.fov,l.fov+n*26,2.2,r),Math.abs(s.fov-i.fov)>.01&&(s.fov=i.fov,s.updateProjectionMatrix())}),null}function Et(t,c,r=128){const o=new st(t,c,r),a=o.attributes.position,e=o.attributes.uv,n=new b;for(let s=0;s<a.count;s++)n.fromBufferAttribute(a,s),e.setXY(s,(n.length()-t)/(c-t),.5);return o}const Ht=[{id:"earth",position:W.earth,radius:3.4,style:"terra",palette:{deep:"#0a2f5e",base:"#3f6b3a",high:"#eef3f6",accent:"#2a6b8f"},atmosphere:"#5da6ff",glow:"#7fb4ff",tilt:.41,spin:.05,seed:23},{id:"mars",position:W.mars,radius:2.4,style:"rocky",palette:{deep:"#5a1f10",base:"#b05a32",high:"#e8b489",accent:"#7d3b1e"},atmosphere:"#e07a44",glow:"#ff8a55",tilt:.44,spin:.06,seed:67},{id:"saturn",position:W.saturn,radius:3,style:"banded",palette:{deep:"#8a6b34",base:"#c6a566",high:"#efe1bc",accent:"#e0c48c"},atmosphere:"#e8d6a4",glow:"#f0dca6",tilt:.47,spin:.09,seed:91,ring:{tint:"#d8c8a4",inner:1.45,outer:2.5}}];function _t({def:t}){const c=g.useRef(null),r=g.useRef(null),o=g.useRef(null),a=g.useRef(0),e=k(f=>f.setHoveredWorld),{map:n,bump:s,atmoMat:i,glowTex:l,ringTex:u,ringGeo:h}=g.useMemo(()=>{const f=t.ring?Rt(t.ring.tint,t.seed):null;return{map:tt(t.style,t.palette,t.seed),bump:et(t.seed),glowTex:at(t.glow),ringTex:f,ringGeo:t.ring?Et(t.radius*t.ring.inner,t.radius*t.ring.outer):null,atmoMat:new N({vertexShader:yt,fragmentShader:bt,transparent:!0,depthWrite:!1,blending:A,uniforms:{uColor:{value:new T(t.atmosphere)}}})}},[t]);return C((f,d)=>{const v=c.current;if(!v)return;const{hoveredWorld:M,mouse:z,reducedMotion:x}=k.getState(),p=f.clock.elapsedTime;x||(v.rotation.y=p*t.spin+z.x*.25,v.rotation.x=S(v.rotation.x,t.tilt-z.y*.14,2,d));const R=M===t.id?1:0;a.current=S(a.current,R,6,d);const y=r.current;if(y){const P=1+a.current*.06;y.scale.setScalar(P);const q=y.material;q.emissiveIntensity=.32+a.current*.5}const I=o.current;I&&(I.material.opacity=.14+a.current*.45,I.scale.setScalar(t.radius*(3.4+a.current*1.4)))}),m.jsxs("group",{position:t.position,children:[m.jsx("sprite",{ref:o,scale:t.radius*3.4,children:m.jsx("spriteMaterial",{map:l,transparent:!0,depthWrite:!1,opacity:.14,blending:A,fog:!1})}),m.jsxs("group",{ref:c,rotation:[t.tilt,0,t.tilt*.3],children:[m.jsxs("mesh",{ref:r,onPointerOver:f=>{f.stopPropagation(),e(t.id)},onPointerOut:()=>e(null),children:[m.jsx("sphereGeometry",{args:[t.radius,64,48]}),m.jsx("meshStandardMaterial",{map:n,bumpMap:s,bumpScale:t.style==="rocky"?.7:.4,emissive:"#ffffff",emissiveMap:n,emissiveIntensity:.32,roughness:.95,metalness:0})]}),m.jsx("mesh",{material:i,scale:1.04,children:m.jsx("sphereGeometry",{args:[t.radius,48,32]})}),h&&u&&m.jsx("mesh",{geometry:h,rotation:[Math.PI/2.15,0,0],children:m.jsx("meshBasicMaterial",{map:u,transparent:!0,side:rt,depthWrite:!1,opacity:.9})})]})]})}function Nt(){return m.jsx("group",{children:Ht.map(t=>m.jsx(_t,{def:t},t.id))})}const Dt=new T("#ffffff"),Ot=new T("#f2ede4"),Lt=new T("#e3e8f2");function Bt({count:t=3800}){const c=g.useRef(null),{geometry:r,material:o}=g.useMemo(()=>{const a=new Float32Array(t*3),e=new Float32Array(t),n=new Float32Array(t),s=new Float32Array(t*3),i=new T,l=.35,u=.4;for(let d=0;d<t;d++){const v=Math.random()<u;let M;if(v){const p=(Math.random()+Math.random()+Math.random()-1.5)*.3;M=l+p}else M=Math.random()*Math.PI*2;const z=12+Math.pow(Math.random(),.6)*150;a[d*3]=Math.cos(M)*z,a[d*3+1]=Math.sin(M)*z*.75,a[d*3+2]=40-Math.random()*420,e[d]=v?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,n[d]=Math.random();const x=Math.random();i.copy(x>.94?Ot:x>.86?Lt:Dt),s[d*3]=i.r,s[d*3+1]=i.g,s[d*3+2]=i.b}const h=new D;h.setAttribute("position",new F(a,3)),h.setAttribute("aSize",new F(e,1)),h.setAttribute("aPhase",new F(n,1)),h.setAttribute("aColor",new F(s,3));const f=new N({vertexShader:dt,fragmentShader:vt,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSwallow:{value:0},uBirth:{value:1}}});return{geometry:h,material:f}},[t]);return C((a,e)=>{o.uniforms.uTime.value=a.clock.elapsedTime;const n=c.current;if(!n)return;const{mouse:s,reducedMotion:i}=k.getState();i||(n.rotation.y=S(n.rotation.y,s.x*.016,1.3,e),n.rotation.x=S(n.rotation.x,-s.y*.011,1.3,e))}),m.jsx("group",{ref:c,children:m.jsx("points",{geometry:r,material:o,frustumCulled:!1})})}function Vt({count:t=900}){const{geometry:c,material:r}=g.useMemo(()=>{const o=new Float32Array(t*3),a=new Float32Array(t),e=new Float32Array(t);for(let i=0;i<t;i++){const l=Math.random()*Math.PI*2,u=1.5+Math.pow(Math.random(),.7)*14;o[i*3]=Math.cos(l)*u,o[i*3+1]=Math.sin(l)*u*.7,o[i*3+2]=30-Math.random()*320,a[i]=.5+Math.pow(Math.random(),2)*1.6,e[i]=Math.random()}const n=new D;n.setAttribute("position",new F(o,3)),n.setAttribute("aSize",new F(a,1)),n.setAttribute("aPhase",new F(e,1));const s=new N({vertexShader:gt,fragmentShader:xt,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMouse:{value:new it},uSwallow:{value:0},uBirth:{value:1}}});return{geometry:n,material:s}},[t]);return C((o,a)=>{r.uniforms.uTime.value=o.clock.elapsedTime;const{mouse:e,reducedMotion:n}=k.getState(),s=r.uniforms.uMouse.value,i=n?0:1;s.x=S(s.x,e.x*i,1.8,a),s.y=S(s.y,-e.y*i,1.8,a)}),m.jsx("points",{geometry:c,material:r,frustumCulled:!1})}function Gt({count:t=320}){const c=g.useRef(null),r=g.useRef(0),o=g.useMemo(()=>{const a=new Float32Array(t*6);for(let n=0;n<t;n++){const s=Math.random()*Math.PI*2,i=3+Math.random()*16,l=Math.cos(s)*i,u=Math.sin(s)*i*.8,h=30-Math.random()*300,f=1.6+Math.random()*4.5;a.set([l,u,h,l,u,h-f],n*6)}const e=new D;return e.setAttribute("position",new F(a,3)),e},[t]);return C((a,e)=>{const n=c.current;if(!n)return;const{velocity:s,reducedMotion:i,enterWarp:l}=k.getState(),u=i?0:Math.min(1,Math.abs(s)*1.4+l);r.current=S(r.current,u,4,e),n.opacity=r.current*.34}),m.jsx("lineSegments",{geometry:o,frustumCulled:!1,children:m.jsx("lineBasicMaterial",{ref:c,color:"#dfe6f2",transparent:!0,opacity:0,blending:A,depthWrite:!1})})}function qt({count:t=240}){const c=g.useRef(null),r=g.useMemo(()=>{const o=new Float32Array(t*6);for(let e=0;e<t;e++){const n=Math.random()*Math.PI*2,s=2.5+Math.random()*9,i=Math.cos(n)*s+W.wormhole.x,l=Math.sin(n)*s+W.wormhole.y,u=-150-Math.random()*90,h=5+Math.random()*13;o.set([i,l,u,i,l,u-h],e*6)}const a=new D;return a.setAttribute("position",new F(o,3)),a},[t]);return C((o,a)=>{const e=c.current;if(!e)return;const{progress:n}=k.getState();e.opacity=S(e.opacity,Y(n)*.75,5,a)}),m.jsx("lineSegments",{geometry:r,frustumCulled:!1,children:m.jsx("lineBasicMaterial",{ref:c,color:"#ffffff",transparent:!0,opacity:0,blending:A,depthWrite:!1})})}function Zt(){const t=g.useRef(null),c=g.useMemo(()=>[{inner:"#b9a8d8",outer:"#171226",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-150],scale:120,seed:11},{inner:"#8fb8b4",outer:"#0e1a1a",pos:[55,34,-230],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-270],scale:130,seed:27},{inner:"#c98a9a",outer:"#1c1014",pos:[W.nebula.x,W.nebula.y,W.nebula.z],scale:60,seed:35},{inner:"#a3aed0",outer:"#12141f",pos:[-28,10,-128],scale:70,seed:43}].map(o=>({...o,tex:Wt(o.inner,o.outer,o.seed)})),[]);return C((r,o)=>{const a=t.current;if(!a)return;const{mouse:e,reducedMotion:n}=k.getState();n||(a.rotation.y=S(a.rotation.y,e.x*.006,.8,o),a.rotation.x=S(a.rotation.x,-e.y*.004,.8,o),a.children.forEach((s,i)=>{s.rotation.z+=o*.004*(i%2?1:-1)}))}),m.jsx("group",{ref:t,children:c.map((r,o)=>m.jsx("sprite",{position:r.pos,scale:r.scale,children:m.jsx("spriteMaterial",{map:r.tex,transparent:!0,depthWrite:!1,opacity:.36,blending:A,fog:!1})},o))})}const Ut=new b(88,40,-215);function $t(){const t=g.useRef(null),c=g.useMemo(()=>It(7),[]);return C((r,o)=>{const a=t.current;if(!a)return;const{reducedMotion:e}=k.getState(),n=a.material;if(e){n.opacity=.55;return}n.rotation+=o*.0045,n.opacity=.55}),m.jsx("sprite",{ref:t,position:Ut,scale:[120,68,1],children:m.jsx("spriteMaterial",{map:c,transparent:!0,depthWrite:!1,opacity:.55,rotation:-.5,blending:A,fog:!1})})}function Kt({count:t=1600}){const c=g.useRef(null),r=g.useMemo(()=>{const o=new Float32Array(t*3);for(let e=0;e<t;e++){const n=Math.random()*Math.PI*2,s=Math.acos(2*Math.random()-1),i=180+Math.random()*170;o[e*3]=Math.sin(s)*Math.cos(n)*i,o[e*3+1]=Math.sin(s)*Math.sin(n)*i*.7,o[e*3+2]=-150+Math.cos(s)*i}const a=new D;return a.setAttribute("position",new F(o,3)),a},[t]);return C((o,a)=>{const e=c.current;if(!e)return;const{reducedMotion:n}=k.getState();n||(e.rotation.y+=a*.0016)}),m.jsx("group",{ref:c,children:m.jsx("points",{geometry:r,frustumCulled:!1,children:m.jsx("pointsMaterial",{size:.55,sizeAttenuation:!0,color:"#7d8595",transparent:!0,opacity:.4,depthWrite:!1,blending:A,fog:!1})})})}function Qt(){const t=g.useRef([]),c=g.useRef(Array.from({length:3},(o,a)=>({t:-3-a*4,dur:1.4,from:new b,dir:new b}))),r=g.useMemo(()=>at("#f5f3ee"),[]);return C((o,a)=>{const{reducedMotion:e}=k.getState(),n=o.camera.position.z;c.current.forEach((s,i)=>{const l=t.current[i];if(!l)return;if(e){l.visible=!1;return}if(s.t+=a,s.t>s.dur){s.t=-(2+Math.random()*6),s.dur=1.1+Math.random()*.9;const f=Math.random()>.5?1:-1;s.from.set(f*(18+Math.random()*30),8+Math.random()*18,n-50-Math.random()*60),s.dir.set(-f*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/s.dur)}if(s.t<0){l.visible=!1;return}const u=s.t/s.dur;l.visible=!0,l.position.copy(s.from).addScaledVector(s.dir,s.t);const h=l.children[0].material;h.opacity=Math.sin(u*Math.PI)*.9})}),m.jsx(m.Fragment,{children:c.current.map((o,a)=>m.jsx("group",{ref:e=>{t.current[a]=e},visible:!1,children:m.jsx("sprite",{scale:[7,.35,1],children:m.jsx("spriteMaterial",{map:r,transparent:!0,depthWrite:!1,opacity:0,blending:A,rotation:-.45,fog:!1})})},a))})}function te(){const t=k(e=>e.reducedMotion),[c,r]=g.useState(!1);g.useEffect(()=>{const e=window.matchMedia("(max-width: 768px)"),n=()=>r(e.matches);return n(),e.addEventListener("change",n),()=>e.removeEventListener("change",n)},[]);const o=c?1600:3800,a=c?[1,1.5]:[1,2];return m.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:m.jsxs(ct,{dpr:a,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,1.2,16],fov:52,near:.1,far:700},style:{background:"#000000"},children:[m.jsx("color",{attach:"background",args:["#000000"]}),m.jsx("fog",{attach:"fog",args:["#000000",80,320]}),m.jsx("ambientLight",{intensity:.12}),m.jsx("directionalLight",{position:[24,30,14],intensity:1.1,color:"#f4efe2"}),m.jsxs(g.Suspense,{fallback:null,children:[m.jsx(Ft,{}),m.jsx(Kt,{count:c?700:1600}),m.jsx($t,{}),m.jsx(Zt,{}),m.jsx(Bt,{count:o}),m.jsx(Vt,{count:c?320:900}),m.jsx(Gt,{count:c?140:320}),m.jsx(Nt,{}),m.jsx(At,{count:c?70:150}),m.jsx(zt,{}),m.jsx(kt,{}),!c&&m.jsx(Qt,{}),m.jsx(qt,{})]}),!t&&!c&&m.jsxs(lt,{multisampling:0,children:[m.jsx(ut,{intensity:.9,luminanceThreshold:.5,luminanceSmoothing:.87,mipmapBlur:!0}),m.jsx(mt,{opacity:.01}),m.jsx(ht,{eskil:!1,offset:.2,darkness:.9})]})]})})}export{te as default};
