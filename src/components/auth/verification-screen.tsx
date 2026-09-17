"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandLogo } from "@/components/provider/brand-logo";
import { Globe, Moon, Sun, ChevronLeft, ChevronRight, UploadCloud, Check, FileText, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

interface Doc {
  key: string;
  labelKey: any;
  uploaded: boolean;
  fileName?: string;
}

export function VerificationScreen() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const role = useAppStore((s) => s.role);
  const setAuthed = useAppStore((s) => s.setAuthed);
  const mounted = useMounted();
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;
  const Forward = isRtl ? ArrowLeft : ArrowRight;

  const isHotel = role === "hotel_owner";
  const initialDocs: Doc[] = isHotel
    ? [
        { key: "business_license", labelKey: "business_license", uploaded: false },
        { key: "property_ownership", labelKey: "property_ownership", uploaded: false },
        { key: "hotel_license", labelKey: "hotel_license", uploaded: false },
        { key: "tax_registration", labelKey: "tax_registration", uploaded: false },
        { key: "owner_id", labelKey: "owner_id", uploaded: false },
        { key: "fire_safety", labelKey: "fire_safety", uploaded: false },
        { key: "health_inspection", labelKey: "health_inspection", uploaded: false },
        { key: "insurance_docs", labelKey: "insurance_docs", uploaded: false },
      ]
    : [
        { key: "government_id", labelKey: "government_id", uploaded: false },
        { key: "tour_guide_license", labelKey: "tour_guide_license", uploaded: false },
        { key: "profile_photo", labelKey: "profile_photo", uploaded: false },
        { key: "business_registration", labelKey: "business_registration", uploaded: false },
      ];

  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const uploadedCount = docs.filter((d) => d.uploaded).length;
  const allUploaded = uploadedCount === docs.length;
  const progress = (uploadedCount / docs.length) * 100;

  const toggle = (key: string) => {
    setDocs((p) =>
      p.map((d) =>
        d.key === key
          ? d.uploaded
            ? { ...d, uploaded: false, fileName: undefined }
            : { ...d, uploaded: true, fileName: `${d.key}_document.pdf` }
          : d
      )
    );
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

      <main className="flex-1 flex items-start justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">{t("verification_title", lang)}</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">{t("verification_desc", lang)}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Progress */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {lang === "ar" ? "تقدم الرفع" : "Upload Progress"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {uploadedCount} / {docs.length}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-gradient-to-r from-[oklch(0.55_0.12_175)] to-[oklch(0.55_0.13_30)] rounded-full"
                    />
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-3 rounded-lg border border-[oklch(0.55_0.12_175)]/30 bg-[oklch(0.55_0.12_175)]/5 p-3">
                  <Info className="h-5 w-5 text-[oklch(0.42_0.08_175)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar"
                      ? "تستغرق المراجعة 2-3 أيام عمل. سيتم إشعارك عبر البريد الإلكتروني والهاتف عند التوثيق."
                      : "Review takes 2-3 business days. You'll be notified via email and phone once verified."}
                  </p>
                </div>

                {/* Documents */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {docs.map((d, i) => {
                    const label = t(d.labelKey, lang);
                    return (
                      <motion.button
                        key={d.key}
                        initial={mounted ? { opacity: 0, y: 20 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * i }}
                        onClick={() => toggle(d.key)}
                        className={`flex items-center gap-3 rounded-lg border p-3.5 text-start transition-all ${
                          d.uploaded
                            ? "border-[oklch(0.55_0.12_175)]/40 bg-[oklch(0.55_0.12_175)]/5"
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            d.uploaded
                              ? "bg-[oklch(0.55_0.12_175)] text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {d.uploaded ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {d.uploaded
                              ? d.fileName
                              : lang === "ar"
                                ? "اضغط للرفع"
                                : "Click to upload"}
                          </p>
                        </div>
                        {!d.uploaded && (
                          <UploadCloud className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Verification tracker */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {lang === "ar" ? "حالة التوثيق" : "Verification Status"}
                  </p>
                  <div className="flex items-center gap-1">
                    {[
                      { label: t("submitted", lang), done: uploadedCount > 0 },
                      { label: t("under_review", lang), done: allUploaded },
                      { label: t("verified", lang), done: false },
                    ].map((step, i, arr) => (
                      <div key={i} className="flex-1 flex items-center gap-1">
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.done
                                ? "bg-[oklch(0.55_0.12_175)] text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <span className="text-[10px] text-center text-muted-foreground">{step.label}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`h-0.5 flex-1 -mt-5 ${step.done ? "bg-[oklch(0.55_0.12_175)]" : "bg-muted"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setAuthed(true)}
                    className="w-full sm:w-auto"
                  >
                    {t("skip_for_demo", lang)}
                  </Button>
                  <Button
                    disabled={!allUploaded}
                    onClick={() => setAuthed(true)}
                    className="flex-1 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-11 gap-2"
                  >
                    {t("submit_for_verification", lang)}
                    <Forward className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
