# Phase 3 — Forensic Authentication & Authorization Report

## 1. Executive Summary

This document details the forensic audit of the existing authentication, role, and permission infrastructure within the repository.

---

## 2. Authentication Provider & Session Architecture

* **Provider:** Supabase Auth (`@supabase/supabase-js`).
* **Token Format:** Standard 3-part RSA/HS256 signed JSON Web Tokens (`Bearer eyJ...`).
* **Session Storage:** Managed by browser storage (`brokeredPreviewStorage()` / local storage) maintaining `access_token` and `refresh_token`.
* **User Identity:** UUID string stored in the JWT `sub` claim (referencing `auth.users(id)` in PostgreSQL).

---

## 3. Existing Roles, Permissions & RLS Assumptions

* **Role Storage:** PostgreSQL table `public.user_roles (user_id uuid, role app_role)` where `app_role` is an enum (`admin`, `editor`, `user`).
* **Role Verification:** Stored procedure `public.has_role(_user_id, _role)` and `public.is_admin()`.
* **Row-Level Security (RLS):** Policies on `public.content_items`, `public.media_assets`, and `storage.objects` strictly check `public.is_admin()`.
* **Frontend Access Boundary:** TanStack Start middleware `requireSupabaseAuth` in `src/integrations/supabase/auth-middleware.ts` validates the Bearer JWT and attaches `userId` and `claims` to the context.

---

## 4. ASP.NET Core Integration Strategy

* **Strategy:** Additive JWT Authentication & Policy-Based Authorization in ASP.NET Core.
* **Mechanism:** ASP.NET Core `Microsoft.AspNetCore.Authentication.JwtBearer` validates incoming Supabase JWT tokens.
* **Trust Boundary:** The backend extracts the subject (`sub`) and role claims from the cryptographically verified JWT token. No client-supplied headers (e.g. `X-Admin: true`) or request body user IDs are trusted.
