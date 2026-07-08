import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { startSpaceAudio, playWormholeWhoosh } from '../audio/spaceAudio';

const PHRASES = [
  'Before time: a singularity…',
  'Priming the big bang…',
  'Forging the first stardust…',
  'Condensing the nebulae…',
  'Spinning up the galaxies…',
  'Aligning the wormhole…',
];

const RING_COUNT = 6;

/**
 * Approach sequence. A percentage counts up through a rotation of
 * space-themed status lines, then hands off to the visitor: their click
 * opens a wormhole — rings of light rush past, the veil turns transparent
 * mid-flight so the real universe is already warping underneath, and the
 * ambience fades up. One continuous motion from click to cosmos.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const entering = useRef(false);
  const setReady = useUniverse((s) => s.setReady);

  useEffect(() => {
    const counter = { v: 0 };
    document.documentElement.classList.add('overflow-hidden');

    const tl = gsap.timeline({ onComplete: () => setArrived(true) });
    tl.to(counter, {
      v: 100,
      duration: 2.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = `${Math.round(counter.v)}%`;
        const idx = Math.min(PHRASES.length - 1, Math.floor((counter.v / 100) * PHRASES.length));
        setPhrase((p) => (p === PHRASES[idx] ? p : PHRASES[idx]));
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!arrived) return;
    gsap.fromTo(
      '[data-arrive]',
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.08 },
    );
  }, [arrived]);

  const enter = () => {
    if (entering.current) return;
    entering.current = true;
    const { reducedMotion, setEnterWarp, setBirth, setAudioOn } = useUniverse.getState();

    // the click is our user gesture — light the ambience here
    startSpaceAudio();
    setAudioOn(true);

    const finish = () => {
      setGone(true);
      setEnterWarp(0);
      setBirth(1);
      document.documentElement.classList.remove('overflow-hidden');
    };

    if (reducedMotion) {
      setReady(true);
      setBirth(1);
      gsap.to(wrap.current, { opacity: 0, duration: 0.4, onComplete: finish });
      return;
    }

    playWormholeWhoosh();

    const rings = portal.current?.querySelectorAll<HTMLElement>('.wormhole-portal__ring') ?? [];
    const core = portal.current?.querySelector<HTMLElement>('.wormhole-portal__core');
    const warp = { v: 0 };
    const bang = { v: 0 };

    const tl = gsap.timeline({ onComplete: finish });

    // 1 · the copy dissolves
    tl.to('[data-arrive], [data-count]', {
      opacity: 0,
      y: -12,
      filter: 'blur(8px)',
      duration: 0.3,
      ease: 'power2.in',
    });

    // 2 · the universe behind starts surging (fov punch + star trails)
    tl.to(
      warp,
      {
        v: 1,
        duration: 0.9,
        ease: 'power2.in',
        onUpdate: () => setEnterWarp(warp.v),
      },
      '<',
    );

    // 3 · wormhole rings rush past — flying down the throat of the tunnel
    rings.forEach((ring, i) => {
      const at = 0.18 + i * 0.13;
      tl.fromTo(
        ring,
        { scale: 0.04, rotate: i * 63, opacity: 0 },
        { scale: 8.5, rotate: i * 63 + 140, duration: 1.15, ease: 'power3.in' },
        at,
      );
      tl.to(ring, { opacity: 0.9, duration: 0.35, ease: 'power1.in' }, at);
      tl.to(ring, { opacity: 0, duration: 0.68, ease: 'power1.out' }, at + 0.45);
    });

    // 4 · the veil lifts mid-flight — and behind it, the big bang:
    //     every star of the universe erupts out of the first singularity
    tl.call(() => setReady(true), undefined, 0.55);
    tl.to(wrap.current, { backgroundColor: 'rgba(5,5,5,0)', duration: 0.8, ease: 'power1.inOut' }, 0.5);
    tl.to(
      bang,
      {
        v: 1,
        duration: 2.6,
        ease: 'power2.out',
        onUpdate: () => setBirth(bang.v),
      },
      0.7,
    );

    // 5 · a soft core flash as the wormhole collapses behind you
    if (core) {
      tl.fromTo(
        core,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 2.2, duration: 0.4, ease: 'power2.in' },
        1.05,
      ).to(core, { opacity: 0, scale: 3.6, duration: 0.5, ease: 'power2.out' }, 1.45);
    }

    // 6 · warp releases, everything settles
    tl.to(
      warp,
      {
        v: 0,
        duration: 0.9,
        ease: 'power3.out',
        onUpdate: () => setEnterWarp(warp.v),
      },
      1.15,
    );
    tl.to(wrap.current, { opacity: 0, duration: 0.45, ease: 'power1.out' }, 1.5);
  };

  if (gone) return null;
  return (
    <div ref={wrap} className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-void">
      <div ref={portal} className="wormhole-portal" aria-hidden="true">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <div key={i} className="wormhole-portal__ring" />
        ))}
        <div className="wormhole-portal__core" />
      </div>
      <div className="relative text-center">
        <span ref={num} data-count className="h-display block text-6xl text-soft md:text-8xl">
          0%
        </span>
        <p data-count className="eyebrow mt-6 min-h-[1em]">
          {arrived ? 'the wormhole is open' : phrase}
        </p>

        {arrived && (
          <button
            type="button"
            data-arrive
            onClick={enter}
            className="grav-btn pointer-events-auto mt-10 inline-block"
          >
            Enter the void
          </button>
        )}
      </div>
    </div>
  );
}
