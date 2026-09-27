"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, PageHeader } from "@/components/widgets";
import { Hotel, BedDouble, Plus, Calendar, ChevronLeft, ChevronRight, ClipboardList, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { hotelService } from "@/services/hotel.service";
import { bookingService, type ServerBooking } from "@/services/booking.service";

interface HotelWithRooms {
  id: string;
  name: string;
  description?: string;
  starRating: number;
  location?: string;
  city?: string;
  amenities: string[];
  images: string[];
  rooms?: any[];
}

export function HODashboard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setHoView);
  const user = useAppStore((s) => s.user);
  const isRtl = lang === "ar";

  // Fetch hotels owned by this user
  const { data: hotels, loading: hotelsLoading } = useApi<HotelWithRooms[]>(
    () => hotelService.list(),
    []
  );

  // Fetch bookings
  const { data: bookings } = useApi<ServerBooking[]>(
    () => bookingService.list(),
    []
  );

  const myHotels = hotels || [];
  const myBookings = bookings || [];
  const totalRooms = myHotels.reduce((s, h) => s + (h.rooms?.length || 0), 0);
  const totalBookings = myBookings.length;
  const pendingBookings = myBookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = myBookings.filter((b) => b.status === "Confirmed").length;
  const totalRevenue = myBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

  const firstName = user?.name?.split(" ")[0] || (lang === "ar" ? "المضيف" : "Host");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("welcome_back", lang)}, ${firstName} 👋`}
        subtitle={lang === "ar" ? "إدارة فنادقك وحجوزاتك في مكان واحد" : "Manage your hotels and bookings in one place"}
      />

      {/* Empty state — guide new users */}
      {myHotels.length === 0 && !hotelsLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Hotel className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {lang === "ar" ? "ابدأ بإضافة فندقك الأول" : "Add your first hotel"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                {lang === "ar"
                  ? "أضف فندقك وغرفه وستظهر تلقائيًا على موقع Tripful للضيوف."
                  : "Add your hotel and rooms — they'll automatically appear on Tripful for guests to book."}
              </p>
              <Button onClick={() => setView("hotel_wizard")} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("add_new_hotel", lang)}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats grid — only show if there's data */}
      {myHotels.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Hotel} label={t("total_hotels", lang)} value={myHotels.length} color="primary" delay={0} />
          <StatCard icon={BedDouble} label={t("total_rooms", lang)} value={totalRooms} color="accent" delay={0.05} />
          <StatCard icon={ClipboardList} label={t("pending_bookings", lang)} value={pendingBookings} color="clay" delay={0.1} />
          <StatCard icon={Sparkles} label={lang === "ar" ? "إجمالي الحجوزات" : "Total Bookings"} value={totalBookings} color="sand" delay={0.15} />
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setView("hotel_wizard")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("add_new_hotel", lang)}
        </Button>
        <Button onClick={() => setView("rooms")} variant="outline" className="gap-2">
          <BedDouble className="h-4 w-4" />
          {t("add_room_type", lang)}
        </Button>
        <Button onClick={() => setView("bookings")} variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {lang === "ar" ? "الحجوزات" : "Bookings"}
        </Button>
      </div>

      {/* Upcoming bookings */}
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
                {lang === "ar" ? "لا توجد حجوزات بعد. ستظهر هنا عندما يحجز الضيوف فنادقك." : "No bookings yet. They'll appear here when guests book your hotels."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="text-start font-medium p-3">{t("booking_id", lang)}</th>
                    <th className="text-start font-medium p-3">{lang === "ar" ? "الضيف" : "Guest"}</th>
                    <th className="text-start font-medium p-3 hidden md:table-cell">{lang === "ar" ? "الفندق" : "Hotel"}</th>
                    <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "الوصول" : "Check-in"}</th>
                    <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "المغادرة" : "Check-out"}</th>
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
                        <td className="p-3 text-sm hidden md:table-cell">{b.hotel?.name || "—"}</td>
                        <td className="p-3 text-sm hidden sm:table-cell">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}</td>
                        <td className="p-3 text-sm hidden sm:table-cell">{b.endDate ? new Date(b.endDate).toLocaleDateString() : "—"}</td>
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

      {/* Hotels list — overview cards */}
      {myHotels.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "فنادقي" : "My Hotels"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView("hotels")} className="text-primary gap-1">
              {t("view_all", lang)}
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myHotels.slice(0, 6).map((h) => (
                <div key={h.id} className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setView("hotels")}>
                  <div className="h-32 bg-muted relative">
                    {h.images?.[0] ? (
                      <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Hotel className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-primary">
                      {h.starRating} ★
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm truncate">{h.name}</h4>
                    <p className="text-xs text-muted-foreground">{h.city || h.location || "—"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{h.rooms?.length || 0} {t("rooms", lang)}</span>
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
