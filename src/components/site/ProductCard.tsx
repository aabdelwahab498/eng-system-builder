import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">{product.type}</p>
        <Badge variant="secondary" className="font-mono text-[10px] tracking-wide">
          {product.status}
        </Badge>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{product.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      <p className="mt-6 font-mono text-sm text-foreground">{product.price}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/products/$slug" params={{ slug: product.slug }}>
            Learn More
          </Link>
        </Button>
        {product.status === "Available" && product.accessUrl ? (
          <Button asChild size="sm">
            <a href={product.accessUrl} target="_blank" rel="noreferrer noopener">
              Get Access
            </a>
          </Button>
        ) : (
          <Button size="sm" disabled>
            Coming Soon
          </Button>
        )}
      </div>
    </article>
  );
}
