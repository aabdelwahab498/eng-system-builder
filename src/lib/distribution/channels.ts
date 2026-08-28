/**
 * Audience distribution catalogue.
 *
 * "Publish to audience" is an *assisted manual* workflow: nothing here posts
 * on the user's behalf (none of these platforms is API-connected yet). Each
 * channel declares where the content goes, whether that platform actually
 * accepts this kind of content, and a deep link to its submit/upload screen.
 * The admin marks each channel as published individually — never all at once.
 */

export type DistributionSurface = "code" | "article" | "image" | "video";

export type DistributionPolicy =
  /** Direct self-publishing is allowed. */
  | "open"
  /** Allowed, but submissions are curated/reviewed before going live. */
  | "curated"
  /** Promotional posting is not allowed; only contextual answers/discussion. */
  | "restricted";

export type DistributionChannel = {
  id: string;
  label: string;
  surface: DistributionSurface;
  policy: DistributionPolicy;
  /** Deep link to the platform's "new post / upload / new repo" screen. */
  submitUrl: string;
  /** Honest, short note about what this platform accepts. */
  note: string;
};

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  /* ------------------------------------------------------------ code */
  {
    id: "github",
    label: "GitHub",
    surface: "code",
    policy: "open",
    submitUrl: "https://github.com/new",
    note: "Publish the project repository, README and release notes.",
  },
  {
    id: "gitlab",
    label: "GitLab",
    surface: "code",
    policy: "open",
    submitUrl: "https://gitlab.com/projects/new",
    note: "Mirror the repository and CI pipelines.",
  },

  /* --------------------------------------------------------- articles */
  {
    id: "medium",
    label: "Medium",
    surface: "article",
    policy: "open",
    submitUrl: "https://medium.com/new-story",
    note: "Long-form republish — set the canonical URL back to the site.",
  },
  {
    id: "devto",
    label: "DEV.to",
    surface: "article",
    policy: "open",
    submitUrl: "https://dev.to/new",
    note: "Developer audience; supports canonical_url for SEO safety.",
  },
  {
    id: "hashnode",
    label: "Hashnode",
    surface: "article",
    policy: "open",
    submitUrl: "https://hashnode.com/create/story",
    note: "Engineering blog network with canonical support.",
  },
  {
    id: "facebook",
    label: "Facebook",
    surface: "article",
    policy: "open",
    submitUrl: "https://www.facebook.com/",
    note: "Short teaser + link works better than the full article.",
  },
  {
    id: "reddit",
    label: "Reddit",
    surface: "article",
    policy: "restricted",
    submitUrl: "https://www.reddit.com/submit",
    note: "Subreddit rules apply — self-promotion is often removed. Post as a technical discussion.",
  },
  {
    id: "quora",
    label: "Quora",
    surface: "article",
    policy: "restricted",
    submitUrl: "https://www.quora.com/",
    note: "No promo posts: answer a real question and reference the article.",
  },
  {
    id: "stackexchange",
    label: "Stack Exchange",
    surface: "article",
    policy: "restricted",
    submitUrl: "https://stackexchange.com/",
    note: "Answers only. Link is allowed just as a disclosed reference.",
  },
  {
    id: "glassdoor",
    label: "Glassdoor",
    surface: "article",
    policy: "restricted",
    submitUrl: "https://www.glassdoor.com/",
    note: "Company/career context only — not a technical publishing surface.",
  },

  /* ----------------------------------------------------------- images */
  {
    id: "unsplash",
    label: "Unsplash",
    surface: "image",
    policy: "curated",
    submitUrl: "https://unsplash.com/submit",
    note: "High-resolution originals, reviewed by editors before going live.",
  },
  {
    id: "pexels",
    label: "Pexels",
    surface: "image",
    policy: "curated",
    submitUrl: "https://www.pexels.com/upload/",
    note: "Contributor uploads, reviewed and distributed to a large audience.",
  },
  {
    id: "pixabay",
    label: "Pixabay",
    surface: "image",
    policy: "curated",
    submitUrl: "https://pixabay.com/accounts/upload/",
    note: "Accepts photos, illustrations and video clips.",
  },
  {
    id: "flickr",
    label: "Flickr",
    surface: "image",
    policy: "open",
    submitUrl: "https://www.flickr.com/photos/upload/",
    note: "Build a personal creative gallery with an engaged community.",
  },

  /* ----------------------------------------------------------- videos */
  {
    id: "youtube",
    label: "YouTube",
    surface: "video",
    policy: "open",
    submitUrl: "https://studio.youtube.com/channel/UC/videos/upload",
    note: "Largest reach; long-form and Shorts monetisation.",
  },
  {
    id: "tiktok",
    label: "TikTok",
    surface: "video",
    policy: "open",
    submitUrl: "https://www.tiktok.com/upload",
    note: "Short creative clips; rewards, live gifts and brand deals.",
  },
  {
    id: "facebook_video",
    label: "Facebook",
    surface: "video",
    policy: "open",
    submitUrl: "https://www.facebook.com/",
    note: "In-stream ads on reels, stories and live video.",
  },
  {
    id: "instagram",
    label: "Instagram",
    surface: "video",
    policy: "open",
    submitUrl: "https://www.instagram.com/",
    note: "Reels and stories; bonus programs for original content.",
  },
  {
    id: "vimeo",
    label: "Vimeo",
    surface: "video",
    policy: "open",
    submitUrl: "https://vimeo.com/upload",
    note: "Professional showcase; sell or rent work via Vimeo On Demand.",
  },
];

