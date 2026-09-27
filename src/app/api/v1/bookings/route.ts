// /api/v1/bookings — GET (list bookings for current user)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, isDb, mock } from "../../_lib";

function safeJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  let bookings: any[] = [];
  try {
    if (isDb() && db) {
      bookings = await db.booking.findMany({
        where: { userId },
        include: { hotel: true, room: true, bundle: true, user: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e) {
    console.warn("DB booking lookup failed, falling back to mock:", e);
    bookings = [];
  }

  // Mock fallback — show in-memory bookings (e.g. those created by Tripful)
  if (!bookings || bookings.length === 0) {
    bookings = (mock.bookings as any[]).filter((b) => b.userId === userId);
  }

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
    metadata: typeof b.metadata === "string" ? safeJson(b.metadata, {}) : (b.metadata || {}),
    hotel: b.hotel ? { id: b.hotel.id, name: b.hotel.name, city: b.hotel.city } : undefined,
    room: b.room ? { id: b.room.id, roomType: b.room.roomType } : undefined,
    bundle: b.bundle ? { id: b.bundle.id, title: b.bundle.title } : undefined,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const type = String(body.type ?? "Bundle");
  // Allow guest bookings (from Tripful) — userId is optional, can be null
  // For authenticated Panel users, attach their userId
  let userId: string | null = null;
  try {
    userId = await getAuthUserId(req);
  } catch {
    userId = null;
  }
  // If no authenticated user, allow guest booking with userId "guest" or from body
  if (!userId) userId = body.userId || "guest";

  let booking: any = null;
  try {
    if (isDb() && db) {
      booking = await db.booking.create({
        data: {
          userId,
          type,
          hotelId: body.hotelId ?? null,
          roomId: body.roomId ?? null,
          bundleId: body.bundleId ?? null,
          startDate: new Date(body.startDate || body.checkIn || new Date()),
          endDate: body.endDate || body.checkOut ? new Date(body.endDate || body.checkOut) : null,
          numGuests: Number(body.numGuests || body.guests || 1),
          totalAmount: Number(body.totalAmount || body.amount || 0),
          status: String(body.status || "Confirmed"),
          metadata: body.metadata ? JSON.stringify(body.metadata) : JSON.stringify({
            guestName: body.guestName || "Guest",
            guestEmail: body.guestEmail || "",
            guestPhone: body.guestPhone || "",
            specialRequests: body.specialRequests || "",
            source: "tripful",
          }),
        },
      });
    }
  } catch (e) {
    console.warn("DB booking create failed, falling back to in-memory:", e);
    booking = null;
  }

  // Mock fallback — store in memory so Panel can see it
  if (!booking) {
    const now = new Date().toISOString();
    booking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      userId,
      type,
      hotelId: body.hotelId ?? null,
      roomId: body.roomId ?? null,
      bundleId: body.bundleId ?? null,
      startDate: body.startDate || body.checkIn || now,
      endDate: body.endDate || body.checkOut || null,
      numGuests: Number(body.numGuests || body.guests || 1),
      totalAmount: Number(body.totalAmount || body.amount || 0),
      status: String(body.status || "Confirmed"),
      metadata: body.metadata || {
        guestName: body.guestName || "Guest",
        guestEmail: body.guestEmail || "",
        guestPhone: body.guestPhone || "",
        specialRequests: body.specialRequests || "",
        source: "tripful",
      },
      createdAt: now,
      updatedAt: now,
    };
    (mock.bookings as any[]).unshift(booking);
  }

  return ok(booking, 201);
}
