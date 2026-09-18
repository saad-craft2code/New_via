// POST /api/v1/auth/register
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../../_lib";
import { toSharedUser } from "../_shared";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password || !name) return err("Email, password, and name are required", 422);

  if (isDb() && db) {
    try {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) return err("Email already registered", 409);
      const prismaRole = body.role === "hotel_owner" ? "HotelOwner" : "BundleCreator";
      const user = await db.user.create({
        data: { email, name, passwordHash: "demo", role: prismaRole, phone: body.phone, companyName: body.companyName, languagesSpoken: body.languagesSpoken ?? [], kycStatus: "NotSubmitted" }
      });
      return ok({ token: `demo-${user.id}`, user: toSharedUser(user) }, 201);
    } catch (e) { console.log("DB error, using mock"); }
  }

  // Mock: create user in memory
  const newUser = { id: "user-" + Date.now(), email, name, role: body.role === "hotel_owner" ? "HotelOwner" : "BundleCreator", phone: body.phone, companyName: body.companyName, languagesSpoken: body.languagesSpoken ?? [], kycStatus: "NotSubmitted", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  return ok({ token: `demo-${newUser.id}`, user: toSharedUser(newUser) }, 201);
}
