/**
 * Advertising channels, tracking pixels and campaign types.
 *
 * Frontend-only registry (same contract style as `./store`): each channel
 * declares whether the platform actually offers a tracking pixel/tag, which
 * identifiers it needs, and where the snippet is meant to be installed.
 * Channels without a pixel are declared honestly instead of inventing one.
 */

export type AdPlacement = "head" | "body_start" | "body_end";

export const AD_PLACEMENTS: { value: AdPlacement; label: string }[] = [
  { value: "head", label: "<head> — before </head>" },
  { value: "body_start", label: "<body> — right after opening tag" },
  { value: "body_end", label: "<body> — before </body>" },
];

export type CampaignObjective =
  | "awareness"
  | "traffic"
  | "engagement"
  | "leads"
  | "conversions"
  | "app_installs"
  | "video_views"
  | "retargeting";

export const CAMPAIGN_OBJECTIVES: { value: CampaignObjective; label: string }[] = [
  { value: "awareness", label: "Brand awareness" },
  { value: "traffic", label: "Traffic" },
  { value: "engagement", label: "Engagement" },
  { value: "leads", label: "Lead generation" },
  { value: "conversions", label: "Conversions / sales" },
  { value: "app_installs", label: "App installs" },
  { value: "video_views", label: "Video views" },
  { value: "retargeting", label: "Retargeting" },
];

export type AdChannelId =
  | "google_ads"
  | "google_analytics"
  | "meta"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "snapchat"
  | "x"
  | "reddit"
  | "quora"
  | "pinterest"
  | "youtube"
  | "microsoft_ads"
  | "whatsapp"
  | "github"
  | "stackexchange"
  | "glassdoor";

export type AdChannelSpec = {
  id: AdChannelId;
  label: string;
  /** False when the platform provides no first-party website pixel/tag. */
  hasPixel: boolean;
  /** Why a pixel is unavailable — shown in the UI for honesty. */
  pixelNote?: string;
  /** Label + placeholder of the primary identifier. */
  idLabel: string;
  idPlaceholder: string;
  /** Optional secondary identifier (conversion label, event key…). */
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  defaultPlacement: AdPlacement;
  docsUrl?: string;
  /** Produces the install snippet for a configured id. */
  snippet?: (id: string, secondary?: string) => string;
};

