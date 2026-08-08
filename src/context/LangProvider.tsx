import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L, Lang } from '@/data/content';
import {
  AUTO_DETECT_BROWSER_LANG,
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  LangContext,
  type LangContextValue,
} from './lang-context';

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;

  // Pilihan yang pernah dibuat pengunjung selalu menang.
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'id' || stored === 'en') return stored;
  } catch {
    // localStorage bisa diblokir (mode privat) — abaikan saja.
  }

  if (AUTO_DETECT_BROWSER_LANG) {
    const nav = window.navigator.language?.toLowerCase() ?? '';
    if (nav.startsWith('id')) return 'id';
    if (nav.startsWith('en')) return 'en';
  }

  return DEFAULT_LANG;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Tidak masalah kalau penyimpanan ditolak — bahasa tetap berfungsi.
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(() => setLangState((prev) => (prev === 'id' ? 'en' : 'id')), []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      other: lang === 'id' ? 'en' : 'id',
      setLang,
      toggle,
      t: (value: L) => value[lang],
    }),
    [lang, setLang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
