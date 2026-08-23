import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Stagger } from "@/components/site/Motion";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyProducts, ProductCard } from "@/components/site/ProductCard";
import { SkillsGrid } from "@/components/site/SkillsGrid";
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

  return (
    <>
      <Hero />
      <CapabilityStrip />

      {/* 1 — Selected work */}
      <Section eyebrow={t.ui.selectedWork} title={t.ui.featuredProjects}>
        <Stagger className="grid gap-6 lg:grid-cols-2" step={90}>
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Stagger>
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

      {/* 3 — Products ecosystem */}
      <Section eyebrow={t.ui.products} title={t.ui.products} subtitle={t.ui.productsIntro}>
        {t.products.length > 0 ? (
          <Stagger className="grid gap-6 sm:grid-cols-2" step={80}>
            {t.products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </Stagger>
        ) : (
          <EmptyProducts message={t.ui.noProducts} />
        )}
      </Section>

      {/* 4 — Capabilities */}
      <Section eyebrow={t.ui.capabilities} title={t.ui.skills}>
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

      {/* 5 — How I work */}
      <Section eyebrow={t.ui.howIWork} title={t.ui.howIWork}>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={60}>
          {t.profile.philosophy.map((p, i) => (
            <div key={p.title} className="lift h-full rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
              <span className="font-mono text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-lg font-medium">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      {/* 6 — Services */}
      <Section eyebrow={t.ui.services} title={t.ui.services}>
        <Stagger className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" step={50}>
          {t.services.map((service) => (
            <div key={service.id} className="h-full bg-surface/70 p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      <ContactCta />
    </>
  );
}
