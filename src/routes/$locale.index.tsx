import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Stagger } from "@/components/site/Motion";
import { FilterBar } from "@/components/site/FilterBar";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ContactCta } from "@/components/site/ContactCta";
import { listPublicArticles, listPublicByKind } from "@/lib/cms/public.functions";
import { useLocale } from "@/hooks/useLocale";
import { getContent } from "@/content";
import { buildHead, metaFor } from "@/lib/seo";
import { site } from "@/content";
import type { ArticleData, GalleryItemData } from "@/lib/cms/types";
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
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Cairo University",
        },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Bachelor of Engineering — Computer Science",
          educationalLevel: "Bachelor",
          recognizedBy: { "@type": "CollegeOrUniversity", name: "Cairo University" },
          dateCreated: "2016",
        },
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

const ALL = "__all__";

function pickText(value: { en: string; ar: string | null } | undefined, locale: Locale) {
  if (!value) return "";
  return locale === "ar" && value.ar ? value.ar : value.en;
}

function HomePage() {
  const { locale, t } = useLocale();
  const [workFilter, setWorkFilter] = useState(ALL);

  const categories = useMemo(
    () => Array.from(new Set(t.projects.map((p) => p.category))),
    [t.projects],
  );

  const work = workFilter === ALL ? t.projects : t.projects.filter((p) => p.category === workFilter);

  const { data: articles = [] } = useQuery({
    queryKey: ["public", "articles"],
    queryFn: () => listPublicArticles(),
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["public", "gallery"],
    queryFn: () => listPublicByKind({ data: { kind: "gallery_item" } }),
  });

  const latestArticles = articles.slice(0, 3);
  const galleryPreview = gallery.slice(0, 6);

  return (
    <>
      <Hero />
      <CapabilityStrip />

      {/* 1 — Selected work, filterable */}
      <Section eyebrow={t.ui.selectedWork} title={t.ui.featuredProjects}>
        {categories.length > 1 && (
          <FilterBar
            className="mb-10"
            label={t.ui.filterBy}
            active={workFilter}
            onChange={setWorkFilter}
            options={[
              { id: ALL, label: t.ui.allCategories },
              ...categories.map((c) => ({ id: c, label: c })),
            ]}
          />
        )}
        {work.length > 0 ? (
          <Stagger className="grid gap-6 lg:grid-cols-2" step={90}>
            {work.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Stagger>
        ) : (
          <p className="text-sm text-muted-foreground">{t.ui.noMatches}</p>
        )}
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

      {/* 2 — What I build */}
      <Section eyebrow={t.ui.capabilities} title={t.ui.whatIBuild} subtitle={t.ui.whatIBuildIntro}>
        <FocusMarquee items={t.profile.focusAreas} />
      </Section>


      {/* 4 — Services */}
      <Section eyebrow={t.ui.services} title={t.ui.services}>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={60}>
          {t.services.map((service) => (
            <div
              key={service.id}
              className="lift flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 sm:p-8"
            >
              <h3 className="font-display text-lg font-medium">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
              <ul className="mt-5 space-y-2">
                {service.deliverables.slice(0, 3).map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Stagger>
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


      {/* 5 — Universal AI Software Factory */}
      <Section eyebrow={t.ui.factory} title={t.factory.title} subtitle={t.factory.tagline}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.factory.what}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.factory.problem}</p>
            <Link
              to="/$locale/projects/$slug"
              params={{ locale, slug: "universal-ai-software-factory" }}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {t.ui.exploreFactory} <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {t.factory.architecture.map((step, i) => (
                <li key={step} className="bg-surface/70 p-4">
                  <span className="font-mono text-[11px] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm text-foreground">{step}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* 6 — Writing */}
      {latestArticles.length > 0 && (
        <Section eyebrow={t.ui.writing} title={t.ui.latestWriting}>
          <Stagger className="grid gap-4 md:grid-cols-3" step={70}>
            {latestArticles.map((article) => {
              const data = article.data as unknown as ArticleData;
              return (
                <Link
                  key={article.id}
                  to="/$locale/blog/$slug"
                  params={{ locale, slug: article.slug }}
                  className="lift block h-full rounded-lg border border-border bg-surface/60 p-5 transition-colors hover:border-border-strong"
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {data.category || t.ui.writing}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-medium">{pickText(data.title, locale)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{pickText(data.excerpt, locale)}</p>
                </Link>
              );
            })}
          </Stagger>
          <Reveal className="mt-10">
            <Link
              to="/$locale/blog"
              params={{ locale }}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {t.ui.viewAllWriting} <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </Section>
      )}

      {/* 7 — Gallery preview */}
      {galleryPreview.length > 0 && (
        <Section eyebrow={t.ui.gallery} title={t.ui.gallery} subtitle={t.ui.galleryIntro}>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={50}>
            {galleryPreview.map((item) => {
              const data = item.data as unknown as GalleryItemData;
              return (
                <figure key={item.id} className="overflow-hidden rounded-lg border border-border bg-surface/60">
                  {data.mediaType === "video" ? (
                    <video src={data.mediaUrl} controls className="w-full" />
                  ) : (
                    <img
                      src={data.mediaUrl}
                      alt={pickText(data.caption, locale) || pickText(data.title, locale)}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <figcaption className="p-4 text-sm text-muted-foreground">
                    {pickText(data.title, locale)}
                  </figcaption>
                </figure>
              );
            })}
          </Stagger>
          <Reveal className="mt-10">
            <Link
              to="/$locale/gallery"
              params={{ locale }}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {t.ui.gallery} <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </Section>
      )}

      {/* 8 — Education */}
      {t.profile.education && t.profile.education.length > 0 && (
        <Section eyebrow={t.ui.education} title={t.ui.education}>
          <Stagger className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" step={50}>
            {t.profile.education.map((e) => (
              <div key={e.credential} className="h-full bg-surface/70 p-6 sm:p-8">
                <h3 className="font-display text-base font-medium">{e.credential}</h3>
                {(e.institution || e.period) && (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {[e.institution, e.period].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </Stagger>
        </Section>
      )}

      <ContactCta />
    </>
  );
}
