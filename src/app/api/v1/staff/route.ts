// /api/v1/staff — admin: list & create staff
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const url = new URL(req.url);
  const department = url.searchParams.get("department");
  const where: any = {};
  if (department) where.department = department;

  const staff = await db.staff.findMany({
    where,
    include: {
      hotel: { select: { id: true, name: true, city: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compute task stats per staff
  const withStats = await Promise.all(
    staff.map(async (s) => {
      const tasks = await db.staffTask.groupBy({
        by: ["status"],
        where: { staffId: s.id },
        _count: { status: true },
      });
      const stats: Record<string, number> = {};
      tasks.forEach((t) => (stats[t.status] = t._count.status));
      return {
        id: s.id,
        email: s.email,
        name: s.name,
        nameAr: s.nameAr,
        phone: s.phone,
        role: s.role,
        department: s.department,
        hotelId: s.hotelId,
        hotel: s.hotel,
        avatarUrl: s.avatarUrl,
        baseSalary: s.baseSalary,
        hourlyRate: s.hourlyRate,
        isActive: s.isActive,
        hiredAt: s.hiredAt,
        taskStats: stats,
      };
    }),
  );

  return ok(withStats);
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const email = String(body.email ?? "").toLowerCase().trim();
  const name = String(body.name ?? "").trim();
  if (!email || !name) return err("Email and name are required", 422);

  const existing = await db.staff.findUnique({ where: { email } });
  if (existing) return err("Email already in use", 409);

  const staff = await db.staff.create({
    data: {
      email,
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name,
      nameAr: body.nameAr ?? null,
      phone: body.phone ?? null,
      role: String(body.role ?? "staff"),
      department: String(body.department ?? "housekeeping"),
      hotelId: body.hotelId ?? null,
      avatarUrl: body.avatarUrl ?? null,
      baseSalary: Number(body.baseSalary ?? 3000),
      hourlyRate: Number(body.hourlyRate ?? 25),
      isActive: body.isActive !== false,
    },
  });
  return ok(staff, 201);
}
