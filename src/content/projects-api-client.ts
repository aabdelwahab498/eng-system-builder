/**
 * Projects-Only HTTP API Client for Portfolio Backend Integration
 */

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: string[];
  } | null;
  meta?: {
    timestamp?: string;
    locale?: string;
    correlationId?: string;
  };
}

export interface ApiClientResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const DEFAULT_TIMEOUT_MS = 3000;

export const getApiBaseUrl = (): string | null => {
  const url = import.meta.env["VITE_PORTFOLIO_API_URL"];
  if (!url || typeof url !== "string" || url.trim() === "") {
    return null;
  }
  return url.trim().replace(/\/+$/, "");
};

export async function fetchProjectsFromApi<T>(
  endpoint: string,
  options?: {
    locale?: string;
    timeoutMs?: number;
  },
): Promise<ApiClientResult<T>> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { ok: false, error: "API_URL_NOT_CONFIGURED" };
  }

  const locale = options?.locale ?? "en";
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const url = new URL(`${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
  url.searchParams.set("locale", locale);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return { ok: false, error: `HTTP_${response.status}` };
    }

    const payload = (await response.json()) as ApiResponseEnvelope<T>;
    if (!payload.success || payload.data === null || payload.data === undefined) {
      return {
        ok: false,
        error: payload.error?.message ?? "INVALID_API_RESPONSE",
      };
    }

    return { ok: true, data: payload.data };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "NETWORK_ERROR",
    };
  }
}
