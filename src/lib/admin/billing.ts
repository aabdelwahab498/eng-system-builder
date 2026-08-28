/**
 * Billing layer for the Admin Studio (V1: frontend-only, local storage).
 *
 * Holds the per-client payment ledger and the subscription lifecycle actions
 * (manual renew / pause / resume). The UI only talks to these functions, so a
 * backend implementation can replace the storage adapter with no UI change.
 */

import type { Client, PaymentState, SubscriptionPlan } from "./crm";
import { PAYMENT_STATES, SUBSCRIPTION_PLANS, activityLog, clients } from "./crm";

export type PaymentRecordStatus = "paid" | "pending" | "failed" | "refunded";

export type PaymentRecord = {
  id: string;
  clientId: string;
  amount: string;
  currency: string;
  method: string;
  status: PaymentRecordStatus;
  invoiceRef: string;
  note?: string;
  paidAt: string; // ISO date (yyyy-mm-dd)
  createdAt: string;
};

export const PAYMENT_RECORD_STATUSES: { value: PaymentRecordStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export type SubscriptionState = "active" | "paused" | "cancelled";

export const SUBSCRIPTION_STATES: { value: SubscriptionState; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

function getBackendUrl(): string {
  const url = process.env["VITE_PORTFOLIO_API_URL"] || process.env["PORTFOLIO_API_URL"] || "";
  return url.trim().replace(/\/+$/, "");
}

export const paymentRecords = {
  async list(): Promise<PaymentRecord[]> {
    const apiBase = getBackendUrl();
    const url = `${apiBase}/api/v1/admin/invoices`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`Failed to list invoices from backend API: HTTP ${res.status}`);
    }
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];

    // One-time legacy localStorage backfill
    if (typeof window !== "undefined") {
      const legacyRaw = window.localStorage.getItem("nng.admin.payments.v1");
      if (legacyRaw) {
        try {
          const legacyItems = JSON.parse(legacyRaw) as PaymentRecord[];
          if (Array.isArray(legacyItems) && legacyItems.length > 0) {
            for (const item of legacyItems) {
              await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(item),
              }).catch(() => null);
            }
          }
        } catch {
          // ignore
        }
        window.localStorage.removeItem("nng.admin.payments.v1");
        const refreshed = await fetch(url, { headers: { Accept: "application/json" } });
        const refJson = await refreshed.json();
        if (refJson.success && Array.isArray(refJson.data)) return refJson.data;
      }
    }

    return json.data as PaymentRecord[];
  },
  async listByClient(clientId: string): Promise<PaymentRecord[]> {
    const all = await paymentRecords.list();
    return all.filter((p) => p.clientId === clientId);
  },
  async create(input: Omit<PaymentRecord, "id" | "createdAt">): Promise<PaymentRecord> {
    const apiBase = getBackendUrl();
    const url = `${apiBase}/api/v1/admin/invoices`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`Failed to create invoice via backend API: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data as PaymentRecord;
  },
  async remove(id: string): Promise<void> {
    const apiBase = getBackendUrl();
    const url = `${apiBase}/api/v1/admin/invoices/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Failed to delete invoice via backend API: HTTP ${res.status}`);
    }
  },
};

/* ---------- helpers ---------- */

export const planLabel = (v?: string) =>
  SUBSCRIPTION_PLANS.find((p) => p.value === v)?.label ?? "—";
export const paymentStateLabel = (v?: string) =>
  PAYMENT_STATES.find((p) => p.value === v)?.label ?? "Unpaid";
export const money = (amount?: string, currency?: string) =>
  amount ? `${amount} ${currency ?? ""}`.trim() : "—";

const PLAN_MONTHS: Record<SubscriptionPlan, number> = {
  none: 0,
  one_time: 0,
  monthly: 1,
  quarterly: 3,
  yearly: 12,
  retainer: 1,
};

/** Next renewal date for a plan, counted from `from` (defaults to today). */
export function nextRenewalDate(plan: SubscriptionPlan | undefined, from?: string): string {
  const months = PLAN_MONTHS[(plan ?? "none") as SubscriptionPlan] || 0;
  const base = from ? new Date(from) : new Date();
  if (!months || Number.isNaN(base.getTime())) return "";
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return next.toISOString().slice(0, 10);
}

/* ---------- subscription actions ---------- */

export async function renewSubscription(client: Client) {
  const today = new Date().toISOString().slice(0, 10);
  await clients.update(client.id, {
    subscriptionState: "active",
    paymentState: "paid" as PaymentState,
    lastPaymentAt: today,
    nextRenewalAt: nextRenewalDate(client.plan, today) || client.nextRenewalAt || "",
  });
  await paymentRecords.create({
    clientId: client.id,
    amount: client.amount ?? "",
    currency: client.currency ?? "EGP",
    method: client.paymentMethod ?? "Manual",
    status: "paid",
    invoiceRef: client.invoiceRef ?? "",
    note: "Manual renewal",
    paidAt: today,
  });
  await activityLog.record({
    action: "Subscription renewed",
    entity: client.name,
    actor: "Admin",
    status: "success",
  });
}

export async function pauseSubscription(client: Client) {
  await clients.update(client.id, { subscriptionState: "paused" });
  await activityLog.record({
    action: "Subscription paused",
    entity: client.name,
    actor: "Admin",
    status: "warning",
  });
}

export async function resumeSubscription(client: Client) {
  await clients.update(client.id, { subscriptionState: "active" });
  await activityLog.record({
    action: "Subscription resumed",
    entity: client.name,
    actor: "Admin",
    status: "info",
  });
}

/* ---------- CSV export ---------- */

const csvCell = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export function paymentsToCsv(rows: PaymentRecord[], clientName?: string): string {
  const header = ["Client", "Date", "Amount", "Currency", "Method", "Status", "Invoice", "Note"];
  const body = rows.map((r) =>
    [
      clientName ?? r.clientId,
      r.paidAt,
      r.amount,
      r.currency,
      r.method,
      r.status,
      r.invoiceRef,
      r.note ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.map(csvCell).join(","), ...body].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- printable invoice (PDF via browser print dialog) ---------- */

export function invoiceAvailable(client: Client) {
  return Boolean(client.invoiceRef && client.amount);
}

export function openInvoicePdf(client: Client, rows: PaymentRecord[]) {
  if (typeof window === "undefined") return;
  const win = window.open("", "_blank", "width=880,height=1000");
  if (!win) return;
  const paid = rows
    .filter((r) => r.status === "paid")
    .map(
      (r) =>
        `<tr><td>${r.paidAt}</td><td>${r.amount} ${r.currency}</td><td>${r.method}</td><td>${r.invoiceRef}</td></tr>`,
    )
    .join("");

  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
  <title>Invoice ${client.invoiceRef ?? client.id}</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,sans-serif;color:#111;margin:40px;}
    h1{font-size:22px;margin:0 0 4px;} .muted{color:#666;font-size:12px;}
    table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px;}
    th,td{border-bottom:1px solid #ddd;text-align:left;padding:8px 6px;}
    .box{margin-top:24px;border:1px solid #ddd;border-radius:8px;padding:16px;font-size:13px;}
    .row{display:flex;justify-content:space-between;padding:4px 0;}
  </style></head><body>
  <h1>Invoice ${client.invoiceRef ?? ""}</h1>
  <p class="muted">Ahmed Abdelwahab — nextnext-gen.com</p>
  <div class="box">
    <div class="row"><span>Client</span><strong>${client.name}</strong></div>
    <div class="row"><span>Email</span><span>${client.email ?? ""}</span></div>
    <div class="row"><span>Service</span><span>${client.service ?? ""}</span></div>
    <div class="row"><span>Plan</span><span>${planLabel(client.plan)}</span></div>
    <div class="row"><span>Amount</span><strong>${money(client.amount, client.currency)}</strong></div>
    <div class="row"><span>Paid so far</span><span>${money(client.paidAmount, client.currency)}</span></div>
    <div class="row"><span>Payment status</span><span>${paymentStateLabel(client.paymentState)}</span></div>
    <div class="row"><span>Last payment</span><span>${client.lastPaymentAt || "—"}</span></div>
    <div class="row"><span>Next renewal</span><span>${client.nextRenewalAt || "—"}</span></div>
  </div>
  ${paid ? `<table><thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Invoice</th></tr></thead><tbody>${paid}</tbody></table>` : ""}
  <script>window.onload = function(){ window.print(); };</script>
  </body></html>`);
  win.document.close();
}
