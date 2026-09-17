// GET /api/v1/hotels  → list hotels owned by current user
// POST /api/v1/hotels → create a hotel
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";
import { toSharedUser } from "../../v1/auth/login/route";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  const hotels = await db.hotel.findMany({
    where: { ownerId: userId },
    include: { rooms: true },
    orderBy: { createdAt: "desc" },
  });

  return ok(hotels.map((h) => ({
    id: h.id,
    ownerId: h.ownerId,
    name: h.name,
    description: h.description,
    starRating: h.starRating,
    location: h.location,
    city: h.city,
    latitude: h.latitude ?? undefined,
    longitude: h.longitude ?? undefined,
    amenities: parseArr(h.amenities),
    images: parseArr(h.images),
    policies: h.policies ? safeJson(h.policies) : undefined,
    rooms: h.rooms.map((r) => ({
      id: r.id,
      hotelId: r.hotelId,
      roomType: r.roomType,
      bedType: r.bedType,
      maxGuests: r.maxGuests,
      pricePerNight: r.pricePerNight,
      size: r.size ?? undefined,
      amenities: parseArr(r.amenities),
      images: parseArr(r.images),
      totalUnits: r.totalUnits,
      availableUnits: r.availableUnits,
    })),
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const name = String(body.name ?? "").trim();
  if (!name) return err("Hotel name is required", 422, [{ field: "name", message: "Name is required" }]);

  const hotel = await db.hotel.create({
    data: {
      ownerId: userId,
      name,
      description: String(body.description ?? ""),
      starRating: Number(body.starRating ?? 5),
      location: String(body.location ?? ""),
      city: body.city ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      amenities: JSON.stringify(body.amenities ?? []),
      images: JSON.stringify(body.images ?? []),
      policies: body.policies ? JSON.stringify(body.policies) : null,
    },
  });
  return ok({ ...hotel, amenities: parseArr(hotel.amenities), images: parseArr(hotel.images), policies: hotel.policies ? safeJson(hotel.policies) : undefined }, 201);
}

function safeJson(s: string): any {
  try { return JSON.parse(s); } catch { return undefined; }
}
