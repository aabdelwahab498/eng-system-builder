import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { FilterBar } from "@/components/site/FilterBar";
import { ImageCatalog } from "@/components/site/ImageCatalog";
import { BlogChannels } from "@/components/site/BlogChannels";
import { Input } from "@/components/ui/input";
import { listPublicArticles } from "@/lib/cms/public.functions";
import { useLocale } from "@/hooks/useLocale";
import { breadcrumbs, buildHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getContent } from "@/content";
import type { Locale } from "@/types/content";
import type { ArticleData } from "@/lib/cms/types";

export const Route = createFileRoute("/$locale/blog/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const isAr = locale === "ar";
    return buildHead({
      locale,
      path: "/blog",
      title: isAr ? "المدونة — أحمد عبد الوهاب" : "Writing — Ahmed Abdelwahab",
      description: isAr
        ? "مقالات عن هندسة البرمجيات، أنظمة الذكاء الاصطناعي وبناء المنتجات الرقمية."
        : "Notes on software engineering, AI systems and building production digital products.",
      jsonLd: breadcrumbs(locale, [
        { name: getContent(locale).profile.displayName, path: "" },
        { name: getContent(locale).ui.writing, path: "/blog" },
      ]),
    });
  },
  component: BlogIndex,
});

const ALL = "__all__";

function pick(value: { en: string; ar: string | null } | undefined, locale: Locale) {
  if (!value) return "";
  return locale === "ar" && value.ar ? value.ar : value.en;
}

function BlogIndex() {
  const { locale, t } = useLocale();
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["public", "articles"],
    queryFn: () => listPublicArticles(),
  });

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          articles
            .map((a) => (a.data as unknown as ArticleData).category)
            .filter((c): c is string => Boolean(c)),
        ),
      ),
    [articles],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const data = article.data as unknown as ArticleData;
      if (category !== ALL && data.category !== category) return false;
      if (!needle) return true;
      const haystack = [pick(data.title, locale), pick(data.excerpt, locale), ...(data.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, category, query, locale]);

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: t.ui.home, path: "" },
          { name: t.ui.writing, path: "/blog" },
        ]}
      />
      <PageHeader
        eyebrow={t.ui.writing}
        title={locale === "ar" ? "مقالات وملاحظات" : "Articles & engineering notes"}
        subtitle={
          locale === "ar"
            ? "ملاحظات عن الأنظمة التي أبنيها وكيف تُبنى."
            : "Notes on the systems I build and how they are built."
        }
      >
        <BlogChannels />
      </PageHeader>
      <Section>
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.ui.searchPlaceholder}
            aria-label={t.ui.searchPlaceholder}
            className="h-10 max-w-xs"
          />
          {categories.length > 0 && (
            <FilterBar
              label={t.ui.filterBy}
              active={category}
              onChange={setCategory}
              options={[
                { id: ALL, label: t.ui.allTopics },
                ...categories.map((c) => ({ id: c, label: c })),
              ]}
            />
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.ui.contentPending}</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {articles.length === 0
              ? locale === "ar"
                ? "لا توجد مقالات منشورة بعد."
                : "No published articles yet."
              : t.ui.noMatches}
          </p>
        ) : (
          <div className="space-y-4">
            <ImageCatalog
              items={visible.map((article) => {
                const data = article.data as unknown as ArticleData;
                const meta: { label: string; value: string }[] = [];
                if (data.category)
                  meta.push({
                    label: locale === "ar" ? "التصنيف" : "Category",
                    value: data.category,
                  });
                if (article.publishedAt)
                  meta.push({
                    label: locale === "ar" ? "التاريخ" : "Date",
                    value: new Date(article.publishedAt).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-GB",
                    ),
                  });
                if (data.tags?.length)
                  meta.push({
                    label: locale === "ar" ? "الوسوم" : "Tags",
                    value: data.tags.join(" · "),
                  });
                return {
                  id: article.id,
                  src: data.coverImageUrl ?? "",
                  title: pick(data.title, locale),
                  caption: pick(data.excerpt, locale),
                  meta,
                  linkUrl: `/${locale}/blog/${article.slug}`,
                  linkLabel: locale === "ar" ? "اقرأ المقال" : "Read article",
                  linkExternal: false,
                };
              })}
              rtl={locale === "ar"}
              labels={{
                previous: locale === "ar" ? "السابق" : "Previous",
                next: locale === "ar" ? "التالي" : "Next",
                close: locale === "ar" ? "إغلاق" : "Close",
                expand: locale === "ar" ? "تكبير" : "Expand",
              }}
              onIndexChange={setPage}
            />
            <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {String(Math.min(page + 1, visible.length)).padStart(2, "0")} /{" "}
              {String(visible.length).padStart(2, "0")}
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
