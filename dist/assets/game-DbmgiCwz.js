import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as m}from"./gsap-xgxdCp6f.js";import{g as S,X as pe,j as A,o as le,Q as he,x as Ke,k as qe,f as y,i as f,Y as B,Z as ae,_ as Je,C as Ze,$ as et,a0 as tt,a1 as st,a2 as it,A as We,a3 as at,a4 as ot,a5 as rt,W as nt,d as lt,a as ht,S as Qe,P as ct,a6 as Q,a7 as O,v as q,a8 as Ae,B as Ce,J as F,a9 as ce,M as v,aa as N,ab as L,ac as V,ad as ge,ae as ut,af as Pe,ag as De,ah as Me,ai as pt,R as $e,aj as mt,ak as dt,u as ft,al as gt,am as vt,an as Ye}from"./three-BzdxjjEz.js";import{P as X,F as ze}from"./r3f-D8lLlS5y.js";const ue={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class yt extends X{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof S?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=pe.clone(e.uniforms),this.material=new S({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ze(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Re extends X{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const i=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,n;this.inverse?(r=0,n=1):(r=1,n=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),a.buffers.stencil.setFunc(i.ALWAYS,r,4294967295),a.buffers.stencil.setClear(n),a.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(i.EQUAL,1,4294967295),a.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),a.buffers.stencil.setLocked(!0)}}class wt extends X{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class bt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new A);this._width=s.width,this._height=s.height,t=new le(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:he}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new yt(ue),this.copyPass.material.blending=Ke,this.clock=new qe}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let i=0,a=this.passes.length;i<a;i++){const r=this.passes[i];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),r.needsSwap){if(s){const n=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}Re!==void 0&&(r instanceof Re?s=!0:r instanceof wt&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new A);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(s,i),this.renderTarget2.setSize(s,i);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(s,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class xt extends X{constructor(e,t,s=null,i=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=i,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new y}render(e,t,s){const i=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=i}}const _t={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new y(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class $ extends X{constructor(e,t=1,s,i){super(),this.strength=t,this.radius=s,this.threshold=i,this.resolution=e!==void 0?new A(e.x,e.y):new A(256,256),this.clearColor=new y(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new le(a,r,{type:he}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new le(a,r,{type:he});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const g=new le(a,r,{type:he});g.texture.name="UnrealBloomPass.v"+h,g.texture.generateMipmaps=!1,this.renderTargetsVertical.push(g),a=Math.round(a/2),r=Math.round(r/2)}const n=_t;this.highPassUniforms=pe.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new S({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new A(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new f(1,1,1),new f(1,1,1),new f(1,1,1),new f(1,1,1),new f(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=pe.clone(ue.uniforms),this.blendMaterial=new S({uniforms:this.copyUniforms,vertexShader:ue.vertexShader,fragmentShader:ue.fragmentShader,blending:B,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new y,this._oldClearAlpha=1,this._basic=new ae,this._fsQuad=new ze(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let s=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(s,i);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(s,i),this.renderTargetsVertical[a].setSize(s,i),this.separableBlurMaterials[a].uniforms.invSize.value=new A(1/s,1/i),s=Math.round(s/2),i=Math.round(i/2)}render(e,t,s,i,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=s.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let n=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[l].uniforms.direction.value=$.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=$.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),n=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[];for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new S({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new A(.5,.5)},direction:{value:new A(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}$.BlurDirectionX=new A(1,0);$.BlurDirectionY=new A(0,1);const re={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Mt extends X{constructor(){super(),this.uniforms=pe.clone(re.uniforms),this.material=new Je({name:re.name,uniforms:this.uniforms,vertexShader:re.vertexShader,fragmentShader:re.fragmentShader}),this._fsQuad=new ze(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ze.getTransfer(this._outputColorSpace)===et&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===tt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===st?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===it?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===We?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===at?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ot?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===rt&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const z={renderer:{maxPixelRatio:2,shadowMapSize:2048,bloom:{strength:.55,radius:.75,threshold:.82},adaptive:{targetFPS:58,minScale:.65,maxScale:1}},physics:{gravity:34,killPlaneY:-24,maxDelta:1/30},player:{radius:.55,accel:46,airControl:.35,maxSpeed:8.5,sprintSpeed:13.5,groundFriction:7.5,airDrag:.35,jumpVelocity:13.2,coyoteTime:.12,jumpBuffer:.12},camera:{fov:55,sprintFov:63,distance:8.2,height:3.1,minPitch:-.18,maxPitch:1.15,followLerp:9,lookAhead:1.6,zoomBySpeed:1.8,collisionRadius:.35,sensitivity:.0024},fx:{landDustMin:4,ambientMotes:260}};class St{constructor(e){this.canvas=e,this.renderer=new nt({canvas:e,antialias:!0,powerPreference:"high-performance",stencil:!1}),this.renderer.toneMapping=We,this.renderer.toneMappingExposure=1.05,this.renderer.outputColorSpace=lt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ht,this.scene=new Qe,this.camera=new ct(z.camera.fov,innerWidth/innerHeight,.1,600);const{bloom:t}=z.renderer;this.composer=new bt(this.renderer),this.composer.addPass(new xt(this.scene,this.camera)),this.bloomPass=new $(new A(innerWidth,innerHeight),t.strength,t.radius,t.threshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new Mt),this.resScale=1,this._fpsSamples=[],this.clock=new qe,this.elapsed=0,this.updaters=new Set,this._running=!1,addEventListener("resize",()=>this._applySize()),this._applySize()}onTick(e){return this.updaters.add(e),()=>this.updaters.delete(e)}start(){this._running||(this._running=!0,this.clock.start(),this.renderer.setAnimationLoop(()=>this._frame()))}stop(){this._running=!1,this.renderer.setAnimationLoop(null)}_frame(){const e=Math.min(this.clock.getDelta(),z.physics.maxDelta);this.elapsed+=e;for(const t of this.updaters)t(e,this.elapsed);this.composer.render(),this._adapt(e)}_adapt(e){const{targetFPS:t,minScale:s,maxScale:i}=z.renderer.adaptive;if(this._fpsSamples.push(1/Math.max(e,1e-4)),this._fpsSamples.length<45)return;const a=this._fpsSamples.reduce((n,l)=>n+l,0)/this._fpsSamples.length;this._fpsSamples.length=0;let r=this.resScale;a<t-6?r=Math.max(s,this.resScale-.1):a>t+4&&(r=Math.min(i,this.resScale+.05)),r!==this.resScale&&(this.resScale=r,this._applySize())}_applySize(){const e=Math.min(devicePixelRatio,z.renderer.maxPixelRatio)*this.resScale;this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setPixelRatio(e),this.renderer.setSize(innerWidth,innerHeight),this.composer.setPixelRatio(e),this.composer.setSize(innerWidth,innerHeight)}}const M=new f,Ee=new f,I=new f,U=new f,ve=new Q,ye=new f,we=new f;class me{constructor(e,t={}){this.half=e.clone(),this.mesh=t.mesh??null,this.id=t.id??null,this.hazard=t.hazard??!1,this.enabled=!0,this.center=new f,this.quaternion=new Q,this.prevCenter=new f,this.prevQuaternion=new Q,this.mesh&&this.syncFromMesh(!0)}setStatic(e,t){return this.center.copy(e),t&&this.quaternion.copy(t),this.prevCenter.copy(this.center),this.prevQuaternion.copy(this.quaternion),this}syncFromMesh(e=!1){this.prevCenter.copy(e?this.mesh.getWorldPosition(M):this.center),this.prevQuaternion.copy(e?this.mesh.getWorldQuaternion(ve):this.quaternion),this.mesh.updateWorldMatrix(!0,!1),this.mesh.matrixWorld.decompose(this.center,this.quaternion,M.set(1,1,1))}yawDelta(){return ye.set(1,0,0).applyQuaternion(this.quaternion),we.set(1,0,0).applyQuaternion(this.prevQuaternion),Math.atan2(ye.z,ye.x)-Math.atan2(we.z,we.x)}resolveSphere(e,t){if(!this.enabled)return null;ve.copy(this.quaternion).invert(),M.copy(e).sub(this.center).applyQuaternion(ve),Ee.set(Math.max(-this.half.x,Math.min(this.half.x,M.x)),Math.max(-this.half.y,Math.min(this.half.y,M.y)),Math.max(-this.half.z,Math.min(this.half.z,M.z))),I.copy(M).sub(Ee);const s=I.lengthSq();if(s>t*t)return null;let i;if(s>1e-10){const a=Math.sqrt(s);U.copy(I).divideScalar(a),i=t-a}else{const a=this.half.x-Math.abs(M.x),r=this.half.y-Math.abs(M.y),n=this.half.z-Math.abs(M.z);a<r&&a<n?(U.set(Math.sign(M.x)||1,0,0),i=a+t):r<n?(U.set(0,Math.sign(M.y)||1,0),i=r+t):(U.set(0,0,Math.sign(M.z)||1),i=n+t)}return U.applyQuaternion(this.quaternion),e.addScaledVector(U,i),U.clone()}}class J{constructor(e,t,s,{once:i=!0}={}){this.position=e.clone(),this.radius=t,this.onEnter=s,this.once=i,this.fired=!1,this.enabled=!0}test(e,t){if(!this.enabled||this.once&&this.fired)return;const s=this.radius+t;e.distanceToSquared(this.position)<s*s&&(this.fired=!0,this.onEnter())}}class Tt{constructor(e){this.gravity=e.gravity,this.killPlaneY=e.killPlaneY,this.colliders=[],this.triggers=[],this.attractors=[]}clear(){this.colliders.length=0,this.triggers.length=0,this.attractors.length=0}addCollider(e){return this.colliders.push(e),e}addTrigger(e){return this.triggers.push(e),e}addAttractor(e){return this.attractors.push(e),e}getCollider(e){return this.colliders.find(t=>t.id===e)??null}syncDynamics(){for(const e of this.colliders)e.mesh&&e.syncFromMesh()}step(e,t){const s=e.groundCollider;if(e.grounded&&s&&s.mesh){I.copy(s.center).sub(s.prevCenter),e.position.add(I);const a=s.yawDelta();Math.abs(a)>1e-6&&(M.copy(e.position).sub(s.center),M.applyAxisAngle(U.set(0,1,0),a),e.position.copy(s.center).add(M))}e.velocity.y-=this.gravity*t;for(const a of this.attractors){I.copy(a.position).sub(e.position);const r=I.length();if(r<a.killRadius)return!0;if(r<a.radius){const n=a.strength*(1-r/a.radius);e.velocity.addScaledVector(I.normalize(),n*t)}}e.position.addScaledVector(e.velocity,t),e.grounded=!1,e.groundCollider=null,e.groundNormal=null;let i=!1;for(let a=0;a<2;a++)for(const r of this.colliders){const n=r.resolveSphere(e.position,e.radius);if(!n)continue;if(r.hazard){i=!0;continue}const l=e.velocity.dot(n);l<0&&e.velocity.addScaledVector(n,-l),n.y>.55&&(e.grounded=!0,e.groundCollider=r,e.groundNormal=n)}for(const a of this.triggers)a.test(e.position,e.radius);return i||e.position.y<this.killPlaneY}}const oe=`
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
`,ke=`
  float mFresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(clamp(1.0 - dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
  }
`,Ct=`
  vec3 mGradient(vec3 a, vec3 b, float t) {
    return mix(a, b, smoothstep(0.0, 1.0, t));
  }
`,Be={vertex:`
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
    ${oe}
    ${ke}
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
  `},de={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${oe}
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
  `},Fe={vertex:de.vertex,fragment:`
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
  `},Ue={vertex:`
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
    ${ke}
    ${Ct}
    void main() {
      float fade = pow(1.0 - vUv.y, 1.6);                 // dissolve toward the top
      float fres = 1.0 - mFresnel(vNormal, vViewDir, 0.7); // brightest at grazing center
      float flicker = 0.9 + 0.1 * sin(uTime * 3.0 + vUv.y * 10.0);
      float a = fade * fres * flicker * mix(0.18, 0.65, uLit);
      vec3 col = mGradient(uColor, vec3(1.0), vUv.y * 0.4 + uLit * 0.2);
      gl_FragColor = vec4(col * 1.4, a);
    }
  `},Le={vertex:`
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
    ${oe}

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

      /* pitch-black vault, faint tint upward, void below */
      vec3 col = vec3(0.003, 0.0025, 0.002)
               + uTop * pow(clamp(d.y, 0.0, 1.0), 1.4) * 0.16
               + uGround * max(0.0, -d.y) * 0.1;

      /* warm dust haze hugging the horizon — thin, so the black stays black */
      float hz = exp(-abs(d.y + 0.03) * 4.4);
      col += uHorizon * hz * (0.16 + 0.07 * mFbm(d * 3.0 + vec3(5.0)));

      /* golden sun: hot core, restrained cinematic bloom */
      float sun = clamp(dot(d, normalize(uSunDir)), 0.0, 1.0);
      col += uSunColor * (pow(sun, 700.0) * 3.2 + pow(sun, 10.0) * 0.2 + pow(sun, 2.4) * 0.05);

      /* sparse dim stars, swallowed by the haze near the horizon */
      float s1 = starLayer(d, 110.0, 0.996);
      col += vec3(0.8, 0.82, 0.9) * s1 * 0.5 * smoothstep(0.08, 0.4, d.y);

      /* break up the black so it never posterizes */
      col += (mFbm(d * 3.0) - 0.5) * 0.006;

      gl_FragColor = vec4(col, 1.0);
    }
  `},Ie={vertex:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragment:`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    ${oe}
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
  `},Ge={vertex:`
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
    ${ke}
    void main() {
      float fres = mFresnel(vNormal, vViewDir, 2.6);
      gl_FragColor = vec4(uColor * 1.6, fres * 0.85);
    }
  `},Ne={vertex:de.vertex,fragment:`
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float r = length(vUv - 0.5) * 2.0;
      float a = pow(smoothstep(1.0, 0.0, r), 2.2) * uStrength;
      gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    }
  `};function H(o,e,t,s=""){return o.onBeforeCompile=i=>{i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMonPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vMonPos;
${oe}`).replace("#include <color_fragment>",`#include <color_fragment>
{ vec3 wp = vMonPos; ${t} }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
{ vec3 wp = vMonPos; ${s} }`)},o.customProgramCacheKey=()=>e,o}class zt{constructor(){this.cache=new Map,this.animated=[]}concrete(){return this._get("concrete",()=>{const e=new O({color:3356219,roughness:.9,metalness:0,envMapIntensity:.55});return H(e,"mon-concrete",`
        float patches = mFbm(wp * 0.33);
        float speckle = mNoise(wp * 14.0);
        float pores = smoothstep(0.72, 0.95, mNoise(wp * 7.0));
        diffuseColor.rgb *= 0.88 + patches * 0.22 + speckle * 0.06 - pores * 0.10;
      `,`
        roughnessFactor = clamp(roughnessFactor - mFbm(wp * 0.5) * 0.12, 0.0, 1.0);
      `)})}marble(){return this._get("marble",()=>{const e=new O({color:2829875,roughness:.3,metalness:0,envMapIntensity:.9,clearcoat:.45,clearcoatRoughness:.25});return H(e,"mon-marble",`
        float vein = mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6);
        float veins = smoothstep(0.16, 0.02, vein);
        float tone = mFbm(wp * 0.8) * 0.04;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.5, 0.48, 0.44), veins * 0.4);
        diffuseColor.rgb += tone;
      `,`
        float vv = smoothstep(0.16, 0.02, mRidge(wp * 0.55 + mFbm(wp * 0.25) * 1.6));
        roughnessFactor = clamp(roughnessFactor + vv * 0.25, 0.0, 1.0);
      `)})}metal(){return this._get("metal",()=>{const e=new O({color:4869974,roughness:.36,metalness:1,envMapIntensity:1.05});return H(e,"mon-metal",`
        float brush = mNoise(wp * vec3(0.35, 22.0, 22.0));
        diffuseColor.rgb *= 0.92 + brush * 0.12;
      `,`
        float streak = mNoise(wp * vec3(0.35, 22.0, 22.0));
        roughnessFactor = clamp(roughnessFactor + (streak - 0.5) * 0.22, 0.05, 1.0);
      `)})}chrome(){return this._get("chrome",()=>{const e=new O({color:1776929,roughness:.1,metalness:1,envMapIntensity:1.5,clearcoat:1,clearcoatRoughness:.05});return H(e,"mon-chrome",`
        diffuseColor.rgb *= 0.985 + mNoise(wp * 40.0) * 0.03;
      `)})}glass(){return this._get("glass",()=>{const e=new O({color:2237994,roughness:.5,metalness:0,envMapIntensity:1.2,transparent:!0,opacity:.4,side:q,depthWrite:!1});return H(e,"mon-glass",`
        diffuseColor.rgb += (mFbm(wp * 2.0) - 0.5) * 0.05;
      `,`
        roughnessFactor = clamp(roughnessFactor + (mNoise(wp * 6.0) - 0.5) * 0.2, 0.2, 1.0);
      `)})}basalt(){return this._get("basalt",()=>{const e=new O({color:1711135,roughness:.88,metalness:.1,envMapIntensity:.35});return H(e,"mon-basalt",`
        diffuseColor.rgb *= 0.85 + mFbm(wp * 0.6) * 0.3;
      `)})}gold(){return this._get("gold",()=>new Ae({color:1313539,emissive:new y(16758627),emissiveIntensity:2.6,roughness:.4,metalness:.2}))}laserBeam(){return this._get("laser",()=>new Ae({color:1704706,emissive:new y(16721432),emissiveIntensity:3.4,roughness:.5,metalness:0}))}gate(e=10217727){const t=new S({vertexShader:Be.vertex,fragmentShader:Be.fragment,uniforms:{uTime:{value:0},uOpen:{value:0},uColor:{value:new y(e)}},transparent:!0,side:q,depthWrite:!1,blending:B});return this.animated.push(t),t}portal(e=10217727){const t=new S({vertexShader:de.vertex,fragmentShader:de.fragment,uniforms:{uTime:{value:0},uColor:{value:new y(e)}},transparent:!0,side:q,depthWrite:!1,blending:B});return this.animated.push(t),t}pad(e=10217727){const t=new S({vertexShader:Fe.vertex,fragmentShader:Fe.fragment,uniforms:{uTime:{value:0},uActive:{value:0},uColor:{value:new y(e)}},transparent:!0,depthWrite:!1,blending:B});return this.animated.push(t),t}beacon(e=16767392){const t=new S({vertexShader:Ue.vertex,fragmentShader:Ue.fragment,uniforms:{uTime:{value:0},uLit:{value:0},uColor:{value:new y(e)}},transparent:!0,side:q,depthWrite:!1,blending:B});return this.animated.push(t),t}blackholeDisk(e=16757867){const t=new S({vertexShader:Ie.vertex,fragmentShader:Ie.fragment,uniforms:{uTime:{value:0},uColor:{value:new y(e)}},transparent:!0,side:q,depthWrite:!1,blending:B});return this.animated.push(t),t}halo(e=10471679){return new S({vertexShader:Ge.vertex,fragmentShader:Ge.fragment,uniforms:{uColor:{value:new y(e)}},transparent:!0,depthWrite:!1,blending:B})}contactShadow(){return new S({vertexShader:Ne.vertex,fragmentShader:Ne.fragment,uniforms:{uStrength:{value:.55}},transparent:!0,depthWrite:!1})}update(e){for(const t of this.animated)t.uniforms.uTime.value=e}dispose(){for(const e of this.cache.values())e.dispose();for(const e of this.animated)e.dispose();this.cache.clear(),this.animated.length=0}_get(e,t){return this.cache.has(e)||this.cache.set(e,t()),this.cache.get(e)}}function kt(o,e=!1){const t=o[0].index!==null,s=new Set(Object.keys(o[0].attributes)),i=new Set(Object.keys(o[0].morphAttributes)),a={},r={},n=o[0].morphTargetsRelative,l=new Ce;let c=0;for(let h=0;h<o.length;++h){const u=o[h];let g=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.attributes[p]),g++}if(g!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(n!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(t){let h=0;const u=[];for(let g=0;g<o.length;++g){const p=o[g].index;for(let w=0;w<p.count;++w)u.push(p.getX(w)+h);h+=o[g].attributes.position.count}l.setIndex(u)}for(const h in a){const u=Oe(a[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in r){const u=r[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let g=0;g<u;++g){const p=[];for(let d=0;d<r[h].length;++d)p.push(r[h][d][g]);const w=Oe(p);if(!w)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(w)}}return l}function Oe(o){let e,t,s,i=-1,a=0;for(let c=0;c<o.length;++c){const h=o[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=h.normalized),s!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=h.count*t}const r=new e(a),n=new F(r,t,s);let l=0;for(let c=0;c<o.length;++c){const h=o[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let g=0,p=h.count;g<p;g++)for(let w=0;w<t;w++){const d=h.getComponent(g,w);n.setComponent(g+u,w,d)}}else r.set(h.array,l);l+=h.count*t}return i!==void 0&&(n.gpuType=i),n}const Z=new f;function k(o,e,t,s,i,a){const r=2*Math.PI*i/4,n=Math.max(a-2*i,0),l=Math.PI/4;Z.copy(e),Z[s]=0,Z.normalize();const c=.5*r/(r+n),h=1-Z.angleTo(o)/l;return Math.sign(Z[t])===1?h*c:n/(r+n)+c+c*(1-h)}class Y extends ce{constructor(e=1,t=1,s=1,i=2,a=.1){const r=i*2+1;if(a=Math.min(e/2,t/2,s/2,a),super(1,1,1,r,r,r),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:s,segments:i,radius:a},r===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const l=new f,c=new f,h=new f(e,t,s).divideScalar(2).subScalar(a),u=this.attributes.position.array,g=this.attributes.normal.array,p=this.attributes.uv.array,w=u.length/6,d=new f,R=.5/r;for(let T=0,b=0;T<u.length;T+=3,b+=2)switch(l.fromArray(u,T),c.copy(l),c.x-=Math.sign(c.x)*R,c.y-=Math.sign(c.y)*R,c.z-=Math.sign(c.z)*R,c.normalize(),u[T+0]=h.x*Math.sign(l.x)+c.x*a,u[T+1]=h.y*Math.sign(l.y)+c.y*a,u[T+2]=h.z*Math.sign(l.z)+c.z*a,g[T+0]=c.x,g[T+1]=c.y,g[T+2]=c.z,Math.floor(T/w)){case 0:d.set(1,0,0),p[b+0]=k(d,c,"z","y",a,s),p[b+1]=1-k(d,c,"y","z",a,t);break;case 1:d.set(-1,0,0),p[b+0]=1-k(d,c,"z","y",a,s),p[b+1]=1-k(d,c,"y","z",a,t);break;case 2:d.set(0,1,0),p[b+0]=1-k(d,c,"x","z",a,e),p[b+1]=k(d,c,"z","x",a,s);break;case 3:d.set(0,-1,0),p[b+0]=1-k(d,c,"x","z",a,e),p[b+1]=1-k(d,c,"z","x",a,s);break;case 4:d.set(0,0,1),p[b+0]=1-k(d,c,"x","y",a,e),p[b+1]=1-k(d,c,"y","x",a,t);break;case 5:d.set(0,0,-1),p[b+0]=k(d,c,"x","y",a,e),p[b+1]=1-k(d,c,"y","x",a,t);break}}static fromJSON(e){return new Y(e.width,e.height,e.depth,e.segments,e.radius)}}const Ve=(o,e,t)=>Math.min(t,Math.max(e,o)),be=(o,e)=>1-Math.exp(-o*e);function At(o){let e=o>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function xe(o){const e=Math.floor(o/60),t=Math.floor(o%60),s=Math.floor(o%1*100);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}.${String(s).padStart(2,"0")}`}const fe=new pt,Se=new Q,W=new ut,Pt=new f,C=o=>new f(o[0],o[1],o[2]);function P(o,e,t,s,i=[0,0,0],a=.06){var n;const r=new Y(s[0],s[1],s[2],2,Math.min(a,Math.min(...s)*.24));fe.set(i[0],i[1],i[2]),Se.setFromEuler(fe),W.compose(C(t),Se,Pt.set(1,1,1)),r.applyMatrix4(W),((n=o.batches)[e]??(n[e]=[])).push(r)}function ee(o,e,t,s=[0,0,0]){fe.set(s[0],s[1],s[2]);const i=new me(new f(t[0]/2,t[1]/2,t[2]/2));return i.setStatic(C(e),Se.setFromEuler(fe)),o.physics.addCollider(i),i}function _e(o,e,t,s,i={}){const a=new Y(s[0],s[1],s[2],2,Math.min(.06,Math.min(...s)*.24)),r=new v(a,o.materials[e]());r.position.set(t[0],t[1],t[2]),r.castShadow=!0,r.receiveShadow=!0,o.solids.add(r);const n=new me(new f(s[0]/2,s[1]/2,s[2]/2),{mesh:i.colliderMesh??r,id:i.id??null});return o.physics.addCollider(n),{mesh:r,collider:n}}const Te={platform(o,e){const t=e.mat??"concrete";if(P(o,t,e.pos,e.size,e.rot),ee(o,e.pos,e.size,e.rot),e.skirt!==!1){const[s,,i]=e.size,a=e.skirtDepth??5;P(o,"basalt",[e.pos[0],e.pos[1]-e.size[1]/2-a/2+.05,e.pos[2]],[s*.55,a,i*.55],[0,0,0],.04)}if(e.glow!==!1&&!e.rot){const[s,i,a]=e.size,r=e.pos[1]-i/2+.12,n=.07;P(o,"gold",[e.pos[0],r,e.pos[2]+a/2-.1],[s-.3,n,n],[0,0,0],.02),P(o,"gold",[e.pos[0],r,e.pos[2]-a/2+.1],[s-.3,n,n],[0,0,0],.02),P(o,"gold",[e.pos[0]+s/2-.1,r,e.pos[2]],[n,n,a-.3],[0,0,0],.02),P(o,"gold",[e.pos[0]-s/2+.1,r,e.pos[2]],[n,n,a-.3],[0,0,0],.02)}},ramp(o,e){Te.platform(o,{...e,skirt:e.skirt??!1})},bridge(o,e){const t=C(e.from),s=C(e.to),i=t.clone().add(s).multiplyScalar(.5),a=t.distanceTo(s),r=Math.atan2(s.x-t.x,s.z-t.z);Te.platform(o,{pos:[i.x,i.y,i.z],size:[e.width??2.4,e.thickness??.7,a],rot:[0,r,0],mat:e.mat??"metal",skirt:!1})},rotator(o,e){const{mesh:t}=_e(o,e.mat??"metal",e.pos,e.size),s=e.axis??"y",i={};i[s]=`+=${Math.PI*2*(e.reverse?-1:1)}`,o.tweens.push(m.to(t.rotation,{...i,duration:e.duration??4,ease:"none",repeat:-1}))},slider(o,e){const{mesh:t}=_e(o,e.mat??"metal",e.pos,e.size);o.tweens.push(m.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3,ease:e.ease??"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0,repeatDelay:e.repeatDelay??0}))},elevator(o,e){const{mesh:t}=_e(o,e.mat??"metal",e.pos,e.size),s=m.to(t.position,{x:e.to[0],y:e.to[1],z:e.to[2],duration:e.duration??3.2,ease:"sine.inOut",repeat:-1,yoyo:!0,repeatDelay:e.repeatDelay??.8,paused:!!e.triggerId});o.tweens.push(s),e.triggerId&&o.actions.set(e.triggerId,()=>s.play())},pendulum(o,e){const t=new N;t.position.set(e.pos[0],e.pos[1],e.pos[2]),o.solids.add(t);const s=e.length??4,i=new Y(e.thickness??.6,s,e.thickness??.6,2,.05),a=new v(i,o.materials[e.mat??"metal"]());a.position.y=-s/2,a.castShadow=!0,a.receiveShadow=!0,t.add(a),o.physics.addCollider(new me(new f((e.thickness??.6)/2,s/2,(e.thickness??.6)/2),{mesh:a})),t.rotation.z=-(e.swing??.85),o.tweens.push(m.to(t.rotation,{z:e.swing??.85,duration:e.duration??1.6,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:e.delay??0}))},gate(o,e){const[t,s]=e.size,i=e.yaw??0,a=Math.cos(i),r=Math.sin(i),n=[.45,s+.6,.45],l=(t/2+.2)*a,c=-(t/2+.2)*r;for(const w of[1,-1]){const d=[e.pos[0]+l*w,e.pos[1],e.pos[2]+c*w];P(o,"metal",d,n,[0,i,0]),ee(o,d,n,[0,i,0])}const h=[e.pos[0],e.pos[1]+s/2+.35,e.pos[2]];P(o,"metal",h,[t+1.3,.5,.45],[0,i,0]),ee(o,h,[t+1.3,.5,.45],[0,i,0]);const u=o.materials.gate(o.accent),g=new v(new Me(t,s),u);g.position.set(e.pos[0],e.pos[1],e.pos[2]),g.rotation.y=i,o.group.add(g);const p=ee(o,e.pos,[t,s,.3],[0,i,0]);o.actions.set(e.id,()=>{p.enabled=!1,m.to(u.uniforms.uOpen,{value:1,duration:1.1,ease:"power2.inOut"}),o.world.onGateOpen?.(C(e.pos))})},pad(o,e){const t=new v(new De(.95,1.05,.16,28),o.materials.metal());t.position.set(e.pos[0],e.pos[1],e.pos[2]),t.receiveShadow=!0,o.group.add(t);const s=o.materials.pad(o.accent),i=new v(new Me(2.4,2.4),s);i.rotation.x=-Math.PI/2,i.position.set(e.pos[0],e.pos[1]+.1,e.pos[2]),o.group.add(i),o.physics.addTrigger(new J(C(e.pos),1.3,()=>{m.to(s.uniforms.uActive,{value:1,duration:.5});for(const a of e.targets??[])o.actions.get(a)?.();o.world.onPad?.(C(e.pos))}))},checkpoint(o,e){const t=C(e.pos),s=new v(new De(1.1,1.2,.14,32),o.materials.marble());s.position.copy(t),s.receiveShadow=!0,o.group.add(s);const i=new N;i.position.set(t.x,t.y+1.5,t.z),o.group.add(i);const a=o.materials.blackholeDisk(9071173),r=new v(new ge(.15,1,48,1),a);r.rotation.x=-Math.PI/2,i.add(r);const n=new v(new V(1.06,.045,12,48),o.materials.chrome());n.rotation.x=Math.PI/2,i.add(n);const l=new v(new L(1.05,28,16),o.materials.halo(16767392));l.scale.y=.28,i.add(l),o.tweens.push(m.to(i.rotation,{y:Math.PI*2,duration:11,ease:"none",repeat:-1})),o.tweens.push(m.to(i.position,{y:t.y+1.75,duration:2.4,ease:"sine.inOut",repeat:-1,yoyo:!0})),o.physics.addTrigger(new J(t,1.5,()=>{const c=new y(o.accent);m.to(a.uniforms.uColor.value,{r:c.r,g:c.g,b:c.b,duration:.7}),m.fromTo(i.scale,{x:1.5,y:1.5,z:1.5},{x:1,y:1,z:1,duration:.9,ease:"expo.out"}),o.world.onCheckpoint?.(new f(t.x,t.y+1.2,t.z))}))},portal(o,e){const t=C(e.pos),s=new N;s.position.copy(t),s.rotation.y=e.yaw??0,o.group.add(s);const i=new v(new Pe(.68,40),new ae({color:0,side:q}));s.add(i);const a=new v(new ge(.3,1.9,64,1),o.materials.blackholeDisk(o.accent));a.position.z=.01,s.add(a);const r=new v(new V(1.95,.05,12,64),new ae({color:16774108}));s.add(r);const n=new v(new V(2.2,.05,10,64),o.materials.metal());s.add(n);const l=new v(new L(2,32,20),o.materials.halo(o.accent));l.scale.z=.3,s.add(l),o.tweens.push(m.to(n.rotation,{x:Math.PI*2,duration:7,ease:"none",repeat:-1})),o.tweens.push(m.to(r.rotation,{z:-Math.PI*2,duration:12,ease:"none",repeat:-1})),o.physics.addTrigger(new J(t,1.5,()=>o.world.onPortal?.(t))),o.portalPos=t},skyline(o,e){var l,c;const t=At(e.seed??7),[s,,i]=e.center??[0,0,0],a=e.radius??85,r=e.count??56,n=e.baseY??-30;for(let h=0;h<r;h++){const u=t()*Math.PI*2,g=a*(.8+t()*.7),p=4+t()*9,w=4+t()*9,d=20+t()*55,R=s+Math.cos(u)*g,T=i+Math.sin(u)*g,b=new ce(p,d,w).toNonIndexed();W.makeTranslation(R,n+d/2,T),b.applyMatrix4(W),((l=o.batches).basalt??(l.basalt=[])).push(b);const E=t()<.75?1+Math.floor(t()*2):0;for(let G=0;G<E;G++){const K=new ce(p+.12,.12,w+.12).toNonIndexed();W.makeTranslation(R,n+d*(.25+t()*.65),T),K.applyMatrix4(W),((c=o.batches).gold??(c.gold=[])).push(K)}}},laser(o,e){const t=C(e.from),s=C(e.to),i=t.clone().add(s).multiplyScalar(.5),a=t.distanceTo(s),r=s.clone().sub(t).normalize(),n=new Q().setFromUnitVectors(new f(0,0,1),r),l=new v(new ce(.07,.07,a),o.materials.laserBeam());l.position.copy(i),l.quaternion.copy(n),o.group.add(l);for(const h of[t,s])P(o,"metal",[h.x,h.y,h.z],[.34,.34,.34],[0,0,0],.03);const c=new me(new f(.1,.1,a/2),{hazard:!0});c.setStatic(i,n),o.physics.addCollider(c)},blackhole(o,e){const t=C(e.pos),s=e.scale??1,i=new N;i.position.copy(t),o.group.add(i);const a=new v(new L(1.1*s,40,24),new ae({color:0}));i.add(a);const r=new v(new L(1.32*s,40,24),o.materials.halo(e.haloColor??10471679));i.add(r);const n=new v(new V(1.42*s,.045*s,12,72),new ae({color:16774108})),l=new v(new ge(1.35*s,3.4*s,72,1),o.materials.blackholeDisk(e.color??16757867)),c=e.tilt??1.25;for(const h of[n,l])h.rotation.x=c,i.add(h);o.tweens.push(m.to(i.rotation,{y:Math.PI*2,duration:90/(e.spin??1),ease:"none",repeat:-1})),e.pull&&o.physics.addAttractor({position:t,radius:e.radius??10*s,strength:e.strength??24,killRadius:1.35*s})},wormhole(o,e){const t=e.color??16764554,s=C(e.a),i=C(e.b),a=(r,n=0)=>{const l=new N;l.position.copy(r),l.rotation.y=n,o.group.add(l);const c=new v(new V(1.55,.14,16,56),o.materials.chrome());c.castShadow=!0,l.add(c);const h=new v(new V(1.85,.05,10,56),o.materials.metal());l.add(h);const u=new v(new Pe(1.45,44),o.materials.portal(t));l.add(u);const g=new v(new L(1.7,32,20),o.materials.halo(t));return g.scale.z=.35,l.add(g),o.tweens.push(m.to(c.rotation,{z:Math.PI*2,duration:9,ease:"none",repeat:-1})),o.tweens.push(m.to(h.rotation,{x:Math.PI*2,duration:5.5,ease:"none",repeat:-1})),l};a(s,e.yawA??0),a(i,e.yawB??e.yawA??0),o.world.wormholeMouths.push(s.clone(),i.clone()),o.physics.addTrigger(new J(s,1.35,()=>o.world.onWormhole?.({pos:i.clone(),from:s.clone()}),{once:!1})),e.bidirectional!==!1&&o.physics.addTrigger(new J(i,1.35,()=>o.world.onWormhole?.({pos:s.clone(),from:i.clone()}),{once:!1}))},decor(o,e){const t=new Y(e.size[0],e.size[1],e.size[2],2,.08),s=new v(t,o.materials[e.mat??"glass"]());s.position.set(e.pos[0],e.pos[1],e.pos[2]),e.rot&&s.rotation.set(e.rot[0],e.rot[1],e.rot[2]),s.castShadow=e.mat!=="glass",o.group.add(s);const i=e.drift??.6;o.tweens.push(m.to(s.position,{y:e.pos[1]+i,duration:3+Math.random()*3,ease:"sine.inOut",repeat:-1,yoyo:!0,delay:Math.random()*2})),o.tweens.push(m.to(s.rotation,{y:`+=${(Math.random()-.5)*1.4}`,duration:6+Math.random()*5,ease:"sine.inOut",repeat:-1,yoyo:!0}))},pillar(o,e){P(o,e.mat??"concrete",e.pos,e.size,e.rot??[0,0,0]),e.solid&&ee(o,e.pos,e.size,e.rot??[0,0,0])}};class Dt{constructor(e,t,s){this.scene=e,this.physics=t,this.materials=s,this.group=new N,this.solids=new N,e.add(this.group,this.solids),this.tweens=[],this.actions=new Map,this.portalPos=null,this.wormholeMouths=[],this.accent=10217727,this.onCheckpoint=null,this.onPortal=null,this.onPad=null,this.onGateOpen=null,this.onWormhole=null}load(e){this.clear(),this.accent=e.accent??10217727;const t={world:this,physics:this.physics,materials:this._materialProxy(),group:this.group,solids:this.solids,batches:{},tweens:this.tweens,actions:this.actions,accent:this.accent,portalPos:null};for(const s of e.objects){const i=Te[s.type];if(!i){console.warn(`[World] unknown component "${s.type}"`);continue}i(t,s)}this.portalPos=t.portalPos;for(const[s,i]of Object.entries(t.batches)){const a=kt(i,!1);for(const n of i)n.dispose();const r=new v(a,this.materials[s]());r.castShadow=!0,r.receiveShadow=!0,this.solids.add(r)}return{spawn:new f(...e.spawn)}}update(){this.physics.syncDynamics()}clear(){for(const e of this.tweens)e.kill();this.tweens.length=0,this.actions.clear(),this.physics.clear(),this.portalPos=null,this.wormholeMouths.length=0;for(const e of[this.group,this.solids])for(const t of[...e.children])t.traverse(s=>{if(s.geometry&&s.geometry.dispose(),s.material?.uniforms){s.material.dispose();const i=this.materials.animated.indexOf(s.material);i>=0&&this.materials.animated.splice(i,1)}}),e.remove(t)}_materialProxy(){const e=this.materials;return{concrete:()=>e.concrete(),marble:()=>e.marble(),metal:()=>e.metal(),chrome:()=>e.chrome(),glass:()=>e.glass(),basalt:()=>e.basalt(),gate:t=>e.gate(t),pad:t=>e.pad(t),beacon:t=>e.beacon(t),portal:t=>e.portal(t),halo:t=>e.halo(t),blackholeDisk:t=>e.blackholeDisk(t),gold:()=>e.gold(),laserBeam:()=>e.laserBeam()}}}const x=z.player,te=new f,He=new f,je=new Q,Rt=new f(0,1,0),Et=new f(0,-1,0);class Bt{constructor({scene:e,physics:t,input:s,materials:i}){this.physics=t,this.input=s,this.body={position:new f(0,3,0),velocity:new f,radius:x.radius,grounded:!1,groundCollider:null,groundNormal:null},this.spawn=new f(0,3,0),this.cameraYaw=0,this.frozen=!0,this.paused=!1,this.sprintAllowed=!0,this.onLand=null,this.onJump=null,this.onFall=null,this._wasGrounded=!1,this._coyote=0,this._jumpBuffer=0,this._fallSpeed=0,this.mesh=new v(new L(x.radius,48,32),i.chrome()),this.mesh.castShadow=!0,e.add(this.mesh),this.shadowBlob=new v(new Me(x.radius*4.4,x.radius*4.4),i.contactShadow()),this.shadowBlob.rotation.x=-Math.PI/2,this.shadowBlob.renderOrder=1,e.add(this.shadowBlob),this._raycaster=new $e,this._raycaster.far=30,s.on("jump",()=>{this._jumpBuffer=x.jumpBuffer})}get position(){return this.body.position}get velocity(){return this.body.velocity}setSpawn(e){this.spawn.copy(e)}respawn(){this.body.position.copy(this.spawn),this.body.velocity.set(0,0,0),this.body.grounded=!1,this.body.groundCollider=null,this.mesh.position.copy(this.spawn),m.fromTo(this.mesh.scale,{x:0,y:0,z:0},{x:1,y:1,z:1,duration:.6,ease:"back.out(2.5)",overwrite:"auto"})}update(e,t){const s=this.body;if(this.frozen){if(s.grounded){const r=Math.max(0,1-x.groundFriction*e);s.velocity.x*=r,s.velocity.z*=r}}else{const r=this.input.moveVector(),l=this.input.sprinting&&this.sprintAllowed?x.sprintSpeed:x.maxSpeed,c=Math.sin(this.cameraYaw),h=Math.cos(this.cameraYaw);te.set(r.x*h-r.z*c,0,-r.z*h-r.x*c);const u=s.grounded?1:x.airControl;s.velocity.addScaledVector(te,x.accel*u*e);const g=Math.hypot(s.velocity.x,s.velocity.z);if(g>l){const d=l/g;s.velocity.x*=d,s.velocity.z*=d}const p=s.grounded?te.lengthSq()>0?.6:x.groundFriction:x.airDrag,w=Math.max(0,1-p*e);if(s.velocity.x*=w,s.velocity.z*=w,this._coyote=s.grounded?x.coyoteTime:Math.max(0,this._coyote-e),this._jumpBuffer=Math.max(0,this._jumpBuffer-e),this._jumpBuffer>0&&this._coyote>0){this._jumpBuffer=0,this._coyote=0,s.velocity.y=x.jumpVelocity;const d=s.groundCollider;d?.mesh&&e>0&&(s.velocity.x+=(d.center.x-d.prevCenter.x)/e,s.velocity.z+=(d.center.z-d.prevCenter.z)/e),s.grounded=!1,s.groundCollider=null,m.fromTo(this.mesh.scale,{x:1.18,y:.82,z:1.18},{x:1,y:1,z:1,duration:.35,ease:"elastic.out(1, 0.55)",overwrite:"auto"}),this.onJump?.()}}s.grounded||(this._fallSpeed=-s.velocity.y);const i=this.physics.step(s,this.paused?0:e);if(s.grounded&&!this._wasGrounded&&this._fallSpeed>z.fx.landDustMin){const r=Math.min(1,this._fallSpeed/26);m.fromTo(this.mesh.scale,{x:1+r*.35,y:1-r*.4,z:1+r*.35},{x:1,y:1,z:1,duration:.45,ease:"elastic.out(1, 0.4)",overwrite:"auto"}),this.onLand?.(this._fallSpeed)}this._wasGrounded=s.grounded,this.mesh.position.copy(s.position);const a=Math.hypot(s.velocity.x,s.velocity.z);a>.05&&(te.set(s.velocity.x,0,s.velocity.z).normalize(),He.crossVectors(Rt,te).normalize(),je.setFromAxisAngle(He,-a*e/x.radius),this.mesh.quaternion.premultiply(je)),this._updateShadow(t),i&&!this.frozen&&this.onFall?.()}_updateShadow(e){this._raycaster.set(this.body.position,Et);const t=e?this._raycaster.intersectObject(e,!0):[];if(t.length){const s=t[0];this.shadowBlob.visible=!0,this.shadowBlob.position.set(this.body.position.x,s.point.y+.02,this.body.position.z);const i=s.distance-x.radius,a=Math.max(0,1-i/7);this.shadowBlob.material.uniforms.uStrength.value=.55*a;const r=1+i*.12;this.shadowBlob.scale.set(r,r,1)}else this.shadowBlob.visible=!1}}const _=z.camera,se=new f,j=new f,ne=new f,ie=new f;class Ft{constructor(e,t){this.camera=e,this.input=t,this.yaw=0,this.pitch=.42,this.distance=_.distance,this.cinematic=!1,this.focus=new f,this._zoom=0,this._raycaster=new $e,this._fovTween=null}snapTo(e,t=0){this.yaw=t,this.pitch=.42,this.focus.copy(e),this._place(e,null,1)}update(e,t,s){if(this.cinematic)return;const i=this.input.consumeMouse();this.yaw-=i.x*_.sensitivity,this.pitch=Ve(this.pitch+i.y*_.sensitivity,_.minPitch,_.maxPitch);const a=be(_.followLerp,e);this.focus.lerp(t.position,a);const r=Math.hypot(t.velocity.x,t.velocity.z),n=Ve(r/z.player.sprintSpeed,0,1);this._zoom+=(n*_.zoomBySpeed-this._zoom)*be(2.5,e);const l=this.input.sprinting&&n>.6?_.sprintFov:_.fov;Math.abs(this.camera.fov-l)>.1&&!this._fovTween?.isActive()&&(this._fovTween=m.to(this.camera,{fov:l,duration:.7,ease:"sine.out",overwrite:"auto",onUpdate:()=>this.camera.updateProjectionMatrix()})),j.copy(this.focus),r>.5&&(ne.set(t.velocity.x,0,t.velocity.z).normalize().multiplyScalar(_.lookAhead*n),j.add(ne)),this._place(j,s,be(12,e)),t.cameraYaw=this.yaw}_place(e,t,s){const i=this.distance+this._zoom;if(ne.set(Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.cos(this.yaw)*Math.cos(this.pitch)).multiplyScalar(i),se.copy(e).add(ne),se.y+=_.height*.25,t){ie.copy(se).sub(e);const a=ie.length();ie.divideScalar(a),this._raycaster.set(e,ie),this._raycaster.far=a;const r=this._raycaster.intersectObject(t,!0);if(r.length){const n=Math.max(1.2,r[0].distance-_.collisionRadius);se.copy(e).addScaledVector(ie,n)}}this.camera.position.lerp(se,s),j.copy(e),j.y+=_.height*.35,this.camera.lookAt(j)}intro(e,t=2.8){this.cinematic=!0;const s=this.camera,i={x:e.x+26,y:e.y+20,z:e.z+26};return s.position.set(i.x,i.y,i.z),new Promise(a=>{const r={t:0},n=new f;m.to(r,{t:1,duration:t,ease:"power3.inOut",onUpdate:()=>{const l=r.t,c=Math.PI*.75*(1-l),h=26-(26-_.distance)*l,u=20-(20-_.height*1.6)*l;s.position.set(e.x+Math.sin(c)*h,e.y+u,e.z+Math.cos(c)*h),n.copy(e),n.y+=_.height*.35,s.lookAt(n)},onComplete:()=>{this.yaw=0,this.pitch=.42,this.focus.copy(e),this.cinematic=!1,a()}})})}orbit(e,{dist:t=11,h:s=6}={}){this.cinematic=!0;const i=this.camera,a={ang:this.yaw,dist:this.distance+this._zoom,h:4.5},r=new f;this._orbitTween=m.to(a,{ang:this.yaw+Math.PI*2,duration:16,repeat:-1,ease:"none",onUpdate:()=>{i.position.set(e.x+Math.sin(a.ang)*a.dist,e.y+a.h,e.z+Math.cos(a.ang)*a.dist),r.copy(e),r.y+=1,i.lookAt(r)}}),m.to(a,{dist:t,h:s,duration:3,ease:"sine.inOut"})}endOrbit(){this._orbitTween?.kill(),this._orbitTween=null,this.cinematic=!1}}class Ut{constructor(e){this.engine=e;const t=e.scene;this.sun=new mt(16760954,3),this.sun.position.set(18,30,12),this.sun.castShadow=!0;const s=z.renderer.shadowMapSize;this.sun.shadow.mapSize.set(s,s),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=120;const i=34;this.sun.shadow.camera.left=-i,this.sun.shadow.camera.right=i,this.sun.shadow.camera.top=i,this.sun.shadow.camera.bottom=-i,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.03,t.add(this.sun,this.sun.target),this.hemi=new dt(4865324,460293,.55),t.add(this.hemi),this.skyMat=new S({vertexShader:Le.vertex,fragmentShader:Le.fragment,uniforms:{uTop:{value:new y(1315084)},uHorizon:{value:new y(9067044)},uGround:{value:new y(197122)},uSunDir:{value:this.sun.position.clone().normalize()},uSunColor:{value:new y(16760954)}},side:ft,depthWrite:!1,fog:!1}),this.skyDome=new v(new L(400,32,16),this.skyMat),this.skyDome.frustumCulled=!1,t.add(this.skyDome),t.fog=new gt(525829,.008),this._buildEnvironment()}_buildEnvironment(){const e=new vt(this.engine.renderer),t=new Qe,s=new v(new L(80,32,16),this.skyMat);t.add(s);const i=e.fromScene(t,.04);this.engine.scene.environment=i.texture,e.dispose(),s.geometry.dispose()}transitionTo({top:e,horizon:t,fog:s,sunColor:i,sunIntensity:a=3.2},r=1.6){const n=this.skyMat.uniforms,l=[[n.uTop.value,e],[n.uHorizon.value,t],[this.engine.scene.fog.color,s]];i&&l.push([n.uSunColor.value,i]);for(const[c,h]of l){const u=new y(h);m.to(c,{r:u.r,g:u.g,b:u.b,duration:r,ease:"sine.inOut",overwrite:"auto"})}m.to(this.sun,{intensity:a,duration:r,ease:"sine.inOut",overwrite:"auto"})}follow(e){this.sun.position.set(e.x+18,e.y+30,e.z+12),this.sun.target.position.copy(e),this.skyDome.position.copy(e)}}class Lt{constructor(e){this.canvas=e,this.keys=new Set,this.mouseDX=0,this.mouseDY=0,this.enabled=!1,this._listeners=new Map,addEventListener("keydown",t=>{t.repeat||(this.keys.add(t.code),t.code==="Space"&&(t.preventDefault(),this._emit("jump")),t.code==="KeyR"&&this._emit("restart"),t.code==="Escape"&&this._emit("pause"),t.code==="Enter"&&this._emit("confirm"),t.code==="KeyM"&&this._emit("mute"))}),addEventListener("keyup",t=>this.keys.delete(t.code)),addEventListener("blur",()=>this.keys.clear()),addEventListener("mousemove",t=>{this.pointerLocked&&(this.mouseDX+=t.movementX,this.mouseDY+=t.movementY)}),document.addEventListener("pointerlockchange",()=>{this.pointerLocked||this._emit("unlock")})}get pointerLocked(){return document.pointerLockElement===this.canvas}lockPointer(){this.pointerLocked||this.canvas.requestPointerLock?.()}unlockPointer(){this.pointerLocked&&document.exitPointerLock?.()}moveVector(){if(!this.enabled)return{x:0,z:0};const e=(this.keys.has("KeyD")?1:0)-(this.keys.has("KeyA")?1:0),t=(this.keys.has("KeyW")?1:0)-(this.keys.has("KeyS")?1:0),s=Math.hypot(e,t)||1;return{x:e/s,z:t/s}}get sprinting(){return this.enabled&&(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight"))}get jumpHeld(){return this.enabled&&this.keys.has("Space")}consumeMouse(){const e={x:this.mouseDX,y:this.mouseDY};return this.mouseDX=0,this.mouseDY=0,e}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this._listeners.get(e).delete(t)}_emit(e){this._listeners.get(e)?.forEach(t=>t())}}const It=`
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
`,Gt=`
  varying float vFade;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vFade;
    gl_FragColor = vec4(vColor, a * 0.85);
  }
`;class Nt{constructor(e,t=600){this.capacity=t,this.cursor=0;const s=new Ce,i=new Float32Array(t*3);s.setAttribute("position",new F(i.slice(),3)),s.setAttribute("aVelocity",new F(i.slice(),3)),s.setAttribute("aColor",new F(i.slice(),3)),s.setAttribute("aSpawnTime",new F(new Float32Array(t).fill(-1e3),1)),s.setAttribute("aLife",new F(new Float32Array(t).fill(1),1)),s.setAttribute("aSize",new F(new Float32Array(t).fill(1),1)),this.material=new S({vertexShader:It,fragmentShader:Gt,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:B}),this.points=new Ye(s,this.material),this.points.frustumCulled=!1,e.add(this.points)}emit(e,t,s={}){const{color:i=new y(13620954),speed:a=3.5,up:r=2.2,spread:n=1,life:l=.9,size:c=1.4}=s,h=this.points.geometry,u=h.attributes.position,g=h.attributes.aVelocity,p=h.attributes.aColor,w=h.attributes.aSpawnTime,d=h.attributes.aLife,R=h.attributes.aSize,T=this.material.uniforms.uTime.value;for(let b=0;b<t;b++){const E=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const G=Math.random()*Math.PI*2,K=Math.random()*n;u.setXYZ(E,e.x+Math.cos(G)*K*.4,e.y,e.z+Math.sin(G)*K*.4),g.setXYZ(E,Math.cos(G)*a*(.35+Math.random()*.65),r*(.5+Math.random()*.8),Math.sin(G)*a*(.35+Math.random()*.65)),p.setXYZ(E,i.r,i.g,i.b),w.setX(E,T),d.setX(E,l*(.6+Math.random()*.7)),R.setX(E,c*(.6+Math.random()*.8))}u.needsUpdate=!0,g.needsUpdate=!0,p.needsUpdate=!0,w.needsUpdate=!0,d.needsUpdate=!0,R.needsUpdate=!0}update(e){this.material.uniforms.uTime.value=e}}const Ot=`
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
`,Vt=`
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    gl_FragColor = vec4(vec3(0.92, 0.8, 0.6), smoothstep(1.0, 0.1, d) * vA * 0.12);
  }
`;class Ht{constructor(e,t=260,s=34){const i=new Ce,a=new Float32Array(t*3),r=new Float32Array(t);for(let n=0;n<t;n++)a[n*3]=(Math.random()-.5)*s,a[n*3+1]=(Math.random()-.5)*s,a[n*3+2]=(Math.random()-.5)*s,r[n]=Math.random();i.setAttribute("position",new F(a,3)),i.setAttribute("aSeed",new F(r,1)),this.material=new S({vertexShader:Ot,fragmentShader:Vt,uniforms:{uTime:{value:0},uCenter:{value:new f},uRange:{value:s}},transparent:!0,depthWrite:!1,blending:B}),this.points=new Ye(i,this.material),this.points.frustumCulled=!1,e.add(this.points)}update(e,t){this.material.uniforms.uTime.value=e,this.material.uniforms.uCenter.value.copy(t)}}class jt{constructor(){this.ctx=null,this.master=null,this.muted=!1,this._padNodes=[]}init(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=.6,this.master.connect(this.ctx.destination),this._startAmbient())}toggleMute(){if(this.ctx)return this.muted=!this.muted,this.master.gain.linearRampToValueAtTime(this.muted?0:.6,this.ctx.currentTime+.2),this.muted}_startAmbient(){const e=this.ctx.currentTime,t=this.ctx.createGain();t.gain.setValueAtTime(0,e),t.gain.linearRampToValueAtTime(.05,e+4);const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.value=320;const i=this.ctx.createOscillator();i.frequency.value=.05;const a=this.ctx.createGain();a.gain.value=140,i.connect(a).connect(s.frequency),i.start();for(const[r,n]of[[55,0],[55,6],[110,-4]]){const l=this.ctx.createOscillator();l.type="triangle",l.frequency.value=r,l.detune.value=n,l.connect(s),l.start(),this._padNodes.push(l)}s.connect(t).connect(this.master)}_blip(e,{type:t="sine",dur:s=.18,vol:i=.25,slide:a=0}={}){if(!this.ctx||this.muted)return;const r=this.ctx.currentTime,n=this.ctx.createOscillator(),l=this.ctx.createGain();n.type=t,n.frequency.setValueAtTime(e,r),a&&n.frequency.exponentialRampToValueAtTime(Math.max(30,e+a),r+s),l.gain.setValueAtTime(i,r),l.gain.exponentialRampToValueAtTime(.001,r+s),n.connect(l).connect(this.master),n.start(r),n.stop(r+s+.02)}_noise({dur:e=.22,vol:t=.3,freq:s=400}={}){if(!this.ctx||this.muted)return;const i=this.ctx.currentTime,a=Math.floor(this.ctx.sampleRate*e),r=this.ctx.createBuffer(1,a,this.ctx.sampleRate),n=r.getChannelData(0);for(let u=0;u<a;u++)n[u]=(Math.random()*2-1)*(1-u/a);const l=this.ctx.createBufferSource();l.buffer=r;const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.value=s;const h=this.ctx.createGain();h.gain.setValueAtTime(t,i),h.gain.exponentialRampToValueAtTime(.001,i+e),l.connect(c).connect(h).connect(this.master),l.start(i)}jump(){this._blip(320,{type:"sine",dur:.16,vol:.12,slide:260})}land(e=1){this._noise({dur:.18,vol:.12*e,freq:300})}checkpoint(){this._blip(523,{dur:.3,vol:.1}),setTimeout(()=>this._blip(784,{dur:.45,vol:.1}),110)}pad(){this._blip(392,{type:"triangle",dur:.35,vol:.14,slide:120})}gate(){this._noise({dur:.6,vol:.1,freq:900}),this._blip(196,{dur:.6,vol:.08,slide:160})}portal(){this._blip(262,{dur:1.2,vol:.12,slide:520}),this._noise({dur:1,vol:.08,freq:1400})}fall(){this._blip(240,{type:"sawtooth",dur:.5,vol:.06,slide:-180})}warp(){this._blip(180,{type:"sine",dur:.45,vol:.14,slide:700}),this._noise({dur:.5,vol:.09,freq:1800})}click(){this._blip(660,{dur:.08,vol:.08})}}class qt{constructor(e){this.root=e,e.innerHTML=`
      <div class="vignette"></div>

      <a class="back-link glass" data-el="back" href="/" aria-label="Back to the portfolio">
        ← Portfolio
      </a>

      <section class="screen screen--start" data-el="start">
        <div class="kicker">Pure Code · Pure Physics · Pure Experience</div>
        <h1 class="title">GRAVITY</h1>
        <div class="subtitle">A Three.js Technical Showcase</div>
        <div class="rule"></div>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to begin</button>
        <div class="controls-hint">
          <span><b>WASD</b> move</span><span><b>Mouse</b> camera</span>
          <span><b>Space</b> jump</span><span><b>Shift</b> sprint</span>
          <span><b>Esc</b> pause</span>
        </div>
        <div class="foot">
          <span>Built with <span class="heart">♥</span> Three.js · GSAP · GLSL · JavaScript</span>
          <button class="foot__fullscreen" data-el="fullscreen">Fullscreen ⛶</button>
        </div>
      </section>

      <div class="hud" data-el="hud" style="visibility:hidden">
        <div class="hud__stats">
          <span class="label">Energy</span>
          <span class="value" data-el="energyVal">100/100</span>
          <span class="hud__bar"><i data-el="energyBar"></i></span>
          <span class="label">Time</span>
          <span class="value" data-el="timer">00:00.00</span>
        </div>
        <div class="hud__level">
          <span class="label">Level</span>
          <span class="num" data-el="levelNum">01</span>
          <span class="name" data-el="levelName"></span>
        </div>
        <div class="hud__speed">
          <span class="ring" data-el="speedRing"></span>
          <span class="readout">
            <span class="kmh" data-el="speedVal">0</span>
            <span class="unit">km/h</span>
          </span>
        </div>
        <div class="hud__keys">shift sprint · space jump · r restart · esc pause</div>
        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <section class="screen screen--overlay" data-el="pause">
        <div class="panel">
          <div class="panel__title">Paused</div>
          <div class="panel__rows"><div class="row"><span class="k" data-el="pauseMeta"></span></div></div>
          <nav class="menu">
            <button class="is-primary" data-el="resume">Resume</button>
            <button data-el="restartLevel">Restart</button>
            <button data-el="settingsAudio">Audio — On</button>
            <button data-el="mainMenu">Main Menu</button>
            <a href="/" data-el="exitSite">Exit</a>
          </nav>
        </div>
        <div class="esc-hint"><b>ESC</b> Back</div>
      </section>

      <section class="screen screen--overlay" data-el="complete">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker"></div>
          <div class="panel__title">Level Complete</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Time</span><span class="v" data-el="completeTime"></span></div>
            <div class="row"><span class="k">Energy</span><span class="v" data-el="completeEnergy"></span></div>
          </div>
          <button class="btn btn--primary" data-el="continue">Continue →</button>
        </div>
      </section>

      <section class="screen screen--overlay" data-el="end">
        <div class="panel glass">
          <div class="kicker">All levels traversed</div>
          <div class="panel__title">The End</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Total time</span><span class="v" data-el="endMeta"></span></div>
          </div>
          <div class="menu">
            <button class="is-primary" data-el="again">Play Again</button>
          </div>
        </div>
      </section>

      <div class="bar bar--top"></div>
      <div class="bar bar--bottom"></div>
      <div class="veil" data-el="veil"></div>
    `,this.el={};for(const t of e.querySelectorAll("[data-el]"))this.el[t.dataset.el]=t;this.bars=e.querySelectorAll(".bar")}_setBack(e){m.to(this.el.back,{autoAlpha:e?1:0,y:e?0:-10,duration:.5,ease:"power2.out",overwrite:"auto"})}showStart(){const e=this.el.start;m.set(e,{autoAlpha:1}),m.from(e.querySelectorAll(".kicker, .title, .subtitle, .rule, .prompt, .controls-hint, .foot"),{y:34,autoAlpha:0,duration:1.1,stagger:.09,ease:"expo.out",delay:.15}),this._setBack(!0)}hideStart(){return this._setBack(!1),m.to(this.el.start,{autoAlpha:0,duration:.7,ease:"power2.inOut"})}showHUD(e,t,s){this.el.levelNum.textContent=String(e+1).padStart(2,"0"),this.el.levelName.textContent=s,m.set(this.el.hud,{visibility:"visible"}),m.fromTo(this.el.hud.querySelectorAll(".hud__stats, .hud__level, .hud__speed, .hud__keys"),{y:-14,autoAlpha:0},{y:0,autoAlpha:1,duration:.9,stagger:.1,ease:"expo.out"})}hideHUD(){m.to(this.el.hud,{autoAlpha:0,duration:.4,onComplete:()=>m.set(this.el.hud,{visibility:"hidden",opacity:1})})}setTimer(e){this.el.timer.textContent=xe(e)}setEnergy(e,t=100){const s=Math.max(0,Math.round(e));this.el.energyVal.textContent=`${s}/${t}`,this.el.energyBar.style.transform=`scaleX(${Math.max(0,e/t)})`}setSpeed(e){this.el.speedVal.textContent=String(Math.round(e));const t=Math.min(1,e/50);this.el.speedRing.style.setProperty("--deg",`${Math.round(t*280)}deg`)}toast(e,t=1.6){const s=this.el.toast;s.textContent=e,m.timeline().fromTo(s,{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.45,ease:"expo.out"}).to(s,{autoAlpha:0,y:-10,duration:.5,ease:"power2.in"},`+=${t}`)}showPause(e){this.el.pauseMeta.textContent=e,m.fromTo(this.el.pause,{autoAlpha:0},{autoAlpha:1,duration:.35}),m.fromTo(this.el.pause.querySelectorAll(".panel__title, .panel__rows, .menu > *"),{y:14,autoAlpha:0},{y:0,autoAlpha:1,duration:.5,stagger:.05,ease:"expo.out"}),this._setBack(!0)}hidePause(){return this._setBack(!1),m.to(this.el.pause,{autoAlpha:0,duration:.3})}setAudioLabel(e){this.el.settingsAudio.textContent=e?"Audio — Off":"Audio — On"}showComplete(e,t,s){this.el.completeKicker.textContent=e,this.el.completeTime.textContent=xe(t),this.el.completeEnergy.textContent=`${Math.max(0,Math.round(s))}/100`,m.fromTo(this.el.complete,{autoAlpha:0},{autoAlpha:1,duration:.6,delay:.7}),m.fromTo(this.el.complete.querySelector(".panel"),{scale:.92,y:24},{scale:1,y:0,duration:.9,delay:.7,ease:"expo.out"}),this._setBack(!0)}hideComplete(){return this._setBack(!1),m.to(this.el.complete,{autoAlpha:0,duration:.4})}showEnd(e){this.el.endMeta.textContent=xe(e),m.fromTo(this.el.end,{autoAlpha:0},{autoAlpha:1,duration:.8,delay:.6}),this._setBack(!0)}hideEnd(){return this._setBack(!1),m.to(this.el.end,{autoAlpha:0,duration:.4})}letterbox(e){m.to(this.bars,{height:e?"7vh":0,duration:.9,ease:"power3.inOut"})}async veilTransition(e){await m.to(this.el.veil,{autoAlpha:1,duration:.55,ease:"power2.in"}),await e?.(),await m.to(this.el.veil,{autoAlpha:0,duration:.8,ease:"power2.out"})}onClick(e,t){this.el[e].addEventListener("click",t)}}const D=[{name:"Atrium",accent:16761707,palette:{top:1315084,horizon:9067044,fog:525829,sunColor:16760954,sunIntensity:3},spawn:[0,1.5,0],objects:[{type:"skyline",seed:11,radius:80,count:60},{type:"platform",pos:[0,-.5,0],size:[10,1,10],mat:"concrete",skirtDepth:8},{type:"pillar",pos:[4.2,2,4.2],size:[.7,5,.7],mat:"marble",solid:!0},{type:"pillar",pos:[-4.2,2,4.2],size:[.7,5,.7],mat:"marble",solid:!0},{type:"pillar",pos:[0,4.75,4.2],size:[9.2,.5,.7],mat:"marble"},{type:"platform",pos:[0,-.5,-10],size:[4,1,8],mat:"concrete"},{type:"platform",pos:[0,-.5,-19.5],size:[4,1,5],mat:"marble"},{type:"ramp",pos:[0,.5,-27],size:[4,1,7.3],rot:[.29,0,0],mat:"concrete"},{type:"platform",pos:[0,1.5,-34],size:[6,1,6],mat:"concrete"},{type:"pad",pos:[1.8,2.08,-34],targets:["g1"]},{type:"gate",pos:[0,3.75,-37.2],size:[4,3.5],id:"g1"},{type:"platform",pos:[0,1.5,-41.5],size:[4,1,8],mat:"concrete"},{type:"checkpoint",pos:[0,2.07,-40]},{type:"slider",pos:[3,1.5,-49],to:[-3,1.5,-49],size:[3.5,1,3.5],duration:2.6,mat:"metal"},{type:"platform",pos:[0,1.5,-56.5],size:[8,1,8],mat:"marble",skirtDepth:9},{type:"checkpoint",pos:[2.2,2.07,-55]},{type:"wormhole",a:[0,3.7,-57.5],b:[14,9.7,-68.8]},{type:"platform",pos:[14,7.5,-72],size:[8,1,8],mat:"marble",skirtDepth:14},{type:"portal",pos:[14,10,-74.5]},{type:"blackhole",pos:[-38,16,-88],scale:4,spin:.6},{type:"decor",pos:[8,4,-20],size:[3,.3,2],mat:"glass"},{type:"decor",pos:[-7,5.5,-34],size:[2.5,.3,2.5],mat:"glass"},{type:"decor",pos:[6.5,6,-50],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[-9,2.5,-13],size:[1.2,7,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[10,3,-44],size:[1,5.5,1],mat:"basalt",drift:.5}]},{name:"Suspension",accent:16756821,palette:{top:1576968,horizon:9719839,fog:656900,sunColor:16755541,sunIntensity:3},spawn:[0,1.5,0],objects:[{type:"skyline",seed:23,radius:90,count:64,center:[35,0,0]},{type:"platform",pos:[0,-.5,0],size:[8,1,8],mat:"concrete",skirtDepth:8},{type:"rotator",pos:[10,-.5,0],size:[7,1,2.5],axis:"y",duration:5,mat:"metal"},{type:"platform",pos:[17.5,-.5,0],size:[4,1,4],mat:"marble"},{type:"checkpoint",pos:[17.5,.07,0]},{type:"elevator",pos:[23.5,-.5,0],to:[23.5,4.5,0],size:[3.5,1,3.5],duration:3,repeatDelay:.8,mat:"metal"},{type:"platform",pos:[29.5,4.5,0],size:[5,1,5],mat:"concrete",skirtDepth:11},{type:"slider",pos:[36,4.5,-4],to:[36,4.5,4],size:[3,1,3],duration:2.4,mat:"metal"},{type:"platform",pos:[42,4.5,0],size:[4,1,4],mat:"marble",skirtDepth:11},{type:"checkpoint",pos:[42,5.07,0]},{type:"platform",pos:[42,4.5,7],size:[3,1,3],mat:"concrete",skirtDepth:11},{type:"pad",pos:[42,5.08,7],targets:["g2"]},{type:"gate",pos:[46.5,6.75,0],size:[3.5,3.5],yaw:Math.PI/2,id:"g2"},{type:"platform",pos:[49.5,4.5,0],size:[7,1,3],mat:"metal"},{type:"platform",pos:[56,4.5,0],size:[2,1,2],mat:"marble"},{type:"platform",pos:[59.5,4.5,2.5],size:[2,1,2],mat:"marble"},{type:"platform",pos:[63,4.5,0],size:[2,1,2],mat:"marble"},{type:"blackhole",pos:[59.5,8,-9.5],scale:1.5,pull:!0,radius:10.5,strength:26},{type:"platform",pos:[69,4.5,0],size:[8,1,8],mat:"marble",skirtDepth:12},{type:"portal",pos:[69,6.9,0],yaw:Math.PI/2},{type:"blackhole",pos:[30,28,-75],scale:5,spin:.5,color:16752720},{type:"decor",pos:[12,4,8],size:[3.2,.3,2],mat:"glass"},{type:"decor",pos:[30,9,-7],size:[2.6,.3,2.6],mat:"glass"},{type:"decor",pos:[52,9.5,6],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[24,2,-9],size:[1.2,8,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[60,6,-8],size:[1,6,1],mat:"basalt",drift:.5},{type:"decor",pos:[8,7,-10],size:[1.4,9,1.4],mat:"basalt",drift:.3}]},{name:"Metronome",accent:16761707,palette:{top:987929,horizon:4871784,fog:460811,sunColor:13621740,sunIntensity:2.6},spawn:[0,1.5,0],objects:[{type:"skyline",seed:37,radius:85,count:60,center:[0,0,-40]},{type:"platform",pos:[0,-.5,0],size:[8,1,8],mat:"concrete",skirtDepth:8},{type:"platform",pos:[0,-.5,-14],size:[6,1,18],mat:"concrete",skirtDepth:10},{type:"slider",pos:[-1.6,1.5,-10],to:[1.6,1.5,-10],size:[2.8,3,.8],duration:1.7,mat:"metal"},{type:"slider",pos:[1.6,1.5,-17],to:[-1.6,1.5,-17],size:[2.8,3,.8],duration:1.7,delay:.85,mat:"metal"},{type:"checkpoint",pos:[0,.07,-21.5]},{type:"laser",from:[-3.2,.6,-6.8],to:[3.2,.6,-6.8]},{type:"laser",from:[-3.7,.6,-25.2],to:[3.7,.6,-25.2]},{type:"platform",pos:[0,-.5,-28],size:[7,1,7],mat:"marble"},{type:"rotator",pos:[0,.9,-28],size:[7.5,.7,.7],axis:"y",duration:3.4,mat:"metal"},{type:"platform",pos:[0,-.5,-41.5],size:[6,1,6],mat:"concrete",skirtDepth:10},{type:"checkpoint",pos:[0,.07,-41.5]},{type:"laser",from:[-3.1,.75,-44.2],to:[3.1,.75,-44.2]},{type:"platform",pos:[0,-.5,-52],size:[3,1,14],mat:"metal",skirt:!1},{type:"pendulum",pos:[0,4.6,-49],length:4,swing:.85,duration:1.5,mat:"chrome"},{type:"pendulum",pos:[0,4.6,-55],length:4,swing:.85,duration:1.5,delay:.75,mat:"chrome"},{type:"platform",pos:[0,-.5,-62],size:[5,1,5],mat:"concrete",skirtDepth:10},{type:"checkpoint",pos:[-1.2,.07,-62]},{type:"pad",pos:[1.3,.08,-62],targets:["lift"]},{type:"elevator",pos:[0,-.5,-69.5],to:[0,7.5,-69.5],size:[3.5,1,3.5],duration:3.5,repeatDelay:1,triggerId:"lift",mat:"metal"},{type:"platform",pos:[0,7.5,-76.5],size:[8,1,8],mat:"marble",skirtDepth:16},{type:"portal",pos:[0,9.9,-77.5]},{type:"blackhole",pos:[-30,24,-100],scale:7,spin:.4,color:10335449},{type:"decor",pos:[7,3,-18],size:[3,.3,2],mat:"glass"},{type:"decor",pos:[-7.5,5,-34],size:[2.6,.3,2.6],mat:"glass"},{type:"decor",pos:[6,8,-60],size:[3,.4,2],mat:"glass"},{type:"decor",pos:[-8,4,-50],size:[1.2,9,1.2],mat:"basalt",drift:.4},{type:"decor",pos:[9,10,-74],size:[1.3,7,1.3],mat:"basalt",drift:.5}]}];class Wt{constructor(e,t){this.state="start",this.levelIndex=0,this.levelTime=0,this.totalTime=0,this.energy=100,this.engine=new St(e),this.materials=new zt,this.physics=new Tt(z.physics),this.world=new Dt(this.engine.scene,this.physics,this.materials),this.input=new Lt(e),this.player=new Bt({scene:this.engine.scene,physics:this.physics,input:this.input,materials:this.materials}),this.rig=new Ft(this.engine.camera,this.input),this.lighting=new Ut(this.engine),this.bursts=new Nt(this.engine.scene),this.motes=new Ht(this.engine.scene,z.fx.ambientMotes),this.audio=new jt,this.ui=new qt(t),this._wireEvents(),this.engine.onTick((s,i)=>this._tick(s,i))}boot(){this._loadLevel(0,{instant:!0}),this.player.frozen=!0,this.rig.orbit(this.player.position,{dist:16,h:8}),this.ui.showStart(),this.engine.start()}start(){this.state==="start"&&this._begin()}_wireEvents(){this.player.onJump=()=>this.audio.jump(),this.player.onLand=e=>{const t=Math.min(1,e/22);this.audio.land(t),this.bursts.emit(this.player.position.clone().setY(this.player.position.y-z.player.radius*.8),Math.round(6+t*14),{color:new y(12173510),speed:2.5+t*3,up:1.2,life:.8})},this.player.onFall=()=>{this.audio.fall(),this.ui.toast("Warped to checkpoint"),this.energy=Math.max(0,this.energy-8),this.player.respawn(),this.audio.warp(),this.bursts.emit(this.player.spawn,20,{color:new y(16767392),speed:3,up:2.2,spread:1.4,life:1.1}),this.rig.snapTo(this.player.position,this.rig.yaw)},this.world.onCheckpoint=e=>{this.player.setSpawn(e),this.audio.checkpoint(),this.ui.toast("Checkpoint"),this.bursts.emit(e,16,{color:new y(16767392),speed:2.2,up:3,life:1.1})},this.world.onPad=e=>{this.audio.pad(),this.bursts.emit(e,12,{color:new y(this.world.accent),speed:2,up:2.4,life:.9})},this.world.onGateOpen=e=>{this.audio.gate(),this.ui.toast("Gate unlocked"),this.bursts.emit(e,24,{color:new y(this.world.accent),speed:3.4,up:1.6,spread:2,life:1.2})},this.world.onPortal=()=>this._completeLevel(),this.world.onWormhole=({pos:e,from:t})=>this._warp(e,t),this.input.on("confirm",()=>{this.state==="start"?this._begin():this.state==="complete"?this._continue():this.state==="end"&&this._replay()}),this.input.on("pause",()=>{this.state==="pause"&&this._resume()}),this.input.on("unlock",()=>{this.state==="play"&&this._pause()}),this.input.on("restart",()=>{this.state==="play"&&this._restartLevel()}),this.input.on("mute",()=>{const e=this.audio.toggleMute();e!==void 0&&(this.ui.setAudioLabel(e),this.ui.toast(e?"Audio muted":"Audio on"))}),this.ui.onClick("begin",()=>this.state==="start"&&this._begin()),this.ui.onClick("resume",()=>this._resume()),this.ui.onClick("restartLevel",()=>{this.ui.hidePause(),this._restartLevel()}),this.ui.onClick("continue",()=>this.state==="complete"&&this._continue()),this.ui.onClick("again",()=>this.state==="end"&&this._replay()),this.ui.onClick("mainMenu",()=>this.state==="pause"&&this._toMainMenu()),this.ui.onClick("settingsAudio",()=>{const e=this.audio.toggleMute();e!==void 0&&this.ui.setAudioLabel(e)}),this.ui.onClick("fullscreen",()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.()}),this.engine.canvas.addEventListener("click",()=>{this.state==="play"&&this.input.lockPointer()})}async _begin(){this.state="intro",this.audio.init(),this.audio.click(),this.ui.hideStart(),this.ui.letterbox(!0),this.rig.endOrbit(),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,D.length,D[this.levelIndex].name)}_enterPlay(){this.state="play",this.player.frozen=!1,this.player.paused=!1,this.input.enabled=!0,this.input.lockPointer(),this.rig.snapTo(this.player.position,this.rig.yaw)}_pause(){this.state="pause",this.player.frozen=!0,this.player.paused=!0,this.input.enabled=!1,this.input.unlockPointer();for(const e of this.world.tweens)e.pause();this.ui.showPause(`Level ${this.levelIndex+1} — ${D[this.levelIndex].name}`)}_resume(){if(this.state==="pause"){this.audio.click(),this.ui.hidePause();for(const e of this.world.tweens)e.resume();this._enterPlay()}}async _restartLevel(){this.audio.click(),this.state="transition",this.input.enabled=!1,await this.ui.veilTransition(()=>{this.energy=100,this._loadLevel(this.levelIndex,{instant:!0})}),this._enterPlay()}_warp(e,t){if(this.state!=="play"||this._warpBlocked)return;this._warpBlocked=!0,this.audio.warp();const s=new y(16764554);this.bursts.emit(t,22,{color:s,speed:3.5,up:2,spread:1.6,life:1.1}),this.player.body.position.copy(e),this.player.mesh.position.copy(e),this.rig.snapTo(e,this.rig.yaw),this.lighting.follow(e),this.bursts.emit(e,22,{color:s,speed:3.5,up:2,spread:1.6,life:1.1}),m.fromTo(this.player.mesh.scale,{x:.3,y:.3,z:.3},{x:1,y:1,z:1,duration:.5,ease:"back.out(2)",overwrite:"auto"})}_completeLevel(){if(this.state!=="play")return;this.state="complete",this.totalTime+=this.levelTime,this.player.frozen=!0,this.input.enabled=!1,this.input.unlockPointer(),this.audio.portal(),this.ui.hideHUD(),this.ui.letterbox(!0),this.rig.orbit(this.player.position),this.world.portalPos&&this.bursts.emit(this.world.portalPos,40,{color:new y(this.world.accent),speed:4,up:2.5,spread:2,life:1.6}),this.levelIndex>=D.length-1?(this.state="end",this.ui.showEnd(this.totalTime)):this.ui.showComplete(D[this.levelIndex].name,this.levelTime,this.energy)}async _toMainMenu(){this.audio.click(),this.state="transition",this.input.enabled=!1,this.ui.hidePause(),this.ui.hideHUD(),await this.ui.veilTransition(()=>{this.totalTime=0,this.energy=100,this._loadLevel(0,{instant:!0})}),this.state="start",this.player.frozen=!0,this.player.paused=!1,this.rig.endOrbit(),this.rig.orbit(this.player.position,{dist:16,h:8}),this.ui.showStart()}async _continue(){this.audio.click(),this.state="transition",this.ui.hideComplete(),this.rig.endOrbit(),await this.ui.veilTransition(()=>{this._loadLevel(this.levelIndex+1,{instant:!0})}),this.ui.letterbox(!0),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,D.length,D[this.levelIndex].name)}async _replay(){this.audio.click(),this.state="transition",this.ui.hideEnd(),this.rig.endOrbit(),this.totalTime=0,this.energy=100,await this.ui.veilTransition(()=>{this._loadLevel(0,{instant:!0})}),this.ui.letterbox(!0),await this.rig.intro(this.player.position),this.ui.letterbox(!1),this._enterPlay(),this.ui.showHUD(this.levelIndex,D.length,D[this.levelIndex].name)}_loadLevel(e,{instant:t=!1}={}){this.levelIndex=e,this.levelTime=0;const s=D[e],{spawn:i}=this.world.load(s);this.player.setSpawn(i),this.player.respawn(),this.lighting.transitionTo(s.palette,t?.01:1.6),this.lighting.follow(this.player.position)}_tick(e,t){if(this.state==="play"){this.levelTime+=e,this.ui.setTimer(this.levelTime);const i=this.player.velocity,a=Math.hypot(i.x,i.z),r=this.input.sprinting&&a>2&&this.player.sprintAllowed;this.energy=Math.min(100,Math.max(0,this.energy+(r?-7:3.2)*e)),this.player.sprintAllowed=this.energy>1,this.ui.setEnergy(this.energy),this.ui.setSpeed(a*3.6)}this._warpBlocked&&(this._warpBlocked=this.world.wormholeMouths.some(i=>i.distanceToSquared(this.player.position)<2.2*2.2)),this.materials.update(t),this.world.update(),this.player.update(e,this.world.solids),this.rig.update(e,this.player,this.world.solids),this.lighting.follow(this.player.position),this.bursts.update(t),this.motes.update(t,this.player.position),this.world.portalPos&&Math.random()<e*3&&this.bursts.emit(this.world.portalPos,1,{color:new y(this.world.accent),speed:.8,up:.8,spread:1.6,life:1.4,size:1})}}const Qt=document.getElementById("game-canvas"),$t=document.getElementById("ui-root"),Xe=new Wt(Qt,$t);Xe.boot();new URLSearchParams(location.search).has("autostart")&&setTimeout(()=>Xe.start(),400);
