import { useEffect, useRef } from 'react';
import { testimonials } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { Radio } from 'lucide-react';

const RADIUS = 340;

/**
 * Three voices in orbit around a small star. The ring auto-rotates;
 * dragging anywhere on it changes the orbit with momentum. Cards gain
 * light, scale and focus as they swing to the front — true depth.
 */
export default function Testimonials() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { once: false });

  useEffect(() => {
    const ringEl = ring.current;
    if (!ringEl) return;
    const cards = Array.from(ringEl.querySelectorAll<HTMLElement>('[data-orbit]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let angle = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let raf = 0;

    const layout = () => {
      const n = cards.length;
      const mobile = window.innerWidth < 768;
      const radius = mobile ? 190 : RADIUS;
      cards.forEach((card, i) => {
        const a = angle + (i / n) * Math.PI * 2;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        const front = (z / radius + 1) / 2; // 0 back → 1 front
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, 0) scale(${0.72 + front * 0.34})`;
        card.style.opacity = `${0.25 + front * 0.75}`;
        card.style.zIndex = `${Math.round(front * 100)}`;
        card.style.filter = `blur(${(1 - front) * 3.5}px)`;
      });
    };

    const tick = () => {
      if (!dragging) {
        angle += reduced ? 0 : 0.0022 + velocity;
        velocity *= 0.95;
      }
      layout();
      raf = requestAnimationFrame(tick);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      ringEl.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      angle += dx * 0.006;
      velocity = dx * 0.0009;
      layout();
    };
    const up = () => {
      dragging = false;
    };

    ringEl.addEventListener('pointerdown', down);
    ringEl.addEventListener('pointermove', move);
    ringEl.addEventListener('pointerup', up);
    ringEl.addEventListener('pointercancel', up);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ringEl.removeEventListener('pointerdown', down);
      ringEl.removeEventListener('pointermove', move);
      ringEl.removeEventListener('pointerup', up);
      ringEl.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <div ref={root}>
      <SectionShell id="Testimonial" eyebrow="signals received · three transmissions" className="py-[12vh] sm:py-[16vh]">
        <h2 data-reveal className="h-display text-3xl sm:text-5xl md:text-7xl text-soft flex items-center">
          <Radio className="mr-2.5 sm:mr-3 inline size-7 sm:size-10 md:size-14" />
          Testimonials
        </h2>

        <div
          ref={ring}
          className="pointer-events-auto relative mx-auto mt-12 sm:mt-16 h-[26rem] sm:h-[30rem] w-full max-w-4xl touch-pan-y select-none md:h-[26rem]"
          style={{ perspective: '1200px' }}
          role="group"
          aria-label="Testimonials orbit — drag to rotate"
        >
          {/* the central star */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-2.5 w-2.5 sm:h-3 sm:w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: '#ffffff',
              boxShadow: '0 0 40px 14px rgba(232,176,106,0.45), 0 0 120px 50px rgba(232,176,106,0.12)',
            }}
          />
          {testimonials.map((t) => (
            <figure
              key={t.name}
              data-orbit
              className="holo absolute top-1/2 left-1/2 w-[16.5rem] p-5 sm:w-[19rem] sm:p-7 will-change-transform md:w-[23rem]"
            >
              <blockquote className="text-xs sm:text-sm leading-relaxed text-white">“{t.quote}”</blockquote>
              <figcaption className="mt-4 sm:mt-6">
                <p className="h-display text-sm sm:text-base text-goldlight">{t.name}</p>
                <p className="mt-1 font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.16em] sm:tracking-[0.18em] text-white uppercase">
                  {t.position}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p data-reveal className="mt-6 sm:mt-8 text-center font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.3em] sm:tracking-[0.34em] text-dim uppercase">
          drag to change orbit
        </p>
      </SectionShell>
    </div>
  );
}
