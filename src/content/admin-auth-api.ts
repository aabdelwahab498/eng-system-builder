import { getApiBaseUrl } from "./projects-api-client";

export interface LoginResponseDto {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

const STORAGE_KEY = "nng_admin_token";

export function getStoredAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredAdminToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function clearStoredAdminToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function loginAdminApi(email: string, password: string): Promise<LoginResponseDto> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("Backend API URL is unconfigured.");
  }

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Invalid admin credentials");
  }

  const data = json.data as LoginResponseDto;
  setStoredAdminToken(data.token);
  return data;
}

export async function fetchWithAdminAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("Backend API URL is unconfigured.");
  }

  const token = getStoredAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    clearStoredAdminToken();
  }

  return res;
}

// ------------------------------------------------------------- Admin CRUD API Client Helpers

export async function fetchAdminProjectsApi() {
  const res = await fetchWithAdminAuth("/admin/projects");
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function createAdminProjectApi(payload: any) {
  const res = await fetchWithAdminAuth("/admin/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Failed to create project");
  return json.data;
}

export async function updateAdminProjectApi(id: string, payload: any) {
  const res = await fetchWithAdminAuth(`/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Failed to update project");
  return json.data;
}

export async function deleteAdminProjectApi(id: string) {
  const res = await fetchWithAdminAuth(`/admin/projects/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Failed to delete project");
  return json.data;
}

export async function fetchAdminServicesApi() {
  const res = await fetchWithAdminAuth("/admin/services");
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function fetchAdminProductsApi() {
  const res = await fetchWithAdminAuth("/admin/products");
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function fetchAdminCoursesApi() {
  const res = await fetchWithAdminAuth("/admin/courses");
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function fetchAdminArticlesApi() {
  const res = await fetchWithAdminAuth("/admin/articles");
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function fetchAdminAnnouncementsApi() {
  const res = await fetchWithAdminAuth("/admin/announcements");
  const json = await res.json();
  return json.success ? json.data : [];
}
