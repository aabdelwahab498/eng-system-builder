import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyProducts, ProductCard } from "@/components/site/ProductCard";
import { SkillsGrid } from "@/components/site/SkillsGrid";
import { Pipeline } from "@/components/site/SystemFlow";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { getContent } from "@/content";
import { buildHead, metaFor } from "@/lib/seo";
import { site } from "@/content";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const t = getContent(locale);
    const m = metaFor(locale, "home");
    return buildHead({
      locale,
      path: "",
      title: m.title,
      description: m.description,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: t.profile.displayName,
        jobTitle: "Software Engineer",
        description: m.description,
        url: site.domain,
        knowsAbout: [
          "Software Engineering",
          "Backend Development",
          ".NET",
          "AI Engineering",
          "Software Architecture",
          "Flutter",
        ],
      },
    });
  },
  component: HomePage,
});

function HomePage() {
  const { locale, t } = useLocale();
  const featured = t.projects.filter((p) => p.featured);
  const topSkills = t.skills.slice(0, 3);
  const factoryProject = t.projects.find((p) => p.flagship);

  return (
    <>
      <Hero />
      <CapabilityStrip />

      <Section eyebrow={t.ui.featuredProjects} title={t.ui.featuredProjects}>
        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link
            to="/$locale/projects"
            params={{ locale }}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            {t.ui.viewAllProjects} <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </Section>

      <Section eyebrow={t.ui.products} title={t.ui.products}>
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

      <Section eyebrow={t.ui.skills} title={t.ui.skills}>
        <SkillsGrid categories={topSkills} />
        <Reveal className="mt-10">
          <Link
            to="/$locale/skills"
            params={{ locale }}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            {t.ui.viewAllSkills} <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </Section>

      <Section eyebrow="Flagship" title={t.factory.title} subtitle={t.factory.tagline}>
        <Pipeline steps={t.factory.architecture} />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {t.factory.capabilities.slice(0, 3).map((c, i) => (
            <Reveal key={c.title} delay={i * 60} className="rounded-lg border border-border bg-surface/60 p-6">
              <h3 className="font-display text-base font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link
            to="/$locale/factory"
            params={{ locale }}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            {factoryProject?.name ?? t.factory.title} <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </Section>

      <Section eyebrow={t.ui.services} title={t.ui.services}>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((service, i) => (
            <Reveal key={service.id} delay={i * 50} className="bg-surface/70 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
