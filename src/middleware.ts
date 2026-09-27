import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CORS middleware — allows Tripful (and any other domain) to call our API.
// Without this, the browser blocks cross-origin requests from
// tripful.vercel.app to via-trips-panel.vercel.app.

export function middleware(req: NextRequest) {
  // Handle CORS preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // For all other requests, add CORS headers to the response
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// Run middleware on all API routes
export const config = {
  matcher: "/api/:path*",
};
