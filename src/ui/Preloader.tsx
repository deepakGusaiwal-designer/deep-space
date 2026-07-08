import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';

/**
 * Approach sequence. A percentage counts to 100% (a nod to the original
 * site's loader) while the universe compiles, then the veil collapses
 * into the singularity.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const setReady = useUniverse((s) => s.setReady);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setReady(true);
        setGone(true);
        document.documentElement.classList.remove('overflow-hidden');
      },
    });
    document.documentElement.classList.add('overflow-hidden');

    tl.to(counter, {
      v: 100,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = `${Math.round(counter.v)}%`;
      },
    })
      .to(num.current, { scale: 0.6, filter: 'blur(10px)', opacity: 0, duration: 0.7, ease: 'power3.in' }, '-=0.1')
      .to(wrap.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.3');

    return () => {
      tl.kill();
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [setReady]);

  if (gone) return null;
  return (
    <div ref={wrap} className="fixed inset-0 z-[90] flex items-center justify-center bg-void">
      <div className="text-center">
        <span ref={num} className="h-display block text-6xl text-soft md:text-8xl">
          0%
        </span>
        <p className="eyebrow mt-6">approaching the event horizon</p>
      </div>
    </div>
  );
}
