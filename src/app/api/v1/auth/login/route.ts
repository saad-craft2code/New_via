// POST /api/v1/auth/login
// Body: { email, password, role? }
// Returns: { token, user } where user matches the shared-types User shape
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../_lib";

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

  const user = await db.user.findUnique({ where: { email } });
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
    user.kycStatus === "Approved" ? "approved" :
    user.kycStatus === "Pending" ? "pending" :
    user.kycStatus === "Rejected" ? "rejected" : "not_submitted";
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

function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
