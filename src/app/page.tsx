"use client";

import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { hotels, bundles, cities } from "@/lib/tripful-data";
import { cn, t, formatPrice } from "@/lib/tripful-utils";
import { Search, MapPin, Star, ArrowRight, Check } from "lucide-react";

export default function Home() {
  const { lang, setLang } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    window.location.href = `/hotels?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 pt-32 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            {t(lang, "tagline")}
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {lang === "ar" ? "اكتشف أفضل الفنادق وباقات السفر بأسعار لا تُقارن. احجز بثقة مع تأكيد فوري." : "Discover the best hotels and travel bundles at unbeatable prices. Book with confidence — instant confirmation."}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">{t(lang, "search_placeholder")}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={lang === "ar" ? "دبي، الرياض..." : "Dubai, Riyadh..."} className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">{t(lang, "check_in")}</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">{t(lang, "check_out")}</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">{t(lang, "guests")}</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5+</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button onClick={handleSearch} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" /> {t(lang, "search_btn")}
                </button>
              </div>
            </div>
          </div>

          {/* Popular cities */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {cities.map((city) => (
              <button key={city} onClick={() => setSearchQuery(city)} className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/20 transition-colors border border-white/20">{city}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t(lang, "featured_hotels")}</h2>
            <p className="text-slate-500 mt-2">{lang === "ar" ? "أفضل الفنادق المختارة لك" : "Handpicked hotels for your perfect stay"}</p>
          </div>
          <a href="/hotels" className="text-teal-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">{t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <a key={hotel.id} href={`/hotels/${hotel.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100">
              <div className="relative h-56 overflow-hidden">
                <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="text-sm font-bold">{hotel.rating}</span></div>
                <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-lg text-xs font-bold">{hotel.starRating} ★</div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{hotel.name}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" /> {hotel.location}, {hotel.city}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{hotel.amenities.slice(0, 3).map((a) => <span key={a} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{a}</span>)}</div>
                <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                  <div><span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span><p className="text-2xl font-extrabold text-slate-900">{formatPrice(hotel.startingPrice, lang)}</p><span className="text-xs text-slate-400">{t(lang, "per_night")}</span></div>
                  <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-bold">{t(lang, "view_details")}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Bundles */}
      <section className="py-20 px-4 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t(lang, "featured_bundles")}</h2>
              <p className="text-slate-500 mt-2">{lang === "ar" ? "باقات سفر شاملة بأسعار مميزة" : "All-inclusive travel packages at great prices"}</p>
            </div>
            <a href="/bundles" className="text-teal-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">{t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <a key={bundle.id} href={`/bundles/${bundle.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100">
                <div className="relative h-56 overflow-hidden">
                  <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 bg-teal-500 rounded-md font-medium">{bundle.durationDays} {t(lang, "days")}</span><span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur rounded-md">{bundle.difficulty}</span></div>
                    <h3 className="text-xl font-bold leading-tight">{bundle.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{bundle.destinations.join(", ")}</span></div>
                  <div className="flex flex-wrap gap-1.5 mb-4">{bundle.includedServices.slice(0, 4).map((s) => <span key={s} className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded-md flex items-center gap-1"><Check className="h-3 w-3" />{s}</span>)}</div>
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    <div><span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span><p className="text-2xl font-extrabold text-slate-900">{formatPrice(bundle.price, lang)}</p><span className="text-xs text-slate-400">{t(lang, "per_person")}</span></div>
                    <span className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold">{t(lang, "book_now")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
