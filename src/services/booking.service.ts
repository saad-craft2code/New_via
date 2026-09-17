"use client";

import { api } from "@/lib/api";

// Booking shape returned by /api/v1/bookings (server-side)
export interface ServerBooking {
  id: string;
  userId: string;
  type: string; // "HotelRoom" | "Bundle"
  hotelId?: string;
  roomId?: string;
  bundleId?: string;
  startDate: string;
  endDate?: string;
  numGuests: number;
  totalAmount: number;
  status: string; // "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled" | "Refunded"
  metadata: Record<string, any>;
  hotel?: { id: string; name: string; city?: string };
  room?: { id: string; roomType: string };
  bundle?: { id: string; title: string };
  createdAt: string;
  updatedAt: string;
}

// Shape used by the legacy UI (matches mockBookings / mockHotelBookings)
export interface UIBooking {
  id: string;
  guestName: string;
  guestNameAr: string;
  guestAvatar: string;
  guestEmail: string;
  guestPhone: string;
  itemName: string;
  itemNameAr: string;
  startDate: string;
  endDate: string;
  guests: number;
  nights?: number;
  rooms?: number;
  roomNumber?: string;
  totalAmount: number;
  commission: number;
  netEarnings: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled" | "No-show";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  bookingDate: string;
  nationality?: string;
  specialRequests?: string;
  previousStays?: number;
  type: "bundle" | "hotel";
  // extras
  hotelName?: string;
  bundleTitle?: string;
  roomType?: string;
}

function avatarFor(name: string): string {
  // Stable pravatar url from a name
  const seed = (name?.charCodeAt(0) ?? 65) % 70;
  return `https://i.pravatar.cc/150?img=${(seed % 60) + 1}`;
}

export function adaptBooking(b: ServerBooking): UIBooking {
  const meta = b.metadata ?? {};
  const guestName = meta.guestName ?? "Guest";
  const guestNameAr = meta.guestNameAr ?? guestName;
  const guestEmail = meta.guestEmail ?? "guest@example.com";
  const guestPhone = meta.guestPhone ?? "";
  const guestAvatar = meta.guestAvatar ?? avatarFor(guestName);
  const itemName = b.bundle?.title ?? b.hotel?.name ?? meta.itemName ?? "Booking";
  const itemNameAr = meta.itemNameAr ?? itemName;
  const nationality = meta.nationality ?? "—";
  const specialRequests = meta.specialRequests ?? "";
  const previousStays = meta.previousStays;
  const nights = b.endDate ? Math.max(1, Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 86400000)) : undefined;
  const commission = Math.round(b.totalAmount * 0.1);
  const paymentStatus: UIBooking["paymentStatus"] =
    b.status === "Refunded" ? "Refunded" :
    b.status === "Completed" || b.status === "Confirmed" || b.status === "Active" ? "Paid" :
    "Pending";

  return {
    id: b.id,
    guestName,
    guestNameAr,
    guestAvatar,
    guestEmail,
    guestPhone,
    itemName,
    itemNameAr,
    startDate: b.startDate.slice(0, 10),
    endDate: (b.endDate ?? b.startDate).slice(0, 10),
    guests: b.numGuests,
    nights,
    totalAmount: b.totalAmount,
    commission,
    netEarnings: b.totalAmount - commission,
    status: (b.status === "Refunded" ? "Cancelled" : b.status === "No-show" ? "No-show" : b.status) as UIBooking["status"],
    paymentStatus,
    bookingDate: (b.createdAt ?? new Date()).slice(0, 10),
    nationality,
    specialRequests: specialRequests || undefined,
    previousStays,
    type: b.type === "HotelRoom" ? "hotel" : "bundle",
    hotelName: b.hotel?.name,
    bundleTitle: b.bundle?.title,
    roomType: b.room?.roomType,
  };
}

export const bookingService = {
  list: () => api.get<ServerBooking[]>("/bookings"),
  get: (id: string) => api.get<ServerBooking>(`/bookings/${id}`),
  create: (payload: Partial<ServerBooking>) => api.post<ServerBooking>("/bookings", payload),
  update: (id: string, payload: Partial<ServerBooking>) => api.patch<ServerBooking>(`/bookings/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/bookings/${id}`),
};
