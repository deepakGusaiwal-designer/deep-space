import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { startSpaceAudio, playWormholeWhoosh } from '../audio/spaceAudio';

const RING_COUNT = 6;

/** The narration — four beats, subtitle-style. */
const LINES = [
  'First, there was nothing.',
  'Then — light.',
  'Stardust gathered into worlds.',
] as const;

/* ── the particle cosmos painted on a 2D canvas ─────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Ring {
  r: number;
  v: number;
  a: number;
}

interface MicroStar {
  x: number;
  y: number;
  bornAt: number; // 0..1 threshold against fx.stars
  tw: number;
  depth: number; // 0..1 parallax layer — deeper stars drift less
}

/** Soft round glow sprite, pre-rendered once — round stars, cheap draws. */
function makeDotSprite(rgb: string): HTMLCanvasElement {
  const s = 32;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${rgb}, 1)`);
  grad.addColorStop(0.3, `rgba(${rgb}, 0.5)`);
  grad.addColorStop(0.7, `rgba(${rgb}, 0.08)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

/** Mutable knobs the GSAP timeline turns; the draw loop just reads them. */
interface Fx {
  singularity: number; // 0..1 presence of the primordial point
  pulse: number; // 0..1 how violently it trembles
  flash: number; // 0..1 full-screen detonation flash
  haze: number; // 0..1 nebula gradients
  stars: number; // 0..1 how much of the star field has condensed
  cool: number; // 0..1 hot amber → cool blue-white
  alive: boolean;
}

function spawnBurst(
  particles: Particle[],
  cx: number,
  cy: number,
  count: number,
  maxSpeed: number,
  life = 2.6,
) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    // most matter is slow; a few shards are violent
    const v = Math.pow(Math.random(), 0.45) * maxSpeed;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v * 0.82,
      life: 0,
      maxLife: 1.6 + Math.random() * life,
      size: 0.5 + Math.pow(Math.random(), 2) * 2.2,
    });
  }
}

