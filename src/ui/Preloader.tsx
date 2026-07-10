import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { startAudioOnFirstGesture } from '../audio/spaceAudio';
import { DURATION, T, resetStage, stage } from '../lib/preloaderScript';

// the cinematic is heavy; keep it off the critical path
const PreloaderScene = lazy(() => import('../three/preloader/PreloaderScene'));

/**
 * The welcome copy, timed off the flash.
 *
 * It must not begin until the white has bled down into black, or it is white
 * type on a white frame. There is no fixed hold any more: the sequence waits
 * on the Enter button, so the visitor decides when the universe opens.
 */
const WELCOME = {
  /** after T.flash — the strike has collapsed back into black by here */
  in: 0.7,
  rise: 0.8,
  out: 0.7,
} as const;

/**
 * The opening sequence: the birth of the universe, in five scenes,
 * ending inside the portfolio.
 *
 *   01 Before Time      a singularity, alone           (0.0 – 1.4)
 *   02 The Big Bang     it collapses, then detonates   (1.4 – 4.6)
 *   03 A Universe       stars, galaxies, a world       (4.6 – 6.8)
 *   04 Gravity          a black hole gathers ahead —
 *                       the longest act                (6.8 – 10.2)
 *   05 Enter            the throat opens; white-out,
 *                       then the welcome, on black     (10.2 – end)
 *
 * One GSAP timeline drives everything, including the 3D clock (`stage.t`),
 * so the titles can never drift out of step with the picture. A click
 * anywhere hurries it along. No bars, no percentages — the picture carries it.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const b1 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const b5 = useRef<HTMLDivElement>(null);
  const enterBtn = useRef<HTMLButtonElement>(null);

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
    // the site wakes behind the black, so it is already alive and settled
    // by the time the veil finally lifts off the welcome
    const handoff = () => {
      setReady(true);
      setBirth(1); // the preloader already told the birth story; skip the site's own
      document.documentElement.classList.remove('overflow-hidden');
    };

    // ── reduced motion: no cinematic — the greeting, the button, the site ──
    if (reduced) {
      const tl = gsap.timeline({ onComplete: finish });
      // autoAlpha, not opacity: at opacity 0 the invisible button would
      // still catch clicks; visibility:hidden actually takes it out of play
      tl.fromTo(b5.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
      // wait for the visitor; the button resumes from here
      tl.addPause(0.55);
      tl.call(handoff, undefined, 0.6);
      tl.to(b5.current, { autoAlpha: 0, duration: WELCOME.out }, 0.6);
      tl.set(wrap.current, { pointerEvents: 'none' }, 0.75);
      tl.to(wrap.current, { opacity: 0, duration: 0.5 }, 0.75);

      const enter = () => tl.play();
      const btn = enterBtn.current;
      btn?.addEventListener('click', enter);
      return () => {
        disarmAudio();
        btn?.removeEventListener('click', enter);
        tl.kill();
      };
    }

    const tl = gsap.timeline({ onComplete: finish });

    // the single clock: everything in the 3D scene reads stage.t
    tl.to(stage, { t: DURATION, duration: DURATION, ease: 'none' }, 0);

    // ── Scene 01 · Before Time ── in gently, gone completely by the collapse
    tl.fromTo(b1.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.15);
    tl.to(b1.current, { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' }, T.collapse - 0.4);

    // ── Scene 02 · no text. The explosion speaks. ──

    // ── Scene 03 · A Universe is Born ──
    tl.fromTo(b3.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, T.universe + 0.2);
    tl.to(b3.current, { opacity: 0, y: -8, duration: 0.55, ease: 'power2.in' }, T.hole - 0.7);

    // ── Scene 04 · no text. The hole speaks. ──

    // ── Scene 05 · the welcome, waiting on black ──
    // the white strikes, then bleeds off into the wrap's own solid black —
    // the canvas goes, the black stays, and the welcome sits on that
    tl.to(canvasWrap.current, { opacity: 0, duration: 0.55, ease: 'power1.out' }, T.flash + 0.12);
    const welcomeIn = T.flash + WELCOME.in;
    // autoAlpha, not opacity: at opacity 0 the invisible Enter button would
    // already catch clicks; visibility:hidden keeps it out of play until now
    tl.fromTo(b5.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: WELCOME.rise, ease: 'power2.out' }, welcomeIn);

    // the story stops here and waits for the visitor's hand
    const waitAt = welcomeIn + WELCOME.rise + 0.1;
    tl.addPause(waitAt);

    // ── the handoff, resumed by the Enter button ──
    // ready flips only now, so the hero's word-by-word entrance starts as
    // the black begins to lift and plays out in full view — not spent
    // invisibly behind the veil during the welcome hold
    tl.call(handoff, undefined, waitAt + 0.02);
    tl.to(b5.current, { autoAlpha: 0, duration: WELCOME.out, ease: 'power1.inOut' }, waitAt + 0.02);
    // the overlay is fixed and full-screen, so it stops eating clicks the
    // moment it starts going
    tl.set(wrap.current, { pointerEvents: 'none' }, waitAt + 0.25);
    tl.to(wrap.current, { opacity: 0, duration: 0.9, ease: 'power1.inOut' }, waitAt + 0.25);

    // dev-only handle so the sequence can be scrubbed and inspected frame by
    // frame; racing it in real time is hopeless on a software renderer
    if (import.meta.env.DEV) {
      (window as unknown as { __cine?: unknown }).__cine = { tl, stage };
    }

    // a click anywhere hurries creation along — but only up to the welcome;
    // past the pause it would rush the reveal instead
    const hurry = () => {
      if (tl.time() < waitAt - 0.05) tl.timeScale(3.5);
    };
    const el = wrap.current;
    el?.addEventListener('pointerdown', hurry);
    window.addEventListener('keydown', hurry);

    // the button resumes the paused story at normal speed
    const enter = () => tl.timeScale(1).play();
    const btn = enterBtn.current;
    btn?.addEventListener('click', enter);

    // failsafe: never strand a slow device in the primordial era. The wait
    // at the button is deliberate, so it only rushes the run-up to it.
    const failsafe = window.setTimeout(() => {
      if (tl.time() < waitAt - 0.05) tl.timeScale(8);
    }, 22000);

    return () => {
      disarmAudio();
      window.clearTimeout(failsafe);
      el?.removeEventListener('pointerdown', hurry);
      window.removeEventListener('keydown', hurry);
      btn?.removeEventListener('click', enter);
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

      {/* the last beat sits centred on the wrap's own solid black — the site
          only appears once these words have finished and the black lifts */}
      <div className="cine__outro" aria-live="polite">
        <div ref={b5} className="cine__beat cine__beat--final">
          <h1 className="cine__title">Welcome to My Universe</h1>
          <span className="cine__rule" aria-hidden="true" />
          <p className="cine__caption">Crafting immersive digital experiences.</p>
          <button ref={enterBtn} type="button" className="grav-btn cine__enter">
            Enter the Space
          </button>
        </div>
      </div>
    </div>
  );
}
