import { useRouterState } from "@tanstack/react-router";
import { getContent } from "@/content";
import { isLocale, type Dictionary, type Locale } from "@/types/content";

export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : "en";
}

export function useLocale(): { locale: Locale; t: Dictionary } {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPathname(pathname);
  return { locale, t: getContent(locale) };
}
