import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PaymentSubmission, PaymentSubmissionStatus } from "@/content/canonical/commerce";
import { getPaymentMethods, getServiceOffering } from "@/content/api";
import { STATUS_LABELS, paymentSubmissions } from "@/lib/payments/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  head: () => ({
    meta: [{ title: "Studio — Payments" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPayments,
});

const ACTIONS: { status: PaymentSubmissionStatus; label: string }[] = [
  { status: "approved", label: "Approve" },
  { status: "rejected", label: "Reject" },
  { status: "needs_more_information", label: "Request info" },
];

function AdminPayments() {
  const [items, setItems] = useState<PaymentSubmission[]>([]);
  const methods = getPaymentMethods();

  const refresh = () => paymentSubmissions.list().then(setItems);
  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id: string, status: PaymentSubmissionStatus) {
    await paymentSubmissions.setStatus(id, status);
    refresh();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Payments</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">Payment submissions</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manual payment proofs submitted by clients. Nothing here is connected to a banking system — approval is a
          human decision recorded locally in this V1 frontend, ready to be swapped for a backend repository.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-md border border-border bg-surface/60 p-6 text-sm text-muted-foreground">
          No payment submissions yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[900px] text-sm">
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
              {items.map((s) => {
                const service = getServiceOffering(s.serviceId);
                const method = methods.find((m) => m.id === s.methodId);
                return (
                  <tr key={s.id} className="border-t border-border align-top">
                    <td className="px-3 py-3">
                      <p className="text-foreground">{s.clientName || "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                      <p dir="ltr" className="text-xs text-muted-foreground">{s.whatsapp}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-foreground">{service?.title.en ?? s.serviceId ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.projectName}</p>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-foreground">
                      {s.amount || "—"} {s.currency}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{method?.name.en ?? s.methodId}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(s.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      <p className="max-w-40 truncate text-foreground">{s.proofFilename}</p>
                      {s.proofType} · {Math.round(s.proofSizeBytes / 1024)} KB
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-sm border px-2 py-1 font-mono text-[10px]",
                          s.status === "approved" && "border-primary/50 text-primary",
                          s.status === "rejected" && "border-destructive/50 text-destructive",
                          s.status === "pending_review" && "border-border text-muted-foreground",
                          s.status === "needs_more_information" && "border-border-strong text-foreground",
                        )}
                      >
                        {STATUS_LABELS[s.status].en}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {ACTIONS.map((a) => (
                          <Button
                            key={a.status}
                            size="sm"
                            variant="outline"
                            onClick={() => setStatus(s.id, a.status)}
                            disabled={s.status === a.status}
                          >
                            {a.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
