# Portfolio Backend Foundation Architecture Decision Report

**Author:** Lead Backend Architect & Senior Software Engineer  
**Date:** August 28, 2026  
**Status:** Approved / Active Specification  
**Branch:** `backend/foundation`

---

## A. Verified Current State

Based on direct inspection of the repository (`https://github.com/aabdelwahab498/eng-system-builder.git`), the canonical current state is verified as follows:

- **Frontend Framework:** React 19.2.0 with TypeScript 5.8.3.
- **Router & Fullstack Framework:** `@tanstack/react-router` 1.170.18 and `@tanstack/react-start` 1.168.32 with Vite 8.1.5 and Nitro 3.0.260603-beta.
- **State & Query Management:** `@tanstack/react-query` 5.101.1.
- **Styling & UI:** `@tailwindcss/vite` 4.2.1, Radix UI primitives, Lucide React, class-variance-authority.
- **Database & BaaS (Current):** `@supabase/supabase-js` 2.112.3 with 7 existing SQL migrations in `supabase/migrations/` covering user roles, project items, and schema definitions.
- **Content Layer Seam:** `src/content/api.ts` exposes unified content access functions (legacy dictionary, canonical model, and commerce layer).
- **Content Data:** Authored in TypeScript files under `src/content/` (English and Arabic dictionaries, canonical models, and commerce structures).

### Unverified / Unknown Items

- Production database connection credentials (MUST NOT be required for development or building).
- Live production host environment details (Docker containerization designed as target).

---

## B. Existing Frontend Contracts

The existing frontend interacts with content through `src/content/api.ts`. The getters defined in this seam constitute the explicit public interface expected by the UI:

### 1. Dictionary & Legacy Getters

- `getDictionary(locale: Locale): Dictionary`
- `getProfile(locale: Locale): Profile`
- `getProjects(locale: Locale): Project[]`
- `getProject(locale: Locale, slug: string): Project | undefined`
- `getFeaturedProjects(locale: Locale): Project[]`
- `getProducts(locale: Locale): Product[]`
- `getProduct(locale: Locale, slug: string): Product | undefined`
- `getSkills(locale: Locale): SkillCategory[]`
- `getExperience(locale: Locale, category?: "engineering" | "earlier")`
- `getEducation(locale: Locale)`
- `getServices(locale: Locale): Service[]`
- `getFactory(locale: Locale)`
- `getContact(locale: Locale)`
- `getNav(locale: Locale)`
- `getUi(locale: Locale)`
- `getSeo(locale: Locale, key: MetaKey)`

### 2. Canonical Getters

- `getCanonicalProfile()`
- `getCanonicalExperience(category?: ExperienceCategory)`
- `getAllExperience()` _(Authoring/CV surfaces)_
- `getCanonicalEducation()`
- `getAllEducation()`
- `getCanonicalCertifications()`
- `getCanonicalSkills(): SkillGroup[]`
- `getCanonicalProjects(): CanonicalProject[]`
- `getCanonicalProject(slug: string)`
- `getCanonicalFeaturedProjects()`
- `getFactoryMaturity()`
- `getCanonicalProducts(): CanonicalProduct[]`
- `getCanonicalProduct(slug: string)`
- `getCanonicalServices(): CanonicalService[]`
- `getCourses(): Course[]`
- `getCourse(slug: string)`
- `getCanonicalContact()`
- `getCanonicalSocialLinks()`
- `getCv(locale: Locale, variant: CvVariant)`
- `getLinkedIn(locale: Locale)`

### 3. Commerce Getters

- `getServiceOfferings(tier?: ServiceOffering["tier"]): ServiceOffering[]`
- `getServiceOffering(id: string)`
- `getPaymentMethods(currency?: PaymentMethod["currency"]): PaymentMethod[]`
- `getPaymentSteps()`
- `getContactNumbers()`

---

## C. Existing Content Model

The domain structure is defined in `src/content/schema/index.ts`. Key abstractions include:

1.  **Tracking Wrapper `Tracked<T>`:**
    - `status`: `"verified" | "draft" | "needs-verification" | "placeholder" | "private" | "deprecated"`
    - `provenance`: `{ source?: string; sourceType: SourceType; verifiedAt?: string }`
    - `visibility`: `{ public: boolean; portfolio: boolean; cv: boolean; linkedin: boolean }`
    - **Publishable Check:** `status` is in `["verified", "draft"]` AND `visibility.public` is `true`.

2.  **Localization `Localized<T>`:**
    - `en: T` (Required English content)
    - `ar: T | null` (Optional or explicit Arabic content)

