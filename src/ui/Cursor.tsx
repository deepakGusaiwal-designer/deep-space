import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';

/**
 * The cursor becomes an energy particle: a hot core that snaps to the
 * pointer and a charged halo that trails with momentum. It flares over
 * anything interactive. Desktop / fine pointers only.
 */
export default function Cursor() {
  const core = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const setMouse = useUniverse((s) => s.setMouse);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const c = core.current;
    const h = halo.current;
    if (!c || !h) return;

    c.style.opacity = '1';
    h.style.opacity = '1';

    const xCore = gsap.quickTo(c, 'x', { duration: 0.08, ease: 'power3' });
    const yCore = gsap.quickTo(c, 'y', { duration: 0.08, ease: 'power3' });
    const xHalo = gsap.quickTo(h, 'x', { duration: 0.45, ease: 'power3' });
    const yHalo = gsap.quickTo(h, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e: PointerEvent) => {
      xCore(e.clientX);
      yCore(e.clientY);
      xHalo(e.clientX);
      yHalo(e.clientY);
      setMouse(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };

    const overInteractive = (e: PointerEvent) => {
      const hot = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, textarea, [data-magnetic]',
      );
      gsap.to(h, { scale: hot ? 2.1 : 1, opacity: hot ? 0.9 : 0.55, duration: 0.4, ease: 'power3.out' });
      gsap.to(c, { scale: hot ? 0.4 : 1, duration: 0.4, ease: 'power3.out' });
    };

    const down = () => gsap.to(h, { scale: 0.7, duration: 0.2 });
    const up = () => gsap.to(h, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', overInteractive, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', overInteractive);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [setMouse]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      <div
        ref={halo}
        className="absolute -top-5 -left-5 h-10 w-10 rounded-full opacity-0"
        style={{
          border: '1px solid rgba(255,255,255,0.45)',
          boxShadow: '0 0 24px rgba(232,176,106,0.25), inset 0 0 12px rgba(232,176,106,0.15)',
        }}
      />
      <div
        ref={core}
        className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full opacity-0"
        style={{ background: '#ffffff', boxShadow: '0 0 12px 3px rgba(255,255,255,0.85)' }}
      />
    </div>
  );
}
