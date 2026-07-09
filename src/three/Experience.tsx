import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useState } from 'react';
import { useUniverse } from '../store/useUniverse';
import BlackHole from './BlackHole';
import Wormhole from './Wormhole';
import AsteroidBelt from './AsteroidBelt';
import CameraRig from './CameraRig';
import JourneyWorlds from './Planets';
import { Andromeda, DeepStars, Nebulae, ShootingStars, Stardust, Starfield, StarTrails, WarpLines } from './Starfield';

/** The fixed, full-screen universe that lives behind the whole document. */
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

  // a lighter universe on mobile — same story, smaller GPU bill
  const starCount = isMobile ? 1600 : 3800;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 1.2, 16], fov: 52, near: 0.1, far: 700 }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 80, 320]} />
        <ambientLight intensity={0.12} />
        {/* one distant key light so planet surfaces show a day/night terminator */}
        <directionalLight position={[24, 30, 14]} intensity={1.1} color="#f4efe2" />

        <Suspense fallback={null}>
          <CameraRig />
          <DeepStars count={isMobile ? 700 : 1600} />
          <Andromeda />
          <Nebulae />
          <Starfield count={starCount} />
          <Stardust count={isMobile ? 320 : 900} />
          <StarTrails count={isMobile ? 140 : 320} />

          <JourneyWorlds />
          <AsteroidBelt count={isMobile ? 70 : 150} />
          <BlackHole />
          <Wormhole />

          {!isMobile && <ShootingStars />}
          <WarpLines />
        </Suspense>

        {!reducedMotion && !isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.9} luminanceThreshold={0.5} luminanceSmoothing={0.87} mipmapBlur />
            <Noise opacity={0.01} />
            <Vignette eskil={false} offset={0.2} darkness={0.9} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
