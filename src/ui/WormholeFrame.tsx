import { useEffect, useRef } from 'react';
import { useUniverse } from '../store/useUniverse';

/**
 * A screen-space vortex that frames the whole page — a swirling ring of
 * light that lives at the edges of the viewport at all times, rather than
 * a 3D tunnel you fly through once. Deepens gently with scroll progress.
 * Pure CSS/DOM so it stays cheap and sits above the Canvas but behind copy.
 */
export default function WormholeFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (progress: number, reducedMotion: boolean) => {
      el.style.setProperty('--wh-intensity', String(0.32 + progress * 0.5));
      el.style.setProperty('--wh-play', reducedMotion ? 'paused' : 'running');
    };
    apply(useUniverse.getState().progress, useUniverse.getState().reducedMotion);
    return useUniverse.subscribe((s) => apply(s.progress, s.reducedMotion));
  }, []);

  return (
    <div ref={ref} className="wormhole-frame" aria-hidden="true">
      <div className="wormhole-frame__ring wormhole-frame__ring--outer">
        <div className="wormhole-frame__spin" />
      </div>
      <div className="wormhole-frame__ring wormhole-frame__ring--inner">
        <div className="wormhole-frame__spin" />
      </div>
      <div className="wormhole-frame__dust" />
    </div>
  );
}
