# Canonical Portfolio Backend API Contract Specification (V1)

**API Version:** 1.0.0  
**Base Path:** `/api/v1`  
**Data Format:** JSON (`application/json`)  
**Locale Query Parameter:** `?locale=en|ar` (default: `en`)  
**Correlation Header:** `X-Correlation-ID` (received or auto-generated UUID)  

---

## 1. Standard Response Envelopes

All API endpoints return standard JSON response envelopes wrapped in `ApiResponse<T>`.

### 1.1 Success Response (`200 OK`, `201 Created`)

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-08-29T00:00:00Z",
    "locale": "en",
    "correlationId": "00-1234567890-00"
  }
}
```

### 1.2 Error Response (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Error`)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Contact form request is invalid.",
    "details": [
      "Field 'email' must be a valid email address.",
      "Field 'message' is required."
    ]
  },
  "meta": {
    "timestamp": "2026-08-29T00:00:00Z",
    "correlationId": "00-1234567890-00"
  }
}
```

---

## 2. Public API Surface (`/api/v1`)

### 2.1 System & Health Probes

- **`GET /healthz`**
  - **Auth:** Anonymous
  - **Response (200 OK):** `{ "status": "Healthy", "service": "Portfolio.Api", "version": "1.0.0" }`

- **`GET /readyz`**
  - **Auth:** Anonymous
  - **Response (200 OK):** `{ "status": "Healthy", "database": "Connected" }`
  - **Response (503 Service Unavailable):** `{ "status": "Unhealthy", "database": "Disconnected" }`

### 2.2 Profile & Portfolio Core

- **`GET /api/v1/profile`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `CanonicalProfileDto` (Identity, positioning, availability, location)

- **`GET /api/v1/experience`**
  - **Auth:** Anonymous
  - **Query:** `category=engineering|earlier|product|academic`, `locale=en|ar`
  - **Response (200 OK):** `ExperienceDto[]` (Filtered by `PublicVisible = true`)

- **`GET /api/v1/education`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `EducationDto[]` (Filtered by `PublicVisible = true`)

- **`GET /api/v1/certifications`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `CertificationDto[]` (Filtered by `PublicVisible = true`)

- **`GET /api/v1/skills`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `SkillGroupDto[]` (Grouped skill categories with nested `SkillDto[]`)

- **`GET /api/v1/projects`**
  - **Auth:** Anonymous
  - **Query:** `category`, `featured=true|false`, `locale=en|ar`
  - **Response (200 OK):** `ProjectDto[]`

- **`GET /api/v1/projects/{slug}`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `ProjectDto`
  - **Response (404 Not Found):** Error Envelope (`code: "NOT_FOUND"`)

- **`GET /api/v1/projects/featured`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `ProjectDto[]`

- **`GET /api/v1/products`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `ProductDto[]`

- **`GET /api/v1/products/{slug}`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `ProductDto`

- **`GET /api/v1/services`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `ServiceDto[]`

- **`GET /api/v1/courses`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `CourseDto[]` (Ordered by `Order`)

- **`GET /api/v1/courses/{slug}`**
  - **Auth:** Anonymous
  - **Query:** `locale=en|ar`
  - **Response (200 OK):** `CourseDto`

### 2.3 CRM & Inquiries

- **`POST /api/v1/contact`**
  - **Auth:** Anonymous
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "System Architecture Inquiry",
      "message": "Hello Ahmed, I would like to discuss..."
    }
    ```
  - **Response (200 OK):** `{ "received": true, "messageId": "guid" }`
  - **Response (400 Bad Request):** Error Envelope (`code: "VALIDATION_ERROR"`)

### 2.4 Telemetry & Privacy

- **`POST /api/v1/analytics/events`**
  - **Auth:** Anonymous
  - **Request Body:** `{ "eventName": "page_view", "category": "navigation", "path": "/projects", "metadataJson": "{}" }`
  - **Response (200 OK):** `{ "recorded": true, "eventId": "guid" }`

- **`POST /api/v1/consent`**
  - **Auth:** Anonymous
  - **Request Body:** `{ "visitorId": "visitor_123", "analyticsConsent": true, "marketingConsent": false }`
  - **Response (200 OK):** `{ "saved": true, "visitorId": "visitor_123" }`

### 2.5 Public Payment Proof Submission

- **`POST /api/v1/payments`**
  - **Auth:** Anonymous
  - **Request Body:**
    ```json
    {
      "clientName": "Website visitor",
      "email": "client@example.com",
      "whatsapp": "+201105725029",
      "serviceTitle": "Backend Architecture Consulting",
      "amount": "500.00",
      "currency": "USD",
      "methodId": "bank_transfer",
      "proofPath": "proofs/2026/08/receipt_123.jpg",
      "proofFilename": "receipt_123.jpg",
      "proofType": "image/jpeg",
      "proofSizeBytes": 245120
    }
    ```
  - **Response (200 OK):** `{ "ok": true, "paymentId": "guid", "requestId": "guid" }`
  - **Side Effect:** Persists `PaymentSubmissionEntity` AND creates auto-mirrored `ContactMessageEntity` (status `deposit_pending`).

