// /api/v1/staff/cameras — list cameras (admin)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  const cameras = await db.camera.findMany({
    include: { hotel: { select: { id: true, name: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(cameras.map((c) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    hotelId: c.hotelId,
    hotel: c.hotel,
    streamUrl: c.streamUrl,
    status: c.status,
    createdAt: c.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const adminUserId = await getAuthUserId(req);
  if (!adminUserId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const name = String(body.name ?? "").trim();
  if (!name) return err("Camera name is required", 422);

  const camera = await db.camera.create({
    data: {
      name,
      location: String(body.location ?? ""),
      hotelId: body.hotelId ?? null,
      streamUrl: body.streamUrl ?? null,
      status: String(body.status ?? "offline"),
    },
  });
  return ok(camera, 201);
}
