import { useRef, useState } from 'react';
import { site, socials } from '../content/portfolio';
import { useGsapReveal } from '../hooks/useGsapReveal';
import Magnetic from '../ui/Magnetic';
import SectionShell from './SectionShell';

/**
 * The far side of the wormhole. The camera has plunged through the throat;
 * this section fades into view as the tunnel opens onto a signal terminal —
 * a floating form and the ways to reach out.
 */
export default function Contact() {
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  useGsapReveal(root, { perElement: true });

  return (
    <div ref={root}>
      <SectionShell
        id="Contact"
        eyebrow="04 — Transmission"
        className="flex min-h-screen flex-col items-center py-[20vh]"
      >
        <h2 data-reveal className="h-display text-center text-4xl text-soft md:text-7xl">
          Let’s build something
          <br />
          that feels like flight.
        </h2>

        <form
          data-reveal
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="pointer-events-auto mt-16 w-full max-w-lg space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="field" type="text" name="name" placeholder="Your name" required aria-label="Your name" />
            <input className="field" type="email" name="email" placeholder="Email" required aria-label="Email" />
          </div>
          <textarea className="field min-h-32 resize-none" name="message" placeholder="Your message" aria-label="Your message" />
          <button type="submit" className="grav-btn grav-btn--solid w-full justify-center">
            {sent ? 'Signal sent ✦' : 'Send transmission'}
          </button>
        </form>

        <ul data-reveal className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {socials.map((s) => (
            <li key={s.label}>
              <Magnetic strength={0.25}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="lumen-link pointer-events-auto text-xs font-semibold tracking-[0.3em] uppercase"
                >
                  {s.label}
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>

        <footer data-reveal className="mt-[16vh] text-center">
          <p className="font-mono text-[0.62rem] tracking-[0.34em] text-dim uppercase">
            {site.name} · Indore · {new Date().getFullYear()}
          </p>
        </footer>
      </SectionShell>
    </div>
  );
}
