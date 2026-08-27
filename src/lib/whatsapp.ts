import {
  NEXTGEN_CONTACT,
  NEXTGEN_WHATSAPP_DIGITS,
} from "@/content/canonical/channels";

/** Chat number only — never the Vodafone Cash wallet number. */
export const WHATSAPP_NUMBER = NEXTGEN_CONTACT.whatsapp.value;
export const WHATSAPP_DISPLAY = NEXTGEN_CONTACT.whatsapp.display ?? WHATSAPP_NUMBER;
/** Canonical WhatsApp short link used for all generic contact CTAs. */
export const WHATSAPP_LINK = NEXTGEN_CONTACT.whatsapp.url;

/**
 * Build a WhatsApp click-to-chat link using the wa.me short-link format.
 * - With a message: wa.me deep link carrying a prefilled message (same number).
 * - Without a message: the canonical WhatsApp short link.
 */
export function whatsappLink(message?: string) {
  const text = message?.trim();
  if (text) {
    return `https://wa.me/${NEXTGEN_WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;
  }
  return WHATSAPP_LINK;
}
