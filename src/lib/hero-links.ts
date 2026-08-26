import type { Locale } from "@/types/content";

/**
 * Configurable destinations for the homepage hero CTAs.
 * Internal entries are locale-prefixed at render time; external entries
 * are absolute URLs and open in a new tab.
 */
export type HeroLink =
  | { id: string; kind: "internal"; path: string; variant: HeroVariant }
  | { id: string; kind: "external"; url: string; variant: HeroVariant };

type HeroVariant = "default" | "outline" | "ghost";

export const heroLinks: HeroLink[] = [
  { id: "viewWork", kind: "internal", path: "/gallery", variant: "default" },
  { id: "letsBuild", kind: "internal", path: "/contact", variant: "outline" },
  { id: "seeCertificates", kind: "internal", path: "/certificates", variant: "ghost" },
  { id: "cv", kind: "internal", path: "/cv", variant: "ghost" },
];

/** Resolve a hero link to a concrete href for the active locale. */
export function heroHref(link: HeroLink, locale: Locale): string {
  if (link.kind === "external") return link.url;
  return `/${locale}${link.path === "/" ? "" : link.path}`;
}
