import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';

/**
 * The cursor becomes an energy particle: a hot core that snaps to the
 * pointer and a charged halo that trails with momentum. It flares over
 * anything interactive. Works across all mouse/pointer devices.
 */
export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const haloInnerRef = useRef<HTMLDivElement>(null);
  const coreInnerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const setMouse = useUniverse((s) => s.setMouse);

  useEffect(() => {
    const core = coreRef.current;
    const halo = haloRef.current;
    const haloInner = haloInnerRef.current;
    const coreInner = coreInnerRef.current;
    if (!core || !halo || !haloInner || !coreInner) return;

    let isVisible = false;

    // Set initial position off-screen
    gsap.set([core, halo], { x: -100, y: -100, opacity: 0 });

    const xCore = gsap.quickTo(core, 'x', { duration: 0.04, ease: 'power3' });
    const yCore = gsap.quickTo(core, 'y', { duration: 0.04, ease: 'power3' });
    const xHalo = gsap.quickTo(halo, 'x', { duration: 0.22, ease: 'power3' });
    const yHalo = gsap.quickTo(halo, 'y', { duration: 0.22, ease: 'power3' });

    const WORLD_SENSITIVITY = 0.42;

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        setVisible(true);
        document.body.classList.add('custom-cursor-active');
        gsap.to([core, halo], { opacity: 1, duration: 0.25, overwrite: 'auto' });
      }
    };

    const hideCursor = () => {
      if (isVisible) {
        isVisible = false;
        setVisible(false);
        document.body.classList.remove('custom-cursor-active');
        gsap.to([core, halo], { opacity: 0, duration: 0.25, overwrite: 'auto' });
      }
    };

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      // Don't show custom cursor for pure touch taps
      if ('pointerType' in e && e.pointerType === 'touch') {
        hideCursor();
        return;
      }

      showCursor();

      xCore(e.clientX);
      yCore(e.clientY);
      xHalo(e.clientX);
      yHalo(e.clientY);

      setMouse(
        ((e.clientX / window.innerWidth) * 2 - 1) * WORLD_SENSITIVITY,
        ((e.clientY / window.innerHeight) * 2 - 1) * WORLD_SENSITIVITY,
      );
    };

    const onPointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hot = target.closest(
        'a, button, [role="button"], input, textarea, label, [data-magnetic], .play-card, .holo, .game-link, .audio-toggle',
      );
      if (hot) {
        gsap.to(haloInner, {
          scale: 1.8,
          opacity: 0.95,
          borderColor: 'rgba(255, 255, 255, 0.85)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(coreInner, {
          scale: 0.5,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(haloInner, {
          scale: 1,
          opacity: 0.6,
          borderColor: 'rgba(255, 255, 255, 0.45)',
          backgroundColor: 'transparent',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(coreInner, {
          scale: 1,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    const onPointerDown = () => {
      gsap.to(haloInner, { scale: 0.7, duration: 0.15, overwrite: 'auto' });
      gsap.to(coreInner, { scale: 1.5, duration: 0.15, overwrite: 'auto' });
    };

    const onPointerUp = () => {
      gsap.to(haloInner, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      gsap.to(coreInner, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.documentElement.addEventListener('mouseleave', hideCursor);
    document.documentElement.addEventListener('mouseenter', showCursor);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('mouseleave', hideCursor);
      document.documentElement.removeEventListener('mouseenter', showCursor);
    };
  }, [setMouse]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
      style={{ display: visible ? 'block' : 'none' }}
      aria-hidden="true"
    >
      {/* Outer Halo */}
      <div
        ref={haloRef}
        className="pointer-events-none absolute top-0 left-0 will-change-transform"
      >
        <div
          ref={haloInnerRef}
          className="h-10 w-10 rounded-full border border-white/45"
          style={{
            marginLeft: '-20px',
            marginTop: '-20px',
            boxShadow: '0 0 24px rgba(255, 255, 255, 0.25), inset 0 0 12px rgba(255, 255, 255, 0.15)',
          }}
        />
      </div>

      {/* Center Core */}
      <div
        ref={coreRef}
        className="pointer-events-none absolute top-0 left-0 will-change-transform"
      >
        <div
          ref={coreInnerRef}
          className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.9)]"
          style={{
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
        />
      </div>
    </div>
  );
}
