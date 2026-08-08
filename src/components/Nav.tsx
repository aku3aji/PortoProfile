import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { scrollToId, setScrollLocked } from '@/hooks/useLenis';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'work', label: content.ui.nav.work },
  { id: 'about', label: content.ui.nav.about },
  { id: 'contact', label: content.ui.nav.contact },
] as const;

const OBSERVED = ['hero', 'ide', 'skills', 'work', 'about', 'contact'];

function NavLink({ id, label, active }: { id: string; label: string; active: boolean }) {
  const ref = useMagnetic<HTMLButtonElement>(0.22);

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="link"
      onClick={() => scrollToId(id)}
      className="group relative px-1 py-2 text-sm font-medium text-dim transition-colors duration-300 hover:text-ink"
      aria-current={active ? 'true' : undefined}
    >
      <span className={cn('transition-colors duration-300', active && 'text-ink')}>{label}</span>
      <span
        className={cn(
          'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gradient-to-r from-violet to-teal',
          'scale-x-0 transition-transform duration-500 ease-signature group-hover:scale-x-100',
          active && 'scale-x-100',
        )}
      />
    </button>
  );
}

function LangToggle() {
  const { lang, toggle, t } = useLang();
  const ref = useMagnetic<HTMLButtonElement>(0.25);

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="link"
      onClick={toggle}
      title={t(content.ui.nav.switchLang)}
      className="relative flex items-center gap-0.5 rounded-full border border-line bg-surface/70 p-0.5 font-mono text-[0.7rem] font-medium backdrop-blur-sm"
    >
      {/* Nama aksesibel datang dari sini; pil ID/EN yang terlihat disembunyikan
          dari screen reader supaya tidak bentrok dengan labelnya. */}
      <span className="sr-only">{t(content.ui.nav.switchLang)}</span>

      {(['id', 'en'] as const).map((code) => (
        <span
          key={code}
          aria-hidden="true"
          className={cn(
            'relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-300',
            lang === code ? 'text-base' : 'text-dim',
          )}
        >
          {lang === code ? (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet to-teal"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          ) : null}
          {code}
        </span>
      ))}
    </button>
  );
}

function AvailableBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const label = content.available ? content.ui.nav.available : content.ui.nav.unavailable;

  return (
    <a
      href={`mailto:${content.email}`}
      data-cursor="link"
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 py-1.5 font-mono text-[0.7rem] backdrop-blur-sm',
        'transition-colors duration-300 hover:border-term/50 hover:bg-term/5',
        compact ? 'px-3' : 'px-3.5',
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-breathe rounded-full bg-term" />
      </span>
      <span className="text-term">{t(label)}</span>
    </a>
  );
}

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    OBSERVED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Beri jeda supaya scroll lock sempat dilepas sebelum animasi scroll mulai.
    window.setTimeout(() => scrollToId(id), 60);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md bg-violet px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130]"
      >
        {t(content.ui.nav.skipToContent)}
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-signature',
          scrolled
            ? 'border-b border-line/70 bg-base/70 py-2.5 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-4',
        )}
      >
        <nav className="shell flex items-center justify-between gap-4" aria-label="Utama">
          <button
            type="button"
            data-cursor="link"
            onClick={() => go('hero')}
            className="group font-mono text-sm font-medium tracking-tight text-ink"
          >
            <span className="text-teal transition-colors duration-300 group-hover:text-violet">{'</>'}</span>
            <span className="ml-1.5">{content.shortName.toLowerCase()}</span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              {SECTIONS.map((s) => (
                <NavLink key={s.id} id={s.id} label={t(s.label)} active={active === s.id} />
              ))}
            </div>
            <div className="h-4 w-px bg-line" />
            <div className="flex items-center gap-3">
              <LangToggle />
              <AvailableBadge />
            </div>
          </div>

          <div className="flex items-center gap-2.5 md:hidden">
            <LangToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t(open ? content.ui.nav.close : content.ui.nav.menu)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/70 text-ink backdrop-blur-sm"
            >
              {open ? <X size={16} strokeWidth={1.75} /> : <Menu size={16} strokeWidth={1.75} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-base/97 px-6 pb-10 pt-24 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line/60"
                >
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className="flex w-full items-baseline gap-4 py-5 text-left"
                  >
                    <span className="font-mono text-xs text-violet">0{i + 1}</span>
                    <span className="font-display text-4xl text-ink">{t(s.label)}</span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <AvailableBadge compact />
              <a href={`mailto:${content.email}`} className="font-mono text-xs text-dim">
                {content.email}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
