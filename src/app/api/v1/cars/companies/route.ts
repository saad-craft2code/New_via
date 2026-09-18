// /api/v1/cars/companies — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const companies = await db.carCompany.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
      return ok(companies);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.carCompanies.filter(c => c.ownerId === userId).map(c => ({ ...c, carCount: mock.cars.filter(car => car.companyId === c.id).length, bookingCount: mock.carBookings.filter(cb => cb.companyId === c.id).length })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "CARCO-" + Date.now(), ownerId: userId, ...body, rating: body.rating ?? 4.5, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
