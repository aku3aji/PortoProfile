import { useEffect, useMemo, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import type { TerminalStep } from '@/data/content';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useTerminalSequence } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

const PROMPT = 'triaji@dev ~/portfolio';

/** Beri warna pada baris output yang mengandung penanda khas (✓, →, PASS). */
function outputClass(line: string): string {
  if (line.includes('✓') || line.includes('PASS')) return 'text-term';
  if (line.trimStart().startsWith('→')) return 'text-teal';
  if (line.includes('#')) return 'text-dim';
  if (/^\s*[[\]{}]|"/.test(line)) return 'text-ink/80';
  return 'text-ink/80';
}

export function Terminal({ steps, active, instant }: { steps: TerminalStep[]; active: boolean; instant: boolean }) {
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const commands = useMemo(() => steps.map((s) => s.cmd), [steps]);
  const { progress, replay } = useTerminalSequence(commands, active, instant);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [progress]);

  return (
    <div className="flex min-h-0 flex-col border-t border-line bg-base/80">
      <div className="flex items-center justify-between border-b border-line/70 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem] tracking-[0.18em] text-dim">
            {t(content.ui.ide.terminalLabel)}
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="font-mono text-[0.6rem] text-dim">bash</span>
        </div>

        <button
          type="button"
          data-cursor="link"
          onClick={replay}
          aria-label={t(content.ui.ide.replay)}
          title={t(content.ui.ide.replay)}
          className="flex h-6 w-6 items-center justify-center rounded text-dim transition-colors duration-200 hover:bg-panel hover:text-teal"
        >
          <RotateCcw size={12} strokeWidth={1.75} />
        </button>
      </div>

      <div
        ref={scrollRef}
        data-lenis-prevent
        data-cursor="text"
        className="h-[clamp(9rem,20vh,12.5rem)] overflow-y-auto px-4 py-3 font-mono text-[0.72rem] leading-[1.65] sm:text-[0.75rem]"
        role="log"
        aria-live="off"
      >
        {steps.map((step, index) => {
          if (index > progress.step) return null;

          const isCurrent = index === progress.step;
          const typed = isCurrent && !progress.done ? step.cmd.slice(0, progress.chars) : step.cmd;
          const showOutput = !isCurrent || progress.outputVisible;

          return (
            <div key={step.cmd} className={cn(index > 0 && 'mt-3')}>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-term">{PROMPT}</span>
                <span className="text-violet">$</span>
                <span className="text-ink">
                  {typed}
                  {isCurrent && !showOutput ? (
                    <span
                      aria-hidden="true"
                      className="ml-px inline-block h-[0.9em] w-[6px] translate-y-[1px] animate-blink bg-ink"
                    />
                  ) : null}
                </span>
              </p>

              {showOutput
                ? step.output.map((line, i) => {
                    const text = t(line);
                    return (
                      <p key={i} className={cn('whitespace-pre-wrap', outputClass(text))}>
                        {text || ' '}
                      </p>
                    );
                  })
                : null}
            </div>
          );
        })}

        {progress.done ? (
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-term">{PROMPT}</span>
            <span className="text-violet">$</span>
            <span aria-hidden="true" className="inline-block h-[0.9em] w-[6px] translate-y-[1px] animate-blink bg-ink" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
