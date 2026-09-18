// GET /api/v1/guest/bundles — public bundle listing for guests
// Query: ?destination=&difficulty=&search=&maxPrice=&sortBy=
import { NextRequest } from "next/server";
import { db, ok } from "../../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const destination = url.searchParams.get("destination")?.toLowerCase();
  const difficulty = url.searchParams.get("difficulty");
  const search = url.searchParams.get("search")?.toLowerCase();
  const maxPrice = url.searchParams.get("maxPrice");
  const sortBy = url.searchParams.get("sortBy") ?? "createdAt";

  const bundles = await db.bundle.findMany({
    where: { status: "Published" },
    include: {
      days: { include: { items: true }, orderBy: { dayNumber: "asc" } },
      creator: { select: { id: true, name: true, companyName: true, avatarUrl: true } },
      bookings: { select: { id: true, totalAmount: true } },
    },
    orderBy: sortBy === "price" ? { price: "asc" } : sortBy === "durationDays" ? { durationDays: "asc" } : { createdAt: "desc" },
  });

  const filtered = bundles.filter((b) => {
    const destinations = parseArr(b.destinations);
    if (destination && !destinations.some((d) => d.toLowerCase().includes(destination))) return false;
    if (difficulty && b.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
    if (search && !(`${b.title} ${b.description} ${destinations.join(" ")}`.toLowerCase().includes(search))) return false;
    if (maxPrice && b.price > Number(maxPrice)) return false;
    return true;
  });

  return ok(filtered.map((b) => {
    const totalBookings = b.bookings.length;
    const revenue = b.bookings.reduce((acc, bk) => acc + bk.totalAmount, 0);
    const coverImage = parseArr(b.images)[0] ?? "";
    return {
      id: b.id,
      title: b.title,
      titleAr: b.title, // English title is also stored; AR mirror can be added later
      titleEn: b.title,
      description: b.description,
      descriptionAr: b.description,
      descriptionEn: b.description,
      durationDays: b.durationDays,
      days: b.durationDays,
      nights: Math.max(0, b.durationDays - 1),
      destinations: parseArr(b.destinations),
      images: parseArr(b.images),
      coverImage,
      type: "Travel Bundle",
      startingPrice: b.price,
      price: b.price,
      difficulty: b.difficulty,
      groupSizeMin: b.groupSize ? Math.max(1, Math.floor(b.groupSize / 4)) : 1,
      groupSizeMax: b.groupSize ?? 12,
      guideName: b.guideName ?? "Local Expert Guide",
      includedServices: parseArr(b.includedServices),
      status: b.status,
      creator: b.creator,
      totalBookings,
      revenue,
      rating: 4 + Math.min(0.9, totalBookings / 100), // simulated rating
      views: totalBookings * 47 + 1200,
      wishlist: totalBookings * 3 + 35,
      conversionRate: totalBookings > 0 ? (totalBookings / (totalBookings * 47 + 1200) * 100) : 0,
      createdAt: b.createdAt,
    };
  }));
}
