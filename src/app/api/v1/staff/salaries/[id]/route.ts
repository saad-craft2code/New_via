// /api/v1/staff/salaries/[id] — update salary status
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../../_lib";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const { id } = await params;
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const updated = await db.salaryPayment.update({
    where: { id },
    data: {
      ...(body.status !== undefined && {
        status: String(body.status),
        paidAt: body.status === "paid" ? new Date() : null,
      }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      ...(body.bonus !== undefined && { bonus: Number(body.bonus) }),
      ...(body.deductions !== undefined && { deductions: Number(body.deductions) }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });
  return ok(updated);
}
