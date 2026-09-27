"use client";
import { useState, useEffect, use } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBundle, type Bundle } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { addBooking } from "@/lib/bookings";
import { MapPin, Star, Check, Clock, Users, ArrowLeft, Sparkles, Plane } from "lucide-react";

export default function BundleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, setLang } = useLang();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [numGuests, setNumGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBundle(id).then((data) => {
      if (!mounted) return;
      setBundle(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  const total = (bundle?.price ?? 0) * numGuests;

  const handleBook = async () => {
    if (!bundle) return;
    setSubmitting(true);
    try {
      const start = startDate || new Date().toISOString().slice(0, 10);
      const end = new Date(new Date(start).getTime() + bundle.durationDays * 86400000).toISOString().slice(0, 10);
      const booking = addBooking({
        type: "bundle",
        itemId: bundle.id,
        itemName: bundle.title,
        itemNameAr: bundle.titleAr,
        itemImage: bundle.coverImage,
        city: bundle.destinations[0],
        country: bundle.destinations.join(", "),
        checkIn: start,
        checkOut: end,
        guests: numGuests,
        rooms: 1,
        nights: bundle.durationDays,
        amount: total,
        currency: "$",
        guestName: guestName || "Guest User",
        guestEmail: guestEmail || "guest@tripful.com",
        guestPhone: guestPhone || "",
        specialRequests: specialRequests || undefined,
      });
      await new Promise((r) => setTimeout(r, 400));
      const p = new URLSearchParams({ type: "bundle", bookingId: booking.id, id: bundle.id, name: booking.guestName, email: booking.guestEmail });
      window.location.href = `/booking-success?${p.toString()}`;
    } catch (e) {
      console.warn("Bundle booking save failed, proceeding anyway:", e);
      const p = new URLSearchParams({ type: "bundle", id: bundle.id, name: guestName || "Guest", email: guestEmail });
      window.location.href = `/booking-success?${p.toString()}`;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar lang={lang} setLang={setLang} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
          <div className="tf-skeleton h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="tf-skeleton h-32" />
              <div className="tf-skeleton h-32" />
            </div>
            <div className="tf-skeleton h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen">
        <Navbar lang={lang} setLang={setLang} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-32 pb-12 text-center">
          <div className="tf-empty">
            <div className="tf-empty-icon"><Plane className="h-8 w-8" /></div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">{lang === "ar" ? "الباقة غير موجودة" : "Bundle Not Found"}</h2>
            <a href="/bundles" className="tf-btn-primary inline-flex mt-4">{lang === "ar" ? "تصفح الباقات" : "Browse Bundles"} <ArrowLeft className="h-4 w-4 rtl:rotate-180" /></a>
          </div>
        </div>
        <Footer lang={lang} />
      </div>
    );
  }

  const itinerary = Array.from({ length: bundle.durationDays }, (_, i) => ({
    day: i + 1,
    title: `${lang === "ar" ? "اليوم" : "Day"} ${i + 1} — ${bundle.destinations[i % bundle.destinations.length]}`,
    activities: [
      lang === "ar" ? "صباحًا: جولة المدينة مع مرشد خبير" : "Morning: City tour with expert guide",
      lang === "ar" ? "بعد الظهر: غداء في مطعم محلي" : "Afternoon: Lunch at local restaurant",
      lang === "ar" ? "مساءً: تسجيل الوصول للفندق" : "Evening: Check-in at hotel",
    ],
  }));

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <a href="/bundles" className="inline-flex items-center gap-1 text-[#1A4D8F] font-medium mb-4 hover:gap-2 transition-all"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {lang === "ar" ? "كل الباقات" : "All Bundles"}</a>

        {/* Hero */}
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
          <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-[#2563EB] rounded-md font-medium">{bundle.durationDays} {t(lang, "days")}</span>
              <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur rounded-md">{bundle.difficulty}</span>
              <div className="flex items-center gap-1 ml-auto bg-white/10 backdrop-blur px-2 py-1 rounded-md"><Star className="h-3.5 w-3.5 tf-star" /><span className="text-sm font-bold">{bundle.rating}</span></div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tf-font-display">{lang === "ar" ? bundle.titleAr ?? bundle.title : bundle.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#F8FAFC] rounded-xl p-4"><Clock className="h-5 w-5 text-[#1A4D8F] mb-2" /><p className="text-xs text-[#64748B]">{t(lang, "duration")}</p><p className="font-bold text-[#0F172A]">{bundle.durationDays} {t(lang, "days")}</p></div>
              <div className="bg-[#F8FAFC] rounded-xl p-4"><MapPin className="h-5 w-5 text-[#1A4D8F] mb-2" /><p className="text-xs text-[#64748B]">{t(lang, "destinations")}</p><p className="font-bold text-[#0F172A]">{bundle.destinations.length}</p></div>
              <div className="bg-[#F8FAFC] rounded-xl p-4"><Users className="h-5 w-5 text-[#1A4D8F] mb-2" /><p className="text-xs text-[#64748B]">{t(lang, "group_size")}</p><p className="font-bold text-[#0F172A]">{bundle.groupSize}</p></div>
              <div className="bg-[#F8FAFC] rounded-xl p-4"><Star className="h-5 w-5 text-[#1A4D8F] mb-2" /><p className="text-xs text-[#64748B]">{t(lang, "reviews")}</p><p className="font-bold text-[#0F172A]">{bundle.reviewCount}</p></div>
            </div>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-3 tf-font-display">{lang === "ar" ? "نبذة" : "About this bundle"}</h2>
            <p className="text-[#334155] leading-relaxed mb-8">{bundle.description}</p>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-3 tf-font-display">{t(lang, "included")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {bundle.includedServices.map((s, i) => <div key={i} className="flex items-center gap-2 text-sm text-[#334155] bg-[#EFF6FF] px-3 py-2 rounded-lg"><Check className="h-4 w-4 text-[#1A4D8F]" />{lang === "ar" ? bundle.includedServicesAr[i] : s}</div>)}
            </div>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 tf-font-display">{lang === "ar" ? "برنامج الرحلة" : "Itinerary"}</h2>
            <div className="space-y-3 mb-8">
              {itinerary.map((day) => (
                <div key={day.day} className="border-s-2 border-[#2563EB] ps-4 pb-4 relative">
                  <div className="absolute -start-2.5 top-0 h-5 w-5 rounded-full bg-[#2563EB] text-white text-xs flex items-center justify-center font-bold">{day.day}</div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-1">{day.title}</h3>
                  <ul className="space-y-1">{day.activities.map((a, i) => <li key={i} className="text-sm text-[#64748B] flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#1A4D8F]" />{a}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 tf-font-display">{t(lang, "book_now")}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{lang === "ar" ? "تاريخ البدء" : "Start Date"}</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "guests")}</label>
                  <select value={numGuests} onChange={(e) => setNumGuests(Number(e.target.value))} className="tf-input">{[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}</select>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex justify-between text-sm mb-2"><span className="text-[#64748B]">{formatPrice(bundle.price, lang)} × {numGuests}</span><span className="font-semibold text-[#0F172A]">{formatPrice(total, lang)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#E2E8F0]"><span className="text-[#0F172A]">{lang === "ar" ? "الإجمالي" : "Total"}</span><span className="text-[#1A4D8F] tf-font-display">{formatPrice(total, lang)}</span></div>
              </div>
              {showForm ? (
                <div className="mt-4 space-y-2">
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t(lang, "guest_name")} className="tf-input" />
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t(lang, "email")} className="tf-input" />
                  <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder={t(lang, "phone")} className="tf-input" />
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={t(lang, "special_requests")} rows={2} className="tf-input resize-none" />
                  <button onClick={handleBook} disabled={submitting} className="tf-btn-primary w-full">
                    {submitting ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {lang === "ar" ? "جاري الحجز..." : "Booking..."}</>) : (<><Sparkles className="h-4 w-4" /> {t(lang, "confirm_booking")}</>)}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} disabled={!startDate} className="tf-btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">{t(lang, "book_now")}</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
