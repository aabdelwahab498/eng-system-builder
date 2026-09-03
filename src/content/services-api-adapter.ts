/**
 * Services-Only API Adapter & Cache Layer
 */

import type { Locale, Service } from "@/types/content";
import type { CanonicalService } from "./schema";
import { services as staticCanonicalServices } from "./canonical/services";
import { fetchProjectsFromApi } from "./projects-api-client";

export interface BackendServiceDto {
  id: string;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  deliverables: string[];
  idealFor: string[];
}

interface ServicesCacheEntry {
  canonical: CanonicalService[];
  legacy: Service[];
  timestamp: number;
}

const servicesCache = new Map<string, ServicesCacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

export function mapServiceDtoToLegacy(dto: BackendServiceDto): Service {
  const service: Service = {
    id: dto.id,
    title: dto.title,
    outcome: dto.summary ?? dto.description,
    deliverables: dto.deliverables?.length > 0 ? dto.deliverables : dto.capabilities ?? [],
  };

  if (dto.idealFor?.length > 0) {
    service.note = dto.idealFor.join(", ");
  }

  return service;
}

export function mapServiceDtoToCanonical(dto: BackendServiceDto): CanonicalService {
  return {
    id: dto.id,
    title: { en: dto.title, ar: null },
    summary: { en: dto.summary, ar: null },
    description: { en: dto.description, ar: null },
    capabilities: { en: dto.capabilities ?? [], ar: null },
    deliverables: { en: dto.deliverables ?? [], ar: null },
    idealFor: { en: dto.idealFor ?? [], ar: null },
    relatedProjects: [],
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export async function fetchCanonicalServicesApi(locale: Locale): Promise<CanonicalService[]> {
  const cached = servicesCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.canonical;
  }

  const result = await fetchProjectsFromApi<BackendServiceDto[]>("/services", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    const canonical = result.data.map(mapServiceDtoToCanonical);
    const legacy = result.data.map(mapServiceDtoToLegacy);

    servicesCache.set(locale, {
      canonical,
      legacy,
      timestamp: Date.now(),
    });

    return canonical;
  }

  return staticCanonicalServices;
}

export function getServicesApiLegacy(locale: Locale): Service[] | null {
  const cached = servicesCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.legacy;
  }
  return null;
}
