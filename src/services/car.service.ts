"use client";

import { api } from "@/lib/api";

export interface CarCompany {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  city?: string;
  rating: number;
  isActive: boolean;
  carCount?: number;
  bookingCount?: number;
  createdAt: string;
}

export interface Car {
  id: string;
  companyId: string;
  company?: { id: string; name: string; city?: string; rating?: number; phone?: string };
  make: string;
  model: string;
  year: number;
  plateNumber?: string;
  category: string; // economy | sedan | suv | luxury | van | sports
  transmission: string;
  seats: number;
  doors: number;
  bags: number;
  ac: boolean;
  fuelType: string;
  pricePerDay: number;
  deposit: number;
  images: string[];
  features: string[];
  available: boolean;
  mileage?: number;
  color?: string;
  bookingCount?: number;
}

export interface CarBooking {
  id: string;
  carId: string;
  car?: { id: string; make: string; model: string; year: number; plateNumber?: string; category: string; pricePerDay: number };
  companyId: string;
  company?: { id: string; name: string; city?: string };
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  deposit: number;
  status: string; // pending | confirmed | active | completed | cancelled
  notes?: string;
  createdAt: string;
}

export const carService = {
  listCompanies: () => api.get<CarCompany[]>("/cars/companies"),
  getCompany: (id: string) => api.get<CarCompany>(`/cars/companies/${id}`),
  createCompany: (payload: Partial<CarCompany>) => api.post<CarCompany>("/cars/companies", payload),
  updateCompany: (id: string, payload: Partial<CarCompany>) => api.patch<CarCompany>(`/cars/companies/${id}`, payload),
  removeCompany: (id: string) => api.delete<{ id: string }>(`/cars/companies/${id}`),

  list: (params: { companyId?: string; category?: string } = {}) =>
    api.get<Car[]>("/cars", { query: params }),
  create: (payload: any) => api.post<Car>("/cars", payload),
  update: (id: string, payload: any) => api.patch<Car>(`/cars/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/cars/${id}`),

  listBookings: () => api.get<CarBooking[]>("/cars/bookings"),
  createBooking: (payload: any) => api.post<CarBooking>("/cars/bookings", payload),
  updateBooking: (id: string, payload: any) => api.patch<CarBooking>(`/cars/bookings/${id}`, payload),
  removeBooking: (id: string) => api.delete<{ id: string }>(`/cars/bookings/${id}`),
};

// Guest (public) car service — no auth needed
export const guestCarService = {
  list: (params: { city?: string; category?: string; search?: string; maxPrice?: string; sortBy?: string } = {}) =>
    api.get<Car[]>("/guest/cars", { query: params, skipAuth: true }),
};
