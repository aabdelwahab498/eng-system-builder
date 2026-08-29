# API Contract Test Plan (V1)

**Test Framework:** xUnit 2.5.3  
**Web Driver:** `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory<Program>`)  
**Test Project:** `backend/tests/Portfolio.ContractTests` & `backend/tests/Portfolio.IntegrationTests`  

---

## 1. Existing Test Coverage Evaluation

| Test Project | Test Count | Target Scope | Current Status |
| :--- | :--- | :--- | :--- |
| `Portfolio.UnitTests` | 4 | Domain business rules & validation logic | **PASS** (4/4) |
| `Portfolio.ContractTests` | 12 | Controller contract schemas, DTOs, HTTP status codes | **PASS** (12/12) |
| `Portfolio.IntegrationTests` | 66 | In-memory database persistence, authentication policies, audit logging, multi-step workflows | **PASS** (66/66) |
| **TOTAL EXISTING SUITE** | **82** | Whole solution contract & integration suite | **PASS (82/82)** |

---

## 2. Additional Contract Test Matrix for Gaps

Before initiating front-end migration, contract tests must be implemented in `Portfolio.ContractTests` to cover the 5 identified gap areas:

### 2.1 Auth Contract Tests (`AuthContractTests.cs`)
- Test 1: `POST /api/v1/auth/login` with valid credentials returns `200 OK` with JWT token and user details.
- Test 2: `POST /api/v1/auth/login` with invalid credentials returns `401 Unauthorized` error envelope.
- Test 3: Requests to protected `/api/v1/admin/*` endpoints without Bearer token return `401 Unauthorized`.
- Test 4: Requests to protected `/api/v1/admin/*` endpoints with non-admin token return `403 Forbidden`.

### 2.2 Articles Contract Tests (`ArticlesContractTests.cs`)
- Test 1: `GET /api/v1/articles` returns `200 OK` with `ArticleDto[]` filtered by published state.
- Test 2: `GET /api/v1/articles/{slug}` returns `200 OK` for valid slug and `404 Not Found` for invalid slug.
- Test 3: `POST /api/v1/admin/articles` creates new article and returns `201 Created`.

### 2.3 Announcements Contract Tests (`AnnouncementsContractTests.cs`)
- Test 1: `GET /api/v1/announcements` returns `200 OK` with active announcements within date window.
- Test 2: `POST /api/v1/admin/announcements` creates announcement and returns `201 Created`.

### 2.4 Media Upload Contract Tests (`MediaUploadContractTests.cs`)
- Test 1: `POST /api/v1/admin/media/upload` with multipart form data returns `201 Created` with `AdminMediaAssetDto`.
- Test 2: `GET /api/public/media/{*storagePath}` streams binary asset with correct MIME type header.

### 2.5 Contact Form Normalization Tests (`ContactNormalizationContractTests.cs`)
- Test 1: `POST /api/v1/contact` handles both standard `ContactMessageRequest` and front-end form fields cleanly.

---

## 3. Acceptance Criteria Prior to Frontend Migration Cutover

1. Solution build produces 0 errors and 0 warnings.
2. All contract tests (existing 82 + new gap tests) pass cleanly (`100% PASS`).
3. OpenAPI document generated at `/swagger/v1/swagger.json` contains full schema definitions for all 87+ endpoints.
4. Response envelopes strictly conform to `ApiResponse<T>` contract.
