import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { startAudioOnFirstGesture } from '../audio/spaceAudio';
import { DURATION, T, resetStage, stage } from '../lib/preloaderScript';

// the cinematic is heavy; keep it off the critical path
const PreloaderScene = lazy(() => import('../three/preloader/PreloaderScene'));

/** How long the welcome copy lingers over the hero after the flash. */
const OUTRO = 1.4;

/**
 * The opening sequence: the birth of the universe, in five scenes and eight
 * seconds, ending inside the portfolio.
 *
 *   01 Before Time      a singularity, alone
 *   02 The Big Bang     it detonates
 *   03 A Universe       stars, nebulae, a galaxy, a world sweeping past
 *   04 Gravity          a black hole gathers ahead
 *   05 Enter            the throat opens, and we fall through into the site
 *
 * One GSAP timeline drives everything, including the 3D clock (`stage.t`),
 * so the titles can never drift out of step with the picture. A click
 * anywhere hurries it along.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const b1 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const b5 = useRef<HTMLDivElement>(null);

  const [reduced] = useState(() => useUniverse.getState().reducedMotion);
  const [lite] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );

  useEffect(() => {
    resetStage();
    document.documentElement.classList.add('overflow-hidden');

    // No button means no user gesture, and no gesture means the browser will
    // not let an AudioContext start. Arm the ambience to wake on whatever the
    // visitor does first instead.
    const disarmAudio = startAudioOnFirstGesture();

    const { setReady, setBirth } = useUniverse.getState();
    const finish = () => {
      setGone(true);
      document.documentElement.classList.remove('overflow-hidden');
    };
    // the site is revealed mid-flash, so it is already there when the white lifts
    const handoff = () => {
      setReady(true);
      setBirth(1); // the preloader already told the birth story; skip the site's own
      document.documentElement.classList.remove('overflow-hidden');
      // the overlay outlives the flash by a beat while the welcome fades. It
      // is fixed and full-screen, so it would eat every click in that window.
      if (wrap.current) wrap.current.style.pointerEvents = 'none';
    };

    // ── reduced motion: no cinematic, just the greeting ──
    if (reduced) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.call(handoff, undefined, 0.05);
      tl.fromTo(b5.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
      tl.to(b5.current, { opacity: 0, duration: 0.5 }, 1.5);
      tl.to(wrap.current, { opacity: 0, duration: 0.4 }, 1.7);
      return () => {
        disarmAudio();
        tl.kill();
      };
    }

    const tl = gsap.timeline({ onComplete: finish });

    // the single clock: everything in the 3D scene reads stage.t
    tl.to(stage, { t: DURATION, duration: DURATION, ease: 'none' }, 0);

    // ── Scene 01 · Before Time ──
    tl.fromTo(b1.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.25);
    tl.to(b1.current, { opacity: 0, y: -8, duration: 0.5, ease: 'power2.in' }, T.collapse - 0.35);

    // ── Scene 02 · no text. The explosion speaks. ──

    // ── Scene 03 · A Universe is Born ──
    tl.fromTo(b3.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, T.universe + 0.25);
    tl.to(b3.current, { opacity: 0, y: -8, duration: 0.6, ease: 'power2.in' }, T.hole - 0.75);

    // ── Scene 04 · no text. The hole speaks. ──

    // ── Scene 05 · the handoff ──
    tl.call(handoff, undefined, T.flash + 0.04);
    // the veil lifts through the white, so the site is never seen "arriving"
    tl.to(canvasWrap.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, T.flash + 0.12);
    tl.to(wrap.current, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.4 }, T.flash + 0.1);
    tl.fromTo(b5.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, T.flash + 0.3);
    tl.to(b5.current, { opacity: 0, duration: 0.6, ease: 'power1.inOut' }, DURATION + OUTRO - 0.6);

    // a beat of nothing so the hero is not fighting the copy on the way out
    tl.to({}, { duration: 0.2 }, DURATION + OUTRO);

    // dev-only handle so the sequence can be scrubbed and inspected frame by
    // frame; racing it in real time is hopeless on a software renderer
    if (import.meta.env.DEV) {
      (window as unknown as { __cine?: unknown }).__cine = { tl, stage };
    }

    // a click anywhere hurries creation along
    const hurry = () => {
      if (tl.progress() < 1) tl.timeScale(3.5);
    };
    const el = wrap.current;
    el?.addEventListener('pointerdown', hurry);
    window.addEventListener('keydown', hurry);

    // failsafe: never strand a slow device in the primordial era
    const failsafe = window.setTimeout(() => {
      if (tl.progress() < 0.95) tl.timeScale(8);
    }, 16000);

    return () => {
      disarmAudio();
      window.clearTimeout(failsafe);
      el?.removeEventListener('pointerdown', hurry);
      window.removeEventListener('keydown', hurry);
      tl.kill();
    };
  }, [reduced]);

  if (gone) return null;

  return (
    <div ref={wrap} className="cine" role="presentation">
      {!reduced && (
        <div ref={canvasWrap} className="cine__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <PreloaderScene quiet={reduced} lite={lite} />
          </Suspense>
        </div>
      )}

      {/* the narration. aria-live so the sequence is not silent to a screen reader */}
      <div className="cine__copy" aria-live="polite">
        <div ref={b1} className="cine__beat">
          <h1 className="cine__title">Before Time</h1>
          <span className="cine__rule" aria-hidden="true" />
          <p className="cine__caption">Everything began from a single point.</p>
        </div>

        <div ref={b3} className="cine__beat">
          <h1 className="cine__title">A Universe is Born</h1>
          <span className="cine__rule" aria-hidden="true" />
        </div>
      </div>

      {/* the last beat lands over the live hero, so it gets its own centred
          layer and a scrim — in the lower third it sat straight on top of the
          hero's own copy and neither could be read */}
      <div className="cine__outro" aria-live="polite">
        <div ref={b5} className="cine__beat cine__beat--final">
          <h1 className="cine__title">Welcome to My Universe</h1>
          <span className="cine__rule" aria-hidden="true" />
          <p className="cine__caption">Crafting immersive digital experiences.</p>
        </div>
      </div>
    </div>
  );
}
