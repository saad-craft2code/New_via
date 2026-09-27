"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, PageHeader } from "@/components/widgets";
import { Gift, Plus, Calendar, ChevronLeft, ChevronRight, ClipboardList, Sparkles, ArrowRight, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { bundleService } from "@/services/bundle.service";
import { bookingService, type ServerBooking } from "@/services/booking.service";

interface BundleWithDays {
  id: string;
  title: string;
  description?: string;
  durationDays: number;
  destinations: string[];
  images: string[];
  price: number;
  difficulty?: string;
  status: string;
}

export function BCDashboard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setBcView);
  const user = useAppStore((s) => s.user);
  const isRtl = lang === "ar";

  const { data: bundles, loading: bundlesLoading } = useApi<BundleWithDays[]>(
    () => bundleService.list(),
    []
  );

  const { data: bookings } = useApi<ServerBooking[]>(
    () => bookingService.list(),
    []
  );

  const myBundles = bundles || [];
  const myBookings = bookings || [];
  const totalRevenue = myBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalBookings = myBookings.length;
  const pendingBookings = myBookings.filter((b) => b.status === "Pending").length;

  const firstName = user?.name?.split(" ")[0] || (lang === "ar" ? "المضيف" : "Host");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("welcome_back", lang)}, ${firstName} 👋`}
        subtitle={lang === "ar" ? "أنشئ باقات سفر وأدر حجوزاتك" : "Create travel bundles and manage bookings"}
      />

      {/* Empty state */}
      {myBundles.length === 0 && !bundlesLoading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {lang === "ar" ? "أنشئ باقتك الأولى" : "Create your first bundle"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                {lang === "ar"
                  ? "أنشئ باقة سفر شاملة وستظهر تلقائيًا على موقع Tripful للضيوف."
                  : "Create a complete travel bundle — it'll appear on Tripful for guests to book."}
              </p>
              <Button onClick={() => setView("bundle_wizard")} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                {lang === "ar" ? "إنشاء باقة" : "Create Bundle"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      {myBundles.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Gift} label={lang === "ar" ? "الباقات" : "Bundles"} value={myBundles.length} color="primary" delay={0} />
          <StatCard icon={Calendar} label={lang === "ar" ? "الحجوزات" : "Bookings"} value={totalBookings} color="accent" delay={0.05} />
          <StatCard icon={ClipboardList} label={t("pending_bookings", lang)} value={pendingBookings} color="clay" delay={0.1} />
          <StatCard icon={Sparkles} label={lang === "ar" ? "الإيرادات" : "Revenue"} value={totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : "—"} color="sand" delay={0.15} />
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setView("bundle_wizard")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {lang === "ar" ? "إنشاء باقة" : "Create Bundle"}
        </Button>
        <Button onClick={() => setView("bundles")} variant="outline" className="gap-2">
          <Gift className="h-4 w-4" />
          {lang === "ar" ? "باقاتي" : "My Bundles"}
        </Button>
        <Button onClick={() => setView("bookings")} variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {lang === "ar" ? "الحجوزات" : "Bookings"}
        </Button>
      </div>

      {/* Bookings */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">{t("upcoming_bookings", lang)}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setView("bookings")} className="text-primary gap-1">
            {t("view_all", lang)}
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {myBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {lang === "ar" ? "لا توجد حجوزات بعد. ستظهر هنا عندما يحجز الضيوف باقاتك." : "No bookings yet. They'll appear here when guests book your bundles."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="text-start font-medium p-3">{t("booking_id", lang)}</th>
                    <th className="text-start font-medium p-3">{lang === "ar" ? "الضيف" : "Guest"}</th>
                    <th className="text-start font-medium p-3 hidden md:table-cell">{lang === "ar" ? "الباقة" : "Bundle"}</th>
                    <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "التاريخ" : "Date"}</th>
                    <th className="text-start font-medium p-3">{t("status", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.slice(0, 5).map((b) => {
                    const meta = typeof b.metadata === "string" ? JSON.parse(b.metadata || "{}") : (b.metadata || {});
                    return (
                      <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => setView("bookings")}>
                        <td className="p-3 text-sm font-mono">{b.id}</td>
                        <td className="p-3 text-sm font-medium">{meta.guestName || "Guest"}</td>
                        <td className="p-3 text-sm hidden md:table-cell">{b.bundle?.title || "—"}</td>
                        <td className="p-3 text-sm hidden sm:table-cell">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            b.status === "Pending" ? "bg-amber-100 text-amber-700" :
                            b.status === "Cancelled" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundles grid */}
      {myBundles.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "باقاتي" : "My Bundles"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView("bundles")} className="text-primary gap-1">
              {t("view_all", lang)}
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBundles.slice(0, 6).map((b) => (
                <div key={b.id} className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setView("bundles")}>
                  <div className="h-32 bg-muted relative">
                    {b.images?.[0] ? (
                      <img src={b.images[0]} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Plane className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-primary">
                      {b.durationDays} {t("days", lang)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm truncate">{b.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{b.destinations?.join(", ") || "—"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-primary">{b.price > 0 ? `$${b.price}` : "—"}</span>
                      <ArrowRight className="h-3 w-3 text-primary rtl:rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
