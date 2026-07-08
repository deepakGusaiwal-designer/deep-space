import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';

const PHRASES = [
  'Deep-diving into space…',
  'Charting the event horizon…',
  'Compiling stardust…',
  'Calibrating gravity wells…',
  'Aligning the star charts…',
  'Stabilizing the wormhole…',
];

/**
 * Approach sequence. A percentage counts up through a rotation of
 * space-themed status lines, then hands off to the visitor: only their
 * click opens the wormhole and lets the universe begin.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const entering = useRef(false);
  const setReady = useUniverse((s) => s.setReady);

  useEffect(() => {
    const counter = { v: 0 };
    document.documentElement.classList.add('overflow-hidden');

    const tl = gsap.timeline({ onComplete: () => setArrived(true) });
    tl.to(counter, {
      v: 100,
      duration: 2.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = `${Math.round(counter.v)}%`;
        const idx = Math.min(PHRASES.length - 1, Math.floor((counter.v / 100) * PHRASES.length));
        setPhrase((p) => (p === PHRASES[idx] ? p : PHRASES[idx]));
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!arrived) return;
    gsap.fromTo(
      '[data-arrive]',
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.08 },
    );
  }, [arrived]);

  const enter = () => {
    if (entering.current) return;
    entering.current = true;
    const reducedMotion = useUniverse.getState().reducedMotion;

    const finish = () => {
      setReady(true);
      setGone(true);
      document.documentElement.classList.remove('overflow-hidden');
    };

    if (reducedMotion) {
      gsap.to(wrap.current, { opacity: 0, duration: 0.4, onComplete: finish });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.to('[data-arrive]', { opacity: 0, y: -10, filter: 'blur(8px)', duration: 0.35, ease: 'power2.in' })
      .fromTo(
        burst.current,
        { opacity: 0, scale: 0.15, rotate: 0 },
        { opacity: 1, scale: 1, rotate: 130, duration: 1.05, ease: 'power3.in' },
        '-=0.05',
      )
      .to(burst.current, { scale: 2.4, opacity: 0, rotate: 210, duration: 0.85, ease: 'power2.out' })
      .to(wrap.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.55');
  };

  if (gone) return null;
  return (
    <div ref={wrap} className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-void">
      <div ref={burst} className="preloader-burst" aria-hidden="true" />
      <div className="relative text-center">
        <span ref={num} className="h-display block text-6xl text-soft md:text-8xl">
          0%
        </span>
        <p className="eyebrow mt-6 min-h-[1em]">{arrived ? 'the wormhole is open' : phrase}</p>

        {arrived && (
          <button
            type="button"
            data-arrive
            onClick={enter}
            className="grav-btn pointer-events-auto mt-10 inline-block"
          >
            Enter the void
          </button>
        )}
      </div>
    </div>
  );
}
