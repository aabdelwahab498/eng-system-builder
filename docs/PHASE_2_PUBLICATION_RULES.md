# Phase 2 — Publication and Visibility Rules

## 1. Executive Summary

This document defines the publication and visibility semantics governing all content entities served by the portfolio backend API.

---

## 2. Canonical `isPublishable` Rule

In `src/content/schema/index.ts`, the canonical publishability predicate is implemented as:

```typescript
export const isPublishable = <T extends { status: ContentStatus; visibility: Visibility }>(
  item: T,
): boolean =>
  (item.status === "verified" || item.status === "draft") && item.visibility.public === true;
```

### Key Semantics:
1. **Allowed Statuses:** `verified` and `draft`.
2. **Excluded Statuses:** `needs-verification` and `archived`.
3. **Visibility Constraint:** `visibility.public` MUST equal `true`.

---

## 3. Database Entity Filtering Rules

Every public read endpoint in ASP.NET Core (`ProfileController`, `ProjectsController`, `ExperienceController`, `EducationController`, `CertificationsController`, `SkillsController`, `ServicesController`, `ProductsController`, `CoursesController`) enforces these exact publication conditions in EF Core LINQ queries:

```csharp
query = query.Where(e => e.PublicVisible && (e.Status == ContentStatus.Verified || e.Status == ContentStatus.Draft));
```

### Verification Matrix:

| Content Item | Status | Public Visible | Public API Output | Admin / CV Internal Output |
| :--- | :--- | :--- | :--- | :--- |
| `exp-software-engineering` | `draft` | `true` | **Included** | **Included** |
| `exp-faculty-member-cairo-university` | `needs-verification` | `false` | **Excluded** | Included (CV/Admin) |
| `exp-chief-of-logistics-munisca` | `needs-verification` | `false` | **Excluded** | Included (CV/Admin) |
| `exp-quality-control-petroleum` | `needs-verification` | `false` | **Excluded** | Included (CV/Admin) |
| `edu-cairo-university-bsc` | `draft` | `true` | **Included** | **Included** |
| `edu-diploma-software-engineering` | `needs-verification` | `false` | **Excluded** | Included (Admin) |
