// /api/v1/guests — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const guests = await db.guestProfile.findMany({ orderBy: { createdAt: "desc" } });
      return ok(guests.map((g: any) => ({ ...g, preferences: g.preferences ?? [] })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.guestProfiles);
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "GUEST-" + Date.now(), ...body, preferences: body.preferences ?? [], totalStays: 0, totalSpent: 0, blacklisted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
