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
  // const [sent, setSent] = useState(false);
  useGsapReveal(root);
  usePointerGlow(panel);

  // const submit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const data = new FormData(e.currentTarget);
  //   const name = String(data.get('name') ?? '');
  //   const message = String(data.get('message') ?? '');
  //   const from = String(data.get('email') ?? '');

  //   // collapse into the singularity, then hand off to the visitor's mail app
  //   const el = panel.current;
  //   const done = () => {
  //     setSent(true);
  //     setContactCollapsed(true);
  //     const body = encodeURIComponent(`${message}\n\n— ${name}${from ? ` (${from})` : ''}`);
  //     window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
  //       `Transmission from ${name || 'your portfolio'}`,
  //     )}&body=${body}`;
  //   };

  //   if (el) {
  //     gsap.to(el, {
  //       scale: 0.001,
  //       rotate: 30,
  //       filter: 'blur(20px) brightness(3)',
  //       duration: 0.9,
  //       ease: 'power4.in',
  //       onComplete: done,
  //     });
  //   } else {
  //     done();
  //   }
  // };

  return (
    <div ref={root}>
      <SectionShell id="Contact" className="flex min-h-[140vh] flex-col items-center justify-center py-[18vh]">
        <p data-reveal className="eyebrow mb-6 text-center">
          the far singularity · transmission
        </p>
        <h2 data-reveal className="h-display text-center text-5xl text-soft md:text-7xl">
          Contact
        </h2>

        {/* <div className="relative mt-16 w-full max-w-lg hidden">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                ref={panel}
                data-reveal
                className="holo pointer-events-auto p-8 md:p-10"
                exit={{ opacity: 0 }}
              >
                <form onSubmit={submit} className="flex flex-col gap-7">
                  <label className="block">
                    <span className="eyebrow">name</span>
                    <input name="name" required autoComplete="name" className="field mt-2" placeholder="Who's calling across space?" />
                  </label>
                  <label className="block">
                    <span className="eyebrow">email</span>
                    <input name="email" type="email" required autoComplete="email" className="field mt-2" placeholder="Where can the signal return?" />
                  </label>
                  <label className="block">
                    <span className="eyebrow">message</span>
                    <textarea name="message" required rows={4} className="field mt-2 resize-none" placeholder="Write your transmission…" />
                  </label>
                  <Magnetic>
                    <button type="submit" className="grav-btn w-full">
                      Send into the singularity
                    </button>
                  </Magnetic>
                  <p className="text-center font-mono text-[0.6rem] tracking-[0.24em] text-dim uppercase">
                    opens your mail app — nothing is stored
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                className="pointer-events-none text-center"
                initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  aria-hidden="true"
                  className="mx-auto mb-8 h-2 w-2 rounded-full"
                  style={{ background: '#ffffff', boxShadow: '0 0 60px 24px rgba(255,255,255,0.45)' }}
                />
                <p className="h-display text-2xl text-goldlight md:text-3xl">Transmission away.</p>
                <p className="mt-4 text-sm text-spacegray">Your signal is past the event horizon now.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}

        {/* original contact links — preserved */}
        <ul data-reveal className="mt-16 flex items-center gap-10">
          <li>
            <Magnetic>
              <a href={`mailto:${site.email}`} className="lumen-link pointer-events-auto font-mono text-xs tracking-[0.3em] uppercase">
                Email
              </a>
            </Magnetic>
          </li>
          <li>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="lumen-link pointer-events-auto font-mono text-xs tracking-[0.3em] uppercase">
                Linkedin
              </a>
            </Magnetic>
          </li>
        </ul>

        <footer className="mt-[16vh] text-center">
          <p className="font-mono text-[0.6rem] tracking-[0.34em] text-dim uppercase">
            {site.name} · Indore · the journey ends at the second horizon
          </p>
        </footer>
      </SectionShell>
    </div>
  );
}
