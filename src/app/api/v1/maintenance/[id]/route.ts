// /api/v1/maintenance/[id] — PATCH (update status / assign) DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.maintenanceRequest.findUnique({ where: { id }, include: { hotel: true } });
  if (!existing) return err("Request not found", 404);
  if (existing.hotel.ownerId !== userId) return err("Forbidden", 403);

  const data: any = {};
  if (body.status !== undefined) {
    data.status = String(body.status);
    if (body.status === "in_progress" && !existing.startedAt) data.startedAt = new Date();
    if (body.status === "resolved" && !existing.resolvedAt) data.resolvedAt = new Date();
  }
  if (body.assignedTo !== undefined) data.assignedTo = body.assignedTo;
  if (body.priority !== undefined) data.priority = String(body.priority);
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl;

  const updated = await db.maintenanceRequest.update({ where: { id }, data, include: { hotel: true, room: true, staff: true } });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.maintenanceRequest.findUnique({ where: { id }, include: { hotel: true } });
  if (!existing) return err("Request not found", 404);
  if (existing.hotel.ownerId !== userId) return err("Forbidden", 403);
  await db.maintenanceRequest.delete({ where: { id } });
  return ok({ id });
}
