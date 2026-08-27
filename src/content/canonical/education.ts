import type { Certification, Education } from "../schema";

/**
 * Canonical education (Phase 4). Degree names are kept as provided.
 * No GPA, honours, ranking or thesis is recorded — none was provided.
 */
export const education: Education[] = [
  {
    id: "edu-cairo-university-bsc",
    institution: "Cairo University",
    degree: { en: "Bachelor of Engineering", ar: null },
    field: { en: "Computer Science", ar: null },
    graduationDate: "2016",
    verified: false,
    status: "draft",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
  {
    id: "edu-diploma-software-engineering",
    institution: "Issuer not provided",
    degree: { en: "Diploma in Software Engineering / Back-End Development", ar: null },
    field: { en: "Software Engineering", ar: null },
    endDate: "2020",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing (issuer missing)" },
    // Not part of the unified CV — kept for admin history only.
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
  {
    id: "edu-diploma-modern-education",
    institution: "Issuer not provided",
    degree: { en: "Diploma in Basics of Modern Education", ar: null },
    field: { en: "Education", ar: null },
    endDate: "2021",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing (issuer missing)" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
  {
    id: "edu-diploma-digital-marketing",
    institution: "Issuer not provided",
    degree: { en: "Diploma in Digital Marketing", ar: null },
    field: { en: "Digital Marketing", ar: null },
    endDate: "2022",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing (issuer missing)" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
];

/** No certifications have been supplied or verified. */
export const certifications: Certification[] = [];
