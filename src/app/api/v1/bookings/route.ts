// /api/v1/bookings — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const bookings = await db.booking.findMany({ where: { userId }, include: { hotel: true, room: true, bundle: true }, orderBy: { createdAt: "desc" } });
      return ok(bookings.map((b: any) => ({ ...b, metadata: typeof b.metadata === "string" ? JSON.parse(b.metadata || "{}") : b.metadata ?? {}, hotel: b.hotel, room: b.room, bundle: b.bundle })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.bookings.filter(b => b.userId === userId));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "BK-" + Date.now(), userId, type: body.type ?? "Bundle", hotelId: body.hotelId, roomId: body.roomId, bundleId: body.bundleId, startDate: body.startDate, endDate: body.endDate, numGuests: body.numGuests ?? 1, totalAmount: body.totalAmount ?? 0, status: "Pending", metadata: body.metadata ?? {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
