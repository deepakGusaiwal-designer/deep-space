import{a as p,j as l}from"./motion-CpppZ9z2.js";import{u as j,V as z,S as P,C as b,b as H,d as B,A,B as D,e as T,f as q,g as V,w as K,h as Z,q as G}from"./three-AE-2SSNz.js";import{u as w}from"./index-D1tvLXvH.js";const M=[{p:0,x:0,y:.4,z:15,fov:52},{p:.1,x:0,y:.2,z:11,fov:52},{p:.18,x:2.4,y:.4,z:2,fov:55},{p:.26,x:4.2,y:.2,z:-16,fov:56},{p:.34,x:-4,y:-.3,z:-30,fov:56},{p:.42,x:3.6,y:.4,z:-44,fov:56},{p:.5,x:-3.2,y:-.2,z:-58,fov:56},{p:.56,x:0,y:0,z:-66,fov:50},{p:.62,x:0,y:0,z:-70,fov:48},{p:.72,x:0,y:.2,z:-84,fov:56},{p:.85,x:0,y:0,z:-116,fov:70},{p:.92,x:0,y:0,z:-152,fov:74},{p:1.01,x:0,y:0,z:-236,fov:88}];function $(a){for(let r=M.length-2;r>=0;r--)if(a>=M[r].p)return r;return 0}function E(a,r,n,o,e){const s=e*e,t=s*e;return .5*(2*r+(-a+n)*e+(2*a-5*r+4*n-o)*s+(-a+3*r-3*n+o)*t)}function _(a){const r=Math.min(1,Math.max(0,a)),n=$(r),o=M[Math.max(0,n-1)],e=M[n],s=M[Math.min(M.length-1,n+1)],t=M[Math.min(M.length-1,n+2)],i=Math.max(1e-6,s.p-e.p),c=(r-e.p)/i;return{x:E(o.x,e.x,s.x,t.x,c),y:E(o.y,e.y,s.y,t.y,c),z:E(o.z,e.z,s.z,t.z,c),fov:E(o.fov,e.fov,s.fov,t.fov,c)}}function O(a){return C(.86,.98,a)}function U(a){return C(.5,.56,a)*(1-C(.62,.7,a))}function C(a,r,n){const o=Math.min(1,Math.max(0,(n-a)/(r-a)));return o*o*(3-2*o)}function X(a,r,n){return a+(r-a)*n}function x(a,r,n,o){return X(a,r,1-Math.exp(-n*o))}const F=new z;function J(){const a=p.useRef({p:0,fov:52,roll:0,mx:0,my:0});return j((r,n)=>{const{progress:o,mouse:e,reducedMotion:s}=w.getState(),t=r.camera,i=a.current,m=2.6-U(o)*1.8;i.p=x(i.p,o,m,n);const f=_(i.p),u=_(Math.max(0,i.p-.02)),h=_(Math.min(1,i.p+.02)),d={x:f.x+(h.x-u.x),y:f.y+(h.y-u.y),z:f.z+(h.z-u.z)},g=s?0:1;i.mx=x(i.mx,e.x*g,1.8,n),i.my=x(i.my,e.y*g,1.8,n),t.position.set(f.x+i.mx*.14,f.y+i.my*.09,f.z),F.set(d.x+i.mx*.4,d.y+i.my*.26,d.z),t.lookAt(F);const y=C(.78,1,o)*Math.PI*2,k=O(o)*Math.sin(r.clock.elapsedTime*.5)*.05;i.roll=x(i.roll,y+k,2.2,n),t.rotation.z+=i.roll,i.fov=x(i.fov,f.fov,3.2,n),Math.abs(t.fov-i.fov)>.01&&(t.fov=i.fov,t.updateProjectionMatrix())}),null}const Q=`
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
`,ae=new z(0,0,-2),oe=new z(0,0,-248);function W({center:a,size:r=46,warm:n=0,fade:o}){const e=p.useRef(null),s=p.useRef({x:0,y:0}),t=p.useMemo(()=>new P({vertexShader:Q,fragmentShader:Y,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCenter:{value:a.clone()},uCamLocal:{value:new z},uFade:{value:0},uWarm:{value:n}}}),[a,n]);return j((i,c)=>{const m=e.current;if(!m)return;const{progress:f,mouse:u,reducedMotion:h,contactCollapsed:d}=w.getState();m.quaternion.copy(i.camera.quaternion),t.uniforms.uTime.value=i.clock.elapsedTime;const g=h?0:1,v=s.current;v.x=x(v.x,u.x*g,1.6,c),v.y=x(v.y,u.y*g,1.6,c),t.uniforms.uCamLocal.value.copy(i.camera.position).sub(a);const y=t.uniforms.uCamLocal.value.length();t.uniforms.uCamLocal.value.x+=v.x*y*.1,t.uniforms.uCamLocal.value.y+=-v.y*y*.07,t.uniforms.uFade.value=x(t.uniforms.uFade.value,o(f,d),4,c),m.visible=t.uniforms.uFade.value>.01}),l.jsx("mesh",{ref:e,position:a,material:t,renderOrder:5,frustumCulled:!1,children:l.jsx("planeGeometry",{args:[r,r]})})}function ne(){return l.jsx(W,{center:ae,warm:1,fade:a=>1-C(.16,.26,a)})}function re(){return l.jsx(W,{center:oe,size:52,warm:1,fade:(a,r)=>C(.66,.8,a)*(r?.3:1)})}function R(a,r,n){const o=Math.sin(a*127.1+r*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function se(a,r,n){const o=Math.floor(a),e=Math.floor(r),s=a-o,t=r-e,i=s*s*(3-2*s),c=t*t*(3-2*t),m=R(o,e,n),f=R(o+1,e,n),u=R(o,e+1,n),h=R(o+1,e+1,n);return m+(f-m)*i+(u-m)*c+(m-f-u+h)*i*c}function L(a,r,n,o=5){let e=0,s=.5,t=1;for(let i=0;i<o;i++)e+=se(a*t,r*t,n+i*13.7)*s,s*=.5,t*=2.1;return e}function ie(a,r,n){return a.clone().lerp(r,Math.min(1,Math.max(0,n)))}function ce(a){const n=document.createElement("canvas");n.width=128,n.height=128;const o=n.getContext("2d"),e=o.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2),s=new b(a),t=`${s.r*255|0},${s.g*255|0},${s.b*255|0}`;return e.addColorStop(0,`rgba(${t},0.9)`),e.addColorStop(.25,`rgba(${t},0.35)`),e.addColorStop(.6,`rgba(${t},0.08)`),e.addColorStop(1,`rgba(${t},0)`),o.fillStyle=e,o.fillRect(0,0,128,128),new H(n)}function le(a,r,n){const e=document.createElement("canvas");e.width=256,e.height=256;const s=e.getContext("2d"),t=s.createImageData(256,256),i=new b(a),c=new b(r);for(let f=0;f<256;f++)for(let u=0;u<256;u++){const h=u/256,d=f/256,g=h-.5,v=d-.5,y=Math.sqrt(g*g+v*v)*2,S=L(h*4+L(h*7,d*7,n+3,4)*1.4,d*4,n,5),k=Math.max(0,S-.32)*Math.max(0,1-y)*1.4,N=ie(i,c,y+(S-.5)*.6),I=(f*256+u)*4;t.data[I]=N.r*255,t.data[I+1]=N.g*255,t.data[I+2]=N.b*255,t.data[I+3]=Math.min(1,k)*165}s.putImageData(t,0,0);const m=new H(e);return m.colorSpace=B,m}const fe=new b("#ffffff"),ue=new b("#f2ede4"),de=new b("#e3e8f2");function me({count:a=3800}){const r=p.useRef(null),{geometry:n,material:o}=p.useMemo(()=>{const e=new Float32Array(a*3),s=new Float32Array(a),t=new Float32Array(a),i=new Float32Array(a*3),c=new b,m=.35,f=.4;for(let d=0;d<a;d++){const g=Math.random()<f;let v;if(g){const k=(Math.random()+Math.random()+Math.random()-1.5)*.3;v=m+k}else v=Math.random()*Math.PI*2;const y=10+Math.pow(Math.random(),.6)*130;e[d*3]=Math.cos(v)*y,e[d*3+1]=Math.sin(v)*y*.75,e[d*3+2]=60-Math.random()*400,s[d]=g?.4+Math.pow(Math.random(),3)*1.3:.6+Math.pow(Math.random(),2.2)*2.6,t[d]=Math.random();const S=Math.random();c.copy(S>.94?ue:S>.86?de:fe),i[d*3]=c.r,i[d*3+1]=c.g,i[d*3+2]=c.b}const u=new D;u.setAttribute("position",new T(e,3)),u.setAttribute("aSize",new T(s,1)),u.setAttribute("aPhase",new T(t,1)),u.setAttribute("aColor",new T(i,3));const h=new P({vertexShader:ee,fragmentShader:te,transparent:!0,depthWrite:!1,blending:A,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}});return{geometry:u,material:h}},[a]);return j((e,s)=>{o.uniforms.uTime.value=e.clock.elapsedTime;const t=r.current;if(!t)return;const{mouse:i,reducedMotion:c}=w.getState();c||(t.rotation.y=x(t.rotation.y,i.x*.016,1.3,s),t.rotation.x=x(t.rotation.x,-i.y*.011,1.3,s))}),l.jsx("group",{ref:r,children:l.jsx("points",{geometry:n,material:o,frustumCulled:!1})})}function pe({count:a=240}){const r=p.useRef(null),n=p.useMemo(()=>{const o=new Float32Array(a*6);for(let s=0;s<a;s++){const t=Math.random()*Math.PI*2,i=2.5+Math.random()*9,c=Math.cos(t)*i,m=Math.sin(t)*i,f=-128-Math.random()*150,u=5+Math.random()*13;o.set([c,m,f,c,m,f-u],s*6)}const e=new D;return e.setAttribute("position",new T(o,3)),e},[a]);return j((o,e)=>{const s=r.current;if(!s)return;const{progress:t}=w.getState();s.opacity=x(s.opacity,O(t)*.75,5,e)}),l.jsx("lineSegments",{geometry:n,frustumCulled:!1,children:l.jsx("lineBasicMaterial",{ref:r,color:"#ffffff",transparent:!0,opacity:0,blending:A,depthWrite:!1})})}function he(){const a=p.useRef(null),r=p.useMemo(()=>[{inner:"#d6d6d6",outer:"#1c1c1e",pos:[-70,26,-60],scale:95,seed:3},{inner:"#aab2bd",outer:"#131417",pos:[80,-20,-140],scale:120,seed:11},{inner:"#eaeaea",outer:"#191a1c",pos:[55,34,-220],scale:100,seed:19},{inner:"#9aa1ad",outer:"#101114",pos:[-85,-30,-260],scale:130,seed:27}].map(o=>({...o,tex:le(o.inner,o.outer,o.seed)})),[]);return j((n,o)=>{const e=a.current;if(!e)return;const{mouse:s,reducedMotion:t}=w.getState();t||(e.rotation.y=x(e.rotation.y,s.x*.006,.8,o),e.rotation.x=x(e.rotation.x,-s.y*.004,.8,o),e.children.forEach((i,c)=>{i.rotation.z+=o*.004*(c%2?1:-1)}))}),l.jsx("group",{ref:a,children:r.map((n,o)=>l.jsx("sprite",{position:n.pos,scale:n.scale,children:l.jsx("spriteMaterial",{map:n.tex,transparent:!0,depthWrite:!1,opacity:.34,blending:A,fog:!1})},o))})}function ve(){const a=p.useRef([]),r=p.useRef(Array.from({length:3},(o,e)=>({t:-3-e*4,dur:1.4,from:new z,dir:new z}))),n=p.useMemo(()=>ce("#f5f3ee"),[]);return j((o,e)=>{const{reducedMotion:s,progress:t}=w.getState(),i=o.camera.position.z;r.current.forEach((c,m)=>{const f=a.current[m];if(!f)return;if(s||t>.86){f.visible=!1;return}if(c.t+=e,c.t>c.dur){c.t=-(2+Math.random()*6),c.dur=1.1+Math.random()*.9;const d=Math.random()>.5?1:-1;c.from.set(d*(18+Math.random()*30),8+Math.random()*18,i-50-Math.random()*60),c.dir.set(-d*(26+Math.random()*18),-(14+Math.random()*10),-6).multiplyScalar(1/c.dur)}if(c.t<0){f.visible=!1;return}const u=c.t/c.dur;f.visible=!0,f.position.copy(c.from).addScaledVector(c.dir,c.t);const h=f.children[0].material;h.opacity=Math.sin(u*Math.PI)*.9})}),l.jsx(l.Fragment,{children:r.current.map((o,e)=>l.jsx("group",{ref:s=>{a.current[e]=s},visible:!1,children:l.jsx("sprite",{scale:[7,.35,1],children:l.jsx("spriteMaterial",{map:n,transparent:!0,depthWrite:!1,opacity:0,blending:A,rotation:-.45,fog:!1})})},e))})}function Me(){const a=w(s=>s.reducedMotion),[r,n]=p.useState(!1);p.useEffect(()=>{const s=window.matchMedia("(max-width: 768px)"),t=()=>n(s.matches);return t(),s.addEventListener("change",t),()=>s.removeEventListener("change",t)},[]);const o=r?1600:3800,e=r?[1,1.5]:[1,2];return l.jsx("div",{className:"fixed inset-0 z-0","aria-hidden":"true",children:l.jsxs(q,{dpr:e,gl:{antialias:!1,powerPreference:"high-performance",alpha:!1},camera:{position:[0,.8,15],fov:52,near:.1,far:600},style:{background:"#000000"},children:[l.jsx("color",{attach:"background",args:["#000000"]}),l.jsx("fog",{attach:"fog",args:["#000000",60,240]}),l.jsx("ambientLight",{intensity:.12}),l.jsxs(p.Suspense,{fallback:null,children:[l.jsx(J,{}),l.jsx(he,{}),l.jsx(me,{count:o}),!r&&l.jsx(ve,{}),l.jsx(ne,{}),l.jsxs("group",{position:[0,1.2,-122],children:[l.jsxs("mesh",{children:[l.jsx("sphereGeometry",{args:[.9,32,32]}),l.jsx("meshBasicMaterial",{color:"#ffffff"})]}),l.jsx("pointLight",{color:"#ffffff",intensity:60,distance:40,decay:2})]}),l.jsx(pe,{}),l.jsx(re,{})]}),!a&&!r&&l.jsxs(V,{multisampling:0,children:[l.jsx(K,{intensity:.95,luminanceThreshold:.52,luminanceSmoothing:.87,mipmapBlur:!0}),l.jsx(Z,{opacity:.01}),l.jsx(G,{eskil:!1,offset:.15,darkness:.8})]})]})})}export{Me as default};
