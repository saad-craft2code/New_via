// /api/v1/bundles — GET (current user's bundles) POST (create)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

function parseArr(s: any): string[] {
  if (!s) return [];
    if (Array.isArray(s)) return s;
  if (typeof s === "string") { try { return JSON.parse(s) as string[]; } catch { return []; } }
    if (Array.isArray(s)) return s;
    return [];
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  const bundles = await db.bundle.findMany({
    where: { creatorId: userId },
    include: { days: { include: { items: true }, orderBy: { dayNumber: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return ok(bundles.map((b) => ({
    id: b.id,
    creatorId: b.creatorId,
    title: b.title,
    description: b.description,
    durationDays: b.durationDays,
    destinations: parseArr(b.destinations),
    images: parseArr(b.images),
    guideName: b.guideName ?? undefined,
    price: b.price,
    difficulty: b.difficulty,
    groupSize: b.groupSize ?? undefined,
    includedServices: parseArr(b.includedServices),
    status: b.status,
    days: b.days.map((d) => ({
      id: d.id,
      bundleId: d.bundleId,
      dayNumber: d.dayNumber,
      title: d.title,
      description: d.description ?? undefined,
      items: d.items.map((it) => ({
        id: it.id,
        bundleDayId: it.bundleDayId,
        type: it.type,
        title: it.title,
        description: it.description ?? undefined,
        startTime: it.startTime ?? undefined,
        endTime: it.endTime ?? undefined,
        location: it.location ?? undefined,
        cost: it.cost ?? undefined,
        includedServices: parseArr(it.includedServices),
      })),
    })),
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const title = String(body.title ?? "").trim();
  if (!title) return err("Bundle title is required", 422);

  const bundle = await db.bundle.create({
    data: {
      creatorId: userId,
      title,
      description: String(body.description ?? ""),
      durationDays: Number(body.durationDays ?? 1),
      destinations: body.destinations ?? [],
      images: body.images ?? [],
      guideName: body.guideName ?? null,
      price: Number(body.price ?? 0),
      difficulty: String(body.difficulty ?? "easy"),
      groupSize: body.groupSize ?? null,
      includedServices: body.includedServices ?? [],
      status: String(body.status ?? "Draft"),
    },
  });
  return ok({ ...bundle, destinations: parseArr(bundle.destinations), images: parseArr(bundle.images), includedServices: parseArr(bundle.includedServices) }, 201);
}
