/**
 * Ads & tracking pixels — dedicated, focused page.
 *
 * List view shows one row per advertising channel. Picking a channel (e.g.
 * Google Ads) opens a focused view with ONLY that channel's settings — no
 * other page content — plus a back button to return to the list.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import {
  AD_CHANNELS,
  AD_PLACEMENTS,
  CAMPAIGN_OBJECTIVES,
  adChannels,
  buildSnippet,
  type AdChannelConfig,
  type AdChannelId,
  type AdChannelSpec,
  type AdPlacement,
  type CampaignObjective,
} from "@/lib/social/ads";
import { copyText } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/ads-pixels")({
  component: AdsPixelsPage,
});

function AdsPixelsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "ad-channels"],
    queryFn: () => adChannels.list(),
  });
  const [rows, setRows] = useState<AdChannelConfig[]>([]);
  const [selected, setSelected] = useState<AdChannelId | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.length) setRows(data);
  }, [data]);

  const byId = useMemo(() => new Map(rows.map((r) => [r.channelId, r])), [rows]);

  const save = useMutation({
    mutationFn: async () => adChannels.save(rows),
    onSuccess: () => {
      toast.success("Ad channel saved");
      qc.invalidateQueries({ queryKey: ["admin", "ad-channels"] });
    },
  });

  const patch = (id: AdChannelId, values: Partial<AdChannelConfig>) =>
    setRows((list) => list.map((r) => (r.channelId === id ? { ...r, ...values } : r)));

  const activeCount = rows.filter((r) => r.enabled && r.pixelId.trim()).length;

  const spec: AdChannelSpec | null = selected
    ? (AD_CHANNELS.find((s) => s.id === selected) ?? null)
    : null;
  const config = selected ? byId.get(selected) : undefined;

  // ------------------------------------------------------- focused view
  if (spec && config) {
    const snippet = buildSnippet(spec, config);
    return (
      <div className="space-y-6">
        <header className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setSelected(null);
              setCopied(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> All ad channels
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {spec.label}
              </h1>
              {spec.hasPixel ? null : (
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  no pixel
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(v) => patch(spec.id, { enabled: v })}
                  aria-label={`Enable ${spec.label}`}
                />
                <span className="text-xs text-muted-foreground">
                  {config.enabled ? "Active" : "Off"}
                </span>
              </div>
              <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
                Save
              </Button>
            </div>
          </div>
        </header>

        {spec.pixelNote ? (
          <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {spec.pixelNote}
          </p>
        ) : null}

        <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{spec.idLabel}</Label>
            <Input
              value={config.pixelId}
              placeholder={spec.idPlaceholder}
              onChange={(e) => patch(spec.id, { pixelId: e.target.value })}
            />
          </div>
          {spec.secondaryLabel ? (
            <div className="space-y-1.5">
              <Label>{spec.secondaryLabel}</Label>
              <Input
                value={config.secondaryId}
                placeholder={spec.secondaryPlaceholder ?? ""}
                onChange={(e) => patch(spec.id, { secondaryId: e.target.value })}
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label>Code placement</Label>
            <Select
              value={config.placement}
              onValueChange={(v) => patch(spec.id, { placement: v as AdPlacement })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AD_PLACEMENTS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Campaign type</Label>
            <Select
              value={config.objective}
              onValueChange={(v) => patch(spec.id, { objective: v as CampaignObjective })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_OBJECTIVES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Landing URL</Label>
            <Input
              value={config.landingUrl}
              placeholder="https://nextnext-gen.com/services"
              onChange={(e) => patch(spec.id, { landingUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Budget</Label>
            <Input
              value={config.budget}
              placeholder="EGP 5,000 / month"
              onChange={(e) => patch(spec.id, { budget: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea
              rows={3}
              value={config.notes}
              placeholder="Audience, creative direction, reporting cadence…"
              onChange={(e) => patch(spec.id, { notes: e.target.value })}
            />
          </div>
        </div>

        {snippet ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label>Install snippet</Label>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={async () => {
                  await copyText(snippet);
                  setCopied(true);
                  toast.success("Copied to clipboard");
                  window.setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy code
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {snippet}
            </pre>
          </div>
        ) : null}

        {spec.docsUrl ? (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1"
            onClick={() => window.open(spec.docsUrl, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Platform setup docs
          </Button>
        ) : null}
      </div>
    );
  }

  // ------------------------------------------------------- channel list
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Social media</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          Ads &amp; tracking pixels
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick a channel to configure its pixel / tag ID, install placement and campaign
          objective — one channel at a time. {activeCount} configured. Channels marked{" "}
          <span className="font-mono uppercase">no pixel</span> have no first-party website tag
          and are listed for transparency.
        </p>
      </header>

      <div className="grid gap-2">
        {AD_CHANNELS.map((s) => {
          const c = byId.get(s.id);
          if (!c) return null;
          const configured = c.pixelId.trim().length > 0;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border p-3 text-start transition-colors",
                "hover:border-primary/50 hover:bg-muted/30",
              )}
            >
              <p className="w-44 shrink-0 text-sm font-medium text-foreground">{s.label}</p>
              {s.hasPixel ? null : (
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  no pixel
                </span>
              )}
              <span className="ms-auto text-xs text-muted-foreground">
                {c.enabled && configured
                  ? "Active"
                  : configured
                    ? "Configured · off"
                    : "Not configured"}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
