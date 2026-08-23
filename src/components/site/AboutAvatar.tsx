import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Circular profile avatar for the About page.
 * - `object-[center_28%]` keeps the face centered inside the circle across sizes.
 * - Renders a graceful initials fallback if the image fails to load.
 * - Unified border / ring / glow / shadow used everywhere this avatar appears.
 */
export function AboutAvatar({
  src,
  alt,
  fallbackInitials = "AA",
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  fallbackInitials?: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl"
      />
      <div className="relative size-full overflow-hidden rounded-full border border-border-strong bg-surface/60 ring-1 ring-primary/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        {!failed ? (
          <img
            src={src}
            alt={alt}
            className={cn("size-full object-cover object-[center_28%]", imgClassName)}
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-surface text-center"
          >
            <span className="font-display text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
              {fallbackInitials}
            </span>
          </div>
        )}
      </div>
      <span
        aria-hidden
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-primary/70 blur-[2px]"
      />
    </figure>
  );
}
