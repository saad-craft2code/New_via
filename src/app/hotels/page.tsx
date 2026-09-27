"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getHotels, cities, type Hotel } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { Search, MapPin, Star, SlidersHorizontal, Building2 } from "lucide-react";

export default function HotelsPage() {
  const { lang, setLang } = useLang();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [minStars, setMinStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // ?q= supports the AI planner + navbar search
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    if (q) setSearch(q);
    getHotels().then((data) => {
      if (!mounted) return;
      setHotels(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = hotels.filter((h) => {
    if (city !== "all" && h.city !== city) return false;
    if (minStars > 0 && h.starRating < minStars) return false;
    if (maxPrice && h.startingPrice > Number(maxPrice)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!h.name.toLowerCase().includes(q) && !h.city.toLowerCase().includes(q) && !h.country.toLowerCase().includes(q) && !h.amenities.join(" ").toLowerCase().includes(q)) return false;
    }
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
      <div className="bg-[#1A4D8F] py-6 px-4 lg:px-8 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] z-10" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(lang, "search_placeholder")} className="w-full pl-12 pr-3 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] text-[#0F172A]" /></div>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] bg-white text-[#0F172A]"><option value="all">{lang === "ar" ? "كل المدن" : "All Cities"}</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] bg-white text-[#0F172A]"><option value="recommended">{lang === "ar" ? "موصى به" : "Recommended"}</option><option value="price_low">{lang === "ar" ? "الأقل سعرًا" : "Price: Low"}</option><option value="price_high">{lang === "ar" ? "الأعلى سعرًا" : "Price: High"}</option><option value="rating">{lang === "ar" ? "التقييم" : "Top Rated"}</option></select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#0F172A]"><SlidersHorizontal className="h-5 w-5 text-[#1A4D8F]" /> {lang === "ar" ? "تصفية" : "Filters"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#334155] mb-2 block">{lang === "ar" ? "الحد الأقصى للسعر" : "Max Price"}</label>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="$500" className="tf-input" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#334155] mb-2 block">{lang === "ar" ? "النجوم" : "Stars"}</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 4, 5].map((s) => <button key={s} onClick={() => setMinStars(s)} className={`tf-filter-chip`} data-active={minStars === s}>{s === 0 ? (lang === "ar" ? "الكل" : "All") : `${s}+★`}</button>)}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <p className="text-[#64748B] mb-4">{loading ? (lang === "ar" ? "جاري التحميل..." : "Loading...") : `${sorted.length} ${t(lang, "hotels")} ${lang === "ar" ? "متاحة" : "available"}`}</p>
            <div className="space-y-4">
              {loading && [1, 2, 3].map((i) => (
                <div key={i} className="tf-skeleton h-48 rounded-2xl" />
              ))}
              {!loading && sorted.map((hotel) => {
                const coverImg = hotel.coverImage || hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
                return (
                <a key={hotel.id} href={`/hotels/${hotel.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-[#E2E8F0] flex flex-col sm:flex-row">
                  <div className="sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden relative bg-[#F1F5F9]">
                    <img src={coverImg} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"; }} />
                    <div className="absolute top-3 left-3 bg-[#1A4D8F] text-white px-2 py-1 rounded-md text-xs font-bold">{hotel.starRating} ★</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#1A4D8F] transition-colors tf-font-display">{lang === "ar" ? hotel.nameAr ?? hotel.name : hotel.name}</h3>
                          <p className="text-sm text-[#64748B] flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{hotel.location ? `${hotel.location}, ` : ""}{hotel.city}{hotel.country ? `, ${hotel.country}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-[#EFF6FF] px-2 py-1 rounded-lg"><Star className="h-4 w-4 tf-star" /><span className="font-bold text-sm text-[#0F172A]">{hotel.rating || "New"}</span></div>
                      </div>
                      {hotel.description && <p className="text-sm text-[#64748B] line-clamp-2 mb-3">{hotel.description}</p>}
                      {hotel.amenities.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{hotel.amenities.slice(0, 5).map((a, i) => <span key={i} className="tf-badge tf-badge-gray">{lang === "ar" ? hotel.amenitiesAr[i] : a}</span>)}</div>}
                    </div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                      <div>
                        {hotel.startingPrice > 0 ? (
                          <>
                            <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                            <p className="text-2xl font-extrabold text-[#0F172A] tf-font-display">{formatPrice(hotel.startingPrice, lang)}<span className="text-xs font-normal text-[#64748B]">{t(lang, "per_night")}</span></p>
                          </>
                        ) : (
                          <p className="text-sm text-[#64748B]">{lang === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
                        )}
                      </div>
                      <span className="tf-btn-primary">{t(lang, "view_details")}</span>
                    </div>
                  </div>
                </a>
                );
              })}
              {!loading && sorted.length === 0 && (
                <div className="tf-empty">
                  <div className="tf-empty-icon"><Building2 className="h-8 w-8" /></div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{lang === "ar" ? "لا فنادق مطابقة" : "No hotels match your search"}</h3>
                  <p className="text-[#64748B]">{lang === "ar" ? "جرّب تعديل الفلاتر" : "Try adjusting your filters"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
