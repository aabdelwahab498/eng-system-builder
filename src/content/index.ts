import type { Dictionary, Locale } from "@/types/content";
import { en } from "./en";
import { ar } from "./ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const getContent = (locale: Locale): Dictionary => dictionaries[locale];

export const site = {
  domain: "https://nextnext-gen.com",
  ecosystem: {
    factoryApi: "https://factory-api.nextnext-gen.com",
  },
} as const;

/** Build a locale-prefixed path: localePath("en", "/projects") -> "/en/projects" */
export const localePath = (locale: Locale, path = "") =>
  `/${locale}${path === "/" ? "" : path}`;
