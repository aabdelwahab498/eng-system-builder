import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { getPaymentMethods } from "@/content/api";
import {
  PAYMENT_STATUS_OPTIONS,
  adminDeletePaymentSubmission,
  adminListPaymentSubmissions,
  adminUpdatePaymentSubmission,
} from "@/lib/payments/payments.functions";
import { ProofViewer } from "@/components/admin/ProofViewer";
import { GatewayOverview, type GatewayStats } from "@/components/admin/GatewayOverview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  head: () => ({
    meta: [{ title: "Studio — Payments" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPayments,
});

const STATUS_TONE: Record<string, string> = {
  approved: "border-emerald-500/50 text-emerald-500",
  rejected: "border-destructive/50 text-destructive",
  pending_review: "border-amber-500/50 text-amber-500",
  needs_more_information: "border-border-strong text-foreground",
};

const statusLabel = (value: string) =>
  PAYMENT_STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value.replace(/_/g, " ");

function AdminPayments() {
  const qc = useQueryClient();
  const list = useServerFn(adminListPaymentSubmissions);
  const update = useServerFn(adminUpdatePaymentSubmission);
  const destroy = useServerFn(adminDeletePaymentSubmission);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "payment-submissions"],
    queryFn: () => list(),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "payment-submissions"] });

  const patch = useMutation({
    mutationFn: (input: { id: string; status?: string; note?: string }) => update({ data: input }),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => destroy({ data: { id } }),
    onSuccess: () => {
      toast.success("Submission deleted");
      setPendingDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const methods = getPaymentMethods();
  const rows = data.filter((s) => {
    const haystack =
      `${s.client_name} ${s.email ?? ""} ${s.service_title ?? ""} ${s.project_name ?? ""} ${s.method_id ?? ""}`.toLowerCase();
    return (
      haystack.includes(search.toLowerCase()) &&
      (statusFilter === "all" || s.status === statusFilter)
    );
  });

  const pendingCount = data.filter((s) => s.status === "pending_review").length;

  const gatewayStats: GatewayStats = {};
  for (const s of data) {
    const key = s.method_id ?? "unknown";
    const entry = gatewayStats[key] ?? { count: 0, pending: 0 };
    entry.count += 1;
    if (s.status === "pending_review") entry.pending += 1;
    gatewayStats[key] = entry;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Payments</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">Payment submissions</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manual payment proofs submitted by clients (InstaPay, Vodafone Cash, bank transfer).
          Review the proof image, then approve or reject. {pendingCount} pending · {data.length} total.
        </p>
      </header>

      <GatewayOverview stats={gatewayStats} />

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search client, service, method…"
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
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load submissions"}
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-md border border-border bg-surface/60 p-6 text-sm text-muted-foreground">
          No payment submissions yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-surface/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Client", "Service", "Amount", "Method", "Submitted", "Proof", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const method = methods.find((m) => m.id === s.method_id);
                return (
                  <tr key={s.id} className="border-t border-border align-top">
                    <td className="px-3 py-3">
                      <p className="text-foreground">{s.client_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                      <p dir="ltr" className="text-xs text-muted-foreground">{s.whatsapp}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-foreground">{s.service_title ?? s.service_id ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.project_name}</p>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-foreground">
                      {s.amount || "—"} {s.currency}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{method?.name.en ?? s.method_id ?? "—"}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      {s.proof_path ? (
                        <div className="space-y-1">
                          <ProofViewer path={s.proof_path} compact />
                          <p className="max-w-40 truncate text-xs text-muted-foreground">
                            {s.proof_filename}
                            {s.proof_size_bytes ? ` · ${Math.round(s.proof_size_bytes / 1024)} KB` : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No file</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-sm border px-2 py-1 font-mono text-[10px]",
                          STATUS_TONE[s.status] ?? "border-border text-muted-foreground",
                        )}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Select
                          value={s.status}
                          onValueChange={(value) => patch.mutate({ id: s.id, status: value })}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete submission"
                          onClick={() => setPendingDelete(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this payment submission?</AlertDialogTitle>
            <AlertDialogDescription>
              The record and its uploaded proof file will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && remove.mutate(pendingDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
