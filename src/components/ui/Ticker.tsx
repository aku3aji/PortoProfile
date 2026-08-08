import { Fragment } from 'react';

/** Marquee monospace tanpa JS — dua salinan konten digeser -50%. */
export function Ticker({ items }: { items: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span className="font-mono text-xs tracking-[0.24em] text-dim transition-colors duration-300 hover:text-teal sm:text-sm">
            {item}
          </span>
          <span className="text-violet/70">‧</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="relative overflow-hidden border-y border-line/70 bg-surface/40 py-4 backdrop-blur-sm"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      {/* Teks aslinya tetap terbaca screen reader lewat list tersembunyi di bawah. */}
      <div className="flex w-max animate-marquee will-change-transform">
        {row}
        {row}
      </div>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
