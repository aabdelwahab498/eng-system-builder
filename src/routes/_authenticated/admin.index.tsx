import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminOverview, adminSeedContent } from "@/lib/cms/admin.functions";
import { buildSeedItems } from "@/lib/cms/seed";
import { KIND_LABELS, CONTENT_KINDS, type ContentKind } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const overview = useServerFn(adminOverview);
  const seed = useServerFn(adminSeedContent);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => overview(),
  });

  const seedMutation = useMutation({
    mutationFn: () => seed({ data: { items: buildSeedItems() } }),
    onSuccess: (result) => {
      toast.success(`Imported ${result.imported} canonical entries`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Import failed"),
  });

  const byKind = data?.byKind ?? {};
  const totals = Object.values(byKind).reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      published: acc.published + item.published,
      draft: acc.draft + item.draft,
    }),
    { total: 0, published: 0, draft: 0 },
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Content studio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Every entity below is the same canonical model the public site, the CV and LinkedIn
            exports read from. Nothing is duplicated.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => seedMutation.mutate()}
          disabled={seedMutation.isPending}
        >
          {seedMutation.isPending ? "Importing…" : "Import from canonical files"}
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total projects", value: byKind.project?.total ?? 0 },
          { label: "Published projects", value: byKind.project?.published ?? 0 },
          { label: "Published articles", value: byKind.article?.published ?? 0 },
          { label: "Active services", value: byKind.service?.published ?? 0 },
          { label: "Gallery items", value: byKind.gallery_item?.total ?? 0 },
          { label: "Pending requests", value: business?.requests ?? 0 },
          { label: "Pending payments", value: business?.payments ?? 0 },
          { label: "Clients / subscribers", value: `${business?.clients ?? 0} / ${business?.subscribers ?? 0}` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface/50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        Content KPIs come from the live content store · {totals.total} entries, {totals.published}{" "}
        published, {totals.draft} in progress. Business KPIs are local to this browser until a
        backend is connected.
      </p>

      <section className="grid gap-3 lg:grid-cols-3">
        {[
          { title: "Recent service requests", href: "/admin/requests", rows: recent.requests },
          { title: "Recent payment submissions", href: "/admin/payments", rows: recent.payments },
          { title: "Recent admin activity", href: "/admin/activity", rows: recent.activity },
        ].map((panel) => (
          <div key={panel.title} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-foreground">{panel.title}</h2>
              <Link to={panel.href} className="text-xs text-muted-foreground hover:text-foreground">
                Open
              </Link>
            </div>
            {panel.rows.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">Nothing yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {panel.rows.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-foreground">{row.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{row.meta}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>


      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Collections
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CONTENT_KINDS.map((kind: ContentKind) => {
            const stat = byKind[kind] ?? { total: 0, published: 0, draft: 0 };
            return (
              <Link
                key={kind}
                to="/admin/content/$kind"
                params={{ kind }}
                className="rounded-lg border border-border p-4 transition-colors hover:border-primary/60"
              >
                <p className="text-sm font-medium text-foreground">{KIND_LABELS[kind]}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {stat.total} entries · {stat.published} live · {stat.draft} in progress
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recently updated
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (data?.recent ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing yet. Import the canonical files to get started.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {(data?.recent ?? []).map((row) => (
              <li key={`${row.kind}-${row.slug}`} className="flex items-center justify-between px-4 py-2.5">
                <span className="truncate text-sm text-foreground">{row.slug}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {KIND_LABELS[row.kind]} · {row.state}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
