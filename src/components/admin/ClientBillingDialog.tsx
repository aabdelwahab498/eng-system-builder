import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, FileText, Pause, Play, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { Client } from "@/lib/admin/crm";
import { CURRENCIES } from "@/lib/admin/crm";
import {
  PAYMENT_RECORD_STATUSES,
  downloadCsv,
  invoiceAvailable,
  money,
  openInvoicePdf,
  pauseSubscription,
  paymentRecords,
  paymentStateLabel,
  paymentsToCsv,
  planLabel,
  renewSubscription,
  resumeSubscription,
  type PaymentRecord,
  type PaymentRecordStatus,
} from "@/lib/admin/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Action = "renew" | "pause" | "resume";

const ACTION_COPY: Record<Action, { title: string; body: string }> = {
  renew: {
    title: "Renew this subscription?",
    body: "A paid payment entry will be recorded today and the next renewal date will move forward by one billing period.",
  },
  pause: {
    title: "Pause this subscription?",
    body: "The subscription will be marked paused. No renewal will be recorded until you resume it.",
  },
  resume: {
    title: "Resume this subscription?",
    body: "The subscription goes back to active. The renewal date stays as it is.",
  },
};

const today = () => new Date().toISOString().slice(0, 10);

/** Invoice + payment ledger + subscription lifecycle for a single client. */
export function ClientBillingDialog({
  client,
  open,
  onOpenChange,
}: {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({
    amount: "",
    currency: "EGP",
    method: "",
    status: "paid" as PaymentRecordStatus,
    invoiceRef: "",
    note: "",
    paidAt: today(),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["admin", "payments", client?.id],
    queryFn: () => paymentRecords.listByClient(client!.id),
    enabled: Boolean(client && open),
  });

  if (!client) return null;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "payments", client.id] });
    qc.invalidateQueries({ queryKey: ["admin", "clients"] });
    qc.invalidateQueries({ queryKey: ["admin", "activity"] });
  };

  const subState = client.subscriptionState ?? "active";

  async function runAction(action: Action) {
    setBusy(true);
    try {
      if (action === "renew") await renewSubscription(client!);
      if (action === "pause") await pauseSubscription(client!);
      if (action === "resume") await resumeSubscription(client!);
      toast.success(
        action === "renew"
          ? "Subscription renewed"
          : action === "pause"
            ? "Subscription paused"
            : "Subscription resumed",
      );
      refresh();
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  async function addPayment() {
    if (!draft.amount) return;
    await paymentRecords.create({ ...draft, clientId: client!.id });
    setDraft({ ...draft, amount: "", note: "", invoiceRef: "" });
    toast.success("Payment recorded");
    refresh();
  }

  const rows: { label: string; value: string }[] = [
    { label: "Invoice reference", value: client.invoiceRef || "—" },
    { label: "Plan", value: planLabel(client.plan) },
    { label: "Subscription", value: subState },
    { label: "Agreed amount", value: money(client.amount, client.currency) },
    { label: "Paid so far", value: money(client.paidAmount, client.currency) },
    { label: "Payment status", value: paymentStateLabel(client.paymentState) },
    { label: "Payment method", value: client.paymentMethod || "—" },
    { label: "Last payment", value: client.lastPaymentAt || "—" },
    { label: "Next renewal", value: client.nextRenewalAt || "—" },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{client.name} — billing</DialogTitle>
            <DialogDescription>
              Invoice summary, subscription period and payment history for this client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 rounded-lg border border-border p-4 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              disabled={!invoiceAvailable(client)}
              title={
                invoiceAvailable(client) ? undefined : "Add an invoice reference and amount first"
              }
              onClick={() => openInvoicePdf(client, payments)}
            >
              <FileText className="h-4 w-4" /> Download invoice PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              disabled={busy}
              onClick={() => setConfirm("renew")}
            >
              <RefreshCw className="h-4 w-4" /> Renew manually
            </Button>
            {subState === "paused" ? (
              <Button
                variant="outline"
                className="gap-2"
                disabled={busy}
                onClick={() => setConfirm("resume")}
              >
                <Play className="h-4 w-4" /> Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                className="gap-2"
                disabled={busy}
                onClick={() => setConfirm("pause")}
              >
                <Pause className="h-4 w-4" /> Pause
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2"
              disabled={payments.length === 0}
              onClick={() =>
                downloadCsv(
                  `payments-${client.name.replace(/\s+/g, "-").toLowerCase()}.csv`,
                  paymentsToCsv(payments, client.name),
                )
              }
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Record a payment
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pay-amount">Amount</Label>
                <Input
                  id="pay-amount"
                  inputMode="decimal"
                  value={draft.amount}
                  onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select
                  value={draft.currency}
                  onValueChange={(v) => setDraft({ ...draft, currency: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-date">Date</Label>
                <Input
                  id="pay-date"
                  type="date"
                  value={draft.paidAt}
                  onChange={(e) => setDraft({ ...draft, paidAt: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-method">Method</Label>
                <Input
                  id="pay-method"
                  placeholder="Instapay, Wise…"
                  value={draft.method}
                  onChange={(e) => setDraft({ ...draft, method: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(v) => setDraft({ ...draft, status: v as PaymentRecordStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_RECORD_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-invoice">Invoice ref</Label>
                <Input
                  id="pay-invoice"
                  value={draft.invoiceRef}
                  onChange={(e) => setDraft({ ...draft, invoiceRef: e.target.value })}
                />
              </div>
            </div>
            <Button className="gap-2" disabled={!draft.amount} onClick={addPayment}>
              <Plus className="h-4 w-4" /> Add payment
            </Button>
          </div>

          {payments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No payments recorded for this client yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: PaymentRecord) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs text-muted-foreground">{p.paidAt}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {money(p.amount, p.currency)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.method || "—"}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] uppercase text-muted-foreground">
                        {p.status}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.invoiceRef || "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete payment"
                          onClick={() => paymentRecords.remove(p.id).then(refresh)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirm)} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm ? ACTION_COPY[confirm].title : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm ? ACTION_COPY[confirm].body : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirm && runAction(confirm)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
