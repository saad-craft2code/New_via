"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/provider/brand-logo";
import {
  Globe,
  Moon,
  Sun,
  Mail,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import toast from "react-hot-toast";

export function LoginForm() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const login = useAppStore((s) => s.login);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const isAuthLoading = useAppStore((s) => s.isAuthLoading);
  const authError = useAppStore((s) => s.authError);
  const mounted = useMounted();
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid && !isAuthLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    try {
      await login(email, password);
      toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Signed in successfully");
    } catch {
      // error already in authError state
      toast.error(authError ?? (lang === "ar" ? "فشل الدخول" : "Login failed"));
    }
  };

  const fillDemo = (demoEmail: string, role: "hotel_owner" | "bundle_creator") => {
    setEmail(demoEmail);
    setPassword("password123");
    useAppStore.getState().setRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 oasis-mesh pointer-events-none" />
      <header className="relative z-10 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="gap-1.5"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{t("language_toggle", lang)}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          <button
            onClick={() => setAuthScreen("landing")}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Back className="h-4 w-4" />
            {t("back", lang)}
          </button>

          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">{t("login_title", lang)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar"
                    ? "سجّل دخولك للوصول إلى لوحة التحكم"
                    : "Sign in to access your dashboard"}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="emailOrPhone">{t("email_or_phone", lang)}</Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="emailOrPhone"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        className="ps-9"
                        placeholder="you@business.com"
                        dir="ltr"
                        required
                      />
                    </div>
                    {touched.email && !emailValid && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lang === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordLogin">{t("password", lang)}</Label>
                      <button type="button" className="text-xs text-primary hover:underline">
                        {t("forgot_password", lang)}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="passwordLogin"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                        className="ps-9"
                        placeholder="••••••••"
                        dir="ltr"
                        required
                      />
                    </div>
                    {touched.password && !passwordValid && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lang === "ar"
                          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                          : "Password must be at least 6 characters"}
                      </p>
                    )}
                  </div>

                  {authError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("loading", lang)}
                      </>
                    ) : (
                      t("login_button", lang)
                    )}
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <button
                    onClick={() => setAuthScreen("role_selection")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("register_as_provider", lang)}{" "}
                    <span className="text-primary font-medium underline underline-offset-4">
                      {t("cta_get_started", lang)}
                    </span>
                  </button>
                </div>

                {/* Demo accounts — one-tap login.
                    ⚠️ Remove this block before production deployment. */}
                <motion.div
                  initial={mounted ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-4 pt-4 border-t border-dashed border-border"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {lang === "ar" ? "للتجربة فقط" : "Demo only"}
                    </span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    {lang === "ar"
                      ? "حسابات تجريبية — اضغط للدخول فورًا"
                      : "Demo accounts — click to sign in instantly"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        fillDemo("hotel@via.example", "hotel_owner");
                        setTimeout(() => login("hotel@via.example", "password123", "hotel_owner").catch(() => {}), 50);
                      }}
                      disabled={isAuthLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {t("i_am_hotel_owner", lang)}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        fillDemo("bundle@via.example", "bundle_creator");
                        setTimeout(() => login("bundle@via.example", "password123", "bundle_creator").catch(() => {}), 50);
                      }}
                      disabled={isAuthLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("i_am_bundle_creator", lang)}
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-2 leading-tight">
                    {lang === "ar"
                      ? "هذه الحسابات تُنشأ تلقائيًا عند تشغيل الخادم — احذفها في الإنتاج"
                      : "Auto-seeded on API boot — remove SEED_DEMO_ACCOUNTS in production"}
                  </p>
                </motion.div>
              </CardContent>
            </Card>

            {/* Staff Portal access */}
            <motion.div
              initial={mounted ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3"
            >
              <button
                type="button"
                onClick={() => setAuthScreen("staff_login")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-background hover:bg-accent text-sm font-medium transition-colors"
              >
                <Briefcase className="h-4 w-4 text-amber-600" />
                {lang === "ar" ? "دخول الموظفين (بوابة الموظف)" : "Staff Login (Staff Portal)"}
                <ChevronRight className="h-3.5 w-3.5 opacity-50 rtl:rotate-180" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
