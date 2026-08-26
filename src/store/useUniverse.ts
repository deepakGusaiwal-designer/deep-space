import { create } from 'zustand';

export type GraphicsQuality = 'auto' | 'high' | 'medium' | 'low';

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
  graphicsQuality: GraphicsQuality;
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
  setGraphicsQuality: (q: GraphicsQuality) => void;
  setContactCollapsed: (c: boolean) => void;
}

const getInitialQuality = (): GraphicsQuality => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('deep_space_graphics_quality') as GraphicsQuality | null;
    if (saved === 'auto' || saved === 'high' || saved === 'medium' || saved === 'low') return saved;
  }
  return 'auto';
};

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
  graphicsQuality: getInitialQuality(),
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
  setGraphicsQuality: (graphicsQuality) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('deep_space_graphics_quality', graphicsQuality);
    }
    set({ graphicsQuality });
  },
  setContactCollapsed: (contactCollapsed) => set({ contactCollapsed }),
}));
