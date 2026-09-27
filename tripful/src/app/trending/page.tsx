"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getHotels, getBundles, type Hotel, type Bundle } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { TrendingUp, MapPin, Star, Flame, ArrowRight, Plane, Building2, Users } from "lucide-react";

interface TrendingPlace {
  id: string;
  type: "hotel" | "bundle";
  itemId: string;
  name: string;
  nameAr?: string;
  image: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  bookingsCount: number;
  trendScore: number;
  badge?: "hot" | "rising" | "popular";
}

export default function TrendingPage() {
  const { lang, setLang } = useLang();
  const [places, setPlaces] = useState<TrendingPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getHotels(), getBundles()]).then(([hotels, bundles]) => {
      if (!mounted) return;
      // Sort by rating * reviewCount = trend score
      const hotelPlaces: TrendingPlace[] = hotels.map((h, i) => {
        const bookings = Math.round(h.reviewCount * 0.025);
        const trend = h.rating * Math.log(h.reviewCount + 1);
        return {
          id: `trend-h-${h.id}`,
          type: "hotel",
          itemId: h.id,
          name: h.name,
          nameAr: h.nameAr,
          image: h.coverImage,
          city: h.city,
          country: h.country,
          rating: h.rating,
          reviewCount: h.reviewCount,
          startingPrice: h.startingPrice,
          bookingsCount: bookings,
          trendScore: trend,
          badge: i < 2 ? "hot" : i < 4 ? "rising" : "popular",
        };
      });
      const bundlePlaces: TrendingPlace[] = bundles.map((b, i) => {
        const bookings = b.totalBookings || Math.round(b.reviewCount * 0.04);
        const trend = b.rating * Math.log(b.reviewCount + 1);
        return {
          id: `trend-b-${b.id}`,
          type: "bundle",
          itemId: b.id,
          name: b.title,
          nameAr: b.titleAr,
          image: b.coverImage,
          city: b.destinations[0],
          country: b.destinations.join(", "),
          rating: b.rating,
          reviewCount: b.reviewCount,
          startingPrice: b.price,
          bookingsCount: bookings,
          trendScore: trend * 1.2, // bundles slightly weighted higher
          badge: i === 0 ? "hot" : "popular",
        };
      });
      const all = [...hotelPlaces, ...bundlePlaces].sort((a, b) => b.trendScore - a.trendScore);
      setPlaces(all);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const badgeText = (b?: "hot" | "rising" | "popular") => {
    if (!b) return null;
    if (b === "hot") return lang === "ar" ? "الأكثر رواجًا" : "🔥 Hot";
    if (b === "rising") return lang === "ar" ? "صاعد" : "📈 Rising";
    return lang === "ar" ? "شهير" : "Popular";
  };

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FEF3C7] mb-4">
            <TrendingUp className="h-4 w-4 text-[#92400E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#92400E]">{t(lang, "popular_now")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-2 tf-font-display">{t(lang, "trending_destinations")}</h1>
          <p className="text-[#64748B]">{t(lang, "trending_subtitle")}</p>
        </div>

        {/* Top 3 podium */}
        {!loading && places.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {places.slice(0, 3).map((p, idx) => (
              <a key={p.id} href={p.type === "hotel" ? `/hotels/${p.itemId}` : `/bundles/${p.itemId}`} className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-[#E2E8F0] ${idx === 0 ? "md:scale-105 md:-translate-y-2 ring-2 ring-[#F59E0B]" : ""}`}>
                <div className="relative h-72 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-extrabold text-white ${idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-600" : idx === 1 ? "bg-gradient-to-br from-slate-400 to-slate-600" : "bg-gradient-to-br from-amber-700 to-orange-900"}`}>
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="tf-trending-ribbon">{badgeText(p.badge)}</div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      {p.type === "hotel" ? <Building2 className="h-3.5 w-3.5" /> : <Plane className="h-3.5 w-3.5" />}
                      <span className="text-xs font-medium uppercase tracking-wider opacity-90">{p.type === "hotel" ? t(lang, "hotels") : t(lang, "bundles")}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight tf-font-display">{lang === "ar" ? p.nameAr ?? p.name : p.name}</h3>
                    <p className="text-xs flex items-center gap-1 mt-1 opacity-90"><MapPin className="h-3 w-3" /> {p.city}, {p.country}</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 tf-star" /><span className="font-bold text-[#0F172A]">{p.rating}</span><span className="text-[#94A3B8]">({p.reviewCount.toLocaleString()})</span></span>
                    <span className="flex items-center gap-1 text-xs text-[#92400E] font-semibold"><Flame className="h-3 w-3" /> {p.bookingsCount.toLocaleString()} {t(lang, "bookings_count")}</span>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-lg font-extrabold text-[#0F172A] tf-font-display">{formatPrice(p.startingPrice, lang)}</p>
                    </div>
                    <span className="tf-btn-primary text-xs" style={{ padding: "6px 12px" }}>{t(lang, "view_details")} <ArrowRight className="h-3 w-3 rtl:rotate-180" /></span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Remaining */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="tf-skeleton h-72 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.slice(3).map((p, idx) => (
              <a key={p.id} href={p.type === "hotel" ? `/hotels/${p.itemId}` : `/bundles/${p.itemId}`} className="tf-card group">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-[#1A4D8F] flex items-center gap-1">
                    {p.type === "hotel" ? <Building2 className="h-3 w-3" /> : <Plane className="h-3 w-3" />}
                    {p.type === "hotel" ? t(lang, "hotels") : t(lang, "bundles")}
                  </div>
                  <div className="absolute top-2 right-2 bg-[#0F172A]/80 backdrop-blur px-2 py-0.5 rounded-md text-xs font-bold text-white flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-400" /> #{idx + 4}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0F172A] mb-1 tf-font-display group-hover:text-[#1A4D8F] transition-colors">{lang === "ar" ? p.nameAr ?? p.name : p.name}</h3>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> {p.city}, {p.country}</p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 tf-star" /><span className="font-bold text-[#0F172A]">{p.rating}</span></span>
                    <span className="flex items-center gap-1 text-xs text-[#92400E] font-semibold"><Users className="h-3 w-3" /> {p.bookingsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-end justify-between pt-2 border-t border-[#E2E8F0]">
                    <div>
                      <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-lg font-extrabold text-[#0F172A] tf-font-display">{formatPrice(p.startingPrice, lang)}</p>
                    </div>
                    <span className="tf-badge tf-badge-blue">{t(lang, "view_details")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer lang={lang} />
    </div>
  );
}
