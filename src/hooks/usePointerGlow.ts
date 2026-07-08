import { useEffect, type RefObject } from 'react';

/**
 * Tracks the pointer inside an element and exposes it as --mx/--my
 * CSS variables — used by .holo and .grav-btn light emission.
 */
export function usePointerGlow(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, [ref]);
}
