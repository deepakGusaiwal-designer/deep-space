import"./modulepreload-polyfill-B5Qt9EMX.js";import{W as _s,A as As,c as ke,a as Cs,S as Rs,e as b,P as as,j as Es,h as y,X as Te,Y as H,t as $,Z as P,f as O,_ as F,H as re,I as R,$ as Ls,a0 as gt,a1 as rs,a2 as I,r as w,a3 as _,a4 as z,a5 as U,a6 as Se,a7 as Qe,a8 as Ve,a9 as We,aa as Z,ab as Xe,ac as Ee,ad as ks,ae as je,af as ls,i as cs,L as pe,ag as Ps,ah as Mt,ai as hs,aj as _t,ak as Is,al as st,am as Ds,an as Ns,ao as Os,ap as us,aq as zs,ar as Fs,as as Gs,n as vt,o as ds,at as yt,au as Us,av as Bs,aw as Hs,x as it,ax as js,ay as Vs,az as Ws,aA as ps,aB as Xs,aC as Ks,aD as xe,aE as qs,O as Ys,aF as $s,aG as Zs,aH as Js,aI as Qs,aJ as ms,aK as ei,y as Lt,aL as kt,aM as Pt,aN as It,C as Dt,u as ti,aO as si,aP as fs,aQ as ii,R as gs,aR as Ce,aS as ni,aT as oi,s as ai,aU as At,aV as wt,aW as vs,aX as ys,aY as ri}from"./three-CmLOTUVe.js";import{g as D}from"./gsap-xgxdCp6f.js";const X={renderer:{maxPixelRatio:1.25,shadowMapSize:1024,adaptive:{targetFPS:56,minScale:.6,maxScale:1}},physics:{gravity:0,killPlaneY:-99999,maxDelta:1/30},player:{radius:.55,accel:52,maxSpeed:16,sprintSpeed:28,groundFriction:6.5,jumpVelocity:14.8,coyoteTime:.15,jumpBuffer:.15},jetpack:{upThrust:45,forwardThrust:46,maxFlightSpeed:26,maxBoostSpeed:52,speedOfLight:110,flightDrag:1.2,normalColor:16737792,boostColor:54527},camera:{fov:55,sprintFov:68,flightFov:76,warpFov:92,distance:12,height:3.4,minPitch:-.85,maxPitch:1.35,followLerp:9,lookAhead:1.5,zoomBySpeed:2.5,collisionRadius:.4,sensitivity:.0035},fx:{landDustMin:4,ambientMotes:300}};class li{constructor(e){this.canvas=e,this.renderer=new _s({canvas:e,antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.toneMapping=As,this.renderer.toneMappingExposure=1.05,this.renderer.outputColorSpace=ke,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Cs,this.scene=new Rs,this.scene.background=new b(66054),this.camera=new as(X.camera.fov,innerWidth/innerHeight,.2,5e4),this.resScale=1,this._fpsSamples=[],this.clock=new Es,this.elapsed=0,this.updaters=new Set,this._running=!1,addEventListener("resize",()=>this._applySize()),this._applySize()}onTick(e){return this.updaters.add(e),()=>this.updaters.delete(e)}start(){this._running||(this._running=!0,this.clock.start(),this.renderer.setAnimationLoop(()=>this._frame()))}stop(){this._running=!1,this.renderer.setAnimationLoop(null)}_frame(){const e=this.clock.getDelta(),t=Math.min(e,X.physics.maxDelta);this.elapsed+=t;for(const s of this.updaters)s(t,this.elapsed);this.renderer.render(this.scene,this.camera),this._adapt(e)}_adapt(e){const{targetFPS:t,minScale:s,maxScale:i}=X.renderer.adaptive;if(this._fpsSamples.push(1/Math.max(e,1e-4)),this._fpsSamples.length<45)return;const n=this._fpsSamples.reduce((a,r)=>a+r,0)/this._fpsSamples.length;this._fpsSamples.length=0;let o=this.resScale;n<t-6?o=Math.max(s,this.resScale-.1):n>t+4&&(o=Math.min(i,this.resScale+.05)),o!==this.resScale&&(this.resScale=o,this._applySize())}_applySize(){const e=Math.min(devicePixelRatio,X.renderer.maxPixelRatio)*this.resScale;this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setPixelRatio(e),this.renderer.setSize(innerWidth,innerHeight)}}const ws={SOLID:"SOLID"},B=new y,Nt=new y,K=new y,ie=new y,nt=new Te,ot=new y,at=new y;class we{constructor(e,t={}){this.type="box",this.layer=t.layer||ws.SOLID,this.name=t.name||"Structure",this.half=e.clone(),this.mesh=t.mesh??null,this.id=t.id??null,this.hazard=t.hazard??!1,this.enabled=!0,this.restitution=t.restitution??.18,this.friction=t.friction??.08,this.center=new y,this.quaternion=new Te,this.prevCenter=new y,this.prevQuaternion=new Te,this.boundingRadius=this.half.length(),this.mesh&&this.syncFromMesh(!0)}setStatic(e,t){return this.center.copy(e),t&&this.quaternion.copy(t),this.prevCenter.copy(this.center),this.prevQuaternion.copy(this.quaternion),this}syncFromMesh(e=!1){this.mesh&&(this.prevCenter.copy(e?this.mesh.getWorldPosition(B):this.center),this.prevQuaternion.copy(e?this.mesh.getWorldQuaternion(nt):this.quaternion),this.mesh.updateWorldMatrix(!0,!1),this.mesh.matrixWorld.decompose(this.center,this.quaternion,B.set(1,1,1)))}yawDelta(){return ot.set(1,0,0).applyQuaternion(this.quaternion),at.set(1,0,0).applyQuaternion(this.prevQuaternion),Math.atan2(ot.z,ot.x)-Math.atan2(at.z,at.x)}resolveSphere(e,t){if(!this.enabled)return null;nt.copy(this.quaternion).invert(),B.copy(e).sub(this.center).applyQuaternion(nt),Nt.set(Math.max(-this.half.x,Math.min(this.half.x,B.x)),Math.max(-this.half.y,Math.min(this.half.y,B.y)),Math.max(-this.half.z,Math.min(this.half.z,B.z))),K.copy(B).sub(Nt);const s=K.lengthSq();if(s>t*t)return null;let i;if(s>1e-10){const n=Math.sqrt(s);ie.copy(K).divideScalar(n),i=t-n}else{const n=this.half.x-Math.abs(B.x),o=this.half.y-Math.abs(B.y),a=this.half.z-Math.abs(B.z);n<o&&n<a?(ie.set(Math.sign(B.x)||1,0,0),i=n+t):o<a?(ie.set(0,Math.sign(B.y)||1,0),i=o+t):(ie.set(0,0,Math.sign(B.z)||1),i=a+t)}return ie.applyQuaternion(this.quaternion),e.addScaledVector(ie,i),ie.clone()}}class ye{constructor(e,t={}){this.type="sphere",this.layer=t.layer||ws.SOLID,this.name=t.name||"Celestial Body",this.radius=e,this.mesh=t.mesh??null,this.id=t.id??null,this.hazard=t.hazard??!1,this.enabled=!0,this.restitution=t.restitution??.22,this.friction=t.friction??.06,this.center=new y,this.boundingRadius=e,t.position&&this.center.copy(t.position),this.mesh&&this.syncFromMesh()}setStatic(e){return this.center.copy(e),this}syncFromMesh(){this.mesh&&this.mesh.getWorldPosition(this.center)}resolveSphere(e,t){if(!this.enabled)return null;K.copy(e).sub(this.center);const s=K.lengthSq(),i=this.radius+t;if(s>=i*i)return null;const n=Math.sqrt(s);n>1e-6?ie.copy(K).divideScalar(n):ie.set(0,1,0);const o=i-n;return e.addScaledVector(ie,o),ie.clone()}}class $e{constructor(e,t,s,i={}){this.type="atmosphere",this.name=i.name||"Atmosphere",this.center=e.clone(),this.surfaceRadius=t,this.atmosphereRadius=s,this.gravityStrength=i.gravityStrength??14,this.color=i.color||6345983,this.enabled=!0}evaluate(e){if(!this.enabled)return null;const t=e.distanceTo(this.center);if(t>this.atmosphereRadius)return null;const s=Math.max(0,this.atmosphereRadius-t),i=this.atmosphereRadius-this.surfaceRadius,n=Math.min(1,s/Math.max(1,i)),o=Math.max(0,t-this.surfaceRadius);K.copy(this.center).sub(e).normalize();const a=K.multiplyScalar(this.gravityStrength*n);return{inside:!0,altitude:o,density:n,gravityAccel:a,color:this.color,name:this.name}}}class ci{constructor(e,t,s=200,i={}){this.center=e.clone(),this.radius=t,typeof s=="object"&&s!==null&&(i=s,s=i.killRadius??200),this.killRadius=typeof s=="number"?s:200,this.strength=typeof i.strength=="number"?i.strength:4200,this.name=i.name||"Singularity",this.enabled=!0}evaluate(e,t){if(!this.enabled)return{pull:null,consumed:!1};K.copy(this.center).sub(e);const s=K.length();if(s<this.killRadius)return{pull:null,consumed:!0,dist:s};if(s<this.radius){const i=1-s/this.radius;return{pull:K.normalize().multiplyScalar(this.strength*i*t),consumed:!1,dist:s,factor:i}}return{pull:null,consumed:!1,dist:s}}}class ze{constructor(e,t={}){this.center=(t.position??(e&&e.center?e.center:new y)).clone(),this.radius=t.radius??(e&&e.length?e.length():4),this.id=t.id??null,this.onEnter=t.onEnter??null,this.onLeave=t.onLeave??null,this.enabled=!0,this._inside=!1}setStatic(e){return this.center.copy(e),this}test(e,t=0){if(!this.enabled)return!1;const s=e.distanceToSquared(this.center),i=this.radius+t,n=s<=i*i;return n&&!this._inside?(this._inside=!0,this.onEnter?.()):!n&&this._inside&&(this._inside=!1,this.onLeave?.()),n}}class xs{constructor(e,t,s={}){this.position=e.clone(),this.radius=t,this.type=s.type||"INTERACTIVE",this.name=s.name||"Object",this.prompt=s.prompt||"[E] Interact",this.onEnter=s.onEnter||null,this.onInteract=s.onInteract||null,this.enabled=!0}test(e,t){if(!this.enabled)return!1;const s=this.radius+t;return e.distanceToSquared(this.position)<=s*s}}class hi{constructor(e={}){this.gravity=e.gravity??0,this.killPlaneY=e.killPlaneY??-99999,this.infiniteMode=!0,this.colliders=[],this.atmospheres=[],this.gravityWells=[],this.triggers=[],this.onImpact=null,this.onAtmosphereEnter=null,this.onGravityWell=null,this.proximityWarning=null}clear(){this.colliders.length=0,this.atmospheres.length=0,this.gravityWells.length=0,this.triggers.length=0,this.proximityWarning=null}addCollider(e){return this.colliders.push(e),e}removeCollider(e){const t=this.colliders.indexOf(e);t!==-1&&this.colliders.splice(t,1)}addAtmosphere(e){return this.atmospheres.push(e),e}addGravityWell(e){return this.gravityWells.push(e),e}addTrigger(e){return this.triggers.push(e),e}removeTrigger(e){const t=this.triggers.indexOf(e);t!==-1&&this.triggers.splice(t,1)}syncDynamics(){for(const e of this.colliders)e.mesh&&e.syncFromMesh()}step(e,t){if(t<=0)return!1;const s=e.groundCollider;if(e.grounded&&s&&s.mesh&&(K.copy(s.center).sub(s.prevCenter),e.position.add(K),typeof s.yawDelta=="function")){const m=s.yawDelta();Math.abs(m)>1e-6&&(B.copy(e.position).sub(s.center),B.applyAxisAngle(ie.set(0,1,0),m),e.position.copy(s.center).add(B))}let i=!1;for(const m of this.gravityWells){const g=m.evaluate(e.position,t);g.consumed&&(i=!0),g.pull&&(e.velocity.add(g.pull),this.onGravityWell?.(m.name,g.dist,g.factor))}for(const m of this.atmospheres){const g=m.evaluate(e.position);if(g){e.velocity.addScaledVector(g.gravityAccel,t);const f=Math.max(0,1-g.density*1.8*t);e.velocity.multiplyScalar(f),this.onAtmosphereEnter?.(g);break}}const n=[],o=e.position;for(const m of this.colliders){if(!m.enabled)continue;const g=m.boundingRadius+140;o.distanceToSquared(m.center)<g*g&&n.push(m)}const a=e.velocity.length(),r=Math.min(8,Math.max(3,Math.ceil(a*t/(e.radius*.35)))),l=t/r;e.grounded=!1,e.groundCollider=null,e.groundNormal=null;let c=i,h=0,d=null,p=null;for(let m=0;m<r;m++){e.position.addScaledVector(e.velocity,l);for(let g=0;g<2;g++)for(const f of n){const v=f.resolveSphere(e.position,e.radius);if(!v)continue;if(f.hazard){c=!0;continue}const x=-e.velocity.dot(v);if(x>0){x>h&&(h=x,d=v.clone(),p=f);const T=v.clone().multiplyScalar(e.velocity.dot(v)),S=e.velocity.clone().sub(T);if(S.multiplyScalar(Math.max(0,1-(f.friction||.12))),v.y>.55)if(e.grounded=!0,e.groundCollider=f,e.groundNormal=v,x<14)e.velocity.copy(S),e.velocity.y<0&&(e.velocity.y=0);else{const M=Math.min(.08,f.restitution??.05),C=v.clone().multiplyScalar(-T.dot(v)*(1+M));e.velocity.copy(S).add(C)}else{const M=f.restitution??.15,C=v.clone().multiplyScalar(-T.dot(v)*(1+M));e.velocity.copy(S).add(C)}}else v.y>.55&&(e.grounded=!0,e.groundCollider=f,e.groundNormal=v,e.velocity.y<0&&(e.velocity.y=0))}}if(h>8&&d&&p){let m=0;h>25?m=15+(h-25)*1.2:h>14&&(m=(h-14)*.8),this.onImpact?.({speed:h,normal:d,collider:p,damage:Math.min(30,m)})}for(const m of this.triggers)m.test(e.position,e.radius)&&m.onEnter?.(e);return this._computeProximityWarning(e,n),c}_computeProximityWarning(e,t){if(e.velocity.length()<4){this.proximityWarning=null;return}K.copy(e.velocity).normalize();let i=1/0,n="Obstacle";for(const o of t){B.copy(o.center).sub(e.position);const a=B.dot(K);if(a>0&&a<80){const r=B.lengthSq()-a*a,l=(o.boundingRadius||5)+e.radius;if(r<l*l){const c=a-l;c<i&&(i=Math.max(1,c),n=o.name||"Obstacle")}}}i<60?this.proximityWarning={distance:Math.round(i),name:n,threatLevel:i<15?"CRITICAL":i<35?"HIGH":"MEDIUM"}:this.proximityWarning=null}}const Ke=`
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
`,Ct=`
  float mFresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(clamp(1.0 - dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
  }
`,ui=`
  vec3 mGradient(vec3 a, vec3 b, float t) {
    return mix(a, b, smoothstep(0.0, 1.0, t));
  }
`,Ot={vertex:`
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
  `,fragment:`
    uniform float uTime;
    uniform float uOpen;      // 0 = solid barrier, 1 = fully dissolved
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${Ke}
    ${Ct}
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
  `},et={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${Ke}
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
  `},zt={vertex:et.vertex,fragment:`
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
  `},Ft={vertex:`
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
  `,fragment:`
    uniform float uTime;
    uniform float uLit;       // 1 once the checkpoint is claimed
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${Ct}
    ${ui}
    void main() {
      float fade = pow(1.0 - vUv.y, 1.6);                 // dissolve toward the top
      float fres = 1.0 - mFresnel(vNormal, vViewDir, 0.7); // brightest at grazing center
      float flicker = 0.9 + 0.1 * sin(uTime * 3.0 + vUv.y * 10.0);
      float a = fade * fres * flicker * mix(0.18, 0.65, uLit);
      vec3 col = mGradient(uColor, vec3(1.0), vUv.y * 0.4 + uLit * 0.2);
      gl_FragColor = vec4(col * 1.4, a);
    }
  `},Gt={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${Ke}
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
  `},Ut={vertex:`
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,fragment:`
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    ${Ct}
    void main() {
      float fres = mFresnel(vNormal, vViewDir, 2.6);
      gl_FragColor = vec4(uColor * 1.6, fres * 0.85);
    }
  `},Bt={vertex:et.vertex,fragment:`
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float r = length(vUv - 0.5) * 2.0;
      float a = pow(smoothstep(1.0, 0.0, r), 2.2) * uStrength;
      gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    }
  `};function _e(u,e,t,s=""){return u.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;
${Ke}`).replace("#include <color_fragment>",`#include <color_fragment>
{ vec3 wp = vMonPos; ${t} }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
{ vec3 wp = vMonPos; ${s} }`)},u.customProgramCacheKey=()=>e,u}class di{constructor(){this.cache=new Map,this.animated=[]}concrete(){return this._get("concrete",()=>{const e=new H({color:2633270,roughness:.38,metalness:.78,envMapIntensity:1.25,clearcoat:.3,clearcoatRoughness:.35});return _e(e,"mon-concrete",`
        // Sci-fi modular hull plating grid (2m panels)
        vec2 grid = abs(fract(wp.xz * 0.5) - 0.5);
        float seam = smoothstep(0.04, 0.01, min(grid.x, grid.y));
        
        // Hexagonal sub-tile pattern
        float hex = mNoise(wp * 4.5);
        float speckle = mNoise(wp * 22.0);
        float scratches = smoothstep(0.88, 0.99, mNoise(wp * vec3(1.2, 45.0, 1.2)));

        diffuseColor.rgb *= 0.88 + hex * 0.12 + speckle * 0.06 - seam * 0.45 + scratches * 0.25;
      `,`
        vec2 grid = abs(fract(wp.xz * 0.5) - 0.5);
        float seam = smoothstep(0.04, 0.01, min(grid.x, grid.y));
        roughnessFactor = clamp(roughnessFactor + seam * 0.4 - mFbm(wp * 1.5) * 0.1, 0.1, 0.9);
      `)})}marble(){return this._get("marble",()=>{const e=new H({color:1843496,roughness:.25,metalness:.85,envMapIntensity:1.4,clearcoat:.6,clearcoatRoughness:.15});return _e(e,"mon-marble",`
        vec2 grid = abs(fract(wp.xz * 0.33) - 0.5);
        float seam = smoothstep(0.03, 0.01, min(grid.x, grid.y));
        float carbon = mNoise(wp * vec3(28.0, 2.0, 28.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.35, 0.45, 0.55), carbon * 0.15);
        diffuseColor.rgb *= 1.0 - seam * 0.5;
      `,`
        roughnessFactor = clamp(roughnessFactor + mNoise(wp * 12.0) * 0.1, 0.1, 0.8);
      `)})}metal(){return this._get("metal",()=>{const e=new H({color:3818062,roughness:.32,metalness:.95,envMapIntensity:1.35});return _e(e,"mon-metal",`
        float brush = mNoise(wp * vec3(0.4, 30.0, 30.0));
        float scratches = smoothstep(0.85, 0.98, mNoise(wp * vec3(1.0, 60.0, 60.0)));
        diffuseColor.rgb *= 0.85 + brush * 0.18 + scratches * 0.22;
      `,`
        float streak = mNoise(wp * vec3(0.4, 30.0, 30.0));
        roughnessFactor = clamp(roughnessFactor + (streak - 0.5) * 0.2, 0.05, 0.9);
      `)})}chrome(){return this._get("chrome",()=>{const e=new H({color:1776929,roughness:.1,metalness:1,envMapIntensity:1.5,clearcoat:1,clearcoatRoughness:.05});return _e(e,"mon-chrome",`
        diffuseColor.rgb *= 0.985 + mNoise(wp * 40.0) * 0.03;
      `)})}glass(){return this._get("glass",()=>{const e=new H({color:2237994,roughness:.5,metalness:0,envMapIntensity:1.2,transparent:!0,opacity:.4,side:$,depthWrite:!1});return _e(e,"mon-glass",`
        diffuseColor.rgb += (mFbm(wp * 2.0) - 0.5) * 0.05;
      `,`
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 6.0) - 0.5) * 0.2, 0.2, 1.0);
      `)})}basalt(){return this._get("basalt",()=>{const e=new H({color:1711135,roughness:.88,metalness:.1,envMapIntensity:.35});return _e(e,"mon-basalt",`
        float pits = smoothstep(0.7, 0.98, mNoise(wp * 5.0));
        diffuseColor.rgb *= 0.82 + mFbm(wp * 0.6) * 0.34 + mNoise(wp * 30.0) * 0.07 - pits * 0.18;
      `,`
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 30.0) - 0.5) * 0.16, 0.0, 1.0);
      `)})}gold(){return this._get("gold",()=>new P({color:1313539,emissive:new b(16758627),emissiveIntensity:2.6,roughness:.4,metalness:.2}))}laserBeam(){return this._get("laser",()=>new P({color:1704706,emissive:new b(16721432),emissiveIntensity:3.4,roughness:.5,metalness:0}))}windows(){return this._get("windows",()=>{const e=new H({color:1316636,roughness:.55,metalness:.4,emissive:new b(16761707),emissiveIntensity:1.7,envMapIntensity:.6});return e.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;
${Ke}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          {
            vec3 wp = vMonPos;
            vec2 grid = vec2(wp.x + wp.z, wp.y) * vec2(1.45, 1.2);
            vec2 id = floor(grid);
            vec2 f = fract(grid);
            float win = step(0.3, f.x) * step(f.x, 0.72) * step(0.25, f.y) * step(f.y, 0.68);
            float lit = step(0.45, mHash(vec3(id, 7.0)));      // some homes are dark
            float warmth = 0.45 + mHash(vec3(id, 13.0)) * 0.8; // per-window brightness
            totalEmissiveRadiance *= win * lit * warmth;
          }`)},e.customProgramCacheKey=()=>"mon-windows",e})}gate(e=10217727){const t=new O({vertexShader:Ot.vertex,fragmentShader:Ot.fragment,uniforms:{uTime:{value:0},uOpen:{value:0},uColor:{value:new b(e)}},transparent:!0,side:$,depthWrite:!1,blending:F});return this.animated.push(t),t}portal(e=10217727){const t=new O({vertexShader:et.vertex,fragmentShader:et.fragment,uniforms:{uTime:{value:0},uColor:{value:new b(e)}},transparent:!0,side:$,depthWrite:!1,blending:F});return this.animated.push(t),t}pad(e=10217727){const t=new O({vertexShader:zt.vertex,fragmentShader:zt.fragment,uniforms:{uTime:{value:0},uActive:{value:0},uColor:{value:new b(e)}},transparent:!0,depthWrite:!1,blending:F});return this.animated.push(t),t}beacon(e=16767392){const t=new O({vertexShader:Ft.vertex,fragmentShader:Ft.fragment,uniforms:{uTime:{value:0},uLit:{value:0},uColor:{value:new b(e)}},transparent:!0,side:$,depthWrite:!1,blending:F});return this.animated.push(t),t}blackholeDisk(e=16757867){const t=new O({vertexShader:Gt.vertex,fragmentShader:Gt.fragment,uniforms:{uTime:{value:0},uColor:{value:new b(e)}},transparent:!0,side:$,depthWrite:!1,blending:F});return this.animated.push(t),t}halo(e=10471679){return new O({vertexShader:Ut.vertex,fragmentShader:Ut.fragment,uniforms:{uColor:{value:new b(e)}},transparent:!0,depthWrite:!1,blending:F})}contactShadow(){return new O({vertexShader:Bt.vertex,fragmentShader:Bt.fragment,uniforms:{uStrength:{value:.55}},transparent:!0,depthWrite:!1})}update(e){for(const t of this.animated)t.uniforms.uTime.value=e}dispose(){for(const e of this.cache.values())e.dispose();for(const e of this.animated)e.dispose();this.cache.clear(),this.animated.length=0}_get(e,t){return this.cache.has(e)||this.cache.set(e,t()),this.cache.get(e)}}function pi(u,e=!1){const t=u[0].index!==null,s=new Set(Object.keys(u[0].attributes)),i=new Set(Object.keys(u[0].morphAttributes)),n={},o={},a=u[0].morphTargetsRelative,r=new re;let l=0;for(let c=0;c<u.length;++c){const h=u[c];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in h.attributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;n[p]===void 0&&(n[p]=[]),n[p].push(h.attributes[p]),d++}if(d!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in h.morphAttributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(h.morphAttributes[p])}if(e){let p;if(t)p=h.index.count;else if(h.attributes.position!==void 0)p=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;r.addGroup(l,p,c),l+=p}}if(t){let c=0;const h=[];for(let d=0;d<u.length;++d){const p=u[d].index;for(let m=0;m<p.count;++m)h.push(p.getX(m)+c);c+=u[d].attributes.position.count}r.setIndex(h)}for(const c in n){const h=Ht(n[c]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;r.setAttribute(c,h)}for(const c in o){const h=o[c][0].length;if(h===0)break;r.morphAttributes=r.morphAttributes||{},r.morphAttributes[c]=[];for(let d=0;d<h;++d){const p=[];for(let g=0;g<o[c].length;++g)p.push(o[c][g][d]);const m=Ht(p);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;r.morphAttributes[c].push(m)}}return r}function Ht(u){let e,t,s,i=-1,n=0;for(let l=0;l<u.length;++l){const c=u[l];if(e===void 0&&(e=c.array.constructor),e!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=c.itemSize),t!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=c.normalized),s!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=c.gpuType),i!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;n+=c.count*t}const o=new e(n),a=new R(o,t,s);let r=0;for(let l=0;l<u.length;++l){const c=u[l];if(c.isInterleavedBufferAttribute){const h=r/t;for(let d=0,p=c.count;d<p;d++)for(let m=0;m<t;m++){const g=c.getComponent(d,m);a.setComponent(d+h,m,g)}}else o.set(c.array,r);r+=c.count*t}return i!==void 0&&(a.gpuType=i),a}function jt(u,e){if(e===Ls)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),u;if(e===gt||e===rs){let t=u.getIndex();if(t===null){const o=[],a=u.getAttribute("position");if(a!==void 0){for(let r=0;r<a.count;r++)o.push(r);u.setIndex(o),t=u.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),u}const s=t.count-2,i=[];if(e===gt)for(let o=1;o<=s;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<s;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==s&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const n=u.clone();return n.setIndex(i),n.clearGroups(),n}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),u}const Fe=new y;function ee(u,e,t,s,i,n){const o=2*Math.PI*i/4,a=Math.max(n-2*i,0),r=Math.PI/4;Fe.copy(e),Fe[s]=0,Fe.normalize();const l=.5*o/(o+a),c=1-Fe.angleTo(u)/r;return Math.sign(Fe[t])===1?c*l:a/(o+a)+l+l*(1-c)}class Pe extends I{constructor(e=1,t=1,s=1,i=2,n=.1){const o=i*2+1;if(n=Math.min(e/2,t/2,s/2,n),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:s,segments:i,radius:n},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const r=new y,l=new y,c=new y(e,t,s).divideScalar(2).subScalar(n),h=this.attributes.position.array,d=this.attributes.normal.array,p=this.attributes.uv.array,m=h.length/6,g=new y,f=.5/o;for(let v=0,x=0;v<h.length;v+=3,x+=2)switch(r.fromArray(h,v),l.copy(r),l.x-=Math.sign(l.x)*f,l.y-=Math.sign(l.y)*f,l.z-=Math.sign(l.z)*f,l.normalize(),h[v+0]=c.x*Math.sign(r.x)+l.x*n,h[v+1]=c.y*Math.sign(r.y)+l.y*n,h[v+2]=c.z*Math.sign(r.z)+l.z*n,d[v+0]=l.x,d[v+1]=l.y,d[v+2]=l.z,Math.floor(v/m)){case 0:g.set(1,0,0),p[x+0]=ee(g,l,"z","y",n,s),p[x+1]=1-ee(g,l,"y","z",n,t);break;case 1:g.set(-1,0,0),p[x+0]=1-ee(g,l,"z","y",n,s),p[x+1]=1-ee(g,l,"y","z",n,t);break;case 2:g.set(0,1,0),p[x+0]=1-ee(g,l,"x","z",n,e),p[x+1]=ee(g,l,"z","x",n,s);break;case 3:g.set(0,-1,0),p[x+0]=1-ee(g,l,"x","z",n,e),p[x+1]=1-ee(g,l,"z","x",n,s);break;case 4:g.set(0,0,1),p[x+0]=1-ee(g,l,"x","y",n,e),p[x+1]=1-ee(g,l,"y","x",n,t);break;case 5:g.set(0,0,-1),p[x+0]=ee(g,l,"x","y",n,e),p[x+1]=1-ee(g,l,"y","x",n,t);break}}static fromJSON(e){return new Pe(e.width,e.height,e.depth,e.segments,e.radius)}}const ne=(u,e,t)=>Math.min(t,Math.max(e,u)),k=(u,e)=>1-Math.exp(-u*e);function Vt(u,e,t,s){let i=(e-u+Math.PI)%(Math.PI*2)-Math.PI;return i<-Math.PI&&(i+=Math.PI*2),u+i*k(t,s)}function mi(u){let e=u>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function Wt(u){const e=Math.floor(u/60),t=Math.floor(u%60),s=Math.floor(u%1*100);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}.${String(s).padStart(2,"0")}`}const tt=new Ee,xt=new Te,Re=new Ve,fi=new y,Y=u=>new y(u[0],u[1],u[2]);function q(u,e,t,s,i=[0,0,0],n=.06){var a;const o=new Pe(s[0],s[1],s[2],2,Math.min(n,Math.min(...s)*.24));tt.set(i[0],i[1],i[2]),xt.setFromEuler(tt),Re.compose(Y(t),xt,fi.set(1,1,1)),o.applyMatrix4(Re),((a=u.batches)[e]??(a[e]=[])).push(o)}function Ge(u,e,t,s=[0,0,0]){tt.set(s[0],s[1],s[2]);const i=new we(new y(t[0]/2,t[1]/2,t[2]/2));return i.setStatic(Y(e),xt.setFromEuler(tt)),u.physics.addCollider(i),i}function rt(u,e,t,s,i={}){const n=new Pe(s[0],s[1],s[2],2,Math.min(.06,Math.min(...s)*.24)),o=new w(n,u.materials[e]());o.position.set(t[0],t[1],t[2]),o.castShadow=!0,o.receiveShadow=!0,u.solids.add(o);const a=new we(new y(s[0]/2,s[1]/2,s[2]/2),{mesh:i.colliderMesh??o,id:i.id??null});return u.physics.addCollider(a),{mesh:o,collider:a}}const bt={platform(u,e){const t=e.mat??"concrete";q(u,t,e.pos,e.size,e.rot),Ge(u,e.pos,e.size,e.rot);const[s,i,n]=e.size;if(e.skirt!==!1){const o=e.skirtDepth??5;if(q(u,"basalt",[e.pos[0],e.pos[1]-i/2-o/2+.05,e.pos[2]],[s*.65,o,n*.65],[0,0,0],.08),s>=6&&n>=6){const r=s*.38,l=n*.38,c=e.pos[1]-i/2-o/2;q(u,"metal",[e.pos[0]+r,c,e.pos[2]+l],[.5,o,.5]),q(u,"metal",[e.pos[0]-r,c,e.pos[2]+l],[.5,o,.5]),q(u,"metal",[e.pos[0]+r,c,e.pos[2]-l],[.5,o,.5]),q(u,"metal",[e.pos[0]-r,c,e.pos[2]-l],[.5,o,.5])}}if(e.glow!==!1&&!e.rot){const o=e.pos[1]+i/2+.02,a=.12,r=.03;q(u,"gold",[e.pos[0],o,e.pos[2]+n/2-.2],[s-.6,r,a],[0,0,0],.02),q(u,"gold",[e.pos[0],o,e.pos[2]-n/2+.2],[s-.6,r,a],[0,0,0],.02),q(u,"gold",[e.pos[0]+s/2-.2,o,e.pos[2]],[a,r,n-.6],[0,0,0],.02),q(u,"gold",[e.pos[0]-s/2+.2,o,e.pos[2]],[a,r,n-.6],[0,0,0],.02)}},ramp(u,e){bt.platform(u,{...e,skirt:e.skirt??!1})},bridge(u,e){const t=Y(e.from),s=Y(e.to),i=t.clone().add(s).multiplyScalar(.5),n=t.distanceTo(s),o=Math.atan2(s.x-t.x,s.z-t.z);bt.platform(u,{pos:[i.x,i.y,i.z],size:[e.width??2.4,e.thickness??.7,n],rot:[0,o,0],mat:e.mat??"metal",skirt:!1})},rotator(u,e){const{mesh:t}=rt(u,e.mat??"metal",e.pos,e.size),s=e.axis??"y",i={};i[s]=`+=${Math.PI*2*(e.reverse?-1:1)}`,u.tweens.push(D.to(t.rotation,{...i,duration:e.duration??4,ease:"none",repeat:-1}))},slider(u,e){const{mesh:t}=rt(u,e.mat??"metal",e.pos,e.size);u.tweens.push(D.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3,ease:e.ease??"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0,repeatDelay:e.repeatDelay??0}))},elevator(u,e){const{mesh:t}=rt(u,e.mat??"metal",e.pos,e.size),s=D.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3.2,ease:"sine.inOut",repeat:-1,yoyo:!0,repeatDelay:e.repeatDelay??.8,paused:!!e.triggerId});u.tweens.push(s),e.triggerId&&u.actions.set(e.triggerId,()=>s.play())},pendulum(u,e){const t=new _;t.position.set(e.pos[0],e.pos[1],e.pos[2]),u.solids.add(t);const s=e.length??4,i=new Pe(e.thickness??.6,s,e.thickness??.6,2,.05),n=new w(i,u.materials[e.mat??"metal"]());n.position.y=-s/2,n.castShadow=!0,n.receiveShadow=!0,t.add(n),u.physics.addCollider(new we(new y((e.thickness??.6)/2,s/2,(e.thickness??.6)/2),{mesh:n})),t.rotation.z=-(e.swing??.85),u.tweens.push(D.to(t.rotation,{z:e.swing??.85,duration:e.duration??1.6,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0}))},gate(u,e){const[t,s]=e.size,i=e.yaw??0,n=Math.cos(i),o=Math.sin(i),a=[.45,s+.6,.45],r=(t/2+.2)*n,l=-(t/2+.2)*o;for(const m of[1,-1]){const g=[e.pos[0]+r*m,e.pos[1],e.pos[2]+l*m];q(u,"metal",g,a,[0,i,0]),Ge(u,g,a,[0,i,0])}const c=[e.pos[0],e.pos[1]+s/2+.35,e.pos[2]];q(u,"metal",c,[t+1.3,.5,.45],[0,i,0]),Ge(u,c,[t+1.3,.5,.45],[0,i,0]);const h=u.materials.gate(u.accent),d=new w(new Xe(t,s),h);d.position.set(e.pos[0],e.pos[1],e.pos[2]),d.rotation.y=i,u.group.add(d);const p=Ge(u,e.pos,[t,s,.3],[0,i,0]);u.actions.set(e.id,()=>{p.enabled=!1,D.to(h.uniforms.uOpen,{value:1,duration:1.1,ease:"power2.inOut"}),u.world.onGateOpen?.(Y(e.pos))})},pad(u,e){const t=new w(new Z(.95,1.05,.16,28),u.materials.metal());t.position.set(e.pos[0],e.pos[1],e.pos[2]),t.receiveShadow=!0,u.group.add(t);const s=u.materials.pad(u.accent),i=new w(new Xe(2.4,2.4),s);i.rotation.x=-Math.PI/2,i.position.set(e.pos[0],e.pos[1]+.1,e.pos[2]),u.group.add(i),u.physics.addTrigger(new ze(Y(e.pos),1.3,()=>{D.to(s.uniforms.uActive,{value:1,duration:.5});for(const n of e.targets??[])u.actions.get(n)?.();u.world.onPad?.(Y(e.pos))}))},checkpoint(u,e){const t=Y(e.pos),s=new w(new Z(1.1,1.2,.14,32),u.materials.marble());s.position.copy(t),s.receiveShadow=!0,u.group.add(s);const i=new _;i.position.set(t.x,t.y+1.5,t.z),u.group.add(i);const n=u.materials.blackholeDisk(9071173),o=new w(new Qe(.15,1,48,1),n);o.rotation.x=-Math.PI/2,i.add(o);const a=new w(new Se(1.06,.045,12,48),u.materials.chrome());a.rotation.x=Math.PI/2,i.add(a);const r=new w(new z(1.05,28,16),u.materials.halo(16767392));r.scale.y=.28,i.add(r),u.physics.addTrigger(new ze(t,1.5,()=>{const l=new b(u.accent);D.to(n.uniforms.uColor.value,{r:l.r,g:l.g,b:l.b,duration:.7}),D.fromTo(i.scale,{x:1.5,y:1.5,z:1.5},{x:1,y:1,z:1,duration:.9,ease:"expo.out"}),u.world.onCheckpoint?.(new y(t.x,t.y+1.2,t.z))}))},portal(u,e){const t=Y(e.pos),s=new _;s.position.copy(t),s.rotation.y=e.yaw??0,u.group.add(s);const i=new w(new We(.68,40),new U({color:0,side:$}));s.add(i);const n=new w(new Qe(.3,1.9,64,1),u.materials.blackholeDisk(u.accent));n.position.z=.01,s.add(n);const o=new w(new Se(1.95,.05,12,64),new U({color:16774108}));s.add(o);const a=new w(new z(2,32,20),u.materials.halo(u.accent));a.scale.z=.3,s.add(a),u.physics.addTrigger(new ze(t,1.5,()=>u.world.onPortal?.(t))),u.portalPos=t},skyline(u,e){var r,l;const t=mi(e.seed??7),[s,,i]=e.center??[0,0,0],n=e.radius??85,o=e.count??56,a=e.baseY??-30;for(let c=0;c<o;c++){const h=t()*Math.PI*2,d=n*(.8+t()*.7),p=4+t()*9,m=4+t()*9,g=20+t()*55,f=s+Math.cos(h)*d,v=i+Math.sin(h)*d,x=new I(p,g,m).toNonIndexed();Re.makeTranslation(f,a+g/2,v),x.applyMatrix4(Re),((r=u.batches).basalt??(r.basalt=[])).push(x);const T=t()<.75?1+Math.floor(t()*2):0;for(let S=0;S<T;S++){const M=new I(p+.12,.12,m+.12).toNonIndexed();Re.makeTranslation(f,a+g*(.25+t()*.65),v),M.applyMatrix4(Re),((l=u.batches).gold??(l.gold=[])).push(M)}}},laser(u,e){const t=Y(e.from),s=Y(e.to),i=t.clone().add(s).multiplyScalar(.5),n=t.distanceTo(s),o=s.clone().sub(t).normalize(),a=new Te().setFromUnitVectors(new y(0,0,1),o),r=new w(new I(.07,.07,n),u.materials.laserBeam());r.position.copy(i),r.quaternion.copy(a),u.group.add(r);for(const c of[t,s])q(u,"metal",[c.x,c.y,c.z],[.34,.34,.34],[0,0,0],.03);const l=new we(new y(.1,.1,n/2),{hazard:!0});l.setStatic(i,a),u.physics.addCollider(l)},blackhole(u,e){const t=Y(e.pos),s=e.scale??1,i=new _;i.position.copy(t),u.group.add(i);const n=new w(new z(1.1*s,40,24),new U({color:0}));i.add(n);const o=new w(new z(1.32*s,40,24),u.materials.halo(e.haloColor??10471679));i.add(o);const a=new w(new Se(1.42*s,.045*s,12,72),new U({color:16774108})),r=new w(new Qe(1.35*s,3.4*s,72,1),u.materials.blackholeDisk(e.color??16757867)),l=e.tilt??1.25;for(const c of[a,r])c.rotation.x=l,i.add(c);u.tweens.push(D.to(i.rotation,{y:Math.PI*2,duration:90/(e.spin??1),ease:"none",repeat:-1})),e.pull&&u.physics.addAttractor({position:t,radius:e.radius??10*s,strength:e.strength??24,killRadius:1.35*s})},wormhole(u,e){const t=e.color??16764554,s=Y(e.a),i=Y(e.b),n=(o,a=0)=>{const r=new _;r.position.copy(o),r.rotation.y=a,u.group.add(r);const l=new w(new Se(1.55,.12,16,56),u.materials.chrome());l.castShadow=!0,r.add(l);const c=new w(new We(1.45,44),u.materials.portal(t));r.add(c);const h=new w(new z(1.65,32,20),u.materials.halo(t));return h.scale.z=.35,r.add(h),r};n(s,e.yawA??0),n(i,e.yawB??e.yawA??0),u.world.wormholeMouths.push(s.clone(),i.clone()),u.physics.addTrigger(new ze(s,1.35,()=>u.world.onWormhole?.({pos:i.clone(),from:s.clone()}),{once:!1})),e.bidirectional!==!1&&u.physics.addTrigger(new ze(i,1.35,()=>u.world.onWormhole?.({pos:s.clone(),from:i.clone()}),{once:!1}))},decor(u,e){const t=new Pe(e.size[0],e.size[1],e.size[2],2,.08),s=new w(t,u.materials[e.mat??"glass"]());s.position.set(e.pos[0],e.pos[1],e.pos[2]),e.rot&&s.rotation.set(e.rot[0],e.rot[1],e.rot[2]),s.castShadow=e.mat!=="glass",u.group.add(s);const i=e.drift??.6;u.tweens.push(D.to(s.position,{y:e.pos[1]+i,duration:3+Math.random()*3,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:Math.random()*2})),u.tweens.push(D.to(s.rotation,{y:`+=${(Math.random()-.5)*1.4}`,duration:6+Math.random()*5,ease:"sine.inOut",repeat:-1,yoyo:!0}))},pillar(u,e){q(u,e.mat??"concrete",e.pos,e.size,e.rot??[0,0,0]),e.solid&&Ge(u,e.pos,e.size,e.rot??[0,0,0])}};class gi{constructor(e,t,s){this.scene=e,this.physics=t,this.materials=s,this.group=new _,this.solids=new _,e.add(this.group,this.solids),this.tweens=[],this.actions=new Map,this.portalPos=null,this.wormholeMouths=[],this.accent=10217727,this.onCheckpoint=null,this.onPortal=null,this.onPad=null,this.onGateOpen=null,this.onWormhole=null}build(e){return this.load(e)}load(e){this.clear(),this.accent=e.accent??10217727;const t={world:this,physics:this.physics,materials:this._materialProxy(),group:this.group,solids:this.solids,batches:{},tweens:this.tweens,actions:this.actions,accent:this.accent,portalPos:null};for(const s of e.objects){const i=bt[s.type];if(!i){console.warn(`[World] unknown component "${s.type}"`);continue}i(t,s)}this.portalPos=t.portalPos;for(const[s,i]of Object.entries(t.batches)){const n=pi(i,!1);for(const a of i)a.dispose();const o=new w(n,this.materials[s]());o.castShadow=!0,o.receiveShadow=!0,this.solids.add(o)}return{spawn:new y(...e.spawn)}}update(){this.physics.syncDynamics()}clear(){for(const e of this.tweens)e.kill();this.tweens.length=0,this.actions.clear(),this.portalPos=null,this.wormholeMouths.length=0;for(const e of[this.group,this.solids])for(const t of[...e.children])t.traverse(s=>{if(s.geometry&&s.geometry.dispose(),s.material?.uniforms){s.material.dispose();const i=this.materials.animated.indexOf(s.material);i>=0&&this.materials.animated.splice(i,1)}}),e.remove(t)}_materialProxy(){const e=this.materials;return{concrete:()=>e.concrete(),marble:()=>e.marble(),metal:()=>e.metal(),chrome:()=>e.chrome(),glass:()=>e.glass(),basalt:()=>e.basalt(),gate:t=>e.gate(t),pad:t=>e.pad(t),beacon:t=>e.beacon(t),portal:t=>e.portal(t),halo:t=>e.halo(t),blackholeDisk:t=>e.blackholeDisk(t),gold:()=>e.gold(),laserBeam:()=>e.laserBeam()}}}class vi{constructor(e){this.group=new _,e.add(this.group),this.ready=!0}update(){}clear(){this.group.clear()}}class yi extends ks{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ti(t)}),this.register(function(t){return new Mi(t)}),this.register(function(t){return new Ii(t)}),this.register(function(t){return new Di(t)}),this.register(function(t){return new Ni(t)}),this.register(function(t){return new Ai(t)}),this.register(function(t){return new Ci(t)}),this.register(function(t){return new Ri(t)}),this.register(function(t){return new Ei(t)}),this.register(function(t){return new Si(t)}),this.register(function(t){return new Li(t)}),this.register(function(t){return new _i(t)}),this.register(function(t){return new Pi(t)}),this.register(function(t){return new ki(t)}),this.register(function(t){return new xi(t)}),this.register(function(t){return new Oi(t)}),this.register(function(t){return new zi(t)})}load(e,t,s,i){const n=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=je.extractUrlBase(e);o=je.resolveURL(l,this.path)}else o=je.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){i?i(l):console.error(l),n.manager.itemError(e),n.manager.itemEnd(e)},r=new ls(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,function(l){try{n.parse(l,o,function(c){t(c),n.manager.itemEnd(e)},a)}catch(c){a(c)}},s,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,s,i){let n;const o={},a={},r=new TextDecoder;if(typeof e=="string")n=JSON.parse(e);else if(e instanceof ArrayBuffer)if(r.decode(new Uint8Array(e,0,4))===bs){try{o[E.KHR_BINARY_GLTF]=new Fi(e)}catch(h){i&&i(h);return}n=JSON.parse(o[E.KHR_BINARY_GLTF].content)}else n=JSON.parse(r.decode(e));else n=e;if(n.asset===void 0||n.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Zi(n,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){const h=this.pluginCallbacks[c](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(n.extensionsUsed)for(let c=0;c<n.extensionsUsed.length;++c){const h=n.extensionsUsed[c],d=n.extensionsRequired||[];switch(h){case E.KHR_MATERIALS_UNLIT:o[h]=new bi;break;case E.KHR_DRACO_MESH_COMPRESSION:o[h]=new Gi(n,this.dracoLoader);break;case E.KHR_TEXTURE_TRANSFORM:o[h]=new Ui;break;case E.KHR_MESH_QUANTIZATION:o[h]=new Bi;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(s,i)}parseAsync(e,t){const s=this;return new Promise(function(i,n){s.parse(e,t,i,n)})}}function wi(){let u={};return{get:function(e){return u[e]},add:function(e,t){u[e]=t},remove:function(e){delete u[e]},removeAll:function(){u={}}}}const E={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class xi{constructor(e){this.parser=e,this.name=E.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let s=0,i=t.length;s<i;s++){const n=t[s];n.extensions&&n.extensions[this.name]&&n.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,n.extensions[this.name].light)}}_loadLight(e){const t=this.parser,s="light:"+e;let i=t.cache.get(s);if(i)return i;const n=t.json,r=((n.extensions&&n.extensions[this.name]||{}).lights||[])[e];let l;const c=new b(16777215);r.color!==void 0&&c.setRGB(r.color[0],r.color[1],r.color[2],pe);const h=r.range!==void 0?r.range:0;switch(r.type){case"directional":l=new hs(c),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Mt(c),l.distance=h;break;case"spot":l=new Ps(c),l.distance=h,r.spot=r.spot||{},r.spot.innerConeAngle=r.spot.innerConeAngle!==void 0?r.spot.innerConeAngle:0,r.spot.outerConeAngle=r.spot.outerConeAngle!==void 0?r.spot.outerConeAngle:Math.PI/4,l.angle=r.spot.outerConeAngle,l.penumbra=1-r.spot.innerConeAngle/r.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+r.type)}return l.position.set(0,0,0),ae(l,r),r.intensity!==void 0&&(l.intensity=r.intensity),l.name=t.createUniqueName(r.name||"light_"+e),i=Promise.resolve(l),t.cache.add(s,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,s=this.parser,n=s.json.nodes[e],a=(n.extensions&&n.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(r){return s._getNodeRef(t.cache,a,r)})}}class bi{constructor(){this.name=E.KHR_MATERIALS_UNLIT}getMaterialType(){return U}extendParams(e,t,s){const i=[];e.color=new b(1,1,1),e.opacity=1;const n=t.pbrMetallicRoughness;if(n){if(Array.isArray(n.baseColorFactor)){const o=n.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],pe),e.opacity=o[3]}n.baseColorTexture!==void 0&&i.push(s.assignTexture(e,"map",n.baseColorTexture,ke))}return Promise.all(i)}}class Si{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=i.extensions[this.name].emissiveStrength;return n!==void 0&&(t.emissiveIntensity=n),Promise.resolve()}}class Ti{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&n.push(s.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&n.push(s.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(n.push(s.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new cs(a,a)}return Promise.all(n)}}class Mi{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_DISPERSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=i.extensions[this.name];return t.dispersion=n.dispersion!==void 0?n.dispersion:0,Promise.resolve()}}class _i{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&n.push(s.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&n.push(s.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(n)}}class Ai{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_SHEEN}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[];t.sheenColor=new b(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],pe)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&n.push(s.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ke)),o.sheenRoughnessTexture!==void 0&&n.push(s.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(n)}}class Ci{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&n.push(s.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(n)}}class Ri{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_VOLUME}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&n.push(s.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new b().setRGB(a[0],a[1],a[2],pe),Promise.all(n)}}class Ei{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_IOR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=i.extensions[this.name];return t.ior=n.ior!==void 0?n.ior:1.5,Promise.resolve()}}class Li{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_SPECULAR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&n.push(s.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new b().setRGB(a[0],a[1],a[2],pe),o.specularColorTexture!==void 0&&n.push(s.assignTexture(t,"specularColorMap",o.specularColorTexture,ke)),Promise.all(n)}}class ki{constructor(e){this.parser=e,this.name=E.EXT_MATERIALS_BUMP}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&n.push(s.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(n)}}class Pi{constructor(e){this.parser=e,this.name=E.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:H}extendMaterialParams(e,t){const s=this.parser,i=s.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const n=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&n.push(s.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(n)}}class Ii{constructor(e){this.parser=e,this.name=E.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,s=t.json,i=s.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const n=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(s.extensionsRequired&&s.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,n.source,o)}}class Di{constructor(e){this.parser=e,this.name=E.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,s=this.parser,i=s.json,n=i.textures[e];if(!n.extensions||!n.extensions[t])return null;const o=n.extensions[t],a=i.images[o.source];let r=s.textureLoader;if(a.uri){const l=s.options.manager.getHandler(a.uri);l!==null&&(r=l)}return s.loadTextureImage(e,o.source,r)}}class Ni{constructor(e){this.parser=e,this.name=E.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,s=this.parser,i=s.json,n=i.textures[e];if(!n.extensions||!n.extensions[t])return null;const o=n.extensions[t],a=i.images[o.source];let r=s.textureLoader;if(a.uri){const l=s.options.manager.getHandler(a.uri);l!==null&&(r=l)}return s.loadTextureImage(e,o.source,r)}}class Oi{constructor(e){this.name=E.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,s=t.bufferViews[e];if(s.extensions&&s.extensions[this.name]){const i=s.extensions[this.name],n=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return n.then(function(a){const r=i.byteOffset||0,l=i.byteLength||0,c=i.count,h=i.byteStride,d=new Uint8Array(a,r,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(c,h,d,i.mode,i.filter).then(function(p){return p.buffer}):o.ready.then(function(){const p=new ArrayBuffer(c*h);return o.decodeGltfBuffer(new Uint8Array(p),c,h,d,i.mode,i.filter),p})})}else return null}}class zi{constructor(e){this.name=E.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,s=t.nodes[e];if(!s.extensions||!s.extensions[this.name]||s.mesh===void 0)return null;const i=t.meshes[s.mesh];for(const l of i.primitives)if(l.mode!==se.TRIANGLES&&l.mode!==se.TRIANGLE_STRIP&&l.mode!==se.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=s.extensions[this.name].attributes,a=[],r={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(c=>(r[l]=c,r[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const c=l.pop(),h=c.isGroup?c.children:[c],d=l[0].count,p=[];for(const m of h){const g=new Ve,f=new y,v=new Te,x=new y(1,1,1),T=new _t(m.geometry,m.material,d);for(let S=0;S<d;S++)r.TRANSLATION&&f.fromBufferAttribute(r.TRANSLATION,S),r.ROTATION&&v.fromBufferAttribute(r.ROTATION,S),r.SCALE&&x.fromBufferAttribute(r.SCALE,S),T.setMatrixAt(S,g.compose(f,v,x));for(const S in r)if(S==="_COLOR_0"){const M=r[S];T.instanceColor=new Is(M.array,M.itemSize,M.normalized)}else S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"&&m.geometry.setAttribute(S,r[S]);st.prototype.copy.call(T,m),this.parser.assignFinalMaterial(T),p.push(T)}return c.isGroup?(c.clear(),c.add(...p),c):p[0]}))}}const bs="glTF",Ue=12,Xt={JSON:1313821514,BIN:5130562};class Fi{constructor(e){this.name=E.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ue),s=new TextDecoder;if(this.header={magic:s.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==bs)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ue,n=new DataView(e,Ue);let o=0;for(;o<i;){const a=n.getUint32(o,!0);o+=4;const r=n.getUint32(o,!0);if(o+=4,r===Xt.JSON){const l=new Uint8Array(e,Ue+o,a);this.content=s.decode(l)}else if(r===Xt.BIN){const l=Ue+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Gi{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=E.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const s=this.json,i=this.dracoLoader,n=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},r={},l={};for(const c in o){const h=St[c]||c.toLowerCase();a[h]=o[c]}for(const c in e.attributes){const h=St[c]||c.toLowerCase();if(o[c]!==void 0){const d=s.accessors[e.attributes[c]],p=Le[d.componentType];l[h]=p.name,r[h]=d.normalized===!0}}return t.getDependency("bufferView",n).then(function(c){return new Promise(function(h,d){i.decodeDracoFile(c,function(p){for(const m in p.attributes){const g=p.attributes[m],f=r[m];f!==void 0&&(g.normalized=f)}h(p)},a,l,pe,d)})})}}class Ui{constructor(){this.name=E.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Bi{constructor(){this.name=E.KHR_MESH_QUANTIZATION}}class Ss extends si{constructor(e,t,s,i){super(e,t,s,i)}copySampleValue_(e){const t=this.resultBuffer,s=this.sampleValues,i=this.valueSize,n=e*i*3+i;for(let o=0;o!==i;o++)t[o]=s[n+o];return t}interpolate_(e,t,s,i){const n=this.resultBuffer,o=this.sampleValues,a=this.valueSize,r=a*2,l=a*3,c=i-t,h=(s-t)/c,d=h*h,p=d*h,m=e*l,g=m-l,f=-2*p+3*d,v=p-d,x=1-f,T=v-d+h;for(let S=0;S!==a;S++){const M=o[g+S+a],C=o[g+S+r]*c,A=o[m+S+a],N=o[m+S]*c;n[S]=x*M+T*C+f*A+v*N}return n}}const Hi=new Te;class ji extends Ss{interpolate_(e,t,s,i){const n=super.interpolate_(e,t,s,i);return Hi.fromArray(n).normalize().toArray(n),n}}const se={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Le={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Kt={9728:ds,9729:vt,9984:Gs,9985:Fs,9986:zs,9987:us},qt={33071:Bs,33648:Us,10497:yt},lt={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},St={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ve={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Vi={CUBICSPLINE:void 0,LINEAR:ms,STEP:Qs},ct={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Wi(u){return u.DefaultMaterial===void 0&&(u.DefaultMaterial=new P({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ti})),u.DefaultMaterial}function be(u,e,t){for(const s in t.extensions)u[s]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[s]=t.extensions[s])}function ae(u,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(u.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Xi(u,e,t){let s=!1,i=!1,n=!1;for(let l=0,c=e.length;l<c;l++){const h=e[l];if(h.POSITION!==void 0&&(s=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(n=!0),s&&i&&n)break}if(!s&&!i&&!n)return Promise.resolve(u);const o=[],a=[],r=[];for(let l=0,c=e.length;l<c;l++){const h=e[l];if(s){const d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):u.attributes.position;o.push(d)}if(i){const d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):u.attributes.normal;a.push(d)}if(n){const d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):u.attributes.color;r.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(r)]).then(function(l){const c=l[0],h=l[1],d=l[2];return s&&(u.morphAttributes.position=c),i&&(u.morphAttributes.normal=h),n&&(u.morphAttributes.color=d),u.morphTargetsRelative=!0,u})}function Ki(u,e){if(u.updateMorphTargets(),e.weights!==void 0)for(let t=0,s=e.weights.length;t<s;t++)u.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(u.morphTargetInfluences.length===t.length){u.morphTargetDictionary={};for(let s=0,i=t.length;s<i;s++)u.morphTargetDictionary[t[s]]=s}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function qi(u){let e;const t=u.extensions&&u.extensions[E.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ht(t.attributes):e=u.indices+":"+ht(u.attributes)+":"+u.mode,u.targets!==void 0)for(let s=0,i=u.targets.length;s<i;s++)e+=":"+ht(u.targets[s]);return e}function ht(u){let e="";const t=Object.keys(u).sort();for(let s=0,i=t.length;s<i;s++)e+=t[s]+":"+u[t[s]]+";";return e}function Tt(u){switch(u){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Yi(u){return u.search(/\.jpe?g($|\?)/i)>0||u.search(/^data\:image\/jpeg/)===0?"image/jpeg":u.search(/\.webp($|\?)/i)>0||u.search(/^data\:image\/webp/)===0?"image/webp":u.search(/\.ktx2($|\?)/i)>0||u.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const $i=new Ve;class Zi{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new wi,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let s=!1,i=-1,n=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;s=/^((?!chrome|android).)*safari/i.test(a)===!0;const r=a.match(/Version\/(\d+)/);i=s&&r?parseInt(r[1],10):-1,n=a.indexOf("Firefox")>-1,o=n?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||s&&i<17||n&&o<98?this.textureLoader=new Ds(this.options.manager):this.textureLoader=new Ns(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ls(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const s=this,i=this.json,n=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([s.getDependencies("scene"),s.getDependencies("animation"),s.getDependencies("camera")])}).then(function(o){const a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:s,userData:{}};return be(n,a,i),ae(a,i),Promise.all(s._invokeAll(function(r){return r.afterRoot&&r.afterRoot(a)})).then(function(){for(const r of a.scenes)r.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],s=this.json.meshes||[];for(let i=0,n=t.length;i<n;i++){const o=t[i].joints;for(let a=0,r=o.length;a<r;a++)e[o[a]].isBone=!0}for(let i=0,n=e.length;i<n;i++){const o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(s[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,s){if(e.refs[t]<=1)return s;const i=s.clone(),n=(o,a)=>{const r=this.associations.get(o);r!=null&&this.associations.set(a,r);for(const[l,c]of o.children.entries())n(c,a.children[l])};return n(s,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let s=0;s<t.length;s++){const i=e(t[s]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const s=[];for(let i=0;i<t.length;i++){const n=e(t[i]);n&&s.push(n)}return s}getDependency(e,t){const s=e+":"+t;let i=this.cache.get(s);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(n){return n.loadNode&&n.loadNode(t)});break;case"mesh":i=this._invokeOne(function(n){return n.loadMesh&&n.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(n){return n.loadBufferView&&n.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(n){return n.loadMaterial&&n.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(n){return n.loadTexture&&n.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(n){return n.loadAnimation&&n.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(s,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const s=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(n,o){return s.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],s=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[E.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(n,o){s.load(je.resolveURL(t.uri,i.path),n,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(s){const i=t.byteLength||0,n=t.byteOffset||0;return s.slice(n,n+i)})}loadAccessor(e){const t=this,s=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const o=lt[i.type],a=Le[i.componentType],r=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new R(l,o,r))}const n=[];return i.bufferView!==void 0?n.push(this.getDependency("bufferView",i.bufferView)):n.push(null),i.sparse!==void 0&&(n.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),n.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(n).then(function(o){const a=o[0],r=lt[i.type],l=Le[i.componentType],c=l.BYTES_PER_ELEMENT,h=c*r,d=i.byteOffset||0,p=i.bufferView!==void 0?s.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0;let g,f;if(p&&p!==h){const v=Math.floor(d/p),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+v+":"+i.count;let T=t.cache.get(x);T||(g=new l(a,v*p,i.count*p/c),T=new Os(g,p/c),t.cache.add(x,T)),f=new ei(T,r,d%p/c,m)}else a===null?g=new l(i.count*r):g=new l(a,d,i.count*r),f=new R(g,r,m);if(i.sparse!==void 0){const v=lt.SCALAR,x=Le[i.sparse.indices.componentType],T=i.sparse.indices.byteOffset||0,S=i.sparse.values.byteOffset||0,M=new x(o[1],T,i.sparse.count*v),C=new l(o[2],S,i.sparse.count*r);a!==null&&(f=new R(f.array.slice(),f.itemSize,f.normalized)),f.normalized=!1;for(let A=0,N=M.length;A<N;A++){const G=M[A];if(f.setX(G,C[A*r]),r>=2&&f.setY(G,C[A*r+1]),r>=3&&f.setZ(G,C[A*r+2]),r>=4&&f.setW(G,C[A*r+3]),r>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}f.normalized=m}return f})}loadTexture(e){const t=this.json,s=this.options,n=t.textures[e].source,o=t.images[n];let a=this.textureLoader;if(o.uri){const r=s.manager.getHandler(o.uri);r!==null&&(a=r)}return this.loadTextureImage(e,n,a)}loadTextureImage(e,t,s){const i=this,n=this.json,o=n.textures[e],a=n.images[t],r=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[r])return this.textureCache[r];const l=this.loadImageSource(t,s).then(function(c){c.flipY=!1,c.name=o.name||a.name||"",c.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(c.name=a.uri);const d=(n.samplers||{})[o.sampler]||{};return c.magFilter=Kt[d.magFilter]||vt,c.minFilter=Kt[d.minFilter]||us,c.wrapS=qt[d.wrapS]||yt,c.wrapT=qt[d.wrapT]||yt,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==ds&&c.minFilter!==vt,i.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[r]=l,l}loadImageSource(e,t){const s=this,i=this.json,n=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const o=i.images[e],a=self.URL||self.webkitURL;let r=o.uri||"",l=!1;if(o.bufferView!==void 0)r=s.getDependency("bufferView",o.bufferView).then(function(h){l=!0;const d=new Blob([h],{type:o.mimeType});return r=a.createObjectURL(d),r});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const c=Promise.resolve(r).then(function(h){return new Promise(function(d,p){let m=d;t.isImageBitmapLoader===!0&&(m=function(g){const f=new Lt(g);f.needsUpdate=!0,d(f)}),t.load(je.resolveURL(h,n.path),m,void 0,p)})}).then(function(h){return l===!0&&a.revokeObjectURL(r),ae(h,o),h.userData.mimeType=o.mimeType||Yi(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",r),h});return this.sourceCache[e]=c,c}assignTexture(e,t,s,i){const n=this;return this.getDependency("texture",s.index).then(function(o){if(!o)return null;if(s.texCoord!==void 0&&s.texCoord>0&&(o=o.clone(),o.channel=s.texCoord),n.extensions[E.KHR_TEXTURE_TRANSFORM]){const a=s.extensions!==void 0?s.extensions[E.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const r=n.associations.get(o);o=n.extensions[E.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),n.associations.set(o,r)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let s=e.material;const i=t.attributes.tangent===void 0,n=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+s.uuid;let r=this.cache.get(a);r||(r=new Hs,it.prototype.copy.call(r,s),r.color.copy(s.color),r.map=s.map,r.sizeAttenuation=!1,this.cache.add(a,r)),s=r}else if(e.isLine){const a="LineBasicMaterial:"+s.uuid;let r=this.cache.get(a);r||(r=new js,it.prototype.copy.call(r,s),r.color.copy(s.color),r.map=s.map,this.cache.add(a,r)),s=r}if(i||n||o){let a="ClonedMaterial:"+s.uuid+":";i&&(a+="derivative-tangents:"),n&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let r=this.cache.get(a);r||(r=s.clone(),n&&(r.vertexColors=!0),o&&(r.flatShading=!0),i&&(r.normalScale&&(r.normalScale.y*=-1),r.clearcoatNormalScale&&(r.clearcoatNormalScale.y*=-1)),this.cache.add(a,r),this.associations.set(r,this.associations.get(s))),s=r}e.material=s}getMaterialType(){return P}loadMaterial(e){const t=this,s=this.json,i=this.extensions,n=s.materials[e];let o;const a={},r=n.extensions||{},l=[];if(r[E.KHR_MATERIALS_UNLIT]){const h=i[E.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),l.push(h.extendParams(a,n,t))}else{const h=n.pbrMetallicRoughness||{};if(a.color=new b(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],pe),a.opacity=d[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",h.baseColorTexture,ke)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}n.doubleSided===!0&&(a.side=$);const c=n.alphaMode||ct.OPAQUE;if(c===ct.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,c===ct.MASK&&(a.alphaTest=n.alphaCutoff!==void 0?n.alphaCutoff:.5)),n.normalTexture!==void 0&&o!==U&&(l.push(t.assignTexture(a,"normalMap",n.normalTexture)),a.normalScale=new cs(1,1),n.normalTexture.scale!==void 0)){const h=n.normalTexture.scale;a.normalScale.set(h,h)}if(n.occlusionTexture!==void 0&&o!==U&&(l.push(t.assignTexture(a,"aoMap",n.occlusionTexture)),n.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=n.occlusionTexture.strength)),n.emissiveFactor!==void 0&&o!==U){const h=n.emissiveFactor;a.emissive=new b().setRGB(h[0],h[1],h[2],pe)}return n.emissiveTexture!==void 0&&o!==U&&l.push(t.assignTexture(a,"emissiveMap",n.emissiveTexture,ke)),Promise.all(l).then(function(){const h=new o(a);return n.name&&(h.name=n.name),ae(h,n),t.associations.set(h,{materials:e}),n.extensions&&be(i,h,n),h})}createUniqueName(e){const t=Vs.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,s=this.extensions,i=this.primitiveCache;function n(a){return s[E.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(r){return Yt(r,a,t)})}const o=[];for(let a=0,r=e.length;a<r;a++){const l=e[a],c=qi(l),h=i[c];if(h)o.push(h.promise);else{let d;l.extensions&&l.extensions[E.KHR_DRACO_MESH_COMPRESSION]?d=n(l):d=Yt(new re,l,t),i[c]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,s=this.json,i=this.extensions,n=s.meshes[e],o=n.primitives,a=[];for(let r=0,l=o.length;r<l;r++){const c=o[r].material===void 0?Wi(this.cache):this.getDependency("material",o[r].material);a.push(c)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(r){const l=r.slice(0,r.length-1),c=r[r.length-1],h=[];for(let p=0,m=c.length;p<m;p++){const g=c[p],f=o[p];let v;const x=l[p];if(f.mode===se.TRIANGLES||f.mode===se.TRIANGLE_STRIP||f.mode===se.TRIANGLE_FAN||f.mode===void 0)v=n.isSkinnedMesh===!0?new Ws(g,x):new w(g,x),v.isSkinnedMesh===!0&&v.normalizeSkinWeights(),f.mode===se.TRIANGLE_STRIP?v.geometry=jt(v.geometry,rs):f.mode===se.TRIANGLE_FAN&&(v.geometry=jt(v.geometry,gt));else if(f.mode===se.LINES)v=new ps(g,x);else if(f.mode===se.LINE_STRIP)v=new Xs(g,x);else if(f.mode===se.LINE_LOOP)v=new Ks(g,x);else if(f.mode===se.POINTS)v=new xe(g,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+f.mode);Object.keys(v.geometry.morphAttributes).length>0&&Ki(v,n),v.name=t.createUniqueName(n.name||"mesh_"+e),ae(v,n),f.extensions&&be(i,v,f),t.assignFinalMaterial(v),h.push(v)}for(let p=0,m=h.length;p<m;p++)t.associations.set(h[p],{meshes:e,primitives:p});if(h.length===1)return n.extensions&&be(i,h[0],n),h[0];const d=new _;n.extensions&&be(i,d,n),t.associations.set(d,{meshes:e});for(let p=0,m=h.length;p<m;p++)d.add(h[p]);return d})}loadCamera(e){let t;const s=this.json.cameras[e],i=s[s.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return s.type==="perspective"?t=new as(qs.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):s.type==="orthographic"&&(t=new Ys(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),s.name&&(t.name=this.createUniqueName(s.name)),ae(t,s),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],s=[];for(let i=0,n=t.joints.length;i<n;i++)s.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?s.push(this.getDependency("accessor",t.inverseBindMatrices)):s.push(null),Promise.all(s).then(function(i){const n=i.pop(),o=i,a=[],r=[];for(let l=0,c=o.length;l<c;l++){const h=o[l];if(h){a.push(h);const d=new Ve;n!==null&&d.fromArray(n.array,l*16),r.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new $s(a,r)})}loadAnimation(e){const t=this.json,s=this,i=t.animations[e],n=i.name?i.name:"animation_"+e,o=[],a=[],r=[],l=[],c=[];for(let h=0,d=i.channels.length;h<d;h++){const p=i.channels[h],m=i.samplers[p.sampler],g=p.target,f=g.node,v=i.parameters!==void 0?i.parameters[m.input]:m.input,x=i.parameters!==void 0?i.parameters[m.output]:m.output;g.node!==void 0&&(o.push(this.getDependency("node",f)),a.push(this.getDependency("accessor",v)),r.push(this.getDependency("accessor",x)),l.push(m),c.push(g))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(r),Promise.all(l),Promise.all(c)]).then(function(h){const d=h[0],p=h[1],m=h[2],g=h[3],f=h[4],v=[];for(let T=0,S=d.length;T<S;T++){const M=d[T],C=p[T],A=m[T],N=g[T],G=f[T];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();const J=s._createAnimationTracks(M,C,A,N,G);if(J)for(let Q=0;Q<J.length;Q++)v.push(J[Q])}const x=new Zs(n,void 0,v);return ae(x,i),x})}createNodeMesh(e){const t=this.json,s=this,i=t.nodes[e];return i.mesh===void 0?null:s.getDependency("mesh",i.mesh).then(function(n){const o=s._getNodeRef(s.meshCache,i.mesh,n);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let r=0,l=i.weights.length;r<l;r++)a.morphTargetInfluences[r]=i.weights[r]}),o})}loadNode(e){const t=this.json,s=this,i=t.nodes[e],n=s._loadNodeShallow(e),o=[],a=i.children||[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));const r=i.skin===void 0?Promise.resolve(null):s.getDependency("skin",i.skin);return Promise.all([n,Promise.all(o),r]).then(function(l){const c=l[0],h=l[1],d=l[2];d!==null&&c.traverse(function(p){p.isSkinnedMesh&&p.bind(d,$i)});for(let p=0,m=h.length;p<m;p++)c.add(h[p]);return c})}_loadNodeShallow(e){const t=this.json,s=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const n=t.nodes[e],o=n.name?i.createUniqueName(n.name):"",a=[],r=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return r&&a.push(r),n.camera!==void 0&&a.push(i.getDependency("camera",n.camera).then(function(l){return i._getNodeRef(i.cameraCache,n.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let c;if(n.isBone===!0?c=new Js:l.length>1?c=new _:l.length===1?c=l[0]:c=new st,c!==l[0])for(let h=0,d=l.length;h<d;h++)c.add(l[h]);if(n.name&&(c.userData.name=n.name,c.name=o),ae(c,n),n.extensions&&be(s,c,n),n.matrix!==void 0){const h=new Ve;h.fromArray(n.matrix),c.applyMatrix4(h)}else n.translation!==void 0&&c.position.fromArray(n.translation),n.rotation!==void 0&&c.quaternion.fromArray(n.rotation),n.scale!==void 0&&c.scale.fromArray(n.scale);if(!i.associations.has(c))i.associations.set(c,{});else if(n.mesh!==void 0&&i.meshCache.refs[n.mesh]>1){const h=i.associations.get(c);i.associations.set(c,{...h})}return i.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){const t=this.extensions,s=this.json.scenes[e],i=this,n=new _;s.name&&(n.name=i.createUniqueName(s.name)),ae(n,s),s.extensions&&be(t,n,s);const o=s.nodes||[],a=[];for(let r=0,l=o.length;r<l;r++)a.push(i.getDependency("node",o[r]));return Promise.all(a).then(function(r){for(let c=0,h=r.length;c<h;c++)n.add(r[c]);const l=c=>{const h=new Map;for(const[d,p]of i.associations)(d instanceof it||d instanceof Lt)&&h.set(d,p);return c.traverse(d=>{const p=i.associations.get(d);p!=null&&h.set(d,p)}),h};return i.associations=l(n),n})}_createAnimationTracks(e,t,s,i,n){const o=[],a=e.name?e.name:e.uuid,r=[];ve[n.path]===ve.weights?e.traverse(function(d){d.morphTargetInfluences&&r.push(d.name?d.name:d.uuid)}):r.push(a);let l;switch(ve[n.path]){case ve.weights:l=Pt;break;case ve.rotation:l=It;break;case ve.translation:case ve.scale:l=kt;break;default:s.itemSize===1?l=Pt:l=kt;break}const c=i.interpolation!==void 0?Vi[i.interpolation]:ms,h=this._getArrayFromAccessor(s);for(let d=0,p=r.length;d<p;d++){const m=new l(r[d]+"."+ve[n.path],t.array,h,c);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),o.push(m)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const s=Tt(t.constructor),i=new Float32Array(t.length);for(let n=0,o=t.length;n<o;n++)i[n]=t[n]*s;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(s){const i=this instanceof It?ji:Ss;return new i(this.times,this.values,this.getValueSize()/3,s)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Ji(u,e,t){const s=e.attributes,i=new fs;if(s.POSITION!==void 0){const a=t.json.accessors[s.POSITION],r=a.min,l=a.max;if(r!==void 0&&l!==void 0){if(i.set(new y(r[0],r[1],r[2]),new y(l[0],l[1],l[2])),a.normalized){const c=Tt(Le[a.componentType]);i.min.multiplyScalar(c),i.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const n=e.targets;if(n!==void 0){const a=new y,r=new y;for(let l=0,c=n.length;l<c;l++){const h=n[l];if(h.POSITION!==void 0){const d=t.json.accessors[h.POSITION],p=d.min,m=d.max;if(p!==void 0&&m!==void 0){if(r.setX(Math.max(Math.abs(p[0]),Math.abs(m[0]))),r.setY(Math.max(Math.abs(p[1]),Math.abs(m[1]))),r.setZ(Math.max(Math.abs(p[2]),Math.abs(m[2]))),d.normalized){const g=Tt(Le[d.componentType]);r.multiplyScalar(g)}a.max(r)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}u.boundingBox=i;const o=new ii;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,u.boundingSphere=o}function Yt(u,e,t){const s=e.attributes,i=[];function n(o,a){return t.getDependency("accessor",o).then(function(r){u.setAttribute(a,r)})}for(const o in s){const a=St[o]||o.toLowerCase();a in u.attributes||i.push(n(s[o],a))}if(e.indices!==void 0&&!u.index){const o=t.getDependency("accessor",e.indices).then(function(a){u.setIndex(a)});i.push(o)}return Dt.workingColorSpace!==pe&&"COLOR_0"in s&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Dt.workingColorSpace}" not supported.`),ae(u,e),Ji(u,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Xi(u,e.targets,t):u})}class Qi{constructor(){this.maxHealth=100,this.health=100,this.maxOxygen=100,this.oxygen=100,this.maxFuel=100,this.fuel=100,this.maxEnergy=100,this.energy=100,this.isDead=!1,this.isOxygenLow=!1,this.isJetpackOffline=!1,this.oxygenDepleteRate=.15,this.fuelRechargeRate=80,this.shieldRechargeRate=25}get suitIntegrity(){return this.health}set suitIntegrity(e){this.health=e}reset(){this.health=this.maxHealth,this.oxygen=this.maxOxygen,this.fuel=this.maxFuel,this.energy=this.maxEnergy,this.isDead=!1,this.isOxygenLow=!1,this.isJetpackOffline=!1}damage(e,t="impact"){if(!this.isDead){if(this.energy>0){const s=Math.min(this.energy,e);this.energy-=s,e-=s}this.health=ne(this.health-e,0,this.maxHealth),this.health<=0&&(this.isDead=!0)}}heal(e){this.health=ne(this.health+e,0,this.maxHealth)}consumeFuel(e){return this.fuel=ne(this.fuel-e,0,this.maxFuel),this.isJetpackOffline=this.fuel<=.5,!this.isJetpackOffline}consumeEnergy(e){return this.energy>=e?(this.energy-=e,!0):!1}replenishOxygen(e=100){this.oxygen=ne(this.oxygen+e,0,this.maxOxygen),this.isOxygenLow=this.oxygen<20}replenishFuel(e=100){this.fuel=ne(this.fuel+e,0,this.maxFuel),this.isJetpackOffline=!1}replenishAll(){this.health=this.maxHealth,this.oxygen=this.maxOxygen,this.fuel=this.maxFuel,this.energy=this.maxEnergy,this.isOxygenLow=!1,this.isJetpackOffline=!1}update(e,t,s){this.isDead||(this.oxygen=Math.max(0,this.oxygen-this.oxygenDepleteRate*e),this.isOxygenLow=this.oxygen<15,this.oxygen<=0&&this.damage(8*e,"suffocation"),s?this.consumeFuel(6*e):(this.fuel=Math.min(this.maxFuel,this.fuel+this.fuelRechargeRate*e),this.isJetpackOffline=!1),this.energy=Math.min(this.maxEnergy,this.energy+this.shieldRechargeRate*e))}}const W=X.player,ue=X.jetpack,en=new URL("/assets/cute_astronaut-DFEFEq1I.glb",import.meta.url).href,tn=W.radius*2.3,de=new y,sn=new y(0,-1,0),$t=new y,Zt=new y,Jt=new y,Qt=new y,ut=new y,es=new b(X.jetpack.normalColor),ts=new b(X.jetpack.boostColor);class nn{constructor({scene:e,physics:t,input:s,materials:i,thrusters:n}){this.physics=t,this.input=s,this.thrusters=n??null,this.stats=new Qi,this.body={position:new y(0,3,0),velocity:new y,radius:W.radius,grounded:!1,groundCollider:null,groundNormal:null},this.spawn=new y(0,3,0),this.cameraYaw=0,this.cameraPitch=.42,this.frozen=!0,this.paused=!1,this.sprintAllowed=!0,this.onLand=null,this.onJump=null,this.onFall=null,this.onJetpack=null,this.jetpackActive=!1,this.jetpackPower=0,this.warpIntensity=0,this.isLightSpeed=!1,this._wasGrounded=!1,this._coyote=0,this._jumpBuffer=0,this._fallSpeed=0,this.mesh=new _,e.add(this.mesh),this.visual=new _,this.visual.rotation.order="YXZ",this.mesh.add(this.visual),this.thrusterLight=new Mt(16737792,0,12,2),this.thrusterLight.position.set(0,.2,-.4),this.mesh.add(this.thrusterLight),this._facing=0,this._prevFacing=0,this._walkPhase=0,this._time=0,this._bankRoll=0,this._pitchAngle=0,this.bones={head:null,spine:null,torso:null,leftArm:null,rightArm:null,leftHand:null,rightHand:null,leftLeg:null,rightLeg:null,leftFoot:null,rightFoot:null,backpack:null},this.mixer=null,this._buildProceduralAstronaut(i);try{new yi().load(en,o=>this._setupModel(o.scene,o.animations),void 0,()=>{})}catch{}this.shadowBlob=new w(new Xe(W.radius*4.4,W.radius*4.4),i.contactShadow()),this.shadowBlob.rotation.x=-Math.PI/2,this.shadowBlob.renderOrder=1,e.add(this.shadowBlob),this._raycaster=new gs,this._raycaster.far=40,s.on("jump",()=>{this._jumpBuffer=W.jumpBuffer})}_buildProceduralAstronaut(e){const t=new P({color:15462645,roughness:.35,metalness:.25}),s=new P({color:3359061,roughness:.6,metalness:.8}),i=new P({color:16758531,emissive:10048768,emissiveIntensity:.3,roughness:.08,metalness:.95}),n=new U({color:61695}),o=new _;o.position.set(0,-.55*.4,0),this.visual.add(o),this._proceduralRoot=o;const a=new w(new Ce(.42,.48,8,16),t);a.castShadow=!0,o.add(a),this.bones.spine=a;const r=new w(new I(.35,.28,.12),s);r.position.set(0,.05,.38),a.add(r);const l=new w(new I(.12,.06,.04),n);l.position.set(0,.05,.45),a.add(l);const c=new _;c.position.set(0,.62,0),a.add(c),this.bones.head=c;const h=new w(new z(.38,24,20),t);h.castShadow=!0,c.add(h);const d=new w(new z(.32,20,16),i);d.position.set(0,0,.12),d.scale.set(1,.82,.95),c.add(d);const p=new w(new I(.52,.62,.28),s);p.position.set(0,.08,-.34),p.castShadow=!0,a.add(p),this.bones.backpack=p;for(const N of[-1,1]){const G=new w(new Z(.08,.12,.22,10),s);G.position.set(N*.2,-.38,-.34),a.add(G)}const m=new _;m.position.set(.48,.22,0),a.add(m),this.bones.leftArm=m;const g=new w(new Ce(.12,.38,6,12),t);g.position.set(0,-.24,0),g.castShadow=!0,m.add(g);const f=new _;f.position.set(-.48,.22,0),a.add(f),this.bones.rightArm=f;const v=new w(new Ce(.12,.38,6,12),t);v.position.set(0,-.24,0),v.castShadow=!0,f.add(v);const x=new _;x.position.set(.22,-.42,0),o.add(x),this.bones.leftLeg=x;const T=new w(new Ce(.14,.44,6,12),t);T.position.set(0,-.26,0),T.castShadow=!0,x.add(T);const S=new w(new I(.22,.16,.34),s);S.position.set(0,-.52,.06),x.add(S);const M=new _;M.position.set(-.22,-.42,0),o.add(M),this.bones.rightLeg=M;const C=new w(new Ce(.14,.44,6,12),t);C.position.set(0,-.26,0),C.castShadow=!0,M.add(C);const A=new w(new I(.22,.16,.34),s);A.position.set(0,-.52,.06),M.add(A)}get position(){return this.body.position}get velocity(){return this.body.velocity}setSpawn(e){Array.isArray(e)?this.spawn.set(e[0]??0,e[1]??3,e[2]??0):e&&typeof e.x=="number"&&this.spawn.copy(e)}_setupModel(e,t=[]){const s=new _;s.add(e),s.updateWorldMatrix(!0,!0);const i=new fs().setFromObject(s),n=i.getSize(new y),o=i.getCenter(new y),a=tn/n.y;s.scale.setScalar(a),s.position.set(-o.x*a,-i.min.y*a-W.radius,-o.z*a),this._proceduralRoot&&(this.visual.remove(this._proceduralRoot),this._proceduralRoot=null),this.visual.add(s)}respawn(){this.stats.replenishAll(),this.body.position.copy(this.spawn),this.body.velocity.set(0,0,0),this.body.grounded=!1,this.body.groundCollider=null,this.jetpackActive=!1,this.jetpackPower=0,this.warpIntensity=0,this.isLightSpeed=!1,this.frozen=!1,this.paused=!1,this.mesh.position.copy(this.spawn),this.mesh.scale.set(1,1,1),this.visual.rotation.set(0,0,0)}update(e,t){const s=this.body;if(this._time+=e,this.mixer&&this.mixer.update(e),this.frozen){if(s.grounded){const n=Math.max(0,1-W.groundFriction*e);s.velocity.x*=n,s.velocity.z*=n,this.thrusterLight.intensity=0,this.onJetpack?.(!1,0)}}else{const n=this.input.moveVector(),o=this.input.sprinting&&this.sprintAllowed&&!this.stats.isJetpackOffline,a=this.input.jumpHeld,r=this.input.descendHeld,l=this.input.brakeHeld;n.z<0;const c=a||r||n.z!==0||n.x!==0,h=!s.grounded||a||r;if(this.stats.update(e,h?c:!1,o),h){this.jetpackActive=c&&!this.stats.isJetpackOffline,this.jetpackPower=this.jetpackActive?Math.min(1,this.jetpackPower+e*5):Math.max(0,this.jetpackPower-e*3),o&&this.jetpackActive?(this.warpIntensity=Math.min(1,this.warpIntensity+e*2.5),this.isLightSpeed=this.warpIntensity>.35):(this.warpIntensity=0,this.isLightSpeed=!1);const d=this.stats.isJetpackOffline?.22:1;a&&!this.stats.isJetpackOffline?(s.velocity.y+=ue.upThrust*d*e,s.grounded=!1,s.groundCollider=null):r&&!this.stats.isJetpackOffline?s.velocity.y-=ue.upThrust*d*e:s.grounded||(s.velocity.y*=Math.max(0,1-.7*e)),l&&s.velocity.multiplyScalar(Math.max(0,1-6*e));const p=Math.sin(this.cameraYaw),m=Math.cos(this.cameraYaw),g=Math.sin(this.cameraPitch),f=Math.cos(this.cameraPitch);if($t.set(-p*f,-g,-m*f).normalize(),Zt.set(m,0,-p).normalize(),de.set(0,0,0),(n.z>0||n.x!==0)&&(de.addScaledVector($t,n.z).addScaledVector(Zt,n.x),de.lengthSq()>.001&&de.normalize()),this.jetpackActive&&de.lengthSq()>.001){const S=o?1.6+this.warpIntensity*1.2:1;s.velocity.addScaledVector(de,ue.forwardThrust*S*d*e),a&&(s.grounded=!1)}const v=o?ue.maxBoostSpeed+this.warpIntensity*(ue.speedOfLight-ue.maxBoostSpeed):ue.maxFlightSpeed,x=s.velocity.length();x>v&&s.velocity.multiplyScalar(v/x);const T=Math.max(0,1-ue.flightDrag*e*(o?.08:c?.25:.45));if(s.velocity.x*=T,s.velocity.z*=T,this.thrusters&&this.jetpackActive&&c){const S=Math.sin(this._facing),M=Math.cos(this._facing),C=.28,A=.16,N=.32,G=s.position.x-S*C,J=s.position.y+N,Q=s.position.z-M*C;Jt.set(G+M*A,J,Q-S*A),Qt.set(G-M*A,J,Q+S*A);const le=o?24+this.warpIntensity*14:15;ut.set(-S*le-s.velocity.x*.4,-le*.85-s.velocity.y*.4,-M*le-s.velocity.z*.4);const ce=o?ts:es,me=o?4:3,fe=o?2.6+this.warpIntensity*1:2,ge=o?.95:.75;this.thrusters.emit(Jt,ut,ce,me,fe,ge),this.thrusters.emit(Qt,ut,ce,me,fe,ge)}if(this.jetpackActive&&c){const S=o?ts:es;this.thrusterLight.color.lerp(S,.2),this.thrusterLight.intensity=k(this.thrusterLight.intensity,o?3.5+this.warpIntensity*2.5+Math.random()*.5:2.2+Math.random()*.4)}else this.thrusterLight.intensity=k(this.thrusterLight.intensity,0);this.onJetpack?.(this.jetpackActive,o?1.5+this.warpIntensity*.8:1)}else{this.jetpackActive=!1,this.jetpackPower=Math.max(0,this.jetpackPower-e*3),this.warpIntensity=Math.max(0,this.warpIntensity-e*2.5),this.isLightSpeed=!1,this.thrusterLight.intensity=k(this.thrusterLight.intensity,0),this.onJetpack?.(!1,0);const d=o?W.sprintSpeed:W.maxSpeed,p=Math.sin(this.cameraYaw),m=Math.cos(this.cameraYaw);de.set(n.x*m-n.z*p,0,-n.z*m-n.x*p),s.velocity.addScaledVector(de,W.accel*e);const g=Math.hypot(s.velocity.x,s.velocity.z);if(g>d){const x=d/g;s.velocity.x*=x,s.velocity.z*=x}const f=de.lengthSq()>0?.8:W.groundFriction,v=Math.max(0,1-f*e);s.velocity.x*=v,s.velocity.z*=v,s.velocity.y<0&&(s.velocity.y=0),this._coyote=s.grounded?W.coyoteTime:Math.max(0,this._coyote-e),this._jumpBuffer=Math.max(0,this._jumpBuffer-e),this._jumpBuffer>0&&this._coyote>0&&(this._jumpBuffer=0,this._coyote=0,s.velocity.y=W.jumpVelocity,s.grounded=!1,s.groundCollider=null,this.onJump?.())}}s.grounded||(this._fallSpeed=-s.velocity.y);const i=this.physics.step(s,this.paused?0:e);s.grounded&&!this._wasGrounded&&this._fallSpeed>X.fx.landDustMin&&this.onLand?.(this._fallSpeed),this._wasGrounded=s.grounded,this.mesh.position.copy(s.position),this._animate(e),this._updateShadow(t),i&&!this.frozen&&this.onFall?.()}_animate(e){const t=this.body,s=Math.hypot(t.velocity.x,t.velocity.z),i=t.velocity.length(),n=ne(s/W.maxSpeed,0,1.4),o=this.input.moveVector();this._prevFacing=this._facing,s>.35?this._facing=Vt(this._facing,Math.atan2(t.velocity.x,t.velocity.z),12,e):this.jetpackActive&&(this._facing=Vt(this._facing,this.cameraYaw+Math.PI,8,e)),this.visual.rotation.y=this._facing;let a=0,r=0,l=0;if(this.jetpackActive||!t.grounded&&i>10){const h=this.input.sprinting&&this.sprintAllowed,d=ne(-t.velocity.y*.04-s/ue.maxFlightSpeed*.75,-1.05,.85);r=h?Math.min(d,-.65):d;const p=(this._facing-this._prevFacing)/Math.max(.001,e),m=-o.x*.28;l=ne(-p*.35+m,-.6,.6),a=Math.sin(this._time*12)*(h?.022:.012),this._walkPhase=0}else t.grounded&&s>.35?(this._walkPhase+=e*(5.5+s*2.2),a=Math.abs(Math.sin(this._walkPhase))*.058*n,l=Math.sin(this._walkPhase)*.082*n,r=.14*n):t.grounded?(a=Math.sin(this._time*2.4)*.015,r=Math.sin(this._time*1.8)*.025,this._walkPhase=0):(r=ne(-t.velocity.y*.025,-.32,.38),this._walkPhase=0);const c=k(11,e);this.visual.position.y+=(a-this.visual.position.y)*c,this._pitchAngle+=(r-this._pitchAngle)*c,this._bankRoll+=(l-this._bankRoll)*c,this.visual.rotation.x=this._pitchAngle,this.visual.rotation.z=this._bankRoll,this._animateRig(n,e)}_animateRig(e,t){const{head:s,spine:i,leftArm:n,rightArm:o,leftLeg:a,rightLeg:r}=this.bones,l=this.jetpackActive||!this.body.grounded&&this.body.velocity.length()>8,c=this.input.sprinting&&this.sprintAllowed;if(l){const h=-.42+Math.sin(this._time*2.4)*.06,d=c?.08:.16;a&&(a.rotation.x=k(a.rotation.x,h),a.rotation.z=k(a.rotation.z,d)),r&&(r.rotation.x=k(r.rotation.x,h+.05),r.rotation.z=k(r.rotation.z,-d));const p=c?-.25:-.65;n&&(n.rotation.x=k(n.rotation.x,p+Math.sin(this._time*2.8)*.08),n.rotation.y=k(n.rotation.y,.32)),o&&(o.rotation.x=k(o.rotation.x,p+Math.sin(this._time*2.8+.5)*.08),o.rotation.y=k(o.rotation.y,-.32)),i&&(i.rotation.y=k(i.rotation.y,0)),s&&(s.rotation.x=k(s.rotation.x,-.15));return}if(this.body.grounded&&e>.05){const h=Math.sin(this._walkPhase)*.52*e,d=Math.sin(this._walkPhase)*.48*e;a&&(a.rotation.x=h),r&&(r.rotation.x=-h),n&&(n.rotation.x=-d,n.rotation.z=.15*e),o&&(o.rotation.x=d,o.rotation.z=-.15*e),i&&(i.rotation.y=Math.sin(this._walkPhase)*.1*e),s&&(s.rotation.y=-Math.sin(this._walkPhase)*.06*e)}else{const h=Math.sin(this._time*2.4)*.04;a&&(a.rotation.x=k(a.rotation.x,0),a.rotation.z=k(a.rotation.z,0)),r&&(r.rotation.x=k(r.rotation.x,0),r.rotation.z=k(r.rotation.z,0)),n&&(n.rotation.x=k(n.rotation.x,h),n.rotation.z=k(n.rotation.z,.08)),o&&(o.rotation.x=k(o.rotation.x,h),o.rotation.z=k(o.rotation.z,-.08)),i&&(i.rotation.y=k(i.rotation.y,0)),s&&(s.rotation.y=k(s.rotation.y,0))}}_updateShadow(e){this._raycaster.set(this.body.position,sn);const t=e?this._raycaster.intersectObject(e,!0):[];if(t.length){const s=t[0];this.shadowBlob.visible=!0,this.shadowBlob.position.set(this.body.position.x,s.point.y+.02,this.body.position.z);const i=s.distance-W.radius,n=Math.max(0,1-i/7);this.shadowBlob.material.uniforms.uStrength.value=.55*n;const o=1+i*.12;this.shadowBlob.scale.set(o,o,1)}else this.shadowBlob.visible=!1}}const j=X.camera,Be=new y,Ae=new y,Ze=new y,He=new y;class on{constructor(e,t){this.camera=e,this.input=t,this.yaw=0,this.pitch=.2,this.distance=j.distance,this.cinematic=!1,this.focus=new y,this._zoom=0,this._raycaster=new gs,this._fovTween=null}snapTo(e,t=0){this.yaw=t,this.pitch=.2,this._zoom=0,this.focus.copy(e),this._place(e,null,1)}shake(e=.6,t=.45){const s={val:e};D.to(s,{val:0,duration:t,ease:"power2.out",onUpdate:()=>{const i=(Math.random()-.5)*s.val,n=(Math.random()-.5)*s.val;this.camera.position.x+=i,this.camera.position.y+=n}})}update(e,t,s){if(this.cinematic)return;const i=this.input.consumeMouse();this.yaw-=i.x*j.sensitivity,this.pitch=ne(this.pitch+i.y*j.sensitivity,j.minPitch,j.maxPitch);const n=k(j.followLerp,e);this.focus.lerp(t.position,n);const o=Math.hypot(t.velocity.x,t.velocity.z),a=ne(o/X.player.sprintSpeed,0,1);this._zoom+=(a*j.zoomBySpeed-this._zoom)*k(2.5,e);const r=t.isLightSpeed||t.warpIntensity>.4,l=t.jetpackActive&&(this.input.sprinting||a>.7),c=r?j.warpFov:l?j.flightFov:this.input.sprinting&&a>.6?j.sprintFov:j.fov;Math.abs(this.camera.fov-c)>.1&&!this._fovTween?.isActive()&&(this._fovTween=D.to(this.camera,{fov:c,duration:r?.4:.7,ease:"sine.out",overwrite:"auto",onUpdate:()=>this.camera.updateProjectionMatrix()})),Ae.copy(this.focus),o>.5&&(Ze.set(t.velocity.x,t.velocity.y*.4,t.velocity.z).normalize().multiplyScalar(j.lookAhead*a),Ae.add(Ze)),this._place(Ae,s,k(12,e)),t.cameraYaw=this.yaw,t.cameraPitch=this.pitch}_place(e,t,s){const i=this.distance+this._zoom;if(Ze.set(Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.cos(this.yaw)*Math.cos(this.pitch)).multiplyScalar(i),Be.copy(e).add(Ze),Be.y+=j.height,t){He.copy(Be).sub(e);const n=He.length();He.divideScalar(n);const o=e.clone();o.y+=1.4,this._raycaster.set(o,He),this._raycaster.far=n;const a=this._raycaster.intersectObject(t,!0);if(a.length&&a[0].distance>3.5&&a[0].distance<n){const r=Math.max(4,a[0].distance-j.collisionRadius);Be.copy(o).addScaledVector(He,r)}}this.camera.position.lerp(Be,s),Ae.copy(e),Ae.y+=1.2,this.camera.lookAt(Ae)}intro(e,t=2.8){this.cinematic=!0;const s=this.camera,i={x:e.x+26,y:e.y+20,z:e.z+26};return s.position.set(i.x,i.y,i.z),new Promise(n=>{const o={t:0},a=new y;D.to(o,{t:1,duration:t,ease:"power3.inOut",onUpdate:()=>{const r=o.t,l=Math.PI*.75*(1-r),c=26-(26-j.distance)*r,h=20-(20-j.height*1.6)*r;s.position.set(e.x+Math.sin(l)*c,e.y+h,e.z+Math.cos(l)*c),a.copy(e),a.y+=j.height*.35,s.lookAt(a)},onComplete:()=>{this.yaw=0,this.pitch=.42,this.focus.copy(e),this.cinematic=!1,n()}})})}orbit(e,{dist:t=11,h:s=6}={}){this.cinematic=!0;const i=this.camera,n={ang:this.yaw,dist:this.distance+this._zoom,h:4.5},o=new y;this._orbitTween=D.to(n,{ang:this.yaw+Math.PI*2,duration:16,repeat:-1,ease:"none",onUpdate:()=>{i.position.set(e.x+Math.sin(n.ang)*n.dist,e.y+n.h,e.z+Math.cos(n.ang)*n.dist),o.copy(e),o.y+=1,i.lookAt(o)}}),D.to(n,{dist:t,h:s,duration:3,ease:"sine.inOut"})}endOrbit(){this._orbitTween?.kill(),this._orbitTween=null,this.cinematic=!1}}class an{constructor(e){this.engine=e;const t=e.scene;this.sun=new hs(16777215,3.4),this.sun.position.set(45,60,30),this.sun.castShadow=!0;const s=X.renderer.shadowMapSize;this.sun.shadow.mapSize.set(s,s),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=180;const i=45;this.sun.shadow.camera.left=-i,this.sun.shadow.camera.right=i,this.sun.shadow.camera.top=i,this.sun.shadow.camera.bottom=-i,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.03,t.add(this.sun,this.sun.target),this.hemi=new ni(4871528,329745,.85),t.add(this.hemi),this.ambient=new oi(2766415,.65),t.add(this.ambient),t.fog=null}transitionTo({sunColor:e,sunIntensity:t=3.4}={},s=1.6){if(e){const i=new b(e);s===0?this.sun.color.copy(i):D.to(this.sun.color,{r:i.r,g:i.g,b:i.b,duration:s,ease:"sine.inOut",overwrite:"auto"})}s===0?this.sun.intensity=t:D.to(this.sun,{intensity:t,duration:s,ease:"sine.inOut",overwrite:"auto"})}applyTheme(e,t=!1){e&&this.transitionTo(e,t?0:1.6)}follow(e){this.sun.position.set(e.x+30,e.y+45,e.z+20),this.sun.target.position.copy(e)}}class rn{constructor(e){this.canvas=e,this.keys=new Set,this.mouseDX=0,this.mouseDY=0,this.enabled=!1,this.isMouseDown=!1,this.prevMouseX=0,this.prevMouseY=0,this._listeners=new Map,this._bindKeyboard(),this._bindMouse()}_bindKeyboard(){window.addEventListener("keydown",e=>{(e.code.startsWith("Arrow")||e.key?.startsWith("Arrow")||e.code==="Space")&&e.preventDefault(),this.keys.add(e.code),e.key&&this.keys.add(e.key.toLowerCase()),!e.repeat&&((e.code==="Space"||e.key===" ")&&this._emit("jump"),(e.code==="KeyQ"||e.key==="q"||e.key==="Q")&&this._emit("scanner"),(e.code==="KeyM"||e.key==="m"||e.key==="M")&&this._emit("map"),(e.code==="KeyE"||e.key==="e"||e.key==="E")&&this._emit("interact"),(e.code==="KeyU"||e.key==="u"||e.key==="U")&&this._emit("upgrades"),(e.code==="KeyR"||e.key==="r"||e.key==="R")&&this._emit("restart"),(e.code==="Escape"||e.key==="Escape")&&this._emit("pause"),(e.code==="Enter"||e.key==="Enter")&&this._emit("confirm"))}),window.addEventListener("keyup",e=>{this.keys.delete(e.code),e.key&&this.keys.delete(e.key.toLowerCase())}),window.addEventListener("blur",()=>{this.keys.clear(),this.isMouseDown=!1})}_bindMouse(){this.canvas.addEventListener("mousedown",e=>{this.isMouseDown=!0,this.prevMouseX=e.clientX,this.prevMouseY=e.clientY,this.enabled&&!this.pointerLocked&&this.lockPointer()}),window.addEventListener("mouseup",()=>{this.isMouseDown=!1}),this._skipNextMouseMove=!1,window.addEventListener("mousemove",e=>{if(this.enabled){if(this._skipNextMouseMove){this._skipNextMouseMove=!1,this.prevMouseX=e.clientX,this.prevMouseY=e.clientY;return}if(this.pointerLocked){const t=Math.max(-40,Math.min(40,e.movementX||0)),s=Math.max(-40,Math.min(40,e.movementY||0));this.mouseDX+=t,this.mouseDY+=s}else{if(this.prevMouseX!==0||this.prevMouseY!==0){const t=e.clientX-this.prevMouseX,s=e.clientY-this.prevMouseY;Math.abs(t)<60&&Math.abs(s)<60&&(this.mouseDX+=t,this.mouseDY+=s)}this.prevMouseX=e.clientX,this.prevMouseY=e.clientY}}}),document.addEventListener("pointerlockchange",()=>{this._skipNextMouseMove=!0,this.mouseDX=0,this.mouseDY=0,this.pointerLocked||(this._emit("unlock"),this.prevMouseX=0,this.prevMouseY=0)})}get pointerLocked(){return document.pointerLockElement===this.canvas}lockPointer(){if(!this.pointerLocked&&this.canvas){this._skipNextMouseMove=!0,this.mouseDX=0,this.mouseDY=0;try{const e=this.canvas.requestPointerLock?.();e&&typeof e.catch=="function"&&e.catch(()=>{})}catch{}}}unlockPointer(){if(this.pointerLocked)try{document.exitPointerLock?.()}catch{}}moveVector(){if(!this.enabled)return{x:0,z:0};const e=this.keys,t=e.has("KeyD")||e.has("ArrowRight")||e.has("arrowright")||e.has("d"),s=e.has("KeyA")||e.has("ArrowLeft")||e.has("arrowleft")||e.has("a"),i=e.has("KeyW")||e.has("ArrowUp")||e.has("arrowup")||e.has("w"),n=e.has("KeyS")||e.has("ArrowDown")||e.has("arrowdown")||e.has("s"),o=(t?1:0)-(s?1:0),a=(i?1:0)-(n?1:0),r=Math.hypot(o,a)||1;return{x:o/r,z:a/r}}get sprinting(){return this.enabled&&(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")||this.keys.has("shift"))}get jumpHeld(){return this.enabled&&(this.keys.has("Space")||this.keys.has(" "))}get descendHeld(){return this.enabled&&(this.keys.has("KeyX")||this.keys.has("x")||this.keys.has("X")||this.keys.has("ControlLeft")||this.keys.has("ControlRight")||this.keys.has("control")||this.keys.has("KeyC")||this.keys.has("c"))}get brakeHeld(){return this.enabled&&(this.keys.has("KeyB")||this.keys.has("b")||this.keys.has("B"))}consumeMouse(){const e={x:this.mouseDX,y:this.mouseDY};return this.mouseDX=0,this.mouseDY=0,e}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this._listeners.get(e).delete(t)}_emit(e){this._listeners.get(e)?.forEach(t=>t())}}const ln=`
  attribute vec3 aVelocity;
  attribute float aSpawnTime;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vFade;
  varying vec3 vColor;
  void main() {
    float age = uTime - aSpawnTime;
    float t = clamp(age / max(aLife, 0.001), 0.0, 1.0);
    vFade = (1.0 - t) * step(0.0, age) * step(age, aLife);
    vColor = aColor;

    vec3 pos = position + aVelocity * age + vec3(0.0, -4.5, 0.0) * age * age * 0.5;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (1.0 - t * 0.6) * (140.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`,cn=`
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vFade;
    gl_FragColor = vec4(vColor, a * 0.85);
  }
`;class hn{constructor(e,t=600){this.capacity=t,this.cursor=0;const s=new re,i=new Float32Array(t*3);s.setAttribute("position",new R(i.slice(),3)),s.setAttribute("aVelocity",new R(i.slice(),3)),s.setAttribute("aColor",new R(i.slice(),3)),s.setAttribute("aSpawnTime",new R(new Float32Array(t).fill(-1e3),1)),s.setAttribute("aLife",new R(new Float32Array(t).fill(1),1)),s.setAttribute("aSize",new R(new Float32Array(t).fill(1),1)),this.material=new O({vertexShader:ln,fragmentShader:cn,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:F}),this.points=new xe(s,this.material),this.points.frustumCulled=!1,e.add(this.points)}emit(e,t,s={}){const{color:i=new b(13620954),speed:n=3.5,up:o=2.2,spread:a=1,life:r=.9,size:l=1.4}=s,c=this.points.geometry,h=c.attributes.position,d=c.attributes.aVelocity,p=c.attributes.aColor,m=c.attributes.aSpawnTime,g=c.attributes.aLife,f=c.attributes.aSize,v=this.material.uniforms.uTime.value;for(let x=0;x<t;x++){const T=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const S=Math.random()*Math.PI*2,M=Math.random()*a;h.setXYZ(T,e.x+Math.cos(S)*M*.4,e.y,e.z+Math.sin(S)*M*.4),d.setXYZ(T,Math.cos(S)*n*(.35+Math.random()*.65),o*(.5+Math.random()*.8),Math.sin(S)*n*(.35+Math.random()*.65)),p.setXYZ(T,i.r,i.g,i.b),m.setX(T,v),g.setX(T,r*(.6+Math.random()*.7)),f.setX(T,l*(.6+Math.random()*.8))}h.needsUpdate=!0,d.needsUpdate=!0,p.needsUpdate=!0,m.needsUpdate=!0,g.needsUpdate=!0,f.needsUpdate=!0}update(e){this.material.uniforms.uTime.value=e}}const un=`
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uCenter;
  uniform float uRange;
  varying float vA;
  void main() {
    // slow pseudo-random drift
    vec3 p = position;
    p.x += sin(uTime * 0.11 + aSeed * 17.0) * 2.2;
    p.y += sin(uTime * 0.07 + aSeed * 31.0) * 1.6;
    p.z += cos(uTime * 0.09 + aSeed * 23.0) * 2.2;

    // wrap into a cube around the player so motes are always nearby
    vec3 rel = mod(p - uCenter + uRange * 0.5, uRange) - uRange * 0.5;
    vec3 wp = uCenter + rel;

    float edge = 1.0 - smoothstep(uRange * 0.30, uRange * 0.5, length(rel));
    vA = edge * (0.25 + 0.75 * fract(aSeed * 91.7));

    vec4 mv = modelViewMatrix * vec4(wp, 1.0);
    gl_PointSize = (1.4 + fract(aSeed * 57.3) * 2.4) * (90.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`,dn=`
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    gl_FragColor = vec4(vec3(0.92, 0.8, 0.6), smoothstep(1.0, 0.1, d) * vA * 0.12);
  }
`;class pn{constructor(e,t=260,s=34){const i=new re,n=new Float32Array(t*3),o=new Float32Array(t);for(let a=0;a<t;a++)n[a*3]=(Math.random()-.5)*s,n[a*3+1]=(Math.random()-.5)*s,n[a*3+2]=(Math.random()-.5)*s,o[a]=Math.random();i.setAttribute("position",new R(n,3)),i.setAttribute("aSeed",new R(o,1)),this.material=new O({vertexShader:un,fragmentShader:dn,uniforms:{uTime:{value:0},uCenter:{value:new y},uRange:{value:s}},transparent:!0,depthWrite:!1,blending:F}),this.points=new xe(i,this.material),this.points.frustumCulled=!1,e.add(this.points)}update(e,t){this.material.uniforms.uTime.value=e,this.material.uniforms.uCenter.value.copy(t)}}const mn=`
  attribute vec3 aVelocity;
  attribute float aSpawnTime;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vFade;
  varying vec3 vColor;
  void main() {
    float age = uTime - aSpawnTime;
    float t = clamp(age / max(aLife, 0.001), 0.0, 1.0);
    vFade = pow(1.0 - t, 1.3) * step(0.0, age) * step(age, aLife);
    
    // Core starts bright hot white, transitioning to vivid plasma color then soft tail
    vColor = mix(vec3(1.0, 1.0, 0.95), aColor, clamp(t * 2.5, 0.0, 1.0));

    // Particle slows down and expands along the supersonic trail
    vec3 pos = position + aVelocity * age * (1.0 - t * 0.35);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (0.85 + t * 3.0) * (140.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`,fn=`
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = pow(smoothstep(1.0, 0.0, d), 1.5) * vFade;
    gl_FragColor = vec4(vColor, a * 0.95);
  }
`;class gn{constructor(e,t=1600){this.capacity=t,this.cursor=0;const s=new re,i=new Float32Array(t*3);s.setAttribute("position",new R(i.slice(),3)),s.setAttribute("aVelocity",new R(i.slice(),3)),s.setAttribute("aColor",new R(i.slice(),3)),s.setAttribute("aSpawnTime",new R(new Float32Array(t).fill(-1e3),1)),s.setAttribute("aLife",new R(new Float32Array(t).fill(1),1)),s.setAttribute("aSize",new R(new Float32Array(t).fill(1),1)),this.material=new O({vertexShader:mn,fragmentShader:fn,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:F}),this.points=new xe(s,this.material),this.points.frustumCulled=!1,e.add(this.points)}emit(e,t,s,i=3,n=2,o=.8){const a=this.points.geometry,r=a.attributes.position,l=a.attributes.aVelocity,c=a.attributes.aColor,h=a.attributes.aSpawnTime,d=a.attributes.aLife,p=a.attributes.aSize,m=this.material.uniforms.uTime.value;for(let g=0;g<i;g++){const f=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const v=.06,x=(Math.random()-.5)*v,T=(Math.random()-.5)*v,S=(Math.random()-.5)*v;r.setXYZ(f,e.x+x,e.y+T,e.z+S),l.setXYZ(f,t.x+(Math.random()-.5)*1.2,t.y+(Math.random()-.5)*1.2,t.z+(Math.random()-.5)*1.2),c.setXYZ(f,s.r,s.g,s.b),h.setX(f,m),d.setX(f,o*(.85+Math.random()*.3)),p.setX(f,n*(.85+Math.random()*.3))}r.needsUpdate=!0,l.needsUpdate=!0,c.needsUpdate=!0,h.needsUpdate=!0,d.needsUpdate=!0,p.needsUpdate=!0}update(e){this.material.uniforms.uTime.value=e}}const vn=`
  attribute vec3 aLocalOffset;
  attribute float aLength;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uWarp;
  uniform vec3 uCenter;
  uniform vec3 uVelocity;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float velMag = length(uVelocity);
    vec3 travelDir = velMag > 0.1 ? normalize(uVelocity) : vec3(0.0, 0.0, -1.0);
    
    // Construct local coordinate frame oriented with travel direction
    vec3 up = abs(travelDir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 right = normalize(cross(travelDir, up));
    vec3 localUp = cross(right, travelDir);

    // Subtle slipstream lines orbiting the astronaut symmetrically
    vec3 radialPos = right * aLocalOffset.x + localUp * aLocalOffset.y;
    
    // Animate along travel axis
    float travelZ = fract(aLocalOffset.z - uTime * (0.6 + aSpeed * uWarp * 2.5));
    vec3 alongZ = travelDir * (travelZ - 0.5) * 32.0;

    // Stretch line segments subtly with warp
    float stretch = 0.5 + uWarp * (aLength * 4.5 + velMag * 0.2);
    vec3 worldPos = uCenter + radialPos + alongZ + travelDir * (position.z * stretch);

    vec4 mv = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Soft subtle opacity centered around astronaut, zero noise
    vAlpha = smoothstep(12.0, 1.5, length(radialPos)) * (uWarp * 0.45);
    vColor = mix(vec3(0.35, 0.75, 1.0), vec3(1.0, 1.0, 0.95), position.z * 0.5 + 0.5);
  }
`,yn=`
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;class wn{constructor(e,t=80){const s=new re,i=new Float32Array(t*2*3),n=new Float32Array(t*2*3),o=new Float32Array(t*2),a=new Float32Array(t*2);for(let r=0;r<t;r++){const l=Math.random()*Math.PI*2,c=1.8+Math.random()*5.5,h=Math.cos(l)*c,d=Math.sin(l)*c,p=Math.random(),m=.6+Math.random()*1.4,g=.8+Math.random()*1.2,f=r*2;i[f*3]=0,i[f*3+1]=0,i[f*3+2]=.5,n[f*3]=h,n[f*3+1]=d,n[f*3+2]=p,o[f]=m,a[f]=g,i[(f+1)*3]=0,i[(f+1)*3+1]=0,i[(f+1)*3+2]=-.5,n[(f+1)*3]=h,n[(f+1)*3+1]=d,n[(f+1)*3+2]=p,o[f+1]=m,a[f+1]=g}s.setAttribute("position",new R(i,3)),s.setAttribute("aLocalOffset",new R(n,3)),s.setAttribute("aLength",new R(o,1)),s.setAttribute("aSpeed",new R(a,1)),this.material=new O({vertexShader:vn,fragmentShader:yn,uniforms:{uTime:{value:0},uWarp:{value:0},uCenter:{value:new y},uVelocity:{value:new y}},transparent:!0,depthWrite:!1,blending:F}),this.lines=new ps(s,this.material),this.lines.frustumCulled=!1,this.lines.visible=!1,e.add(this.lines)}update(e,t,s,i){const n=i>.02;this.lines.visible=n,n&&(this.material.uniforms.uTime.value=e,this.material.uniforms.uCenter.value.copy(t),this.material.uniforms.uVelocity.value.copy(s),this.material.uniforms.uWarp.value=i)}}class xn{constructor(){this.ctx=null,this.master=null,this.muted=!1,this._padNodes=[],this._jetGain=null,this._jetFilter=null,this._jetOsc=null,this._jetNoise=null}init(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=.6,this.master.connect(this.ctx.destination),this._startAmbient(),this._initJetpackSynth())}_initJetpackSynth(){if(!this.ctx)return;const e=this.ctx.currentTime,t=this.ctx.sampleRate*2,s=this.ctx.createBuffer(1,t,this.ctx.sampleRate),i=s.getChannelData(0);for(let o=0;o<t;o++)i[o]=Math.random()*2-1;this._jetNoise=this.ctx.createBufferSource(),this._jetNoise.buffer=s,this._jetNoise.loop=!0,this._jetFilter=this.ctx.createBiquadFilter(),this._jetFilter.type="bandpass",this._jetFilter.frequency.setValueAtTime(450,e),this._jetFilter.Q.setValueAtTime(2.2,e),this._jetOsc=this.ctx.createOscillator(),this._jetOsc.type="sawtooth",this._jetOsc.frequency.setValueAtTime(65,e);const n=this.ctx.createGain();n.gain.setValueAtTime(.25,e),this._jetOsc.connect(n),this._jetGain=this.ctx.createGain(),this._jetGain.gain.setValueAtTime(0,e),this._jetNoise.connect(this._jetFilter),this._jetFilter.connect(this._jetGain),n.connect(this._jetGain),this._jetGain.connect(this.master),this._jetNoise.start(e),this._jetOsc.start(e)}updateJetpack(e,t=1){if(!this.ctx||!this._jetGain||this.muted)return;const s=this.ctx.currentTime,i=e?Math.min(.28,.08+t*.2):0,n=400+t*600,o=60+t*50;this._jetGain.gain.setTargetAtTime(i,s,.08),this._jetFilter.frequency.setTargetAtTime(n,s,.08),this._jetOsc.frequency.setTargetAtTime(o,s,.08)}toggleMute(){if(this.ctx)return this.muted=!this.muted,this.master.gain.linearRampToValueAtTime(this.muted?0:.6,this.ctx.currentTime+.2),this.muted}_startAmbient(){const e=this.ctx.currentTime,t=this.ctx.createGain();t.gain.setValueAtTime(0,e),t.gain.linearRampToValueAtTime(.05,e+4);const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.value=320;const i=this.ctx.createOscillator();i.frequency.value=.05;const n=this.ctx.createGain();n.gain.value=140,i.connect(n).connect(s.frequency),i.start();for(const[o,a]of[[55,0],[55,6],[110,-4]]){const r=this.ctx.createOscillator();r.type="triangle",r.frequency.value=o,r.detune.value=a,r.connect(s),r.start(),this._padNodes.push(r)}s.connect(t).connect(this.master)}_blip(e,{type:t="sine",dur:s=.18,vol:i=.25,slide:n=0}={}){if(!this.ctx||this.muted)return;const o=this.ctx.currentTime,a=this.ctx.createOscillator(),r=this.ctx.createGain();a.type=t,a.frequency.setValueAtTime(e,o),n&&a.frequency.exponentialRampToValueAtTime(Math.max(30,e+n),o+s),r.gain.setValueAtTime(i,o),r.gain.exponentialRampToValueAtTime(.001,o+s),a.connect(r).connect(this.master),a.start(o),a.stop(o+s+.02)}_noise({dur:e=.22,vol:t=.3,freq:s=400}={}){if(!this.ctx||this.muted)return;const i=this.ctx.currentTime,n=Math.floor(this.ctx.sampleRate*e),o=this.ctx.createBuffer(1,n,this.ctx.sampleRate),a=o.getChannelData(0);for(let h=0;h<n;h++)a[h]=(Math.random()*2-1)*(1-h/n);const r=this.ctx.createBufferSource();r.buffer=o;const l=this.ctx.createBiquadFilter();l.type="lowpass",l.frequency.value=s;const c=this.ctx.createGain();c.gain.setValueAtTime(t,i),c.gain.exponentialRampToValueAtTime(.001,i+e),r.connect(l).connect(c).connect(this.master),r.start(i)}jump(){this._blip(320,{type:"sine",dur:.16,vol:.12,slide:260})}land(e=1){this._noise({dur:.18,vol:.12*e,freq:300})}checkpoint(){this._blip(523,{dur:.3,vol:.1}),setTimeout(()=>this._blip(784,{dur:.45,vol:.1}),110)}pad(){this._blip(392,{type:"triangle",dur:.35,vol:.14,slide:120})}gate(){this._noise({dur:.6,vol:.1,freq:900}),this._blip(196,{dur:.6,vol:.08,slide:160})}portal(){this._blip(262,{dur:1.2,vol:.12,slide:520}),this._noise({dur:1,vol:.08,freq:1400})}fall(){this._blip(240,{type:"sawtooth",dur:.5,vol:.06,slide:-180})}warp(){this._blip(180,{type:"sine",dur:.45,vol:.14,slide:700}),this._noise({dur:.5,vol:.09,freq:1800})}coin(){this._blip(987,{type:"sine",dur:.08,vol:.12,slide:300}),setTimeout(()=>this._blip(1318,{type:"triangle",dur:.1,vol:.14}),35)}whoosh(){this._noise({dur:.14,vol:.12,freq:800}),this._blip(340,{type:"sine",dur:.15,vol:.08,slide:120})}slide(){this._noise({dur:.35,vol:.16,freq:450})}powerup(){this._blip(440,{type:"triangle",dur:.12,vol:.14}),setTimeout(()=>this._blip(554,{type:"triangle",dur:.12,vol:.14}),60),setTimeout(()=>this._blip(659,{type:"triangle",dur:.14,vol:.16}),120),setTimeout(()=>this._blip(880,{type:"sine",dur:.3,vol:.18}),180)}relic(){this._blip(659,{type:"triangle",dur:.25,vol:.12}),setTimeout(()=>this._blip(880,{type:"sine",dur:.35,vol:.14}),80),setTimeout(()=>this._blip(1318,{type:"sine",dur:.45,vol:.16}),160)}scanner(){this._blip(980,{type:"sine",dur:.35,vol:.12,slide:400}),setTimeout(()=>this._blip(1480,{type:"triangle",dur:.25,vol:.08}),120)}resource(){this._blip(523,{type:"sine",dur:.15,vol:.12}),setTimeout(()=>this._blip(1046,{type:"triangle",dur:.22,vol:.14}),70)}alarm(){this._blip(880,{type:"sawtooth",dur:.3,vol:.16,slide:-220}),setTimeout(()=>this._blip(880,{type:"sawtooth",dur:.3,vol:.16,slide:-220}),280)}laser(){this._blip(1200,{type:"sawtooth",dur:.14,vol:.14,slide:-800})}impact(){this._noise({dur:.25,vol:.25,freq:220}),this._blip(120,{type:"sine",dur:.3,vol:.2,slide:-60})}explosion(){this._noise({dur:.8,vol:.35,freq:160}),this._blip(80,{type:"triangle",dur:.9,vol:.3,slide:-40})}droneAlert(){this._blip(440,{type:"sawtooth",dur:.2,vol:.14,slide:300}),setTimeout(()=>this._blip(740,{type:"sawtooth",dur:.25,vol:.16,slide:-150}),140)}click(){this._blip(660,{dur:.08,vol:.08})}}class bn{constructor(e){this.container=e,this.canvas=document.createElement("canvas"),this.canvas.width=140,this.canvas.height=140,this.canvas.className="radar-canvas",this.ctx=this.canvas.getContext("2d"),this.container.appendChild(this.canvas),this.maxRange=240,this.sweepAngle=0}render(e,t,s=[]){this.update(e,t,s)}update(e,t,s=[]){const i=this.ctx,n=this.canvas.width,o=this.canvas.height,a=n/2,r=o/2,l=n/2-8;i.clearRect(0,0,n,o);const c=i.createRadialGradient(a,r,2,a,r,l);c.addColorStop(0,"rgba(0, 20, 35, 0.75)"),c.addColorStop(1,"rgba(0, 10, 20, 0.95)"),i.fillStyle=c,i.beginPath(),i.arc(a,r,l,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0, 212, 255, 0.18)",i.lineWidth=1,[.33,.66,1].forEach(m=>{i.beginPath(),i.arc(a,r,l*m,0,Math.PI*2),i.stroke()}),i.beginPath(),i.moveTo(a,r-l),i.lineTo(a,r+l),i.moveTo(a-l,r),i.lineTo(a+l,r),i.stroke(),this.sweepAngle=(this.sweepAngle+.04)%(Math.PI*2);const h=i.createLinearGradient(a,r,a+Math.cos(this.sweepAngle)*l,r+Math.sin(this.sweepAngle)*l);h.addColorStop(0,"rgba(0, 229, 255, 0)"),h.addColorStop(1,"rgba(0, 229, 255, 0.6)"),i.strokeStyle=h,i.lineWidth=1.5,i.beginPath(),i.moveTo(a,r),i.lineTo(a+Math.cos(this.sweepAngle)*l,r+Math.sin(this.sweepAngle)*l),i.stroke(),i.fillStyle="#ffffff",i.beginPath(),i.moveTo(a,r-5),i.lineTo(a+4,r+4),i.lineTo(a,r+2),i.lineTo(a-4,r+4),i.closePath(),i.fill();const d=Math.cos(-t),p=Math.sin(-t);for(const m of s){if(!m.position)continue;const g=m.position.x-e.x,f=m.position.z-e.z,v=Math.hypot(g,f);if(v>this.maxRange)continue;const x=g*d-f*p,T=g*p+f*d,S=v/this.maxRange*l,M=Math.atan2(x,-T),C=a+Math.sin(M)*S,A=r-Math.cos(M)*S;this._drawBlip(i,C,A,m.type)}i.strokeStyle="rgba(0, 212, 255, 0.5)",i.lineWidth=1.5,i.beginPath(),i.arc(a,r,l,0,Math.PI*2),i.stroke()}_drawBlip(e,t,s,i){switch(i){case"MISSION":e.fillStyle="#ffd700",e.shadowColor="rgba(255, 215, 0, 0.8)",e.shadowBlur=6,e.beginPath(),e.moveTo(t,s-4),e.lineTo(t+4,s),e.lineTo(t,s+4),e.lineTo(t-4,s),e.closePath(),e.fill(),e.shadowBlur=0;break;case"HOSTILE":case"DRONE":e.fillStyle="#ff3344",e.shadowColor="rgba(255, 51, 68, 0.8)",e.shadowBlur=6,e.beginPath(),e.moveTo(t,s-4),e.lineTo(t+3.5,s+3.5),e.lineTo(t-3.5,s+3.5),e.closePath(),e.fill(),e.shadowBlur=0;break;case"STATION":e.fillStyle="#00e5ff",e.shadowColor="rgba(0, 229, 255, 0.8)",e.shadowBlur=6,e.fillRect(t-3,s-3,6,6),e.shadowBlur=0;break;case"PLANET":case"MOON":e.fillStyle="#2080ff",e.shadowColor="rgba(32, 128, 255, 0.8)",e.shadowBlur=6,e.beginPath(),e.arc(t,s,5,0,Math.PI*2),e.fill(),e.shadowBlur=0;break;case"WRECK":e.fillStyle="#ff9933",e.shadowColor="rgba(255, 153, 51, 0.8)",e.shadowBlur=5,e.beginPath(),e.moveTo(t,s-3.5),e.lineTo(t+3.5,s),e.lineTo(t,s+3.5),e.lineTo(t-3.5,s),e.closePath(),e.fill(),e.shadowBlur=0;break;case"SATELLITE":e.fillStyle="#e0e8f0",e.beginPath(),e.arc(t,s,2.2,0,Math.PI*2),e.fill();break;case"PORTAL":case"EXTRACTION":case"GATE":e.strokeStyle="#00ff88",e.lineWidth=1.5,e.beginPath(),e.arc(t,s,3.5,0,Math.PI*2),e.stroke();break;case"ANOMALY":case"RELIC":e.fillStyle="#00f0ff",e.beginPath(),e.arc(t,s,3,0,Math.PI*2),e.fill();break;default:e.fillStyle="#60dfff",e.beginPath(),e.arc(t,s,2.5,0,Math.PI*2),e.fill();break}}}class Sn{constructor(e){this.container=e,this.visible=!1,this.el=document.createElement("div"),this.el.className="sector-map-overlay glass",this.el.style.display="none",this.el.innerHTML=`
      <div class="sector-map-header">
        <div class="sector-title">SECTOR 01 — ORBITAL RUINS</div>
        <div class="sector-sub">TACTICAL CARTOGRAPHY // LIVE TELEMETRY</div>
        <button class="sector-close" data-el="closeMap">✕ [M]</button>
      </div>
      <div class="sector-canvas-wrap">
        <canvas class="sector-canvas" width="480" height="340"></canvas>
      </div>
      <div class="sector-legend">
        <span class="legend-item"><i class="dot gold"></i> Mission Objective</span>
        <span class="legend-item"><i class="dot cyan"></i> Station</span>
        <span class="legend-item"><i class="dot green"></i> Stargate</span>
        <span class="legend-item"><i class="dot magenta"></i> Anomaly</span>
        <span class="legend-item"><i class="dot red"></i> Hostile Drone</span>
      </div>
    `,e.appendChild(this.el),this.canvas=this.el.querySelector(".sector-canvas"),this.ctx=this.canvas.getContext("2d"),this.el.querySelector('[data-el="closeMap"]').addEventListener("click",()=>{this.hide()})}toggle(){this.visible?this.hide():this.show()}show(){this.visible=!0,this.el.style.display="flex"}hide(){this.visible=!1,this.el.style.display="none"}render(e,t,s=[]){if(!this.visible)return;const i=this.ctx,n=this.canvas.width,o=this.canvas.height,a=n/2,r=o/2,l=.45;i.clearRect(0,0,n,o),i.strokeStyle="rgba(0, 212, 255, 0.08)",i.lineWidth=1;const c=35;for(let p=0;p<n;p+=c)i.beginPath(),i.moveTo(p,0),i.lineTo(p,o),i.stroke();for(let p=0;p<o;p+=c)i.beginPath(),i.moveTo(0,p),i.lineTo(n,p),i.stroke();i.strokeStyle="rgba(0, 212, 255, 0.14)",[60,120,180].forEach(p=>{i.beginPath(),i.arc(a,r,p,0,Math.PI*2),i.stroke()});for(const p of s){if(!p.position)continue;const m=(p.position.x-e.x)*l,g=(p.position.z-e.z)*l,f=a+m,v=r+g;f<10||f>n-10||v<10||v>o-10||(i.fillStyle=p.color??"#00e5ff",i.beginPath(),i.arc(f,v,4,0,Math.PI*2),i.fill(),i.font="9px monospace",i.fillStyle="rgba(255, 255, 255, 0.7)",i.fillText(p.name??"",f+6,v+3))}i.fillStyle="#ffffff",i.beginPath(),i.arc(a,r,4,0,Math.PI*2),i.fill();const h=a-Math.sin(t)*16,d=r-Math.cos(t)*16;i.strokeStyle="#00e5ff",i.lineWidth=2,i.beginPath(),i.moveTo(a,r),i.lineTo(h,d),i.stroke()}}class Tn{constructor(e){this.root=e,e.innerHTML=`
      <div class="vignette"></div>

      <a href="/" class="back-link glass" data-el="back">Portfolio</a>

      <!-- Start Screen -->
      <section class="screen screen--start" data-el="start">
        <h1 class="title">DEEPSPACE</h1>
        <div class="subtitle">Cinematic Deep-Space Exploration & Survival</div>
        <div class="rule"></div>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to Launch</button>
        <div class="controls-hint">
          <span><b>WASD</b> 3D Flight</span><span><b>Space</b> Ascend</span><span><b>X / Ctrl</b> Descend</span>
          <span><b>Shift</b> Turbo Boost</span><span><b>B</b> Brake</span><span><b>E</b> Interact / Collect</span>
          <span><b>Q</b> Sonar Scanner</span><span><b>M</b> Sector Map</span><span><b>U</b> Upgrades</span>
        </div>
        <div class="foot">
          <button class="foot__fullscreen" data-el="fullscreen">Fullscreen ⛶</button>
        </div>
      </section>

      <!-- Atmospheric Spacecraft HUD -->
      <div class="hud" data-el="hud" style="visibility:hidden">
        <!-- Top Left: Survival Stats -->
        <div class="hud__stats">
          <div class="stat-row">
            <span class="label">SUIT INTEGRITY</span>
            <span class="value" data-el="suitVal">100%</span>
            <span class="hud__bar hud__bar--suit"><i data-el="suitBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">OXYGEN</span>
            <span class="value" data-el="oxygenVal">100%</span>
            <span class="hud__bar hud__bar--oxygen"><i data-el="oxygenBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">JETPACK FUEL</span>
            <span class="value" data-el="fuelVal">100%</span>
            <span class="hud__bar hud__bar--fuel"><i data-el="fuelBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">MISSION TIME</span>
            <span class="value time-val" data-el="timer">00:00.00</span>
          </div>
        </div>

        <!-- Top Center: Coordinates & Hazard Banner -->
        <div class="hud__coords">
          <span class="label">COSMIC COORDINATES</span>
          <span class="value" data-el="coordsVal">X: 0 Y: 0 Z: 0</span>
          <span class="sub" data-el="altVal">ALTITUDE 3m</span>
          <div class="hud__hazard glass" data-el="hazardBanner" style="display:none">
            <span class="icon">⚠</span>
            <span data-el="hazardText">ALERT</span>
          </div>
        </div>

        <!-- Top Right: Astronaut Level, Credits & Sector -->
        <div class="hud__level">
          <div class="level-header">
            <span class="label" data-el="levelLabel">ASTRONAUT LVL 01</span>
            <span class="credits" data-el="creditsVal">CR 300</span>
          </div>
          <span class="hud__bar hud__bar--xp"><i data-el="xpBar"></i></span>
          <span class="name" data-el="sectorName">SECTOR 01 — ORBITAL RUINS</span>
          <div class="hud__relics">
            <span class="relic-label">RELICS</span>
            <span class="num" data-el="relicsVal">0</span>
          </div>
        </div>

        <!-- Mission Objective Tracker (Center Left) -->
        <div class="hud__mission glass" data-el="missionBox">
          <div class="mission-header">
            <span class="icon">◈</span>
            <span class="m-title" data-el="missionTitle">MISSION 01: LOST SIGNAL</span>
          </div>
          <div class="mission-objective" data-el="missionObjective">Navigate to Signal Coordinates</div>
          <div class="mission-dist" data-el="missionDist">DISTANCE: --m</div>
        </div>

        <!-- Scanner Card HUD Overlay (Center Right) -->
        <div class="hud__scancard glass" data-el="scanCard" style="display:none">
          <div class="scancard-title" data-el="scanTitle">SIGNAL ACQUIRED</div>
          <div class="scancard-row"><span>NAME</span><b data-el="scanName">Research Fragment</b></div>
          <div class="scancard-row"><span>DISTANCE</span><b data-el="scanDist">124m</b></div>
          <div class="scancard-row"><span>BEARING</span><b data-el="scanBearing">074°</b></div>
          <div class="scancard-row"><span>SIGNAL</span><b data-el="scanStrength">85%</b></div>
        </div>

        <!-- Contextual E Interaction Prompt -->
        <div class="hud__interact glass" data-el="interactPrompt" style="display:none">
          <span class="key-badge">E</span>
          <span class="text" data-el="interactText">INTERACT</span>
        </div>

        <!-- Beacon / Status text -->
        <div class="hud__beacon" data-el="beaconBox">
          <span class="icon">⟐</span>
          <span data-el="beaconText">Scanning orbit...</span>
        </div>

        <!-- Speedometer & Radar Instrumentation (Bottom Right) -->
        <div class="hud__instrumentation">
          <div class="hud__speed">
            <span class="ring" data-el="speedRing"></span>
            <div class="readout">
              <span class="kmh" data-el="speedVal">0</span>
              <span class="unit">km/h</span>
            </div>
          </div>
          <div class="radar-container" data-el="radarRoot"></div>
        </div>

        <!-- Control Action Chips (Bottom Left) -->
        <div class="hud__keys">
          <span class="key-chip"><b>SPACE</b> ASCEND</span>
          <span class="key-chip"><b>X</b> DESCEND</span>
          <span class="key-chip"><b>SHIFT</b> BOOST</span>
          <span class="key-chip"><b>B</b> BRAKE</span>
          <span class="key-chip"><b>E</b> INTERACT</span>
          <span class="key-chip"><b>Q</b> SCAN</span>
          <span class="key-chip"><b>M</b> MAP</span>
          <span class="key-chip"><b>U</b> UPGRADES</span>
        </div>

        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <!-- Equipment Upgrades Terminal -->
      <section class="screen screen--overlay" data-el="upgradesScreen" style="display:none">
        <div class="panel glass panel--upgrades" style="position:relative">
          <button class="modal-close-btn" data-el="closeUpgradesX" title="Close Terminal">✕</button>
          <div class="panel__title">EQUIPMENT UPGRADE TERMINAL</div>
          <div class="kicker" data-el="upgradeCredits">CREDITS: CR 300</div>
          
          <div class="upgrades-grid">
            <div class="upgrade-card" data-upgrade="jetpackSpeed">
              <div class="u-title">Jetpack Max Speed</div>
              <div class="u-desc">+10% Thruster Velocity per Tier</div>
              <div class="u-tier" data-el="tier_jetpackSpeed">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_jetpackSpeed">Upgrade (CR 250)</button>
            </div>
            <div class="upgrade-card" data-upgrade="fuelCapacity">
              <div class="u-title">Fuel Tank Capacity</div>
              <div class="u-desc">+20% Max Jetpack Fuel Reserves</div>
              <div class="u-tier" data-el="tier_fuelCapacity">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_fuelCapacity">Upgrade (CR 200)</button>
            </div>
            <div class="upgrade-card" data-upgrade="boostEfficiency">
              <div class="u-title">Boost Efficiency</div>
              <div class="u-desc">-15% Fuel Burn while Warping</div>
              <div class="u-tier" data-el="tier_boostEfficiency">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_boostEfficiency">Upgrade (CR 300)</button>
            </div>
            <div class="upgrade-card" data-upgrade="suitArmor">
              <div class="u-title">Suit Nanoweave Armor</div>
              <div class="u-desc">-20% Damage from Space Debris</div>
              <div class="u-tier" data-el="tier_suitArmor">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_suitArmor">Upgrade (CR 350)</button>
            </div>
            <div class="upgrade-card" data-upgrade="oxygenReserves">
              <div class="u-title">Life Support O2 Tank</div>
              <div class="u-desc">+25% Oxygen Storage Duration</div>
              <div class="u-tier" data-el="tier_oxygenReserves">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_oxygenReserves">Upgrade (CR 200)</button>
            </div>
            <div class="upgrade-card" data-upgrade="scannerRange">
              <div class="u-title">Holo-Sonar Array</div>
              <div class="u-desc">+30m Sonar Ping Detection Radius</div>
              <div class="u-tier" data-el="tier_scannerRange">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_scannerRange">Upgrade (CR 400)</button>
            </div>
          </div>

          <button class="btn btn--primary" data-el="closeUpgrades" style="margin-top:20px">Close Terminal (Esc)</button>
        </div>
      </section>

      <!-- Pause Menu -->
      <section class="screen screen--overlay" data-el="pause" style="display:none">
        <div class="panel glass">
          <div class="kicker" data-el="pauseMeta">Sector 01 · 00:00</div>
          <div class="panel__title">PAUSED</div>
          <div class="menu">
            <button class="is-primary" data-el="resume">Resume Flight</button>
            <button data-el="openUpgrades">Equipment Upgrades (U)</button>
            <button data-el="restartLevel">Restart Sector</button>
            <button data-el="settingsAudio">Audio — On</button>
            <button data-el="mainMenu">Main Menu</button>
          </div>
          <div class="esc-hint">Press <span class="key">Esc</span> to resume</div>
        </div>
      </section>

      <!-- Level Complete / Sector Clear -->
      <section class="screen screen--overlay" data-el="complete" style="display:none">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker">MISSION COMPLETE</div>
          <div class="panel__title" data-el="completeMissionTitle">LOST SIGNAL</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Experience</span><span class="v" data-el="completeXP">+450 XP</span></div>
            <div class="row"><span class="k">Credits Earned</span><span class="v" data-el="completeCredits">+1,200 CR</span></div>
            <div class="row"><span class="k">Mission Time</span><span class="v" data-el="completeTime">04:12</span></div>
          </div>
          <button class="btn btn--primary" data-el="continue">Continue →</button>
        </div>
      </section>

      <!-- Game Over Modal -->
      <section class="screen screen--overlay" data-el="gameover" style="display:none">
        <div class="panel glass">
          <div class="kicker" style="color:#ff3344">CRITICAL FAILURE</div>
          <div class="panel__title">SUIT INTEGRITY COMPROMISED</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Status</span><span class="v">Astronaut Lost in Deep Space</span></div>
          </div>
          <button class="btn btn--primary" data-el="respawnBtn">Respawn at Beacon</button>
        </div>
      </section>

      <div class="bar bar--top"></div>
      <div class="bar bar--bottom"></div>
      <div class="veil" data-el="veil"></div>
    `,this.el={};for(const t of e.querySelectorAll("[data-el]"))this.el[t.dataset.el]=t;this.bars=e.querySelectorAll(".bar"),this.radar=new bn(this.el.radarRoot),this.sectorMap=new Sn(e),this.onUpgradeBuy=null,this._wireUpgradeButtons()}_wireUpgradeButtons(){["jetpackSpeed","fuelCapacity","boostEfficiency","suitArmor","oxygenReserves","scannerRange"].forEach(t=>{this.el[`buy_${t}`]?.addEventListener("click",()=>{this.onUpgradeBuy?.(t)})})}showStart(){this.el.start.style.display="flex",this.hideHUD(),this.el.pause.style.display="none",this.el.complete.style.display="none",this.el.gameover.style.display="none",this.el.upgradesScreen.style.display="none",this.sectorMap.hide()}hideStart(){D.to(this.el.start,{autoAlpha:0,duration:.4,onComplete:()=>{this.el.start.style.display="none",this.el.start.style.opacity="1",this.el.start.style.visibility="visible"}})}showHUD(){this.el.hud.style.visibility="visible",this.el.hud.style.display="block"}hideHUD(){this.el.hud.style.visibility="hidden",this.el.hud.style.display="none"}setSurvivalStats({suitIntegrity:e,health:t,oxygen:s,fuel:i}={}){const n=Number.isFinite(e)?e:Number.isFinite(t)?t:100,o=Number.isFinite(s)?s:100,a=Number.isFinite(i)?i:100;this.el.suitVal.textContent=`${Math.round(n)}%`,this.el.suitBar.style.width=`${Math.max(0,n)}%`,this.el.oxygenVal.textContent=`${Math.round(o)}%`,this.el.oxygenBar.style.width=`${Math.max(0,o)}%`,this.el.fuelVal.textContent=`${Math.round(a)}%`,this.el.fuelBar.style.width=`${Math.max(0,a)}%`,o<25?this.el.oxygenVal.classList.add("stat--crit"):this.el.oxygenVal.classList.remove("stat--crit"),a<20?this.el.fuelVal.classList.add("stat--crit"):this.el.fuelVal.classList.remove("stat--crit")}setProgression({level:e,xp:t,nextLevelXP:s,credits:i,relicsFound:n}){this.el.levelLabel.textContent=`ASTRONAUT LVL ${String(e).padStart(2,"0")}`,this.el.creditsVal.textContent=`CR ${i.toLocaleString()}`;const o=Math.min(100,Math.max(0,t/s*100));this.el.xpBar.style.width=`${o}%`,this.el.relicsVal.textContent=String(n)}setMission(e){if(!e)return;const t=typeof e.getCurrentMissionData=="function"?e.getCurrentMissionData():{title:e.title??"MISSION 01: LOST SIGNAL",objective:typeof e.getObjectiveText=="function"?e.getObjectiveText():"Navigate to Signal Coordinates",distance:e.currentDistance??null};this.el.missionTitle.textContent=t.title,this.el.missionObjective.textContent=t.objective,t.distance!==null&&Number.isFinite(t.distance)?this.el.missionDist.textContent=`DISTANCE: ${Math.round(t.distance)}m`:this.el.missionDist.textContent="STATUS: ACTIVE"}showScanCard(e){if(!e){D.to(this.el.scanCard,{autoAlpha:0,duration:.3,onComplete:()=>{this.el.scanCard.style.display="none"}});return}this.el.scanCard.style.display="block",this.el.scanTitle.textContent=e.type??"OBJECT DETECTED",this.el.scanName.textContent=e.name??"Unknown",this.el.scanDist.textContent=`${e.distance}m`,this.el.scanBearing.textContent=e.bearing,this.el.scanStrength.textContent=e.strength,D.fromTo(this.el.scanCard,{autoAlpha:0,x:20},{autoAlpha:1,x:0,duration:.4,ease:"power2.out"})}setHazardAlert(e,t=""){e?(this.el.hazardBanner.style.display="flex",this.el.hazardBanner.style.borderColor="",this.el.hazardBanner.style.background="",this.el.hazardText.textContent=t):this.el.hazardBanner.style.display="none"}setProximityAlert(e){if(!e){this.el.hazardBanner.dataset.isProximity==="true"&&(this.el.hazardBanner.style.display="none",this.el.hazardBanner.dataset.isProximity="false");return}this.el.hazardBanner.style.display="flex",this.el.hazardBanner.dataset.isProximity="true",e.threatLevel==="CRITICAL"?(this.el.hazardBanner.style.borderColor="#ff3344",this.el.hazardBanner.style.background="rgba(255, 30, 50, 0.28)",this.el.hazardText.textContent=`⚠ COLLISION WARNING: ${e.name.toUpperCase()} (${e.distance}M)`):(this.el.hazardBanner.style.borderColor="#ffaa33",this.el.hazardBanner.style.background="rgba(255, 170, 50, 0.18)",this.el.hazardText.textContent=`⚠ PROXIMITY ALERT: ${e.name} (${e.distance}m)`)}setInteractPrompt(e){this.el.interactPrompt&&(e?(this.el.interactPrompt.style.display="flex",this.el.interactText.textContent=e):this.el.interactPrompt.style.display="none")}setSpeed(e){const t=Number.isFinite(e)?e:0;this.el.speedVal.textContent=String(Math.round(t));const s=Math.min(1,t/120);this.el.speedRing.style.setProperty("--deg",`${Math.round(s*280)}deg`)}setWarpState(e,t=0){e||t>.05?this.el.hud.classList.add("hud--warp"):this.el.hud.classList.remove("hud--warp")}setCoords(e,t,s,i){const n=Number.isFinite(e)?Math.round(e):0,o=Number.isFinite(t)?Math.round(t):0,a=Number.isFinite(s)?Math.round(s):0,r=Number.isFinite(i)?Math.max(0,Math.round(i)):0;this.el.coordsVal.textContent=`X:${n} Y:${o} Z:${a}`,this.el.altVal.textContent=`ALTITUDE ${r}m`}setTimer(e){this.el.timer.textContent=Wt(e)}setBeacon(e){this.el.beaconText.textContent=e}updateRadar(e,t,s){this.radar.render(e,t,s)}updateSectorMap(e,t,s){this.sectorMap.visible&&this.sectorMap.render(e,t,s)}get isUpgradesOpen(){return this.el.upgradesScreen?.style.display==="flex"||this.el.upgradesScreen?.style.display==="block"}get isPauseOpen(){return this.el.pause?.style.display==="flex"||this.el.pause?.style.display==="block"}showUpgrades(e){this.el.pause.style.display="none",this.sectorMap.hide(),this.updateUpgradeTerminal(e),this.el.upgradesScreen.style.display="flex",D.fromTo(this.el.upgradesScreen.querySelector(".panel"),{autoAlpha:0,scale:.92,y:20},{autoAlpha:1,scale:1,y:0,duration:.35,ease:"power2.out"})}hideUpgrades(){this.el.upgradesScreen.style.display="none"}updateUpgradeTerminal(e){this.el.upgradeCredits.textContent=`CREDITS: CR ${e.credits.toLocaleString()}`,["jetpackSpeed","fuelCapacity","boostEfficiency","suitArmor","oxygenReserves","scannerRange"].forEach(s=>{const i=this.el[`tier_${s}`],n=this.el[`buy_${s}`],o=e.upgrades[s]??1,a=e.getUpgradeCost(s),r=o>=5;i&&(i.textContent=r?"MAX TIER (5/5)":`TIER ${o}/5`),n&&(r?(n.textContent="MAXED",n.disabled=!0):(n.textContent=`Upgrade (CR ${a})`,n.disabled=e.credits<a))})}showPause(e){this.el.upgradesScreen.style.display="none",this.sectorMap.hide(),this.el.pauseMeta.textContent=e,this.el.pause.style.display="flex",this.hideHUD(),D.fromTo(this.el.pause.querySelector(".panel"),{autoAlpha:0,scale:.95},{autoAlpha:1,scale:1,duration:.3,ease:"power2.out"})}hidePause(){this.el.pause.style.display="none",this.showHUD()}showGameOver(e=null){this.hideHUD(),this.el.gameover.style.display="flex",this._onRespawnCallback=e,D.fromTo(this.el.gameover.querySelector(".panel"),{autoAlpha:0,scale:.95},{autoAlpha:1,scale:1,duration:.3,ease:"power2.out"})}hideGameOver(){this.el.gameover.style.display="none",this.showHUD()}showComplete(e,t){this.hideHUD(),this.el.complete.style.display="flex",this.el.completeMissionTitle.textContent=e.title??"MISSION CLEAR",this.el.completeXP.textContent=`+${e.xp??0} XP`,this.el.completeCredits.textContent=`+${e.credits?.toLocaleString()??0} CR`,this.el.completeTime.textContent=Wt(e.time??0);const s=()=>{this.el.continue.removeEventListener("click",s),this.el.complete.style.display="none",t?.()};this.el.continue.addEventListener("click",s),D.fromTo(this.el.complete.querySelector(".panel"),{autoAlpha:0,scale:.95},{autoAlpha:1,scale:1,duration:.35,ease:"power2.out"})}hideComplete(){this.el.complete.style.display="none"}toast(e,t=1.8){const s=this.el.toast;s.textContent=e,D.timeline().fromTo(s,{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.35,ease:"expo.out"}).to(s,{autoAlpha:0,y:-10,duration:.4,ease:"power2.in"},`+=${t}`)}}const ss=[{name:"Endless Cosmos",accent:54527,palette:{top:2,horizon:4,fog:2,sunColor:16777215,sunIntensity:2.8},spawn:[0,-4.5,0],objects:[]}];class Ts{constructor(e="DEEPSPACE-PRIME-9"){this.seedString=e,this.seedInt=this.hashString(e),this._state=this.seedInt}hashString(e){let t=2166136261;for(let s=0;s<e.length;s++)t^=e.charCodeAt(s),t=Math.imul(t,16777619);return t>>>0}hashCoords(e,t,s=0,i=0){let n=this.seedInt^i*2654435769;return n=Math.imul(n^Math.floor(e*73856093),2246822507),n=Math.imul(n^Math.floor(t*19349663),3266489909),n=Math.imul(n^Math.floor(s*83492791),668265263),(n^n>>>16)>>>0}next(){let e=this._state+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}setSeed(e){this._state=typeof e=="string"?this.hashString(e):e>>>0}range(e,t){return e+this.next()*(t-e)}rangeInt(e,t){return Math.floor(this.range(e,t+1))}choice(e){return!e||e.length===0?null:e[Math.floor(this.next()*e.length)]}chance(e=.5){return this.next()<e}}const Mn=1/3,oe=1/6,te=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];class Ms{constructor(e=1337){this.p=new Uint8Array(256),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512),this.init(e)}init(e){let t=e;const s=()=>(t=t*1664525+1013904223&4294967295,(t>>>0)/4294967296);for(let i=0;i<256;i++)this.p[i]=i;for(let i=255;i>0;i--){const n=Math.floor(s()*(i+1)),o=this.p[i];this.p[i]=this.p[n],this.p[n]=o}for(let i=0;i<512;i++)this.perm[i]=this.p[i&255],this.permMod12[i]=this.perm[i]%12}noise3D(e,t,s){let i,n,o,a;const r=(e+t+s)*Mn,l=Math.floor(e+r),c=Math.floor(t+r),h=Math.floor(s+r),d=(l+c+h)*oe,p=l-d,m=c-d,g=h-d,f=e-p,v=t-m,x=s-g;let T,S,M,C,A,N;f>=v?v>=x?(T=1,S=0,M=0,C=1,A=1,N=0):f>=x?(T=1,S=0,M=0,C=1,A=0,N=1):(T=0,S=0,M=1,C=1,A=0,N=1):v<x?(T=0,S=0,M=1,C=0,A=1,N=1):f<x?(T=0,S=1,M=0,C=0,A=1,N=1):(T=0,S=1,M=0,C=1,A=1,N=0);const G=f-T+oe,J=v-S+oe,Q=x-M+oe,le=f-C+2*oe,ce=v-A+2*oe,me=x-N+2*oe,fe=f-1+3*oe,ge=v-1+3*oe,he=x-1+3*oe,Me=l&255,qe=c&255,Ye=h&255;let Ie=.6-f*f-v*v-x*x;if(Ie<0)i=0;else{const V=this.permMod12[Me+this.perm[qe+this.perm[Ye]]];Ie*=Ie,i=Ie*Ie*(te[V][0]*f+te[V][1]*v+te[V][2]*x)}let De=.6-G*G-J*J-Q*Q;if(De<0)n=0;else{const V=this.permMod12[Me+T+this.perm[qe+S+this.perm[Ye+M]]];De*=De,n=De*De*(te[V][0]*G+te[V][1]*J+te[V][2]*Q)}let Ne=.6-le*le-ce*ce-me*me;if(Ne<0)o=0;else{const V=this.permMod12[Me+C+this.perm[qe+A+this.perm[Ye+N]]];Ne*=Ne,o=Ne*Ne*(te[V][0]*le+te[V][1]*ce+te[V][2]*me)}let Oe=.6-fe*fe-ge*ge-he*he;if(Oe<0)a=0;else{const V=this.permMod12[Me+1+this.perm[qe+1+this.perm[Ye+1]]];Oe*=Oe,a=Oe*Oe*(te[V][0]*fe+te[V][1]*ge+te[V][2]*he)}return 32*(i+n+o+a)}fbm3D(e,t,s,i=4,n=2,o=.5){let a=0,r=1,l=1,c=0;for(let h=0;h<i;h++)a+=this.noise3D(e*r,t*r,s*r)*l,c+=l,l*=o,r*=n;return a/c}turbulence3D(e,t,s,i=4){let n=0,o=1,a=1,r=0;for(let l=0;l<i;l++)n+=Math.abs(this.noise3D(e*o,t*o,s*o))*a,r+=a,a*=.5,o*=2;return n/r}}const _n=new Ts("DEEPSPACE-PRIME-9");new Ms(_n.seedInt);class An{constructor(e=250){this.sectorSize=e,this.sectors=new Map,this._activeSectors=new Set,this._lastSectorCoord=new y(1/0,1/0,1/0)}_key(e,t,s){return`${e},${t},${s}`}getSectorCoords(e){return{ix:Math.floor(e.x/this.sectorSize),iy:Math.floor(e.y/this.sectorSize),iz:Math.floor(e.z/this.sectorSize)}}insert(e){const t=e.position,{ix:s,iy:i,iz:n}=this.getSectorCoords(t),o=this._key(s,i,n);this.sectors.has(o)||this.sectors.set(o,new Set),this.sectors.get(o).add(e),e._gridSectorKey=o,e._gridSector={ix:s,iy:i,iz:n}}remove(e){e._gridSectorKey&&this.sectors.has(e._gridSectorKey)&&this.sectors.get(e._gridSectorKey).delete(e)}updateEntity(e){const t=e.position,{ix:s,iy:i,iz:n}=this.getSectorCoords(t);this._key(s,i,n)!==e._gridSectorKey&&(this.remove(e),this.insert(e))}getActiveEntities(e,t=2){const{ix:s,iy:i,iz:n}=this.getSectorCoords(e),o=[];for(let a=-t;a<=t;a++)for(let r=-t;r<=t;r++)for(let l=-t;l<=t;l++){const c=this._key(s+a,i+r,n+l),h=this.sectors.get(c);if(h&&h.size>0)for(const d of h)o.push(d)}return o}calculateLOD(e,t=120,s=600,i=2500){return e<t?"HIGH":e<s?"MEDIUM":e<i?"FAR":"EXTREME_FAR"}}const Cn=`
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinkleSpeed;
  attribute float aTwinklePhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Dynamic Twinkle
    float tw = 0.8 + 0.2 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
    vAlpha = tw;

    float pz = max(50.0, -mvPosition.z);
    gl_PointSize = max(2.2, aSize * uPixelRatio * (6000.0 / pz) * tw);
    gl_PointSize = min(gl_PointSize, 36.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,Rn=`
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = exp(-dist * 3.2);
    float intensity = core * 0.85 + glow * 0.55;

    gl_FragColor = vec4(vColor * 1.8, intensity * vAlpha);
  }
`,is=[new b(10335487),new b(12307711),new b(16316927),new b(16777197),new b(16774376),new b(16768436),new b(16755336)];class En{constructor(e,t){this.scene=e,this.seed=t,this.group=new _,e.add(this.group),this.layers=[],this.uniforms={uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,2)}},this._buildStarfield()}_buildStarfield(){this._createStarLayer({count:14e3,radiusMin:3500,radiusMax:12e3,sizeMin:1,sizeMax:2.2,twinkleRate:1.2,clusterBias:.7}),this._createStarLayer({count:5e3,radiusMin:1200,radiusMax:3500,sizeMin:2,sizeMax:4.5,twinkleRate:2.4,clusterBias:.5}),this._createStarLayer({count:600,radiusMin:400,radiusMax:1400,sizeMin:4.5,sizeMax:8,twinkleRate:3.5,clusterBias:.3})}_createStarLayer({count:e,radiusMin:t,radiusMax:s,sizeMin:i,sizeMax:n,twinkleRate:o,clusterBias:a}){const r=new Float32Array(e*3),l=new Float32Array(e*3),c=new Float32Array(e),h=new Float32Array(e),d=new Float32Array(e);for(let f=0;f<e;f++){const v=f*3,x=this.seed.next(),T=this.seed.next();let S=x*2*Math.PI,M=Math.acos(2*T-1);this.seed.next()<a&&(M=Math.PI*.5+(this.seed.next()-.5)*.6);const C=this.seed.range(t,s);r[v]=C*Math.sin(M)*Math.cos(S),r[v+1]=C*Math.cos(M),r[v+2]=C*Math.sin(M)*Math.sin(S);const A=this.seed.choice(is)||is[2];l[v]=A.r,l[v+1]=A.g,l[v+2]=A.b,c[f]=this.seed.range(i,n),h[f]=this.seed.range(.5,o),d[f]=this.seed.range(0,Math.PI*2)}const p=new re;p.setAttribute("position",new R(r,3)),p.setAttribute("aColor",new R(l,3)),p.setAttribute("aSize",new R(c,1)),p.setAttribute("aTwinkleSpeed",new R(h,1)),p.setAttribute("aTwinklePhase",new R(d,1));const m=new O({vertexShader:Cn,fragmentShader:Rn,uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:F}),g=new xe(p,m);this.group.add(g),this.layers.push(g)}update(e,t){this.uniforms.uTime.value+=e,t&&this.group.position.copy(t)}dispose(){for(const e of this.layers)e.geometry.dispose(),e.material.dispose(),this.group.remove(e);this.scene.remove(this.group)}}const dt=`
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aCoreFactor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vCore;

  void main() {
    vColor = aColor;
    vCore = aCoreFactor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float pz = max(100.0, -mvPosition.z);
    gl_PointSize = max(2.5, aSize * uPixelRatio * (8500.0 / pz));
    gl_PointSize = min(gl_PointSize, 54.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,pt=`
  varying vec3 vColor;
  varying float vCore;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = exp(-dist * 3.4);
    float alpha = core * 0.85 + glow * (0.5 + vCore * 0.6);

    gl_FragColor = vec4(vColor * (1.5 + vCore * 1.8), alpha);
  }
`;class Ln{constructor(e,t){this.scene=e,this.seed=t,this.group=new _,e.add(this.group),this.galaxies=[],this.uniforms={uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,2)}},this._generateDistantGalaxies()}_generateDistantGalaxies(){this._createSpiralGalaxy({position:new y(12e3,4500,-18e3),rotation:new Ee(.7,.4,-.3),radius:3800,starCount:6500,arms:2,armSpread:.45,spin:3.2,coreColor:new b(16771272),armColor:new b(3718648),dustColor:new b(12616956)}),this._createSpiralGalaxy({position:new y(-16e3,-3200,14e3),rotation:new Ee(-.5,1.2,.8),radius:3200,starCount:4800,arms:4,armSpread:.35,spin:2.8,coreColor:new b(16774102),armColor:new b(8490232),dustColor:new b(15485081)}),this._createEllipticalGalaxy({position:new y(-8e3,9500,-16e3),rotation:new Ee(.2,.6,.1),radius:2600,starCount:4200,coreColor:new b(16772829),outerColor:new b(16096779)}),this._createIrregularGalaxy({position:new y(14e3,-6500,-9e3),radius:2e3,starCount:3e3,color:new b(3462041)})}_createSpiralGalaxy({position:e,rotation:t,radius:s,starCount:i,arms:n,armSpread:o,spin:a,coreColor:r,armColor:l,dustColor:c}){const h=new Float32Array(i*3),d=new Float32Array(i*3),p=new Float32Array(i),m=new Float32Array(i);for(let x=0;x<i;x++){const T=x*3,S=Math.pow(this.seed.next(),2.2)*s,M=Math.max(0,1-S/(s*.35)),A=x%n*2*Math.PI/n,N=S/s*a*Math.PI,G=S/s*o*s*.35,J=Math.pow(this.seed.next(),1.5)*(this.seed.next()<.5?1:-1)*G,Q=Math.pow(this.seed.next(),2)*(this.seed.next()<.5?1:-1)*(G*.25),le=Math.pow(this.seed.next(),1.5)*(this.seed.next()<.5?1:-1)*G,ce=A+N,me=Math.cos(ce)*S+J,fe=Q,ge=Math.sin(ce)*S+le;h[T]=me,h[T+1]=fe,h[T+2]=ge;const he=new b;if(M>.4)he.copy(r).lerp(l,1-M);else{const Me=S/s;he.copy(l).lerp(c,Me)}d[T]=he.r,d[T+1]=he.g,d[T+2]=he.b,p[x]=M>.6?this.seed.range(3.5,7):this.seed.range(1.5,3.8),m[x]=M}const g=new re;g.setAttribute("position",new R(h,3)),g.setAttribute("aColor",new R(d,3)),g.setAttribute("aSize",new R(p,1)),g.setAttribute("aCoreFactor",new R(m,1));const f=new O({vertexShader:dt,fragmentShader:pt,uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:F}),v=new xe(g,f);v.position.copy(e),t&&v.rotation.copy(t),this.group.add(v),this.galaxies.push(v)}_createEllipticalGalaxy({position:e,rotation:t,radius:s,starCount:i,coreColor:n,outerColor:o}){const a=new Float32Array(i*3),r=new Float32Array(i*3),l=new Float32Array(i),c=new Float32Array(i);for(let m=0;m<i;m++){const g=m*3,f=this.seed.next(),v=Math.pow(f,3)*s,x=this.seed.next()*Math.PI*2,T=Math.acos(this.seed.next()*2-1),S=v*Math.sin(T)*Math.cos(x)*1.3,M=v*Math.cos(T)*.75,C=v*Math.sin(T)*Math.sin(x)*1;a[g]=S,a[g+1]=M,a[g+2]=C;const A=Math.max(0,1-v/(s*.4)),N=new b().copy(n).lerp(o,1-A);r[g]=N.r,r[g+1]=N.g,r[g+2]=N.b,l[m]=A>.5?this.seed.range(3,6):this.seed.range(1.2,3),c[m]=A}const h=new re;h.setAttribute("position",new R(a,3)),h.setAttribute("aColor",new R(r,3)),h.setAttribute("aSize",new R(l,1)),h.setAttribute("aCoreFactor",new R(c,1));const d=new O({vertexShader:dt,fragmentShader:pt,uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:F}),p=new xe(h,d);p.position.copy(e),t&&p.rotation.copy(t),this.group.add(p),this.galaxies.push(p)}_createIrregularGalaxy({position:e,radius:t,starCount:s,color:i}){const n=new Float32Array(s*3),o=new Float32Array(s*3),a=new Float32Array(s),r=new Float32Array(s);for(let d=0;d<s;d++){const p=d*3,m=Math.pow(this.seed.next(),1.6)*t,g=this.seed.next()*Math.PI*2,f=Math.acos(this.seed.next()*2-1),v=(Math.sin(g*3)+Math.cos(f*2))*.25+1,x=m*Math.sin(f)*Math.cos(g)*v,T=m*Math.cos(f)*.6*v,S=m*Math.sin(f)*Math.sin(g)*v;n[p]=x,n[p+1]=T,n[p+2]=S,o[p]=i.r,o[p+1]=i.g,o[p+2]=i.b,a[d]=this.seed.range(1.5,4),r[d]=.2}const l=new re;l.setAttribute("position",new R(n,3)),l.setAttribute("aColor",new R(o,3)),l.setAttribute("aSize",new R(a,1)),l.setAttribute("aCoreFactor",new R(r,1));const c=new O({vertexShader:dt,fragmentShader:pt,uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:F}),h=new xe(l,c);h.position.copy(e),this.group.add(h),this.galaxies.push(h)}update(e){this.uniforms.uTime.value+=e;for(const t of this.galaxies)t.rotation.y+=e*4e-4}}const kn=`
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Pn=`
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uDensity;
  uniform float uScale;

  varying vec3 vWorldPos;
  varying vec2 vUv;

  // GPU Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractional Brownian Motion (fBm)
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; ++i) {
      v += a * snoise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = vWorldPos * uScale * 0.0003;
    float timeFlow = uTime * 0.012;

    // Organic Domain Warping
    vec3 q = vec3(fbm(p + vec3(0.0, timeFlow, 0.0)),
                  fbm(p + vec3(5.2, 1.3, timeFlow)),
                  fbm(p + vec3(1.7, 9.2, 0.4)));

    vec3 r = vec3(fbm(p + 4.0 * q + vec3(1.7, 9.2, timeFlow)),
                  fbm(p + 4.0 * q + vec3(8.3, 2.8, 0.1)),
                  fbm(p + 4.0 * q + vec3(2.2, 4.5, timeFlow * 0.5)));

    float f = fbm(p + 4.0 * r);

    // Radial Falloff on billboard plane
    float distToCenter = length(vUv - vec2(0.5)) * 2.0;
    float mask = smoothstep(1.0, 0.15, distToCenter);

    float n = clamp(f * 0.8 + 0.3, 0.0, 1.0);
    float alpha = pow(n, 2.0) * mask * uDensity;

    // Multi-spectral color mixing
    vec3 color = mix(uColor1, uColor2, clamp(length(q), 0.0, 1.0));
    float coreFilament = clamp(f * 0.5 + 0.5, 0.0, 1.0);
    color += uColor1 * 0.5 * pow(coreFilament, 3.0);

    if (alpha < 0.005) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;class In{constructor(e,t){this.scene=e,this.seed=t,this.group=new _,e.add(this.group),this.materials=[],this._buildCosmicNebulas()}_buildCosmicNebulas(){this._createNebulaVolume({position:new y(-14e3,3200,-12e3),scale:new y(9500,6500,8e3),color1:new b(61695),color2:new b(6514417),color3:new b(11032055),density:.42,layers:5}),this._createNebulaVolume({position:new y(9e3,-4500,-16e3),scale:new y(11e3,7500,9e3),color1:new b(16711799),color2:new b(16729088),color3:new b(5195493),density:.38,layers:6}),this._createNebulaVolume({position:new y(16e3,5e3,11e3),scale:new y(8500,5500,7500),color1:new b(1096065),color2:new b(440020),color3:new b(16096779),density:.35,layers:4})}_createNebulaVolume({position:e,scale:t,color1:s,color2:i,color3:n,density:o,layers:a}){const r=new Xe(1,1,16,16);for(let l=0;l<a;l++){const c=new O({vertexShader:kn,fragmentShader:Pn,uniforms:{uTime:{value:this.seed.range(0,100)},uColor1:{value:s},uColor2:{value:i},uColor3:{value:n},uDensity:{value:o/Math.sqrt(a)},uScale:{value:1+l*.2}},transparent:!0,depthWrite:!1,blending:F,side:$}),h=new w(r,c),d=(l-a/2)*(t.z/a);h.position.set(e.x+(this.seed.next()-.5)*400,e.y+(this.seed.next()-.5)*400,e.z+d),h.scale.set(t.x*(.9+this.seed.next()*.2),t.y*(.9+this.seed.next()*.2),1),h.lookAt(0,0,0),h.rotateZ(this.seed.next()*Math.PI*2),this.group.add(h),this.materials.push(c)}}update(e){for(const t of this.materials)t.uniforms.uTime.value+=e}}const Dn=`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`,Nn=`
  uniform vec3 uSunDirection;
  uniform vec3 uAtmosphereColor;
  uniform vec3 uTwilightColor;
  uniform float uIntensity;
  uniform float uPower;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // 1. Fresnel Rim factor (maximum at glancing angles)
    float fresnel = dot(viewDir, normal);
    float rim = pow(clamp(1.0 - abs(fresnel), 0.0, 1.0), uPower);

    // 2. Solar light alignment factor
    float sunDot = dot(normal, normalize(uSunDirection));
    float dayFactor = clamp(sunDot * 0.5 + 0.5, 0.0, 1.0);

    // 3. Twilight transition at the terminator line
    float twilight = pow(clamp(1.0 - abs(sunDot), 0.0, 1.0), 2.0);

    vec3 finalColor = mix(uAtmosphereColor, uTwilightColor, twilight * 0.7);
    float alpha = rim * (dayFactor * 0.85 + 0.15) * uIntensity;

    if (alpha < 0.005) discard;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;function Je(u,{sunDirection:e=new y(1,.5,.8).normalize(),atmosphereColor:t=new b(3718648),twilightColor:s=new b(16096779),intensity:i=1.4,power:n=3.2,segments:o=48}={}){const a=new z(u*1.08,o,o),r=new O({vertexShader:Dn,fragmentShader:Nn,uniforms:{uSunDirection:{value:e.clone()},uAtmosphereColor:{value:t.clone()},uTwilightColor:{value:s.clone()},uIntensity:{value:i},uPower:{value:n}},transparent:!0,depthWrite:!1,blending:F,side:ai});return new w(a,r)}const Rt=`
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p, int octaves) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 6; ++i) {
      if (i >= octaves) break;
      v += a * snoise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }
`,On=`
  ${Rt}

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uOceanDeep;
  uniform vec3 uOceanShallow;
  uniform vec3 uLandLow;
  uniform vec3 uLandHigh;
  uniform vec3 uSnow;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);
    float NdotL = max(0.05, dot(n, sunDir));

    // Continental Elevation Map
    vec3 p = vPosition * 0.008;
    float elevation = fbm(p, 5);

    // Dynamic Cloud Layer
    vec3 cloudP = p + vec3(uTime * 0.015, 0.0, uTime * 0.008);
    float cloud = smoothstep(0.45, 0.75, fbm(cloudP * 1.6, 4));

    vec3 surfaceColor;
    float specular = 0.0;

    if (elevation < 0.08) {
      // Ocean (Deep -> Shallow)
      float waterDepth = smoothstep(-0.4, 0.08, elevation);
      surfaceColor = mix(uOceanDeep, uOceanShallow, waterDepth);
      
      // Ocean Specular Glint
      vec3 viewDir = normalize(cameraPosition - vPosition);
      vec3 halfVec = normalize(sunDir + viewDir);
      specular = pow(max(0.0, dot(n, halfVec)), 48.0) * 1.5;
    } else if (elevation < 0.38) {
      // Lowlands to Forests
      float t = smoothstep(0.08, 0.38, elevation);
      surfaceColor = mix(uLandLow, uLandHigh, t);
    } else {
      // High Mountains & Snow Peaks
      float t = smoothstep(0.38, 0.65, elevation);
      surfaceColor = mix(uLandHigh, uSnow, t);
    }

    // Blend Cloud Shadows and Clouds
    surfaceColor = mix(surfaceColor * 0.7, surfaceColor, 1.0 - cloud * 0.5);
    surfaceColor = mix(surfaceColor, vec3(1.0), cloud * 0.95);

    vec3 finalColor = surfaceColor * NdotL + vec3(specular * (1.0 - cloud));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`,zn=`
  ${Rt}

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uCrustColor;
  uniform vec3 uLavaColor;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);
    float NdotL = max(0.08, dot(n, sunDir));

    vec3 p = vPosition * 0.012;
    float timeP = uTime * 0.03;

    // Voronoi-like Cracking
    float crust = abs(snoise(p + vec3(0.0, timeP * 0.2, 0.0)));
    float cracks = 1.0 - smoothstep(0.0, 0.18, crust);

    // Pulsing Magma Heat
    float magmaPulse = 0.8 + 0.2 * sin(uTime * 1.5 + p.x * 4.0);
    vec3 lava = uLavaColor * (cracks * 2.8 * magmaPulse);

    vec3 finalColor = (uCrustColor * NdotL) + lava;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`,Fn=`
  ${Rt}

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uBandColor1;
  uniform vec3 uBandColor2;
  uniform vec3 uBandColor3;
  uniform vec3 uSpotColor;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);
    float NdotL = max(0.04, dot(n, sunDir));

    // Latitudinal Bands with Jet Stream Shear Flow
    float lat = vPosition.y * 0.02;
    float shear = snoise(vec3(vPosition.x * 0.005 + uTime * 0.02, lat, vPosition.z * 0.005)) * 0.4;
    float bandCoord = sin(lat * 8.0 + shear * 3.0);

    float t1 = smoothstep(-1.0, 0.0, bandCoord);
    float t2 = smoothstep(0.0, 1.0, bandCoord);

    vec3 color = mix(uBandColor1, uBandColor2, t1);
    color = mix(color, uBandColor3, t2);

    // Great Storm Vortex
    vec2 stormCenter = vec2(0.2, -0.3);
    float stormDist = length(n.xy - stormCenter);
    float storm = smoothstep(0.35, 0.05, stormDist);
    color = mix(color, uSpotColor, storm * 0.85);

    gl_FragColor = vec4(color * NdotL, 1.0);
  }
`,mt=`
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;class Gn{constructor({scene:e,physics:t,materials:s,seed:i}){this.scene=e,this.physics=t,this.materials=s,this.seed=i,this.group=new _,e.add(this.group),this.planets=[],this.rotators=[],this.sunDirection=new y(1,.4,.8).normalize(),this._generatePlanetarySystem()}_generatePlanetarySystem(){this._createOceanWorld({name:"Gaia-IV Prime",position:new y(4500,1200,-6500),radius:420,rotationSpeed:.015,atmosphereColor:new b(46296),twilightColor:new b(16096779),moons:[{name:"Selene-A",radius:45,distance:950,speed:.04,color:9083816}]}),this._createLavaWorld({name:"Ignis Vulcan",position:new y(-5500,-800,-7800),radius:340,rotationSpeed:.02,atmosphereColor:new b(16724736),twilightColor:new b(16746496)}),this._createGasGiant({name:"Kronos-9 Gas Giant",position:new y(-7200,3400,9500),radius:850,rotationSpeed:.008,ringInner:1100,ringOuter:2200,atmosphereColor:new b(14723437),twilightColor:new b(14427686),moons:[{name:"Titan-X",radius:65,distance:2600,speed:.025,color:9741240},{name:"Enceladus-B",radius:35,distance:3400,speed:.018,color:14870768}]}),this._createIceWorld({name:"Boreas-7 Ice World",position:new y(8200,-2200,7500),radius:290,rotationSpeed:.012,atmosphereColor:new b(3718648),twilightColor:new b(11032055)})}_createOceanWorld({name:e,position:t,radius:s,rotationSpeed:i,atmosphereColor:n,twilightColor:o,moons:a=[]}){const r=new _;r.position.copy(t),this.group.add(r);const l=new O({vertexShader:mt,fragmentShader:On,uniforms:{uTime:{value:0},uSunDirection:{value:this.sunDirection},uOceanDeep:{value:new b(147082)},uOceanShallow:{value:new b(38599)},uLandLow:{value:new b(2976335)},uLandHigh:{value:new b(8343332)},uSnow:{value:new b(16777215)}}}),c=new w(new z(s,64,48),l);c.castShadow=!0,c.receiveShadow=!0,r.add(c);const h=Je(s,{sunDirection:this.sunDirection,atmosphereColor:n,twilightColor:o,intensity:1.5});r.add(h);const d=new ye(s,{name:e,layer:"SOLID"});d.setStatic(t),this.physics.addCollider(d);const p=new $e(t,s*2.2,{name:`${e} Atmosphere`,surfaceRadius:s,density:.35,gravityStrength:4.5});this.physics.addAtmosphere(p),this.planets.push({name:e,position:t,radius:s,group:r,mesh:c,mat:l,type:"OCEAN"}),this.rotators.push({mesh:c,speed:i,mat:l});for(const m of a)this._createMoon(r,m,t)}_createLavaWorld({name:e,position:t,radius:s,rotationSpeed:i,atmosphereColor:n,twilightColor:o}){const a=new _;a.position.copy(t),this.group.add(a);const r=new O({vertexShader:mt,fragmentShader:zn,uniforms:{uTime:{value:0},uSunDirection:{value:this.sunDirection},uCrustColor:{value:new b(1708555)},uLavaColor:{value:new b(16724736)}}}),l=new w(new z(s,64,48),r);a.add(l);const c=Je(s,{sunDirection:this.sunDirection,atmosphereColor:n,twilightColor:o,intensity:1.3});a.add(c);const h=new ye(s,{name:e});h.setStatic(t),this.physics.addCollider(h);const d=new $e(t,s*1.8,{name:`${e} Atmosphere`,surfaceRadius:s,density:.45,gravityStrength:5});this.physics.addAtmosphere(d),this.planets.push({name:e,position:t,radius:s,group:a,mesh:l,mat:r,type:"LAVA"}),this.rotators.push({mesh:l,speed:i,mat:r})}_createGasGiant({name:e,position:t,radius:s,rotationSpeed:i,ringInner:n,ringOuter:o,atmosphereColor:a,twilightColor:r,moons:l=[]}){const c=new _;c.position.copy(t),this.group.add(c);const h=new O({vertexShader:mt,fragmentShader:Fn,uniforms:{uTime:{value:0},uSunDirection:{value:this.sunDirection},uBandColor1:{value:new b(14251782)},uBandColor2:{value:new b(16708551)},uBandColor3:{value:new b(9584654)},uSpotColor:{value:new b(12131356)}}}),d=new w(new z(s,64,48),h);c.add(d);const p=new Qe(n,o,96),m=new P({color:13935475,roughness:.8,metalness:.2,side:$,transparent:!0,opacity:.88}),g=new w(p,m);g.rotation.x=Math.PI*.42,g.rotation.y=.15,c.add(g);const f=Je(s,{sunDirection:this.sunDirection,atmosphereColor:a,twilightColor:r,intensity:1.6,power:2.8});c.add(f);const v=new ye(s,{name:e});v.setStatic(t),this.physics.addCollider(v);const x=new $e(t,s*2.8,{name:`${e} Dense Atmosphere`,surfaceRadius:s,density:.6,gravityStrength:8.5});this.physics.addAtmosphere(x),this.planets.push({name:e,position:t,radius:s,group:c,mesh:d,mat:h,type:"GAS_GIANT"}),this.rotators.push({mesh:d,speed:i,mat:h});for(const T of l)this._createMoon(c,T,t)}_createIceWorld({name:e,position:t,radius:s,rotationSpeed:i,atmosphereColor:n,twilightColor:o}){const a=new _;a.position.copy(t),this.group.add(a);const r=new P({color:9684477,roughness:.18,metalness:.75}),l=new w(new z(s,64,48),r);a.add(l);const c=Je(s,{sunDirection:this.sunDirection,atmosphereColor:n,twilightColor:o,intensity:1.4});a.add(c);const h=new ye(s,{name:e});h.setStatic(t),this.physics.addCollider(h);const d=new $e(t,s*1.9,{name:`${e} Atmosphere`,surfaceRadius:s,density:.3,gravityStrength:4});this.physics.addAtmosphere(d),this.planets.push({name:e,position:t,radius:s,group:a,mesh:l,mat:r,type:"ICE"}),this.rotators.push({mesh:l,speed:i})}_createMoon(e,{name:t,radius:s,distance:i,speed:n,color:o},a){const r=new _;e.add(r);const l=new P({color:o,roughness:.9,metalness:.1}),c=new w(new z(s,32,24),l);c.position.set(i,0,0),c.castShadow=!0,c.receiveShadow=!0,r.add(c);const h=a.clone().add(new y(i,0,0)),d=new ye(s,{name:t,mesh:c});d.setStatic(h),this.physics.addCollider(d),this.rotators.push({orbitGroup:r,speed:n,collider:d,mesh:c,parentPos:a,distance:i})}update(e){for(const t of this.rotators)t.mat?.uniforms?.uTime&&(t.mat.uniforms.uTime.value+=e),t.mesh&&t.speed&&!t.orbitGroup&&(t.mesh.rotation.y+=e*t.speed),t.orbitGroup&&(t.orbitGroup.rotation.y+=e*t.speed,t.collider&&t.collider.syncFromMesh())}}class Un{constructor({scene:e,physics:t,materials:s,seed:i,noise:n}){this.scene=e,this.physics=t,this.materials=s,this.seed=i,this.noise=n,this.group=new _,e.add(this.group),this.asteroidFields=[],this.activeColliders=[],this._initAsteroidGeometries(),this._generateAsteroidBelts()}_initAsteroidGeometries(){const e=new At(1,2),t=e.attributes.position,s=new y;for(let i=0;i<t.count;i++){s.fromBufferAttribute(t,i);const n=1+this.noise.fbm3D(s.x*2,s.y*2,s.z*2,3,2,.4)*.45;s.multiplyScalar(n),t.setXYZ(i,s.x,s.y,s.z)}e.computeVertexNormals(),this.rockyGeo=e,this.rockyMat=new P({color:3357509,roughness:.88,metalness:.15,flatShading:!0}),this.metallicMat=new P({color:5924210,roughness:.35,metalness:.92,flatShading:!0})}_generateAsteroidBelts(){this._createBelt({name:"Tartarus Asteroid Belt",count:450,center:new y(0,0,-2200),radiusInner:800,radiusOuter:2400,height:350,scaleMin:4,scaleMax:32,mat:this.rockyMat}),this._createBelt({name:"Vulkan Iron Arc",count:280,center:new y(2600,-800,1800),radiusInner:400,radiusOuter:1200,height:220,scaleMin:3,scaleMax:24,mat:this.metallicMat})}_createBelt({name:e,count:t,center:s,radiusInner:i,radiusOuter:n,height:o,scaleMin:a,scaleMax:r,mat:l}){const c=new _t(this.rockyGeo,l,t);c.castShadow=!0,c.receiveShadow=!0;const h=new st,d=[];for(let p=0;p<t;p++){const m=this.seed.next()*Math.PI*2,g=this.seed.range(i,n),f=s.x+Math.cos(m)*g,v=s.y+(this.seed.next()-.5)*o,x=s.z+Math.sin(m)*g,T=this.seed.range(a,r),S=this.seed.next()*Math.PI*2,M=this.seed.next()*Math.PI*2,C=this.seed.next()*Math.PI*2;h.position.set(f,v,x),h.rotation.set(S,M,C),h.scale.set(T,T*(.8+this.seed.next()*.4),T*(.8+this.seed.next()*.4)),h.updateMatrix(),c.setMatrixAt(p,h.matrix),d.push({position:new y(f,v,x),radius:T*1.1,collider:null})}c.instanceMatrix.needsUpdate=!0,this.group.add(c),this.asteroidFields.push({name:e,mesh:c,asteroids:d})}update(e,t){if(!t)return;const s=25600;for(const i of this.asteroidFields)for(const n of i.asteroids)if(t.distanceToSquared(n.position)<s)n.collider||(n.collider=new ye(n.radius,{name:"Asteroid",restitution:.12,friction:.25}),n.collider.setStatic(n.position),this.physics.addCollider(n.collider),this.activeColliders.push(n.collider));else if(n.collider){this.physics.removeCollider(n.collider);const a=this.activeColliders.indexOf(n.collider);a!==-1&&this.activeColliders.splice(a,1),n.collider=null}}}class Bn{constructor({scene:e,physics:t,materials:s,seed:i}){this.scene=e,this.physics=t,this.materials=s,this.seed=i,this.group=new _,e.add(this.group),this.stations=[],this.ships=[],this.platforms=[],this.satellites=[],this.rotators=[],this._initMaterials(),this._buildCosmicStructures()}_initMaterials(){this.hullWhite=new P({color:14870768,roughness:.28,metalness:.85}),this.hullDark=new P({color:1976635,roughness:.35,metalness:.92}),this.solarPanelMat=new P({color:165063,roughness:.15,metalness:.95,emissive:223649,emissiveIntensity:.25}),this.glassCyan=new H({color:61695,metalness:.1,roughness:.1,transmission:.8,transparent:!0,opacity:.7}),this.engineCyan=new U({color:61695}),this.beaconRed=new U({color:16716083}),this.neonBlue=new U({color:3718648})}_buildCosmicStructures(){this._createStardockPlatform(new y(0,-6,0)),this._createSpaceship({type:"SHUTTLE",position:new y(12,-4.6,6),rotation:new Ee(0,-Math.PI*.25,0),name:"Discovery-IV Space Shuttle"}),this._createOrbitalStation({name:"Ares Orbital Outpost 01",position:new y(180,45,-360),ringRadius:48,tubeRadius:4.5}),this._createDerelictCruiser({name:"Derelict Titan Battlecruiser",position:new y(-450,110,-820),rotation:new Ee(.4,.8,-.2)}),this._createSatellite({name:"Quantum Comm Relay 09",position:new y(620,-80,540)})}_createStardockPlatform(e){const t=new _;t.position.copy(e),this.group.add(t);const s=new w(new I(42,1.4,42),this.hullDark);s.castShadow=!0,s.receiveShadow=!0,t.add(s);const i=new w(new I(43,.4,.5),this.engineCyan);i.position.set(0,.7,21.2),t.add(i);const n=new w(new I(43,.4,.5),this.engineCyan);n.position.set(0,.7,-21.2),t.add(n);const o=new w(new I(.5,.4,43),this.engineCyan);o.position.set(21.2,.7,0),t.add(o);const a=new w(new I(.5,.4,43),this.engineCyan);a.position.set(-21.2,.7,0),t.add(a);const r=new w(new I(32,.06,1.6),this.neonBlue);r.position.set(0,.72,0),t.add(r);const l=new w(new I(1.6,.06,32),this.neonBlue);l.position.set(0,.72,0),t.add(l);const c=[[19,19],[-19,19],[19,-19],[-19,-19]];for(const[d,p]of c){const m=new w(new Z(.5,.8,5,8),this.hullDark);m.position.set(d,2.5,p),t.add(m);const g=new w(new z(.7,12,12),this.beaconRed);g.position.set(d,5.2,p),t.add(g)}const h=new we(new y(21.5,.7,21.5),{name:"Hyperion Stardock Platform",restitution:0,friction:.25});h.setStatic(e),this.physics.addCollider(h),this.platforms.push({name:"Hyperion Stardock",position:e,group:t})}_createSpaceship({type:e,position:t,rotation:s,name:i}){const n=new _;n.position.copy(t),s&&n.rotation.copy(s),this.group.add(n);const o=new w(new wt(2.4,14,8),this.hullWhite);o.rotation.x=Math.PI*.5,o.castShadow=!0,n.add(o);const a=new w(new Ce(1,3.2,8,12),this.glassCyan);a.position.set(0,.9,1.2),a.rotation.x=Math.PI*.5,n.add(a);const r=new I(11,.25,5),l=new w(r,this.hullDark);l.position.set(0,-.2,-1.8),l.castShadow=!0,n.add(l);const c=new I(.2,3.2,2.8),h=new w(c,this.hullDark);h.position.set(4.2,1.4,-2.5),h.rotation.z=-.18,n.add(h);const d=new w(c,this.hullDark);d.position.set(-4.2,1.4,-2.5),d.rotation.z=.18,n.add(d);const p=new Z(.7,.9,2.4,12),m=new w(p,this.hullDark);m.rotation.x=Math.PI*.5,m.position.set(1.4,0,-6.8),n.add(m);const g=new w(new We(.68,12),this.engineCyan);g.position.set(1.4,0,-8.01),g.rotation.y=Math.PI,n.add(g);const f=new w(p,this.hullDark);f.rotation.x=Math.PI*.5,f.position.set(-1.4,0,-6.8),n.add(f);const v=new w(new We(.68,12),this.engineCyan);v.position.set(-1.4,0,-8.01),v.rotation.y=Math.PI,n.add(v);const x=new we(new y(5.8,1.8,7.5),{name:i});x.setStatic(t,n.quaternion),this.physics.addCollider(x),this.ships.push({name:i,position:t,group:n})}_createOrbitalStation({name:e,position:t,ringRadius:s,tubeRadius:i}){const n=new _;n.position.copy(t),this.group.add(n);const o=new w(new Z(8,8,54,16),this.hullDark);o.castShadow=!0,n.add(o);const a=new _;n.add(a);const r=new w(new Se(s,i,16,48),this.hullWhite);r.rotation.x=Math.PI*.5,r.castShadow=!0,a.add(r);for(let h=0;h<4;h++){const d=h*Math.PI/2,p=new w(new Z(1.8,1.8,s,8),this.hullDark);p.position.set(Math.cos(d)*s/2,0,Math.sin(d)*s/2),p.rotation.z=Math.PI*.5,p.rotation.y=-d,a.add(p)}for(let h=0;h<2;h++){const d=new w(new I(32,.4,8),this.solarPanelMat);d.position.set(0,24*(h===0?1:-1),0),n.add(d)}const l=new we(new y(10,28,10),{name:`${e} Core`});l.setStatic(t),this.physics.addCollider(l);const c=new ye(s+i,{name:e});c.setStatic(t),this.physics.addCollider(c),this.stations.push({name:e,position:t,group:n}),this.rotators.push({mesh:a,speed:.06})}_createDerelictCruiser({name:e,position:t,rotation:s}){const i=new _;i.position.copy(t),s&&i.rotation.copy(s),this.group.add(i);const n=new w(new I(18,14,52),this.hullDark);n.castShadow=!0,i.add(n);const o=new w(new I(14,10,36),this.hullDark);o.position.set(0,-4,48),o.rotation.y=.25,i.add(o);const a=new w(new z(1.2,8,8),this.beaconRed);a.position.set(0,8,10),i.add(a);const r=new we(new y(16,12,60),{name:e});r.setStatic(t,i.quaternion),this.physics.addCollider(r),this.stations.push({name:e,position:t,group:i})}_createSatellite({name:e,position:t}){const s=new _;s.position.copy(t),this.group.add(s);const i=new w(new Z(2.4,2.4,4.2,6),this.hullDark);s.add(i);const n=new w(new wt(3.5,1.4,16,1,!0),this.hullWhite);n.position.set(0,3.2,0),s.add(n);const o=new w(new I(12,.2,2.8),this.solarPanelMat);o.position.set(8,0,0),s.add(o);const a=new w(new I(12,.2,2.8),this.solarPanelMat);a.position.set(-8,0,0),s.add(a);const r=new ye(6.5,{name:e});r.setStatic(t),this.physics.addCollider(r),this.satellites.push({name:e,position:t,group:s}),this.rotators.push({mesh:s,speed:.04})}update(e){for(const t of this.rotators)t.mesh.rotation.y+=e*t.speed}}const Hn=`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,jn=`
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p) * 2.0;
    if (r < 0.28 || r > 1.0) discard;

    float angle = atan(p.y, p.x);
    float spiral = sin(angle * 4.0 - r * 16.0 + uTime * 3.5);
    float intensity = smoothstep(0.28, 0.42, r) * smoothstep(1.0, 0.65, r);

    // Relativistic Doppler Beaming (one side brighter due to frame dragging)
    float doppler = 1.0 + 0.45 * cos(angle);

    vec3 innerColor = vec3(1.0, 0.85, 0.4); // White-Hot Gold
    vec3 outerColor = vec3(1.0, 0.25, 0.0); // Fiery Red-Orange
    vec3 col = mix(innerColor, outerColor, (r - 0.28) / 0.72) * doppler;

    float alpha = intensity * (0.7 + 0.3 * spiral);
    gl_FragColor = vec4(col * 1.8, alpha);
  }
`;class Vn{constructor({scene:e,physics:t,materials:s,bursts:i,audio:n,seed:o}){this.scene=e,this.physics=t,this.materials=s,this.bursts=i,this.audio=n,this.seed=o,this.group=new _,e.add(this.group),this.blackHoles=[],this.wormholes=[],this.comets=[],this.debrisMeshes=[],this.rotators=[],this._generateCosmicAnomalies()}_generateCosmicAnomalies(){this._createBlackHole({name:"Singularity Anomaly X-01",position:new y(-11e3,1800,-14e3),eventHorizonRadius:180,diskRadius:650,gravityRadius:3200}),this._createWormhole({name:"Aethelgard Hyperspace Wormhole",position:new y(1400,320,-1800),radius:42}),this._createComet({name:"Perseid-V Ice Comet",position:new y(-2400,850,3200),velocity:new y(12,-2,-18)}),this._createDebrisField({center:new y(-450,110,-820),radius:120,count:65})}_createBlackHole({name:e,position:t,eventHorizonRadius:s,diskRadius:i,gravityRadius:n}){const o=new _;o.position.copy(t),this.group.add(o);const a=new U({color:0}),r=new w(new z(s,48,32),a);o.add(r);const l=new Xe(i*2,i*2),c=new O({vertexShader:Hn,fragmentShader:jn,uniforms:{uTime:{value:0}},transparent:!0,side:$,depthWrite:!1,blending:F}),h=new w(l,c);h.rotation.x=Math.PI*.45,o.add(h);const d=new ci(t,n,s*1.1,{name:e,strength:4200});this.physics.addGravityWell(d),this.blackHoles.push({name:e,position:t,group:o,diskMat:c}),this.rotators.push({mesh:h,speed:.12,diskMat:c})}_createWormhole({name:e,position:t,radius:s}){const i=new _;i.position.copy(t),this.group.add(i);const n=new Se(s,2.5,16,48),o=new P({color:61695,emissive:35020,emissiveIntensity:.8,metalness:.9,roughness:.1}),a=new w(n,o);i.add(a);const r=new We(s*.96,32),l=new U({color:3718648,side:$,transparent:!0,opacity:.85}),c=new w(r,l);i.add(c);const h=new xs(t,s*1.2,{name:e,type:"PORTAL",prompt:"[E] Engage Hyperspace Warp"});this.physics.addTrigger(h),this.wormholes.push({name:e,position:t,group:i,trigger:h}),this.rotators.push({mesh:a,speed:.25})}_createComet({name:e,position:t,velocity:s}){const i=new _;i.position.copy(t),this.group.add(i);const n=new At(8,1),o=new P({color:12248829,roughness:.2,metalness:.8}),a=new w(n,o);i.add(a);const r=new wt(18,180,16,1,!0),l=new U({color:3718648,transparent:!0,opacity:.35,side:$,blending:F}),c=new w(r,l);c.position.set(0,0,90),c.rotation.x=Math.PI*.5,i.add(c),this.comets.push({name:e,position:t,velocity:s,group:i})}_createDebrisField({center:e,radius:t,count:s}){const i=new I(1,1,1),n=new P({color:4674921,metalness:.85,roughness:.3}),o=new _t(i,n,s),a=new st;for(let r=0;r<s;r++){const l=e.x+(this.seed.next()-.5)*t*2,c=e.y+(this.seed.next()-.5)*t*1.2,h=e.z+(this.seed.next()-.5)*t*2,d=this.seed.range(.4,3.2),p=this.seed.range(.1,.8),m=this.seed.range(.4,2.5);a.position.set(l,c,h),a.rotation.set(this.seed.next()*Math.PI,this.seed.next()*Math.PI,this.seed.next()*Math.PI),a.scale.set(d,p,m),a.updateMatrix(),o.setMatrixAt(r,a.matrix)}o.instanceMatrix.needsUpdate=!0,this.group.add(o),this.debrisMeshes.push(o)}update(e){for(const t of this.rotators)t.mesh&&(t.mesh.rotation.z+=e*t.speed),t.diskMat?.uniforms?.uTime&&(t.diskMat.uniforms.uTime.value+=e);for(const t of this.comets)t.position.addScaledVector(t.velocity,e),t.group.position.copy(t.position)}}class Wn{constructor({scene:e,physics:t,bursts:s,audio:i,seed:n}){this.scene=e,this.physics=t,this.bursts=s,this.audio=i,this.seed=n,this.group=new _,e.add(this.group),this.drones=[],this.projectiles=[],this._projGeo=new z(.35,8,8),this._projMat=new U({color:16716083}),this._spawnInitialDrones()}_spawnInitialDrones(){this.createDrone({id:"drone_ares_01",name:"Rogue Scout Drone Alpha",position:new y(220,52,-380),patrolRadius:45})}createDrone({id:e,name:t,position:s,patrolRadius:i=40}){const n=new _;n.position.copy(s),this.group.add(n);const o=new P({color:1976635,metalness:.9,roughness:.2}),a=new w(new Z(1.2,1.5,.7,12),o);n.add(a);const r=new P({color:16711731,emissive:16711714,emissiveIntensity:1.2}),l=new w(new z(.45,16,16),r);l.position.set(0,.1,1),n.add(l);for(let h=0;h<4;h++){const d=h*Math.PI/2,p=new w(new Z(.08,.08,1.8,6),o);p.position.set(Math.cos(d)*1.6,.2,Math.sin(d)*1.6),p.rotation.z=Math.PI*.25,p.rotation.y=-d,n.add(p)}const c={id:e,name:t,group:n,position:s.clone(),velocity:new y,patrolCenter:s.clone(),patrolRadius:i,patrolAngle:0,state:"PATROL",health:60,maxHealth:60,attackCooldown:0,isDead:!1};return this.drones.push(c),c}update(e,t,s=null){if(!t)return;const i=t.position;for(let n=this.drones.length-1;n>=0;n--){const o=this.drones[n];if(o.isDead)continue;const a=o.position.distanceTo(i);if(o.state==="PATROL"){o.patrolAngle+=e*.45;const r=o.patrolCenter.x+Math.cos(o.patrolAngle)*o.patrolRadius,l=o.patrolCenter.z+Math.sin(o.patrolAngle)*o.patrolRadius,c=new y(r,o.patrolCenter.y,l);o.position.lerp(c,e*1.8),o.group.lookAt(c),a<90&&(o.state="CHASE",this.audio?.droneAlert?.())}else if(o.state==="CHASE"||o.state==="ATTACK")if(o.group.lookAt(i),a>130)o.state="PATROL";else if(a>28){const r=i.clone().sub(o.position).normalize();o.position.addScaledVector(r,e*18)}else o.attackCooldown-=e,o.attackCooldown<=0&&(this._fireProjectile(o,i),o.attackCooldown=1.4);o.group.position.copy(o.position)}for(let n=this.projectiles.length-1;n>=0;n--){const o=this.projectiles[n];if(o.life-=e,o.mesh.position.addScaledVector(o.velocity,e),o.mesh.position.distanceTo(i)<t.radius+.5){t.stats.suitIntegrity=Math.max(0,t.stats.suitIntegrity-12),this.bursts?.emit(o.mesh.position,14,{color:new b(16720452),speed:4,life:.6}),this.audio?.impact?.(),this.scene.remove(o.mesh),this.projectiles.splice(n,1);continue}o.life<=0&&(this.scene.remove(o.mesh),this.projectiles.splice(n,1))}}_fireProjectile(e,t){const s=new w(this._projGeo,this._projMat);s.position.copy(e.position),this.scene.add(s);const i=t.clone().sub(e.position).normalize();this.projectiles.push({mesh:s,velocity:i.multiplyScalar(42),life:3.5}),this.audio?.laser?.()}damageDrone(e,t,s=null){const i=this.drones.find(n=>n.id===e);!i||i.isDead||(i.health-=t,i.health<=0&&(i.isDead=!0,this.bursts?.emit(i.position,45,{color:new b(16729088),speed:8,life:1.2}),this.audio?.explosion?.(),this.scene.remove(i.group),s?.(i)))}}class Xn{constructor(e,t){this.scene=e,this.audio=t,this.activeExplosions=[],this.pool=[],this.maxPool=8,this._initPool()}_initPool(){for(let e=0;e<this.maxPool;e++){const t=new _;this.scene.add(t),t.visible=!1;const s=new z(1,16,16),i=new U({color:16777215,transparent:!0,opacity:0,blending:F}),n=new w(s,i);t.add(n);const o=new Se(1,.15,8,32),a=new U({color:16746496,transparent:!0,opacity:0,blending:F}),r=new w(o,a);r.rotation.x=Math.PI*.5,t.add(r);const l=new Mt(16737792,0,80,2);t.add(l),this.pool.push({group:t,flashMesh:n,flashMat:i,ringMesh:r,ringMat:a,light:l,active:!1,time:0,duration:1.6,maxRadius:18})}}trigger(e,t=24){const s=this.pool.find(i=>!i.active);s&&(s.active=!0,s.time=0,s.maxRadius=t,s.group.position.copy(e),s.group.visible=!0,s.flashMesh.scale.set(.1,.1,.1),s.flashMat.opacity=1,s.ringMesh.scale.set(.1,.1,.1),s.ringMat.opacity=.9,s.light.intensity=8,this.activeExplosions.push(s),this.audio?.explosion?.())}update(e){for(let t=this.activeExplosions.length-1;t>=0;t--){const s=this.activeExplosions[t];s.time+=e;const i=s.time/s.duration;if(i>=1){s.active=!1,s.group.visible=!1,this.activeExplosions.splice(t,1);continue}const n=Math.sin(i*Math.PI*.5)*s.maxRadius;s.flashMesh.scale.setScalar(n*.65),s.ringMesh.scale.setScalar(n);const o=Math.max(0,1-i);s.flashMat.opacity=Math.pow(o,2.5),s.ringMat.opacity=Math.pow(o,1.8),s.light.intensity=o*8}}}class Kn{constructor({scene:e,physics:t,materials:s,bursts:i,audio:n,seedString:o="DEEPSPACE-PRIME-9"}){this.scene=e,this.physics=t,this.materials=s,this.bursts=i,this.audio=n,this.group=new _,e.add(this.group),this.seed=new Ts(o),this.noise=new Ms(this.seed.seedInt),this.spatialGrid=new An(250),this.starfield=new En(this.scene,this.seed),this.galaxies=new Ln(this.scene,this.seed),this.nebulas=new In(this.scene,this.seed),this.planetarySystem=new Gn({scene:this.scene,physics:this.physics,materials:this.materials,seed:this.seed}),this.asteroids=new Un({scene:this.scene,physics:this.physics,materials:this.materials,seed:this.seed,noise:this.noise}),this.structures=new Bn({scene:this.scene,physics:this.physics,materials:this.materials,seed:this.seed}),this.anomalies=new Vn({scene:this.scene,physics:this.physics,materials:this.materials,bursts:this.bursts,audio:this.audio,seed:this.seed}),this.drones=new Wn({scene:this.scene,physics:this.physics,bursts:this.bursts,audio:this.audio,seed:this.seed}),this.explosions=new Xn(this.scene,this.audio),this.relics=[],this._spawnAncientRelics()}_spawnAncientRelics(){const e=[{name:"Quantum Core Relic Alpha",pos:new y(180,48,-360)},{name:"Ancient Obsidian Glyph",pos:new y(-450,114,-820)},{name:"Hyperdrive Warp Fragment",pos:new y(1400,320,-1800)},{name:"Xenon Singularity Shard",pos:new y(620,-78,540)}],t=new P({color:61695,emissive:41164,emissiveIntensity:.8,roughness:.1,metalness:.9});for(const s of e){const i=new w(new vs(1.2,0),t);i.position.copy(s.pos),this.group.add(i);const n=new xs(s.pos,7,{name:s.name,type:"RELIC",prompt:`[E] Extract ${s.name}`});this.physics.addTrigger(n),this.relics.push({name:s.name,position:s.pos,mesh:i,trigger:n,collected:!1})}}getAllTargets(){const e=[];for(const t of this.planetarySystem.planets)e.push({id:`planet_${t.name}`,name:t.name,type:"PLANET",planetType:t.type,position:t.position,radius:t.radius});for(const t of this.structures.stations)e.push({id:`station_${t.name}`,name:t.name,type:"STATION",position:t.position});for(const t of this.structures.ships)e.push({id:`ship_${t.name}`,name:t.name,type:"SPACESHIP",position:t.position});for(const t of this.anomalies.blackHoles)e.push({id:`bh_${t.name}`,name:t.name,type:"ANOMALY",position:t.position});for(const t of this.anomalies.wormholes)e.push({id:`wh_${t.name}`,name:t.name,type:"WORMHOLE",position:t.position});for(const t of this.structures.satellites)e.push({id:`sat_${t.name}`,name:t.name,type:"SATELLITE",position:t.position});for(const t of this.relics)t.collected||e.push({id:`relic_${t.name}`,name:t.name,type:"RELIC",position:t.position});for(const t of this.drones.drones)t.isDead||e.push({id:`drone_${t.id}`,name:t.name,type:"HOSTILE",position:t.position});return e}update(e,t){this.starfield.update(e,t),this.galaxies.update(e),this.nebulas.update(e),this.planetarySystem.update(e),this.asteroids.update(e,t),this.structures.update(e),this.anomalies.update(e),this.explosions.update(e);for(const s of this.relics)!s.collected&&s.mesh&&(s.mesh.rotation.y+=e*1.2,s.mesh.rotation.z+=e*.8)}dispose(){this.starfield.dispose()}}const ns="deepspace_progression_v2";class qn{constructor(){this.level=1,this.xp=0,this.xpRequired=500,this.credits=300,this.completedMissions=0,this.discoveredSectors=1,this.discoveredAnomalies=0,this.relicsFound=0,this.upgrades={jetpackSpeed:1,fuelCapacity:1,boostEfficiency:1,suitArmor:1,oxygenReserves:1,scannerRange:1},this.load()}addXP(e,t=null){this.xp+=e;let s=!1;for(;this.xp>=this.xpRequired;)this.xp-=this.xpRequired,this.level+=1,this.xpRequired=Math.round(this.xpRequired*1.35),this.credits+=this.level*250,s=!0;this.save(),s&&t?.(this.level,this.credits)}addCredits(e){this.credits+=e,this.save()}getUpgradeCost(e){const t=this.upgrades[e]??1;return t>=5?null:t*250}buyUpgrade(e,t=null){return this.purchaseUpgrade(e,()=>{t&&this.applyUpgrades(t)})}purchaseUpgrade(e,t=null){const s=this.getUpgradeCost(e);return!s||this.credits<s?!1:(this.credits-=s,this.upgrades[e]=(this.upgrades[e]??1)+1,this.save(),t?.(this.upgrades[e],this.credits),!0)}applyUpgrades(e){e&&(e.maxFuel=100+(this.upgrades.fuelCapacity-1)*20,e.fuel=Math.min(e.fuel,e.maxFuel),e.maxHealth=100+(this.upgrades.suitArmor-1)*20,e.health=Math.min(e.health,e.maxHealth),e.maxOxygen=100+(this.upgrades.oxygenReserves-1)*25,e.oxygen=Math.min(e.oxygen,e.maxOxygen))}save(){try{const e={level:this.level,xp:this.xp,xpRequired:this.xpRequired,credits:this.credits,completedMissions:this.completedMissions,discoveredSectors:this.discoveredSectors,discoveredAnomalies:this.discoveredAnomalies,relicsFound:this.relicsFound,upgrades:this.upgrades};localStorage.setItem(ns,JSON.stringify(e))}catch{}}load(){try{const e=localStorage.getItem(ns);if(!e)return;const t=JSON.parse(e);t.level&&(this.level=t.level),t.xp!==void 0&&(this.xp=t.xp),t.xpRequired&&(this.xpRequired=t.xpRequired),t.credits!==void 0&&(this.credits=t.credits),t.completedMissions&&(this.completedMissions=t.completedMissions),t.discoveredSectors&&(this.discoveredSectors=t.discoveredSectors),t.discoveredAnomalies&&(this.discoveredAnomalies=t.discoveredAnomalies),t.relicsFound&&(this.relicsFound=t.relicsFound),t.upgrades&&(this.upgrades={...this.upgrades,...t.upgrades})}catch{}}}const Yn=`
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,$n=`
  uniform vec3 uCenter;
  uniform float uRadius;
  uniform float uThickness;
  uniform vec3 uColor;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    float d = distance(vWorldPos, uCenter);
    float diff = abs(d - uRadius);
    float ring = smoothstep(uThickness, 0.0, diff);
    
    // Fresnel glow edge
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.5);

    float alpha = (ring * 0.85 + fresnel * 0.2) * smoothstep(180.0, 10.0, uRadius);
    if (alpha <= 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;class Zn{constructor(e,t){this.scene=e,this.audio=t,this.range=160,this.pulseActive=!1,this.pulseRadius=0,this.pulseSpeed=85,this.center=new y,this.cooldown=0,this.lastDetected=[];const s=new z(1,32,24);this.material=new O({vertexShader:Yn,fragmentShader:$n,uniforms:{uCenter:{value:new y},uRadius:{value:0},uThickness:{value:6},uColor:{value:new b(58879)}},transparent:!0,depthWrite:!1,side:$,blending:F}),this.mesh=new w(s,this.material),this.mesh.visible=!1,this.mesh.frustumCulled=!1,e.add(this.mesh)}trigger(e,t=[],s=null){return this.cooldown>0?!1:(this.cooldown=2.4,this.pulseActive=!0,this.pulseRadius=1,this.center.copy(e),this.material.uniforms.uCenter.value.copy(e),this.material.uniforms.uRadius.value=0,this.mesh.position.copy(e),this.mesh.scale.setScalar(1),this.mesh.visible=!0,this.onScanComplete=s,this.audio?.scanner?.(),this.lastDetected=this.scanTargets(e,t),!0)}scanTargets(e,t){const s=[];for(const i of t){if(!i.position)continue;const n=e.distanceTo(i.position);if(n<=this.range){const o=i.position.x-e.x,a=i.position.z-e.z;let r=Math.round((Math.atan2(o,-a)*180/Math.PI+360)%360);const l=Math.round(Math.max(10,100-n/this.range*90));s.push({id:i.id??"UNKNOWN",type:i.type??"ANOMALY",name:i.name??"Unknown Signature",distance:Math.round(n),bearing:String(r).padStart(3,"0")+"°",strength:`${l}%`,position:i.position.clone(),target:i})}}return s.sort((i,n)=>i.distance-n.distance),s}update(e){this.cooldown>0&&(this.cooldown-=e),this.pulseActive&&(this.pulseRadius+=this.pulseSpeed*e,this.material.uniforms.uRadius.value=this.pulseRadius,this.mesh.scale.setScalar(this.pulseRadius),this.pulseRadius>=this.range&&(this.pulseActive=!1,this.mesh.visible=!1,this.onScanComplete&&(this.onScanComplete(this.lastDetected),this.onScanComplete=null)))}}const ft={ENERGY:{name:"Energy Cell",color:58879,value:25,icon:"⚡"},SCRAP:{name:"Hull Scrap",color:9479342,value:15,icon:"🔩"},CRYSTAL:{name:"Plasma Crystal",color:16724923,value:35,icon:"💎"},XENON:{name:"Xenon Fuel",color:65416,value:50,icon:"🧪"},DATA:{name:"Encrypted Data Chip",color:16768880,value:100,icon:"💾"},RELIC:{name:"Ancient Cosmic Relic",color:16755200,value:250,icon:"✦"}};class Jn{constructor(e,t,s){this.scene=e,this.bursts=t,this.audio=s,this.inventory={scrap:0,crystals:0,xenon:0,data:0,relics:0},this.nodes=[],this.group=new _,e.add(this.group),this._geos={ENERGY:new vs(.7,0),SCRAP:new I(.8,.8,.8),CRYSTAL:new ys(.75,0),XENON:new Z(.35,.35,1.1,8),DATA:new I(.6,.8,.2),RELIC:new At(.9,0)}}spawn(e,t){const s=ft[e]??ft.ENERGY,i=this._geos[e]??this._geos.ENERGY,n=new P({color:s.color,emissive:s.color,emissiveIntensity:.65,metalness:.7,roughness:.2}),o=new w(i,n);o.position.copy(t),this.group.add(o);const a={id:`res_${Math.random().toString(36).substr(2,6)}`,type:"RESOURCE",resType:e,name:s.name,mesh:o,position:o.position,baseY:t.y,seed:Math.random()*10,collected:!1};return this.nodes.push(a),a}spawnCluster(e,t=5,s=18){const i=["ENERGY","SCRAP","CRYSTAL","XENON"];for(let n=0;n<t;n++){const o=i[Math.floor(Math.random()*i.length)],a=new y(e.x+(Math.random()-.5)*s,e.y+(Math.random()-.5)*(s*.6),e.z+(Math.random()-.5)*s);this.spawn(o,a)}}update(e,t,s=null){const i=performance.now()*.001,n=t.position;for(let o=this.nodes.length-1;o>=0;o--){const a=this.nodes[o];if(a.collected)continue;a.mesh.rotation.x+=e*1.2,a.mesh.rotation.y+=e*1.6,a.mesh.position.y=a.baseY+Math.sin(i*2.5+a.seed)*.4;const r=n.distanceTo(a.position);if(r<6.5){const l=n.clone().sub(a.position).normalize();a.position.addScaledVector(l,16*e),r<1.8&&(a.collected=!0,a.mesh.visible=!1,this.group.remove(a.mesh),this.nodes.splice(o,1),this._handleCollect(a.resType,t,s))}}}_handleCollect(e,t,s){const i=ft[e];switch(e){case"ENERGY":t.stats.replenishFuel(45),t.stats.replenishOxygen(35);break;case"SCRAP":this.inventory.scrap+=1,t.stats.heal(15);break;case"CRYSTAL":this.inventory.crystals+=1;break;case"XENON":this.inventory.xenon+=1;break;case"DATA":this.inventory.data+=1;break;case"RELIC":this.inventory.relics+=1;break}this.audio?.resource?.(),this.bursts?.emit(t.position,24,{color:new b(i.color),speed:4.5,up:1,spread:2,life:.9}),s?.(i,this.inventory)}getTargets(){return this.nodes.filter(e=>!e.collected).map(e=>({id:e.id,type:"RESOURCE",name:e.name,position:e.position}))}}const L={LOCATE_SIGNAL:0,SCAN_FRAGMENTS:1,LOCATE_STATION:2,SCAN_STATION:3,RECOVER_BLACKBOX:4,SURVIVE_HAZARD:5,DEFEAT_DRONE:6,EXTRACTION:7,COMPLETED:8};class Qn{constructor(e,t,s){this.scene=e,this.bursts=t,this.audio=s,this.missionId="M01_LOST_SIGNAL",this.title="MISSION 01 — LOST SIGNAL",this.currentStep=L.LOCATE_SIGNAL,this.fragmentsCollected=0,this.requiredFragments=3,this.stationScanned=!1,this.blackBoxRecovered=!1,this.droneDefeated=!1,this.hazardSurvived=!1,this.signalZone=new y(120,20,-150),this.stationPos=new y(0,15,-380),this.blackBoxPos=new y(0,18,-385),this.extractionPos=new y(0,25,260),this.fragments=[],this.fragmentGroup=new _,e.add(this.fragmentGroup),this._spawnSignalFragments(),this.currentWaypoint=this.signalZone,this.waypointLabel="Signal Origin"}_spawnSignalFragments(){const e=[new y(110,18,-140),new y(135,24,-165),new y(115,15,-170)],t=new ri(.85,0),s=new P({color:16768324,emissive:16755200,emissiveIntensity:.8,metalness:.8,roughness:.1});e.forEach((i,n)=>{const o=new w(t,s);o.position.copy(i),this.fragmentGroup.add(o),this.fragments.push({id:`frag_${n+1}`,type:"MISSION",name:`Signal Fragment 0${n+1}`,position:o.position,mesh:o,baseY:i.y,seed:n*2,scanned:!1,collected:!1})})}getObjectiveText(){switch(this.currentStep){case L.LOCATE_SIGNAL:return"Navigate to Signal Coordinates";case L.SCAN_FRAGMENTS:return`Scan Signal Fragments (${this.fragmentsCollected}/${this.requiredFragments})`;case L.LOCATE_STATION:return"Locate Abandoned Research Station";case L.SCAN_STATION:return"Scan Station Core [Press E]";case L.RECOVER_BLACKBOX:return"Retrieve Station Black Box";case L.SURVIVE_HAZARD:return"Survive Incoming Meteor Storm";case L.DEFEAT_DRONE:return"Neutralize Rogue Scout Drone";case L.EXTRACTION:return"Reach Extraction Stargate";case L.COMPLETED:return"Mission Complete";default:return"Explore Deep Space"}}getCurrentMissionData(){return{title:this.title,objective:this.getObjectiveText(),distance:this.currentDistance??null}}update(e,t,s=null,i=null){const n=t.position,o=performance.now()*.001;for(const a of this.fragments)a.collected||(a.mesh.rotation.y+=e*2,a.mesh.rotation.x+=e*1.5,a.mesh.position.y=a.baseY+Math.sin(o*3+a.seed)*.4);switch(this.currentStep){case L.LOCATE_SIGNAL:this.currentWaypoint=this.signalZone,this.waypointLabel="Signal Zone",n.distanceTo(this.signalZone)<35&&(this.currentStep=L.SCAN_FRAGMENTS,this.audio?.checkpoint?.(),s?.("Signal Detected! Use Scanner [Q] to locate data fragments"));break;case L.SCAN_FRAGMENTS:const a=this.fragments.filter(r=>!r.collected);a.length>0&&(this.currentWaypoint=a[0].position,this.waypointLabel=a[0].name);for(const r of a)n.distanceTo(r.position)<3.2&&(r.collected=!0,r.mesh.visible=!1,this.fragmentsCollected++,this.audio?.resource?.(),this.bursts?.emit(r.position,28,{color:new b(16768324),speed:5,up:1,spread:2.5,life:1}),s?.(`Signal Fragment Recovered (${this.fragmentsCollected}/${this.requiredFragments})`),this.fragmentsCollected>=this.requiredFragments&&(this.currentStep=L.LOCATE_STATION,this.audio?.checkpoint?.(),s?.("Signal Decrypted! Station coordinates revealed.")));break;case L.LOCATE_STATION:this.currentWaypoint=this.stationPos,this.waypointLabel="Abandoned Station",n.distanceTo(this.stationPos)<45&&(this.currentStep=L.SCAN_STATION,this.audio?.checkpoint?.(),s?.("Approach Station Dock and Scan [E]"));break;case L.SCAN_STATION:this.currentWaypoint=this.stationPos,this.waypointLabel="Station Dock";break;case L.RECOVER_BLACKBOX:this.currentWaypoint=this.blackBoxPos,this.waypointLabel="Black Box",n.distanceTo(this.blackBoxPos)<4&&(this.blackBoxRecovered=!0,this.currentStep=L.SURVIVE_HAZARD,this.audio?.checkpoint?.(),s?.("Black Box Recovered! Warning: Energy Spike Detected"));break;case L.SURVIVE_HAZARD:break;case L.DEFEAT_DRONE:break;case L.EXTRACTION:this.currentWaypoint=this.extractionPos,this.waypointLabel="Extraction Stargate",n.distanceTo(this.extractionPos)<14&&(this.currentStep=L.COMPLETED,this.audio?.warp?.(),i?.({title:"MISSION 01 — LOST SIGNAL",xp:450,credits:1200,relics:1}));break}}scanStationInteraction(e,t){return this.currentStep===L.SCAN_STATION&&e.distanceTo(this.stationPos)<35?(this.stationScanned=!0,this.currentStep=L.RECOVER_BLACKBOX,this.audio?.checkpoint?.(),t?.("Station Decrypted: Power Critical. Recovering Black Box..."),!0):!1}getTargets(){const e=[];return this.currentStep===L.SCAN_FRAGMENTS?this.fragments.filter(t=>!t.collected).forEach(t=>{e.push({id:t.id,type:"MISSION",name:t.name,position:t.position})}):this.currentWaypoint&&e.push({id:"mission_waypoint",type:"MISSION",name:this.waypointLabel,position:this.currentWaypoint}),e}}class eo{constructor(e,t,s){this.scene=e,this.bursts=t,this.audio=s,this.activeHazard=null,this.timer=0,this.state="idle",this.meteors=[],this.meteorGroup=new _,e.add(this.meteorGroup),this._meteorGeo=new ys(1.6,1),this._meteorMat=new P({color:16724736,emissive:16729088,emissiveIntensity:.9,roughness:.6})}triggerMeteorStorm(e=16,t=null){this.activeHazard="METEOR_STORM",this.state="warning",this.timer=8,this.duration=e,this.audio?.alarm?.(),t?.("⚠ METEORIC ACTIVITY DETECTED — IMPACT WINDOW IMMINENT")}update(e,t,s=null,i=null){const n=t.position;if(this.state==="warning")this.timer-=e,this.timer<=0&&(this.state="active",this.timer=this.duration,this.audio?.alarm?.(),s?.("⚠ METEOR STORM ACTIVE — TAKE EVASIVE ACTION"));else if(this.state==="active"){this.timer-=e,Math.random()<e*4.5&&this.meteors.length<18&&this._spawnMeteor(n);for(let o=this.meteors.length-1;o>=0;o--){const a=this.meteors[o];if(a.position.addScaledVector(a.velocity,e),a.mesh.rotation.x+=e*3,a.mesh.rotation.y+=e*2.5,Math.random()<.35&&this.bursts?.emit(a.position,3,{color:new b(16729088),speed:2,up:.5,spread:1,life:.5}),n.distanceTo(a.position)<3.2){t.stats.damage(32,"meteor"),t.body.velocity.addScaledVector(a.velocity,.4),this.audio?.impact?.(),this.bursts?.emit(a.position,35,{color:new b(16733440),speed:8,up:2,spread:4,life:1.2}),this.meteorGroup.remove(a.mesh),this.meteors.splice(o,1);continue}n.distanceTo(a.position)>220&&(this.meteorGroup.remove(a.mesh),this.meteors.splice(o,1))}this.timer<=0&&(this.state="passed",this._clearMeteors(),s?.("Meteor Storm Passed. Threat Level Nominal."),i?.())}}_spawnMeteor(e){const t=new w(this._meteorGeo,this._meteorMat),s=Math.random()*Math.PI*2,i=90+Math.random()*40,n=(Math.random()-.2)*50;t.position.set(e.x+Math.cos(s)*i,e.y+n,e.z+Math.sin(s)*i);const o=e.clone().add(new y((Math.random()-.5)*16,(Math.random()-.5)*12,(Math.random()-.5)*16)),a=42+Math.random()*22,r=o.sub(t.position).normalize().multiplyScalar(a);this.meteorGroup.add(t),this.meteors.push({mesh:t,position:t.position,velocity:r})}_clearMeteors(){for(const e of this.meteors)this.meteorGroup.remove(e.mesh);this.meteors=[]}}class to{constructor(e,t,s,i){this.scene=e,this.bursts=t,this.audio=s,this.id="scout_drone_01",this.name="Rogue Scout Drone",this.type="HOSTILE",this.state="PATROL",this.health=60,this.maxHealth=60,this.patrolCenter=i.clone(),this.patrolRadius=35,this.patrolAngle=0,this.speed=18,this.attackCooldown=0,this.projectiles=[],this._projGeo=new z(.35,8,8),this._projMat=new U({color:16720452}),this._buildMesh(e,i)}_buildMesh(e,t){this.group=new _,this.group.position.copy(t);const s=new Z(1.2,1.4,.6,12),i=new P({color:2237738,metalness:.85,roughness:.25}),n=new w(s,i);this.group.add(n);const o=new z(.45,16,16);this.eyeMat=new P({color:16716083,emissive:16711714,emissiveIntensity:1});const a=new w(o,this.eyeMat);a.position.set(0,.1,1),this.group.add(a);const r=new Z(.25,.35,.7,8),l=new P({color:1118481}),c=new w(r,l);c.rotation.x=Math.PI/2,c.position.set(.9,0,-.9);const h=c.clone();h.position.x=-.9,this.group.add(c),this.group.add(h),e.add(this.group),this.position=this.group.position}update(e,t,s=null){if(this.state==="DEAD")return;const i=t.position,n=this.position.distanceTo(i);switch(this.attackCooldown>0&&(this.attackCooldown-=e),this.state){case"PATROL":this.patrolAngle+=this.speed/this.patrolRadius*.4*e,this.position.x=this.patrolCenter.x+Math.cos(this.patrolAngle)*this.patrolRadius,this.position.z=this.patrolCenter.z+Math.sin(this.patrolAngle)*this.patrolRadius,this.position.y=this.patrolCenter.y+Math.sin(this.patrolAngle*2)*4,n<75&&(this.state="DETECT",this.audio?.droneAlert?.());break;case"DETECT":this.group.lookAt(i),this.eyeMat.emissiveIntensity=2.5,n<55?this.state="CHASE":n>100&&(this.state="PATROL");break;case"CHASE":this.group.lookAt(i);const o=i.clone().sub(this.position).normalize();this.position.addScaledVector(o,this.speed*e),n<35&&(this.state="ATTACK");break;case"ATTACK":if(this.group.lookAt(i),n<18){const a=this.position.clone().sub(i).normalize();this.position.addScaledVector(a,this.speed*.8*e)}else n>40&&(this.state="CHASE");this.attackCooldown<=0&&(this.attackCooldown=1.6,this._fireLaser(i));break}for(let o=this.projectiles.length-1;o>=0;o--){const a=this.projectiles[o];if(a.position.addScaledVector(a.velocity,e),i.distanceTo(a.position)<2.2){t.stats.damage(16,"laser"),this.audio?.impact?.(),this.bursts?.emit(a.position,18,{color:new b(16720452),speed:4,up:0,spread:2,life:.6}),this.scene.remove(a.mesh),this.projectiles.splice(o,1);continue}a.life-=e,a.life<=0&&(this.scene.remove(a.mesh),this.projectiles.splice(o,1))}n<3.2&&t.isLightSpeed&&this.destroy(s)}_fireLaser(e){const t=new w(this._projGeo,this._projMat);t.position.copy(this.position).add(new y(0,.2,.5)),this.scene.add(t);const i=e.clone().sub(t.position).normalize().multiplyScalar(55);this.audio?.laser?.(),this.projectiles.push({mesh:t,position:t.position,velocity:i,life:3})}damage(e,t=null){this.health-=e,this.bursts?.emit(this.position,12,{color:new b(16729088),speed:3,up:.5,spread:1.5,life:.6}),this.health<=0&&this.destroy(t)}destroy(e=null){this.state!=="DEAD"&&(this.state="DEAD",this.group.visible=!1,this.scene.remove(this.group),this.projectiles.forEach(t=>this.scene.remove(t.mesh)),this.projectiles=[],this.audio?.explosion?.(),this.bursts?.emit(this.position,60,{color:new b(16729088),speed:9,up:2,spread:5,life:1.5}),e?.(this))}}function os(u){const e=Math.floor(u/60),t=Math.floor(u%60);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}class so{constructor(e,t){this.state="start",this.levelIndex=0,this.levelTime=0,this.totalTime=0,this._warpCooldown=0,this.engine=new li(e),this.materials=new di,this.physics=new hi(X.physics),this.world=new gi(this.engine.scene,this.physics,this.materials),this.environment=new vi(this.engine.scene),this.input=new rn(e),this.bursts=new hn(this.engine.scene),this.thrusters=new gn(this.engine.scene),this.hyperspace=new wn(this.engine.scene),this.motes=new pn(this.engine.scene,X.fx.ambientMotes),this.audio=new xn,this.player=new nn({scene:this.engine.scene,physics:this.physics,input:this.input,materials:this.materials,thrusters:this.thrusters}),this.rig=new on(this.engine.camera,this.input),this.lighting=new an(this.engine),this.universe=new Kn({scene:this.engine.scene,physics:this.physics,materials:this.materials,bursts:this.bursts,audio:this.audio}),this.progression=new qn,this.progression.applyUpgrades(this.player.stats),this.scanner=new Zn(this.engine.scene,this.audio),this.resources=new Jn(this.engine.scene,this.bursts,this.audio),this.missions=new Qn(this.engine.scene,this.bursts,this.audio),this.hazards=new eo(this.engine.scene,this.bursts,this.audio),this.drone=new to(this.engine.scene,this.bursts,this.audio,new y(25,18,-340)),this.ui=new Tn(t),this._spawnInitialResources(),this._wireEvents(),this.engine.onTick((s,i)=>this._tick(s,i))}_spawnInitialResources(){}boot(){this._loadLevel(0,{instant:!0}),this.player.frozen=!0,this.rig.orbit(this.player.position,{dist:16,h:8}),this.ui.showStart(),this.engine.start()}start(){this.state==="start"&&this._begin()}_wireEvents(){this.player.onJump=()=>this.audio.jump(),this.player.onJetpack=(e,t)=>this.audio.updateJetpack(e,t),this.player.onLand=e=>{const t=Math.min(1,e/22);this.audio.land(t),this.bursts.emit(this.player.position.clone().setY(this.player.position.y-X.player.radius*.8),Math.round(6+t*14),{color:new b(12173510),speed:2.5+t*3,up:1.2,life:.8})},this.player.onFall=()=>{this.audio.fall(),this.ui.toast("Warped to beacon"),this.player.respawn(),this.audio.warp(),this.bursts.emit(this.player.spawn,20,{color:new b(16767392),speed:3,up:2.2,spread:1.4,life:1.1}),this.rig.snapTo(this.player.position,this.rig.yaw)},this.world.onCheckpoint=e=>{this.player.setSpawn(e),this.player.stats.replenishAll(),this.progression.addXP(50,t=>this.ui.toast(`🎉 LEVEL UP: LVL ${t}!`)),this.progression.addCredits(150),this.audio.checkpoint(),this.bursts.emit(e,24,{color:new b(54527),speed:3.5,up:1.5,life:1}),this.ui.toast("✦ Beacon Linked // Supplies Replenished (+CR 150)")},this.world.onPad=e=>{this.audio.pad(),this.bursts.emit(e,12,{color:new b(this.world.accent),speed:2,up:2.4,life:.9})},this.world.onGateOpen=e=>{this.audio.gate(),this.ui.toast("Sector Gate Unlocked")},this.world.onPortal=()=>{this.audio.boost(),this.player.stats.replenishAll(),this.progression.addCredits(500),this.progression.addXP(200,e=>this.ui.toast(`🎉 LEVEL UP: LVL ${e}!`)),this.bursts.emit(this.player.position,40,{color:new b(54527),speed:8,up:2,life:1.4}),this.player.body.velocity.add(new y(0,6,-20)),this.player.warpIntensity=1,this.ui.toast("⚡ SECTOR PORTAL ACTIVATED // WARP SPEED ENGAGED (+CR 500)")},this.world.onWormhole=({pos:e,from:t})=>this._warp(e,t),this.physics.onImpact=({speed:e,normal:t,collider:s,damage:i})=>{i>0&&(this.player.stats.suitIntegrity=Math.max(0,this.player.stats.suitIntegrity-i),this.ui.toast(`⚠ IMPACT: -${Math.round(i)}% SUIT INTEGRITY (${s.name||"Obstacle"})`)),this.rig.shake(Math.min(1.2,e*.05)),this.audio.land(Math.min(1,e/20)),this.bursts.emit(this.player.position,Math.round(10+e*1.5),{color:new b(16759620),speed:4.5,up:1.2,life:.8})},this.physics.onAtmosphereEnter=e=>{Math.random()<.02&&this.ui.toast(`Atmospheric Entry: ${e.name} (Alt: ${Math.round(e.altitude)}m)`)},this.physics.onGravityWell=(e,t,s)=>{s>.55&&Math.random()<.02&&this.ui.toast(`⚠ GRAVITATIONAL DISTURBANCE: ${e.toUpperCase()}`)},this.input.on("scanner",()=>this._handleScanner()),this.input.on("map",()=>this.ui.sectorMap.toggle()),this.input.on("interact",()=>this._handleInteract()),this.input.on("upgrades",()=>this._toggleUpgrades()),this.input.on("confirm",()=>{this.state==="start"?this._begin():this.state==="gameover"?this._handleRespawn():this.state==="complete"&&this._toMainMenu()}),this.input.on("jump",()=>{this.state==="gameover"&&this._handleRespawn()}),this.input.on("pause",()=>{this.ui.isUpgradesOpen?this._closeUpgrades():this.ui.sectorMap.visible?this.ui.sectorMap.hide():this.state==="play"?this._pause():this.state==="pause"&&this._unpause()}),this.ui.onUpgradeBuy=e=>this._handleUpgradePurchase(e),this.ui.el.begin?.addEventListener("click",()=>this._begin()),this.ui.el.resume?.addEventListener("click",()=>this._unpause()),this.ui.el.respawnBtn?.addEventListener("click",()=>this._handleRespawn()),this.ui.el.openUpgrades?.addEventListener("click",()=>this._openUpgrades()),this.ui.el.closeUpgrades?.addEventListener("click",()=>this._closeUpgrades()),this.ui.el.closeUpgradesX?.addEventListener("click",()=>this._closeUpgrades()),this.ui.el.restartLevel?.addEventListener("click",()=>this._restartLevel()),this.ui.el.mainMenu?.addEventListener("click",()=>this._toMainMenu()),this.ui.el.settingsAudio?.addEventListener("click",()=>{const e=this.audio.toggleMute();this.ui.el.settingsAudio.textContent=`Audio — ${e?"Off":"On"}`})}_handleRespawn(){this.ui.hideGameOver(),this.player.stats.replenishAll(),this.player.respawn(),this._enterPlay(),this.ui.showHUD(),this.ui.toast("✦ Life Support Restored // Respawned at Beacon")}_handleUpgradePurchase(e){this.progression.purchaseUpgrade(e,(s,i)=>{this.progression.applyUpgrades(this.player.stats),this.ui.toast(`✦ Upgraded to Tier ${s}!`),this.audio.checkpoint(),this.ui.updateUpgradeTerminal(this.progression),this.ui.setProgression(this.progression)})||(this.ui.toast("⚠ Insufficient Credits"),this.audio.fall())}_openUpgrades(){this.player.paused=!0,this.input.unlockPointer(),this.ui.showUpgrades(this.progression)}_closeUpgrades(){if(this.ui.hideUpgrades(),this.state==="play")this.player.paused=!1,this.input.lockPointer(),this.ui.showHUD();else if(this.state==="pause"){const e=`Sector ${String(this.levelIndex+1).padStart(2,"0")} · ${os(this.levelTime)}`;this.ui.showPause(e)}}_toggleUpgrades(){this.ui.isUpgradesOpen?this._closeUpgrades():this._openUpgrades()}_handleScanner(){if(this.state!=="play")return;const e=this._getAllSurroundingTargets();this.scanner.trigger(this.player.position,e,t=>{t.length>0&&(this.ui.showScanCard(t[0]),setTimeout(()=>this.ui.showScanCard(null),4e3))})}_handleInteract(){if(this.state!=="play")return;const e=this.player.position,t=new y(12,-4.6,6);if(e.distanceTo(t)<18){this.player.stats.replenishAll(),this.progression.addCredits(200),this.progression.addXP(100,s=>this.ui.toast(`🎉 LEVEL UP: LVL ${s}!`)),this.audio.checkpoint(),this.bursts.emit(this.player.position,30,{color:new b(58879),speed:5,up:1.5,life:1}),this.ui.toast("🚀 Discovery Shuttle Docked // Oxygen & Fuel 100% (+CR 200)");return}for(const s of this.universe.relics)if(!s.collected&&e.distanceTo(s.position)<8){s.collected=!0,s.mesh.visible=!1,this.progression.relicsFound++,this.progression.addXP(250,i=>this.ui.toast(`🎉 LEVEL UP: LVL ${i}!`)),this.progression.addCredits(600),this.audio.relic(),this.bursts.emit(s.position,40,{color:new b(61695),speed:6,up:1.5,life:1.2}),this.ui.toast("✦ ALIEN RELIC EXTRACTED! (+CR 600, +250 XP)");return}for(const s of this.universe.anomalies.wormholes)if(e.distanceTo(s.position)<32){this.audio.warp(),this.audio.boost(),this.player.body.velocity.add(new y(0,12,-110)),this.player.warpIntensity=1,this.player.isLightSpeed=!0,this.bursts.emit(s.position,50,{color:new b(58879),speed:12,up:0,life:1.5}),this.ui.toast("⚡ HYPERSPACE WORMHOLE ENGAGED! ⚡");return}this.missions.scanStationInteraction(this.player.position,s=>{this.ui.toast(s,3),this.progression.addXP(150)})}_getAllSurroundingTargets(){const e=this.universe.getAllTargets();return e.push(...this.missions.getTargets()),e.push(...this.resources.getTargets()),e}_begin(){this.state!=="play"&&(this.audio.init(),this.audio.click(),this.ui.hideStart(),this.rig.endOrbit(),this._enterPlay(),this.ui.showHUD(),this.ui.toast("✦ OPEN SPACE // 3D Zero-G Flight Active"))}_enterPlay(){this.state="play",this.player.frozen=!1,this.player.paused=!1,this.input.enabled=!0,this.input.lockPointer(),this.rig.snapTo(this.player.position,this.rig.yaw)}_pause(){if(this.state!=="play")return;this.state="pause",this.player.paused=!0,this.input.unlockPointer();const e=`Sector ${String(this.levelIndex+1).padStart(2,"0")} · ${os(this.levelTime)}`;this.ui.showPause(e)}_unpause(){this.state==="pause"&&(this.ui.hidePause(),this.state="play",this.player.paused=!1,this.input.lockPointer())}_togglePause(){this.state==="play"?this._pause():this.state==="pause"&&this._unpause()}_restartLevel(){this.ui.hidePause(),this.player.stats.replenishAll(),this.player.respawn(),this._enterPlay()}_toMainMenu(){this.state="start",this.player.frozen=!0,this.player.paused=!1,this.input.unlockPointer(),this.ui.hidePause(),this.ui.hideComplete(),this.ui.showStart(),this.rig.orbit(this.player.position,{dist:16,h:8})}_loadLevel(e,t={}){this.levelIndex=e;const s=ss[e]??ss[0];this.world.build(s),this.lighting?.applyTheme?this.lighting.applyTheme(this.world.theme,t.instant):this.lighting?.transitionTo&&this.lighting.transitionTo(this.world.theme,t.instant?0:1.6),this.player.setSpawn(s.spawn),this.player.respawn(),this.levelTime=0}_tick(e,t){const s=this.player.position,i=this.player.velocity;if(this.state==="play"){if(this.levelTime+=e,this.totalTime+=e,this.player.stats.isDead){this.state="gameover",this.input.unlockPointer(),this.audio.explosion(),this.ui.showGameOver(()=>this._handleRespawn());return}this.ui.setSurvivalStats(this.player.stats),this.ui.setProgression(this.progression),this.ui.setSpeed(i.length()*3.6),this.ui.setWarpState(this.player.isLightSpeed,this.player.warpIntensity),this.ui.setCoords(s.x,s.y,s.z,s.y),this.missions.currentWaypoint&&(this.missions.currentDistance=s.distanceTo(this.missions.currentWaypoint)),this.ui.setMission(this.missions),this.player.isLightSpeed?this.ui.setBeacon("⚡ HYPERSPACE LIGHT SPEED ⚡"):this.physics.proximityWarning?this.ui.setBeacon(`⚠ ${this.physics.proximityWarning.name} (${this.physics.proximityWarning.distance}m)`):this.ui.setBeacon("Deep Space Orbit"),this.ui.setProximityAlert(this.physics.proximityWarning);let o=null;if(s.distanceTo(new y(12,-4.6,6))<18)o="DOCK & REFUEL SHUTTLE";else{for(const r of this.universe.relics)if(!r.collected&&s.distanceTo(r.position)<8){o="EXTRACT ALIEN RELIC";break}if(!o){for(const r of this.universe.stargates)if(s.distanceTo(r.position)<24){o="ENGAGE HYPERSPACE WARP";break}}}this.ui.setInteractPrompt(o),this.resources.update(e,this.player,(r,l)=>{this.ui.toast(`+ ${r.name}`),this.progression.addCredits(r.value),this.progression.addXP(25,c=>this.ui.toast(`🎉 LEVEL UP: LVL ${c}!`))}),this.missions.update(e,this.player,r=>this.ui.toast(r),r=>this._completeMission(r)),this.missions.currentStep===L.SURVIVE_HAZARD&&this.hazards.state==="idle"&&this.hazards.triggerMeteorStorm(16,r=>this.ui.setHazardAlert(!0,r)),this.hazards.update(e,this.player,r=>this.ui.setHazardAlert(!0,r),()=>{this.ui.setHazardAlert(!1),this.missions.currentStep=L.DEFEAT_DRONE,this.progression.addXP(150),this.ui.toast("Meteor Storm Cleared! Warning: Drone Incoming!")}),this.universe.drones.update(e,this.player,r=>{this.ui.toast(`${r.name} Destroyed! ✦`),this.missions.currentStep=L.EXTRACTION,this.progression.addXP(250),this.resources.spawn("CRYSTAL",r.position.clone()),this.resources.spawn("SCRAP",r.position.clone().add(new y(1,0,1)))});const a=this._getAllSurroundingTargets();this.ui.updateRadar(s,this.player.cameraYaw,a),this.ui.updateSectorMap(s,this.player.cameraYaw,a)}this.materials.update(t),this.world.update();const n=this.universe?.structures?.group||this.world.solids;this.player.update(e,n),this.rig.update(e,this.player,null),this.lighting.follow(s),this.bursts.update(t),this.thrusters.update(t),this.hyperspace.update(t,s,i,this.player.warpIntensity),this.motes.update(t,s),this.scanner.update(e),this.universe.update(e,s)}}const io=document.getElementById("game-canvas"),no=document.getElementById("ui-root"),Et=new so(io,no);Et.boot();window.__game=Et;new URLSearchParams(location.search).has("autostart")&&setTimeout(()=>Et.start(),400);
