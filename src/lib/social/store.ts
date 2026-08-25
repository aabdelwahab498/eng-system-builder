/**
 * Local repositories for social accounts and posts (frontend-only V1).
 *
 * Same contract style as `@/lib/admin/crm`: the UI talks to these interfaces so
 * an API implementation can replace the local-storage adapter with no UI change.
 */

import {
  SOCIAL_PLATFORMS,
  type SocialAccount,
  type SocialPlatform,
  type SocialPost,
} from "./providers";

const id = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

const ACCOUNTS_KEY = "nng.admin.social.accounts.v1";
const POSTS_KEY = "nng.admin.social.posts.v1";

const DEFAULT_URLS: Partial<Record<SocialPlatform, string>> = {
  linkedin: "https://www.linkedin.com/in/ahmed-abdelwahab-5686102aa/",
  youtube: "https://www.youtube.com/@MADO674/videos",
  whatsapp: "https://api.whatsapp.com/send?phone=201105725029",
};

const defaultAccounts = (): SocialAccount[] =>
  SOCIAL_PLATFORMS.map((platform) => ({
    id: `acc_${platform}`,
    platform,
    handle: "",
    url: DEFAULT_URLS[platform] ?? "",
    enabled: Boolean(DEFAULT_URLS[platform]),
    createdAt: new Date(0).toISOString(),
  }));

export const socialAccounts = {
  async list(): Promise<SocialAccount[]> {
    const stored = read<SocialAccount[]>(ACCOUNTS_KEY, []);
    if (stored.length === 0) return defaultAccounts();
    const map = new Map(stored.map((a) => [a.platform, a]));
    return defaultAccounts().map((base) => map.get(base.platform) ?? base);
  },
  async save(accounts: SocialAccount[]) {
    write(ACCOUNTS_KEY, accounts);
  },
};

export const socialPosts = {
  async list(): Promise<SocialPost[]> {
    return read<SocialPost[]>(POSTS_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async create(input: Omit<SocialPost, "id" | "createdAt">): Promise<SocialPost> {
    const post: SocialPost = { ...input, id: id("post"), createdAt: new Date().toISOString() };
    write(POSTS_KEY, [post, ...read<SocialPost[]>(POSTS_KEY, [])]);
    return post;
  },
  async update(postId: string, patch: Partial<SocialPost>) {
    write(
      POSTS_KEY,
      read<SocialPost[]>(POSTS_KEY, []).map((p) => (p.id === postId ? { ...p, ...patch } : p)),
    );
  },
  async remove(postId: string) {
    write(
      POSTS_KEY,
      read<SocialPost[]>(POSTS_KEY, []).filter((p) => p.id !== postId),
    );
  },
};
