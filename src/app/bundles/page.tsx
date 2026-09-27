"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBundles, type Bundle } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { Search, MapPin, Check, Plane } from "lucide-react";

export default function BundlesPage() {
  const { lang, setLang } = useLang();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBundles().then((data) => {
      if (!mounted) return;
      setBundles(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = bundles.filter((b) => {
    if (difficulty !== "all" && b.difficulty !== difficulty) return false;
    if (maxPrice && b.price > Number(maxPrice)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!b.title.toLowerCase().includes(q) && !b.destinations.join(" ").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="bg-[#1A4D8F] py-6 px-4 lg:px-8 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] z-10" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "ar" ? "ابحث عن باقة..." : "Search bundles..."} className="w-full pl-12 pr-3 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] text-[#0F172A]" /></div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] bg-white text-[#0F172A]"><option value="all">{lang === "ar" ? "كل المستويات" : "All Levels"}</option><option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Challenging">Challenging</option></select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] bg-white text-[#0F172A]"><option value="recommended">{lang === "ar" ? "موصى به" : "Recommended"}</option><option value="price_low">{lang === "ar" ? "الأقل سعرًا" : "Price: Low"}</option><option value="price_high">{lang === "ar" ? "الأعلى سعرًا" : "Price: High"}</option><option value="rating">{lang === "ar" ? "التقييم" : "Top Rated"}</option></select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <p className="text-[#64748B] mb-6">{loading ? (lang === "ar" ? "جاري التحميل..." : "Loading...") : `${sorted.length} ${t(lang, "bundles")} ${lang === "ar" ? "متاحة" : "available"}`}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="tf-skeleton h-96 rounded-2xl" />
          ))}
          {!loading && sorted.map((bundle) => {
            const cover = bundle.coverImage || bundle.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80";
            return (
            <a key={bundle.id} href={`/bundles/${bundle.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-[#E2E8F0]">
              <div className="relative h-56 overflow-hidden bg-[#F1F5F9]">
                <img src={cover} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-[#2563EB] rounded-md font-medium">{bundle.durationDays} {t(lang, "days")}</span>
                    <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur rounded-md">{bundle.difficulty}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight tf-font-display drop-shadow">{lang === "ar" ? bundle.titleAr ?? bundle.title : bundle.title}</h3>
                </div>
              </div>
              <div className="p-5">
                {bundle.destinations.length > 0 && (
                  <div className="flex items-center gap-3 text-sm text-[#64748B] mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{bundle.destinations.join(", ")}</span>
                  </div>
                )}
                {bundle.description && <p className="text-sm text-[#64748B] line-clamp-2 mb-3">{bundle.description}</p>}
                {bundle.includedServices.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">{bundle.includedServices.slice(0, 4).map((s, i) => <span key={i} className="tf-badge tf-badge-blue"><Check className="h-3 w-3" />{lang === "ar" ? bundle.includedServicesAr[i] : s}</span>)}</div>
                )}
                <div className="flex items-end justify-between pt-4 border-t border-[#E2E8F0]">
                  <div>
                    {bundle.price > 0 ? (
                      <>
                        <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                        <p className="text-2xl font-extrabold text-[#0F172A] tf-font-display">{formatPrice(bundle.price, lang)}</p>
                      </>
                    ) : (
                      <p className="text-sm text-[#64748B]">{lang === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
                    )}
                  </div>
                  <span className="tf-btn-primary">{t(lang, "book_now")}</span>
                </div>
              </div>
            </a>
            );
          })}
          {!loading && sorted.length === 0 && (
            <div className="col-span-full tf-empty">
              <div className="tf-empty-icon"><Plane className="h-8 w-8" /></div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">{lang === "ar" ? "لا باقات مطابقة" : "No bundles match your search"}</h3>
              <p className="text-[#64748B]">{lang === "ar" ? "جرّب تعديل الفلاتر" : "Try adjusting your filters"}</p>
            </div>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
