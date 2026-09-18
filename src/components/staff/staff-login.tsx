"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/provider/brand-logo";
import { Globe, Moon, Sun, ChevronLeft, ChevronRight, Mail, Lock, Loader2, AlertCircle, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import toast from "react-hot-toast";

export function StaffLogin() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const staffLogin = useAppStore((s) => s.staffLogin);
  const isStaffAuthLoading = useAppStore((s) => s.isStaffAuthLoading);
  const staffAuthError = useAppStore((s) => s.staffAuthError);
  const mounted = useMounted();
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 1;
  const canSubmit = emailValid && passwordValid && !isStaffAuthLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    try {
      await staffLogin(email, password);
      toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Signed in successfully");
    } catch {
      toast.error(staffAuthError ?? (lang === "ar" ? "فشل الدخول" : "Login failed"));
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 oasis-mesh pointer-events-none" />

      <header className="relative z-10 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">{t("language_toggle", lang)}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/70 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-1.5">{t("staff_portal_login", lang)}</h1>
                <p className="text-sm text-muted-foreground">{t("staff_portal_subtitle", lang)}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("staff_portal_email", lang)}</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      placeholder="cleaner1@via.example"
                      className="ps-9"
                      dir="ltr"
                      required
                    />
                  </div>
                  {touched.email && !emailValid && (
                    <p className="text-xs text-destructive">{lang === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid email"}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{t("staff_portal_password", lang)}</Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      placeholder="••••••••"
                      className="ps-9"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {staffAuthError && (
                  <div className="flex items-center gap-2 text-xs text-destructive p-2.5 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{staffAuthError}</span>
                  </div>
                )}

                <Button type="submit" disabled={!canSubmit} className="w-full h-11 gap-2">
                  {isStaffAuthLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t("staff_portal_login", lang)}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-xs text-center text-muted-foreground mb-3">
                  {lang === "ar" ? "حسابات تجريبية — اضغط للتعبئة" : "Demo accounts — click to fill"}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    "cleaner@via.example",
                    "maintenance@via.example",
                  ].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => fillDemo(em)}
                      className="text-[10px] px-2 py-1.5 rounded-md border border-border bg-background hover:bg-accent transition-colors truncate"
                      dir="ltr"
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  {lang === "ar" ? "أي كلمة مرور تعمل" : "Any password works"}
                </p>
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-4 gap-1.5" onClick={() => setAuthScreen("landing")}>
                <Back className="h-3.5 w-3.5" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
