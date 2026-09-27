// POST /api/v1/auth/login
// Body: { email, password, role? }
// Returns: { token, user } where user matches the shared-types User shape
import { NextRequest } from "next/server";
import { db, ok, err, isDb, mock } from "../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body", 400);
  }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return err("Email and password are required", 422, [
      !email ? { field: "email", message: "Email is required" } : { field: "password", message: "Password is required" },
    ]);
  }

  // Try DB first; if not available or lookup fails, fall back to mock demo users
  let user: any = null;
  try {
    if (isDb() && db) {
      user = await db.user.findUnique({ where: { email } });
    }
  } catch (e) {
    console.warn("DB lookup failed, falling back to mock users:", e);
    user = null;
  }

  // Mock fallback — demo accounts always work (any password accepted)
  if (!user) {
    user = (mock.users as any[]).find((u) => u.email.toLowerCase() === email);
  }

  if (!user) {
    return err("Invalid credentials", 401);
  }
  // For the demo we accept any password (the seed stores a placeholder hash).

  const shared = toSharedUser(user);
  const token = `demo-${user.id}`;
  return ok({ token, user: shared });
}

export function toSharedUser(user: any) {
  const sharedRole = user.role === "HotelOwner" ? "hotel_owner" : user.role === "BundleCreator" ? "bundle_creator" : "admin";
  const kycStatus =
    user.kycStatus === "Approved" || user.kycStatus === "approved" ? "approved" :
    user.kycStatus === "Pending" || user.kycStatus === "pending" ? "pending" :
    user.kycStatus === "Rejected" || user.kycStatus === "rejected" ? "rejected" :
    "not_submitted";
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: sharedRole,
    phone: user.phone ?? undefined,
    companyName: user.companyName ?? undefined,
    businessLicense: user.businessLicense ?? undefined,
    tourGuideLicense: user.tourGuideLicense ?? undefined,
    yearsExperience: user.yearsExperience ?? undefined,
    languagesSpoken: safeParse(user.languagesSpoken, []),
    avatarUrl: user.avatarUrl ?? undefined,
    kycStatus,
    kycSubmittedAt: user.kycSubmittedAt ?? undefined,
    kycReviewedAt: user.kycReviewedAt ?? undefined,
    kycRejectionReason: user.kycRejectionReason ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function safeParse<T>(s: any, fallback: T): T {
  if (!s) return fallback;
  if (Array.isArray(s)) return s as unknown as T;
  if (typeof s !== "string") return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
