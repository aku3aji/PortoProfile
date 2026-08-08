import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

let instance: Lenis | null = null;

/** Scroll ke elemen dengan id tertentu — lewat Lenis kalau aktif. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const offset = -(parseFloat(getComputedStyle(document.documentElement).fontSize) * 4);

  if (instance) instance.scrollTo(el, { offset, duration: 1.2 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Kunci scroll (dipakai saat preloader & mobile menu terbuka). */
export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.body.style.overflow = locked ? 'hidden' : '';
}

/**
 * Smooth scroll Lenis yang disinkronkan dengan GSAP ScrollTrigger.
 * Otomatis tidak dijalankan kalau pengguna minta reduced motion.
 */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      instance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}
