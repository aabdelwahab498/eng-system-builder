/**
 * Domain & DTO Mappers for Portfolio Backend Integration
 */

import type { ExternalLink, Project } from "@/types/content";
import type { Course } from "./canonical";
import type {
  CanonicalProject,
  CanonicalProduct,
  CanonicalService,
  Experience,
  Education,
  Certification,
  SkillGroup,
  Skill,
  ProjectCategory,
  ProjectStatus,
  OrganizationType,
  ExperienceCategory,
  SkillCategoryId,
  ProficiencyLabel,
  ProductCategory,
  ProductStatus,
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
  const links: { repo?: string; live?: string } = {};
  if (dto.repoUrl) links.repo = dto.repoUrl;
  if (dto.liveUrl) links.live = dto.liveUrl;

  const project: CanonicalProject = {
    id: dto.id,
    slug: dto.slug,
    title: { en: dto.title, ar: null },
    tagline: { en: dto.tagline, ar: null },
    category: (dto.category as unknown as ProjectCategory) ?? "web",
    platform: dto.platform ?? [],
    lifecycle: (dto.lifecycle as unknown as ProjectStatus) ?? "live",
    role: { en: dto.role, ar: null },
    summary: { en: dto.summary, ar: null },
    problem: { en: dto.problem, ar: null },
    approach: { en: dto.approach, ar: null },
    architecture: { en: dto.architecture ?? [], ar: null },
    features: { en: dto.features ?? [], ar: null },
    technologies: dto.technologies ?? [],
    outcomes: { en: dto.outcomes ?? [], ar: null },
    screenshots: [],
    links,
    featured: dto.featured,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };

  if (dto.timeframe) {
    project.timeframe = dto.timeframe;
  }

  return project;
}

export function mapProjectDtoToLegacy(dto: BackendProjectDto): Project {
  const links: ExternalLink[] = [];
  if (dto.liveUrl) {
    links.push({ label: "Live", url: dto.liveUrl });
  }
  if (dto.repoUrl) {
    links.push({ label: "GitHub", url: dto.repoUrl });
  }

  const project: Project = {
    slug: dto.slug,
    name: dto.title,
    category: dto.category,
    status: dto.lifecycle ?? "live",
    role: dto.role,
    summary: dto.summary,
    tech: dto.technologies ?? [],
    featured: dto.featured,
    media: [
      {
        kind: "placeholder",
        alt: dto.title,
        label: dto.category,
      },
    ],
    caseStudy: {
      overview: dto.summary,
      problem: dto.problem,
      approach: dto.approach,
      architecture: dto.architecture ?? [],
      implementation: (dto.features ?? []).join("\n\n"),
      challenges: dto.problem,
      outcome: (dto.outcomes ?? []).join("\n\n"),
    },
  };

  if (links.length > 0) {
    project.links = links;
  }

  return project;
}

export function mapExperienceDto(dto: BackendExperienceDto): Experience {
  const exp: Experience = {
    id: dto.id,
    company: dto.company,
    organizationType: (dto.organizationType as unknown as OrganizationType) ?? "company",
    position: { en: dto.position, ar: null },
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

  if (dto.location) exp.location = dto.location;
  if (dto.startDate) exp.startDate = dto.startDate;
  if (dto.endDate) exp.endDate = dto.endDate;

  return exp;
}

export function mapEducationDto(dto: BackendEducationDto): Education {
  const edu: Education = {
    id: dto.id,
    institution: dto.institution,
    degree: { en: dto.degree, ar: null },
    field: { en: dto.field, ar: null },
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };

  if (dto.startDate) edu.startDate = dto.startDate;
  if (dto.endDate) edu.endDate = dto.endDate;
  if (dto.graduationDate) edu.graduationDate = dto.graduationDate;
  if (dto.description) edu.description = { en: dto.description, ar: null };

  return edu;
}

export function mapCertificationDto(dto: BackendCertificationDto): Certification {
  const cert: Certification = {
    id: dto.id,
    name: { en: dto.name, ar: null },
    issuer: dto.issuer,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  };

  if (dto.issuedAt) cert.issuedAt = dto.issuedAt;
  if (dto.credentialUrl) cert.credentialUrl = dto.credentialUrl;

  return cert;
}

export function mapSkillGroupDto(dto: BackendSkillGroupDto): SkillGroup {
  return {
    id: (dto.id as unknown as SkillCategoryId) ?? "backend",
    category: (dto.category as unknown as SkillCategoryId) ?? "backend",
    label: { en: dto.label, ar: null },
    description: { en: dto.description, ar: null },
    skills: (dto.skills ?? []).map((s) => {
      const skill: Skill = {
        name: s.name,
        category: (s.category as unknown as SkillCategoryId) ?? "backend",
        context: { en: s.context, ar: null },
        proficiencyLabel: (s.proficiencyLabel as unknown as ProficiencyLabel) ?? "primary",
        featured: s.featured,
        portfolioVisible: s.portfolioVisible,
        cvVisible: true,
        linkedinVisible: true,
      };
      return skill;
    }),
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

export function mapCourseDto(dto: BackendCourseDto): Course {
  const course: Course = {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    order: dto.order,
  };

  if (dto.url) course.url = dto.url;

  return course;
}
