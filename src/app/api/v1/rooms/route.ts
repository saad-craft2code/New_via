// /api/v1/rooms — GET (all rooms for current user) POST (create)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
  const hotelIds = hotels.map((h) => h.id);
  const rooms = await db.room.findMany({ where: { hotelId: { in: hotelIds } }, include: { hotel: true } });

  return ok(rooms.map((r) => ({
    id: r.id,
    hotelId: r.hotelId,
    hotelName: r.hotel.name,
    roomType: r.roomType,
    bedType: r.bedType,
    maxGuests: r.maxGuests,
    pricePerNight: r.pricePerNight,
    size: r.size ?? undefined,
    amenities: parseArr(r.amenities),
    images: parseArr(r.images),
    totalUnits: r.totalUnits,
    availableUnits: r.availableUnits,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const hotelId = String(body.hotelId ?? "");
  if (!hotelId) return err("hotelId is required", 422);
  const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) return err("Hotel not found", 404);
  if (hotel.ownerId !== userId) return err("Forbidden", 403);

  const room = await db.room.create({
    data: {
      hotelId,
      roomType: String(body.roomType ?? "Standard"),
      bedType: String(body.bedType ?? "Queen"),
      maxGuests: Number(body.maxGuests ?? 2),
      pricePerNight: Number(body.pricePerNight ?? 100),
      size: body.size ?? null,
      amenities: body.amenities ?? [],
      images: body.images ?? [],
      totalUnits: Number(body.totalUnits ?? 1),
      availableUnits: Number(body.availableUnits ?? 1),
    },
  });
  return ok({ ...room, amenities: parseArr(room.amenities), images: parseArr(room.images) }, 201);
}
