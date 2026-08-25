/**
 * Provider-agnostic social publishing architecture.
 *
 * NOTHING here performs a real network publish. Each platform has an adapter
 * that declares whether an OAuth/API integration is connected. Until one is,
 * `publish()` returns a `not_connected` result and the admin UI says so
 * honestly instead of faking success.
 *
 * Adding a real provider later = implementing `publish()` in its adapter.
 * No admin UI changes are required.
 */

export const SOCIAL_PLATFORMS = [
  "linkedin",
  "github",
  "facebook",
  "reddit",
  "quora",
  "stackexchange",
  "glassdoor",
  "youtube",
  "instagram",
  "whatsapp",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  facebook: "Facebook",
  reddit: "Reddit",
  quora: "Quora",
  stackexchange: "Stack Exchange",
  glassdoor: "Glassdoor",
  youtube: "YouTube",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
};

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  handle: string;
  url: string;
  enabled: boolean;
  createdAt: string;
};

export type SocialPostStatus = "draft" | "scheduled" | "published" | "failed";

export type SocialContentType =
  | "engineering_article"
  | "project_launch"
  | "case_study"
  | "ai_news"
  | "technical_insight"
  | "portfolio_update"
  | "service_promotion"
  | "product_announcement"
  | "video"
  | "community_answer"
  | "career_update";

export const CONTENT_TYPES: { value: SocialContentType; label: string }[] = [
  { value: "engineering_article", label: "Engineering article" },
  { value: "project_launch", label: "Project launch" },
  { value: "case_study", label: "Case study" },
  { value: "ai_news", label: "AI news" },
  { value: "technical_insight", label: "Technical insight" },
  { value: "portfolio_update", label: "Portfolio update" },
  { value: "service_promotion", label: "Service promotion" },
  { value: "product_announcement", label: "Product announcement" },
  { value: "video", label: "Video" },
  { value: "community_answer", label: "Community answer" },
  { value: "career_update", label: "Career update" },
];

export const POST_TAGS = [
  "Engineering",
  "AI",
  "Backend",
  "Full-Stack",
  "Mobile",
  "Software Architecture",
  "SEO",
  "Marketing",
  "Business",
  "Portfolio",
] as const;

export type SocialPost = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  link: string;
  tags: string[];
  contentType: SocialContentType;
  campaign: string;
  publishAt: string;
  targets: SocialPlatform[];
  status: SocialPostStatus;
  createdAt: string;
};

export type PublishResult = {
  platform: SocialPlatform;
  outcome: "published" | "not_connected" | "failed";
  message: string;
  url?: string;
};

/**
 * Adapter contract. A future OAuth-backed provider implements `publish`
 * (and optionally `transform`) without touching the admin UI.
 */
export interface SocialProvider {
  platform: SocialPlatform;
  label: string;
  /** True only when a real API/OAuth integration exists for this platform. */
  connected: boolean;
  /** Platform-specific rendering of the same canonical post. */
  transform(post: SocialPost): string;
  publish(post: SocialPost): Promise<PublishResult>;
}

const notConnected = (
  platform: SocialPlatform,
  transform: (post: SocialPost) => string,
): SocialProvider => ({
  platform,
  label: PLATFORM_LABELS[platform],
  connected: false,
  transform,
  async publish() {
    return {
      platform,
      outcome: "not_connected",
      message: `${PLATFORM_LABELS[platform]} has no API connection yet. The post stays saved and ready for backend integration.`,
    };
  },
});

const short = (post: SocialPost, limit: number) => {
  const body = `${post.title}\n\n${post.content}`.trim();
  return body.length > limit ? `${body.slice(0, limit - 1)}…` : body;
};

const withLink = (text: string, post: SocialPost) => (post.link ? `${text}\n\n${post.link}` : text);

/** Platform-specific transformations — one canonical post, many voices. */
export const socialProviders: Record<SocialPlatform, SocialProvider> = {
  linkedin: notConnected("linkedin", (p) =>
    withLink(`${p.title}\n\n${p.content}`, p) + `\n\n${p.tags.map((t) => `#${t.replace(/[^A-Za-z]/g, "")}`).join(" ")}`,
  ),
  github: notConnected("github", (p) => `## ${p.title}\n\n${p.content}`),
  facebook: notConnected("facebook", (p) => withLink(short(p, 480), p)),
  reddit: notConnected("reddit", (p) => `**${p.title}**\n\n${p.content}\n\nDiscussion welcome.`),
  quora: notConnected("quora", (p) => `${p.content}\n\n— answered from practice.`),
  stackexchange: notConnected("stackexchange", (p) => `${p.content}\n\nReferences: ${p.link || "n/a"}`),
  glassdoor: notConnected("glassdoor", (p) => short(p, 600)),
  youtube: notConnected("youtube", (p) => withLink(`${p.title}\n\n${p.content}`, p)),
  instagram: notConnected("instagram", (p) => short(p, 300)),
  whatsapp: notConnected("whatsapp", (p) => withLink(short(p, 400), p)),
};

export const publishPost = async (post: SocialPost): Promise<PublishResult[]> =>
  Promise.all(post.targets.map((platform) => socialProviders[platform].publish(post)));
