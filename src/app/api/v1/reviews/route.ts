// /api/v1/reviews — GET
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) return err("User not found", 404);
      let targetIds: string[] = [];
      if (user.role === "BundleCreator") {
        const bundles = await db.bundle.findMany({ where: { creatorId: userId }, select: { id: true } });
        targetIds = bundles.map((b: any) => b.id);
      } else {
        const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
        targetIds = hotels.map((h: any) => h.id);
      }
      const reviews = await db.review.findMany({ where: { targetId: { in: targetIds } }, orderBy: { createdAt: "desc" } });
      return ok(reviews);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.reviews);
}
