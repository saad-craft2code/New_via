// /api/v1/staff/tasks
// GET: list tasks (admin sees all, staff sees own)
// POST: assign a task (admin only)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, getAuthStaffId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const department = url.searchParams.get("department");
  const staffId = url.searchParams.get("staffId");

  // Admin token (demo-user-*) vs staff token (staff-*)
  const adminUserId = await getAuthUserId(req);
  const staffIdFromToken = await getAuthStaffId(req);

  let where: any = {};
  if (staffIdFromToken && !adminUserId?.startsWith("user-")) {
    // Staff — only their own tasks
    where.staffId = staffIdFromToken;
  } else {
    // Admin — see all tasks, with optional filters
    if (status) where.status = status;
    if (department) where.staff = { department };
    if (staffId) where.staffId = staffId;
  }

  const tasks = await db.staffTask.findMany({
    where,
    include: {
      staff: { select: { id: true, name: true, nameAr: true, department: true, role: true, avatarUrl: true } },
      hotel: { select: { id: true, name: true, city: true } },
    },
    orderBy: { assignedAt: "desc" },
  });

  return ok(tasks.map((t) => ({
    id: t.id,
    staffId: t.staffId,
    staff: t.staff,
    assignedBy: t.assignedBy,
    hotelId: t.hotelId,
    hotel: t.hotel,
    type: t.type,
    title: t.title,
    description: t.description,
    location: t.location,
    priority: t.priority,
    status: t.status,
    assignedAt: t.assignedAt,
    startedAt: t.startedAt,
    completedAt: t.completedAt,
    dueAt: t.dueAt,
    notes: t.notes,
    photoUrl: t.photoUrl,
    cameraId: t.cameraId,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);

  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const staffId = String(body.staffId ?? "");
  const title = String(body.title ?? "").trim();
  if (!staffId || !title) return err("staffId and title are required", 422);

  const staff = await db.staff.findUnique({ where: { id: staffId } });
  if (!staff) return err("Staff not found", 404);

  const task = await db.staffTask.create({
    data: {
      staffId,
      assignedBy: adminUserId,
      hotelId: body.hotelId ?? staff.hotelId ?? null,
      type: String(body.type ?? "cleaning"),
      title,
      description: body.description ?? null,
      location: body.location ?? null,
      priority: String(body.priority ?? "normal"),
      status: "pending",
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
    },
    include: { staff: { select: { id: true, name: true, nameAr: true, department: true } } },
  });
  return ok(task, 201);
}
