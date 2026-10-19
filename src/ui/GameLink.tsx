import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Gamepad2, FileText } from 'lucide-react';
import { useUniverse } from '../store/useUniverse';

/**
 * Bottom-left dock containing:
 * 1. GRAVITY — 3D mini game
 * 2. Resume / CV — static resume & PDF view
 */
export default function GameLink() {
  const ready = useUniverse((s) => s.ready);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.8, ease: 'power3.out' },
    );
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      ref={containerRef}
      className="fixed left-4 bottom-4 z-60 flex items-center gap-2.5 sm:left-6 sm:bottom-6 sm:gap-3 opacity-0"
    >
      {/* Game Link Button with Tooltip */}
      <div className="group relative flex items-center justify-center">
        <a
          href="/game/"
          className="dock-link-btn game-link pointer-events-auto"
          aria-label="Play GRAVITY — 3D mini game"
          title="Play GRAVITY"
        >
          <Gamepad2 size={18} strokeWidth={1.6} aria-hidden="true" />
        </a>

        {/* Floating Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 z-70"
        >
          <div className="whitespace-nowrap rounded-xl border border-white/20 bg-[#0a0a0e]/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs font-semibold text-white tracking-wide">
                Play GRAVITY
              </span>
              <span className="rounded bg-amber-500/20 px-1 py-0.5 font-mono text-[8px] font-bold text-amber-300 uppercase">
                Game
              </span>
            </div>
            <p className="font-mono text-[9px] text-white/50 tracking-wider">
              3D Orbital Space Runner
            </p>
          </div>
          <div className="w-2 h-2 -mt-1 rotate-45 border-r border-b border-white/20 bg-[#0a0a0e]/95" />
        </div>
      </div>

      {/* Resume Link Button with Tooltip */}
      <div className="group relative flex items-center justify-center">
        <a
          href="/resume/"
          className="dock-link-btn resume-link pointer-events-auto"
          aria-label="View Resume & CV — Deepak Gusaiwal"
          title="View Resume / CV"
        >
          <FileText size={18} strokeWidth={1.6} aria-hidden="true" />
        </a>

        {/* Floating Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 z-70"
        >
          <div className="whitespace-nowrap rounded-xl border border-white/20 bg-[#0a0a0e]/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs font-semibold text-white tracking-wide">
                Resume / CV
              </span>
              <span className="rounded bg-rose-500/20 px-1 py-0.5 font-mono text-[8px] font-bold text-rose-300 uppercase">
                Static
              </span>
            </div>
            <p className="font-mono text-[9px] text-white/50 tracking-wider">
              Experience, Skills &amp; PDF
            </p>
          </div>
          <div className="w-2 h-2 -mt-1 rotate-45 border-r border-b border-white/20 bg-[#0a0a0e]/95" />
        </div>
      </div>
    </div>
  );
}
