"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { t, formatPrice } from "@/lib/utils";
import { getBookings, cancelBooking, computeStats, type TripfulBooking } from "@/lib/bookings";
import { Calendar, Users, Ticket, MapPin, X, BedDouble, Plane, Clock } from "lucide-react";

export default function MyBookingsPage() {
  const { lang, setLang } = useLang();
  const [bookings, setBookings] = useState<TripfulBooking[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  useEffect(() => {
    setBookings(getBookings());
    setLoaded(true);
  }, []);

  const refresh = () => setBookings(getBookings());
  const stats = computeStats(bookings);

  const filtered = bookings.filter((b) => {
    const now = new Date();
    if (tab === "upcoming") return b.status === "confirmed" && new Date(b.checkIn) >= now;
    if (tab === "past") return b.status === "completed" || (b.status === "confirmed" && new Date(b.checkOut) < now);
    if (tab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const handleCancel = (id: string) => {
    if (lang === "ar") {
      if (confirm("هل أنت متأكد من إلغاء هذا الحجز؟")) {
        cancelBooking(id);
        refresh();
      }
    } else {
      if (confirm("Are you sure you want to cancel this booking?")) {
        cancelBooking(id);
        refresh();
      }
    }
  };

  const statusLabel = (s: TripfulBooking["status"]) => t(lang, s as any);

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-2 tf-font-display">{t(lang, "my_bookings")}</h1>
          <p className="text-[#64748B]">{lang === "ar" ? "تابع وأدر حجوزاتك في مكان واحد" : "Track and manage all your bookings in one place"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="tf-stat-card">
            <div className="tf-stat-value">{stats.total}</div>
            <div className="tf-stat-label">{t(lang, "total_bookings")}</div>
          </div>
          <div className="tf-stat-card">
            <div className="tf-stat-value">{stats.upcoming}</div>
            <div className="tf-stat-label">{t(lang, "upcoming_bookings")}</div>
          </div>
          <div className="tf-stat-card">
            <div className="tf-stat-value">{stats.past}</div>
            <div className="tf-stat-label">{t(lang, "past_bookings")}</div>
          </div>
          <div className="tf-stat-card">
            <div className="tf-stat-value">{formatPrice(stats.totalSpent, lang)}</div>
            <div className="tf-stat-label">{t(lang, "total_spent")}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#E2E8F0] overflow-x-auto">
          {(["upcoming", "past", "cancelled"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={cn("px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap", tab === tabKey ? "border-[#1A4D8F] text-[#1A4D8F]" : "border-transparent text-[#64748B] hover:text-[#0F172A]")}
            >
              {t(lang, `${tabKey}_bookings` as any)}
              <span className="ml-1.5 text-xs">
                ({tabKey === "upcoming" ? stats.upcoming : tabKey === "past" ? stats.past : stats.cancelled})
              </span>
            </button>
          ))}
        </div>

        {/* Booking list */}
        {loaded && filtered.length === 0 ? (
          <div className="tf-empty">
            <div className="tf-empty-icon"><Ticket className="h-8 w-8" /></div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{t(lang, "no_bookings_yet")}</h3>
            <p className="text-[#64748B] mb-6">{t(lang, "no_bookings_desc")}</p>
            <a href="/hotels" className="tf-btn-primary inline-flex">{t(lang, "browse_hotels")}</a>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden relative">
                    <img src={b.itemImage} alt={b.itemName} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      {b.type === "hotel" ? (
                        <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-[#1A4D8F] flex items-center gap-1"><BedDouble className="h-3 w-3" /> {t(lang, "hotels")}</span>
                      ) : (
                        <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-[#1A4D8F] flex items-center gap-1"><Plane className="h-3 w-3" /> {t(lang, "bundles")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#0F172A] tf-font-display">{lang === "ar" ? b.itemNameAr ?? b.itemName : b.itemName}</h3>
                        {b.city && <p className="text-sm text-[#64748B] flex items-center gap-1 mt-0.5"><MapPin className="h-3.5 w-3.5" />{b.city}{b.country && b.country !== b.city ? `, ${b.country}` : ""}</p>}
                      </div>
                      <span className={`tf-status tf-status-${b.status}`}>{statusLabel(b.status)}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#64748B]">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {b.checkIn} → {b.checkOut}</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {b.guests} {t(lang, "guests")}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {b.nights} {t(lang, "nights")}</span>
                    </div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                      <div>
                        <p className="text-xs text-[#64748B]">{t(lang, "booking_id")}</p>
                        <p className="font-mono text-xs font-semibold text-[#0F172A]">{b.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-extrabold text-[#1A4D8F] tf-font-display">{formatPrice(b.amount, lang)}</span>
                        {b.status === "confirmed" && tab === "upcoming" && (
                          <button onClick={() => handleCancel(b.id)} className="tf-btn-ghost text-[#991B1B] hover:bg-red-50">
                            <X className="h-4 w-4" /> {t(lang, "cancel_booking")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer lang={lang} />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
