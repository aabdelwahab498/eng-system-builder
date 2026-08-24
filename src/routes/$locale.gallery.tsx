import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FilterBar } from "@/components/site/FilterBar";
import { ContactCta } from "@/components/site/ContactCta";
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
      <PageHeader eyebrow={t.ui.gallery} title={t.ui.gallery} subtitle={t.ui.galleryIntro} />
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
            {videos.length > 0 && (
              <div>
                <h2 className="eyebrow mb-6">{t.ui.videos}</h2>
                <div className="grid gap-6 md:grid-cols-2">{videos.map(renderCard)}</div>
              </div>
            )}
            {stills.length > 0 && (
              <div>
                {videos.length > 0 && <h2 className="eyebrow mb-6">{t.ui.images}</h2>}
                <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
                  {stills.map(renderCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
      <ContactCta />
    </>
  );
}
