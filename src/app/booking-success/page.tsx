"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { t, formatPrice } from "@/lib/tripful-utils";
import { CheckCircle2, Home } from "lucide-react";

export default function BookingSuccessPage() {
  const { lang, setLang } = useLang();
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  if (!params) return null;

  const type = params.get("type") ?? "hotel";
  const name = params.get("name") ?? "Guest";
  const email = params.get("email") ?? "";
  const total = Number(params.get("total") ?? 0);
  const guests = Number(params.get("guests") ?? 1);
  const checkIn = params.get("checkIn") ?? params.get("startDate") ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} setLang={setLang} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-teal-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{t(lang, "booking_confirmed")}</h1>
          <p className="text-slate-500 mb-8">{t(lang, "booking_confirmed_desc")}</p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 text-left rtl:text-right">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-500">{lang === "ar" ? "الضيف" : "Guest"}</span><span className="font-bold">{name}</span></div>
              {email && <div className="flex justify-between"><span className="text-slate-500">{t(lang, "email")}</span><span className="font-bold" dir="ltr">{email}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">{lang === "ar" ? "النوع" : "Type"}</span><span className="font-bold">{type === "hotel" ? t(lang, "hotels") : t(lang, "bundles")}</span></div>
              {checkIn && <div className="flex justify-between"><span className="text-slate-500">{t(lang, "check_in")}</span><span className="font-bold">{checkIn}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">{t(lang, "guests")}</span><span className="font-bold">{guests}</span></div>
              <div className="flex justify-between pt-3 border-t border-slate-100"><span className="font-bold">{lang === "ar" ? "الإجمالي" : "Total"}</span><span className="font-bold text-teal-600 text-lg">{formatPrice(total, lang)}</span></div>
            </div>
          </div>

          <a href="/" className="inline-flex items-center gap-2 mt-8 bg-teal-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors">
            <Home className="h-4 w-4" /> {t(lang, "back_home")}
          </a>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
