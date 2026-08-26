import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Copy, ExternalLink, Pencil, Plus } from "lucide-react";

import { paymentGateways, gatewayFromContent, type GatewayInfo } from "@/lib/admin/gateways";
import { adminListContent } from "@/lib/cms/admin.functions";
import { copyText } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GatewayStats = Record<string, { count: number; pending: number }>;

/** Builds a client-ready plain-text block with everything needed to pay. */
function gatewayPaymentText(gateway: GatewayInfo): string {
  const lines = [
    `Payment method: ${gateway.name} (${gateway.currencies.join(", ") || "—"})`,
    ...gateway.details.map((d) => `${d.label}: ${d.value}`),
  ];
  if (gateway.link) lines.push(`${gateway.link.label}: ${gateway.link.href}`);
  if (gateway.note) lines.push(`Note: ${gateway.note}`);
  return lines.join("\n");
}

function GatewayCard({
  gateway,
  stats,
  entryId,
}: {
  gateway: GatewayInfo;
  stats?: { count: number; pending: number };
  entryId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const live = gateway.status === "live";

  async function copyAll() {
    await copyText(gatewayPaymentText(gateway));
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  }

  async function copyOne(idx: number, value: string) {
    await copyText(value);
    setCopiedIdx(idx);
    window.setTimeout(() => setCopiedIdx((v) => (v === idx ? null : v)), 1800);
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-surface/60 p-4",
        live ? "border-border" : "border-dashed border-border-strong/60 opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">{gateway.name}</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {gateway.currencies.join(" · ")} · {gateway.mode === "manual" ? "Manual proof" : "Automatic"}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-sm border px-2 py-1 font-mono text-[10px] uppercase",
            live
              ? "border-emerald-500/50 text-emerald-500"
              : "border-amber-500/50 text-amber-500",
          )}
        >
          {live ? "Live" : "Reserved"}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Region</dt>
          <dd className="text-foreground">{gateway.region}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Rails</dt>
          <dd className="text-foreground">{gateway.rails.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Settlement</dt>
          <dd className="text-foreground">{gateway.settlement}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Fees</dt>
          <dd className="text-foreground">{gateway.fees}</dd>
        </div>
      </dl>

      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        {live
          ? `${stats?.count ?? 0} submissions · ${stats?.pending ?? 0} pending review`
          : "No submissions — awaiting connection"}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
        >
          {open ? "Hide details" : "Account details"}
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        </button>
        <button
          type="button"
          onClick={copyAll}
          title="Copy the full payment info to send to a client"
          className={cn(
            "inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider transition",
            copiedAll ? "text-emerald-500" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {copiedAll ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copiedAll ? "Copied" : "Copy payment info"}
        </button>
      </div>

      {open ? (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {gateway.details.map((d, i) => (
            <div key={d.label} className="flex items-start justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="text-muted-foreground">{d.label}</p>
                <p dir="ltr" className="break-all font-mono text-foreground">
                  {d.value}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyOne(i, d.value)}
                title={`Copy ${d.label}`}
                className={cn(
                  "mt-0.5 shrink-0 rounded-sm border p-1.5 transition-colors",
                  copiedIdx === i
                    ? "border-emerald-500/50 text-emerald-500"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {copiedIdx === i ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : (
                  <Copy className="h-3 w-3" aria-hidden />
                )}
                <span className="sr-only">{copiedIdx === i ? "Copied" : `Copy ${d.label}`}</span>
              </button>
            </div>
          ))}
          {gateway.link ? (
            <div className="flex items-start justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="text-muted-foreground">{gateway.link.label}</p>
                <p dir="ltr" className="break-all font-mono text-foreground">
                  {gateway.link.href}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyOne(-1, gateway.link!.href)}
                title={`Copy ${gateway.link.label}`}
                className={cn(
                  "mt-0.5 shrink-0 rounded-sm border p-1.5 transition-colors",
                  copiedIdx === -1
                    ? "border-emerald-500/50 text-emerald-500"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {copiedIdx === -1 ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : (
                  <Copy className="h-3 w-3" aria-hidden />
                )}
                <span className="sr-only">
                  {copiedIdx === -1 ? "Copied" : `Copy ${gateway.link.label}`}
                </span>
              </button>
            </div>
          ) : null}
          {gateway.note ? <p className="text-xs text-muted-foreground">{gateway.note}</p> : null}
          <div className="flex flex-wrap gap-2">
            {gateway.link ? (
              <Button asChild variant="outline" size="sm">
                <a href={gateway.link.href} target="_blank" rel="noreferrer noopener">
                  {gateway.link.label}
                  <ExternalLink className="ms-1 h-3 w-3" />
                </a>
              </Button>
            ) : null}
            {entryId ? (
              <Button asChild variant="outline" size="sm">
                <Link
                  to="/admin/content/$kind/$id"
                  params={{ kind: "payment_method", id: entryId }}
                >
                  <Pencil className="me-1 h-3 w-3" />
                  Edit gateway
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function GatewayOverview({ stats }: { stats?: GatewayStats }) {
  const listContent = useServerFn(adminListContent);
  const { data: entries } = useQuery({
    queryKey: ["admin", "content", "payment_method"],
    queryFn: () => listContent({ data: { kind: "payment_method" } }),
  });

  const cards: { gateway: GatewayInfo; entryId?: string }[] =
    entries && entries.length > 0
      ? entries.map((item) => ({
          gateway: gatewayFromContent({
            id: item.id,
            slug: item.slug,
            data: item.data as Record<string, unknown>,
          }),
          entryId: item.id,
        }))
      : paymentGateways.map((gateway) => ({ gateway }));

  const liveCount = cards.filter((c) => c.gateway.status === "live").length;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Gateways</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-foreground">Payment gateways</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every rail clients can pay through — {liveCount} live, the rest are reserved slots.
            Add, edit or remove a gateway any time from Content → Payments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/content/$kind" params={{ kind: "payment_method" }}>
              Manage gateways
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/content/$kind/$id" params={{ kind: "payment_method", id: "new" }}>
              <Plus className="me-1 h-3 w-3" />
              Add gateway
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ gateway: g, entryId }) => (
          <GatewayCard
            key={entryId ?? g.id}
            gateway={g}
            stats={stats?.[g.id] ?? { count: 0, pending: 0 }}
            {...(entryId ? { entryId } : {})}
          />
        ))}
      </div>
    </section>
  );
}
