import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowDown, ArrowUp, Copy } from "lucide-react";
import {
  adminDeleteContent,
  adminListContent,
  adminReorder,
  adminSaveContent,
  adminSetState,
} from "@/lib/cms/admin.functions";
import { KIND_LABELS, WORKFLOW_STATES, type ContentKind } from "@/lib/cms/types";
import { StateBadge } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const reorder = useServerFn(adminReorder);
  const save = useServerFn(adminSaveContent);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; slug: string } | null>(null);

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

  const duplicateMutation = useMutation({
    mutationFn: (item: (typeof items)[number]) =>
      save({
        data: {
          kind: contentKind,
          slug: `${item.slug}-copy`,
          state: "draft",
          visibility: { ...item.visibility, public: false },
          featured: false,
          sortOrder: item.sortOrder + 1,
          data: item.data,
          scheduledAt: null,
        },
      }),
    onSuccess: () => {
      toast.success("Duplicated as draft");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Duplicate failed"),
  });

  const reorderMutation = useMutation({
    mutationFn: (payload: { items: { id: string; sortOrder: number }[] }) => reorder({ data: payload }),
    onSuccess: invalidate,
    onError: (error) => toast.error(error instanceof Error ? error.message : "Reorder failed"),
  });

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index]!;
    const b = items[target]!;
    reorderMutation.mutate({
      items: [
        { id: a.id, sortOrder: b.sortOrder },
        { id: b.id, sortOrder: a.sortOrder },
      ],
    });
  }

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
          {items.map((item, index) => (
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
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Move up"
                  disabled={index === 0 || reorderMutation.isPending}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Move down"
                  disabled={index === items.length - 1 || reorderMutation.isPending}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Duplicate entry"
                  disabled={duplicateMutation.isPending}
                  onClick={() => duplicateMutation.mutate(item)}
                >
                  <Copy className="size-4" />
                </Button>
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
              <DistributePanel
                compact
                entryId={item.id}
                kind={contentKind}
                title={titleOf(item.data, item.slug)}
                link={`https://nextnext-gen.com/en/${contentKind === "article" ? "blog" : contentKind === "project" ? "projects" : "gallery"}/${item.slug}`}
                mediaType={typeof item.data["mediaType"] === "string" ? (item.data["mediaType"] as string) : undefined}
                mediaUrl={typeof item.data["mediaUrl"] === "string" ? (item.data["mediaUrl"] as string) : undefined}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setPendingDelete({ id: item.id, slug: item.slug })}
              >
                Delete
              </Button>

            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.slug}” will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
