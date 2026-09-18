// /api/v1/inventory — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const items = await db.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });
      return ok(items.map((i: any) => ({ ...i, lowStock: i.quantity <= i.minStock, stockValue: i.quantity * i.unitCost })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.inventory.map(i => ({ ...i, lowStock: i.quantity <= i.minStock, stockValue: i.quantity * i.unitCost })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "INV-" + Date.now(), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
