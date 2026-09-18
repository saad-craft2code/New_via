// GET /api/v1/guest/cars
import { NextRequest } from "next/server";
import { ok, isDb, db, mock } from "../../../_lib";

export async function GET(req: NextRequest) {
  if (isDb() && db) {
    try {
      const cars = await db.car.findMany({ where: { available: true }, include: { company: true }, orderBy: { pricePerDay: "asc" } });
      return ok(cars.map((c: any) => ({ ...c, images: c.images ?? [], features: c.features ?? [], company: c.company })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.cars.filter(c => c.available).map(c => ({ ...c, company: mock.carCompanies.find(co => co.id === c.companyId), bookingCount: 0 })));
}
