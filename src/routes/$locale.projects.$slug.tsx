import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { MediaSlot } from "@/components/site/MediaSlot";
import { Pipeline } from "@/components/site/SystemFlow";
import { ContactCta } from "@/components/site/ContactCta";
import { ProjectCard } from "@/components/site/ProjectCard";
import { getCanonicalProjects, getCanonicalServices } from "@/content/api";
import { useLocale } from "@/hooks/useLocale";
import { getContent, site } from "@/content";
import { breadcrumbs, buildHead } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/projects/$slug")({
  beforeLoad: ({ params }) => {
    const t = getContent(params.locale as Locale);
    if (!t.projects.some((p) => p.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const t = getContent(locale);
    const project = t.projects.find((p) => p.slug === params.slug);
    if (!project) {
      return { meta: [{ title: t.ui.notFound }, { name: "robots", content: "noindex" }] };
    }
    return buildHead({
      locale,
      path: `/projects/${project.slug}`,
      title: `${project.name} — ${t.profile.displayName}`,
      description: project.summary,
      ogType: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          headline: project.name,
          description: project.summary,
          url: `${site.domain}/${locale}/projects/${project.slug}`,
          inLanguage: locale,
          genre: project.category,
          keywords: project.tech.join(", "),
          author: { "@type": "Person", name: t.profile.displayName, url: site.domain },
          creator: { "@type": "Person", name: t.profile.displayName },
        },
        breadcrumbs(locale, [
          { name: t.profile.displayName, path: "" },
          {
            name: t.nav.find((n) => n.path === "/projects")?.label ?? "Projects",
            path: "/projects",
          },
          { name: project.name, path: `/projects/${project.slug}` },
        ]),
      ],
    });
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { locale, slug } = Route.useParams();
  const { t } = useLocale();
  const project = t.projects.find((p) => p.slug === slug);
  if (!project) return null;

  // Related work: same category first, then any other project, capped at two.
  const related = [
    ...t.projects.filter((p) => p.slug !== slug && p.category === project.category),
    ...t.projects.filter((p) => p.slug !== slug && p.category !== project.category),
  ].slice(0, 2);

  // Services linked to this project through the canonical layer.
  const canonicalId = getCanonicalProjects().find((p) => p.slug === slug)?.id;
  const relatedServiceIds = canonicalId
    ? getCanonicalServices()
        .filter((s) => (s.relatedProjects ?? []).includes(canonicalId))
        .map((s) => s.id)
    : [];
  const relatedServices = t.services.filter((s) => relatedServiceIds.includes(s.id));

  const cs = project.caseStudy;
  const blocks = [
    { label: t.ui.overview, body: cs.overview },
    { label: t.ui.problem, body: cs.problem },
    { label: t.ui.approach, body: cs.approach },
    { label: t.ui.implementation, body: cs.implementation },
    { label: t.ui.challenges, body: cs.challenges },
    { label: t.ui.outcome, body: cs.outcome },
  ].filter((b) => b.body);

  return (
    <>
      <PageHeader eyebrow={project.category} title={project.name} subtitle={project.summary}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-sm border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {t.ui.status}: {project.status}
          </span>
          {project.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
            >
              {link.label}
              <ArrowUpRight className="size-4" />
            </a>
          ))}
        </div>
      </PageHeader>

      {project.media[0] && (
        <Section bordered={false} className="pt-0">
          <MediaSlot media={project.media[0]} note={t.ui.mediaPlaceholder} />
        </Section>
      )}

      <Section eyebrow={t.ui.overview} title={project.name}>
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b.label} delay={i * 50} className="rounded-lg border border-border bg-surface/60 p-6 sm:p-8">
              <p className="eyebrow">{b.label}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.ui.architecture} title={t.ui.architecture}>
        <Pipeline steps={cs.architecture} />
      </Section>

      <Section eyebrow={t.ui.technology} title={t.ui.technology}>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
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

      {related.length > 0 && (
        <Section eyebrow={t.ui.relatedProjects} title={t.ui.relatedProjects}>
          <div className="grid gap-6 lg:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <Section eyebrow={t.ui.relatedServices} title={t.ui.relatedServices}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((service, i) => (
              <Reveal
                key={service.id}
                delay={i * 60}
                className="h-full rounded-lg border border-border bg-surface/60 p-6"
              >
                <h3 className="font-display text-lg font-medium">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Link
              to="/$locale/services"
              params={{ locale }}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {t.ui.services} <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </Section>
      )}

      <ContactCta />
    </>
  );
}
