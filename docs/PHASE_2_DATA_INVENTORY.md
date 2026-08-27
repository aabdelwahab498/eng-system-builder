# Phase 2 — Canonical Data Inventory

## 1. Overview & Source Identification

This document provides a forensic audit and data inventory of all canonical content objects located in `src/content/canonical/`.

Primary Source Directory: `src/content/canonical/`
Supporting Schemas: `src/content/schema/index.ts`

---

## 2. Canonical Entity Inventory

### 2.1 Profile (`src/content/canonical/profile.ts`)
- **Canonical Object:** `canonicalProfile`
- **Fields:**
  - `identity`: `displayName` ("Ahmed Abdelwahab"), `professionalName`, `shortName`, `monogram` ("AA")
  - `arabicName`: "أحمد عبد الوهاب"
  - `positioning`: `primaryTitle` (EN/AR), `secondaryTitle` (EN/AR), `shortHeadline` (EN/AR), `longHeadline` (EN/AR), `professionalSummary` (EN/AR)
  - `biography`: `short` (EN/AR), `medium` (EN/AR), `long` (EN/AR)
  - `location`: `city` ("Cairo"), `country` ("Egypt"), `status` ("verified"), `visibility`
  - `availability`: `state` ("open"), `note` (EN/AR)
  - `contact`: List of 3 `ContactChannel` records (`email` verified, `email` draft/unverified, `phone` verified)
  - `socialLinks`: List of 8 `SocialLink` records (`github`, `linkedin`, `facebook`, `instagram`, `whatsapp`, `snapchat`, `x`, `youtube`)
  - `documents`: List of 1 `DocumentRef` record (`/cv-ahmed-abdelwahab.pdf`)
  - Relational IDs: `educationIds` (4), `experienceIds` (4), `certificationIds` (0), `projectIds` (3), `productIds` (2), `serviceIds` (7)

---

### 2.2 Experience (`src/content/canonical/experience.ts`)
- **Total Records:** 4
- **Record Breakdown:**
  1. `exp-software-engineering`: Engineering category | Status: `draft` | Visibility: Public (`true`)
  2. `exp-faculty-member-cairo-university`: Academic category | Status: `needs-verification` | Visibility: Public (`false`)
  3. `exp-chief-of-logistics-munisca`: Operations category | Status: `needs-verification` | Visibility: Public (`false`)
  4. `exp-quality-control-petroleum`: Operations category | Status: `needs-verification` | Visibility: Public (`false`)
- **Fields:** `id`, `company`, `organizationType`, `position` (EN/AR), `location`, `startDate`, `endDate`, `current`, `description` (EN/AR), `responsibilities` (EN/AR lists), `achievements` (EN/AR lists), `technologies` (string array), `category`, `status`, `visibility`.

---

### 2.3 Education & Certifications (`src/content/canonical/education.ts`)
- **Education Records:** 4
  1. `edu-cairo-university-bsc`: "Bachelor of Engineering", "Computer Science", 2016 | Status: `draft` | Public (`true`)
  2. `edu-diploma-software-engineering`: "Diploma in Software Engineering", 2020 | Status: `needs-verification` | Public (`false`)
  3. `edu-diploma-modern-education`: "Diploma in Basics of Modern Education", 2021 | Status: `needs-verification` | Public (`false`)
  4. `edu-diploma-digital-marketing`: "Diploma in Digital Marketing", 2022 | Status: `needs-verification` | Public (`false`)
- **Certification Records:** 0 (Empty list in canonical source).
- **Fields:** `id`, `institution`, `degree` (EN/AR), `field` (EN/AR), `startDate`, `endDate`, `graduationDate`, `description` (EN/AR), `status`, `visibility`.

---

### 2.4 Skill Groups & Skills (`src/content/canonical/skills.ts`)
- **Total Skill Groups:** 7 (`backend`, `frontend`, `fullstack`, `ai`, `mobile`, `architecture`, `databases`)
- **Total Skills:** 35 skills across the 7 groups
- **Fields:**
  - SkillGroup: `id`, `category`, `label` (EN/AR), `description` (EN/AR), `skills`
  - Skill: `name`, `category`, `context` (EN/AR), `proficiencyLabel`, `emphasis` (`primary` | `supporting`), `featured` (boolean), `portfolioVisible`, `cvVisible`, `linkedinVisible`.

---

