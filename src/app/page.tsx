"use client";

import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { hotels, bundles, cities, testimonials } from "@/lib/tripful-data";
import { cn, t, formatPrice } from "@/lib/tripful-utils";
import { Search, MapPin, Star, ArrowRight, Check, Shield, Award, Globe2, Headphones, Sparkles, Calendar, Users, TrendingUp, Building2, Plane, Heart } from "lucide-react";

export default function Home() {
  const { lang, setLang } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("guests", String(guests));
    window.location.href = `/hotels?${params.toString()}`;
  };

  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    setAiThinking(true);
    // Simple keyword matching — will be replaced with real AI API later
    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      const matches = hotels.filter(h =>
        h.city.toLowerCase().includes(p) ||
        h.country.toLowerCase().includes(p) ||
        h.name.toLowerCase().includes(p) ||
        h.amenities.some(a => p.includes(a.toLowerCase().split(" ")[0]))
      );
      // Redirect to hotels page with search query
      window.location.href = `/hotels?q=${encodeURIComponent(aiPrompt)}`;
    }, 1200);
  };

  const stats = [
    { icon: Building2, value: "500+", label: t(lang, "stats_hotels") },
    { icon: Plane, value: "120+", label: t(lang, "stats_bundles") },
    { icon: Globe2, value: "15+", label: t(lang, "stats_countries") },
    { icon: Heart, value: "50K+", label: t(lang, "stats_guests") },
  ];

  const whyChoose = [
    { icon: Shield, title: lang === "ar" ? "حجز آمن ومضمون" : "Secure & Guaranteed Booking", desc: lang === "ar" ? "حجوزاتك محمية بأعلى معايير الأمان مع تأكيد فوري" : "Your bookings protected with bank-level security and instant confirmation" },
    { icon: Award, title: lang === "ar" ? "فنادق مختارة بعناية" : "Carefully Curated Hotels", desc: lang === "ar" ? "كل فندق يخضع لمعايير صارمة قبل الإدراج" : "Every hotel passes strict quality checks before listing" },
    { icon: Globe2, title: lang === "ar" ? "تغطية الشرق الأوسط" : "Middle East Coverage", desc: lang === "ar" ? "فنادق في دبي ومكة وطرابلس وشرم الشيخ وعمّان والمزيد" : "Hotels in Dubai, Makkah, Tripoli, Sharm, Amman & more" },
    { icon: Headphones, title: lang === "ar" ? "دعم ٢٤/٧" : "24/7 Support", desc: lang === "ar" ? "فريق دعم متعدد اللغات على مدار الساعة" : "Multilingual support team available around the clock" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar lang={lang} setLang={setLang} />

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#EFF6FF] to-white pt-16 pb-20">
        <div className="tf-container">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
              <span className="text-xs font-bold text-[#1A4D8F] uppercase tracking-wider">{lang === "ar" ? "منصة الشرق الأوسط الأولى للفنادق" : "#1 Middle East Hotel Platform"}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] leading-[1.1] mb-5 tf-font-display">
              {lang === "ar" ? "اكتشف وأفضل الفنادق" : "Find & Book the Best Hotels"}<br/>
              <span className="text-[#1A4D8F]">{lang === "ar" ? "في الشرق الأوسط" : "Across the Middle East"}</span>
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              {lang === "ar"
                ? "من فنادق دبي الفاخرة إلى إقامة مكة المريحة، من شواطئ طرابلس إلى مغامرات شرم الشيخ — أكثر من ٥٠٠ فندق وباقة سفر بانتظارك."
                : "From luxury stays in Dubai to spiritual journeys in Makkah, Mediterranean shores of Tripoli to Red Sea adventures in Sharm — 500+ hotels and travel bundles await."}
            </p>
          </div>

          {/* AI Trip Planner */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="tf-ai-box">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-[#1A4D8F] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{lang === "ar" ? "مخطط الرحلة الذكي" : "AI Trip Planner"}</p>
                  <p className="text-xs text-[#64748B]">{lang === "ar" ? "صف ما تريد وسنجده لك" : "Describe what you want, we'll find it"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                  placeholder={lang === "ar" ? "مثال: فندق في مكة بإطلالة الكعبة بسعر أقل من ٥٠٠ دولار" : "e.g. Hotel in Makkah with Kaaba view under $500"}
                  className="tf-ai-input flex-1"
                />
                <button onClick={handleAiSearch} disabled={aiThinking} className="tf-btn-primary flex-shrink-0">
                  {aiThinking ? (
                    <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {lang === "ar" ? "جاري البحث..." : "Searching..."}</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> {lang === "ar" ? "ابحث" : "Find"}</>
                  )}
                </button>
              </div>
              {/* AI quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  lang === "ar" ? "فندق فاخر في دبي" : "Luxury hotel in Dubai",
                  lang === "ar" ? "عمرة ٧ أيام" : "Umrah 7 days",
                  lang === "ar" ? "شاطئ في شرم الشيخ" : "Beach in Sharm",
                  lang === "ar" ? "فندق في طرابلس" : "Hotel in Tripoli",
                ].map((suggestion) => (
                  <button key={suggestion} onClick={() => setAiPrompt(suggestion)} className="px-3 py-1.5 text-xs rounded-full bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1A4D8F] transition-colors">
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Two options: Hotels or Tour Guides */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-2 gap-4">
              <a href="/hotels" className="tf-card group p-6 text-center no-underline">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-[#EFF6FF] items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Building2 className="h-7 w-7 text-[#1A4D8F]" />
                </div>
                <h3 className="text-lg font-bold tf-font-display text-[#0F172A] mb-1">{t(lang, "hotels")}</h3>
                <p className="text-sm text-[#64748B]">{lang === "ar" ? "ابحث عن إقامتك المثالية" : "Find your perfect stay"}</p>
              </a>
              <a href="/bundles" className="tf-card group p-6 text-center no-underline">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-[#EFF6FF] items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plane className="h-7 w-7 text-[#1A4D8F]" />
                </div>
                <h3 className="text-lg font-bold tf-font-display text-[#0F172A] mb-1">{lang === "ar" ? "باقات ومرشدون" : "Bundles & Guides"}</h3>
                <p className="text-sm text-[#64748B]">{lang === "ar" ? "اكتشف باقات السفر والجولات الموجهة" : "Discover travel bundles & guided tours"}</p>
              </a>
            </div>
          </div>

          {/* Traditional Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <label className="text-xs font-bold text-[#475569] mb-1.5 block uppercase tracking-wider">{t(lang, "search_placeholder")}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={lang === "ar" ? "دبي، مكة، طرابلس..." : "Dubai, Makkah, Tripoli..."} className="tf-input" style={{ paddingLeft: "44px" }} />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-[#475569] mb-1.5 block uppercase tracking-wider flex items-center gap-1"><Calendar className="h-3 w-3" /> {t(lang, "check_in")}</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="tf-input" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[#475569] mb-1.5 block uppercase tracking-wider flex items-center gap-1"><Users className="h-3 w-3" /> {t(lang, "guests")}</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="tf-input">
                  <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5+</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button onClick={handleSearch} className="tf-btn-primary w-full">
                  <Search className="h-4 w-4" /> {t(lang, "search_btn")}
                </button>
              </div>
            </div>
          </div>

          {/* Popular cities */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {cities.map((city) => (
              <button key={city} onClick={() => setSearchQuery(city)} className="px-4 py-2 bg-white text-[#475569] text-sm rounded-full border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#1A4D8F] transition-all">
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────── */}
      <section className="border-y border-[#E2E8F0] bg-white py-12">
        <div className="tf-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex h-12 w-12 rounded-xl bg-[#EFF6FF] items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-[#1A4D8F]" />
                </div>
                <p className="text-3xl font-extrabold text-[#0F172A] tf-font-display">{stat.value}</p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Hotels ──────────────────────── */}
      <section className="tf-section bg-[#F8FAFC]">
        <div className="tf-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#1A4D8F] uppercase tracking-[0.2em]">{lang === "ar" ? "إقامة مميزة" : "Featured Stays"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mt-2 tf-font-display">{t(lang, "featured_hotels")}</h2>
              <p className="text-[#64748B] mt-2 text-lg">{lang === "ar" ? "أفخم الفنادق في المنطقة" : "The finest hotels in the region"}</p>
            </div>
            <a href="/hotels" className="tf-btn-outline flex-shrink-0" style={{ padding: "10px 20px", fontSize: 14 }}>
              {t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <a key={hotel.id} href={`/hotels/${hotel.id}`} className="tf-card group">
                <div className="relative h-56 overflow-hidden">
                  <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <Star className="h-3.5 w-3.5 tf-star" />
                    <span className="font-bold text-sm text-[#0F172A]">{hotel.rating}</span>
                    <span className="text-xs text-[#64748B]">({hotel.reviewCount.toLocaleString()})</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#1A4D8F] text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    {hotel.starRating} ★
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-[#1A4D8F] uppercase tracking-wider mb-1">{hotel.country}</p>
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1A4D8F] transition-colors tf-font-display leading-tight">{lang === "ar" ? hotel.nameAr ?? hotel.name : hotel.name}</h3>
                  <p className="text-sm text-[#64748B] flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" /> {hotel.location}, {hotel.city}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hotel.amenities.slice(0, 3).map((a, i) => <span key={i} className="text-xs px-2 py-0.5 bg-[#F1F5F9] rounded-md text-[#475569]">{lang === "ar" ? hotel.amenitiesAr[i] : a}</span>)}
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                    <div>
                      <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-xl font-extrabold text-[#0F172A] tf-font-display">{formatPrice(hotel.startingPrice, lang)}<span className="text-xs font-normal text-[#64748B]"> {t(lang, "per_night")}</span></p>
                    </div>
                    <span className="tf-badge tf-badge-blue">{t(lang, "view_details")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Bundles ────────────────────── */}
      <section className="tf-section bg-white">
        <div className="tf-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#1A4D8F] uppercase tracking-[0.2em]">{lang === "ar" ? "تجارب لا تُنسى" : "Unforgettable Experiences"}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mt-2 tf-font-display">{t(lang, "featured_bundles")}</h2>
              <p className="text-[#64748B] mt-2 text-lg">{lang === "ar" ? "باقات سفر شاملة بأسعار استثنائية" : "All-inclusive travel packages at exceptional value"}</p>
            </div>
            <a href="/bundles" className="tf-btn-outline flex-shrink-0" style={{ padding: "10px 20px", fontSize: 14 }}>
              {t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {bundles.map((bundle) => (
              <a key={bundle.id} href={`/bundles/${bundle.id}`} className="tf-card group flex flex-col md:flex-row">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="tf-badge tf-badge-blue">{bundle.durationDays} {t(lang, "days")}</span>
                    <span className="tf-badge tf-badge-gray">{bundle.difficulty}</span>
                  </div>
                </div>
                <div className="md:w-3/5 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#1A4D8F] uppercase tracking-wider mb-1">{bundle.destinations.join(" • ")}</p>
                    <h3 className="text-lg font-bold tf-font-display text-[#0F172A] group-hover:text-[#1A4D8F] transition-colors leading-tight mb-2">{lang === "ar" ? bundle.titleAr ?? bundle.title : bundle.title}</h3>
                    <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed">{bundle.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {bundle.includedServices.slice(0, 4).map((s, i) => <span key={i} className="tf-badge tf-badge-green"><Check className="h-3 w-3" />{lang === "ar" ? bundle.includedServicesAr[i] : s}</span>)}
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                    <div>
                      <span className="text-xs text-[#64748B]">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-xl font-extrabold tf-font-display text-[#0F172A]">{formatPrice(bundle.price, lang)}<span className="text-xs font-normal text-[#64748B]"> {t(lang, "per_person")}</span></p>
                    </div>
                    <span className="tf-btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>{t(lang, "book_now")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose ──────────────────────────── */}
      <section className="tf-section bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[120px]" style={{ background: "rgba(37, 99, 235, 0.1)" }} />
        <div className="tf-container relative">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-[0.2em]">{lang === "ar" ? "لماذا نحن" : "Why Tripful"}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tf-font-display">{t(lang, "why_choose")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 hover:border-[#2563EB]/30 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="inline-flex h-14 w-14 rounded-xl items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "rgba(37, 99, 235, 0.15)" }}>
                  <item.icon className="h-7 w-7 text-[#60A5FA]" />
                </div>
                <h3 className="text-lg font-bold mb-2 tf-font-display">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────── */}
      <section className="tf-section bg-[#F8FAFC]">
        <div className="tf-container">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#1A4D8F] uppercase tracking-[0.2em]">{lang === "ar" ? "آراء الضيوف" : "Guest Reviews"}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mt-2 tf-font-display">{t(lang, "testimonials")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tst, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex gap-1 mb-4">{Array.from({ length: tst.rating }).map((_, idx) => <Star key={idx} className="h-4 w-4 tf-star" />)}</div>
                <p className="text-[#334155] leading-relaxed mb-6 text-sm italic">"{lang === "ar" ? tst.textAr : tst.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <img src={tst.avatar} alt={tst.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm">{lang === "ar" ? tst.nameAr : tst.name}</p>
                    <p className="text-xs text-[#64748B]">{lang === "ar" ? tst.countryAr : tst.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────── */}
      <section className="tf-section bg-white">
        <div className="tf-container">
          <div className="bg-gradient-to-r from-[#1A4D8F] to-[#2563EB] rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full blur-[80px]" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tf-font-display">{lang === "ar" ? "هل أنت مستعد لرحلتك القادمة؟" : "Ready for your next journey?"}</h2>
              <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">{lang === "ar" ? "انضم إلى أكثر من ٥٠ ألف مسافر اختاروا تريبفول" : "Join 50,000+ travelers who chose Tripful"}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="/hotels" className="bg-white text-[#1A4D8F] font-bold px-8 py-3.5 rounded-xl hover:bg-[#EFF6FF] transition-colors inline-flex items-center gap-2">
                  {t(lang, "hotels")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </a>
                <a href="/bundles" className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                  {t(lang, "bundles")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Big Branding Spacer ──────────────────── */}
      <section className="bg-[#F8FAFC] py-24 border-t border-[#E2E8F0]">
        <div className="tf-container text-center">
          <div className="inline-flex h-20 w-20 rounded-3xl bg-[#1A4D8F] items-center justify-center mb-6 shadow-xl">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-[#0F172A] tf-font-display mb-3">Tripful</h2>
          <p className="text-lg text-[#64748B] max-w-xl mx-auto">{lang === "ar" ? "منصة حجوزات الفنادق والسفر الأولى في الشرق الأوسط — بياناتك متصلة مباشرة مع لوحة تحكم مقدمي الخدمة" : "The Middle East's premier hotel & travel booking platform — synced directly with the Via Trips provider panel"}</p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#64748B]">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> {lang === "ar" ? "تأكيد فوري" : "Instant Confirmation"}</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> {lang === "ar" ? "أفضل الأسعار" : "Best Prices"}</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> {lang === "ar" ? "دعم ٢٤/٧" : "24/7 Support"}</span>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
