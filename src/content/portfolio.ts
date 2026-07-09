/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENT — preserved verbatim from https://www.deepakgusaiwal.com/
 *  Do not edit copy here without the owner's approval.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  title: 'Deepak Gusaiwal Designer | Indore',
  name: 'Deepak Gusaiwal',
  scrollHint: 'Scroll to Explore',
  linkedin: 'https://www.linkedin.com/in/deepakgusaiwal/',
  email: 'deepak.gusaiwal@outlook.com',
} as const;

export const nav = [
  { label: 'History', href: '#Work' },
  { label: 'Skill', href: '#Skill' },
  { label: 'Testimonials', href: '#Testimonial' },
  { label: 'Contact', href: '#Contact' },
] as const;

/** Hero copy — exact original sentence, split into animatable lines. */
export const heroLines = [
  'Hi! My name is Deepak Gusaiwal,',
  'An UI/UX Designer and Developer from India.',
  'I am passionate about creating',
  'visually stunning and innovative',
  'websites that not only look great but',
  'also provide exceptional user experiences.',
] as const;

export interface HistoryEntry {
  year: string;
  role: string;
  title: string;
  company: string;
}

/** "History" — original order (Current → 2016). Deeper scroll = deeper in time. */
export const history: HistoryEntry[] = [
  { year: '2016', role: 'Web Designer', title: 'Regular Web Designer', company: 'CCW' },
  { year: '2018', role: 'UI/UX Designer', title: 'Crafting Myself', company: 'Exactink' },
  { year: '2024', role: 'UI/UX Developer', title: 'Advance UI/UX Developer', company: 'Videoverse' },
  { year: 'Current', role: 'UI/UX Developer', title: 'Super UI/UX Developer', company: 'Linkites' },
];

/** Mid-journey interlude — original tagline. */
export const interlude = {
  from: '☄ DREAM',
  a: '✦ DESIGN ✦',
  to: '⟶ DEVELOP ⟵',
  b: '🌌 DELIVER',
} as const;

export interface Discipline {
  name: string;
  tools: string[];
  /** planet look */
  hue: string;
  emissive: string;
  radius: number;
  orbit: number;
  speed: number;
  tilt: number;
}

/** "What I do" — each discipline becomes a planet; each tool a satellite. */
export const disciplines: Discipline[] = [
  {
    name: 'Photographie',
    tools: ['Photoshop', 'Lightroom'],
    hue: '#c9c9c9', emissive: '#ededed',
    radius: 0.85, orbit: 4.2, speed: 0.16, tilt: 0.18,
  },
  {
    name: 'Vidéo & Motion',
    tools: ['After Effects', 'Adobe Premiere Pro'],
    hue: '#b3b3b3', emissive: '#ffffff',
    radius: 1.0, orbit: 6.8, speed: 0.12, tilt: -0.24,
  },
  {
    name: 'UX Design',
    tools: ['Adobe XD', 'Figma', 'Sketch', 'Adobe Photoshop'],
    hue: '#a8a8a8', emissive: '#dcdcdc',
    radius: 1.2, orbit: 9.4, speed: 0.09, tilt: 0.3,
  },
  {
    name: 'Development',
    tools: ['HTML/CSS/JAVASCRIPT', 'Wordpress', 'Webflow', 'Shopify', 'React JS'],
    hue: '#bfbfbf', emissive: '#f5f5f5',
    radius: 1.35, orbit: 12.2, speed: 0.07, tilt: -0.12,
  },
  {
    name: 'Animation & 3D',
    tools: ['GSAP', 'Three.js', 'React Three Fiber', 'Framer Motion', 'WebGL Shaders', 'Lenis'],
    hue: '#cbb8e8', emissive: '#d9c8ff',
    radius: 1.1, orbit: 15.2, speed: 0.05, tilt: 0.26,
  },
];

export interface Testimonial {
  name: string;
  position: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Kunal Khandelwal',
    position: 'IT Analyst @ Tata Consultancy Services',
    quote:
      "Imagine pixels with feelings- Deepak speaks their language. They empathize with users, channeling their frustration into elegant solutions. Their UI isn't just user-friendly; it's user-embracing.",
  },
  {
    name: 'Azad Bundela',
    position: 'Consultant @ Infosys',
    quote:
      "Deepak waves prototypes like cosmic spells. Buttons ripples, menus unfold, and transitions wrap reality. Their prototypes? Not just clickable; they're portals to alternate dimensions.",
  },
  {
    name: 'Pawan Yadav',
    position: 'Senior Engineer @ eInfochips (An Arrow Company)',
    quote:
      'When UI quarks misbehave, Deepak dives into quantum solutions. They wrap time zones, align grids, and collapse frustration. Their pixels defy gravity, creating order from chaos.',
  },
];
