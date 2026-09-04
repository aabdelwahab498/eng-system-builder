/**
 * Minimal API wiring bootstrap.
 *
 * Warms the existing per-module adapter caches (projects, services, products,
 * courses, profile) for the active locale on the client, then bumps a version
 * counter so the locale subtree re-renders with API-backed content.
 *
 * Every adapter already falls back to the static canonical content when the
 * API is unreachable, so behaviour is unchanged when the backend is offline.
 */

import { useEffect, useState } from "react";
import type { Locale } from "@/types/content";

import { fetchCanonicalProjectsApi } from "./projects-api-adapter";
import { fetchCanonicalServicesApi } from "./services-api-adapter";
import { fetchCanonicalProductsApi } from "./products-api-adapter";
import { fetchCoursesApi } from "./courses-api-adapter";
import { fetchProfileApi } from "./profile-api-adapter";
import { fetchCmsPublicContent } from "./cms-public-adapter";
import { getApiBaseUrl } from "./projects-api-client";

const warmed = new Set<Locale>();

export async function warmApiContent(locale: Locale): Promise<void> {
  await Promise.allSettled([
    fetchCmsPublicContent(locale),
    fetchCanonicalProjectsApi(locale),
    fetchCanonicalServicesApi(locale),
    fetchCanonicalProductsApi(locale),
    fetchCoursesApi(locale),
    fetchProfileApi(locale),
  ]);
}

/**
 * Returns a version token that changes once the API caches are warm.
 */
export function useApiContentBootstrap(locale: Locale): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getApiBaseUrl() === null) return;
    if (warmed.has(locale)) return;

    let active = true;
    warmed.add(locale);
    void warmApiContent(locale).then(() => {
      if (active) setVersion((v) => v + 1);
    });

    return () => {
      active = false;
    };
  }, [locale]);

  return version;
}
