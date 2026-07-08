import{a as d,j as l}from"./motion-CpppZ9z2.js";import{u as j,V as S,S as N,C as b,b as A,d as q,A as R,B as H,e as z,f as B,g as V,w as K,h as Z,q as $}from"./three-AE-2SSNz.js";import{u as w}from"./index-BJuHqtK1.js";const y=[{p:0,x:0,y:.4,z:15,fov:52},{p:.1,x:0,y:.2,z:11,fov:52},{p:.18,x:2.4,y:.4,z:2,fov:55},{p:.26,x:4.2,y:.2,z:-16,fov:56},{p:.34,x:-4,y:-.3,z:-30,fov:56},{p:.42,x:3.6,y:.4,z:-44,fov:56},{p:.5,x:-3.2,y:-.2,z:-58,fov:56},{p:.56,x:0,y:0,z:-66,fov:50},{p:.62,x:0,y:0,z:-70,fov:48},{p:.72,x:0,y:.2,z:-84,fov:56},{p:.85,x:0,y:0,z:-116,fov:60},{p:.92,x:0,y:0,z:-152,fov:74},{p:1,x:0,y:0,z:-236,fov:88}];function G(o){for(let r=y.length-2;r>=0;r--)if(o>=y[r].p)return r;return 0}function T(o,r,n,a,e){const s=e*e,t=s*e;return .5*(2*r+(-o+n)*e+(2*o-5*r+4*n-a)*s+(-o+3*r-3*n+a)*t)}function P(o){const r=Math.min(1,Math.max(0,o)),n=G(r),a=y[Math.max(0,n-1)],e=y[n],s=y[Math.min(y.length-1,n+1)],t=y[Math.min(y.length-1,n+2)],i=Math.max(1e-6,s.p-e.p),c=(r-e.p)/i;return{x:T(a.x,e.x,s.x,t.x,c),y:T(a.y,e.y,s.y,t.y,c),z:T(a.z,e.z,s.z,t.z,c),fov:T(a.fov,e.fov,s.fov,t.fov,c)}}function D(o){return C(.86,.98,o)}function U(o){return C(.5,.56,o)*(1-C(.62,.7,o))}function C(o,r,n){const a=Math.min(1,Math.max(0,(n-o)/(r-o)));return a*a*(3-2*a)}function X(o,r,n){return o+(r-o)*n}function h(o,r,n,a){return X(o,r,1-Math.exp(-n*a))}const _=new S;function J(){const o=d.useRef({p:0,fov:52,roll:0,mx:0,my:0});return j((r,n)=>{const{progress:a,mouse:e,reducedMotion:s}=w.getState(),t=r.camera,i=o.current,m=2.6-U(a)*1.8;i.p=h(i.p,a,m,n);const u=P(i.p),f=P(Math.min(1,i.p+.02)),p=s?0:1;i.mx=h(i.mx,e.x*p,1.8,n),i.my=h(i.my,e.y*p,1.8,n),t.position.set(u.x+i.mx*.14,u.y+i.my*.09,u.z),_.set(f.x+i.mx*.4,f.y+i.my*.26,f.z),t.lookAt(_);const x=C(.78,1,a)*Math.PI*2,M=D(a)*Math.sin(r.clock.elapsedTime*.5)*.05;i.roll=h(i.roll,x+M,2.2,n),t.rotation.z+=i.roll,i.fov=h(i.fov,u.fov,3.2,n),Math.abs(t.fov-i.fov)>.01&&(t.fov=i.fov,t.updateProjectionMatrix())}),null}const Q=`
  uniform vec3 uCenter;
  varying vec3 vLocal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = world.xyz - uCenter;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,Y=`
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
`,ee=`
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (240.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`,te=`
  precision highp float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`,oe=new S(0,0,-2),ae=new S(0,0,-248);function O({center:o,size:r=46,warm:n=0,fade:a}){const e=d.useRef(null),s=d.useRef({x:0,y:0}),t=d.useMemo(()=>new N({vertexShader:Q,fragmentShader:Y,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:o.clone()},uCamLocal:{value:new S},uFade:{value:0},uWarm:{value:n}}}),[o,n]);return j((i,c)=>{const m=e.current;if(!m)return;const{progress:u,mouse:f,reducedMotion:p,contactCollapsed:v}=w.getState();m.quaternion.copy(i.camera.quaternion),t.uniforms.uTime.value=i.clock.elapsedTime;const x=p?0:1,g=s.current;g.x=h(g.x,f.x*x,1.6,c),g.y=h(g.y,f.y*x,1.6,c),t.uniforms.uCamLocal.value.copy(i.camera.position).sub(o);const M=t.uniforms.uCamLocal.value.length();t.uniforms.uCamLocal.value.x+=g.x*M*.1,t.uniforms.uCamLocal.value.y+=-g.y*M*.07,t.uniforms.uFade.value=h(t.uniforms.uFade.value,a(u,v),4,c),m.visible=t.uniforms.uFade.value>.01}),l.jsx("mesh",{ref:e,position:o,material:t,renderOrder:5,frustumCulled:!1,children:l.jsx("planeGeometry",{args:[r,r]})})}function ne(){return l.jsx(O,{center:oe,warm:1,fade:o=>1-C(.16,.26,o)})}function re(){return l.jsx(O,{center:ae,size:52,warm:1,fade:(o,r)=>C(.66,.8,o)*(r?.3:1)})}function I(o,r,n){const a=Math.sin(o*127.1+r*311.7+n*74.7)*43758.5453;return a-Math.floor(a)}function se(o,r,n){const a=Math.floor(o),e=Math.floor(r),s=o-a,t=r-e,i=s*s*(3-2*s),c=t*t*(3-2*t),m=I(a,e,n),u=I(a+1,e,n),f=I(a,e+1,n),p=I(a+1,e+1,n);return m+(u-m)*i+(f-m)*c+(m-u-f+p)*i*c}function L(o,r,n,a=5){let e=0,s=.5,t=1;for(let i=0;i<a;i++)e+=se(o*t,r*t,n+i*13.7)*s,s*=.5,t*=2.1;return e}function ie(o,r,n){return o.clone().lerp(r,Math.min(1,Math.max(0,n)))}function ce(o){const n=document.createElement("canvas");n.width=128,n.height=128;const a=n.getContext("2d"),e=a.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),s=new b(o),t=`${s.r*255|0},${s.g*255|0},${s.b*255|0}`;return e.addColorStop(0,`rgba(${t},0.9)`),e.addColorStop(.25,`rgba(${t},0.35)`),e.addColorStop(.6,`rgba(${t},0.08)`),e.addColorStop(1,`rgba(${t},0)`),a.fillStyle=e,a.fillRect(0,0,128,128),new A(n)}function le(o,r,n){const e=document.createElement("canvas");e.width=256,e.height=256;const s=e.getContext("2d"),t=s.createImageData(256,256),i=new b(o),c=new b(r);for(let u=0;u<256;u++)for(let f=0;f<256;f++){const p=f/256,v=u/256,x=p-.5,g=v-.5,M=Math.sqrt(x*x+g*g)*2,F=L(p*4+L(p*7,v*7,n+3,4)*1.4,v*4,n,5),W=Math.max(0,F-.32)*Math.max(0,1-M)*1.4,E=ie(i,c,M+(F-.5)*.6),k=(u*256+f)*4;t.data[k]=E.r*255,t.data[k+1]=E.g*255,t.data[k+2]=E.b*255,t.data[k+3]=Math.min(1,W)*165}s.putImageData(t,0,0);const m=new A(e);return m.colorSpace=q,m}const fe=new b("#ffffff"),ue=new b("#f2ede4"),me=new b("#e3e8f2");function de({count:o=3800}){const r=d.useRef(null),{geometry:n,material:a}=d.useMemo(()=>{const e=new Float32Array(o*3),s=new Float32Array(o),t=new Float32Array(o),i=new Float32Array(o*3),c=new b;for(let f=0;f<o;f++){const p=Math.random()*Math.PI*2,v=10+Math.pow(Math.random(),.6)*130;e[f*3]=Math.cos(p)*v,e[f*3+1]=Math.sin(p)*v*.75,e[f*3+2]=60-Math.random()*400,s[f]=.6+Math.pow(Math.random(),2.2)*2.6,t[f]=Math.random();const x=Math.random();c.copy(x>.94?ue:x>.86?me:fe),i[f*3]=c.r,i[f*3+1]=c.g,i[f*3+2]=c.b}const m=new H;m.setAttribute("position",new z(e,3)),m.setAttribute("aSize",new z(s,1)),m.setAttribute("aPhase",new z(t,1)),m.setAttribute("aColor",new z(i,3));const u=new N({vertexShader:ee,fragmentShader:te,transparent:!0,depthWrite:!1,blending:R,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}});return{geometry:m,material:u}},[o]);return j((e,s)=>{a.uniforms.uTime.value=e.clock.elapsedTime;const t=r.current;if(!t)return;const{mouse:i,reducedMotion:c}=w.getState();c||(t.rotation.y=h(t.rotation.y,i.x*.016,1.3,s),t.rotation.x=h(t.rotation.x,-i.y*.011,1.3,s))}),l.jsx("group",{ref:r,children:l.jsx("points",{geometry:n,material:a,frustumCulled:!1})})}function pe({count:o=240}){const r=d.useRef(null),n=d.useMemo(()=>{const a=new Float32Array(o*6);for(let s=0;s<o;s++){const t=Math.random()*Math.PI*2,i=2.5+Math.random()*9,c=Math.cos(t)*i,m=Math.sin(t)*i,u=-128-Math.random()*150,f=5+Math.random()*13;a.set([c,m,u,c,m,u-f],s*6)}const e=new H;return e.setAttribute("position",new z(a,3)),e},[o]);return j((a,e)=>{const s=r.current;if(!s)return;const{progress:t}=w.getState();s.opacity=h(s.opacity,D(t)*.75,5,e)}),l.jsx("lineSegments",{geometry:n,frustumCulled:!1,children:l.jsx("lineBasicMaterial",{ref:r,color:"#ffffff",transparent:!0,opacity:0,blending:R,depthWrite:!1})})}function he(){const o=d.useRef(null),r=d.useMemo(()=>[{inner:"#d6d6d6",outer:"#1c1c1e",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#eaeaea",outer:"#191a1c",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27}].map(a=>({...a,tex:le(a.inner,a.outer,a.seed)})),[]);return j((n,a)=>{const e=o.current;if(!e)return;const{mouse:s,reducedMotion:t}=w.getState();t||(e.rotation.y=h(e.rotation.y,s.x*.006,.8,a),e.rotation.x=h(e.rotation.x,-s.y*.004,.8,a),e.children.forEach((i,c)=>{i.rotation.z+=a*.004*(c%2?1:-1)}))}),l.jsx("group",{ref:o,children:r.map((n,a)=>l.jsx("sprite",{position:n.pos,scale:n.scale,children:l.jsx("spriteMaterial",{map:n.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:R,fog:!1})},a))})}function ve(){const o=d.useRef([]),r=d.useRef(Array.from({length:3},(a,e)=>({t:-3-e*4,dur:1.4,from:new S,dir:new S}))),n=d.useMemo(()=>ce("#f5f3ee"),[]);return j((a,e)=>{const{reducedMotion:s,progress:t}=w.getState(),i=a.camera.position.z;r.current.forEach((c,m)=>{const u=o.current[m];if(!u)return;if(s||t>.86){u.visible=!1;return}if(c.t+=e,c.t>c.dur){c.t=-(2+Math.random()*6),c.dur=1.1+Math.random()*.9;const v=Math.random()>.5?1:-1;c.from.set(v*(18+Math.random()*30),8+Math.random()*18,i-50-Math.random()*60),c.dir.set(-v*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/c.dur)}if(c.t<0){u.visible=!1;return}const f=c.t/c.dur;u.visible=!0,u.position.copy(c.from).addScaledVector(c.dir,c.t);const p=u.children[0].material;p.opacity=Math.sin(f*Math.PI)*.9})}),l.jsx(l.Fragment,{children:r.current.map((a,e)=>l.jsx("group",{ref:s=>{o.current[e]=s},visible:!1,children:l.jsx("sprite",{scale:[7,.35,1],children:l.jsx("spriteMaterial",{map:n,transparent:!0,depthWrite:!1,opacity:0,blending:R,rotation:-.45,fog:!1})})},e))})}function Me(){const o=w(s=>s.reducedMotion),[r,n]=d.useState(!1);d.useEffect(()=>{const s=window.matchMedia("(max-width: 768px)"),t=()=>n(s.matches);return t(),s.addEventListener("change",t),()=>s.removeEventListener("change",t)},[]);const a=r?1600:3800,e=r?[1,1.5]:[1,2];return l.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:l.jsxs(B,{dpr:e,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,.8,15],fov:52,near:.1,far:600},style:{background:"#000000"},children:[l.jsx("color",{attach:"background",args:["#000000"]}),l.jsx("fog",{attach:"fog",args:["#000000",60,240]}),l.jsx("ambientLight",{intensity:.12}),l.jsxs(d.Suspense,{fallback:null,children:[l.jsx(J,{}),l.jsx(he,{}),l.jsx(de,{count:a}),!r&&l.jsx(ve,{}),l.jsx(ne,{}),l.jsxs("group",{position:[0,1.2,-122],children:[l.jsxs("mesh",{children:[l.jsx("sphereGeometry",{args:[.9,32,32]}),l.jsx("meshBasicMaterial",{color:"#ffffff"})]}),l.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),l.jsx(pe,{}),l.jsx(re,{})]}),!o&&!r&&l.jsxs(V,{multisampling:0,children:[l.jsx(K,{intensity:.95,luminanceThreshold:.52,luminanceSmoothing:.87,mipmapBlur:!0}),l.jsx(Z,{opacity:.028}),l.jsx($,{eskil:!1,offset:.25,darkness:1})]})]})})}export{Me as default};
