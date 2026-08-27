/**
 * Content API Adapter for Portfolio Backend Integration (Phase 1)
 *
 * Provides typed backend endpoints integration with automatic, zero-downtime,
 * silent static fallback to canonical content files.
 */

import type { Locale, Project } from "@/types/content";
import type {
  CanonicalProject,
  CanonicalProfile,
  Experience,
  Education,
  Certification,
  SkillGroup,
  CanonicalService,
  CanonicalProduct,
  Course,
} from "./schema";
import {
  getCanonicalProjects as getStaticProjects,
  getCanonicalProfile as getStaticProfile,
  getCanonicalExperience as getStaticExperience,
  getCanonicalEducation as getStaticEducation,
  getCanonicalCertifications as getStaticCertifications,
  getCanonicalSkills as getStaticSkills,
  getCanonicalServices as getStaticServices,
  getCanonicalProducts as getStaticProducts,
  getCourses as getStaticCourses,
  getProjects as getLegacyStaticProjects,
} from "./api";
import { fetchFromPortfolioApi, getApiBaseUrl } from "./api-client";
import {
  mapProjectDtoToCanonical,
  mapProjectDtoToLegacy,
  mapExperienceDto,
  mapEducationDto,
  mapCertificationDto,
  mapSkillGroupDto,
  mapServiceDtoToCanonical,
  mapProductDtoToCanonical,
  mapCourseDto,
  type BackendProjectDto,
  type BackendExperienceDto,
  type BackendEducationDto,
  type BackendCertificationDto,
  type BackendSkillGroupDto,
  type BackendProductDto,
  type BackendServiceDto,
  type BackendCourseDto,
} from "./api-mappers";

// In-memory cache for synchronous accessors after pre-warming
const cache = {
  projects: new Map<string, Project[]>(),
  canonicalProjects: new Map<string, CanonicalProject[]>(),
};

/** Checks whether backend integration is active & configured */
export function isBackendApiEnabled(): boolean {
  return getApiBaseUrl() !== null;
}

/** Pre-warms the cache asynchronously in background if backend API is enabled */
export async function prewarmApiCache(locale: Locale = "en"): Promise<void> {
  if (!isBackendApiEnabled()) return;
  await fetchCanonicalProjects(locale);
}

/** Fetch Projects from Backend API with Static Fallback */
export async function fetchCanonicalProjects(locale: Locale): Promise<CanonicalProject[]> {
  const result = await fetchFromPortfolioApi<BackendProjectDto[]>("/projects", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    const canonicalList = result.data.map(mapProjectDtoToCanonical);
    const legacyList = result.data.map(mapProjectDtoToLegacy);

    cache.canonicalProjects.set(locale, canonicalList);
    cache.projects.set(locale, legacyList);

    return canonicalList;
  }

  return getStaticProjects(locale);
}

/** Fetch Single Project by Slug from Backend API with Static Fallback */
export async function fetchCanonicalProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<CanonicalProject | undefined> {
  const result = await fetchFromPortfolioApi<BackendProjectDto>(
    `/projects/${encodeURIComponent(slug)}`,
    {
      locale,
    },
  );
  if (result.ok && result.data) {
    return mapProjectDtoToCanonical(result.data);
  }

  const list = await fetchCanonicalProjects(locale);
  return list.find((p) => p.slug === slug);
}

/** Fetch Profile from Backend API with Static Fallback */
export async function fetchCanonicalProfile(locale: Locale): Promise<CanonicalProfile | undefined> {
  const result = await fetchFromPortfolioApi<Record<string, unknown>>("/profile", { locale });
  if (result.ok && result.data) {
    const staticProf = getStaticProfile(locale);
    if (!staticProf) return undefined;
    const identity = result.data.identity as { displayName?: string } | undefined;
    const positioning = result.data.positioning as { shortHeadline?: string } | undefined;
    return {
      ...staticProf,
      displayName: identity?.displayName ?? staticProf.displayName,
      headline: positioning?.shortHeadline ?? staticProf.headline,
    };
  }

  return getStaticProfile(locale);
}

/** Fetch Experience from Backend API with Static Fallback */
export async function fetchExperience(locale: Locale): Promise<Experience[]> {
  const result = await fetchFromPortfolioApi<BackendExperienceDto[]>("/experience", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapExperienceDto);
  }

  return getStaticExperience(locale);
}

/** Fetch Education from Backend API with Static Fallback */
export async function fetchEducation(locale: Locale): Promise<Education[]> {
  const result = await fetchFromPortfolioApi<BackendEducationDto[]>("/education", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapEducationDto);
  }

  return getStaticEducation(locale);
}

/** Fetch Certifications from Backend API with Static Fallback */
export async function fetchCertifications(locale: Locale): Promise<Certification[]> {
  const result = await fetchFromPortfolioApi<BackendCertificationDto[]>("/certifications", {
    locale,
  });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapCertificationDto);
  }

  return getStaticCertifications(locale);
}

/** Fetch Skill Groups from Backend API with Static Fallback */
export async function fetchSkillGroups(locale: Locale): Promise<SkillGroup[]> {
  const result = await fetchFromPortfolioApi<BackendSkillGroupDto[]>("/skills", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapSkillGroupDto);
  }

  return getStaticSkills(locale);
}

/** Fetch Services from Backend API with Static Fallback */
export async function fetchCanonicalServices(locale: Locale): Promise<CanonicalService[]> {
  const result = await fetchFromPortfolioApi<BackendServiceDto[]>("/services", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapServiceDtoToCanonical);
  }

  return getStaticServices(locale);
}

/** Fetch Products from Backend API with Static Fallback */
export async function fetchCanonicalProducts(locale: Locale): Promise<CanonicalProduct[]> {
  const result = await fetchFromPortfolioApi<BackendProductDto[]>("/products", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapProductDtoToCanonical);
  }

  return getStaticProducts(locale);
}

/** Fetch Courses from Backend API with Static Fallback */
export async function fetchCourses(locale: Locale): Promise<Course[]> {
  const result = await fetchFromPortfolioApi<BackendCourseDto[]>("/courses", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapCourseDto);
  }

  return getStaticCourses(locale);
}

/** Synchronous getter helper for existing UI components with cached backend data or static fallback */
export function getAdapterProjects(locale: Locale): Project[] {
  const cached = cache.projects.get(locale);
  if (cached && cached.length > 0) {
    return cached;
  }

  // Trigger background pre-warm without blocking UI thread
  void fetchCanonicalProjects(locale);

  return getLegacyStaticProjects(locale);
}
