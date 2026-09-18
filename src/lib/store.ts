"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@via/shared-types";
import { setToken } from "@/lib/api";
import { authService } from "@/services/auth.service";

export type Role = "bundle_creator" | "hotel_owner";
export type Lang = "ar" | "en";
export type Theme = "light" | "dark";

export type BCView =
  | "dashboard"
  | "bundles"
  | "bundle_wizard"
  | "calendar"
  | "bookings"
  | "earnings"
  | "reviews"
  | "notifications"
  | "profile"
  | "settings"
  | "kyc"
  | "analytics"
  | "guest_view"
  | "staff"
  | "tasks"
  | "salaries"
  | "cameras"
  | "car_companies"
  | "cars"
  | "car_bookings"
  | "operations_dashboard"
  | "front_desk"
  | "room_status"
  | "maintenance"
  | "guests"
  | "inventory";

export type HOView =
  | "dashboard"
  | "hotels"
  | "hotel_wizard"
  | "rooms"
  | "calendar"
  | "bookings"
  | "guests"
  | "earnings"
  | "reviews"
  | "notifications"
  | "profile"
  | "settings"
  | "kyc"
  | "analytics"
  | "guest_view"
  | "staff"
  | "tasks"
  | "salaries"
  | "cameras"
  | "car_companies"
  | "cars"
  | "car_bookings"
  | "operations_dashboard"
  | "front_desk"
  | "room_status"
  | "maintenance"
  | "inventory";

export type AuthScreen =
  | "landing"
  | "role_selection"
  | "register"
  | "verification"
  | "login"
  | "guest_browse"
  | "staff_login"
  | "staff_portal";

