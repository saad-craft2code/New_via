"use client";

import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { hotels, bundles, cities, testimonials } from "@/lib/tripful-data";
import { cn, t, formatPrice } from "@/lib/tripful-utils";
import { Search, MapPin, Star, ArrowRight, Check, Shield, Award, Globe2, Headphones, Star as StarIcon } from "lucide-react";

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

  const stats = [
    { icon: Award, value: hotels.length + "+", label: t(lang, "stats_hotels") },
    { icon: Globe2, value: bundles.length + "+", label: t(lang, "stats_bundles") },
    { icon: MapPin, value: "5+", label: t(lang, "stats_countries") },
    { icon: StarIcon, value: "12K+", label: t(lang, "stats_guests") },
  ];

  const whyChoose = [
    { icon: Shield, title: lang === "ar" ? "حجز آمن" : "Secure Booking", desc: lang === "ar" ? "حجوزاتك محمية بأعلى معايير الأمان" : "Your bookings protected by highest security standards" },
    { icon: Award, title: lang === "ar" ? "فنادق مختارة" : "Curated Hotels", desc: lang === "ar" ? "كل فندق مختار بعناية لضمان الجودة" : "Every hotel handpicked for quality assurance" },
    { icon: Globe2, title: lang === "ar" ? "تغطية واسعة" : "Wide Coverage", desc: lang === "ar" ? "فنادق في دبي ومكة وطرابلس وشرم الشيخ وعمّان" : "Hotels in Dubai, Makkah, Tripoli, Sharm & Amman" },
    { icon: Headphones, title: lang === "ar" ? "دعم ٢٤/٧" : "24/7 Support", desc: lang === "ar" ? "فريق دعم متعدد اللغات على مدار الساعة" : "Multilingual support team available round the clock" },
  ];

  return (
    <div className="min-h-screen tf-font-body">
      <Navbar lang={lang} setLang={setLang} />

      {/* Hero */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 tf-hero-gradient" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Gold accent glow */}
        <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full blur-[120px]" style={{ background: "rgba(201, 169, 97, 0.15)" }} />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full blur-[100px]" style={{ background: "rgba(201, 169, 97, 0.08)" }} />

        <div className="relative z-10 tf-container text-center pt-32 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border tf-border-gold mb-6" style={{ background: "rgba(201, 169, 97, 0.1)" }}>
            <span className="h-1.5 w-1.5 rounded-full tf-bg-gold animate-pulse" />
            <span className="text-xs tf-gold font-medium tracking-wider uppercase tf-font-display">{lang === "ar" ? "منصة الشرق الأوسط الفاخرة" : "Middle East Luxury Platform"}</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6 tf-font-display max-w-4xl mx-auto">
            {t(lang, "hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed tf-font-body">
            {t(lang, "hero_subtitle")}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border-t-2" style={{ borderColor: "#C9A961" }}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">{t(lang, "search_placeholder")}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={lang === "ar" ? "دبي، مكة، طرابلس..." : "Dubai, Makkah, Tripoli..."} className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A961]" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">{t(lang, "check_in")}</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A961]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">{t(lang, "check_out")}</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A961]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">{t(lang, "guests")}</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A961]">
                  <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5+</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button onClick={handleSearch} className="w-full tf-btn-gold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                  <Search className="h-4 w-4" /> {t(lang, "search_btn")}
                </button>
              </div>
            </div>
          </div>

          {/* Popular cities */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {cities.map((city) => (
              <button key={city} onClick={() => setSearchQuery(city)} className="px-5 py-2.5 text-white text-sm rounded-full transition-all border border-white/20 hover:tf-border-gold hover:bg-white/5">
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="tf-bg-dark py-12 border-t" style={{ borderColor: "rgba(201, 169, 97, 0.2)" }}>
        <div className="tf-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex h-12 w-12 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(201, 169, 97, 0.1)" }}>
                  <stat.icon className="h-6 w-6 tf-gold" />
                </div>
                <p className="text-3xl font-black text-white tf-font-display">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="tf-section tf-bg-cream">
        <div className="tf-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tf-gold font-bold uppercase tracking-[0.3em] tf-font-display">{lang === "ar" ? "إقامة فاخرة" : "Luxury Stays"}</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 tf-font-display">{t(lang, "featured_hotels")}</h2>
              <p className="text-slate-500 mt-3 text-lg">{lang === "ar" ? "أرقى الفنادق في الشرق الأوسط مختارة لك" : "The finest hotels across the Middle East, handpicked for you"}</p>
            </div>
            <a href="/hotels" className="tf-btn-dark px-6 py-3 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
              {t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <a key={hotel.id} href={`/hotels/${hotel.id}`} className="tf-card-luxury rounded-2xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm text-slate-900">{hotel.rating}</span>
                    <span className="text-xs text-slate-400">({hotel.reviewCount})</span>
                  </div>
                  <div className="absolute top-4 right-4 tf-bg-gold text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    {hotel.starRating} ★
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-white/70 mb-1">{hotel.country}</p>
                    <h3 className="text-xl font-bold tf-font-display leading-tight">{lang === "ar" ? hotel.nameAr ?? hotel.name : hotel.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-3"><MapPin className="h-3.5 w-3.5 tf-gold" /> {hotel.location}, {hotel.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.slice(0, 4).map((a, i) => <span key={i} className="text-xs px-2.5 py-1 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">{lang === "ar" ? hotel.amenitiesAr[i] : a}</span>)}
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-2xl font-black text-slate-900 tf-font-display">{formatPrice(hotel.startingPrice, lang)}</p>
                      <span className="text-xs text-slate-400">{t(lang, "per_night")}</span>
                    </div>
                    <span className="tf-btn-dark px-5 py-2.5 rounded-xl text-sm">{t(lang, "view_details")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bundles */}
      <section className="tf-section bg-white">
        <div className="tf-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tf-gold font-bold uppercase tracking-[0.3em] tf-font-display">{lang === "ar" ? "تجارب لا تُنسى" : "Unforgettable Experiences"}</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 tf-font-display">{t(lang, "featured_bundles")}</h2>
              <p className="text-slate-500 mt-3 text-lg">{lang === "ar" ? "باقات سفر شاملة بأسعار مميزة" : "All-inclusive travel packages at exceptional prices"}</p>
            </div>
            <a href="/bundles" className="tf-btn-dark px-6 py-3 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
              {t(lang, "explore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {bundles.map((bundle) => (
              <a key={bundle.id} href={`/bundles/${bundle.id}`} className="tf-card-luxury rounded-2xl overflow-hidden group flex flex-col md:flex-row">
                <div className="md:w-1/2 h-56 md:h-auto overflow-hidden relative">
                  <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="tf-bg-gold text-black text-xs px-3 py-1.5 rounded-lg font-bold">{bundle.durationDays} {t(lang, "days")}</span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg">{bundle.difficulty}</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-xs tf-gold font-bold uppercase tracking-wider mb-2">{bundle.destinations.join(" • ")}</p>
                    <h3 className="text-xl font-bold tf-font-display leading-tight mb-2">{lang === "ar" ? bundle.titleAr ?? bundle.title : bundle.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{bundle.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {bundle.includedServices.slice(0, 4).map((s, i) => <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md flex items-center gap-1 border border-amber-100"><Check className="h-3 w-3" />{lang === "ar" ? bundle.includedServicesAr[i] : s}</span>)}
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">{lang === "ar" ? "يبدأ من" : "From"}</span>
                      <p className="text-2xl font-black tf-font-display text-slate-900">{formatPrice(bundle.price, lang)}</p>
                      <span className="text-xs text-slate-400">{t(lang, "per_person")}</span>
                    </div>
                    <span className="tf-btn-gold px-5 py-2.5 rounded-xl text-sm">{t(lang, "book_now")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="tf-section tf-bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[150px]" style={{ background: "rgba(201, 169, 97, 0.08)" }} />
        <div className="tf-container relative">
          <div className="text-center mb-16">
            <span className="text-xs tf-gold font-bold uppercase tracking-[0.3em] tf-font-display">{lang === "ar" ? "لماذا نحن" : "Why Us"}</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 tf-font-display">{t(lang, "why_choose")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-white/5 hover:border-[#C9A961]/30 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="inline-flex h-16 w-16 rounded-2xl items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "rgba(201, 169, 97, 0.1)" }}>
                  <item.icon className="h-8 w-8 tf-gold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tf-font-display">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="tf-section tf-bg-cream">
        <div className="tf-container">
          <div className="text-center mb-12">
            <span className="text-xs tf-gold font-bold uppercase tracking-[0.3em] tf-font-display">{lang === "ar" ? "آراء الضيوف" : "Guest Reviews"}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 tf-font-display">{t(lang, "testimonials")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((tst, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: tst.rating }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">"{lang === "ar" ? tst.textAr : tst.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={tst.avatar} alt={tst.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900">{lang === "ar" ? tst.nameAr : tst.name}</p>
                    <p className="text-xs text-slate-400">{lang === "ar" ? tst.countryAr : tst.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
