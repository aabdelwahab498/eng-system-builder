/**
 * Courses-Only API Adapter & Cache Layer
 */

import type { Course } from "./canonical/courses";
import { courses as staticCourses } from "./canonical/courses";
import { fetchProjectsFromApi } from "./projects-api-client";

export interface BackendCourseDto {
  id: string;
  slug: string;
  title: string;
  order: number;
  url?: string;
}

let coursesCache: Course[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export function mapCourseDtoToCanonical(dto: BackendCourseDto): Course {
  return {
    id: dto.id,
    slug: dto.slug,
    icon: "book-open",
    level: "intermediate",
    ready: true,
    order: dto.order ?? 1,
    title: { en: dto.title, ar: null },
    summary: { en: dto.title, ar: null },
    description: { en: dto.title, ar: null },
    keywords: { en: [], ar: null },
  };
}

export async function fetchCoursesApi(locale: string = "en"): Promise<Course[]> {
  if (coursesCache && Date.now() - lastFetchTime < CACHE_TTL_MS) {
    return coursesCache;
  }

  const result = await fetchProjectsFromApi<BackendCourseDto[]>("/courses", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    coursesCache = result.data.map(mapCourseDtoToCanonical);
    lastFetchTime = Date.now();
    return coursesCache;
  }

  return staticCourses;
}

export function getCoursesApiCached(): Course[] | null {
  if (coursesCache && Date.now() - lastFetchTime < CACHE_TTL_MS) {
    return coursesCache;
  }
  return null;
}
