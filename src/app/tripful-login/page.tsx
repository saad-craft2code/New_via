"use client";
import { useState } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { t } from "@/lib/tripful-utils";
import { Mail, Lock, ArrowRight, Globe } from "lucide-react";

export default function LoginPage() {
  const { lang, setLang } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: accept any credentials
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar lang={lang} setLang={setLang} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-xl bg-#1A4D8F flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{t(lang, "login")}</h1>
              <p className="text-slate-500 mt-2">{lang === "ar" ? "أدخل بياناتك للمتابعة" : "Enter your details to continue"}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-semibold text-slate-700 mb-1.5 block">{t(lang, "email")}</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
              <div><label className="text-sm font-semibold text-slate-700 mb-1.5 block">{lang === "ar" ? "كلمة المرور" : "Password"}</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
              <button type="submit" className="w-full bg-#1A4D8F text-white font-bold py-3.5 rounded-xl hover:bg-#2563EB transition-colors flex items-center justify-center gap-2">{t(lang, "login")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">{lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"} <a href="/tripful-login" className="text-#1A4D8F font-bold hover:underline">{t(lang, "register")}</a></p>
            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center"><p className="text-xs text-#2563EB">{lang === "ar" ? "وضع تجريبي — أي بريد وكلمة مرور يعمل" : "Demo mode — any email and password works"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
