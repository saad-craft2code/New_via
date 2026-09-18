// GET /api/v1/staff/auth/me
import { NextRequest } from "next/server";
import { db, ok, err, getAuthStaffId } from "../../../../_lib";

export async function GET(req: NextRequest) {
  const staffId = await getAuthStaffId(req);
  if (!staffId) return err("Unauthorized", 401);
  const staff = await db.staff.findUnique({
    where: { id: staffId },
    include: { hotel: true },
  });
  if (!staff) return err("Staff not found", 404);
  return ok({
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
  });
}
