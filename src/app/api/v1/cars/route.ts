// /api/v1/cars — list cars for current provider + create
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
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");
  const category = url.searchParams.get("category");

  // Get all companies owned by this user
  const companies = await db.carCompany.findMany({ where: { ownerId: adminUserId }, select: { id: true } });
  const companyIds = companies.map((c) => c.id);

  const where: any = { companyId: { in: companyIds } };
  if (companyId) where.companyId = companyId;
  if (category) where.category = category;

  const cars = await db.car.findMany({
    where,
    include: {
      company: { select: { id: true, name: true, city: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(cars.map((c) => ({
    id: c.id,
    companyId: c.companyId,
    company: c.company,
    make: c.make,
    model: c.model,
    year: c.year,
    plateNumber: c.plateNumber,
    category: c.category,
    transmission: c.transmission,
    seats: c.seats,
    doors: c.doors,
    bags: c.bags,
    ac: c.ac,
    fuelType: c.fuelType,
    pricePerDay: c.pricePerDay,
    deposit: c.deposit,
    images: parseArr(c.images),
    features: parseArr(c.features),
    available: c.available,
    mileage: c.mileage,
    color: c.color,
    bookingCount: c._count.bookings,
    createdAt: c.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const companyId = String(body.companyId ?? "");
  const make = String(body.make ?? "").trim();
  const model = String(body.model ?? "").trim();
  if (!companyId || !make || !model) return err("companyId, make, and model are required", 422);

  const company = await db.carCompany.findUnique({ where: { id: companyId } });
  if (!company) return err("Company not found", 404);
  if (company.ownerId !== adminUserId) return err("Forbidden", 403);

  const car = await db.car.create({
    data: {
      companyId,
      make,
      model,
      year: Number(body.year ?? new Date().getFullYear()),
      plateNumber: body.plateNumber ?? null,
      category: String(body.category ?? "economy"),
      transmission: String(body.transmission ?? "automatic"),
      seats: Number(body.seats ?? 5),
      doors: Number(body.doors ?? 4),
      bags: Number(body.bags ?? 2),
      ac: body.ac !== false,
      fuelType: String(body.fuelType ?? "petrol"),
      pricePerDay: Number(body.pricePerDay ?? 100),
      deposit: Number(body.deposit ?? 500),
      images: body.images ?? [],
      features: body.features ?? [],
      available: body.available !== false,
      mileage: body.mileage ?? null,
      color: body.color ?? null,
    },
  });
  return ok({ ...car, images: parseArr(car.images), features: parseArr(car.features) }, 201);
}
