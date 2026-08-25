import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Receipt, Trash2 } from "lucide-react";
import { SUBSCRIPTION_STATES } from "@/lib/admin/billing";
import { ClientBillingDialog } from "@/components/admin/ClientBillingDialog";

import {
  CLIENT_STATUSES,
  CURRENCIES,
  PAYMENT_STATES,
  SUBSCRIPTION_PLANS,
  activityLog,
  clients,
  subscribers,
  type Client,
  type ClientStatus,
  type PaymentState,
  type SubscriptionPlan,
  type Subscriber,
} from "@/lib/admin/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  component: ClientsPage,
});

const EMPTY_CLIENT = {
  name: "",
  email: "",
  whatsapp: "",
  country: "",
  service: "",
  projects: "",
  paymentStatus: "",
  status: "lead" as ClientStatus,
  plan: "none" as SubscriptionPlan,
  paymentState: "unpaid" as PaymentState,
  paymentMethod: "",
  amount: "",
  currency: "EGP",
  paidAmount: "",
  lastPaymentAt: "",
  nextRenewalAt: "",
  invoiceRef: "",
};

const EMPTY_SUB = {
  email: "",
  name: "",
  source: "Website",
  status: "subscribed" as Subscriber["status"],
  plan: "none" as SubscriptionPlan,
  paymentState: "unpaid" as PaymentState,
  amount: "",
  currency: "EGP",
  nextRenewalAt: "",
};

const planLabel = (v?: string) =>
  SUBSCRIPTION_PLANS.find((p) => p.value === v)?.label ?? "—";
const paymentLabel = (v?: string) => PAYMENT_STATES.find((p) => p.value === v)?.label ?? "Unpaid";
const money = (amount?: string, currency?: string) =>
  amount ? `${amount} ${currency ?? ""}`.trim() : "—";


type SortKey = "recent" | "lastPayment" | "nextRenewal";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Newest first" },
  { value: "lastPayment", label: "Last payment" },
  { value: "nextRenewal", label: "Next renewal" },
];

