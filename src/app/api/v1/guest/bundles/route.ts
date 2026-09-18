// GET /api/v1/guest/bundles
import { NextRequest } from "next/server";
import { ok, isDb, db, mock } from "../../../_lib";

export async function GET(req: NextRequest) {
  if (isDb() && db) {
    try {
      const bundles = await db.bundle.findMany({ where: { status: "Published" }, include: { creator: true, bookings: { select: { id: true, totalAmount: true } } }, orderBy: { createdAt: "desc" } });
      return ok(bundles.map((b: any) => ({ ...b, destinations: b.destinations ?? [], images: b.images ?? [], includedServices: b.includedServices ?? [], coverImage: (b.images ?? [])[0] ?? "", totalBookings: b.bookings?.length ?? 0, revenue: (b.bookings ?? []).reduce((s: number, bk: any) => s + bk.totalAmount, 0), rating: 4.7, days: b.durationDays, nights: Math.max(0, b.durationDays - 1), startingPrice: b.price, type: "Travel Bundle", creator: b.creator })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.bundles.filter(b => b.status === "Published").map(b => ({ ...b, coverImage: b.images[0] ?? "", totalBookings: 0, revenue: 0, rating: 4.7, days: b.durationDays, nights: Math.max(0, b.durationDays - 1), startingPrice: b.price, type: "Travel Bundle", creator: { id: "user-bc-demo", name: "Ahmed Al-Naimi", companyName: "Via Trips" } })));
}
