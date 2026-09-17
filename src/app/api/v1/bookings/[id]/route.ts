// /api/v1/bookings/[id] — PATCH (update status)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.booking.findUnique({ where: { id } });
  if (!existing) return err("Booking not found", 404);
  if (existing.userId !== userId) return err("Forbidden", 403);

  const updated = await db.booking.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: String(body.status) }),
      ...(body.startDate !== undefined && { startDate: new Date(body.startDate) }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      ...(body.numGuests !== undefined && { numGuests: Number(body.numGuests) }),
      ...(body.totalAmount !== undefined && { totalAmount: Number(body.totalAmount) }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.booking.findUnique({ where: { id } });
  if (!existing) return err("Booking not found", 404);
  if (existing.userId !== userId) return err("Forbidden", 403);
  await db.booking.delete({ where: { id } });
  return ok({ id });
}
