// POST /api/v1/staff/auth/login
// Body: { email, password }
// Returns: { token, staff } where token = "staff-<staffId>"
import { NextRequest } from "next/server";
import { db, ok, err, isDb, mock } from "../../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) return err("Email and password are required", 422);

  let staff: any = null;
  let hotelName: string | undefined;
  try {
    if (isDb() && db) {
      const result = await db.staff.findUnique({ where: { email }, include: { hotel: true } });
      if (result) {
        staff = result;
        hotelName = result.hotel?.name;
      }
    }
  } catch (e) {
    console.warn("DB staff lookup failed, falling back to mock:", e);
    staff = null;
  }

  // Mock fallback
  if (!staff) {
    staff = (mock.staff as any[]).find((s) => s.email.toLowerCase() === email);
    if (staff) {
      const hotel = (mock.hotels as any[]).find((h) => h.id === staff.hotelId);
      hotelName = hotel?.name;
    }
  }

  if (!staff) return err("Invalid credentials", 401);
  if (staff.isActive === false) return err("Account deactivated", 403);
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
      hotelName,
      avatarUrl: staff.avatarUrl,
      baseSalary: staff.baseSalary,
      hourlyRate: staff.hourlyRate,
      isActive: staff.isActive,
    },
  });
}
