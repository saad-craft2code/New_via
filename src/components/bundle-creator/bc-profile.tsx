"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, StatusBadge } from "@/components/widgets";
import { mockProviderProfile } from "@/lib/mock-data";
import { ShieldCheck, FileText, UploadCloud, Camera, Building2, User, Mail, Phone, BadgeCheck, Globe, Briefcase, Save, Plus } from "lucide-react";
import { useState } from "react";

export function BCProfile() {
  const lang = useAppStore((s) => s.lang);
  const profile = mockProviderProfile.bundle_creator;
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_profile", lang)}
        actions={
          <Button
            variant={editing ? "default" : "outline"}
            onClick={() => setEditing(!editing)}
            className={editing ? "bg-primary text-primary-foreground gap-2" : "gap-2"}
          >
            <Save className="h-4 w-4" />
            {editing ? t("save_changes", lang) : (lang === "ar" ? "تعديل" : "Edit")}
          </Button>
        }
      />

      {/* Profile header */}
      <Card className="border-border/70 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-[oklch(0.55_0.12_175)] via-[oklch(0.45_0.1_175)] to-[oklch(0.55_0.13_30)] relative">
          <div className="absolute inset-0 oasis-mesh opacity-30" />
        </div>
        <CardContent className="p-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <img src={profile.avatar} alt="" className="h-24 w-24 rounded-2xl border-4 border-background object-cover" />
              <button className="absolute bottom-1 end-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{lang === "ar" ? profile.fullNameAr : profile.fullNameEn}</h2>
                <StatusBadge status="Verified" lang={lang} />
              </div>
              <p className="text-sm text-muted-foreground">{profile.businessNameEn}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.5_0.15_145)]" />
                {lang === "ar" ? "حساب موثّق منذ 2021" : "Verified account since 2021"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Personal info */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t("personal_info", lang)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("full_name_ar", lang)}</Label>
                <Input defaultValue={profile.fullNameAr} dir="rtl" disabled={!editing} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("full_name_en", lang)}</Label>
                <Input defaultValue={profile.fullNameEn} dir="ltr" disabled={!editing} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("email", lang)}</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={profile.email} dir="ltr" disabled={!editing} className="ps-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("phone", lang)}</Label>
              <div className="relative">
                <Phone className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={profile.phone} dir="ltr" disabled={!editing} className="ps-9" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("years_experience", lang)}</Label>
                <Input defaultValue={profile.yearsExperience} type="number" dir="ltr" disabled={!editing} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("languages_spoken", lang)}</Label>
                <Input defaultValue={profile.languages.join(", ")} dir="ltr" disabled={!editing} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business info */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              {t("business_info", lang)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{lang === "ar" ? "اسم النشاط (عربي)" : "Business Name (Arabic)"}</Label>
                <Input defaultValue={profile.businessNameAr} dir="rtl" disabled={!editing} />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === "ar" ? "اسم النشاط (إنجليزي)" : "Business Name (English)"}</Label>
                <Input defaultValue={profile.businessNameEn} dir="ltr" disabled={!editing} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{lang === "ar" ? "وصف النشاط" : "Business Description"}</Label>
              <Textarea defaultValue={profile.businessDesc} rows={3} disabled={!editing} dir={lang === "ar" ? "rtl" : "ltr"} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("business_license", lang)}</Label>
                <div className="relative">
                  <BadgeCheck className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={profile.licenseNumber} dir="ltr" disabled={!editing} className="ps-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{lang === "ar" ? "السجل الضريبي" : "Tax ID"}</Label>
                <Input defaultValue={profile.taxId} dir="ltr" disabled={!editing} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card className="border-border/70">
        <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {t("documents", lang)}
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {t("upload_new_document", lang)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { nameAr: "الهوية الحكومية", nameEn: "Government ID", status: "verified" },
              { nameAr: "رخصة المرشد السياحي", nameEn: "Tour Guide License", status: "verified" },
              { nameAr: "الصورة الشخصية", nameEn: "Profile Photo", status: "verified" },
              { nameAr: "السجل التجاري", nameEn: "Business Registration", status: "verified" },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                <div className="h-9 w-9 rounded-md bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)] flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lang === "ar" ? d.nameAr : d.nameEn}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3 w-3 text-[oklch(0.5_0.15_145)]" />
                    <span className="text-[10px] text-[oklch(0.5_0.15_145)] font-medium">{t("verified", lang)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
