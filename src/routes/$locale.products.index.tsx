import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { EmptyProducts, ProductCard } from "@/components/site/ProductCard";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/products/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "products");
    return buildHead({ locale, path: "/products", title: m.title, description: m.description });
  },
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t.ui.products} title={t.ui.products} subtitle={t.ui.productsIntro} />
      <Section>
        {t.products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {t.products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyProducts message={t.ui.noProducts} />
        )}
      </Section>
      <ContactCta />
    </>
  );
}
