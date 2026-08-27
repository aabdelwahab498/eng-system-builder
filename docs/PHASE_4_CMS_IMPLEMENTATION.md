# Phase 4 — CMS Backend API Final Implementation & Verification Specification

## 1. Scope Implemented

The ASP.NET Core backend CMS API has been fully implemented under `/api/v1/admin/*` for all canonical portfolio entities:

1. **Projects** (`/api/v1/admin/projects`) — Complete CRUD operations, slug uniqueness enforcement, dual EN/AR localization, audit logging.
2. **Experience** (`/api/v1/admin/experience`) — Complete CRUD operations, organization type metadata, dual EN/AR localization, audit logging.
3. **Education** (`/api/v1/admin/education`) — Complete CRUD operations, degree/field metadata, dual EN/AR localization, audit logging.
4. **Skill Groups & Skills** (`/api/v1/admin/skill-groups`, `/api/v1/admin/skills`) — Complete hierarchical CRUD operations, category association, proficiency levels, emphasis tags, audit logging.
5. **Services** (`/api/v1/admin/services`) — Complete CRUD operations, capabilities, deliverables, ideal-for lists, audit logging.
6. **Products** (`/api/v1/admin/products`) — Complete CRUD operations, product categories, lifecycles, demo/docs/external URLs, audit logging.
7. **Courses** (`/api/v1/admin/courses`) — Complete CRUD operations, course order, URL management, audit logging.

---

## 2. API Endpoint Matrix

