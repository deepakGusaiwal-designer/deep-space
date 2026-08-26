import { useRef } from 'react';
import { disciplines } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useUniverse } from '../store/useUniverse';
import { EarthLock } from 'lucide-react';

/**
 * DOM layer for the skill galaxy. The five disciplines and their tools are
 * always visible as cards; hovering a card highlights its planet in the 3D
 * scene, and hovering a planet highlights its card — one system, two layers.
 */
export default function WhatIDo() {
  const root = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { once: false });
  const hovered = useUniverse((s) => s.hoveredPlanet);
  const setHoveredPlanet = useUniverse((s) => s.setHoveredPlanet);

  return (
    <div ref={root}>
      <SectionShell id="Skill" eyebrow="skill system · field readout" className="min-h-[120vh] py-[12vh] sm:py-[16vh]">
        <h2 data-reveal className="h-display text-3xl sm:text-5xl md:text-7xl text-soft flex items-center">
          <EarthLock className="mr-2.5 sm:mr-3 inline size-7 sm:size-10 md:size-14" />
          What I do
        </h2>
        <p data-reveal className="mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-slate-100">
          Five disciplines, drifting through deep space between the horizon and the exit.
        </p>

        {/* the galaxy occupies the middle of the viewport — cards sit below it */}
        <ul className="mt-16 sm:mt-24 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((disc, i) => {
            const active = hovered === i;
            return (
              <li
                key={disc.name}
                className="pointer-events-auto"
                onPointerEnter={() => setHoveredPlanet(i)}
                onPointerLeave={() => setHoveredPlanet(null)}
              >
                <div
                  className="holo h-full p-4 sm:p-6 will-change-transform"
                  style={{
                    borderColor: active ? disc.emissive : undefined,
                    boxShadow: active ? `0 0 34px -8px ${disc.emissive}66` : undefined,
                    transform: active ? 'translateY(-6px)' : 'translateY(0)',
                    opacity: hovered === null || active ? 1 : 0.5,
                    transition:
                      'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
                  }}
                >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className="block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-500"
                    style={{
                      background: disc.emissive,
                      boxShadow: active ? `0 0 16px 3px ${disc.emissive}88` : `0 0 8px 1px ${disc.emissive}44`,
                    }}
                  />
                  <h3 className="text-base sm:text-xl font-semibold" style={{ color: active ? disc.emissive : '#f5f3ee' }}>
                    {disc.name}
                  </h3>
                  </div>
                  <div className="grav-line my-3 sm:my-4" />
                  <p className="text-[11px] sm:text-xs font-medium leading-relaxed sm:leading-loose tracking-wider text-slate-200 uppercase">
                    {disc.tools.join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionShell>
    </div>
  );
}
