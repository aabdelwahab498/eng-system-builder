/**
 * Admin Studio navigation model — six sections, no submenu explosion.
 *
 * Every entry maps to a route that already exists. Content-style sections point
 * at the canonical CMS collections (`/admin/content/:kind`), so no second
 * content system is introduced.
 */

import {
  Briefcase,
  LayoutDashboard,
  Layers,
  Settings,
  Share2,
  Users,
} from "lucide-react";
import type { ContentKind } from "@/lib/cms/types";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  /** Prefixes that keep this section highlighted. */
  match: string[];
  /** When set, the badge shows the number of entries of this content kind. */
  kind?: ContentKind;
  /** When set, the badge shows a live count from a local repository. */
  counter?: "requests" | "payments" | "clients" | "subscribers";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, match: [] },
  {
    label: "Content",
    href: "/admin/content/project",
    icon: Layers,
    match: [
      "/admin/content/profile",
      "/admin/content/project",
      "/admin/content/article",
      "/admin/content/gallery_item",
      "/admin/content/skill_group",
      "/admin/content/experience",
      "/admin/content/education",
      "/admin/media",
      "/admin/profile",
      "/admin/projects",
      "/admin/blog",
      "/admin/gallery",
      "/admin/skills",
    ],
  },
  {
    label: "Services & Requests",
    href: "/admin/content/service",
    icon: Briefcase,
    match: ["/admin/content/service", "/admin/requests", "/admin/services"],
    counter: "requests",
  },
  {
    label: "Clients & Payments",
    href: "/admin/clients",
    icon: Users,
    match: ["/admin/clients", "/admin/payments"],
    counter: "payments",
  },
  {
    label: "Social Media",
    href: "/admin/social",
    icon: Share2,
    match: [
      "/admin/social",
      "/admin/content/social_draft",
      "/admin/content/social_campaign",
      "/admin/campaigns",
      "/admin/linkedin",
      "/admin/ads-pixels",
      "/admin/content/marketing_campaign",
    ],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    match: [
      "/admin/settings",
      "/admin/localization",
      "/admin/content/seo",
      "/admin/content/payment_method",
      "/admin/content/cv_settings",
      "/admin/announcements",
      "/admin/activity",
      "/admin/seo",
      "/admin/cv",
      "/admin/payment-methods",
    ],
  },
];

export type AdminTab = { label: string; href: string };

/** Tabs shown under the page title, derived from the active section. */
export const SECTION_TABS: { match: string[]; tabs: AdminTab[] }[] = [
  {
    match: ADMIN_NAV[1]!.match,
    tabs: [
      { label: "Projects", href: "/admin/content/project" },
      { label: "Blog", href: "/admin/content/article" },
      { label: "Gallery", href: "/admin/content/gallery_item" },
      { label: "Skills", href: "/admin/content/skill_group" },
      { label: "Profile", href: "/admin/content/profile" },
      { label: "Media", href: "/admin/media" },
    ],
  },
  {
    match: ADMIN_NAV[2]!.match,
    tabs: [
      { label: "Services", href: "/admin/content/service" },
      { label: "Requests", href: "/admin/requests" },
    ],
  },
  {
    match: ADMIN_NAV[3]!.match,
    tabs: [
      { label: "Clients", href: "/admin/clients" },
      { label: "Payments", href: "/admin/payments" },
    ],
  },
  {
    match: ADMIN_NAV[4]!.match,
    tabs: [
      { label: "Profiles & posts", href: "/admin/social" },
      { label: "Post drafts", href: "/admin/content/social_draft" },
      { label: "Campaigns", href: "/admin/content/social_campaign" },
      { label: "Ads & pixels", href: "/admin/ads-pixels" },
    ],
  },
  {
    match: ADMIN_NAV[5]!.match,
    tabs: [
      { label: "General", href: "/admin/settings" },
      { label: "Localization", href: "/admin/localization" },
      { label: "SEO", href: "/admin/content/seo" },
      { label: "Payments", href: "/admin/content/payment_method" },
      { label: "Announcements", href: "/admin/announcements" },
      { label: "CV", href: "/admin/content/cv_settings" },
      { label: "Activity", href: "/admin/activity" },
    ],
  },
];

export const tabsForPath = (pathname: string): AdminTab[] => {
  const section = SECTION_TABS.find((s) => s.match.some((m) => pathname.startsWith(m)));
  return section?.tabs ?? [];
};
