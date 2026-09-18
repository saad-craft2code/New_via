// Shared helpers for /api/v1/* route handlers
import { NextResponse } from "next/server";
import { db as prismaDb } from "@/lib/db";
import { isDbEnabled, mockUsers, mockHotels, mockRooms, mockBundles, mockBookings, mockNotifications, mockReviews, mockStaff, mockStaffTasks, mockSalaries, mockCameras, mockMaintenance, mockGuestProfiles, mockCheckIns, mockInventory, mockCarCompanies, mockCars, mockCarBookings } from "@/lib/mock-db";

// db might be null if no DATABASE_URL is set — use mock data instead
export const db = prismaDb;

export function isDb() {
  return db !== null && isDbEnabled();
}

// Mock data export for fallback
export const mock = {
  users: mockUsers,
  hotels: mockHotels,
  rooms: mockRooms,
  bundles: mockBundles,
  bookings: mockBookings,
  notifications: mockNotifications,
  reviews: mockReviews,
  staff: mockStaff,
  staffTasks: mockStaffTasks,
  salaries: mockSalaries,
  cameras: mockCameras,
  maintenance: mockMaintenance,
  guestProfiles: mockGuestProfiles,
  checkIns: mockCheckIns,
  inventory: mockInventory,
  carCompanies: mockCarCompanies,
  cars: mockCars,
  carBookings: mockCarBookings,
};

export async function getAuthUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  if (token.startsWith("staff-")) return null;
  if (token.startsWith("demo-")) return token.slice("demo-".length);
  return "user-bc-demo";
}

export async function getAuthStaffId(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  if (token.startsWith("staff-")) return token.slice("staff-".length);
  return null;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data, message: "OK" } as ApiResponse<T>, { status });
}

export function err(message: string, status = 400, errors?: { field?: string; message: string }[]) {
  return NextResponse.json({ success: false, data: null, message, errors } as ApiResponse<null>, { status });
}
