// /api/v1/notifications/[id] — PATCH (mark read/unread) DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) return err("Notification not found", 404);
  if (existing.userId !== userId) return err("Forbidden", 403);

  const updated = await db.notification.update({
    where: { id },
    data: {
      ...(body.read !== undefined && { read: Boolean(body.read) }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) return err("Notification not found", 404);
  if (existing.userId !== userId) return err("Forbidden", 403);
  await db.notification.delete({ where: { id } });
  return ok({ id });
}
