// /api/v1/staff/cameras/[id] — update camera status
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const updated = await db.camera.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.location !== undefined && { location: String(body.location) }),
      ...(body.streamUrl !== undefined && { streamUrl: body.streamUrl }),
      ...(body.status !== undefined && { status: String(body.status) }),
      ...(body.hotelId !== undefined && { hotelId: body.hotelId }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  await db.camera.delete({ where: { id } });
  return ok({ id });
}
