import { CONTACT_NUMBERS } from "@/content/canonical/commerce";

/** Chat number only — never the Vodafone Cash wallet number. */
export const WHATSAPP_NUMBER = CONTACT_NUMBERS.whatsapp;
export const WHATSAPP_DISPLAY = CONTACT_NUMBERS.whatsappDisplay;
/** Canonical WhatsApp short link used for all generic contact CTAs. */
export const WHATSAPP_LINK = CONTACT_NUMBERS.whatsappShortLink;

/**
 * Build a WhatsApp click-to-chat link using the wa.me short-link format.
 * - With a message: wa.me deep link carrying a prefilled message (same number).
 * - Without a message: the canonical WhatsApp short link.
 */
export function whatsappLink(message?: string) {
  const text = message?.trim();
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (text) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
  return WHATSAPP_LINK;
}
