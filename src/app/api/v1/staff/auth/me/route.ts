// GET /api/v1/staff/auth/me
import { NextRequest } from "next/server";
import { db, ok, err, getAuthStaffId, isDb, mock } from "../../../../_lib";

export async function GET(req: NextRequest) {
  const staffId = await getAuthStaffId(req);
  if (!staffId) return err("Unauthorized", 401);

  let staff: any = null;
  let hotelName: string | undefined;
  try {
    if (isDb() && db) {
      const result = await db.staff.findUnique({
        where: { id: staffId },
        include: { hotel: true },
      });
      if (result) {
        staff = result;
        hotelName = result.hotel?.name;
      }
    }
  } catch (e) {
    console.warn("DB staff lookup failed in /staff/auth/me, falling back to mock:", e);
    staff = null;
  }

  if (!staff) {
    staff = (mock.staff as any[]).find((s) => s.id === staffId);
    if (staff) {
      const hotel = (mock.hotels as any[]).find((h) => h.id === staff.hotelId);
      hotelName = hotel?.name;
    }
  }

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
    hotelName,
    avatarUrl: staff.avatarUrl,
    baseSalary: staff.baseSalary,
    hourlyRate: staff.hourlyRate,
    isActive: staff.isActive,
  });
}
