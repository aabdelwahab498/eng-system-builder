import { useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, GraduationCap, Search, X } from "lucide-react";
import { getCourses, getServiceOfferings } from "@/content/api";
import { listPublicByKind } from "@/lib/cms/public.functions";
import { pickOrEn } from "@/content/schema";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

type ResultKind = "service" | "course";

type SearchResult = {
  id: string;
  kind: ResultKind;
  title: string;
  /** Localized strings used for matching. */
  matchText: string;
};

/**
 * Compact live search that lets homepage visitors jump straight to a service
 * (and its request form) or a course without browsing the indexes first.
 */
export function ServiceQuickSearch({ className }: { className?: string }) {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const offerings = useMemo(() => getServiceOfferings(), []);
  const courseList = useMemo(() => getCourses(), []);
  const listByKind = useServerFn(listPublicByKind);
  const { data: cmsItems } = useQuery({
    queryKey: ["public", "courses"],
    queryFn: () => listByKind({ data: { kind: "course" } }),
  });
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = query.trim().toLowerCase();
  const results = useMemo<SearchResult[]>(() => {
    if (!q) return [];
    const fromServices: SearchResult[] = offerings
      .filter(
        (s) =>
          pickOrEn(s.title, locale).toLowerCase().includes(q) ||
          pickOrEn(s.description, locale).toLowerCase().includes(q) ||
          pickOrEn(s.deliverables, locale).some((d) => d.toLowerCase().includes(q)),
      )
      .map((s) => ({
        id: s.id,
        kind: "service" as const,
        title: pickOrEn(s.title, locale),
        matchText: [
          pickOrEn(s.title, locale),
          pickOrEn(s.description, locale),
          ...pickOrEn(s.deliverables, locale),
        ].join(" "),
      }));

    const fromCourses: SearchResult[] = courseList
      .filter(
        (c) =>
          pickOrEn(c.title, locale).toLowerCase().includes(q) ||
          pickOrEn(c.summary, locale).toLowerCase().includes(q) ||
          pickOrEn(c.description, locale).toLowerCase().includes(q) ||
          pickOrEn(c.keywords, locale).some((k) => k.toLowerCase().includes(q)),
      )
      .map((c) => ({
        id: c.id,
        kind: "course" as const,
        title: pickOrEn(c.title, locale),
        matchText: [
          pickOrEn(c.title, locale),
          pickOrEn(c.summary, locale),
          pickOrEn(c.description, locale),
          ...pickOrEn(c.keywords, locale),
        ].join(" "),
      }));

    // Admin-managed (CMS) courses use ids "cms:<slug>" — matching the ids the
    // courses page renders, so the dialog deep link resolves there too.
    const loc = (v: unknown): string => {
      const o = (v && typeof v === "object" ? v : {}) as { en?: unknown; ar?: unknown };
      const en = typeof o.en === "string" ? o.en : "";
      const ar = typeof o.ar === "string" ? o.ar : "";
      return (locale === "ar" && ar ? ar : en) || ar;
    };
    const fromCmsCourses: SearchResult[] = ((cmsItems ?? []) as { slug: string; data: Record<string, unknown> }[])
      .map((item) => {
        const title = loc(item.data["title"]);
        const summary = loc(item.data["summary"]);
        const description = loc(item.data["description"]);
        return {
          id: `cms:${item.slug}`,
          kind: "course" as const,
          title,
          matchText: [title, summary, description].join(" "),
        };
      })
      .filter((r) => r.title && r.matchText.toLowerCase().includes(q));

    return [...fromServices, ...fromCourses, ...fromCmsCourses].slice(0, 6);
  }, [q, offerings, courseList, cmsItems, locale]);

  const copy =
    locale === "ar"
      ? {
          label: "بحث سريع عن خدمة أو كورس",
          hint: "اكتب اسم الخدمة أو الكورس أو الكلمة المفتاحية…",
          none: "لا توجد نتائج مطابقة",
        }
      : {
          label: "Quick service or course search",
          hint: "Type a service or course name or keyword…",
          none: "No matching services or courses",
        };

  const pick = (result: SearchResult) => {
    setQuery("");
    setFocused(false);
    if (result.kind === "service") {
      void navigate({ to: "/$locale/services", params: { locale }, search: { service: result.id } });
    } else {
      void navigate({ to: "/$locale/courses", params: { locale }, search: { course: result.id } });
    }
  };

  const showList = focused && q.length > 0;

  return (
    <div className={cn("relative max-w-xl", className)}>
      <label className="block">
        <span className="sr-only">{copy.label}</span>
        <div className="relative">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (blurTimer.current) clearTimeout(blurTimer.current);
              setFocused(true);
            }}
            onBlur={() => {
              blurTimer.current = setTimeout(() => setFocused(false), 150);
            }}
            placeholder={copy.hint}
            aria-label={copy.label}
            className="digital-green w-full rounded-md border border-border bg-card/40 ps-10 pe-10 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </label>

      {showList && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-border bg-card/95 shadow-xl backdrop-blur">
          {results.length === 0 ? (
            <li className="px-4 py-3 font-mono text-sm text-muted-foreground">{copy.none}</li>
          ) : (
            results.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(r);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm transition-colors hover:bg-primary/10"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    {r.kind === "course" && (
                      <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden />
                    )}
                    {r.title}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-primary rtl:rotate-180" aria-hidden />
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
