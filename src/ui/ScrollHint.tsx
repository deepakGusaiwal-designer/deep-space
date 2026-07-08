import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../content/portfolio';
import { useUniverse } from '../store/useUniverse';

/** The original "Scroll to Explore ➊" — now orbiting the bottom edge. */
export default function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, delay: 3.4, duration: 1.2, ease: 'power3.out' });
    const unsub = useUniverse.subscribe((s) => {
      el.style.opacity = s.progress > 0.03 ? '0' : '';
      el.style.transition = 'opacity 0.6s ease';
    });
    return () => unsub();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center"
      aria-hidden="true"
    >
      <span className="animate-pulse text-slate-100">{site.scrollHint}</span>
    </div>
  );
}
