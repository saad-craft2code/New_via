// GET /api/v1/guest/hotels — public hotel listing for guests
// Query: ?city=&search=&starRating=&sortBy=
import { NextRequest } from "next/server";
import { db, ok, isDb, mock } from "../../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
  return [];
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const search = url.searchParams.get("search")?.toLowerCase();
  const starRating = url.searchParams.get("starRating");
  const sortBy = url.searchParams.get("sortBy") ?? "createdAt";

  let hotels: any[] = [];
  try {
    if (isDb() && db) {
      const where: any = {};
      if (city) where.city = { equals: city };
      if (starRating) where.starRating = { gte: Number(starRating) };
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { location: { contains: search } },
          { city: { contains: search } },
        ];
      }
      let orderBy: any = { createdAt: "desc" };
      if (sortBy === "starRating") orderBy = { starRating: "desc" };
      if (sortBy === "name") orderBy = { name: "asc" };
      hotels = await db.hotel.findMany({
        where,
        include: {
          rooms: true,
          owner: { select: { name: true } },
          bookings: { select: { id: true } },
        },
        orderBy,
      });
    }
  } catch (e) {
    console.warn("DB guest hotel lookup failed, falling back to mock:", e);
    hotels = [];
  }

  // Mock fallback — show all mock hotels with their mock rooms
  if (!hotels || hotels.length === 0) {
    hotels = (mock.hotels as any[]).map((h) => ({
      ...h,
      rooms: (mock.rooms as any[]).filter((r) => r.hotelId === h.id),
      owner: { name: "Property Owner" },
      bookings: [],
    }));
  }

  // Apply filters to mock data too
  let filtered = hotels;
  if (city) filtered = filtered.filter((h) => h.city === city);
  if (starRating) filtered = filtered.filter((h) => h.starRating >= Number(starRating));
  if (search) {
    filtered = filtered.filter((h) => {
      const name = (h.name || "").toLowerCase();
      const desc = (h.description || "").toLowerCase();
      const loc = (h.location || "").toLowerCase();
      const c = (h.city || "").toLowerCase();
      return name.includes(search) || desc.includes(search) || loc.includes(search) || c.includes(search);
    });
  }

  return ok(filtered.map((h) => {
    const rooms = h.rooms ?? [];
    const totalRooms = rooms.reduce((acc: number, r: any) => acc + (r.totalUnits || 0), 0);
    const availableRooms = rooms.reduce((acc: number, r: any) => acc + (r.availableUnits || 0), 0);
    const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
    const minPrice = rooms.length > 0 ? Math.min(...rooms.map((r: any) => r.pricePerNight)) : 0;
    const amenitiesArr = parseArr(h.amenities);
    const imagesArr = parseArr(h.images);
    return {
      id: h.id,
      name: h.name,
      description: h.description,
      starRating: h.starRating,
      location: h.location,
      city: h.city ?? "",
      country: h.country ?? "",
      amenities: amenitiesArr,
      amenitiesAr: amenitiesAr(h.id, amenitiesArr),
      images: imagesArr,
      coverImage: imagesArr[0] ?? "",
      totalRooms,
      availableRooms,
      occupancyRate,
      startingPrice: minPrice,
      propertyType: h.propertyType ?? "Hotel",
      ownerName: h.owner?.name ?? "Property Owner",
      bookingCount: h.bookings?.length ?? 0,
      rating: h.rating ?? 4.5,
      reviewCount: h.reviewCount ?? 0,
      createdAt: h.createdAt,
    };
  }));
}

// Arabic translations for common amenities (lookup by English label)
function amenitiesAr(_hotelId: string, en: string[]): string[] {
  const map: Record<string, string> = {
    wifi: "واي فاي", WiFi: "واي فاي", Pool: "مسبح", Gym: "صالة رياضية",
    Spa: "سبا", Parking: "موقف سيارات", Restaurant: "مطعم", Bar: "بار",
    "Business Center": "مركز أعمال", Concierge: "كونسيرج",
    "Room Service": "خدمة الغرف", "Airport Shuttle": "نقل للمطار",
    "Family Friendly": "مناسب للعائلات", "Pet Friendly": "مسموح بالحيوانات",
    "Beach Access": "وصول للشاطئ",
  };
  return en.map((a) => map[a] || a);
}
