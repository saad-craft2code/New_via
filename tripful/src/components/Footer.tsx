"use client";

import { useLang } from "@/components/lang-provider";
import { t } from "@/lib/utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-[#0F172A] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold">{t(lang, "brand")}</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{t(lang, "footer_about_desc")}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{t(lang, "footer_links")}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/hotels" className="hover:text-teal-400 transition-colors">{t(lang, "hotels")}</a></li>
              <li><a href="/bundles" className="hover:text-teal-400 transition-colors">{t(lang, "bundles")}</a></li>
              <li><a href="/login" className="hover:text-teal-400 transition-colors">{t(lang, "login")}</a></li>
              <li><a href="/register" className="hover:text-teal-400 transition-colors">{t(lang, "register")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{t(lang, "footer_contact")}</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@tripful.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +966 50 000 0000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Riyadh, Saudi Arabia</li>
            </ul>
          </div>
          <div>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-teal-600 flex items-center justify-center transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-teal-600 flex items-center justify-center transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-teal-600 flex items-center justify-center transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
          {t(lang, "footer_rights")}
        </div>
      </div>
    </footer>
  );
}
