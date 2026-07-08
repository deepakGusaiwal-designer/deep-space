import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import CameraRig from './CameraRig';
import BlackHole, { ExitBlackHole } from './BlackHole';
import { Starfield, WarpLines, Nebulae, ShootingStars } from './Starfield';
import { useUniverse } from '../store/useUniverse';

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

  // simplified universe on mobile — same story, lighter GPU bill
  const starCount = isMobile ? 1600 : 3800;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        camera={{ position: [0, 0.8, 15], fov: 52, near: 0.1, far: 600 }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 60, 240]} />
        <ambientLight intensity={0.12} />

        <Suspense fallback={null}>
          <CameraRig />
          <Nebulae />
          <Starfield count={starCount} />
          {!isMobile && <ShootingStars />}
          <BlackHole />
          {/* a distant sun for the testimonial orbit to circle */}
          <group position={[0, 1.2, -122]}>
            <mesh>
              <sphereGeometry args={[0.9, 32, 32]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <pointLight color="#ffffff" intensity={60} distance={40} decay={2} />
          </group>
          <WarpLines />
          <ExitBlackHole />
        </Suspense>

        {!reducedMotion && !isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.95}
              luminanceThreshold={0.52}
              luminanceSmoothing={0.87}
              mipmapBlur
            />
            <Noise opacity={0.010} />
            <Vignette eskil={false} offset={0.15} darkness={0.8} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
