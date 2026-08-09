import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, Image as ImageIcon, Lock, X } from 'lucide-react';
import type { Project } from '@/data/content';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useReveal } from '@/hooks/useReveal';
import { useFinePointer, useReducedMotion } from '@/hooks/useReducedMotion';
import { setScrollLocked } from '@/hooks/useLenis';
import { cn } from '@/lib/utils';
import { SectionHeading } from './ui/SectionHeading';

/** Kelas per aksen ditulis utuh supaya terdeteksi Tailwind. */
const ACCENTS = {
  violet: {
    text: 'text-violet',
    border: 'hover:border-violet/45',
    glow: 'from-violet/25',
    bar: 'bg-violet',
    shadow: 'hover:shadow-[0_36px_90px_-46px_rgba(124,92,255,0.9)]',
  },
  teal: {
    text: 'text-teal',
    border: 'hover:border-teal/45',
    glow: 'from-teal/25',
    bar: 'bg-teal',
    shadow: 'hover:shadow-[0_36px_90px_-46px_rgba(45,212,191,0.9)]',
  },
  amber: {
    text: 'text-amber',
    border: 'hover:border-amber/45',
    glow: 'from-amber/25',
    bar: 'bg-amber',
    shadow: 'hover:shadow-[0_36px_90px_-46px_rgba(245,165,36,0.9)]',
  },
  green: {
    text: 'text-term',
    border: 'hover:border-term/45',
    glow: 'from-term/25',
    bar: 'bg-term',
    shadow: 'hover:shadow-[0_36px_90px_-46px_rgba(63,185,80,0.9)]',
  },
} as const;

/**
 * Grid asimetris 12 kolom:
 *   baris 1 → wide(7) + tall(5, membentang 2 baris)
 *   baris 2 → normal(4) + compact(3)  di sisa 7 kolom sebelah kiri
 */
const SPAN_CLASS: Record<Project['span'], string> = {
  wide: 'lg:col-span-7',
  tall: 'lg:col-span-5 lg:row-span-2',
  normal: 'lg:col-span-4',
  compact: 'lg:col-span-3',
};

/** Panjang bar "kode" palsu di preview — deterministik supaya tidak berubah tiap render. */
const BAR_WIDTHS = [72, 46, 88, 58, 34, 66, 50, 78];

function ProjectPreview({ project, accent }: { project: Project; accent: (typeof ACCENTS)[keyof typeof ACCENTS] }) {
  const { t } = useLang();

  if (project.screenshotUrl) {
    return (
      <img
        src={project.screenshotUrl}
        alt={`${project.title} — ${t(project.kicker)}`}
        width={1280}
        height={800}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-signature group-hover:scale-[1.05]"
      />
    );
  }

  // Belum ada screenshot: tampilkan mock "editor" abstrak, bukan kotak kosong.
  // Murni dekoratif, jadi disembunyikan dari screen reader.
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-panel transition-transform duration-[900ms] ease-signature group-hover:scale-[1.04]"
    >
      <div className="absolute inset-0 grid-dots opacity-40" />
      <div className={cn('absolute inset-0 bg-gradient-to-br to-transparent opacity-70', accent.glow)} />

      <div className="relative flex items-center gap-1.5 border-b border-line/70 bg-surface/80 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-dim/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-dim/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-dim/40" />
        <span className="ml-2 truncate font-mono text-[0.55rem] text-dim">
          {project.title.toLowerCase()}/{project.tech[1]?.toLowerCase() ?? 'app'}
        </span>
      </div>

      <div className="relative space-y-1.5 p-3.5">
        {BAR_WIDTHS.map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 shrink-0 font-mono text-[0.45rem] text-dim">{i + 1}</span>
            <span
              className={cn('h-1.5 rounded-full', i % 3 === 0 ? accent.bar : 'bg-line')}
              style={{ width: `${w}%`, opacity: i % 3 === 0 ? 0.55 : 0.85 }}
            />
          </div>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 right-2 font-display text-[5.5rem] font-bold leading-none text-ink/[0.04]"
      >
        {project.title.charAt(0)}
      </span>
    </div>
  );
}

function StatusBadge({ project }: { project: Project }) {
  const { t } = useLang();

  if (project.status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-term/30 bg-term/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-term">
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-term" />
        {t(content.ui.projects.live)}
      </span>
    );
  }

  if (project.status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/35 bg-amber/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-amber">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
        {t(content.ui.projects.inProgress)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-dim">
      <Lock size={9} strokeWidth={2} />
      {t(content.ui.projects.internal)}
    </span>
  );
}

