import { create } from 'zustand';

interface UniverseState {
  /** 0 → 1 across the whole journey (Lenis-driven) */
  progress: number;
  /** normalized pointer, -1 → 1 */
  mouse: { x: number; y: number };
  /** discipline planet currently hovered (index into content) or null */
  hoveredPlanet: number | null;
  /** user-drag rotation offset of the skill galaxy */
  galaxySpin: number;
  ready: boolean;
  reducedMotion: boolean;
  contactCollapsed: boolean;
  setProgress: (p: number) => void;
  setMouse: (x: number, y: number) => void;
  setHoveredPlanet: (i: number | null) => void;
  addGalaxySpin: (d: number) => void;
  setReady: (r: boolean) => void;
  setReducedMotion: (r: boolean) => void;
  setContactCollapsed: (c: boolean) => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  progress: 0,
  mouse: { x: 0, y: 0 },
  hoveredPlanet: null,
  galaxySpin: 0,
  ready: false,
  reducedMotion: false,
  contactCollapsed: false,
  setProgress: (progress) => set({ progress }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setHoveredPlanet: (hoveredPlanet) => set({ hoveredPlanet }),
  addGalaxySpin: (d) => set((s) => ({ galaxySpin: s.galaxySpin + d })),
  setReady: (ready) => set({ ready }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setContactCollapsed: (contactCollapsed) => set({ contactCollapsed }),
}));
