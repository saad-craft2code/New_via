// POST /api/v1/auth/login
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../../_lib";
import { mockUsers } from "@/lib/mock-db";

function toSharedUser(user: any) {
  const sharedRole = user.role === "HotelOwner" ? "hotel_owner" : user.role === "BundleCreator" ? "bundle_creator" : "admin";
  const kycStatus =
    user.kycStatus === "Approved" || user.kycStatus === "approved" ? "approved" :
    user.kycStatus === "Pending" || user.kycStatus === "pending" ? "pending" :
    user.kycStatus === "Rejected" || user.kycStatus === "rejected" ? "rejected" : "not_submitted";
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
    languagesSpoken: user.languagesSpoken ?? [],
    avatarUrl: user.avatarUrl ?? undefined,
    kycStatus,
    kycSubmittedAt: user.kycSubmittedAt ?? undefined,
    kycReviewedAt: user.kycReviewedAt ?? undefined,
    kycRejectionReason: user.kycRejectionReason ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) return err("Email and password are required", 422);

  // Try database first
  if (db) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        const token = `demo-${user.id}`;
        return ok({ token, user: toSharedUser(user) });
      }
    } catch (e) {
      console.log("DB error, falling back to mock:", e);
    }
  }

  // Fallback to mock data — accept ANY password for demo
  const mockUser = mockUsers.find((u) => u.email === email);
  if (mockUser) {
    const token = `demo-${mockUser.id}`;
    return ok({ token, user: toSharedUser(mockUser) });
  }

  return err("Invalid credentials", 401);
}
