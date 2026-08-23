import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProductCard } from "@/components/site/ProductCard";
import { FactoryApiPanel, FactorySection } from "@/components/site/FactorySection";
import { TechMatrix } from "@/components/site/TechMatrix";
import { ContactCta } from "@/components/site/ContactCta";
import { projects } from "@/data/projects";
import { products } from "@/data/products";
import { engineeringPrinciples, whatIBuild } from "@/data/services";
import { site } from "@/data/site";

const title = "Eng/Ahmed Abdelwahab — Software Engineer, AI Builder & Product Engineer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: site.description },
      { property: "og:title", content: title },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />

      <Section
        eyebrow="About"
        title="Engineering with a product mindset."
        subtitle="I work across backend development, software architecture and AI systems — moving from idea to architecture, implementation and deployment rather than stopping at isolated code."
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {whatIBuild.map((item, i) => (
            <Reveal key={item} delay={i * 50} className="bg-surface/70 px-6 py-8">
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-display text-lg font-medium">{item}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            More about how I work <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </Section>

      <Section
        eyebrow="Projects"
        title="Selected Work"
        subtitle="Real systems, products, and experiments built across software engineering and AI."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {projects
            .filter((p) => p.featured)
            .map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
        </div>
      </Section>

      <FactorySection />
      <FactoryApiPanel />

      <Section eyebrow="Engineering" title="How I Think About Software">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {engineeringPrinciples.map((p, i) => (
            <Reveal key={p.title} delay={i * 50} className="bg-surface/70 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Stack" title="Technology Matrix">
        <TechMatrix />
      </Section>

      <Section
        eyebrow="Products"
        title="Digital Products"
        subtitle="Tools, systems, templates, and products built to solve real problems."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
