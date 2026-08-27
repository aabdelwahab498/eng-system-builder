/**
 * Content access layer (Phase 3 & Phase 1 API Integration).
 *
 * The single boundary between UI and content. Components read through
 * these getters instead of importing content files directly.
 *
 * Provides static canonical getters and HTTP API adapter hooks for the ASP.NET Core backend.
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

/* ------------------------------------------------------- canonical layer */
/**
 * Phase 4 canonical getters. These read the canonical content model and apply
 * the publish filter (status + visibility).
 */

import {
  buildCv,
  buildLinkedIn,
  canonicalProfile,
  certifications,
  courses as canonicalCourses,
  education,
  experience,
  factoryMaturity,
  products as canonicalProducts,
  projects as canonicalProjects,
  services as canonicalServices,
  skillGroups,
} from "./canonical";
import type {
  CanonicalProduct,
  CanonicalProject,
  CanonicalService,
  CvVariant,
  ExperienceCategory,
  SkillGroup,
} from "./schema";
import type { Course } from "./canonical";
import { isPublishable } from "./schema";

export const getCanonicalProfile = (locale?: Locale) => canonicalProfile;

export const getCanonicalExperience = (category?: ExperienceCategory) => {
  const items = experience.filter(isPublishable);
  return category ? items.filter((item) => item.category === category) : items;
};

/** Includes non-public entries — authoring/CV surfaces only. */
export const getAllExperience = () => experience;

export const getCanonicalEducation = () => education.filter(isPublishable);
export const getAllEducation = () => education;
export const getCanonicalCertifications = () => certifications.filter(isPublishable);

export const getCanonicalSkills = (): SkillGroup[] =>
  skillGroups
    .map((group) => ({ ...group, skills: group.skills.filter((s) => s.portfolioVisible) }))
    .filter((group) => group.skills.length > 0);

export const getCanonicalProjects = (): CanonicalProject[] =>
  canonicalProjects.filter(isPublishable);

export const getCanonicalProject = (slug: string) =>
  getCanonicalProjects().find((p) => p.slug === slug);

export const getCanonicalFeaturedProjects = () => getCanonicalProjects().filter((p) => p.featured);

export const getFactoryMaturity = () => factoryMaturity;

export const getCanonicalProducts = (): CanonicalProduct[] =>
  canonicalProducts.filter(isPublishable);

export const getCanonicalProduct = (slug: string) =>
  getCanonicalProducts().find((p) => p.slug === slug);

export const getCanonicalServices = (): CanonicalService[] =>
  canonicalServices.filter(isPublishable);

export const getCourses = (): Course[] => [...canonicalCourses].sort((a, b) => a.order - b.order);

export const getCourse = (slug: string) => getCourses().find((c) => c.slug === slug);

export const getCanonicalContact = () => canonicalProfile.contact.filter(isPublishable);
export const getCanonicalSocialLinks = () => canonicalProfile.socialLinks.filter(isPublishable);

/** CV and LinkedIn are derived views over the same canonical data. */
export const getCv = (locale: Locale, variant: CvVariant = "general") => buildCv(variant, locale);
export const getLinkedIn = (locale: Locale) => buildLinkedIn(locale);

/* -------------------------------------------------------- commerce layer */
/** Phase 5: services catalogue, payment structure and manual payment methods. */

import {
  CONTACT_NUMBERS,
  paymentMethods as commercePaymentMethods,
  paymentSteps as commercePaymentSteps,
  services as serviceOfferings,
} from "./canonical/commerce";
import type { PaymentMethod, ServiceOffering } from "./canonical/commerce";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const getServiceOfferings = (tier?: ServiceOffering["tier"]): ServiceOffering[] =>
  serviceOfferings.filter((s) => s.enabled && (tier ? s.tier === tier : true)).sort(byOrder);

export const getServiceOffering = (id: string) => serviceOfferings.find((s) => s.id === id);

export const getPaymentMethods = (currency?: PaymentMethod["currency"]): PaymentMethod[] =>
  commercePaymentMethods
    .filter((m) => m.enabled && (currency ? m.currency === currency : true))
    .sort(byOrder);

export const getPaymentSteps = () => commercePaymentSteps;

export const getContactNumbers = () => CONTACT_NUMBERS;

/* -------------------------------------------------------- API Adapter exports */
export {
  fetchCanonicalProjects,
  fetchCanonicalProjectBySlug,
  fetchCanonicalProfile,
  fetchExperience,
  fetchEducation,
  fetchCertifications,
  fetchSkillGroups,
  fetchCanonicalServices,
  fetchCanonicalProducts,
  fetchCourses,
  isBackendApiEnabled,
  prewarmApiCache,
} from "./api-adapter";
