/**
 * Projects-Only API Adapter Hook & Cache Layer
 */

import type { Locale, Project } from "@/types/content";
import type { CanonicalProject } from "./schema";
import { isPublishable } from "./schema";
import { projects as staticCanonicalProjects } from "./canonical/projects";
import { fetchProjectsFromApi, getApiBaseUrl } from "./projects-api-client";
import {
  type BackendProjectDto,
  mapProjectDtoToCanonical,
  mapProjectDtoToLegacy,
} from "./projects-api-mapper";

interface ProjectsCacheEntry {
  canonical: CanonicalProject[];
  legacy: Project[];
  timestamp: number;
}

const projectsCache = new Map<string, ProjectsCacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const isProjectsApiEnabled = (): boolean => getApiBaseUrl() !== null;

export async function fetchCanonicalProjectsApi(locale: Locale): Promise<CanonicalProject[]> {
  const cached = projectsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.canonical;
  }

  const result = await fetchProjectsFromApi<BackendProjectDto[]>("/projects", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    const canonical = result.data.map(mapProjectDtoToCanonical);
    const legacy = result.data.map(mapProjectDtoToLegacy);

    projectsCache.set(locale, {
      canonical,
      legacy,
      timestamp: Date.now(),
    });

    return canonical;
  }

  return staticCanonicalProjects.filter(isPublishable);
}

export function getProjectsApiLegacy(locale: Locale): Project[] | null {
  const cached = projectsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.legacy;
  }
  return null;
}
