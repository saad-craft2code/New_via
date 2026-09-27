// /api/v1/users/me — GET (profile) PATCH (update profile)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, isDb, mock } from "../../../_lib";
import { toSharedUser } from "../../auth/login/route";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  let user: any = null;
  try {
    if (isDb() && db) {
      user = await db.user.findUnique({ where: { id: userId } });
    }
  } catch (e) {
    console.warn("DB lookup failed in /users/me, falling back to mock:", e);
    user = null;
  }
  if (!user) {
    user = (mock.users as any[]).find((u) => u.id === userId);
  }
  if (!user) return err("User not found", 404);
  return ok(toSharedUser(user));
}

export async function PATCH(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  let updated: any = null;
  try {
    if (isDb() && db) {
      updated = await db.user.update({
        where: { id: userId },
        data: {
          ...(body.name !== undefined && { name: String(body.name) }),
          ...(body.phone !== undefined && { phone: body.phone }),
          ...(body.companyName !== undefined && { companyName: body.companyName }),
          ...(body.businessLicense !== undefined && { businessLicense: body.businessLicense }),
          ...(body.tourGuideLicense !== undefined && { tourGuideLicense: body.tourGuideLicense }),
          ...(body.yearsExperience !== undefined && { yearsExperience: body.yearsExperience }),
          ...(body.languagesSpoken !== undefined && { languagesSpoken: body.languagesSpoken ?? [] }),
          ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        },
      });
    }
  } catch (e) {
    console.warn("DB update failed in /users/me, updating in-memory:", e);
    updated = null;
  }

  // Mock fallback — update in-memory user
  if (!updated) {
    const user = (mock.users as any[]).find((u) => u.id === userId);
    if (!user) return err("User not found", 404);
    if (body.name !== undefined) user.name = String(body.name);
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.companyName !== undefined) user.companyName = body.companyName;
    if (body.businessLicense !== undefined) user.businessLicense = body.businessLicense;
    if (body.tourGuideLicense !== undefined) user.tourGuideLicense = body.tourGuideLicense;
    if (body.yearsExperience !== undefined) user.yearsExperience = body.yearsExperience;
    if (body.languagesSpoken !== undefined) user.languagesSpoken = body.languagesSpoken ?? [];
    if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;
    updated = user;
  }
  return ok(toSharedUser(updated));
}
