import { useRef } from 'react';
import { site } from '../content/portfolio';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { usePointerGlow } from '../hooks/usePointerGlow';
import Magnetic from '../ui/Magnetic';
import SectionShell from './SectionShell';
import { Rocket } from 'lucide-react';

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
    <div ref={root} className="relative z-20">
      <SectionShell
        id="Contact"
        passthrough={false}
        className="flex min-h-[120vh] sm:min-h-[140vh] flex-col items-center justify-center py-[12vh] sm:py-[18vh] pointer-events-auto"
      >
        <p data-reveal className="eyebrow mb-4 sm:mb-6 text-center select-none">
          the far singularity · transmission
        </p>
        <h2 data-reveal className="h-display text-center text-3xl sm:text-5xl md:text-7xl text-soft flex items-center select-none">
          <Rocket className="mr-2.5 sm:mr-3 inline size-7 sm:size-10 md:size-14" />
          Contact
        </h2>

        {/* original contact links — preserved */}
        <ul data-reveal className="mt-12 sm:mt-16 flex items-center gap-6 sm:gap-10 relative z-30 pointer-events-auto">
          <li>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="lumen-link pointer-events-auto cursor-pointer font-semibold text-[11px] sm:text-xs tracking-[0.22em] sm:tracking-[0.3em] uppercase inline-block"
              >
                Email
              </a>
            </Magnetic>
          </li>
          <li>
            <Magnetic>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="lumen-link pointer-events-auto cursor-pointer font-semibold text-[11px] sm:text-xs tracking-[0.22em] sm:tracking-[0.3em] uppercase inline-block"
              >
                Linkedin
              </a>
            </Magnetic>
          </li>
        </ul>

        {/* Bottom Legal & Thoughts Navigation Links */}
        <div
          data-reveal
          className="mt-10 flex flex-wrap justify-center items-center gap-5 sm:gap-7 text-xs font-mono tracking-wider uppercase text-soft/80 relative z-30 pointer-events-auto"
        >
          <Magnetic strength={0.25}>
            <a
              href="/blogs/"
              className="lumen-link pointer-events-auto cursor-pointer py-1 text-soft/80 hover:text-white transition-colors"
            >
              Thoughts
            </a>
          </Magnetic>
          <span className="text-white/30 select-none">·</span>
          <Magnetic strength={0.25}>
            <a
              href="/privacy/"
              className="lumen-link pointer-events-auto cursor-pointer py-1 text-soft/80 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </Magnetic>
          <span className="text-white/30 select-none">·</span>
          <Magnetic strength={0.25}>
            <a
              href="/terms/"
              className="lumen-link pointer-events-auto cursor-pointer py-1 text-soft/80 hover:text-white transition-colors"
            >
              Terms & Conditions
            </a>
          </Magnetic>
        </div>

        <footer className="mt-[8vh] sm:mt-[12vh] text-center relative z-30 pointer-events-auto select-none">
          <p className="text-xs sm:text-sm md:text-base text-shadow-xl tracking-[0.25em] sm:tracking-[0.34em] text-slate-100 font-bold uppercase animate-pulse">
            Sic mundus creatus est
          </p>
        </footer>
      </SectionShell>
    </div>
  );
}
