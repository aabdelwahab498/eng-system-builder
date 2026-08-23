import type { CvDocument, CvVariant, Locale } from "../schema";
import { pickOrEn } from "../schema";
import { canonicalProfile } from "./profile";
import { experience } from "./experience";
import { certifications, education } from "./education";
import { skillGroups } from "./skills";
import { projects } from "./projects";

/**
 * CV is a *derived view* of canonical data — never an independent source.
 * A variant may reorder, emphasise and select; it may never add facts.
 */

const VARIANT_TECH: Record<CvVariant, string[]> = {
  general: [],
  "backend-dotnet": ["C#", ".NET", "ASP.NET Core", "Entity Framework Core", "SQL Server"],
  ai: ["Python", "FastAPI", "LLM integrations", "AI Agents"],
  fullstack: ["React", "TypeScript", "ASP.NET Core"],
  "mobile-flutter": ["Flutter", "Dart"],
};

export const buildCv = (variant: CvVariant, locale: Locale): CvDocument => {
  const emphasis = VARIANT_TECH[variant];

  const cvExperience = experience.filter((item) => item.visibility.cv);
  const cvEducation = education.filter((item) => item.visibility.cv);

  const cvSkills = skillGroups
    .map((group) => ({
      ...group,
      skills: group.skills.filter((s) => s.cvVisible),
    }))
    .filter((group) => group.skills.length > 0)
    .sort((a, b) => {
      const score = (id: string) =>
        emphasis.some((tech) =>
          skillGroups.find((g) => g.id === id)?.skills.some((s) => s.name === tech),
        )
          ? 0
          : 1;
      return score(a.id) - score(b.id);
    });

  const cvProjects = projects
    .filter((p) => p.visibility.cv)
    .sort((a, b) => {
      const score = (techs: string[]) =>
        emphasis.length === 0 ? 0 : emphasis.some((t) => techs.includes(t)) ? 0 : 1;
      return score(a.technologies) - score(b.technologies);
    });

  return {
    variant,
    locale,
    profile: canonicalProfile,
    summary: pickOrEn(canonicalProfile.positioning.professionalSummary, locale),
    experience: cvExperience,
    education: cvEducation,
    skills: cvSkills,
    projects: cvProjects,
    certifications: certifications.filter((c) => c.visibility.cv),
    selectedProjects: cvProjects.map((p) => p.id),
    links: canonicalProfile.socialLinks.filter((l) => l.visibility.cv),
  };
};
