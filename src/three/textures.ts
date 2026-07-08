import * as THREE from 'three';

/**
 * Procedural texture kitchen. Everything is painted on <canvas> at boot —
 * real-looking planet surfaces, ring systems and nebulae with zero asset
 * downloads and zero network requests.
 */

// ── tiny value-noise / fbm ────────────────────────────────────────────
function hash(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, seed: number, octaves = 5): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < octaves; o++) {
    value += valueNoise(x * freq, y * freq, seed + o * 13.7) * amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return value;
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return a.clone().lerp(b, Math.min(1, Math.max(0, t)));
}

export type PlanetStyle = 'banded' | 'rocky' | 'ice' | 'terra';

interface PlanetPalette {
  deep: string;
  base: string;
  high: string;
  accent: string;
}

/**
 * Paints a 512×256 equirectangular planet surface.
 * banded → gas giant (Jupiter-like flowing latitudinal bands)
 * rocky  → cratered dusty world
 * ice    → pale marbled world with polar caps
 * terra  → continents + oceans + cloud streaks
 */
export function makePlanetTexture(style: PlanetStyle, palette: PlanetPalette, seed: number): THREE.CanvasTexture {
  const W = 512;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);

  const deep = new THREE.Color(palette.deep);
  const base = new THREE.Color(palette.base);
  const high = new THREE.Color(palette.high);
  const accent = new THREE.Color(palette.accent);

  for (let y = 0; y < H; y++) {
    const v = y / H;
    const lat = Math.abs(v - 0.5) * 2; // 0 equator → 1 pole
    for (let x = 0; x < W; x++) {
      const u = x / W;
      let col: THREE.Color;

      if (style === 'banded') {
        // flowing latitudinal bands with turbulence + storm spots
        const turb = fbm(u * 6, v * 3, seed, 5);
        const band = Math.sin(v * Math.PI * 14 + turb * 5 + Math.sin(u * Math.PI * 2) * 0.4);
        col = lerpColor(base, high, band * 0.5 + 0.5);
        col = lerpColor(col, deep, fbm(u * 3 + 40, v * 6, seed + 5, 4) * 0.55);
        const storm = fbm(u * 9, v * 9, seed + 9, 4);
        if (storm > 0.68) col = lerpColor(col, accent, (storm - 0.68) * 2.4);
      } else if (style === 'rocky') {
        const n = fbm(u * 7, v * 7, seed, 6);
        col = lerpColor(deep, base, n * 1.15);
        const ridge = Math.abs(fbm(u * 12, v * 12, seed + 3, 5) - 0.5) * 2;
        col = lerpColor(col, high, Math.pow(1 - ridge, 6) * 0.5);
        const crater = fbm(u * 18, v * 18, seed + 8, 3);
        if (crater > 0.72) col = lerpColor(col, deep, (crater - 0.72) * 2.2);
        if (crater < 0.2) col = lerpColor(col, accent, (0.2 - crater) * 0.9);
      } else if (style === 'ice') {
        const marble = fbm(u * 5 + fbm(u * 8, v * 8, seed + 2, 4) * 1.6, v * 5, seed, 5);
        col = lerpColor(base, high, marble);
        col = lerpColor(col, accent, Math.pow(fbm(u * 10, v * 10, seed + 6, 4), 3) * 0.7);
        col = lerpColor(col, high, Math.pow(lat, 3.2) * 0.9); // polar caps
        col = lerpColor(col, deep, Math.pow(fbm(u * 4, v * 2, seed + 11, 3), 4) * 0.5);
      } else {
        // terra — continents / seas / clouds
        const cont = fbm(u * 4, v * 4, seed, 6);
        const isLand = cont > 0.52;
        col = isLand
          ? lerpColor(base, high, fbm(u * 10, v * 10, seed + 4, 4))
          : lerpColor(deep, accent, fbm(u * 8, v * 8, seed + 7, 4) * 0.5);
        if (isLand && cont < 0.56) col = lerpColor(col, accent, 0.4); // coastline
        col = lerpColor(col, high, Math.pow(lat, 4) * 0.8); // caps
        const cloud = fbm(u * 6 + 33, v * 6, seed + 21, 5);
        if (cloud > 0.62) col = lerpColor(col, new THREE.Color('#f5f3ee'), (cloud - 0.62) * 1.6);
      }

      const i = (y * W + x) * 4;
      img.data[i] = col.r * 255;
      img.data[i + 1] = col.g * 255;
      img.data[i + 2] = col.b * 255;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Slightly displaced grayscale copy — cheap bump map from the same noise. */
export function makeBumpTexture(seed: number): THREE.CanvasTexture {
  const W = 256;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const g = fbm((x / W) * 9, (y / H) * 9, seed, 5) * 255;
      const i = (y * W + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

/** Radial ring-system texture (for planet rings), bands + gaps like Saturn's. */
export function makeRingTexture(tint: string, seed: number): THREE.CanvasTexture {
  const W = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, 1);
  const c = new THREE.Color(tint);
  for (let x = 0; x < W; x++) {
    const t = x / W;
    let a = fbm(t * 14, 0.5, seed, 4);
    a *= Math.sin(t * Math.PI); // fade both edges
    if (fbm(t * 30, 2.5, seed + 4, 3) > 0.62) a *= 0.15; // Cassini-style gaps
    const i = x * 4;
    img.data[i] = c.r * 255;
    img.data[i + 1] = c.g * 255;
    img.data[i + 2] = c.b * 255;
    img.data[i + 3] = Math.min(1, a * 1.5) * 210;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft radial glow sprite (for star halos / cores). */
export function makeGlowSprite(color: string): THREE.CanvasTexture {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  const c = new THREE.Color(color);
  const rgb = `${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0}`;
  g.addColorStop(0, `rgba(${rgb},0.9)`);
  g.addColorStop(0.25, `rgba(${rgb},0.35)`);
  g.addColorStop(0.6, `rgba(${rgb},0.08)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(canvas);
}

/** Big soft nebula cloud with fbm alpha — billboarded far behind everything. */
export function makeNebulaTexture(inner: string, outer: string, seed: number): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(S, S);
  const a = new THREE.Color(inner);
  const b = new THREE.Color(outer);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const v = y / S;
      const dx = u - 0.5;
      const dy = v - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy) * 2;
      const cloud = fbm(u * 4 + fbm(u * 7, v * 7, seed + 3, 4) * 1.4, v * 4, seed, 5);
      const alpha = Math.max(0, cloud - 0.32) * Math.max(0, 1 - dist) * 1.4;
      const col = lerpColor(a, b, dist + (cloud - 0.5) * 0.6);
      const i = (y * S + x) * 4;
      img.data[i] = col.r * 255;
      img.data[i + 1] = col.g * 255;
      img.data[i + 2] = col.b * 255;
      img.data[i + 3] = Math.min(1, alpha) * 165;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
