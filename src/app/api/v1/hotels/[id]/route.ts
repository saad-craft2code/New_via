// /api/v1/hotels/[id] — GET / PATCH / DELETE
import { NextRequest, NextResponse } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = await db.hotel.findUnique({
    where: { id },
    include: { rooms: true, owner: true },
  });
  if (!hotel) return err("Hotel not found", 404);
  return ok({
    id: hotel.id,
    ownerId: hotel.ownerId,
    name: hotel.name,
    description: hotel.description,
    starRating: hotel.starRating,
    location: hotel.location,
    city: hotel.city,
    latitude: hotel.latitude ?? undefined,
    longitude: hotel.longitude ?? undefined,
    amenities: parseArr(hotel.amenities),
    images: parseArr(hotel.images),
    policies: hotel.policies ? safeJson(hotel.policies) : undefined,
    rooms: hotel.rooms.map((r) => ({
      id: r.id,
      hotelId: r.hotelId,
      roomType: r.roomType,
      bedType: r.bedType,
      maxGuests: r.maxGuests,
      pricePerNight: r.pricePerNight,
      size: r.size ?? undefined,
      amenities: parseArr(r.amenities),
      images: parseArr(r.images),
      totalUnits: r.totalUnits,
      availableUnits: r.availableUnits,
    })),
    owner: hotel.owner ? { id: hotel.owner.id, name: hotel.owner.name, email: hotel.owner.email } : undefined,
    createdAt: hotel.createdAt,
    updatedAt: hotel.updatedAt,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const existing = await db.hotel.findUnique({ where: { id } });
  if (!existing) return err("Hotel not found", 404);
  if (existing.ownerId !== userId) return err("Forbidden", 403);

  const updated = await db.hotel.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.description !== undefined && { description: String(body.description) }),
      ...(body.starRating !== undefined && { starRating: Number(body.starRating) }),
      ...(body.location !== undefined && { location: String(body.location) }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.latitude !== undefined && { latitude: body.latitude }),
      ...(body.longitude !== undefined && { longitude: body.longitude }),
      ...(body.amenities !== undefined && { amenities: JSON.stringify(body.amenities) }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.policies !== undefined && { policies: JSON.stringify(body.policies) }),
    },
  });
  return ok({ ...updated, amenities: parseArr(updated.amenities), images: parseArr(updated.images), policies: updated.policies ? safeJson(updated.policies) : undefined });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const { id } = await params;
  const existing = await db.hotel.findUnique({ where: { id } });
  if (!existing) return err("Hotel not found", 404);
  if (existing.ownerId !== userId) return err("Forbidden", 403);
  await db.hotel.delete({ where: { id } });
  return ok({ id });
}

function safeJson(s: string): any {
  try { return JSON.parse(s); } catch { return undefined; }
}
