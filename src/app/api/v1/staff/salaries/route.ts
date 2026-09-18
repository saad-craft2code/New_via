// /api/v1/staff/salaries — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const salaries = await db.salaryPayment.findMany({ include: { staff: true }, orderBy: { createdAt: "desc" } });
      return ok(salaries.map((s: any) => ({ ...s, net: s.amount + s.bonus - s.deductions, staff: s.staff })));
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.salaries.map(s => ({ ...s, staff: mock.staff.find(st => st.id === s.staffId) })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "SAL-" + Date.now(), ...body, net: (body.amount ?? 0) + (body.bonus ?? 0) - (body.deductions ?? 0), createdAt: new Date().toISOString() }, 201);
}
