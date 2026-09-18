"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard, StatusBadge, PageHeader, formatCurrency } from "@/components/widgets";
import { bookingService, adaptBooking, type UIBooking } from "@/services/booking.service";
import { operationsService, type OperationsDashboard as OpsData } from "@/services/operations.service";
import { useApi } from "@/hooks/use-api";
import { Download, Banknote, Calendar, TrendingUp, Wallet, FileText, CreditCard, Plus, BarChart3, AlertCircle } from "lucide-react";

export function HOEarnings() {
  const lang = useAppStore((s) => s.lang);
  const { data: bookings, loading } = useApi<UIBooking[]>(() => bookingService.list().then((r) => r.map(adaptBooking)), []);
  const { data: ops } = useApi<OpsData>(() => operationsService.dashboard(), []);

  const allBookings = bookings ?? [];
  const totalEarnings = allBookings.reduce((s, b) => s + b.netEarnings, 0);
  const pendingPayout = allBookings.filter((b) => b.paymentStatus === "Pending").reduce((s, b) => s + b.netEarnings, 0);
  const thisMonth = allBookings.filter((b) => b.bookingDate.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, b) => s + b.netEarnings, 0);
  const clearedEarnings = allBookings.filter((b) => b.paymentStatus === "Paid").reduce((s, b) => s + b.netEarnings, 0);

  const k = ops?.kpi;

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title={t("nav_earnings", lang)} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_earnings", lang)}
        subtitle={lang === "ar" ? "إيرادات الفندق ومدفوعاتك" : "Hotel revenue and payouts"}
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("download_statement", lang)}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label={`${t("total_earnings", lang)} · ${t("lifetime", lang)}`} value={formatCurrency(totalEarnings, lang)} color="primary" delay={0} />
        <StatCard icon={TrendingUp} label={t("this_month", lang)} value={formatCurrency(thisMonth, lang)} color="accent" delay={0.05} />
        <StatCard icon={Calendar} label={t("pending_payout", lang)} value={formatCurrency(pendingPayout, lang)} color="clay" delay={0.1} />
        <StatCard icon={Banknote} label={lang === "ar" ? "مدفوعات مكتملة" : "Cleared Earnings"} value={formatCurrency(clearedEarnings, lang)} color="sand" delay={0.15} />
      </div>

      {/* KPIs from live operations API */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/70">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground leading-relaxed" dir="auto">{lang === "ar" ? "متوسط السعر اليومي (ADR)" : "Avg Daily Rate (ADR)"}</span>
            </div>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(k?.adr ?? 0, lang)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground leading-relaxed" dir="auto">{lang === "ar" ? "الإيراد لكل غرفة (RevPAR)" : "RevPAR"}</span>
            </div>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(k?.revpar ?? 0, lang)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground leading-relaxed" dir="auto">{lang === "ar" ? "نسبة الإشغال" : "Occupancy Rate"}</span>
            </div>
            <p className="text-xl font-bold tabular-nums">{k?.occupancyRate ?? 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-muted-foreground leading-relaxed" dir="auto">{lang === "ar" ? "قيمة المخزون" : "Inventory Value"}</span>
            </div>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(k?.inventoryValue ?? 0, lang)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
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
                  {allBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                        {lang === "ar" ? "لا معاملات" : "No transactions"}
                      </td>
                    </tr>
                  ) : (
                    allBookings.map((tr) => (
                      <tr key={tr.id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="p-3 text-sm font-mono">{tr.id}</td>
                        <td className="p-3 text-sm hidden sm:table-cell">{tr.bookingDate}</td>
                        <td className="p-3 text-sm hidden md:table-cell leading-snug break-words" dir="auto">{tr.guestName}</td>
                        <td className="p-3 text-sm font-semibold text-emerald-600 tabular-nums">{formatCurrency(tr.netEarnings, lang)}</td>
                        <td className="p-3"><StatusBadge status={tr.paymentStatus} lang={lang} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
                <div className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{t("bank_account", lang)}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">•••• 8932 · SNB</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium flex-shrink-0">
                  {lang === "ar" ? "افتراضي" : "Default"}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "ar" ? "الحد الأدنى للدفع" : "Minimum payout"}</span>
                  <span className="font-medium tabular-nums">{formatCurrency(500, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "ar" ? "جدول الدفع" : "Payout schedule"}</span>
                  <span className="font-medium">{lang === "ar" ? "أسبوعي" : "Weekly"}</span>
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
