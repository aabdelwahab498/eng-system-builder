/**
 * Profile overrides.
 *
 * The About page reads its copy from the canonical dictionaries. A published
 * `profile` entry in the admin CMS overrides those fields, so editing the
 * profile in the Admin Studio really changes the public profile content.
 * Empty fields fall back to the canonical value.
 */

import type { ContentItem, JsonObject, LocalizedText } from "./types";
import type { Locale } from "@/types/content";

export type ProfileOverrideData = {
  displayName: LocalizedText;
  positioning: LocalizedText;
  statement: LocalizedText;
  location: LocalizedText;
  shortBio: LocalizedText;
  longBio: LocalizedText;
};

export type ResolvedProfileOverride = {
  displayName?: string;
  positioning?: string;
  statement?: string;
  location?: string;
  shortBio?: string;
  longBio?: string;
};

const PROFILE_FIELDS = [
  "displayName",
  "positioning",
  "statement",
  "location",
  "shortBio",
  "longBio",
] as const;

const pick = (value: unknown, locale: Locale): string | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const v = value as { en?: unknown; ar?: unknown };
  const localized = locale === "ar" ? v.ar : v.en;
  const text = typeof localized === "string" ? localized.trim() : "";
  if (text) return text;
  const fallback = typeof v.en === "string" ? v.en.trim() : "";
  return fallback || undefined;
};

/** Resolve a published profile entry into plain strings for one locale. */
export function resolveProfileOverride(
  item: ContentItem | null | undefined,
  locale: Locale,
): ResolvedProfileOverride {
  if (!item || !item.visibility.public || item.state !== "published") return {};
  const data = item.data as JsonObject;
  const out: ResolvedProfileOverride = {};
  for (const field of PROFILE_FIELDS) {
    const value = pick(data[field], locale);
    if (value) out[field] = value;
  }
  return out;
}
