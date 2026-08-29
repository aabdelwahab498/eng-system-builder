/**
 * Centralized API Client for Standalone ASP.NET Core Backend
 * Base URL is environment-driven via VITE_API_BASE_URL (defaults to https://api.nextnext-gen.com).
 */

export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.["VITE_API_BASE_URL"]) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "https://api.nextnext-gen.com";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    target?: string;
  };
  statusCode: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const cleanBase = API_BASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("portfolio_jwt_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (typeof result === "object" && result !== null && "success" in result) {
        return result as ApiResponse<T>;
      }
      return {
        success: response.ok,
        data: result as T,
        statusCode: response.status,
      };
    }

    return {
      success: response.ok,
      statusCode: response.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err?.message || "Network error occurred",
      },
      statusCode: 0,
    };
  }
}
