// /api/v1/staff/tasks — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId, getAuthStaffId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  const staffIdFromToken = await getAuthStaffId(req);
  if (!adminUserId && !staffIdFromToken) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const where = staffIdFromToken && !adminUserId ? { staffId: staffIdFromToken } : {};
      const tasks = await db.staffTask.findMany({ where, include: { staff: true, hotel: true }, orderBy: { assignedAt: "desc" } });
      return ok(tasks);
    } catch (e) { console.log("DB error, using mock"); }
  }
  if (staffIdFromToken) return ok(mock.staffTasks.filter(t => t.staffId === staffIdFromToken));
  return ok(mock.staffTasks);
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "TASK-" + Date.now(), assignedBy: adminUserId, status: "pending", assignedAt: new Date().toISOString(), ...body }, 201);
}
