import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export type CatalogItem = {
  id: string;
  src: string;
  title: string;
  caption?: string | undefined;
  credit?: string | undefined;
};

/**
 * Catalog-style image browser: one large spread you flip through, with a
 * thumbnail strip, keyboard arrows, counter and a full-screen lightbox.
 */
export function ImageCatalog({
  items,
  rtl = false,
  labels,
  className,
}: {
  items: CatalogItem[];
  rtl?: boolean;
  labels: { previous: string; next: string; close: string; expand: string };
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  const count = items.length;
  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setDir(next > index ? 1 : -1);
      setIndex(((next % count) + count) % count);
    },
    [count, index],
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") (rtl ? prev : next)();
      else if (e.key === "ArrowLeft") (rtl ? next : prev)();
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, rtl]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  if (count === 0) return null;
  const active = items[index]!;

  return (
    <div className={cn("select-none", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
        {/* spine highlight, gives the catalog/booklet feel */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border-strong/70 to-transparent sm:block"
        />

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-background/60">
          <img
            key={active.id}
            src={active.src}
            alt={active.caption || active.title}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-contain p-4 sm:p-8",
              dir === 1 ? "animate-catalog-in-next" : "animate-catalog-in-prev",
            )}
          />

          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label={labels.expand}
            className="absolute right-4 top-4 z-20 rounded-full border border-border bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Expand className="size-4" aria-hidden />
          </button>

          <NavButton side="start" rtl={rtl} label={labels.previous} onClick={prev} />
          <NavButton side="end" rtl={rtl} label={labels.next} onClick={next} />
        </div>

        <div className="flex flex-col gap-1 border-t border-border px-5 py-4 sm:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-base font-medium text-foreground">{active.title}</p>
            <p className="shrink-0 font-mono text-[11px] tracking-widest text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
          {active.caption && <p className="text-sm text-muted-foreground">{active.caption}</p>}
          {active.credit && (
            <p className="font-mono text-[11px] text-muted-foreground/80">{active.credit}</p>
          )}
        </div>
      </div>

      {/* thumbnail strip */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            aria-label={item.title}
            aria-current={i === index}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              i === index
                ? "border-primary/60 opacity-100 ring-1 ring-primary/40"
                : "border-border opacity-60 hover:opacity-100",
            )}
          >
            <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <img
            src={active.src}
            alt={active.caption || active.title}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">{active.title}</p>
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label={labels.close}
            className="absolute right-5 top-5 rounded-full border border-border bg-surface/80 p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={prev}
              aria-label={labels.previous}
              className="rounded-full border border-border bg-surface/80 p-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <span className="font-mono text-xs text-muted-foreground">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label={labels.next}
              className="rounded-full border border-border bg-surface/80 p-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  side,
  rtl,
  label,
  onClick,
}: {
  side: "start" | "end";
  rtl: boolean;
  label: string;
  onClick: () => void;
}) {
  const onLeft = side === "start" ? !rtl : rtl;
  const Icon = onLeft ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-muted-foreground backdrop-blur transition-all hover:scale-105 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        onLeft ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
