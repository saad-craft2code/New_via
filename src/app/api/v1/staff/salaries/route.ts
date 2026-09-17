// /api/v1/staff/salaries — list all salary payments (admin) + create
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const period = url.searchParams.get("period");
  const status = url.searchParams.get("status");

  const where: any = {};
  if (period) where.period = period;
  if (status) where.status = status;

  const salaries = await db.salaryPayment.findMany({
    where,
    include: { staff: { select: { id: true, name: true, nameAr: true, department: true, role: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  return ok(salaries.map((s) => ({
    id: s.id,
    staffId: s.staffId,
    staff: s.staff,
    amount: s.amount,
    period: s.period,
    bonus: s.bonus,
    deductions: s.deductions,
    net: s.amount + s.bonus - s.deductions,
    status: s.status,
    paidAt: s.paidAt,
    notes: s.notes,
    createdAt: s.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const staffId = String(body.staffId ?? "");
  const amount = Number(body.amount ?? 0);
  const period = String(body.period ?? new Date().toISOString().slice(0, 7));
  if (!staffId || !amount) return err("staffId and amount are required", 422);

  const salary = await db.salaryPayment.create({
    data: {
      staffId,
      amount,
      period,
      bonus: Number(body.bonus ?? 0),
      deductions: Number(body.deductions ?? 0),
      status: String(body.status ?? "pending"),
      notes: body.notes ?? null,
      paidAt: body.status === "paid" ? new Date() : null,
    },
  });
  return ok(salary, 201);
}
