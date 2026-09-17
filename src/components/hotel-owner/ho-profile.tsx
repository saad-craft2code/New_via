"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/widgets";
import { userService } from "@/services/user.service";
import {
  ShieldCheck, Camera, Building2, User, Mail, Phone, Save, Loader2, AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";

const KYC_STATUS_MAP = {
  not_submitted: { key: "kyc_status_not_submitted", color: "bg-muted text-muted-foreground" },
  pending: { key: "kyc_status_pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  approved: { key: "kyc_status_approved", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  rejected: { key: "kyc_status_rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
} as const;

export function HOProfile() {
  const lang = useAppStore((s) => s.lang);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const setHoView = useAppStore((s) => s.setHoView);
  const role = useAppStore((s) => s.role);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [companyName, setCompanyName] = useState(user?.companyName ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setCompanyName(user?.companyName ?? "");
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile({ name, phone, companyName });
      setUser(updated as any);
      toast.success(t("save_changes", lang));
      setEditing(false);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const kycStatus = (user?.kycStatus ?? "not_submitted") as keyof typeof KYC_STATUS_MAP;
  const kycInfo = KYC_STATUS_MAP[kycStatus];

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_profile", lang)}
        actions={
          <Button
            variant={editing ? "default" : "outline"}
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className={editing ? "bg-primary text-primary-foreground gap-2" : "gap-2"}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
              <div className="h-24 w-24 rounded-2xl border-4 border-background bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {(user?.name ?? "?").charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-1 end-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{user?.name ?? "—"}</h2>
                <button
                  onClick={() => setHoView("kyc")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${kycInfo.color}`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {t(kycInfo.key, lang)}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {role === "hotel_owner"
                  ? lang === "ar" ? "مالك فندق" : "Hotel Owner"
                  : lang === "ar" ? "منشئ باقات" : "Bundle Creator"}
              </p>
              {user?.createdAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "ar" ? "عضو منذ" : "Member since"}{" "}
                  {new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("personal_info", lang)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing || saving}
                  className="ps-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email", lang)}</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email ?? ""}
                  disabled
                  className="ps-9 text-muted-foreground"
                />
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone", lang)}</Label>
              <div className="relative">
                <Phone className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing || saving}
                  className="ps-9"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="companyName">{t("business_name", lang)}</Label>
              <div className="relative">
                <Building2 className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!editing || saving}
                  className="ps-9"
                />
              </div>
            </div>
          </div>
          {!user && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {lang === "ar"
                ? "تعذّر تحميل بيانات المستخدم — حاول تسجيل الدخول مرة أخرى."
                : "Could not load user data — try signing in again."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
