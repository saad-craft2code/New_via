// /api/v1/notifications — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const notifications = await db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      return ok(notifications);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.notifications.filter(n => n.userId === userId));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "N-" + Date.now(), userId, type: body.type ?? "system", titleEn: body.titleEn ?? "", titleAr: body.titleAr ?? "", bodyEn: body.bodyEn ?? "", bodyAr: body.bodyAr ?? "", read: false, createdAt: new Date().toISOString() }, 201);
}
