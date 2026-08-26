/**
 * Ads & tracking pixels manager.
 *
 * One row per advertising channel: pixel/tag identifiers, where the snippet is
 * installed, the campaign objective and the landing target. Channels that have
 * no first-party website pixel are shown with an explicit note rather than a
 * fake field.
 */

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronDown, Copy, ExternalLink, ShieldAlert } from "lucide-react";
import {
  AD_CHANNELS,
  AD_PLACEMENTS,
  CAMPAIGN_OBJECTIVES,
  adChannels,
  buildSnippet,
  type AdChannelConfig,
  type AdChannelId,
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

export function AdsPixels() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "ad-channels"], queryFn: () => adChannels.list() });
  const [rows, setRows] = useState<AdChannelConfig[]>([]);
  const [open, setOpen] = useState<AdChannelId | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (data?.length) setRows(data);
  }, [data]);

  const byId = useMemo(() => new Map(rows.map((r) => [r.channelId, r])), [rows]);

  const save = useMutation({
    mutationFn: async () => adChannels.save(rows),
    onSuccess: () => {
      toast.success("Ad channels saved");
      qc.invalidateQueries({ queryKey: ["admin", "ad-channels"] });
    },
  });

  const patch = (id: AdChannelId, values: Partial<AdChannelConfig>) =>
    setRows((list) => list.map((r) => (r.channelId === id ? { ...r, ...values } : r)));

  const copy = async (key: string, value: string) => {
    await copyText(value);
    setCopied(key);
    toast.success("Copied to clipboard");
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  const activeCount = rows.filter((r) => r.enabled && r.pixelId.trim()).length;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Ads &amp; tracking pixels</h2>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Pixel / tag IDs, install placement and campaign objective per advertising channel.
            {" "}
            {activeCount} configured. Channels marked{" "}
            <span className="font-mono uppercase">no pixel</span> have no first-party website tag —
            they are listed for transparency instead of being faked.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => save.mutate()}>
          Save ad channels
        </Button>
      </div>

      <div className="grid gap-2">
        {AD_CHANNELS.map((spec) => {
          const config = byId.get(spec.id);
          if (!config) return null;
          const isOpen = open === spec.id;
          const snippet = buildSnippet(spec, config);
          return (
            <div key={spec.id} className="rounded-lg border border-border">
              <div className="grid items-center gap-2 p-3 sm:grid-cols-[190px_1fr_auto_auto]">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{spec.label}</p>
                  {spec.hasPixel ? null : (
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                      no pixel
                    </span>
                  )}
                </div>
                <Input
                  value={config.pixelId}
                  placeholder={spec.idPlaceholder}
                  aria-label={`${spec.label} ${spec.idLabel}`}
                  onChange={(e) => patch(spec.id, { pixelId: e.target.value })}
                />
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => setOpen(isOpen ? null : spec.id)}
                >
                  Details
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Button>
              </div>

              {isOpen ? (
                <div className="space-y-3 border-t border-border p-3">
                  {spec.pixelNote ? (
                    <p className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
                      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {spec.pixelNote}
                    </p>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
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
                        rows={2}
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
                          onClick={() => copy(`snippet-${spec.id}`, snippet)}
                        >
                          {copied === `snippet-${spec.id}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Copy code
                        </Button>
                      </div>
                      <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
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
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
