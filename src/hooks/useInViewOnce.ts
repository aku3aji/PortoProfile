import { useLayoutEffect, useState, type RefObject } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * `true` sekali section masuk viewport — dipakai untuk memicu typewriter dan
 * urutan terminal di section IDE Mode.
 */
export function useInViewOnce(ref: RefObject<HTMLElement | null>, start = 'top 72%'): boolean {
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => setInView(true),
    });

    return () => trigger.kill();
  }, [ref, start, inView]);

  return inView;
}
