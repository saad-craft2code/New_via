"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/provider/brand-logo";
import {
  Globe, Moon, Sun, ChevronLeft, ChevronRight, Mail, Phone,
  Building2, User, Lock, BadgeCheck, Loader2, AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import toast from "react-hot-toast";

interface FormState {
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  businessLicense: string;
  tourGuideLicense: string;
  yearsExperience: string;
  languages: string;
  hotelName: string;
  propertyType: string;
  numberOfRooms: string;
}

const initialForm: FormState = {
  fullNameAr: "",
  fullNameEn: "",
  email: "",
  phone: "",
  password: "",
  businessName: "",
  businessLicense: "",
  tourGuideLicense: "",
  yearsExperience: "",
  languages: "",
  hotelName: "",
  propertyType: "Hotel",
  numberOfRooms: "",
};

export function RegisterForm() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const role = useAppStore((s) => s.role);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const register = useAppStore((s) => s.register);
  const isAuthLoading = useAppStore((s) => s.isAuthLoading);
  const authError = useAppStore((s) => s.authError);
  const mounted = useMounted();
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;
  const isHotel = role === "hotel_owner";

  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const markTouched = (k: keyof FormState) => setTouched((p) => ({ ...p, [k]: true }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = form.password.length >= 6;
  const nameValid = form.fullNameEn.trim().length >= 2;
  const businessNameValid = form.businessName.trim().length >= 2;
  const canSubmit =
    emailValid && passwordValid && nameValid && businessNameValid && !isAuthLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      email: true, password: true, fullNameEn: true, businessName: true,
    });
    if (!canSubmit) return;
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.fullNameEn || form.fullNameAr,
        role: isHotel ? "hotel_owner" : "bundle_creator",
        phone: form.phone || undefined,
        companyName: form.businessName || undefined,
        businessLicense: form.businessLicense || undefined,
        tourGuideLicense: form.tourGuideLicense || undefined,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        languagesSpoken: form.languages
          ? form.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : undefined,
      });
      toast.success(lang === "ar" ? "تم إنشاء الحساب" : "Account created");
      // After registration, send to verification (KYC) step.
      setAuthScreen("verification");
    } catch {
      toast.error(authError ?? (lang === "ar" ? "فشل إنشاء الحساب" : "Registration failed"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 oasis-mesh pointer-events-none" />
      <header className="relative z-10 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-xs">{t("language_toggle", lang)}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setAuthScreen("role_selection")}
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
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isHotel ? "bg-[oklch(0.55_0.12_175)]/10 text-[oklch(0.42_0.08_175)]" : "bg-[oklch(0.65_0.15_50)]/15 text-[oklch(0.5_0.12_40)]"
                  }`}>
                    {isHotel ? t("i_am_hotel_owner", lang) : t("i_am_bundle_creator", lang)}
                  </span>
                </div>
                <CardTitle className="text-2xl">{t("register_title", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullNameAr">{t("full_name_ar", lang)}</Label>
                      <div className="relative">
                        <User className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullNameAr"
                          value={form.fullNameAr}
                          onChange={(e) => set("fullNameAr", e.target.value)}
                          className="ps-9"
                          placeholder={lang === "ar" ? "أحمد عبدالله" : "Ahmed Abdullah"}
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullNameEn">{t("full_name_en", lang)} *</Label>
                      <div className="relative">
                        <User className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullNameEn"
                          value={form.fullNameEn}
                          onChange={(e) => set("fullNameEn", e.target.value)}
                          onBlur={() => markTouched("fullNameEn")}
                          className="ps-9"
                          placeholder="Ahmed Abdullah"
                          dir="ltr"
                          required
                        />
                      </div>
                      {touched.fullNameEn && !nameValid && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {lang === "ar" ? "الاسم مطلوب" : "Name is required"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">{t("email", lang)} *</Label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          onBlur={() => markTouched("email")}
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
                      <Label htmlFor="phone">{t("phone", lang)}</Label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          className="ps-9"
                          placeholder="+966 50 123 4567"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">{t("password", lang)} *</Label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        onBlur={() => markTouched("password")}
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessName">{t("business_name", lang)} *</Label>
                      <div className="relative">
                        <Building2 className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessName"
                          value={form.businessName}
                          onChange={(e) => set("businessName", e.target.value)}
                          onBlur={() => markTouched("businessName")}
                          className="ps-9"
                          required
                        />
                      </div>
                      {touched.businessName && !businessNameValid && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {lang === "ar" ? "اسم النشاط مطلوب" : "Business name is required"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="businessLicense">{t("business_license", lang)}</Label>
                      <div className="relative">
                        <BadgeCheck className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessLicense"
                          value={form.businessLicense}
                          onChange={(e) => set("businessLicense", e.target.value)}
                          className="ps-9"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role-specific extras (informational only — not validated) */}
                  {isHotel ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {lang === "ar" ? "بيانات الفندق" : "Hotel Details"}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="hotelName">{t("hotel_name", lang)}</Label>
                          <Input
                            id="hotelName"
                            value={form.hotelName}
                            onChange={(e) => set("hotelName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="propertyType">{t("property_type", lang)}</Label>
                          <select
                            id="propertyType"
                            value={form.propertyType}
                            onChange={(e) => set("propertyType", e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option>Hotel</option>
                            <option>Resort</option>
                            <option>Boutique Hotel</option>
                            <option>ApartHotel</option>
                            <option>Villa</option>
                            <option>Motel</option>
                            <option>Lodge</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="numberOfRooms">{t("number_of_rooms", lang)}</Label>
                        <Input
                          id="numberOfRooms"
                          type="number"
                          value={form.numberOfRooms}
                          onChange={(e) => set("numberOfRooms", e.target.value)}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {lang === "ar" ? "بيانات منشئ الباقات" : "Bundle Creator Details"}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="tourGuideLicense">{t("tour_guide_license", lang)}</Label>
                          <Input
                            id="tourGuideLicense"
                            value={form.tourGuideLicense}
                            onChange={(e) => set("tourGuideLicense", e.target.value)}
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="yearsExperience">{t("years_experience", lang)}</Label>
                          <Input
                            id="yearsExperience"
                            type="number"
                            value={form.yearsExperience}
                            onChange={(e) => set("yearsExperience", e.target.value)}
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="languages">{t("languages_spoken", lang)}</Label>
                        <Input
                          id="languages"
                          value={form.languages}
                          onChange={(e) => set("languages", e.target.value)}
                          placeholder="Arabic, English, French"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}

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
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-2"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("loading", lang)}
                      </>
                    ) : (
                      t("create_account", lang)
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    {lang === "ar"
                      ? "بإنشاء حساب، أنت توافق على شروط الخدمة وسياسة الخصوصية"
                      : "By creating an account, you agree to the Terms of Service and Privacy Policy"}
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
