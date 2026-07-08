import { create } from 'zustand';

interface UniverseState {
  /** 0 → 1 across the whole journey (Lenis-driven) */
  progress: number;
  /** signed scroll velocity, roughly -1 → 1 (Lenis-driven) — powers star trails */
  velocity: number;
  /** normalized pointer, -1 → 1 */
  mouse: { x: number; y: number };
  /** discipline planet currently hovered (index into content) or null */
  hoveredPlanet: number | null;
  /** user-drag rotation offset of the skill galaxy */
  galaxySpin: number;
  /** 0 → 1 → 0 one-shot warp surge while the wormhole opens on "Enter the void" */
  enterWarp: number;
  /** 0 → 1 the big bang: the universe expands out of the first singularity */
  birth: number;
  ready: boolean;
  reducedMotion: boolean;
  audioOn: boolean;
  contactCollapsed: boolean;
  setProgress: (p: number) => void;
  setVelocity: (v: number) => void;
  setMouse: (x: number, y: number) => void;
  setHoveredPlanet: (i: number | null) => void;
  addGalaxySpin: (d: number) => void;
  setEnterWarp: (w: number) => void;
  setBirth: (b: number) => void;
  setReady: (r: boolean) => void;
  setReducedMotion: (r: boolean) => void;
  setAudioOn: (a: boolean) => void;
  setContactCollapsed: (c: boolean) => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  progress: 0,
  velocity: 0,
  mouse: { x: 0, y: 0 },
  hoveredPlanet: null,
  galaxySpin: 0,
  enterWarp: 0,
  birth: 0,
  ready: false,
  reducedMotion: false,
  audioOn: false,
  contactCollapsed: false,
  setProgress: (progress) => set({ progress }),
  setVelocity: (velocity) => set({ velocity }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setHoveredPlanet: (hoveredPlanet) => set({ hoveredPlanet }),
  addGalaxySpin: (d) => set((s) => ({ galaxySpin: s.galaxySpin + d })),
  setEnterWarp: (enterWarp) => set({ enterWarp }),
  setBirth: (birth) => set({ birth }),
  setReady: (ready) => set({ ready }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setAudioOn: (audioOn) => set({ audioOn }),
  setContactCollapsed: (contactCollapsed) => set({ contactCollapsed }),
}));
