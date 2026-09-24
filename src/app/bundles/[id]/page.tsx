"use client";
import { useState, use } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { bundles } from "@/lib/tripful-data";
import { t, formatPrice } from "@/lib/tripful-utils";
import { MapPin, Star, Check, Clock, Users, ArrowLeft, Calendar } from "lucide-react";

export default function BundleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, setLang } = useLang();
  const bundle = bundles.find((b) => b.id === id) ?? bundles[0];
  const [startDate, setStartDate] = useState("");
  const [numGuests, setNumGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const total = bundle.price * numGuests;

  const handleBook = () => {
    if (!guestName || !guestEmail) return;
    const p = new URLSearchParams({ type: "bundle", id: bundle.id, name: guestName, email: guestEmail, startDate, guests: String(numGuests), total: String(total) });
    window.location.href = `/booking-success?${p.toString()}`;
  };

  // Build itinerary
  const itinerary = Array.from({ length: bundle.durationDays }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} — ${bundle.destinations[i % bundle.destinations.length]}`,
    activities: ["Morning: City tour with expert guide", "Afternoon: Lunch at local restaurant", "Evening: Check-in at 4-star hotel"],
  }));

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <a href="/bundles" className="inline-flex items-center gap-1 text-#1A4D8F font-medium mb-4 hover:gap-2 transition-all"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {lang === "ar" ? "كل الباقات" : "All Bundles"}</a>

        {/* Hero */}
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
          <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-#2563EB rounded-md font-medium">{bundle.durationDays} {t(lang, "days")}</span>
              <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur rounded-md">{bundle.difficulty}</span>
              <div className="flex items-center gap-1 ml-auto bg-white/10 backdrop-blur px-2 py-1 rounded-md"><Star className="h-3.5 w-3.5 tf-star" /><span className="text-sm font-bold">{bundle.rating}</span></div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{bundle.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Quick info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-4"><Clock className="h-5 w-5 text-#1A4D8F mb-2" /><p className="text-xs text-slate-500">{t(lang, "duration")}</p><p className="font-bold">{bundle.durationDays} {t(lang, "days")}</p></div>
              <div className="bg-slate-50 rounded-xl p-4"><MapPin className="h-5 w-5 text-#1A4D8F mb-2" /><p className="text-xs text-slate-500">{t(lang, "destinations")}</p><p className="font-bold">{bundle.destinations.length}</p></div>
              <div className="bg-slate-50 rounded-xl p-4"><Users className="h-5 w-5 text-#1A4D8F mb-2" /><p className="text-xs text-slate-500">{t(lang, "group_size")}</p><p className="font-bold">{bundle.groupSize}</p></div>
              <div className="bg-slate-50 rounded-xl p-4"><Star className="h-5 w-5 text-#1A4D8F mb-2" /><p className="text-xs text-slate-500">{t(lang, "reviews")}</p><p className="font-bold">{bundle.reviewCount}</p></div>
            </div>

            {/* Description */}
            <h2 className="text-2xl font-bold mb-3">{lang === "ar" ? "نبذة" : "About this bundle"}</h2>
            <p className="text-slate-600 leading-relaxed mb-8">{bundle.description}</p>

            {/* Included */}
            <h2 className="text-2xl font-bold mb-3">{t(lang, "included")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {bundle.includedServices.map((s) => <div key={s} className="flex items-center gap-2 text-sm text-slate-700 bg-blue-50 px-3 py-2 rounded-lg"><Check className="h-4 w-4 text-#1A4D8F" />{s}</div>)}
            </div>

            {/* Itinerary */}
            <h2 className="text-2xl font-bold mb-4">{lang === "ar" ? "برنامج الرحلة" : "Itinerary"}</h2>
            <div className="space-y-3 mb-8">
              {itinerary.map((day) => (
                <div key={day.day} className="border-l-2 border-#2563EB pl-4 pb-4 relative">
                  <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-#2563EB text-white text-xs flex items-center justify-center font-bold">{day.day}</div>
                  <h3 className="font-bold text-lg mb-1">{day.title}</h3>
                  <ul className="space-y-1">{day.activities.map((a, i) => <li key={i} className="text-sm text-slate-600 flex items-center gap-2"><Check className="h-3.5 w-3.5 text-#1A4D8F" />{a}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">{t(lang, "book_now")}</h3>
              <div className="space-y-3">
                <div><label className="text-xs font-semibold text-slate-500 block mb-1">{lang === "ar" ? "تاريخ البدء" : "Start Date"}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-#2563EB" /></div>
                <div><label className="text-xs font-semibold text-slate-500 block mb-1">{t(lang, "guests")}</label><select value={numGuests} onChange={(e) => setNumGuests(Number(e.target.value))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-#2563EB">{[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-500">{formatPrice(bundle.price, lang)} × {numGuests}</span><span>{formatPrice(total, lang)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-100"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><span>{formatPrice(total, lang)}</span></div>
              </div>
              {showForm ? (
                <div className="mt-4 space-y-2">
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t(lang, "guest_name")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-#2563EB" />
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t(lang, "email")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-#2563EB" />
                  <button onClick={handleBook} disabled={!guestName || !guestEmail || !startDate} className="w-full bg-#1A4D8F text-white font-bold py-3 rounded-lg hover:bg-#2563EB transition-colors disabled:opacity-50">{t(lang, "confirm_booking")}</button>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} disabled={!startDate} className="w-full mt-4 bg-#1A4D8F text-white font-bold py-3 rounded-lg hover:bg-#2563EB transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{t(lang, "book_now")}</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
