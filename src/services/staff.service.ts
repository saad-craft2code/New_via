"use client";

import { api } from "@/lib/api";

export interface Staff {
  id: string;
  email: string;
  name: string;
  nameAr?: string;
  phone?: string;
  role: string; // "staff" | "supervisor" | "manager"
  department: string; // "housekeeping" | "maintenance" | "front_desk" | "security" | "kitchen" | "logistics"
  hotelId?: string;
  hotel?: { id: string; name: string; city?: string };
  avatarUrl?: string;
  baseSalary: number;
  hourlyRate: number;
  isActive: boolean;
  hiredAt: string;
  taskStats?: Record<string, number>;
}

export interface StaffTask {
  id: string;
  staffId: string;
  staff?: { id: string; name: string; nameAr?: string; department: string; role: string; avatarUrl?: string };
  assignedBy: string;
  hotelId?: string;
  hotel?: { id: string; name: string; city?: string };
  type: string; // "cleaning" | "maintenance" | "delivery" | "inspection" | "setup" | "other"
  title: string;
  description?: string;
  location?: string;
  priority: string; // "low" | "normal" | "high" | "urgent"
  status: string; // "pending" | "in_progress" | "completed" | "cancelled"
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  dueAt?: string;
  notes?: string;
  photoUrl?: string;
  cameraId?: string;
}

export interface SalaryPayment {
  id: string;
  staffId: string;
  staff?: { id: string; name: string; nameAr?: string; department: string; role: string; avatarUrl?: string };
  amount: number;
  period: string;
  bonus: number;
  deductions: number;
  net: number;
  status: string; // "pending" | "paid" | "cancelled"
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  hotelId?: string;
  hotel?: { id: string; name: string; city?: string };
  streamUrl?: string;
  status: string; // "online" | "offline" | "maintenance"
  createdAt: string;
}

export const staffService = {
  // Admin
  list: () => api.get<Staff[]>("/staff"),
  create: (payload: Partial<Staff>) => api.post<Staff>("/staff", payload),
  update: (id: string, payload: Partial<Staff>) => api.patch<Staff>(`/staff/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/staff/${id}`),

  // Tasks
  listTasks: (params: { status?: string; department?: string; staffId?: string } = {}) =>
    api.get<StaffTask[]>("/staff/tasks", { query: params }),
  assignTask: (payload: Partial<StaffTask>) => api.post<StaffTask>("/staff/tasks", payload),
  updateTask: (id: string, payload: Partial<StaffTask>) => api.patch<StaffTask>(`/staff/tasks/${id}`, payload),
  deleteTask: (id: string) => api.delete<{ id: string }>(`/staff/tasks/${id}`),

  // Salaries
  listSalaries: (params: { period?: string; status?: string } = {}) =>
    api.get<SalaryPayment[]>("/staff/salaries", { query: params }),
  createSalary: (payload: any) => api.post<SalaryPayment>("/staff/salaries", payload),
  updateSalary: (id: string, payload: any) => api.patch<SalaryPayment>(`/staff/salaries/${id}`, payload),

  // Cameras
  listCameras: () => api.get<Camera[]>("/staff/cameras"),
  createCamera: (payload: any) => api.post<Camera>("/staff/cameras", payload),
  updateCamera: (id: string, payload: any) => api.patch<Camera>(`/staff/cameras/${id}`, payload),
  removeCamera: (id: string) => api.delete<{ id: string }>(`/staff/cameras/${id}`),

  // Staff auth (separate token namespace)
  login: (email: string, password: string) =>
    api.post<{ token: string; staff: Staff }>("/staff/auth/login", { email, password }, { skipAuth: true }),
  me: () => api.get<{ id: string; email: string; name: string; nameAr?: string; phone?: string; role: string; department: string; hotelId?: string; hotelName?: string; avatarUrl?: string; baseSalary: number; hourlyRate: number; isActive: boolean }>("/staff/auth/me"),
};
