// POST /api/v1/guest/bookings — guest creates a booking (hotel or bundle)
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const type = String(body.type ?? "Bundle");
  const startDate = body.startDate ? new Date(body.startDate) : new Date();
  const endDate = body.endDate ? new Date(body.endDate) : null;
  const numGuests = Number(body.numGuests ?? 1);
  const totalAmount = Number(body.totalAmount ?? 0);
  const guestName = String(body.guestName ?? "Guest");
  const guestEmail = String(body.guestEmail ?? "guest@example.com");
  const guestPhone = String(body.guestPhone ?? "");

  // Find (or create) a "guest" user to attach the booking to
  let guest = await db.user.findUnique({ where: { email: guestEmail } });
  if (!guest) {
    guest = await db.user.create({
      data: {
        email: guestEmail,
        name: guestName,
        role: "BundleCreator",
        phone: guestPhone || null,
        kycStatus: "NotSubmitted",
      },
    });
  }

  const booking = await db.booking.create({
    data: {
      userId: guest.id,
      type: type === "HotelRoom" ? "HotelRoom" : "Bundle",
      hotelId: body.hotelId ?? null,
      roomId: body.roomId ?? null,
      bundleId: body.bundleId ?? null,
      startDate,
      endDate,
      numGuests,
      totalAmount,
      status: "Pending",
      metadata: JSON.stringify({
        guestName,
        guestEmail,
        guestPhone,
        specialRequests: body.specialRequests ?? "",
        createdAt: new Date().toISOString(),
      }),
    },
    include: { hotel: true, bundle: true, room: true },
  });

  return ok({
    id: booking.id,
    type: booking.type,
    hotelId: booking.hotelId ?? undefined,
    roomId: booking.roomId ?? undefined,
    bundleId: booking.bundleId ?? undefined,
    startDate: booking.startDate,
    endDate: booking.endDate ?? undefined,
    numGuests: booking.numGuests,
    totalAmount: booking.totalAmount,
    status: booking.status,
    hotelName: booking.hotel?.name,
    bundleTitle: booking.bundle?.title,
    roomType: booking.room?.roomType,
  }, 201);
}
