import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { interlude } from '../content/portfolio';

gsap.registerPlugin(ScrollTrigger);

/**
 * The deepest point before the galaxy. Time dilates: the camera nearly
 * stops, and the site's original tagline stretches across spacetime,
 * scrubbing letter-spacing and scale directly against the scrollbar.
 */
export default function Interlude() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>('[data-stretch]');
      gsap.fromTo(
        words,
        { letterSpacing: '0.9em', opacity: 0, scale: 1.25, filter: 'blur(10px)' },
        {
          letterSpacing: '0.02em',
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'center 45%',
            scrub: 1.2,
          },
        },
      );
      gsap.to(el, {
        opacity: 0,
        filter: 'blur(14px)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'bottom 55%',
          end: 'bottom 15%',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="pointer-events-none relative z-10 flex min-h-[160vh] items-center justify-center"
      aria-label={`${interlude.from} ${interlude.a} ${interlude.to} ${interlude.b}`}
    >
      <h2 className="h-display px-6 text-center text-4xl leading-tight uppercase text-soft sm:text-6xl md:text-8xl">
        <span data-stretch className="block text-white">
          {interlude.from}
        </span>
        <span data-stretch className="block text-goldlight" style={{ textShadow: '0 0 60px rgba(232,176,106,0.4)' }}>
          {interlude.a}
        </span>
        <span data-stretch className="block text-slate-32">
          {interlude.to}
        </span>
        <span data-stretch className="block text-white" style={{ textShadow: '0 0 60px rgba(111,143,201,0.4)' }}>
          {interlude.b}
        </span>
      </h2>
    </section>
  );
}
