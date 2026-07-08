import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  y?: number;
  blur?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
  selector?: string;
  /** give every matched element its own ScrollTrigger */
  perElement?: boolean;
}

/**
 * Reusable cinematic reveal — elements rise out of distortion
 * (blur + drift) as the camera reaches them.
 */
export function useGsapReveal(
  scope: RefObject<HTMLElement | null>,
  {
    y = 60,
    blur = 14,
    stagger = 0.09,
    start = 'top 78%',
    once = true,
    selector = '[data-reveal]',
    perElement = false,
  }: RevealOptions = {},
): void {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      const from = { opacity: 0, y, filter: `blur(${blur}px)` };
      const toggleActions = once ? 'play none none none' : 'play none none reverse';

      if (perElement) {
        targets.forEach((el) => {
          gsap.fromTo(el, from, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start, toggleActions },
          });
        });
      } else {
        gsap.fromTo(targets, from, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: root, start, toggleActions },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [scope, y, blur, stagger, start, once, selector, perElement]);
}
