import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { CapabilityStrip, Hero } from "@/components/site/Hero";
import { MatrixStrip } from "@/components/site/MatrixHud";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Stagger } from "@/components/site/Motion";
import { FocusMarquee } from "@/components/site/FocusMarquee";
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

function pickText(value: { en: string; ar: string | null } | undefined, locale: Locale) {
  if (!value) return "";
  return locale === "ar" && value.ar ? value.ar : value.en;
}

function HomePage() {
  const { locale, t } = useLocale();


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
      <MatrixStrip height={190} />
      <Hero />
      <CapabilityStrip />



      {/* 2 — What I build */}
      <Section eyebrow={t.ui.capabilities} title={t.ui.whatIBuild} subtitle={t.ui.whatIBuildIntro}>
        <FocusMarquee items={t.profile.focusAreas} />
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
    </>
  );
}
