/**
 * Per-channel ad campaigns (own ads vs client ads) with simple performance math.
 *
 * Frontend-only store (same contract style as `./ads`): campaigns live in
 * localStorage until a real ads API integration exists. Publishing is honest:
 * we build the creative payload + a deep link into the platform's ads manager
 * instead of pretending we have write access to the ad account.
 */

import type { AdChannelId, CampaignObjective } from "./ads";

export type AdOwner = "own" | "client";

export const AD_OWNERS: { value: AdOwner; label: string }[] = [
  { value: "own", label: "My ads" },
  { value: "client", label: "Client ads" },
];

export type AdStatus = "draft" | "scheduled" | "running" | "paused" | "ended";

export const AD_STATUSES: { value: AdStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "running", label: "Running" },
  { value: "paused", label: "Paused" },
  { value: "ended", label: "Ended" },
];

export type AdCampaign = {
  id: string;
  channelId: AdChannelId;
  owner: AdOwner;
  name: string;
  clientName: string;
  objective: CampaignObjective;
  status: AdStatus;
  headline: string;
  primaryText: string;
  callToAction: string;
  landingUrl: string;
  creativeUrl: string;
  audience: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  /** Reported metrics — entered manually until an API is connected. */
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  notes: string;
  publishedAt: string | null;
  createdAt: string;
};

/** Fields an ad must have before it can be published. */
export const REQUIRED_FIELDS: { key: keyof AdCampaign; label: string }[] = [
  { key: "name", label: "Campaign name" },
  { key: "headline", label: "Headline" },
  { key: "primaryText", label: "Primary text" },
  { key: "landingUrl", label: "Landing URL" },
  { key: "budget", label: "Budget" },
];

export const missingFields = (ad: AdCampaign) =>
  REQUIRED_FIELDS.filter((f) => !String(ad[f.key] ?? "").trim()).map((f) => f.label);

export const newCampaign = (channelId: AdChannelId, owner: AdOwner): AdCampaign => ({
  id: `ad_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
  channelId,
  owner,
  name: "",
  clientName: "",
  objective: "traffic",
  status: "draft",
  headline: "",
  primaryText: "",
  callToAction: "Learn more",
  landingUrl: "",
  creativeUrl: "",
  audience: "",
  budget: "",
  currency: "EGP",
  startDate: "",
  endDate: "",
  impressions: 0,
  clicks: 0,
  conversions: 0,
  spend: 0,
  notes: "",
  publishedAt: null,
  createdAt: new Date().toISOString(),
});

// ------------------------------------------------------------------ analysis

export type AdInsight = {
  ctr: number;
  cpc: number;
  cpa: number;
  conversionRate: number;
  /** 0–100 simple effectiveness score. */
  score: number;
  verdict: "no_data" | "strong" | "promising" | "weak";
  advice: string;
};

const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);

export function analyzeAd(ad: AdCampaign): AdInsight {
  const ctr = pct(ad.clicks, ad.impressions);
  const cpc = ad.clicks > 0 ? ad.spend / ad.clicks : 0;
  const cpa = ad.conversions > 0 ? ad.spend / ad.conversions : 0;
  const conversionRate = pct(ad.conversions, ad.clicks);

  if (ad.impressions <= 0 && ad.clicks <= 0) {
    return {
      ctr,
      cpc,
      cpa,
      conversionRate,
      score: 0,
      verdict: "no_data",
      advice: "Enter reported impressions, clicks and spend to score this ad.",
    };
  }

  // CTR benchmark ~1%, conversion rate benchmark ~5%.
  const ctrScore = Math.min(ctr / 1, 1) * 55;
  const convScore = Math.min(conversionRate / 5, 1) * 45;
  const score = Math.round(ctrScore + convScore);

  const verdict = score >= 65 ? "strong" : score >= 35 ? "promising" : "weak";
  const advice =
    verdict === "strong"
      ? "Working well — scale the budget and duplicate the creative to a lookalike audience."
      : verdict === "promising"
        ? "Mixed signals — keep it running but test a new headline or a tighter audience."
        : ctr < 0.5
          ? "Weak: the creative is not stopping the scroll. Replace the visual and headline first."
          : "Weak: clicks arrive but do not convert. Fix the landing page and the offer.";

  return { ctr, cpc, cpa, conversionRate, score, verdict, advice };
}

export type ChannelSummary = {
  total: number;
  own: number;
  client: number;
  running: number;
  published: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  avgScore: number;
};

export function summarize(ads: AdCampaign[]): ChannelSummary {
  const scored = ads.map(analyzeAd).filter((i) => i.verdict !== "no_data");
  const impressions = ads.reduce((s, a) => s + a.impressions, 0);
  const clicks = ads.reduce((s, a) => s + a.clicks, 0);
  return {
    total: ads.length,
    own: ads.filter((a) => a.owner === "own").length,
    client: ads.filter((a) => a.owner === "client").length,
    running: ads.filter((a) => a.status === "running").length,
    published: ads.filter((a) => a.publishedAt).length,
    spend: ads.reduce((s, a) => s + a.spend, 0),
    impressions,
    clicks,
    conversions: ads.reduce((s, a) => s + a.conversions, 0),
    ctr: pct(clicks, impressions),
    avgScore: scored.length
      ? Math.round(scored.reduce((s, i) => s + i.score, 0) / scored.length)
      : 0,
  };
}

// ----------------------------------------------------------------- publishing

/** Where each platform's ad creation flow lives. */
export const ADS_MANAGER_URL: Partial<Record<AdChannelId, string>> = {
  google_ads: "https://ads.google.com/aw/campaigns/new",
  meta: "https://adsmanager.facebook.com/adsmanager/manage/campaigns",
  instagram: "https://adsmanager.facebook.com/adsmanager/manage/campaigns",
  linkedin: "https://www.linkedin.com/campaignmanager/accounts",
  tiktok: "https://ads.tiktok.com/i18n/creation/campaign",
  snapchat: "https://ads.snapchat.com/",
  x: "https://ads.x.com/",
  reddit: "https://ads.reddit.com/",
  quora: "https://ads.quora.com/",
  pinterest: "https://ads.pinterest.com/",
  youtube: "https://ads.google.com/aw/campaigns/new",
  microsoft_ads: "https://ads.microsoft.com/",
  whatsapp: "https://adsmanager.facebook.com/adsmanager/manage/campaigns",
};

export const buildCreativePayload = (ad: AdCampaign) =>
  [
    `Campaign: ${ad.name}`,
    `Objective: ${ad.objective}`,
    `Audience: ${ad.audience || "—"}`,
    `Budget: ${ad.budget} ${ad.currency}`,
    `Schedule: ${ad.startDate || "—"} → ${ad.endDate || "—"}`,
    "",
    `Headline: ${ad.headline}`,
    `Primary text: ${ad.primaryText}`,
    `CTA: ${ad.callToAction}`,
    `Landing URL: ${ad.landingUrl}`,
    ad.creativeUrl ? `Creative: ${ad.creativeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

// --------------------------------------------------------------------- store

const KEY = "nng.admin.social.adcampaigns.v1";

function readAll(): AdCampaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdCampaign[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: AdCampaign[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export const adCampaigns = {
  async list(channelId?: AdChannelId): Promise<AdCampaign[]> {
    const all = readAll();
    return channelId ? all.filter((a) => a.channelId === channelId) : all;
  },
  async save(ad: AdCampaign) {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === ad.id);
    if (idx >= 0) all[idx] = ad;
    else all.push(ad);
    writeAll(all);
    return ad;
  },
  async remove(id: string) {
    writeAll(readAll().filter((a) => a.id !== id));
  },
};
