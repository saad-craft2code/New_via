"use client";

import { useAppStore, type Role } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./brand-logo";
import { mockProviderProfile, mockNotifications } from "@/lib/mock-data";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Wallet,
  Star,
  Bell,
  Settings,
  User,
  Gift,
  Hotel,
  BedDouble,
  Users,
  Globe,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BCDashboard } from "@/components/bundle-creator/bc-dashboard";
import { BCBundles } from "@/components/bundle-creator/bc-bundles";
import { BCBundleWizard } from "@/components/bundle-creator/bc-bundle-wizard";
import { BCCalendar } from "@/components/bundle-creator/bc-calendar";
import { BCBookings } from "@/components/bundle-creator/bc-bookings";
import { BCEarnings } from "@/components/bundle-creator/bc-earnings";
import { BCReviews } from "@/components/bundle-creator/bc-reviews";
import { BCNotifications } from "@/components/bundle-creator/bc-notifications";
import { BCProfile } from "@/components/bundle-creator/bc-profile";
import { BCSettings } from "@/components/bundle-creator/bc-settings";
import { HODashboard } from "@/components/hotel-owner/ho-dashboard";
import { HOHotels } from "@/components/hotel-owner/ho-hotels";
import { HOHotelWizard } from "@/components/hotel-owner/ho-hotel-wizard";
import { HORooms } from "@/components/hotel-owner/ho-rooms";
import { HOCalendar } from "@/components/hotel-owner/ho-calendar";
import { HOBookings } from "@/components/hotel-owner/ho-bookings";
import { HOGuests } from "@/components/hotel-owner/ho-guests";
import { HOEarnings } from "@/components/hotel-owner/ho-earnings";
import { HOReviews } from "@/components/hotel-owner/ho-reviews";
import { HONotifications } from "@/components/hotel-owner/ho-notifications";
import { HOProfile } from "@/components/hotel-owner/ho-profile";
import { HOSettings } from "@/components/hotel-owner/ho-settings";
import { HOKyc } from "@/components/hotel-owner/ho-kyc";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { GuestBrowse } from "@/components/guest/guest-browse";
import { StaffManagement } from "@/components/operations/staff-management";
import { TaskManagement } from "@/components/operations/task-management";
import { SalariesManagement } from "@/components/operations/salaries-management";
import { CamerasManagement } from "@/components/operations/cameras-management";
import { CarCompaniesAdmin } from "@/components/cars/car-companies-admin";
import { CarsAdmin } from "@/components/cars/cars-admin";
import { CarBookingsAdmin } from "@/components/cars/car-bookings-admin";
import { OperationsDashboard } from "@/components/operations/operations-dashboard";
import { FrontDesk } from "@/components/operations/front-desk";
import { RoomStatusBoard } from "@/components/operations/room-status-board";
import { MaintenancePage } from "@/components/operations/maintenance-page";
import { GuestsPage } from "@/components/operations/guests-page";
import { InventoryPage } from "@/components/operations/inventory-page";
import { BarChart3, Compass, Camera, Car as CarIcon, Building2, LayoutGrid, LogIn, Wrench, Package } from "lucide-react";

interface NavItem {
  key: string;
  labelKey: any;
  icon: LucideIcon;
  view: string;
  roleSpecific?: boolean;
}

