// /api/v1/inventory — GET (list items) POST (create item)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const lowStock = url.searchParams.get("lowStock");

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
  const hotelIds = hotels.map((h) => h.id);

  const where: any = { hotelId: { in: hotelIds } };
  if (category) where.category = category;
  if (lowStock === "true") where.quantity = { lte: db.inventoryItem.fields.minStock };

  const items = await db.inventoryItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return ok(items.map((i) => ({
    id: i.id,
    hotelId: i.hotelId,
    name: i.name,
    nameAr: i.nameAr,
    category: i.category,
    unit: i.unit,
    quantity: i.quantity,
    minStock: i.minStock,
    maxStock: i.maxStock,
    unitCost: i.unitCost,
    supplier: i.supplier,
    location: i.location,
    barcode: i.barcode,
    lastRestockedAt: i.lastRestockedAt,
    lastRestockQty: i.lastRestockQty,
    lowStock: i.quantity <= i.minStock,
    stockValue: i.quantity * i.unitCost,
    createdAt: i.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const hotelId = String(body.hotelId ?? "");
  const name = String(body.name ?? "").trim();
  if (!hotelId || !name) return err("hotelId and name are required", 422);

  const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) return err("Hotel not found", 404);
  if (hotel.ownerId !== userId) return err("Forbidden", 403);

  const item = await db.inventoryItem.create({
    data: {
      hotelId,
      name,
      nameAr: body.nameAr ?? null,
      category: String(body.category ?? "other"),
      unit: String(body.unit ?? "piece"),
      quantity: Number(body.quantity ?? 0),
      minStock: Number(body.minStock ?? 10),
      maxStock: Number(body.maxStock ?? 100),
      unitCost: Number(body.unitCost ?? 0),
      supplier: body.supplier ?? null,
      location: body.location ?? null,
      barcode: body.barcode ?? null,
    },
  });
  return ok(item, 201);
}
