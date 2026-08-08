import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useFinePointer, useReducedMotion } from './useReducedMotion';

/**
 * Efek magnetic: elemen sedikit "tertarik" ke arah kursor saat di-hover,
 * lalu kembali ke posisi semula dengan easing. Mati di perangkat sentuh
 * dan saat `prefers-reduced-motion`.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.32) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !finePointer) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, reduced, finePointer]);

  return ref;
}
