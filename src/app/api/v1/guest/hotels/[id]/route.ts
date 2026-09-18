// GET /api/v1/guest/hotels/[id] — public hotel detail view
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}
function safeJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = await db.hotel.findUnique({
    where: { id },
    include: {
      rooms: true,
      owner: { select: { name: true, email: true, phone: true } },
      bookings: { select: { id: true, startDate: true, endDate: true, status: true } },
    },
  });
  if (!hotel) return err("Hotel not found", 404);

  const totalRooms = hotel.rooms.reduce((acc, r) => acc + r.totalUnits, 0);
  const availableRooms = hotel.rooms.reduce((acc, r) => acc + r.availableUnits, 0);
  const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
  const minPrice = hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map((r) => r.pricePerNight)) : 0;

  return ok({
    id: hotel.id,
    name: hotel.name,
    description: hotel.description,
    starRating: hotel.starRating,
    location: hotel.location,
    city: hotel.city ?? "",
    latitude: hotel.latitude ?? undefined,
    longitude: hotel.longitude ?? undefined,
    amenities: parseArr(hotel.amenities),
    images: parseArr(hotel.images),
    coverImage: parseArr(hotel.images)[0] ?? "",
    policies: safeJson(hotel.policies, {}),
    rooms: hotel.rooms.map((r) => ({
      id: r.id,
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
    totalRooms,
    availableRooms,
    occupancyRate,
    startingPrice: minPrice,
    owner: hotel.owner,
    bookingCount: hotel.bookings.length,
    createdAt: hotel.createdAt,
  });
}
