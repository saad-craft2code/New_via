// /api/v1/checkins/[id] — PATCH (check-out) DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.checkIn.findUnique({ where: { id }, include: { hotel: true } });
  if (!existing) return err("Check-in not found", 404);
  if (existing.hotel.ownerId !== userId) return err("Forbidden", 403);

  const data: any = {};
  if (body.status !== undefined) {
    data.status = String(body.status);
    if (body.status === "checked_out") data.actualCheckOut = new Date();
  }
  if (body.roomNumber !== undefined) data.roomNumber = body.roomNumber;
  if (body.keyCardCount !== undefined) data.keyCardCount = Number(body.keyCardCount);
  if (body.depositCollected !== undefined) data.depositCollected = Number(body.depositCollected);
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.expectedCheckOut !== undefined) data.expectedCheckOut = new Date(body.expectedCheckOut);

  const updated = await db.checkIn.update({ where: { id }, data, include: { hotel: true, room: true, guest: true } });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.checkIn.findUnique({ where: { id }, include: { hotel: true } });
  if (!existing) return err("Check-in not found", 404);
  if (existing.hotel.ownerId !== userId) return err("Forbidden", 403);
  await db.checkIn.delete({ where: { id } });
  return ok({ id });
}
