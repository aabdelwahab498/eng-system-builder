import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} — Digital Product`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();

  return (
    <>
      <PageHeader eyebrow={product.type} title={product.name} subtitle={product.description}>
        <div className="mt-8 flex flex-wrap gap-3">
          {product.status === "Available" && product.accessUrl ? (
            <Button asChild>
              <a href={product.accessUrl} target="_blank" rel="noreferrer noopener">
                Get Access
              </a>
            </Button>
          ) : (
            <Button disabled>Coming Soon</Button>
          )}
          <Button asChild variant="outline">
            <Link to="/products">
              <ArrowLeft className="size-4" /> All products
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Section bordered={false}>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <p className="eyebrow">Details</p>
            <ul className="mt-5 space-y-3 text-base text-muted-foreground">
              {(product.details ?? ["Details will be published as the product is released."]).map((d) => (
                <li key={d} className="hairline pt-3 first:border-0 first:pt-0">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
              <div className="flex justify-between bg-surface/70 px-5 py-4">
                <dt className="eyebrow">Type</dt>
                <dd className="font-mono text-sm">{product.type}</dd>
              </div>
              <div className="flex justify-between bg-surface/70 px-5 py-4">
                <dt className="eyebrow">Status</dt>
                <dd className="font-mono text-sm">{product.status}</dd>
              </div>
              <div className="flex justify-between bg-surface/70 px-5 py-4">
                <dt className="eyebrow">Price</dt>
                <dd className="font-mono text-sm">{product.price}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
