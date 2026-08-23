import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/projects/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "projects");
    return buildHead({ locale, path: "/projects", title: m.title, description: m.description });
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader
        eyebrow={t.ui.featuredProjects}
        title={t.ui.featuredProjects}
        subtitle={t.profile.statement}
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {t.projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