3.  **Core Domain Entities:**
    - `CanonicalProfile`: Identity, positioning, biography, location, availability, contact channels, social links, and document references.
    - `Experience`: Work history with company, organization type, category, responsibilities, achievements, technologies, and date ranges.
    - `Education` & `Certification`: Academic degrees, institutions, issuers, credential URLs.
    - `SkillGroup` & `Skill`: Grouped skills with context, proficiency label (`working`, `production`, `primary`), emphasis, and visibility flags.
    - `CanonicalProject`: Projects with lifecycle (`live`, `beta`, `in-development`, `coming-soon`, `archived`), problem, approach, architecture, features, outcomes, screenshots, and links.
    - `CanonicalProduct`: Products with offers (pricing, billing, checkout URL).
    - `CanonicalService`: Service offerings with capabilities, deliverables, and ideal audience.
    - `Course`: Structured learning items with ordering and links.

---

## D. Supabase Responsibilities

### Current State

- Handles auth session cookies and preview storage (`src/integrations/supabase/`).
- Stores initial database schema and roles in PostgreSQL migrations.

### Migration Target Strategy

- **Phase 0-1:** Supabase remains intact. No client auth or database dependencies are deleted.
- **Target Backend:** The ASP.NET Core (.NET 8+) backend handles domain entity storage, PostgreSQL EF Core migrations, REST APIs, custom authentication, contact form submissions, analytics events, and audit logs.
- **Transition:** Backend provides REST endpoints; frontend adapter inside `src/content/api.ts` gradually redirects calls from static files/Supabase to the ASP.NET Core backend.

---

## E. Target Backend Architecture

The backend is built as a **Modular Monolith** using C# on .NET 8 / .NET 10 LTS SDK, following Clean Architecture principles:

```
backend/
├── src/
│   ├── Portfolio.Domain/            # Entities, Value Objects, Enums, Domain Rules
│   ├── Portfolio.Application/       # DTOs, Use Cases, Interfaces, FluentValidation
│   ├── Portfolio.Infrastructure/    # EF Core DbContext, PostgreSQL, Repositories, Serilog
│   └── Portfolio.Api/               # ASP.NET Core Controllers, Swagger, Middlewares, DI
├── tests/
│   ├── Portfolio.UnitTests/         # Domain & Application Unit Tests
│   ├── Portfolio.IntegrationTests/  # WebApplicationFactory & API Integration Tests
│   └── Portfolio.ContractTests/     # JSON DTO Contract Verification Tests
├── docker/
│   └── Dockerfile                   # Multi-stage container file
├── docker-compose.yml               # Local orchestration (API + PostgreSQL)
├── .env.example                     # Sample environment configurations
└── Portfolio.sln                    # Solution file
```

---

## F. Backend Modules

1.  **Content Management Module:** Profile, Experience, Education, Certifications, Skills, Projects, Products, Services, Courses.
2.  **Operations & Interaction Module:** Contact submissions, Analytics event ingestion, Cookie/Privacy consent tracking.
3.  **Identity & Security Module:** User authentication, JWT issuance, Role-based authorization (`Admin`, `User`), Password reset flows.
4.  **Audit & Governance Module:** Comprehensive audit trail for administrative changes and publication state transitions.

---

## G. Database Entity Plan (EF Core + PostgreSQL)

Entities mapped via Entity Framework Core:

| Entity Name            | Primary Key | Key Attributes                                                                                  | Mappings / Notes                         |
| :--------------------- | :---------- | :---------------------------------------------------------------------------------------------- | :--------------------------------------- |
| `ProfileEntity`        | `Guid`      | Identity (JSON), Positioning (JSON), Location                                                   | Stores profile metadata & localized text |
| `ExperienceEntity`     | `Guid`      | Company, PositionEn, PositionAr, Category, StartDate, EndDate, Current, Responsibilities (JSON) | Tracked & localized                      |
| `EducationEntity`      | `Guid`      | Institution, DegreeEn, DegreeAr, FieldEn, FieldAr, GraduationDate                               | Tracked & localized                      |
| `CertificationEntity`  | `Guid`      | NameEn, NameAr, Issuer, IssuedAt, CredentialUrl                                                 | Tracked & localized                      |
| `SkillGroupEntity`     | `Guid`      | Category, LabelEn, LabelAr, DescriptionEn, DescriptionAr                                        | Parent category for skills               |
| `SkillEntity`          | `Guid`      | SkillGroupId, Name, ContextEn, ContextAr, ProficiencyLabel, Emphasis, PortfolioVisible          | Joined to SkillGroup                     |
| `ProjectEntity`        | `Guid`      | Slug, TitleEn, TitleAr, Category, Lifecycle, Featured, Architecture (JSON), Features (JSON)     | Tracked & localized                      |
| `ProductEntity`        | `Guid`      | Slug, NameEn, NameAr, Category, Lifecycle, Offers (JSON)                                        | Tracked & localized                      |
| `ServiceEntity`        | `Guid`      | TitleEn, TitleAr, Capabilities (JSON), Deliverables (JSON)                                      | Tracked & localized                      |
| `CourseEntity`         | `Guid`      | Slug, TitleEn, TitleAr, Order, Url                                                              | Sorted list                              |
| `ContactMessageEntity` | `Guid`      | Name, Email, Subject, Message, IpAddress, SubmittedAt, Status                                   | Ingestion entity                         |
| `AnalyticsEventEntity` | `Guid`      | EventName, Category, Url, SessionId, Timestamp, Metadata (JSON)                                 | Ingestion entity                         |
| `ConsentRecordEntity`  | `Guid`      | VisitorId, AnalyticsConsent, MarketingConsent, Timestamp                                        | Privacy compliance                       |
| `AuditLogEntity`       | `Guid`      | User, Action, EntityName, EntityId, Changes (JSON), Timestamp                                   | Administrative audit                     |

