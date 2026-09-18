// /api/v1/maintenance — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const requests = await db.maintenanceRequest.findMany({ include: { hotel: true, room: true, staff: true }, orderBy: { createdAt: "desc" } });
      return ok(requests);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.maintenance.map(m => ({ ...m, hotel: mock.hotels.find(h => h.id === m.hotelId), staff: mock.staff.find(s => s.id === m.assignedTo) })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "MNT-" + Date.now(), reportedBy: userId, status: "open", reportedAt: new Date().toISOString(), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, 201);
}