/**
 * The birth of the universe, before the portfolio.
 *
 * Absolute darkness. A single point of light appears — trembles — then
 * detonates: shockwaves, a fireball of stardust, a flash that cools from
 * amber to blue-white while nebula haze forms and stars condense out of
 * the debris. Narrated in subtitle beats. One click opens the wormhole.
 *
 * (A click anywhere during the sequence hurries creation along.)
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [arrived, setArrived] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const entering = useRef(false);
  const master = useRef<gsap.core.Timeline | null>(null);
  const setReady = useUniverse((s) => s.setReady);

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden');
    const reducedMotion = useUniverse.getState().reducedMotion;

    // ── reduced motion: a quiet counter, no fireworks ──
    if (reducedMotion) {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => setArrived(true) });
      tl.to(counter, {
        v: 100,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (pctRef.current) pctRef.current.textContent = `${Math.round(counter.v)}%`;
        },
      });
      return () => {
        tl.kill();
      };
    }

    // ── canvas setup ──
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const fx: Fx = { singularity: 0, pulse: 0, flash: 0, haze: 0, stars: 0, cool: 0, alive: true };
    const particles: Particle[] = [];
    const rings: Ring[] = [];
    const microStars: MicroStar[] = Array.from({ length: isMobile ? 120 : 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      bornAt: Math.random(),
      tw: Math.random() * Math.PI * 2,
      depth: 0.25 + Math.random() * 0.75,
    }));

    const cx = () => W / 2;
    const cy = () => H * 0.44;

    // round glow sprites — one per temperature band
    const hotSprite = makeDotSprite('255, 196, 130');
    const midSprite = makeDotSprite('255, 236, 210');
    const coolSprite = makeDotSprite('185, 205, 255');
    const starSprite = makeDotSprite('235, 240, 250');

    // the visitor's hand in creation: smoothed pointer for parallax,
    // proximity glow, and gently pushing stardust around
    const pointer = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2, sx: 0, sy: 0, active: false };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      pointer.active = true;
    };
    window.addEventListener('pointermove', onPointerMove);

    // the nebula haze is static except for its alpha — paint it once per
    // resize into an offscreen layer instead of three full-screen
    // gradients every frame
    const hazeLayer = document.createElement('canvas');
    const paintHaze = () => {
      hazeLayer.width = Math.max(1, W / 2);
      hazeLayer.height = Math.max(1, H / 2);
      const hctx = hazeLayer.getContext('2d')!;
      const w = hazeLayer.width;
      const h = hazeLayer.height;
      const hazeDefs: Array<[number, number, number, string]> = [
        [0.3, 0.38, 0.5, '255, 176, 110'],
        [0.72, 0.52, 0.55, '110, 140, 220'],
        [0.5, 0.2, 0.45, '150, 120, 200'],
      ];
      for (const [hx, hy, hr, rgb] of hazeDefs) {
        const g = hctx.createRadialGradient(w * hx, h * hy, 0, w * hx, h * hy, h * hr);
        g.addColorStop(0, `rgba(${rgb}, 0.05)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        hctx.fillStyle = g;
        hctx.fillRect(0, 0, w, h);
      }
    };
    paintHaze();
    const onResize = () => {
      resize();
      paintHaze();
    };
    window.removeEventListener('resize', resize);
    window.addEventListener('resize', onResize);

    // ── the draw loop ──
    const draw = (time: number, deltaMS: number) => {
      const dt = Math.min(0.05, deltaMS / 1000);
      const t = time;

      // smooth the pointer — the cosmos leans after your hand, never snaps
      const ease = Math.min(1, dt * 5);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      pointer.sx = (pointer.x / Math.max(1, W) - 0.5) * 2;
      pointer.sy = (pointer.y / Math.max(1, H) - 0.5) * 2;

      // trail fade — motion smears like long-exposure film
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(5, 5, 5, 0.32)';
      ctx.fillRect(0, 0, W, H);

      // nebula haze condensing out of the debris (drifts opposite the hand)
      if (fx.haze > 0.01) {
        ctx.globalAlpha = fx.haze;
        ctx.drawImage(hazeLayer, -pointer.sx * 10, -pointer.sy * 7, W + 20, H + 14);
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = 'lighter';

      // stars condensing — round, layered, and aware of the cursor
      if (fx.stars > 0.01) {
        for (const s of microStars) {
          if (s.bornAt > fx.stars) continue;
          const tw = 0.5 + 0.5 * Math.sin(t * (1.2 + s.tw) + s.tw * 8);
          // deeper layers drift less — parallax under the hand
          const px = s.x * W - pointer.sx * 22 * s.depth;
          const py = s.y * H - pointer.sy * 15 * s.depth;
          // stars near the cursor burn brighter
          const dxm = px - pointer.x;
          const dym = py - pointer.y;
          const near = Math.max(0, 1 - (dxm * dxm + dym * dym) / (170 * 170));
          const a = Math.min(1, (fx.stars - s.bornAt) * 6) * (0.3 + 0.55 * tw) * (1 + near * 1.3);
          const sz = (2 + s.depth * 3.2) * (0.75 + 0.35 * tw) * (1 + near * 0.5);
          ctx.globalAlpha = Math.min(1, a);
          ctx.drawImage(starSprite, px - sz / 2, py - sz / 2, sz, sz);
        }
        ctx.globalAlpha = 1;
      }

      // a faint halo where the hand rests, once there is light to gather
      if (pointer.active && fx.stars > 0.05) {
        ctx.globalAlpha = 0.1 * fx.stars;
        ctx.drawImage(midSprite, pointer.x - 30, pointer.y - 30, 60, 60);
        ctx.globalAlpha = 1;
      }

      // the primordial singularity
      if (fx.singularity > 0.01) {
        const jitter = fx.pulse * 1.6;
        const jx = cx() + (Math.random() - 0.5) * jitter;
        const jy = cy() + (Math.random() - 0.5) * jitter;
        const breathe = 1 + Math.sin(t * 5.2) * 0.24 * fx.pulse;
        const r = (2 + fx.pulse * 9) * breathe * fx.singularity;
        const g = ctx.createRadialGradient(jx, jy, 0, jx, jy, r * 9);
        g.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fx.singularity})`);
        g.addColorStop(0.12, `rgba(255, 224, 178, ${0.5 * fx.singularity})`);
        g.addColorStop(0.4, `rgba(255, 160, 90, ${0.12 * fx.singularity * (0.4 + fx.pulse)})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(jx, jy, r * 9, 0, Math.PI * 2);
        ctx.fill();

        // an anamorphic lens streak as it destabilizes
        if (fx.pulse > 0.15) {
          const lw = (40 + 320 * fx.pulse) * breathe;
          const lg = ctx.createLinearGradient(jx - lw, jy, jx + lw, jy);
          lg.addColorStop(0, 'rgba(160, 190, 255, 0)');
          lg.addColorStop(0.5, `rgba(210, 225, 255, ${0.5 * fx.pulse})`);
          lg.addColorStop(1, 'rgba(160, 190, 255, 0)');
          ctx.fillStyle = lg;
          ctx.fillRect(jx - lw, jy - 0.7, lw * 2, 1.4);
        }
      }

      // shockwave rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.v * dt;
        ring.v *= 1 - 0.55 * dt;
        ring.a *= 1 - 1.35 * dt;
        if (ring.a < 0.01) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255, 214, 170, ${ring.a})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(cx(), cy(), ring.r, ring.r * 0.82, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // the expanding fireball of stardust
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const drag = 1 - 0.72 * dt;
        p.vx *= drag;
        p.vy *= drag;

        // the hand stirs the stardust — motes near the cursor are nudged away
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (pointer.active && d2 < 130 * 130 && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = ((1 - d / 130) * 260 * dt) / d;
          p.vx += dx * f;
          p.vy += dy * f;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.life / p.maxLife;
        const fade = Math.sin(Math.min(1, k * 1.15) * Math.PI);
        // cooling: newborn matter burns amber, then chills to blue-white —
        // pick the sprite for this mote's temperature (round, soft-edged)
        const cool = Math.min(1, fx.cool + k * 0.5);
        const sprite = cool < 0.35 ? hotSprite : cool < 0.7 ? midSprite : coolSprite;
        const s = p.size * (0.7 + 0.5 * (1 - k)) * 6;
        ctx.globalAlpha = 0.85 * fade;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      // detonation flash
      if (fx.flash > 0.01) {
        const g = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), Math.max(W, H) * 0.85);
        g.addColorStop(0, `rgba(255, 250, 240, ${fx.flash})`);
        g.addColorStop(0.35, `rgba(255, 214, 165, ${fx.flash * 0.55})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const tick = (time: number, deltaTime: number) => {
      if (fx.alive) draw(time, deltaTime);
    };
    gsap.ticker.add(tick);

    // ── the score: one master timeline conducts everything ──
    const setLine = (text: string) => {
      const el = lineRef.current;
      if (el) el.textContent = text;
    };

    const tl = gsap.timeline({
      onUpdate: () => {
        if (pctRef.current) pctRef.current.textContent = `${Math.round(tl.progress() * 100)}%`;
      },
      onComplete: () => setArrived(true),
    });
    master.current = tl;

    const line = lineRef.current;

    // beat 1 — nothing, then a point of light
    tl.call(() => setLine(LINES[0]), undefined, 0.2);
    tl.fromTo(line, { opacity: 0, filter: 'blur(6px)' }, { opacity: 0.9, filter: 'blur(0px)', duration: 1.1 }, 0.3);
    tl.to({}, { duration: 0.01 }, 0); // anchor
    tl.to(fxTween(fx, 'singularity'), { value: 0.65, duration: 1.4, ease: 'power2.out' }, 0.5);
    tl.to(line, { opacity: 0, filter: 'blur(4px)', duration: 0.7 }, 2.35);

    // beat 2 — destabilize, then detonate
    tl.to(fxTween(fx, 'pulse'), { value: 1, duration: 0.9, ease: 'power2.in' }, 1.5);
    tl.to(fxTween(fx, 'singularity'), { value: 1, duration: 0.9, ease: 'power2.in' }, 1.5);
    tl.call(
      () => {
        spawnBurst(particles, cx(), cy(), isMobile ? 260 : 620, Math.max(W, H) * 0.55);
        rings.push({ r: 6, v: Math.max(W, H) * 0.75, a: 0.8 });
        rings.push({ r: 2, v: Math.max(W, H) * 0.5, a: 0.6 });
      },
      undefined,
      2.42,
    );
    tl.fromTo(fxTween(fx, 'flash'), { value: 0 }, { value: 1, duration: 0.12, ease: 'power4.in' }, 2.36);
    tl.to(fxTween(fx, 'flash'), { value: 0, duration: 1.1, ease: 'power2.out' }, 2.5);
    tl.to(fxTween(fx, 'singularity'), { value: 0, duration: 0.4 }, 2.5);
    tl.to(fxTween(fx, 'pulse'), { value: 0, duration: 0.4 }, 2.5);
    tl.call(() => setLine(LINES[1]), undefined, 2.75);
    tl.fromTo(line, { opacity: 0 }, { opacity: 1, filter: 'blur(0px)', duration: 0.9 }, 2.8);
    tl.to(line, { opacity: 0, filter: 'blur(4px)', duration: 0.7 }, 4.6);

    // beat 3 — expansion cools; stars and nebulae condense
    tl.to(fxTween(fx, 'cool'), { value: 1, duration: 2.4, ease: 'power1.inOut' }, 2.8);
    tl.to(fxTween(fx, 'haze'), { value: 1, duration: 2.6, ease: 'power1.inOut' }, 3.0);
    tl.to(fxTween(fx, 'stars'), { value: 1, duration: 2.8, ease: 'power1.out' }, 3.1);
    tl.call(() => spawnBurst(particles, cx(), cy(), isMobile ? 80 : 180, Math.max(W, H) * 0.2), undefined, 3.3);
    tl.call(() => spawnBurst(particles, cx(), cy(), isMobile ? 50 : 120, Math.max(W, H) * 0.1), undefined, 4.1);
    // a lingering veil of slow motes for the settled cosmos — something for
    // the visitor's cursor to stir while they take in the button
    tl.call(
      () => spawnBurst(particles, cx(), cy(), isMobile ? 60 : 140, Math.max(W, H) * 0.06, 26),
      undefined,
      5.2,
    );
    tl.call(() => setLine(LINES[2]), undefined, 4.45);
    tl.fromTo(line, { opacity: 0 }, { opacity: 1, filter: 'blur(0px)', duration: 1.0 }, 4.5);
    tl.to(line, { opacity: 0, filter: 'blur(4px)', duration: 0.7 }, 6.1);
    tl.to({}, { duration: 1.3 }, 6.8); // give readers a calm pause before the portal appears

    // a click anywhere hurries creation along
    const hurry = () => {
      if (!entering.current && tl.progress() < 1) tl.timeScale(3.2);
    };
    wrap.current?.addEventListener('pointerdown', hurry);

    // failsafe: if a weak device can't keep the frame rate, don't strand
    // the visitor in the primordial era — fast-forward creation
    const failsafe = window.setTimeout(() => {
      if (tl.progress() < 0.9) tl.timeScale(6);
    }, 12500);

    return () => {
      fx.alive = false;
      gsap.ticker.remove(tick);
      window.clearTimeout(failsafe);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      wrap.current?.removeEventListener('pointerdown', hurry);
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

    // 1 · the copy dissolves; the newborn 2D cosmos hands over to the 3D one
    tl.to('[data-arrive], [data-count]', {
      opacity: 0,
      y: -12,
      filter: 'blur(8px)',
      duration: 0.3,
      ease: 'power2.in',
    });
    tl.to(canvasRef.current, { opacity: 0, duration: 0.7, ease: 'power1.in' }, 0.25);

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
    <div ref={wrap} className="fixed inset-0 z-[90] overflow-hidden bg-void">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div ref={portal} className="wormhole-portal" aria-hidden="true">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <div key={i} className="wormhole-portal__ring" />
        ))}
        <div className="wormhole-portal__core" />
      </div>

      {/* subtitle narration, lower third */}
      <p ref={lineRef} data-count className="cosmic-line font-semibold eyebrow " aria-live="polite" />

      {/* the invitation, once the cosmos has settled */}
      {arrived && (
        <div className="absolute inset-x-0 bottom-[26%] text-center">
          <p data-arrive className="eyebrow">
            a universe, ready for you
          </p>
          <button
            type="button"
            data-arrive
            onClick={enter}
            className="grav-btn pointer-events-auto mt-8 inline-block"
          >
            Enter the void
          </button>
        </div>
      )}

      {/* quiet progress readout */}
      <span ref={pctRef} data-count className="cosmic-progress">
        0%
      </span>
    </div>
  );
}

/** Wrap one numeric field of the fx object so GSAP can tween it. */
function fxTween<T extends object, K extends keyof T>(obj: T, key: K) {
  return {
    get value() {
      return obj[key] as unknown as number;
    },
    set value(v: number) {
      (obj[key] as unknown as number) = v;
    },
  };
}
