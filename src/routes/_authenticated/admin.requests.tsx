import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Mail, MessageCircle, Trash2 } from "lucide-react";

import {
  REQUEST_STATUS_OPTIONS,
  adminDeleteServiceRequest,
  adminListServiceRequests,
  adminUpdateServiceRequest,
  type ServiceRequestRow,
} from "@/lib/crm/requests.functions";
import { socialLinks, contact } from "@/content/canonical/profile";
import { SocialIcon, type SocialPlatform } from "@/components/site/SocialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const STATUS_TONE: Record<string, string> = {
  new: "border-primary/50 text-primary",
  contacted: "border-border text-foreground",
  proposal_sent: "border-border text-foreground",
  deposit_pending: "border-amber-500/50 text-amber-500",
  in_progress: "border-emerald-500/50 text-emerald-500",
  completed: "border-emerald-500/50 text-emerald-500",
  cancelled: "border-destructive/50 text-destructive",
};

const REPLY_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "x",
  "snapchat",
  "linkedin",
  "youtube",
];

const digits = (value?: string | null) => (value ?? "").replace(/\D/g, "");

function summaryOf(r: ServiceRequestRow) {
  return [
    r.project_name && `Project: ${r.project_name}`,
    r.service_title && `Service: ${r.service_title}`,
    r.platform && `Platform: ${r.platform}`,
    r.scope && `Scope: ${r.scope}`,
    r.budget && `Budget: ${r.budget}`,
    r.timeline && `Timeline: ${r.timeline}`,
    r.description && `Details: ${r.description}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function replyText(r: ServiceRequestRow) {
  return [
    `Hello ${r.client_name},`,
    "",
    `Thank you for your request${r.service_title ? ` about ${r.service_title}` : ""}. I reviewed the details and I'd love to discuss the next steps with you.`,
    "",
    summaryOf(r),
  ]
    .filter(Boolean)
    .join("\n");
}

function RequestsPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListServiceRequests);
  const update = useServerFn(adminUpdateServiceRequest);
  const destroy = useServerFn(adminDeleteServiceRequest);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<ServiceRequestRow | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "service-requests"],
    queryFn: () => list(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    qc.invalidateQueries({ queryKey: ["admin", "local-counts"] });
  };

  const patch = useMutation({
    mutationFn: (input: { id: string; status?: string; adminNote?: string }) =>
      update({ data: input }),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => destroy({ data: { id } }),
    onSuccess: () => {
      toast.success("Request deleted");
      setPendingDelete(null);
      invalidate();
    },
  });

  const email = contact.find((c) => c.kind === "email" && c.visibility.public)?.value;
  const socials = REPLY_PLATFORMS.map((p) =>
    socialLinks.find((s) => s.platform === p && s.visibility.public),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  const rows = useMemo(
    () =>
      data.filter((r) => {
        const haystack =
          `${r.client_name} ${r.email ?? ""} ${r.service_title ?? ""} ${r.project_name ?? ""} ${r.description ?? ""}`.toLowerCase();
        return (
          haystack.includes(search.toLowerCase()) &&
          (statusFilter === "all" || r.status === statusFilter)
        );
      }),
    [data, search, statusFilter],
  );

  const newCount = data.filter((r) => r.status === "new").length;

  const copyReply = async (r: ServiceRequestRow) => {
    try {
      await navigator.clipboard.writeText(replyText(r));
      setCopied(r.id);
      toast.success("Reply copied");
      setTimeout(() => setCopied((c) => (c === r.id ? null : c)), 2500);
    } catch {
      toast.error("Clipboard unavailable");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Business</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          Client requests
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every "Start project" submission from the site lands here — what the client asked for, and
          one-click ways to reply on any channel. {newCount} new · {data.length} total.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search client, service, project…"
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
            {REQUEST_STATUS_OPTIONS.map((s) => (
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
          {error instanceof Error ? error.message : "Could not load requests"}
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No client requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const waNumber = digits(r.whatsapp);
            const wa = waNumber
              ? `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(replyText(r))}`
              : null;
            const mailto = r.email
              ? `mailto:${r.email}?subject=${encodeURIComponent(
                  `Re: ${r.service_title ?? "your project request"}`,
                )}&body=${encodeURIComponent(replyText(r))}`
              : email
                ? `mailto:${email}`
                : null;

            return (
              <article key={r.id} className="rounded-lg border border-border bg-surface/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{r.client_name}</p>
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          STATUS_TONE[r.status] ?? "border-border text-muted-foreground"
                        }`}
                      >
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {[r.email, r.whatsapp, new Date(r.created_at).toLocaleString()]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {r.service_title ?? "Service request"}
                      {r.project_name ? ` — ${r.project_name}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[r.platform, r.scope, r.budget, r.timeline, r.preferred_channel && `prefers ${r.preferred_channel}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {r.description && (
                      <p className="mt-2 max-w-2xl whitespace-pre-line text-sm text-muted-foreground">
                        {r.description}
                      </p>
                    )}
                    {r.attachment_url && (
                      <a
                        href={r.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs text-primary underline underline-offset-4"
                      >
                        Attachment
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={r.status}
                      onValueChange={(value) => patch.mutate({ id: r.id, status: value })}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REQUEST_STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* Reply on any channel */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Reply via
                  </span>
                  {wa && (
                    <Button asChild size="sm" className="gap-2">
                      <a href={wa} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  )}
                  {mailto && (
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={mailto}>
                        <Mail className="h-4 w-4" /> Email
                      </a>
                    </Button>
                  )}
                  {socials.map((s) => (
                    <Button
                      key={s.platform}
                      asChild
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => void copyReply(r)}
                    >
                      <a href={s.url} target="_blank" rel="noreferrer">
                        <SocialIcon platform={s.platform as SocialPlatform} />
                        {s.platform}
                      </a>
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" className="gap-2" onClick={() => void copyReply(r)}>
                    {copied === r.id ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy reply
                  </Button>
                </div>

                <Textarea
                  className="mt-3"
                  rows={2}
                  placeholder="Internal note…"
                  defaultValue={r.admin_note}
                  onBlur={(e) => {
                    if (e.target.value !== r.admin_note) {
                      patch.mutate({ id: r.id, adminNote: e.target.value });
                    }
                  }}
                />
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client request?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.client_name} will be removed from the inbox. This cannot be undone.
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
