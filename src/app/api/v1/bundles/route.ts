// /api/v1/bundles — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const bundles = await db.bundle.findMany({ where: { creatorId: userId }, include: { days: { include: { items: true } } }, orderBy: { createdAt: "desc" } });
      return ok(bundles.map((b: any) => ({ ...b, destinations: b.destinations ?? [], images: b.images ?? [], includedServices: b.includedServices ?? [], days: b.days ?? [] })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.bundles.filter(b => b.creatorId === userId).map(b => ({ ...b, days: [] })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "BND-" + Date.now(), creatorId: userId, title: body.title ?? "", description: body.description ?? "", durationDays: body.durationDays ?? 1, destinations: body.destinations ?? [], images: body.images ?? [], price: body.price ?? 0, status: "Draft", includedServices: body.includedServices ?? [], days: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
