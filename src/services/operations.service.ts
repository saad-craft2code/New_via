"use client";

import { api } from "@/lib/api";

// ─── Maintenance ────────────────────────────────────────────
export interface MaintenanceRequest {
  id: string;
  hotelId: string;
  hotel?: { id: string; name: string };
  roomId?: string;
  room?: { id: string; roomType: string };
  reportedBy: string;
  assignedTo?: string;
  staff?: { id: string; name: string; nameAr?: string; department: string };
  title: string;
  description?: string;
  location?: string;
  priority: string; // low | normal | high | urgent
  status: string;   // open | in_progress | resolved | closed
  category: string; // electrical | plumbing | hvac | furniture | appliance | structural | other
  photoUrl?: string;
  reportedAt: string;
  startedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

export const maintenanceService = {
  list: (params: { status?: string; priority?: string } = {}) =>
    api.get<MaintenanceRequest[]>("/maintenance", { query: params }),
  create: (payload: Partial<MaintenanceRequest>) =>
    api.post<MaintenanceRequest>("/maintenance", payload),
  update: (id: string, payload: Partial<MaintenanceRequest>) =>
    api.patch<MaintenanceRequest>(`/maintenance/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/maintenance/${id}`),
};

// ─── Guest Profiles ─────────────────────────────────────────
export interface GuestProfile {
  id: string;
  hotelId?: string;
  name: string;
  nameAr?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  preferences: string[];
  dietaryNeeds?: string;
  vipStatus: string; // regular | silver | gold | platinum
  totalStays: number;
  totalSpent: number;
  lastStayAt?: string;
  blacklisted: boolean;
  notes?: string;
  createdAt: string;
}

export const guestProfileService = {
  list: (params: { search?: string; vipStatus?: string } = {}) =>
    api.get<GuestProfile[]>("/guests", { query: params }),
  create: (payload: Partial<GuestProfile>) =>
    api.post<GuestProfile>("/guests", payload),
  update: (id: string, payload: Partial<GuestProfile>) =>
    api.patch<GuestProfile>(`/guests/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/guests/${id}`),
};

// ─── Inventory ──────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  hotelId: string;
  name: string;
  nameAr?: string;
  category: string;
  unit: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  supplier?: string;
  location?: string;
  barcode?: string;
  lastRestockedAt?: string;
  lastRestockQty?: number;
  lowStock: boolean;
  stockValue: number;
  createdAt: string;
}

export const inventoryService = {
  list: (params: { category?: string; lowStock?: string } = {}) =>
    api.get<InventoryItem[]>("/inventory", { query: params }),
  create: (payload: Partial<InventoryItem>) =>
    api.post<InventoryItem>("/inventory", payload),
  update: (id: string, payload: any) =>
    api.patch<InventoryItem>(`/inventory/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/inventory/${id}`),
};

// ─── Check-Ins (Front Desk) ─────────────────────────────────
export interface CheckIn {
  id: string;
  hotelId: string;
  hotel?: { id: string; name: string };
  guestId?: string;
  guest?: { id: string; name: string; vipStatus: string };
  bookingId?: string;
  roomId?: string;
  room?: { id: string; roomType: string };
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  numGuests: number;
  checkInAt: string;
  expectedCheckOut: string;
  actualCheckOut?: string;
  status: string; // checked_in | checked_out | no_show | cancelled
  roomNumber?: string;
  keyCardCount: number;
  depositCollected: number;
  specialRequests?: string;
  notes?: string;
}

export const checkInService = {
  list: (params: { status?: string; today?: string } = {}) =>
    api.get<CheckIn[]>("/checkins", { query: params }),
  create: (payload: Partial<CheckIn>) =>
    api.post<CheckIn>("/checkins", payload),
  update: (id: string, payload: Partial<CheckIn>) =>
    api.patch<CheckIn>(`/checkins/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/checkins/${id}`),
};

// ─── Room Status Board ──────────────────────────────────────
export interface RoomWithStatus {
  id: string;
  hotelId: string;
  hotel?: { id: string; name: string; city?: string };
  roomType: string;
  bedType: string;
  maxGuests: number;
  pricePerNight: number;
  size?: number;
  amenities: string[];
  images: string[];
  totalUnits: number;
  availableUnits: number;
  status: string; // available | occupied | clean | dirty | inspected | out_of_order
  lastStatusNote?: string;
  lastStatusChange?: string;
  activeCheckIn?: {
    id: string;
    guestName: string;
    checkInAt: string;
    expectedCheckOut: string;
  } | null;
}

export const roomStatusService = {
  list: (params: { hotelId?: string } = {}) =>
    api.get<RoomWithStatus[]>("/room-status", { query: params }),
  updateStatus: (roomId: string, status: string, notes?: string) =>
    api.post("/room-status", { roomId, status, notes }),
};

// ─── Operations Dashboard ───────────────────────────────────
export interface OperationsDashboard {
  kpi: {
    totalHotels: number;
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    adr: number;
    revpar: number;
    activeCheckIns: number;
    arrivalsToday: number;
    departuresToday: number;
    openMaintenance: number;
    lowStockItems: number;
    inventoryValue: number;
  };
  roomStatusBreakdown: Record<string, number>;
  todayActivity: {
    arrivals: Array<{ id: string; guestName: string; roomNumber?: string; hotelName?: string; checkInAt: string; numGuests: number }>;
    departures: Array<{ id: string; guestName: string; roomNumber?: string; hotelName?: string; expectedCheckOut: string }>;
    maintenance: Array<{ id: string; title: string; priority: string; status: string; location?: string; hotelName?: string; assignedTo?: string }>;
    lowStock: Array<{ id: string; name: string; quantity: number; minStock: number; unit: string }>;
  };
}

export const operationsService = {
  dashboard: () => api.get<OperationsDashboard>("/operations/dashboard"),
};
