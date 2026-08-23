import { getContent, site } from "@/content";
import type { Locale, MetaKey } from "@/types/content";

const origin = site.domain.replace(/\/$/, "");

export function absoluteUrl(path: string) {
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

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
  image,
  jsonLd,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogType?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}) {
  const url = absoluteUrl(`/${locale}${path}`);
  const graphs = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const absoluteImage = image?.startsWith("http") ? image : undefined;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "nextnext-gen.com" },
      { property: "og:locale", content: locale === "ar" ? "ar_EG" : "en_US" },
      { property: "og:locale:alternate", content: locale === "ar" ? "en_US" : "ar_EG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(absoluteImage
        ? [
            { property: "og:image", content: absoluteImage },
            { name: "twitter:image", content: absoluteImage },
          ]
        : []),
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/en${path}`) },
      { rel: "alternate", hrefLang: "ar", href: absoluteUrl(`/ar${path}`) },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/en${path}`) },
    ],
    ...(graphs.length
      ? {
          scripts: graphs.map((g) => ({
            type: "application/ld+json",
            children: JSON.stringify(g),
          })),
        }
      : {}),
  };
}

/** BreadcrumbList JSON-LD for deep routes. */
export function breadcrumbs(
  locale: Locale,
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(`/${locale}${item.path}`),
    })),
  };
}

export function metaFor(locale: Locale, key: MetaKey) {
  return getContent(locale).meta[key];
}
