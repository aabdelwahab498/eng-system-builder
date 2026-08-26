import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ExternalLink, Pencil, Plus } from "lucide-react";

import { paymentGateways, gatewayFromContent, type GatewayInfo } from "@/lib/admin/gateways";
import { adminListContent } from "@/lib/cms/admin.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GatewayStats = Record<string, { count: number; pending: number }>;

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
  const live = gateway.status === "live";

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

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
      >
        {open ? "Hide details" : "Account details"}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {gateway.details.map((d) => (
            <div key={d.label} className="text-xs">
              <p className="text-muted-foreground">{d.label}</p>
              <p dir="ltr" className="break-all font-mono text-foreground">
                {d.value}
              </p>
            </div>
          ))}
          {gateway.note ? <p className="text-xs text-muted-foreground">{gateway.note}</p> : null}
          {gateway.link ? (
            <Button asChild variant="outline" size="sm">
              <a href={gateway.link.href} target="_blank" rel="noreferrer noopener">
                {gateway.link.label}
                <ExternalLink className="ms-1 h-3 w-3" />
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function GatewayOverview({ stats }: { stats?: GatewayStats }) {
  const liveCount = paymentGateways.filter((g) => g.status === "live").length;

  return (
    <section className="space-y-3">
      <div>
        <p className="eyebrow">Gateways</p>
        <h2 className="mt-1 font-display text-lg font-semibold text-foreground">Payment gateways</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every rail clients can pay through — {liveCount} live manual rails plus reserved slots for
          card gateways we can switch on later.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {paymentGateways.map((g) => (
          <GatewayCard key={g.id} gateway={g} stats={stats?.[g.id] ?? { count: 0, pending: 0 }} />
        ))}
      </div>
    </section>
  );
}
