"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatusBadge, StarRating, AreaChart, formatCurrency, PageHeader } from "@/components/widgets";
import { mockBundles, mockBookings, revenueData, mockProviderProfile } from "@/lib/mock-data";
import { Gift, TrendingUp, Calendar, ClipboardList, Star, Plus, ChevronLeft, ChevronRight, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function BCDashboard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setBcView);
  const profile = mockProviderProfile.bundle_creator;
  const isRtl = lang === "ar";

  const totalRevenue = mockBundles.reduce((sum, b) => sum + b.revenue, 0);
  const activeBundles = mockBundles.filter((b) => b.status === "published").length;
  const totalBookings = mockBundles.reduce((sum, b) => sum + b.totalBookings, 0);
  const avgRating = (mockBundles.filter(b => b.rating > 0).reduce((s, b) => s + b.rating, 0) / mockBundles.filter(b => b.rating > 0).length).toFixed(1);
  const pendingBookings = mockBookings.filter((b) => b.status === "Pending").length;

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
          <div>
            <p className="text-white/80 text-sm">
              {t("welcome_back", lang)}, {lang === "ar" ? profile.fullNameAr.split(" ")[0] : profile.fullNameEn.split(" ")[0]} 👋
            </p>
            <h2 className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {lang === "ar" ? "لديك 5 حجوزات جديدة هذا الأسبوع" : "You have 5 new bookings this week"}
            </h2>
            <p className="text-white/70 text-sm mt-1.5">
              {lang === "ar" ? "تابع أداء باقاتك وأدر حجوزاتك بكفاءة" : "Track your bundle performance and manage bookings efficiently"}
            </p>
          </div>
          <Button
            onClick={() => setView("bundle_wizard")}
            className="bg-white text-primary hover:bg-white/90 gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            {t("create_new_bundle", lang)}
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Gift} label={t("total_bundles", lang)} value={mockBundles.length} color="primary" trend="+2" trendUp delay={0} />
        <StatCard icon={TrendingUp} label={t("active_bundles", lang)} value={activeBundles} color="accent" trend="+1" trendUp delay={0.05} />
        <StatCard icon={ClipboardList} label={t("total_bookings", lang)} value={totalBookings} color="clay" trend="+12" trendUp delay={0.1} />
        <StatCard icon={TrendingUp} label={t("total_revenue", lang)} value={formatCurrency(totalRevenue, lang)} color="sand" trend="+18%" trendUp delay={0.15} />
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
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t("revenue_chart", lang)}</CardTitle>
            <span className="text-xs text-muted-foreground">{lang === "ar" ? "آخر 8 أشهر" : "Last 8 months"}</span>
          </CardHeader>
          <CardContent>
            <AreaChart data={revenueData.map((d) => ({ label: d.month, value: d.revenue }))} height={240} />
          </CardContent>
        </Card>

        {/* Upcoming tours */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("upcoming_tours", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-thin">
            {mockBookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setView("bookings")}>
                <img src={b.guestAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {lang === "ar" ? b.itemNameAr : b.itemName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                  </p>
                </div>
                <StatusBadge status={b.status} lang={lang} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings table */}
      <Card className="border-border/70">
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
                {mockBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="py-2.5 ps-2 text-sm font-mono">{b.id}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img src={b.guestAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <span className="text-sm font-medium">{lang === "ar" ? b.guestNameAr : b.guestName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-sm text-muted-foreground hidden md:table-cell">
                      {lang === "ar" ? b.itemNameAr : b.itemName}
                    </td>
                    <td className="py-2.5 text-sm text-muted-foreground hidden sm:table-cell">
                      {new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                    </td>
                    <td className="py-2.5 text-sm font-semibold">{formatCurrency(b.totalAmount, lang)}</td>
                    <td className="py-2.5"><StatusBadge status={b.status} lang={lang} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending actions */}
      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("pending_actions", lang)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { icon: ClipboardList, labelAr: "حاجة بانتظار التأكيد", labelEn: "Bookings awaiting confirmation", count: 2, color: "text-yellow-600" },
            { icon: Star, labelAr: "تقييمات بلا رد", labelEn: "Unreplied reviews", count: 3, color: "text-[oklch(0.5_0.13_30)]" },
            { icon: Gift, labelAr: "باقات كمسودة", labelEn: "Bundles in draft", count: 1, color: "text-[oklch(0.42_0.08_175)]" },
            { icon: Bell, labelAr: "إشعارات غير مقروءة", labelEn: "Unread notifications", count: 3, color: "text-destructive" },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <a.icon className={`h-5 w-5 ${a.color}`} />
                <span className="text-sm font-medium">{lang === "ar" ? a.labelAr : a.labelEn}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">{a.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Performance Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/70 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "أفضل الباقات الأداء" : "Top Performing Bundles"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBundles.slice(0, 3).map((b, i) => (
                <div key={b.id} className="p-3 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold">{lang === "ar" ? b.nameAr : b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.totalBookings} {lang === "ar" ? "حجوزات" : "bookings"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatCurrency(b.revenue, lang)}</p>
                      <div className="flex items-center gap-0.5 justify-end mt-0.5">
                        <Star className="h-3 w-3 fill-[oklch(0.75_0.14_80)] text-[oklch(0.75_0.14_80)]" />
                        <span className="text-xs font-medium">{b.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-primary to-primary/60 h-1.5 rounded-full" style={{ width: `${Math.min((b.totalBookings / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "نصائح التحسين" : "Optimization Tips"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs font-semibold text-primary mb-1">{lang === "ar" ? "💡 تحديث الصور" : "💡 Update Images"}</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "إضافة صور عالية الجودة تزيد الحجوزات بـ 35%" : "High-quality images increase bookings by 35%"}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">{lang === "ar" ? "📅 التسعير الديناميكي" : "📅 Dynamic Pricing"}</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "تطبيق أسعار مختلفة حسب الموسم" : "Adjust prices based on seasonal demand"}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs font-semibold text-green-600 mb-1">{lang === "ar" ? "🎯 الستخدام الكلمات المفتاحية" : "🎯 SEO Optimization"}</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "حسّن ظهورك في نتائج البحث" : "Improve your visibility in search results"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
