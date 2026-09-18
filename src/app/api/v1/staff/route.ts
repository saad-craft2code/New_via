// /api/v1/staff — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const staff = await db.staff.findMany({ include: { hotel: true }, orderBy: { createdAt: "desc" } });
      return ok(staff.map((s: any) => ({ ...s, taskStats: {} })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.staff.map(s => ({ ...s, hotel: mock.hotels.find(h => h.id === s.hotelId), taskStats: {} })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "staff-" + Date.now(), ...body, isActive: true, hiredAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
