# OpenAPI / Swagger Alignment Report (V1)

**Target Spec:** OpenAPI 3.0.0  
**Generator:** Swashbuckle.AspNetCore 6.6.2  
**Swagger Document Endpoint:** `/swagger/v1/swagger.json`  
**Swagger UI Endpoint:** `/swagger/index.html`  

---

## 1. Executive Summary

Swashbuckle is integrated into `Portfolio.Api` (`Program.cs`) and automatically generates the OpenAPI spec for all 87 existing endpoints in `HealthController`, `PublicControllers`, and `AdminController`. The generated spec accurately describes HTTP routes, query parameters, path variables, and JSON request/response bodies.

---

## 2. Identified Discrepancies & Recommendations

### 2.1 Generic Response Wrapper (`ApiResponse<T>`)
- **Current State:** Swagger models `ApiResponse<T>` as a generic schema. In some endpoints where controller actions return `IActionResult` without explicit `[ProducesResponseType(typeof(ApiResponse<ProjectDto>), 200)]` attributes, Swagger defaults to untyped schema descriptions.
- **Recommendation:** Add explicit `[ProducesResponseType]` attributes across all controller actions to produce deterministic OpenAPI schemas.

### 2.2 Unimplemented Gap Endpoints
- **Current State:** Endpoints for GAP 1 (Auth login), GAP 2 (Articles), GAP 3 (Announcements), and GAP 4 (Media Upload) do not yet exist in the controller source code and are absent from the OpenAPI document.
- **Recommendation:** Once the controller endpoints for GAPs 1–4 are implemented in Phase 2, Swashbuckle will automatically include them in the OpenAPI specification.

### 2.3 JWT Bearer Security Requirements
- **Current State:** `Program.cs` registers `AddSecurityDefinition("Bearer")` and `AddSecurityRequirement()`. This applies security requirement definitions globally to Swagger UI.
- **Recommendation:** Add `[AllowAnonymous]` attributes explicitly on public controllers to clearly demarcate unauthenticated vs authenticated endpoints in generated SDKs and OpenAPI documentation.

---

## 3. OpenAPI Alignment Status

| Component | Alignment Status | Notes |
| :--- | :--- | :--- |
| Health & System Endpoints | **ALIGNED** | Fully documented in OpenAPI spec |
| Public Portfolio Content Endpoints | **ALIGNED** | Fully documented in OpenAPI spec |
| Admin CMS & CRM Endpoints | **ALIGNED** | Fully documented with Bearer Auth |
| Error Response Envelopes | **PARTIALLY ALIGNED** | Requires `[ProducesResponseType]` annotations |
| Gap Endpoints (Auth, Articles, Media Upload) | **PENDING IMPLEMENTATION** | Will auto-align upon controller addition |
