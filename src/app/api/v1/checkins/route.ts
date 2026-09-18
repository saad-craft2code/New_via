// /api/v1/checkins — GET (list check-ins) POST (create check-in)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const today = url.searchParams.get("today");

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
  const hotelIds = hotels.map((h) => h.id);

  const where: any = { hotelId: { in: hotelIds } };
  if (status) where.status = status;
  if (today === "true") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    where.checkInAt = { gte: startOfDay, lte: endOfDay };
  }

  const checkIns = await db.checkIn.findMany({
    where,
    include: {
      hotel: { select: { id: true, name: true } },
      room: { select: { id: true, roomType: true } },
      guest: { select: { id: true, name: true, vipStatus: true } },
    },
    orderBy: { checkInAt: "desc" },
  });

  return ok(checkIns.map((c) => ({
    id: c.id,
    hotelId: c.hotelId,
    hotel: c.hotel,
    guestId: c.guestId,
    guest: c.guest,
    bookingId: c.bookingId,
    roomId: c.roomId,
    room: c.room,
    guestName: c.guestName,
    guestEmail: c.guestEmail,
    guestPhone: c.guestPhone,
    numGuests: c.numGuests,
    checkInAt: c.checkInAt,
    expectedCheckOut: c.expectedCheckOut,
    actualCheckOut: c.actualCheckOut,
    status: c.status,
    roomNumber: c.roomNumber,
    keyCardCount: c.keyCardCount,
    depositCollected: c.depositCollected,
    specialRequests: c.specialRequests,
    notes: c.notes,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const hotelId = String(body.hotelId ?? "");
  const guestName = String(body.guestName ?? "").trim();
  if (!hotelId || !guestName) return err("hotelId and guestName are required", 422);

  const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) return err("Hotel not found", 404);
  if (hotel.ownerId !== userId) return err("Forbidden", 403);

  const checkIn = await db.checkIn.create({
    data: {
      hotelId,
      guestId: body.guestId ?? null,
      bookingId: body.bookingId ?? null,
      roomId: body.roomId ?? null,
      guestName,
      guestEmail: body.guestEmail ?? null,
      guestPhone: body.guestPhone ?? null,
      numGuests: Number(body.numGuests ?? 1),
      expectedCheckOut: body.expectedCheckOut ? new Date(body.expectedCheckOut) : new Date(Date.now() + 86400000),
      status: "checked_in",
      roomNumber: body.roomNumber ?? null,
      keyCardCount: Number(body.keyCardCount ?? 1),
      depositCollected: Number(body.depositCollected ?? 0),
      specialRequests: body.specialRequests ?? null,
      notes: body.notes ?? null,
    },
    include: { hotel: true, room: true, guest: true },
  });
  return ok(checkIn, 201);
}
