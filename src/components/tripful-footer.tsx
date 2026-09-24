"use client";

import { useLang } from "@/components/tripful-lang-provider";
import { t } from "@/lib/tripful-utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="tf-container pt-20 pb-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-10 w-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tf-font-display">Tripful</span>
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 mt-0.5">MIDDLE EAST</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{t(lang, "footer_about_desc")}</p>
            <div className="flex gap-2 mt-5">
              <a href="#" className="h-9 w-9 rounded-lg bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-lg bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-lg bg-white/5 hover:bg-[#2563EB] flex items-center justify-center transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{t(lang, "footer_links")}</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="/hotels" className="hover:text-[#60A5FA] transition-colors">{t(lang, "hotels")}</a></li>
              <li><a href="/bundles" className="hover:text-[#60A5FA] transition-colors">{t(lang, "bundles")}</a></li>
              <li><a href="/tripful-login" className="hover:text-[#60A5FA] transition-colors">{t(lang, "login")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{t(lang, "footer_contact")}</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#60A5FA]" /> info@tripful.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#60A5FA]" /> +966 50 000 0000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#60A5FA]" /> {lang === "ar" ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{t(lang, "newsletter")}</h4>
            <p className="text-sm text-white/40 mb-3">{t(lang, "newsletter_desc")}</p>
            <div className="flex gap-2">
              <input type="email" placeholder={t(lang, "email_placeholder")} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:border-[#2563EB]" />
              <button className="bg-[#2563EB] text-white px-4 rounded-lg text-sm font-bold hover:bg-[#1A4D8F] transition-colors">{t(lang, "subscribe")}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-sm text-white/30">
        {t(lang, "footer_rights")}
      </div>
    </footer>
  );
}
