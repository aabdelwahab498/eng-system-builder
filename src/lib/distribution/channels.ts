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
    id: "linkedin",
    label: "LinkedIn",
    surface: "article",
    policy: "open",
    submitUrl: "https://www.linkedin.com/post/new/",
    note: "Full articles and posts with links are welcome.",
  },
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

const KEY = "nng.admin.distribution.v1";

type Store = Record<string, ChannelRecord[]>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export const distributionLog = {
  get(entryId: string): ChannelRecord[] {
    return read()[entryId] ?? [];
  },
  set(entryId: string, record: ChannelRecord) {
    const store = read();
    const existing = (store[entryId] ?? []).filter((r) => r.channelId !== record.channelId);
    store[entryId] = [...existing, record];
    write(store);
  },
  clear(entryId: string, channelId: string) {
    const store = read();
    store[entryId] = (store[entryId] ?? []).filter((r) => r.channelId !== channelId);
    write(store);
  },
};
