import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Gamepad2 } from 'lucide-react';
import { useUniverse } from '../store/useUniverse';

/**
 * Entry to GRAVITY — the mini game. A small glass button in the
 * bottom-left corner, twin of the audio toggle on the right.
 */
export default function GameLink() {
  const ready = useUniverse((s) => s.ready);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.8, ease: 'power3.out' },
    );
  }, [ready]);

  if (!ready) return null;

  return (
    <a
      ref={ref}
      href="/game/"
      className="game-link pointer-events-auto"
      aria-label="Play GRAVITY — a mini game inside this universe"
      title="Play GRAVITY"
    >
      <Gamepad2 size={18} strokeWidth={1.6} aria-hidden="true" />
    </a>
  );
}
