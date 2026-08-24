import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FilterBar } from "@/components/site/FilterBar";
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

const ALL = "__all__";

function ProjectsPage() {
  const { t } = useLocale();
  const [filter, setFilter] = useState<string>(ALL);

  // Categories come from the content layer, never a hardcoded list.
  const categories = useMemo(
    () => Array.from(new Set(t.projects.map((p) => p.category))),
    [t.projects],
  );

  const visible = filter === ALL ? t.projects : t.projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow={t.ui.featuredProjects}
        title={t.ui.featuredProjects}
        subtitle={t.profile.statement}
      />
      <Section>
        {categories.length > 1 && (
          <FilterBar
            className="mb-10"
            label={t.ui.filterBy}
            active={filter}
            onChange={setFilter}
            options={[
              { id: ALL, label: t.ui.allCategories },
              ...categories.map((c) => ({ id: c, label: c })),
            ]}
          />
        )}

        {visible.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {visible.map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.ui.noMatches}</p>
        )}
      </Section>
      <ContactCta />
    </>
  );
}
