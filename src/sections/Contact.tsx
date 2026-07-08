import { useRef } from 'react';
import { site } from '../content/portfolio';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { usePointerGlow } from '../hooks/usePointerGlow';
import Magnetic from '../ui/Magnetic';
import SectionShell from './SectionShell';

/**
 * The final section floats before the golden exit hole — just a
 * floating panel. Sending a message collapses the form into
 * the singularity (Framer Motion handles the state swap; GSAP the collapse).
 */
export default function Contact() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useGsapReveal(root);
  usePointerGlow(panel);


  return (
    <div ref={root}>
      <SectionShell id="Contact" className="flex min-h-[140vh] flex-col items-center justify-center py-[18vh]">
        <p data-reveal className="eyebrow mb-6 text-center">
          the far singularity · transmission
        </p>
        <h2 data-reveal className="h-display text-center text-5xl text-soft md:text-7xl">
          Contact
        </h2>

        {/* original contact links — preserved */}
        <ul data-reveal className="mt-16 flex items-center gap-10">
          <li>
            <Magnetic>
              <a href={`mailto:${site.email}`} className="lumen-link pointer-events-auto font-semibold text-xs tracking-[0.3em] uppercase">
                Email
              </a>
            </Magnetic>
          </li>
          <li>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="lumen-link pointer-events-auto font-semibold text-xs tracking-[0.3em] uppercase">
                Linkedin
              </a>
            </Magnetic>
          </li>
        </ul>

        <footer className="mt-[15vh] text-center">
          <p className="text-md text-shadow-xl tracking-[0.34em] text-slate-100 font-bold uppercase animate-pulse">
            {/* {site.name} · Indore ·  */}
            Sic mundus creatus est
          </p>
        </footer>
      </SectionShell>
    </div>
  );
}
