export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string[];
  contentHtml?: string;
  date: string;
  readTime: string;
  category: '3D & WebGL' | 'UI/UX Design' | 'Creative Dev' | 'Case Study';
  tags: string[];
  featured?: boolean;
}

export const BLOG_CATEGORIES = ['All', '3D & WebGL', 'UI/UX Design', 'Creative Dev', 'Case Study'] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'designing-inside-a-singularity-raymarched-3d-portfolio',
    title: 'Designing Inside a Singularity: Building a Raymarched 3D Experience',
    subtitle: 'How numerical photon geodesics and GLSL shaders brought an Interstellar-inspired black hole to the browser in a single draw call.',
    excerpt: 'Deep-dive into the mathematical and visual techniques used to build a real-time raymarched black hole with relativistic Doppler beaming and gravitational lensing.',
    category: '3D & WebGL',
    date: 'August 2026',
    readTime: '6 min read',
    tags: ['WebGL', 'GLSL', 'Three.js', 'Shader Art', 'R3F'],
    featured: true,
    content: [
      'When planning the redesign for deepakgusaiwal.com, the core design philosophy was simple: digital portfolios should feel less like flat documents and more like traversable worlds.',
      'Most 3D websites rely on pre-baked textures or heavy GLTF 3D models. However, simulating a true black hole requires bending light itself — an effect impossible with standard raster geometry. The solution was to hand-write a custom GLSL fragment shader that performs numerical photon geodesic raymarching on a single quad.',
      'The Fragment Shader calculates light deflection using an approximation of Einstein\'s general relativity field equations: a = -1.5 * h² * r / |r|⁵, where h is angular momentum. At every plane crossing along y = 0, the ray samples the accretion disk noise, producing the distinctive double-arc seen above and below the event horizon.',
      'To make the scene feel visceral, we implemented relativistic Doppler beaming — matter orbiting towards the viewer shines significantly brighter and hotter (blue-white) than matter orbiting away (dim amber).',
      'By decoupling text paint from the Canvas mount via React 19 lazy loading and code splitting, visitors experience instant typography rendering while the WebGL universe boots smoothly in the background.'
    ]
  },
  // {
  //   id: '2',
  //   slug: 'future-of-micro-interactions-gsap-lenis-react',
  //   title: 'Fluid Motion: Syncing GSAP ScrollTrigger with Lenis in React',
  //   subtitle: 'Creating momentum-driven camera flights and tactile UI feedback without frame drops.',
  //   excerpt: 'A technical guide on orchestrating buttery-smooth scrolling with Lenis, GSAP tickers, and React 19 component lifecycles.',
  //   category: 'Creative Dev',
  //   date: 'July 2026',
  //   readTime: '5 min read',
  //   tags: ['GSAP', 'Lenis', 'React 19', 'Web Animation', 'UX'],
  //   content: [
  //     'High-end interactive websites often suffer from jittery scrolling when multiple animation engines fight for requestAnimationFrame control.',
  //     'In our architecture, Lenis acts as the single source of truth for physical scroll position, publishing a normalized progress float from 0.0 to 1.0 into a lightweight Zustand store.',
  //     'By binding Lenis to the GSAP Ticker via `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `lagSmoothing(0)`, we eliminate frame drift between DOM reveals and Three.js camera transforms.',
  //     'Furthermore, the Catmull-Rom spline camera interpolator samples this progress float with frame-rate independent damping (`1 - Math.exp(-lambda * dt)`), giving users tactile weight when passing through high-gravity zones.'
  //   ]
  // },
  // {
  //   id: '3',
  //   slug: 'procedural-pbr-textures-vs-image-downloads',
  //   title: 'Why Procedural Textures Beat Image Downloads for Web Performance',
  //   subtitle: 'How 2D Offscreen Canvas noise generation creates infinite detail with zero download weight.',
  //   excerpt: 'Explore how procedural noise generation on HTML5 Offscreen Canvases replaces megabytes of diffuse and bump maps.',
  //   category: '3D & WebGL',
  //   date: 'June 2026',
  //   readTime: '4 min read',
  //   tags: ['Performance', 'Canvas API', 'PBR', 'Optimization'],
  //   content: [
  //     'In traditional 3D web experiences, loading high-resolution 2K/4K planet textures and bump maps can easily consume 20MB+ of network bandwidth, leading to slow mobile loads and high bounce rates.',
  //     'Instead of downloading static JPG/PNG textures, we generate planetary surfaces, terrain bump maps, and cloud bands dynamically on 2D Offscreen Canvases during application boot.',
  //     'Using layered Fractional Brownian Motion (fBm) and Simplex Noise algorithms, each planet receives a unique, crystal-clear procedural texture rendered directly on the client machine in less than 15 milliseconds.',
  //     'This reduces asset payload to zero bytes for textures while maintaining sharp detail even when the camera zooms intimately close.'
  //   ]
  // },
  // {
  //   id: '4',
  //   slug: 'crafting-empathic-ui-ux-design-systems',
  //   title: 'Crafting Empathic UI/UX: Beyond Sterile Component Libraries',
  //   subtitle: 'Design tokens, spatial hierarchy, and sensory design that connects with users on an emotional level.',
  //   excerpt: 'Why modern digital design must balance structured usability with atmospheric storytelling and personality.',
  //   category: 'UI/UX Design',
  //   date: 'May 2026',
  //   readTime: '5 min read',
  //   tags: ['Design Systems', 'UI/UX', 'Product Design', 'Accessibility'],
  //   content: [
  //     'The modern web has become increasingly homogenous — sterile white boxes, identical card grids, and cookie-cutter templates.',
  //     'True digital craftsmanship lies at the intersection of unwavering usability and unforgettable atmospheric identity.',
  //     'By utilizing subtle depth cues, glassmorphism, responsive ambient audio, and magnetic focal points, we can guide the user\'s curiosity rather than demanding their attention.',
  //     'Crucially, strong aesthetic identity must never compromise accessibility. Automatic detection of `prefers-reduced-motion`, clean keyboard navigation, and semantic DOM fallbacks ensure that everyone can experience the story regardless of device or input capability.'
  //   ]
  // }
];

