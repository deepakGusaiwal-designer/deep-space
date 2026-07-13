import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as p}from"./gsap-xgxdCp6f.js";import{g as S,X as he,j as A,o as re,Q as ne,x as Ye,k as He,f as y,i as d,Y as D,Z as ee,_ as Xe,C as Ke,$ as Je,a0 as Ze,a1 as et,a2 as tt,A as je,a3 as st,a4 as it,a5 as ot,W as at,d as rt,a as nt,S as qe,P as lt,a6 as te,a7 as N,v as H,B as _e,J as R,a8 as ht,M as g,a9 as L,aa as F,ab as G,ac as pe,ad as ze,ae as ke,af as we,ag as ct,ah as ut,R as We,ai as pt,aj as mt,u as dt,ak as ft,al as vt,am as Qe}from"./three-pD7YUweP.js";import{P as W,F as Me}from"./r3f-DxVe7tNe.js";const le={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class gt extends W{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof S?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=he.clone(e.uniforms),this.material=new S({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Me(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ae extends W{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const i=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let r,n;this.inverse?(r=0,n=1):(r=1,n=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),o.buffers.stencil.setFunc(i.ALWAYS,r,4294967295),o.buffers.stencil.setClear(n),o.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(i.EQUAL,1,4294967295),o.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),o.buffers.stencil.setLocked(!0)}}class yt extends W{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class wt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new A);this._width=s.width,this._height=s.height,t=new re(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ne}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new gt(le),this.copyPass.material.blending=Ye,this.clock=new He}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let i=0,o=this.passes.length;i<o;i++){const r=this.passes[i];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),r.needsSwap){if(s){const n=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}Ae!==void 0&&(r instanceof Ae?s=!0:r instanceof yt&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new A);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(s,i),this.renderTarget2.setSize(s,i);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(s,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class bt extends W{constructor(e,t,s=null,i=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=i,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new y}render(e,t,s){const i=e.autoClear;e.autoClear=!1;let o,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(o=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(o),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=i}}const xt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new y(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class j extends W{constructor(e,t=1,s,i){super(),this.strength=t,this.radius=s,this.threshold=i,this.resolution=e!==void 0?new A(e.x,e.y):new A(256,256),this.clearColor=new y(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new re(o,r,{type:ne}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new re(o,r,{type:ne});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const v=new re(o,r,{type:ne});v.texture.name="UnrealBloomPass.v"+h,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),o=Math.round(o/2),r=Math.round(r/2)}const n=xt;this.highPassUniforms=he.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new S({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];o=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new A(1/o,1/r),o=Math.round(o/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=he.clone(le.uniforms),this.blendMaterial=new S({uniforms:this.copyUniforms,vertexShader:le.vertexShader,fragmentShader:le.fragmentShader,blending:D,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new y,this._oldClearAlpha=1,this._basic=new ee,this._fsQuad=new Me(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let s=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(s,i);for(let o=0;o<this.nMips;o++)this.renderTargetsHorizontal[o].setSize(s,i),this.renderTargetsVertical[o].setSize(s,i),this.separableBlurMaterials[o].uniforms.invSize.value=new A(1/s,1/i),s=Math.round(s/2),i=Math.round(i/2)}render(e,t,s,i,o){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),o&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=s.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let n=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[l].uniforms.direction.value=j.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=j.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),n=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,o&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[];for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new S({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new A(.5,.5)},direction:{value:new A(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new S({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}j.BlurDirectionX=new A(1,0);j.BlurDirectionY=new A(0,1);const oe={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class _t extends W{constructor(){super(),this.uniforms=he.clone(oe.uniforms),this.material=new Xe({name:oe.name,uniforms:this.uniforms,vertexShader:oe.vertexShader,fragmentShader:oe.fragmentShader}),this._fsQuad=new Me(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ke.getTransfer(this._outputColorSpace)===Je&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ze?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===et?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===tt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===je?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===st?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===it?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ot&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const T={renderer:{maxPixelRatio:2,shadowMapSize:2048,bloom:{strength:.55,radius:.75,threshold:.82},adaptive:{targetFPS:58,minScale:.65,maxScale:1}},physics:{gravity:34,killPlaneY:-24,maxDelta:1/30},player:{radius:.55,accel:46,airControl:.35,maxSpeed:8.5,sprintSpeed:13.5,groundFriction:7.5,airDrag:.35,jumpVelocity:13.2,coyoteTime:.12,jumpBuffer:.12},camera:{fov:55,sprintFov:63,distance:8.2,height:3.1,minPitch:-.18,maxPitch:1.15,followLerp:9,lookAhead:1.6,zoomBySpeed:1.8,collisionRadius:.35,sensitivity:.0024},fx:{landDustMin:4,ambientMotes:260}};class Mt{constructor(e){this.canvas=e,this.renderer=new at({canvas:e,antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.toneMapping=je,this.renderer.toneMappingExposure=1.05,this.renderer.outputColorSpace=rt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nt,this.scene=new qe,this.camera=new lt(T.camera.fov,innerWidth/innerHeight,.1,600);const{bloom:t}=T.renderer;this.composer=new wt(this.renderer),this.composer.addPass(new bt(this.scene,this.camera)),this.bloomPass=new j(new A(innerWidth,innerHeight),t.strength,t.radius,t.threshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new _t),this.resScale=1,this._fpsSamples=[],this.clock=new He,this.elapsed=0,this.updaters=new Set,this._running=!1,addEventListener("resize",()=>this._applySize()),this._applySize()}onTick(e){return this.updaters.add(e),()=>this.updaters.delete(e)}start(){this._running||(this._running=!0,this.clock.start(),this.renderer.setAnimationLoop(()=>this._frame()))}stop(){this._running=!1,this.renderer.setAnimationLoop(null)}_frame(){const e=Math.min(this.clock.getDelta(),T.physics.maxDelta);this.elapsed+=e;for(const t of this.updaters)t(e,this.elapsed);this.composer.render(),this._adapt(e)}_adapt(e){const{targetFPS:t,minScale:s,maxScale:i}=T.renderer.adaptive;if(this._fpsSamples.push(1/Math.max(e,1e-4)),this._fpsSamples.length<45)return;const o=this._fpsSamples.reduce((n,l)=>n+l,0)/this._fpsSamples.length;this._fpsSamples.length=0;let r=this.resScale;o<t-6?r=Math.max(s,this.resScale-.1):o>t+4&&(r=Math.min(i,this.resScale+.05)),r!==this.resScale&&(this.resScale=r,this._applySize())}_applySize(){const e=Math.min(devicePixelRatio,T.renderer.maxPixelRatio)*this.resScale;this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setPixelRatio(e),this.renderer.setSize(innerWidth,innerHeight),this.composer.setPixelRatio(e),this.composer.setSize(innerWidth,innerHeight)}}const M=new d,Pe=new d,B=new d,E=new d,me=new te,de=new d,fe=new d;class Se{constructor(e,t={}){this.half=e.clone(),this.mesh=t.mesh??null,this.id=t.id??null,this.enabled=!0,this.center=new d,this.quaternion=new te,this.prevCenter=new d,this.prevQuaternion=new te,this.mesh&&this.syncFromMesh(!0)}setStatic(e,t){return this.center.copy(e),t&&this.quaternion.copy(t),this.prevCenter.copy(this.center),this.prevQuaternion.copy(this.quaternion),this}syncFromMesh(e=!1){this.prevCenter.copy(e?this.mesh.getWorldPosition(M):this.center),this.prevQuaternion.copy(e?this.mesh.getWorldQuaternion(me):this.quaternion),this.mesh.updateWorldMatrix(!0,!1),this.mesh.matrixWorld.decompose(this.center,this.quaternion,M.set(1,1,1))}yawDelta(){return de.set(1,0,0).applyQuaternion(this.quaternion),fe.set(1,0,0).applyQuaternion(this.prevQuaternion),Math.atan2(de.z,de.x)-Math.atan2(fe.z,fe.x)}resolveSphere(e,t){if(!this.enabled)return null;me.copy(this.quaternion).invert(),M.copy(e).sub(this.center).applyQuaternion(me),Pe.set(Math.max(-this.half.x,Math.min(this.half.x,M.x)),Math.max(-this.half.y,Math.min(this.half.y,M.y)),Math.max(-this.half.z,Math.min(this.half.z,M.z))),B.copy(M).sub(Pe);const s=B.lengthSq();if(s>t*t)return null;let i;if(s>1e-10){const o=Math.sqrt(s);E.copy(B).divideScalar(o),i=t-o}else{const o=this.half.x-Math.abs(M.x),r=this.half.y-Math.abs(M.y),n=this.half.z-Math.abs(M.z);o<r&&o<n?(E.set(Math.sign(M.x)||1,0,0),i=o+t):r<n?(E.set(0,Math.sign(M.y)||1,0),i=r+t):(E.set(0,0,Math.sign(M.z)||1),i=n+t)}return E.applyQuaternion(this.quaternion),e.addScaledVector(E,i),E.clone()}}class Q{constructor(e,t,s,{once:i=!0}={}){this.position=e.clone(),this.radius=t,this.onEnter=s,this.once=i,this.fired=!1,this.enabled=!0}test(e,t){if(!this.enabled||this.once&&this.fired)return;const s=this.radius+t;e.distanceToSquared(this.position)<s*s&&(this.fired=!0,this.onEnter())}}class St{constructor(e){this.gravity=e.gravity,this.killPlaneY=e.killPlaneY,this.colliders=[],this.triggers=[],this.attractors=[]}clear(){this.colliders.length=0,this.triggers.length=0,this.attractors.length=0}addCollider(e){return this.colliders.push(e),e}addTrigger(e){return this.triggers.push(e),e}addAttractor(e){return this.attractors.push(e),e}getCollider(e){return this.colliders.find(t=>t.id===e)??null}syncDynamics(){for(const e of this.colliders)e.mesh&&e.syncFromMesh()}step(e,t){const s=e.groundCollider;if(e.grounded&&s&&s.mesh){B.copy(s.center).sub(s.prevCenter),e.position.add(B);const i=s.yawDelta();Math.abs(i)>1e-6&&(M.copy(e.position).sub(s.center),M.applyAxisAngle(E.set(0,1,0),i),e.position.copy(s.center).add(M))}e.velocity.y-=this.gravity*t;for(const i of this.attractors){B.copy(i.position).sub(e.position);const o=B.length();if(o<i.killRadius)return!0;if(o<i.radius){const r=i.strength*(1-o/i.radius);e.velocity.addScaledVector(B.normalize(),r*t)}}e.position.addScaledVector(e.velocity,t),e.grounded=!1,e.groundCollider=null,e.groundNormal=null;for(let i=0;i<2;i++)for(const o of this.colliders){const r=o.resolveSphere(e.position,e.radius);if(!r)continue;const n=e.velocity.dot(r);n<0&&e.velocity.addScaledVector(r,-n),r.y>.55&&(e.grounded=!0,e.groundCollider=o,e.groundNormal=r)}for(const i of this.triggers)i.test(e.position,e.radius);return e.position.y<this.killPlaneY}}const se=`
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
`,Te=`
  float mFresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(clamp(1.0 - dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
  }
`,Tt=`
  vec3 mGradient(vec3 a, vec3 b, float t) {
    return mix(a, b, smoothstep(0.0, 1.0, t));
  }
`,De={vertex:`
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
    ${se}
    ${Te}
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
  `},ce={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${se}
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
  `},Re={vertex:ce.vertex,fragment:`
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
  `},Ee={vertex:`
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
    ${Te}
    ${Tt}
    void main() {
      float fade = pow(1.0 - vUv.y, 1.6);                 // dissolve toward the top
      float fres = 1.0 - mFresnel(vNormal, vViewDir, 0.7); // brightest at grazing center
      float flicker = 0.9 + 0.1 * sin(uTime * 3.0 + vUv.y * 10.0);
      float a = fade * fres * flicker * mix(0.18, 0.65, uLit);
      vec3 col = mGradient(uColor, vec3(1.0), vUv.y * 0.4 + uLit * 0.2);
      gl_FragColor = vec4(col * 1.4, a);
    }
  `},Fe={vertex:`
    varying vec3 vDir;
    void main() {
      vDir = normalize(position);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
    }
  `,fragment:`
    uniform vec3 uTop;       // nebula tint A (bright)
    uniform vec3 uHorizon;   // nebula tint B (deep)
    uniform vec3 uGround;    // void tint below
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    varying vec3 vDir;
    ${se}

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

      /* pitch-black space, barely tinted toward the void below */
      vec3 col = vec3(0.0015, 0.002, 0.0035) + uGround * max(0.0, -d.y) * 0.12;

      /* sparse, dim nebula wisps — the sky stays near-black */
      float n1 = mFbm(d * 2.2 + vec3(3.1));
      float n2 = mFbm(d * 4.7 + vec3(n1 * 1.8, 7.7, 1.3));
      float mask = smoothstep(0.55, 0.95, mFbm(d * 1.4 + vec3(11.0)));
      col += mix(uHorizon, uTop, n2) * (n1 * n1) * mask * 0.55;

      /* whisper of a tilted galaxy band */
      float band = exp(-abs(dot(d, normalize(vec3(0.25, 1.0, 0.2)))) * 5.0);
      col += vec3(0.22, 0.26, 0.38) * band * (0.04 + 0.16 * mFbm(d * 6.0));

      /* two star layers, denser inside the band */
      float s1 = starLayer(d, 90.0, 0.994);
      float s2 = starLayer(d, 170.0, 0.997);
      col += vec3(0.9, 0.95, 1.0) * (s1 * 0.9 + s2 * 0.55) * (0.55 + band);

      /* one distant star-sun (matches the key light direction) */
      float sun = clamp(dot(d, normalize(uSunDir)), 0.0, 1.0);
      col += uSunColor * (pow(sun, 900.0) * 4.0 + pow(sun, 24.0) * 0.10);

      gl_FragColor = vec4(col, 1.0);
    }
  `},Be={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${se}
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
  `},Ue={vertex:`
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
    ${Te}
    void main() {
      float fres = mFresnel(vNormal, vViewDir, 2.6);
      gl_FragColor = vec4(uColor * 1.6, fres * 0.85);
    }
  `},Le={vertex:ce.vertex,fragment:`
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float r = length(vUv - 0.5) * 2.0;
      float a = pow(smoothstep(1.0, 0.0, r), 2.2) * uStrength;
      gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    }
  `};function O(a,e,t,s=""){return a.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;
${se}`).replace("#include <color_fragment>",`#include <color_fragment>
{ vec3 wp = vMonPos; ${t} }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
{ vec3 wp = vMonPos; ${s} }`)},a.customProgramCacheKey=()=>e,a}class Ct{constructor(){this.cache=new Map,this.animated=[]}concrete(){return this._get("concrete",()=>{const e=new N({color:10199462,roughness:.94,metalness:0,envMapIntensity:.35});return O(e,"mon-concrete",`
        float patches = mFbm(wp * 0.33);
        float speckle = mNoise(wp * 14.0);
        float pores = smoothstep(0.72, 0.95, mNoise(wp * 7.0));
        diffuseColor.rgb *= 0.88 + patches * 0.22 + speckle * 0.06 - pores * 0.10;
      `,`
        roughnessFactor = clamp(roughnessFactor - mFbm(wp * 0.5) * 0.12, 0.0, 1.0);
      `)})}marble(){return this._get("marble",()=>{const e=new N({color:15329250,roughness:.24,metalness:0,envMapIntensity:.7,clearcoat:.35,clearcoatRoughness:.3});return O(e,"mon-marble",`
        float vein = mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6);
        float veins = smoothstep(0.16, 0.02, vein);
        float tone = mFbm(wp * 0.8) * 0.06;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.45, 0.5), veins * 0.55);
        diffuseColor.rgb += tone;
      `,`
        float vv = smoothstep(0.16, 0.02, mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6));
        roughnessFactor = clamp(roughnessFactor + vv * 0.25, 0.0, 1.0);
      `)})}metal(){return this._get("metal",()=>{const e=new N({color:12173252,roughness:.38,metalness:1,envMapIntensity:1});return O(e,"mon-metal",`
        float brush = mNoise(wp * vec3(0.35, 22.0, 22.0));
        diffuseColor.rgb *= 0.92 + brush * 0.12;
      `,`
        float streak = mNoise(wp * vec3(0.35, 22.0, 22.0));
        roughnessFactor = clamp(roughnessFactor + (streak - 0.5) * 0.22, 0.05, 1.0);
      `)})}chrome(){return this._get("chrome",()=>{const e=new N({color:16777215,roughness:.06,metalness:1,envMapIntensity:1.35,clearcoat:1,clearcoatRoughness:.04});return O(e,"mon-chrome",`
        diffuseColor.rgb *= 0.985 + mNoise(wp * 40.0) * 0.03;
      `)})}glass(){return this._get("glass",()=>{const e=new N({color:14084334,roughness:.55,metalness:0,envMapIntensity:1.1,transparent:!0,opacity:.34,side:H,depthWrite:!1});return O(e,"mon-glass",`
        diffuseColor.rgb += (mFbm(wp * 2.0) - 0.5) * 0.05;
      `,`
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 6.0) - 0.5) * 0.2, 0.2, 1.0);
      `)})}basalt(){return this._get("basalt",()=>{const e=new N({color:2764339,roughness:.85,metalness:.1,envMapIntensity:.4});return O(e,"mon-basalt",`
        diffuseColor.rgb *= 0.85 + mFbm(wp * 0.6) * 0.3;
      `)})}gate(e=10217727){const t=new S({vertexShader:De.vertex,fragmentShader:De.fragment,uniforms:{uTime:{value:0},uOpen:{value:0},uColor:{value:new y(e)}},transparent:!0,side:H,depthWrite:!1,blending:D});return this.animated.push(t),t}portal(e=10217727){const t=new S({vertexShader:ce.vertex,fragmentShader:ce.fragment,uniforms:{uTime:{value:0},uColor:{value:new y(e)}},transparent:!0,side:H,depthWrite:!1,blending:D});return this.animated.push(t),t}pad(e=10217727){const t=new S({vertexShader:Re.vertex,fragmentShader:Re.fragment,uniforms:{uTime:{value:0},uActive:{value:0},uColor:{value:new y(e)}},transparent:!0,depthWrite:!1,blending:D});return this.animated.push(t),t}beacon(e=16767392){const t=new S({vertexShader:Ee.vertex,fragmentShader:Ee.fragment,uniforms:{uTime:{value:0},uLit:{value:0},uColor:{value:new y(e)}},transparent:!0,side:H,depthWrite:!1,blending:D});return this.animated.push(t),t}blackholeDisk(e=16757867){const t=new S({vertexShader:Be.vertex,fragmentShader:Be.fragment,uniforms:{uTime:{value:0},uColor:{value:new y(e)}},transparent:!0,side:H,depthWrite:!1,blending:D});return this.animated.push(t),t}halo(e=10471679){return new S({vertexShader:Ue.vertex,fragmentShader:Ue.fragment,uniforms:{uColor:{value:new y(e)}},transparent:!0,depthWrite:!1,blending:D})}contactShadow(){return new S({vertexShader:Le.vertex,fragmentShader:Le.fragment,uniforms:{uStrength:{value:.55}},transparent:!0,depthWrite:!1})}update(e){for(const t of this.animated)t.uniforms.uTime.value=e}dispose(){for(const e of this.cache.values())e.dispose();for(const e of this.animated)e.dispose();this.cache.clear(),this.animated.length=0}_get(e,t){return this.cache.has(e)||this.cache.set(e,t()),this.cache.get(e)}}function zt(a,e=!1){const t=a[0].index!==null,s=new Set(Object.keys(a[0].attributes)),i=new Set(Object.keys(a[0].morphAttributes)),o={},r={},n=a[0].morphTargetsRelative,l=new _e;let c=0;for(let h=0;h<a.length;++h){const u=a[h];let v=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;o[m]===void 0&&(o[m]=[]),o[m].push(u.attributes[m]),v++}if(v!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(n!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.morphAttributes[m])}if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0;const u=[];for(let v=0;v<a.length;++v){const m=a[v].index;for(let w=0;w<m.count;++w)u.push(m.getX(w)+h);h+=a[v].attributes.position.count}l.setIndex(u)}for(const h in o){const u=Ie(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in r){const u=r[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let v=0;v<u;++v){const m=[];for(let f=0;f<r[h].length;++f)m.push(r[h][f][v]);const w=Ie(m);if(!w)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(w)}}return l}function Ie(a){let e,t,s,i=-1,o=0;for(let c=0;c<a.length;++c){const h=a[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=h.normalized),s!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.count*t}const r=new e(o),n=new R(r,t,s);let l=0;for(let c=0;c<a.length;++c){const h=a[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let v=0,m=h.count;v<m;v++)for(let w=0;w<t;w++){const f=h.getComponent(v,w);n.setComponent(v+u,w,f)}}else r.set(h.array,l);l+=h.count*t}return i!==void 0&&(n.gpuType=i),n}const $=new d;function z(a,e,t,s,i,o){const r=2*Math.PI*i/4,n=Math.max(o-2*i,0),l=Math.PI/4;$.copy(e),$[s]=0,$.normalize();const c=.5*r/(r+n),h=1-$.angleTo(a)/l;return Math.sign($[t])===1?h*c:n/(r+n)+c+c*(1-h)}class q extends ht{constructor(e=1,t=1,s=1,i=2,o=.1){const r=i*2+1;if(o=Math.min(e/2,t/2,s/2,o),super(1,1,1,r,r,r),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:s,segments:i,radius:o},r===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const l=new d,c=new d,h=new d(e,t,s).divideScalar(2).subScalar(o),u=this.attributes.position.array,v=this.attributes.normal.array,m=this.attributes.uv.array,w=u.length/6,f=new d,I=.5/r;for(let C=0,b=0;C<u.length;C+=3,b+=2)switch(l.fromArray(u,C),c.copy(l),c.x-=Math.sign(c.x)*I,c.y-=Math.sign(c.y)*I,c.z-=Math.sign(c.z)*I,c.normalize(),u[C+0]=h.x*Math.sign(l.x)+c.x*o,u[C+1]=h.y*Math.sign(l.y)+c.y*o,u[C+2]=h.z*Math.sign(l.z)+c.z*o,v[C+0]=c.x,v[C+1]=c.y,v[C+2]=c.z,Math.floor(C/w)){case 0:f.set(1,0,0),m[b+0]=z(f,c,"z","y",o,s),m[b+1]=1-z(f,c,"y","z",o,t);break;case 1:f.set(-1,0,0),m[b+0]=1-z(f,c,"z","y",o,s),m[b+1]=1-z(f,c,"y","z",o,t);break;case 2:f.set(0,1,0),m[b+0]=1-z(f,c,"x","z",o,e),m[b+1]=z(f,c,"z","x",o,s);break;case 3:f.set(0,-1,0),m[b+0]=1-z(f,c,"x","z",o,e),m[b+1]=1-z(f,c,"z","x",o,s);break;case 4:f.set(0,0,1),m[b+0]=1-z(f,c,"x","y",o,e),m[b+1]=1-z(f,c,"y","x",o,t);break;case 5:f.set(0,0,-1),m[b+0]=z(f,c,"x","y",o,e),m[b+1]=1-z(f,c,"y","x",o,t);break}}static fromJSON(e){return new q(e.width,e.height,e.depth,e.segments,e.radius)}}const ue=new ct,be=new te,Ne=new ut,kt=new d,k=a=>new d(a[0],a[1],a[2]);function Y(a,e,t,s,i=[0,0,0],o=.06){var n;const r=new q(s[0],s[1],s[2],2,Math.min(o,Math.min(...s)*.24));ue.set(i[0],i[1],i[2]),be.setFromEuler(ue),Ne.compose(k(t),be,kt.set(1,1,1)),r.applyMatrix4(Ne),((n=a.batches)[e]??(n[e]=[])).push(r)}function X(a,e,t,s=[0,0,0]){ue.set(s[0],s[1],s[2]);const i=new Se(new d(t[0]/2,t[1]/2,t[2]/2));return i.setStatic(k(e),be.setFromEuler(ue)),a.physics.addCollider(i),i}function ve(a,e,t,s,i={}){const o=new q(s[0],s[1],s[2],2,Math.min(.06,Math.min(...s)*.24)),r=new g(o,a.materials[e]());r.position.set(t[0],t[1],t[2]),r.castShadow=!0,r.receiveShadow=!0,a.solids.add(r);const n=new Se(new d(s[0]/2,s[1]/2,s[2]/2),{mesh:i.colliderMesh??r,id:i.id??null});return a.physics.addCollider(n),{mesh:r,collider:n}}const xe={platform(a,e){const t=e.mat??"concrete";if(Y(a,t,e.pos,e.size,e.rot),X(a,e.pos,e.size,e.rot),e.skirt!==!1){const[s,,i]=e.size,o=e.skirtDepth??5;Y(a,"basalt",[e.pos[0],e.pos[1]-e.size[1]/2-o/2+.05,e.pos[2]],[s*.55,o,i*.55],[0,0,0],.04)}},ramp(a,e){xe.platform(a,{...e,skirt:e.skirt??!1})},bridge(a,e){const t=k(e.from),s=k(e.to),i=t.clone().add(s).multiplyScalar(.5),o=t.distanceTo(s),r=Math.atan2(s.x-t.x,s.z-t.z);xe.platform(a,{pos:[i.x,i.y,i.z],size:[e.width??2.4,e.thickness??.7,o],rot:[0,r,0],mat:e.mat??"metal",skirt:!1})},rotator(a,e){const{mesh:t}=ve(a,e.mat??"metal",e.pos,e.size),s=e.axis??"y",i={};i[s]=`+=${Math.PI*2*(e.reverse?-1:1)}`,a.tweens.push(p.to(t.rotation,{...i,duration:e.duration??4,ease:"none",repeat:-1}))},slider(a,e){const{mesh:t}=ve(a,e.mat??"metal",e.pos,e.size);a.tweens.push(p.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3,ease:e.ease??"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0,repeatDelay:e.repeatDelay??0}))},elevator(a,e){const{mesh:t}=ve(a,e.mat??"metal",e.pos,e.size),s=p.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3.2,ease:"sine.inOut",repeat:-1,yoyo:!0,repeatDelay:e.repeatDelay??.8,paused:!!e.triggerId});a.tweens.push(s),e.triggerId&&a.actions.set(e.triggerId,()=>s.play())},pendulum(a,e){const t=new L;t.position.set(e.pos[0],e.pos[1],e.pos[2]),a.solids.add(t);const s=e.length??4,i=new q(e.thickness??.6,s,e.thickness??.6,2,.05),o=new g(i,a.materials[e.mat??"metal"]());o.position.y=-s/2,o.castShadow=!0,o.receiveShadow=!0,t.add(o),a.physics.addCollider(new Se(new d((e.thickness??.6)/2,s/2,(e.thickness??.6)/2),{mesh:o})),t.rotation.z=-(e.swing??.85),a.tweens.push(p.to(t.rotation,{z:e.swing??.85,duration:e.duration??1.6,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0}))},gate(a,e){const[t,s]=e.size,i=e.yaw??0,o=Math.cos(i),r=Math.sin(i),n=[.45,s+.6,.45],l=(t/2+.2)*o,c=-(t/2+.2)*r;for(const w of[1,-1]){const f=[e.pos[0]+l*w,e.pos[1],e.pos[2]+c*w];Y(a,"metal",f,n,[0,i,0]),X(a,f,n,[0,i,0])}const h=[e.pos[0],e.pos[1]+s/2+.35,e.pos[2]];Y(a,"metal",h,[t+1.3,.5,.45],[0,i,0]),X(a,h,[t+1.3,.5,.45],[0,i,0]);const u=a.materials.gate(a.accent),v=new g(new we(t,s),u);v.position.set(e.pos[0],e.pos[1],e.pos[2]),v.rotation.y=i,a.group.add(v);const m=X(a,e.pos,[t,s,.3],[0,i,0]);a.actions.set(e.id,()=>{m.enabled=!1,p.to(u.uniforms.uOpen,{value:1,duration:1.1,ease:"power2.inOut"}),a.world.onGateOpen?.(k(e.pos))})},pad(a,e){const t=new g(new ke(.95,1.05,.16,28),a.materials.metal());t.position.set(e.pos[0],e.pos[1],e.pos[2]),t.receiveShadow=!0,a.group.add(t);const s=a.materials.pad(a.accent),i=new g(new we(2.4,2.4),s);i.rotation.x=-Math.PI/2,i.position.set(e.pos[0],e.pos[1]+.1,e.pos[2]),a.group.add(i),a.physics.addTrigger(new Q(k(e.pos),1.3,()=>{p.to(s.uniforms.uActive,{value:1,duration:.5});for(const o of e.targets??[])a.actions.get(o)?.();a.world.onPad?.(k(e.pos))}))},checkpoint(a,e){const t=k(e.pos),s=new g(new ke(1.1,1.2,.14,32),a.materials.marble());s.position.copy(t),s.receiveShadow=!0,a.group.add(s);const i=new L;i.position.set(t.x,t.y+1.5,t.z),a.group.add(i);const o=a.materials.blackholeDisk(9071173),r=new g(new pe(.15,1,48,1),o);r.rotation.x=-Math.PI/2,i.add(r);const n=new g(new G(1.06,.045,12,48),a.materials.chrome());n.rotation.x=Math.PI/2,i.add(n);const l=new g(new F(1.05,28,16),a.materials.halo(16767392));l.scale.y=.28,i.add(l),a.tweens.push(p.to(i.rotation,{y:Math.PI*2,duration:11,ease:"none",repeat:-1})),a.tweens.push(p.to(i.position,{y:t.y+1.75,duration:2.4,ease:"sine.inOut",repeat:-1,yoyo:!0})),a.physics.addTrigger(new Q(t,1.5,()=>{const c=new y(a.accent);p.to(o.uniforms.uColor.value,{r:c.r,g:c.g,b:c.b,duration:.7}),p.fromTo(i.scale,{x:1.5,y:1.5,z:1.5},{x:1,y:1,z:1,duration:.9,ease:"expo.out"}),a.world.onCheckpoint?.(new d(t.x,t.y+1.2,t.z))}))},portal(a,e){const t=k(e.pos),s=new L;s.position.copy(t),s.rotation.y=e.yaw??0,a.group.add(s);const i=new g(new ze(.68,40),new ee({color:0,side:H}));s.add(i);const o=new g(new pe(.3,1.9,64,1),a.materials.blackholeDisk(a.accent));o.position.z=.01,s.add(o);const r=new g(new G(1.95,.05,12,64),new ee({color:16774108}));s.add(r);const n=new g(new G(2.2,.05,10,64),a.materials.metal());s.add(n);const l=new g(new F(2,32,20),a.materials.halo(a.accent));l.scale.z=.3,s.add(l),a.tweens.push(p.to(n.rotation,{x:Math.PI*2,duration:7,ease:"none",repeat:-1})),a.tweens.push(p.to(r.rotation,{z:-Math.PI*2,duration:12,ease:"none",repeat:-1})),a.physics.addTrigger(new Q(t,1.5,()=>a.world.onPortal?.(t))),a.portalPos=t},blackhole(a,e){const t=k(e.pos),s=e.scale??1,i=new L;i.position.copy(t),a.group.add(i);const o=new g(new F(1.1*s,40,24),new ee({color:0}));i.add(o);const r=new g(new F(1.32*s,40,24),a.materials.halo(e.haloColor??10471679));i.add(r);const n=new g(new G(1.42*s,.045*s,12,72),new ee({color:16774108})),l=new g(new pe(1.35*s,3.4*s,72,1),a.materials.blackholeDisk(e.color??16757867)),c=e.tilt??1.25;for(const h of[n,l])h.rotation.x=c,i.add(h);a.tweens.push(p.to(i.rotation,{y:Math.PI*2,duration:90/(e.spin??1),ease:"none",repeat:-1})),e.pull&&a.physics.addAttractor({position:t,radius:e.radius??10*s,strength:e.strength??24,killRadius:1.35*s})},wormhole(a,e){const t=e.color??9175001,s=k(e.a),i=k(e.b),o=(r,n=0)=>{const l=new L;l.position.copy(r),l.rotation.y=n,a.group.add(l);const c=new g(new G(1.55,.14,16,56),a.materials.chrome());c.castShadow=!0,l.add(c);const h=new g(new G(1.85,.05,10,56),a.materials.metal());l.add(h);const u=new g(new ze(1.45,44),a.materials.portal(t));l.add(u);const v=new g(new F(1.7,32,20),a.materials.halo(t));return v.scale.z=.35,l.add(v),a.tweens.push(p.to(c.rotation,{z:Math.PI*2,duration:9,ease:"none",repeat:-1})),a.tweens.push(p.to(h.rotation,{x:Math.PI*2,duration:5.5,ease:"none",repeat:-1})),l};o(s,e.yawA??0),o(i,e.yawB??e.yawA??0),a.world.wormholeMouths.push(s.clone(),i.clone()),a.physics.addTrigger(new Q(s,1.35,()=>a.world.onWormhole?.({pos:i.clone(),from:s.clone()}),{once:!1})),e.bidirectional!==!1&&a.physics.addTrigger(new Q(i,1.35,()=>a.world.onWormhole?.({pos:s.clone(),from:i.clone()}),{once:!1}))},decor(a,e){const t=new q(e.size[0],e.size[1],e.size[2],2,.08),s=new g(t,a.materials[e.mat??"glass"]());s.position.set(e.pos[0],e.pos[1],e.pos[2]),e.rot&&s.rotation.set(e.rot[0],e.rot[1],e.rot[2]),s.castShadow=e.mat!=="glass",a.group.add(s);const i=e.drift??.6;a.tweens.push(p.to(s.position,{y:e.pos[1]+i,duration:3+Math.random()*3,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:Math.random()*2})),a.tweens.push(p.to(s.rotation,{y:`+=${(Math.random()-.5)*1.4}`,duration:6+Math.random()*5,ease:"sine.inOut",repeat:-1,yoyo:!0}))},pillar(a,e){Y(a,e.mat??"concrete",e.pos,e.size,e.rot??[0,0,0]),e.solid&&X(a,e.pos,e.size,e.rot??[0,0,0])}};class At{constructor(e,t,s){this.scene=e,this.physics=t,this.materials=s,this.group=new L,this.solids=new L,e.add(this.group,this.solids),this.tweens=[],this.actions=new Map,this.portalPos=null,this.wormholeMouths=[],this.accent=10217727,this.onCheckpoint=null,this.onPortal=null,this.onPad=null,this.onGateOpen=null,this.onWormhole=null}load(e){this.clear(),this.accent=e.accent??10217727;const t={world:this,physics:this.physics,materials:this._materialProxy(),group:this.group,solids:this.solids,batches:{},tweens:this.tweens,actions:this.actions,accent:this.accent,portalPos:null};for(const s of e.objects){const i=xe[s.type];if(!i){console.warn(`[World] unknown component "${s.type}"`);continue}i(t,s)}this.portalPos=t.portalPos;for(const[s,i]of Object.entries(t.batches)){const o=zt(i,!1);for(const n of i)n.dispose();const r=new g(o,this.materials[s]());r.castShadow=!0,r.receiveShadow=!0,this.solids.add(r)}return{spawn:new d(...e.spawn)}}update(){this.physics.syncDynamics()}clear(){for(const e of this.tweens)e.kill();this.tweens.length=0,this.actions.clear(),this.physics.clear(),this.portalPos=null,this.wormholeMouths.length=0;for(const e of[this.group,this.solids])for(const t of[...e.children])t.traverse(s=>{if(s.geometry&&s.geometry.dispose(),s.material?.uniforms){s.material.dispose();const i=this.materials.animated.indexOf(s.material);i>=0&&this.materials.animated.splice(i,1)}}),e.remove(t)}_materialProxy(){const e=this.materials;return{concrete:()=>e.concrete(),marble:()=>e.marble(),metal:()=>e.metal(),chrome:()=>e.chrome(),glass:()=>e.glass(),basalt:()=>e.basalt(),gate:t=>e.gate(t),pad:t=>e.pad(t),beacon:t=>e.beacon(t),portal:t=>e.portal(t),halo:t=>e.halo(t),blackholeDisk:t=>e.blackholeDisk(t)}}}const Ge=(a,e,t)=>Math.min(t,Math.max(e,a)),ge=(a,e)=>1-Math.exp(-a*e);function ye(a){const e=Math.floor(a/60),t=Math.floor(a%60),s=Math.floor(a%1*100);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}.${String(s).padStart(2,"0")}`}const x=T.player,K=new d,Oe=new d,Ve=new te,Pt=new d(0,1,0),Dt=new d(0,-1,0);class Rt{constructor({scene:e,physics:t,input:s,materials:i}){this.physics=t,this.input=s,this.body={position:new d(0,3,0),velocity:new d,radius:x.radius,grounded:!1,groundCollider:null,groundNormal:null},this.spawn=new d(0,3,0),this.cameraYaw=0,this.frozen=!0,this.paused=!1,this.onLand=null,this.onJump=null,this.onFall=null,this._wasGrounded=!1,this._coyote=0,this._jumpBuffer=0,this._fallSpeed=0,this.mesh=new g(new F(x.radius,48,32),i.chrome()),this.mesh.castShadow=!0,e.add(this.mesh),this.shadowBlob=new g(new we(x.radius*4.4,x.radius*4.4),i.contactShadow()),this.shadowBlob.rotation.x=-Math.PI/2,this.shadowBlob.renderOrder=1,e.add(this.shadowBlob),this._raycaster=new We,this._raycaster.far=30,s.on("jump",()=>{this._jumpBuffer=x.jumpBuffer})}get position(){return this.body.position}get velocity(){return this.body.velocity}setSpawn(e){this.spawn.copy(e)}respawn(){this.body.position.copy(this.spawn),this.body.velocity.set(0,0,0),this.body.grounded=!1,this.body.groundCollider=null,this.mesh.position.copy(this.spawn),p.fromTo(this.mesh.scale,{x:0,y:0,z:0},{x:1,y:1,z:1,duration:.6,ease:"back.out(2.5)",overwrite:"auto"})}update(e,t){const s=this.body;if(this.frozen){if(s.grounded){const r=Math.max(0,1-x.groundFriction*e);s.velocity.x*=r,s.velocity.z*=r}}else{const r=this.input.moveVector(),l=this.input.sprinting?x.sprintSpeed:x.maxSpeed,c=Math.sin(this.cameraYaw),h=Math.cos(this.cameraYaw);K.set(r.x*h-r.z*c,0,-r.z*h-r.x*c);const u=s.grounded?1:x.airControl;s.velocity.addScaledVector(K,x.accel*u*e);const v=Math.hypot(s.velocity.x,s.velocity.z);if(v>l){const f=l/v;s.velocity.x*=f,s.velocity.z*=f}const m=s.grounded?K.lengthSq()>0?.6:x.groundFriction:x.airDrag,w=Math.max(0,1-m*e);if(s.velocity.x*=w,s.velocity.z*=w,this._coyote=s.grounded?x.coyoteTime:Math.max(0,this._coyote-e),this._jumpBuffer=Math.max(0,this._jumpBuffer-e),this._jumpBuffer>0&&this._coyote>0){this._jumpBuffer=0,this._coyote=0,s.velocity.y=x.jumpVelocity;const f=s.groundCollider;f?.mesh&&e>0&&(s.velocity.x+=(f.center.x-f.prevCenter.x)/e,s.velocity.z+=(f.center.z-f.prevCenter.z)/e),s.grounded=!1,s.groundCollider=null,p.fromTo(this.mesh.scale,{x:1.18,y:.82,z:1.18},{x:1,y:1,z:1,duration:.35,ease:"elastic.out(1, 0.55)",overwrite:"auto"}),this.onJump?.()}}s.grounded||(this._fallSpeed=-s.velocity.y);const i=this.physics.step(s,this.paused?0:e);if(s.grounded&&!this._wasGrounded&&this._fallSpeed>T.fx.landDustMin){const r=Math.min(1,this._fallSpeed/26);p.fromTo(this.mesh.scale,{x:1+r*.35,y:1-r*.4,z:1+r*.35},{x:1,y:1,z:1,duration:.45,ease:"elastic.out(1, 0.4)",overwrite:"auto"}),this.onLand?.(this._fallSpeed)}this._wasGrounded=s.grounded,this.mesh.position.copy(s.position);const o=Math.hypot(s.velocity.x,s.velocity.z);o>.05&&(K.set(s.velocity.x,0,s.velocity.z).normalize(),Oe.crossVectors(Pt,K).normalize(),Ve.setFromAxisAngle(Oe,-o*e/x.radius),this.mesh.quaternion.premultiply(Ve)),this._updateShadow(t),i&&!this.frozen&&this.onFall?.()}_updateShadow(e){this._raycaster.set(this.body.position,Dt);const t=e?this._raycaster.intersectObject(e,!0):[];if(t.length){const s=t[0];this.shadowBlob.visible=!0,this.shadowBlob.position.set(this.body.position.x,s.point.y+.02,this.body.position.z);const i=s.distance-x.radius,o=Math.max(0,1-i/7);this.shadowBlob.material.uniforms.uStrength.value=.55*o;const r=1+i*.12;this.shadowBlob.scale.set(r,r,1)}else this.shadowBlob.visible=!1}}const _=T.camera,J=new d,V=new d,ae=new d,Z=new d;class Et{constructor(e,t){this.camera=e,this.input=t,this.yaw=0,this.pitch=.42,this.distance=_.distance,this.cinematic=!1,this.focus=new d,this._zoom=0,this._raycaster=new We,this._fovTween=null}snapTo(e,t=0){this.yaw=t,this.pitch=.42,this.focus.copy(e),this._place(e,null,1)}update(e,t,s){if(this.cinematic)return;const i=this.input.consumeMouse();this.yaw-=i.x*_.sensitivity,this.pitch=Ge(this.pitch+i.y*_.sensitivity,_.minPitch,_.maxPitch);const o=ge(_.followLerp,e);this.focus.lerp(t.position,o);const r=Math.hypot(t.velocity.x,t.velocity.z),n=Ge(r/T.player.sprintSpeed,0,1);this._zoom+=(n*_.zoomBySpeed-this._zoom)*ge(2.5,e);const l=this.input.sprinting&&n>.6?_.sprintFov:_.fov;Math.abs(this.camera.fov-l)>.1&&!this._fovTween?.isActive()&&(this._fovTween=p.to(this.camera,{fov:l,duration:.7,ease:"sine.out",overwrite:"auto",onUpdate:()=>this.camera.updateProjectionMatrix()})),V.copy(this.focus),r>.5&&(ae.set(t.velocity.x,0,t.velocity.z).normalize().multiplyScalar(_.lookAhead*n),V.add(ae)),this._place(V,s,ge(12,e)),t.cameraYaw=this.yaw}_place(e,t,s){const i=this.distance+this._zoom;if(ae.set(Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.cos(this.yaw)*Math.cos(this.pitch)).multiplyScalar(i),J.copy(e).add(ae),J.y+=_.height*.25,t){Z.copy(J).sub(e);const o=Z.length();Z.divideScalar(o),this._raycaster.set(e,Z),this._raycaster.far=o;const r=this._raycaster.intersectObject(t,!0);if(r.length){const n=Math.max(1.2,r[0].distance-_.collisionRadius);J.copy(e).addScaledVector(Z,n)}}this.camera.position.lerp(J,s),V.copy(e),V.y+=_.height*.35,this.camera.lookAt(V)}intro(e,t=2.8){this.cinematic=!0;const s=this.camera,i={x:e.x+26,y:e.y+20,z:e.z+26};return s.position.set(i.x,i.y,i.z),new Promise(o=>{const r={t:0},n=new d;p.to(r,{t:1,duration:t,ease:"power3.inOut",onUpdate:()=>{const l=r.t,c=Math.PI*.75*(1-l),h=26-(26-_.distance)*l,u=20-(20-_.height*1.6)*l;s.position.set(e.x+Math.sin(c)*h,e.y+u,e.z+Math.cos(c)*h),n.copy(e),n.y+=_.height*.35,s.lookAt(n)},onComplete:()=>{this.yaw=0,this.pitch=.42,this.focus.copy(e),this.cinematic=!1,o()}})})}orbit(e,{dist:t=11,h:s=6}={}){this.cinematic=!0;const i=this.camera,o={ang:this.yaw,dist:this.distance+this._zoom,h:4.5},r=new d;this._orbitTween=p.to(o,{ang:this.yaw+Math.PI*2,duration:16,repeat:-1,ease:"none",onUpdate:()=>{i.position.set(e.x+Math.sin(o.ang)*o.dist,e.y+o.h,e.z+Math.cos(o.ang)*o.dist),r.copy(e),r.y+=1,i.lookAt(r)}}),p.to(o,{dist:t,h:s,duration:3,ease:"sine.inOut"})}endOrbit(){this._orbitTween?.kill(),this._orbitTween=null,this.cinematic=!1}}class Ft{constructor(e){this.engine=e;const t=e.scene;this.sun=new pt(16773856,3.2),this.sun.position.set(18,30,12),this.sun.castShadow=!0;const s=T.renderer.shadowMapSize;this.sun.shadow.mapSize.set(s,s),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=120;const i=34;this.sun.shadow.camera.left=-i,this.sun.shadow.camera.right=i,this.sun.shadow.camera.top=i,this.sun.shadow.camera.bottom=-i,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.03,t.add(this.sun,this.sun.target),this.hemi=new mt(9413576,856088,.6),t.add(this.hemi),this.skyMat=new S({vertexShader:Fe.vertex,fragmentShader:Fe.fragment,uniforms:{uTop:{value:new y(5227519)},uHorizon:{value:new y(1718886)},uGround:{value:new y(131850)},uSunDir:{value:this.sun.position.clone().normalize()},uSunColor:{value:new y(14675967)}},side:dt,depthWrite:!1,fog:!1}),this.skyDome=new g(new F(400,32,16),this.skyMat),this.skyDome.frustumCulled=!1,t.add(this.skyDome),t.fog=new ft(263692,.0075),this._buildEnvironment()}_buildEnvironment(){const e=new vt(this.engine.renderer),t=new qe,s=new g(new F(80,32,16),this.skyMat);t.add(s);const i=e.fromScene(t,.04);this.engine.scene.environment=i.texture,e.dispose(),s.geometry.dispose()}transitionTo({top:e,horizon:t,fog:s,sunColor:i,sunIntensity:o=3.2},r=1.6){const n=this.skyMat.uniforms,l=[[n.uTop.value,e],[n.uHorizon.value,t],[this.engine.scene.fog.color,s]];i&&l.push([n.uSunColor.value,i]);for(const[c,h]of l){const u=new y(h);p.to(c,{r:u.r,g:u.g,b:u.b,duration:r,ease:"sine.inOut",overwrite:"auto"})}p.to(this.sun,{intensity:o,duration:r,ease:"sine.inOut",overwrite:"auto"})}follow(e){this.sun.position.set(e.x+18,e.y+30,e.z+12),this.sun.target.position.copy(e),this.skyDome.position.copy(e)}}class Bt{constructor(e){this.canvas=e,this.keys=new Set,this.mouseDX=0,this.mouseDY=0,this.enabled=!1,this._listeners=new Map,addEventListener("keydown",t=>{t.repeat||(this.keys.add(t.code),t.code==="Space"&&(t.preventDefault(),this._emit("jump")),t.code==="KeyR"&&this._emit("restart"),t.code==="Escape"&&this._emit("pause"),t.code==="Enter"&&this._emit("confirm"),t.code==="KeyM"&&this._emit("mute"))}),addEventListener("keyup",t=>this.keys.delete(t.code)),addEventListener("blur",()=>this.keys.clear()),addEventListener("mousemove",t=>{this.pointerLocked&&(this.mouseDX+=t.movementX,this.mouseDY+=t.movementY)}),document.addEventListener("pointerlockchange",()=>{this.pointerLocked||this._emit("unlock")})}get pointerLocked(){return document.pointerLockElement===this.canvas}lockPointer(){this.pointerLocked||this.canvas.requestPointerLock?.()}unlockPointer(){this.pointerLocked&&document.exitPointerLock?.()}moveVector(){if(!this.enabled)return{x:0,z:0};const e=(this.keys.has("KeyD")?1:0)-(this.keys.has("KeyA")?1:0),t=(this.keys.has("KeyW")?1:0)-(this.keys.has("KeyS")?1:0),s=Math.hypot(e,t)||1;return{x:e/s,z:t/s}}get sprinting(){return this.enabled&&(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight"))}get jumpHeld(){return this.enabled&&this.keys.has("Space")}consumeMouse(){const e={x:this.mouseDX,y:this.mouseDY};return this.mouseDX=0,this.mouseDY=0,e}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this._listeners.get(e).delete(t)}_emit(e){this._listeners.get(e)?.forEach(t=>t())}}const Ut=`
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
`,Lt=`
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vFade;
    gl_FragColor = vec4(vColor, a * 0.85);
  }
`;class It{constructor(e,t=600){this.capacity=t,this.cursor=0;const s=new _e,i=new Float32Array(t*3);s.setAttribute("position",new R(i.slice(),3)),s.setAttribute("aVelocity",new R(i.slice(),3)),s.setAttribute("aColor",new R(i.slice(),3)),s.setAttribute("aSpawnTime",new R(new Float32Array(t).fill(-1e3),1)),s.setAttribute("aLife",new R(new Float32Array(t).fill(1),1)),s.setAttribute("aSize",new R(new Float32Array(t).fill(1),1)),this.material=new S({vertexShader:Ut,fragmentShader:Lt,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:D}),this.points=new Qe(s,this.material),this.points.frustumCulled=!1,e.add(this.points)}emit(e,t,s={}){const{color:i=new y(13620954),speed:o=3.5,up:r=2.2,spread:n=1,life:l=.9,size:c=1.4}=s,h=this.points.geometry,u=h.attributes.position,v=h.attributes.aVelocity,m=h.attributes.aColor,w=h.attributes.aSpawnTime,f=h.attributes.aLife,I=h.attributes.aSize,C=this.material.uniforms.uTime.value;for(let b=0;b<t;b++){const U=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const ie=Math.random()*Math.PI*2,Ce=Math.random()*n;u.setXYZ(U,e.x+Math.cos(ie)*Ce*.4,e.y,e.z+Math.sin(ie)*Ce*.4),v.setXYZ(U,Math.cos(ie)*o*(.35+Math.random()*.65),r*(.5+Math.random()*.8),Math.sin(ie)*o*(.35+Math.random()*.65)),m.setXYZ(U,i.r,i.g,i.b),w.setX(U,C),f.setX(U,l*(.6+Math.random()*.7)),I.setX(U,c*(.6+Math.random()*.8))}u.needsUpdate=!0,v.needsUpdate=!0,m.needsUpdate=!0,w.needsUpdate=!0,f.needsUpdate=!0,I.needsUpdate=!0}update(e){this.material.uniforms.uTime.value=e}}const Nt=`
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
`,Gt=`
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    gl_FragColor = vec4(vec3(0.75, 0.83, 0.9), smoothstep(1.0, 0.1, d) * vA * 0.16);
  }
`;class Ot{constructor(e,t=260,s=34){const i=new _e,o=new Float32Array(t*3),r=new Float32Array(t);for(let n=0;n<t;n++)o[n*3]=(Math.random()-.5)*s,o[n*3+1]=(Math.random()-.5)*s,o[n*3+2]=(Math.random()-.5)*s,r[n]=Math.random();i.setAttribute("position",new R(o,3)),i.setAttribute("aSeed",new R(r,1)),this.material=new S({vertexShader:Nt,fragmentShader:Gt,uniforms:{uTime:{value:0},uCenter:{value:new d},uRange:{value:s}},transparent:!0,depthWrite:!1,blending:D}),this.points=new Qe(i,this.material),this.points.frustumCulled=!1,e.add(this.points)}update(e,t){this.material.uniforms.uTime.value=e,this.material.uniforms.uCenter.value.copy(t)}}class Vt{constructor(){this.ctx=null,this.master=null,this.muted=!1,this._padNodes=[]}init(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=.6,this.master.connect(this.ctx.destination),this._startAmbient())}toggleMute(){if(this.ctx)return this.muted=!this.muted,this.master.gain.linearRampToValueAtTime(this.muted?0:.6,this.ctx.currentTime+.2),this.muted}_startAmbient(){const e=this.ctx.currentTime,t=this.ctx.createGain();t.gain.setValueAtTime(0,e),t.gain.linearRampToValueAtTime(.05,e+4);const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.value=320;const i=this.ctx.createOscillator();i.frequency.value=.05;const o=this.ctx.createGain();o.gain.value=140,i.connect(o).connect(s.frequency),i.start();for(const[r,n]of[[55,0],[55,6],[110,-4]]){const l=this.ctx.createOscillator();l.type="triangle",l.frequency.value=r,l.detune.value=n,l.connect(s),l.start(),this._padNodes.push(l)}s.connect(t).connect(this.master)}_blip(e,{type:t="sine",dur:s=.18,vol:i=.25,slide:o=0}={}){if(!this.ctx||this.muted)return;const r=this.ctx.currentTime,n=this.ctx.createOscillator(),l=this.ctx.createGain();n.type=t,n.frequency.setValueAtTime(e,r),o&&n.frequency.exponentialRampToValueAtTime(Math.max(30,e+o),r+s),l.gain.setValueAtTime(i,r),l.gain.exponentialRampToValueAtTime(.001,r+s),n.connect(l).connect(this.master),n.start(r),n.stop(r+s+.02)}_noise({dur:e=.22,vol:t=.3,freq:s=400}={}){if(!this.ctx||this.muted)return;const i=this.ctx.currentTime,o=Math.floor(this.ctx.sampleRate*e),r=this.ctx.createBuffer(1,o,this.ctx.sampleRate),n=r.getChannelData(0);for(let u=0;u<o;u++)n[u]=(Math.random()*2-1)*(1-u/o);const l=this.ctx.createBufferSource();l.buffer=r;const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.value=s;const h=this.ctx.createGain();h.gain.setValueAtTime(t,i),h.gain.exponentialRampToValueAtTime(.001,i+e),l.connect(c).connect(h).connect(this.master),l.start(i)}jump(){this._blip(320,{type:"sine",dur:.16,vol:.12,slide:260})}land(e=1){this._noise({dur:.18,vol:.12*e,freq:300})}checkpoint(){this._blip(523,{dur:.3,vol:.1}),setTimeout(()=>this._blip(784,{dur:.45,vol:.1}),110)}pad(){this._blip(392,{type:"triangle",dur:.35,vol:.14,slide:120})}gate(){this._noise({dur:.6,vol:.1,freq:900}),this._blip(196,{dur:.6,vol:.08,slide:160})}portal(){this._blip(262,{dur:1.2,vol:.12,slide:520}),this._noise({dur:1,vol:.08,freq:1400})}fall(){this._blip(240,{type:"sawtooth",dur:.5,vol:.06,slide:-180})}warp(){this._blip(180,{type:"sine",dur:.45,vol:.14,slide:700}),this._noise({dur:.5,vol:.09,freq:1800})}click(){this._blip(660,{dur:.08,vol:.08})}}class Ht{constructor(e){this.root=e,e.innerHTML=`
      <div class="vignette"></div>

      <section class="screen screen--start" data-el="start">
        <div class="kicker">Deepak Gusaiwal — Creative Development</div>
        <h1 class="title">MONU<span class="thin">MENT</span></h1>
        <div class="subtitle">A Three.js Technical Showcase</div>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to begin</button>
        <div class="controls-hint">
          <span><b>WASD</b> move</span><span><b>Mouse</b> camera</span>
          <span><b>Space</b> jump</span><span><b>Shift</b> sprint</span>
          <span><b>R</b> restart</span><span><b>Esc</b> pause</span>
        </div>
      </section>

      <div class="hud" data-el="hud" style="visibility:hidden">
        <div class="hud__level glass">
          <span class="num" data-el="levelNum"></span>
          <span class="name" data-el="levelName"></span>
        </div>
        <div class="hud__timer glass" data-el="timer">00:00.00</div>
        <div class="hud__keys">shift sprint&ensp;·&ensp;space jump&ensp;·&ensp;r restart&ensp;·&ensp;esc pause</div>
        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <section class="screen" data-el="pause">
        <div class="panel glass">
          <div class="panel__title">Paused</div>
          <div class="panel__meta" data-el="pauseMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="resume">Resume</button>
            <button class="btn" data-el="restartLevel">Restart level</button>
          </div>
        </div>
      </section>

      <section class="screen" data-el="complete">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker"></div>
          <div class="panel__title">Level Complete</div>
          <div class="panel__meta" data-el="completeMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="continue">Continue →</button>
          </div>
        </div>
      </section>

      <section class="screen" data-el="end">
        <div class="panel glass">
          <div class="kicker">All monuments traversed</div>
          <div class="panel__title">The End</div>
          <div class="panel__meta" data-el="endMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="again">Play again</button>
          </div>
        </div>
      </section>

      <div class="bar bar--top"></div>
      <div class="bar bar--bottom"></div>
      <div class="veil" data-el="veil"></div>
    `,this.el={};for(const t of e.querySelectorAll("[data-el]"))this.el[t.dataset.el]=t;this.bars=e.querySelectorAll(".bar")}showStart(){const e=this.root.querySelector('[data-el="start"]');p.set(e,{autoAlpha:1}),p.from(e.querySelectorAll(".kicker, .title, .subtitle, .prompt, .controls-hint"),{y:34,autoAlpha:0,duration:1.1,stagger:.09,ease:"expo.out",delay:.15})}hideStart(){return p.to(this.el.start,{autoAlpha:0,duration:.7,ease:"power2.inOut"})}showHUD(e,t,s){this.el.levelNum.textContent=`LEVEL ${String(e+1).padStart(2,"0")} / ${String(t).padStart(2,"0")}`,this.el.levelName.textContent=s,p.set(this.el.hud,{visibility:"visible"}),p.fromTo([this.el.hud.querySelector(".hud__level"),this.el.hud.querySelector(".hud__timer"),this.el.hud.querySelector(".hud__keys")],{y:-18,autoAlpha:0},{y:0,autoAlpha:1,duration:.9,stagger:.12,ease:"expo.out"})}hideHUD(){p.to(this.el.hud,{autoAlpha:0,duration:.4,onComplete:()=>p.set(this.el.hud,{visibility:"hidden",opacity:1})})}setTimer(e){this.el.timer.textContent=ye(e)}toast(e,t=1.6){const s=this.el.toast;s.textContent=e,p.timeline().fromTo(s,{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.45,ease:"expo.out"}).to(s,{autoAlpha:0,y:-10,duration:.5,ease:"power2.in"},`+=${t}`)}showPause(e){this.el.pauseMeta.textContent=e,p.fromTo(this.el.pause,{autoAlpha:0},{autoAlpha:1,duration:.35}),p.fromTo(this.el.pause.querySelector(".panel"),{scale:.94,y:16},{scale:1,y:0,duration:.5,ease:"expo.out"})}hidePause(){return p.to(this.el.pause,{autoAlpha:0,duration:.3})}showComplete(e,t){this.el.completeKicker.textContent=e,this.el.completeMeta.textContent=`Time — ${ye(t)}`,p.fromTo(this.el.complete,{autoAlpha:0},{autoAlpha:1,duration:.6,delay:.7}),p.fromTo(this.el.complete.querySelector(".panel"),{scale:.92,y:24},{scale:1,y:0,duration:.9,delay:.7,ease:"expo.out"})}hideComplete(){return p.to(this.el.complete,{autoAlpha:0,duration:.4})}showEnd(e){this.el.endMeta.textContent=`Total time — ${ye(e)}`,p.fromTo(this.el.end,{autoAlpha:0},{autoAlpha:1,duration:.8,delay:.6})}hideEnd(){return p.to(this.el.end,{autoAlpha:0,duration:.4})}letterbox(e){p.to(this.bars,{height:e?"7vh":0,duration:.9,ease:"power3.inOut"})}async veilTransition(e){await p.to(this.el.veil,{autoAlpha:1,duration:.55,ease:"power2.in"}),await e?.(),await p.to(this.el.veil,{autoAlpha:0,duration:.8,ease:"power2.out"})}onClick(e,t){this.el[e].addEventListener("click",t)}}const P=[{name:"Atrium",accent:10217727,palette:{top:5227519,horizon:1718886,fog:263692,sunColor:14675967,sunIntensity:3.2},spawn:[0,1.5,0],objects:[{type:"platform",pos:[0,-.5,0],size:[10,1,10],mat:"concrete",skirtDepth:8},{type:"pillar",pos:[4.2,2,4.2],size:[.7,5,.7],mat:"marble",solid:!0},{type:"pillar",pos:[-4.2,2,4.2],size:[.7,5,.7],mat:"marble",solid:!0},{type:"pillar",pos:[0,4.75,4.2],size:[9.2,.5,.7],mat:"marble"},{type:"platform",pos:[0,-.5,-10],size:[4,1,8],mat:"concrete"},{type:"platform",pos:[0,-.5,-19.5],size:[4,1,5],mat:"marble"},{type:"ramp",pos:[0,.5,-27],size:[4,1,7.3],rot:[.29,0,0],mat:"concrete"},{type:"platform",pos:[0,1.5,-34],size:[6,1,6],mat:"concrete"},{type:"pad",pos:[1.8,2.08,-34],targets:["g1"]},{type:"gate",pos:[0,3.75,-37.2],size:[4,3.5],id:"g1"},{type:"platform",pos:[0,1.5,-41.5],size:[4,1,8],mat:"concrete"},{type:"checkpoint",pos:[0,2.07,-40]},{type:"slider",pos:[3,1.5,-49],to:[-3,1.5,-49],size:[3.5,1,3.5],duration:2.6,mat:"metal"},{type:"platform",pos:[0,1.5,-56.5],size:[8,1,8],mat:"marble",skirtDepth:9},{type:"checkpoint",pos:[2.2,2.07,-55]},{type:"wormhole",a:[0,3.7,-57.5],b:[14,9.7,-68.8]},{type:"platform",pos:[14,7.5,-72],size:[8,1,8],mat:"marble",skirtDepth:14},{type:"portal",pos:[14,10,-74.5]},{type:"blackhole",pos:[-38,16,-88],scale:4,spin:.6},{type:"decor",pos:[8,4,-20],size:[3,.3,2],mat:"glass"},{type:"decor",pos:[-7,5.5,-34],size:[2.5,.3,2.5],mat:"glass"},{type:"decor",pos:[6.5,6,-50],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[-9,2.5,-13],size:[1.2,7,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[10,3,-44],size:[1,5.5,1],mat:"basalt",drift:.5}]},{name:"Suspension",accent:16761991,palette:{top:16756838,horizon:5842460,fog:525317,sunColor:16767408,sunIntensity:2.7},spawn:[0,1.5,0],objects:[{type:"platform",pos:[0,-.5,0],size:[8,1,8],mat:"concrete",skirtDepth:8},{type:"rotator",pos:[10,-.5,0],size:[7,1,2.5],axis:"y",duration:5,mat:"metal"},{type:"platform",pos:[17.5,-.5,0],size:[4,1,4],mat:"marble"},{type:"checkpoint",pos:[17.5,.07,0]},{type:"elevator",pos:[23.5,-.5,0],to:[23.5,4.5,0],size:[3.5,1,3.5],duration:3,repeatDelay:.8,mat:"metal"},{type:"platform",pos:[29.5,4.5,0],size:[5,1,5],mat:"concrete",skirtDepth:11},{type:"slider",pos:[36,4.5,-4],to:[36,4.5,4],size:[3,1,3],duration:2.4,mat:"metal"},{type:"platform",pos:[42,4.5,0],size:[4,1,4],mat:"marble",skirtDepth:11},{type:"checkpoint",pos:[42,5.07,0]},{type:"platform",pos:[42,4.5,7],size:[3,1,3],mat:"concrete",skirtDepth:11},{type:"pad",pos:[42,5.08,7],targets:["g2"]},{type:"gate",pos:[46.5,6.75,0],size:[3.5,3.5],yaw:Math.PI/2,id:"g2"},{type:"platform",pos:[49.5,4.5,0],size:[7,1,3],mat:"metal"},{type:"platform",pos:[56,4.5,0],size:[2,1,2],mat:"marble"},{type:"platform",pos:[59.5,4.5,2.5],size:[2,1,2],mat:"marble"},{type:"platform",pos:[63,4.5,0],size:[2,1,2],mat:"marble"},{type:"blackhole",pos:[59.5,8,-9.5],scale:1.5,pull:!0,radius:10.5,strength:26},{type:"platform",pos:[69,4.5,0],size:[8,1,8],mat:"marble",skirtDepth:12},{type:"portal",pos:[69,6.9,0],yaw:Math.PI/2},{type:"blackhole",pos:[30,28,-75],scale:5,spin:.5,color:16752720},{type:"decor",pos:[12,4,8],size:[3.2,.3,2],mat:"glass"},{type:"decor",pos:[30,9,-7],size:[2.6,.3,2.6],mat:"glass"},{type:"decor",pos:[52,9.5,6],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[24,2,-9],size:[1.2,8,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[60,6,-8],size:[1,6,1],mat:"basalt",drift:.5},{type:"decor",pos:[8,7,-10],size:[1.4,9,1.4],mat:"basalt",drift:.3}]},{name:"Metronome",accent:13215487,palette:{top:12681215,horizon:2366029,fog:394256,sunColor:15261183,sunIntensity:2.4},spawn:[0,1.5,0],objects:[{type:"platform",pos:[0,-.5,0],size:[8,1,8],mat:"concrete",skirtDepth:8},{type:"platform",pos:[0,-.5,-14],size:[6,1,18],mat:"concrete",skirtDepth:10},{type:"slider",pos:[-1.6,1.5,-10],to:[1.6,1.5,-10],size:[2.8,3,.8],duration:1.7,mat:"metal"},{type:"slider",pos:[1.6,1.5,-17],to:[-1.6,1.5,-17],size:[2.8,3,.8],duration:1.7,delay:.85,mat:"metal"},{type:"checkpoint",pos:[0,.07,-21.5]},{type:"platform",pos:[0,-.5,-28],size:[7,1,7],mat:"marble"},{type:"rotator",pos:[0,.9,-28],size:[7.5,.7,.7],axis:"y",duration:3.4,mat:"metal"},{type:"platform",pos:[0,-.5,-41.5],size:[6,1,6],mat:"concrete",skirtDepth:10},{type:"checkpoint",pos:[0,.07,-41.5]},{type:"platform",pos:[0,-.5,-52],size:[3,1,14],mat:"metal",skirt:!1},{type:"pendulum",pos:[0,4.6,-49],length:4,swing:.85,duration:1.5,mat:"chrome"},{type:"pendulum",pos:[0,4.6,-55],length:4,swing:.85,duration:1.5,delay:.75,mat:"chrome"},{type:"platform",pos:[0,-.5,-62],size:[5,1,5],mat:"concrete",skirtDepth:10},{type:"checkpoint",pos:[-1.2,.07,-62]},{type:"pad",pos:[1.3,.08,-62],targets:["lift"]},{type:"elevator",pos:[0,-.5,-69.5],to:[0,7.5,-69.5],size:[3.5,1,3.5],duration:3.5,repeatDelay:1,triggerId:"lift",mat:"metal"},{type:"platform",pos:[0,7.5,-76.5],size:[8,1,8],mat:"marble",skirtDepth:16},{type:"portal",pos:[0,9.9,-77.5]},{type:"blackhole",pos:[-30,24,-100],scale:7,spin:.4,color:13215487},{type:"decor",pos:[7,3,-18],size:[3,.3,2],mat:"glass"},{type:"decor",pos:[-7.5,5,-34],size:[2.6,.3,2.6],mat:"glass"},{type:"decor",pos:[6,8,-60],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[-8,4,-50],size:[1.2,9,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[9,10,-74],size:[1.3,7,1.3],mat:"basalt",drift:.5}]}];class jt{constructor(e,t){this.state="start",this.levelIndex=0,this.levelTime=0,this.totalTime=0,this.engine=new Mt(e),this.materials=new Ct,this.physics=new St(T.physics),this.world=new At(this.engine.scene,this.physics,this.materials),this.input=new Bt(e),this.player=new Rt({scene:this.engine.scene,physics:this.physics,input:this.input,materials:this.materials}),this.rig=new Et(this.engine.camera,this.input),this.lighting=new Ft(this.engine),this.bursts=new It(this.engine.scene),this.motes=new Ot(this.engine.scene,T.fx.ambientMotes),this.audio=new Vt,this.ui=new Ht(t),this._wireEvents(),this.engine.onTick((s,i)=>this._tick(s,i))}boot(){this._loadLevel(0,{instant:!0}),this.player.frozen=!0,this.rig.orbit(this.player.position,{dist:16,h:8}),this.ui.showStart(),this.engine.start()}start(){this.state==="start"&&this._begin()}_wireEvents(){this.player.onJump=()=>this.audio.jump(),this.player.onLand=e=>{const t=Math.min(1,e/22);this.audio.land(t),this.bursts.emit(this.player.position.clone().setY(this.player.position.y-T.player.radius*.8),Math.round(6+t*14),{color:new y(12173510),speed:2.5+t*3,up:1.2,life:.8})},this.player.onFall=()=>{this.audio.fall(),this.ui.toast("Warped to checkpoint"),this.player.respawn(),this.audio.warp(),this.bursts.emit(this.player.spawn,20,{color:new y(16767392),speed:3,up:2.2,spread:1.4,life:1.1}),this.rig.snapTo(this.player.position,this.rig.yaw)},this.world.onCheckpoint=e=>{this.player.setSpawn(e),this.audio.checkpoint(),this.ui.toast("Checkpoint"),this.bursts.emit(e,16,{color:new y(16767392),speed:2.2,up:3,life:1.1})},this.world.onPad=e=>{this.audio.pad(),this.bursts.emit(e,12,{color:new y(this.world.accent),speed:2,up:2.4,life:.9})},this.world.onGateOpen=e=>{this.audio.gate(),this.ui.toast("Gate unlocked"),this.bursts.emit(e,24,{color:new y(this.world.accent),speed:3.4,up:1.6,spread:2,life:1.2})},this.world.onPortal=()=>this._completeLevel(),this.world.onWormhole=({pos:e,from:t})=>this._warp(e,t),this.input.on("confirm",()=>{this.state==="start"?this._begin():this.state==="complete"?this._continue():this.state==="end"&&this._replay()}),this.input.on("pause",()=>{this.state==="pause"&&this._resume()}),this.input.on("unlock",()=>{this.state==="play"&&this._pause()}),this.input.on("restart",()=>{this.state==="play"&&this._restartLevel()}),this.input.on("mute",()=>{const e=this.audio.toggleMute();e!==void 0&&this.ui.toast(e?"Audio muted":"Audio on")}),this.ui.onClick("begin",()=>this.state==="start"&&this._begin()),this.ui.onClick("resume",()=>this._resume()),this.ui.onClick("restartLevel",()=>{this.ui.hidePause(),this._restartLevel()}),this.ui.onClick("continue",()=>this.state==="complete"&&this._continue()),this.ui.onClick("again",()=>this.state==="end"&&this._replay()),this.engine.canvas.addEventListener("click",()=>{this.state==="play"&&this.input.lockPointer()})}async _begin(){this.state="intro",this.audio.init(),this.audio.click(),this.ui.hideStart(),this.ui.letterbox(!0),this.rig.endOrbit(),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,P.length,P[this.levelIndex].name)}_enterPlay(){this.state="play",this.player.frozen=!1,this.player.paused=!1,this.input.enabled=!0,this.input.lockPointer(),this.rig.snapTo(this.player.position,this.rig.yaw)}_pause(){this.state="pause",this.player.frozen=!0,this.player.paused=!0,this.input.enabled=!1,this.input.unlockPointer();for(const e of this.world.tweens)e.pause();this.ui.showPause(`Level ${this.levelIndex+1} — ${P[this.levelIndex].name}`)}_resume(){if(this.state==="pause"){this.audio.click(),this.ui.hidePause();for(const e of this.world.tweens)e.resume();this._enterPlay()}}async _restartLevel(){this.audio.click(),this.state="transition",this.input.enabled=!1,await this.ui.veilTransition(()=>{this._loadLevel(this.levelIndex,{instant:!0})}),this._enterPlay()}_warp(e,t){if(this.state!=="play"||this._warpBlocked)return;this._warpBlocked=!0,this.audio.warp();const s=new y(9175001);this.bursts.emit(t,22,{color:s,speed:3.5,up:2,spread:1.6,life:1.1}),this.player.body.position.copy(e),this.player.mesh.position.copy(e),this.rig.snapTo(e,this.rig.yaw),this.lighting.follow(e),this.bursts.emit(e,22,{color:s,speed:3.5,up:2,spread:1.6,life:1.1}),p.fromTo(this.player.mesh.scale,{x:.3,y:.3,z:.3},{x:1,y:1,z:1,duration:.5,ease:"back.out(2)",overwrite:"auto"})}_completeLevel(){if(this.state!=="play")return;this.state="complete",this.totalTime+=this.levelTime,this.player.frozen=!0,this.input.enabled=!1,this.input.unlockPointer(),this.audio.portal(),this.ui.hideHUD(),this.ui.letterbox(!0),this.rig.orbit(this.player.position),this.world.portalPos&&this.bursts.emit(this.world.portalPos,40,{color:new y(this.world.accent),speed:4,up:2.5,spread:2,life:1.6}),this.levelIndex>=P.length-1?(this.state="end",this.ui.showEnd(this.totalTime)):this.ui.showComplete(P[this.levelIndex].name,this.levelTime)}async _continue(){this.audio.click(),this.state="transition",this.ui.hideComplete(),this.rig.endOrbit(),await this.ui.veilTransition(()=>{this._loadLevel(this.levelIndex+1,{instant:!0})}),this.ui.letterbox(!0),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,P.length,P[this.levelIndex].name)}async _replay(){this.audio.click(),this.state="transition",this.ui.hideEnd(),this.rig.endOrbit(),this.totalTime=0,await this.ui.veilTransition(()=>{this._loadLevel(0,{instant:!0})}),this.ui.letterbox(!0),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,P.length,P[this.levelIndex].name)}_loadLevel(e,{instant:t=!1}={}){this.levelIndex=e,this.levelTime=0;const s=P[e],{spawn:i}=this.world.load(s);this.player.setSpawn(i),this.player.respawn(),this.lighting.transitionTo(s.palette,t?.01:1.6),this.lighting.follow(this.player.position)}_tick(e,t){this.state==="play"&&(this.levelTime+=e,this.ui.setTimer(this.levelTime)),this._warpBlocked&&(this._warpBlocked=this.world.wormholeMouths.some(i=>i.distanceToSquared(this.player.position)<2.2*2.2)),this.materials.update(t),this.world.update(),this.player.update(e,this.world.solids),this.rig.update(e,this.player,this.world.solids),this.lighting.follow(this.player.position),this.bursts.update(t),this.motes.update(t,this.player.position),this.world.portalPos&&Math.random()<e*3&&this.bursts.emit(this.world.portalPos,1,{color:new y(this.world.accent),speed:.8,up:.8,spread:1.6,life:1.4,size:1})}}const qt=document.getElementById("game-canvas"),Wt=document.getElementById("ui-root"),$e=new jt(qt,Wt);$e.boot();new URLSearchParams(location.search).has("autostart")&&setTimeout(()=>$e.start(),400);
