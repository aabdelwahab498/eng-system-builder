import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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


function ClientsPage() {
  const qc = useQueryClient();
  const [clientDraft, setClientDraft] = useState(EMPTY_CLIENT);
  const [subDraft, setSubDraft] = useState(EMPTY_SUB);
  const [clientOpen, setClientOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "client" | "subscriber"; id: string; label: string } | null
  >(null);

  const clientQuery = useQuery({ queryKey: ["admin", "clients"], queryFn: () => clients.list() });
  const subQuery = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: () => subscribers.list(),
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
                  ["paymentStatus", "Payment status"],
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

          {(clientQuery.data ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No clients yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(clientQuery.data ?? []).map((c: Client) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.email}
                        <br />
                        {c.whatsapp} {c.country && `· ${c.country}`}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.service}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.paymentStatus || "—"}
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
