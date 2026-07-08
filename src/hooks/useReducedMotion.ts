import { useEffect } from 'react';
import { useUniverse } from '../store/useUniverse';

/** Syncs the OS-level motion preference into the universe store. */
export function useReducedMotionSync(): void {
  const setReducedMotion = useUniverse((s) => s.setReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [setReducedMotion]);
}
