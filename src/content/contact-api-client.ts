/**
 * Contact Message API Client
 */

import { getApiBaseUrl } from "./projects-api-client";

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  whatsapp?: string;
  service?: string;
  locale?: string;
  source?: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function submitContactMessageApi(
  payload: ContactSubmissionPayload,
): Promise<ContactSubmissionResult> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { success: false, error: "API_NOT_CONFIGURED" };
  }

  // Safe client-side validation
  if (!payload.name || !payload.name.trim()) {
    return { success: false, error: "Name is required" };
  }
  if (!payload.email || !payload.email.trim() || !payload.email.includes("@")) {
    return { success: false, error: "Valid email is required" };
  }
  if (!payload.message || !payload.message.trim()) {
    return { success: false, error: "Message is required" };
  }

  try {
    const response = await fetch(`${baseUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        subject: payload.subject ?? (payload.service ? `Inquiry regarding ${payload.service}` : "General Contact Inquiry"),
        message: payload.message.trim(),
        whatsapp: payload.whatsapp?.trim() || undefined,
        service: payload.service || undefined,
        locale: payload.locale || "en",
        source: payload.source || "contact_form",
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Message could not be processed at this time." };
    }

    const data = await response.json();
    if (data.success) {
      return { success: true, messageId: data.data?.messageId };
    }

    return { success: false, error: "Message submission was declined." };
  } catch {
    return {
      success: false,
      error: "Network error while sending message.",
    };
  }
}
