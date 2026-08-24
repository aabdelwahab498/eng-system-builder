import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Typewriter } from "@/components/site/Motion";
import { FilterBar } from "@/components/site/FilterBar";
import { ImageCatalog } from "@/components/site/ImageCatalog";
import { ContactCta } from "@/components/site/ContactCta";
import { ProjectCard } from "@/components/site/ProjectCard";
import { gallerySections, projectSectionSlugs } from "@/lib/gallery-sections";
import { listPublicByKind } from "@/lib/cms/public.functions";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getContent } from "@/content";
import type { GalleryItemData } from "@/lib/cms/types";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/gallery")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const isAr = locale === "ar";
    return buildHead({
      locale,
      path: "/gallery",
      title: isAr ? "المعرض — أحمد عبد الوهاب" : "Gallery — Ahmed Abdelwahab",
      description: isAr
        ? "لقطات من الواجهات والأنظمة والمنتجات الرقمية التي عملت عليها."
        : "Interfaces, systems and product visuals from engineering and product work.",
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.gallery, path: "/gallery" },
      ]),
    });
  },
  component: GalleryPage,
});

const ALL = "__all__";

function pick(value: { en: string; ar: string | null } | undefined, locale: Locale) {
  if (!value) return "";
  return locale === "ar" && value.ar ? value.ar : value.en;
}

function GalleryPage() {
  const { locale, t } = useLocale();
  const [filter, setFilter] = useState(ALL);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["public", "gallery"],
    queryFn: () => listPublicByKind({ data: { kind: "gallery_item" } }),
  });

  const entries = useMemo(
    () => items.map((item) => ({ id: item.id, data: item.data as unknown as GalleryItemData })),
    [items],
  );

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.data.category).filter(Boolean))),
    [entries],
  );

  const visible = filter === ALL ? entries : entries.filter((e) => e.data.category === filter);
  const videos = visible.filter((e) => e.data.mediaType === "video");
  const stills = visible.filter((e) => e.data.mediaType !== "video");

  const renderCard = (entry: { id: string; data: GalleryItemData }, i: number) => (
    <Reveal key={entry.id} delay={i * 50} className="break-inside-avoid">
      <figure className="overflow-hidden rounded-lg border border-border bg-surface/60">
        {entry.data.mediaType === "video" ? (
          <video
            src={entry.data.mediaUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full"
            aria-label={pick(entry.data.title, locale)}
          />
        ) : (
          <img
            src={entry.data.mediaUrl}
            alt={pick(entry.data.caption, locale) || pick(entry.data.title, locale)}
            loading="lazy"
            className="w-full object-cover"
          />
        )}
        <figcaption className="space-y-1 p-4">
          <p className="font-display text-sm font-medium text-foreground">
            {pick(entry.data.title, locale)}
          </p>
          {pick(entry.data.caption, locale) && (
            <p className="text-sm text-muted-foreground">{pick(entry.data.caption, locale)}</p>
          )}
          {entry.data.credit && (
            <p className="font-mono text-[11px] text-muted-foreground">{entry.data.credit}</p>
          )}
        </figcaption>
      </figure>
    </Reveal>
  );

  return (
    <>
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.gallery, path: "/gallery" }]} />

      <Section>
        <Reveal>
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <div className="ps-box inline-flex max-w-full items-center gap-2 overflow-hidden rounded-md border border-emerald-500/25 bg-[#012456] px-4 py-2">
              <span className="ps-prompt digital-green select-none text-base font-semibold sm:text-lg">
                {locale === "ar" ? "«" : ">"}
              </span>
              <Typewriter
                as="span"
                text={locale === "ar" ? "تفرّج… وشاهد أعمالنا" : "Take a look… and watch our work"}
                loop
                speed={95}
                startDelay={500}
                holdDelay={2200}
                deleteSpeed={45}
                className="digital-green text-base font-semibold sm:text-lg"
                cursorClassName="ps-caret"
              />
            </div>
            <p className="digital-green mx-auto max-w-2xl text-sm opacity-80 sm:text-base">
              {locale === "ar"
                ? "خذ وقتك، واستكبر بحرية. كل ما ستجده هنا صُنع بإبداع وحرفية وهدوء — لتهدأ بالك وتطمئن لما سنقدّمه لك."
                : "Take your time and explore freely. Everything here was made with creativity, craftsmanship and calm — so you can feel at ease and confident in what we'll deliver for you."}
            </p>
          </div>
        </Reveal>

        <nav aria-label={t.ui.gallery} className="flex flex-wrap gap-2">
          {gallerySections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-sm border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              {s.label[locale]}
            </a>
          ))}
        </nav>

        <div className="mt-16 space-y-20">
          {(["web-apps", "websites", "mobile-apps"] as const).map((id) => {
            const section = gallerySections.find((s) => s.id === id)!;
            const list = t.projects.filter((p) => projectSectionSlugs[id].includes(p.slug));
            return (
              <div key={id} id={id} className="scroll-mt-28">
                <h2 className="eyebrow mb-6">{section.label[locale]}</h2>
                {list.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
                    <p className="text-sm text-muted-foreground">{t.ui.contentPending}</p>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {list.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

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

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.ui.contentPending}</p>
        ) : visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-strong p-12 text-center">
            <p className="text-sm text-muted-foreground">{t.ui.noGallery}</p>
          </div>
        ) : (
          <div className="space-y-16">
            <a
              href="https://www.youtube.com/@MADO674/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface/60 p-6 transition-colors hover:border-strong sm:flex-row sm:items-center sm:justify-between sm:p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,0,0,0.10), rgba(15,23,42,0.6) 60%), linear-gradient(135deg, #0f172a, #1e1b2e)",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: "radial-gradient(circle, #ff0000, transparent 70%)" }}
              />
              <div className="relative flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff0000] shadow-[0_0_24px_rgba(255,0,0,0.55)]"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor" aria-hidden>
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.5v-7l6.5 3.5z" />
                  </svg>
                </span>
                <div className="space-y-1">
                  <p className="font-display text-base font-semibold text-white sm:text-lg">
                    {t.ui.youtubeCtaTitle}
                  </p>
                  <p className="max-w-xl text-sm text-white/70">{t.ui.youtubeCtaBody}</p>
                </div>
              </div>
              <span className="relative inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#ff0000] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,0,0,0.45)] transition-transform group-hover:scale-105 sm:self-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.5v-7l6.5 3.5z" />
                </svg>
                {t.ui.youtubeCtaButton}
              </span>
            </a>
            {videos.length > 0 && (
              <div id="ai-videos" className="scroll-mt-28">
                <h2 className="eyebrow mb-6">{t.ui.videos}</h2>
                <div className="grid gap-6 md:grid-cols-2">{videos.map(renderCard)}</div>
              </div>
            )}
            {stills.length > 0 && (
              <div id="images" className="scroll-mt-28">
                <h2 className="eyebrow mb-6">{t.ui.images}</h2>
                <ImageCatalog
                  rtl={locale === "ar"}
                  labels={{
                    previous: locale === "ar" ? "السابق" : "Previous",
                    next: locale === "ar" ? "التالي" : "Next",
                    close: locale === "ar" ? "إغلاق" : "Close",
                    expand: locale === "ar" ? "عرض بملء الشاشة" : "View full screen",
                  }}
                  items={stills.map((entry) => ({
                    id: entry.id,
                    src: entry.data.mediaUrl,
                    title: pick(entry.data.title, locale),
                    caption: pick(entry.data.caption, locale),
                    credit: entry.data.credit,
                  }))}
                />
              </div>
            )}
          </div>
        )}
      </Section>
      <ContactCta />
    </>
  );
}
