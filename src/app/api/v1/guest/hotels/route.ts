// GET /api/v1/guest/hotels — public hotel listing for guests
// Query: ?city=&search=&starRating=&sortBy=
import { NextRequest } from "next/server";
import { db, ok } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const search = url.searchParams.get("search")?.toLowerCase();
  const starRating = url.searchParams.get("starRating");
  const sortBy = url.searchParams.get("sortBy") ?? "createdAt";

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

  const hotels = await db.hotel.findMany({
    where,
    include: {
      rooms: true,
      owner: { select: { name: true } },
      bookings: { select: { id: true } },
    },
    orderBy,
  });

  return ok(hotels.map((h) => {
    const totalRooms = h.rooms.reduce((acc, r) => acc + r.totalUnits, 0);
    const availableRooms = h.rooms.reduce((acc, r) => acc + r.availableUnits, 0);
    const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
    const minPrice = h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.pricePerNight)) : 0;
    return {
      id: h.id,
      name: h.name,
      description: h.description,
      starRating: h.starRating,
      location: h.location,
      city: h.city ?? "",
      country: "",
      amenities: parseArr(h.amenities),
      images: parseArr(h.images),
      coverImage: parseArr(h.images)[0] ?? "",
      totalRooms,
      availableRooms,
      occupancyRate,
      startingPrice: minPrice,
      propertyType: h.rooms.length > 0 ? "Hotel" : "Hotel",
      ownerName: h.owner.name,
      bookingCount: h.bookings.length,
      createdAt: h.createdAt,
    };
  }));
}
