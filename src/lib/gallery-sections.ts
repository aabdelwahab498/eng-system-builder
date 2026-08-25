/** Gallery page sections — shared by the gallery page and the header dropdown. */
export type GallerySectionId = "web-apps" | "websites" | "mobile-apps" | "ai-videos" | "images";

export const gallerySections: {
  id: GallerySectionId;
  label: { en: string; ar: string };
}[] = [
  { id: "web-apps", label: { en: "Web Applications", ar: "تطبيقات الويب" } },
  { id: "websites", label: { en: "Websites", ar: "المواقع الإلكترونية" } },
  { id: "mobile-apps", label: { en: "Mobile Apps", ar: "تطبيقات الموبايل" } },
  { id: "ai-videos", label: { en: "AI Videos", ar: "فيديوهات الذكاء الاصطناعي" } },
  { id: "images", label: { en: "Image Gallery", ar: "معرض الصور" } },
];

/** Project slugs grouped per section. Anything unlisted falls back to web apps. */
export const projectSectionSlugs: Record<"web-apps" | "websites" | "mobile-apps", string[]> = {
  "web-apps": [
    "aurea-clinic-os",
    "stockhub",
    "wameed-os",
    "digital-ops-console",
    "dev-shield-nexus",
    "smart-shelf-builder",
    "scriptoria-ar",
  ],
  // Strongest / most complete first: Wameedh Hub ships on its own production
  // domain; the rest follow by platform breadth and deployment maturity.
  websites: ["wameedh-hub", "indusb2b", "shifa-travel", "dalil-masry", "maison-parfum"],
  "mobile-apps": [],
};
