// POST /api/v1/staff/auth/login — staff login (accepts any password for demo)
import { NextRequest } from "next/server";
import { ok, err, mock } from "../../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) return err("Email and password are required", 422);

  // Find staff in mock data — accept ANY password
  const staff = mock.staff.find((s) => s.email === email);
  if (!staff) return err("Invalid credentials", 401);
  if (!staff.isActive) return err("Account deactivated", 403);

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
      hotelName: mock.hotels.find((h) => h.id === staff.hotelId)?.name,
      avatarUrl: staff.avatarUrl,
      baseSalary: staff.baseSalary,
      hourlyRate: staff.hourlyRate,
      isActive: staff.isActive,
    },
  });
}
