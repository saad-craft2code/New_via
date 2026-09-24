"use client";

import { useState, useEffect } from "react";
import { cn, type Lang, t } from "@/lib/tripful-utils";
import { Menu, X, Globe } from "lucide-react";

export function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={cn("tf-navbar", scrolled && "scrolled")}>
        <div className="tf-container flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-[#1A4D8F] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tf-font-display text-[#0F172A]">Tripful</span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#64748B] mt-0.5">MIDDLE EAST</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <a href="/hotels" className="tf-btn-ghost">{t(lang, "hotels")}</a>
            <a href="/bundles" className="tf-btn-ghost">{t(lang, "bundles")}</a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="tf-btn-ghost flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-semibold">{lang === "en" ? "العربية" : "English"}</span>
            </button>
            <a href="/tripful-login" className="tf-btn-primary text-sm" style={{ padding: "10px 20px" }}>
              {t(lang, "login")}
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-[#F1F5F9]">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#E2E8F0] px-5 py-4 space-y-2">
            <a href="/hotels" className="block py-2 text-sm font-semibold text-[#334155]" onClick={() => setMobileOpen(false)}>{t(lang, "hotels")}</a>
            <a href="/bundles" className="block py-2 text-sm font-semibold text-[#334155]" onClick={() => setMobileOpen(false)}>{t(lang, "bundles")}</a>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div style={{ height: scrolled ? 60 : 72 }} className="flex-shrink-0" />
    </>
  );
}
