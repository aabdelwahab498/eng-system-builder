# Client Project Hosting Factory Architecture & Onboarding Guide

This document defines the complete infrastructure, automation, security, and deployment specification for hosting customer projects on the NextNext-Gen VPS (`95.217.126.241`).

---

## 1. Directory & Service Layout

All customer applications are isolated under `/var/www/customers/<tenant>`:

```
/var/www/customers/
└── <tenant>/                       # E.g., acme
    ├── .repo_url                   # Git repository location
    ├── current -> releases/<id>    # Active production release symlink
    ├── releases/                   # Versioned immutable builds
    │   ├── 20260904-010000/
    │   └── 20260904-020000/
    └── shared/                     # Persistent secrets & logs (0700)
        ├── .env                    # Environment variables (0600)
        └── logs/
            ├── app.log
            └── error.log
```

---

## 2. Port Allocation & Runtime Isolation

- **Port Range:** `3101` to `3999` (Port `3000` is strictly reserved for `nextnext-gen.com` main frontend).
- **Service Naming:** `customer-<tenant>.service`
- **Systemd File:** `/etc/systemd/system/customer-<tenant>.service`
- **Execution User:** `www-data:www-data`

---

## 3. Nginx Server Block Specification

Location: `/etc/nginx/sites-available/customer-<tenant>.conf`

Each tenant receives an isolated Nginx configuration proxying `127.0.0.1:<port>`:
- Stage 1: Supports `<tenant>.nextnext-gen.com`
- Stage 2: Supports `<custom-domain>` and `www.<custom-domain>`

---

## 4. DNS Strategy

- **Temporary Tenant Subdomains (`<tenant>.nextnext-gen.com`):**
  - **Required A Record:** `*.nextnext-gen.com` -> `95.217.126.241` OR individual A record `<tenant>.nextnext-gen.com` -> `95.217.126.241`.
  - *Current Status:* Wildcard DNS is **NOT** currently active. Manual single A record or Wildcard setup required upon onboarding first customer.

- **Custom Customer Domains (`customer-domain.com`):**
  - **Required A Records:**
    - `customer-domain.com` -> `95.217.126.241`
    - `www.customer-domain.com` -> `95.217.126.241`

---

## 5. SSL / Certbot Workflow

1. **Subdomain SSL Issuance:**
   ```bash
   sudo certbot --nginx -d <tenant>.nextnext-gen.com
   ```
2. **Custom Domain SSL Issuance:**
   ```bash
   sudo certbot --nginx -d customer-domain.com -d www.customer-domain.com
   ```

---

## 6. Database Isolation Strategy

- **Database Server:** Local PostgreSQL on `127.0.0.1:5432`.
- **Database Naming Convention:** `customer_<tenant>_prod` (e.g., `customer_acme_prod`).
- **Database User:** `user_<tenant>` with permissions scoped exclusively to `customer_<tenant>_prod`.
- **Secrets:** Database password saved in `/var/www/customers/<tenant>/shared/.env`.
- **Backup Isolation:** Automated `pg_dump` per database to `/var/backups/postgresql/customer_<tenant>/`.

---

## 7. Versioned Deployment & Atomic Rollback

- **Deploy Script:** `tools/factory/templates/deploy-customer-project.sh`
- **Atomic Cutover:** Uses `ln -sfn /var/www/customers/<tenant>/releases/<release-id> /var/www/customers/<tenant>/current`.
- **Rollback:** Switches symlink back to previous release folder and restarts `customer-<tenant>.service`.

---

## 8. Customer API Architecture Patterns

1. **Frontend-Only App:** Customer app calls existing main API (`api.nextnext-gen.com/api/v1`) or third-party headless backend.
2. **Full-Stack App:** Customer app runs Node server on port `<port>` and optional backend API container on dedicated port (e.g., `api.<custom-domain>`).
