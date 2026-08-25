import { cn } from "@/lib/utils";

/** "next gen" brand lockup — a glossy cyan-blue SVG gear + gradient wordmark.
 *  Crisp at any size; the gear's center hole shows the surface behind it. */
export function NextGenMark({ className }: { className?: string }) {
  const teeth = 8;
  return (
    <span className={cn("inline-flex select-none items-center gap-1.5", className)}>
      <svg viewBox="0 0 100 100" className="h-7 w-7 shrink-0" role="img" aria-label="next gen">
        <defs>
          <linearGradient id="ng-gear" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5ce8ff" />
            <stop offset="50%" stopColor="#1a8cff" />
            <stop offset="100%" stopColor="#0049b8" />
          </linearGradient>
          <radialGradient id="ng-gear-shine" cx="36%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="ng-gear-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.4" stdDeviation="1.3" floodColor="#003a8c" floodOpacity="0.5" />
          </filter>
        </defs>
        <g filter="url(#ng-gear-shadow)">
          {Array.from({ length: teeth }).map((_, i) => (
            <rect
              key={i}
              x="43.5"
              y="7"
              width="13"
              height="13"
              rx="4"
              fill="url(#ng-gear)"
              transform={`rotate(${(360 / teeth) * i} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="34" fill="url(#ng-gear)" />
          <circle cx="50" cy="50" r="34" fill="url(#ng-gear-shine)" />
          <circle cx="50" cy="50" r="11.5" fill="var(--color-background)" />
        </g>
      </svg>
      <span className="ng-word font-display text-sm font-semibold tracking-tight">next gen</span>
    </span>
  );
}
