import { memo, useEffect, useMemo, useRef } from 'react';
import { TOKEN_CLASS, tokenize, type CodeLanguage, type Token } from '@/lib/highlight';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

const FULL = -1;

interface LineProps {
  tokens: Token[];
  /** Jumlah karakter yang ditampilkan; `FULL` berarti baris utuh. */
  reveal: number;
  lineNumber: number;
  caret: boolean;
}

/**
 * Satu baris kode. Dibungkus `memo` supaya saat typewriter berjalan hanya
 * baris aktif yang dirender ulang — bukan seluruh file tiap frame.
 */
const CodeLine = memo(function CodeLine({ tokens, reveal, lineNumber, caret }: LineProps) {
  let remaining = reveal;

  return (
    <div className="group flex min-h-[1.5rem] w-max min-w-full">
      <span
        aria-hidden="true"
        className="sticky left-0 z-10 w-10 shrink-0 select-none bg-surface pr-4 text-right font-mono text-[0.7rem] leading-6 text-dim tabular-nums"
      >
        {lineNumber}
      </span>

      <code className="whitespace-pre font-mono text-[0.76rem] leading-6 sm:text-[0.8rem]">
        {tokens.map((token, i) => {
          if (reveal === 0) return null;

          let value = token.value;
          if (reveal !== FULL) {
            if (remaining <= 0) return null;
            value = token.value.slice(0, remaining);
            remaining -= token.value.length;
          }

          return (
            <span key={i} className={TOKEN_CLASS[token.type]}>
              {value}
            </span>
          );
        })}
        {caret ? (
          <span
            aria-hidden="true"
            className="ml-px inline-block h-[0.95em] w-[6px] translate-y-[2px] animate-blink bg-teal"
          />
        ) : null}
      </code>
    </div>
  );
});

interface Props {
  code: string;
  language: CodeLanguage;
  /** Mulai mengetik saat section masuk viewport. */
  active: boolean;
  /** Reduced motion: tampilkan kode utuh tanpa animasi. */
  instant: boolean;
}

export function CodeEditor({ code, language, active, instant }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { count, done } = useTypewriter(code, active, instant);

  const lines = useMemo(() => tokenize(code, language), [code, language]);

  /** Offset karakter awal tiap baris (termasuk newline). */
  const offsets = useMemo(() => {
    let acc = 0;
    return lines.map((tokens) => {
      const start = acc;
      const length = tokens.reduce((sum, t) => sum + t.value.length, 0);
      acc += length + 1;
      return { start, length };
    });
  }, [lines]);

  const activeLine = useMemo(() => {
    if (done) return lines.length - 1;
    return offsets.findIndex(({ start, length }) => count >= start && count <= start + length);
  }, [count, done, offsets, lines.length]);

  // Ikut menggulir mengikuti baris yang sedang diketik.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || instant || done || activeLine < 0) return;

    const lineHeight = 24;
    const target = activeLine * lineHeight - el.clientHeight + lineHeight * 3;
    if (target > el.scrollTop) el.scrollTop = target;
  }, [activeLine, instant, done]);

  return (
    <div
      ref={scrollRef}
      data-lenis-prevent
      data-cursor="text"
      className={cn(
        'relative h-[clamp(18rem,40vh,25rem)] overflow-auto bg-surface px-4 py-4 sm:px-5',
        '[scrollbar-width:thin]',
      )}
    >
      <pre className="m-0">
        {lines.map((tokens, i) => {
          const { start, length } = offsets[i]!;
          const reveal = count >= start + length ? FULL : count <= start ? 0 : count - start;
          return (
            <CodeLine
              key={i}
              tokens={tokens}
              reveal={reveal}
              lineNumber={i + 1}
              caret={!instant && i === activeLine}
            />
          );
        })}
      </pre>
    </div>
  );
}
