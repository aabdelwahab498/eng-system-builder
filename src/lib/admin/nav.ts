/**
 * Admin Studio navigation model.
 *
 * Every entry maps to a route that already exists. Content entries point at the
 * canonical CMS collections (`/admin/content/:kind`) through friendly aliases,
 * so no second content system is introduced.
 */

import {
  Activity,
  BadgeDollarSign,
  BookOpen,
  Building2,
  CalendarClock,
  FileText,
  Globe,
  Image,
  LayoutDashboard,
  Layers,
  Linkedin,
  Mail,
  Megaphone,
  Search,
  Settings,
  Share2,
  Sparkles,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import type { ContentKind } from "@/lib/cms/types";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  /** When set, the badge shows the number of entries of this content kind. */
  kind?: ContentKind;
  /** When set, the badge shows a live count from a local repository. */
  counter?: "requests" | "payments" | "clients" | "subscribers";
};

export type AdminNavGroup = { title: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: User, kind: "profile" },
      { label: "Projects", href: "/admin/projects", icon: Layers, kind: "project" },
      { label: "Services", href: "/admin/services", icon: Wrench, kind: "service" },
      { label: "Blog / Writing", href: "/admin/blog", icon: BookOpen, kind: "article" },
      { label: "Gallery", href: "/admin/gallery", icon: Image, kind: "gallery_item" },
      { label: "Skills", href: "/admin/skills", icon: Sparkles, kind: "skill_group" },
      { label: "Media library", href: "/admin/media", icon: Image },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Service requests", href: "/admin/requests", icon: Building2, counter: "requests" },
      { label: "Payments", href: "/admin/payments", icon: Wallet, counter: "payments" },
      { label: "Clients", href: "/admin/clients", icon: Mail, counter: "clients" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Social profiles", href: "/admin/social", icon: Share2, kind: "social_draft" },
      { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone, kind: "social_campaign" },
      { label: "LinkedIn content", href: "/admin/linkedin", icon: Linkedin, kind: "marketing_campaign" },
      { label: "SEO", href: "/admin/seo", icon: Search, kind: "seo" },
    ],
  },
  {
    title: "Documents",
    items: [{ label: "CV / Resume", href: "/admin/cv", icon: FileText, kind: "cv_settings" }],
  },
  {
    title: "System",
    items: [
      { label: "Site settings", href: "/admin/settings", icon: Settings },
      { label: "Localization", href: "/admin/localization", icon: Globe },
      { label: "Payment settings", href: "/admin/payment-methods", icon: BadgeDollarSign, kind: "payment_method" },
      { label: "Announcements", href: "/admin/announcements", icon: CalendarClock, kind: "announcement" },
      { label: "Activity log", href: "/admin/activity", icon: Activity },
    ],
  },
];
