import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { nav, site, socials } from '../content/portfolio';
import Magnetic from './Magnetic';
import Logo from '../assets/logo.svg';

/**
 * Minimal navigation living around the edges of the viewport:
 *   · logo            — top-left
 *   · menu            — top-right
 *   · section markers — vertical, left edge (tracks the current section)
 *   · social icons    — vertical, right edge
 */
export default function Nav() {
  const header = useRef<HTMLElement>(null);
  const rails = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>('#top');

  useEffect(() => {
    if (header.current) {
      gsap.fromTo(header.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.4, ease: 'power3.out' });
    }
    if (rails.current) {
      gsap.fromTo(rails.current.children, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.8, stagger: 0.1, ease: 'power3.out' });
    }

    // highlight the section currently on screen
    const ids = nav.map((n) => n.href.replace('#', ''));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-7 opacity-0 md:px-12"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
      >
        <Magnetic>
          <a href="#top" aria-label={site.name} className="pointer-events-auto inline-block">
            <img src={Logo} alt={site.name} className="h-10 w-auto" />
          </a>
        </Magnetic>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.slice(1).map((item) => (
            <Magnetic key={item.href} strength={0.25}>
              <a href={item.href} className="lumen-link pointer-events-auto text-xs tracking-widest text-soft uppercase">
                {item.label}
              </a>
            </Magnetic>
          ))}
        </nav>
      </header>

      {/* vertical section rail — left edge */}
      <div
        ref={rails}
        className="fixed top-1/2 left-6 z-50 hidden -translate-y-1/2 flex-col gap-5 lg:flex"
        aria-label="Sections"
      >
        {nav.map((item) => {
          const on = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="group pointer-events-auto flex items-center gap-3"
              aria-current={on ? 'true' : undefined}
            >
              <span
                className="h-px transition-all duration-500"
                style={{
                  width: on ? '28px' : '14px',
                  background: on ? 'var(--color-accent)' : 'var(--color-dim)',
                }}
              />
              <span
                className="font-mono text-[0.6rem] tracking-[0.25em] uppercase transition-colors duration-500"
                style={{ color: on ? 'var(--color-soft)' : 'var(--color-dim)' }}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>

      {/* social icons — right edge */}
      <div className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {socials.map((s) => (
          <Magnetic key={s.label} strength={0.3}>
            <a
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={s.label}
              className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/15 font-mono text-[0.62rem] text-spacegray transition-colors duration-500 hover:border-accent hover:text-soft"
            >
              {s.short}
            </a>
          </Magnetic>
        ))}
        <span className="mt-2 h-14 w-px bg-white/12" aria-hidden="true" />
      </div>
    </>
  );
}
