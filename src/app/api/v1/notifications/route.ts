// /api/v1/notifications — GET (list current user's notifications) POST (create)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return ok(notifications.map((n) => ({
    id: n.id,
    userId: n.userId,
    type: n.type,
    titleEn: n.titleEn,
    titleAr: n.titleAr,
    bodyEn: n.bodyEn,
    bodyAr: n.bodyAr,
    read: n.read,
    link: n.link ?? undefined,
    createdAt: n.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const n = await db.notification.create({
    data: {
      userId,
      type: String(body.type ?? "system"),
      titleEn: String(body.titleEn ?? ""),
      titleAr: String(body.titleAr ?? body.titleEn ?? ""),
      bodyEn: String(body.bodyEn ?? ""),
      bodyAr: String(body.bodyAr ?? body.bodyEn ?? ""),
      read: false,
      link: body.link ?? null,
    },
  });
  return ok(n, 201);
}
