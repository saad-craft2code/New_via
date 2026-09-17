"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatCard, EmptyState, formatCurrency } from "@/components/widgets";
import { staffService, type SalaryPayment } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { Wallet, Loader2, AlertCircle, Check, Clock, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export function SalariesManagement() {
  const lang = useAppStore((s) => s.lang);
  const [acting, setActing] = useState<string | null>(null);

  const { data: salaries, loading, error, refetch } = useApi<SalaryPayment[]>(
    () => staffService.listSalaries(),
    [],
  );
  const allSalaries = salaries ?? [];

  const totalPaid = allSalaries.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.net, 0);
  const totalPending = allSalaries.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.net, 0);
  const totalBonus = allSalaries.reduce((sum, s) => sum + s.bonus, 0);

  const markPaid = async (id: string) => {
    setActing(id);
    try {
      await staffService.updateSalary(id, { status: "paid" });
      toast.success(lang === "ar" ? "تم التعليم كمدفوع" : "Marked as paid");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("ops_salaries_title", lang)} subtitle={t("ops_salaries_subtitle", lang)} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label={lang === "ar" ? "إجمالي المدفوع" : "Total Paid"} value={formatCurrency(totalPaid, lang)} color="accent" delay={0} />
        <StatCard icon={Clock} label={lang === "ar" ? "المعلّق" : "Pending"} value={formatCurrency(totalPending, lang)} color="clay" delay={0.05} />
        <StatCard icon={Wallet} label={lang === "ar" ? "إجمالي المكافآت" : "Total Bonuses"} value={formatCurrency(totalBonus, lang)} color="sand" delay={0.1} />
      </div>

      {loading ? (
        [1, 2, 3, 4].map((i) => (
          <Card key={i} className="mb-3">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))
      ) : error ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
          </CardContent>
        </Card>
      ) : allSalaries.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={Wallet} title={lang === "ar" ? "لا توجد مدفوعات" : "No salary payments"} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="text-start font-medium p-3">{lang === "ar" ? "الموظف" : "Staff"}</th>
                    <th className="text-start font-medium p-3">{t("ops_period", lang)}</th>
                    <th className="text-end font-medium p-3">{t("ops_base_salary", lang)}</th>
                    <th className="text-end font-medium p-3">{t("ops_bonus", lang)}</th>
                    <th className="text-end font-medium p-3">{t("ops_deductions", lang)}</th>
                    <th className="text-end font-medium p-3">{t("ops_net_pay", lang)}</th>
                    <th className="text-center font-medium p-3">{t("ops_pay_status", lang)}</th>
                    <th className="text-center font-medium p-3">{t("actions", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {allSalaries.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className="border-b border-border/40 hover:bg-muted/30"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {s.staff?.avatarUrl ? (
                              <img src={s.staff.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white text-xs font-bold">
                                {s.staff?.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{lang === "ar" ? s.staff?.nameAr ?? s.staff?.name : s.staff?.name}</p>
                              <p className="text-xs text-muted-foreground">{s.staff ? t(`ops_${s.staff.department}` as any, lang) : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{s.period}</td>
                        <td className="p-3 text-end tabular-nums">{formatCurrency(s.amount, lang)}</td>
                        <td className="p-3 text-end tabular-nums text-emerald-600">+{formatCurrency(s.bonus, lang)}</td>
                        <td className="p-3 text-end tabular-nums text-destructive">−{formatCurrency(s.deductions, lang)}</td>
                        <td className="p-3 text-end tabular-nums font-bold">{formatCurrency(s.net, lang)}</td>
                        <td className="p-3 text-center">
                          <Badge className={cn(
                            "text-[10px]",
                            s.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                            s.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          )}>
                            {s.status === "paid" ? (lang === "ar" ? "مدفوع" : "Paid") : s.status === "pending" ? (lang === "ar" ? "معلّق" : "Pending") : (lang === "ar" ? "ملغى" : "Cancelled")}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {s.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              disabled={acting === s.id}
                              onClick={() => markPaid(s.id)}
                            >
                              {acting === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                              {t("ops_mark_paid", lang)}
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