### 2.5 Projects (`src/content/canonical/projects.ts`)
- **Total Records:** 12
  1. `project-nextnext-gen-hub`: slug "nextnext-gen-hub" | Featured: `false` | Status: `verified` | Public (`true`)
  2. `project-dalil-masry`: slug "dalil-masry" | Featured: `true` | Status: `verified` | Public (`true`)
  3. `project-shifa-travel`: slug "shifa-travel" | Featured: `true` | Status: `verified` | Public (`true`)
  4. `project-wameedh-hub`: slug "wameedh-hub" | Featured: `true` | Status: `verified` | Public (`true`)
  5. `project-indusb2b`: slug "indusb2b" | Featured: `true` | Status: `verified` | Public (`true`)
  6. `project-aurea-clinic-os`: slug "aurea-clinic-os" | Featured: `true` | Status: `verified` | Public (`true`)
  7. `project-maison-parfum`: slug "maison-parfum" | Featured: `true` | Status: `verified` | Public (`true`)
  8. `project-stockhub`: slug "stockhub" | Featured: `true` | Status: `verified` | Public (`true`)
  9. `project-wameed-os`: slug "wameed-os" | Featured: `true` | Status: `verified` | Public (`true`)
  10. `project-digital-ops-console`: slug "digital-ops-console" | Featured: `true` | Status: `verified` | Public (`true`)
  11. `project-scriptoria-ar`: slug "scriptoria-ar" | Featured: `true` | Status: `verified` | Public (`true`)
  12. `project-dev-shield-nexus`: slug "dev-shield-nexus" | Featured: `true` | Status: `verified` | Public (`true`)
  13. `project-smart-shelf-builder`: slug "smart-shelf-builder" | Featured: `true` | Status: `verified` | Public (`true`)
- **Fields:** `id`, `slug`, `title` (EN/AR), `tagline` (EN/AR), `category`, `platform`, `lifecycle`, `role` (EN/AR), `timeframe`, `summary` (EN/AR), `problem` (EN/AR), `approach` (EN/AR), `architecture` (EN/AR lists), `features` (EN/AR lists), `technologies`, `outcomes` (EN/AR lists), `screenshots`, `links` (`repo`, `live`), `featured`, `verified`, `status`, `visibility`.

---

### 2.6 Products (`src/content/canonical/products.ts`)
- **Total Records:** 2
  1. `product-najmah`: slug "najmah" | Status: `draft` | Public (`true`)
  2. `product-factory-api`: slug "factory-api" | Status: `draft` | Public (`true`)
- **Fields:** `id`, `slug`, `name` (EN/AR), `category`, `lifecycle`, `tagline` (EN/AR), `summary` (EN/AR), `description` (EN/AR), `features` (EN/AR lists), `technologies`, `screenshots`, `externalUrl`, `demoUrl`, `docsUrl`, `relatedProjectId`, `offers`, `status`, `visibility`.

---

### 2.7 Services (`src/content/canonical/services.ts`)
- **Total Records:** 7
  1. `service-backend-engineering`
  2. `service-fullstack-development`
  3. `service-ai-integration`
  4. `service-ai-automation`
  5. `service-api-development`
  6. `service-software-architecture`
  7. `service-digital-product-development`
- **Fields:** `id`, `title` (EN/AR), `summary` (EN/AR), `description` (EN/AR), `capabilities` (EN/AR lists), `deliverables` (EN/AR lists), `idealFor` (EN/AR lists), `relatedProjects`, `status`, `visibility`.

---

### 2.8 Courses (`src/content/canonical/courses.ts`)
- **Total Records:** 5
  1. `course-backend-engineering`: slug "backend-engineering" | Order: 1
  2. `course-ai-llm-integration`: slug "ai-llm-integration" | Order: 2
  3. `course-fullstack-development`: slug "fullstack-development" | Order: 3
  4. `course-api-design`: slug "api-design" | Order: 4
  5. `course-software-architecture`: slug "software-architecture" | Order: 5
- **Fields:** `id`, `slug`, `icon`, `level`, `ready`, `order`, `title` (EN/AR), `summary` (EN/AR), `description` (EN/AR), `keywords` (EN/AR lists).

---

## 3. Database Gap Table

| Canonical Field | Database Field | Compatible? | Transformation | Risk | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `project.slug` | `ProjectEntity.Slug` | Yes | Direct String | Low | None |
| `project.title.en` / `ar` | `TitleEn` / `TitleAr` | Yes | Extracted from Localized object | Low | Add DB fields if missing |
| `experience.position.en` / `ar` | `PositionEn` / `PositionAr` | Yes | Extracted from Localized object | Low | Add DB fields if missing |
| `skillGroup.skills` | `SkillEntity` (FK) | Yes | Relational table | Low | Ensure cascade delete / FK |
| `course.ready` / `level` / `icon` | `CourseEntity.*` | Partial | Map fields | Low | Add fields to `CourseEntity` |
| `profile` identity & bios | `ProfileEntity` | Partial | Single row table / JSON seed | Low | Create `ProfileEntity` table |
