// GET /api/v1/guest/cars — public car listing for guests
import { NextRequest } from "next/server";
import { db, ok } from "../../../_lib";

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try { return JSON.parse(s) as string[]; } catch { return []; }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search")?.toLowerCase();
  const maxPrice = url.searchParams.get("maxPrice");
  const sortBy = url.searchParams.get("sortBy") ?? "pricePerDay";

  const where: any = { available: true };
  if (city) where.company = { city };
  if (category) where.category = category;
  if (maxPrice) where.pricePerDay = { lte: Number(maxPrice) };
  if (search) {
    where.OR = [
      { make: { contains: search } },
      { model: { contains: search } },
      { company: { name: { contains: search } } },
      { company: { city: { contains: search } } },
    ];
  }

  let orderBy: any = { pricePerDay: "asc" };
  if (sortBy === "newest") orderBy = { year: "desc" };
  if (sortBy === "year_desc") orderBy = { year: "desc" };
  if (sortBy === "price_high") orderBy = { pricePerDay: "desc" };

  const cars = await db.car.findMany({
    where,
    include: {
      company: { select: { id: true, name: true, city: true, rating: true, phone: true } },
      _count: { select: { bookings: true } },
    },
    orderBy,
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
  })));
}