const STORAGE_KEY = 'deep_space_custom_blogs';

/** Get custom posts stored in browser localStorage */
export function getStoredCustomPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading custom blog posts from storage:', e);
    return [];
  }
}

/** Get all blog posts (custom localStorage posts merged with built-in code posts) */
export function getAllBlogPosts(): BlogPost[] {
  const custom = getStoredCustomPosts();
  const builtInSlugs = new Set(custom.map((p) => p.slug));
  const filteredBuiltIn = BLOG_POSTS.filter((p) => !builtInSlugs.has(p.slug));
  return [...custom, ...filteredBuiltIn];
}

/** Save or update a custom blog post */
export function saveCustomPost(post: BlogPost): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCustomPosts();
    const existingIndex = current.findIndex((p) => p.id === post.id || p.slug === post.slug);
    let updated: BlogPost[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = post;
    } else {
      updated = [post, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom post:', e);
  }
}

/** Delete a custom blog post */
export function deleteCustomPost(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCustomPosts();
    const filtered = current.filter((p) => p.id !== id && p.slug !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting custom post:', e);
  }
}

/** Generate formatted TypeScript code for src/content/blogs.ts */
export function generateExportCode(posts: BlogPost[]): string {
  return `export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string[];
  contentHtml?: string;
  date: string;
  readTime: string;
  category: '3D & WebGL' | 'UI/UX Design' | 'Creative Dev' | 'Case Study';
  tags: string[];
  featured?: boolean;
}

export const BLOG_CATEGORIES = ['All', '3D & WebGL', 'UI/UX Design', 'Creative Dev', 'Case Study'] as const;

export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;
}
