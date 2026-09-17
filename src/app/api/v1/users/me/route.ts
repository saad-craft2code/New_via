// /api/v1/users/me — GET (profile) PATCH (update profile)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";
import { toSharedUser } from "../auth/login/route";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return err("User not found", 404);
  return ok(toSharedUser(user));
}

export async function PATCH(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.companyName !== undefined && { companyName: body.companyName }),
      ...(body.businessLicense !== undefined && { businessLicense: body.businessLicense }),
      ...(body.tourGuideLicense !== undefined && { tourGuideLicense: body.tourGuideLicense }),
      ...(body.yearsExperience !== undefined && { yearsExperience: body.yearsExperience }),
      ...(body.languagesSpoken !== undefined && { languagesSpoken: JSON.stringify(body.languagesSpoken) }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
    },
  });
  return ok(toSharedUser(updated));
}
