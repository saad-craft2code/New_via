"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getHotels, getBundles, type Hotel, type Bundle } from "@/data/mock-data";
import { t, formatPrice } from "@/lib/utils";
import { Tag, Clock, Copy, Check, Flame, ArrowRight, Plane, Building2 } from "lucide-react";

interface Deal {
  id: string;
  type: "hotel" | "bundle";
  itemId: string;
  name: string;
  nameAr?: string;
  image: string;
  city: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  code: string;
  endsInHours: number;
}

const DEAL_CODES = [
  "TRIPFUL25",
  "STAY20",
  "BUNDLE30",
  "UMRAH15",
  "DUBAI40",
  "LUXURY10",
  "EARLYBIRD25",
  "WEEKEND20",
];

export default function DealsPage() {
  const { lang, setLang } = useLang();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getHotels(), getBundles()]).then(([hotels, bundles]) => {
      if (!mounted) return;
      // Generate deals by applying random discounts (15-40%)
      const hotelDeals: Deal[] = hotels.slice(0, 4).map((h, i) => {
        const pct = 15 + ((i * 7) % 26);  // 15-40%
        const disc = Math.round(h.startingPrice * (1 - pct / 100));
        return {
          id: `deal-h-${h.id}`,
          type: "hotel",
          itemId: h.id,
          name: h.name,
          nameAr: h.nameAr,
          image: h.coverImage,
          city: h.city,
          originalPrice: h.startingPrice,
          discountedPrice: disc,
          discountPercent: pct,
          code: DEAL_CODES[i % DEAL_CODES.length],
          endsInHours: 12 + i * 8,
        };
      });
      const bundleDeals: Deal[] = bundles.slice(0, 3).map((b, i) => {
        const pct = 20 + ((i * 5) % 21);
        const disc = Math.round(b.price * (1 - pct / 100));
        return {
          id: `deal-b-${b.id}`,
          type: "bundle",
          itemId: b.id,
          name: b.title,
          nameAr: b.titleAr,
          image: b.coverImage,
          city: b.destinations[0],
          originalPrice: b.price,
          discountedPrice: disc,
          discountPercent: pct,
          code: DEAL_CODES[(i + 4) % DEAL_CODES.length],
          endsInHours: 24 + i * 12,
        };
      });
      setDeals([...hotelDeals, ...bundleDeals]);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1A4D8F] to-[#2563EB] rounded-3xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full blur-[100px]" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur mb-4">
              <Flame className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider">{t(lang, "popular_now")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tf-font-display">{t(lang, "limited_time_offers")}</h1>
            <p className="text-white/80 text-lg max-w-2xl">{t(lang, "deals_subtitle")}</p>
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="tf-skeleton h-96 rounded-2xl" />)}
          </div>
        ) : deals.length === 0 ? (
          <div className="tf-empty">
            <div className="tf-empty-icon"><Tag className="h-8 w-8" /></div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{t(lang, "no_deals_available")}</h3>
            <p className="text-[#64748B]">{t(lang, "check_back_soon")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                  <div className="tf-discount-tag">{deal.discountPercent}% {t(lang, "off")}</div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-[#1A4D8F] flex items-center gap-1">
                    {deal.type === "hotel" ? <Building2 className="h-3 w-3" /> : <Plane className="h-3 w-3" />}
                    {deal.type === "hotel" ? t(lang, "hotels") : t(lang, "bundles")}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0F172A] mb-1 tf-font-display">{lang === "ar" ? deal.nameAr ?? deal.name : deal.name}</h3>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mb-3">{deal.city}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#64748B] line-through">{formatPrice(deal.originalPrice, lang)}</span>
                    <span className="text-xl font-extrabold text-[#DC2626] tf-font-display">{formatPrice(deal.discountedPrice, lang)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#92400E] bg-[#FFFBEB] border border-[#FEF3C7] rounded-md px-2 py-1 mb-3 w-fit">
                    <Clock className="h-3 w-3" />
                    {t(lang, "ends_in")} {deal.endsInHours < 24 ? `${deal.endsInHours} ${t(lang, "hours_left")}` : `${Math.ceil(deal.endsInHours / 24)} ${t(lang, "days_left")}`}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 px-3 py-2 bg-[#F1F5F9] rounded-lg text-sm font-mono font-bold text-[#1A4D8F] border border-dashed border-[#93C5FD]">
                      {deal.code}
                    </code>
                    <button onClick={() => copyCode(deal.code)} className="tf-btn-ghost p-2">
                      {copiedCode === deal.code ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <a href={deal.type === "hotel" ? `/hotels/${deal.itemId}` : `/bundles/${deal.itemId}`} className="tf-btn-primary w-full">
                    {t(lang, "redeem_deal")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </a>
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
