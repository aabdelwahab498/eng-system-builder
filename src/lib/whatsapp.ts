import { CONTACT_NUMBERS } from "@/content/canonical/commerce";

/** Chat number only — never the Vodafone Cash wallet number. */
export const WHATSAPP_NUMBER = CONTACT_NUMBERS.whatsapp;
export const WHATSAPP_DISPLAY = CONTACT_NUMBERS.whatsappDisplay;
/** Canonical WhatsApp short link used for all generic contact CTAs. */
export const WHATSAPP_LINK = CONTACT_NUMBERS.whatsappShortLink;

/**
 * Build a WhatsApp click-to-chat link.
 * - With a message: deep link to wa.me carrying a prefilled message (same number).
 * - Without a message: the canonical wa.link short link.
 */
export function whatsappLink(message?: string) {
  const text = message?.trim();
  if (text) {
    const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
  return WHATSAPP_LINK;
}
