import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Markdown } from "@/lib/cms/markdown";
import { getPublicArticle } from "@/lib/cms/public.functions";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/types/content";
import type { ArticleData } from "@/lib/cms/types";

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: async ({ params }) => {
    const article = await getPublicArticle({ data: { slug: params.slug } });
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    const locale = params.locale as Locale;
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
      };
    }
    const data = loaderData.article.data as unknown as ArticleData;
    const pick = (value: { en: string; ar: string | null } | undefined) =>
      value ? (locale === "ar" && value.ar ? value.ar : value.en) : "";
    const title = pick(data.seoTitle) || pick(data.title);
    const description = pick(data.seoDescription) || pick(data.excerpt);
    return buildHead({
      locale,
      path: `/blog/${loaderData.article.slug}`,
      title,
      description,
      ogType: "article",
      ...(data.coverImageUrl ? { image: data.coverImageUrl } : {}),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        inLanguage: locale,
        datePublished: loaderData.article.publishedAt,
        dateModified: loaderData.article.updatedAt,
        author: { "@type": "Person", name: "Ahmed Abdelwahab" },
        ...(data.coverImageUrl
          ? {
              image: [
                data.coverImageUrl.startsWith("http")
                  ? data.coverImageUrl
                  : absoluteUrl(data.coverImageUrl),
              ],
            }
          : {}),
      },
    });
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <Section>
      <p className="text-sm text-muted-foreground">This article is not available.</p>
    </Section>
  ),
  errorComponent: () => (
    <Section>
      <p className="text-sm text-muted-foreground">This article could not be loaded.</p>
    </Section>
  ),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const { locale } = Route.useParams();
  const isAr = locale === "ar";
  const data = article.data as unknown as ArticleData;
  const pick = (value: { en: string; ar: string | null } | undefined) =>
    value ? (isAr && value.ar ? value.ar : value.en) : "";

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-6">
      <Link
        to="/$locale/blog"
        params={{ locale: locale as Locale }}
        className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        ← {isAr ? "المدونات" : "Blogs"}
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-foreground">
        {pick(data.title)}
      </h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {data.category}
        {article.publishedAt
          ? ` · ${new Date(article.publishedAt).toLocaleDateString(isAr ? "ar-EG" : "en-GB")}`
          : ""}
      </p>
      {data.coverImageUrl ? (
        <figure className="mt-8 overflow-hidden rounded-xl border border-border">
          <div className="aspect-[16/9] w-full bg-muted">
            <img
              src={data.coverImageUrl}
              alt={pick(data.title)}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      ) : null}
      <div className="mt-8">
        <Markdown source={pick(data.body)} />
      </div>
      {data.tags?.length ? (
        <ul className="mt-10 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <li
              key={tag}
              className="rounded border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
