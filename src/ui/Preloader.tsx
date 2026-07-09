import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { startSpaceAudio, playWormholeWhoosh } from '../audio/spaceAudio';

const RING_COUNT = 6;
const STAR_COUNT = 480;

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

/**
 * The loading sequence, per the brief:
 *   dark screen → tiny stars appear → stars stretch into hyperspace →
 *   the camera accelerates → the wormhole opens → a bright flash →
 *   the portfolio fades into view. ~4 seconds, then hands off to the site.
 *
 * The hyperspace is a self-contained 2-D canvas (fast, dependency-free);
 * a GSAP timeline drives the `speed` variable so the stretch, the wormhole,
 * and the flash all stay in lockstep.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const setReady = useUniverse((s) => s.setReady);

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden');
    const { reducedMotion, setEnterWarp, setAudioOn } = useUniverse.getState();

    // ── ambience starts on the visitor's first gesture (browser policy) ──
    const armAudio = () => {
      startSpaceAudio();
      setAudioOn(true);
      window.removeEventListener('pointerdown', armAudio);
      window.removeEventListener('keydown', armAudio);
      window.removeEventListener('wheel', armAudio);
      window.removeEventListener('touchstart', armAudio);
    };
    window.addEventListener('pointerdown', armAudio, { once: true });
    window.addEventListener('keydown', armAudio, { once: true });
    window.addEventListener('wheel', armAudio, { once: true, passive: true });
    window.addEventListener('touchstart', armAudio, { once: true, passive: true });

    const finish = () => {
      setGone(true);
      setEnterWarp(0);
      document.documentElement.classList.remove('overflow-hidden');
    };

    // reduced motion — skip the ride, reveal calmly
    if (reducedMotion) {
      setReady(true);
      gsap.to(wrap.current, { opacity: 0, duration: 0.5, delay: 0.3, onComplete: finish });
      return () => {
        armAudio();
      };
    }

    // ── hyperspace canvas ──
    const cvs = canvas.current!;
    const ctx = cvs.getContext('2d')!;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * w,
      y: (Math.random() - 0.5) * h,
      z: Math.random() * w,
      pz: 0,
    }));

    const state = { speed: 0, alpha: 0 };
    let raf = 0;
    const render = () => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = state.alpha;

      for (const s of stars) {
        s.pz = s.z;
        s.z -= state.speed;
        if (s.z < 1) {
          s.z = w;
          s.pz = w;
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
        }
        const sx = cx + (s.x / s.z) * w;
        const sy = cy + (s.y / s.z) * w;
        const px = cx + (s.x / s.pz) * w;
        const py = cy + (s.y / s.pz) * w;
        const size = (1 - s.z / w) * 2.4;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(0.4, size);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const rings = portal.current?.querySelectorAll<HTMLElement>('.wormhole-portal__ring') ?? [];
    const core = portal.current?.querySelector<HTMLElement>('.wormhole-portal__core');
    const counter = { v: 0 };

    const tl = gsap.timeline({ onComplete: finish });

    // 1 · tiny stars appear
    tl.to(state, { alpha: 1, duration: 0.6, ease: 'power1.out' }, 0);
    tl.to(state, { speed: 6, duration: 0.9, ease: 'power1.in' }, 0);

    // 2 · stretch into hyperspace + the camera accelerates (fov punch)
    tl.to(state, { speed: 46, duration: 1.7, ease: 'power3.in' }, 0.9);
    tl.to(counter, {
      v: 100,
      duration: 2.6,
      ease: 'power2.in',
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
      },
    }, 0);
    const warp = { v: 0 };
    tl.to(warp, { v: 1, duration: 1.7, ease: 'power2.in', onUpdate: () => useUniverse.getState().setEnterWarp(warp.v) }, 0.9);

    // 3 · the wormhole opens — rings rush outward past the camera
    tl.call(() => playWormholeWhoosh(), undefined, 2.2);
    rings.forEach((ring, i) => {
      const at = 2.2 + i * 0.1;
      tl.fromTo(
        ring,
        { scale: 0.05, rotate: i * 60, opacity: 0 },
        { scale: 9, rotate: i * 60 + 150, opacity: 0.95, duration: 1.0, ease: 'power3.in' },
        at,
      );
      tl.to(ring, { opacity: 0, duration: 0.5, ease: 'power1.out' }, at + 0.5);
    });
    if (core) {
      tl.fromTo(core, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 2.4, duration: 0.5, ease: 'power2.in' }, 2.9);
    }

    // 4 · bright flash — the universe is revealed behind it
    tl.call(() => setReady(true), undefined, 3.15);
    tl.to(flash.current, { opacity: 1, duration: 0.28, ease: 'power2.in' }, 3.1);
    tl.to(state, { alpha: 0, duration: 0.3 }, 3.1);
    tl.to(flash.current, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 3.4);

    // 5 · warp releases, the veil lifts onto the portfolio
    tl.to(warp, { v: 0, duration: 0.9, ease: 'power3.out', onUpdate: () => useUniverse.getState().setEnterWarp(warp.v) }, 3.3);
    tl.to(wrap.current, { opacity: 0, duration: 0.6, ease: 'power1.out' }, 3.5);

    return () => {
      tl.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [setReady]);

  if (gone) return null;
  return (
    <div ref={wrap} className="fixed inset-0 z-[90] overflow-hidden bg-black">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div ref={portal} className="wormhole-portal" aria-hidden="true">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <div key={i} className="wormhole-portal__ring" />
        ))}
        <div className="wormhole-portal__core" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
        <span ref={num} className="font-mono text-xs tracking-[0.4em] text-soft">
          000
        </span>
        <span className="eyebrow text-dim">Entering deep space</span>
      </div>

      <div ref={flash} className="pointer-events-none absolute inset-0 bg-white opacity-0" />
    </div>
  );
}
