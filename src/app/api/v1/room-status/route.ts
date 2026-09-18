// /api/v1/room-status — GET (list all rooms with latest status + occupancy)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const hotelId = url.searchParams.get("hotelId");

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true, name: true } });
  const hotelIds = hotels.map((h) => h.id);

  const where: any = { hotelId: { in: hotelIds } };
  if (hotelId) where.hotelId = hotelId;

  const rooms = await db.room.findMany({
    where,
    include: {
      hotel: { select: { id: true, name: true, city: true } },
      statusLogs: { orderBy: { createdAt: "desc" }, take: 1 },
      checkIns: { where: { status: "checked_in" }, take: 1 },
    },
    orderBy: { roomType: "asc" },
  });

  // Compute status per room
  return ok(rooms.map((r) => {
    const latestLog = r.statusLogs[0];
    const activeCheckIn = r.checkIns[0];
    let status: string;
    if (activeCheckIn) {
      status = "occupied";
    } else if (latestLog) {
      status = latestLog.status;
    } else if (r.availableUnits === 0) {
      status = "out_of_order";
    } else {
      status = "available";
    }
    return {
      id: r.id,
      hotelId: r.hotelId,
      hotel: r.hotel,
      roomType: r.roomType,
      bedType: r.bedType,
      maxGuests: r.maxGuests,
      pricePerNight: r.pricePerNight,
      size: r.size ?? undefined,
      amenities: JSON.parse(r.amenities || "[]"),
      images: JSON.parse(r.images || "[]"),
      totalUnits: r.totalUnits,
      availableUnits: r.availableUnits,
      status,
      lastStatusNote: latestLog?.notes ?? null,
      lastStatusChange: latestLog?.createdAt ?? null,
      activeCheckIn: activeCheckIn ? {
        id: activeCheckIn.id,
        guestName: activeCheckIn.guestName,
        checkInAt: activeCheckIn.checkInAt,
        expectedCheckOut: activeCheckIn.expectedCheckOut,
      } : null,
    };
  }));
}

// POST — update room status (log a new status)
export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const roomId = String(body.roomId ?? "");
  const status = String(body.status ?? "");
  if (!roomId || !status) return err("roomId and status are required", 422);

  const room = await db.room.findUnique({ where: { id: roomId }, include: { hotel: true } });
  if (!room) return err("Room not found", 404);
  if (room.hotel.ownerId !== userId) return err("Forbidden", 403);

  const log = await db.roomStatusLog.create({
    data: {
      roomId,
      status,
      notes: body.notes ?? null,
      changedBy: userId,
    },
  });
  return ok(log, 201);
}
