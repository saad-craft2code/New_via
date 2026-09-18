// /api/v1/checkins — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const checkIns = await db.checkIn.findMany({ include: { hotel: true, room: true, guest: true }, orderBy: { checkInAt: "desc" } });
      return ok(checkIns);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.checkIns.map(c => ({ ...c, hotel: mock.hotels.find(h => h.id === c.hotelId), room: mock.rooms.find(r => r.id === c.roomId) })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "CHK-" + Date.now(), status: "checked_in", checkInAt: new Date().toISOString(), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
