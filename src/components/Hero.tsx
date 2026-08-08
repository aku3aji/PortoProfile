import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { gsap } from '@/lib/gsap';
import { cn, onIdle, splitChars } from '@/lib/utils';
import { useMediaQuery, useReducedMotion } from '@/hooks/useReducedMotion';
import { useMagnetic } from '@/hooks/useMagnetic';
import { scrollToId } from '@/hooks/useLenis';
import { Ticker } from './ui/Ticker';
import { OrbFallback } from './ui/OrbFallback';
import { ErrorBoundary } from './ui/ErrorBoundary';

const HeroCanvas = lazy(() => import('./HeroCanvas'));

const NAME_LINES = ['Triaji Ibnu', 'Hermawan'];
const ROLE_INTERVAL = 2600;

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

/**
 * Perangkat lemah atau koneksi hemat data tidak perlu mengunduh bundle
 * three.js sama sekali — mereka langsung mendapat fallback SVG statis.
 */
function deviceCanAfford3d(): boolean {
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return false;

  return true;
}

/** Satu baris nama, dipecah per karakter untuk stagger + clip reveal. */
function NameLine({ text }: { text: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      {splitChars(text).map((char, i) => (
        <span key={`${char}-${i}`} className="hero-char inline-block" aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
}

function RoleRotator({ reduced }: { reduced: boolean }) {
  const { t, lang } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % content.roles.length);
    }, ROLE_INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  const role = content.roles[index]!;

  /** Role terpanjang dipakai sebagai penjaga lebar supaya layout tidak melompat. */
  const widest = useMemo(
    () => content.roles.reduce((a, b) => (b[lang].length > a[lang].length ? b : a)),
    [lang],
  );

  return (
    // Peran keluar-masuk saling menimpa (bukan `mode="wait"`) supaya tidak ada
    // jeda kosong di antara dua peran.
    <span className="relative inline-block h-[1.7em] overflow-hidden align-bottom">
      <span aria-hidden="true" className="invisible whitespace-nowrap font-mono text-base font-medium sm:text-lg">
        {t(widest)}
      </span>

      <AnimatePresence initial={false}>
        <motion.span
          key={`${lang}-${index}`}
          initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: '-110%', opacity: 0 }}
          transition={{ duration: reduced ? 0.3 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center whitespace-nowrap font-mono text-base font-medium text-teal [text-shadow:0_0_22px_rgba(45,212,191,0.45)] sm:text-lg"
        >
          {t(role)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroButton({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}) {
  const ref = useMagnetic<HTMLButtonElement>(0.28);

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="link"
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium',
        'transition-[background-color,border-color,color,box-shadow] duration-400 ease-signature',
        variant === 'primary'
          ? 'bg-ink text-base hover:shadow-[0_0_34px_-8px_rgba(124,92,255,0.85)]'
          : 'border border-line bg-surface/50 text-ink backdrop-blur-sm hover:border-teal/50 hover:bg-teal/5',
      )}
    >
      {children}
    </button>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const rootRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => setWebgl(hasWebGL() && deviceCanAfford3d()), []);

  const show3d = webgl && !reduced;

  /**
   * three.js baru diimpor saat main thread menganggur, setelah preloader dan
   * animasi masuk hero selesai. Tanpa penundaan ini, evaluasi bundle three
   * menabrak animasi awal dan mengangkat Total Blocking Time.
   */
  useEffect(() => {
    if (!ready || !show3d) return;

    return onIdle(() => setCanvasReady(true), 2500);
  }, [ready, show3d]);

  // Animasi masuk hero — dijalankan setelah preloader selesai.
  useLayoutEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>('.hero-char', root);
      const items = gsap.utils.toArray<HTMLElement>('.hero-item', root);

      if (reduced) {
        gsap.set([chars, items], { opacity: 1, yPercent: 0, y: 0 });
        gsap.set(canvasWrapRef.current, { opacity: 0.85, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'signature' } });

      tl.fromTo(
        chars,
        { yPercent: 118, opacity: 0, rotateX: -55 },
        { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.15, stagger: 0.026 },
      )
        .fromTo(items, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, stagger: 0.09 }, '-=0.72')
        .fromTo(
          canvasWrapRef.current,
          { opacity: 0, scale: 0.86 },
          // Sengaja tidak sampai 1: objek 3D jadi latar, teks tetap yang utama.
          { opacity: 0.85, scale: 1, duration: 1.5 },
          '-=1.2',
        );
    }, root);

    return () => ctx.revert();
  }, [ready, reduced]);

  // Parallax lembut saat scroll keluar dari hero.
  useLayoutEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to('.hero-parallax-slow', {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-parallax-fast', {
        yPercent: 48,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const canvasQuality = useMemo(() => (isDesktop ? 'high' : 'low'), [isDesktop]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 sm:pt-32"
      aria-label="Hero"
    >
      {/* Latar: dotted grid + glow lembut */}
      <div className="pointer-events-none absolute inset-0 -z-20 grid-dots opacity-[0.55]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(124,92,255,0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-t from-base to-transparent"
        aria-hidden="true"
      />

      {/* Objek 3D — lazy, tidak memblokir first paint */}
      <div
        ref={canvasWrapRef}
        className="hero-parallax-fast pointer-events-none absolute right-[-26%] top-[-4%] -z-10 h-[78vw] w-[78vw] opacity-0 sm:right-[-14%] sm:top-[0%] md:right-[-6%] md:top-[2%] md:h-[62vmin] md:w-[62vmin] lg:right-[1%] lg:h-[66vmin] lg:w-[66vmin]"
        aria-hidden="true"
      >
        {show3d && canvasReady ? (
          <ErrorBoundary fallback={<OrbFallback label={t(content.ui.hero.canvasFallback)} />}>
            <Suspense fallback={<OrbFallback />}>
              <HeroCanvas quality={canvasQuality} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <OrbFallback />
        )}
      </div>

      <div className="shell hero-parallax-slow relative flex flex-1 flex-col justify-center">
        <p className="hero-item mono-label mb-6 flex items-center gap-3 opacity-0">
          <span className="h-px w-8 bg-teal" />
          {t(content.ui.hero.intro)}
        </p>

        <h1
          className="font-display text-[clamp(2.9rem,11.5vw,9.5rem)] leading-[0.86] tracking-[-0.045em] text-ink [perspective:800px]"
          aria-label={content.name}
        >
          {NAME_LINES.map((line) => (
            <NameLine key={line} text={line} />
          ))}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end">
          <div className="max-w-xl">
            <div className="hero-item inline-flex items-center gap-3 rounded-full border border-line bg-surface/50 px-4 py-1.5 opacity-0 backdrop-blur-sm">
              <span className="font-mono text-sm text-violet">{'>'}</span>
              <RoleRotator reduced={reduced} />
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[2px] animate-blink bg-teal/80"
              />
            </div>

            <p className="hero-item mt-5 max-w-lg text-base leading-relaxed text-dim opacity-0 sm:text-lg">
              {t(content.tagline)}
            </p>

            <div className="hero-item mt-8 flex flex-wrap items-center gap-3 opacity-0">
              <HeroButton onClick={() => scrollToId('work')}>
                {t(content.ui.hero.seeWork)}
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-400 ease-signature group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </HeroButton>
              <HeroButton variant="ghost" onClick={() => scrollToId('contact')}>
                <Mail size={16} strokeWidth={1.75} />
                {t(content.ui.hero.contactMe)}
              </HeroButton>
            </div>
          </div>

          <dl className="hero-item grid grid-cols-3 gap-4 opacity-0 lg:gap-6">
            {content.heroStats.map((stat) => (
              <div key={stat.value} className="border-l border-line pl-3">
                <dt className="font-display text-2xl text-ink sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1 font-mono text-[0.62rem] leading-snug tracking-wide text-dim">
                  {t(stat.label)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="relative mt-14">
        <Ticker items={content.ticker} />

        <div className="shell flex items-center justify-between py-5">
          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToId('ide')}
            className="hero-item group flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.2em] text-dim opacity-0 transition-colors duration-300 hover:text-ink"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-teal/60">
              <ArrowDown
                size={12}
                strokeWidth={1.75}
                className={cn('text-teal', !reduced && 'motion-safe:animate-[float-slow_2.4s_ease-in-out_infinite]')}
              />
            </span>
            {t(content.ui.hero.scroll).toUpperCase()}
          </button>

          <span className="hero-item hidden font-mono text-[0.68rem] tracking-[0.2em] text-dim opacity-0 sm:block">
            {t(content.location).toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  );
}
