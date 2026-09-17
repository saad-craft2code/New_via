// POST /api/v1/guest/bookings — guest creates a booking (hotel, bundle, or car)
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

  // ── Car booking path ─────────────────────────────────────────
  if (type === "Car" && body.carId) {
    const car = await db.car.findUnique({ where: { id: body.carId }, include: { company: true } });
    if (!car) return err("Car not found", 404);

    const days = body.metadata?.days ?? Math.max(1, Math.ceil((endDate!.getTime() - startDate.getTime()) / 86400000));
    const carBooking = await db.carBooking.create({
      data: {
        carId: car.id,
        companyId: car.companyId,
        guestName,
        guestEmail,
        guestPhone,
        pickupLocation: body.metadata?.pickup ?? null,
        dropoffLocation: body.metadata?.dropoff ?? null,
        startDate,
        endDate,
        days: Number(days),
        totalAmount,
        deposit: car.deposit,
        status: "pending",
        notes: body.specialRequests ?? null,
      },
    });
    return ok({
      id: carBooking.id,
      type: "Car",
      carId: car.id,
      startDate: carBooking.startDate,
      endDate: carBooking.endDate,
      totalAmount: carBooking.totalAmount,
      status: carBooking.status,
    }, 201);
  }

  // ── Hotel / Bundle booking path ───────────────────────────────
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

