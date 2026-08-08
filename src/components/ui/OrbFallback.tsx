/**
 * Pengganti statis untuk objek 3D di hero.
 * Dipakai kalau WebGL tidak tersedia, canvas gagal dimuat, atau pengguna
 * memilih `prefers-reduced-motion`.
 */
export function OrbFallback({ label }: { label?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center" role="presentation">
      <svg viewBox="0 0 400 400" className="h-full max-h-[520px] w-full max-w-[520px]" aria-hidden="true">
        <defs>
          <radialGradient id="orb-core" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#9E85FF" />
            <stop offset="55%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#2B1E63" />
          </radialGradient>
          <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="190" fill="url(#orb-glow)" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#2DD4BF" strokeOpacity="0.18" strokeWidth="1" />
        <circle cx="200" cy="200" r="176" fill="none" stroke="#F5A524" strokeOpacity="0.14" strokeWidth="1" />
        <ellipse
          cx="200"
          cy="200"
          rx="176"
          ry="62"
          fill="none"
          stroke="#2DD4BF"
          strokeOpacity="0.22"
          strokeWidth="1"
          transform="rotate(-18 200 200)"
        />
        <circle cx="200" cy="200" r="104" fill="url(#orb-core)" />
        <circle cx="200" cy="200" r="104" fill="none" stroke="#E6EDF3" strokeOpacity="0.12" strokeWidth="1" />
        <ellipse cx="166" cy="162" rx="34" ry="22" fill="#E6EDF3" opacity="0.14" transform="rotate(-28 166 162)" />
      </svg>

      {label ? (
        <span className="pointer-events-none absolute bottom-2 font-mono text-[0.65rem] text-dim">{label}</span>
      ) : null}
    </div>
  );
}
