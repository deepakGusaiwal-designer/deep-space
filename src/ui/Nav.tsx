import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, site } from '../content/portfolio';
import Magnetic from './Magnetic';
import Logo from '../assets/logo.svg';
import { Telescope, MoreVertical, X, ArrowUpRight, Mail } from 'lucide-react';

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, delay: 2.6, ease: 'power3.out' },
    );
  }, []);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    if (drawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 opacity-0 md:px-12 md:py-8"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.85), transparent)',
        }}
      >
        <Magnetic>
          <a
            href="#top"
            className="font-display text-sm font-bold tracking-[0.28em] uppercase"
            aria-label={site.name}
            onClick={handleLinkClick}
          >
            <img src={Logo} alt="Logo" className="h-10 w-auto md:h-12" />
          </a>
        </Magnetic>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          <Magnetic strength={0.25}>
            <a
              href="https://www.deepakgusaiwal.com/2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-white hover:text-white/80 transition-colors"
            >
              2025
            </a>
          </Magnetic>
          {nav.map((item) => (
            <Magnetic key={item.href} strength={0.25}>
              <a
                href={item.href}
                className="text-xs tracking-widest uppercase text-white hover:text-white/80 transition-colors"
              >
                {item.label}
              </a>
            </Magnetic>
          ))}
        </nav>

        {/* Desktop LinkedIn CTA */}
        <div className="hidden md:block">
          <Magnetic>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest uppercase text-white hover:text-white/80 transition-colors flex items-center"
            >
              <Telescope className="mr-2 inline size-5" />
              LinkedIn
            </a>
          </Magnetic>
        </div>

        {/* Mobile 3-Dot Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-lg text-white shadow-lg transition-all duration-300 active:scale-95 hover:border-white/40 hover:bg-white/15"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Drawer Content Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 flex h-full w-[82vw] max-w-sm flex-col justify-between border-l border-white/15 bg-[#0a0b0d]/95 p-6 shadow-2xl backdrop-blur-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Drawer"
            >
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={Logo} alt="Logo" className="h-8 w-auto" />
                    <span className="font-display text-xs font-bold tracking-[0.2em] text-soft uppercase">
                      Menu
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white active:scale-95"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grav-line my-6" />

                {/* Navigation Items */}
                <nav className="flex flex-col gap-2" aria-label="Mobile Primary">
                  <motion.a
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 }}
                    href="https://www.deepakgusaiwal.com/2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="group flex items-center justify-between rounded-xl border border-transparent p-3.5 text-soft transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-wider text-dim">01</span>
                      <span className="font-display text-base font-semibold tracking-wider uppercase">
                        2025
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-dim transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </motion.a>

                  {nav.map((item, idx) => (
                    <motion.a
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.04 }}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="group flex items-center justify-between rounded-xl border border-transparent p-3.5 text-soft transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-wider text-dim">
                          {String(idx + 2).padStart(2, '0')}
                        </span>
                        <span className="font-display text-base font-semibold tracking-wider uppercase">
                          {item.label}
                        </span>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-150 group-hover:bg-gold" />
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div>
                <div className="grav-line mb-6" />
                <div className="flex flex-col gap-3">
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleLinkClick}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs font-semibold tracking-widest text-soft uppercase transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Telescope className="size-4 text-soft" />
                      LinkedIn
                    </span>
                    <ArrowUpRight className="size-4 text-dim" />
                  </a>

                  <a
                    href={`mailto:${site.email}`}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs font-semibold tracking-widest text-soft uppercase transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="size-4 text-soft" />
                      Email
                    </span>
                    <ArrowUpRight className="size-4 text-dim" />
                  </a>
                </div>

                <p className="mt-6 text-center font-mono text-[10px] tracking-widest text-dim uppercase">
                  {site.name} · Indore
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
