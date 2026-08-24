import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import {
  ADMIN_WHATSAPP,
  REQUEST_STATUSES,
  activityLog,
  serviceRequests,
  type ServiceRequest,
  type ServiceRequestStatus,
} from "@/lib/admin/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export const Route = createFileRoute("/_authenticated/admin/requests")({
  component: RequestsPage,
});

const EMPTY = {
  name: "",
  email: "",
  whatsapp: "",
  service: "",
  description: "",
  budget: "",
  timeline: "",
  status: "new" as ServiceRequestStatus,
  note: "",
};

function RequestsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [pendingDelete, setPendingDelete] = useState<ServiceRequest | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: () => serviceRequests.list(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "requests"] });
    qc.invalidateQueries({ queryKey: ["admin", "local-counts"] });
    qc.invalidateQueries({ queryKey: ["admin", "activity"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      await serviceRequests.create(draft);
      await activityLog.record({
        action: "Service request created",
        entity: draft.name || "Request",
        actor: "Admin",
        status: "success",
      });
    },
    onSuccess: () => {
      toast.success("Request added");
      setDraft(EMPTY);
      setOpen(false);
      invalidate();
    },
  });

  const patch = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: Partial<ServiceRequest> }) => {
      await serviceRequests.update(id, value);
      await activityLog.record({
        action: "Service request updated",
        entity: id,
        actor: "Admin",
        status: "info",
      });
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await serviceRequests.remove(id);
      await activityLog.record({
        action: "Service request deleted",
        entity: id,
        actor: "Admin",
        status: "warning",
      });
    },
    onSuccess: () => {
      toast.success("Request deleted");
      setPendingDelete(null);
      invalidate();
    },
  });

  const rows = data.filter((r) => {
    const matchesSearch = `${r.name} ${r.email} ${r.service}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && (statusFilter === "all" || r.status === statusFilter);
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Business</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Service requests
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Lead pipeline for incoming project enquiries. Stored locally in this browser for now —
            no backend persistence yet.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New service request</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {([
                ["name", "Client name"],
                ["email", "Email"],
                ["whatsapp", "WhatsApp"],
                ["service", "Requested service"],
                ["budget", "Budget"],
                ["timeline", "Preferred timeline"],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label htmlFor="description">Project description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => create.mutate()} disabled={!draft.name || create.isPending}>
                Save request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name, email, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {REQUEST_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No service requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-surface/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.email} · {r.whatsapp} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.service} {r.budget && `· ${r.budget}`} {r.timeline && `· ${r.timeline}`}
                  </p>
                  {r.description && (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{r.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={r.status}
                    onValueChange={(value) =>
                      patch.mutate({ id: r.id, value: { status: value as ServiceRequestStatus } })
                    }
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={ADMIN_WHATSAPP} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete request"
                    onClick={() => setPendingDelete(r)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                className="mt-3"
                rows={2}
                placeholder="Internal note…"
                defaultValue={r.note}
                onBlur={(e) => patch.mutate({ id: r.id, value: { note: e.target.value } })}
              />
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service request?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be removed from the pipeline. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDelete && remove.mutate(pendingDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