---

## 3. Admin API Surface (`/api/v1/admin`)

All Admin endpoints require **`Authorization: Bearer <token>`** with role claim `"admin"` or `"Administrator"`.

### 3.1 Authentication Target Contract (GAP 1)

- **`POST /api/v1/auth/login`** *(Target Contract Specification)*
  - **Auth:** Anonymous
  - **Request Body:** `{ "email": "admin@nextnext-gen.com", "password": "..." }`
  - **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
      "expiresAt": "2026-08-30T00:00:00Z",
      "user": {
        "id": "admin_123",
        "email": "admin@nextnext-gen.com",
        "roles": ["admin"]
      }
    }
    ```

### 3.2 CMS Administration Endpoints

- **Projects:** `GET/POST/PUT/DELETE /api/v1/admin/projects`, `GET /api/v1/admin/projects/{id}`
- **Experience:** `GET/POST/PUT/DELETE /api/v1/admin/experience`, `GET /api/v1/admin/experience/{id}`
- **Education:** `GET/POST/PUT/DELETE /api/v1/admin/education`, `GET /api/v1/admin/education/{id}`
- **Skill Groups:** `GET/POST/PUT/DELETE /api/v1/admin/skill-groups`, `GET /api/v1/admin/skill-groups/{id}`
- **Skills:** `GET/POST/PUT/DELETE /api/v1/admin/skills`, `GET /api/v1/admin/skills/{id}`
- **Services:** `GET/POST/PUT/DELETE /api/v1/admin/services`, `GET /api/v1/admin/services/{id}`
- **Products:** `GET/POST/PUT/DELETE /api/v1/admin/products`, `GET /api/v1/admin/products/{id}`
- **Courses:** `GET/POST/PUT/DELETE /api/v1/admin/courses`, `GET /api/v1/admin/courses/{id}`
- **Audit Logs:** `GET /api/v1/admin/audit-logs`

### 3.3 CRM, Billing & Operations Administration

- **Service Requests / Inbox:**
  - `GET /api/v1/admin/requests?status={status}&search={query}`
  - `GET /api/v1/admin/requests/{id}`
  - `PATCH /api/v1/admin/requests/{id}/status`
  - `POST /api/v1/admin/requests/{id}/notes`
  - `DELETE /api/v1/admin/requests/{id}`

- **Payment Submissions Ledger:**
  - `GET /api/v1/admin/payments`
  - `GET /api/v1/admin/payments/{id}`
  - `PATCH /api/v1/admin/payments/{id}/status`
  - `POST /api/v1/admin/payments/{id}/notes`
  - `DELETE /api/v1/admin/payments/{id}`

- **Client Profiles Ledger:**
  - `GET /api/v1/admin/clients`
  - `GET /api/v1/admin/clients/{id}`
  - `POST /api/v1/admin/clients`
  - `PUT /api/v1/admin/clients/{id}`
  - `DELETE /api/v1/admin/clients/{id}`

- **Invoices Ledger:**
  - `GET /api/v1/admin/invoices`
  - `GET /api/v1/admin/invoices/{id}`
  - `POST /api/v1/admin/invoices`
  - `PATCH /api/v1/admin/invoices/{id}/status`
  - `DELETE /api/v1/admin/invoices/{id}`

- **Media Metadata Register & Binary Upload (GAP 4 Target):**
  - `GET /api/v1/admin/media?search={query}`
  - `GET /api/v1/admin/media/{id}`
  - `POST /api/v1/admin/media` *(Register metadata)*
  - `POST /api/v1/admin/media/upload` *(Target: Multipart binary file upload)*
  - `PUT /api/v1/admin/media/{id}`
  - `DELETE /api/v1/admin/media/{id}`

- **Marketing & Distribution Configuration:**
  - `GET /api/v1/admin/distribution`
  - `PUT /api/v1/admin/distribution`

---

## 4. Articles & Announcements Target Contracts (GAPs 2 & 3)

### 4.1 Articles API Contract (GAP 2)
- `GET /api/v1/articles` -> `ArticleDto[]` (Public published articles)
- `GET /api/v1/articles/{slug}` -> `ArticleDto` (Public single article lookup)
- `GET/POST/PUT/DELETE /api/v1/admin/articles` -> Admin CRUD for articles

### 4.2 Announcements API Contract (GAP 3)
- `GET /api/v1/announcements` -> `AnnouncementDto[]` (Active public announcements filtered by date window)
- `GET/POST/PUT/DELETE /api/v1/admin/announcements` -> Admin CRUD for announcements
