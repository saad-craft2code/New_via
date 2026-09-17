// /api/v1/cars/companies — list & create car companies (provider admin)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);

  const companies = await db.carCompany.findMany({
    where: { ownerId: adminUserId },
    include: { _count: { select: { cars: true, bookings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return ok(companies.map((c) => ({
    id: c.id,
    ownerId: c.ownerId,
    name: c.name,
    description: c.description,
    logo: c.logo,
    phone: c.phone,
    email: c.email,
    city: c.city,
    rating: c.rating,
    isActive: c.isActive,
    carCount: c._count.cars,
    bookingCount: c._count.bookings,
    createdAt: c.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const name = String(body.name ?? "").trim();
  if (!name) return err("Company name is required", 422);

  const company = await db.carCompany.create({
    data: {
      ownerId: adminUserId,
      name,
      description: body.description ?? null,
      logo: body.logo ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      city: body.city ?? null,
      rating: Number(body.rating ?? 4.5),
      isActive: body.isActive !== false,
    },
  });
  return ok(company, 201);
}
