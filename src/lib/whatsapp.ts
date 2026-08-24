import { CONTACT_NUMBERS } from "@/content/canonical/commerce";

/** Chat number only — never the Vodafone Cash wallet number. */
export const WHATSAPP_NUMBER = CONTACT_NUMBERS.whatsapp;
export const WHATSAPP_DISPLAY = CONTACT_NUMBERS.whatsappDisplay;

export function whatsappLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
