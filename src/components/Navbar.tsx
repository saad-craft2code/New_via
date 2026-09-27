"use client";

import { useState, useEffect } from "react";
import { cn, type Lang, t } from "@/lib/utils";

export function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-[#1A4D8F] flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className={cn("text-2xl font-extrabold", scrolled ? "text-[#0F172A]" : "text-white")}>
            {t(lang, "brand")}
          </span>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/deals" className={cn("hidden sm:inline-flex px-3 py-1.5 rounded-lg text-sm font-bold transition-all", scrolled ? "text-[#DC2626] hover:bg-red-50" : "text-white hover:bg-white/20")}>
            {lang === "ar" ? "عروض" : "Deals"}
          </a>
          <a href="/trending" className={cn("hidden sm:inline-flex px-3 py-1.5 rounded-lg text-sm font-bold transition-all", scrolled ? "text-[#92400E] hover:bg-amber-50" : "text-white hover:bg-white/20")}>
            {lang === "ar" ? "رائج" : "Trending"}
          </a>
          <a href="/my-bookings" className={cn("hidden sm:inline-flex px-3 py-1.5 rounded-lg text-sm font-medium transition-all", scrolled ? "text-[#475569] hover:bg-slate-100" : "text-white hover:bg-white/20")}>
            {t(lang, "my_bookings")}
          </a>
          <a href="/profile" className={cn("hidden sm:inline-flex w-9 h-9 rounded-full items-center justify-center text-sm font-bold transition-all", scrolled ? "bg-[#EFF6FF] text-[#1A4D8F] hover:bg-[#DBEAFE]" : "bg-white/20 text-white hover:bg-white/30")}>
            {lang === "ar" ? "ح" : "Me"}
          </a>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", scrolled ? "text-[#475569] hover:bg-slate-100" : "text-white hover:bg-white/20")}>
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a href="/login" className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", scrolled ? "bg-[#1A4D8F] text-white hover:bg-[#2563EB]" : "bg-white text-[#1A4D8F] hover:bg-blue-50")}>
            {t(lang, "login")}
          </a>
        </div>
      </div>
    </nav>
  );
}
