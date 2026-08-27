/**
 * Business-side repositories for the Admin Studio (V1: frontend-only).
 *
 * These are NOT backed by a database yet. Every screen talks to the exported
 * repository interfaces, so a future API implementation can replace the
 * local-storage adapters without any UI change.
 *
 * Conceptual future contract:
 *   GET/POST/PUT/DELETE /api/admin/service-requests
 *   GET/POST/PUT/DELETE /api/admin/clients
 *   GET/POST            /api/admin/subscribers
 *   GET/POST            /api/admin/activity
 *   GET/PUT             /api/admin/site-settings
 */

export type ServiceRequestStatus =
  | "new"
  | "contacted"
  | "proposal_sent"
  | "deposit_pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ServiceRequest = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
  status: ServiceRequestStatus;
  note: string;
  createdAt: string;
};

export type ClientStatus =
  "lead" | "client" | "active_project" | "completed" | "returning" | "archived";

export type SubscriptionPlan =
  "none" | "one_time" | "monthly" | "quarterly" | "yearly" | "retainer";

export type PaymentState =
  "unpaid" | "deposit_paid" | "partially_paid" | "paid" | "overdue" | "refunded";

export type Client = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  service: string;
  projects: string;
  paymentStatus: string;
  status: ClientStatus;
  /* Payment & subscription */
  plan?: SubscriptionPlan;
  subscriptionState?: "active" | "paused" | "cancelled";
  paymentState?: PaymentState;

  paymentMethod?: string;
  amount?: string;
  currency?: string;
  paidAmount?: string;
  lastPaymentAt?: string;
  nextRenewalAt?: string;
  invoiceRef?: string;
  createdAt: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  plan?: SubscriptionPlan;
  paymentState?: PaymentState;
  amount?: string;
  currency?: string;
  nextRenewalAt?: string;
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  action: string;
  entity: string;
  actor: string;
  status: "success" | "info" | "warning";
  createdAt: string;
};

export type SiteSettings = {
  siteName: string;
  monogram: string;
  defaultLocale: "en" | "ar";
  theme: "dark" | "light" | "system";
  accent: string;
  contactEmail: string;
  whatsappUrl: string;
  footerText: string;
  copyright: string;
  maintenanceMode: boolean;
  announcement: string;
  announcementEnabled: boolean;
};

export interface CollectionRepository<T extends { id: string }> {
  list(): Promise<T[]>;
  create(input: Omit<T, "id" | "createdAt">): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface SettingsRepository<T> {
  get(): Promise<T>;
  save(value: T): Promise<void>;
}

const id = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function localCollection<T extends { id: string; createdAt: string }>(
  key: string,
  prefix: string,
): CollectionRepository<T> {
  return {
    async list() {
      return read<T[]>(key, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async create(input) {
      const item = {
        ...(input as object),
        id: id(prefix),
        createdAt: new Date().toISOString(),
      } as T;
      write(key, [item, ...read<T[]>(key, [])]);
      return item;
    },
    async update(itemId, patch) {
      write(
        key,
        read<T[]>(key, []).map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
      );
    },
    async remove(itemId) {
      write(
        key,
        read<T[]>(key, []).filter((item) => item.id !== itemId),
      );
    },
  };
}

export const serviceRequests = localCollection<ServiceRequest>("nng.admin.requests.v1", "req");
export const clients = localCollection<Client>("nng.admin.clients.v1", "cli");
export const subscribers = localCollection<Subscriber>("nng.admin.subscribers.v1", "sub");

const ACTIVITY_KEY = "nng.admin.activity.v1";

export const activityLog = {
  ...localCollection<ActivityEntry>(ACTIVITY_KEY, "act"),
  async record(entry: Omit<ActivityEntry, "id" | "createdAt">) {
    const item: ActivityEntry = { ...entry, id: id("act"), createdAt: new Date().toISOString() };
    write(ACTIVITY_KEY, [item, ...read<ActivityEntry[]>(ACTIVITY_KEY, [])].slice(0, 200));
  },
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Ahmed Abdelwahab — nextnext-gen",
  monogram: "AA",
  defaultLocale: "en",
  theme: "dark",
  accent: "#C9974B",
  contactEmail: "",
  whatsappUrl: "https://api.whatsapp.com/send?phone=201105725029",
  footerText: "Software Engineer · Full-Stack Developer · AI Engineer · Product Builder",
  copyright: `© ${new Date().getFullYear()} Ahmed Abdelwahab`,
  maintenanceMode: false,
  announcement: "",
  announcementEnabled: false,
};

const SETTINGS_KEY = "nng.admin.site-settings.v1";

export const siteSettings: SettingsRepository<SiteSettings> = {
  async get() {
    return { ...DEFAULT_SITE_SETTINGS, ...read<Partial<SiteSettings>>(SETTINGS_KEY, {}) };
  },
  async save(value) {
    write(SETTINGS_KEY, value);
  },
};

export const REQUEST_STATUSES: { value: ServiceRequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "deposit_pending", label: "Deposit pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const CLIENT_STATUSES: { value: ClientStatus; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "client", label: "Client" },
  { value: "active_project", label: "Active project" },
  { value: "completed", label: "Completed" },
  { value: "returning", label: "Returning client" },
  { value: "archived", label: "Archived" },
];

export const ADMIN_WHATSAPP = "https://api.whatsapp.com/send?phone=201105725029";

export const SUBSCRIPTION_PLANS: { value: SubscriptionPlan; label: string }[] = [
  { value: "none", label: "No plan" },
  { value: "one_time", label: "One-time project" },
  { value: "monthly", label: "Monthly subscription" },
  { value: "quarterly", label: "Quarterly subscription" },
  { value: "yearly", label: "Yearly subscription" },
  { value: "retainer", label: "Support retainer" },
];

export const PAYMENT_STATES: { value: PaymentState; label: string }[] = [
  { value: "unpaid", label: "Unpaid" },
  { value: "deposit_paid", label: "Deposit paid" },
  { value: "partially_paid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "refunded", label: "Refunded" },
];

export const CURRENCIES = ["EGP", "USD", "EUR", "SAR", "AED"];
