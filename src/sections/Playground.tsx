import { useRef } from 'react';
import { playground, type PlaygroundItem } from '../content/portfolio';
import SectionShell from './SectionShell';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { usePointerGlow } from '../hooks/usePointerGlow';
import { FlaskConical, Gamepad2, ArrowUpRight, Plus } from 'lucide-react';

/**
 * The plate. With no `image`, it's a generated nebula-tinted panel — same
 * procedural-art ethos as the rest of the site, just in DOM/CSS. With an
 * `image`, that photo fills it instead, and hovering the card dissolves it
 * into a coarse pixel mosaic: a second copy of the same image, decoded at
 * a handful of pixels and scaled back up (image-rendering: pixelated),
 * sitting at opacity 0 until hover fades it in over the sharp one.
 */
function Plate({ item }: { item: PlaygroundItem }) {
  const isGame = item.href === '/game/';

  return (
    <div className="play-plate" style={{ '--hue': item.hue } as React.CSSProperties}>
      {item.image ? (
        <>
          <img src={item.image} alt="" className="play-plate__sharp" />
          <div className="play-plate__pixel" aria-hidden="true">
            <img src={item.image} alt="" />
          </div>
          <div className="play-plate__scan" aria-hidden="true" />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {item.href ? (
            isGame ? (
              <Gamepad2 className="size-10 text-soft/80 md:size-12" strokeWidth={1.3} />
            ) : (
              <ArrowUpRight className="size-10 text-soft/80 md:size-12" strokeWidth={1.3} />
            )
          ) : (
            <Plus className="size-9 text-dim md:size-10" strokeWidth={1.3} />
          )}
        </div>
      )}
      <span className="play-tag">{item.tag}</span>
    </div>
  );
}

function PlayCard({ item }: { item: PlaygroundItem }) {
  const ref = useRef<HTMLElement>(null);
  usePointerGlow(ref);
  const isGhost = !item.href;

  const body = (
    <>
      <Plate item={item} />
      <div className="grav-line my-5" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="h-display text-xl text-soft md:text-2xl">{item.title}</h3>
        {item.href && (
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 text-dim transition-colors group-hover:text-goldlight"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-100">{item.blurb}</p>
    </>
  );

  const className = `play-card holo group pointer-events-auto block h-full p-4 will-change-transform md:p-5 ${
    isGhost ? 'play-card--ghost' : ''
  }`;

  if (item.href) {
    const external = item.href.startsWith('http');
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        data-reveal
        href={item.href}
        className={className}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <article ref={ref} data-reveal className={className} aria-label={`${item.tag}: ${item.title}`}>
      {body}
    </article>
  );
}

/**
 * "Playground" — not the day job. Weekend builds, game jams, things made
 * because it was Sunday. GRAVITY is real; the open slots stay honest as
 * "coming soon" rather than pretend to be finished projects.
 */
export default function Playground() {
  const root = useRef<HTMLDivElement>(null);
  useGsapReveal(root, { once: false, perElement: true });

  return (
    <div ref={root}>
      <SectionShell id="Playground" eyebrow="off the clock · things built for fun" className="py-[16vh]">
        <h2 data-reveal className="h-display text-5xl text-soft md:text-7xl flex items-center">
          <FlaskConical className="mr-3 inline md:size-15 size-8" />
          Playground
        </h2>
        <p data-reveal className="mt-2 max-w-lg text-sm leading-relaxed text-slate-100">
          Not client work — the stuff that happens between projects, just to see what breaks.
        </p>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {playground.map((item) => (
            <li key={item.title + item.tag}>
              <PlayCard item={item} />
            </li>
          ))}
        </ul>
      </SectionShell>
    </div>
  );
}
