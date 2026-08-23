import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminDeleteContent,
  adminListContent,
  adminSetState,
} from "@/lib/cms/admin.functions";
import { KIND_LABELS, WORKFLOW_STATES, type ContentKind } from "@/lib/cms/types";
import { StateBadge } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/content/$kind/")({
  component: KindList,
});

function titleOf(data: Record<string, unknown>, fallback: string): string {
  const candidates = ["title", "name", "role", "degree", "label", "displayName", "path"];
  for (const key of candidates) {
    const value = data[key];
    if (typeof value === "string" && value) return value;
    if (value && typeof value === "object" && "en" in (value as Record<string, unknown>)) {
      const en = (value as { en?: unknown }).en;
      if (typeof en === "string" && en) return en;
    }
  }
  return fallback;
}

function KindList() {
  const { kind } = Route.useParams();
  const contentKind = kind as ContentKind;
  const queryClient = useQueryClient();
  const list = useServerFn(adminListContent);
  const setState = useServerFn(adminSetState);
  const remove = useServerFn(adminDeleteContent);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "content", contentKind],
    queryFn: () => list({ data: { kind: contentKind } }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  const stateMutation = useMutation({
    mutationFn: (vars: { id: string; state: string }) => setState({ data: vars }),
    onSuccess: () => {
      toast.success("Workflow updated");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Entry deleted");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{KIND_LABELS[contentKind]}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </h1>
        </div>
        <Button asChild>
          <Link to="/admin/content/$kind/$id" params={{ kind: contentKind, id: "new" }}>
            New entry
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No entries yet. Create one, or import the canonical files from the dashboard.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  to="/admin/content/$kind/$id"
                  params={{ kind: contentKind, id: item.id }}
                  className="block truncate text-sm font-medium text-foreground hover:text-primary"
                >
                  {titleOf(item.data, item.slug)}
                </Link>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  /{item.slug}
                  {item.visibility.public ? " · public" : " · hidden"}
                  {item.featured ? " · featured" : ""}
                </p>
              </div>
              <StateBadge state={item.state} />
              <Select
                value={item.state}
                onValueChange={(value) => stateMutation.mutate({ id: item.id, state: value })}
              >
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="text-xs">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  if (confirm(`Delete "${item.slug}"? This cannot be undone.`)) {
                    deleteMutation.mutate(item.id);
                  }
                }}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
