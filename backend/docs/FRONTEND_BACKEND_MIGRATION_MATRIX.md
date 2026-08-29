# Frontend ↔ Backend Migration Matrix (V1)

| Frontend Capability | Current Frontend Mechanism | Required Backend Capability | Existing Backend Endpoint | Request Contract Match | Response Contract Match | Auth Match | Persistence Match | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Profile** | Static `src/content/index.ts` & Supabase `content_items` | Profile endpoint | `GET /api/v1/profile` | GREEN | YELLOW (Structure differs slightly) | GREEN | GREEN | **YELLOW** |
| **Public Experience** | Static dictionary / fallback | Get experiences by category & locale | `GET /api/v1/experience` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Education** | Static dictionary / fallback | Get education entries | `GET /api/v1/education` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Certifications** | Static dictionary / fallback | Get certifications | `GET /api/v1/certifications` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Skills** | Static dictionary / fallback | Get skill groups with nested skills | `GET /api/v1/skills` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Projects** | Static dictionary / fallback | Get projects / filter by slug & category | `GET /api/v1/projects`, `GET /api/v1/projects/{slug}` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Products** | Static dictionary / fallback | Get products / filter by slug | `GET /api/v1/products`, `GET /api/v1/products/{slug}` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Services** | Static dictionary / fallback | Get services | `GET /api/v1/services` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Public Courses** | Static dictionary / fallback | Get ordered courses / by slug | `GET /api/v1/courses`, `GET /api/v1/courses/{slug}` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Contact Form Ingestion** | Supabase PostgREST `service_requests` table | Submit inquiry | `POST /api/v1/contact` | YELLOW (Name mapping) | GREEN | GREEN | GREEN | **YELLOW** |
| **Payment Proof Submission** | Fetch `${apiBaseUrl}/api/v1/payments` | Submit proof + CRM auto-mirror | `POST /api/v1/payments` | GREEN | GREEN | GREEN | GREEN | **GREEN** |
| **Client Profiles Ledger** | Fetch `${apiBaseUrl}/api/v1/admin/clients` | CRUD Client Profiles | `GET/POST/PUT/DELETE /api/v1/admin/clients` | GREEN | GREEN | YELLOW (JWT Scheme) | GREEN | **YELLOW** |
| **Invoices Ledger** | Fetch `${apiBaseUrl}/api/v1/admin/invoices` | CRUD Invoices | `GET/POST/PATCH/DELETE /api/v1/admin/invoices` | GREEN | GREEN | YELLOW (JWT Scheme) | GREEN | **YELLOW** |
| **Media Metadata** | Fetch `${apiBaseUrl}/api/v1/admin/media` | Register & manage media metadata | `GET/POST/PUT/DELETE /api/v1/admin/media` | GREEN | GREEN | YELLOW (JWT Scheme) | GREEN | **YELLOW** |
| **Media Binary Storage** | Supabase Storage `media` bucket | Binary Upload & File Streaming | **MISSING** (`POST /api/v1/admin/media/upload`) | RED | RED | RED | RED | **RED** |
| **Articles / Blog CMS** | Supabase PostgREST `content_items` table | Article CRUD & Slug History | **MISSING** (`/api/v1/articles`) | RED | RED | RED | RED | **RED** |
| **Announcements CMS** | Supabase PostgREST `content_items` table | Announcement CRUD & Date Window | **MISSING** (`/api/v1/announcements`) | RED | RED | RED | RED | **RED** |
| **Authentication** | Supabase Auth (Email + Google OAuth) | Issue / Validate JWT, User Login | **MISSING** (`POST /api/v1/auth/login`) | RED | RED | RED | RED | **RED** |

---

### Migration Status Legend
- **GREEN**: Directly compatible and ready for cutover.
- **YELLOW**: Backend endpoint exists, but minor contract/auth adjustment required.
- **RED**: Required capability missing in backend API surface.
- **GRAY**: Capability not required for production backend migration.
