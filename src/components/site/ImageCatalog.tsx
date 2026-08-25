import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export type CatalogItem = {
  id: string;
  src: string;
  title: string;
  caption?: string | undefined;
  credit?: string | undefined;
  meta?: { label: string; value: string }[] | undefined;
  linkUrl?: string | undefined;
  linkLabel?: string | undefined;
};


type Flip = { dir: 1 | -1; from: number };

/**
 * Book-style image catalog: an open two-page spread with a real page-turn
 * animation, thumbnail strip, keyboard arrows and a full-screen lightbox.
 */
export function ImageCatalog({
  items,
  rtl = false,
  labels,
  className,
  aspectClassName,
  onIndexChange,
}: {
  items: CatalogItem[];
  rtl?: boolean;
  labels: { previous: string; next: string; close: string; expand: string };
  className?: string;
  aspectClassName?: string;
  onIndexChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [flip, setFlip] = useState<Flip | null>(null);
  const busy = useRef(false);

  const count = items.length;

  const go = useCallback(
    (target: number, direction?: 1 | -1) => {
      if (count === 0 || busy.current) return;
      const nextIndex = ((target % count) + count) % count;
      if (nextIndex === index) return;
      const dir: 1 | -1 = direction ?? (nextIndex > index ? 1 : -1);
      busy.current = true;
      setFlip({ dir, from: index });
      setIndex(nextIndex);
      onIndexChange?.(nextIndex);
      window.setTimeout(() => {
        busy.current = false;
        setFlip(null);
      }, 790);
    },
    [count, index, onIndexChange],
  );

  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const next = useCallback(() => go(index + 1, 1), [go, index]);

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
  const old = flip ? items[flip.from]! : null;

  // While turning, the static spread already shows the destination half.
  const leftItem = flip && flip.dir === 1 && old ? old : active;
  const rightItem = flip && flip.dir === -1 && old ? old : active;
  const leftIndex = leftItem === active ? index : flip!.from;
  const rightIndex = rightItem === active ? index : flip!.from;

  return (
    <div className={cn("select-none", className)}>
      <div className="book-scene">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
          <div className={cn("book-spread relative grid w-full grid-cols-2", aspectClassName ?? "aspect-[16/10]")}>
            <div className="book-page book-page-left">
              <ImagePage item={leftItem} />
            </div>
            <div className="book-page book-page-right">
              <TextPage item={rightItem} index={rightIndex} count={count} />
            </div>

            <div className="book-spine" aria-hidden />

            {flip && old && (
              <div className={cn("flip-page", flip.dir === 1 ? "flip-page-next" : "flip-page-prev")}>
                <div className="flip-face book-page">
                  {flip.dir === 1 ? (
                    <TextPage item={old} index={flip.from} count={count} />
                  ) : (
                    <ImagePage item={old} />
                  )}
                </div>
                <div className="flip-face flip-face-back book-page">
                  {flip.dir === 1 ? (
                    <ImagePage item={active} />
                  ) : (
                    <TextPage item={active} index={index} count={count} />
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={labels.expand}
              className="absolute right-4 top-4 z-50 rounded-full border border-border bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Expand className="size-4" aria-hidden />
            </button>

            <NavButton side="start" rtl={rtl} label={labels.previous} onClick={prev} />
            <NavButton side="end" rtl={rtl} label={labels.next} onClick={next} />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {active.title} — {index + 1} / {count} ({leftIndex + 1})
      </p>

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

function ImagePage({ item }: { item: CatalogItem }) {
  return (
    <img
      src={item.src}
      alt={item.caption || item.title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-contain p-4 sm:p-7"
    />
  );
}

function TextPage({
  item,
  index,
  count,
}: {
  item: CatalogItem;
  index: number;
  count: number;
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 overflow-y-auto px-6 py-6 sm:px-10">
      <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
      <h3 className="font-display text-xl font-medium text-foreground sm:text-2xl">{item.title}</h3>
      {item.caption && (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{item.caption}</p>
      )}
      {item.meta && item.meta.length > 0 && (
        <dl className="mt-1 grid gap-2 border-t border-border/60 pt-3 text-sm">
          {item.meta.map((row) => (
            <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-3">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
                {row.label}
              </dt>
              <dd className="leading-relaxed text-foreground/90">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {item.credit && (
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground/80">{item.credit}</p>
      )}
      {item.linkUrl && (
        <a
          href={item.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          {item.linkLabel ?? "Verify"}
        </a>
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
        "absolute top-1/2 z-50 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-muted-foreground backdrop-blur transition-all hover:scale-105 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        onLeft ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
