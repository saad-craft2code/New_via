// /api/v1/hotels — GET (list) POST (create)
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const hotels = await db.hotel.findMany({ where: { ownerId: userId }, include: { rooms: true }, orderBy: { createdAt: "desc" } });
      return ok(hotels.map((h: any) => ({ ...h, amenities: h.amenities ?? [], images: h.images ?? [], rooms: h.rooms ?? [] })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.hotels.filter(h => h.ownerId === userId).map(h => ({ ...h, rooms: mock.rooms.filter(r => r.hotelId === h.id) })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const name = String(body.name ?? "").trim();
  if (!name) return err("Hotel name is required", 422);
  return ok({ id: "HTL-" + Date.now(), ownerId: userId, name, description: body.description ?? "", starRating: body.starRating ?? 5, location: body.location ?? "", city: body.city ?? null, amenities: body.amenities ?? [], images: body.images ?? [], rooms: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
