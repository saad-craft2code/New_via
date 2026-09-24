"use client";
import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { bundles } from "@/lib/tripful-data";
import { t, formatPrice, cn } from "@/lib/tripful-utils";
import { Search, MapPin, Star, Check, Clock, Users, ArrowLeft } from "lucide-react";

export default function BundlesPage() {
  const { lang, setLang } = useLang();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const filtered = bundles.filter((b) => {
    if (difficulty !== "all" && b.difficulty !== difficulty) return false;
    if (maxPrice && b.price > Number(maxPrice)) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.destinations.join(" ").toLowerCase().includes(search.toLowerCase())) return false;
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
      <div className="bg-#1A4D8F py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "ar" ? "ابحث عن باقة..." : "Search bundles..."} className="w-full pl-9 pr-3 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-#93C5FD" /></div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-#93C5FD bg-white"><option value="all">{lang === "ar" ? "كل المستويات" : "All Levels"}</option><option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Challenging">Challenging</option></select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-#93C5FD bg-white"><option value="recommended">{lang === "ar" ? "موصى به" : "Recommended"}</option><option value="price_low">{lang === "ar" ? "الأقل سعرًا" : "Price: Low"}</option><option value="price_high">{lang === "ar" ? "الأعلى سعرًا" : "Price: High"}</option><option value="rating">{lang === "ar" ? "التقييم" : "Top Rated"}</option></select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <p className="text-slate-500 mb-6">{sorted.length} {t(lang, "bundles")} {lang === "ar" ? "متاحة" : "available"}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((bundle) => (
            <a key={bundle.id} href={`/bundles/${bundle.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100">
              <div className="relative h-56 overflow-hidden"><img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-3 left-3 right-3 text-white"><div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 bg-#2563EB rounded-md font-medium">{bundle.durationDays} {t(lang, "days")}</span><span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur rounded-md">{bundle.difficulty}</span></div><h3 className="text-xl font-bold leading-tight">{bundle.title}</h3></div></div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{bundle.destinations.join(", ")}</span></div>
                <div className="flex flex-wrap gap-1.5 mb-4">{bundle.includedServices.slice(0, 4).map((s) => <span key={s} className="text-xs px-2 py-1 bg-blue-50 text-#2563EB rounded-md flex items-center gap-1"><Check className="h-3 w-3" />{s}</span>)}</div>
                <div className="flex items-end justify-between pt-4 border-t border-slate-100"><div><span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span><p className="text-2xl font-extrabold text-slate-900">{formatPrice(bundle.price, lang)}</p></div><span className="bg-#1A4D8F text-white px-4 py-2 rounded-lg text-sm font-bold">{t(lang, "book_now")}</span></div>
              </div>
            </a>
          ))}
          {sorted.length === 0 && <p className="col-span-full text-center text-slate-400 py-20">{lang === "ar" ? "لا باقات مطابقة" : "No bundles match your search"}</p>}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
