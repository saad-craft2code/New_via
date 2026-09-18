"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard, StatusBadge, formatCurrency, PageHeader } from "@/components/widgets";
import { bundleService } from "@/services/bundle.service";
import { bookingService, adaptBooking, type UIBooking } from "@/services/booking.service";
import { reviewService, adaptReview, type UIReview } from "@/services/review.service";
import { notificationService, adaptNotification, type UINotification } from "@/services/notification.service";
import { useApi } from "@/hooks/use-api";
import { Gift, TrendingUp, Calendar, ClipboardList, Star, Plus, ChevronLeft, ChevronRight, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function BCDashboard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setBcView);
  const user = useAppStore((s) => s.user);
  const isRtl = lang === "ar";

  const { data: bundles } = useApi(() => bundleService.list(), []);
  const { data: bookings, loading: bookingsLoading } = useApi<UIBooking[]>(() => bookingService.list().then((r) => r.map(adaptBooking)), []);
  const { data: reviews } = useApi<UIReview[]>(() => reviewService.list().then((r) => r.map((rev) => adaptReview(rev))), []);
  const { data: notifications } = useApi<UINotification[]>(() => notificationService.list().then((r) => r.map(adaptNotification)), []);

  const allBundles = bundles ?? [];
  const allBookings = bookings ?? [];

  const totalRevenue = allBundles.reduce((sum, b) => sum + (b.status === "Published" ? (b as any).price ?? 0 : 0), 0);
  const publishedBundles = allBundles.filter((b: any) => b.status === "Published").length;
  const totalBookingsCount = allBookings.length;
  const pendingBookings = allBookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = allBookings.filter((b) => b.status === "Confirmed" || b.status === "Active" || b.status === "Completed").length;
  const avgRating = (reviews ?? []).length > 0 ? ((reviews ?? []).reduce((s, r) => s + r.rating, 0) / (reviews ?? []).length).toFixed(1) : "—";
  const unreadNotifs = (notifications ?? []).filter((n) => !n.read).length;

  const firstName = (user?.name ?? "").split(" ")[0] || (lang === "ar" ? "المستخدم" : "User");
  const recentBookings = allBookings.slice(0, 5);
  const upcomingBookings = allBookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").slice(0, 4);

  if (bookingsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={lang === "ar" ? "لوحة التحكم" : "Dashboard"} />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
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
              {lang === "ar" ? `لديك ${pendingBookings} حجز بانتظار التأكيد` : `You have ${pendingBookings} bookings pending confirmation`}
            </h2>
            <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
              {lang === "ar" ? "تابع أداء باقاتك وأدر حجوزاتك بكفاءة" : "Track your bundle performance and manage bookings efficiently"}
            </p>
          </div>
          <Button
            onClick={() => setView("bundle_wizard")}
            className="bg-white text-primary hover:bg-white/90 gap-2 flex-shrink-0"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            {t("create_new_bundle", lang)}
          </Button>
        </div>
      </motion.div>

      {/* Stats grid - live from API */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Gift} label={t("total_bundles", lang)} value={allBundles.length} color="primary" delay={0} />
        <StatCard icon={TrendingUp} label={t("active_bundles", lang)} value={publishedBundles} color="accent" delay={0.05} />
        <StatCard icon={ClipboardList} label={t("total_bookings", lang)} value={totalBookingsCount} color="clay" delay={0.1} />
        <StatCard icon={TrendingUp} label={t("total_revenue", lang)} value={formatCurrency(totalRevenue, lang)} color="sand" delay={0.15} />
        <StatCard icon={Star} label={t("avg_rating", lang)} value={avgRating} color="primary" delay={0.2} />
        <StatCard icon={Clock} label={t("pending_bookings", lang)} value={pendingBookings} color="accent" delay={0.25} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setView("bundle_wizard")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("create_new_bundle", lang)}
        </Button>
        <Button onClick={() => setView("bookings")} variant="outline" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          {t("view_recent_bookings", lang)}
        </Button>
        <Button onClick={() => setView("calendar")} variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {t("check_calendar", lang)}
        </Button>
        <Button onClick={() => setView("operations_dashboard")} variant="default" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          {lang === "ar" ? "لوحة العمليات" : "Ops Dashboard"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Upcoming tours */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("upcoming_tours", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-thin">
            {upcomingBookings.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا جولات قادمة" : "No upcoming tours"}</p>
            ) : (
              upcomingBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setView("bookings")}>
                  <img src={b.guestAvatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug break-words" dir="auto">
                      {b.itemName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                    </p>
                  </div>
                  <StatusBadge status={b.status} lang={lang} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent bookings table */}
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t("recent_bookings", lang)}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView("bookings")} className="text-primary gap-1">
              {t("view_all", lang)}
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-start text-xs text-muted-foreground">
                    <th className="text-start font-medium pb-2.5 ps-2">{t("booking_id", lang)}</th>
                    <th className="text-start font-medium pb-2.5">{t("guest_name", lang)}</th>
                    <th className="text-start font-medium pb-2.5 hidden md:table-cell">{t("bundle_name", lang)}</th>
                    <th className="text-start font-medium pb-2.5 hidden sm:table-cell">{t("dates", lang)}</th>
                    <th className="text-start font-medium pb-2.5">{t("total_amount", lang)}</th>
                    <th className="text-start font-medium pb-2.5">{t("status", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                        {lang === "ar" ? "لا حجوزات" : "No bookings"}
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="py-2.5 ps-2 text-sm font-mono">{b.id}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <img src={b.guestAvatar} alt="" className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                            <span className="text-sm font-medium leading-snug break-words" dir="auto">{b.guestName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-sm text-muted-foreground hidden md:table-cell leading-snug break-words" dir="auto">
                          {b.itemName}
                        </td>
                        <td className="py-2.5 text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                        </td>
                        <td className="py-2.5 text-sm font-semibold tabular-nums">{formatCurrency(b.totalAmount, lang)}</td>
                        <td className="py-2.5"><StatusBadge status={b.status} lang={lang} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending actions - live counts */}
      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("pending_actions", lang)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer" onClick={() => setView("bookings")}>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium leading-snug break-words">{lang === "ar" ? "حجوزات بانتظار التأكيد" : "Bookings awaiting confirmation"}</span>
            </div>
            <span className="text-sm font-bold text-muted-foreground tabular-nums">{pendingBookings}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer" onClick={() => setView("reviews")}>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium leading-snug break-words">{lang === "ar" ? "تقييمات بلا رد" : "Unreplied reviews"}</span>
            </div>
            <span className="text-sm font-bold text-muted-foreground tabular-nums">{(reviews ?? []).filter((r) => !r.replied).length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer" onClick={() => setView("bundles")}>
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium leading-snug break-words">{lang === "ar" ? "باقات كمسودة" : "Bundles in draft"}</span>
            </div>
            <span className="text-sm font-bold text-muted-foreground tabular-nums">{allBundles.filter((b: any) => b.status === "Draft").length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer" onClick={() => setView("notifications")}>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium leading-snug break-words">{lang === "ar" ? "إشعارات غير مقروءة" : "Unread notifications"}</span>
            </div>
            <span className="text-sm font-bold text-muted-foreground tabular-nums">{unreadNotifs}</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "حجوزات مؤكدة" : "Confirmed Bookings"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{confirmedBookings}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatCurrency(allBookings.reduce((s, b) => s + b.totalAmount, 0), lang)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "باقات منشورة" : "Published Bundles"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{publishedBundles}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? "متوسط التقييم" : "Avg Rating"}</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{avgRating}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
