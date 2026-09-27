// Client-side booking storage using localStorage
// Bookings are created when a guest confirms a hotel/bundle booking
// Falls back gracefully if localStorage is unavailable (SSR / privacy mode)

export type BookingType = "hotel" | "bundle";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface TripfulBooking {
  id: string;
  type: BookingType;
  itemId: string;
  itemName: string;
  itemNameAr?: string;
  itemImage: string;
  city?: string;
  country?: string;
  checkIn: string;        // ISO date
  checkOut: string;       // ISO date
  guests: number;
  rooms?: number;
  nights: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;      // ISO timestamp
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

const STORAGE_KEY = "tripful-bookings";
const PROFILE_KEY = "tripful-profile";

export interface TripfulProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  avatarInitials: string;
  memberSince: string;   // ISO date
  loyaltyPoints: number;
}

function isClient() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function getBookings(): TripfulBooking[] {
  if (!isClient()) return [];
  return safeParse<TripfulBooking[]>(localStorage.getItem(STORAGE_KEY), []);
}

export function addBooking(booking: Omit<TripfulBooking, "id" | "createdAt" | "status">): TripfulBooking {
  const newBooking: TripfulBooking = {
    ...booking,
    id: `TF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };
  if (isClient()) {
    const all = getBookings();
    all.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  return newBooking;
}

export function cancelBooking(id: string): void {
  if (!isClient()) return;
  const all = getBookings();
  const updated = all.map((b) => (b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getProfile(): TripfulProfile {
  if (!isClient()) return defaultProfile();
  const stored = safeParse<TripfulProfile | null>(localStorage.getItem(PROFILE_KEY), null);
  return stored ?? defaultProfile();
}

export function saveProfile(p: TripfulProfile): void {
  if (!isClient()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function defaultProfile(): TripfulProfile {
  return {
    name: "Guest User",
    email: "guest@tripful.com",
    phone: "",
    country: "Saudi Arabia",
    city: "Riyadh",
    avatarInitials: "GU",
    memberSince: new Date().toISOString(),
    loyaltyPoints: 100,
  };
}

export function computeStats(bookings: TripfulBooking[]) {
  const active = bookings.filter((b) => b.status !== "cancelled");
  const totalSpent = active.reduce((sum, b) => sum + b.amount, 0);
  const upcoming = bookings.filter((b) =>
    b.status === "confirmed" && new Date(b.checkIn) >= new Date()
  ).length;
  const past = bookings.filter((b) =>
    b.status === "completed" || (b.status === "confirmed" && new Date(b.checkOut) < new Date())
  ).length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  return {
    total: bookings.length,
    totalSpent,
    upcoming,
    past,
    cancelled,
    loyaltyPoints: active.length * 50 + 100,
  };
}
