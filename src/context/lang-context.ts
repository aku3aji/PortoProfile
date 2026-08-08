import { createContext, useContext } from 'react';
import type { L, Lang } from '@/data/content';

/**
 * Bahasa default situs. Ganti ke 'en' kalau ingin membuka dalam bahasa Inggris.
 * Pilihan pengunjung disimpan di localStorage dan menang atas nilai ini.
 */
export const DEFAULT_LANG: Lang = 'id';

/**
 * Kalau `true`, pengunjung baru yang bahasa browser-nya Inggris langsung
 * mendapat versi EN. Kalau `false` (default), semua pengunjung baru membuka
 * situs dalam DEFAULT_LANG.
 */
export const AUTO_DETECT_BROWSER_LANG = false;

export const LANG_STORAGE_KEY = 'triaji.lang';

export interface LangContextValue {
  lang: Lang;
  other: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Ambil teks sesuai bahasa aktif. */
  t: (value: L) => string;
}

export const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang harus dipakai di dalam <LangProvider>');
  return ctx;
}