| Method | Route | Authentication | Authorization Policy | Request DTO | Response DTO | Status Codes | Audit Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/projects` | Required | `Administrator` Policy | None | `ApiResponse<List<ProjectEntity>>` | 200, 401, 403 | None |
| `GET` | `/api/v1/admin/projects/{id}` | Required | `Administrator` Policy | None | `ApiResponse<ProjectEntity>` | 200, 401, 403, 404 | None |
| `POST` | `/api/v1/admin/projects` | Required | `Administrator` Policy | `AdminProjectRequest` | `ApiResponse<ProjectEntity>` | 201, 400, 401, 403, 409 | `CREATE_PROJECT` |
| `PUT` | `/api/v1/admin/projects/{id}` | Required | `Administrator` Policy | `AdminProjectRequest` | `ApiResponse<ProjectEntity>` | 200, 400, 401, 403, 404, 409 | `UPDATE_PROJECT` |
| `DELETE` | `/api/v1/admin/projects/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_PROJECT` |
| `GET` | `/api/v1/admin/experience` | Required | `Administrator` Policy | None | `ApiResponse<List<ExperienceEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/experience` | Required | `Administrator` Policy | `AdminExperienceRequest` | `ApiResponse<ExperienceEntity>` | 201, 400, 401, 403 | `CREATE_EXPERIENCE` |
| `PUT` | `/api/v1/admin/experience/{id}` | Required | `Administrator` Policy | `AdminExperienceRequest` | `ApiResponse<ExperienceEntity>` | 200, 400, 401, 403, 404 | `UPDATE_EXPERIENCE` |
| `DELETE` | `/api/v1/admin/experience/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_EXPERIENCE` |
| `GET` | `/api/v1/admin/education` | Required | `Administrator` Policy | None | `ApiResponse<List<EducationEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/education` | Required | `Administrator` Policy | `AdminEducationRequest` | `ApiResponse<EducationEntity>` | 201, 400, 401, 403 | `CREATE_EDUCATION` |
| `PUT` | `/api/v1/admin/education/{id}` | Required | `Administrator` Policy | `AdminEducationRequest` | `ApiResponse<EducationEntity>` | 200, 400, 401, 403, 404 | `UPDATE_EDUCATION` |
| `DELETE` | `/api/v1/admin/education/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_EDUCATION` |
| `GET` | `/api/v1/admin/skill-groups` | Required | `Administrator` Policy | None | `ApiResponse<List<SkillGroupEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/skill-groups` | Required | `Administrator` Policy | `AdminSkillGroupRequest` | `ApiResponse<SkillGroupEntity>` | 201, 400, 401, 403 | `CREATE_SKILL_GROUP` |
| `PUT` | `/api/v1/admin/skill-groups/{id}` | Required | `Administrator` Policy | `AdminSkillGroupRequest` | `ApiResponse<SkillGroupEntity>` | 200, 400, 401, 403, 404 | `UPDATE_SKILL_GROUP` |
| `DELETE` | `/api/v1/admin/skill-groups/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_SKILL_GROUP` |
| `GET` | `/api/v1/admin/skills` | Required | `Administrator` Policy | None | `ApiResponse<List<SkillEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/skills` | Required | `Administrator` Policy | `AdminSkillRequest` | `ApiResponse<SkillEntity>` | 201, 400, 401, 403 | `CREATE_SKILL` |
| `PUT` | `/api/v1/admin/skills/{id}` | Required | `Administrator` Policy | `AdminSkillRequest` | `ApiResponse<SkillEntity>` | 200, 400, 401, 403, 404 | `UPDATE_SKILL` |
| `DELETE` | `/api/v1/admin/skills/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_SKILL` |
| `GET` | `/api/v1/admin/services` | Required | `Administrator` Policy | None | `ApiResponse<List<ServiceEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/services` | Required | `Administrator` Policy | `AdminServiceRequest` | `ApiResponse<ServiceEntity>` | 201, 400, 401, 403 | `CREATE_SERVICE` |
| `PUT` | `/api/v1/admin/services/{id}` | Required | `Administrator` Policy | `AdminServiceRequest` | `ApiResponse<ServiceEntity>` | 200, 400, 401, 403, 404 | `UPDATE_SERVICE` |
| `DELETE` | `/api/v1/admin/services/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_SERVICE` |
| `GET` | `/api/v1/admin/products` | Required | `Administrator` Policy | None | `ApiResponse<List<ProductEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/products` | Required | `Administrator` Policy | `AdminProductRequest` | `ApiResponse<ProductEntity>` | 201, 400, 401, 403, 409 | `CREATE_PRODUCT` |
| `PUT` | `/api/v1/admin/products/{id}` | Required | `Administrator` Policy | `AdminProductRequest` | `ApiResponse<ProductEntity>` | 200, 400, 401, 403, 404, 409 | `UPDATE_PRODUCT` |
| `DELETE` | `/api/v1/admin/products/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_PRODUCT` |
| `GET` | `/api/v1/admin/courses` | Required | `Administrator` Policy | None | `ApiResponse<List<CourseEntity>>` | 200, 401, 403 | None |
| `POST` | `/api/v1/admin/courses` | Required | `Administrator` Policy | `AdminCourseRequest` | `ApiResponse<CourseEntity>` | 201, 400, 401, 403, 409 | `CREATE_COURSE` |
| `PUT` | `/api/v1/admin/courses/{id}` | Required | `Administrator` Policy | `AdminCourseRequest` | `ApiResponse<CourseEntity>` | 200, 400, 401, 403, 404, 409 | `UPDATE_COURSE` |
| `DELETE` | `/api/v1/admin/courses/{id}` | Required | `Administrator` Policy | None | None | 204, 401, 403, 404 | `DELETE_COURSE` |

---

## 3. Security & Header Bypass Verification Matrix

| Security Scenario | Expected Result | Actual Result |
| :--- | :--- | :--- |
| **Anonymous Request to `/api/v1/admin/*`** | `401 Unauthorized` | **PASS** |
| **Authenticated Non-Admin User** | `403 Forbidden` | **PASS** |
| **Valid Administrator User** | `200 OK` / `201 Created` / `204 No Content` | **PASS** |
| **Fake `X-Admin: true` Header** | `401 Unauthorized` | **PASS** |
| **Fake `X-Role: admin` Header** | `401 Unauthorized` | **PASS** |
| **Fake `X-User-Id` Header** | `401 Unauthorized` | **PASS** |
| **Tampered JWT Signature** | `401 Unauthorized` | **PASS** |
| **Expired JWT Token** | `401 Unauthorized` | **PASS** |
| **Wrong JWT Issuer** | `401 Unauthorized` | **PASS** |
| **Wrong JWT Audience** | `401 Unauthorized` | **PASS** |
| **Duplicate Slug Creation** | `409 Conflict` | **PASS** |
| **Non-existent Entity Lookup/Update** | `404 Not Found` | **PASS** |

---

## 4. Audit Log Redaction & Security

* **Actor Identity:** Extracted strictly from cryptographically validated JWT claim (`sub` or `ClaimTypes.NameIdentifier`). Client payload actor fields are ignored.
* **Secret Redaction:** Passwords, Bearer tokens, and sensitive headers are strictly omitted from `AuditLogEntity.MetadataJson`.
* **Traceability:** Includes `CorrelationId` (`HttpContext.TraceIdentifier`), `IpAddress`, `UserAgent`, `Success`, `EntityName`, `EntityId`, and structured metadata.

---

## 5. Clean Architecture & Regression Safety

* **Architecture Invariants:** `Domain` maintains 0 dependencies on external libraries or frameworks. `Application` holds DTOs and validation rules. `Api` handles HTTP controllers and authorization.
* **Parity Preservation:** 1 Profile, 13 Projects, 4 Experiences, 4 Educations, 0 Certifications, 8 SkillGroups, 41 Skills, 2 Products, 7 Services, 5 Courses match canonical definitions.
* **Frontend Preservation:** 0 React components modified (`src/**` untouched).
* **Supabase Preservation:** 0 Supabase configurations modified (`supabase/**` untouched).

---

## 6. Regression Matrix

| Area | Before Phase 4 | After Phase 4 | Result |
| :--- | :--- | :--- | :--- |
| **Public API** | Passing | Passing | **PASS** |
| **Canonical Parity** | Passing | Passing | **PASS** |
| **Importer Idempotency** | Passing | Passing | **PASS** |
| **JWT Validation** | Passing | Passing | **PASS** |
| **Admin Authorization** | Passing | Passing | **PASS** |
| **Header Bypass Protection** | Passing | Passing | **PASS** |
| **Audit Redaction** | Passing | Passing | **PASS** |
| **Clean Architecture** | Passing | Passing | **PASS** |
| **Frontend Build** | Passing | Passing | **PASS** |
| **Frontend Lint** | Passing | Passing | **PASS** |
