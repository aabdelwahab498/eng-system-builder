import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/content";
import { MediaSlot } from "./MediaSlot";
import { useLocale } from "@/hooks/useLocale";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const available =
    product.status === "available" || product.status === "live" || product.status === "beta";
  const statusLabel =
    product.status === "live"
      ? t.ui.live
      : product.status === "beta"
        ? t.ui.beta
        : product.status === "in-development"
          ? t.ui.inDevelopment
          : product.status === "available"
            ? t.ui.available
            : t.ui.comingSoon;

  return (
    <article className="lift flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{product.kind}</p>
        <span
          className={
            available
              ? "rounded-sm border border-primary/40 px-2 py-1 font-mono text-[10px] text-primary"
              : "rounded-sm border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
          }
        >
          {statusLabel}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold">{product.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>

      {product.media[0] && (
        <MediaSlot media={product.media[0]} note={t.ui.mediaPlaceholder} className="mt-6" />
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
        {product.price && <span className="font-mono text-[11px] text-muted-foreground">{product.price}</span>}
        <Link
          to="/$locale/products/$slug"
          params={{ locale, slug: product.slug }}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          {t.ui.readMore}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function EmptyProducts({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-surface/40 px-6 py-14 text-center">
      <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
}
