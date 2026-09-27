// POST /api/v1/auth/register
import { NextRequest } from "next/server";
import { db, ok, err, isDb, mock } from "../../../_lib";
import { toSharedUser } from "../login/route";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "BundleCreator");
  if (!email || !password || !name) {
    return err("Email, password, and name are required", 422);
  }

  // Check for existing user — DB first, then mock
  if (isDb() && db) {
    try {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return err("Email is already registered", 409, [{ field: "email", message: "Email already in use" }]);
      }
    } catch (e) {
      console.warn("DB lookup failed in /register, continuing:", e);
    }
  }
  // Mock check
  const mockExisting = (mock.users as any[]).find((u) => u.email.toLowerCase() === email);
  if (mockExisting) {
    return err("Email is already registered", 409, [{ field: "email", message: "Email already in use" }]);
  }

  const prismaRole = role === "hotel_owner" ? "HotelOwner" : role === "HotelOwner" ? "HotelOwner" : "BundleCreator";

  let user: any = null;
  // Try DB create
  if (isDb() && db) {
    try {
      user = await db.user.create({
        data: {
          email,
          name,
          passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          role: prismaRole,
          phone: body.phone ?? null,
          companyName: body.companyName ?? null,
          businessLicense: body.businessLicense ?? null,
          tourGuideLicense: body.tourGuideLicense ?? null,
          yearsExperience: body.yearsExperience ?? null,
          languagesSpoken: body.languagesSpoken ?? [],
          kycStatus: "NotSubmitted",
        },
      });
    } catch (e) {
      console.warn("DB create failed in /register, falling back to in-memory user:", e);
      user = null;
    }
  }

  // Mock fallback — create an in-memory user
  if (!user) {
    const now = new Date().toISOString();
    user = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: prismaRole,
      phone: body.phone ?? null,
      companyName: body.companyName ?? null,
      businessLicense: body.businessLicense ?? null,
      tourGuideLicense: body.tourGuideLicense ?? null,
      yearsExperience: body.yearsExperience ?? null,
      languagesSpoken: body.languagesSpoken ?? [],
      kycStatus: "NotSubmitted",
      createdAt: now,
      updatedAt: now,
    };
    // Push to mock array so subsequent logins find this user
    (mock.users as any[]).push(user);
  }

  const shared = toSharedUser(user);
  const token = `demo-${user.id}`;
  return ok({ token, user: shared }, 201);
}
