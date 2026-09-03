/**
 * Profile-Only API Adapter & Cache Layer
 */

import type { Locale, Profile } from "@/types/content";
import { getContent } from "./index";
import { fetchProjectsFromApi } from "./projects-api-client";

export interface BackendProfileDto {
  identity: {
    displayName: string;
    professionalName?: string;
    shortName?: string;
    monogram?: string;
  };
  positioning: {
    primaryTitle?: { en: string; ar: string } | string;
    shortHeadline?: { en: string; ar: string } | string;
  };
  location?: {
    city?: string;
    country?: string;
    remote?: boolean;
  };
}

const profileCache = new Map<string, Profile>();
const CACHE_TTL_MS = 60 * 1000;
let lastProfileFetchTime = 0;

export async function fetchProfileApi(locale: Locale): Promise<Profile> {
  const cached = profileCache.get(locale);
  if (cached && Date.now() - lastProfileFetchTime < CACHE_TTL_MS) {
    return cached;
  }

  const staticProfile = getContent(locale).profile;
  const result = await fetchProjectsFromApi<BackendProfileDto>("/profile", { locale });

  if (result.ok && result.data && result.data.identity) {
    const rawPos = result.data.positioning?.primaryTitle;
    const titleText =
      typeof rawPos === "object" && rawPos !== null
        ? locale === "ar"
          ? rawPos.ar
          : rawPos.en
        : typeof rawPos === "string"
          ? rawPos
          : staticProfile.positioning;

    const mergedProfile: Profile = {
      ...staticProfile,
      displayName: result.data.identity.displayName || staticProfile.displayName,
      positioning: titleText || staticProfile.positioning,
    };

    profileCache.set(locale, mergedProfile);
    lastProfileFetchTime = Date.now();
    return mergedProfile;
  }

  return staticProfile;
}

export function getProfileApiCached(locale: Locale): Profile | null {
  const cached = profileCache.get(locale);
  if (cached && Date.now() - lastProfileFetchTime < CACHE_TTL_MS) {
    return cached;
  }
  return null;
}
