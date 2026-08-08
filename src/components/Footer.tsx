import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { scrollToTop } from '@/hooks/useLenis';
import { useMagnetic } from '@/hooks/useMagnetic';

const BUILT_WITH = ['React', 'TypeScript', 'Vite', 'Tailwind', 'GSAP', 'Three.js'];

/** Jam lokal WIB yang berdetak tiap detik. */
function LocalClock() {
  const { t } = useLang();
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: content.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const update = () => setTime(formatter.format(new Date()));
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="flex items-center gap-2 font-mono text-[0.68rem] text-dim">
      <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-term" />
      <span className="tabular-nums text-ink/80">{time}</span>
      <span className="text-dim">
        {content.timezoneLabel} · {t(content.ui.footer.localTime)}
      </span>
    </p>
  );
}

export function Footer() {
  const { t } = useLang();
  const topRef = useMagnetic<HTMLButtonElement>(0.32);

  return (
    <footer className="relative border-t border-line/70 bg-base">
      <div className="shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <LocalClock />
          <p className="font-mono text-[0.68rem] text-dim">
            {'// '}
            {t(content.ui.footer.credit)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.62rem] text-dim">
            <li className="text-dim">{t(content.ui.footer.builtWith)}</li>
            {BUILT_WITH.map((tool, i) => (
              <li key={tool}>
                {tool}
                {i < BUILT_WITH.length - 1 ? <span className="ml-2 text-violet/50">·</span> : null}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.62rem] text-dim">© {new Date().getFullYear()}</span>
            <button
              ref={topRef}
              type="button"
              data-cursor="link"
              onClick={scrollToTop}
              aria-label={t(content.ui.footer.backToTop)}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel/60 text-dim transition-colors duration-300 hover:border-teal/50 hover:text-teal"
            >
              <ArrowUp
                size={14}
                strokeWidth={1.75}
                className="transition-transform duration-400 ease-signature group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
