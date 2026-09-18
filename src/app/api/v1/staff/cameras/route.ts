// /api/v1/staff/cameras — GET POST
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const cameras = await db.camera.findMany({ include: { hotel: true }, orderBy: { createdAt: "desc" } });
      return ok(cameras);
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok(mock.cameras.map(c => ({ ...c, hotel: mock.hotels.find(h => h.id === c.hotelId) })));
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  return ok({ id: "CAM-" + Date.now(), ...body, status: "offline", createdAt: new Date().toISOString() }, 201);
}
