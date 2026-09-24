"use client";
import { useState } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { hotels, cities } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";

export default function HotelsPage() {
  const { lang, setLang } = useLang();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [minStars, setMinStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const filtered = hotels.filter((h) => {
    if (city !== "all" && h.city !== city) return false;
    if (minStars > 0 && h.starRating < minStars) return false;
    if (maxPrice && h.startingPrice > Number(maxPrice)) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_low") return a.startingPrice - b.startingPrice;
    if (sortBy === "price_high") return b.startingPrice - a.startingPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="bg-teal-600 py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(lang, "search_placeholder")} className="w-full pl-9 pr-3 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-teal-300" /></div>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"><option value="all">{lang === "ar" ? "كل المدن" : "All Cities"}</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"><option value="recommended">{lang === "ar" ? "موصى به" : "Recommended"}</option><option value="price_low">{lang === "ar" ? "الأقل سعرًا" : "Price: Low"}</option><option value="price_high">{lang === "ar" ? "الأعلى سعرًا" : "Price: High"}</option><option value="rating">{lang === "ar" ? "التقييم" : "Top Rated"}</option></select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0"><div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> {lang === "ar" ? "تصفية" : "Filters"}</h3><div className="space-y-4"><div><label className="text-sm font-semibold text-slate-700 mb-2 block">{lang === "ar" ? "الحد الأقصى للسعر" : "Max Price"}</label><input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="$500" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div><div><label className="text-sm font-semibold text-slate-700 mb-2 block">{lang === "ar" ? "النجوم" : "Stars"}</label><div className="flex gap-2">{[0, 3, 4, 5].map((s) => <button key={s} onClick={() => setMinStars(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${minStars === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{s === 0 ? (lang === "ar" ? "الكل" : "All") : `${s}+★`}</button>)}</div></div></div></div></aside>
          <div className="flex-1">
            <p className="text-slate-500 mb-4">{sorted.length} {t(lang, "hotels")} {lang === "ar" ? "متاحة" : "available"}</p>
            <div className="space-y-4">
              {sorted.map((hotel) => (
                <a key={hotel.id} href={`/hotels/${hotel.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 flex flex-col sm:flex-row">
                  <div className="sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden"><img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div><div className="flex items-start justify-between gap-2 mb-2"><div><h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{hotel.name}</h3><p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{hotel.location}, {hotel.city}</p></div><div className="flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-lg"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-bold text-sm">{hotel.rating}</span></div></div><div className="flex flex-wrap gap-1.5 mt-3">{hotel.amenities.slice(0, 5).map((a) => <span key={a} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{a}</span>)}</div></div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100"><div><span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span><p className="text-2xl font-extrabold text-slate-900">{formatPrice(hotel.startingPrice, lang)}<span className="text-xs font-normal text-slate-400">{t(lang, "per_night")}</span></p></div><span className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold">{t(lang, "view_details")}</span></div>
                  </div>
                </a>
              ))}
              {sorted.length === 0 && <p className="text-center text-slate-400 py-20">{lang === "ar" ? "لا فنادق مطابقة" : "No hotels match your search"}</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
