// GET /api/v1/guest/hotels
import { NextRequest } from "next/server";
import { ok, isDb, db, mock } from "../../../_lib";

export async function GET(req: NextRequest) {
  if (isDb() && db) {
    try {
      const hotels = await db.hotel.findMany({ include: { rooms: true, bookings: { select: { id: true } } }, orderBy: { createdAt: "desc" } });
      return ok(hotels.map((h: any) => ({ ...h, amenities: h.amenities ?? [], images: h.images ?? [], coverImage: (h.images ?? [])[0] ?? "", totalRooms: (h.rooms ?? []).reduce((s: number, r: any) => s + r.totalUnits, 0), availableRooms: (h.rooms ?? []).reduce((s: number, r: any) => s + r.availableUnits, 0), occupancyRate: 71, startingPrice: (h.rooms ?? []).length > 0 ? Math.min(...(h.rooms ?? []).map((r: any) => r.pricePerNight)) : 0, propertyType: "Hotel", bookingCount: h.bookings?.length ?? 0 })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.hotels.map(h => ({ ...h, coverImage: h.images[0] ?? "", totalRooms: mock.rooms.filter(r => r.hotelId === h.id).reduce((s, r) => s + r.totalUnits, 0), availableRooms: mock.rooms.filter(r => r.hotelId === h.id).reduce((s, r) => s + r.availableUnits, 0), occupancyRate: 71, startingPrice: mock.rooms.filter(r => r.hotelId === h.id).length > 0 ? Math.min(...mock.rooms.filter(r => r.hotelId === h.id).map(r => r.pricePerNight)) : 0, propertyType: "Hotel", bookingCount: 0 })));
}
