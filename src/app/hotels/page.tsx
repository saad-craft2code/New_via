"use client";
import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { hotels, cities, countries, allAmenities } from "@/lib/tripful-data";
import { t, formatPrice, cn } from "@/lib/tripful-utils";
import { Search, MapPin, Star, SlidersHorizontal, X, Check } from "lucide-react";

export default function HotelsPage() {
  const { lang, setLang } = useLang();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [country, setCountry] = useState("all");
  const [minStars, setMinStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const propertyTypes = [...new Set(hotels.map(h => h.propertyType))];

  const filtered = hotels.filter((h) => {
    if (city !== "all" && h.city !== city) return false;
    if (country !== "all" && h.country !== country) return false;
    if (minStars > 0 && h.starRating < minStars) return false;
    if (h.startingPrice > maxPrice) return false;
    if (propertyType !== "all" && h.propertyType !== propertyType) return false;
    if (selectedAmenities.length > 0 && !selectedAmenities.every(a => h.amenities.includes(a))) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.city.toLowerCase().includes(search.toLowerCase()) && !h.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_low") return a.startingPrice - b.startingPrice;
    if (sortBy === "price_high") return b.startingPrice - a.startingPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const toggleAmenity = (a: string) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const clearAll = () => { setSearch(""); setCity("all"); setCountry("all"); setMinStars(0); setMaxPrice(1000); setSelectedAmenities([]); setPropertyType("all"); };

  return (
    <div className="min-h-screen tf-font-body">
      <Navbar lang={lang} setLang={setLang} />

      <div className="bg-[#F8FAFC] py-4 mt-0 border-b border-[#E2E8F0]">
        <div className="tf-container flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] z-10" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(lang, "search_placeholder")} className="tf-input" style={{ paddingLeft: "44px" }} />
          </div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"><option value="all" className="text-[#0F172A]">{lang === "ar" ? "كل الدول" : "All Countries"}</option>{countries.map((c) => <option key={c} value={c} className="text-[#0F172A]">{c}</option>)}</select>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"><option value="all" className="text-[#0F172A]">{lang === "ar" ? "كل المدن" : "All Cities"}</option>{cities.map((c) => <option key={c} value={c} className="text-[#0F172A]">{c}</option>)}</select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"><option value="recommended" className="text-[#0F172A]">{t(lang, "sort_recommended")}</option><option value="price_low" className="text-[#0F172A]">{t(lang, "sort_price_low")}</option><option value="price_high" className="text-[#0F172A]">{t(lang, "sort_price_high")}</option><option value="rating" className="text-[#0F172A]">{t(lang, "sort_rating")}</option></select>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden px-4 py-2.5 rounded-xl text-sm tf-btn-primary flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> {t(lang, "filter_amenities")}</button>
        </div>
      </div>

      <div className="tf-container py-8">
        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className={cn("w-full lg:w-72 flex-shrink-0", showFilters ? "block fixed inset-0 z-40 bg-white p-6 overflow-y-auto lg:static lg:p-0" : "hidden lg:block")}>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg tf-font-display flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 tf-text-blue" /> {lang === "ar" ? "تصفية" : "Filters"}</h3>
                <button onClick={clearAll} className="text-xs tf-text-blue font-bold hover:underline">{t(lang, "clear_filters")}</button>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-700 mb-3 block tf-font-display">{t(lang, "filter_price")}</label>
                <input type="range" min="0" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#2563EB]" />
                <div className="flex justify-between text-xs text-[#64748B] mt-1"><span>$0</span><span className="font-bold tf-text-blue">Max: ${maxPrice}</span></div>
              </div>

              {/* Star rating */}
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-700 mb-3 block tf-font-display">{t(lang, "filter_stars")}</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 3, 4, 5, 7].map((s) => <button key={s} onClick={() => setMinStars(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", minStars === s ? "tf-bg-blue text-black" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]")}>{s === 0 ? (lang === "ar" ? "الكل" : "All") : `${s}+★`}</button>)}
                </div>
              </div>

              {/* Property type */}
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-700 mb-3 block tf-font-display">{t(lang, "filter_property")}</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"><option value="all">{lang === "ar" ? "الكل" : "All Types"}</option>{propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}</select>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block tf-font-display">{t(lang, "filter_amenities")}</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allAmenities.map((am) => {
                    const isSelected = selectedAmenities.includes(am.en);
                    return <button key={am.en} onClick={() => toggleAmenity(am.en)} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all", isSelected ? "tf-bg-blue text-black font-bold" : "bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]")}>
                      <div className={cn("h-4 w-4 rounded border flex items-center justify-center flex-shrink-0", isSelected ? "bg-black border-black" : "border-[#CBD5E1]")}>{isSelected && <Check className="h-3 w-3 text-[#2563EB]" />}</div>
                      {lang === "ar" ? am.ar : am.en}
                    </button>;
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <p className="text-[#64748B] mb-5"><span className="font-bold text-[#0F172A]">{sorted.length}</span> {t(lang, "results_found")}</p>
            <div className="space-y-4">
              {sorted.map((hotel) => (
                <a key={hotel.id} href={`/hotels/${hotel.id}`} className="tf-card rounded-2xl overflow-hidden flex flex-col sm:flex-row group">
                  <div className="sm:w-80 h-52 sm:h-auto flex-shrink-0 overflow-hidden relative">
                    <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg"><Star className="h-3.5 w-3.5 tf-star" /><span className="font-bold text-sm text-[#0F172A]">{hotel.rating}</span></div>
                    <div className="absolute top-3 right-3 tf-bg-blue text-black px-2.5 py-1 rounded-lg text-xs font-bold">{hotel.starRating} ★</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-bold tf-font-display text-[#0F172A] group-hover:tf-text-blue transition-colors">{lang === "ar" ? hotel.nameAr ?? hotel.name : hotel.name}</h3>
                          <p className="text-sm text-[#64748B] flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5 tf-text-blue" />{hotel.location}, {hotel.city}, {lang === "ar" ? hotel.countryAr : hotel.country}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-[#F1F5F9] rounded-md text-[#64748B] flex-shrink-0">{hotel.propertyType}</span>
                      </div>
                      <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed mb-3">{hotel.description}</p>
                      <div className="flex flex-wrap gap-1.5">{hotel.amenities.slice(0, 6).map((a, i) => <span key={i} className="text-xs px-2 py-0.5 bg-[#F8FAFC] rounded-md text-[#64748B] border border-[#F1F5F9]">{lang === "ar" ? hotel.amenitiesAr[i] : a}</span>)}</div>
                    </div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#F1F5F9]">
                      <div><span className="text-xs text-[#94A3B8]">{lang === "ar" ? "يبدأ من" : "From"}</span><p className="text-2xl font-black tf-font-display text-[#0F172A]">{formatPrice(hotel.startingPrice, lang)}<span className="text-xs font-normal text-[#94A3B8]">{t(lang, "per_night")}</span></p></div>
                      <span className="tf-btn-primary px-5 py-2.5 rounded-xl text-sm">{t(lang, "view_details")}</span>
                    </div>
                  </div>
                </a>
              ))}
              {sorted.length === 0 && <div className="text-center py-20"><p className="text-[#94A3B8] text-lg">{t(lang, "no_results")}</p><button onClick={clearAll} className="mt-4 tf-btn-dark px-6 py-2 rounded-xl text-sm">{t(lang, "clear_filters")}</button></div>}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
