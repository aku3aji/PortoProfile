import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';

/**
 * Placeholder avatar: monogram "T" dengan gradient violet → teal.
 * Begitu `content.photoUrl` diisi, komponen ini otomatis diganti foto asli.
 */
export function Monogram() {
  const { t } = useLang();

  if (content.photoUrl) {
    return (
      <img
        src={content.photoUrl}
        alt={t(content.ui.about.photoAlt)}
        width={640}
        height={640}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-2xl object-cover"
      />
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-line bg-surface"
      role="img"
      aria-label={t(content.ui.about.monogramAlt)}
    >
      <div className="absolute inset-0 grid-dots opacity-40" aria-hidden="true" />

      {/* Cahaya berputar di belakang huruf. */}
      <div
        aria-hidden="true"
        className="absolute -inset-1/3 animate-orbit bg-[conic-gradient(from_0deg,transparent_0deg,rgba(124,92,255,0.4)_70deg,transparent_140deg,rgba(45,212,191,0.34)_240deg,transparent_320deg)] blur-2xl"
      />

      <svg viewBox="0 0 200 200" className="relative h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="mono-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>

        {/* Huruf T */}
        <rect x="48" y="60" width="104" height="17" rx="8.5" fill="url(#mono-grad)" />
        <rect x="91.5" y="60" width="17" height="86" rx="8.5" fill="url(#mono-grad)" />

        {/* Tanda sudut ala viewport desain */}
        <g stroke="#232A34" strokeWidth="1.5" fill="none">
          <path d="M20 34 V20 H34" />
          <path d="M166 20 H180 V34" />
          <path d="M180 166 V180 H166" />
          <path d="M34 180 H20 V166" />
        </g>

        <circle cx="152" cy="152" r="5" fill="#3FB950" />
      </svg>

      <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.6rem] tracking-[0.18em] text-dim">
        {content.initials}.IH
      </span>
    </div>
  );
}
