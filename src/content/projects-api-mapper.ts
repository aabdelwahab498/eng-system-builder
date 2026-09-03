/**
 * Projects-Only DTO & Domain Mappers
 */

import type { ExternalLink, Project } from "@/types/content";
import type { CanonicalProject, ProjectCategory, ProjectStatus } from "./schema";

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
