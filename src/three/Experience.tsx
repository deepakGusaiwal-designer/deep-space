import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useState } from 'react';
import { useUniverse } from '../store/useUniverse';
import BlackHole, { ExitBlackHole } from './BlackHole';
import CameraRig from './CameraRig';
import EventHorizon from './EventHorizon';
import { SkillGalaxy, SolarSystem } from './Planets';
import { Andromeda, DeepStars, Nebulae, ShootingStars, Stardust, Starfield, StarTrails, WarpLines } from './Starfield';

/** The fixed, full-screen universe behind everything. */
export default function Experience() {
  const reducedMotion = useUniverse((s) => s.reducedMotion);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const graphicsQuality = useUniverse((s) => s.graphicsQuality);

  // Compute effective quality tier: Auto resolves based on device capability
  const effectiveQuality =
    graphicsQuality === 'auto'
      ? isMobile
        ? 'medium'
        : 'high'
      : graphicsQuality;

  const isLow = effectiveQuality === 'low';
  const isMedium = effectiveQuality === 'medium';

  // Optimized particle counts and DPR per quality tier
  const starCount = isLow
    ? (isMobile ? 350 : 600)
    : isMedium
      ? (isMobile ? 500 : 1200)
      : (isMobile ? 800 : 2000);

  const dpr: [number, number] = isLow
    ? [1, 1.0]
    : isMedium
      ? [1, 1.1]
      : isMobile
        ? [1, 1.2]
        : [1, 1.25];

  const enableBloom = !reducedMotion && !isMobile && !isLow;

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0.8, 15], fov: 52, near: 0.1, far: 500 }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 60, 240]} />
        <ambientLight intensity={0.1} />
        {/* one distant key light so planet surfaces show a day/night terminator */}
        <directionalLight position={[18, 26, 10]} intensity={0.85} color="#f2ecdf" />

        <Suspense fallback={null}>
          <CameraRig />
          <DeepStars count={isLow ? 150 : isMedium ? 350 : isMobile ? 400 : 800} />
          <Andromeda />
          <Nebulae />
          <Starfield count={starCount} />
          <Stardust count={isLow ? 80 : isMedium ? 200 : isMobile ? 180 : 400} />
          <StarTrails count={isLow ? 30 : isMedium ? 80 : isMobile ? 80 : 160} />
          <SolarSystem />
          <SkillGalaxy />
          {!isMobile && !isLow && <ShootingStars />}
          <BlackHole />
          {/* a distant sun for the testimonial orbit to circle */}
          <group position={[0, 1.2, -122]}>
            <mesh>
              <sphereGeometry args={[0.9, 24, 24]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <pointLight color="#ffffff" intensity={60} distance={40} decay={2} />
          </group>
          <WarpLines />
          <ExitBlackHole />
          {/* last: the crossing veil draws over the whole universe */}
          <EventHorizon />
        </Suspense>

        {enableBloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={isMedium ? 0.45 : 0.65}
              luminanceThreshold={isMedium ? 0.62 : 0.58}
              luminanceSmoothing={0.8}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
