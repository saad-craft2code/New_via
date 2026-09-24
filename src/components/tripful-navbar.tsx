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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className={cn("text-2xl font-extrabold", scrolled ? "text-slate-900" : "text-white")}>
            {t(lang, "brand")}
          </span>
        </a>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/20")}>
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a href="/tripful-login" className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", scrolled ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-white text-teal-600 hover:bg-teal-50")}>
            {t(lang, "login")}
          </a>
        </div>
      </div>
    </nav>
  );
}