const bcNavItems: NavItem[] = [
  { key: "dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard, view: "dashboard" },
  { key: "calendar", labelKey: "nav_calendar", icon: Calendar, view: "calendar" },
  { key: "bookings", labelKey: "nav_bookings", icon: ClipboardList, view: "bookings" },
  { key: "bundles", labelKey: "nav_bundles", icon: Gift, view: "bundles", roleSpecific: true },
  { key: "earnings", labelKey: "nav_earnings", icon: Wallet, view: "earnings" },
  { key: "analytics", labelKey: "nav_analytics", icon: BarChart3, view: "analytics" },
  { key: "reviews", labelKey: "nav_reviews", icon: Star, view: "reviews" },
  { key: "notifications", labelKey: "nav_notifications", icon: Bell, view: "notifications" },
  { key: "operations_dashboard", labelKey: "nav_operations_dashboard", icon: LayoutGrid, view: "operations_dashboard" },
  { key: "front_desk", labelKey: "nav_front_desk", icon: LogIn, view: "front_desk" },
  { key: "room_status", labelKey: "nav_room_status", icon: BedDouble, view: "room_status" },
  { key: "maintenance", labelKey: "nav_maintenance", icon: Wrench, view: "maintenance" },
  { key: "guests", labelKey: "nav_guests", icon: Users, view: "guests" },
  { key: "inventory", labelKey: "nav_inventory", icon: Package, view: "inventory" },
  { key: "operations_staff", labelKey: "nav_staff", icon: Users, view: "staff" },
  { key: "operations_tasks", labelKey: "nav_tasks", icon: ClipboardList, view: "tasks" },
  { key: "operations_salaries", labelKey: "nav_salaries", icon: Wallet, view: "salaries" },
  { key: "operations_cameras", labelKey: "nav_cameras", icon: Camera, view: "cameras" },
  { key: "cars_companies", labelKey: "nav_car_companies", icon: Building2, view: "car_companies" },
  { key: "cars_cars", labelKey: "nav_cars", icon: CarIcon, view: "cars" },
  { key: "cars_bookings", labelKey: "nav_car_bookings", icon: ClipboardList, view: "car_bookings" },
  { key: "kyc", labelKey: "nav_kyc", icon: ShieldCheck, view: "kyc" },
  { key: "profile", labelKey: "nav_profile", icon: User, view: "profile" },
  { key: "settings", labelKey: "nav_settings", icon: Settings, view: "settings" },
  { key: "guest_view", labelKey: "nav_guest_view", icon: Compass, view: "guest_view" },
];

const hoNavItems: NavItem[] = [
  { key: "dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard, view: "dashboard" },
  { key: "calendar", labelKey: "nav_calendar", icon: Calendar, view: "calendar" },
  { key: "hotels", labelKey: "nav_hotels", icon: Hotel, view: "hotels", roleSpecific: true },
  { key: "bookings", labelKey: "nav_bookings", icon: ClipboardList, view: "bookings" },
  { key: "rooms", labelKey: "nav_rooms", icon: BedDouble, view: "rooms", roleSpecific: true },
  { key: "guests", labelKey: "nav_guests", icon: Users, view: "guests" },
  { key: "earnings", labelKey: "nav_earnings", icon: Wallet, view: "earnings" },
  { key: "analytics", labelKey: "nav_analytics", icon: BarChart3, view: "analytics" },
  { key: "reviews", labelKey: "nav_reviews", icon: Star, view: "reviews" },
  { key: "notifications", labelKey: "nav_notifications", icon: Bell, view: "notifications" },
  { key: "operations_dashboard", labelKey: "nav_operations_dashboard", icon: LayoutGrid, view: "operations_dashboard" },
  { key: "front_desk", labelKey: "nav_front_desk", icon: LogIn, view: "front_desk" },
  { key: "room_status", labelKey: "nav_room_status", icon: BedDouble, view: "room_status" },
  { key: "maintenance", labelKey: "nav_maintenance", icon: Wrench, view: "maintenance" },
  { key: "inventory", labelKey: "nav_inventory", icon: Package, view: "inventory" },
  { key: "operations_staff", labelKey: "nav_staff", icon: Users, view: "staff" },
  { key: "operations_tasks", labelKey: "nav_tasks", icon: ClipboardList, view: "tasks" },
  { key: "operations_salaries", labelKey: "nav_salaries", icon: Wallet, view: "salaries" },
  { key: "operations_cameras", labelKey: "nav_cameras", icon: Camera, view: "cameras" },
  { key: "cars_companies", labelKey: "nav_car_companies", icon: Building2, view: "car_companies" },
  { key: "cars_cars", labelKey: "nav_cars", icon: CarIcon, view: "cars" },
  { key: "cars_bookings", labelKey: "nav_car_bookings", icon: ClipboardList, view: "car_bookings" },
  { key: "kyc", labelKey: "nav_kyc", icon: ShieldCheck, view: "kyc" },
  { key: "profile", labelKey: "nav_profile", icon: User, view: "profile" },
  { key: "settings", labelKey: "nav_settings", icon: Settings, view: "settings" },
  { key: "guest_view", labelKey: "nav_guest_view", icon: Compass, view: "guest_view" },
];

export function AppShell() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const role = useAppStore((s) => s.role);
  const bcView = useAppStore((s) => s.bcView);
  const hoView = useAppStore((s) => s.hoView);
  const setBcView = useAppStore((s) => s.setBcView);
  const setHoView = useAppStore((s) => s.setHoView);
  const logout = useAppStore((s) => s.logout);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const isRtl = lang === "ar";

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profile = mockProviderProfile[role];
  const navItems = role === "bundle_creator" ? bcNavItems : hoNavItems;
  const currentView = role === "bundle_creator" ? bcView : hoView;
  const setView = role === "bundle_creator" ? setBcView : setHoView;

  const unreadCount = useMemo(() => mockNotifications.filter((n) => !n.read).length, []);

  const pageTitle = useMemo(() => {
    const item = navItems.find((n) => n.view === currentView);
    return item ? t(item.labelKey, lang) : "";
  }, [navItems, currentView, lang]);

  // Wrapper to switch view and close mobile sidebar in one click
  const handleNavClick = (v: any) => {
    setView(v);
    setMobileSidebar(false);
  };

  const renderView = () => {
    if (role === "bundle_creator") {
      switch (bcView) {
        case "dashboard": return <BCDashboard />;
        case "bundles": return <BCBundles />;
        case "bundle_wizard": return <BCBundleWizard />;
        case "calendar": return <BCCalendar />;
        case "bookings": return <BCBookings />;
        case "earnings": return <BCEarnings />;
        case "reviews": return <BCReviews />;
        case "notifications": return <BCNotifications />;
        case "profile": return <BCProfile />;
        case "settings": return <BCSettings />;
        case "kyc": return <HOKyc />;
        case "analytics": return <AnalyticsDashboard />;
        case "guest_view": return <GuestBrowse />;
        case "staff": return <StaffManagement />;
        case "tasks": return <TaskManagement />;
        case "salaries": return <SalariesManagement />;
        case "cameras": return <CamerasManagement />;
        case "car_companies": return <CarCompaniesAdmin />;
        case "cars": return <CarsAdmin />;
        case "car_bookings": return <CarBookingsAdmin />;
        case "operations_dashboard": return <OperationsDashboard />;
        case "front_desk": return <FrontDesk />;
        case "room_status": return <RoomStatusBoard />;
        case "maintenance": return <MaintenancePage />;
        case "guests": return <GuestsPage />;
        case "inventory": return <InventoryPage />;
      }
    } else {
      switch (hoView) {
        case "dashboard": return <HODashboard />;
        case "hotels": return <HOHotels />;
        case "hotel_wizard": return <HOHotelWizard />;
        case "rooms": return <HORooms />;
        case "calendar": return <HOCalendar />;
        case "bookings": return <HOBookings />;
        case "guests": return <GuestsPage />;
        case "earnings": return <HOEarnings />;
        case "reviews": return <HOReviews />;
        case "notifications": return <HONotifications />;
        case "profile": return <HOProfile />;
        case "settings": return <HOSettings />;
        case "kyc": return <HOKyc />;
        case "analytics": return <AnalyticsDashboard />;
        case "guest_view": return <GuestBrowse />;
        case "staff": return <StaffManagement />;
        case "tasks": return <TaskManagement />;
        case "salaries": return <SalariesManagement />;
        case "cameras": return <CamerasManagement />;
        case "car_companies": return <CarCompaniesAdmin />;
        case "cars": return <CarsAdmin />;
        case "car_bookings": return <CarBookingsAdmin />;
        case "operations_dashboard": return <OperationsDashboard />;
        case "front_desk": return <FrontDesk />;
        case "room_status": return <RoomStatusBoard />;
        case "maintenance": return <MaintenancePage />;
        case "inventory": return <InventoryPage />;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar/75 border-e border-sidebar-border/80 backdrop-blur-xl transition-all duration-300 sticky top-0 h-screen z-30",
          sidebarOpen ? "w-72" : "w-24"
        )}
      >
        <SidebarContent
          navItems={navItems}
          currentView={currentView}
          setView={handleNavClick}
          profile={profile}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={logout}
          isRtl={isRtl}
          lang={lang}
          theme={theme}
          setLang={setLang}
          setTheme={setTheme}
        />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: isRtl ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? 280 : -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 start-0 z-50 w-72 bg-sidebar border-e border-sidebar-border flex flex-col"
            >
              <SidebarContent
                navItems={navItems}
                currentView={currentView}
                setView={handleNavClick}
                profile={profile}
                role={role}
                sidebarOpen={true}
                setSidebarOpen={setSidebarOpen}
                onLogout={logout}
                isRtl={isRtl}
                lang={lang}
                theme={theme}
                setLang={setLang}
                setTheme={setTheme}
                onClose={() => setMobileSidebar(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-20 bg-background/70 backdrop-blur-xl border-b border-border/80 flex items-center px-4 lg:px-6 gap-3 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.25)]">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebar(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {isRtl ? (
              sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
            ) : (
              sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
            )}
          </Button>

          {/* Logo next to search */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neutral-950 via-zinc-800 to-zinc-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
                <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="font-bold text-sm hidden sm:block leading-snug">{t("brand", lang)}</span>
          </div>

          <h1 className="text-lg font-semibold hidden lg:block">{pageTitle}</h1>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("search_placeholder", lang)}
                className="w-full h-9 ps-9 pe-3 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="gap-1.5"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">{t("language_toggle", lang)}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNotifOpen((p) => !p);
                  setProfileOpen(false);
                }}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 end-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotifOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-border flex items-center justify-between">
                        <p className="font-semibold text-sm">
                          {t("nav_notifications", lang)}
                        </p>
                        <button
                          onClick={() => {
                            setView("notifications" as any);
                            setNotifOpen(false);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          {t("view_all", lang)}
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto scrollbar-thin">
                        {mockNotifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "p-3 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                              !n.read && "bg-primary/5"
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                                <Bell className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {lang === "ar" ? n.titleAr : n.titleEn}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {lang === "ar" ? n.messageAr : n.messageEn}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70 mt-1">
                                  {new Date(n.timestamp).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                                </p>
                              </div>
                              {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 ms-1 rounded-lg hover:bg-muted p-1 pe-2 transition-colors"
              >
                <img
                  src={profile.avatar}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
                />
                <div className="hidden sm:block text-start">
                  <p className="text-xs font-semibold leading-tight">
                    {lang === "ar" ? profile.fullNameAr : profile.fullNameEn}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {role === "bundle_creator" ? t("i_am_bundle_creator", lang) : t("i_am_hotel_owner", lang)}
                  </p>
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 mt-2 w-60 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img
                            src={profile.avatar}
                            alt="profile"
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {lang === "ar" ? profile.fullNameAr : profile.fullNameEn}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.55_0.12_175)]" />
                          <span className="text-[oklch(0.42_0.08_175)] font-medium">
                            {t("verified", lang)}
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            setView("profile" as any);
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-start"
                        >
                          <User className="h-4 w-4" />
                          {t("nav_profile", lang)}
                        </button>
                        <button
                          onClick={() => {
                            setView("settings" as any);
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-start"
                        >
                          <Settings className="h-4 w-4" />
                          {t("nav_settings", lang)}
                        </button>
                        <div className="h-px bg-border my-1.5" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-start"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("logout", lang)}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${currentView}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  navItems,
  currentView,
  setView,
  profile,
  role,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  isRtl,
  lang,
  theme,
  setLang,
  setTheme,
  onClose,
}: {
  navItems: NavItem[];
  currentView: string;
  setView: (v: any) => void;
  profile: any;
  role: Role;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  onLogout: () => void;
  isRtl: boolean;
  lang: "ar" | "en";
  theme: "light" | "dark";
  setLang: (l: "ar" | "en") => void;
  setTheme: (t: "light" | "dark") => void;
  onClose?: () => void;
}) {
  const roleSpecificItems = navItems.filter((n) => n.roleSpecific);
  const commonItems = navItems.filter((n) => !n.roleSpecific);

  return (
    <>
      {/* Logo header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-sidebar-border/80 flex-shrink-0">
        {sidebarOpen ? (
          <BrandLogo size="sm" />
        ) : (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-neutral-950 via-zinc-800 to-zinc-600 flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-1.5">
        {commonItems.map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={currentView === item.view}
            onClick={() => setView(item.view as any)}
            sidebarOpen={sidebarOpen}
            lang={lang}
          />
        ))}

        {roleSpecificItems.length > 0 && (
          <>
            <div className="pt-4 pb-1">
              {sidebarOpen && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-3 mb-1">
                  {role === "bundle_creator" ? (lang === "ar" ? "الباقات" : "Bundles") : (lang === "ar" ? "الفندق" : "Property")}
                </p>
              )}
              {roleSpecificItems.map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={currentView === item.view}
                  onClick={() => setView(item.view as any)}
                  sidebarOpen={sidebarOpen}
                  lang={lang}
                />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1.5 flex-shrink-0">
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          {sidebarOpen && <span>{t("language_toggle", lang)}</span>}
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
          {sidebarOpen && (
            <span>
              {theme === "dark"
                ? (lang === "ar" ? "الوضع الفاتح" : "Light Mode")
                : (lang === "ar" ? "الوضع الداكن" : "Dark Mode")}
            </span>
          )}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-destructive/10 hover:text-destructive transition-colors text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {sidebarOpen && <span>{t("logout", lang)}</span>}
        </button>
      </div>
    </>
  );
}

function NavButton({
  item,
  active,
  onClick,
  sidebarOpen,
  lang,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  sidebarOpen: boolean;
  lang: "ar" | "en";
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      title={!sidebarOpen ? t(item.labelKey, lang) : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative group",
        active
          ? "bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(15,23,42,0.6)]"
          : "text-sidebar-foreground hover:bg-sidebar-accent",
        !sidebarOpen && "justify-center"
      )}
    >
      <Icon className={cn("h-4.5 w-4.5 flex-shrink-0", !active && "text-muted-foreground group-hover:text-foreground")} style={{ width: "1.125rem", height: "1.125rem" }} />
      {sidebarOpen && <span className="font-medium">{t(item.labelKey, lang)}</span>}
      {!sidebarOpen && active && (
        <span className="absolute -end-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-s-full bg-primary" />
      )}
    </button>
  );
}
