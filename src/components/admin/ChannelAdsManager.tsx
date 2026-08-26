/**
 * Ads manager for a single advertising channel.
 *
 * Two sections — "My ads" and "Client ads" — each listing campaigns with their
 * requirements, a publish action (copies the creative payload and opens the
 * platform ads manager, since no write API is connected), a counter and a
 * simple effectiveness analysis per ad and per section.
 */

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BarChart3,
  ExternalLink,
  Pencil,
  Plus,

  Send,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  AD_OWNERS,
  AD_STATUSES,
  ADS_MANAGER_URL,
  adCampaigns,
  analyzeAd,
  buildCreativePayload,
  missingFields,
  newCampaign,
  summarize,
  type AdCampaign,
  type AdOwner,
  type AdStatus,
} from "@/lib/social/ad-campaigns";
import { CAMPAIGN_OBJECTIVES, type AdChannelSpec, type CampaignObjective } from "@/lib/social/ads";
import { copyText } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const num = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const fmt = (n: number, digits = 0) =>
  n.toLocaleString(undefined, { maximumFractionDigits: digits });

export function ChannelAdsManager({ spec }: { spec: AdChannelSpec }) {
  const qc = useQueryClient();
  const queryKey = ["admin", "ad-campaigns", spec.id];
  const { data } = useQuery({ queryKey, queryFn: () => adCampaigns.list(spec.id) });
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (data) setAds(data);
  }, [data]);

  const invalidate = () => qc.invalidateQueries({ queryKey });

  const persist = useMutation({
    mutationFn: (ad: AdCampaign) => adCampaigns.save(ad),
    onSuccess: invalidate,
  });
  const destroy = useMutation({
    mutationFn: (id: string) => adCampaigns.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Ad deleted");
    },
  });

  const patch = (id: string, values: Partial<AdCampaign>) =>
    setAds((list) => list.map((a) => (a.id === id ? { ...a, ...values } : a)));

  const add = (owner: AdOwner) => {
    const ad = newCampaign(spec.id, owner);
    setAds((list) => [...list, ad]);
    setOpenId(ad.id);
    persist.mutate(ad);
  };

  const publish = async (ad: AdCampaign) => {
    const missing = missingFields(ad);
    if (missing.length) {
      toast.error(`Missing: ${missing.join(", ")}`);
      return;
    }
    await copyText(buildCreativePayload(ad));
    const updated: AdCampaign = {
      ...ad,
      status: ad.status === "draft" ? "running" : ad.status,
      publishedAt: new Date().toISOString(),
    };
    patch(ad.id, updated);
    persist.mutate(updated);
    const url = ADS_MANAGER_URL[spec.id];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Creative copied — ${spec.label} ads manager opened`);
  };

  const totals = useMemo(() => summarize(ads), [ads]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Ads on {spec.label}
          </h2>
          <p className="text-xs text-muted-foreground">
            {totals.total} ads · {totals.own} mine · {totals.client} client ·{" "}
            {totals.running} running
          </p>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Impressions" value={fmt(totals.impressions)} />
        <Stat label="Clicks" value={fmt(totals.clicks)} />
        <Stat label="CTR" value={`${fmt(totals.ctr, 2)}%`} />
        <Stat label="Avg. score" value={totals.avgScore ? `${totals.avgScore}/100` : "—"} />
      </div>

      {AD_OWNERS.map((o) => {
        const list = ads.filter((a) => a.owner === o.value);
        const s = summarize(list);
        // Stable client numbering: first appearance order of each client name.
        const clientOrder: string[] = [];
        list.forEach((a) => {
          const key = a.clientName.trim().toLowerCase();
          if (key && !clientOrder.includes(key)) clientOrder.push(key);
        });
        const unnamed = list.filter((a) => !a.clientName.trim()).length;
        return (
          <div key={o.value} className="space-y-3 rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{o.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {s.total} ads · {s.published} published · spend {fmt(s.spend)} · CTR{" "}
                  {fmt(s.ctr, 2)}% ·{" "}
                  {s.avgScore ? `effectiveness ${s.avgScore}/100` : "no performance data"}
                </p>
                {o.value === "client" ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {clientOrder.length} client{clientOrder.length === 1 ? "" : "s"}
                    {unnamed ? ` · ${unnamed} unassigned` : ""}
                  </p>
                ) : null}
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => add(o.value)}>
                <Plus className="h-3.5 w-3.5" /> New ad
              </Button>
            </div>

            {list.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-4 text-xs text-muted-foreground">
                No {o.label.toLowerCase()} yet on {spec.label}.
              </p>
            ) : (
              <div className="space-y-2">
                {list.map((ad, i) => {
                  const key = ad.clientName.trim().toLowerCase();
                  const clientNo = key ? clientOrder.indexOf(key) + 1 : 0;
                  return (
                    <AdRow
                      key={ad.id}
                      ad={ad}
                      index={i + 1}
                      clientNo={o.value === "client" ? clientNo : 0}
                      open={openId === ad.id}
                      onToggle={() => setOpenId(openId === ad.id ? null : ad.id)}
                      onPatch={(v) => patch(ad.id, v)}
                      onSave={() => {
                        const current = ads.find((a) => a.id === ad.id);
                        if (current)
                          persist.mutate(current, { onSuccess: () => toast.success("Ad saved") });
                      }}
                      onDelete={() => {
                        if (!window.confirm(`Delete "${ad.name || "Untitled ad"}"?`)) return;
                        setAds((l) => l.filter((a) => a.id !== ad.id));
                        destroy.mutate(ad.id);
                      }}
                      onPublish={() => publish(ad)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}


      {ADS_MANAGER_URL[spec.id] ? (
        <p className="text-xs text-muted-foreground">
          Publishing opens {spec.label}&apos;s ads manager with the creative copied to your
          clipboard — the platform has no open write API for ad creation from a website.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {spec.label} has no self-serve ads manager — ads here are tracked for planning only.
        </p>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function AdRow({
  ad,
  index,
  clientNo,
  open,
  onToggle,
  onPatch,
  onSave,
  onDelete,
  onPublish,
}: {
  ad: AdCampaign;
  index: number;
  clientNo: number;
  open: boolean;
  onToggle: () => void;
  onPatch: (v: Partial<AdCampaign>) => void;
  onSave: () => void;
  onDelete: () => void;
  onPublish: () => void;
}) {
  const insight = analyzeAd(ad);
  const missing = missingFields(ad);
  const tone =
    insight.verdict === "strong"
      ? "text-emerald-500"
      : insight.verdict === "promising"
        ? "text-amber-500"
        : insight.verdict === "weak"
          ? "text-destructive"
          : "text-muted-foreground";

  return (
    <div className="rounded-lg border border-border">
      <div className="flex w-full flex-wrap items-center gap-3 p-3 hover:bg-muted/30">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 flex-wrap items-center gap-3 text-start"
        >
          <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            #{index}
          </span>
          <span className="text-sm font-medium text-foreground">{ad.name || "Untitled ad"}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
            {ad.status}
          </span>
          {clientNo ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              Client {clientNo}
            </span>
          ) : null}
          {ad.clientName ? (
            <span className="text-xs text-muted-foreground">for {ad.clientName}</span>
          ) : null}
          <span className={cn("flex items-center gap-1 text-xs", tone)}>
            {insight.verdict === "no_data" ? (
              <BarChart3 className="h-3.5 w-3.5" />
            ) : insight.verdict === "weak" ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" />
            )}
            {insight.verdict === "no_data" ? "No data" : `${insight.score}/100`}
          </span>
        </button>
        <div className="ms-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" className="gap-1" onClick={onToggle}>
            <Pencil className="h-3.5 w-3.5" /> {open ? "Close" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-destructive"
            onClick={onDelete}
            aria-label="Delete ad"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>


      {open ? (
        <div className="space-y-4 border-t border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Campaign name">
              <Input value={ad.name} onChange={(e) => onPatch({ name: e.target.value })} />
            </Field>
            <Field label={ad.owner === "client" ? "Client name" : "Internal owner"}>
              <Input
                value={ad.clientName}
                placeholder={ad.owner === "client" ? "Client / company" : "NextGen"}
                onChange={(e) => onPatch({ clientName: e.target.value })}
              />
            </Field>
            <Field label="Objective">
              <Select
                value={ad.objective}
                onValueChange={(v) => onPatch({ objective: v as CampaignObjective })}
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
            </Field>
            <Field label="Status">
              <Select value={ad.status} onValueChange={(v) => onPatch({ status: v as AdStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AD_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Headline">
              <Input value={ad.headline} onChange={(e) => onPatch({ headline: e.target.value })} />
            </Field>
            <Field label="Call to action">
              <Input
                value={ad.callToAction}
                onChange={(e) => onPatch({ callToAction: e.target.value })}
              />
            </Field>
            <Field label="Primary text" className="sm:col-span-2">
              <Textarea
                rows={3}
                value={ad.primaryText}
                onChange={(e) => onPatch({ primaryText: e.target.value })}
              />
            </Field>
            <Field label="Landing URL">
              <Input
                value={ad.landingUrl}
                placeholder="https://nextnext-gen.com/services"
                onChange={(e) => onPatch({ landingUrl: e.target.value })}
              />
            </Field>
            <Field label="Creative (image/video URL)">
              <Input
                value={ad.creativeUrl}
                onChange={(e) => onPatch({ creativeUrl: e.target.value })}
              />
            </Field>
            <Field label="Audience">
              <Input
                value={ad.audience}
                placeholder="Egypt · 25-45 · founders, IT managers"
                onChange={(e) => onPatch({ audience: e.target.value })}
              />
            </Field>
            <Field label="Budget">
              <Input
                value={ad.budget}
                placeholder="5000 / month"
                onChange={(e) => onPatch({ budget: e.target.value })}
              />
            </Field>
            <Field label="Start date">
              <Input
                type="date"
                value={ad.startDate}
                onChange={(e) => onPatch({ startDate: e.target.value })}
              />
            </Field>
            <Field label="End date">
              <Input
                type="date"
                value={ad.endDate}
                onChange={(e) => onPatch({ endDate: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-4">
            <Field label="Impressions">
              <Input
                inputMode="numeric"
                value={String(ad.impressions)}
                onChange={(e) => onPatch({ impressions: num(e.target.value) })}
              />
            </Field>
            <Field label="Clicks">
              <Input
                inputMode="numeric"
                value={String(ad.clicks)}
                onChange={(e) => onPatch({ clicks: num(e.target.value) })}
              />
            </Field>
            <Field label="Conversions">
              <Input
                inputMode="numeric"
                value={String(ad.conversions)}
                onChange={(e) => onPatch({ conversions: num(e.target.value) })}
              />
            </Field>
            <Field label={`Spend (${ad.currency})`}>
              <Input
                inputMode="numeric"
                value={String(ad.spend)}
                onChange={(e) => onPatch({ spend: num(e.target.value) })}
              />
            </Field>
          </div>

          <div className="rounded-lg border border-border p-3 text-xs">
            <p className="flex flex-wrap gap-4 text-muted-foreground">
              <span>CTR {fmt(insight.ctr, 2)}%</span>
              <span>CPC {fmt(insight.cpc, 2)}</span>
              <span>CPA {fmt(insight.cpa, 2)}</span>
              <span>Conv. rate {fmt(insight.conversionRate, 2)}%</span>
            </p>
            <p className={cn("mt-2 font-medium", tone)}>{insight.advice}</p>
          </div>

          {missing.length ? (
            <p className="text-xs text-destructive">
              Required before publishing: {missing.join(", ")}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={onPublish}>
              <Send className="h-3.5 w-3.5" /> Publish to platform
            </Button>
            {ad.landingUrl ? (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1"
                onClick={() => window.open(ad.landingUrl, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Landing page
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              className="ms-auto gap-1 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
          {ad.publishedAt ? (
            <p className="text-[11px] text-muted-foreground">
              Last published {new Date(ad.publishedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
