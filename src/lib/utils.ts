/** Gabungkan className secara kondisional tanpa dependensi tambahan. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Jalankan sesuatu saat main thread menganggur, dengan fallback `setTimeout`
 * untuk browser yang belum punya `requestIdleCallback` (Safari lama).
 * Mengembalikan fungsi pembatal.
 */
export function onIdle(fn: () => void, timeout = 1200): () => void {
  const ric: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;

  if (typeof ric === 'function') {
    const id = ric(fn, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(fn, Math.min(timeout, 400));
  return () => window.clearTimeout(id);
}

/** Bagi teks jadi karakter, tapi tetap menjaga spasi sebagai unit tersendiri. */
export function splitChars(text: string): string[] {
  return Array.from(text);
}
