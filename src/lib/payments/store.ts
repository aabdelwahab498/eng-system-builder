/**
 * Payment submissions repository (V1: frontend-only mock).
 *
 * The UI talks only to this interface, so a backend implementation can replace
 * the local-storage adapter later without touching any component.
 * Nothing here verifies a payment — submissions are client-supplied evidence.
 */

import type { PaymentSubmission, PaymentSubmissionStatus } from "@/content/canonical/commerce";

export interface PaymentSubmissionRepository {
  list(): Promise<PaymentSubmission[]>;
  create(input: Omit<PaymentSubmission, "id" | "submittedAt" | "status">): Promise<PaymentSubmission>;
  setStatus(id: string, status: PaymentSubmissionStatus, note?: string): Promise<void>;
}

const KEY = "nng.payment-submissions.v1";

const read = (): PaymentSubmission[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PaymentSubmission[]) : [];
  } catch {
    return [];
  }
};

const write = (items: PaymentSubmission[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
};

export const localPaymentSubmissions: PaymentSubmissionRepository = {
  async list() {
    return read().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  },
  async create(input) {
    const submission: PaymentSubmission = {
      ...input,
      id: `sub_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
      status: "pending_review",
    };
    write([submission, ...read()]);
    return submission;
  },
  async setStatus(id, status, note) {
    write(read().map((s) => (s.id === id ? { ...s, status, note: note ?? s.note } : s)));
  },
};

export const paymentSubmissions: PaymentSubmissionRepository = localPaymentSubmissions;

export const STATUS_LABELS: Record<PaymentSubmissionStatus, { en: string; ar: string }> = {
  pending_review: { en: "Pending Review", ar: "قيد المراجعة" },
  approved: { en: "Approved", ar: "تم القبول" },
  rejected: { en: "Rejected", ar: "مرفوض" },
  needs_more_information: { en: "Needs More Information", ar: "بحاجة لمعلومات إضافية" },
};
