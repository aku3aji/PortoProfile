import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { setScrollLocked } from '@/hooks/useLenis';

const DURATION = 1000;

export function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setScrollLocked(true);

    if (reduced) {
      setProgress(100);
      const timer = window.setTimeout(onDone, 200);
      return () => window.clearTimeout(timer);
    }

    let frame = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const ratio = Math.min(1, (now - startedAt) / DURATION);
      // Easing out supaya angkanya melambat menjelang 100.
      setProgress(Math.round((1 - Math.pow(1 - ratio, 3)) * 100));
      if (ratio < 1) frame = requestAnimationFrame(tick);
      else onDone();
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col justify-between bg-base px-6 py-8 sm:px-10 sm:py-12"
      initial={{ opacity: 1 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.2 } }
          : { y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between font-mono text-xs text-dim">
        <span className="text-teal">{content.logo}</span>
        <span className="tracking-[0.2em]">{t(content.ui.preloader.label).toUpperCase()}</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-md font-mono text-xs leading-relaxed text-dim sm:text-sm">
            {t(content.ui.preloader.hint)}
            <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-[2px] animate-blink bg-term" />
          </p>
          <span
            className="font-display text-[clamp(3rem,14vw,9rem)] leading-none tabular-nums text-ink"
            aria-label={`${progress}%`}
          >
            {String(progress).padStart(3, '0')}
          </span>
        </div>

        <div className="h-px w-full overflow-hidden bg-line">
          <div
            className="h-full bg-gradient-to-r from-violet to-teal transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono text-[0.65rem] tracking-[0.2em] text-dim">{content.name.toUpperCase()}</p>
      </div>
    </motion.div>
  );
}
