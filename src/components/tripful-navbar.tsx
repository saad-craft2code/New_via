"use client";

import { useState, useEffect } from "react";
import { cn, type Lang, t } from "@/lib/tripful-utils";

export function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "bg-white/95 backdrop-blur-xl shadow-xl py-3" : "bg-transparent py-5"
    )}>
      <div className="tf-container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all", scrolled ? "tf-bg-dark" : "tf-bg-gold")}>
            <svg viewBox="0 0 24 24" className={cn("h-6 w-6", scrolled ? "tf-gold" : "text-black")} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className={cn("text-2xl font-extrabold tf-font-display transition-colors", scrolled ? "text-black" : "text-white")}>
              {t(lang, "brand")}
            </span>
            <span className={cn("text-[9px] uppercase tracking-[0.3em] mt-0.5", scrolled ? "tf-gold" : "text-white/60")}>
              {lang === "ar" ? "فاخر • متميز" : "LUXURY • PREMIUM"}
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <a href="/hotels" className={cn("hidden md:block text-sm font-medium transition-colors", scrolled ? "text-slate-600 hover:tf-gold" : "text-white/80 hover:text-white")}>
            {t(lang, "hotels")}
          </a>
          <a href="/bundles" className={cn("hidden md:block text-sm font-medium transition-colors mr-4", scrolled ? "text-slate-600 hover:tf-gold" : "text-white/80 hover:text-white")}>
            {t(lang, "bundles")}
          </a>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all border", scrolled ? "text-slate-700 hover:tf-border-gold border-slate-200" : "text-white border-white/30 hover:bg-white/10")}>
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a href="/tripful-login" className="tf-btn-gold px-5 py-2.5 rounded-lg text-sm">
            {t(lang, "login")}
          </a>
        </div>
      </div>
    </nav>
  );
}
