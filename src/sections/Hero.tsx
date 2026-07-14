import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { heroLines } from '../content/portfolio';
import Magnetic from '../ui/Magnetic';
import { useUniverse } from '../store/useUniverse';

/**
 * The visitor arrives outside the event horizon. The original hero
 * sentence materializes word-by-word out of gravitational distortion —
 * blurred, stretched, then stabilizing — while the black hole turns behind it.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useUniverse((s) => s.ready);

  useEffect(() => {
    if (!ready || !root.current) return;
    const ctx = gsap.context(() => {
      const words = root.current!.querySelectorAll<HTMLElement>('[data-word]');
      const ctas = root.current!.querySelectorAll<HTMLElement>('[data-cta]');

      gsap.set(words, {
        opacity: 0,
        y: () => gsap.utils.random(30, 90),
        rotateX: () => gsap.utils.random(-50, 50),
        filter: 'blur(16px)',
        letterSpacing: '0.35em',
      });
      gsap.set(ctas, { opacity: 0, y: 46, scale: 0.92, filter: 'blur(8px)' });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to(words, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        letterSpacing: '0em',
        duration: 1.9,
        stagger: { each: 0.045, from: 'random' },
      }).to(
        ctas,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'back.out(1.6)',
          stagger: 0.12,
        },
        '-=1.0',
      );
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      id="top"
      className="pointer-events-none relative z-10 flex md:min-h-[130vh] min-h-screen md:items-center md:pt-0 pt-30"
    >
      <div className="mx-auto w-full px-6 md:px-12">
        <h1
          className="text-xl font-display font-medium leading-[1.05] text-white md:text-2xl lg:text-4xl text-shadow-sm"
          style={{ perspective: '800px' }}
        >
          {heroLines.map((line, li) => (
            <span key={li} className="block mb-2">
              {line.split(' ').map((word, wi) => (
                <span key={`${li}-${wi}`} className="inline-block overflow-visible">
                  <span data-word className="inline-block will-change-transform">
                    {word}
                  </span>
                  {'\u00A0'}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-12 flex flex-wrap items-center gap-5">
          <Magnetic>
            <a data-cta href="#Work" className="grav-btn pointer-events-auto inline-block">
              Cross the horizon
            </a>
          </Magnetic>
          <Magnetic>
            <a data-cta href="#Contact" className="grav-btn pointer-events-auto inline-block">
              Contact
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
