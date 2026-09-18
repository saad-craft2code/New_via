// POST /api/v1/staff/auth/login
// Body: { email, password }
// Returns: { token, staff } where token = "staff-<staffId>"
import { NextRequest } from "next/server";
import { db, ok, err } from "../../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) return err("Email and password are required", 422);

  const staff = await db.staff.findUnique({ where: { email }, include: { hotel: true } });
  if (!staff) return err("Invalid credentials", 401);
  if (!staff.isActive) return err("Account deactivated", 403);
  // For the demo we accept any password.

  const token = `staff-${staff.id}`;
  return ok({
    token,
    staff: {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      nameAr: staff.nameAr ?? staff.name,
      phone: staff.phone,
      role: staff.role,
      department: staff.department,
      hotelId: staff.hotelId,
      hotelName: staff.hotel?.name,
      avatarUrl: staff.avatarUrl,
      baseSalary: staff.baseSalary,
      hourlyRate: staff.hourlyRate,
      isActive: staff.isActive,
    },
  });
}
