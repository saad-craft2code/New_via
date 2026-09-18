// /api/v1/cars — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const companies = await db.carCompany.findMany({ where: { ownerId: userId }, select: { id: true } });
      const cars = await db.car.findMany({ where: { companyId: { in: companies.map((c: any) => c.id) } }, include: { company: true } });
      return ok(cars.map((c: any) => ({ ...c, images: c.images ?? [], features: c.features ?? [] })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.cars.map(c => ({ ...c, company: mock.carCompanies.find(co => co.id === c.companyId), bookingCount: 0 })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "CAR-" + Date.now(), ...body, images: body.images ?? [], features: body.features ?? [], available: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
