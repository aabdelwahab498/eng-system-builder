import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { getContent, site } from "@/content";
import { breadcrumbs, buildHead } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/products/$slug")({
  beforeLoad: ({ params }) => {
    const t = getContent(params.locale as Locale);
    if (!t.products.some((p) => p.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const t = getContent(locale);
    const product = t.products.find((p) => p.slug === params.slug);
    if (!product) {
      return { meta: [{ title: t.ui.notFound }, { name: "robots", content: "noindex" }] };
    }
    return buildHead({
      locale,
      path: `/products/${product.slug}`,
      title: `${product.name} — ${t.profile.displayName}`,
      description: product.summary,
      ogType: "product",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: product.name,
          description: product.summary,
          url: `${site.domain}/${locale}/products/${product.slug}`,
          inLanguage: locale,
          applicationCategory: product.kind,
          author: { "@type": "Person", name: t.profile.displayName, url: site.domain },
          ...(product.features.length ? { featureList: product.features } : {}),
        },
        breadcrumbs(locale, [
          { name: t.profile.displayName, path: "" },
          {
            name: t.nav.find((n) => n.path === "/products")?.label ?? t.ui.products,
            path: "/products",
          },
          { name: product.name, path: `/products/${product.slug}` },
        ]),
      ],
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { t } = useLocale();
  const product = t.products.find((p) => p.slug === slug);
  if (!product) return null;

  return (
    <>
      <PageHeader eyebrow={product.kind} title={product.name} subtitle={product.summary}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-sm border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {t.ui.status}: {product.status === "available" ? t.ui.available : t.ui.comingSoon}
          </span>
          {product.price && (
            <span className="rounded-sm border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
              {product.price}
            </span>
          )}
          {product.accessUrl ? (
            <a
              href={product.accessUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t.ui.getAccess}
              <ArrowUpRight className="size-4" />
            </a>
          ) : (
            <span className="rounded-md border border-dashed border-border-strong px-4 py-2 text-sm text-muted-foreground">
              {t.ui.comingSoon}
            </span>
          )}
        </div>
      </PageHeader>

      <Section eyebrow={t.ui.overview} title={product.name}>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
            <p className="eyebrow">{t.ui.overview}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description || product.summary}
            </p>
          </Reveal>
          {product.features.length > 0 && (
            <Reveal delay={80} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
              <p className="eyebrow">{t.ui.deliverables}</p>
              <ul className="mt-4 space-y-2">
                {product.features.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
