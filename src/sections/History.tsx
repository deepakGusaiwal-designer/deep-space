import { useRef } from 'react';
import { history } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { usePointerGlow } from '../hooks/usePointerGlow';
import type { HistoryEntry } from '../content/portfolio';

function StationPanel({ entry, index }: { entry: HistoryEntry; index: number }) {
  const ref = useRef<HTMLElement>(null);
  usePointerGlow(ref);

  const side = index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto';

  return (
    <article
      ref={ref}
      data-reveal
      className={`holo pointer-events-auto relative w-full max-w-xl p-8 md:p-10 ${side}`}
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="h-display text-4xl text-gold md:text-5xl">{entry.year}</span>
        <span className="eyebrow">station {String(index + 1).padStart(2, '0')} / 04</span>
      </div>
      <div className="grav-line my-6" />
      <p className="text-[0.7rem] tracking-[0.3em] text-slate-100 uppercase">{entry.role}</p>
      <h3 className="mt-3 text-2xl text-soft font-semibold md:text-3xl">{entry.title}</h3>
      <p className="mt-4 text-sm tracking-[0.14em] text-slate-100 uppercase">{entry.company}</p>
    </article>
  );
}

/**
 * Not a timeline — a flight plan. Each company is a station along the
 * descent; the 3D scene lights each one up as the camera passes.
 * Original order preserved: Current → 2016, so scrolling deeper into the
 * black hole is scrolling deeper into time.
 */
export default function History() {
  const root = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { y: 90, blur: 18, once: false, start: 'top 82%', perElement: true });

  return (
    <div ref={root}>
      <SectionShell id="Work" eyebrow="flight log · descent through time" className="py-[16vh]">
        <h2 data-reveal className="h-display mb-20 text-5xl text-soft md:text-7xl">
          History
        </h2>
        <div className="flex flex-col gap-[22vh]">
          {history.map((entry, i) => (
            <StationPanel key={entry.company} entry={entry} index={i} />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
