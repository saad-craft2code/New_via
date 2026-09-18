// /api/v1/guests — GET (list guest profiles) POST (create)
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
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase();
  const vipStatus = url.searchParams.get("vipStatus");

  const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true } });
  const hotelIds = hotels.map((h) => h.id);

  const where: any = { hotelId: { in: hotelIds } };
  if (vipStatus) where.vipStatus = vipStatus;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const guests = await db.guestProfile.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return ok(guests.map((g) => ({
    id: g.id,
    hotelId: g.hotelId,
    name: g.name,
    nameAr: g.nameAr,
    email: g.email,
    phone: g.phone,
    nationality: g.nationality,
    idType: g.idType,
    idNumber: g.idNumber,
    dob: g.dob,
    gender: g.gender,
    address: g.address,
    city: g.city,
    country: g.country,
    preferences: parseArr(g.preferences),
    dietaryNeeds: g.dietaryNeeds,
    vipStatus: g.vipStatus,
    totalStays: g.totalStays,
    totalSpent: g.totalSpent,
    lastStayAt: g.lastStayAt,
    blacklisted: g.blacklisted,
    notes: g.notes,
    createdAt: g.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const name = String(body.name ?? "").trim();
  if (!name) return err("Name is required", 422);

  const guest = await db.guestProfile.create({
    data: {
      hotelId: body.hotelId ?? null,
      name,
      nameAr: body.nameAr ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      nationality: body.nationality ?? null,
      idType: body.idType ?? null,
      idNumber: body.idNumber ?? null,
      dob: body.dob ? new Date(body.dob) : null,
      gender: body.gender ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      country: body.country ?? null,
      preferences: body.preferences ?? [],
      dietaryNeeds: body.dietaryNeeds ?? null,
      vipStatus: String(body.vipStatus ?? "regular"),
      notes: body.notes ?? null,
    },
  });
  return ok({ ...guest, preferences: parseArr(guest.preferences) }, 201);
}
