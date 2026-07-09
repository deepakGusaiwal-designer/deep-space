import{j as u,V as _,r as x,S as $,u as C,C as R,b as N,d as q,D as nt,A as L,R as rt,B,e as A,f as st,g as it,h as ct,w as lt,i as ut,q as ft}from"./three-BTjrfJb9.js";import{u as I,d as Z}from"./index-CW3GUBJR.js";import"./motion-CFOnWPes.js";const ht=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,mt=`
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
`,pt=`
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
`,dt=`
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
`,F=[{p:0,x:0,y:.4,z:15,fov:52},{p:.1,x:0,y:.2,z:11,fov:52},{p:.18,x:2.4,y:.4,z:2,fov:55},{p:.26,x:4.2,y:.2,z:-16,fov:56},{p:.34,x:-4,y:-.3,z:-30,fov:56},{p:.42,x:3.6,y:.4,z:-44,fov:56},{p:.5,x:-3.2,y:-.2,z:-58,fov:56},{p:.56,x:0,y:0,z:-66,fov:50},{p:.62,x:0,y:0,z:-70,fov:48},{p:.72,x:0,y:.2,z:-84,fov:56},{p:.85,x:0,y:0,z:-116,fov:70},{p:.92,x:0,y:0,z:-152,fov:74},{p:1,x:0,y:0,z:-236,fov:88}];function vt(e){for(let s=F.length-2;s>=0;s--)if(e>=F[s].p)return s;return 0}function G(e,s,n,r,a){const i=a*a,o=i*a;return .5*(2*s+(-e+n)*a+(2*e-5*s+4*n-r)*i+(-e+3*s-3*n+r)*o)}function K(e){const s=Math.min(1,Math.max(0,e)),n=vt(s),r=F[Math.max(0,n-1)],a=F[n],i=F[Math.min(F.length-1,n+1)],o=F[Math.min(F.length-1,n+2)],l=Math.max(1e-6,i.p-a.p),t=(s-a.p)/l;return{x:G(r.x,a.x,i.x,o.x,t),y:G(r.y,a.y,i.y,o.y,t),z:G(r.z,a.z,i.z,o.z,t),fov:G(r.fov,a.fov,i.fov,o.fov,t)}}function Q(e){return D(.86,.98,e)}function W(e){return D(.84,.985,e)}function Mt(e){return D(.5,.56,e)*(1-D(.62,.7,e))}function D(e,s,n){const r=Math.min(1,Math.max(0,(n-e)/(s-e)));return r*r*(3-2*r)}function yt(e,s,n){return e+(s-e)*n}function P(e,s,n,r){return yt(e,s,1-Math.exp(-n*r))}const bt=new _(0,0,-2),wt=new _(0,0,-248);function tt({center:e,size:s=80,warm:n=0,fade:r}){const a=x.useRef(null),i=x.useRef({x:0,y:0}),o=x.useMemo(()=>new $({vertexShader:ht,fragmentShader:mt,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:e.clone()},uCamLocal:{value:new _},uFade:{value:0},uWarm:{value:n}}}),[e,n]);return C((l,t)=>{const c=a.current;if(!c)return;const{progress:f,mouse:h,reducedMotion:p,contactCollapsed:g}=I.getState();c.quaternion.copy(l.camera.quaternion),o.uniforms.uTime.value=l.clock.elapsedTime;const M=p?0:1,m=i.current;m.x=P(m.x,h.x*M,1.6,t),m.y=P(m.y,h.y*M,1.6,t),o.uniforms.uCamLocal.value.copy(l.camera.position).sub(e);const y=o.uniforms.uCamLocal.value.length();o.uniforms.uCamLocal.value.x+=m.x*y*.1,o.uniforms.uCamLocal.value.y+=-m.y*y*.07,o.uniforms.uFade.value=P(o.uniforms.uFade.value,r(f,g),4,t),c.visible=o.uniforms.uFade.value>.01}),u.jsx("mesh",{ref:a,position:e,material:o,renderOrder:5,frustumCulled:!1,children:u.jsx("planeGeometry",{args:[s,s]})})}function St(){return u.jsx(tt,{center:bt,warm:1,fade:e=>1-D(.16,.26,e)})}function jt(){return u.jsx(tt,{center:wt,size:52,warm:1.2,fade:(e,s)=>D(.16,.8,e)*(s?.3:1)})}const Y=new _;function Pt(){const e=x.useRef({p:0,fov:52,roll:0,mx:0,my:0});return C((s,n)=>{const{progress:r,mouse:a,reducedMotion:i,enterWarp:o}=I.getState(),l=s.camera,t=e.current,f=2.6-Mt(r)*1.8;t.p=P(t.p,r,f,n);const h=K(t.p),p=K(Math.max(0,t.p-.02)),g=K(Math.min(1,t.p+.02)),M={x:h.x+(g.x-p.x),y:h.y+(g.y-p.y),z:h.z+(g.z-p.z)},m=i?0:1;t.mx=P(t.mx,a.x*m,1.8,n),t.my=P(t.my,a.y*m,1.8,n),l.position.set(h.x+t.mx*.14,h.y+t.my*.09,h.z),Y.set(M.x+t.mx*.4,M.y+t.my*.26,M.z),l.lookAt(Y);const S=D(.78,1,r)*Math.PI*2,d=Q(r)*Math.sin(s.clock.elapsedTime*.5)*.05;t.roll=P(t.roll,S+d,2.2,n),l.rotation.z+=t.roll,t.fov=P(t.fov,h.fov+o*26,2.2,n),l.rotation.z+=o*.22,Math.abs(l.fov-t.fov)>.01&&(l.fov=t.fov,l.updateProjectionMatrix())}),null}function O(e,s,n){const r=Math.sin(e*127.1+s*311.7+n*74.7)*43758.5453;return r-Math.floor(r)}function zt(e,s,n){const r=Math.floor(e),a=Math.floor(s),i=e-r,o=s-a,l=i*i*(3-2*i),t=o*o*(3-2*o),c=O(r,a,n),f=O(r+1,a,n),h=O(r,a+1,n),p=O(r+1,a+1,n);return c+(f-c)*l+(h-c)*t+(c-f-h+p)*l*t}function b(e,s,n,r=5){let a=0,i=.5,o=1;for(let l=0;l<r;l++)a+=zt(e*o,s*o,n+l*13.7)*i,i*=.5,o*=2.1;return a}function w(e,s,n){return e.clone().lerp(s,Math.min(1,Math.max(0,n)))}function Rt(e,s,n,r=512){const a=r,i=r/2,o=document.createElement("canvas");o.width=a,o.height=i;const l=o.getContext("2d"),t=l.createImageData(a,i),c=new R(s.deep),f=new R(s.base),h=new R(s.high),p=new R(s.accent);for(let M=0;M<i;M++){const m=M/i,y=Math.abs(m-.5)*2;for(let S=0;S<a;S++){const v=S/a;let d;if(e==="banded"){const z=b(v*6,m*3,n,5),k=Math.sin(m*Math.PI*14+z*5+Math.sin(v*Math.PI*2)*.4);d=w(f,h,k*.5+.5),d=w(d,c,b(v*3+40,m*6,n+5,4)*.55);const j=b(v*9,m*9,n+9,4);j>.68&&(d=w(d,p,(j-.68)*2.4))}else if(e==="rocky"){const z=b(v*7,m*7,n,6);d=w(c,f,z*1.15);const k=Math.abs(b(v*12,m*12,n+3,5)-.5)*2;d=w(d,h,Math.pow(1-k,6)*.5);const j=b(v*18,m*18,n+8,3);j>.72&&(d=w(d,c,(j-.72)*2.2)),j<.2&&(d=w(d,p,(.2-j)*.9))}else if(e==="ice"){const z=b(v*5+b(v*8,m*8,n+2,4)*1.6,m*5,n,5);d=w(f,h,z),d=w(d,p,Math.pow(b(v*10,m*10,n+6,4),3)*.7),d=w(d,h,Math.pow(y,3.2)*.9),d=w(d,c,Math.pow(b(v*4,m*2,n+11,3),4)*.5)}else{const z=b(v*4,m*4,n,6),k=z>.52;d=k?w(f,h,b(v*10,m*10,n+4,4)):w(c,p,b(v*8,m*8,n+7,4)*.5),k&&z<.56&&(d=w(d,p,.4)),d=w(d,h,Math.pow(y,4)*.8);const j=b(v*6+33,m*6,n+21,5);j>.62&&(d=w(d,new R("#f5f3ee"),(j-.62)*1.6))}const T=b(v*34,m*34,n+31,3);d=w(d,c,(T-.5)*.22);const E=(M*a+S)*4;t.data[E]=d.r*255,t.data[E+1]=d.g*255,t.data[E+2]=d.b*255,t.data[E+3]=255}}l.putImageData(t,0,0);const g=new N(o);return g.colorSpace=q,g.anisotropy=8,g}function It(e,s=256){const n=s,r=s/2,a=document.createElement("canvas");a.width=n,a.height=r;const i=a.getContext("2d"),o=i.createImageData(n,r);for(let l=0;l<r;l++)for(let t=0;t<n;t++){const c=b(t/n*9,l/r*9,e,5),f=Math.abs(b(t/n*26,l/r*26,e+17,3)-.5)*2,h=(c*.75+(1-f)*.25)*255,p=(l*n+t)*4;o.data[p]=o.data[p+1]=o.data[p+2]=h,o.data[p+3]=255}return i.putImageData(o,0,0),new N(a)}function kt(e,s){const r=document.createElement("canvas");r.width=256,r.height=1;const a=r.getContext("2d"),i=a.createImageData(256,1),o=new R(e);for(let t=0;t<256;t++){const c=t/256;let f=b(c*14,.5,s,4);f*=Math.sin(c*Math.PI),b(c*30,2.5,s+4,3)>.62&&(f*=.15);const h=t*4;i.data[h]=o.r*255,i.data[h+1]=o.g*255,i.data[h+2]=o.b*255,i.data[h+3]=Math.min(1,f*1.5)*210}a.putImageData(i,0,0);const l=new N(r);return l.colorSpace=q,l}function et(e){const n=document.createElement("canvas");n.width=128,n.height=128;const r=n.getContext("2d"),a=r.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),i=new R(e),o=`${i.r*255|0},${i.g*255|0},${i.b*255|0}`;return a.addColorStop(0,`rgba(${o},0.9)`),a.addColorStop(.25,`rgba(${o},0.35)`),a.addColorStop(.6,`rgba(${o},0.08)`),a.addColorStop(1,`rgba(${o},0)`),r.fillStyle=a,r.fillRect(0,0,128,128),new N(n)}function Ct(e){const n=document.createElement("canvas");n.width=512,n.height=512;const r=n.getContext("2d"),a=r.createImageData(512,512),i=new R("#ffe3ba"),o=new R("#a9c2e8"),l=new R("#3d4a63");for(let c=0;c<512;c++)for(let f=0;f<512;f++){const h=(f/512-.5)*2,p=(c/512-.5)*2,g=h,M=p*2.7,m=Math.sqrt(g*g+M*M),y=Math.atan2(M,g),S=Math.cos(2*y-Math.log(m+.06)*5.6),v=Math.pow(Math.max(0,S),1.7),d=b(f/512*7,c/512*7,e,4);let T=Math.exp(-m*6.5)*1.6+v*Math.exp(-m*2.3)*(.3+d*.55);const E=b(m*8+y*1.6,y*3.2,e+5,3);T*=1-Math.max(0,Math.min(1,(E-.6)*3))*.5*Math.min(1,m*3);let z=w(i,o,Math.min(1,m*2.4));z=w(z,l,Math.max(0,m-.55)*1.4);const k=Math.min(1,T)*Math.max(0,Math.min(1,(1-m)*2.2)),j=(c*512+f)*4;a.data[j]=z.r*255,a.data[j+1]=z.g*255,a.data[j+2]=z.b*255,a.data[j+3]=k*235}r.putImageData(a,0,0);for(let c=0;c<240;c++){const f=O(c,7,e)*Math.PI*2,h=Math.pow(O(c,13,e),.6)*.46,p=(.5+Math.cos(f)*h)*512,g=(.5+Math.sin(f)*h/2.7)*512,M=.25+O(c,29,e)*.6;r.fillStyle=`rgba(235,240,250,${M})`,r.fillRect(p,g,1,1)}const t=new N(n);return t.colorSpace=q,t}function Tt(e,s,n){const a=document.createElement("canvas");a.width=256,a.height=256;const i=a.getContext("2d"),o=i.createImageData(256,256),l=new R(e),t=new R(s);for(let f=0;f<256;f++)for(let h=0;h<256;h++){const p=h/256,g=f/256,M=p-.5,m=g-.5,y=Math.sqrt(M*M+m*m)*2,S=b(p*4+b(p*7,g*7,n+3,4)*1.4,g*4,n,5),v=Math.max(0,S-.32)*Math.max(0,1-y)*1.4,d=w(l,t,y+(S-.5)*.6),T=(f*256+h)*4;o.data[T]=d.r*255,o.data[T+1]=d.g*255,o.data[T+2]=d.b*255,o.data[T+3]=Math.min(1,v)*165}i.putImageData(o,0,0);const c=new N(a);return c.colorSpace=q,c}function At(e,s,n=96){const r=new rt(e,s,n),a=r.attributes.position,i=r.attributes.uv,o=new _;for(let l=0;l<a.count;l++)o.fromBufferAttribute(a,l),i.setXY(l,(o.length()-e)/(s-e),.5);return r}const J=[{style:"ice",deep:"#2a3138",base:"#8d99a6",high:"#e8edf2",accent:"#aebfcc"},{style:"banded",deep:"#4a3628",base:"#a08466",high:"#d9c8ae",accent:"#e0a878"},{style:"terra",deep:"#1d2b33",base:"#5d7263",high:"#b8c4b0",accent:"#48626e"},{style:"rocky",deep:"#26221f",base:"#7d7268",high:"#c9beb2",accent:"#93826f"},{style:"banded",deep:"#2c2338",base:"#7a6a96",high:"#cfc2e8",accent:"#a98fd6"}];function Et({index:e}){const s=Z[e],n=J[e%J.length],r=x.useRef(null),a=x.useRef(null),i=x.useRef(null),o=x.useRef(null),l=x.useRef(null),t=x.useRef(0),{map:c,bump:f,glowTex:h,ringTex:p}=x.useMemo(()=>({map:Rt(n.style,n,40+e*17),bump:It(40+e*17),glowTex:et(s.emissive),ringTex:n.style==="banded"?kt("#cdbfa8",8+e):null}),[e,n,s.emissive]),g=x.useMemo(()=>p?At(s.radius*1.45,s.radius*2.35):null,[p,s.radius]),M=e/Z.length*Math.PI*2+.7;C((y,S)=>{const v=y.clock.elapsedTime,{hoveredPlanet:d,galaxySpin:T,reducedMotion:E}=I.getState(),z=r.current,k=a.current;if(!z||!k)return;const j=E?M:v*s.speed+M+T;if(z.position.set(Math.cos(j)*s.orbit,Math.sin(j*.9)*.6,Math.sin(j)*s.orbit),!E){k.rotation.y=v*.1+e;const X=l.current;X&&(X.rotation.y=v*(.35+e*.06))}const at=d===e?1:0;t.current=P(t.current,at,6,S);const ot=1+t.current*.13;k.scale.setScalar(ot);const V=o.current;V&&(V.material.opacity=.16+t.current*.4,V.scale.setScalar(s.radius*(4.6+t.current*1.6)));const U=i.current?.material;U&&(U.emissiveIntensity=.46+t.current*.5)});const m=I(y=>y.setHoveredPlanet);return u.jsxs("group",{ref:r,children:[u.jsxs("group",{ref:a,rotation:[s.tilt,0,s.tilt*.6],children:[u.jsxs("mesh",{ref:i,onPointerOver:y=>{y.stopPropagation(),m(e)},onPointerOut:()=>m(null),children:[u.jsx("sphereGeometry",{args:[s.radius,48,32]}),u.jsx("meshStandardMaterial",{map:c,bumpMap:f,bumpScale:.85,roughnessMap:f,emissive:"#ffffff",emissiveMap:c,emissiveIntensity:.46,roughness:1,metalness:0})]}),g&&p&&u.jsx("mesh",{geometry:g,rotation:[Math.PI/2.25,0,0],children:u.jsx("meshBasicMaterial",{map:p,transparent:!0,side:nt,depthWrite:!1,opacity:.85})}),u.jsx("group",{ref:l,children:s.tools.map((y,S)=>{const v=S/s.tools.length*Math.PI*2,d=s.radius*(1.9+S*.34);return u.jsxs("mesh",{position:[Math.cos(v)*d,Math.sin(v*2.3)*.22,Math.sin(v)*d],children:[u.jsx("sphereGeometry",{args:[.05+s.radius*.04,10,8]}),u.jsx("meshBasicMaterial",{color:s.emissive})]},y)})})]}),u.jsx("sprite",{ref:o,scale:s.radius*4.6,children:u.jsx("spriteMaterial",{map:h,transparent:!0,depthWrite:!1,opacity:.16,blending:L,fog:!1})})]})}function _t(){const e=x.useRef(null);return C((s,n)=>{const r=e.current;if(!r)return;const{mouse:a,reducedMotion:i,progress:o,birth:l}=I.getState();if(i)return;r.rotation.x=P(r.rotation.x,.34-a.y*.05,1.2,n),r.rotation.z=P(r.rotation.z,-.1+a.x*.04,1.2,n);const t=W(o);r.position.set(0,-1.4*(1-t),-96+-152*t),r.scale.setScalar(Math.max(.02,l*(1-t))),r.rotation.y+=n*t*1.6}),u.jsxs("group",{ref:e,position:[0,-1.4,-96],rotation:[.34,0,-.1],children:[u.jsxs("mesh",{children:[u.jsx("sphereGeometry",{args:[.5,24,16]}),u.jsx("meshBasicMaterial",{color:"#f5f3ee"})]}),u.jsx("pointLight",{color:"#fff4e0",intensity:26,distance:30,decay:2}),Z.map((s,n)=>u.jsx(Et,{index:n},n))]})}new _(-19,3,-40);const Lt=new R("#ffffff"),Ft=new R("#f2ede4"),Ot=new R("#e3e8f2");function Dt({count:e=3800}){const s=x.useRef(null),{geometry:n,material:r}=x.useMemo(()=>{const a=new Float32Array(e*3),i=new Float32Array(e),o=new Float32Array(e),l=new Float32Array(e*3),t=new R,c=.35,f=.4;for(let g=0;g<e;g++){const M=Math.random()<f;let m;if(M){const v=(Math.random()+Math.random()+Math.random()-1.5)*.3;m=c+v}else m=Math.random()*Math.PI*2;const y=10+Math.pow(Math.random(),.6)*130;a[g*3]=Math.cos(m)*y,a[g*3+1]=Math.sin(m)*y*.75,a[g*3+2]=60-Math.random()*400,i[g]=M?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,o[g]=Math.random();const S=Math.random();t.copy(S>.94?Ft:S>.86?Ot:Lt),l[g*3]=t.r,l[g*3+1]=t.g,l[g*3+2]=t.b}const h=new B;h.setAttribute("position",new A(a,3)),h.setAttribute("aSize",new A(i,1)),h.setAttribute("aPhase",new A(o,1)),h.setAttribute("aColor",new A(l,3));const p=new $({vertexShader:pt,fragmentShader:dt,transparent:!0,depthWrite:!1,blending:L,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:h,material:p}},[e]);return C((a,i)=>{r.uniforms.uTime.value=a.clock.elapsedTime;const o=s.current;if(!o)return;const{mouse:l,reducedMotion:t,progress:c,birth:f}=I.getState();r.uniforms.uSwallow.value=t?0:W(c),r.uniforms.uBirth.value=t?1:f,!t&&(o.rotation.y=P(o.rotation.y,l.x*.016,1.3,i),o.rotation.x=P(o.rotation.x,-l.y*.011,1.3,i))}),u.jsx("group",{ref:s,children:u.jsx("points",{geometry:n,material:r,frustumCulled:!1})})}function Nt({count:e=900}){const{geometry:s,material:n}=x.useMemo(()=>{const r=new Float32Array(e*3),a=new Float32Array(e),i=new Float32Array(e);for(let t=0;t<e;t++){const c=Math.random()*Math.PI*2,f=1.5+Math.pow(Math.random(),.7)*13;r[t*3]=Math.cos(c)*f,r[t*3+1]=Math.sin(c)*f*.7,r[t*3+2]=30-Math.random()*300,a[t]=.5+Math.pow(Math.random(),2)*1.6,i[t]=Math.random()}const o=new B;o.setAttribute("position",new A(r,3)),o.setAttribute("aSize",new A(a,1)),o.setAttribute("aPhase",new A(i,1));const l=new $({vertexShader:gt,fragmentShader:xt,transparent:!0,depthWrite:!1,blending:L,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMouse:{value:new st},uSwallow:{value:0},uBirth:{value:0}}});return{geometry:o,material:l}},[e]);return C((r,a)=>{n.uniforms.uTime.value=r.clock.elapsedTime;const{mouse:i,reducedMotion:o,progress:l,birth:t}=I.getState();n.uniforms.uSwallow.value=o?0:W(l),n.uniforms.uBirth.value=o?1:t;const c=n.uniforms.uMouse.value,f=o?0:1;c.x=P(c.x,i.x*f,1.8,a),c.y=P(c.y,-i.y*f,1.8,a)}),u.jsx("points",{geometry:s,material:n,frustumCulled:!1})}function Wt({count:e=320}){const s=x.useRef(null),n=x.useRef(0),r=x.useMemo(()=>{const a=new Float32Array(e*6);for(let o=0;o<e;o++){const l=Math.random()*Math.PI*2,t=3+Math.random()*15,c=Math.cos(l)*t,f=Math.sin(l)*t*.8,h=30-Math.random()*290,p=1.6+Math.random()*4.5;a.set([c,f,h,c,f,h-p],o*6)}const i=new B;return i.setAttribute("position",new A(a,3)),i},[e]);return C((a,i)=>{const o=s.current;if(!o)return;const{velocity:l,reducedMotion:t,enterWarp:c}=I.getState(),f=t?0:Math.min(1,Math.abs(l)*1.4+c);n.current=P(n.current,f,4,i),o.opacity=n.current*.34}),u.jsx("lineSegments",{geometry:r,frustumCulled:!1,children:u.jsx("lineBasicMaterial",{ref:s,color:"#dfe6f2",transparent:!0,opacity:0,blending:L,depthWrite:!1})})}function Ht({count:e=240}){const s=x.useRef(null),n=x.useMemo(()=>{const r=new Float32Array(e*6);for(let i=0;i<e;i++){const o=Math.random()*Math.PI*2,l=2.5+Math.random()*9,t=Math.cos(o)*l,c=Math.sin(o)*l,f=-128-Math.random()*150,h=5+Math.random()*13;r.set([t,c,f,t,c,f-h],i*6)}const a=new B;return a.setAttribute("position",new A(r,3)),a},[e]);return C((r,a)=>{const i=s.current;if(!i)return;const{progress:o}=I.getState();i.opacity=P(i.opacity,Q(o)*.75,5,a)}),u.jsx("lineSegments",{geometry:n,frustumCulled:!1,children:u.jsx("lineBasicMaterial",{ref:s,color:"#ffffff",transparent:!0,opacity:0,blending:L,depthWrite:!1})})}function Bt(){const e=x.useRef(null),s=x.useMemo(()=>[{inner:"#b9a8d8",outer:"#171226",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#8fb8b4",outer:"#0e1a1a",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27},{inner:"#c9a68a",outer:"#1c1410",pos:[-40,-34,-180],scale:85,seed:35},{inner:"#a3aed0",outer:"#12141f",pos:[30,40,-100],scale:75,seed:43}].map(r=>({...r,tex:Tt(r.inner,r.outer,r.seed)})),[]);return C((n,r)=>{const a=e.current;if(!a)return;const{mouse:i,reducedMotion:o,progress:l}=I.getState();if(o)return;a.rotation.y=P(a.rotation.y,i.x*.006,.8,r),a.rotation.x=P(a.rotation.x,-i.y*.004,.8,r);const{birth:t}=I.getState(),c=W(l);a.children.forEach((f,h)=>{f.rotation.z+=r*(.004+c*.12)*(h%2?1:-1);const p=s[h];p&&(f.position.set(p.pos[0]*(1-c),p.pos[1]*(1-c),p.pos[2]+(-248-p.pos[2])*c),f.scale.setScalar(p.scale*(1-c*.92)),f.material.opacity=.34*t*(1-c))})}),u.jsx("group",{ref:e,children:s.map((n,r)=>u.jsx("sprite",{position:n.pos,scale:n.scale,children:u.jsx("spriteMaterial",{map:n.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:L,fog:!1})},r))})}const H=new _(88,40,-205);function Gt(){const e=x.useRef(null),s=x.useMemo(()=>Ct(7),[]);return C((n,r)=>{const a=e.current;if(!a)return;const{progress:i,birth:o,reducedMotion:l}=I.getState(),t=a.material;if(l){t.opacity=.55;return}t.rotation+=r*.0045;const c=W(i);a.position.set(H.x*(1-c),H.y*(1-c),H.z+(-248-H.z)*c);const f=Math.max(.02,1-c*.96);a.scale.set(120*f,68*f,1),t.opacity=.55*o*(1-c)}),u.jsx("sprite",{ref:e,position:H,scale:[120,68,1],children:u.jsx("spriteMaterial",{map:s,transparent:!0,depthWrite:!1,opacity:0,rotation:-.5,blending:L,fog:!1})})}function qt({count:e=1600}){const s=x.useRef(null),n=x.useRef(null),r=x.useMemo(()=>{const a=new Float32Array(e*3);for(let o=0;o<e;o++){const l=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),c=170+Math.random()*160;a[o*3]=Math.sin(t)*Math.cos(l)*c,a[o*3+1]=Math.sin(t)*Math.sin(l)*c*.7,a[o*3+2]=-140+Math.cos(t)*c}const i=new B;return i.setAttribute("position",new A(a,3)),i},[e]);return C((a,i)=>{const o=s.current,l=n.current;if(!o||!l)return;const{progress:t,birth:c,reducedMotion:f}=I.getState();if(f){l.opacity=.4;return}o.rotation.y+=i*.0016;const h=W(t);l.opacity=.4*c*(1-h),o.scale.setScalar(Math.max(.05,1-h*.94)),o.position.z=-248*h*.7}),u.jsx("group",{ref:s,children:u.jsx("points",{geometry:r,frustumCulled:!1,children:u.jsx("pointsMaterial",{ref:n,size:.55,sizeAttenuation:!0,color:"#7d8595",transparent:!0,opacity:0,depthWrite:!1,blending:L,fog:!1})})})}function Vt(){const e=x.useRef([]),s=x.useRef(Array.from({length:3},(r,a)=>({t:-3-a*4,dur:1.4,from:new _,dir:new _}))),n=x.useMemo(()=>et("#f5f3ee"),[]);return C((r,a)=>{const{reducedMotion:i,progress:o}=I.getState(),l=r.camera.position.z;s.current.forEach((t,c)=>{const f=e.current[c];if(!f)return;if(i||o>.86){f.visible=!1;return}if(t.t+=a,t.t>t.dur){t.t=-(2+Math.random()*6),t.dur=1.1+Math.random()*.9;const g=Math.random()>.5?1:-1;t.from.set(g*(18+Math.random()*30),8+Math.random()*18,l-50-Math.random()*60),t.dir.set(-g*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/t.dur)}if(t.t<0){f.visible=!1;return}const h=t.t/t.dur;f.visible=!0,f.position.copy(t.from).addScaledVector(t.dir,t.t);const p=f.children[0].material;p.opacity=Math.sin(h*Math.PI)*.9})}),u.jsx(u.Fragment,{children:s.current.map((r,a)=>u.jsx("group",{ref:i=>{e.current[a]=i},visible:!1,children:u.jsx("sprite",{scale:[7,.35,1],children:u.jsx("spriteMaterial",{map:n,transparent:!0,depthWrite:!1,opacity:0,blending:L,rotation:-.45,fog:!1})})},a))})}function Ut(){const e=I(i=>i.reducedMotion),[s,n]=x.useState(!1);x.useEffect(()=>{const i=window.matchMedia("(max-width: 768px)"),o=()=>n(i.matches);return o(),i.addEventListener("change",o),()=>i.removeEventListener("change",o)},[]);const r=s?1600:3800,a=s?[1,1.5]:[1,2];return u.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:u.jsxs(it,{dpr:a,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,.8,15],fov:52,near:.1,far:600},style:{background:"#000000"},children:[u.jsx("color",{attach:"background",args:["#000000"]}),u.jsx("fog",{attach:"fog",args:["#000000",60,240]}),u.jsx("ambientLight",{intensity:.1}),u.jsx("directionalLight",{position:[18,26,10],intensity:.85,color:"#f2ecdf"}),u.jsxs(x.Suspense,{fallback:null,children:[u.jsx(Pt,{}),u.jsx(qt,{count:s?700:1600}),u.jsx(Gt,{}),u.jsx(Bt,{}),u.jsx(Dt,{count:r}),u.jsx(Nt,{count:s?320:900}),u.jsx(Wt,{count:s?140:320}),u.jsx(_t,{}),!s&&u.jsx(Vt,{}),u.jsx(St,{}),u.jsxs("group",{position:[0,1.2,-122],children:[u.jsxs("mesh",{children:[u.jsx("sphereGeometry",{args:[.9,32,32]}),u.jsx("meshBasicMaterial",{color:"#ffffff"})]}),u.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),u.jsx(Ht,{}),u.jsx(jt,{})]}),!e&&!s&&u.jsxs(ct,{multisampling:0,children:[u.jsx(lt,{intensity:.95,luminanceThreshold:.52,luminanceSmoothing:.87,mipmapBlur:!0}),u.jsx(ut,{opacity:.01}),u.jsx(ft,{eskil:!1,offset:.18,darkness:.92})]})]})})}export{Ut as default};
