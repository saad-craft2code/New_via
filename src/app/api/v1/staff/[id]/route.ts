// /api/v1/staff/[id] — admin: update & delete staff
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const updated = await db.staff.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.role !== undefined && { role: String(body.role) }),
      ...(body.department !== undefined && { department: String(body.department) }),
      ...(body.hotelId !== undefined && { hotelId: body.hotelId }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      ...(body.baseSalary !== undefined && { baseSalary: Number(body.baseSalary) }),
      ...(body.hourlyRate !== undefined && { hourlyRate: Number(body.hourlyRate) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  await db.staff.delete({ where: { id } });
  return ok({ id });
}
