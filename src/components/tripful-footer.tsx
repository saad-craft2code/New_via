"use client";

import { useLang } from "@/components/tripful-lang-provider";
import { t } from "@/lib/tripful-utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="tf-bg-dark text-white">
      <div className="tf-container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-11 w-11 rounded-xl tf-bg-gold flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <span className="text-2xl font-extrabold tf-font-display">{t(lang, "brand")}</span>
                <p className="text-[9px] uppercase tracking-[0.3em] tf-gold mt-0.5">{lang === "ar" ? "فاخر • متميز" : "LUXURY • PREMIUM"}</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed tf-font-body">{t(lang, "footer_about_desc")}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 tf-gold tf-font-display">{t(lang, "footer_links")}</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><a href="/hotels" className="hover:tf-gold transition-colors">{t(lang, "hotels")}</a></li>
              <li><a href="/bundles" className="hover:tf-gold transition-colors">{t(lang, "bundles")}</a></li>
              <li><a href="/tripful-login" className="hover:tf-gold transition-colors">{t(lang, "login")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 tf-gold tf-font-display">{t(lang, "footer_contact")}</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 tf-gold" /> info@tripful.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 tf-gold" /> +966 50 000 0000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 tf-gold" /> {lang === "ar" ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"}</li>
            </ul>
          </div>
          <div>
            <div className="flex gap-3 mb-6">
              <a href="#" className="h-10 w-10 rounded-lg bg-white/5 hover:tf-bg-gold hover:text-black flex items-center justify-center transition-all"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/5 hover:tf-bg-gold hover:text-black flex items-center justify-center transition-all"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/5 hover:tf-bg-gold hover:text-black flex items-center justify-center transition-all"><Instagram className="h-5 w-5" /></a>
            </div>
            <div className="tf-bg-charcoal rounded-xl p-4 border border-white/5">
              <p className="text-xs tf-gold font-bold mb-2 tf-font-display">{t(lang, "newsletter")}</p>
              <p className="text-xs text-white/40 mb-3">{t(lang, "newsletter_desc")}</p>
              <div className="flex gap-2">
                <input type="email" placeholder={t(lang, "email_placeholder")} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C9A961]" />
                <button className="tf-btn-gold px-4 rounded-lg text-xs font-bold">{t(lang, "subscribe")}</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-white/30 tf-font-body">
          {t(lang, "footer_rights")}
        </div>
      </div>
    </footer>
  );
}
