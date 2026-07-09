import { create } from 'zustand';

/**
 * The single source of truth the whole universe reads from each frame.
 * Scroll drives `progress`; the pointer drives `mouse`; the loader drives
 * `ready` / `enterWarp`. Everything cinematic keys off these.
 */
interface UniverseState {
  /** 0 → 1 across the whole flight (Lenis-driven) */
  progress: number;
  /** signed scroll velocity, roughly -1 → 1 — powers star trails */
  velocity: number;
  /** normalized pointer, -1 → 1 (used for cinematic parallax) */
  mouse: { x: number; y: number };
  /** which journey world is hovered ('earth' | 'mars' | 'saturn') or null */
  hoveredWorld: string | null;
  /** 0 → 1 → 0 one-shot warp surge as the loader's wormhole opens */
  enterWarp: number;
  ready: boolean;
  reducedMotion: boolean;
  audioOn: boolean;
  setProgress: (p: number) => void;
  setVelocity: (v: number) => void;
  setMouse: (x: number, y: number) => void;
  setHoveredWorld: (id: string | null) => void;
  setEnterWarp: (w: number) => void;
  setReady: (r: boolean) => void;
  setReducedMotion: (r: boolean) => void;
  setAudioOn: (a: boolean) => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  progress: 0,
  velocity: 0,
  mouse: { x: 0, y: 0 },
  hoveredWorld: null,
  enterWarp: 0,
  ready: false,
  reducedMotion: false,
  audioOn: false,
  setProgress: (progress) => set({ progress }),
  setVelocity: (velocity) => set({ velocity }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setHoveredWorld: (hoveredWorld) => set({ hoveredWorld }),
  setEnterWarp: (enterWarp) => set({ enterWarp }),
  setReady: (ready) => set({ ready }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setAudioOn: (audioOn) => set({ audioOn }),
}));
