// GET /api/v1/guest/bundles/[id] — public bundle detail
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = await db.bundle.findUnique({
    where: { id },
    include: {
      days: { include: { items: true }, orderBy: { dayNumber: "asc" } },
      creator: { select: { id: true, name: true, companyName: true, avatarUrl: true, yearsExperience: true } },
      bookings: { select: { id: true, totalAmount: true, createdAt: true } },
    },
  });
  if (!bundle) return err("Bundle not found", 404);

  const totalBookings = bundle.bookings.length;
  const revenue = bundle.bookings.reduce((acc, bk) => acc + bk.totalAmount, 0);
  const coverImage = parseArr(bundle.images)[0] ?? "";

  return ok({
    id: bundle.id,
    title: bundle.title,
    titleEn: bundle.title,
    titleAr: bundle.title,
    description: bundle.description,
    descriptionEn: bundle.description,
    descriptionAr: bundle.description,
    durationDays: bundle.durationDays,
    days: bundle.durationDays,
    nights: Math.max(0, bundle.durationDays - 1),
    destinations: parseArr(bundle.destinations),
    images: parseArr(bundle.images),
    coverImage,
    type: "Travel Bundle",
    startingPrice: bundle.price,
    price: bundle.price,
    difficulty: bundle.difficulty,
    groupSizeMin: bundle.groupSize ? Math.max(1, Math.floor(bundle.groupSize / 4)) : 1,
    groupSizeMax: bundle.groupSize ?? 12,
    guideName: bundle.guideName ?? "Local Expert Guide",
    includedServices: parseArr(bundle.includedServices),
    status: bundle.status,
    creator: bundle.creator,
    itinerary: bundle.days.map((d) => ({
      dayNumber: d.dayNumber,
      title: d.title,
      description: d.description ?? "",
      items: d.items.map((it) => ({
        id: it.id,
        type: it.type,
        title: it.title,
        description: it.description ?? "",
        startTime: it.startTime ?? "",
        endTime: it.endTime ?? "",
        location: it.location ?? "",
        cost: it.cost ?? 0,
        includedServices: parseArr(it.includedServices),
      })),
    })),
    totalBookings,
    revenue,
    rating: 4 + Math.min(0.9, totalBookings / 100),
    views: totalBookings * 47 + 1200,
    wishlist: totalBookings * 3 + 35,
    conversionRate: totalBookings > 0 ? (totalBookings / (totalBookings * 47 + 1200) * 100) : 0,
    createdAt: bundle.createdAt,
  });
}
