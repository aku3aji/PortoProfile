import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/lang-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { setScrollLocked, useLenis } from '@/hooks/useLenis';
import { ScrollTrigger } from '@/lib/gsap';
import { onIdle } from '@/lib/utils';
import { Cursor } from './components/Cursor';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { IdeMode } from './components/IdeMode';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const reduced = useReducedMotion();
  const { lang } = useLang();
  const [ready, setReady] = useState(false);

  // Smooth scroll hanya kalau pengguna tidak meminta reduced motion.
  useLenis(!reduced);

  const onPreloaderDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    setScrollLocked(false);

    // `refresh()` mengukur ulang semua trigger dan memaksa reflow satu halaman
    // penuh. Dijadwalkan saat idle supaya tidak menabrak animasi masuk hero.
    return onIdle(() => ScrollTrigger.refresh(), 1200);
  }, [ready]);

  // Panjang teks ID dan EN berbeda → tinggi halaman berubah → trigger dihitung ulang.
  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(timer);
  }, [lang]);

  return (
    <>
      <Cursor />

      <AnimatePresence>{!ready ? <Preloader key="preloader" onDone={onPreloaderDone} /> : null}</AnimatePresence>

      <Nav />

      <main id="main" className="grain relative">
        <Hero ready={ready} />
        <IdeMode />
        <Skills />
        <Projects />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
