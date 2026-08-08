import { useCursor } from '@/hooks/useCursor';
import { cn } from '@/lib/utils';

/**
 * Custom cursor context-aware.
 * Otomatis tidak dirender di perangkat sentuh — cursor sistem kembali normal.
 */
export function Cursor() {
  const { enabled, dotRef, ringRef, variant, label, pressed } = useCursor();

  if (!enabled) return null;

  const hidden = variant === 'hidden';
  const isView = variant === 'view';
  const isText = variant === 'text';
  const isLink = variant === 'link';

  const ringSize = isView
    ? 'h-10 w-auto rounded-full px-4'
    : isText
      ? 'h-8 w-[2px] rounded-[1px] bg-white'
      : isLink
        ? 'h-16 w-16 rounded-full'
        : 'h-8 w-8 rounded-full';

  return (
    // Penjagaan perangkat sentuh dilakukan di JS (`enabled`) — komponen ini
    // tidak dirender sama sekali di layar sentuh.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] block mix-blend-difference">
      {/* Ring / pill / caret — bergerak dengan lag di belakang titik. */}
      <div ref={ringRef} className="absolute left-0 top-0 h-0 w-0 opacity-0 transition-opacity duration-200">
        <div
          className={cn(
            'absolute left-0 top-0 flex items-center justify-center whitespace-nowrap',
            'border border-white/80 transition-[width,height,border-radius,opacity,padding,transform] duration-[450ms]',
            'ease-[cubic-bezier(0.16,1,0.3,1)]',
            ringSize,
            isText && 'border-0',
            hidden && 'opacity-0',
          )}
          style={{
            transform: `translate(-50%, -50%) scale(${pressed ? 0.72 : 1})`,
            backgroundColor: isText ? '#fff' : isView || isLink ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          {isView && label ? (
            <span className="font-mono text-[10px] font-medium tracking-[0.22em] text-white">{label}</span>
          ) : null}
        </div>
      </div>

      {/* Titik inti — mengikuti mouse hampir presisi. */}
      <div ref={dotRef} className="absolute left-0 top-0 h-0 w-0 opacity-0 transition-opacity duration-200">
        <div
          className={cn(
            'absolute left-0 top-0 rounded-full bg-white transition-[width,height,opacity] duration-300',
            'ease-[cubic-bezier(0.16,1,0.3,1)]',
            isView || isText || hidden ? 'h-0 w-0 opacity-0' : 'h-1.5 w-1.5',
          )}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}
