import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { nav, site } from '../content/portfolio';
import Magnetic from './Magnetic';
import Logo from '../assets/logo.svg';

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, delay: 2.6, ease: 'power3.out' },
    );
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-8 opacity-0 md:px-12"
      style={{
        background: 'linear-gradient(to bottom, rgba(5,5,5,0.75), transparent)',
      }}
    >
      <Magnetic>
        <a href="#top" className="font-display text-sm font-bold tracking-[0.28em] uppercase" aria-label={site.name}>
          <img src={Logo} alt="Logo" className="h-12 w-auto" />
          {/* Deepak&nbsp;Gusaiwal */}
        </a>
      </Magnetic>

      <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
        {nav.map((item) => (
          <Magnetic key={item.href} strength={0.25}>
            <a href={item.href} className="lumen-link text-xs tracking-widest uppercase text-white">
              {item.label}
            </a>
          </Magnetic>
        ))}
      </nav>

      <Magnetic>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noreferrer"
          className="lumen-link text-xs tracking-widest uppercase text-white"
        >
          LinkedIn ↗
        </a>
      </Magnetic>
    </header>
  );
}
