import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, Expand, ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectCatalogItem = {
  id: string;
  src?: string;
  /** fallback label when no screenshot is available */
  placeholder?: string;
  title: string;
  caption?: string;
  credit?: string;
  tech?: string[];
  status?: string;
  liveUrl?: string;
  slug?: string;
};

type Flip = { dir: 1 | -1; from: number };

/**
 * Book-style project catalog: an open two-page spread with a real page-turn
 * animation, thumbnail strip, keyboard arrows and a full-screen lightbox.
 * Mirrors ImageCatalog but renders project metadata on the text page.
 */
export function ProjectCatalog({
  items,
  rtl = false,
  locale,
  labels,
  className,
}: {
  items: ProjectCatalogItem[];
  rtl?: boolean;
  locale: "en" | "ar";
  labels: {
    previous: string;
    next: string;
    close: string;
    expand: string;
    viewProject: string;
  };
  className?: string;
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
      window.setTimeout(() => {
        busy.current = false;
        setFlip(null);
      }, 790);
    },
    [count, index],
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

  const leftItem = flip && flip.dir === 1 && old ? old : active;
  const rightItem = flip && flip.dir === -1 && old ? old : active;
  const leftIndex = leftItem === active ? index : flip!.from;
  const rightIndex = rightItem === active ? index : flip!.from;

  return (
    <div className={cn("select-none", className)}>
      <div className="book-scene">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
          <div className="book-spread relative grid aspect-[16/10] w-full grid-cols-2">
            <div className="book-page book-page-left">
              <ProjectImagePage item={leftItem} />
            </div>
            <div className="book-page book-page-right">
              <ProjectTextPage
                item={rightItem}
                index={rightIndex}
                count={count}
                locale={locale}
                labels={labels}
              />
            </div>

            <div className="book-spine" aria-hidden />

            {flip && old && (
              <div className={cn("flip-page", flip.dir === 1 ? "flip-page-next" : "flip-page-prev")}>
                <div className="flip-face book-page">
                  {flip.dir === 1 ? (
                    <ProjectTextPage
                      item={old}
                      index={flip.from}
                      count={count}
                      locale={locale}
                      labels={labels}
                    />
                  ) : (
                    <ProjectImagePage item={old} />
                  )}
                </div>
                <div className="flip-face flip-face-back book-page">
                  {flip.dir === 1 ? (
                    <ProjectImagePage item={active} />
                  ) : (
                    <ProjectTextPage
                      item={active}
                      index={index}
                      count={count}
                      locale={locale}
                      labels={labels}
                    />
                  )}
                </div>
              </div>
            )}

            {active.src && (
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label={labels.expand}
                className="absolute right-4 top-4 z-50 rounded-full border border-border bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Expand className="size-4" aria-hidden />
              </button>
            )}

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
              "relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-surface/60 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              i === index
                ? "border-primary/60 opacity-100 ring-1 ring-primary/40"
                : "border-border opacity-60 hover:opacity-100",
            )}
          >
            {item.src ? (
              <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <span className="px-1 text-center font-mono text-[9px] leading-tight text-muted-foreground">
                {item.placeholder ?? item.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightbox && active.src && (
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

function ProjectImagePage({ item }: { item: ProjectCatalogItem }) {
  if (item.src) {
    return (
      <img
        src={item.src}
        alt={item.caption || item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain p-4 sm:p-7"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
        {item.credit}
      </span>
      <h3 className="font-display text-xl font-medium text-foreground sm:text-2xl">{item.title}</h3>
      <p className="font-mono text-[10px] text-muted-foreground/70">{item.placeholder}</p>
    </div>
  );
}

function ProjectTextPage({
  item,
  index,
  count,
  locale,
  labels,
}: {
  item: ProjectCatalogItem;
  index: number;
  count: number;
  locale: "en" | "ar";
  labels: { viewProject: string };
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6 py-6 sm:px-10">
      <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
      {item.credit && (
        <p className="font-mono text-[11px] tracking-[0.2em] text-primary/80">{item.credit}</p>
      )}
      <h3 className="font-display text-xl font-medium text-foreground sm:text-2xl">{item.title}</h3>
      {item.caption && (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{item.caption}</p>
      )}
      {item.tech && item.tech.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {item.tech.slice(0, 6).map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {item.status && (
          <span className="font-mono text-[11px] text-muted-foreground">{item.status}</span>
        )}
        {item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-sm font-mono text-[11px] text-primary underline-offset-4 transition-colors hover:underline"
          >
            {locale === "ar" ? "معاينة مباشرة" : "Live preview"}
            <ExternalLink className="size-3" />
          </a>
        )}
        {item.slug && (
          <Link
            to="/$locale/projects/$slug"
            params={{ locale, slug: item.slug }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {labels.viewProject}
            <ArrowUpRight className="size-4" />
          </Link>
        )}
      </div>
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
