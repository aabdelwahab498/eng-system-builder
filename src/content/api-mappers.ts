/**
 * Domain & DTO Mappers for Portfolio Backend Integration
 */

import type { Project } from "@/types/content";
import type {
  CanonicalProject,
  CanonicalProduct,
  CanonicalService,
  Experience,
  Education,
  Certification,
  SkillGroup,
  Course,
  ProjectCategory,
  ProjectLifecycle,
  OrganizationType,
  ExperienceCategory,
  SkillCategoryId,
  ProficiencyLabel,
  ProficiencyEmphasis,
  ProductCategory,
  ProductLifecycle,
} from "./schema";

export interface BackendProjectDto {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  platform: string[];
  lifecycle: string;
  role: string;
  timeframe?: string;
  summary: string;
  problem: string;
  approach: string;
  architecture: string[];
  features: string[];
  technologies: string[];
  outcomes: string[];
  description?: string;
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface BackendExperienceDto {
  id: string;
  company: string;
  organizationType: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  category: string;
}

export interface BackendEducationDto {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  graduationDate?: string;
  description?: string;
}

export interface BackendCertificationDto {
  id: string;
  name: string;
  issuer: string;
  issuedAt?: string;
  credentialUrl?: string;
}

export interface BackendSkillDto {
  name: string;
  category: string;
  context: string;
  proficiencyLabel?: string;
  emphasis?: string;
  featured: boolean;
  portfolioVisible: boolean;
}

export interface BackendSkillGroupDto {
  id: string;
  category: string;
  label: string;
  description: string;
  skills: BackendSkillDto[];
}

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

export interface BackendServiceDto {
  id: string;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  deliverables: string[];
  idealFor: string[];
}

export interface BackendCourseDto {
  id: string;
  slug: string;
  title: string;
  order: number;
  url?: string;
}

export function mapProjectDtoToCanonical(dto: BackendProjectDto): CanonicalProject {
  return {
    id: dto.id,
    slug: dto.slug,
    title: { en: dto.title, ar: null },
    tagline: { en: dto.tagline, ar: null },
    category: (dto.category as unknown as ProjectCategory) ?? "web",
    platform: dto.platform ?? [],
    lifecycle: (dto.lifecycle as unknown as ProjectLifecycle) ?? "live",
    role: { en: dto.role, ar: null },
    timeframe: dto.timeframe,
    summary: { en: dto.summary, ar: null },
    problem: { en: dto.problem, ar: null },
    approach: { en: dto.approach, ar: null },
    architecture: { en: dto.architecture ?? [], ar: null },
    features: { en: dto.features ?? [], ar: null },
    technologies: dto.technologies ?? [],
    outcomes: { en: dto.outcomes ?? [], ar: null },
    screenshots: [],
    links: { repo: dto.repoUrl, live: dto.liveUrl },
    featured: dto.featured,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export function mapProjectDtoToLegacy(dto: BackendProjectDto): Project {
  return {
    slug: dto.slug,
    name: dto.title,
    tagline: dto.tagline,
    description: dto.description ?? dto.summary,
    summary: dto.summary,
    problem: dto.problem,
    solution: dto.approach,
    architecture: dto.architecture ?? [],
    features: dto.features ?? [],
    outcomes: dto.outcomes ?? [],
    tech: dto.technologies ?? [],
    role: dto.role,
    timeframe: dto.timeframe ?? "2026",
    category: dto.category,
    featured: dto.featured,
    github: dto.repoUrl,
    liveUrl: dto.liveUrl,
  };
}

export function mapExperienceDto(dto: BackendExperienceDto): Experience {
  return {
    id: dto.id,
    company: dto.company,
    organizationType: (dto.organizationType as unknown as OrganizationType) ?? "company",
    position: { en: dto.position, ar: null },
    location: dto.location,
    startDate: dto.startDate,
    endDate: dto.endDate,
    current: dto.current,
    description: { en: dto.description, ar: null },
    responsibilities: { en: dto.responsibilities ?? [], ar: null },
    achievements: { en: dto.achievements ?? [], ar: null },
    technologies: dto.technologies ?? [],
    category: (dto.category as unknown as ExperienceCategory) ?? "engineering",
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export function mapEducationDto(dto: BackendEducationDto): Education {
  return {
    id: dto.id,
    institution: dto.institution,
    degree: { en: dto.degree, ar: null },
    field: { en: dto.field, ar: null },
    startDate: dto.startDate,
    endDate: dto.endDate,
    graduationDate: dto.graduationDate,
    description: dto.description ? { en: dto.description, ar: null } : undefined,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export function mapCertificationDto(dto: BackendCertificationDto): Certification {
  return {
    id: dto.id,
    name: { en: dto.name, ar: null },
    issuer: dto.issuer,
    issuedAt: dto.issuedAt,
    credentialUrl: dto.credentialUrl,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export function mapSkillGroupDto(dto: BackendSkillGroupDto): SkillGroup {
  return {
    id: (dto.id as unknown as SkillCategoryId) ?? "backend",
    category: (dto.category as unknown as SkillCategoryId) ?? "backend",
    label: { en: dto.label, ar: null },
    description: { en: dto.description, ar: null },
    skills: (dto.skills ?? []).map((s) => ({
      name: s.name,
      category: (s.category as unknown as SkillCategoryId) ?? "backend",
      context: { en: s.context, ar: null },
      proficiencyLabel: (s.proficiencyLabel as unknown as ProficiencyLabel) ?? "primary",
      emphasis: (s.emphasis as unknown as ProficiencyEmphasis) ?? "primary",
      featured: s.featured,
      portfolioVisible: s.portfolioVisible,
      cvVisible: true,
      linkedinVisible: true,
    })),
  };
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

export function mapProductDtoToCanonical(dto: BackendProductDto): CanonicalProduct {
  return {
    id: dto.id,
    slug: dto.slug,
    name: { en: dto.name, ar: null },
    category: (dto.category as unknown as ProductCategory) ?? "saas",
    lifecycle: (dto.lifecycle as unknown as ProductLifecycle) ?? "live",
    tagline: { en: dto.tagline, ar: null },
    summary: { en: dto.summary, ar: null },
    description: { en: dto.description, ar: null },
    features: { en: dto.features ?? [], ar: null },
    technologies: dto.technologies ?? [],
    screenshots: [],
    externalUrl: dto.externalUrl,
    demoUrl: dto.demoUrl,
    offers: [],
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };
}

export function mapCourseDto(dto: BackendCourseDto): Course {
  return {
    id: dto.id,
    slug: dto.slug,
    title: { en: dto.title, ar: null },
    order: dto.order,
    url: dto.url,
  };
}
