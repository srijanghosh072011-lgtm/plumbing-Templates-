/**
 * Illustration set.
 *
 * These exist because a template cannot ship with photographs it does not
 * have the rights to, and stock imagery on a trades site is actively
 * counterproductive — a stock plumber in a stock kitchen reads as fake, and
 * the playbook is explicit that real job photos are both a conversion and a
 * trust signal.
 *
 * So: line-art scenes in the brand palette. They look deliberate rather than
 * unfinished, weigh a couple of kB inline, stay crisp at any density, and
 * need no licence. When the client supplies real photography, swap the
 * <Illustration> usages for <img> — see README.
 *
 * Drawing conventions: 1.5px strokes on a 400×500 or 640×360 canvas, round
 * caps and joins, accent blue reserved for the single focal detail per scene
 * so the eye lands somewhere specific.
 */

type Props = { className?: string; title: string };

/** Shared defs: duotone wash + the dotted field from the reference site. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#eef5fd" />
        <stop offset="100%" stopColor="#d6e8fa" />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1d2a52" />
        <stop offset="100%" stopColor="#0d1428" />
      </linearGradient>
      <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="1.6" cy="1.6" r="1.6" fill="#2569b3" opacity="0.22" />
      </pattern>
    </defs>
  );
}

/* ── Scene 1: under-sink supply work ─────────────────────────────────── */
export function IllustrationTechnician({ className = '', title }: Props) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title}>
      <Defs id="tech" />
      <rect width="400" height="500" fill="url(#tech-sky)" />
      <rect x="232" y="40" width="128" height="128" fill="url(#tech-dots)" />

      {/* cabinet carcass */}
      <path
        d="M56 150h288v300H56z"
        fill="#fff"
        stroke="#1d2a52"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M56 150h288v34H56z" fill="#1d2a52" />

      {/* basin */}
      <path
        d="M120 184h160v52a26 26 0 0 1-26 26h-108a26 26 0 0 1-26-26z"
        fill="#fff"
        stroke="#1d2a52"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* trap + supply lines — the subject of the drawing */}
      <path
        d="M200 262v44m0 0c0 26 34 26 34 0v-26"
        fill="none"
        stroke="#1d2a52"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M234 280v-52"
        fill="none"
        stroke="#1d2a52"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M150 300c0 40 26 58 50 58"
        fill="none"
        stroke="#2569b3"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* shut-off valve, the focal point */}
      <circle cx="150" cy="292" r="16" fill="#fff" stroke="#1f4aa8" strokeWidth="5" />
      <path d="M150 276v-22" stroke="#1f4aa8" strokeWidth="5" strokeLinecap="round" />
      <path d="M138 254h24" stroke="#1f4aa8" strokeWidth="5" strokeLinecap="round" />

      {/* hands at work */}
      <path
        d="M262 356c18-10 34-4 42 8"
        fill="none"
        stroke="#1d2a52"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M282 372a20 20 0 0 0 34 12l14-16"
        fill="none"
        stroke="#1d2a52"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* floor line */}
      <path d="M56 450h288" stroke="#1d2a52" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Scene 2: tank water heater ───────────────────────────────────────── */
export function IllustrationWaterHeater({ className = '', title }: Props) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title}>
      <Defs id="wh" />
      <rect width="400" height="500" fill="url(#wh-sky)" />
      <rect x="40" y="330" width="108" height="108" fill="url(#wh-dots)" />

      {/* tank */}
      <rect
        x="128"
        y="96"
        width="150"
        height="310"
        rx="34"
        fill="#fff"
        stroke="#1d2a52"
        strokeWidth="3"
      />
      <path d="M128 176h150" stroke="#1d2a52" strokeWidth="3" />
      <path d="M128 316h150" stroke="#1d2a52" strokeWidth="3" />

      {/* inlet / outlet */}
      <path
        d="M164 96V56h-32M242 96V56h34"
        fill="none"
        stroke="#1d2a52"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* T&P relief valve — focal point */}
      <path
        d="M278 214h44v96"
        fill="none"
        stroke="#1f4aa8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="278" cy="214" r="13" fill="#fff" stroke="#1f4aa8" strokeWidth="5" />

      {/* control dial */}
      <circle cx="203" cy="246" r="27" fill="#eef5fd" stroke="#2569b3" strokeWidth="4" />
      <path d="M203 246l14-14" stroke="#2569b3" strokeWidth="5" strokeLinecap="round" />

      {/* burner glow */}
      <path
        d="M186 356c0-12 17-16 17-30 0 14 17 18 17 30a17 17 0 1 1-34 0z"
        fill="#6b9bf0"
        stroke="#1f4aa8"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* legs + floor */}
      <path
        d="M158 406v26M248 406v26"
        stroke="#1d2a52"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M56 434h288" stroke="#1d2a52" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Scene 3: drain camera inspection (wide) ──────────────────────────── */
export function IllustrationDrain({ className = '', title }: Props) {
  return (
    <svg viewBox="0 0 640 360" className={className} role="img" aria-label={title}>
      <Defs id="dr" />
      <rect width="640" height="360" fill="url(#dr-deep)" />
      <rect x="500" y="36" width="108" height="96" fill="url(#dr-dots)" opacity="0.5" />

      {/* sewer line, cut away */}
      <path
        d="M40 232h560"
        stroke="#2569b3"
        strokeWidth="3"
        strokeDasharray="10 9"
        opacity="0.55"
      />
      <path
        d="M40 148h560M40 300h560"
        stroke="#4d9bea"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* pipe joints */}
      {[168, 336, 504].map((x) => (
        <path
          key={x}
          d="M0 148v152"
          transform={`translate(${x} 0)`}
          stroke="#4d9bea"
          strokeWidth="3"
          opacity="0.45"
        />
      ))}

      {/* root intrusion at a joint */}
      <path
        d="M336 148c-14 22-38 24-52 42m52-42c10 26 30 30 42 48"
        fill="none"
        stroke="#7db8f2"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* camera head + cable — focal point */}
      <path
        d="M40 232h150"
        stroke="#1f4aa8"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="206" cy="232" r="22" fill="#0d1428" stroke="#2a5bc7" strokeWidth="5" />
      <circle cx="206" cy="232" r="8" fill="#6b9bf0" />

      {/* light cone */}
      <path d="M228 232l124-46v92z" fill="#6b9bf0" opacity="0.16" />

      {/* readout ticks */}
      <g opacity="0.55">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${556 + i * 0} ${292 - i * 16}h40`}
            stroke="#7db8f2"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

/** Frame wrapper so the three scenes share the plate treatment. */
export function Illustration({
  variant,
  title,
  className = '',
}: {
  variant: 'technician' | 'waterheater' | 'drain';
  title: string;
  className?: string;
}) {
  const Art = {
    technician: IllustrationTechnician,
    waterheater: IllustrationWaterHeater,
    drain: IllustrationDrain,
  }[variant];

  return <Art className={`h-full w-full object-cover ${className}`} title={title} />;
}
