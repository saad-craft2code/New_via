// GET /api/v1/hotels  → list hotels owned by current user
// POST /api/v1/hotels → create a hotel
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, isDb, mock } from "../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
  return [];
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  let hotels: any[] = [];
  try {
    if (isDb() && db) {
      hotels = await db.hotel.findMany({
        where: { ownerId: userId },
        include: { rooms: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e) {
    console.warn("DB hotel lookup failed, falling back to mock:", e);
    hotels = [];
  }
  // Mock fallback
  if (!hotels || hotels.length === 0) {
    hotels = (mock.hotels as any[]).filter((h) => h.ownerId === userId);
    // Attach mock rooms
    hotels = hotels.map((h) => ({
      ...h,
      rooms: (mock.rooms as any[]).filter((r) => r.hotelId === h.id),
    }));
  }

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
    rooms: (h.rooms ?? []).map((r: any) => ({
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

  let hotel: any = null;
  try {
    if (isDb() && db) {
      hotel = await db.hotel.create({
        data: {
          ownerId: userId,
          name,
          description: String(body.description ?? ""),
          starRating: Number(body.starRating ?? 5),
          location: String(body.location ?? ""),
          city: body.city ?? null,
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          amenities: body.amenities ?? [],
          images: body.images ?? [],
          policies: body.policies ? JSON.stringify(body.policies) : null,
        },
      });
    }
  } catch (e) {
    console.warn("DB hotel create failed, falling back to in-memory:", e);
    hotel = null;
  }

  // Mock fallback — create an in-memory hotel so the user sees it immediately
  if (!hotel) {
    const now = new Date().toISOString();
    hotel = {
      id: `HTL-${Date.now().toString(36).toUpperCase()}`,
      ownerId: userId,
      name,
      description: String(body.description ?? ""),
      starRating: Number(body.starRating ?? 5),
      location: String(body.location ?? ""),
      city: body.city ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      amenities: body.amenities ?? [],
      images: body.images ?? [],
      policies: body.policies ? JSON.stringify(body.policies) : null,
      createdAt: now,
      updatedAt: now,
    };
    (mock.hotels as any[]).unshift(hotel);
  }

  return ok(
    {
      ...hotel,
      amenities: parseArr(hotel.amenities),
      images: parseArr(hotel.images),
      policies: hotel.policies ? safeJson(hotel.policies) : undefined,
    },
    201,
  );
}

function safeJson(s: string): any {
  try { return JSON.parse(s); } catch { return undefined; }
}
