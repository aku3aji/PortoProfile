import { useRef } from 'react';
import {
  type LucideIcon,
  Atom,
  Blocks,
  Boxes,
  Braces,
  Bug,
  ClipboardCheck,
  Cloud,
  CodeXml,
  Database,
  FileCode2,
  FileSpreadsheet,
  FileType2,
  FlaskConical,
  Gauge,
  GitBranch,
  Hexagon,
  Layers,
  MousePointerClick,
  Palette,
  PenTool,
  Pyramid,
  Shapes,
  Table2,
  Terminal,
  Triangle,
  Users,
  Wind,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';
import { SectionHeading } from './ui/SectionHeading';

/** Pemetaan kunci ikon di content.ts → komponen lucide. */
const ICONS: Record<string, LucideIcon> = {
  code: CodeXml,
  layers: Layers,
  wrench: Wrench,
  check: ClipboardCheck,

  php: FileCode2,
  ts: FileType2,
  js: Braces,
  db: Database,
  html: CodeXml,
  css: Palette,

  laravel: Blocks,
  next: Triangle,
  react: Atom,
  tailwind: Wind,
  prisma: Pyramid,
  bootstrap: Boxes,
  vite: Zap,
  node: Hexagon,

  git: GitBranch,
  editor: Terminal,
  figma: PenTool,
  postgres: Database,
  supabase: Cloud,
  office: FileSpreadsheet,

  erd: Table2,
  uml: Shapes,
  flow: Workflow,
  bug: Bug,
  test: FlaskConical,
  usability: MousePointerClick,
  users: Users,
  gauge: Gauge,
};

/**
 * Warna aksen bergantian per grup supaya grid tidak monoton.
 * Kelasnya ditulis utuh (bukan digabung saat runtime) supaya terdeteksi Tailwind.
 */
const GROUP_ACCENT = [
  {
    text: 'text-violet',
    hoverText: 'group-hover:text-violet',
    glow: 'group-hover:shadow-[0_0_28px_-10px_rgba(124,92,255,0.9)]',
    border: 'hover:border-violet/40',
  },
  {
    text: 'text-teal',
    hoverText: 'group-hover:text-teal',
    glow: 'group-hover:shadow-[0_0_28px_-10px_rgba(45,212,191,0.9)]',
    border: 'hover:border-teal/40',
  },
  {
    text: 'text-amber',
    hoverText: 'group-hover:text-amber',
    glow: 'group-hover:shadow-[0_0_28px_-10px_rgba(245,165,36,0.9)]',
    border: 'hover:border-amber/40',
  },
  {
    text: 'text-term',
    hoverText: 'group-hover:text-term',
    glow: 'group-hover:shadow-[0_0_28px_-10px_rgba(63,185,80,0.9)]',
    border: 'hover:border-term/40',
  },
];

export function Skills() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { selector: '.js-reveal', y: 26, stagger: 0.045, start: 'top 84%' });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative scroll-mt-24 border-t border-line/60 py-24 sm:py-32"
      aria-labelledby="skills-title"
    >
      <div className="shell">
        <SectionHeading
          id="skills-title"
          index={content.ui.skills.index}
          label={content.ui.skills.label}
          title={content.ui.skills.title}
          subtitle={content.ui.skills.subtitle}
        />

        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-2">
          {content.skills.map((group, groupIndex) => {
            const accent = GROUP_ACCENT[groupIndex % GROUP_ACCENT.length]!;
            const GroupIcon = ICONS[group.icon] ?? Layers;
            const wide = group.key === 'analysis';

            return (
              <div
                key={group.key}
                className={cn(
                  'js-reveal relative overflow-hidden rounded-xl border border-line bg-surface/50 p-5 sm:p-6',
                  'transition-colors duration-500 ease-signature',
                  wide && 'lg:col-span-2',
                )}
              >
                <div className="pointer-events-none absolute inset-0 grid-dots opacity-30" aria-hidden="true" />

                <div className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel',
                      accent.text,
                    )}
                  >
                    <GroupIcon size={16} strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display text-lg tracking-tight text-ink">{t(group.label)}</h3>
                  <span className="ml-auto font-mono text-[0.65rem] text-dim tabular-nums">
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </div>

                <ul
                  className={cn(
                    'relative mt-5 grid gap-2.5',
                    wide ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2',
                  )}
                >
                  {group.items.map((item) => {
                    const Icon = ICONS[item.icon] ?? CodeXml;

                    return (
                      <li key={item.name}>
                        <div
                          data-cursor="link"
                          className={cn(
                            'group flex h-full items-start gap-3 rounded-lg border border-line/80 bg-panel/60 px-3.5 py-3',
                            'transition-[transform,border-color,background-color,box-shadow] duration-400 ease-signature',
                            'hover:-translate-y-0.5 hover:bg-panel',
                            accent.border,
                            accent.glow,
                          )}
                        >
                          <Icon
                            size={15}
                            strokeWidth={1.6}
                            className={cn(
                              'mt-0.5 shrink-0 text-dim transition-colors duration-300',
                              accent.hoverText,
                            )}
                          />
                          <div className="min-w-0">
                            <p className="font-mono text-[0.78rem] leading-tight text-ink">{item.name}</p>
                            {item.note ? (
                              <p className="mt-1 text-[0.7rem] leading-snug text-dim">{t(item.note)}</p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
