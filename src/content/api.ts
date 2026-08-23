/**
 * Content access layer (Phase 3).
 *
 * The single boundary between UI and content. Components should read through
 * these getters instead of importing content files directly, so a later move to
 * an API, database or CMS only changes this module.
 *
 * V1 sources the current typed dictionaries; the canonical schema in
 * `./schema` describes the target shape these getters will return once the
 * content migration lands.
 */

import type {
  Dictionary,
  Locale,
  MetaKey,
  Product,
  Project,
  Profile,
  Service,
  SkillCategory,
} from "@/types/content";
import { getContent } from "./index";

export const getDictionary = (locale: Locale): Dictionary => getContent(locale);

export const getProfile = (locale: Locale): Profile => getContent(locale).profile;

export const getProjects = (locale: Locale): Project[] => getContent(locale).projects;

export const getProject = (locale: Locale, slug: string): Project | undefined =>
  getProjects(locale).find((p) => p.slug === slug);

export const getFeaturedProjects = (locale: Locale): Project[] =>
  getProjects(locale).filter((p) => p.featured);

export const getProducts = (locale: Locale): Product[] => getContent(locale).products;

export const getProduct = (locale: Locale, slug: string): Product | undefined =>
  getProducts(locale).find((p) => p.slug === slug);

export const getSkills = (locale: Locale): SkillCategory[] => getContent(locale).skills;

export const getExperience = (locale: Locale, category?: "engineering" | "earlier") => {
  const items = getContent(locale).profile.experience ?? [];
  return category ? items.filter((item) => item.kind === category) : items;
};

export const getEducation = (locale: Locale) => getContent(locale).profile.education ?? [];

export const getServices = (locale: Locale): Service[] => getContent(locale).services;

export const getFactory = (locale: Locale) => getContent(locale).factory;

export const getContact = (locale: Locale) => getContent(locale).contact;

export const getNav = (locale: Locale) => getContent(locale).nav;

export const getUi = (locale: Locale) => getContent(locale).ui;

export const getSeo = (locale: Locale, key: MetaKey) => getContent(locale).meta[key];

/**
 * Reserved for V2: CV variants and LinkedIn blocks are derived from the same
 * canonical data. Intentionally not implemented in V1.
 */
export const getCv = undefined;
export const getLinkedIn = undefined;
