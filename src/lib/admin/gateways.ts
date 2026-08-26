/**
 * Payment gateway registry for the Admin Studio (Clients & Payments).
 *
 * Presentation-only: describes every payment rail we accept today plus the
 * gateways we are reserving a slot for (Stripe, Paddle, PayPal). Live rails map
 * to `method_id` values recorded on payment submissions.
 */

export type GatewayStatus = "live" | "planned";

export type GatewayInfo = {
  /** Matches `payment_submissions.method_id` for live rails. */
  id: string;
  name: string;
  status: GatewayStatus;
  /** Manual = proof upload, Automatic = gateway-verified. */
  mode: "manual" | "automatic";
  currencies: string[];
  rails: string[];
  region: string;
  settlement: string;
  fees: string;
  /** Key/value account or configuration details shown in the card. */
  details: { label: string; value: string }[];
  note?: string;
  link?: { label: string; href: string };
};

export const paymentGateways: GatewayInfo[] = [
  {
    id: "instapay",
    name: "InstaPay",
    status: "live",
    mode: "manual",
    currencies: ["EGP"],
    rails: ["InstaPay IPN"],
    region: "Egypt",
    settlement: "Instant to bank account",
    fees: "No platform fee",
    details: [
      { label: "IPN address", value: "rssob201050064380@instapay" },
      { label: "Verification", value: "Screenshot proof reviewed by admin" },
    ],
    link: {
      label: "Payment link",
      href: "https://ipn.eg/S/rssob201050064380/instapay/10rXjL",
    },
  },
  {
    id: "vodafone-cash",
    name: "Vodafone Cash",
    status: "live",
    mode: "manual",
    currencies: ["EGP"],
    rails: ["Mobile wallet"],
    region: "Egypt",
    settlement: "Instant to wallet",
    fees: "Carrier transfer fee paid by sender",
    details: [
      { label: "Wallet number", value: "+20 10 5006 4380" },
      { label: "Verification", value: "Screenshot proof reviewed by admin" },
    ],
  },
  {
    id: "wire",
    name: "USD Wire Transfer",
    status: "live",
    mode: "manual",
    currencies: ["USD"],
    rails: ["Wire / SWIFT"],
    region: "International",
    settlement: "1–3 business days",
    fees: "Sending bank wire fee",
    details: [
      { label: "Bank", value: "Lead Bank — 1801 Main St., Kansas City, MO 64108" },
      { label: "Account holder", value: "AHMED ABDELWAHAB" },
      { label: "Account number", value: "210890831578" },
      { label: "Routing number", value: "101019644" },
    ],
  },
  {
    id: "ach",
    name: "USD ACH Transfer",
    status: "live",
    mode: "manual",
    currencies: ["USD"],
    rails: ["ACH"],
    region: "United States",
    settlement: "1–2 business days",
    fees: "Usually free for the sender",
    details: [
      { label: "Bank", value: "Lead Bank — 1801 Main St., Kansas City, MO 64108" },
      { label: "Account holder", value: "AHMED ABDELWAHAB" },
      { label: "Account number", value: "210890831578" },
      { label: "Routing number", value: "101019644" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    status: "planned",
    mode: "automatic",
    currencies: ["USD", "EUR", "GBP"],
    rails: ["Cards", "Apple Pay", "Google Pay", "Link"],
    region: "Global",
    settlement: "2–7 days rolling payout",
    fees: "≈ 2.9% + $0.30 per charge",
    details: [
      { label: "Account", value: "Not connected" },
      { label: "Webhook", value: "Reserved — checkout + invoice events" },
      { label: "Verification", value: "Automatic, no proof upload needed" },
    ],
    note: "Slot reserved. Once connected, deposits are captured and marked paid automatically.",
  },
  {
    id: "paddle",
    name: "Paddle",
    status: "planned",
    mode: "automatic",
    currencies: ["USD", "EUR", "EGP"],
    rails: ["Cards", "PayPal", "Merchant of record"],
    region: "Global",
    settlement: "Bi-weekly payout",
    fees: "≈ 5% + $0.50 per transaction",
    details: [
      { label: "Account", value: "Not connected" },
      { label: "Tax handling", value: "Merchant of record — VAT handled for you" },
    ],
    note: "Slot reserved for subscription products and digital goods.",
  },
  {
    id: "paypal",
    name: "PayPal",
    status: "planned",
    mode: "automatic",
    currencies: ["USD", "EUR"],
    rails: ["PayPal balance", "Cards"],
    region: "Global",
    settlement: "Instant to PayPal balance",
    fees: "≈ 4.4% + fixed fee (cross-border)",
    details: [
      { label: "Account", value: "Not connected" },
      { label: "Use case", value: "Small international deposits" },
    ],
    note: "Slot reserved for clients who prefer PayPal over wire.",
  },
];

/* ---------------------------------------------------------------------------
 * CMS projection
 *
 * Gateways are editable from Admin → Content → Payments (kind `payment_method`).
 * Each entry's `data` payload maps onto GatewayInfo below, so gateways can be
 * added, edited or removed without a code change. The list above is only the
 * seed/fallback used when no entries exist yet.
 * ------------------------------------------------------------------------ */

type AnyRecord = Record<string, unknown>;

const s = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const localizedEn = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const v = value as AnyRecord;
    return s(v["en"]) || s(v["ar"]);
  }
  return "";
};

const listOf = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((v) => s(v)).filter(Boolean);
  return s(value)
    .split(/[,،]/)
    .map((v) => v.trim())
    .filter(Boolean);
};

export type GatewayContentItem = {
  id: string;
  slug: string;
  data: AnyRecord;
};

/** Maps a `payment_method` CMS entry onto the gateway card model. */
export function gatewayFromContent(item: GatewayContentItem): GatewayInfo {
  const d = item.data ?? {};
  const details: { label: string; value: string }[] = [];
  const push = (label: string, value: string) => {
    if (value) details.push({ label, value });
  };
  push("Account reference", s(d["accountReference"]));
  push("Account holder", s(d["accountHolder"]));
  push("Bank", s(d["bankName"]));
  push("Routing number", s(d["routingNumber"]));
  push("Instructions", localizedEn(d["instructions"]));

  const href = s(d["link"]);

  return {
    id: item.slug || item.id,
    name: localizedEn(d["label"]) || s(d["provider"]) || item.slug,
    status: s(d["status"]) === "live" ? "live" : "planned",
    mode: s(d["mode"]) === "automatic" ? "automatic" : "manual",
    currencies: listOf(d["currency"]),
    rails: listOf(d["rails"]),
    region: s(d["region"]) || "—",
    settlement: s(d["settlement"]) || "—",
    fees: s(d["fees"]) || "—",
    details: details.length ? details : [{ label: "Details", value: "Not configured yet" }],
    ...(s(d["note"]) ? { note: s(d["note"]) } : {}),
    ...(href ? { link: { label: "Open link", href } } : {}),
  };
}
