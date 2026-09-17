import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Via Trips API",
    version: "1.0.0",
    status: "ok",
    endpoints: [
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/auth/me",
      "/api/v1/hotels",
      "/api/v1/rooms",
      "/api/v1/bundles",
      "/api/v1/bookings",
      "/api/v1/notifications",
      "/api/v1/reviews",
      "/api/v1/users/me",
      "/api/v1/kyc/upload",
      "/api/v1/guest/hotels",
      "/api/v1/guest/bundles",
      "/api/v1/guest/bookings",
      "/api/v1/guest/analytics",
      "/api/v1/analytics/overview",
    ],
  });
}