function ClientsPage() {
  const qc = useQueryClient();
  const [clientDraft, setClientDraft] = useState(EMPTY_CLIENT);
  const [subDraft, setSubDraft] = useState(EMPTY_SUB);
  const [clientOpen, setClientOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [billingClient, setBillingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterSub, setFilterSub] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "client" | "subscriber"; id: string; label: string } | null
  >(null);

  const clientQuery = useQuery({ queryKey: ["admin", "clients"], queryFn: () => clients.list() });
  const subQuery = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: () => subscribers.list(),
  });

  const allClients = clientQuery.data ?? [];
  const visibleClients = allClients
    .filter((c: Client) => {
      const q = search.trim().toLowerCase();
      if (q && ![c.name, c.email, c.service, c.invoiceRef].some((f) => (f ?? "").toLowerCase().includes(q)))
        return false;
      if (filterPayment !== "all" && (c.paymentState ?? "unpaid") !== filterPayment) return false;
      if (filterPlan !== "all" && (c.plan ?? "none") !== filterPlan) return false;
      if (filterSub !== "all" && (c.subscriptionState ?? "active") !== filterSub) return false;
      return true;
    })
    .sort((a: Client, b: Client) => {
      if (sortKey === "lastPayment") return (b.lastPaymentAt ?? "").localeCompare(a.lastPaymentAt ?? "");
      if (sortKey === "nextRenewal") {
        const av = a.nextRenewalAt || "9999-12-31";
        const bv = b.nextRenewalAt || "9999-12-31";
        return av.localeCompare(bv);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });


  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "clients"] });
    qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });
    qc.invalidateQueries({ queryKey: ["admin", "local-counts"] });
  };

  const addClient = useMutation({
    mutationFn: async () => {
      await clients.create(clientDraft);
      await activityLog.record({
        action: "Client created",
        entity: clientDraft.name,
        actor: "Admin",
        status: "success",
      });
    },
    onSuccess: () => {
      toast.success("Client added");
      setClientDraft(EMPTY_CLIENT);
      setClientOpen(false);
      invalidate();
    },
  });

  const addSub = useMutation({
    mutationFn: () => subscribers.create(subDraft).then(() => undefined),
    onSuccess: () => {
      toast.success("Subscriber added");
      setSubDraft(EMPTY_SUB);
      setSubOpen(false);
      invalidate();
    },
  });

  const removeItem = useMutation({
    mutationFn: async () => {
      if (!pendingDelete) return;
      if (pendingDelete.kind === "client") await clients.remove(pendingDelete.id);
      else await subscribers.remove(pendingDelete.id);
    },
    onSuccess: () => {
      toast.success("Deleted");
      setPendingDelete(null);
      invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Business</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          Clients &amp; subscribers
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Relationship records kept in this browser for now. The repository layer is ready for a
          backend to take over without UI changes.
        </p>
      </header>

      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="subscribers">Newsletter subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4 pt-4">
          <Dialog open={clientOpen} onOpenChange={setClientOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New client</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {([
                  ["name", "Name"],
                  ["email", "Email"],
                  ["whatsapp", "WhatsApp"],
                  ["country", "Country"],
                  ["service", "Requested service"],
                  ["projects", "Projects"],
                  ["paymentStatus", "Payment note"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      value={clientDraft[key]}
                      onChange={(e) => setClientDraft({ ...clientDraft, [key]: e.target.value })}
                    />
                  </div>
                ))}

                <div className="pt-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Payment &amp; subscription
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Subscription plan</Label>
                    <Select
                      value={clientDraft.plan}
                      onValueChange={(v) =>
                        setClientDraft({ ...clientDraft, plan: v as SubscriptionPlan })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Payment state</Label>
                    <Select
                      value={clientDraft.paymentState}
                      onValueChange={(v) =>
                        setClientDraft({ ...clientDraft, paymentState: v as PaymentState })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Agreed amount</Label>
                    <Input
                      id="amount"
                      inputMode="decimal"
                      value={clientDraft.amount}
                      onChange={(e) => setClientDraft({ ...clientDraft, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select
                      value={clientDraft.currency}
                      onValueChange={(v) => setClientDraft({ ...clientDraft, currency: v })}
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
                    <Label htmlFor="paidAmount">Paid so far</Label>
                    <Input
                      id="paidAmount"
                      inputMode="decimal"
                      value={clientDraft.paidAmount}
                      onChange={(e) =>
                        setClientDraft({ ...clientDraft, paidAmount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="paymentMethod">Payment method</Label>
                    <Input
                      id="paymentMethod"
                      placeholder="Instapay, Vodafone Cash, Wise…"
                      value={clientDraft.paymentMethod}
                      onChange={(e) =>
                        setClientDraft({ ...clientDraft, paymentMethod: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastPaymentAt">Last payment date</Label>
                    <Input
                      id="lastPaymentAt"
                      type="date"
                      value={clientDraft.lastPaymentAt}
                      onChange={(e) =>
                        setClientDraft({ ...clientDraft, lastPaymentAt: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nextRenewalAt">Next renewal</Label>
                    <Input
                      id="nextRenewalAt"
                      type="date"
                      value={clientDraft.nextRenewalAt}
                      onChange={(e) =>
                        setClientDraft({ ...clientDraft, nextRenewalAt: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="invoiceRef">Invoice / reference</Label>
                    <Input
                      id="invoiceRef"
                      value={clientDraft.invoiceRef}
                      onChange={(e) =>
                        setClientDraft({ ...clientDraft, invoiceRef: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => addClient.mutate()}
                  disabled={!clientDraft.name || addClient.isPending}
                >
                  Save client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <Input
              placeholder="Search name, email, invoice…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger aria-label="Filter by payment state">
                <SelectValue placeholder="Payment state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payment states</SelectItem>
                {PAYMENT_STATES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger aria-label="Filter by plan">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSub} onValueChange={setFilterSub}>
              <SelectTrigger aria-label="Filter by subscription state">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Active &amp; paused</SelectItem>
                {SUBSCRIPTION_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger aria-label="Sort clients">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    Sort: {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {visibleClients.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {allClients.length === 0 ? "No clients yet." : "No clients match these filters."}
            </div>
          ) : (

            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleClients.map((c: Client) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.email}
                        <br />
                        {c.whatsapp} {c.country && `· ${c.country}`}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.service}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {planLabel(c.plan)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {money(c.amount, c.currency)}
                        {c.paidAmount ? (
                          <>
                            <br />
                            paid {money(c.paidAmount, c.currency)}
                          </>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={c.paymentState ?? "unpaid"}
                          onValueChange={(value) =>
                            clients
                              .update(c.id, { paymentState: value as PaymentState })
                              .then(() => invalidate())
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder={paymentLabel(c.paymentState)} />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATES.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {c.paymentMethod || c.paymentStatus ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[c.paymentMethod, c.paymentStatus].filter(Boolean).join(" · ")}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.nextRenewalAt || "—"}
                        {c.lastPaymentAt ? (
                          <>
                            <br />
                            last {c.lastPaymentAt}
                          </>
                        ) : null}
                      </TableCell>

                      <TableCell>
                        <Select
                          value={c.status}
                          onValueChange={(value) =>
                            clients
                              .update(c.id, { status: value as ClientStatus })
                              .then(() => invalidate())
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CLIENT_STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setBillingClient(c)}
                          >
                            <Receipt className="h-3.5 w-3.5" /> Billing
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete client"
                            onClick={() =>
                              setPendingDelete({ kind: "client", id: c.id, label: c.name })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4 pt-4">
          <Dialog open={subOpen} onOpenChange={setSubOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New subscriber</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {([
                  ["email", "Email"],
                  ["name", "Name"],
                  ["source", "Source"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={`sub-${key}`}>{label}</Label>
                    <Input
                      id={`sub-${key}`}
                      value={subDraft[key]}
                      onChange={(e) => setSubDraft({ ...subDraft, [key]: e.target.value })}
                    />
                  </div>
                ))}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Plan</Label>
                    <Select
                      value={subDraft.plan}
                      onValueChange={(v) => setSubDraft({ ...subDraft, plan: v as SubscriptionPlan })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Payment state</Label>
                    <Select
                      value={subDraft.paymentState}
                      onValueChange={(v) =>
                        setSubDraft({ ...subDraft, paymentState: v as PaymentState })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sub-amount">Amount</Label>
                    <Input
                      id="sub-amount"
                      inputMode="decimal"
                      value={subDraft.amount}
                      onChange={(e) => setSubDraft({ ...subDraft, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select
                      value={subDraft.currency}
                      onValueChange={(v) => setSubDraft({ ...subDraft, currency: v })}
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
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="sub-renewal">Next renewal</Label>
                    <Input
                      id="sub-renewal"
                      type="date"
                      value={subDraft.nextRenewalAt}
                      onChange={(e) => setSubDraft({ ...subDraft, nextRenewalAt: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => addSub.mutate()} disabled={!subDraft.email}>
                  Save subscriber
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {(subQuery.data ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No subscribers yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(subQuery.data ?? []).map((s: Subscriber) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-foreground">{s.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.source}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {planLabel(s.plan)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {money(s.amount, s.currency)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={s.paymentState ?? "unpaid"}
                          onValueChange={(value) =>
                            subscribers
                              .update(s.id, { paymentState: value as PaymentState })
                              .then(() => invalidate())
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder={paymentLabel(s.paymentState)} />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATES.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.nextRenewalAt || "—"}
                      </TableCell>

                      <TableCell>
                        <Select
                          value={s.status}
                          onValueChange={(value) =>
                            subscribers
                              .update(s.id, { status: value as Subscriber["status"] })
                              .then(() => invalidate())
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subscribed">Subscribed</SelectItem>
                            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete subscriber"
                          onClick={() =>
                            setPendingDelete({ kind: "subscriber", id: s.id, label: s.email })
                          }
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
        </TabsContent>
      </Tabs>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.label} will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeItem.mutate()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
