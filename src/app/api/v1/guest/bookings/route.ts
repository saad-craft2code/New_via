// POST /api/v1/guest/bookings — guest creates a booking
import { NextRequest } from "next/server";
import { ok, err } from "../../../_lib";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  // For demo mode, just return success without saving to DB
  return ok({
    id: "BK-" + Date.now(),
    type: body.type ?? "Bundle",
    hotelId: body.hotelId,
    bundleId: body.bundleId,
    carId: body.carId,
    startDate: body.startDate,
    endDate: body.endDate,
    numGuests: body.numGuests ?? 1,
    totalAmount: body.totalAmount ?? 0,
    status: "Pending",
  }, 201);
}
