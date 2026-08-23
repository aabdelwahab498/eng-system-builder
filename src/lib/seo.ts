import { getContent } from "@/content";
import type { Locale } from "@/types/content";

/**
 * Build per-route head metadata with hreflang alternates.
 * `path` is the locale-less path, e.g. "" | "/projects" | "/projects/najmah".
 */
export function buildHead({
  locale,
  path,
  title,
  description,
  ogType = "website",
  jsonLd,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}) {
  const url = `/${locale}${path}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:locale", content: locale === "ar" ? "ar_EG" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en", href: `/en${path}` },
      { rel: "alternate", hrefLang: "ar", href: `/ar${path}` },
      { rel: "alternate", hrefLang: "x-default", href: `/en${path}` },
    ],
    ...(jsonLd
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] }
      : {}),
  };
}

export function metaFor(locale: Locale, key: string) {
  const t = getContent(locale);
  return t.meta[key] ?? { title: t.profile.displayName, description: t.profile.statement };
}
