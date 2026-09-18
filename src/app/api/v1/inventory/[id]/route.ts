// /api/v1/inventory/[id] — PATCH (update / restock) DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const item = await db.inventoryItem.findUnique({ where: { id }, include: { hotel: true } });
  if (!item) return err("Item not found", 404);
  if (item.hotel.ownerId !== userId) return err("Forbidden", 403);

  // If restocking, also create a transaction record
  if (body.restockQty !== undefined && Number(body.restockQty) > 0) {
    const qty = Number(body.restockQty);
    const newQty = item.quantity + qty;
    const updated = await db.inventoryItem.update({
      where: { id },
      data: {
        quantity: newQty,
        lastRestockedAt: new Date(),
        lastRestockQty: qty,
      },
    });
    await db.inventoryTransaction.create({
      data: {
        itemId: id,
        type: "in",
        quantity: qty,
        reason: body.reason ?? "Restock",
        staffId: body.staffId ?? null,
      },
    });
    return ok(updated);
  }

  // If consuming (out), create transaction
  if (body.consumeQty !== undefined && Number(body.consumeQty) > 0) {
    const qty = Number(body.consumeQty);
    const newQty = Math.max(0, item.quantity - qty);
    const updated = await db.inventoryItem.update({
      where: { id },
      data: { quantity: newQty },
    });
    await db.inventoryTransaction.create({
      data: {
        itemId: id,
        type: "out",
        quantity: qty,
        reason: body.reason ?? "Consumed",
        staffId: body.staffId ?? null,
      },
    });
    return ok(updated);
  }

  // Regular field updates
  const data: any = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.nameAr !== undefined) data.nameAr = body.nameAr;
  if (body.category !== undefined) data.category = String(body.category);
  if (body.unit !== undefined) data.unit = String(body.unit);
  if (body.quantity !== undefined) data.quantity = Number(body.quantity);
  if (body.minStock !== undefined) data.minStock = Number(body.minStock);
  if (body.maxStock !== undefined) data.maxStock = Number(body.maxStock);
  if (body.unitCost !== undefined) data.unitCost = Number(body.unitCost);
  if (body.supplier !== undefined) data.supplier = body.supplier;
  if (body.location !== undefined) data.location = body.location;
  if (body.barcode !== undefined) data.barcode = body.barcode;

  const updated = await db.inventoryItem.update({ where: { id }, data });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const item = await db.inventoryItem.findUnique({ where: { id }, include: { hotel: true } });
  if (!item) return err("Item not found", 404);
  if (item.hotel.ownerId !== userId) return err("Forbidden", 403);
  await db.inventoryItem.delete({ where: { id } });
  return ok({ id });
}
