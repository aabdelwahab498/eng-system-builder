/**
 * Products-Only API Adapter & Cache Layer
 */

import type { Locale, Product } from "@/types/content";
import type { CanonicalProduct, ProductCategory, ProductStatus } from "./schema";
import { products as staticCanonicalProducts } from "./canonical/products";
import { fetchProjectsFromApi } from "./projects-api-client";

export interface BackendProductDto {
  id: string;
  slug: string;
  name: string;
  category: string;
  lifecycle: string;
  tagline: string;
  summary: string;
  description: string;
  features: string[];
  technologies: string[];
  externalUrl?: string;
  demoUrl?: string;
}

interface ProductsCacheEntry {
  canonical: CanonicalProduct[];
  legacy: Product[];
  timestamp: number;
}

const productsCache = new Map<string, ProductsCacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

export function mapProductDtoToLegacy(dto: BackendProductDto): Product {
  const prod: Product = {
    name: dto.name,
    slug: dto.slug,
    kind: dto.category,
    status: (dto.lifecycle as Product["status"]) ?? "live",
    summary: dto.summary,
    description: dto.description ?? dto.summary,
    features: dto.features ?? [],
    media: [
      {
        kind: "placeholder",
        alt: dto.name,
        label: dto.category,
      },
    ],
  };

  return prod;
}

export function mapProductDtoToCanonical(dto: BackendProductDto): CanonicalProduct {
  const prod: CanonicalProduct = {
    id: dto.id,
    slug: dto.slug,
    name: { en: dto.name, ar: null },
    category: (dto.category as unknown as ProductCategory) ?? "saas",
    lifecycle: (dto.lifecycle as unknown as ProductStatus) ?? "live",
    tagline: { en: dto.tagline, ar: null },
    summary: { en: dto.summary, ar: null },
    description: { en: dto.description, ar: null },
    features: { en: dto.features ?? [], ar: null },
    technologies: dto.technologies ?? [],
    screenshots: [],
    offers: [],
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };

  if (dto.externalUrl) prod.externalUrl = dto.externalUrl;
  if (dto.demoUrl) prod.demoUrl = dto.demoUrl;

  return prod;
}

export async function fetchCanonicalProductsApi(locale: Locale): Promise<CanonicalProduct[]> {
  const cached = productsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.canonical;
  }

  const result = await fetchProjectsFromApi<BackendProductDto[]>("/products", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    const canonical = result.data.map(mapProductDtoToCanonical);
    const legacy = result.data.map(mapProductDtoToLegacy);

    productsCache.set(locale, {
      canonical,
      legacy,
      timestamp: Date.now(),
    });

    return canonical;
  }

  return staticCanonicalProducts;
}

export function getProductsApiLegacy(locale: Locale): Product[] | null {
  const cached = productsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.legacy;
  }
  return null;
}
