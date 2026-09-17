// /api/v1/bookings — GET (list bookings for current user)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

function safeJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  const bookings = await db.booking.findMany({
    where: { userId },
    include: { hotel: true, room: true, bundle: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return ok(bookings.map((b) => ({
    id: b.id,
    userId: b.userId,
    type: b.type,
    hotelId: b.hotelId ?? undefined,
    roomId: b.roomId ?? undefined,
    bundleId: b.bundleId ?? undefined,
    startDate: b.startDate,
    endDate: b.endDate ?? undefined,
    numGuests: b.numGuests,
    totalAmount: b.totalAmount,
    status: b.status,
    metadata: safeJson(b.metadata, {}),
    hotel: b.hotel ? { id: b.hotel.id, name: b.hotel.name, city: b.hotel.city } : undefined,
    room: b.room ? { id: b.room.id, roomType: b.room.roomType } : undefined,
    bundle: b.bundle ? { id: b.bundle.id, title: b.bundle.title } : undefined,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const type = String(body.type ?? "Bundle");
  const booking = await db.booking.create({
    data: {
      userId,
      type,
      hotelId: body.hotelId ?? null,
      roomId: body.roomId ?? null,
      bundleId: body.bundleId ?? null,
      startDate: new Date(body.startDate ?? new Date()),
      endDate: body.endDate ? new Date(body.endDate) : null,
      numGuests: Number(body.numGuests ?? 1),
      totalAmount: Number(body.totalAmount ?? 0),
      status: String(body.status ?? "Pending"),
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
    },
  });
  return ok(booking, 201);
}
