// /api/v1/rooms/[id] — PATCH / DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

async function ensureOwned(roomId: string, userId: string) {
  const room = await db.room.findUnique({ where: { id: roomId }, include: { hotel: true } });
  if (!room) return { error: err("Room not found", 404) };
  if (room.hotel.ownerId !== userId) return { error: err("Forbidden", 403) };
  return { room };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const { room, error } = await ensureOwned(id, userId);
  if (error) return error;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const updated = await db.room.update({
    where: { id },
    data: {
      ...(body.roomType !== undefined && { roomType: String(body.roomType) }),
      ...(body.bedType !== undefined && { bedType: String(body.bedType) }),
      ...(body.maxGuests !== undefined && { maxGuests: Number(body.maxGuests) }),
      ...(body.pricePerNight !== undefined && { pricePerNight: Number(body.pricePerNight) }),
      ...(body.size !== undefined && { size: body.size }),
      ...(body.amenities !== undefined && { amenities: JSON.stringify(body.amenities) }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.totalUnits !== undefined && { totalUnits: Number(body.totalUnits) }),
      ...(body.availableUnits !== undefined && { availableUnits: Number(body.availableUnits) }),
    },
  });
  return ok({ ...updated, amenities: parseArr(updated.amenities), images: parseArr(updated.images) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const { error } = await ensureOwned(id, userId);
  if (error) return error;
  await db.room.delete({ where: { id } });
  return ok({ id });
}
