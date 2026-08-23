import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
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

function pick(value: { en: string; ar: string | null } | undefined, locale: Locale) {
  if (!value) return "";
  return locale === "ar" && value.ar ? value.ar : value.en;
}

function BlogIndex() {
  const { locale, t } = useLocale();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["public", "articles"],
    queryFn: () => listPublicArticles(),
  });

  return (
    <>
      <PageHeader
        eyebrow={locale === "ar" ? "المدونة" : "Writing"}
        title={locale === "ar" ? "مقالات وملاحظات" : "Articles & engineering notes"}
        subtitle={
          locale === "ar"
            ? "ملاحظات عن الأنظمة التي أبنيها وكيف تُبنى."
            : "Notes on the systems I build and how they are built."
        }
      />
      <Section>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.ui.contentPending}</p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {locale === "ar" ? "لا توجد مقالات منشورة بعد." : "No published articles yet."}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article, index) => {
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
