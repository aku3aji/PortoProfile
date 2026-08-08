import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reveal teks per-karakter berbasis waktu (bukan per-frame), supaya durasinya
 * konsisten di layar 60Hz maupun 120Hz. `instant` dipakai untuk reduced-motion:
 * teks langsung tampil utuh.
 */
export function useTypewriter(text: string, active: boolean, instant = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    if (instant) {
      setCount(text.length);
      return;
    }

    const total = text.length;
    const duration = Math.min(3400, Math.max(900, total * 3.4));
    let frame = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      setCount(Math.floor(progress * total));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setCount(total);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, active, instant]);

  return { count, done: count >= text.length };
}

export interface TerminalProgress {
  /** Index step yang sedang berjalan. */
  step: number;
  /** Jumlah karakter perintah yang sudah "diketik" pada step aktif. */
  chars: number;
  /** Output step aktif sudah boleh tampil? */
  outputVisible: boolean;
  done: boolean;
}

const CHAR_MS = 42;
const AFTER_CMD_MS = 340;
const AFTER_OUTPUT_MS = 620;

/**
 * Menjalankan daftar perintah terminal secara berurutan: ketik perintah →
 * jeda → tampilkan output → lanjut ke perintah berikutnya.
 */
export function useTerminalSequence(commands: string[], active: boolean, instant = false) {
  const [progress, setProgress] = useState<TerminalProgress>({
    step: 0,
    chars: 0,
    outputVisible: false,
    done: false,
  });
  const [runId, setRunId] = useState(0);
  const timers = useRef<number[]>([]);

  const replay = useCallback(() => setRunId((n) => n + 1), []);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    clearTimers();

    if (!active) {
      setProgress({ step: 0, chars: 0, outputVisible: false, done: false });
      return;
    }

    if (instant) {
      setProgress({
        step: Math.max(0, commands.length - 1),
        chars: commands[commands.length - 1]?.length ?? 0,
        outputVisible: true,
        done: true,
      });
      return;
    }

    setProgress({ step: 0, chars: 0, outputVisible: false, done: false });

    let elapsed = 0;
    const at = (delay: number, fn: () => void) => {
      elapsed += delay;
      timers.current.push(window.setTimeout(fn, elapsed));
    };

    commands.forEach((cmd, index) => {
      for (let i = 1; i <= cmd.length; i += 1) {
        at(CHAR_MS, () => setProgress({ step: index, chars: i, outputVisible: false, done: false }));
      }
      at(AFTER_CMD_MS, () =>
        setProgress({ step: index, chars: cmd.length, outputVisible: true, done: false }),
      );
      if (index === commands.length - 1) {
        at(AFTER_OUTPUT_MS, () =>
          setProgress({ step: index, chars: cmd.length, outputVisible: true, done: true }),
        );
      } else {
        elapsed += AFTER_OUTPUT_MS;
      }
    });

    return clearTimers;
    // `runId` sengaja jadi dependency supaya tombol replay memulai ulang urutan.
  }, [commands, active, instant, runId]);

  return { progress, replay };
}
