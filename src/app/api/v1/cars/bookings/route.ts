// /api/v1/cars/bookings — list car bookings for current provider + create
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);

  const companies = await db.carCompany.findMany({ where: { ownerId: adminUserId }, select: { id: true } });
  const companyIds = companies.map((c) => c.id);

  const bookings = await db.carBooking.findMany({
    where: { companyId: { in: companyIds } },
    include: {
      car: { select: { id: true, make: true, model: true, year: true, plateNumber: true, category: true, pricePerDay: true } },
      company: { select: { id: true, name: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(bookings.map((b) => ({
    id: b.id,
    carId: b.carId,
    car: b.car,
    companyId: b.companyId,
    company: b.company,
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    guestPhone: b.guestPhone,
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
    startDate: b.startDate,
    endDate: b.endDate,
    days: b.days,
    totalAmount: b.totalAmount,
    deposit: b.deposit,
    status: b.status,
    notes: b.notes,
    createdAt: b.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const carId = String(body.carId ?? "");
  if (!carId) return err("carId is required", 422);

  const car = await db.car.findUnique({ where: { id: carId }, include: { company: true } });
  if (!car) return err("Car not found", 404);
  if (car.company.ownerId !== adminUserId) return err("Forbidden", 403);

  const startDate = body.startDate ? new Date(body.startDate) : new Date();
  const endDate = body.endDate ? new Date(body.endDate) : new Date(Date.now() + 86400000);
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000));

  const booking = await db.carBooking.create({
    data: {
      carId,
      companyId: car.companyId,
      guestName: String(body.guestName ?? "Guest"),
      guestEmail: String(body.guestEmail ?? "guest@example.com"),
      guestPhone: String(body.guestPhone ?? ""),
      pickupLocation: body.pickupLocation ?? null,
      dropoffLocation: body.dropoffLocation ?? null,
      startDate,
      endDate,
      days,
      totalAmount: car.pricePerDay * days,
      deposit: car.deposit,
      status: String(body.status ?? "pending"),
      notes: body.notes ?? null,
    },
  });
  return ok(booking, 201);
}
