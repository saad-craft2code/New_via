"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/widgets";
import { Globe, Moon, DollarSign, Clock, Lock, ShieldCheck, Key, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function BCSettings() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLang = useAppStore((s) => s.setLang);

  const [twoFA, setTwoFA] = useState(false);
  const [currency, setCurrency] = useState("SAR");
  const [timezone, setTimezone] = useState("Asia/Riyadh");

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_settings", lang)}
        subtitle={lang === "ar" ? "إدارة تفضيلات حسابك" : "Manage your account preferences"}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Language & appearance */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {lang === "ar" ? "اللغة والمظهر" : "Language & Appearance"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="mb-1.5 block">{t("language_preference", lang)}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang("ar")}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${lang === "ar" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${lang === "en" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                >
                  English
                </button>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">{lang === "ar" ? "المظهر" : "Appearance"}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                >
                  {lang === "ar" ? "فاتح" : "Light"}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  {lang === "ar" ? "داكن" : "Dark"}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("currency_preference", lang)}</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="SAR">SAR — {lang === "ar" ? "ريال سعودي" : "Saudi Riyal"}</option>
                <option value="AED">AED — {lang === "ar" ? "درهم إماراتي" : "UAE Dirham"}</option>
                <option value="USD">USD — {lang === "ar" ? "دولار أمريكي" : "US Dollar"}</option>
                <option value="EUR">EUR — {lang === "ar" ? "يورو" : "Euro"}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("timezone", lang)}</Label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Asia/Beirut">Asia/Beirut (GMT+3)</option>
                <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {lang === "ar" ? "الأمان" : "Security"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>{t("current_password", lang)}</Label>
              <Input type="password" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("new_password", lang)}</Label>
              <Input type="password" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("confirm_password", lang)}</Label>
              <Input type="password" dir="ltr" />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              {t("change_password", lang)}
            </Button>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("two_factor_auth", lang)}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "أضف طبقة حماية إضافية" : "Add an extra layer of security"}</p>
                </div>
              </div>
              <Switch checked={twoFA} onCheckedChange={setTwoFA} />
            </div>
          </CardContent>
        </Card>

        {/* API access */}
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              {t("api_access_keys", lang)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "استخدم مفاتيح API لربط أنظمة إدارة القنوات الخارجية"
                : "Use API keys to connect external channel manager systems"}
            </p>
            <div className="space-y-1.5">
              <Label>{lang === "ar" ? "مفتاح API" : "API Key"}</Label>
              <div className="flex gap-2">
                <Input type="text" dir="ltr" defaultValue="wh_live_•••••••••••••••" readOnly />
                <Button variant="outline" size="sm">{lang === "ar" ? "نسخ" : "Copy"}</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Key className="h-3.5 w-3.5" />
              {lang === "ar" ? "توليد مفتاح جديد" : "Generate new key"}
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {lang === "ar" ? "منطقة الخطر" : "Danger Zone"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
              <div>
                <p className="text-sm font-medium">{t("delete_account", lang)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("delete_account_warning", lang)}</p>
              </div>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                {lang === "ar" ? "حذف" : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
