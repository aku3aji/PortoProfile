import { useEffect, useState } from 'react';

function match(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

/** Reaktif terhadap `prefers-reduced-motion`, termasuk kalau diubah saat runtime. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => match('(prefers-reduced-motion: reduce)'));

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Media query generik yang aman dipakai saat SSR / build. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => match(query));

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Perangkat berpointer halus (mouse/trackpad) — custom cursor hanya untuk ini. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