export const channelsForSurface = (surface: DistributionSurface) =>
  DISTRIBUTION_CHANNELS.filter((c) => c.surface === surface);

/** Which distribution surface a CMS entry belongs to. */
export function surfaceFor(kind: string, mediaType?: string): DistributionSurface | null {
  if (kind === "project" || kind === "product") return "code";
  if (kind === "article") return "article";
  if (kind === "gallery_item") return mediaType === "video" ? "video" : "image";
  return null;
}

export const POLICY_LABEL: Record<DistributionPolicy, string> = {
  open: "Self-publish",
  curated: "Reviewed",
  restricted: "Rules apply",
};

/* ------------------------------------------------- per-entry publish log */

export type ChannelRecord = {
  channelId: string;
  status: "published" | "queued";
  url: string;
  at: string;
};

function getBackendUrl(): string {
  const url = process.env["VITE_PORTFOLIO_API_URL"] || process.env["PORTFOLIO_API_URL"] || "";
  return url.trim().replace(/\/+$/, "");
}

type Store = Record<string, ChannelRecord[]>;
type AllowStore = Record<string, string[]>;

let memoryStore: Store = {};
let memoryAllowStore: AllowStore = {};
let isLoaded = false;

async function syncFromBackend() {
  if (isLoaded) return;
  const apiBase = getBackendUrl();
  const url = `${apiBase}/api/v1/admin/distribution`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.distributionJson) {
        const parsed = JSON.parse(json.data.distributionJson);
        memoryStore = parsed.log ?? {};
        memoryAllowStore = parsed.allow ?? {};
      }
    }
  } catch {
    // fallback
  }

  // One-time legacy localStorage backfill
  if (typeof window !== "undefined") {
    const legacyLog = window.localStorage.getItem("nng.admin.distribution.v1");
    const legacyAllow = window.localStorage.getItem("nng.admin.distribution.allow.v1");
    if (legacyLog || legacyAllow) {
      if (legacyLog) {
        try {
          memoryStore = { ...memoryStore, ...JSON.parse(legacyLog) };
        } catch {
          // Ignore invalid JSON in legacy localStorage
        }
        window.localStorage.removeItem("nng.admin.distribution.v1");
      }
      if (legacyAllow) {
        try {
          memoryAllowStore = { ...memoryAllowStore, ...JSON.parse(legacyAllow) };
        } catch {
          // Ignore invalid JSON in legacy localStorage
        }
        window.localStorage.removeItem("nng.admin.distribution.allow.v1");
      }
      await saveToBackend();
    }
  }

  isLoaded = true;
}

async function saveToBackend() {
  const apiBase = getBackendUrl();
  const url = `${apiBase}/api/v1/admin/distribution`;
  const payload = JSON.stringify({ log: memoryStore, allow: memoryAllowStore });
  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ distributionJson: payload }),
  }).catch(() => null);
}

export const distributionLog = {
  get(entryId: string): ChannelRecord[] {
    if (!isLoaded) syncFromBackend();
    return memoryStore[entryId] ?? [];
  },
  set(entryId: string, record: ChannelRecord) {
    if (!isLoaded) syncFromBackend();
    const existing = (memoryStore[entryId] ?? []).filter((r) => r.channelId !== record.channelId);
    memoryStore[entryId] = [...existing, record];
    saveToBackend();
  },
  clear(entryId: string, channelId: string) {
    if (!isLoaded) syncFromBackend();
    memoryStore[entryId] = (memoryStore[entryId] ?? []).filter((r) => r.channelId !== channelId);
    saveToBackend();
  },
  migrate(fromId: string, toId: string) {
    if (!isLoaded) syncFromBackend();
    if (!memoryStore[fromId] || fromId === toId) return;
    memoryStore[toId] = memoryStore[fromId];
    delete memoryStore[fromId];
    saveToBackend();
  },
};

/* --------------------------------------------- per-entry channel permissions */

export const channelPermissions = {
  get(entryId: string): string[] | null {
    if (!isLoaded) syncFromBackend();
    return memoryAllowStore[entryId] ?? null;
  },
  set(entryId: string, channelId: string, allowed: boolean, surface: DistributionSurface) {
    if (!isLoaded) syncFromBackend();
    const current = memoryAllowStore[entryId] ?? channelsForSurface(surface).map((c) => c.id);
    memoryAllowStore[entryId] = allowed
      ? Array.from(new Set([...current, channelId]))
      : current.filter((id) => id !== channelId);
    saveToBackend();
    return memoryAllowStore[entryId];
  },
  migrate(fromId: string, toId: string) {
    if (!isLoaded) syncFromBackend();
    if (!memoryAllowStore[fromId] || fromId === toId) return;
    memoryAllowStore[toId] = memoryAllowStore[fromId];
    delete memoryAllowStore[fromId];
    saveToBackend();
  },
};

/** Stable key for an entry that has not been saved yet. */
export const draftEntryKey = (kind: string, mediaType?: string) =>
  `draft:${kind}:${mediaType ?? "default"}`;
