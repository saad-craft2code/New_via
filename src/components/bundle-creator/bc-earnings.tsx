"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatusBadge, AreaChart, PageHeader, formatCurrency } from "@/components/widgets";
import { mockTransactions, revenueData } from "@/lib/mock-data";
import { Download, Banknote, Calendar, TrendingUp, Wallet, FileText, CreditCard, Plus } from "lucide-react";

export function BCEarnings() {
  const lang = useAppStore((s) => s.lang);
  const totalEarnings = mockTransactions.reduce((s, tr) => s + tr.netEarnings, 0);
  const pendingPayout = mockTransactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.netEarnings, 0);
  const clearedEarnings = mockTransactions.filter(t => t.status === "Cleared").reduce((s, t) => s + t.netEarnings, 0);
  const thisMonth = mockTransactions.filter(t => t.date.startsWith("2026-07")).reduce((s, t) => s + t.netEarnings, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_earnings", lang)}
        subtitle={lang === "ar" ? "تتبع أرباحك ومدفوعاتك" : "Track your earnings and payouts"}
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("download_statement", lang)}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label={`${t("total_earnings", lang)} · ${t("lifetime", lang)}`} value={formatCurrency(totalEarnings, lang)} color="primary" trend="+12%" trendUp delay={0} />
        <StatCard icon={TrendingUp} label={t("this_month", lang)} value={formatCurrency(thisMonth, lang)} color="accent" trend="+18%" trendUp delay={0.05} />
        <StatCard icon={Calendar} label={t("pending_payout", lang)} value={formatCurrency(pendingPayout, lang)} color="clay" delay={0.1} />
        <StatCard icon={Banknote} label={t("next_payout", lang)} value="Aug 5, 2026" color="sand" delay={0.15} />
      </div>

      {/* Chart */}
      <Card className="border-border/70">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">{lang === "ar" ? "اتجاه الأرباح" : "Earnings Trend"}</CardTitle>
          <span className="text-xs text-muted-foreground">{lang === "ar" ? "آخر 8 أشهر" : "Last 8 months"}</span>
        </CardHeader>
        <CardContent>
          <AreaChart data={revenueData.map((d) => ({ label: d.month, value: (d as any).netEarnings ?? d.revenue * 0.9 }))} height={240} color="oklch(0.55 0.13 30)" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Transactions */}
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("transaction_history", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="text-start font-medium p-3">{t("transaction_id", lang)}</th>
                    <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "التاريخ" : "Date"}</th>
                    <th className="text-start font-medium p-3 hidden md:table-cell">{t("guest_name", lang)}</th>
                    <th className="text-start font-medium p-3">{t("net_earnings", lang)}</th>
                    <th className="text-start font-medium p-3">{t("status", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tr) => (
                    <tr key={tr.id} className="border-b border-border/40 hover:bg-muted/30">
                      <td className="p-3 text-sm font-mono">{tr.id}</td>
                      <td className="p-3 text-sm hidden sm:table-cell">{tr.date}</td>
                      <td className="p-3 text-sm hidden md:table-cell">{tr.guestName}</td>
                      <td className="p-3 text-sm font-semibold text-[oklch(0.4_0.15_145)]">{formatCurrency(tr.netEarnings, lang)}</td>
                      <td className="p-3"><StatusBadge status={tr.status} lang={lang} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payout methods */}
        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{t("payout_methods", lang)}</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                <Plus className="h-3.5 w-3.5" />
                {lang === "ar" ? "إضافة" : "Add"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                <div className="h-9 w-9 rounded-md bg-gradient-to-br from-[oklch(0.55_0.12_175)] to-[oklch(0.42_0.08_175)] flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t("bank_account", lang)}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">•••• 4567 · Al Rajhi Bank</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)] font-medium">
                  {lang === "ar" ? "افتراضي" : "Default"}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "ar" ? "الحد الأدنى للدفع" : "Minimum payout"}</span>
                  <span className="font-medium">{formatCurrency(500, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "ar" ? "جدول الدفع" : "Payout schedule"}</span>
                  <span className="font-medium">{lang === "ar" ? "شهريًا" : "Monthly"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("invoice_generation", lang)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <FileText className="h-3.5 w-3.5" />
                {lang === "ar" ? "تنزيل فواتير هذا الشهر" : "Download this month's invoices"}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Download className="h-3.5 w-3.5" />
                {lang === "ar" ? "تنزيل كشف سنوي" : "Download annual statement"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
