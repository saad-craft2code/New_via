"use client";

import { useLang } from "@/components/tripful-lang-provider";
import { t } from "@/lib/tripful-utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Building2, Plane } from "lucide-react";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-[#0F172A] text-white mt-auto">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#1A4D8F] via-[#2563EB] to-[#1A4D8F]" />

      <div className="tf-container pt-16 pb-10">
        <div className="grid md:grid-cols-12 gap-10">

          {/* Brand — 4 cols */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-extrabold tf-font-display text-white">Tripful</span>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#60A5FA] mt-0.5 font-semibold">MIDDLE EAST</p>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-5 max-w-xs">{t(lang, "footer_about_desc")}</p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#2563EB]">
                <Facebook className="h-4 w-4 text-white/60 group-hover:text-white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#2563EB]">
                <Twitter className="h-4 w-4 text-white/60" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#2563EB]">
                <Instagram className="h-4 w-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Explore — 2 cols */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white/90 tf-font-display">{t(lang, "footer_links")}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/hotels" className="text-white/50 hover:text-[#60A5FA] transition-colors flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {t(lang, "hotels")}</a></li>
              <li><a href="/bundles" className="text-white/50 hover:text-[#60A5FA] transition-colors flex items-center gap-2"><Plane className="h-3.5 w-3.5" /> {t(lang, "bundles")}</a></li>
              <li><a href="/tripful-login" className="text-white/50 hover:text-[#60A5FA] transition-colors">{t(lang, "login")}</a></li>
            </ul>
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white/90 tf-font-display">{t(lang, "footer_contact")}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-white/50">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Mail className="h-3.5 w-3.5 text-[#60A5FA]" />
                </div>
                <span>info@tripful.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Phone className="h-3.5 w-3.5 text-[#60A5FA]" />
                </div>
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-[#60A5FA]" />
                </div>
                <span>{lang === "ar" ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white/90 tf-font-display">{t(lang, "newsletter")}</h4>
            <p className="text-sm text-white/40 mb-4 leading-relaxed">{t(lang, "newsletter_desc")}</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t(lang, "email_placeholder")}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 outline-none focus:border-[#2563EB] transition-colors"
              />
              <button className="bg-[#2563EB] text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#1A4D8F] transition-colors w-full">
                {t(lang, "subscribe")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="tf-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-white/30">{t(lang, "footer_rights")}</p>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <a href="#" className="hover:text-white/40 transition-colors">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a>
              <span>•</span>
              <a href="#" className="hover:text-white/40 transition-colors">{lang === "ar" ? "الشروط والأحكام" : "Terms of Service"}</a>
              <span>•</span>
              <a href="#" className="hover:text-white/40 transition-colors">{lang === "ar" ? "ملفات تعريف الارتباط" : "Cookies"}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
