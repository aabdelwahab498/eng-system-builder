import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListContent } from "@/lib/cms/admin.functions";
import { KIND_LABELS, type ContentKind } from "@/lib/cms/types";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/admin/localization")({
  component: LocalizationPage,
});

const KINDS: ContentKind[] = [
  "profile",
  "experience",
  "education",
  "skill_group",
  "project",
  "service",
  "article",
  "gallery_item",
  "announcement",
  "seo",
];

/** Counts localized pairs and how many carry a non-empty Arabic value. */
function countLocalized(value: unknown, acc = { total: 0, translated: 0 }) {
  if (Array.isArray(value)) {
    for (const entry of value) countLocalized(entry, acc);
    return acc;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("en" in record && "ar" in record) {
      acc.total += 1;
      if (typeof record['ar'] === "string" && record['ar'].trim()) acc.translated += 1;
      return acc;
    }
    for (const entry of Object.values(record)) countLocalized(entry, acc);
  }
  return acc;
}

function LocalizationPage() {
  const list = useServerFn(adminListContent);
  const results = useQueries({
    queries: KINDS.map((kind) => ({
      queryKey: ["admin", "content", kind],
      queryFn: () => list({ data: { kind } }),
    })),
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">System</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Localization</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          English is authored first; Arabic coverage is tracked per collection. Arabic pages render
          RTL on the public site.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {KINDS.map((kind, index) => {
          const items = results[index]?.data ?? [];
          const stats = items.reduce(
            (acc, item) => {
              const c = countLocalized(item.data);
              return { total: acc.total + c.total, translated: acc.translated + c.translated };
            },
            { total: 0, translated: 0 },
          );
          const pct = stats.total ? Math.round((stats.translated / stats.total) * 100) : 0;
          return (
            <Link
              key={kind}
              to="/admin/content/$kind"
              params={{ kind }}
              className="rounded-lg border border-border bg-surface/50 p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{KIND_LABELS[kind]}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {stats.translated}/{stats.total} · {pct}%
                </p>
              </div>
              <Progress value={pct} className="mt-3 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {results[index]?.isLoading
                  ? "Loading…"
                  : stats.total === 0
                    ? "No localized fields yet"
                    : `${items.length} entries`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
