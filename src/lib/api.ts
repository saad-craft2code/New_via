/**
 * Lightweight fetch-based API client.
 * - Talks to local Next.js API routes under /api/v1 (no external backend needed)
 * - Automatically attaches Bearer token from localStorage
 * - On 401, clears auth state and bounces to landing
 */

import type { ApiResponse } from "@via/shared-types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

const TOKEN_KEY = "via-token";
const STAFF_TOKEN_KEY = "via-staff-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(STAFF_TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    // Staff tokens (staff-*) go to the staff key; everything else to the user key
    if (token.startsWith("staff-")) localStorage.setItem(STAFF_TOKEN_KEY, token);
    else localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearStaffToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STAFF_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  errors?: { field?: string; message: string }[];

  constructor(
    message: string,
    status: number,
    errors?: { field?: string; message: string }[],
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Set to true to skip the Authorization header (e.g. for /auth/login). */
  skipAuth?: boolean;
}

async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { body, query, skipAuth, headers, ...rest } = opts;

  // Build the URL — handle both absolute (http://...) and relative (/api/v1) base URLs.
  const fullPath = `${BASE_URL}${path}`;
  // Use window.location.origin only on the client; on the server, fallback to a plain path.
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = new URL(fullPath, origin || "http://localhost");
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) ?? {}),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: ApiResponse<T> | null = null;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const message = json?.message ?? `Request failed (${res.status})`;
    if (res.status === 401) {
      // Clear auth state and let the UI bounce back to landing.
      setToken(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("via:unauthorized"));
      }
    }
    throw new ApiError(message, res.status, json?.errors);
  }

  // For endpoints that return the data directly vs. wrapped in ApiResponse
  return (json?.data !== undefined ? json.data : (json as unknown)) as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  delete: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),

  /** Upload a file using multipart/form-data (skips JSON content-type). */
  upload: async <T = unknown>(
    path: string,
    formData: FormData,
    opts?: Omit<RequestOptions, "body" | "headers">,
  ): Promise<T> => {
    const fullPath = `${BASE_URL}${path}`;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = new URL(fullPath, origin || "http://localhost");
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: formData,
    });
    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok) {
      throw new ApiError(json.message ?? "Upload failed", res.status, json.errors);
    }
    return (json.data ?? (json as unknown)) as T;
  },
};
