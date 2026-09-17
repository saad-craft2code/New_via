// Service for guest (public) browsing — uses /api/v1/guest/* routes, no auth needed.
"use client";

import { api } from "@/lib/api";

export interface GuestHotel {
  id: string;
  name: string;
  description: string;
  starRating: number;
  location: string;
  city: string;
  country: string;
  amenities: string[];
  images: string[];
  coverImage: string;
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
  startingPrice: number;
  propertyType: string;
  ownerName: string;
  bookingCount: number;
  createdAt: string;
}

export interface GuestHotelDetail extends GuestHotel {
  latitude?: number;
  longitude?: number;
  policies: any;
  rooms: Array<{
    id: string;
    roomType: string;
    bedType: string;
    maxGuests: number;
    pricePerNight: number;
    size?: number;
    amenities: string[];
    images: string[];
    totalUnits: number;
    availableUnits: number;
  }>;
  owner: { name: string; email: string; phone: string };
}

export interface GuestBundle {
  id: string;
  title: string;
  titleEn: string;
  titleAr: string;
  description: string;
  durationDays: number;
  days: number;
  nights: number;
  destinations: string[];
  images: string[];
  coverImage: string;
  type: string;
  startingPrice: number;
  difficulty: string;
  groupSizeMin: number;
  groupSizeMax: number;
  guideName?: string;
  includedServices: string[];
  status: string;
  creator: { id: string; name: string; companyName?: string; avatarUrl?: string };
  totalBookings: number;
  revenue: number;
  rating: number;
  views: number;
  wishlist: number;
  conversionRate: number;
  createdAt: string;
}

export interface GuestBundleDetail extends GuestBundle {
  price: number;
  itinerary: Array<{
    dayNumber: number;
    title: string;
    description: string;
    items: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      startTime: string;
      endTime: string;
      location: string;
      cost: number;
      includedServices: string[];
    }>;
  }>;
}

export interface GuestBookingPayload {
  type: "HotelRoom" | "Bundle";
  hotelId?: string;
  roomId?: string;
  bundleId?: string;
  startDate: string;
  endDate?: string;
  numGuests: number;
  totalAmount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

export const guestService = {
  listHotels: (params: { city?: string; search?: string; starRating?: string; sortBy?: string } = {}) =>
    api.get<GuestHotel[]>("/guest/hotels", { query: params, skipAuth: true }),

  getHotel: (id: string) =>
    api.get<GuestHotelDetail>(`/guest/hotels/${id}`, { skipAuth: true }),

  listBundles: (params: { destination?: string; difficulty?: string; search?: string; maxPrice?: string; sortBy?: string } = {}) =>
    api.get<GuestBundle[]>("/guest/bundles", { query: params, skipAuth: true }),

  getBundle: (id: string) =>
    api.get<GuestBundleDetail>(`/guest/bundles/${id}`, { skipAuth: true }),

  createBooking: (payload: GuestBookingPayload) =>
    api.post<{ id: string; type: string; status: string }>("/guest/bookings", payload, { skipAuth: true }),

  getStats: () =>
    api.get<{ totalHotels: number; totalBundles: number; totalBookings: number; totalProviders: number; cities: string[] }>("/guest/analytics", { skipAuth: true }),
};
