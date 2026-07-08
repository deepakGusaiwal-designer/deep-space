import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';

/**
 * Wraps any element in a small gravitational field — it drifts toward
 * the cursor and springs back with elastic overshoot when released.
 */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
  };

  return (
    <div ref={ref} data-magnetic className="inline-block will-change-transform" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
