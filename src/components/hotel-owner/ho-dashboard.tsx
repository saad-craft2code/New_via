"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard, StatusBadge, formatCurrency, PageHeader } from "@/components/widgets";
import { operationsService, type OperationsDashboard as OpsData } from "@/services/operations.service";
import { hotelService } from "@/services/hotel.service";
import { bookingService, adaptBooking, type UIBooking } from "@/services/booking.service";
import { useApi } from "@/hooks/use-api";
import { useAppStore as useStore } from "@/lib/store";
import { Hotel, BedDouble, TrendingUp, LogIn, LogOut, Plus, Calendar, ChevronLeft, ChevronRight, Clock, Bell, Wrench, Package, LayoutGrid, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function HODashboard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setHoView);
  const user = useAppStore((s) => s.user);
  const isRtl = lang === "ar";

  const { data: opsData, loading: opsLoading } = useApi<OpsData>(() => operationsService.dashboard(), []);
  const { data: bookings } = useApi<UIBooking[]>(() => bookingService.list().then((r) => r.map(adaptBooking)), []);

  const k = opsData?.kpi;
  const todayActivity = opsData?.todayActivity;

  const firstName = (user?.name ?? "").split(" ")[0] || (lang === "ar" ? "المستخدم" : "User");
  const todayCheckins = k?.arrivalsToday ?? 0;
  const todayCheckouts = k?.departuresToday ?? 0;
  const occupancy = k?.occupancyRate ?? 0;
  const openMaintenance = k?.openMaintenance ?? 0;
  const lowStock = k?.lowStockItems ?? 0;

  const recentBookings = (bookings ?? []).slice(0, 5);
  const pendingBookings = (bookings ?? []).filter((b) => b.status === "Pending").length;

  if (opsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={lang === "ar" ? "لوحة التحكم" : "Dashboard"} />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-gradient-to-br from-neutral-950 via-zinc-900 to-zinc-700 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 oasis-mesh opacity-30" />
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white/80 text-sm leading-relaxed">
              {t("welcome_back", lang)}, {firstName} 👋
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 leading-snug break-words">
              {lang === "ar" ? `${todayCheckins} وصولات و ${todayCheckouts} مغادرات اليوم` : `${todayCheckins} check-ins and ${todayCheckouts} check-outs today`}
            </h2>
            <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
              {lang === "ar" ? "إشغال فنادقك بمعدل" : "Your hotels are running at"} {occupancy}% {lang === "ar" ? "الإشغال" : "occupancy"}
            </p>
          </div>
          <Button
            onClick={() => setView("hotel_wizard")}
            className="bg-white text-primary hover:bg-white/90 gap-2 flex-shrink-0"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            {t("add_new_hotel", lang)}
          </Button>
        </div>
      </motion.div>

      {/* Stats grid - from live API */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Hotel} label={t("total_hotels", lang)} value={k?.totalHotels ?? 0} color="primary" delay={0} />
        <StatCard icon={BedDouble} label={t("total_rooms", lang)} value={k?.totalRooms ?? 0} color="accent" delay={0.05} />
        <StatCard icon={TrendingUp} label={t("occupancy_rate", lang)} value={`${occupancy}%`} color="clay" delay={0.1} />
        <StatCard icon={LogIn} label={t("today_checkins", lang)} value={todayCheckins} color="sand" delay={0.15} />
        <StatCard icon={LogOut} label={t("today_checkouts", lang)} value={todayCheckouts} color="primary" delay={0.2} />
        <StatCard icon={Clock} label={t("pending_bookings", lang)} value={pendingBookings} color="accent" delay={0.25} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setView("operations_dashboard")} variant="default" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          {lang === "ar" ? "لوحة العمليات" : "Ops Dashboard"}
        </Button>
        <Button onClick={() => setView("front_desk")} variant="outline" className="gap-2">
          <LogIn className="h-4 w-4" />
          {lang === "ar" ? "الاستقبال" : "Front Desk"}
        </Button>
        <Button onClick={() => setView("room_status")} variant="outline" className="gap-2">
          <BedDouble className="h-4 w-4" />
          {lang === "ar" ? "حالة الغرف" : "Room Status"}
        </Button>
        <Button onClick={() => setView("maintenance")} variant="outline" className="gap-2">
          <Wrench className="h-4 w-4" />
          {lang === "ar" ? "الصيانة" : "Maintenance"}
        </Button>
        <Button onClick={() => setView("inventory")} variant="outline" className="gap-2">
          <Package className="h-4 w-4" />
          {lang === "ar" ? "المخزون" : "Inventory"}
        </Button>
        <Button onClick={() => setView("hotel_wizard")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("add_new_hotel", lang)}
        </Button>
        <Button onClick={() => setView("calendar")} variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {t("update_availability", lang)}
        </Button>
      </div>

      {/* Today's Activity — from live API */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LogIn className="h-4 w-4 text-emerald-600" />
              {lang === "ar" ? "وصولات اليوم" : "Today's Arrivals"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {(todayActivity?.arrivals ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا وصولات اليوم" : "No arrivals today"}</p>
            ) : (
              todayActivity?.arrivals.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug break-words" dir="auto">{a.guestName}</p>
                    <p className="text-xs text-muted-foreground">{a.hotelName} • {a.roomNumber ?? "—"}</p>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0 ms-2">{a.numGuests} {lang === "ar" ? "ضيف" : "pax"}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LogOut className="h-4 w-4 text-orange-600" />
              {lang === "ar" ? "مغادرات اليوم" : "Today's Departures"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {(todayActivity?.departures ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا مغادرات اليوم" : "No departures today"}</p>
            ) : (
              todayActivity?.departures.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug break-words" dir="auto">{d.guestName}</p>
                    <p className="text-xs text-muted-foreground">{d.hotelName} • {d.roomNumber ?? "—"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ms-2">
                    {new Date(d.expectedCheckOut).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Open maintenance */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-red-600" />
              {lang === "ar" ? "صيانة مفتوحة" : "Open Maintenance"}
              <span className="text-xs text-muted-foreground">({openMaintenance})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {(todayActivity?.maintenance ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا طلبات صيانة" : "No maintenance issues"}</p>
            ) : (
              todayActivity?.maintenance.map((m) => (
                <div key={m.id} className="flex items-start justify-between p-2 rounded-lg bg-muted/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug break-words" dir="auto">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.location ?? "—"} • {m.assignedTo ?? (lang === "ar" ? "غير مسند" : "Unassigned")}</p>
                  </div>
                  <span className="text-xs capitalize flex-shrink-0 ms-2">{m.priority}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-600" />
              {lang === "ar" ? "تنبيهات المخزون" : "Low Stock Alerts"}
              <span className="text-xs text-muted-foreground">({lowStock})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {(todayActivity?.lowStock ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "المخزون بحالة جيدة" : "All stock healthy"}</p>
            ) : (
              todayActivity?.lowStock.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug break-words" dir="auto">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.quantity} / {s.minStock} {s.unit}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 flex-shrink-0 ms-2">{lang === "ar" ? "منخفض" : "LOW"}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings — from live API */}
      <Card className="border-border/70">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">{t("upcoming_bookings", lang)}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setView("bookings")} className="text-primary gap-1">
            {t("view_all", lang)}
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-start font-medium p-3">{t("booking_id", lang)}</th>
                  <th className="text-start font-medium p-3">{t("guest_name", lang)}</th>
                  <th className="text-start font-medium p-3 hidden md:table-cell">{t("room_type", lang)}</th>
                  <th className="text-start font-medium p-3 hidden lg:table-cell">{t("dates", lang)}</th>
                  <th className="text-start font-medium p-3">{t("status", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                      {lang === "ar" ? "لا حجوزات" : "No bookings"}
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => setView("bookings")}>
                      <td className="p-3 text-sm font-mono">{b.id}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={b.guestAvatar} alt="" className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                          <span className="text-sm font-medium leading-snug break-words" dir="auto">{lang === "ar" ? b.guestNameAr : b.guestName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm hidden md:table-cell leading-snug break-words" dir="auto">{b.itemName}</td>
                      <td className="p-3 text-sm hidden lg:table-cell">{new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</td>
                      <td className="p-3"><StatusBadge status={b.status} lang={lang} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* KPI summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "متوسط السعر اليومي" : "Avg Daily Rate (ADR)"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatCurrency(k?.adr ?? 0, lang)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "الإيراد لكل غرفة" : "RevPAR"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatCurrency(k?.revpar ?? 0, lang)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "نزلاء حاليون" : "Active Check-ins"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{k?.activeCheckIns ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "قيمة المخزون" : "Inventory Value"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatCurrency(k?.inventoryValue ?? 0, lang)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