---

## H. API Contract Plan

All public endpoints are served under `/api/v1/`.

Standard JSON API Response Structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-08-28T00:00:00Z",
    "locale": "en",
    "correlationId": "00-12345-67890-00"
  }
}
```

Standardized Error Structure:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more validation errors occurred.",
    "details": ["Email field is required."]
  },
  "meta": {
    "timestamp": "2026-08-28T00:00:00Z",
    "correlationId": "00-12345-67890-00"
  }
}
```

---

## I. Authentication Plan

- **Public Access:** All content endpoints (Profile, Projects, Experience, etc.) allow anonymous `GET` access and filter for `isPublishable` content.
- **Admin Access:** Secured via JWT Bearer Tokens (`Authorization: Bearer <token>`). Administrative CRUD operations require the `Admin` role policy.
- **Password Reset Strategy:** Token-based email verification workflow (ASP.NET Core Identity compatible).

---

## J. Security Plan

- **Configuration:** Key-per-value environment configuration loaded from `.env` or environment variables; no hardcoded credentials.
- **CORS:** Configured for allowed origins (e.g. `http://localhost:3000`, `http://localhost:5173`).
- **Validation:** Strict input validation on all command models using FluentValidation.
- **Security Headers:** Explicit HSTS, X-Content-Type-Options, X-Frame-Options in API responses.

---

## K. Observability Plan

- **Logging:** Structured JSON logging via Serilog / Microsoft.Extensions.Logging.
- **Correlation ID:** Middleware generates/forwards `X-Correlation-ID` header on every request.
- **Health & Readiness:**
  - `/healthz`: Liveness check (HTTP 200 OK).
  - `/readyz`: Readiness check (verifies DB connection health).
- **Global Exception Handling:** ExceptionHandlingMiddleware catches unhandled exceptions and returns clean 500 ProblemDetails without leaking stack traces.

---

## L. Testing Strategy

1.  **Unit Tests (`Portfolio.UnitTests`):** Tests domain logic, publishable filters, localization pickers, and FluentValidation rules.
2.  **Integration Tests (`Portfolio.IntegrationTests`):** Tests controller routing, status codes, health checks, and database mappings using `Microsoft.AspNetCore.Mvc.Testing`.
3.  **Contract Tests (`Portfolio.ContractTests`):** Assures JSON payload schema compatibility between ASP.NET Core API DTOs and TypeScript interfaces.

---

## M. Deployment Strategy

- **Containerization:** Multi-stage `Dockerfile` producing a lightweight .NET 8 / 10 runtime image based on `mcr.microsoft.com/dotnet/aspnet`.
- **Local Development:** `docker-compose.yml` orchestrating ASP.NET Core API and a PostgreSQL 16 database.
- **CI/CD Ready:** Standard dotnet build, dotnet test, and Docker build workflows.

---

## N. Migration Strategy

1.  **Phase 0 (Current):** Establish ASP.NET Core backend foundation skeleton, contracts, models, EF Core migrations, and health checks without touching existing UI components.
2.  **Phase 1:** Add a toggleable API adapter in `src/content/api.ts` that fetches from `/api/v1` when enabled, falling back to static TS content.
3.  **Phase 2:** Execute database seeders populating PostgreSQL from canonical content.
4.  **Phase 3:** Complete transition of authoring, contact, and analytics features to backend.

---

## O. Operational Risks

| Risk                                  | Impact | Mitigation Strategy                                                                             |
| :------------------------------------ | :----- | :---------------------------------------------------------------------------------------------- |
| Breaking UI builds                    | High   | Never remove or rename functions in `src/content/api.ts`. Keep frontend tests passing.          |
| Arabic localized data missing         | Medium | Implement `pickOrEn` fallback in DTO serialization so missing AR text falls back cleanly to EN. |
| DB connectivity issues during startup | Medium | Implement health checks with graceful startup retries in EF Core connection policies.           |

---

## P. Explicit Non-Goals

- **NO Frontend Redesign:** The React UI, styling, and routes must remain completely intact.
- **NO Seam Removal:** `src/content/api.ts` MUST NOT be replaced with direct database or inline fetch calls across components.
- **NO Big-Bang Migration:** Supabase and static content files will not be deleted in Phase 0.
