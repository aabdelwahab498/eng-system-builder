import { useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { getServiceOfferings } from "@/content/api";
import { pickOrEn } from "@/content/schema";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

/**
 * Compact live search that lets homepage visitors jump straight to a service
 * (and its request form) without browsing the services index first.
 */
export function ServiceQuickSearch({ className }: { className?: string }) {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const offerings = useMemo(() => getServiceOfferings(), []);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return offerings
      .filter(
        (s) =>
          pickOrEn(s.title, locale).toLowerCase().includes(q) ||
          pickOrEn(s.description, locale).toLowerCase().includes(q) ||
          pickOrEn(s.deliverables, locale).some((d) => d.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [q, offerings, locale]);

  const copy =
    locale === "ar"
      ? {
          label: "بحث سريع عن الخدمة",
          hint: "اكتب اسم الخدمة أو الكلمة المفتاحية…",
          none: "لا توجد نتائج مطابقة",
        }
      : {
          label: "Quick service search",
          hint: "Type a service name or keyword…",
          none: "No matching services",
        };

  const pick = (id: string) => {
    setQuery("");
    setFocused(false);
    void navigate({ to: "/$locale/services", params: { locale }, search: { service: id } });
  };

  const showList = focused && q.length > 0;

  return (
    <div className={cn("relative mx-auto max-w-xl", className)}>
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
            results.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(s.id);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm transition-colors hover:bg-primary/10"
                >
                  <span className="text-foreground">{pickOrEn(s.title, locale)}</span>
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
