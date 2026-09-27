// /api/v1/guests/[id] — PATCH / DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const data: any = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.nameAr !== undefined) data.nameAr = body.nameAr;
  if (body.email !== undefined) data.email = body.email;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.nationality !== undefined) data.nationality = body.nationality;
  if (body.idType !== undefined) data.idType = body.idType;
  if (body.idNumber !== undefined) data.idNumber = body.idNumber;
  if (body.gender !== undefined) data.gender = body.gender;
  if (body.address !== undefined) data.address = body.address;
  if (body.city !== undefined) data.city = body.city;
  if (body.country !== undefined) data.country = body.country;
  if (body.preferences !== undefined) data.preferences = body.preferences ?? [];
  if (body.dietaryNeeds !== undefined) data.dietaryNeeds = body.dietaryNeeds;
  if (body.vipStatus !== undefined) data.vipStatus = String(body.vipStatus);
  if (body.blacklisted !== undefined) data.blacklisted = Boolean(body.blacklisted);
  if (body.notes !== undefined) data.notes = body.notes;

  const updated = await db.guestProfile.update({ where: { id }, data });
  return ok({ ...updated, preferences: parseArr(updated.preferences) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  await db.guestProfile.delete({ where: { id } });
  return ok({ id });
}
