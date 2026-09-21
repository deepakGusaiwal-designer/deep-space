import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import OrbitingBacklights from "./OrbitingBacklights";
import BoomboxModel from "./BoomboxModel";

export function SceneLoader() {
  return (
    <Html center>
      <div className="model-loader">
        <div className="loader-spinner" />
        <span>LOADING BOOMBOX...</span>
      </div>
    </Html>
  );
}

// Interactive 3D Camera Rig with smooth critically damped parallax & mobile framing
function RadioCameraRig() {
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const { size } = useThree();

  useFrame((state, delta) => {
    const px = state.pointer.x;
    const py = state.pointer.y;
    const aspect = size.width / Math.max(size.height, 1);
    const isMobile = size.width < 768 || aspect < 1.0;

    // Dampen parallax on touch/mobile to prevent extreme model shifts when tapping
    const parallaxFactor = isMobile ? 0.35 : 1.0;

    // Smooth camera arc sway based on pointer
    const targetX = px * 0.42 * parallaxFactor;
    // On mobile portrait, shift camera focus slightly up to give breathing room for bottom dock
    const targetY = (isMobile ? 0.12 : 0.05) + py * 0.25 * parallaxFactor;
    // Move camera distance back on narrow portrait screens so the model never clips
    const baseZ = isMobile ? 4.2 + Math.max(0, (0.85 - aspect) * 1.8) : 4.2;
    const targetZ = baseZ - (Math.abs(px) + Math.abs(py)) * 0.12 * parallaxFactor;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.2, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.2, delta);

    lookTarget.current.set(
      px * 0.08 * parallaxFactor,
      (isMobile ? 0.08 : 0) + py * 0.05 * parallaxFactor,
      0
    );
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}

// Generates a soft, glowing, perfectly circular particle texture
function getRoundParticleTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.25, "rgba(255, 220, 175, 0.9)");
  grad.addColorStop(0.55, "rgba(255, 140, 60, 0.4)");
  grad.addColorStop(0.85, "rgba(255, 80, 20, 0.1)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// Glowing round bokeh & dust particles with multi-plane depth parallax
function FloatingDustParticles({ count = 240 }) {
  const pointsRef = useRef();
  const bokehRef = useRef();
  const circleTexture = useMemo(() => getRoundParticleTexture(), []);

  // Midground ambient dust particles
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.5 - 0.2;
    }
    return pos;
  });

  // Foreground soft round bokeh orbs closer to camera
  const [bokehPositions] = useState(() => {
    const bCount = 45;
    const pos = new Float32Array(bCount * 3);
    for (let i = 0; i < bCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      pos[i * 3 + 2] = Math.random() * 2.2 + 0.8; // Z: [0.8, 3.0]
    }
    return pos;
  });

  useFrame((state, delta) => {
    const px = state.pointer.x;
    const py = state.pointer.y;
    const t = state.clock.elapsedTime;

    if (pointsRef.current) {
      pointsRef.current.position.x = THREE.MathUtils.damp(pointsRef.current.position.x, -px * 0.32, 2.0, delta);
      pointsRef.current.position.y = THREE.MathUtils.damp(pointsRef.current.position.y, -py * 0.2 + Math.sin(t * 0.35) * 0.04, 2.0, delta);
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.02;
    }

    if (bokehRef.current) {
      // Foreground bokeh moves faster for accentuated stereoscopic depth
      bokehRef.current.position.x = THREE.MathUtils.damp(bokehRef.current.position.x, -px * 0.65, 2.2, delta);
      bokehRef.current.position.y = THREE.MathUtils.damp(bokehRef.current.position.y, -py * 0.45 + Math.cos(t * 0.5) * 0.06, 2.2, delta);
      bokehRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* 1. Ambient Midground Round Dust Field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          size={0.068}
          color="#ffb377"
          transparent
          opacity={0.65}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Foreground Floating Round Bokeh Orbs */}
      <points ref={bokehRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={45}
            array={bokehPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          size={0.16}
          color="#ff9944"
          transparent
          opacity={0.38}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// Inner component for speaker glow point lights - animates at 60fps in Three.js loop with ZERO React re-renders
function SpeakerGlowLights({ active, audioDataRef, volScale, bassFactor }) {
  const leftLightRef = useRef();
  const rightLightRef = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / Math.max(size.height, 1);
  const isMobile = size.width < 768 || aspect < 1.0;

  const scaleRatio = isMobile
    ? Math.min(2.55, Math.max(1.75, viewport.width * 0.78)) / 3.85
    : 1.0;
  const lightSpread = 0.88 * scaleRatio;
  const lightY = (isMobile ? 0.08 : -0.05) - 0.05 * scaleRatio;
  const lightZ = 0.55 * scaleRatio;

  useFrame(() => {
    const bass = audioDataRef?.current ? audioDataRef.current.bass : 0;
    const targetIntensity = active ? (0.6 + bass * 1.0) * volScale * bassFactor : 0.2;

    if (leftLightRef.current) leftLightRef.current.intensity = targetIntensity;
    if (rightLightRef.current) rightLightRef.current.intensity = targetIntensity;
  });

  return (
    <>
      <pointLight
        ref={leftLightRef}
        position={[-lightSpread, lightY, lightZ]}
        color="#ff7722"
        distance={2.8 * scaleRatio}
        decay={1.8}
      />
      <pointLight
        ref={rightLightRef}
        position={[lightSpread, lightY, lightZ]}
        color="#ff7722"
        distance={2.8 * scaleRatio}
        decay={1.8}
      />
    </>
  );
}

function Scene({
  audioDataRef,
  audioData,
  active,
  volume,
  setVolume,
  tuning,
  setTuning,
  bassBoost,
  setBassBoost,
  isMuted,
  onButtonAction,
  onSeek,
  trackProgress,
  currentTrack,
}) {
  const volScale = volume / 100;
  const bassFactor = 1 + (bassBoost / 12) * 1.2;

  return (
    <Canvas
      shadows
      dpr={[1, Math.min(window.devicePixelRatio || 2, 2)]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.05, 4.2], fov: 38 }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#8a5c36" />

      {/* Smooth 3D Camera Parallax Controller */}
      <RadioCameraRig />

      {/* Ambient Multi-Plane Parallax Dust Particles */}
      <FloatingDustParticles count={80} />

      {/* Dynamic Ambient Orbiting Backlights */}
      <OrbitingBacklights
        active={active}
        audioDataRef={audioDataRef}
        volScale={volScale}
      />

      {/* Warm Ambient Speaker Glow Lights */}
      <SpeakerGlowLights
        active={active}
        audioDataRef={audioDataRef}
        volScale={volScale}
        bassFactor={bassFactor}
      />

      {/* Main 3D Boombox Model with Active Physical Buttons */}
      <Suspense fallback={<SceneLoader />}>
        <BoomboxModel
          audioDataRef={audioDataRef}
          audioData={audioData}
          active={active}
          volume={volume}
          setVolume={setVolume}
          tuning={tuning}
          setTuning={setTuning}
          bassBoost={bassBoost}
          setBassBoost={setBassBoost}
          isMuted={isMuted}
          onButtonAction={onButtonAction}
          onSeek={onSeek}
          trackProgress={trackProgress}
          currentTrack={currentTrack}
        />
      </Suspense>

      <Environment preset="night" />
    </Canvas>
  );
}

export default React.memo(Scene);
