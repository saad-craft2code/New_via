// Shared helpers for /api/v1/* route handlers
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mock auth: any Bearer token resolves to the demo user.
// The login route returns tokens like "demo-user-bc-demo" / "demo-user-ho-demo" —
// we strip the "demo-" prefix (5 chars) to recover the userId.
// Staff tokens (staff-*) do NOT authenticate as admin user.
export async function getAuthUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  // Staff tokens do not authenticate as admin
  if (token.startsWith("staff-")) return null;
  // User tokens: strip "demo-" prefix
  if (token.startsWith("demo-")) return token.slice("demo-".length);
  // Fallback for arbitrary tokens: default to bundle creator demo user.
  return "user-bc-demo";
}

// Staff auth: tokens look like "staff-<staffId>"
export async function getAuthStaffId(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  if (token.startsWith("staff-")) return token.slice("staff-".length);
  return null;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data, message: "OK" } as ApiResponse<T>, { status });
}

export function err(message: string, status = 400, errors?: { field?: string; message: string }[]) {
  return NextResponse.json({ success: false, data: null, message, errors } as ApiResponse<null>, { status });
}

export { db };
