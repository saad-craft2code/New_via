// POST /api/v1/guest/bookings — public endpoint for Tripful to submit bookings
// No authentication required — guest bookings are stored with userId="guest"
// or attached to the hotel/bundle owner for visibility in their Panel.

import { NextRequest } from "next/server";
import { db, ok, err, isDb, mock } from "../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const type = String(body.type || (body.hotelId ? "HotelRoom" : "Bundle"));
  const userId = "guest"; // public bookings are stored under the "guest" user

  // Try to find the hotel/bundle owner so the booking appears in their Panel
  let ownerId = "guest";
  try {
    if (isDb() && db) {
      if (body.hotelId) {
        const hotel = await db.hotel.findUnique({ where: { id: body.hotelId }, select: { ownerId: true } });
        if (hotel) ownerId = hotel.ownerId;
      } else if (body.bundleId) {
        const bundle = await db.bundle.findUnique({ where: { id: body.bundleId }, select: { creatorId: true } });
        if (bundle) ownerId = bundle.creatorId;
      }
    } else {
      // Mock fallback — find owner from in-memory hotels/bundles
      if (body.hotelId) {
        const hotel = (mock.hotels as any[]).find((h) => h.id === body.hotelId);
        if (hotel) ownerId = hotel.ownerId;
      } else if (body.bundleId) {
        const bundle = (mock.bundles as any[]).find((b) => b.id === body.bundleId);
        if (bundle) ownerId = bundle.creatorId;
      }
    }
  } catch (e) {
    console.warn("Owner lookup failed, defaulting to 'guest':", e);
  }

  let booking: any = null;
  try {
    if (isDb() && db) {
      booking = await db.booking.create({
        data: {
          userId: ownerId,
          type,
          hotelId: body.hotelId ?? null,
          roomId: body.roomId ?? null,
          bundleId: body.bundleId ?? null,
          startDate: new Date(body.checkIn || body.startDate || new Date()),
          endDate: body.checkOut || body.endDate ? new Date(body.checkOut || body.endDate) : null,
          numGuests: Number(body.guests || body.numGuests || 1),
          totalAmount: Number(body.amount || body.totalAmount || 0),
          status: String(body.status || "Confirmed"),
          metadata: JSON.stringify({
            guestName: body.guestName || "Guest User",
            guestEmail: body.guestEmail || "",
            guestPhone: body.guestPhone || "",
            specialRequests: body.specialRequests || "",
            source: "tripful",
            nights: body.nights || 1,
            currency: body.currency || "$",
          }),
        },
      });
    }
  } catch (e) {
    console.warn("DB booking create failed, storing in memory:", e);
    booking = null;
  }

  // Mock fallback
  if (!booking) {
    const now = new Date().toISOString();
    booking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      userId: ownerId,
      type,
      hotelId: body.hotelId ?? null,
      roomId: body.roomId ?? null,
      bundleId: body.bundleId ?? null,
      startDate: body.checkIn || body.startDate || now,
      endDate: body.checkOut || body.endDate || null,
      numGuests: Number(body.guests || body.numGuests || 1),
      totalAmount: Number(body.amount || body.totalAmount || 0),
      status: String(body.status || "Confirmed"),
      metadata: {
        guestName: body.guestName || "Guest User",
        guestEmail: body.guestEmail || "",
        guestPhone: body.guestPhone || "",
        specialRequests: body.specialRequests || "",
        source: "tripful",
        nights: body.nights || 1,
        currency: body.currency || "$",
      },
      createdAt: now,
      updatedAt: now,
    };
    (mock.bookings as any[]).unshift(booking);
  }

  return ok(booking, 201);
}
