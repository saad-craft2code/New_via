// /api/v1/reviews — GET (list reviews for current user's content)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  // Reviews left on this user's bundles or hotels
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return err("User not found", 404);

  let targetIds: string[] = [];
  if (user.role === "BundleCreator") {
    const bundles = await db.bundle.findMany({ where: { creatorId: userId }, select: { id: true } });
    targetIds = bundles.map((b) => b.id);
  } else if (user.role === "HotelOwner") {
    const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
    targetIds = hotels.map((h) => h.id);
  }

  const reviews = await db.review.findMany({
    where: { targetId: { in: targetIds } },
    orderBy: { createdAt: "desc" },
  });

  return ok(reviews.map((r) => ({
    id: r.id,
    targetId: r.targetId,
    targetType: r.targetType,
    rating: r.rating,
    commentEn: r.commentEn ?? "",
    commentAr: r.commentAr ?? "",
    author: r.author,
    createdAt: r.createdAt,
  })));
}
