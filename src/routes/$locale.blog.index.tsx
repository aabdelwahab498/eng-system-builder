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
      title: isAr
        ? "المدونة — أحمد عبد الوهاب"
        : "Writing — Ahmed Abdelwahab",
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
      <Breadcrumbs trail={[{ name: t.ui.home, path: "" }, { name: t.ui.writing, path: "/blog" }]} />
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
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((article, index) => {
              const data = article.data as unknown as ArticleData;
              const title = pick(data.title, locale);
              return (
                <Reveal key={article.id} delay={index * 60}>
                  <Link
                    to="/$locale/blog/$slug"
                    params={{ locale, slug: article.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/40 transition-colors hover:border-primary/60"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                      {data.coverImageUrl ? (
                        <img
                          src={data.coverImageUrl}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/20 via-background to-background" />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                      {data.category ? (
                        <span className="absolute bottom-3 left-3 rounded border border-border/70 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground backdrop-blur">
                          {data.category}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(
                              locale === "ar" ? "ar-EG" : "en-GB",
                            )
                          : locale === "ar"
                            ? "مقال"
                            : "Article"}
                      </p>
                      <h2 className="mt-2 font-display text-lg font-semibold text-foreground">
                        {title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {pick(data.excerpt, locale)}
                      </p>
                    </div>
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
