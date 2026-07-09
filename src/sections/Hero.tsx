import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { hero } from '../content/portfolio';
import Magnetic from '../ui/Magnetic';
import { useUniverse } from '../store/useUniverse';

/**
 * The arrival. Centre content floats over the composed tableau — Earth
 * upper-left, Mars centre, Saturn lower-left, the black hole massive
 * upper-right, the wormhole lower-right, the belt slashing between. The
 * headline resolves word-by-word out of gravitational blur.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useUniverse((s) => s.ready);

  useEffect(() => {
    if (!ready || !root.current) return;
    const ctx = gsap.context(() => {
      const sub = root.current!.querySelectorAll<HTMLElement>('[data-sub]');
      const words = root.current!.querySelectorAll<HTMLElement>('[data-word]');
      const tail = root.current!.querySelectorAll<HTMLElement>('[data-tail]');

      gsap.set(sub, { opacity: 0, y: 18 });
      gsap.set(words, {
        opacity: 0,
        y: () => gsap.utils.random(24, 70),
        filter: 'blur(14px)',
        letterSpacing: '0.3em',
      });
      gsap.set(tail, { opacity: 0, y: 30, filter: 'blur(6px)' });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to(sub, { opacity: 1, y: 0, duration: 1.1 })
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            letterSpacing: '0em',
            duration: 1.6,
            stagger: { each: 0.05, from: 'start' },
          },
          '-=0.6',
        )
        .to(tail, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.12 }, '-=0.9');
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      id="top"
      className="pointer-events-none relative z-10 flex min-h-[100vh] items-center"
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <p data-sub className="eyebrow mb-7 text-accent">
          {hero.subtitle}
        </p>

        <h1 className="h-display text-white text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
          {hero.headline.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              {line.split(' ').map((word, wi) => (
                <span key={`${li}-${wi}`} className="inline-block overflow-hidden">
                  <span data-word className="inline-block will-change-transform">
                    {word}
                  </span>
                  {' '}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p data-tail className="mt-9 max-w-xl text-base leading-relaxed text-spacegray md:text-lg">
          {hero.description}
        </p>

        <div data-tail className="mt-11 flex flex-wrap items-center gap-5">
          <Magnetic>
            <a data-cta href={hero.primary.href} className="grav-btn grav-btn--solid pointer-events-auto inline-block">
              {hero.primary.label}
            </a>
          </Magnetic>
          <Magnetic>
            <a data-cta href={hero.secondary.href} className="grav-btn pointer-events-auto inline-block">
              {hero.secondary.label}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
