import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';

interface RevealOptions {
  /** Selector anak yang direveal. Default: `.js-reveal`. */
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** Tambahkan clip-path reveal di atas fade + translate. */
  clip?: boolean;
}

/**
 * Reveal scroll-driven standar situs ini: fade + translate (+ clip opsional),
 * staggered, dipicu ScrollTrigger. Kalau reduced-motion aktif, elemen langsung
 * ditampilkan tanpa animasi.
 */
export function useReveal(
  scope: RefObject<HTMLElement | null>,
  { selector = '.js-reveal', y = 34, stagger = 0.08, duration = 1.05, start = 'top 82%', clip = false }: RevealOptions = {},
) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector, root);
      if (targets.length === 0) return;

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, clipPath: 'none' });
        return;
      }

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          ...(clip ? { clipPath: 'inset(0 0 100% 0)' } : {}),
        },
        {
          opacity: 1,
          y: 0,
          ...(clip ? { clipPath: 'inset(0 0 0% 0)' } : {}),
          duration,
          stagger,
          scrollTrigger: { trigger: root, start, once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [scope, selector, y, stagger, duration, start, clip, reduced]);
}

/** Parallax lembut: elemen bergerak lebih lambat/cepat dari scroll. */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  { distance = 80, start = 'top bottom', end = 'bottom top' } = {},
) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = target.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [target, distance, start, end, reduced]);
}
