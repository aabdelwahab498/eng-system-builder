import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FilterBar } from "@/components/site/FilterBar";
import { Input } from "@/components/ui/input";
import { listPublicArticles } from "@/lib/cms/public.functions";
import { useLocale } from "@/hooks/useLocale";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/types/content";
import type { ArticleData } from "@/lib/cms/types";

export const Route = createFileRoute("/$locale/blog/")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const isAr = locale === "ar";
    return buildHead({
      locale,
      path: "/blog",
      title: isAr
        ? "المدونة — أحمد عبد الوهاب"
        : "Writing — Ahmed Abdelwahab",
      description: isAr
        ? "مقالات عن هندسة البرمجيات، أنظمة الذكاء الاصطناعي وبناء المنتجات الرقمية."
        : "Notes on software engineering, AI systems and building production digital products.",
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
      const haystack = [
        pick(data.title, locale),
        pick(data.excerpt, locale),
        ...(data.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, category, query, locale]);

  return (
    <>
      <PageHeader
        eyebrow={t.ui.writing}
        title={locale === "ar" ? "مقالات وملاحظات" : "Articles & engineering notes"}
        subtitle={
          locale === "ar"
            ? "ملاحظات عن الأنظمة التي أبنيها وكيف تُبنى."
            : "Notes on the systems I build and how they are built."
        }
      />
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
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((article, index) => {
              const data = article.data as unknown as ArticleData;
              return (
                <Reveal key={article.id} delay={index * 60}>
                  <Link
                    to="/$locale/blog/$slug"
                    params={{ locale, slug: article.slug }}
                    className="block h-full rounded-lg border border-border p-5 transition-colors hover:border-primary/60"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {data.category || (locale === "ar" ? "مقال" : "Article")}
                      {article.publishedAt
                        ? ` · ${new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}`
                        : ""}
                    </p>
                    <h2 className="mt-3 font-display text-lg font-semibold text-foreground">
                      {pick(data.title, locale)}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">{pick(data.excerpt, locale)}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
