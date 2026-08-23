import type { LinkedInContent, Locale } from "../schema";
import { pickOrEn } from "../schema";
import { canonicalProfile } from "./profile";
import { experience } from "./experience";
import { projects } from "./projects";

/**
 * LinkedIn content is a derived, copy-paste view of canonical data.
 * Nothing is published automatically and no new facts are introduced here.
 */
export const buildLinkedIn = (locale: Locale): LinkedInContent => {
  const visibleExperience = experience.filter((item) => item.visibility.linkedin);
  const visibleProjects = projects.filter((p) => p.visibility.linkedin);

  return {
    headline: pickOrEn(canonicalProfile.positioning.shortHeadline, locale),
    about: pickOrEn(canonicalProfile.biography.long, locale),
    experienceBlurbs: Object.fromEntries(
      visibleExperience.map((item) => [item.id, pickOrEn(item.description, locale)]),
    ),
    projectBlurbs: Object.fromEntries(
      visibleProjects.map((p) => [p.id, pickOrEn(p.tagline, locale)]),
    ),
    featured: visibleProjects
      .filter((p) => p.links.live || p.links.api)
      .map((p) => ({
        title: pickOrEn(p.title, locale),
        url: (p.links.live ?? p.links.api)!,
        note: pickOrEn(p.tagline, locale),
      })),
  };
};
