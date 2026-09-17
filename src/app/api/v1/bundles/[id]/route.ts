// /api/v1/bundles/[id] — GET / PATCH / DELETE
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = await db.bundle.findUnique({
    where: { id },
    include: {
      days: { include: { items: true }, orderBy: { dayNumber: "asc" } },
      creator: true,
    },
  });
  if (!bundle) return err("Bundle not found", 404);
  return ok({
    id: bundle.id,
    creatorId: bundle.creatorId,
    title: bundle.title,
    description: bundle.description,
    durationDays: bundle.durationDays,
    destinations: parseArr(bundle.destinations),
    images: parseArr(bundle.images),
    guideName: bundle.guideName ?? undefined,
    price: bundle.price,
    difficulty: bundle.difficulty,
    groupSize: bundle.groupSize ?? undefined,
    includedServices: parseArr(bundle.includedServices),
    status: bundle.status,
    days: bundle.days.map((d) => ({
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
    creator: bundle.creator ? { id: bundle.creator.id, name: bundle.creator.name, email: bundle.creator.email } : undefined,
    createdAt: bundle.createdAt,
    updatedAt: bundle.updatedAt,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.bundle.findUnique({ where: { id } });
  if (!existing) return err("Bundle not found", 404);
  if (existing.creatorId !== userId) return err("Forbidden", 403);

  const updated = await db.bundle.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: String(body.title) }),
      ...(body.description !== undefined && { description: String(body.description) }),
      ...(body.durationDays !== undefined && { durationDays: Number(body.durationDays) }),
      ...(body.destinations !== undefined && { destinations: JSON.stringify(body.destinations) }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.guideName !== undefined && { guideName: body.guideName }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.difficulty !== undefined && { difficulty: String(body.difficulty) }),
      ...(body.groupSize !== undefined && { groupSize: body.groupSize }),
      ...(body.includedServices !== undefined && { includedServices: JSON.stringify(body.includedServices) }),
      ...(body.status !== undefined && { status: String(body.status) }),
    },
  });
  return ok({ ...updated, destinations: parseArr(updated.destinations), images: parseArr(updated.images), includedServices: parseArr(updated.includedServices) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.bundle.findUnique({ where: { id } });
  if (!existing) return err("Bundle not found", 404);
  if (existing.creatorId !== userId) return err("Forbidden", 403);
  await db.bundle.delete({ where: { id } });
  return ok({ id });
}