export const AD_CHANNELS: AdChannelSpec[] = [
  {
    id: "google_ads",
    label: "Google Ads",
    hasPixel: true,
    idLabel: "Conversion ID (AW-…)",
    idPlaceholder: "AW-123456789",
    secondaryLabel: "Conversion label",
    secondaryPlaceholder: "AbC-D_efG-h12_34-567",
    defaultPlacement: "head",
    docsUrl: "https://support.google.com/google-ads/answer/6095821",
    snippet: (id) =>
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${id}');\n</script>`,
  },
  {
    id: "google_analytics",
    label: "Google Analytics 4",
    hasPixel: true,
    idLabel: "Measurement ID (G-…)",
    idPlaceholder: "G-XXXXXXXXXX",
    defaultPlacement: "head",
    docsUrl: "https://support.google.com/analytics/answer/9539598",
    snippet: (id) =>
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${id}');\n</script>`,
  },
  {
    id: "meta",
    label: "Meta / Facebook",
    hasPixel: true,
    idLabel: "Meta Pixel ID",
    idPlaceholder: "1234567890123456",
    defaultPlacement: "head",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
    snippet: (id) =>
      `<script>\n  !function(f,b,e,v,n,t,s){/* Meta Pixel base code */}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\n  fbq('init', '${id}');\n  fbq('track', 'PageView');\n</script>`,
  },
  {
    id: "instagram",
    label: "Instagram",
    hasPixel: false,
    pixelNote: "Instagram ads are tracked by the Meta Pixel — configure Meta above.",
    idLabel: "Ad account ID",
    idPlaceholder: "act_123456789",
    defaultPlacement: "head",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    hasPixel: true,
    idLabel: "Partner ID",
    idPlaceholder: "1234567",
    secondaryLabel: "Conversion ID",
    secondaryPlaceholder: "9876543",
    defaultPlacement: "body_end",
    docsUrl: "https://www.linkedin.com/help/lms/answer/a418880",
    snippet: (id) =>
      `<script type="text/javascript">\n  _linkedin_partner_id = "${id}";\n  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];\n  window._linkedin_data_partner_ids.push(_linkedin_partner_id);\n</script>\n<script async src="https://snap.licdn.com/li.lms-analytics/insight.min.js"></script>`,
  },
  {
    id: "tiktok",
    label: "TikTok",
    hasPixel: true,
    idLabel: "Pixel ID",
    idPlaceholder: "C4A1B2C3D4E5F6",
    defaultPlacement: "head",
    docsUrl: "https://ads.tiktok.com/help/article/get-started-pixel",
    snippet: (id) =>
      `<script>\n  !function(w,d,t){/* TikTok Pixel base code */}(window,document,'ttq');\n  ttq.load('${id}');\n  ttq.page();\n</script>`,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    hasPixel: true,
    idLabel: "Pixel ID",
    idPlaceholder: "00000000-0000-0000-0000-000000000000",
    defaultPlacement: "head",
    docsUrl: "https://businesshelp.snapchat.com/s/article/snap-pixel-about",
    snippet: (id) =>
      `<script type="text/javascript">\n  (function(e,t,n){/* Snap Pixel base code */})(window,document,'https://sc-static.net/scevent.min.js');\n  snaptr('init', '${id}');\n  snaptr('track', 'PAGE_VIEW');\n</script>`,
  },
  {
    id: "x",
    label: "X (Twitter)",
    hasPixel: true,
    idLabel: "Pixel ID",
    idPlaceholder: "o1abc",
    secondaryLabel: "Event ID",
    secondaryPlaceholder: "tw-o1abc-o1xyz",
    defaultPlacement: "head",
    docsUrl:
      "https://business.x.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites",
    snippet: (id) =>
      `<script>\n  !function(e,t,n,s,u,a){/* X Pixel base code */}(window,document,'script');\n  twq('config','${id}');\n</script>`,
  },
  {
    id: "reddit",
    label: "Reddit",
    hasPixel: true,
    idLabel: "Advertiser ID",
    idPlaceholder: "t2_abc123",
    defaultPlacement: "head",
    docsUrl: "https://business.reddithelp.com/helpcenter/s/article/Install-the-Reddit-Pixel",
    snippet: (id) =>
      `<script>\n  !function(w,d){/* Reddit Pixel base code */}(window,document);\n  rdt('init','${id}');\n  rdt('track','PageVisit');\n</script>`,
  },
  {
    id: "quora",
    label: "Quora",
    hasPixel: true,
    idLabel: "Pixel ID",
    idPlaceholder: "abcdef1234567890",
    defaultPlacement: "head",
    docsUrl: "https://business.quora.com/docs/quora-pixel",
    snippet: (id) =>
      `<script>\n  !function(q,e,v,n,t,s){/* Quora Pixel base code */}(window,document,'script');\n  qp('init','${id}');\n  qp('track','ViewContent');\n</script>`,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    hasPixel: true,
    idLabel: "Tag ID",
    idPlaceholder: "2612345678901",
    defaultPlacement: "head",
    docsUrl: "https://help.pinterest.com/en/business/article/install-the-pinterest-tag",
    snippet: (id) =>
      `<script>\n  !function(e){/* Pinterest Tag base code */}(window);\n  pintrk('load','${id}');\n  pintrk('page');\n</script>`,
  },
  {
    id: "youtube",
    label: "YouTube",
    hasPixel: false,
    pixelNote: "YouTube campaigns run inside Google Ads — use the Google Ads tag above.",
    idLabel: "Linked Google Ads account",
    idPlaceholder: "123-456-7890",
    defaultPlacement: "head",
  },
  {
    id: "microsoft_ads",
    label: "Microsoft Ads (Bing)",
    hasPixel: true,
    idLabel: "UET Tag ID",
    idPlaceholder: "12345678",
    defaultPlacement: "head",
    docsUrl: "https://help.ads.microsoft.com/#apex/ads/en/56684",
    snippet: (id) =>
      `<script>\n  (function(w,d,t,r,u){/* Microsoft UET base code */})(window,document,'script','//bat.bing.com/bat.js','uetq');\n  window.uetq = window.uetq || [];\n  uetq.push('config', { ti: '${id}' });\n</script>`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hasPixel: false,
    pixelNote:
      "No website pixel. Click-to-WhatsApp ads are measured inside Meta Ads Manager — track the click as a Meta Pixel event.",
    idLabel: "Business number",
    idPlaceholder: "201105725029",
    defaultPlacement: "head",
  },
  {
    id: "github",
    label: "GitHub",
    hasPixel: false,
    pixelNote: "No advertising platform and no pixel. Organic distribution only.",
    idLabel: "Profile / org",
    idPlaceholder: "nextnext-gen",
    defaultPlacement: "head",
  },
  {
    id: "stackexchange",
    label: "Stack Exchange",
    hasPixel: false,
    pixelNote: "No self-serve pixel. Stack Overflow ads are sold direct and measured by them.",
    idLabel: "Profile",
    idPlaceholder: "stackoverflow.com/users/…",
    defaultPlacement: "head",
  },
  {
    id: "glassdoor",
    label: "Glassdoor",
    hasPixel: false,
    pixelNote: "No public website pixel — employer branding campaigns report inside Glassdoor.",
    idLabel: "Employer profile",
    idPlaceholder: "glassdoor.com/Overview/…",
    defaultPlacement: "head",
  },
];

export type AdChannelConfig = {
  channelId: AdChannelId;
  enabled: boolean;
  pixelId: string;
  secondaryId: string;
  placement: AdPlacement;
  objective: CampaignObjective;
  landingUrl: string;
  budget: string;
  notes: string;
};

export const defaultAdConfig = (spec: AdChannelSpec): AdChannelConfig => ({
  channelId: spec.id,
  enabled: false,
  pixelId: "",
  secondaryId: "",
  placement: spec.defaultPlacement,
  objective: "traffic",
  landingUrl: "",
  budget: "",
  notes: "",
});

const ADS_KEY = "nng.admin.social.ads.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const adChannels = {
  async list(): Promise<AdChannelConfig[]> {
    const stored = read<AdChannelConfig[]>(ADS_KEY, []);
    const map = new Map(stored.map((c) => [c.channelId, c]));
    return AD_CHANNELS.map((spec) => ({ ...defaultAdConfig(spec), ...(map.get(spec.id) ?? {}) }));
  },
  async save(configs: AdChannelConfig[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ADS_KEY, JSON.stringify(configs));
  },
};

export const buildSnippet = (spec: AdChannelSpec, config: AdChannelConfig): string =>
  spec.snippet && config.pixelId ? spec.snippet(config.pixelId, config.secondaryId) : "";
