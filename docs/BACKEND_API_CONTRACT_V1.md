# Portfolio Backend API Contract Specification (v1)

**API Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Format:** JSON (`application/json`)  
**Locale Query Parameter:** `?locale=en|ar` (default: `en`)

---

## 1. Response Wrappers

### 1.1 Success Response Schema

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-08-28T00:00:00Z",
    "locale": "en",
    "correlationId": "00-1234567890-00"
  }
}
```

### 1.2 Error Response Schema

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Detailed error message description.",
    "details": ["Field 'email' must be a valid email address."]
  },
  "meta": {
    "timestamp": "2026-08-28T00:00:00Z",
    "correlationId": "00-1234567890-00"
  }
}
```

---

## 2. Public API Endpoints (/api/v1)

### 2.1 Profile & Identity

- **`GET /api/v1/profile`**
  - **Description:** Returns canonical profile details including identity, positioning, biography, location, availability, contact channels, and social links.
  - **Auth:** None (Public)
  - **Response Data:** `CanonicalProfileDto`

### 2.2 Work Experience

- **`GET /api/v1/experience`**
  - **Description:** Returns list of publishable work experiences.
  - **Query Params:** `category` (`engineering` \| `earlier` \| `product` \| `academic`), `locale` (`en` \| `ar`)
  - **Auth:** None (Public)
  - **Response Data:** `ExperienceDto[]`

### 2.3 Education & Certifications

- **`GET /api/v1/education`**
  - **Description:** Returns list of publishable education entries.
  - **Auth:** None (Public)
  - **Response Data:** `EducationDto[]`

- **`GET /api/v1/certifications`**
  - **Description:** Returns list of publishable certifications.
  - **Auth:** None (Public)
  - **Response Data:** `CertificationDto[]`

### 2.4 Skills

- **`GET /api/v1/skills`**
  - **Description:** Returns publishable skill groups and nested skills.
  - **Auth:** None (Public)
  - **Response Data:** `SkillGroupDto[]`

### 2.5 Projects

- **`GET /api/v1/projects`**
  - **Description:** Returns publishable project portfolio items.
  - **Query Params:** `category`, `featured` (`true` \| `false`), `locale`
  - **Auth:** None (Public)
  - **Response Data:** `ProjectDto[]`

- **`GET /api/v1/projects/{slug}`**
  - **Description:** Returns a single project by slug.
  - **Auth:** None (Public)
  - **Response Data:** `ProjectDto`

- **`GET /api/v1/projects/featured`**
  - **Description:** Returns featured publishable projects.
  - **Auth:** None (Public)
  - **Response Data:** `ProjectDto[]`

### 2.6 Products

- **`GET /api/v1/products`**
  - **Description:** Returns publishable products.
  - **Auth:** None (Public)
  - **Response Data:** `ProductDto[]`

- **`GET /api/v1/products/{slug}`**
  - **Description:** Returns a product by slug.
  - **Auth:** None (Public)
  - **Response Data:** `ProductDto`

### 2.7 Services

- **`GET /api/v1/services`**
  - **Description:** Returns publishable service offerings.
  - **Auth:** None (Public)
  - **Response Data:** `ServiceDto[]`

### 2.8 Courses

- **`GET /api/v1/courses`**
  - **Description:** Returns ordered list of courses.
  - **Auth:** None (Public)
  - **Response Data:** `CourseDto[]`

- **`GET /api/v1/courses/{slug}`**
  - **Description:** Returns course by slug.
  - **Auth:** None (Public)
  - **Response Data:** `CourseDto`

### 2.9 Contact Submission

- **`POST /api/v1/contact`**
  - **Description:** Ingests user contact form submission.
  - **Auth:** None (Public / Rate Limited)
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Inquiry regarding backend architecture",
      "message": "Hello Ahmed, I would like to discuss..."
    }
    ```
  - **Response Data:** `{ "received": true, "messageId": "guid" }`

### 2.10 Operational Capabilities (Analytics & Consent)

- **`POST /api/v1/analytics/events`**
  - **Description:** Submits telemetry/pageview event.
  - **Request Body:** `{ "eventName": "page_view", "path": "/projects", "metadata": {} }`

- **`POST /api/v1/consent`**
  - **Description:** Stores visitor privacy/cookie preferences.
  - **Request Body:** `{ "visitorId": "string", "analyticsConsent": true, "marketingConsent": false }`

---

## 3. System & Health Endpoints

- **`GET /healthz`**
  - **Description:** Liveness probe. Returns `HTTP 200 OK` (`{ "status": "Healthy" }`).
- **`GET /readyz`**
  - **Description:** Readiness probe. Verifies database connectivity and returns `HTTP 200 OK` or `503 Service Unavailable`.
