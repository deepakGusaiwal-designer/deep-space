import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUniverse } from '../store/useUniverse';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, synced with GSAP's ticker and ScrollTrigger.
 * Publishes global progress (0→1) into the universe store, which the
 * Three.js camera rig consumes — scrolling literally flies the camera.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const setProgress = useUniverse((s) => s.setProgress);
  const setVelocity = useUniverse((s) => s.setVelocity);
  const reducedMotion = useUniverse((s) => s.reducedMotion);

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 3.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.42,
      touchMultiplier: 0.85,
    });

    lenis.on('scroll', (e: Lenis) => {
      ScrollTrigger.update();
      const limit = Math.max(1, e.limit);
      setProgress(e.scroll / limit);
      // normalized flight speed — the starfield reads this to draw trails
      setVelocity(Math.max(-1, Math.min(1, e.velocity / 42)));
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor navigation flies through space instead of jumping
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [setProgress, setVelocity, reducedMotion]);

  return <>{children}</>;
}
