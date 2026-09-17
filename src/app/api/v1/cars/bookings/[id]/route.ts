// /api/v1/cars/bookings/[id] — update booking status
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const booking = await db.carBooking.findUnique({ where: { id }, include: { company: true } });
  if (!booking) return err("Booking not found", 404);
  if (booking.company.ownerId !== adminUserId) return err("Forbidden", 403);

  const updated = await db.carBooking.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: String(body.status) }),
      ...(body.startDate !== undefined && { startDate: new Date(body.startDate) }),
      ...(body.endDate !== undefined && { endDate: new Date(body.endDate) }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  const booking = await db.carBooking.findUnique({ where: { id }, include: { company: true } });
  if (!booking) return err("Booking not found", 404);
  if (booking.company.ownerId !== adminUserId) return err("Forbidden", 403);
  await db.carBooking.delete({ where: { id } });
  return ok({ id });
}
