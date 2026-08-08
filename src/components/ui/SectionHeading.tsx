import type { L } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { cn } from '@/lib/utils';

interface Props {
  index: string;
  label: L;
  title: L;
  subtitle?: L;
  id?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ index, label, title, subtitle, id, className, align = 'left' }: Props) {
  const { t } = useLang();

  return (
    <header className={cn('relative', align === 'center' && 'text-center', className)}>
      <div
        className={cn(
          'js-reveal flex items-center gap-4',
          align === 'center' && 'justify-center',
        )}
      >
        <span className="font-mono text-xs font-medium tabular-nums text-violet">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-violet to-teal" />
        <span className="mono-label">{t(label)}</span>
      </div>

      <h2
        id={id}
        className="js-reveal mt-6 text-[clamp(2.25rem,6vw,4.75rem)] leading-[0.94] text-ink"
      >
        {t(title)}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            'js-reveal mt-5 max-w-2xl text-base leading-relaxed text-dim sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {t(subtitle)}
        </p>
      ) : null}
    </header>
  );
}
