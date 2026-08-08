import { useEffect, useRef, useState } from 'react';
import { lerp } from '@/lib/utils';
import { useFinePointer, useReducedMotion } from './useReducedMotion';

export type CursorVariant = 'default' | 'link' | 'view' | 'text' | 'hidden';

interface CursorState {
  variant: CursorVariant;
  label: string;
  pressed: boolean;
}

/**
 * State machine custom cursor.
 *
 * Elemen mana pun bisa mengubah bentuk cursor lewat atribut DOM:
 *   data-cursor="link" | "view" | "text" | "hidden"
 *   data-cursor-label="VIEW ↗"   (khusus varian "view")
 *
 * Cursor mati sendiri di perangkat sentuh, dan trailing-nya dimatikan
 * kalau pengguna memilih `prefers-reduced-motion`.
 */
export function useCursor() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = finePointer;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    variant: 'default',
    label: '',
    pressed: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    return () => root.classList.remove('has-custom-cursor');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...mouse };
    const ringPos = { ...mouse };

    /** Elemen yang sedang di-hover dan boleh menarik ring ke tengahnya. */
    let magneticTarget: Element | null = null;
    let visible = false;
    let frame = 0;

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      dot.style.opacity = next ? '1' : '0';
      ring.style.opacity = next ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const holder = target?.closest?.('[data-cursor]') ?? null;

      if (!holder) {
        magneticTarget = null;
        setState((prev) =>
          prev.variant === 'default' && prev.label === '' ? prev : { ...prev, variant: 'default', label: '' },
        );
        return;
      }

      const variant = (holder.getAttribute('data-cursor') as CursorVariant) || 'default';
      const label = holder.getAttribute('data-cursor-label') ?? '';
      magneticTarget = variant === 'link' && !reduced ? holder : null;

      setState((prev) =>
        prev.variant === variant && prev.label === label ? prev : { ...prev, variant, label },
      );
    };

    const onDown = () => setState((prev) => (prev.pressed ? prev : { ...prev, pressed: true }));
    const onUp = () => setState((prev) => (prev.pressed ? { ...prev, pressed: false } : prev));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const render = () => {
      // Tujuan ring: posisi mouse, atau ditarik ke tengah elemen magnetik.
      let ringTargetX = mouse.x;
      let ringTargetY = mouse.y;

      if (magneticTarget?.isConnected) {
        const r = magneticTarget.getBoundingClientRect();
        ringTargetX = lerp(mouse.x, r.left + r.width / 2, 0.42);
        ringTargetY = lerp(mouse.y, r.top + r.height / 2, 0.42);
      } else if (magneticTarget) {
        magneticTarget = null;
      }

      if (reduced) {
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
        ringPos.x = ringTargetX;
        ringPos.y = ringTargetY;
      } else {
        dotPos.x = lerp(dotPos.x, mouse.x, 0.38);
        dotPos.y = lerp(dotPos.y, mouse.y, 0.38);
        ringPos.x = lerp(ringPos.x, ringTargetX, 0.14);
        ringPos.y = lerp(ringPos.y, ringTargetY, 0.14);
      }

      // Elemen pembungkusnya berukuran 0×0; pemusatan diurus visual di dalamnya.
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, reduced]);

  return { enabled, dotRef, ringRef, ...state };
}
