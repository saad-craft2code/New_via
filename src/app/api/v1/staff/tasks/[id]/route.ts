// /api/v1/staff/tasks/[id] — PATCH (update status / start / complete)
// Both admin and the assigned staff can update.
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, getAuthStaffId } from "../../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminUserId = await getAuthUserId(req);
  const staffIdFromToken = await getAuthStaffId(req);
  if (!adminUserId && !staffIdFromToken) return err("Unauthorized", 401);

  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.staffTask.findUnique({ where: { id } });
  if (!existing) return err("Task not found", 404);

  // If staff (not admin), verify they own the task
  if (staffIdFromToken && !adminUserId?.startsWith("user-") && existing.staffId !== staffIdFromToken) {
    return err("Forbidden — not your task", 403);
  }

  const newStatus = body.status;
  const now = new Date();
  const data: any = {};
  if (newStatus === "in_progress" && existing.status === "pending") {
    data.status = "in_progress";
    data.startedAt = now;
  } else if (newStatus === "completed" && existing.status !== "completed") {
    data.status = "completed";
    data.completedAt = now;
  } else if (newStatus === "cancelled") {
    data.status = "cancelled";
  } else if (newStatus === "pending") {
    data.status = "pending";
    data.startedAt = null;
    data.completedAt = null;
  }
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl;

  const updated = await db.staffTask.update({
    where: { id },
    data,
    include: { staff: { select: { id: true, name: true, nameAr: true, department: true } } },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized — admin only", 401);
  const { id } = await params;
  const existing = await db.staffTask.findUnique({ where: { id } });
  if (!existing) return err("Task not found", 404);
  await db.staffTask.delete({ where: { id } });
  return ok({ id });
}
