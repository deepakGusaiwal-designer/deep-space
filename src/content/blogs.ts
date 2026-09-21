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
    readTime: '8 min read',
    tags: ['WebGL', 'GLSL', 'Three.js', 'Shader Art', 'R3F'],
    featured: true,
    content: [
      'When planning the redesign for deepakgusaiwal.com, the core design philosophy was simple: digital portfolios should feel less like flat documents and more like traversable worlds. We wanted visitors to feel the visceral sensation of navigating past gravitational horizons, orbiting planets, and witnessing relativistic space phenomena.',
      'Most 3D websites rely on pre-baked textures or heavy GLTF 3D models downloaded over the network. However, simulating a true black hole requires bending light itself — an optical phenomenon known as gravitational lensing that is fundamentally impossible with standard raster geometry. The solution was to hand-write a custom GLSL fragment shader that performs numerical photon geodesic raymarching on a single screen-filling quad.',
      'In traditional raytracing, light rays travel in straight Euclidean lines: p(t) = origin + t * direction. Near a singularity, however, spacetime curvature forces photons along curved null geodesics. Our Fragment Shader calculates light deflection using an approximation of Einstein\'s general relativity field equations: a = -1.5 * h² * r / |r|⁵, where h represents the photon\'s angular momentum relative to the singularity.',
      'At each marching iteration, the photon step size adapts dynamically. Far away from the event horizon, the ray advances in larger steps to conserve GPU cycles. As the ray plunges into the high-curvature ergosphere, the step size decreases exponentially to capture the subtle warping of background stars and the inner edge of the accretion disk.',
      'The accretion disk itself is computed analytically on the equatorial plane (y = 0). When a bent ray intersects this plane, it samples procedural Fractional Brownian Motion (fBm) noise layered with rotational velocity vectors. This produces the iconic double-arc silhouette popularized by Kip Thorne and the visual effects team of Interstellar, where the rear of the disk appears both above and below the central shadow simultaneously.',
      'To make the scene feel truly relativistic rather than a static computer graphic, we implemented relativistic Doppler beaming and gravitational redshift. Matter in the accretion disk orbiting toward the observer is blue-shifted, emitting intense high-energy radiance. Matter orbiting away is redshifted into dim, stretched amber hues. This asymmetry creates genuine scientific authenticity and emotional immersion.',
      'Performance was paramount. Running an intensive numerical integrator at 60 FPS across mobile and low-power laptops required strict shader optimization: loop unrolling was capped, trigonometric evaluations were replaced with polynomial approximations, and branch divergence was eliminated in inner loops.',
      'Finally, by decoupling text paint from the Three.js Canvas mount using React 19 lazy loading and code splitting, visitors experience instant typography rendering while the WebGL universe boots smoothly in the background without blocking the main browser thread.'
    ]
  },
  {
    id: '2',
    slug: 'future-of-micro-interactions-gsap-lenis-react',
    title: 'Fluid Motion: Syncing GSAP ScrollTrigger with Lenis in React',
    subtitle: 'Creating momentum-driven camera flights and tactile UI feedback without frame drops.',
    excerpt: 'A technical guide on orchestrating buttery-smooth scrolling with Lenis, GSAP tickers, and React 19 component lifecycles.',
    category: 'Creative Dev',
    date: 'July 2026',
    readTime: '7 min read',
    tags: ['GSAP', 'Lenis', 'React 19', 'Web Animation', 'UX'],
    content: [
      'High-end interactive websites often suffer from jittery, stuttering scroll behavior when multiple animation libraries and physics loops fight for requestAnimationFrame control.',
      'In a modern web app combining React 19, DOM typography reveals, and Three.js WebGL canvas transforms, allowing native browser scroll to update independently from the 3D render loop results in visible frame tearing and camera desynchronization.',
      'In our architecture, Lenis serves as the single source of truth for physical scroll position. Rather than letting the browser trigger asynchronous wheel events, Lenis intercepts scroll deltas, computes exponential momentum damping, and publishes a normalized progress float (0.0 to 1.0) into a lightweight Zustand state store.',
      'To ensure absolute frame-lock, we bind Lenis directly to the GSAP Ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))` while configuring `gsap.ticker.lagSmoothing(0)`. This completely eliminates time dilation and frame skips when users scroll aggressively through content.',
      'On the WebGL side, our Three.js Catmull-Rom spline camera interpolator samples this progress float with frame-rate independent exponential smoothing: `pos += (target - pos) * (1 - Math.exp(-lambda * dt))`. This guarantees that whether a user is browsing on a 60 Hz mobile display or a 144 Hz ProMotion desktop monitor, camera flight paths feel identical in weight and responsiveness.',
      'Crucially, DOM micro-interactions — such as magnetic hover buttons, glowing borders, and section opacity fades — piggyback on the same normalized tick. This architectural harmony transforms scrolling from a utilitarian mechanism into an intuitive cinematic controller.',
      'Accessibility is preserved by querying `window.matchMedia("(prefers-reduced-motion: reduce)")`. When reduced motion is requested, smooth scroll inertia is disabled, GSAP timelines snap to instant completion, and the camera defaults to static framing, ensuring comfortable exploration for all visitors.'
    ]
  },
  {
    id: '3',
    slug: 'procedural-pbr-textures-vs-image-downloads',
    title: 'Why Procedural Textures Beat Image Downloads for Web Performance',
    subtitle: 'How 2D Offscreen Canvas noise generation creates infinite detail with zero download weight.',
    excerpt: 'Explore how procedural noise generation on HTML5 Offscreen Canvases replaces megabytes of diffuse and bump maps.',
    category: '3D & WebGL',
    date: 'June 2026',
    readTime: '6 min read',
    tags: ['Performance', 'Canvas API', 'PBR', 'Optimization'],
    content: [
      'In traditional 3D web experiences, loading high-resolution 2K/4K planet textures, roughness maps, and normal maps can easily consume 20MB to 50MB of network bandwidth. On mobile networks or slow connections, this leads to painful load spinners, layout shifts, and high bounce rates.',
      'For the deep-space solar system within this portfolio, downloading static JPG or PNG image files was eliminated entirely. Instead, we generate planetary surfaces, terrain bump maps, crater fields, and swirling atmospheric gas bands dynamically on HTML5 Offscreen Canvases during application boot.',
      'Using layered Fractional Brownian Motion (fBm) and Simplex Noise algorithms, each planet receives a unique, mathematically crisp procedural texture rendered directly on the client machine in less than 15 milliseconds.',
      'Because the generation code is pure mathematical logic running inside an OffscreenCanvas worker, the entire texture generation pipeline adds less than 4 kilobytes of gzipped JavaScript to the initial bundle — reducing asset payload by over 99% compared to rasterized images.',
      'Furthermore, procedural textures possess infinite resolution characteristics. When the camera flies within millimeters of an planetary mesh during a transition, the shader can evaluate sub-pixel noise octaves on the fly, avoiding the blurry pixelation typical of compressed raster textures.',
      'To prevent GPU memory bloat, once the procedural canvases render their initial PBR maps, the raw 2D contexts are garbage collected and only the final WebGLTexture references remain bound to Three.js MeshStandardMaterial instances.',
      'This zero-download strategy proves that with thoughtful algorithmic design, web experiences can achieve cinematic fidelity without sacrificing instant page loads.'
    ]
  },
  {
    id: '4',
    slug: 'crafting-empathic-ui-ux-design-systems',
    title: 'Crafting Empathic UI/UX: Beyond Sterile Component Libraries',
    subtitle: 'Design tokens, spatial hierarchy, and sensory design that connects with users on an emotional level.',
    excerpt: 'Why modern digital design must balance structured usability with atmospheric storytelling and personality.',
    category: 'UI/UX Design',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Design Systems', 'UI/UX', 'Product Design', 'Accessibility'],
    content: [
      'The modern web has become increasingly homogenous. A sea of sterile white boxes, identical card grids, and cookie-cutter component libraries has made many digital products functional but emotionally forgettable.',
      'True digital craftsmanship lies at the intersection of unwavering usability and atmospheric storytelling. When designing deepakgusaiwal.com, the objective was to craft an interface that feels like an operable spacecraft cockpit rather than a collection of flat HTML elements.',
      'Spatial hierarchy is established through lighting and depth rather than heavy outlines. We employ glassmorphism with dynamic backdrop filters, ambient glow shaders that follow the cursor, and subtle vignette frames that focus user attention on active content.',
      'Micro-interactions must provide tactile feedback. Buttons should feel magnetic — slightly resisting when pushed away, gently snapping when approached. Audio toggles should whisper subtle hums rather than jarring blips. Every sensory cue should reinforce the feeling of inhabiting a living digital world.',
      'Yet aesthetic boldness must never compromise accessibility. Empathic design means designing for everyone. We implement high-contrast typographic scales with DM Sans, full keyboard navigational tab-indexes, ARIA screen-reader labels for all WebGL controls, and automated reduced-motion fallbacks.',
      'When design systems balance emotional depth with engineering rigor, users do not merely browse a site — they remember it.'
    ]
  },
  {
    id: '5',
    slug: 'building-browser-3d-audio-nostalgia-radio',
    title: 'Building a Browser 3D Audio Experience: The Making of Nostalgia Radio',
    subtitle: 'Combining the Web Audio API, spatial audio panning, and Three.js physics to recreate vintage acoustics.',
    excerpt: 'How we engineered an interactive 3D retro wooden radio with analog dial tuning, tube amplifier distortion, and Web Audio spatial soundscapes.',
    category: '3D & WebGL',
    date: 'September 2026',
    readTime: '8 min read',
    tags: ['Web Audio API', 'Three.js', 'Spatial Audio', 'Interactive Design', 'R3F'],
    content: [
      'Sound is often treated as an afterthought on the web — either completely ignored or forced through abrupt autoplay audio that frustrates users. With Nostalgia Radio, our ambition was the opposite: to build a tactile, memory-evoking acoustic artifact in 3D that rewards curiosity.',
      'The core challenge was recreating the authentic warmth and imperfection of a 1950s vacuum tube receiver entirely inside the browser without downloading massive audio stems.',
      'We architected an audio graph using the native Web Audio API. Incoming audio streams route through a chain of processing nodes: a BiquadFilterNode configured as a resonant bandpass filter, a WaveShaperNode applying subtle hyperbolic tangent (tanh) soft clipping to simulate tube saturation, and a ConvolverNode supplying vintage room impulse responses.',
      'Tuning the radio dial is physically linked to Three.js mesh rotation. As the user drags the brass tuning knob, the rotational angle maps directly to filter cutoff frequencies and white noise gain. Between stations, analog static noise surges; as the dial locks onto a frequency, the bandpass filter opens and the music blooms into warm stereo clarity.',
      'Spatial audio panning is driven by Web Audio\'s PannerNode. The position of the 3D radio mesh in Three.js world space continuously updates the listener orientation matrix, allowing sound to naturally pan and attenuate as the user rotates or zooms the camera.',
      'To comply with browser autoplay policies, the AudioContext remains in a suspended state until the user explicitly turns the physical power switch, respecting user autonomy and device battery life.',
      'The result is an intimate, nostalgic playground demonstrating how the union of Web Audio and 3D graphics can transform passive listeners into active participants.'
    ]
  },
  {
    id: '6',
    slug: '60fps-webgl-performance-tactics-for-react',
    title: 'The 60 FPS WebGL Performance Playbook for React & Three.js',
    subtitle: 'Proven architectural strategies for eliminating stutter, memory leaks, and CPU overhead in interactive web graphics.',
    excerpt: 'Practical performance guidelines for building high-frame-rate Three.js and React Three Fiber applications that run smoothly across desktop and mobile devices.',
    category: 'Creative Dev',
    date: 'September 2026',
    readTime: '9 min read',
    tags: ['Performance', 'React Three Fiber', 'WebGL', 'Memory Management', 'Optimization'],
    content: [
      'Building 3D graphics in React using React Three Fiber (R3F) is exceptionally productive, but without disciplined performance habits, developers often encounter micro-stutters, battery drain, and out-of-memory crashes on mobile devices.',
      'The most critical rule in R3F architecture is: Never trigger React component re-renders inside the animation loop. In traditional React development, state updates drive the UI. In high-performance WebGL, the animation loop runs 60 or 120 times per second; updating React state at that frequency causes thousands of unnecessary reconciliation passes.',
      'Instead, mutable 3D properties (such as positions, rotations, and shader uniforms) should be mutated directly via refs inside the `useFrame` callback: `meshRef.current.rotation.y += delta`. Keep React state strictly reserved for structural milestones, like switching scenes or toggling menus.',
      'Another common pitfall is the failure to dispose of WebGL resources. In Three.js, geometries, materials, and textures allocate memory directly on the GPU. When a React component unmounts, garbage collection frees the JavaScript wrapper, but the GPU buffers remain orphaned in memory until the page is closed.',
      'To solve this, implement rigorous disposal routines: always invoke `geometry.dispose()`, `material.dispose()`, and `texture.dispose()` inside `useEffect` cleanup hooks, or leverage R3F\'s automatic disposal flags.',
      'Draw calls represent the single biggest CPU bottleneck in WebGL. Instead of rendering 500 individual mesh objects, utilize `InstancedMesh`. An instanced mesh allows the GPU to render thousands of identical objects — such as star fields, asteroid belts, or UI particles — in a single draw call with unique transform matrices.',
      'Finally, enforce adaptive pixel ratio scaling: `gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Rendering at native 3x or 4x Retina resolutions produces negligible visual improvement while exponentially increasing fragment shader fill rate.',
      'By applying these architectural patterns, complex 3D experiences maintain rock-solid 60 FPS performance without heating up users\' laptops or draining mobile batteries.'
    ]
  },
  {
    id: '7',
    slug: 'designing-for-spatial-depth-modern-web',
    title: 'Designing for Spatial Depth: Atmospheric UI, Micro-Interactions, and WebGL',
    subtitle: 'Balancing extreme visual storytelling with clarity, contrast, and conversion in modern digital products.',
    excerpt: 'How to integrate cinematic depth, 3D camera staging, and motion design into web applications without hurting product clarity or usability.',
    category: 'UI/UX Design',
    date: 'August 2026',
    readTime: '7 min read',
    tags: ['UI/UX Design', 'Spatial Design', 'Motion Design', 'Creative Direction'],
    content: [
      'For decades, web design lived inside flat two-dimensional grids. While flat design brought clarity and responsive layout standards, it also stripped digital products of atmospheric wonder and depth.',
      'Spatial depth in digital design is not about arbitrarily throwing 3D models onto a screen. It is about establishing a coherent visual physics — a sense of atmospheric environment where elements have weight, light, and tangible presence.',
      'Lighting is the cornerstone of spatial UI. In deepakgusaiwal.com, interface cards do not rely on hard borders. Instead, simulated directional light grazes surface edges, casting soft specular glows that react dynamically to cursor movement.',
      'Parallax scrolling should serve narrative intent rather than visual gimmickry. Layering foreground content, midground floating typography, and background cosmic singularities creates a sense of scale that draws the user deeper into the story as they scroll.',
      'Crucially, visual depth must never sacrifice reading ergonomics. High-priority information — case studies, contact links, and editorial text — must remain pinned to crisp, high-contrast planes with ample breathing room and calibrated typography.',
      'When done thoughtfully, spatial depth transforms a digital visit from a quick skim into an unforgettable journey.'
    ]
  }
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
