import{r as g,u as C,V as E,j as u,S as G,C as R,b as O,d as K,B as V,e as A,A as I,f as ce,D as le,R as ue,g as fe,h as me,w as he,i as pe,q as de}from"./three-BTjrfJb9.js";import{u as T,d as U}from"./index-DsFKa4J6.js";import"./motion-CFOnWPes.js";const _=[{p:0,x:0,y:.4,z:15,fov:52},{p:.1,x:0,y:.2,z:11,fov:52},{p:.18,x:2.4,y:.4,z:2,fov:55},{p:.26,x:4.2,y:.2,z:-16,fov:56},{p:.34,x:-4,y:-.3,z:-30,fov:56},{p:.42,x:3.6,y:.4,z:-44,fov:56},{p:.5,x:-3.2,y:-.2,z:-58,fov:56},{p:.56,x:0,y:0,z:-66,fov:50},{p:.62,x:0,y:0,z:-70,fov:48},{p:.72,x:0,y:.2,z:-84,fov:56},{p:.85,x:0,y:0,z:-116,fov:70},{p:.92,x:0,y:0,z:-152,fov:74},{p:1.01,x:0,y:0,z:-236,fov:88}];function ve(e){for(let i=_.length-2;i>=0;i--)if(e>=_[i].p)return i;return 0}function q(e,i,s,n,r){const o=r*r,t=o*r;return .5*(2*i+(-e+s)*r+(2*e-5*i+4*s-n)*o+(-e+3*i-3*s+n)*t)}function $(e){const i=Math.min(1,Math.max(0,e)),s=ve(i),n=_[Math.max(0,s-1)],r=_[s],o=_[Math.min(_.length-1,s+1)],t=_[Math.min(_.length-1,s+2)],c=Math.max(1e-6,o.p-r.p),a=(i-r.p)/c;return{x:q(n.x,r.x,o.x,t.x,a),y:q(n.y,r.y,o.y,t.y,a),z:q(n.z,r.z,o.z,t.z,a),fov:q(n.fov,r.fov,o.fov,t.fov,a)}}function ae(e){return H(.86,.98,e)}function L(e){return H(.84,.985,e)}function ge(e){return H(.5,.56,e)*(1-H(.62,.7,e))}function H(e,i,s){const n=Math.min(1,Math.max(0,(s-e)/(i-e)));return n*n*(3-2*n)}function xe(e,i,s){return e+(i-e)*s}function w(e,i,s,n){return xe(e,i,1-Math.exp(-s*n))}const Q=new E;function Me(){const e=g.useRef({p:0,fov:52,roll:0,mx:0,my:0});return C((i,s)=>{const{progress:n,mouse:r,reducedMotion:o,enterWarp:t}=T.getState(),c=i.camera,a=e.current,f=2.6-ge(n)*1.8;a.p=w(a.p,n,f,s);const m=$(a.p),v=$(Math.max(0,a.p-.02)),d=$(Math.min(1,a.p+.02)),h={x:m.x+(d.x-v.x),y:m.y+(d.y-v.y),z:m.z+(d.z-v.z)},x=o?0:1;a.mx=w(a.mx,r.x*x,1.8,s),a.my=w(a.my,r.y*x,1.8,s),c.position.set(m.x+a.mx*.14,m.y+a.my*.09,m.z),Q.set(h.x+a.mx*.4,h.y+a.my*.26,h.z),c.lookAt(Q);const M=H(.78,1,n)*Math.PI*2,P=ae(n)*Math.sin(i.clock.elapsedTime*.5)*.05;a.roll=w(a.roll,M+P,2.2,s),c.rotation.z+=a.roll,a.fov=w(a.fov,m.fov+t*26,3.2,s),c.rotation.z+=t*.22,Math.abs(c.fov-a.fov)>.01&&(c.fov=a.fov,c.updateProjectionMatrix())}),null}const ye=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,be=`
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
`,we=`
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
`,Se=`
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`,je=`
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
`,Pe=`
  varying vec3 vNormal;
  varying vec3 vObj;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObj = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Re=`
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
`,Te=`
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,Ce=`
  precision highp float;

  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.8);
    gl_FragColor = vec4(uColor, rim * 0.6);
  }
`,ke=new E(0,0,-2),Ie=new E(0,0,-248);function oe({center:e,size:i=46,warm:s=0,fade:n}){const r=g.useRef(null),o=g.useRef({x:0,y:0}),t=g.useMemo(()=>new G({vertexShader:ye,fragmentShader:be,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:e.clone()},uCamLocal:{value:new E},uFade:{value:0},uWarm:{value:s}}}),[e,s]);return C((c,a)=>{const l=r.current;if(!l)return;const{progress:f,mouse:m,reducedMotion:v,contactCollapsed:d}=T.getState();l.quaternion.copy(c.camera.quaternion),t.uniforms.uTime.value=c.clock.elapsedTime;const h=v?0:1,x=o.current;x.x=w(x.x,m.x*h,1.6,a),x.y=w(x.y,m.y*h,1.6,a),t.uniforms.uCamLocal.value.copy(c.camera.position).sub(e);const y=t.uniforms.uCamLocal.value.length();t.uniforms.uCamLocal.value.x+=x.x*y*.1,t.uniforms.uCamLocal.value.y+=-x.y*y*.07,t.uniforms.uFade.value=w(t.uniforms.uFade.value,n(f,d),4,a),l.visible=t.uniforms.uFade.value>.01}),u.jsx("mesh",{ref:r,position:e,material:t,renderOrder:5,frustumCulled:!1,children:u.jsx("planeGeometry",{args:[i,i]})})}function Ae(){return u.jsx(oe,{center:ke,warm:1,fade:e=>1-H(.16,.26,e)})}function Ee(){return u.jsx(oe,{center:Ie,size:52,warm:1,fade:(e,i)=>H(.66,.8,e)*(i?.3:1)})}function N(e,i,s){const n=Math.sin(e*127.1+i*311.7+s*74.7)*43758.5453;return n-Math.floor(n)}function We(e,i,s){const n=Math.floor(e),r=Math.floor(i),o=e-n,t=i-r,c=o*o*(3-2*o),a=t*t*(3-2*t),l=N(n,r,s),f=N(n+1,r,s),m=N(n,r+1,s),v=N(n+1,r+1,s);return l+(f-l)*c+(m-l)*a+(l-f-m+v)*c*a}function b(e,i,s,n=5){let r=0,o=.5,t=1;for(let c=0;c<n;c++)r+=We(e*t,i*t,s+c*13.7)*o,o*=.5,t*=2.1;return r}function j(e,i,s){return e.clone().lerp(i,Math.min(1,Math.max(0,s)))}function ne(e,i,s){const o=document.createElement("canvas");o.width=512,o.height=256;const t=o.getContext("2d"),c=t.createImageData(512,256),a=new R(i.deep),l=new R(i.base),f=new R(i.high),m=new R(i.accent);for(let d=0;d<256;d++){const h=d/256,x=Math.abs(h-.5)*2;for(let y=0;y<512;y++){const M=y/512;let p;if(e==="banded"){const z=b(M*6,h*3,s,5),k=Math.sin(h*Math.PI*14+z*5+Math.sin(M*Math.PI*2)*.4);p=j(l,f,k*.5+.5),p=j(p,a,b(M*3+40,h*6,s+5,4)*.55);const S=b(M*9,h*9,s+9,4);S>.68&&(p=j(p,m,(S-.68)*2.4))}else if(e==="rocky"){const z=b(M*7,h*7,s,6);p=j(a,l,z*1.15);const k=Math.abs(b(M*12,h*12,s+3,5)-.5)*2;p=j(p,f,Math.pow(1-k,6)*.5);const S=b(M*18,h*18,s+8,3);S>.72&&(p=j(p,a,(S-.72)*2.2)),S<.2&&(p=j(p,m,(.2-S)*.9))}else if(e==="ice"){const z=b(M*5+b(M*8,h*8,s+2,4)*1.6,h*5,s,5);p=j(l,f,z),p=j(p,m,Math.pow(b(M*10,h*10,s+6,4),3)*.7),p=j(p,f,Math.pow(x,3.2)*.9),p=j(p,a,Math.pow(b(M*4,h*2,s+11,3),4)*.5)}else{const z=b(M*4,h*4,s,6),k=z>.52;p=k?j(l,f,b(M*10,h*10,s+4,4)):j(a,m,b(M*8,h*8,s+7,4)*.5),k&&z<.56&&(p=j(p,m,.4)),p=j(p,f,Math.pow(x,4)*.8);const S=b(M*6+33,h*6,s+21,5);S>.62&&(p=j(p,new R("#f5f3ee"),(S-.62)*1.6))}const P=(d*512+y)*4;c.data[P]=p.r*255,c.data[P+1]=p.g*255,c.data[P+2]=p.b*255,c.data[P+3]=255}}t.putImageData(c,0,0);const v=new O(o);return v.colorSpace=K,v.anisotropy=4,v}function re(e){const n=document.createElement("canvas");n.width=256,n.height=128;const r=n.getContext("2d"),o=r.createImageData(256,128);for(let t=0;t<128;t++)for(let c=0;c<256;c++){const a=b(c/256*9,t/128*9,e,5)*255,l=(t*256+c)*4;o.data[l]=o.data[l+1]=o.data[l+2]=a,o.data[l+3]=255}return r.putImageData(o,0,0),new O(n)}function _e(e,i){const n=document.createElement("canvas");n.width=256,n.height=1;const r=n.getContext("2d"),o=r.createImageData(256,1),t=new R(e);for(let a=0;a<256;a++){const l=a/256;let f=b(l*14,.5,i,4);f*=Math.sin(l*Math.PI),b(l*30,2.5,i+4,3)>.62&&(f*=.15);const m=a*4;o.data[m]=t.r*255,o.data[m+1]=t.g*255,o.data[m+2]=t.b*255,o.data[m+3]=Math.min(1,f*1.5)*210}r.putImageData(o,0,0);const c=new O(n);return c.colorSpace=K,c}function Y(e){const s=document.createElement("canvas");s.width=128,s.height=128;const n=s.getContext("2d"),r=n.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),o=new R(e),t=`${o.r*255|0},${o.g*255|0},${o.b*255|0}`;return r.addColorStop(0,`rgba(${t},0.9)`),r.addColorStop(.25,`rgba(${t},0.35)`),r.addColorStop(.6,`rgba(${t},0.08)`),r.addColorStop(1,`rgba(${t},0)`),n.fillStyle=r,n.fillRect(0,0,128,128),new O(s)}function Ne(e){const s=document.createElement("canvas");s.width=512,s.height=512;const n=s.getContext("2d"),r=n.createImageData(512,512),o=new R("#ffe3ba"),t=new R("#a9c2e8"),c=new R("#3d4a63");for(let l=0;l<512;l++)for(let f=0;f<512;f++){const m=(f/512-.5)*2,v=(l/512-.5)*2,d=m,h=v*2.7,x=Math.sqrt(d*d+h*h),y=Math.atan2(h,d),M=Math.cos(2*y-Math.log(x+.06)*5.6),p=Math.pow(Math.max(0,M),1.7),P=b(f/512*7,l/512*7,e,4);let z=Math.exp(-x*6.5)*1.6+p*Math.exp(-x*2.3)*(.3+P*.55);const k=b(x*8+y*1.6,y*3.2,e+5,3);z*=1-Math.max(0,Math.min(1,(k-.6)*3))*.5*Math.min(1,x*3);let S=j(o,t,Math.min(1,x*2.4));S=j(S,c,Math.max(0,x-.55)*1.4);const F=Math.min(1,z)*Math.max(0,Math.min(1,(1-x)*2.2)),W=(l*512+f)*4;r.data[W]=S.r*255,r.data[W+1]=S.g*255,r.data[W+2]=S.b*255,r.data[W+3]=F*235}n.putImageData(r,0,0);for(let l=0;l<240;l++){const f=N(l,7,e)*Math.PI*2,m=Math.pow(N(l,13,e),.6)*.46,v=(.5+Math.cos(f)*m)*512,d=(.5+Math.sin(f)*m/2.7)*512,h=.25+N(l,29,e)*.6;n.fillStyle=`rgba(235,240,250,${h})`,n.fillRect(v,d,1,1)}const a=new O(s);return a.colorSpace=K,a}function He(e,i,s){const r=document.createElement("canvas");r.width=256,r.height=256;const o=r.getContext("2d"),t=o.createImageData(256,256),c=new R(e),a=new R(i);for(let f=0;f<256;f++)for(let m=0;m<256;m++){const v=m/256,d=f/256,h=v-.5,x=d-.5,y=Math.sqrt(h*h+x*x)*2,M=b(v*4+b(v*7,d*7,s+3,4)*1.4,d*4,s,5),p=Math.max(0,M-.32)*Math.max(0,1-y)*1.4,P=j(c,a,y+(M-.5)*.6),z=(f*256+m)*4;t.data[z]=P.r*255,t.data[z+1]=P.g*255,t.data[z+2]=P.b*255,t.data[z+3]=Math.min(1,p)*165}o.putImageData(t,0,0);const l=new O(r);return l.colorSpace=K,l}const Le=new R("#ffffff"),Oe=new R("#f2ede4"),Fe=new R("#e3e8f2");function De({count:e=3800}){const i=g.useRef(null),{geometry:s,material:n}=g.useMemo(()=>{const r=new Float32Array(e*3),o=new Float32Array(e),t=new Float32Array(e),c=new Float32Array(e*3),a=new R,l=.35,f=.4;for(let d=0;d<e;d++){const h=Math.random()<f;let x;if(h){const p=(Math.random()+Math.random()+Math.random()-1.5)*.3;x=l+p}else x=Math.random()*Math.PI*2;const y=10+Math.pow(Math.random(),.6)*130;r[d*3]=Math.cos(x)*y,r[d*3+1]=Math.sin(x)*y*.75,r[d*3+2]=60-Math.random()*400,o[d]=h?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,t[d]=Math.random();const M=Math.random();a.copy(M>.94?Oe:M>.86?Fe:Le),c[d*3]=a.r,c[d*3+1]=a.g,c[d*3+2]=a.b}const m=new V;m.setAttribute("position",new A(r,3)),m.setAttribute("aSize",new A(o,1)),m.setAttribute("aPhase",new A(t,1)),m.setAttribute("aColor",new A(c,3));const v=new G({vertexShader:we,fragmentShader:Se,transparent:!0,depthWrite:!1,blending:I,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:m,material:v}},[e]);return C((r,o)=>{n.uniforms.uTime.value=r.clock.elapsedTime;const t=i.current;if(!t)return;const{mouse:c,reducedMotion:a,progress:l,birth:f}=T.getState();n.uniforms.uSwallow.value=a?0:L(l),n.uniforms.uBirth.value=a?1:f,!a&&(t.rotation.y=w(t.rotation.y,c.x*.016,1.3,o),t.rotation.x=w(t.rotation.x,-c.y*.011,1.3,o))}),u.jsx("group",{ref:i,children:u.jsx("points",{geometry:s,material:n,frustumCulled:!1})})}function Be({count:e=900}){const{geometry:i,material:s}=g.useMemo(()=>{const n=new Float32Array(e*3),r=new Float32Array(e),o=new Float32Array(e);for(let a=0;a<e;a++){const l=Math.random()*Math.PI*2,f=1.5+Math.pow(Math.random(),.7)*13;n[a*3]=Math.cos(l)*f,n[a*3+1]=Math.sin(l)*f*.7,n[a*3+2]=30-Math.random()*300,r[a]=.5+Math.pow(Math.random(),2)*1.6,o[a]=Math.random()}const t=new V;t.setAttribute("position",new A(n,3)),t.setAttribute("aSize",new A(r,1)),t.setAttribute("aPhase",new A(o,1));const c=new G({vertexShader:je,fragmentShader:ze,transparent:!0,depthWrite:!1,blending:I,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMouse:{value:new ce},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:t,material:c}},[e]);return C((n,r)=>{s.uniforms.uTime.value=n.clock.elapsedTime;const{mouse:o,reducedMotion:t,progress:c,birth:a}=T.getState();s.uniforms.uSwallow.value=t?0:L(c),s.uniforms.uBirth.value=t?1:a;const l=s.uniforms.uMouse.value,f=t?0:1;l.x=w(l.x,o.x*f,1.8,r),l.y=w(l.y,-o.y*f,1.8,r)}),u.jsx("points",{geometry:i,material:s,frustumCulled:!1})}function Ge({count:e=320}){const i=g.useRef(null),s=g.useRef(0),n=g.useMemo(()=>{const r=new Float32Array(e*6);for(let t=0;t<e;t++){const c=Math.random()*Math.PI*2,a=3+Math.random()*15,l=Math.cos(c)*a,f=Math.sin(c)*a*.8,m=30-Math.random()*290,v=1.6+Math.random()*4.5;r.set([l,f,m,l,f,m-v],t*6)}const o=new V;return o.setAttribute("position",new A(r,3)),o},[e]);return C((r,o)=>{const t=i.current;if(!t)return;const{velocity:c,reducedMotion:a,enterWarp:l}=T.getState(),f=a?0:Math.min(1,Math.abs(c)*1.4+l);s.current=w(s.current,f,4,o),t.opacity=s.current*.34}),u.jsx("lineSegments",{geometry:n,frustumCulled:!1,children:u.jsx("lineBasicMaterial",{ref:i,color:"#dfe6f2",transparent:!0,opacity:0,blending:I,depthWrite:!1})})}function Ve({count:e=240}){const i=g.useRef(null),s=g.useMemo(()=>{const n=new Float32Array(e*6);for(let o=0;o<e;o++){const t=Math.random()*Math.PI*2,c=2.5+Math.random()*9,a=Math.cos(t)*c,l=Math.sin(t)*c,f=-128-Math.random()*150,m=5+Math.random()*13;n.set([a,l,f,a,l,f-m],o*6)}const r=new V;return r.setAttribute("position",new A(n,3)),r},[e]);return C((n,r)=>{const o=i.current;if(!o)return;const{progress:t}=T.getState();o.opacity=w(o.opacity,ae(t)*.75,5,r)}),u.jsx("lineSegments",{geometry:s,frustumCulled:!1,children:u.jsx("lineBasicMaterial",{ref:i,color:"#ffffff",transparent:!0,opacity:0,blending:I,depthWrite:!1})})}function qe(){const e=g.useRef(null),i=g.useMemo(()=>[{inner:"#b9a8d8",outer:"#171226",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#8fb8b4",outer:"#0e1a1a",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27},{inner:"#c9a68a",outer:"#1c1410",pos:[-40,-34,-180],scale:85,seed:35},{inner:"#a3aed0",outer:"#12141f",pos:[30,40,-100],scale:75,seed:43}].map(n=>({...n,tex:He(n.inner,n.outer,n.seed)})),[]);return C((s,n)=>{const r=e.current;if(!r)return;const{mouse:o,reducedMotion:t,progress:c}=T.getState();if(t)return;r.rotation.y=w(r.rotation.y,o.x*.006,.8,n),r.rotation.x=w(r.rotation.x,-o.y*.004,.8,n);const{birth:a}=T.getState(),l=L(c);r.children.forEach((f,m)=>{f.rotation.z+=n*(.004+l*.12)*(m%2?1:-1);const v=i[m];v&&(f.position.set(v.pos[0]*(1-l),v.pos[1]*(1-l),v.pos[2]+(-248-v.pos[2])*l),f.scale.setScalar(v.scale*(1-l*.92)),f.material.opacity=.34*a*(1-l))})}),u.jsx("group",{ref:e,children:i.map((s,n)=>u.jsx("sprite",{position:s.pos,scale:s.scale,children:u.jsx("spriteMaterial",{map:s.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:I,fog:!1})},n))})}const D=new E(88,40,-205);function Ke(){const e=g.useRef(null),i=g.useMemo(()=>Ne(7),[]);return C((s,n)=>{const r=e.current;if(!r)return;const{progress:o,birth:t,reducedMotion:c}=T.getState(),a=r.material;if(c){a.opacity=.55;return}a.rotation+=n*.0045;const l=L(o);r.position.set(D.x*(1-l),D.y*(1-l),D.z+(-248-D.z)*l);const f=Math.max(.02,1-l*.96);r.scale.set(120*f,68*f,1),a.opacity=.55*t*(1-l)}),u.jsx("sprite",{ref:e,position:D,scale:[120,68,1],children:u.jsx("spriteMaterial",{map:i,transparent:!0,depthWrite:!1,opacity:0,rotation:-.5,blending:I,fog:!1})})}function Ze({count:e=1600}){const i=g.useRef(null),s=g.useRef(null),n=g.useMemo(()=>{const r=new Float32Array(e*3);for(let t=0;t<e;t++){const c=Math.random()*Math.PI*2,a=Math.acos(2*Math.random()-1),l=170+Math.random()*160;r[t*3]=Math.sin(a)*Math.cos(c)*l,r[t*3+1]=Math.sin(a)*Math.sin(c)*l*.7,r[t*3+2]=-140+Math.cos(a)*l}const o=new V;return o.setAttribute("position",new A(r,3)),o},[e]);return C((r,o)=>{const t=i.current,c=s.current;if(!t||!c)return;const{progress:a,birth:l,reducedMotion:f}=T.getState();if(f){c.opacity=.4;return}t.rotation.y+=o*.0016;const m=L(a);c.opacity=.4*l*(1-m),t.scale.setScalar(Math.max(.05,1-m*.94)),t.position.z=-248*m*.7}),u.jsx("group",{ref:i,children:u.jsx("points",{geometry:n,frustumCulled:!1,children:u.jsx("pointsMaterial",{ref:s,size:.55,sizeAttenuation:!0,color:"#7d8595",transparent:!0,opacity:0,depthWrite:!1,blending:I,fog:!1})})})}function $e(){const e=g.useRef([]),i=g.useRef(Array.from({length:3},(n,r)=>({t:-3-r*4,dur:1.4,from:new E,dir:new E}))),s=g.useMemo(()=>Y("#f5f3ee"),[]);return C((n,r)=>{const{reducedMotion:o,progress:t}=T.getState(),c=n.camera.position.z;i.current.forEach((a,l)=>{const f=e.current[l];if(!f)return;if(o||t>.86){f.visible=!1;return}if(a.t+=r,a.t>a.dur){a.t=-(2+Math.random()*6),a.dur=1.1+Math.random()*.9;const d=Math.random()>.5?1:-1;a.from.set(d*(18+Math.random()*30),8+Math.random()*18,c-50-Math.random()*60),a.dir.set(-d*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/a.dur)}if(a.t<0){f.visible=!1;return}const m=a.t/a.dur;f.visible=!0,f.position.copy(a.from).addScaledVector(a.dir,a.t);const v=f.children[0].material;v.opacity=Math.sin(m*Math.PI)*.9})}),u.jsx(u.Fragment,{children:i.current.map((n,r)=>u.jsx("group",{ref:o=>{e.current[r]=o},visible:!1,children:u.jsx("sprite",{scale:[7,.35,1],children:u.jsx("spriteMaterial",{map:s,transparent:!0,depthWrite:!1,opacity:0,blending:I,rotation:-.45,fog:!1})})},r))})}function Ue(e,i,s=96){const n=new ue(e,i,s),r=n.attributes.position,o=n.attributes.uv,t=new E;for(let c=0;c<r.count;c++)t.fromBufferAttribute(r,c),o.setXY(c,(t.length()-e)/(i-e),.5);return n}const ee=[{style:"ice",deep:"#2a3138",base:"#8d99a6",high:"#e8edf2",accent:"#aebfcc"},{style:"banded",deep:"#4a3628",base:"#a08466",high:"#d9c8ae",accent:"#e0a878"},{style:"terra",deep:"#1d2b33",base:"#5d7263",high:"#b8c4b0",accent:"#48626e"},{style:"rocky",deep:"#26221f",base:"#7d7268",high:"#c9beb2",accent:"#93826f"},{style:"banded",deep:"#2c2338",base:"#7a6a96",high:"#cfc2e8",accent:"#a98fd6"}];function Ye({index:e}){const i=U[e],s=ee[e%ee.length],n=g.useRef(null),r=g.useRef(null),o=g.useRef(null),t=g.useRef(null),c=g.useRef(null),a=g.useRef(0),{map:l,bump:f,glowTex:m,ringTex:v}=g.useMemo(()=>({map:ne(s.style,s,40+e*17),bump:re(40+e*17),glowTex:Y(i.emissive),ringTex:s.style==="banded"?_e("#cdbfa8",8+e):null}),[e,s,i.emissive]),d=g.useMemo(()=>v?Ue(i.radius*1.45,i.radius*2.35):null,[v,i.radius]),h=e/U.length*Math.PI*2+.7;C((y,M)=>{const p=y.clock.elapsedTime,{hoveredPlanet:P,galaxySpin:z,reducedMotion:k}=T.getState(),S=n.current,F=r.current;if(!S||!F)return;const W=k?h:p*i.speed+h+z;if(S.position.set(Math.cos(W)*i.orbit,Math.sin(W*.9)*.6,Math.sin(W)*i.orbit),!k){F.rotation.y=p*.1+e;const J=c.current;J&&(J.rotation.y=p*(.35+e*.06))}const se=P===e?1:0;a.current=w(a.current,se,6,M);const ie=1+a.current*.13;F.scale.setScalar(ie);const Z=t.current;Z&&(Z.material.opacity=.16+a.current*.4,Z.scale.setScalar(i.radius*(4.6+a.current*1.6)));const X=o.current?.material;X&&(X.emissiveIntensity=.46+a.current*.5)});const x=T(y=>y.setHoveredPlanet);return u.jsxs("group",{ref:n,children:[u.jsxs("group",{ref:r,rotation:[i.tilt,0,i.tilt*.6],children:[u.jsxs("mesh",{ref:o,onPointerOver:y=>{y.stopPropagation(),x(e)},onPointerOut:()=>x(null),children:[u.jsx("sphereGeometry",{args:[i.radius,48,32]}),u.jsx("meshStandardMaterial",{map:l,bumpMap:f,bumpScale:.6,emissive:"#ffffff",emissiveMap:l,emissiveIntensity:.46,roughness:.95,metalness:0})]}),d&&v&&u.jsx("mesh",{geometry:d,rotation:[Math.PI/2.25,0,0],children:u.jsx("meshBasicMaterial",{map:v,transparent:!0,side:le,depthWrite:!1,opacity:.85})}),u.jsx("group",{ref:c,children:i.tools.map((y,M)=>{const p=M/i.tools.length*Math.PI*2,P=i.radius*(1.9+M*.34);return u.jsxs("mesh",{position:[Math.cos(p)*P,Math.sin(p*2.3)*.22,Math.sin(p)*P],children:[u.jsx("sphereGeometry",{args:[.05+i.radius*.04,10,8]}),u.jsx("meshBasicMaterial",{color:i.emissive})]},y)})})]}),u.jsx("sprite",{ref:t,scale:i.radius*4.6,children:u.jsx("spriteMaterial",{map:m,transparent:!0,depthWrite:!1,opacity:.16,blending:I,fog:!1})})]})}function Xe(){const e=g.useRef(null);return C((i,s)=>{const n=e.current;if(!n)return;const{mouse:r,reducedMotion:o,progress:t,birth:c}=T.getState();if(o)return;n.rotation.x=w(n.rotation.x,.34-r.y*.05,1.2,s),n.rotation.z=w(n.rotation.z,-.1+r.x*.04,1.2,s);const a=L(t);n.position.set(0,-1.4*(1-a),-96+-152*a),n.scale.setScalar(Math.max(.02,c*(1-a))),n.rotation.y+=s*a*1.6}),u.jsxs("group",{ref:e,position:[0,-1.4,-96],rotation:[.34,0,-.1],children:[u.jsxs("mesh",{children:[u.jsx("sphereGeometry",{args:[.5,24,16]}),u.jsx("meshBasicMaterial",{color:"#f5f3ee"})]}),u.jsx("pointLight",{color:"#fff4e0",intensity:26,distance:30,decay:2}),U.map((i,s)=>u.jsx(Ye,{index:s},s))]})}const B=new E(-19,3,-40),te=[{name:"Venus",style:"banded",palette:{deep:"#9a7539",base:"#c9a05f",high:"#efe0b8",accent:"#e2c48c"},atmosphere:"#e8d6a4",orbit:5.5,radius:1.15,speed:.055,phase:.6,seed:57,spin:-.02},{name:"Earth",style:"terra",palette:{deep:"#0a3060",base:"#3f6339",high:"#e9eef2",accent:"#2a6b8f"},atmosphere:"#5da6ff",orbit:9.5,radius:1.25,speed:.034,phase:2.8,seed:23,spin:.09},{name:"Neptune",style:"banded",palette:{deep:"#16307c",base:"#2a52c6",high:"#7fa6ee",accent:"#4a76e0"},atmosphere:"#4a7cff",orbit:14.5,radius:2.1,speed:.02,phase:4.6,seed:91,spin:.06}];function Je(){const e=g.useRef(null),i=g.useRef([]),s=g.useMemo(()=>te.map(o=>({...o,map:ne(o.style,o.palette,o.seed),bump:re(o.seed),atmoMat:new G({vertexShader:Te,fragmentShader:Ce,transparent:!0,depthWrite:!1,blending:I,uniforms:{uColor:{value:new R(o.atmosphere)}}})})),[]),n=g.useMemo(()=>new G({vertexShader:Pe,fragmentShader:Re,uniforms:{uTime:{value:0}}}),[]),r=g.useMemo(()=>Y("#ffd9a0"),[]);return C((o,t)=>{const c=e.current;if(!c)return;const{mouse:a,reducedMotion:l,progress:f,birth:m}=T.getState(),v=o.clock.elapsedTime;if(n.uniforms.uTime.value=v,te.forEach((h,x)=>{const y=i.current[x];if(!y)return;const M=l?h.phase:v*h.speed+h.phase;y.position.set(Math.cos(M)*h.orbit,0,Math.sin(M)*h.orbit),l||(y.children[0].rotation.y=v*h.spin)}),l)return;c.rotation.y=w(c.rotation.y,a.x*.01,1,t);const d=L(f);c.position.set(B.x*(1-d),B.y*(1-d),B.z+(-248-B.z)*d),c.scale.setScalar(Math.max(.02,m*(1-d))),c.rotation.y+=t*d*1.2}),u.jsx("group",{ref:e,position:B,scale:.02,children:u.jsxs("group",{rotation:[.42,0,.1],children:[u.jsx("mesh",{material:n,children:u.jsx("sphereGeometry",{args:[1.6,48,32]})}),u.jsx("sprite",{scale:11,children:u.jsx("spriteMaterial",{map:r,transparent:!0,depthWrite:!1,opacity:.6,blending:I,fog:!1})}),u.jsx("pointLight",{color:"#ffedd2",intensity:90,distance:70,decay:2}),s.map((o,t)=>u.jsx("group",{ref:c=>{i.current[t]=c},children:u.jsxs("group",{rotation:[.15*(t%2?-1:1),0,t===1?.41:.1],children:[u.jsxs("mesh",{children:[u.jsx("sphereGeometry",{args:[o.radius,48,32]}),u.jsx("meshStandardMaterial",{map:o.map,bumpMap:o.bump,bumpScale:o.style==="terra"?.5:.25,emissive:"#ffffff",emissiveMap:o.map,emissiveIntensity:.4,roughness:.95,metalness:0})]}),u.jsx("mesh",{material:o.atmoMat,scale:1.05,children:u.jsx("sphereGeometry",{args:[o.radius,48,32]})})]})},o.name))]})})}function at(){const e=T(o=>o.reducedMotion),[i,s]=g.useState(!1);g.useEffect(()=>{const o=window.matchMedia("(max-width: 768px)"),t=()=>s(o.matches);return t(),o.addEventListener("change",t),()=>o.removeEventListener("change",t)},[]);const n=i?1600:3800,r=i?[1,1.5]:[1,2];return u.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:u.jsxs(fe,{dpr:r,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,.8,15],fov:52,near:.1,far:600},style:{background:"#000000"},children:[u.jsx("color",{attach:"background",args:["#000000"]}),u.jsx("fog",{attach:"fog",args:["#000000",60,240]}),u.jsx("ambientLight",{intensity:.1}),u.jsx("directionalLight",{position:[18,26,10],intensity:.85,color:"#f2ecdf"}),u.jsxs(g.Suspense,{fallback:null,children:[u.jsx(Me,{}),u.jsx(Ze,{count:i?700:1600}),u.jsx(Ke,{}),u.jsx(qe,{}),u.jsx(De,{count:n}),u.jsx(Be,{count:i?320:900}),u.jsx(Ge,{count:i?140:320}),u.jsx(Je,{}),u.jsx(Xe,{}),!i&&u.jsx($e,{}),u.jsx(Ae,{}),u.jsxs("group",{position:[0,1.2,-122],children:[u.jsxs("mesh",{children:[u.jsx("sphereGeometry",{args:[.9,32,32]}),u.jsx("meshBasicMaterial",{color:"#ffffff"})]}),u.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),u.jsx(Ve,{}),u.jsx(Ee,{})]}),!e&&!i&&u.jsxs(me,{multisampling:0,children:[u.jsx(he,{intensity:.95,luminanceThreshold:.52,luminanceSmoothing:.87,mipmapBlur:!0}),u.jsx(pe,{opacity:.01}),u.jsx(de,{eskil:!1,offset:.18,darkness:.92})]})]})})}export{at as default};
