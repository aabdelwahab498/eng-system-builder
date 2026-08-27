/**
 * Canonical NextGen contact channels (Phase 5).
 *
 * Single source of truth for every public/business communication channel
 * owned by NextGen. Components read these values — never hardcode URLs,
 * numbers or email addresses elsewhere.
 *
 * Rule (per the 2026-08-27 canonical config): these are the current canonical
 * NextGen contact references. Do not replace them with alternative
 * personal/social accounts unless explicitly requested. The business email
 * is `PENDING` until the official NextGen commercial mailbox is created.
 */

export type ContactChannelStatus = "active" | "pending";

export type NextGenChannel = {
  /** Stable public URL (or mailto:) for the channel. */
  url: string;
  /** Raw underlying value — phone digits, page id, or email address. */
  value: string;
  /** Human-friendly display form (for phone numbers). */
  display?: string;
  status: ContactChannelStatus;
};

export type NextGenContactConfig = {
  facebook: NextGenChannel;
  messenger: NextGenChannel;
  whatsapp: NextGenChannel;
  gmail: NextGenChannel;
  outlook: NextGenChannel;
  /** Official NextGen commercial mailbox — not yet created. */
  businessEmail: NextGenChannel;
};

/** Facebook page numeric id (extracted once, reused everywhere). */
export const NEXTGEN_FACEBOOK_ID = "61582424456394";

export const NEXTGEN_CONTACT: NextGenContactConfig = {
  facebook: {
    url: `https://www.facebook.com/profile.php?id=${NEXTGEN_FACEBOOK_ID}`,
    value: NEXTGEN_FACEBOOK_ID,
    status: "active",
  },
  messenger: {
    url: `https://m.me/${NEXTGEN_FACEBOOK_ID}`,
    value: NEXTGEN_FACEBOOK_ID,
    status: "active",
  },
  whatsapp: {
    url: "https://wa.me/201105725029",
    value: "+201105725029",
    display: "+20 110 572 5029",
    status: "active",
  },
  gmail: {
    url: "mailto:aabdelwahab498@gmail.com",
    value: "aabdelwahab498@gmail.com",
    status: "active",
  },
  outlook: {
    // Outlook web — uses the same professional identity (aabdelwahab498@gmail.com).
    url: "https://outlook.live.com/",
    value: "aabdelwahab498@gmail.com",
    status: "active",
  },
  businessEmail: {
    // PENDING — replace with the official address + mailto: once created.
    url: "",
    value: "PENDING",
    status: "pending",
  },
};

/** True only once the official business mailbox is configured. */
export const BUSINESS_EMAIL_READY = NEXTGEN_CONTACT.businessEmail.status === "active";

/**
 * Flat map of NextGen channel URLs — convenience for places that only need
 * the bare links (e.g. the Admin outreach bar). Kept in sync with NEXTGEN_CONTACT.
 */
export const NEXTGEN_CHANNELS = {
  facebook: NEXTGEN_CONTACT.facebook.url,
  messenger: NEXTGEN_CONTACT.messenger.url,
  whatsapp: NEXTGEN_CONTACT.whatsapp.url,
  gmail: NEXTGEN_CONTACT.gmail.value,
  outlook: NEXTGEN_CONTACT.outlook.url,
} as const;

/** Gmail address used by every contact CTA (Email, Gmail, Outlook compose). */
export const NEXTGEN_EMAIL = NEXTGEN_CONTACT.gmail.value;

/** WhatsApp click-to-chat number (digits only) for deep links. */
export const NEXTGEN_WHATSAPP_DIGITS = NEXTGEN_CONTACT.whatsapp.value.replace(/\D/g, "");
