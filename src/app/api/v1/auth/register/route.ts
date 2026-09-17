// POST /api/v1/auth/register
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../_lib";
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

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return err("Email is already registered", 409, [{ field: "email", message: "Email already in use" }]);
  }

  const prismaRole = role === "hotel_owner" ? "HotelOwner" : role === "HotelOwner" ? "HotelOwner" : "BundleCreator";
  const user = await db.user.create({
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
      languagesSpoken: JSON.stringify(body.languagesSpoken ?? []),
      kycStatus: "NotSubmitted",
    },
  });

  const shared = toSharedUser(user);
  const token = `demo-${user.id}`;
  return ok({ token, user: shared }, 201);
}