function ProjectCard({
  project,
  index,
  onOpenShot,
}: {
  project: Project;
  index: number;
  onOpenShot: (project: Project) => void;
}) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const tiltEnabled = !reduced && finePointer;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), springConfig);

  const accent = ACCENTS[project.accent];
  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);
  const hasShot = Boolean(project.screenshotUrl);

  // Kartu yang punya demo selalu bisa diklik, jadi labelnya "VIEW ↗" —
  // termasuk projek yang masih on-progress tapi preview-nya sudah tayang.
  const cursorLabel = hasDemo
    ? `${t(content.ui.projects.cursor)} ↗`
    : project.status === 'in-progress'
      ? t(content.ui.projects.inProgress)
      : t(content.ui.projects.internal);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      className={cn('js-reveal group relative [perspective:1200px]', SPAN_CLASS[project.span])}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="view"
      data-cursor-label={cursorLabel}
    >
      <motion.div
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface/60',
          'transition-[border-color,box-shadow] duration-500 ease-signature',
          accent.border,
          accent.shadow,
        )}
      >
        {/* Link yang meliputi seluruh kartu (hanya kalau ada demo). */}
        {hasDemo ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute inset-0 z-[2]"
            aria-label={`${project.title} — ${t(content.ui.projects.demo)}`}
            tabIndex={-1}
          />
        ) : null}

        <div className="relative z-[1] flex items-center justify-between gap-3 border-b border-line/70 px-5 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.65rem] tabular-nums text-dim">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={cn('h-3 w-px', accent.bar, 'opacity-60')} />
            <span className="font-mono text-[0.65rem] text-dim">{project.year}</span>
          </div>
          <StatusBadge project={project} />
        </div>

        <div className="relative z-[1] flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">{project.title}</h3>
          <p className={cn('mt-1.5 font-mono text-[0.72rem]', accent.text)}>{t(project.kicker)}</p>

          <div className="mt-5 aspect-[16/9] w-full overflow-hidden rounded-lg border border-line/70">
            <ProjectPreview project={project} accent={accent} />
          </div>

          <p className="mt-5 text-[0.9rem] leading-relaxed text-dim">{t(project.description)}</p>

          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.78rem] leading-snug text-dim/85">
                <span className={cn('mt-[0.45em] h-1 w-1 shrink-0 rounded-full', accent.bar)} />
                {t(h)}
              </li>
            ))}
          </ul>

          {/* Ditumpuk vertikal, bukan sebaris: kartu paling sempit cuma 3 kolom. */}
          <dl className="mt-5 flex flex-col gap-2 border-t border-line/60 pt-4">
            <div className="flex items-baseline gap-2">
              <dt className="mono-label !text-[0.6rem] shrink-0">{t(content.ui.projects.role)}</dt>
              <dd className="font-mono text-[0.7rem] text-ink/90">{t(project.role)}</dd>
            </div>

            {/* Baris pengujian hanya muncul kalau projeknya memang sudah diuji. */}
            {project.testing?.length ? (
              <div className="flex items-baseline gap-2">
                <dt className="mono-label !text-[0.6rem] shrink-0">{t(content.ui.projects.testing)}</dt>
                <dd className="font-mono text-[0.7rem] leading-relaxed text-ink/90">
                  {project.testing.map((method, i) => (
                    <span key={method}>
                      {i > 0 ? <span className={cn('mx-1.5 opacity-50', accent.text)}>·</span> : null}
                      {method}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-line bg-panel/70 px-2 py-1 font-mono text-[0.65rem] text-dim transition-colors duration-300 group-hover:border-line group-hover:text-ink/80"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* Tombol hanya muncul kalau link-nya benar-benar ada. */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
            {hasDemo ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="group/btn inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.78rem] font-medium text-base transition-shadow duration-400 ease-signature hover:shadow-[0_0_26px_-6px_rgba(230,237,243,0.5)]"
              >
                {t(content.ui.projects.demo)}
                <ArrowUpRight
                  size={14}
                  strokeWidth={2}
                  className="transition-transform duration-400 ease-signature group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            ) : null}

            {hasRepo ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-[0.78rem] text-ink transition-colors duration-300 hover:border-teal/50 hover:bg-teal/5"
              >
                <Github size={14} strokeWidth={1.75} />
                {t(content.ui.projects.repo)}
              </a>
            ) : null}

            {hasShot ? (
              <button
                type="button"
                data-cursor="link"
                onClick={() => onOpenShot(project)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-[0.78rem] text-ink transition-colors duration-300 hover:border-violet/50 hover:bg-violet/5"
              >
                <ImageIcon size={14} strokeWidth={1.75} />
                {t(content.ui.projects.screenshot)}
              </button>
            ) : null}

            {/* Tidak ada link sama sekali → label jujur, bukan tombol kosong. */}
            {!hasDemo && !hasRepo && !hasShot ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 font-mono text-[0.72rem] text-dim">
                {project.status === 'in-progress'
                  ? t(content.ui.projects.comingSoon)
                  : t(content.ui.projects.internal)}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

function ScreenshotLightbox({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t } = useLang();

  return (
    <AnimatePresence>
      {project?.screenshotUrl ? (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[115] flex items-center justify-center bg-base/92 p-4 backdrop-blur-md sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          onClick={onClose}
        >
          <button
            type="button"
            data-cursor="link"
            onClick={onClose}
            aria-label={t(content.ui.projects.closeShot)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink"
          >
            <X size={16} strokeWidth={1.75} />
          </button>

          <motion.img
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            src={project.screenshotUrl}
            alt={`${project.title} — ${t(project.kicker)}`}
            width={1600}
            height={1000}
            className="max-h-full w-auto max-w-full rounded-lg border border-line object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shot, setShot] = useState<Project | null>(null);

  useReveal(sectionRef, { selector: '.js-reveal', y: 44, stagger: 0.1, start: 'top 80%' });

  const openShot = (project: Project) => {
    setShot(project);
    setScrollLocked(true);
  };

  const closeShot = () => {
    setShot(null);
    setScrollLocked(false);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-24 border-t border-line/60 py-24 sm:py-32"
      aria-labelledby="work-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_10%,rgba(124,92,255,0.08),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="shell">
        <SectionHeading
          id="work-title"
          index={content.ui.projects.index}
          label={content.ui.projects.label}
          title={content.ui.projects.title}
          subtitle={content.ui.projects.subtitle}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {content.projects.map((project, i) => (
            <ProjectCard key={project.key} project={project} index={i} onOpenShot={openShot} />
          ))}
        </div>
      </div>

      <ScreenshotLightbox project={shot} onClose={closeShot} />
    </section>
  );
}
