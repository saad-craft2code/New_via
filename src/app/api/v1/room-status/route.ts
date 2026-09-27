// /api/v1/room-status — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const rooms = await db.room.findMany({ include: { hotel: true }, orderBy: { roomType: "asc" } });
      return ok(rooms.map((r: any) => ({ ...r, hotel: r.hotel, amenities: r.amenities ?? [], images: r.images ?? [], status: r.availableUnits === 0 ? "out_of_order" : "available", activeCheckIn: null })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.rooms.map(r => ({ ...r, hotel: mock.hotels.find(h => h.id === r.hotelId), status: r.availableUnits === 0 ? "out_of_order" : "available", activeCheckIn: null })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "LOG-" + Date.now(), changedBy: userId, ...body, createdAt: new Date().toISOString() }, 201);
}