interface AppState {
  // auth
  isAuthed: boolean;
  authScreen: AuthScreen;
  role: Role;
  token: string | null;
  user: User | null;
  // staff auth (separate from regular user)
  isStaffAuthed: boolean;
  staffToken: string | null;
  staff: {
    id: string;
    email: string;
    name: string;
    nameAr?: string;
    phone?: string;
    role: string;
    department: string;
    hotelId?: string;
    hotelName?: string;
    avatarUrl?: string;
    baseSalary: number;
    hourlyRate: number;
    isActive: boolean;
  } | null;
  // navigation
  bcView: BCView;
  hoView: HOView;
  selectedHotelId: string | null;
  selectedBundleId: string | null;
  // settings
  lang: Lang;
  theme: Theme;
  sidebarOpen: boolean;
  // loading flags
  isAuthLoading: boolean;
  authError: string | null;
  isStaffAuthLoading: boolean;
  staffAuthError: string | null;
  // actions
  setAuthed: (v: boolean) => void;
  setAuthScreen: (s: AuthScreen) => void;
  setRole: (r: Role) => void;
  setBcView: (v: BCView) => void;
  setHoView: (v: HOView) => void;
  setSelectedHotelId: (id: string | null) => void;
  setSelectedBundleId: (id: string | null) => void;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  setSidebarOpen: (v: boolean) => void;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  setAuthLoading: (v: boolean) => void;
  setAuthError: (e: string | null) => void;
  // staff actions
  setStaff: (s: AppState["staff"]) => void;
  setStaffToken: (t: string | null) => void;
  setStaffAuthed: (v: boolean) => void;
  setStaffAuthLoading: (v: boolean) => void;
  setStaffAuthError: (e: string | null) => void;
  staffLogin: (email: string, password: string) => Promise<void>;
  staffLogout: () => void;
  // api-driven actions
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    companyName?: string;
    businessLicense?: string;
    tourGuideLicense?: string;
    yearsExperience?: number;
    languagesSpoken?: string[];
  }) => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthed: false,
      authScreen: "landing",
      role: "bundle_creator",
      token: null,
      user: null,
      isStaffAuthed: false,
      staffToken: null,
      staff: null,
      bcView: "dashboard",
      hoView: "dashboard",
      selectedHotelId: null,
      selectedBundleId: null,
      lang: "ar",
      theme: "light",
      sidebarOpen: true,
      isAuthLoading: false,
      authError: null,
      isStaffAuthLoading: false,
      staffAuthError: null,
      setAuthed: (v) => set({ isAuthed: v }),
      setAuthScreen: (s) => set({ authScreen: s }),
      setRole: (r) => set({ role: r }),
      setBcView: (v) => set({ bcView: v }),
      setHoView: (v) => set({ hoView: v }),
      setSelectedHotelId: (id) => set({ selectedHotelId: id }),
      setSelectedBundleId: (id) => set({ selectedBundleId: id }),
      setLang: (l) => set({ lang: l }),
      setTheme: (t) => set({ theme: t }),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setUser: (u) => set({ user: u }),
      setToken: (t) => set({ token: t }),
      setAuthLoading: (v) => set({ isAuthLoading: v }),
      setAuthError: (e) => set({ authError: e }),
      setStaff: (s) => set({ staff: s }),
      setStaffToken: (t) => set({ staffToken: t }),
      setStaffAuthed: (v) => set({ isStaffAuthed: v }),
      setStaffAuthLoading: (v) => set({ isStaffAuthLoading: v }),
      setStaffAuthError: (e) => set({ staffAuthError: e }),

      staffLogin: async (email, password) => {
        set({ isStaffAuthLoading: true, staffAuthError: null });
        try {
          const { staffService } = await import("@/services/staff.service");
          const res = await staffService.login(email, password);
          // Persist staff token separately in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("via-staff-token", res.token);
          }
          set({
            staffToken: res.token,
            staff: res.staff as any,
            isStaffAuthed: true,
            authScreen: "staff_portal",
            isStaffAuthLoading: false,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Staff login failed";
          set({ isStaffAuthLoading: false, staffAuthError: msg });
          throw e;
        }
      },

      staffLogout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("via-staff-token");
        }
        set({
          isStaffAuthed: false,
          staffToken: null,
          staff: null,
          authScreen: "staff_login",
          staffAuthError: null,
        });
      },

      login: async (email, password, role) => {
        set({ isAuthLoading: true, authError: null });
        try {
          const res = await authService.login({ email, password, role });
          setToken(res.token);
          // The backend may return either the Prisma enum string ("HotelOwner" / "BundleCreator")
          // or the shared-types literal ("hotel_owner" / "bundle_creator"). Handle both.
          const rawRole = (res.user as unknown as { role: string }).role;
          const sharedRole: Role =
            rawRole === "HotelOwner" || rawRole === "hotel_owner"
              ? "hotel_owner"
              : rawRole === "BundleCreator" || rawRole === "bundle_creator"
                ? "bundle_creator"
                : "bundle_creator";
          set({
            token: res.token,
            user: {
              ...res.user,
              role: sharedRole as UserRole,
              kycStatus: mapKycStatus((res.user as unknown as { kycStatus: string }).kycStatus),
            } as User,
            isAuthed: true,
            role: sharedRole,
            isAuthLoading: false,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Login failed";
          set({ isAuthLoading: false, authError: msg });
          throw e;
        }
      },

      register: async (payload) => {
        set({ isAuthLoading: true, authError: null });
        try {
          const res = await authService.register(payload);
          setToken(res.token);
          const rawRole = (res.user as unknown as { role: string }).role;
          const sharedRole: Role =
            rawRole === "HotelOwner" || rawRole === "hotel_owner"
              ? "hotel_owner"
              : rawRole === "BundleCreator" || rawRole === "bundle_creator"
                ? "bundle_creator"
                : "bundle_creator";
          set({
            token: res.token,
            user: {
              ...res.user,
              role: sharedRole as UserRole,
              kycStatus: mapKycStatus((res.user as unknown as { kycStatus: string }).kycStatus),
            } as User,
            isAuthed: true,
            role: sharedRole,
            isAuthLoading: false,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Registration failed";
          set({ isAuthLoading: false, authError: msg });
          throw e;
        }
      },

      logout: () => {
        setToken(null);
        set({
          isAuthed: false,
          authScreen: "landing",
          bcView: "dashboard",
          hoView: "dashboard",
          token: null,
          user: null,
          authError: null,
        });
      },
    }),
    {
      name: "via-store",
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        isAuthed: s.isAuthed,
        role: s.role,
        bcView: s.bcView,
        hoView: s.hoView,
        token: s.token,
        user: s.user,
        isStaffAuthed: s.isStaffAuthed,
        staffToken: s.staffToken,
        staff: s.staff,
      }),
    },
  ),
);

/** Convert Prisma enum strings OR shared-types literals to User["kycStatus"]. */
function mapKycStatus(s: string | undefined): User["kycStatus"] {
  switch (s) {
    case "Pending":
    case "pending":
      return "pending";
    case "Approved":
    case "approved":
      return "approved";
    case "Rejected":
    case "rejected":
      return "rejected";
    default:
      return "not_submitted";
  }
}
