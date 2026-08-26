import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Zap,
  Gauge,
  Flame,
  Check,
  ChevronDown,
  MonitorCheck,
} from 'lucide-react';
import type { GraphicsQuality } from '../store/useUniverse';
import { useUniverse } from '../store/useUniverse';

interface QualityOption {
  id: GraphicsQuality;
  name: string;
  badge: string;
  description: string;
  icon: typeof Sparkles;
  accent: string;
}

const QUALITY_OPTIONS: QualityOption[] = [
  {
    id: 'auto',
    name: 'Auto Mode',
    badge: 'AUTO',
    description: 'Smart adaptive FPS based on device',
    icon: MonitorCheck,
    accent: 'text-sky-400',
  },
  {
    id: 'high',
    name: 'High Quality',
    badge: 'HIGH',
    description: 'Full Bloom glow & 2,000 stars',
    icon: Flame,
    accent: 'text-amber-400',
  },
  {
    id: 'medium',
    name: 'Medium',
    badge: 'MED',
    description: 'Balanced fidelity & smooth 60 FPS',
    icon: Gauge,
    accent: 'text-purple-400',
  },
  {
    id: 'low',
    name: 'Low / Eco',
    badge: 'LOW',
    description: 'Fastest 60 FPS & battery saver',
    icon: Zap,
    accent: 'text-emerald-400',
  },
];

export default function GraphicsToggle() {
  const ready = useUniverse((s) => s.ready);
  const graphicsQuality = useUniverse((s) => s.graphicsQuality);
  const setGraphicsQuality = useUniverse((s) => s.setGraphicsQuality);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!ready || !buttonRef.current) return;
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.8, ease: 'power3.out' },
    );
  }, [ready]);

  // Click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  if (!ready) return null;

  const currentOption =
    QUALITY_OPTIONS.find((opt) => opt.id === graphicsQuality) || QUALITY_OPTIONS[0];

  const handleSelect = (option: QualityOption) => {
    setGraphicsQuality(option.id);
    setIsOpen(false);
    setToastMessage(`⚡ Graphics switched to ${option.name}`);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const IconComponent = currentOption.icon;

  return (
    <div ref={containerRef} className="fixed right-[3.8rem] bottom-4 z-60 sm:right-[5.2rem] sm:bottom-6">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`graphics-toggle pointer-events-auto group relative flex items-center justify-center transition-all ${
          isOpen ? 'border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.25)]' : ''
        }`}
        aria-label={`Graphics quality menu. Currently ${currentOption.name}.`}
        aria-expanded={isOpen}
        title="Graphics Settings (Auto / High / Medium / Low)"
      >
        <IconComponent
          size={18}
          className={`${currentOption.accent} transition-transform duration-300 group-hover:scale-110`}
        />

        {/* Small Mode Badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 items-center justify-center rounded-full bg-white/20 px-1 font-mono text-[7.5px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
          {currentOption.badge}
        </span>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed inset-x-4 bottom-18 max-h-[min(380px,calc(100dvh-5.5rem))] origin-bottom overflow-y-auto overscroll-contain rounded-2xl border border-white/20 bg-[#0a0a0e]/95 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 sm:absolute sm:inset-x-auto sm:right-0 sm:bottom-14 sm:w-64 sm:origin-bottom-right"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0e]/95 px-3 py-2 backdrop-blur-md">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-dim uppercase">
              Graphics Quality
            </span>
            <ChevronDown className="size-3 text-dim opacity-60" />
          </div>

          {/* Option List */}
          <div className="mt-1 space-y-1">
            {QUALITY_OPTIONS.map((opt) => {
              const isSelected = opt.id === graphicsQuality;
              const OptIcon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                    isSelected
                      ? 'border border-white/20 bg-white/15 text-white'
                      : 'text-soft hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <OptIcon size={16} className={opt.accent} />
                    <div>
                      <div className="flex items-center gap-1.5 font-display text-xs font-semibold">
                        <span>{opt.name}</span>
                        {opt.id === 'auto' && (
                          <span className="rounded bg-sky-500/20 px-1 py-0.2 font-mono text-[8px] text-sky-300 uppercase">
                            Auto
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-dim">{opt.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-4 shrink-0 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast feedback */}
      {toastMessage && (
        <div className="pointer-events-none absolute right-0 bottom-14 whitespace-nowrap rounded-xl border border-white/20 bg-black/85 px-3.5 py-1.5 font-mono text-[11px] font-medium text-white shadow-2xl backdrop-blur-xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
