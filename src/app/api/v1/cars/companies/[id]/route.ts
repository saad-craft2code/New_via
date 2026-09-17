// /api/v1/cars/companies/[id] — update & delete
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.carCompany.findUnique({ where: { id } });
  if (!existing) return err("Company not found", 404);
  if (existing.ownerId !== adminUserId) return err("Forbidden", 403);

  const updated = await db.carCompany.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.logo !== undefined && { logo: body.logo }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.rating !== undefined && { rating: Number(body.rating) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.carCompany.findUnique({ where: { id } });
  if (!existing) return err("Company not found", 404);
  if (existing.ownerId !== adminUserId) return err("Forbidden", 403);
  await db.carCompany.delete({ where: { id } });
  return ok({ id });
}
