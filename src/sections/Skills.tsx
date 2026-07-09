import { useRef } from 'react';
import { disciplines } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';

/**
 * Craft — the disciplines and their tools, as a clean high-contrast grid.
 * Reveals while the camera threads the asteroid belt and banks toward Saturn.
 */
export default function Skills() {
  const root = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { once: false, perElement: true, start: 'top 84%' });

  return (
    <div ref={root}>
      <SectionShell id="Skill" eyebrow="02 — Craft" className="py-[22vh]">
        <h2 data-reveal className="h-display max-w-3xl text-4xl text-soft md:text-6xl">
          Five disciplines, one continuum.
        </h2>
        <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-spacegray">
          From first frame to final deploy — photography, motion, experience design,
          engineering, and real-time 3D.
        </p>

        <ul className="mt-20 grid gap-px overflow-hidden border border-white/12 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((disc, i) => (
            <li
              key={disc.name}
              data-reveal
              className="group bg-void p-8 transition-colors duration-500 hover:bg-white/[0.04]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-spacegray transition-colors duration-500 group-hover:bg-accent"
                />
              </div>
              <h3 className="mt-8 text-2xl text-soft">{disc.name}</h3>
              <p className="mt-4 text-sm leading-loose tracking-wide text-spacegray">
                {disc.tools.join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      </SectionShell>
    </div>
  );
}
