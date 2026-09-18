// /api/v1/rooms — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
      const rooms = await db.room.findMany({ where: { hotelId: { in: hotels.map((h: any) => h.id) } }, include: { hotel: true } });
      return ok(rooms.map((r: any) => ({ ...r, amenities: r.amenities ?? [], images: r.images ?? [], hotelName: r.hotel?.name })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.rooms.map(r => ({ ...r, hotelName: mock.hotels.find(h => h.id === r.hotelId)?.name })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "ROOM-" + Date.now(), ...body, amenities: body.amenities ?? [], images: body.images ?? [], totalUnits: body.totalUnits ?? 1, availableUnits: body.availableUnits ?? 1 }, 201);
}
