import { useRef } from 'react';
import { history } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';

/**
 * The journey so far — a clean Swiss timeline. Deeper scroll = deeper in
 * time; the 3D camera is sweeping past Earth and Mars as this reveals.
 */
export default function History() {
  const root = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { y: 70, blur: 14, once: false, start: 'top 82%', perElement: true });

  // original order runs Current → 2016; show most recent first
  const rows = [...history].reverse();

  return (
    <div ref={root}>
      <SectionShell id="Work" eyebrow="01 — Flight log" className="py-[22vh]">
        <h2 data-reveal className="h-display max-w-3xl text-4xl text-soft md:text-6xl">
          Years spent charting new systems.
        </h2>

        <ol className="mt-20 border-t border-white/12">
          {rows.map((entry) => (
            <li
              key={entry.company}
              data-reveal
              className="grid grid-cols-1 gap-2 border-b border-white/12 py-8 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <span className="font-mono text-sm text-accent md:col-span-2">{entry.year}</span>
              <span className="text-xl text-soft md:col-span-5">{entry.title}</span>
              <span className="text-spacegray md:col-span-3">{entry.role}</span>
              <span className="text-spacegray md:col-span-2 md:text-right">{entry.company}</span>
            </li>
          ))}
        </ol>
      </SectionShell>
    </div>
  );
}
