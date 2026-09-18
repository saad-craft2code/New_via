// /api/v1/maintenance — GET (list) POST (create)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
  const hotelIds = hotels.map((h) => h.id);

  const where: any = { hotelId: { in: hotelIds } };
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const requests = await db.maintenanceRequest.findMany({
    where,
    include: {
      hotel: { select: { id: true, name: true } },
      room: { select: { id: true, roomType: true } },
      staff: { select: { id: true, name: true, nameAr: true, department: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(requests.map((r) => ({
    id: r.id,
    hotelId: r.hotelId,
    hotel: r.hotel,
    roomId: r.roomId,
    room: r.room,
    reportedBy: r.reportedBy,
    assignedTo: r.assignedTo,
    staff: r.staff,
    title: r.title,
    description: r.description,
    location: r.location,
    priority: r.priority,
    status: r.status,
    category: r.category,
    photoUrl: r.photoUrl,
    reportedAt: r.reportedAt,
    startedAt: r.startedAt,
    resolvedAt: r.resolvedAt,
    notes: r.notes,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const hotelId = String(body.hotelId ?? "");
  const title = String(body.title ?? "").trim();
  if (!hotelId || !title) return err("hotelId and title are required", 422);

  const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) return err("Hotel not found", 404);
  if (hotel.ownerId !== userId) return err("Forbidden", 403);

  const request = await db.maintenanceRequest.create({
    data: {
      hotelId,
      roomId: body.roomId ?? null,
      reportedBy: userId,
      assignedTo: body.assignedTo ?? null,
      title,
      description: body.description ?? null,
      location: body.location ?? null,
      priority: String(body.priority ?? "normal"),
      status: "open",
      category: String(body.category ?? "other"),
      photoUrl: body.photoUrl ?? null,
    },
    include: { hotel: true, room: true, staff: true },
  });
  return ok(request, 201);
}
