import { useLayoutEffect, useRef } from 'react';
import { type LucideIcon, BadgeCheck, Briefcase, Bug, ExternalLink, Layers, Network } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { gsap } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { SectionHeading } from './ui/SectionHeading';
import { Monogram } from './ui/Monogram';

const PILLAR_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  bug: Bug,
  network: Network,
  briefcase: Briefcase,
};

function QuickFacts() {
  const { t } = useLang();

  const rows: { key: string; value: string }[] = [
    { key: 'location', value: t(content.location) },
    { key: 'email', value: content.email },
    { key: 'status', value: t(content.available ? content.ui.nav.available : content.ui.nav.unavailable) },
    { key: 'lang', value: 'Bahasa Indonesia · English' },
  ];

  return (
    <dl className="mt-5 space-y-2 font-mono text-[0.72rem]">
      {rows.map((row) => (
        <div key={row.key} className="flex items-start justify-between gap-4 border-b border-line/60 pb-2">
          <dt className="shrink-0 text-dim">{row.key}:</dt>
          <dd className="text-right text-ink/85">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Timeline() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  // Garis timeline "digambar" mengikuti scroll.
  useLayoutEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;

    if (reduced) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 72%', scrub: 0.6 },
        },
      );
    }, list);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="relative">
      <ol ref={listRef} className="relative space-y-10 pl-8 sm:pl-10">
        {/* Rel + garis yang tumbuh */}
        <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line/70" />
        <span
          ref={lineRef}
          aria-hidden="true"
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-violet via-teal to-term"
        />

        {content.timeline.map((entry) => (
          <li key={entry.key} className="js-reveal relative">
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-8 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border bg-base sm:-left-10',
                entry.state === 'ongoing' ? 'border-term' : 'border-line',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  entry.state === 'ongoing' ? 'animate-breathe bg-term' : 'bg-violet',
                )}
              />
            </span>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[0.7rem] tracking-wide text-teal">{t(entry.period)}</span>
              <span className="rounded-full border border-line bg-panel/60 px-2 py-0.5 font-mono text-[0.6rem] text-dim">
                {t(entry.tag)}
              </span>
              {entry.state === 'ongoing' ? (
                <span className="font-mono text-[0.6rem] text-term">· {t(content.ui.about.ongoing)}</span>
              ) : null}
            </div>

            <h4 className="mt-2 font-display text-xl tracking-tight text-ink sm:text-2xl">{t(entry.title)}</h4>
            <p className="mt-1 font-mono text-[0.72rem] text-dim/80">{t(entry.org)}</p>
            <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-dim">{t(entry.description)}</p>

            {entry.showCertificate ? (
              <div className="mt-4">
                {entry.certificateUrl ? (
                  <a
                    href={entry.certificateUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="link"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3.5 py-1.5 font-mono text-[0.7rem] text-ink transition-colors duration-300 hover:border-teal/50 hover:bg-teal/5"
                  >
                    <BadgeCheck size={13} strokeWidth={1.75} className="text-teal" />
                    {t(content.ui.about.certificate)}
                    <ExternalLink size={11} strokeWidth={1.75} className="text-dim" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-3.5 py-1.5 font-mono text-[0.7rem] text-dim">
                    <BadgeCheck size={13} strokeWidth={1.75} className="text-dim" />
                    {t(content.ui.about.certificatePending)}
                  </span>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function About() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { selector: '.js-reveal', y: 32, stagger: 0.08, start: 'top 82%' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-24 border-t border-line/60 py-24 sm:py-32"
      aria-labelledby="about-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_10%_20%,rgba(45,212,191,0.07),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="shell">
        <SectionHeading
          id="about-title"
          index={content.ui.about.index}
          label={content.ui.about.label}
          title={content.ui.about.title}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="js-reveal lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="aspect-square w-full max-w-[20rem]">
                <Monogram />
              </div>
              <div className="max-w-[20rem]">
                <QuickFacts />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="js-reveal text-lg leading-relaxed text-ink/90 sm:text-xl">{t(content.about.bio)}</p>
            <p className="js-reveal mt-5 leading-relaxed text-dim">{t(content.about.bioSecondary)}</p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {content.about.pillars.map((pillar) => {
                const Icon = PILLAR_ICONS[pillar.icon] ?? Layers;

                return (
                  <li
                    key={pillar.key}
                    data-cursor="link"
                    className="js-reveal group rounded-xl border border-line bg-surface/50 p-5 transition-[border-color,transform,background-color] duration-500 ease-signature hover:-translate-y-0.5 hover:border-violet/40 hover:bg-surface"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel text-violet transition-colors duration-300 group-hover:text-teal">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-4 font-display text-lg tracking-tight text-ink">{t(pillar.title)}</h3>
                    <p className="mt-2 text-[0.85rem] leading-relaxed text-dim">{t(pillar.text)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-line/60 pt-12 sm:mt-24">
          <h3 className="js-reveal mono-label mb-10 flex items-center gap-4">
            <span className="h-px w-8 bg-gradient-to-r from-violet to-teal" />
            {t(content.ui.about.timelineTitle)}
          </h3>
          <Timeline />
        </div>
      </div>
    </section>
  );
}
