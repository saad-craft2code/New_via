// /api/v1/cars/[id] — update & delete car
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const car = await db.car.findUnique({ where: { id }, include: { company: true } });
  if (!car) return err("Car not found", 404);
  if (car.company.ownerId !== adminUserId) return err("Forbidden", 403);

  const updated = await db.car.update({
    where: { id },
    data: {
      ...(body.make !== undefined && { make: String(body.make) }),
      ...(body.model !== undefined && { model: String(body.model) }),
      ...(body.year !== undefined && { year: Number(body.year) }),
      ...(body.plateNumber !== undefined && { plateNumber: body.plateNumber }),
      ...(body.category !== undefined && { category: String(body.category) }),
      ...(body.transmission !== undefined && { transmission: String(body.transmission) }),
      ...(body.seats !== undefined && { seats: Number(body.seats) }),
      ...(body.doors !== undefined && { doors: Number(body.doors) }),
      ...(body.bags !== undefined && { bags: Number(body.bags) }),
      ...(body.ac !== undefined && { ac: Boolean(body.ac) }),
      ...(body.fuelType !== undefined && { fuelType: String(body.fuelType) }),
      ...(body.pricePerDay !== undefined && { pricePerDay: Number(body.pricePerDay) }),
      ...(body.deposit !== undefined && { deposit: Number(body.deposit) }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.features !== undefined && { features: JSON.stringify(body.features) }),
      ...(body.available !== undefined && { available: Boolean(body.available) }),
      ...(body.mileage !== undefined && { mileage: body.mileage }),
      ...(body.color !== undefined && { color: body.color }),
    },
  });
  return ok({ ...updated, images: parseArr(updated.images), features: parseArr(updated.features) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  const car = await db.car.findUnique({ where: { id }, include: { company: true } });
  if (!car) return err("Car not found", 404);
  if (car.company.ownerId !== adminUserId) return err("Forbidden", 403);
  await db.car.delete({ where: { id } });
  return ok({ id });
}
